import { COUNTRY_NAMES, DIMENSIONS, EVIDENCE_STATUS_LABELS } from '@ncb/core'
import type { Dimension, EvidenceStatus, Lang } from '@ncb/core'
import {
  countryLayer,
  layerSection,
  servesLanguage,
  type CountryLayer,
  type LayerSection,
  type LayerSectionId,
} from '@/lib/layers'

/**
 * Where a named thing lives in the viewer. One rule per kind of thing, so a
 * country named in a bullet, in a table and in a heading all reach the same
 * page, and a new page moves every reference to it at once.
 */

/** Every country in the benchmark, each drawn as its nine-dimension shape. */
export const countriesHref = '/countries'

/** The full country profile. Ground layer, English. */
export const countryProfileHref = (iso3: string): string => `/country/${iso3}`

/** The local destination view for countries that have one. */
export const countryLocalHref = (iso3: string): string =>
  `${countryProfileHref(iso3.toUpperCase())}/local`

/**
 * Whether this country has a local destination view.
 *
 * A local reading is one section of a country layer, so the layer registry
 * answers this. A country without a layer never gets a link to a page that
 * answers that it does not exist. See D69.
 */
export const hasLocalDestination = (iso3: string): boolean => {
  const layer = countryLayer(iso3)
  return layer ? layerSection(layer, 'local') !== null : false
}

/** The front page of one country's layer. */
export const countryLayerHref = (layer: CountryLayer): string => `/${layer.slug}`

/**
 * One section of one layer.
 *
 * A section with a slug lives inside the layer. A section without one is still
 * a ground-layer page that the layer links to, so the address comes from the
 * helper that owns it. See D69.
 */
export function layerSectionHref(layer: CountryLayer, section: LayerSection): string {
  if (section.slug) return `${countryLayerHref(layer)}/${section.slug}`
  const ground: Record<LayerSectionId, string> = {
    agenda: agendaHref(layer.iso3),
    institutions: institutionNetworkHref(layer.iso3),
    local: countryLocalHref(layer.iso3),
    support: supportHref,
  }
  return ground[section.id]
}

/**
 * Two to four countries read side by side.
 *
 * The address carries the whole selection, so a comparison is a thing a reader
 * can send to somebody else. The first code is the reference country: it keeps
 * the filled shape and every other column is read as a difference from it. See
 * D70.
 */
export const compareBaseHref = '/compare'

/** One reference country plus at most three others. */
export const COMPARE_MAX = 4

/** Drop repeats while keeping the order the caller asked for. */
function uniqueCodes(codes: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const code of codes) {
    const upper = code.toUpperCase()
    if (seen.has(upper)) continue
    seen.add(upper)
    out.push(upper)
  }
  return out
}

/**
 * The canonical address for one selection. Codes are joined with hyphens in
 * the order given, so `/compare/BRA-IDN` and `/compare/IDN-BRA` are different
 * readings of the same pair and each says which country is the reference.
 */
export function compareHref(iso3s: readonly string[]): string {
  const codes = uniqueCodes(iso3s).slice(0, COMPARE_MAX)
  return codes.length === 0 ? compareBaseHref : `${compareBaseHref}/${codes.join('-')}`
}

/**
 * Read a selection out of the path.
 *
 * A hand-written address is expected here, so the parser is forgiving in the
 * ways a person is: hyphens, slashes and commas all separate, case does not
 * matter, and anything that is not a country in the registry is dropped rather
 * than raised. What survives is capped at `COMPARE_MAX`, because a fifth column
 * is a table and this page is a comparison.
 */
export function readCompareCodes(segments: readonly string[] | undefined): string[] {
  const raw = (segments ?? []).flatMap((segment) =>
    decodeURIComponent(segment).split(/[-,+\s]+/),
  )
  const known = raw
    .map((code) => code.toUpperCase())
    .filter((code) => /^[A-Z]{3}$/.test(code) && code in COUNTRY_NAMES)
  return uniqueCodes(known).slice(0, COMPARE_MAX)
}

/** The methodology overview. */
export const methodHref = '/method'

/** The indicator registry, scored rows and declared gaps together. */
export const indicatorsHref = '/indicators'

/** The tests the model runs against itself, wealth sensitivity included. */
export const diagnosticsHref = '/diagnostics'

/** The public statement of what the benchmark is for. */
export const thesisHref = '/thesis'

/** Stable fragment for one dimension's score on a country profile. */
export const scoreAnchorHref = (iso3: string, dimension: Dimension): string =>
  `${countryProfileHref(iso3)}#score-${dimension}`

