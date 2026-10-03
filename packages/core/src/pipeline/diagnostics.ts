import {
  CHECKS,
  CONDITIONS,
  COUNTRY_ISO3,
  COUNTRY_NAMES,
  DIMENSIONS,
  INDICATORS,
  INDICATORS_BY_ID,
  indicatorsFor,
  isEvidential,
  isPanel,
  isCondition,
  isDeclaredGap,
  isScored,
} from '../model/index.js'
import type {
  CountryResult,
  DelphiApplication,
  DelphiRunFile,
  Dimension,
  FactorSolution,
  FactorStructure,
  MeasurementClass,
  Observation,
  Provenance,
  ResidualStructure,
} from '../model/index.js'
import {
  correlationMatrix,
  firstFactorChance,
  iqr,
  mean,
  pearson,
  round,
  spearman,
  symmetricEigen,
} from './stats.js'
import {
  buildFrames,
  conditionValues,
  scoreAll,
  type Matrix,
  type ScoreOptions,
} from './score.js'
import { buildHistory, normalizedAt } from './trend.js'
import { residualStructureFor } from './residual-structure.js'
import type { Frame } from './normalize.js'

export const CONTEXT_PREFIX = '__context__'
export const DENOMINATOR_PREFIX = '__denominator__'

/** Correlation above this marks an indicator as tracking income rather than capability. */
export const WEALTH_CORRELATION_THRESHOLD = 0.7
/** Correlation above this marks two indicators as carrying the same information. */
export const REDUNDANCY_THRESHOLD = 0.85
/** Correlation above this marks two dimensions as candidates for having collapsed into one. */
export const DIMENSION_OVERLAP_THRESHOLD = 0.9
/** The family an indicator falls into when its registry row declares none. */
export const UNASSIGNED_FAMILY = 'unassigned'

/**
 * Below this many complete cases the factor test is also run on the
 * dimensions with near-full coverage. Thirty is where a correlation between
 * two scores stops swinging by more than about 0.35 on sampling noise alone.
 * See D137.
 */
export const FACTOR_MIN_COUNTRIES = 30
/** A dimension scored for at least this share of countries counts as near-full coverage. */
export const FACTOR_NEAR_FULL_COVERAGE = 0.9
/** Monte Carlo draws behind the chance level, and the seed that makes them repeat. */
export const FACTOR_CHANCE_DRAWS = 2000
export const FACTOR_CHANCE_SEED = 20261001
/**
 * How a first factor's correlation with income is read in a sentence. At or
 * above `strong` the shared factor looks like income; at or above `moderate`
 * income accounts for part of it. Absolute values. See D137.
 */
export const FACTOR_INCOME_BANDS = { strong: 0.8, moderate: 0.5 } as const

/** How far back the discrimination test reaches, in years. */
export const DISCRIMINATION_SPAN = 20
/** A reading counts for a year while it is no older than this, matching the momentum rule. */
export const DISCRIMINATION_MAX_AGE = 5
/** Below this many countries in the balanced panel, no spread is reported. */
export const DISCRIMINATION_MIN_COUNTRIES = 10
/** Below this many filled years, no trend is reported. */
export const DISCRIMINATION_MIN_YEARS = 8
/** Rank correlation of spread against year at or below this counts as falling. */
export const DISCRIMINATION_FADE_SPEARMAN = -0.5
/** Relative change in spread at or below this counts as falling. */
export const DISCRIMINATION_FADE_SHARE = -0.25
/** Interquartile spread in points below which an indicator barely separates countries. */
export const DISCRIMINATION_FLOOR = 10

/** The latest year of a context series per country, as published. */
export function latestContextByCountry(
  observations: Observation[],
  series: string,
): Map<string, { value: number; year: number }> {
  /* The observation file carries every year, so pick the latest one per country
   * rather than the first row encountered. */
  const latest = new Map<string, { value: number; year: number }>()
  for (const o of observations) {
    if (o.indicatorId !== `${CONTEXT_PREFIX}${series}`) continue
    const cur = latest.get(o.iso3)
    if (!cur || o.year > cur.year) latest.set(o.iso3, { value: o.value, year: o.year })
  }
  return latest
}

export function logGdpByCountry(observations: Observation[], series: string): Map<string, number> {
  const latest = latestContextByCountry(observations, series)
  const out = new Map<string, number>()
  for (const [iso3, v] of latest) out.set(iso3, Math.log10(v.value))
  return out
}

function alignedPair(
  values: Map<string, number>,
  other: Map<string, number>,
): { xs: number[]; ys: number[] } {
  const xs: number[] = []
  const ys: number[] = []
  for (const iso3 of COUNTRY_ISO3) {
    const a = values.get(iso3)
    const b = other.get(iso3)
    if (a === undefined || b === undefined) continue
    xs.push(a)
    ys.push(b)
  }
  return { xs, ys }
}

function dimensionSeries(countries: CountryResult[], dimension: Dimension): Map<string, number> {
  const out = new Map<string, number>()
  for (const c of countries) {
    const s = c.dimensions[dimension]?.score
    if (s !== null && s !== undefined) out.set(c.iso3, s)
  }
  return out
}

