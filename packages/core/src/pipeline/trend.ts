import { INDICATORS_BY_ID, indicatorsFor, isScored } from '../model/index.js'
import type { Dimension, IndicatorDef, Momentum, Observation, SourceTier } from '../model/index.js'
import { applyTransform, scoreAgainstFrame } from './normalize.js'
import type { Frame } from './normalize.js'
import { mean, round } from './stats.js'

/**
 * Momentum: what a dimension score would have been ten years ago, measured the
 * same way it is measured today.
 *
 * Two rules make the number mean something. Both are decisions, not details.
 *
 * 1. **One ruler.** Historical values are scored against the frame built from
 *    every country's current values. The scale does not move, so a
 *    change in the score is a change in the country. A country that was far
 *    outside today's frame clamps at 0 or 100 and the clamp is counted.
 *
 * 2. **A matched basket.** Only indicators observed in both years are used, and
 *    the same basket is used for every year in between. Without this, a
 *    dimension that gained an indicator would show movement that belongs to the
 *    dataset rather than to the country. The basket score is therefore not the
 *    headline score, and it is reported with the count so the two are never
 *    confused.
 *
 * See docs/DECISIONS.md D22.
 */
export type MomentumOptions = {
  /** Year the current end of the comparison sits at. */
  currentYear: number
  /** How far back the comparison reaches. */
  span?: number
  /** An observation counts for a snapshot year while it is no older than this. */
  maxAge?: number
  /** Below this many matched indicators, no momentum is reported. */
  minMatched?: number
  /**
   * The basket must also cover at least this share of the indicators the
   * country has a current value for, so a trend is never read off a corner of
   * the dimension.
   */
  minShare?: number
}

type Series = Array<{ year: number; value: number; tier: SourceTier }>

/** indicatorId -> iso3 -> observations, newest first. */
type History = Map<string, Map<string, Series>>

function push(history: History, o: Observation) {
  const { indicatorId, iso3, year, value } = o
  const byCountry = history.get(indicatorId) ?? new Map<string, Series>()
  const series = byCountry.get(iso3) ?? []
  series.push({ year, value, tier: o.sourceTier })
  byCountry.set(iso3, series)
  history.set(indicatorId, byCountry)
}

export function buildHistory(observations: Observation[]): History {
  const history: History = new Map()
  for (const o of observations) {
    if (o.geometry === 'national') push(history, o)
  }
  for (const byCountry of history.values()) {
    for (const series of byCountry.values()) series.sort((a, b) => b.year - a.year)
  }
  return history
}

/** The value in force at `year`, provided it is not older than `maxAge`. */
function asOf(series: Series | undefined, year: number, maxAge: number): Series[number] | null {
  if (!series) return null
  for (const point of series) {
    if (point.year > year) continue
    return year - point.year <= maxAge ? point : null
  }
  return null
}

function normalizedAt(
  def: IndicatorDef,
  history: History,
  iso3: string,
  year: number,
  maxAge: number,
  frame: Frame,
): { normalized: number; outOfFrame: boolean } | null {
  const point = asOf(history.get(def.id)?.get(iso3), year, maxAge)
  if (!point) return null

  let denominator: number | null = null
  if (def.denominatorSeries) {
    const denom = asOf(
      history.get(`__denominator__${def.denominatorSeries}`)?.get(iso3),
      year,
      maxAge,
    )
    if (!denom) return null
    denominator = denom.value
  }

  const transformed = applyTransform(def, point.value, denominator)
  if (transformed === null || !Number.isFinite(transformed)) return null

  const scored = scoreAgainstFrame(transformed, frame, def.direction)
  return { normalized: scored.normalized, outOfFrame: scored.outOfFrame }
}

