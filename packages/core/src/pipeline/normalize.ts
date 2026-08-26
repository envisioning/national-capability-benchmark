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
 * Min-max across the test countries to 0-100, reversed for lower-is-better
 * indicators. The scale is relative to this ten-country panel by design: the
 * benchmark compares these countries to each other, not to an absolute frontier.
 */
export function normalizeToScale(
  values: number[],
  direction: 'higher_better' | 'lower_better',
): number[] {
  if (values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return values.map(() => 50)
  return values.map((v) => {
    const unit = (v - min) / (max - min)
    return 100 * (direction === 'higher_better' ? unit : 1 - unit)
  })
}
