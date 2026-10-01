import {
  COUNTRIES,
  ILOSTAT_LTU_ADAPTER_ID,
  ILOSTAT_LTU_DATAFLOW,
  ILOSTAT_LTU_DATAFLOW_VERSION,
  ILOSTAT_LTU_FROM_YEAR,
  ILOSTAT_PUBLISHER,
  ILOSTAT_SDMX_DATA_URL,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import { parseCsv } from './csv.js'
import type { SourceAdapterResult } from './types.js'


/** SDMX codes the share is built from. See D120. */
const SEX_TOTAL = 'SEX_T'
const AGE_15_PLUS = 'AGE_YTHADULT_YGE15'
const DUR_TOTAL = 'DUR_AGGREGATE_TOTAL'
const DUR_12_PLUS = 'DUR_AGGREGATE_MGE12'
const DUR_NOT_STATED = 'DUR_AGGREGATE_X'

/**
 * The plausibility gate's thresholds, applied to every country alike. No
 * country is named anywhere in this adapter. See D120.
 */
export const LTU_GATE = {
  /** A share under this many percent records an instrument that cannot see long searches. */
  floorPct: 3,
  /** A move larger than this many points between adjacent observations is a jump. */
  jumpPts: 15,
  /** The longest run of observations that can count as a spike rather than a level shift. */
  maxSpikeLength: 2,
} as const

/**
 * Why the gate dropped a value.
 * - `below_floor`: the value itself is under the floor.
 * - `instrument_floor`: the value clears the floor, but the median of every
 *   year the same survey reported for that country does not, so the
 *   instrument as a whole cannot record long durations.
 * - `spike`: one or two consecutive values sit more than the jump threshold
 *   beyond both the value before and the value after them, and those two
 *   agree within the threshold: the series leaves and comes back.
 * - `unconfirmed_jump`: the latest value jumps from the one before it and no
 *   later year exists to say whether it is a new level or a spike.
 */
export type LtuDropReason = 'below_floor' | 'instrument_floor' | 'spike' | 'unconfirmed_jump'

/** One derived country-year share, before the gate. */
export type LtuPoint = {
  year: number
  /** Unemployed 12 months or more, % of unemployed with a stated duration. */
  value: number
  /** ILOSTAT's survey label, e.g. "LFS - Labour Force Survey". */
  source: string
  /** Unemployed with no stated duration, % of all unemployed. */
  unknownPct: number
  /** ILOSTAT observation status codes on the rows used (B break, U unreliable). */
  status: string[]
}

export type LtuDropped = {
  iso3: string
  year: number
  value: number
  source: string
  reason: LtuDropReason
}

export type IlostatLtuResult = SourceAdapterResult & {
  /** Every value the plausibility gate removed, with the reason. */
  dropped: LtuDropped[]
}

const round1 = (value: number): number => Math.round(value * 10) / 10

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
}

/**
 * Apply the plausibility gate to one country's series. Pure: it sees values,
 * years and survey labels, never the country. The order is fixed:
 *
 * 1. Floor. Any value under `floorPct` is dropped, and so is every value of a
 *    survey whose median across all its years for the country is under it.
 * 2. Spike. On what survives, a run of one or two consecutive observations
 *    that sits more than `jumpPts` above (or below) both the observation
 *    before it and the observation after it is dropped, provided those two
 *    neighbours agree within `jumpPts`. A jump that the following year keeps
 *    is a level shift and stays.
 * 3. Unconfirmed jump. If the latest surviving value is more than `jumpPts`
 *    from the surviving value before it, it is dropped: with no later year a
 *    spike and a level shift look the same, so the shift waits one release
 *    to be confirmed.
 *
 * "Adjacent" means adjacent in the series, so a gap year does not break it.
 */