/** The panel's median estimate per country, the column the viewer publishes. */
function panelSeries(countries: CountryResult[], dimension: Dimension): Map<string, number> {
  const out = new Map<string, number>()
  for (const c of countries) {
    const s = c.dimensions[dimension]?.delphiScore
    if (s !== null && s !== undefined) out.set(c.iso3, s)
  }
  return out
}

function restrictTo(values: Map<string, number>, keys: Iterable<string>): Map<string, number> {
  const allow = new Set(keys)
  const out = new Map<string, number>()
  for (const [iso3, v] of values) if (allow.has(iso3)) out.set(iso3, v)
  return out
}

/**
 * A dimension's score series recomputed from the matrix, optionally with one
 * indicator dropped.
 *
 * It mirrors `score.ts` exactly: the plain mean of whichever normalised cells
 * exist, with missing values dropped rather than imputed. Recomputing rather
 * than reading the published score is what lets the same function answer the
 * counterfactual.
 */
function dimensionSeriesFrom(
  matrix: Matrix,
  dimension: Dimension,
  exclude?: string,
): Map<string, number> {
  const ids = indicatorsFor(dimension)
    .map((d) => d.id)
    .filter((id) => id !== exclude)
  const acc = new Map<string, { total: number; n: number }>()
  for (const id of ids) {
    for (const [iso3, cell] of matrix.get(id) ?? []) {
      const cur = acc.get(iso3) ?? { total: 0, n: 0 }
      cur.total += cell.normalized
      cur.n += 1
      acc.set(iso3, cur)
    }
  }
  const out = new Map<string, number>()
  for (const [iso3, { total, n }] of acc) if (n > 0) out.set(iso3, total / n)
  return out
}

function indicatorSeries(matrix: Matrix, indicatorId: string): Map<string, number> {
  const out = new Map<string, number>()
  for (const [iso3, cell] of matrix.get(indicatorId) ?? []) out.set(iso3, cell.normalized)
  return out
}

export type Correlation = { a: string; b: string; r: number | null; n: number }