/** Full DOM id for a score cell, useful when several country cells are present. */
export const scoreAnchorId = (iso3: string, dimension: Dimension): string =>
  `score-${dimension}-${iso3.toUpperCase()}`

/** A spreadsheet export containing one country's score row. */
export const countryCsvHref = (iso3: string): string => `/country/${iso3}.csv`

/** The directory of the nine capability pages. */
export const capabilitiesHref = '/capabilities'

/** The canonical landing page for one capability. */
export const capabilityHref = (dimension: Dimension): string =>
  `${capabilitiesHref}/${dimension}`

/** Static social card for a country profile. */
export const ogCountryHref = (iso3: string): string => `/og/country/${iso3}`

/** Static social card for a capability distribution. */
export const ogDimensionHref = (dimension: Dimension): string => `/og/dimension/${dimension}`

/** Static social card for one country's capability agenda. */
export const ogAgendaHref = (iso3: string): string => `/og/agenda/${iso3}`

/** One country's capability agenda. Ground layer, English. */
export const agendaHref = (iso3: string): string => `/country/${iso3.toUpperCase()}/agenda`

/**
 * Where one country's agenda can be read in one language, or null when it
 * cannot.
 *
 * A lexicon can render any country, but only a country with a layer in that
 * language has a page for it, and that page is inside the layer. Nothing else
 * is published twice. See D69.
 */
export function agendaHrefInLanguage(iso3: string, lang: Lang): string | null {
  if (lang === 'en') return agendaHref(iso3)
  if (!servesLanguage(iso3, lang)) return null
  const layer = countryLayer(iso3)
  const section = layer ? layerSection(layer, 'agenda') : null
  return layer && section ? layerSectionHref(layer, section) : null
}

/** Embeddable radar for one country profile. */
export const embedCountryHref = (iso3: string): string =>
  `/embed/country/${iso3.toUpperCase()}`

/** Embeddable distribution for one country on one capability. */
export const embedCompareHref = (iso3: string, dimension: Dimension): string =>
  `/embed/compare/${iso3.toUpperCase()}/${dimension}`

/** Embeddable three-part agenda for one country. */
export const embedAgendaHref = (iso3: string): string =>
  `/embed/agenda/${iso3.toUpperCase()}`

/** The registry row for one indicator, declared gaps included. */
export const indicatorHref = (id: string): string => `/indicators#${id}`

/** Every term this project defines, in one place. */
export const glossaryHref = '/glossary'

/**
 * How the patterns list is narrowed.
 *
 * The filters live in the query string, so a reader who has narrowed the list
 * to one country or to the reversals can send that view to somebody else. The
 * server reads the same shape it writes, which is why the parse and the build
 * sit together here. See D46.
 */
export type PatternFilters = {
  /** Free text over the record, its mechanism and its publisher. */
  query: string
  /** One country, by ISO3. Empty means every country. */
  iso3: string
  /** One dimension id. Empty means every dimension. */
  dimension: string
  /** A status, `reversal` for the two ways a delivery is lost, or `all`. */
  status: 'all' | 'reversal' | EvidenceStatus
  /** Only records that carry a mechanism. */
  mechanismOnly: boolean
}

export const NO_PATTERN_FILTERS: PatternFilters = {
  query: '',
  iso3: '',
  dimension: '',
  status: 'all',
  mechanismOnly: false,
}

/** Longest search a link may carry. Anything past this is somebody else's bug. */
const MAX_QUERY = 120

type RawParams = Record<string, string | string[] | undefined>

