import { mkdir, readFile, writeFile } from 'node:fs/promises'
import {
  COUNTRIES,
  DATASET_VERSION,
  DIMENSIONS,
  HistoryCountryFile as HistoryCountryFileSchema,
  MoversFile as MoversFileSchema,
  indicatorsFor,
  isScored,
} from '../model/index.js'
import type {
  Dimension,
  HistoryCountryFile,
  IndicatorDef,
  MoversCoherence,
  MoversDimension,
  MoversDimensionReading,
  MoversFile,
  MoversFit,
  Observation,
} from '../model/index.js'
import type { Frame } from './normalize.js'
import { buildFrames } from './score.js'
import { HISTORY_SPANS, gdpAt } from './history.js'
import { buildHistory, momentumFor, normalizedAt } from './trend.js'
import { gaussian, linearFit, mean, median, pearson, quantile, round, seededRandom, shuffled } from './stats.js'
import { FILES, HISTORY_OUT_DIR, historyFile } from './paths.js'
import { loadObservations } from './store.js'

/**
 * Movers: did a country's capability on a dimension change by more or less
 * than the change in its own income predicts?
 *
 * D137 and D138 read levels across countries at one moment. This reads change
 * inside each country over a span, so a fixed national trait cancels out.
 *
 * - Change is the D22 matched-basket momentum: observed values only, on
 *   today's ruler, minus the median change of every country so diffusion
 *   that lifts every country is not movement.
 * - (m1) fits that change on the change in log10 GDP per capita.
 * - (m2) asks whether what income leaves over is a real change or noise:
 *   the leftovers of different indicators of one dimension must move
 *   together across countries beyond a shuffle null. A pair counts only
 *   when the two rows share no primary data (D179), so shared measurement
 *   error cannot pass it.
 * - The D174 estimate runs (m1) beside it as a check on the donor fill.
 *
 * Every reading rule is fixed in D175 before the first run. Nothing here
 * enters a score, and per-country rows stay in this offline file. See D175.
 */
export const MOVERS_METHOD_VERSION = 'movers/0.1-provisional' as const
/** The verdict is read on this span; the others publish beside it. */
export const MOVERS_VERDICT_SPAN = 10
/** Below this many countries a fit or an indicator pair is not read. */
export const MOVERS_MIN_COUNTRIES = 20
const DRAWS = 2000
const SEED = 20261103
/** The D22 rule: an observation counts for a year while it is no older than this. */
const MAX_AGE = 5

function fitReading(r2: number): MoversFit['reading'] {
  if (r2 >= 0.5) return 'income-led'
  if (r2 >= 0.25) return 'partly'
  return 'little'
}

/** (m1): ordinary least squares of change on income change. Null below the minimum. */
export function incomeFit(incomeChange: number[], change: number[]): MoversFit | null {
  if (incomeChange.length < MOVERS_MIN_COUNTRIES) return null
  const fit = linearFit(incomeChange, change)
  const r = pearson(incomeChange, change)
  if (!fit || r === null) return null
  return {
    n: incomeChange.length,
    slope: round(fit.slope, 2),
    r: round(r, 3),
    r2: round(r * r, 3),
    reading: fitReading(r * r),
  }
}

/** One indicator's leftover change: what income change does not predict, per country. */
export type Leftovers = Map<string, number>

/** One indicator as (m2) sees it: its leftovers and what its error can share with another row. */
export type MoversIndicator = { leftovers: Leftovers; origin: string; gdpRatio: boolean }

/** D179: two rows share primary data when they have one origin or are both ratios to GDP. */
export function sharesPrimaryData(a: MoversIndicator, b: MoversIndicator): boolean {
  return a.origin === b.origin || (a.gdpRatio && b.gdpRatio)
}

/** Every pair with enough countries in common, split into those (m2) counts and those D179 leaves out. */
export function pairUp(indicators: MoversIndicator[]): { pairs: Array<{ a: number[]; b: number[] }>; excludedPairs: number } {
  const pairs: Array<{ a: number[]; b: number[] }> = []
  let excludedPairs = 0
  for (let i = 0; i < indicators.length; i++) {
    for (let j = i + 1; j < indicators.length; j++) {
      const left = indicators[i] as MoversIndicator
      const right = indicators[j] as MoversIndicator
      const a: number[] = []
      const b: number[] = []
      for (const [iso3, v] of left.leftovers) {
        const w = right.leftovers.get(iso3)
        if (w === undefined) continue
        a.push(v)
        b.push(w)
      }
      if (a.length < MOVERS_MIN_COUNTRIES) continue
      if (sharesPrimaryData(left, right)) excludedPairs += 1
      else pairs.push({ a, b })
    }
  }
  return { pairs, excludedPairs }
}