export function plausibilityGate(
  iso3: string,
  series: LtuPoint[],
  gate: { floorPct: number; jumpPts: number; maxSpikeLength: number } = LTU_GATE,
): { kept: LtuPoint[]; dropped: LtuDropped[] } {
  const sorted = [...series].sort((a, b) => a.year - b.year)
  const reasons = new Map<number, LtuDropReason>()

  const bySource = new Map<string, number[]>()
  for (const point of sorted) {
    bySource.set(point.source, [...(bySource.get(point.source) ?? []), point.value])
  }
  for (const point of sorted) {
    if (point.value < gate.floorPct) reasons.set(point.year, 'below_floor')
    else if (median(bySource.get(point.source)!) < gate.floorPct) reasons.set(point.year, 'instrument_floor')
  }

  const plausible = sorted.filter((point) => !reasons.has(point.year))
  const v = plausible.map((point) => point.value)
  // `anchor` is the last observation not already dropped as a spike, so a
  // value that was itself removed never decides whether its neighbour is one.
  let anchor = 0
  for (let start = 1; start < v.length - 1; start += 1) {
    let spikeEnd = -1
    for (let length = 1; length <= gate.maxSpikeLength; length += 1) {
      const after = start + length
      if (after > v.length - 1) break
      const before = v[anchor]!
      const next = v[after]!
      if (Math.abs(next - before) > gate.jumpPts) continue
      const run = v.slice(start, after)
      const above = Math.min(...run) > Math.max(before, next) + gate.jumpPts
      const below = Math.max(...run) < Math.min(before, next) - gate.jumpPts
      if (!above && !below) continue
      for (const point of plausible.slice(start, after)) reasons.set(point.year, 'spike')
      spikeEnd = after - 1
      break
    }
    if (spikeEnd >= 0) start = spikeEnd
    else anchor = start
  }

  const surviving = plausible.filter((point) => !reasons.has(point.year))
  if (surviving.length >= 2) {
    const last = surviving[surviving.length - 1]!
    const prior = surviving[surviving.length - 2]!
    if (Math.abs(last.value - prior.value) > gate.jumpPts) reasons.set(last.year, 'unconfirmed_jump')
  }

  const kept: LtuPoint[] = []
  const dropped: LtuDropped[] = []
  for (const point of sorted) {
    const reason = reasons.get(point.year)
    if (reason) dropped.push({ iso3, year: point.year, value: round1(point.value), source: point.source, reason })
    else kept.push(point)
  }
  return { kept, dropped }
}

/** Survey preference when ILOSTAT holds more than one source for a country-year. */
function sourceRank(source: string): number {
  if (source.startsWith('LFS')) return 0
  if (source.startsWith('HS')) return 1
  return 2
}

/**
 * Derive one share per country-year from the SDMX CSV rows: 12 months or more
 * over the unemployed whose duration is stated, both sexes, age 15 and over.
 * Where several surveys report the same year, a labour force survey wins,
 * then a household survey, then anything else, then the label alphabetically.
 */
export function deriveLtuSeries(csv: string): Map<string, LtuPoint[]> {
  const rows = parseCsv(
    csv,
    ['REF_AREA', 'SEX', 'AGE', 'DUR', 'TIME_PERIOD', 'OBS_VALUE', 'SOURCE'],
    'ILOSTAT',
  )
  type Cell = { counts: Map<string, number>; status: Set<string> }
  const cells = new Map<string, Cell>()
  for (const row of rows) {
    if (row.SEX !== SEX_TOTAL || row.AGE !== AGE_15_PLUS) continue
    const dur = row.DUR ?? ''
    if (dur !== DUR_TOTAL && dur !== DUR_12_PLUS && dur !== DUR_NOT_STATED) continue
    const raw = (row.OBS_VALUE ?? '').trim()
    if (raw === '') continue
    const value = Number(raw)
    if (!Number.isFinite(value)) continue
    const key = JSON.stringify([row.REF_AREA, Number(row.TIME_PERIOD), row.SOURCE])
    const cell = cells.get(key) ?? { counts: new Map(), status: new Set() }
    cell.counts.set(dur, value)
    if (row.OBS_STATUS) cell.status.add(row.OBS_STATUS)
    cells.set(key, cell)
  }

  const candidates = new Map<string, Map<number, LtuPoint>>()
  for (const [key, cell] of cells) {
    const [iso3, year, source] = JSON.parse(key) as [string, number, string]
    const total = cell.counts.get(DUR_TOTAL)
    const longTerm = cell.counts.get(DUR_12_PLUS)
    if (total === undefined || longTerm === undefined || !Number.isInteger(year)) continue
    const unknown = cell.counts.get(DUR_NOT_STATED) ?? 0
    const stated = total - unknown
    if (stated <= 0) continue
    const value = (100 * longTerm) / stated
    if (!Number.isFinite(value) || value < 0 || value > 100) continue
    const point: LtuPoint = {
      year,
      value,
      source,
      unknownPct: total > 0 ? (100 * unknown) / total : 0,
      status: [...cell.status].sort(),
    }
    const years = candidates.get(iso3) ?? new Map<number, LtuPoint>()
    const held = years.get(year)
    if (
      !held ||
      sourceRank(source) < sourceRank(held.source) ||
      (sourceRank(source) === sourceRank(held.source) && source < held.source)
    ) {
      years.set(year, point)
    }
    candidates.set(iso3, years)
  }

  const out = new Map<string, LtuPoint[]>()
  for (const [iso3, years] of candidates) {
    out.set(iso3, [...years.values()].sort((a, b) => a.year - b.year))
  }
  return out
}

