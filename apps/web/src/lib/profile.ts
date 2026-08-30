import { DIMENSIONS, primaryMomentum } from '@ncb/core'
import type { CountryResult } from '@ncb/core'

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
