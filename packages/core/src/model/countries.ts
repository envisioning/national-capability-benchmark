/** The ten prototype countries. ISO 3166-1 alpha-3 is the primary key everywhere. */
export const COUNTRIES = [
  { iso3: 'BRA', name: 'Brazil', reason: 'Primary reference case; large, diverse upper-middle-income democracy' },
  { iso3: 'USA', name: 'United States', reason: 'High innovation and agency; large-scale institutional complexity' },
  { iso3: 'NLD', name: 'Netherlands', reason: 'Strong institutions, coordination and social trust' },
  { iso3: 'CHE', name: 'Switzerland', reason: 'Highly decentralized but unusually coordinated system' },
  { iso3: 'SGP', name: 'Singapore', reason: 'High-capacity, highly coordinated small state' },
  { iso3: 'KOR', name: 'South Korea', reason: 'Rapid development, technology adoption and execution capacity' },
  { iso3: 'EST', name: 'Estonia', reason: 'Small state known for digital institutional experimentation' },
  { iso3: 'IND', name: 'India', reason: 'Large, diverse emerging economy with significant bottom-up capability' },
  { iso3: 'CHL', name: 'Chile', reason: 'Latin American comparison with relatively strong institutions' },
  { iso3: 'ZAF', name: 'South Africa', reason: 'Unequal, institutionally complex middle-income comparison case' },
] as const

export type CountryIso3 = (typeof COUNTRIES)[number]['iso3']

export const COUNTRY_ISO3: CountryIso3[] = COUNTRIES.map((c) => c.iso3)

export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, c.name]),
)

/** Context series, never scored. Used only to test how far the benchmark tracks wealth. */
export const GDP_PER_CAPITA_CODE = 'NY.GDP.PCAP.PP.KD'
