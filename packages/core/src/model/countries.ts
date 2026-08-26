/**
 * Countries, and the frame they belong to.
 *
 * `reference` is the original ten-country prototype set. It defines the
 * normalization frame: the minimum and maximum of every indicator are computed
 * over these ten and nothing else.
 *
 * `extended` countries are scored against that same fixed frame. Adding one
 * does not move anybody else's score, which is what makes the benchmark
 * extensible. An extended country can fall outside the frame, in which case its
 * score clamps to 0 or 100 and the cell is flagged out of frame.
 *
 * See docs/DECISIONS.md D16, which supersedes D2.
 */
export const COUNTRIES = [
  { iso3: 'BRA', name: 'Brazil', frame: 'reference', reason: 'Primary reference case; large, diverse upper-middle-income democracy' },
  { iso3: 'USA', name: 'United States', frame: 'reference', reason: 'High innovation and agency; large-scale institutional complexity' },
  { iso3: 'NLD', name: 'Netherlands', frame: 'reference', reason: 'Strong institutions, coordination and social trust' },
  { iso3: 'CHE', name: 'Switzerland', frame: 'reference', reason: 'Highly decentralized but unusually coordinated system' },
  { iso3: 'SGP', name: 'Singapore', frame: 'reference', reason: 'High-capacity, highly coordinated small state' },
  { iso3: 'KOR', name: 'South Korea', frame: 'reference', reason: 'Rapid development, technology adoption and execution capacity' },
  { iso3: 'EST', name: 'Estonia', frame: 'reference', reason: 'Small state known for digital institutional experimentation' },
  { iso3: 'IND', name: 'India', frame: 'reference', reason: 'Large, diverse emerging economy with significant bottom-up capability' },
  { iso3: 'CHL', name: 'Chile', frame: 'reference', reason: 'Latin American comparison with relatively strong institutions' },
  { iso3: 'ZAF', name: 'South Africa', frame: 'reference', reason: 'Unequal, institutionally complex middle-income comparison case' },

  { iso3: 'MEX', name: 'Mexico', frame: 'extended', reason: 'Second largest Latin American economy; deep manufacturing base tied to North America' },
  { iso3: 'ARG', name: 'Argentina', frame: 'extended', reason: 'Strong research and human capital against repeated macroeconomic rupture' },
  { iso3: 'COL', name: 'Colombia', frame: 'extended', reason: 'Large economy rebuilding state capacity after prolonged internal conflict' },
  { iso3: 'PER', name: 'Peru', frame: 'extended', reason: 'Sustained growth with persistent institutional instability and high informality' },
  { iso3: 'URY', name: 'Uruguay', frame: 'extended', reason: 'Small state with the strongest institutional trust in the region' },
  { iso3: 'CRI', name: 'Costa Rica', frame: 'extended', reason: 'Small state that moved into high-value manufacturing and services without an extractive base' },
] as const

export type CountryIso3 = (typeof COUNTRIES)[number]['iso3']
export type CountryFrame = (typeof COUNTRIES)[number]['frame']

export const COUNTRY_ISO3: string[] = COUNTRIES.map((c) => c.iso3)

/** The ten that define the normalization frame. Do not add to this list lightly. */
export const REFERENCE_ISO3: string[] = COUNTRIES.filter((c) => c.frame === 'reference').map(
  (c) => c.iso3,
)

export const EXTENDED_ISO3: string[] = COUNTRIES.filter((c) => c.frame === 'extended').map(
  (c) => c.iso3,
)

export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, c.name]),
)

export const COUNTRY_FRAMES: Record<string, CountryFrame> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, c.frame]),
)

/** Context series, never scored. Used only to test how far the benchmark tracks wealth. */
export const GDP_PER_CAPITA_CODE = 'NY.GDP.PCAP.PP.KD'