export type Diagnostics = {
  generatedAt: string
  gdpSeries: string
  /**
   * The income each correlation here is read against: the latest year of
   * `gdpSeries` per country, as the World Bank publishes it, in iso3 order.
   * Context, never scored and never a column of any score. It is published so
   * a surface that compares a country with countries at similar income draws
   * that set from the same numbers the wealth tests read, rather than from a
   * list somebody wrote. A country the series does not cover is absent. Older
   * files written before D130 lack the field. See D130.
   */
  income?: Array<{
    iso3: string
    /** GDP per capita, PPP, constant international dollars, rounded to the dollar. */
    gdpPerCapita: number
    year: number
  }>
  dimensionVsGdp: Array<{
    dimension: Dimension
    pearson: number | null
    spearman: number | null
    n: number
  }>
  dimensionPairs: Correlation[]
  duplicateDimensionCandidates: Correlation[]
  /**
   * Whether the nine dimensions are one thing. The correlation matrix of the
   * dimension scores over the countries that have all nine, its eigenvalues,
   * the first factor's loadings and its correlation with income, and the
   * share the first factor would take by chance at the same size. If the
   * dimensions collapse into one factor that tracks GDP per head, the
   * benchmark's claim fails. See D137 and docs/WHY.md.
   */
  factorStructure: FactorStructure
  /**
   * What is left after income, tested in aggregate on the wealth residual:
   * whether the residuals move together, whether countries at the same income
   * have different shapes, whether the residual order holds still, and how
   * much of a profile income accounts for. Statistics over countries only; no
   * country's residual is in it (D65). Older files lack it. See D138.
   */
  residualStructure?: ResidualStructure
  indicatorVsGdp: Array<{
    indicatorId: string
    dimension: Dimension
    measurementClass: MeasurementClass
    r: number | null
    wealthProxyPrior: number
    flaggedAsWealthProxy: boolean
  }>
  redundantIndicatorPairs: Correlation[]
  /**
   * What each indicator does to its own dimension's wealth correlation.
   *
   * `indicatorVsGdp` asks whether one series tracks income. That is not the
   * question the benchmark's claim rests on. Indicators that each sit under the
   * threshold can still track income as a group, and an indicator under the
   * threshold can still raise its dimension's correlation when it is added.
   * This reports the dimension correlation as published and with the indicator
   * dropped, so the effect is attributable to a row. See D42.
   */
  wealthAttribution: Array<{
    indicatorId: string
    dimension: Dimension
    /** The dimension's absolute correlation with log GDP per capita, as published. */
    dimensionR: number | null
    /** The same with this indicator dropped from the dimension mean. */
    dimensionRWithout: number | null
    /** Positive means the indicator raises its dimension's wealth correlation. */
    delta: number | null
  }>
  /**
   * The panel column put through the same wealth test as the indicators.
   *
   * A panel of language models is not an independent measurement. It is a
   * compression of the same published corpus the indicators come from, so the
   * perception layer D23 retired can return through the panel wearing a new
   * name. This runs the D42 test on `delphiScore`: correlate it with log GDP
   * per capita, and put the indicator score for the same countries beside it so
   * the difference is not a difference in sample. Null when no run is loaded.
   * A non-evidential run reports its provenance and no rows: correlating mock
   * estimates would produce a number that reads as a finding. See D48.
   */
  panelVsGdp: {
    runId: string
    provenance: Provenance
    panelists: number
    /** False for a mock run. No rows are computed for one. */
    evidential: boolean
    /** False when the run has too few panelists to hold a distribution. */
    hasDistribution: boolean
    perDimension: Array<{
      dimension: Dimension
      /** Signed, to match `dimensionVsGdp`. The flag reads the absolute value. */
      panelR: number | null
      panelSpearman: number | null
      panelN: number
      /** The indicator score over the same countries the panel covers. */
      indicatorR: number | null
      indicatorN: number
      /**
       * Absolute panel correlation minus absolute indicator correlation.
       * The two columns can cover slightly different countries, because a
       * country can carry a panel estimate where its dimension publishes no
       * score. Both counts are printed for that reason.
       */
      delta: number | null
      flaggedAsWealthProxy: boolean
      /** No country publishes an indicator score here, so only the panel could fill it. */
      backfillCandidate: boolean
    }>
  } | null
  /**
   * What happened to the panel run on this dataset version: how many of its
   * cells apply, and each cell that was dropped and why. Null when no run
   * applies. Older files lack the field. See D160.
   */
  delphiApplication?: DelphiApplication | null
  measurability: Array<{
    dimension: Dimension
    indicatorsDefined: number
    indicatorsObserved: number
    gaps: number
    retired: number
    meanCoverage: number
    meanConfidence: number
    classMix: Record<MeasurementClass, number>
    /** Share of the dimension carried by perception proxies and expert judgement. */
    subjectivityShare: number
  }>
  /**
   * What a score rests on when one dimension asks two questions.
   *
   * Trust asks whether people rely on strangers and whether they rely on
   * institutions. Three survey items about the first are three readings of one
   * question, not three independent signals, and an equal-weight mean cannot
   * tell the difference. Every indicator that declares a `family` is counted
   * here unless it is retired, so a dimension carried entirely by one family is
   * visible as a count rather than as an assumption. This reports. It changes no score: weighting
   * stays equal. Only dimensions whose registry rows declare a family appear.
   * See D57.
   */
  familyBalance: Array<{
    dimension: Dimension
    families: Array<{
      family: string
      indicatorsDefined: number
      /** Families with no observed indicator are the collection agenda for the dimension. */
      indicatorsObserved: number
    }>
    /** Countries whose published score for this dimension draws on one family only. */
    countriesOnOneFamily: number
    countriesScored: number
  }>
  /**
   * Every behavioural check put through the wealth test.
   *
   * A check is published beside a dimension and never inside it, so this is the
   * standing evidence for that decision rather than a one-off note. Since D118
   * a check is kept out on construct, such as political polarization, and the
   * correlation is reported and is not the reason. The correlation is computed
   * on the value as published, not on a direction-corrected one, so the sign
   * reads the way the unit does. See D60 and D121.
   */
  behaviouralChecks: Array<{
    checkId: string
    dimension: Dimension
    name: string
    countries: number
    latestYear: number | null
    /** Pearson r of the published value against log GDP per capita. */
    r: number | null
    /** The same against the dimension's own score. Null where it publishes none. */
    dimensionR: number | null
    dimensionN: number
  }>
  /**
   * Every condition against income and against the capability it sits beside.
   *
   * A condition records what a country has to work with and is never scored.
   * `r` asks whether having it goes with being rich. `dimensionR` asks whether
   * having it goes with doing the capability its dimension names, which is the
   * question the conditions layer exists to put: a condition that tracks income
   * and not the capability is money the capability does not turn into action.
   * Both are Pearson r on the value after the registry transform (so secure
   * servers are read logged), signed so that positive means more of the
   * condition in its own direction. See D122.
   */
  conditions: Array<{
    indicatorId: string
    dimension: Dimension
    name: string
    measurementClass: MeasurementClass
    countries: number
    latestYear: number | null
    /** Pearson r against log GDP per capita. */
    r: number | null
    n: number
    /** The same against the dimension's own published score. */
    dimensionR: number | null
    dimensionN: number
  }>
  /**
   * Whether each indicator still separates the countries from each other.
   *
   * Every other block here is a cross-section of the latest year. This one is
   * the only question asked across time, and it is not about any country: it is
   * about whether the ruler still has markings on it. An indicator whose
   * cross-country spread is collapsing has stopped discriminating, and whatever
   * it contributes to a dimension mean after that is mostly noise wearing the
   * name of a measurement. Convergence is a real thing the world does, so a
   * falling spread is a finding rather than a fault. What it forbids is
   * continuing to read the indicator as though it still told countries apart.
   *
   * Two rules make the number mean something, and they are the trend layer's
   * rules rather than new ones. Historical values are scored against the frame
   * built from every country's current values, so a change in spread is a
   * change in the countries and never a change in the scale. And the spread is
   * computed on a balanced panel, the countries observed at both ends of the
   * window, so an indicator that gained coverage does not read as one that
   * gained variance. The panel size is published beside every figure for the
   * same reason a momentum basket is. See D22.
   *
   * Spread is the interquartile range of the normalised values, in points of
   * the same 0 to 100 scale a score is on, which makes it comparable across
   * indicators that share no unit.
   */
  discriminationTrend: {
    span: number
    baseYear: number
    currentYear: number
    perIndicator: Array<{
      indicatorId: string
      dimension: Dimension
      /** Countries observed at both ends. Spread is computed on these and no others. */
      countries: number
      /** Years the whole panel could be filled. The trend is computed over these. */
      years: number
      firstYear: number | null
      lastYear: number | null
      /** Interquartile spread of normalised values at the first filled year. */
      firstSpread: number | null
      /** The same at the last filled year. */
      lastSpread: number | null
      /** Relative change between the two, negative where the spread has narrowed. */
      changeShare: number | null
      /** Rank correlation of spread against year. Negative means it is falling. */
      spearman: number | null
      /**
       * Cells whose reading was carried forward from an earlier year. A survey
       * series repeats its last round between waves, which holds a spread still
       * rather than measuring it.
       */
      carriedForwardCells: number
      /** Cells that clamped to 0 or 100. A clamp compresses spread by construction. */
      clampedCells: number
      /** The spread is falling on both tests. */
      fading: boolean
      /** The latest spread is under the floor, whatever it has done over time. */
      lowDiscrimination: boolean
    }>
  }
  gdpStrippedTest: {
    excluded: string[]
    /** Dimensions that lose every indicator once the wealth-correlated ones go. */
    dimensionsEmptied: Dimension[]
    perDimensionMeanAbsShift: Array<{ dimension: Dimension; meanAbsShift: number | null }>
    perCountryMeanAbsShift: Array<{ iso3: string; country: string; meanAbsShift: number | null }>
    rankChanges: Array<{ dimension: Dimension; changedPositions: number }>
  }
  dataGaps: Array<{
    dimension: Dimension
    indicatorId: string
    name: string
    publisher: string
    reason: string
    /** A gap has no dataset. A retired row has one this project rejected. */
    status: 'gap' | 'retired'
  }>
  /**
   * How often observed values sit outside the frame and clamp to 0 or
   * 100. Frequent clamping means the frame is too narrow for the countries being
   * scored, and this is where that shows up as one number instead of a silent
   * per-cell flag.
   */
  outOfFrame: {
    observedCells: number
    clampedCells: number
    share: number
    perCountry: Array<{ iso3: string; country: string; clampedCells: number }>
  }
}

