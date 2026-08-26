import {
  COUNTRY_ISO3,
  COUNTRY_NAMES,
  DIMENSIONS,
  INDICATORS,
  INDICATORS_BY_ID,
  indicatorsFor,
  isScored,
} from '../model/index.js'
import type { CountryResult, Dimension, MeasurementClass, Observation } from '../model/index.js'
import { mean, pearson, round, spearman } from './stats.js'
import { scoreAll, type Matrix, type ScoreOptions } from './score.js'

export const CONTEXT_PREFIX = '__context__'
export const DENOMINATOR_PREFIX = '__denominator__'

/** Correlation above this marks an indicator as tracking income rather than capability. */
export const WEALTH_CORRELATION_THRESHOLD = 0.7
/** Correlation above this marks two indicators as carrying the same information. */
export const REDUNDANCY_THRESHOLD = 0.85

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
  }>
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
  }))

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
      .filter((p) => (p.r ?? 0) >= 0.9)
      .map((p) => ({ ...p, r: p.r === null ? null : round(p.r, 3) })),
    indicatorVsGdp,
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
  }
}
