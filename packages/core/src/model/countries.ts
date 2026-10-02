/**
 * Countries.
 *
 * Every country in this list sets the normalization frame and is scored
 * against it. There is no privileged subset: an indicator's Tukey fences and
 * its 0 and 100 endpoints are computed over all of them together. Adding a
 * country therefore moves the scale and restates every published score, which
 * is why a country addition is a major version bump and an announced rebase.
 *
 * `iso2` is the ISO 3166-1 alpha-2 code. It exists so the flag emoji can be
 * derived from it, and it is the only place either code is written down.
 *
 * See docs/DECISIONS.md D47, which supersedes D16.
 */
/**
 * The shared reason of every country the 9.0.0 frame completion added. The
 * completion chose by rule, so the rule is what a reader is told. See D153.
 */
const COMPLETION_REASON =
  'Added in the 9.0.0 completion, which takes every country of a million people or more that is measurable in all nine capabilities'

export const COUNTRIES = [
  { iso3: 'BRA', iso2: 'BR', name: 'Brazil', reason: 'Primary reference case; large, diverse upper-middle-income democracy' },
  { iso3: 'USA', iso2: 'US', name: 'United States', reason: 'High innovation and agency; large-scale institutional complexity' },
  { iso3: 'NLD', iso2: 'NL', name: 'Netherlands', reason: 'Strong institutions, coordination and social trust' },
  { iso3: 'CHE', iso2: 'CH', name: 'Switzerland', reason: 'Highly decentralized but unusually coordinated system' },
  { iso3: 'SGP', iso2: 'SG', name: 'Singapore', reason: 'High-capacity, highly coordinated small state' },
  { iso3: 'KOR', iso2: 'KR', name: 'South Korea', reason: 'Rapid development, technology adoption and execution capacity' },
  { iso3: 'EST', iso2: 'EE', name: 'Estonia', reason: 'Small state known for digital institutional experimentation' },
  { iso3: 'IND', iso2: 'IN', name: 'India', reason: 'Large, diverse emerging economy with significant bottom-up capability' },
  { iso3: 'CHL', iso2: 'CL', name: 'Chile', reason: 'Latin American comparison with relatively strong institutions' },
  { iso3: 'ZAF', iso2: 'ZA', name: 'South Africa', reason: 'Unequal, institutionally complex middle-income comparison case' },
  { iso3: 'MEX', iso2: 'MX', name: 'Mexico', reason: 'Second largest Latin American economy; deep manufacturing base tied to North America' },
  { iso3: 'ARG', iso2: 'AR', name: 'Argentina', reason: 'Strong research and human capital against repeated macroeconomic rupture' },
  { iso3: 'COL', iso2: 'CO', name: 'Colombia', reason: 'Large economy rebuilding state capacity after prolonged internal conflict' },
  { iso3: 'PER', iso2: 'PE', name: 'Peru', reason: 'Sustained growth with persistent institutional instability and high informality' },
  { iso3: 'URY', iso2: 'UY', name: 'Uruguay', reason: 'Small state with the strongest institutional trust in the region' },
  { iso3: 'CRI', iso2: 'CR', name: 'Costa Rica', reason: 'Small state that moved into high-value manufacturing and services without an extractive base' },
  { iso3: 'DEU', iso2: 'DE', name: 'Germany', reason: 'Large manufacturing economy coordinated through federal states and industry associations' },
  { iso3: 'FRA', iso2: 'FR', name: 'France', reason: 'Centralized state with a long tradition of directing industrial policy' },
  { iso3: 'GBR', iso2: 'GB', name: 'United Kingdom', reason: 'Services and finance concentration with weak recent productivity growth' },
  { iso3: 'ESP', iso2: 'ES', name: 'Spain', reason: 'Southern European comparison with strong infrastructure delivery and high unemployment' },
  { iso3: 'PRT', iso2: 'PT', name: 'Portugal', reason: 'Southern European comparison with strong social trust and a long convergence path' },
  { iso3: 'POL', iso2: 'PL', name: 'Poland', reason: 'Post-socialist convergence case that rebuilt institutions and industry together' },
  { iso3: 'SWE', iso2: 'SE', name: 'Sweden', reason: 'High-trust Nordic state with an unusual mix of large firms and startups' },
  { iso3: 'FIN', iso2: 'FI', name: 'Finland', reason: 'Small state with an institutionalized foresight function and strong measured learning' },
  { iso3: 'IRL', iso2: 'IE', name: 'Ireland', reason: 'Small open economy whose output figures are distorted by foreign direct investment' },
  { iso3: 'CAN', iso2: 'CA', name: 'Canada', reason: 'Resource-rich federal democracy with persistent productivity questions' },
  { iso3: 'AUS', iso2: 'AU', name: 'Australia', reason: 'Resource exporter far from its markets, with high administrative capacity' },
  { iso3: 'JPN', iso2: 'JP', name: 'Japan', reason: 'Aging high-capability manufacturer testing whether execution survives demographic decline' },
  { iso3: 'CHN', iso2: 'CN', name: 'China', reason: 'State-directed development at continental scale, the clearest contrast to the rest of the set' },
  { iso3: 'IDN', iso2: 'ID', name: 'Indonesia', reason: 'Large archipelago state coordinating across extreme geographic dispersion' },
  { iso3: 'VNM', iso2: 'VN', name: 'Vietnam', reason: 'Fast industrial catch-up on a low income base' },
  { iso3: 'PHL', iso2: 'PH', name: 'Philippines', reason: 'Services export and remittance economy with weak industrial depth' },
  { iso3: 'MYS', iso2: 'MY', name: 'Malaysia', reason: 'Middle-income manufacturer testing the move into higher-value production' },
  { iso3: 'THA', iso2: 'TH', name: 'Thailand', reason: 'The middle-income trap as a case: strong assembly, thin innovation, aging fast' },
  { iso3: 'TUR', iso2: 'TR', name: 'Turkey', reason: 'Industrial middle power with repeated macroeconomic instability' },
  { iso3: 'ISR', iso2: 'IL', name: 'Israel', reason: 'Small state with the highest venture density in the world and deep civil divisions' },
  { iso3: 'ARE', iso2: 'AE', name: 'United Arab Emirates', reason: 'State-led diversification away from oil, executed quickly and from the top' },
  { iso3: 'NGA', iso2: 'NG', name: 'Nigeria', reason: 'Largest African economy, with capability concentrated outside the state' },
  { iso3: 'KEN', iso2: 'KE', name: 'Kenya', reason: 'East African digital finance leader, where a private rail reached population scale' },
  { iso3: 'RWA', iso2: 'RW', name: 'Rwanda', reason: 'Small state with a strong delivery reputation and a narrow political base' },
  { iso3: 'ETH', iso2: 'ET', name: 'Ethiopia', reason: 'Large low-income state attempting state-led industrialization under conflict' },
  /* The Latin American completion, added together in the 4.0.0 rebase so the
   * region the project serves first is covered whole rather than sampled. See
   * D51. Sparse data on some of these is expected and is published as thin
   * confidence rather than hidden. */
  { iso3: 'BOL', iso2: 'BO', name: 'Bolivia', reason: 'Resource-dependent landlocked state with strong social movements and weak formal institutions' },
  { iso3: 'PRY', iso2: 'PY', name: 'Paraguay', reason: 'Landlocked agro-exporter with a small state and fast recent growth' },
  { iso3: 'ECU', iso2: 'EC', name: 'Ecuador', reason: 'Dollarized oil exporter cycling through repeated institutional redesigns' },
  { iso3: 'VEN', iso2: 'VE', name: 'Venezuela', reason: 'State collapse case; the sparse recent data is itself the finding' },
  { iso3: 'PAN', iso2: 'PA', name: 'Panama', reason: 'Services and logistics hub built around a single asset it operates well' },
  { iso3: 'GTM', iso2: 'GT', name: 'Guatemala', reason: 'Largest Central American economy with a chronically underfunded state' },
  { iso3: 'HND', iso2: 'HN', name: 'Honduras', reason: 'Low-capacity state where remittances stand in for absent institutions' },
  { iso3: 'SLV', iso2: 'SV', name: 'El Salvador', reason: 'Small state undergoing a centralized security-led institutional rebuild' },
  { iso3: 'NIC', iso2: 'NI', name: 'Nicaragua', reason: 'Authoritarian consolidation case with thinning independent statistics' },
  { iso3: 'DOM', iso2: 'DO', name: 'Dominican Republic', reason: 'Fast-growing tourism and services economy with weak public delivery' },
  { iso3: 'CUB', iso2: 'CU', name: 'Cuba', reason: 'State-run system outside most international statistical programs, so coverage is thin by design' },
  { iso3: 'HTI', iso2: 'HT', name: 'Haiti', reason: 'State breakdown case; shows what the frame floor looks like' },
  /* The frame completion, added together in the 9.0.0 rebase by one rule:
   * every World Bank economy of at least one million people that reaches
   * MIN_INDICATORS_FOR_SCORE in all nine dimensions on the 8.3.0 registry.
   * The rule is the reason, so every entry carries the same one rather than
   * a case sentence per country. Ordered by population, largest first. See
   * D153 and docs/research/FRAME-EXPANSION.md. */
  { iso3: 'PAK', iso2: 'PK', name: 'Pakistan', reason: COMPLETION_REASON },
  { iso3: 'BGD', iso2: 'BD', name: 'Bangladesh', reason: COMPLETION_REASON },
  { iso3: 'RUS', iso2: 'RU', name: 'Russia', reason: COMPLETION_REASON },
  { iso3: 'EGY', iso2: 'EG', name: 'Egypt', reason: COMPLETION_REASON },
  { iso3: 'COD', iso2: 'CD', name: 'Democratic Republic of the Congo', reason: COMPLETION_REASON },
  { iso3: 'IRN', iso2: 'IR', name: 'Iran', reason: COMPLETION_REASON },
  { iso3: 'TZA', iso2: 'TZ', name: 'Tanzania', reason: COMPLETION_REASON },
  { iso3: 'ITA', iso2: 'IT', name: 'Italy', reason: COMPLETION_REASON },
  { iso3: 'MMR', iso2: 'MM', name: 'Myanmar', reason: COMPLETION_REASON },
  { iso3: 'SDN', iso2: 'SD', name: 'Sudan', reason: COMPLETION_REASON },
  { iso3: 'UGA', iso2: 'UG', name: 'Uganda', reason: COMPLETION_REASON },
  { iso3: 'IRQ', iso2: 'IQ', name: 'Iraq', reason: COMPLETION_REASON },
  { iso3: 'AGO', iso2: 'AO', name: 'Angola', reason: COMPLETION_REASON },
  { iso3: 'UKR', iso2: 'UA', name: 'Ukraine', reason: COMPLETION_REASON },
  { iso3: 'MAR', iso2: 'MA', name: 'Morocco', reason: COMPLETION_REASON },
  { iso3: 'UZB', iso2: 'UZ', name: 'Uzbekistan', reason: COMPLETION_REASON },
  { iso3: 'MOZ', iso2: 'MZ', name: 'Mozambique', reason: COMPLETION_REASON },
  { iso3: 'GHA', iso2: 'GH', name: 'Ghana', reason: COMPLETION_REASON },
  { iso3: 'MDG', iso2: 'MG', name: 'Madagascar', reason: COMPLETION_REASON },
  { iso3: 'CIV', iso2: 'CI', name: 'Côte d\'Ivoire', reason: COMPLETION_REASON },
  { iso3: 'NPL', iso2: 'NP', name: 'Nepal', reason: COMPLETION_REASON },
  { iso3: 'MLI', iso2: 'ML', name: 'Mali', reason: COMPLETION_REASON },
  { iso3: 'BFA', iso2: 'BF', name: 'Burkina Faso', reason: COMPLETION_REASON },
  { iso3: 'MWI', iso2: 'MW', name: 'Malawi', reason: COMPLETION_REASON },
  { iso3: 'ZMB', iso2: 'ZM', name: 'Zambia', reason: COMPLETION_REASON },
  { iso3: 'LKA', iso2: 'LK', name: 'Sri Lanka', reason: COMPLETION_REASON },
  { iso3: 'KAZ', iso2: 'KZ', name: 'Kazakhstan', reason: COMPLETION_REASON },
  { iso3: 'ROU', iso2: 'RO', name: 'Romania', reason: COMPLETION_REASON },
  { iso3: 'ZWE', iso2: 'ZW', name: 'Zimbabwe', reason: COMPLETION_REASON },
  { iso3: 'GIN', iso2: 'GN', name: 'Guinea', reason: COMPLETION_REASON },
  { iso3: 'BDI', iso2: 'BI', name: 'Burundi', reason: COMPLETION_REASON },
  { iso3: 'TUN', iso2: 'TN', name: 'Tunisia', reason: COMPLETION_REASON },
  { iso3: 'BEL', iso2: 'BE', name: 'Belgium', reason: COMPLETION_REASON },
  { iso3: 'JOR', iso2: 'JO', name: 'Jordan', reason: COMPLETION_REASON },
  { iso3: 'CZE', iso2: 'CZ', name: 'Czechia', reason: COMPLETION_REASON },
  { iso3: 'TJK', iso2: 'TJ', name: 'Tajikistan', reason: COMPLETION_REASON },
  { iso3: 'PNG', iso2: 'PG', name: 'Papua New Guinea', reason: COMPLETION_REASON },
  { iso3: 'GRC', iso2: 'GR', name: 'Greece', reason: COMPLETION_REASON },
  { iso3: 'AZE', iso2: 'AZ', name: 'Azerbaijan', reason: COMPLETION_REASON },
  { iso3: 'HUN', iso2: 'HU', name: 'Hungary', reason: COMPLETION_REASON },
  { iso3: 'AUT', iso2: 'AT', name: 'Austria', reason: COMPLETION_REASON },
  { iso3: 'BLR', iso2: 'BY', name: 'Belarus', reason: COMPLETION_REASON },
  { iso3: 'LAO', iso2: 'LA', name: 'Laos', reason: COMPLETION_REASON },
  { iso3: 'KGZ', iso2: 'KG', name: 'Kyrgyzstan', reason: COMPLETION_REASON },
  { iso3: 'SRB', iso2: 'RS', name: 'Serbia', reason: COMPLETION_REASON },
  { iso3: 'COG', iso2: 'CG', name: 'Republic of the Congo', reason: COMPLETION_REASON },
  { iso3: 'BGR', iso2: 'BG', name: 'Bulgaria', reason: COMPLETION_REASON },
  { iso3: 'DNK', iso2: 'DK', name: 'Denmark', reason: COMPLETION_REASON },
  { iso3: 'LBN', iso2: 'LB', name: 'Lebanon', reason: COMPLETION_REASON },
  { iso3: 'NOR', iso2: 'NO', name: 'Norway', reason: COMPLETION_REASON },
  { iso3: 'SVK', iso2: 'SK', name: 'Slovakia', reason: COMPLETION_REASON },
  { iso3: 'NZL', iso2: 'NZ', name: 'New Zealand', reason: COMPLETION_REASON },
  { iso3: 'GEO', iso2: 'GE', name: 'Georgia', reason: COMPLETION_REASON },
  { iso3: 'HRV', iso2: 'HR', name: 'Croatia', reason: COMPLETION_REASON },
  { iso3: 'MNG', iso2: 'MN', name: 'Mongolia', reason: COMPLETION_REASON },
  { iso3: 'BIH', iso2: 'BA', name: 'Bosnia and Herzegovina', reason: COMPLETION_REASON },
  { iso3: 'NAM', iso2: 'NA', name: 'Namibia', reason: COMPLETION_REASON },
  { iso3: 'ARM', iso2: 'AM', name: 'Armenia', reason: COMPLETION_REASON },
  { iso3: 'LTU', iso2: 'LT', name: 'Lithuania', reason: COMPLETION_REASON },
  { iso3: 'JAM', iso2: 'JM', name: 'Jamaica', reason: COMPLETION_REASON },
  { iso3: 'GMB', iso2: 'GM', name: 'Gambia', reason: COMPLETION_REASON },
  { iso3: 'BWA', iso2: 'BW', name: 'Botswana', reason: COMPLETION_REASON },
  { iso3: 'LSO', iso2: 'LS', name: 'Lesotho', reason: COMPLETION_REASON },
  { iso3: 'MDA', iso2: 'MD', name: 'Moldova', reason: COMPLETION_REASON },
  { iso3: 'ALB', iso2: 'AL', name: 'Albania', reason: COMPLETION_REASON },
  { iso3: 'GNB', iso2: 'GW', name: 'Guinea-Bissau', reason: COMPLETION_REASON },
  { iso3: 'SVN', iso2: 'SI', name: 'Slovenia', reason: COMPLETION_REASON },
  { iso3: 'LVA', iso2: 'LV', name: 'Latvia', reason: COMPLETION_REASON },
  { iso3: 'MKD', iso2: 'MK', name: 'North Macedonia', reason: COMPLETION_REASON },
  { iso3: 'CYP', iso2: 'CY', name: 'Cyprus', reason: COMPLETION_REASON },
  { iso3: 'TTO', iso2: 'TT', name: 'Trinidad and Tobago', reason: COMPLETION_REASON },
  { iso3: 'MUS', iso2: 'MU', name: 'Mauritius', reason: COMPLETION_REASON },
] as const

export type CountryIso3 = (typeof COUNTRIES)[number]['iso3']

export const COUNTRY_ISO3: string[] = COUNTRIES.map((c) => c.iso3)

/**
 * Latin America, complete: every sovereign country from Mexico south, in
 * alphabetical iso3 order. One definition, so every regional surface counts
 * the same set. See D51.
 */
export const LATAM_ISO3: string[] = [
  'ARG', 'BOL', 'BRA', 'CHL', 'COL', 'CRI', 'CUB', 'DOM', 'ECU', 'GTM',
  'HND', 'HTI', 'MEX', 'NIC', 'PAN', 'PER', 'PRY', 'SLV', 'URY', 'VEN',
]

export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, c.name]),
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