/**
 * Correlate the panel's own column with income, dimension by dimension.
 *
 * The comparison column is the indicator score over exactly the countries the
 * panel scored, so a difference between the two is a difference in what they
 * measure and not in who they cover.
 */
function panelVsGdpFor(
  run: DelphiRunFile,
  countries: CountryResult[],
  gdp: Map<string, number>,
): NonNullable<Diagnostics['panelVsGdp']> {
  const evidential = isEvidential(run.provenance)
  const abs = (v: number | null) => (v === null ? null : Math.abs(v))
  const perDimension = !evidential
    ? []
    : DIMENSIONS.map((dimension) => {
        const panel = panelSeries(countries, dimension)
        const p = alignedPair(panel, gdp)
        const panelR = pearson(p.xs, p.ys)
        const matched = restrictTo(dimensionSeries(countries, dimension), panel.keys())
        const i = alignedPair(matched, gdp)
        const indicatorR = pearson(i.xs, i.ys)
        const pa = abs(panelR)
        const ia = abs(indicatorR)
        const s = spearman(p.xs, p.ys)
        return {
          dimension,
          panelR: panelR === null ? null : round(panelR, 3),
          panelSpearman: s === null ? null : round(s, 3),
          panelN: p.xs.length,
          indicatorR: indicatorR === null ? null : round(indicatorR, 3),
          indicatorN: i.xs.length,
          delta: pa === null || ia === null ? null : round(pa - ia, 3),
          flaggedAsWealthProxy: pa !== null && pa >= WEALTH_CORRELATION_THRESHOLD,
          backfillCandidate: countries.every((c) => c.dimensions[dimension]?.score === null),
        }
      })
  return {
    runId: run.runId,
    provenance: run.provenance,
    panelists: run.panel.length,
    evidential,
    hasDistribution: isPanel(run),
    perDimension,
  }
}

/**
 * Cross-country spread per indicator over the window, and whether it is
 * narrowing.
 *
 * The balanced panel is built once per indicator from the two ends of the
 * window. A year that cannot fill the whole panel is skipped rather than
 * measured on a smaller one, because a spread over a different country set is
 * not comparable with the year before it.
 */
