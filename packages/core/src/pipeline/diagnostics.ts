import {
  COUNTRY_ISO3,
  COUNTRY_NAMES,
  DIMENSIONS,
  INDICATORS,
  INDICATORS_BY_ID,
  indicatorsFor,
  isEvidential,
  isPanel,
  isScored,
} from '../model/index.js'
import type {
  CountryResult,
  DelphiRunFile,
  Dimension,
  MeasurementClass,
  Observation,
  Provenance,
} from '../model/index.js'
import { mean, pearson, round, spearman } from './stats.js'
import { scoreAll, type Matrix, type ScoreOptions } from './score.js'

export const CONTEXT_PREFIX = '__context__'
export const DENOMINATOR_PREFIX = '__denominator__'

/** Correlation above this marks an indicator as tracking income rather than capability. */
export const WEALTH_CORRELATION_THRESHOLD = 0.7
/** Correlation above this marks two indicators as carrying the same information. */
export const REDUNDANCY_THRESHOLD = 0.85
/** Correlation above this marks two dimensions as candidates for having collapsed into one. */
export const DIMENSION_OVERLAP_THRESHOLD = 0.9

function logGdpByCountry(observations: Observation[], series: string): Map<string, number> {
  /* The observation file carries every year, so pick the latest one per country
   * rather than the first row encountered. */
  const latest = new Map<string, { value: number; year: number }>()
  for (const o of observations) {
    if (o.indicatorId !== `${CONTEXT_PREFIX}${series}`) continue
    const cur = latest.get(o.iso3)
    if (!cur || o.year > cur.year) latest.set(o.iso3, { value: o.value, year: o.year })
  }
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
  dimensionVsGdp: Array<{
    dimension: Dimension
    pearson: number | null
    spearman: number | null
    n: number
  }>
  dimensionPairs: Correlation[]
  duplicateDimensionCandidates: Correlation[]
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
      gaps: defs.filter((d) => d.ingest === 'gap').length,
      retired: defs.filter((d) => d.ingest === 'retired').length,
      meanCoverage: round(mean(coverages), 3),
      meanConfidence: round(mean(confidences), 3),
      classMix,
      subjectivityShare: round(subjective, 3),
    }
  })

  const excluded = indicatorVsGdp.filter((i) => i.flaggedAsWealthProxy).map((i) => i.indicatorId)
  /* The strip test compares levels, so skip the trend work it does not read. */
  const stripped = scoreAll(observations, {
    ...opts,
    exclude: new Set(excluded),
    momentumSpans: [],
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

  const dataGaps = INDICATORS.filter((d) => !isScored(d)).map((d) => ({
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

  return {
    generatedAt: new Date().toISOString(),
    gdpSeries,
    dimensionVsGdp: dimensionVsGdp.map((d) => ({
      ...d,
      pearson: d.pearson === null ? null : round(d.pearson, 3),
      spearman: d.spearman === null ? null : round(d.spearman, 3),
    })),
    dimensionPairs: dimensionPairs.map((p) => ({ ...p, r: p.r === null ? null : round(p.r, 3) })),
    duplicateDimensionCandidates: dimensionPairs
      .filter((p) => (p.r ?? 0) >= DIMENSION_OVERLAP_THRESHOLD)
      .map((p) => ({ ...p, r: p.r === null ? null : round(p.r, 3) })),
    indicatorVsGdp,
    wealthAttribution,
    panelVsGdp: delphi ? panelVsGdpFor(delphi, countries, gdp) : null,
    redundantIndicatorPairs,
    measurability,
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
