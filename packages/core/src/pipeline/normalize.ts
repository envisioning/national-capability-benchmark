import { quantile } from './stats.js'
import type { IndicatorDef } from '../model/schema.js'

export type Winsorized = { value: number; clipped: boolean }

/**
 * Tukey fences at k interquartile ranges. k = 3 clips only extreme outliers,
 * which is what the spec asks for: winsorize if necessary, not by default.
 * With ten countries a percentile rule would always clip the top and bottom
 * country, which would destroy exactly the variation the benchmark is testing.
 */
export function winsorize(values: number[], k = 3): Winsorized[] {
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const spread = q3 - q1
  const lo = q1 - k * spread
  const hi = q3 + k * spread
  return values.map((v) => {
    if (v < lo) return { value: lo, clipped: true }
    if (v > hi) return { value: hi, clipped: true }
    return { value: v, clipped: false }
  })
}

/** Apply the indicator's declared transform to a raw value. */
export function applyTransform(
  def: IndicatorDef,
  raw: number,
  denominator: number | null,
): number | null {
  switch (def.transform) {
    case 'none':
      return raw
    case 'log10':
      return raw > 0 ? Math.log10(raw) : 0
    case 'per_million_population':
      if (denominator === null || denominator <= 0) return null
      return (raw / denominator) * 1_000_000
    default:
      return raw
  }
}

/**
 * The normalization frame: the fences and the endpoints, computed once from the
 * reference countries and then applied to everybody.
 */
export type Frame = {
  /** Tukey fences, for winsorizing. */
  lo: number
  hi: number
  /** Endpoints of the 0 to 100 scale, after winsorizing. */
  min: number
  max: number
}

/**
 * Build the frame from the reference values only.
 *
 * Everything downstream is measured against this. That is what lets a new
 * country be added without moving anybody else's score, and it is why the
 * reference set has to stay fixed. See docs/DECISIONS.md D16.
 */
export function buildFrame(referenceValues: number[], k = 3): Frame | null {
  if (referenceValues.length < 2) return null
  const sorted = [...referenceValues].sort((a, b) => a - b)
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const spread = q3 - q1
  const lo = q1 - k * spread
  const hi = q3 + k * spread
  const clipped = referenceValues.map((v) => Math.min(hi, Math.max(lo, v)))
  return { lo, hi, min: Math.min(...clipped), max: Math.max(...clipped) }
}

export type Scored = {
  /** The value after winsorizing against the frame's fences. */
  transformed: number
  /** 0 to 100 against the frame, clamped. */
  normalized: number
  winsorized: boolean
  /** True when the raw value sat outside the reference frame and was clamped. */
  outOfFrame: boolean
}

/**
 * Score one value against the frame, reversing lower-is-better indicators.
 *
 * A country outside the frame clamps to 0 or 100 and is flagged. Clamping is
 * preferred over extending the scale because extending it would change what 0
 * and 100 mean, which is the thing this design exists to prevent.
 */
export function scoreAgainstFrame(
  value: number,
  frame: Frame,
  direction: 'higher_better' | 'lower_better',
): Scored {
  const winsorized = value < frame.lo || value > frame.hi
  const clipped = Math.min(frame.hi, Math.max(frame.lo, value))

  if (frame.max === frame.min) {
    return { transformed: clipped, normalized: 50, winsorized, outOfFrame: false }
  }

  const raw = (clipped - frame.min) / (frame.max - frame.min)
  const outOfFrame = raw < 0 || raw > 1
  const unit = Math.min(1, Math.max(0, raw))
  return {
    transformed: clipped,
    normalized: 100 * (direction === 'higher_better' ? unit : 1 - unit),
    winsorized,
    outOfFrame,
  }
}
