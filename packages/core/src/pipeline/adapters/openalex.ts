import {
  COUNTRIES,
  OPENALEX_CORPUS,
  OPENALEX_HISTORY_FROM,
  OPENALEX_HISTORY_MIN_WORKS,
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
  /**
   * Whether the counts came from the grouped call or from the per-country
   * fallback. `group_absent` is a country missing from a grouped list that
   * holds every group, so its count is 0 without a further request.
   */
  via: 'group_by' | 'per_country' | 'group_absent'
}

/** The requests one window or one year was counted with, without courtesy parameters. */
export type OpenAlexRequestSet = {
  denominator: string
  numerator: string
  baselineWorks: string
  baselineTop10: string
  /** Per-country requests, only for countries the grouped calls did not return. */
  perCountry: string[]
}

/** `meta.count` of each grouped call: works matched before grouping. */
export type OpenAlexTotals = {
  denominatorMatched: number
  numeratorMatched: number
  baselineWorks: number
  baselineTop10: number
}

/** One publication year, counted on its own so any three-year window can be pooled from it. */
export type OpenAlexYearCounts = {
  year: number
  requests: OpenAlexRequestSet
  totals: OpenAlexTotals
  counts: Record<string, OpenAlexCountryCounts>
}

/**
 * The history behind the pinned window (D184): every publication year from
 * `from` to `to`, fetched on one date. A history value is a window pooled
 * from three of these years and never touches the pinned window's value.
 */
