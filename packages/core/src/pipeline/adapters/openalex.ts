import {
  COUNTRIES,
  OPENALEX_CORPUS,
  OPENALEX_LICENCE,
  OPENALEX_PUBLISHER,
  OPENALEX_TOP10_ADAPTER_ID,
  OPENALEX_TOP10_FIELD,
  OPENALEX_WINDOW_FROM,
  OPENALEX_WINDOW_TO,
  OPENALEX_WORK_TYPES,
  OPENALEX_WORKS_URL,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import type { SourceAdapterResult } from './types.js'

/** The field works are assigned to countries by: any author's institution, whole counting. */
const COUNTRY_FIELD = 'authorships.institutions.country_code'

export type OpenAlexWindow = { from: number; to: number }

export const OPENALEX_WINDOW: OpenAlexWindow = { from: OPENALEX_WINDOW_FROM, to: OPENALEX_WINDOW_TO }

/** One country's counts in the window. */
export type OpenAlexCountryCounts = {
  /** Articles and reviews carrying a citation percentile, any author in the country. */
  works: number
  /** Of those, the works in the top 10% for their subfield and year. */
  top10: number
  /** Whether the counts came from the grouped call or from the per-country fallback. */
  via: 'group_by' | 'per_country'
}

/**
 * What one fetch saw, written beside the observations so a rescore never needs
 * the network and a later fetch can be diffed against it. OpenAlex has no
 * version parameter: this block is the pin. URLs are stored without the
 * `mailto` courtesy parameter or any API key, neither of which changes a count.
 */
export type OpenAlexPin = {
  adapterId: string
  retrievedAt: string
  window: OpenAlexWindow
  /** The year the pooled window is stamped with. */
  year: number
  corpus: string
  workTypes: string[]
  requests: {
    denominator: string
    numerator: string
    baselineWorks: string
    baselineTop10: string
    /** Per-country requests, only for countries the grouped calls did not return. */
    perCountry: string[]
  }
  /** `meta.count` of each grouped call: works matched before grouping. */
  totals: {
    denominatorMatched: number
    numeratorMatched: number
    baselineWorks: number
    baselineTop10: number
  }
  /** Top 10% share across every work with an institution country. */
  baselineShare: number
  counts: Record<string, OpenAlexCountryCounts>
}

export type OpenAlexResult = SourceAdapterResult & { pin: OpenAlexPin }

const round = (value: number, digits: number): number => {
  const scale = 10 ** digits
  return Math.round(value * scale) / scale
}

function filterFor(window: OpenAlexWindow, extra: string[]): string {
  return [
    `publication_year:${window.from}-${window.to}`,
    `type:${OPENALEX_WORK_TYPES.join('|')}`,
    ...extra,
  ].join(',')
}

const ANY_PERCENTILE = `${OPENALEX_TOP10_FIELD}:true|false`
const TOP10 = `${OPENALEX_TOP10_FIELD}:true`

/**
 * The canonical requests, without courtesy parameters. `true|false` on the
 * percentile flag restricts the denominator to works that have a percentile,
 * which drops the few with no FWCI from both sides of the ratio.
 */
export function openAlexRequests(window: OpenAlexWindow = OPENALEX_WINDOW) {
  const grouped = (flag: string) =>
    `${OPENALEX_WORKS_URL}?filter=${filterFor(window, [flag])}&group_by=${COUNTRY_FIELD}&per_page=200&corpus=${OPENALEX_CORPUS}`
  const count = (extra: string[]) =>
    `${OPENALEX_WORKS_URL}?filter=${filterFor(window, extra)}&per_page=1&select=id&corpus=${OPENALEX_CORPUS}`
  return {
    denominator: grouped(ANY_PERCENTILE),
    numerator: grouped(TOP10),
    baselineWorks: count([ANY_PERCENTILE, `${COUNTRY_FIELD}:!null`]),
    baselineTop10: count([TOP10, `${COUNTRY_FIELD}:!null`]),
    country: (iso2: string, top10: boolean) =>
      count([`${COUNTRY_FIELD}:${iso2}`, top10 ? TOP10 : ANY_PERCENTILE]),
  }
}

/** Grouped counts keyed by ISO alpha-2. OpenAlex keys a country as a URL ending in its code. */
export function parseCountryGroups(body: unknown): Map<string, number> {
  const groups = (body as { group_by?: Array<{ key?: unknown; count?: unknown }> }).group_by
  if (!Array.isArray(groups)) throw new Error('OpenAlex: grouped response has no group_by array')
  const out = new Map<string, number>()
  for (const group of groups) {
    if (typeof group.key !== 'string' || typeof group.count !== 'number') continue
    const code = group.key.slice(group.key.lastIndexOf('/') + 1).toUpperCase()
    if (/^[A-Z]{2}$/.test(code)) out.set(code, group.count)
  }
  return out
}

function metaCount(body: unknown): number {
  const count = (body as { meta?: { count?: unknown } }).meta?.count
  if (typeof count !== 'number' || !Number.isFinite(count)) throw new Error('OpenAlex: response has no meta.count')
  return count
}

/**
 * Turn a pin into observations. Pure: the value is the country's top 10%
 * share divided by the share across all country-affiliated works in the same
 * window, so 1 is the affiliated-world average. A country with no works is
 * held, never given a value.
 */
export function buildOpenAlexObservations(pin: OpenAlexPin): OpenAlexResult {
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const observations: Observation[] = []
  const available: string[] = []
  const held: string[] = []
  const requests = openAlexRequests(pin.window)
  for (const country of COUNTRIES) {
    const counts = pin.counts[country.iso3]
    if (!counts) continue
    available.push(country.iso3)
    if (counts.works <= 0 || counts.top10 < 0 || counts.top10 > counts.works) {
      held.push(country.iso3)
      continue
    }
    const share = counts.top10 / counts.works
    observations.push({
      indicatorId: 'research_citation_impact',
      iso3: country.iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: round(share / pin.baselineShare, 3),
      year: pin.year,
      sourceTier: 'academic_survey',
      sourceUrl: requests.country(country.iso2, true),
      retrievedAt: pin.retrievedAt,
      note: [
        `${OPENALEX_PUBLISHER} works ${pin.window.from}-${pin.window.to}, ${pin.workTypes.join(' and ')}, whole counting by institution country`,
        `${counts.top10} of ${counts.works} works in the top 10% for their subfield and year (${round(100 * share, 2)}%)`,
        `affiliated-world share ${round(100 * pin.baselineShare, 2)}%`,
        `retrieved ${pin.retrievedAt.slice(0, 10)}; OpenAlex recomputes citations continuously, so a later fetch drifts`,
        `${OPENALEX_LICENCE}, source: OpenAlex.`,
      ].join('; '),
    })
  }
  return {
    adapterId: OPENALEX_TOP10_ADAPTER_ID,
    observations,
    availableCountries: available.sort(),
    emittedCountries: observations.map((observation) => observation.iso3).sort(),
    heldCountries: held.sort(),
    unmappedLabels: Object.keys(pin.counts).filter((iso3) => !benchmark.has(iso3)).sort(),
    sourceUrl: pin.requests.denominator,
    release: `openalex-api-${pin.retrievedAt.slice(0, 10)}`,
    pin,
  }
}

export type OpenAlexFetchOptions = {
  retrievedAt?: string
  /** Sent as the `mailto` courtesy parameter on every request, never stored. */
  mailto?: string
  /** Sent as a bearer token, never in a URL and never stored. */
  apiKey?: string
  window?: OpenAlexWindow
  fetchImpl?: typeof fetch
}

/**
 * Fetch the window: two grouped calls and two baseline counts. Every
 * benchmark country must appear in both grouped results. A grouped page holds
 * at most 200 countries, so any benchmark country missing from either is
 * fetched on its own with two plain counts, and the fetch fails if a country
 * is still missing after that.
 */
export async function fetchOpenAlexCitationImpact(opts: OpenAlexFetchOptions = {}): Promise<OpenAlexResult> {
  const window = opts.window ?? OPENALEX_WINDOW
  const retrievedAt = opts.retrievedAt ?? new Date().toISOString()
  const doFetch = opts.fetchImpl ?? fetch
  const requests = openAlexRequests(window)

  const get = async (url: string): Promise<unknown> => {
    const target = opts.mailto ? `${url}&mailto=${encodeURIComponent(opts.mailto)}` : url
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (opts.apiKey) headers.Authorization = `Bearer ${opts.apiKey}`
    const response = await doFetch(target, { headers })
    if (response.status === 429) {
      throw new Error('OpenAlex: HTTP 429, the daily budget or the 100 requests a second limit is spent. Retry after midnight UTC or set OPENALEX_API_KEY.')
    }
    if (!response.ok) throw new Error(`OpenAlex: HTTP ${response.status} for ${url}`)
    return response.json()
  }

  const denominatorBody = await get(requests.denominator)
  const numeratorBody = await get(requests.numerator)
  const baselineWorks = metaCount(await get(requests.baselineWorks))
  const baselineTop10 = metaCount(await get(requests.baselineTop10))
  if (baselineWorks <= 0) throw new Error('OpenAlex: the affiliated-world baseline is empty')

  const works = parseCountryGroups(denominatorBody)
  const top10 = parseCountryGroups(numeratorBody)
  const counts: Record<string, OpenAlexCountryCounts> = {}
  const perCountry: string[] = []
  for (const country of COUNTRIES) {
    const w = works.get(country.iso2)
    const t = top10.get(country.iso2)
    if (w !== undefined && t !== undefined) {
      counts[country.iso3] = { works: w, top10: t, via: 'group_by' }
      continue
    }
    const worksUrl = requests.country(country.iso2, false)
    const top10Url = requests.country(country.iso2, true)
    perCountry.push(worksUrl, top10Url)
    counts[country.iso3] = {
      works: metaCount(await get(worksUrl)),
      top10: metaCount(await get(top10Url)),
      via: 'per_country',
    }
  }
  const missing = COUNTRIES.filter((country) => !counts[country.iso3]).map((country) => country.iso3)
  if (missing.length > 0) throw new Error(`OpenAlex: no counts for ${missing.join(', ')}`)

  return buildOpenAlexObservations({
    adapterId: OPENALEX_TOP10_ADAPTER_ID,
    retrievedAt,
    window,
    year: window.to,
    corpus: OPENALEX_CORPUS,
    workTypes: [...OPENALEX_WORK_TYPES],
    requests: {
      denominator: requests.denominator,
      numerator: requests.numerator,
      baselineWorks: requests.baselineWorks,
      baselineTop10: requests.baselineTop10,
      perCountry,
    },
    totals: {
      denominatorMatched: metaCount(denominatorBody),
      numeratorMatched: metaCount(numeratorBody),
      baselineWorks,
      baselineTop10,
    },
    baselineShare: baselineTop10 / baselineWorks,
    counts,
  })
}
