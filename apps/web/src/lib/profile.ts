import { DIMENSIONS } from '@ncb/core'
import type { CountryResult } from '@ncb/core'

/**
 * The country the viewer leads with.
 *
 * This is a viewer choice and it changes no number. Brazil is the primary
 * reference case in `countries.ts`, and the work this benchmark supports is
 * Brazil first. Everybody else is reached through a comparison or the grid.
 */
export const FOCUS_ISO3 = 'BRA'

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