export type OpenAlexHistory = {
  retrievedAt: string
  from: number
  to: number
  years: OpenAlexYearCounts[]
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
  requests: OpenAlexRequestSet
  totals: OpenAlexTotals
  /** Top 10% share across every work with an institution country. */
  baselineShare: number
  counts: Record<string, OpenAlexCountryCounts>
  history?: OpenAlexHistory
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

/** The page size of a grouped call: a list shorter than this holds every group. */
const GROUP_PAGE = 200

/** True when a grouped response lists every group, so an absent country has no works. */
export function groupsComplete(body: unknown): boolean {
  const groupsCount = (body as { meta?: { groups_count?: unknown } }).meta?.groups_count
  return typeof groupsCount === 'number' && groupsCount < GROUP_PAGE
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
 * held, never given a value. The history (D184) adds one value per earlier
 * window, pooled from three history years, only for a country the pinned
 * window emits and only where the window pools at least
 * `OPENALEX_HISTORY_MIN_WORKS` works: the pinned value is never replaced or
 * carried.
 */
export function buildOpenAlexObservations(pin: OpenAlexPin): OpenAlexResult {
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const observations: Observation[] = []
  const available: string[] = []
  const held: string[] = []
  const emitted: string[] = []
  const observe = (
    country: (typeof COUNTRIES)[number],
    counts: { works: number; top10: number },
    window: OpenAlexWindow,
    baselineShare: number,
    retrievedAt: string,
  ): Observation => {
    const share = counts.top10 / counts.works
    return {
      indicatorId: 'research_citation_impact',
      iso3: country.iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: round(share / baselineShare, 3),
      year: window.to,
      sourceTier: 'academic_survey',
      sourceUrl: openAlexRequests(window).country(country.iso2, true),
      retrievedAt,
      note: [
        `${OPENALEX_PUBLISHER} works ${window.from}-${window.to}, ${pin.workTypes.join(' and ')}, whole counting by institution country`,
        `${counts.top10} of ${counts.works} works in the top 10% for their subfield and year (${round(100 * share, 2)}%)`,
        `affiliated-world share ${round(100 * baselineShare, 2)}%`,
        `retrieved ${retrievedAt.slice(0, 10)}; OpenAlex recomputes citations continuously, so a later fetch drifts`,
        `${OPENALEX_LICENCE}, source: OpenAlex.`,
      ].join('; '),
    }
  }
  for (const country of COUNTRIES) {
    const counts = pin.counts[country.iso3]
    if (!counts) continue
    available.push(country.iso3)
    if (counts.works <= 0 || counts.top10 < 0 || counts.top10 > counts.works) {
      held.push(country.iso3)
      continue
    }
    emitted.push(country.iso3)
    observations.push(observe(country, counts, pin.window, pin.baselineShare, pin.retrievedAt))
  }
  if (pin.history) {
    const span = pin.window.to - pin.window.from
    const byYear = new Map(pin.history.years.map((entry) => [entry.year, entry]))
    const emits = new Set(emitted)
    for (let end = pin.history.from + span; end < pin.window.to; end++) {
      const years = Array.from({ length: span + 1 }, (_, i) => byYear.get(end - span + i))
      if (years.some((entry) => !entry)) continue
      const pooled = years as OpenAlexYearCounts[]
      const baselineWorks = pooled.reduce((sum, entry) => sum + entry.totals.baselineWorks, 0)
      const baselineTop10 = pooled.reduce((sum, entry) => sum + entry.totals.baselineTop10, 0)
      if (baselineWorks <= 0) continue
      for (const country of COUNTRIES) {
        if (!emits.has(country.iso3)) continue
        const each = pooled.map((entry) => entry.counts[country.iso3])
        if (each.some((counts) => !counts)) continue
        const works = each.reduce((sum, counts) => sum + counts!.works, 0)
        const top10 = each.reduce((sum, counts) => sum + counts!.top10, 0)
        if (works < OPENALEX_HISTORY_MIN_WORKS || top10 < 0 || top10 > works) continue
        observations.push(
          observe(country, { works, top10 }, { from: end - span, to: end }, baselineTop10 / baselineWorks, pin.history.retrievedAt),
        )
      }
    }
  }
  observations.sort((a, b) => a.iso3.localeCompare(b.iso3) || a.year - b.year)
  return {
    adapterId: OPENALEX_TOP10_ADAPTER_ID,
    observations,
    availableCountries: available.sort(),
    emittedCountries: emitted.sort(),
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

type Get = (url: string) => Promise<unknown>

function getter(opts: OpenAlexFetchOptions): Get {
  const doFetch = opts.fetchImpl ?? fetch
  return async (url) => {
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
}

/**
 * Count one window: two grouped calls and two baseline counts. Every
 * benchmark country must appear in both grouped results. A grouped page holds
 * at most 200 countries. A country missing from a list that holds every group
 * has a count of 0; a country missing from a full page is fetched on its own
 * with two plain counts, and the fetch fails if a country is still missing
 * after that.
 */
async function countWindow(
  get: Get,
  window: OpenAlexWindow,
): Promise<{ requests: OpenAlexRequestSet; totals: OpenAlexTotals; counts: Record<string, OpenAlexCountryCounts> }> {
  const requests = openAlexRequests(window)
  const denominatorBody = await get(requests.denominator)
  const numeratorBody = await get(requests.numerator)
  const baselineWorks = metaCount(await get(requests.baselineWorks))
  const baselineTop10 = metaCount(await get(requests.baselineTop10))
  if (baselineWorks <= 0) throw new Error(`OpenAlex: the affiliated-world baseline is empty for ${window.from}-${window.to}`)

  const works = parseCountryGroups(denominatorBody)
  const top10 = parseCountryGroups(numeratorBody)
  const worksComplete = groupsComplete(denominatorBody)
  const top10Complete = groupsComplete(numeratorBody)
  const counts: Record<string, OpenAlexCountryCounts> = {}
  const perCountry: string[] = []
  for (const country of COUNTRIES) {
    const w = works.get(country.iso2) ?? (worksComplete ? 0 : undefined)
    const t = top10.get(country.iso2) ?? (top10Complete ? 0 : undefined)
    if (w !== undefined && t !== undefined) {
      const absent = !works.has(country.iso2) || !top10.has(country.iso2)
      counts[country.iso3] = { works: w, top10: t, via: absent ? 'group_absent' : 'group_by' }
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

  return {
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
    counts,
  }
}

/** Fetch the pinned window. A history already in `keepHistory` is carried into the new pin unchanged. */
export async function fetchOpenAlexCitationImpact(
  opts: OpenAlexFetchOptions & { keepHistory?: OpenAlexHistory } = {},
): Promise<OpenAlexResult> {
  const window = opts.window ?? OPENALEX_WINDOW
  const retrievedAt = opts.retrievedAt ?? new Date().toISOString()
  const { requests, totals, counts } = await countWindow(getter(opts), window)
  return buildOpenAlexObservations({
    adapterId: OPENALEX_TOP10_ADAPTER_ID,
    retrievedAt,
    window,
    year: window.to,
    corpus: OPENALEX_CORPUS,
    workTypes: [...OPENALEX_WORK_TYPES],
    requests,
    totals,
    baselineShare: totals.baselineTop10 / totals.baselineWorks,
    counts,
    ...(opts.keepHistory ? { history: opts.keepHistory } : {}),
  })
}

/**
 * Fetch every publication year from `OPENALEX_HISTORY_FROM` to the pinned
 * window's last year, four requests a year plus any fallback, and attach them
 * to an existing pin (D184). The pinned window's counts are not refetched, so
 * no pinned value moves. The last years overlap the pinned window and are
 * kept as a drift check against it; they emit no value of their own.
 */
export async function fetchOpenAlexHistory(
  pin: OpenAlexPin,
  opts: OpenAlexFetchOptions & { from?: number } = {},
): Promise<OpenAlexResult> {
  const from = opts.from ?? OPENALEX_HISTORY_FROM
  const retrievedAt = opts.retrievedAt ?? new Date().toISOString()
  const get = getter(opts)
  const years: OpenAlexYearCounts[] = []
  for (let year = from; year <= pin.window.to; year++) {
    years.push({ year, ...(await countWindow(get, { from: year, to: year })) })
  }
  return buildOpenAlexObservations({ ...pin, history: { retrievedAt, from, to: pin.window.to, years } })
}