function discriminationTrendFor(
  observations: Observation[],
  opts: ScoreOptions,
): Diagnostics['discriminationTrend'] {
  const history = buildHistory(observations)
  const frames = buildFrames(observations, opts)
  const baseYear = opts.currentYear - DISCRIMINATION_SPAN
  const maxAge = DISCRIMINATION_MAX_AGE

  const perIndicator = INDICATORS.filter((def) => isScored(def) && frames.has(def.id)).map(
    (def) => {
      const frame = frames.get(def.id) as Frame
      const at = (iso3: string, year: number) =>
        normalizedAt(def, history, iso3, year, maxAge, frame)

      const panel = COUNTRY_ISO3.filter(
        (iso3) => at(iso3, baseYear) !== null && at(iso3, opts.currentYear) !== null,
      )

      const spreads: Array<{ year: number; spread: number }> = []
      let carriedForwardCells = 0
      let clampedCells = 0

      if (panel.length >= DISCRIMINATION_MIN_COUNTRIES) {
        for (let year = baseYear; year <= opts.currentYear; year++) {
          const values: number[] = []
          let carried = 0
          let clamped = 0
          for (const iso3 of panel) {
            const cell = at(iso3, year)
            if (!cell) break
            values.push(cell.normalized)
            if (cell.year !== year) carried += 1
            if (cell.outOfFrame) clamped += 1
          }
          if (values.length < panel.length) continue
          spreads.push({ year, spread: round(iqr(values), 2) })
          carriedForwardCells += carried
          clampedCells += clamped
        }
      }

      const first = spreads[0] ?? null
      const last = spreads[spreads.length - 1] ?? null
      const enough = spreads.length >= DISCRIMINATION_MIN_YEARS
      const rho = enough
        ? spearman(
            spreads.map((s) => s.year),
            spreads.map((s) => s.spread),
          )
        : null
      const changeShare =
        enough && first && last && first.spread > 0
          ? round((last.spread - first.spread) / first.spread, 3)
          : null

      return {
        indicatorId: def.id,
        dimension: def.dimension,
        countries: panel.length,
        years: spreads.length,
        firstYear: first?.year ?? null,
        lastYear: last?.year ?? null,
        firstSpread: enough ? (first?.spread ?? null) : null,
        lastSpread: enough ? (last?.spread ?? null) : null,
        changeShare,
        spearman: rho === null ? null : round(rho, 3),
        carriedForwardCells,
        clampedCells,
        fading:
          rho !== null &&
          rho <= DISCRIMINATION_FADE_SPEARMAN &&
          changeShare !== null &&
          changeShare <= DISCRIMINATION_FADE_SHARE,
        lowDiscrimination: enough && last !== null && last.spread < DISCRIMINATION_FLOOR,
      }
    },
  )

  /* Most negative first, and the indicators the window could not test last. */
  perIndicator.sort((a, b) => (a.spearman ?? 2) - (b.spearman ?? 2))

  return { span: DISCRIMINATION_SPAN, baseYear, currentYear: opts.currentYear, perIndicator }
}

/**
 * One principal-component solution of the dimension scores.
 *
 * `scores` holds each country's published dimension scores, null where a
 * dimension publishes none. Only countries with every listed dimension scored
 * enter, because a correlation matrix built pairwise over different country
 * sets need not be a correlation matrix of anything, and its eigenvalues can
 * go negative. Nothing is imputed. Null when fewer than three countries remain.
 */