/** The SDMX request for a set of countries. */
export function ilostatLtuUrl(iso3s: readonly string[], fromYear = ILOSTAT_LTU_FROM_YEAR): string {
  return `${ILOSTAT_SDMX_DATA_URL}/ILO,${ILOSTAT_LTU_DATAFLOW},${ILOSTAT_LTU_DATAFLOW_VERSION}/${iso3s.join('+')}.A..${SEX_TOTAL}..?startPeriod=${fromYear}`
}

const STATUS_LABEL: Record<string, string> = { B: 'break in series', U: 'flagged unreliable by ILO' }

/**
 * Parse the ILOSTAT SDMX CSV into observations: derive the share, run the
 * plausibility gate on every country, emit the latest surviving year.
 */
export function parseIlostatLongTermUnemployment(
  csv: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = ilostatLtuUrl(COUNTRIES.map((country) => country.iso3)),
): IlostatLtuResult {
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const series = deriveLtuSeries(csv)
  const available: string[] = []
  const held: string[] = []
  const unmapped: string[] = []
  const dropped: LtuDropped[] = []
  const observations: Observation[] = []

  for (const [iso3, points] of series) {
    if (!benchmark.has(iso3)) {
      unmapped.push(iso3)
      continue
    }
    if (points.length === 0) continue
    available.push(iso3)
    const gated = plausibilityGate(iso3, points)
    dropped.push(...gated.dropped)
    const latest = gated.kept[gated.kept.length - 1]
    if (!latest) {
      held.push(iso3)
      continue
    }
    const flags = latest.status.map((code) => STATUS_LABEL[code] ?? code)
    observations.push({
      indicatorId: 'long_term_unemployment_share',
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: round1(latest.value),
      year: latest.year,
      sourceTier: 'international_organization',
      sourceUrl: ilostatLtuUrl([iso3]),
      retrievedAt,
      note: [
        `${ILOSTAT_PUBLISHER} ${ILOSTAT_LTU_DATAFLOW}: ${DUR_12_PLUS} / (${DUR_TOTAL} - ${DUR_NOT_STATED}), ${SEX_TOTAL}, ${AGE_15_PLUS}`,
        `survey: ${latest.source}`,
        `duration not stated: ${round1(latest.unknownPct)}% of unemployed`,
        ...(flags.length > 0 ? [`status: ${flags.join(', ')}`] : []),
        `passed the D120 plausibility gate`,
        'CC BY 4.0.',
      ].join('; '),
    })
  }

  observations.sort((a, b) => a.iso3.localeCompare(b.iso3))
  dropped.sort((a, b) => a.iso3.localeCompare(b.iso3) || a.year - b.year)
  return {
    adapterId: ILOSTAT_LTU_ADAPTER_ID,
    observations,
    availableCountries: available.sort(),
    emittedCountries: observations.map((observation) => observation.iso3),
    heldCountries: held.sort(),
    unmappedLabels: unmapped.sort(),
    sourceUrl,
    release: `${ILOSTAT_LTU_DATAFLOW} ${ILOSTAT_LTU_DATAFLOW_VERSION}, read ${retrievedAt.slice(0, 10)}`,
    dropped,
  }
}

/** Fetch every benchmark country in one SDMX call and parse it. */
export async function fetchIlostatLongTermUnemployment(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<IlostatLtuResult> {
  const sourceUrl = opts.sourceUrl ?? ilostatLtuUrl(COUNTRIES.map((country) => country.iso3))
  const response = await fetch(sourceUrl, {
    // The ILO endpoint answers 500 "languageTag1" to the `Accept-Language: *`
    // that Node's fetch sends by default, so a concrete tag is required.
    headers: { Accept: 'application/vnd.sdmx.data+csv;version=1.0.0', 'Accept-Language': 'en' },
  })
  if (!response.ok) throw new Error(`ILOSTAT: HTTP ${response.status}`)
  const csv = await response.text()
  return parseIlostatLongTermUnemployment(csv, opts.retrievedAt ?? new Date().toISOString(), sourceUrl)
}
