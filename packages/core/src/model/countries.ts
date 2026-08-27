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
 * `iso2` is the ISO 3166-1 alpha-2 code. It exists so the flag emoji can be
 * derived from it, and it is the only place either code is written down.
 *
 * See docs/DECISIONS.md D16, which supersedes D2.
 */
export const COUNTRIES = [
  { iso3: 'BRA', iso2: 'BR', name: 'Brazil', frame: 'reference', reason: 'Primary reference case; large, diverse upper-middle-income democracy' },
  { iso3: 'USA', iso2: 'US', name: 'United States', frame: 'reference', reason: 'High innovation and agency; large-scale institutional complexity' },
  { iso3: 'NLD', iso2: 'NL', name: 'Netherlands', frame: 'reference', reason: 'Strong institutions, coordination and social trust' },
  { iso3: 'CHE', iso2: 'CH', name: 'Switzerland', frame: 'reference', reason: 'Highly decentralized but unusually coordinated system' },
  { iso3: 'SGP', iso2: 'SG', name: 'Singapore', frame: 'reference', reason: 'High-capacity, highly coordinated small state' },
  { iso3: 'KOR', iso2: 'KR', name: 'South Korea', frame: 'reference', reason: 'Rapid development, technology adoption and execution capacity' },
  { iso3: 'EST', iso2: 'EE', name: 'Estonia', frame: 'reference', reason: 'Small state known for digital institutional experimentation' },
  { iso3: 'IND', iso2: 'IN', name: 'India', frame: 'reference', reason: 'Large, diverse emerging economy with significant bottom-up capability' },
  { iso3: 'CHL', iso2: 'CL', name: 'Chile', frame: 'reference', reason: 'Latin American comparison with relatively strong institutions' },
  { iso3: 'ZAF', iso2: 'ZA', name: 'South Africa', frame: 'reference', reason: 'Unequal, institutionally complex middle-income comparison case' },

  { iso3: 'MEX', iso2: 'MX', name: 'Mexico', frame: 'extended', reason: 'Second largest Latin American economy; deep manufacturing base tied to North America' },
  { iso3: 'ARG', iso2: 'AR', name: 'Argentina', frame: 'extended', reason: 'Strong research and human capital against repeated macroeconomic rupture' },
  { iso3: 'COL', iso2: 'CO', name: 'Colombia', frame: 'extended', reason: 'Large economy rebuilding state capacity after prolonged internal conflict' },
  { iso3: 'PER', iso2: 'PE', name: 'Peru', frame: 'extended', reason: 'Sustained growth with persistent institutional instability and high informality' },
  { iso3: 'URY', iso2: 'UY', name: 'Uruguay', frame: 'extended', reason: 'Small state with the strongest institutional trust in the region' },
  { iso3: 'CRI', iso2: 'CR', name: 'Costa Rica', frame: 'extended', reason: 'Small state that moved into high-value manufacturing and services without an extractive base' },
  { iso3: 'DEU', iso2: 'DE', name: 'Germany', frame: 'extended', reason: 'Large manufacturing economy coordinated through federal states and industry associations' },
  { iso3: 'FRA', iso2: 'FR', name: 'France', frame: 'extended', reason: 'Centralized state with a long tradition of directing industrial policy' },
  { iso3: 'GBR', iso2: 'GB', name: 'United Kingdom', frame: 'extended', reason: 'Services and finance concentration with weak recent productivity growth' },
  { iso3: 'ESP', iso2: 'ES', name: 'Spain', frame: 'extended', reason: 'Southern European comparison with strong infrastructure delivery and high unemployment' },
  { iso3: 'POL', iso2: 'PL', name: 'Poland', frame: 'extended', reason: 'Post-socialist convergence case that rebuilt institutions and industry together' },
  { iso3: 'SWE', iso2: 'SE', name: 'Sweden', frame: 'extended', reason: 'High-trust Nordic state with an unusual mix of large firms and startups' },
  { iso3: 'FIN', iso2: 'FI', name: 'Finland', frame: 'extended', reason: 'Small state with an institutionalized foresight function and strong measured learning' },
  { iso3: 'IRL', iso2: 'IE', name: 'Ireland', frame: 'extended', reason: 'Small open economy whose output figures are distorted by foreign direct investment' },
  { iso3: 'CAN', iso2: 'CA', name: 'Canada', frame: 'extended', reason: 'Resource-rich federal democracy with persistent productivity questions' },
  { iso3: 'AUS', iso2: 'AU', name: 'Australia', frame: 'extended', reason: 'Resource exporter far from its markets, with high administrative capacity' },
  { iso3: 'JPN', iso2: 'JP', name: 'Japan', frame: 'extended', reason: 'Aging high-capability manufacturer testing whether execution survives demographic decline' },
  { iso3: 'CHN', iso2: 'CN', name: 'China', frame: 'extended', reason: 'State-directed development at continental scale, the clearest contrast to the reference set' },
  { iso3: 'IDN', iso2: 'ID', name: 'Indonesia', frame: 'extended', reason: 'Large archipelago state coordinating across extreme geographic dispersion' },
  { iso3: 'VNM', iso2: 'VN', name: 'Vietnam', frame: 'extended', reason: 'Fast industrial catch-up on a low income base' },
  { iso3: 'PHL', iso2: 'PH', name: 'Philippines', frame: 'extended', reason: 'Services export and remittance economy with weak industrial depth' },
  { iso3: 'MYS', iso2: 'MY', name: 'Malaysia', frame: 'extended', reason: 'Middle-income manufacturer testing the move into higher-value production' },
  { iso3: 'THA', iso2: 'TH', name: 'Thailand', frame: 'extended', reason: 'The middle-income trap as a case: strong assembly, thin innovation, aging fast' },
  { iso3: 'TUR', iso2: 'TR', name: 'Turkey', frame: 'extended', reason: 'Industrial middle power with repeated macroeconomic instability' },
  { iso3: 'ISR', iso2: 'IL', name: 'Israel', frame: 'extended', reason: 'Small state with the highest venture density in the world and deep civil divisions' },
  { iso3: 'ARE', iso2: 'AE', name: 'United Arab Emirates', frame: 'extended', reason: 'State-led diversification away from oil, executed quickly and from the top' },
  { iso3: 'NGA', iso2: 'NG', name: 'Nigeria', frame: 'extended', reason: 'Largest African economy, with capability concentrated outside the state' },
  { iso3: 'KEN', iso2: 'KE', name: 'Kenya', frame: 'extended', reason: 'East African digital finance leader, where a private rail reached population scale' },
  { iso3: 'RWA', iso2: 'RW', name: 'Rwanda', frame: 'extended', reason: 'Small state with a strong delivery reputation and a narrow political base' },
  { iso3: 'ETH', iso2: 'ET', name: 'Ethiopia', frame: 'extended', reason: 'Large low-income state attempting state-led industrialization under conflict' },
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

export const COUNTRY_ISO2: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, c.iso2]),
)

/**
 * The flag emoji for a country, built from its alpha-2 code.
 *
 * A flag emoji is two regional indicator symbols, one per letter, so the code
 * is the data and the emoji is computed. Returns an empty string for an
 * unknown code, because a flag is decoration beside a name and never the name
 * itself.
 */
export const countryFlag = (iso3: string): string => {
  const iso2 = COUNTRY_ISO2[iso3]
  if (!iso2) return ''
  return String.fromCodePoint(
    ...[...iso2].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  )
}

export const COUNTRY_FLAGS: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, countryFlag(c.iso3)]),
)

/** Context series, never scored. Used only to test how far the benchmark tracks wealth. */
export const GDP_PER_CAPITA_CODE = 'NY.GDP.PCAP.PP.KD'