/**
 * (m2): the n-weighted mean correlation of leftovers over every indicator pair
 * with enough countries in common and no shared primary data (D179), against a
 * null that shuffles one side of each pair across its countries. Null when no
 * pair qualifies.
 */
export function coherence(
  indicators: MoversIndicator[],
  { draws = DRAWS, seed = SEED }: { draws?: number; seed?: number } = {},
): MoversCoherence | null {
  const { pairs, excludedPairs } = pairUp(indicators)
  if (pairs.length === 0) return null

  const weighted = (rs: number[]) => {
    let s = 0
    let n = 0
    pairs.forEach((p, k) => {
      s += (rs[k] as number) * p.a.length
      n += p.a.length
    })
    return s / n
  }
  const statistic = weighted(pairs.map((p) => pearson(p.a, p.b) ?? 0))
  const random = seededRandom(seed)
  const nulls: number[] = []
  for (let d = 0; d < draws; d++) {
    nulls.push(weighted(pairs.map((p) => pearson(p.a, shuffled(p.b, random)) ?? 0)))
  }
  nulls.sort((x, y) => x - y)
  const p95 = quantile(nulls, 0.95)
  return {
    pairs: pairs.length,
    excludedPairs,
    n: pairs.reduce((s, p) => s + p.a.length, 0),
    statistic: round(statistic, 3),
    nullMean: round(mean(nulls), 3),
    nullP95: round(p95, 3),
    reading: statistic > p95 ? 'coherent' : 'noise',
  }
}

/**
 * D175 item 5. Too few countries reads unreadable first; an income-led fit
 * is read before (m2), because a change income explains is not a mover
 * whether or not its leftover is noise.
 */
export function dimensionReading(m1: MoversFit | null, m2: MoversCoherence | null): MoversDimensionReading {
  if (!m1 || !m2) return 'unreadable'
  if (m1.reading === 'income-led') return 'income-led'
  return m2.reading === 'coherent' ? 'moves-apart' : 'unreadable'
}

/** D175 item 6. */
export function moversVerdict(readings: Partial<Record<Dimension, MoversDimensionReading>>): MoversFile['verdict']['reading'] {
  const values = Object.values(readings)
  const apart = values.filter((r) => r === 'moves-apart').length
  const readable = values.filter((r) => r !== 'unreadable').length
  if (apart >= 2) return 'holds'
  if (apart === 0 && readable >= 5) return 'fails'
  return 'unreadable'
}

/** The registry unit of a ratio to GDP, the second clause of D179. */
const GDP_RATIO_UNIT = '% of GDP'

/** A scored row without an origin cannot be paired safely, so the command stops (D179). */
function originOf(def: IndicatorDef): string {
  if (!def.source.origin) throw new Error(`movers: ${def.id} has no source.origin in the registry; D179 needs one on every scored row.`)
  return def.source.origin
}

/** Residuals of each value on income change, keyed by country. */
function leftoversOf(rows: Array<{ iso3: string; x: number; y: number }>): Leftovers {
  const out: Leftovers = new Map()
  if (rows.length < 3) return out
  const fit = linearFit(rows.map((r) => r.x), rows.map((r) => r.y))
  if (!fit) return out
  rows.forEach((r, i) => out.set(r.iso3, fit.residuals[i] as number))
  return out
}

/** Datasets per synthetic case, and the shuffle draws inside each. */
const SYNTHETIC_DATASETS = 200
const SYNTHETIC_DRAWS = 400
/** Five per cent is the nominal rate; the bound adds two standard errors at 200 datasets. */
const SYNTHETIC_NOISE_BOUND = 0.08
const SYNTHETIC_PLANTED_BOUND = 0.8

/**
 * (m2) must read noise where there is none and coherent where a common change
 * was planted. One dataset cannot show that: a 95th percentile null reads
 * coherent on one noise dataset in 20 by construction. So each case is a rate
 * over many datasets. Three indicators, 120 countries, each a slope on income
 * plus its own noise; the planted case adds one shared change per country at
 * half the noise, a correlation near 0.2 between indicators. If either rate
 * misses its bound, D175 is overturned and no file is written. See D177.
 */
