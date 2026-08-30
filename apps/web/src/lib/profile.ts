import { DIMENSIONS, DIMENSION_LABELS, primaryMomentum } from '@ncb/core'
import type { CountryResult, Dimension } from '@ncb/core'

/**
 * The slice of a country a radar needs.
 *
 * Pages load the full `CountryResult` on the server, which carries every
 * indicator row for every dimension. Sending 16 of those into a client bundle
 * to draw nine points each is waste, so the server hands over this instead.
 */
export type RadarProfile = {
  iso3: string
  country: string
  values: Array<number | null>
  confidences: Array<number | null>
}

export function toProfile(c: CountryResult): RadarProfile {
  return {
    iso3: c.iso3,
    country: c.country,
    values: DIMENSIONS.map((d) => c.dimensions[d]?.score ?? null),
    confidences: DIMENSIONS.map((d) => c.dimensions[d]?.confidence ?? null),
  }
}

/**
 * A radar profile plus the one number the radar does not carry: where each
 * dimension is heading.
 *
 * The flag histogram reads a country on hover, and a score with no direction
 * invites the reader to treat it as permanent. The trend is the primary
 * momentum span, computed on the indicators observed at both ends, which is a
 * smaller basket than the score. See D22 and D24.
 */
export type HistogramProfile = RadarProfile & {
  deltas: Array<number | null>
}

export function toHistogramProfile(c: CountryResult): HistogramProfile {
  return {
    ...toProfile(c),
    deltas: DIMENSIONS.map((d) => {
      const dim = c.dimensions[d]
      return dim ? primaryMomentum(dim.momentum)?.delta ?? null : null
    }),
  }
}

/** One country's furthest-apart capabilities. */
export type CapabilitySpread = {
  iso3: string
  country: string
  high: { dimension: Dimension; label: string; value: number }
  low: { dimension: Dimension; label: string; value: number }
  /** Score points between the two. */
  range: number
}

/**
 * The country whose capabilities sit furthest apart.
 *
 * One number per country is what this benchmark refuses to publish, and the
 * cheapest proof that the refusal is not a pose is a country that sits near the
 * top of one capability and near the floor of another. The front page states
 * that case rather than asserting the principle. Ties break on the country code
 * so the sentence holds still between two runs of the same data.
 */
export function widestSpread(profiles: RadarProfile[]): CapabilitySpread | null {
  let best: CapabilitySpread | null = null

  for (const profile of profiles) {
    let high: { dimension: Dimension; label: string; value: number } | null = null
    let low: { dimension: Dimension; label: string; value: number } | null = null

    DIMENSIONS.forEach((dimension, i) => {
      const value = profile.values[i]
      if (value === null || value === undefined) return
      const point = { dimension, label: DIMENSION_LABELS[dimension], value }
      if (high === null || value > high.value) high = point
      if (low === null || value < low.value) low = point
    })

    if (high === null || low === null) continue
    const ends = { high: high as CapabilitySpread['high'], low: low as CapabilitySpread['low'] }
    const range = ends.high.value - ends.low.value
    if (best === null || range > best.range) {
      best = { iso3: profile.iso3, country: profile.country, ...ends, range }
    }
  }

  return best
}
