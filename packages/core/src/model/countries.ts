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
  { iso3: 'DEU', name: 'Germany', frame: 'extended', reason: 'Large manufacturing economy coordinated through federal states and industry associations' },
  { iso3: 'FRA', name: 'France', frame: 'extended', reason: 'Centralized state with a long tradition of directing industrial policy' },
  { iso3: 'GBR', name: 'United Kingdom', frame: 'extended', reason: 'Services and finance concentration with weak recent productivity growth' },
  { iso3: 'ESP', name: 'Spain', frame: 'extended', reason: 'Southern European comparison with strong infrastructure delivery and high unemployment' },
  { iso3: 'POL', name: 'Poland', frame: 'extended', reason: 'Post-socialist convergence case that rebuilt institutions and industry together' },
  { iso3: 'SWE', name: 'Sweden', frame: 'extended', reason: 'High-trust Nordic state with an unusual mix of large firms and startups' },
  { iso3: 'FIN', name: 'Finland', frame: 'extended', reason: 'Small state with an institutionalized foresight function and strong measured learning' },
  { iso3: 'IRL', name: 'Ireland', frame: 'extended', reason: 'Small open economy whose output figures are distorted by foreign direct investment' },
  { iso3: 'CAN', name: 'Canada', frame: 'extended', reason: 'Resource-rich federal democracy with persistent productivity questions' },
  { iso3: 'AUS', name: 'Australia', frame: 'extended', reason: 'Resource exporter far from its markets, with high administrative capacity' },
  { iso3: 'JPN', name: 'Japan', frame: 'extended', reason: 'Aging high-capability manufacturer testing whether execution survives demographic decline' },
  { iso3: 'CHN', name: 'China', frame: 'extended', reason: 'State-directed development at continental scale, the clearest contrast to the reference set' },
  { iso3: 'IDN', name: 'Indonesia', frame: 'extended', reason: 'Large archipelago state coordinating across extreme geographic dispersion' },
  { iso3: 'VNM', name: 'Vietnam', frame: 'extended', reason: 'Fast industrial catch-up on a low income base' },
  { iso3: 'PHL', name: 'Philippines', frame: 'extended', reason: 'Services export and remittance economy with weak industrial depth' },
  { iso3: 'MYS', name: 'Malaysia', frame: 'extended', reason: 'Middle-income manufacturer testing the move into higher-value production' },
  { iso3: 'THA', name: 'Thailand', frame: 'extended', reason: 'The middle-income trap as a case: strong assembly, thin innovation, aging fast' },
  { iso3: 'TUR', name: 'Turkey', frame: 'extended', reason: 'Industrial middle power with repeated macroeconomic instability' },
  { iso3: 'ISR', name: 'Israel', frame: 'extended', reason: 'Small state with the highest venture density in the world and deep civil divisions' },
  { iso3: 'ARE', name: 'United Arab Emirates', frame: 'extended', reason: 'State-led diversification away from oil, executed quickly and from the top' },
  { iso3: 'NGA', name: 'Nigeria', frame: 'extended', reason: 'Largest African economy, with capability concentrated outside the state' },
  { iso3: 'KEN', name: 'Kenya', frame: 'extended', reason: 'East African digital finance leader, where a private rail reached population scale' },
  { iso3: 'RWA', name: 'Rwanda', frame: 'extended', reason: 'Small state with a strong delivery reputation and a narrow political base' },
  { iso3: 'ETH', name: 'Ethiopia', frame: 'extended', reason: 'Large low-income state attempting state-led industrialization under conflict' },
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