function one(params: RawParams, key: string): string {
  const value = params[key]
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

/**
 * Read filters out of a query string. Anything unrecognised is dropped, so a
 * hand-edited or stale link renders the full list rather than an error.
 */
export function readPatternFilters(params: RawParams): PatternFilters {
  const iso3 = one(params, 'country').toUpperCase()
  const dimension = one(params, 'dimension')
  const status = one(params, 'status')
  const known =
    status === 'reversal' || status in EVIDENCE_STATUS_LABELS ? (status as PatternFilters['status']) : 'all'
  return {
    query: one(params, 'q').slice(0, MAX_QUERY),
    iso3: /^[A-Z]{3}$/.test(iso3) ? iso3 : '',
    dimension: (DIMENSIONS as readonly string[]).includes(dimension) ? dimension : '',
    status: known,
    mechanismOnly: one(params, 'mechanism') === '1',
  }
}

/** The query string for a set of filters. Defaults are omitted, so a clean list has a clean URL. */
export function patternFiltersQuery(filters: PatternFilters): string {
  const params = new URLSearchParams()
  if (filters.query.trim()) params.set('q', filters.query.trim().slice(0, MAX_QUERY))
  if (filters.iso3) params.set('country', filters.iso3)
  if (filters.dimension) params.set('dimension', filters.dimension)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.mechanismOnly) params.set('mechanism', '1')
  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * The agenda index, narrowed or whole.
 *
 * The page carries a table over the same delivery corpus /patterns groups into
 * cards, so it reads and writes the same filter contract. One parser, one
 * builder, two surfaces. See D46.
 */
export const agendasHref = (filters: PatternFilters = NO_PATTERN_FILTERS): string =>
  `/agenda${patternFiltersQuery(filters)}`

/** The list of documented deliveries, narrowed or whole. */
export const patternsHref = (filters: PatternFilters = NO_PATTERN_FILTERS): string =>
  `/patterns${patternFiltersQuery(filters)}`

/**
 * One evidence record, on its own page.
 *
 * A case study is a citable thing, so it gets an address rather than an anchor
 * inside a long list. The record id is the slug. See D46.
 */
export const evidenceHref = (recordId: string): string => `/patterns/${recordId}`

/** What would overturn the model, and how to file an objection. */
export const challengeHref = '/challenge'

/** The public machine-readable distribution feed. */
export const feedHref = '/feed.xml'

/** The crawl map for the public viewer. */
export const sitemapHref = '/sitemap.xml'

/** The crawler policy for the public viewer. */
export const robotsHref = '/robots.txt'

/** One dated country-of-the-week digest. */
export const digestHref = (date: string): string => `/digest/${date}.html`

const DEFAULT_SITE_ORIGIN = 'https://ncb.envisioning.com'

/** The canonical origin used in machine-readable links. */
export const siteOrigin = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_ORIGIN).replace(/\/+$/, '')

/** Turn a viewer path into a link that works outside the site. */
export const absoluteHref = (path: string): string => `${siteOrigin()}${path}`

/** One public dispute record. */
export const challengeDetailHref = (id: string): string =>
  `${challengeHref}/${encodeURIComponent(id)}`

/** The endpoint used by the score challenge form. */
export const challengeApiHref = (iso3: string, dimension: Dimension): string =>
  `/api/challenge/${encodeURIComponent(iso3)}/${encodeURIComponent(dimension)}`

/** What the benchmark is, who built it, and where to start reading. */
export const aboutHref = '/about'

/** The human-readable release history for the dataset and viewer. */
export const changelogHref = '/changelog'

/** One release entry inside the changelog. */
export const changelogReleaseHref = (version: string): string =>
  `${changelogHref}#${version.replace(/[^0-9]+/g, '-').replace(/^-|-$/g, '')}`

/**
 * How an institution can back the work: use it, contribute to it, fund it.
 *
 * The ground-layer page is the comparative one and a country layer may hold a
 * second reading of it, written for that country's institutions and its own
 * funding venues. Both end at the same contact page. See D71.
 */
export const supportHref = '/support'

/**
 * The one place a reader writes to the project.
 *
 * Every invitation to get in touch, on either layer, points here. A second
 * form is a second inbox and a second thing to keep in sync. See D71.
 */
export const contactHref = '/contact'

/** The endpoint the contact form posts to. */
export const contactApiHref = '/api/contact'

/** Who publishes the data and how each series is fetched. */
export const sourcesHref = '/sources'

/** A country's explanatory map of institutions and their typed relationships. */
export const institutionNetworkHref = (iso3: string, lang: Lang = 'en'): string =>
  `/country/${iso3.toUpperCase()}/institutions`

/**
 * The id a publisher's row carries on the sources page, so a link can reach one
 * publisher rather than the whole table.
 */
export const publisherSlug = (publisher: string): string =>
  publisher.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** The known limits of the data, rendered from docs/KNOWN-ARTEFACTS.md. */
export const limitsHref = '/limits'

/** One artefact inside that document, by its id: A1, A12. */
export const artefactHref = (id: string): string => `${limitsHref}#${id}`

/** The decision log, rendered from docs/DECISIONS.md. */
export const decisionsHref = '/decisions'

/**
 * One decision inside that log, by its id: D16, D47.
 *
 * The documents cite each other by id all the way through. A bare id is only
 * useful to somebody holding the file, so it renders as a link to the entry.
 */
export const decisionHref = (id: string): string => `${decisionsHref}#${id}`

/** Whether one country's pages may render in one language. Re-exported so a page reads one module. */
export { servesLanguage }
