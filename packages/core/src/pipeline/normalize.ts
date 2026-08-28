import { quantile } from './stats.js'
import type { IndicatorDef } from '../model/schema.js'

/**
 * Tukey fences at k interquartile ranges. k = 3 clips only extreme outliers,
 * which is what the spec asks for: winsorize if necessary, not by default.
 * With ten countries a percentile rule would always clip the top and bottom
 * country, which would destroy exactly the variation the benchmark is testing.
 */
export function tukeyFences(values: number[], k: number): { lo: number; hi: number } {
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const spread = q3 - q1
  return { lo: q1 - k * spread, hi: q3 + k * spread }
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
 * The normalization frame: the fences and the endpoints, computed once from
 * every country's values and then applied to all of them.
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
 * Build the frame from every country's values.
 *
 * Everything downstream is measured against this, and every country that is
 * measured against it also helped set it. Adding a country therefore moves the
 * frame, which is a rebase and a major version bump rather than a routine data
 * load. See docs/DECISIONS.md D47, which supersedes D16.
 */
export function buildFrame(values: number[], k = 3): Frame | null {
  if (values.length < 2) return null
  const { lo, hi } = tukeyFences(values, k)
  const clipped = values.map((v) => Math.min(hi, Math.max(lo, v)))
  return { lo, hi, min: Math.min(...clipped), max: Math.max(...clipped) }
}

export type Scored = {
  /** The value after winsorizing against the frame's fences. */
  transformed: number
  /** 0 to 100 against the frame, clamped. */
  normalized: number
  winsorized: boolean
  /** True when the raw value sat outside the frame and was clamped. */
  outOfFrame: boolean
}

/**
 * Score one value against the frame, reversing lower-is-better indicators.
 *
 * A current value cannot fall outside a frame its own country helped build. A
 * historical value can, and so can a value that arrives after the frame was
 * fixed for a published version. Either one clamps to 0 or 100 and is flagged.
 * Clamping is preferred over moving an endpoint between runs, because moving it
 * would change what every published number means.
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