export function momentumFor(
  history: History,
  frames: Map<string, Frame>,
  iso3: string,
  dimension: Dimension,
  opts: MomentumOptions,
): Momentum | null {
  const span = opts.span ?? 10
  const maxAge = opts.maxAge ?? 5
  const minMatched = opts.minMatched ?? 2
  const minShare = opts.minShare ?? 0.5
  const baseYear = opts.currentYear - span

  const defs = indicatorsFor(dimension).filter(
    (d) => isScored(d) && frames.has(d.id),
  )

  const basket: string[] = []
  let clamped = 0
  let current = 0
  for (const def of defs) {
    const frame = frames.get(def.id) as Frame
    const base = normalizedAt(def, history, iso3, baseYear, maxAge, frame)
    const now = normalizedAt(def, history, iso3, opts.currentYear, maxAge, frame)
    if (now) current += 1
    if (!base || !now) continue
    if (base.outOfFrame || now.outOfFrame) clamped += 1
    basket.push(def.id)
  }
  if (basket.length < minMatched) return null
  if (current > 0 && basket.length / current < minShare) return null

  const scoreAt = (year: number): number | null => {
    const values: number[] = []
    for (const id of basket) {
      const def = INDICATORS_BY_ID[id] as IndicatorDef
      const cell = normalizedAt(def, history, iso3, year, maxAge, frames.get(id) as Frame)
      if (!cell) return null
      values.push(cell.normalized)
    }
    return round(mean(values), 1)
  }

  const baseScore = scoreAt(baseYear)
  const currentScore = scoreAt(opts.currentYear)
  if (baseScore === null || currentScore === null) return null

  const series: Momentum['series'] = []
  for (let year = baseYear; year <= opts.currentYear; year++) {
    const score = scoreAt(year)
    if (score !== null) series.push({ year, score })
  }

  return {
    baseYear,
    currentYear: opts.currentYear,
    baseScore,
    currentScore,
    delta: round(currentScore - baseScore, 1),
    matchedIndicators: basket.length,
    basket,
    clamped,
    series,
  }
}

/**
 * One indicator's whole observed history for one country, normalised against
 * the current frame.
 *
 * No matched basket is needed here, because there is nothing to match: a single
 * indicator is comparable with itself. That makes the indicator-level line reach
 * as far back as the data does, where a dimension-level trend is held to the
 * shallowest series it contains.
 */
export function indicatorSeries(
  history: History,
  frame: Frame | undefined,
  def: IndicatorDef,
  iso3: string,
): Array<{ year: number; raw: number; normalized: number; tier: SourceTier }> {
  if (!frame) return []
  const points = history.get(def.id)?.get(iso3)
  if (!points) return []

  const denominators = def.denominatorSeries
    ? history.get(`__denominator__${def.denominatorSeries}`)?.get(iso3)
    : undefined

  const out: Array<{ year: number; raw: number; normalized: number; tier: SourceTier }> = []
  for (const point of [...points].sort((a, b) => a.year - b.year)) {
    let denominator: number | null = null
    if (def.denominatorSeries) {
      /* Pair a value with its own year's denominator, never a later one. */
      const match = denominators?.find((d) => d.year === point.year)
      if (!match) continue
      denominator = match.value
    }
    const transformed = applyTransform(def, point.value, denominator)
    if (transformed === null || !Number.isFinite(transformed)) continue
    out.push({
      year: point.year,
      raw: round(point.value, 3),
      normalized: round(scoreAgainstFrame(transformed, frame, def.direction).normalized, 1),
      tier: point.tier,
    })
  }
  return out
}

/** The trend to show first: the shortest span that produced one. */
export function primaryMomentum(list: Momentum[]): Momentum | null {
  if (list.length === 0) return null
  const bySpan = [...list].sort(
    (a, b) => a.currentYear - a.baseYear - (b.currentYear - b.baseYear),
  )
  return bySpan[0] as Momentum
}

/** The distinct spans present across a set of momentum entries, shortest first. */
export function momentumSpansIn(lists: Momentum[][]): number[] {
  const spans = new Set<number>()
  for (const list of lists) {
    for (const m of list) spans.add(m.currentYear - m.baseYear)
  }
  return [...spans].sort((a, b) => a - b)
}