export function syntheticCheck(): MoversFile['synthetic'] {
  const random = seededRandom(SEED + 1)
  const n = 120
  const iso = Array.from({ length: n }, (_, i) => `S${String(i).padStart(3, '0')}`)
  const rate = (common: number) => {
    let coherent = 0
    for (let k = 0; k < SYNTHETIC_DATASETS; k++) {
      const income = iso.map(() => 0.1 * gaussian(random))
      const shared = iso.map(() => common * gaussian(random))
      const ls = [8, 15, 3].map((slope, k) => ({
        leftovers: leftoversOf(iso.map((code, c) => ({ iso3: code, x: income[c] as number, y: slope * (income[c] as number) + (shared[c] as number) + gaussian(random) }))),
        origin: `synthetic ${k}`,
        gdpRatio: false,
      }))
      const c = coherence(ls, { draws: SYNTHETIC_DRAWS, seed: SEED + 10 + k }) as MoversCoherence
      if (c.reading === 'coherent') coherent += 1
    }
    return coherent / SYNTHETIC_DATASETS
  }
  const noise = rate(0)
  const planted = rate(0.5)
  return {
    noise: { datasets: SYNTHETIC_DATASETS, coherentRate: round(noise, 3), bound: SYNTHETIC_NOISE_BOUND, passed: noise <= SYNTHETIC_NOISE_BOUND },
    planted: { datasets: SYNTHETIC_DATASETS, coherentRate: round(planted, 3), bound: SYNTHETIC_PLANTED_BOUND, passed: planted >= SYNTHETIC_PLANTED_BOUND },
  }
}

/** Correlation of a 1 or 0 entry flag with log10 GDP, over the countries with GDP. */
function entryCorrelation(entered: Set<string>, logGdp: Map<string, number>): number | null {
  const flags: number[] = []
  const xs: number[] = []
  for (const [iso3, x] of logGdp) {
    flags.push(entered.has(iso3) ? 1 : 0)
    xs.push(x)
  }
  const r = pearson(flags, xs)
  return r === null ? null : round(r, 3)
}