export function factorSolution(
  scores: Map<string, Partial<Record<Dimension, number | null>>>,
  logGdp: Map<string, number>,
  dimensions: readonly Dimension[] = DIMENSIONS,
  chance: { draws?: number; seed?: number } = {},
): FactorSolution | null {
  const kept: string[] = []
  const dropped: FactorSolution['dropped'] = []
  for (const [iso3, row] of [...scores.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const missing = dimensions.filter((d) => row[d] === null || row[d] === undefined)
    if (missing.length) dropped.push({ iso3, missing })
    else kept.push(iso3)
  }
  const n = kept.length
  const p = dimensions.length
  if (n < 3 || p < 2) return null

  const columns = dimensions.map((d) => kept.map((iso3) => scores.get(iso3)?.[d] as number))
  const { values, vectors } = symmetricEigen(correlationMatrix(columns))
  const first = vectors[0] ?? []
  const lambda = values[0] ?? 0
  /* An eigenvector's sign is arbitrary. Point it so the loadings sum positive,
   * which makes a high factor score mean high scores across the board. */
  const sign = first.reduce((a, b) => a + b, 0) < 0 ? -1 : 1
  const weights = first.map((w) => w * sign)

  /* Country scores on the first factor: standardised dimension scores times
   * the unit eigenvector. */
  const stats = columns.map((col) => {
    const m = mean(col)
    const sd = Math.sqrt(col.reduce((a, x) => a + (x - m) ** 2, 0) / (col.length - 1))
    return { m, sd: sd || 1 }
  })
  const factorScores = new Map<string, number>()
  kept.forEach((iso3, i) => {
    let total = 0
    for (let j = 0; j < p; j++) {
      const s = stats[j] as { m: number; sd: number }
      total += (weights[j] ?? 0) * (((columns[j] as number[])[i] as number) - s.m) / s.sd
    }
    factorScores.set(iso3, total)
  })
  /* Over the kept countries directly, so a release read from history whose
   * country set differs from today's registry is still read whole. */
  const g = { xs: [] as number[], ys: [] as number[] }
  for (const iso3 of kept) {
    const y = logGdp.get(iso3)
    if (y === undefined) continue
    g.xs.push(factorScores.get(iso3) as number)
    g.ys.push(y)
  }
  const r = pearson(g.xs, g.ys)

  const base = firstFactorChance(n, p, {
    draws: chance.draws ?? FACTOR_CHANCE_DRAWS,
    seed: chance.seed ?? FACTOR_CHANCE_SEED,
  })

  return {
    dimensions: [...dimensions],
    countries: n,
    dropped,
    eigenvalues: values.map((v) => round(v, 3)),
    firstFactorShare: round(lambda / p, 3),
    loadings: dimensions.map((dimension, j) => ({
      dimension,
      loading: round((weights[j] ?? 0) * Math.sqrt(Math.max(lambda, 0)), 3),
    })),
    income: r === null ? null : { r: round(r, 3), rSquared: round(r * r, 3), n: g.xs.length },
    chance: { ...base, mean: round(base.mean, 3), p95: round(base.p95, 3) },
  }
}

/**
 * The factor test as published: all nine on complete cases, and, when too
 * few countries have all nine, the dimensions with near-full coverage as well.
 */
export function factorStructureFor(
  scores: Map<string, Partial<Record<Dimension, number | null>>>,
  logGdp: Map<string, number>,
  chance: { draws?: number; seed?: number } = {},
): FactorStructure {
  const complete = factorSolution(scores, logGdp, DIMENSIONS, chance)
  let nearFull: FactorSolution | null = null
  if (!complete || complete.countries < FACTOR_MIN_COUNTRIES) {
    const total = scores.size
    const covered = DIMENSIONS.filter((d) => {
      let k = 0
      for (const row of scores.values()) if (row[d] !== null && row[d] !== undefined) k += 1
      return total > 0 && k / total >= FACTOR_NEAR_FULL_COVERAGE
    })
    if (covered.length >= 2 && covered.length < DIMENSIONS.length) {
      nearFull = factorSolution(scores, logGdp, covered, chance)
    }
  }
  return {
    minCountries: FACTOR_MIN_COUNTRIES,
    nearFullCoverage: FACTOR_NEAR_FULL_COVERAGE,
    complete,
    nearFull,
  }
}

/** How strongly the first factor follows income, banded on the absolute r. */
export function factorIncomeBand(r: number | null): 'strong' | 'moderate' | 'weak' | null {
  if (r === null) return null
  const a = Math.abs(r)
  if (a >= FACTOR_INCOME_BANDS.strong) return 'strong'
  if (a >= FACTOR_INCOME_BANDS.moderate) return 'moderate'
  return 'weak'
}

/** The solution a one-line reading should quote: complete cases unless too few, then near-full. */
export function headlineFactor(
  fs: FactorStructure,
): { basis: 'complete' | 'nearFull'; solution: FactorSolution } | null {
  if (fs.complete && (fs.complete.countries >= fs.minCountries || !fs.nearFull)) {
    return { basis: 'complete', solution: fs.complete }
  }
  if (fs.nearFull) return { basis: 'nearFull', solution: fs.nearFull }
  return fs.complete ? { basis: 'complete', solution: fs.complete } : null
}

function rankOrder(values: Map<string, number>): string[] {
  return [...values.entries()].sort((a, b) => b[1] - a[1]).map(([iso3]) => iso3)
}

export function runDiagnostics(
  observations: Observation[],
  countries: CountryResult[],
  matrix: Matrix,
  opts: ScoreOptions,
  gdpSeries: string,
  delphi: DelphiRunFile | null = null,
): Diagnostics {
  const gdp = logGdpByCountry(observations, gdpSeries)

  const dimensionVsGdp = DIMENSIONS.map((dimension) => {
    const s = dimensionSeries(countries, dimension)
    const { xs, ys } = alignedPair(s, gdp)
    return { dimension, pearson: pearson(xs, ys), spearman: spearman(xs, ys), n: xs.length }
  })

  const dimensionPairs: Correlation[] = []
  for (let i = 0; i < DIMENSIONS.length; i++) {
    for (let j = i + 1; j < DIMENSIONS.length; j++) {
      const a = DIMENSIONS[i] as Dimension
      const b = DIMENSIONS[j] as Dimension
      const { xs, ys } = alignedPair(dimensionSeries(countries, a), dimensionSeries(countries, b))
      dimensionPairs.push({ a, b, r: pearson(xs, ys), n: xs.length })
    }
  }
  dimensionPairs.sort((x, y) => Math.abs(y.r ?? 0) - Math.abs(x.r ?? 0))

  const scoreRows = new Map(
    countries.map((c) => [
      c.iso3,
      Object.fromEntries(DIMENSIONS.map((d) => [d, c.dimensions[d]?.score ?? null])),
    ]),
  )
  const factorStructure = factorStructureFor(scoreRows, gdp)
  const residualStructure = residualStructureFor(scoreRows, gdp)

  const indicatorVsGdp = [...matrix.keys()].map((indicatorId) => {
    const def = INDICATORS_BY_ID[indicatorId]
    const { xs, ys } = alignedPair(indicatorSeries(matrix, indicatorId), gdp)
    const r = pearson(xs, ys)
    return {
      indicatorId,
      dimension: def?.dimension as Dimension,
      measurementClass: def?.measurementClass as MeasurementClass,
      r: r === null ? null : round(r, 3),
      wealthProxyPrior: def?.wealthProxyPrior ?? 0,
      flaggedAsWealthProxy: r !== null && Math.abs(r) >= WEALTH_CORRELATION_THRESHOLD,
    }
  })
  indicatorVsGdp.sort((a, b) => Math.abs(b.r ?? 0) - Math.abs(a.r ?? 0))

  const wealthAttribution = [...matrix.keys()]
    .map((indicatorId) => {
      const dimension = INDICATORS_BY_ID[indicatorId]?.dimension as Dimension
      const withIt = alignedPair(dimensionSeriesFrom(matrix, dimension), gdp)
      const without = alignedPair(dimensionSeriesFrom(matrix, dimension, indicatorId), gdp)
      const a = pearson(withIt.xs, withIt.ys)
      const b = pearson(without.xs, without.ys)
      const abs = (v: number | null) => (v === null ? null : Math.abs(v))
      const ra = abs(a)
      const rb = abs(b)
      return {
        indicatorId,
        dimension,
        dimensionR: ra === null ? null : round(ra, 3),
        dimensionRWithout: rb === null ? null : round(rb, 3),
        delta: ra === null || rb === null ? null : round(ra - rb, 3),
      }
    })
    .sort((x, y) => (y.delta ?? 0) - (x.delta ?? 0))

  const ids = [...matrix.keys()]
  const redundantIndicatorPairs: Correlation[] = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i] as string
      const b = ids[j] as string
      const { xs, ys } = alignedPair(indicatorSeries(matrix, a), indicatorSeries(matrix, b))
      const r = pearson(xs, ys)
      if (r !== null && Math.abs(r) >= REDUNDANCY_THRESHOLD) {
        redundantIndicatorPairs.push({ a, b, r: round(r, 3), n: xs.length })
      }
    }
  }
  redundantIndicatorPairs.sort((x, y) => Math.abs(y.r ?? 0) - Math.abs(x.r ?? 0))

  const measurability = DIMENSIONS.map((dimension) => {
    const defs = indicatorsFor(dimension)
    const observedIds = defs.filter((d) => matrix.has(d.id))
    const classMix: Record<MeasurementClass, number> = { C: 0, I: 0, O: 0, P: 0 }
    for (const d of defs) classMix[d.measurementClass] += 1
    const coverages = countries.map((c) => c.dimensions[dimension]?.confidenceParts.coverage ?? 0)
    const confidences = countries.map((c) => c.dimensions[dimension]?.confidence ?? 0)
    /** Perception proxies plus unmeasured items: what has to be judged rather than read off. */
    const subjective =
      defs.filter((d) => d.measurementClass === 'P' || !isScored(d)).length / defs.length
    return {
      dimension,
      indicatorsDefined: defs.length,
      indicatorsObserved: observedIds.length,
      gaps: defs.filter(isDeclaredGap).length,
      retired: defs.filter((d) => d.ingest === 'retired').length,
      meanCoverage: round(mean(coverages), 3),
      meanConfidence: round(mean(confidences), 3),
      classMix,
      subjectivityShare: round(subjective, 3),
    }
  })

  const familyBalance = DIMENSIONS.flatMap((dimension) => {
    /* A retired row can never reach a score, so counting it here would report a
     * family the dimension cannot draw on. Gaps stay: an unfilled family is the
     * collection agenda. */
    const defs = indicatorsFor(dimension).filter((d) => d.ingest !== 'retired')
    if (!defs.some((d) => d.family)) return []
    const familyOf = (d: (typeof defs)[number]) => d.family ?? UNASSIGNED_FAMILY
    const names = [...new Set(defs.map(familyOf))].sort()
    const families = names.map((family) => {
      const inFamily = defs.filter((d) => familyOf(d) === family)
      return {
        family,
        indicatorsDefined: inFamily.length,
        indicatorsObserved: inFamily.filter((d) => matrix.has(d.id)).length,
      }
    })
    let countriesScored = 0
    let countriesOnOneFamily = 0
    for (const c of countries) {
      if (c.dimensions[dimension]?.score == null) continue
      countriesScored += 1
      const present = new Set<string>()
      for (const d of defs) if (matrix.get(d.id)?.has(c.iso3)) present.add(familyOf(d))
      if (present.size <= 1) countriesOnOneFamily += 1
    }
    return [{ dimension, families, countriesOnOneFamily, countriesScored }]
  })

  const behaviouralChecks = CHECKS.map((c) => {
    const values = new Map<string, number>()
    const years: number[] = []
    for (const country of countries) {
      const row = country.dimensions[c.dimension]?.checks.find((x) => x.checkId === c.id)
      if (!row || row.value === null) continue
      values.set(country.iso3, row.value)
      if (row.year !== null) years.push(row.year)
    }
    const g = alignedPair(values, gdp)
    const r = pearson(g.xs, g.ys)
    const d = alignedPair(values, dimensionSeries(countries, c.dimension))
    const dimensionR = pearson(d.xs, d.ys)
    return {
      checkId: c.id,
      dimension: c.dimension,
      name: c.name,
      countries: values.size,
      latestYear: years.length ? Math.max(...years) : null,
      r: r === null ? null : round(r, 3),
      dimensionR: dimensionR === null ? null : round(dimensionR, 3),
      dimensionN: d.xs.length,
    }
  })

  const conditionColumns = conditionValues(observations)
  const conditions = CONDITIONS.map((def) => {
    const column = conditionColumns.get(def.id)
    const sign = def.direction === 'lower_better' ? -1 : 1
    const values = new Map<string, number>()
    const years: number[] = []
    for (const [iso3, v] of column?.byCountry ?? []) {
      values.set(iso3, sign * v.transformed)
      years.push(v.year)
    }
    const g = alignedPair(values, gdp)
    const r = pearson(g.xs, g.ys)
    const d = alignedPair(values, dimensionSeries(countries, def.dimension))
    const dimensionR = pearson(d.xs, d.ys)
    return {
      indicatorId: def.id,
      dimension: def.dimension,
      name: def.name,
      measurementClass: def.measurementClass,
      countries: values.size,
      latestYear: years.length ? Math.max(...years) : null,
      r: r === null ? null : round(r, 3),
      n: g.xs.length,
      dimensionR: dimensionR === null ? null : round(dimensionR, 3),
      dimensionN: d.xs.length,
    }
  })

  const excluded = indicatorVsGdp.filter((i) => i.flaggedAsWealthProxy).map((i) => i.indicatorId)
  /* The strip test compares levels, so skip the trend work it does not read. */
  const stripped = scoreAll(observations, {
    ...opts,
    exclude: new Set(excluded),
    momentumSpans: [],
    delphiRun: undefined,
  })

  const perDimensionMeanAbsShift = DIMENSIONS.map((dimension) => {
    const shifts: number[] = []
    for (const c of countries) {
      const before = c.dimensions[dimension]?.score
      const after = stripped.countries.find((x) => x.iso3 === c.iso3)?.dimensions[dimension]?.score
      if (before === null || before === undefined || after === null || after === undefined) continue
      shifts.push(Math.abs(after - before))
    }
    return { dimension, meanAbsShift: shifts.length ? round(mean(shifts), 2) : null }
  })

  const perCountryMeanAbsShift = countries.map((c) => {
    const shifts: number[] = []
    for (const dimension of DIMENSIONS) {
      const before = c.dimensions[dimension]?.score
      const after = stripped.countries.find((x) => x.iso3 === c.iso3)?.dimensions[dimension]?.score
      if (before === null || before === undefined || after === null || after === undefined) continue
      shifts.push(Math.abs(after - before))
    }
    return {
      iso3: c.iso3,
      country: COUNTRY_NAMES[c.iso3] ?? c.country,
      meanAbsShift: shifts.length ? round(mean(shifts), 2) : null,
    }
  })

  const rankChanges = DIMENSIONS.map((dimension) => {
    const before = rankOrder(dimensionSeries(countries, dimension))
    const after = rankOrder(dimensionSeries(stripped.countries, dimension))
    let changed = 0
    before.forEach((iso3, i) => {
      if (after[i] !== iso3) changed += 1
    })
    return { dimension, changedPositions: changed }
  })

  /* A condition is not a gap or a rejection: it has data and is published in
   * `conditions`. See D122. */
  const dataGaps = INDICATORS.filter((d) => !isScored(d) && !isCondition(d)).map((d) => ({
    dimension: d.dimension,
    indicatorId: d.id,
    name: d.name,
    publisher: d.source.publisher,
    reason: d.notes,
    status: (d.ingest === 'retired' ? 'retired' : 'gap') as 'gap' | 'retired',
  }))

  let observedCells = 0
  const clampedByCountry = new Map<string, number>()
  for (const inner of matrix.values()) {
    for (const [iso3, cell] of inner) {
      observedCells += 1
      if (cell.outOfFrame) clampedByCountry.set(iso3, (clampedByCountry.get(iso3) ?? 0) + 1)
    }
  }
  const clampedCells = [...clampedByCountry.values()].reduce((a, b) => a + b, 0)
  const outOfFrame = {
    observedCells,
    clampedCells,
    share: observedCells === 0 ? 0 : round(clampedCells / observedCells, 3),
    perCountry: [...clampedByCountry.entries()]
      .map(([iso3, n]) => ({ iso3, country: COUNTRY_NAMES[iso3] ?? iso3, clampedCells: n }))
      .sort((a, b) => b.clampedCells - a.clampedCells),
  }

  const latestIncome = latestContextByCountry(observations, gdpSeries)
  const income = COUNTRY_ISO3.flatMap((iso3) => {
    const v = latestIncome.get(iso3)
    return v && v.value > 0 ? [{ iso3, gdpPerCapita: Math.round(v.value), year: v.year }] : []
  }).sort((a, b) => a.iso3.localeCompare(b.iso3))

  return {
    generatedAt: new Date().toISOString(),
    gdpSeries,
    income,
    dimensionVsGdp: dimensionVsGdp.map((d) => ({
      ...d,
      pearson: d.pearson === null ? null : round(d.pearson, 3),
      spearman: d.spearman === null ? null : round(d.spearman, 3),
    })),
    dimensionPairs: dimensionPairs.map((p) => ({ ...p, r: p.r === null ? null : round(p.r, 3) })),
    duplicateDimensionCandidates: dimensionPairs
      .filter((p) => (p.r ?? 0) >= DIMENSION_OVERLAP_THRESHOLD)
      .map((p) => ({ ...p, r: p.r === null ? null : round(p.r, 3) })),
    factorStructure,
    residualStructure,
    indicatorVsGdp,
    wealthAttribution,
    panelVsGdp: delphi ? panelVsGdpFor(delphi, countries, gdp) : null,
    delphiApplication: delphi?.application ?? null,
    redundantIndicatorPairs,
    measurability,
    familyBalance,
    behaviouralChecks,
    conditions,
    discriminationTrend: discriminationTrendFor(observations, opts),
    gdpStrippedTest: {
      excluded,
      dimensionsEmptied: DIMENSIONS.filter((d) =>
        indicatorsFor(d).every((i) => !isScored(i) || excluded.includes(i.id)),
      ),
      perDimensionMeanAbsShift,
      perCountryMeanAbsShift,
      rankChanges,
    },
    dataGaps,
    outOfFrame,
  }
}