export function buildMovers(
  observations: Observation[],
  currentYear: number,
  historyCountries: HistoryCountryFile[] | null,
  generatedAt = new Date().toISOString(),
): MoversFile {
  const synthetic = syntheticCheck()
  if (!synthetic.noise.passed || !synthetic.planted.passed) {
    throw new Error(
      `movers: the (m2) synthetic check failed (noise coherent ${synthetic.noise.coherentRate}, bound ${synthetic.noise.bound}; planted coherent ${synthetic.planted.coherentRate}, bound ${synthetic.planted.bound}). D175 is overturned; no file written.`,
    )
  }

  const frames = buildFrames(observations, { currentYear })
  const history = buildHistory(observations)
  const isos = COUNTRIES.map((c) => c.iso3 as string)
  const d174 = new Map((historyCountries ?? []).map((f) => [f.iso3, f]))

  const spans = HISTORY_SPANS.map((span) => {
    const baseYear = currentYear - span
    const gdpBase = gdpAt(observations, baseYear)
    const gdpEnd = gdpAt(observations, currentYear)
    const logBase = new Map([...gdpBase].filter(([, v]) => v > 0).map(([k, v]) => [k, Math.log10(v)]))
    const incomeChange = new Map<string, number>()
    for (const iso3 of isos) {
      const a = gdpBase.get(iso3)
      const b = gdpEnd.get(iso3)
      if (a && b && a > 0 && b > 0) incomeChange.set(iso3, Math.log10(b) - Math.log10(a))
    }

    const dimensions: Partial<Record<Dimension, MoversDimension>> = {}
    for (const dimension of DIMENSIONS) {
      /* Observed change: the D22 basket, less the median of every country. */
      const raw = isos
        .map((iso3) => ({ iso3, m: momentumFor(history, frames, iso3, dimension, { currentYear, span, maxAge: MAX_AGE }) }))
        .filter((x): x is { iso3: string; m: NonNullable<typeof x.m> } => Boolean(x.m))
      const mid = median(raw.map((x) => x.m.delta))
      const rows = raw
        .filter((x) => incomeChange.has(x.iso3))
        .map((x) => ({ iso3: x.iso3, change: x.m.delta - mid, incomeChange: incomeChange.get(x.iso3) as number, basket: x.m.matchedIndicators }))
      const m1 = incomeFit(rows.map((r) => r.incomeChange), rows.map((r) => r.change))
      const fit = rows.length >= 3 ? linearFit(rows.map((r) => r.incomeChange), rows.map((r) => r.change)) : null

      /* (m2): each indicator's own change on today's ruler, its leftover after income. */
      const defs = indicatorsFor(dimension).filter((d) => isScored(d) && frames.has(d.id))
      const indicators = defs.map((def: IndicatorDef): MoversIndicator => {
        const frame = frames.get(def.id) as Frame
        const cells: Array<{ iso3: string; x: number; y: number }> = []
        for (const [iso3, x] of incomeChange) {
          const base = normalizedAt(def, history, iso3, baseYear, MAX_AGE, frame)
          const now = normalizedAt(def, history, iso3, currentYear, MAX_AGE, frame)
          if (base && now) cells.push({ iso3, x, y: now.normalized - base.normalized })
        }
        return {
          leftovers: cells.length >= MOVERS_MIN_COUNTRIES ? leftoversOf(cells) : new Map<string, number>(),
          origin: originOf(def),
          gdpRatio: def.unit === GDP_RATIO_UNIT,
        }
      })
      const usable = indicators.filter((x) => x.leftovers.size > 0)
      const m2 = coherence(usable, { seed: SEED + span })

      /* The D174 estimate, full basket and filled, as a check on the fill. */
      let d174Fit: MoversFit | null = null
      if (d174.size > 0) {
        const est = isos
          .map((iso3) => ({ iso3, delta: d174.get(iso3)?.dimensions[dimension]?.deltas.find((d) => d.span === span)?.estimate }))
          .filter((x): x is { iso3: string; delta: number } => typeof x.delta === 'number')
        const estMid = median(est.map((x) => x.delta))
        const withIncome = est.filter((x) => incomeChange.has(x.iso3))
        d174Fit = incomeFit(withIncome.map((x) => incomeChange.get(x.iso3) as number), withIncome.map((x) => x.delta - estMid))
      }

      dimensions[dimension] = {
        m1,
        m2,
        reading: dimensionReading(m1, m2),
        d174: d174Fit,
        coverage: {
          entered: rows.length,
          eligible: logBase.size,
          rWithLogGdp: entryCorrelation(new Set(rows.map((r) => r.iso3)), logBase),
          excludedPairs: pairUp(usable).excludedPairs,
        },
        countries: rows.map((r, i) => ({
          iso3: r.iso3,
          change: round(r.change, 1),
          incomeChange: round(r.incomeChange, 3),
          leftover: fit ? round(fit.residuals[i] as number, 1) : 0,
          basket: r.basket,
        })),
      }
    }
    return { span, baseYear, endYear: currentYear, dimensions }
  })

  const verdictSpan = spans.find((s) => s.span === MOVERS_VERDICT_SPAN)
  const readings: Partial<Record<Dimension, MoversDimensionReading>> = {}
  for (const dimension of DIMENSIONS) {
    readings[dimension] = verdictSpan?.dimensions[dimension]?.reading ?? 'unreadable'
  }
  const pick = (r: MoversDimensionReading) => DIMENSIONS.filter((d) => readings[d] === r)

  return MoversFileSchema.parse({
    generatedAt,
    methodVersion: MOVERS_METHOD_VERSION,
    datasetVersion: DATASET_VERSION,
    params: {
      endYear: currentYear,
      spans: HISTORY_SPANS,
      verdictSpan: MOVERS_VERDICT_SPAN,
      minCountries: MOVERS_MIN_COUNTRIES,
      draws: DRAWS,
      seed: SEED,
    },
    synthetic,
    spans,
    verdict: {
      span: MOVERS_VERDICT_SPAN,
      movesApart: pick('moves-apart'),
      incomeLed: pick('income-led'),
      unreadable: pick('unreadable'),
      reading: moversVerdict(readings),
    },
  })
}

/** Read the D174 country files if `bench history` has written them; the check is skipped without them. */
async function readHistoryCountries(): Promise<HistoryCountryFile[] | null> {
  try {
    return await Promise.all(
      COUNTRIES.map(async (c) => HistoryCountryFileSchema.parse(JSON.parse(await readFile(historyFile(c.iso3), 'utf8')))),
    )
  } catch {
    return null
  }
}

export async function writeMovers(currentYear: number, generatedAt = new Date().toISOString()): Promise<MoversFile> {
  const output = buildMovers(await loadObservations(), currentYear, await readHistoryCountries(), generatedAt)
  await mkdir(HISTORY_OUT_DIR, { recursive: true })
  await writeFile(FILES.movers, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  return output
}
