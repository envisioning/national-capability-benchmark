import { DIMENSIONS, EVIDENCE_STATUS_LABELS } from '@ncb/core'
import type { Dimension, EvidenceStatus, Lang } from '@ncb/core'

/**
 * Where a named thing lives in the viewer. One rule per kind of thing, so a
 * country named in a bullet, in a table and in a heading all reach the same
 * page, and a new page moves every reference to it at once.
 */

/** The full country profile. Ground layer, English. */
export const countryProfileHref = (iso3: string): string => `/country/${iso3}`

/** The local destination view for countries that have one. */
export const countryLocalHref = (iso3: string): string =>
  `${countryProfileHref(iso3.toUpperCase())}/local`

/** The methodology overview. */
export const methodHref = '/method'

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

/** One country's capability agenda, in the language the reader is already in. */
export const agendaHref = (iso3: string, lang: Lang = 'en'): string =>
  lang === 'pt-BR'
    ? `/country/${iso3.toUpperCase()}/agenda?lang=pt-BR`
    : `/country/${iso3.toUpperCase()}/agenda`

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

const DEFAULT_SITE_ORIGIN = 'https://ncb-envisioning.vercel.app'

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

/** Methodology pages that share the secondary nav under the header. */
export const METHOD_SECTION_HREFS = [
  '/method',
  '/indicators',
  '/sources',
  '/diagnostics',
  '/delphi',
  '/patterns',
  '/limits',
  '/decisions',
  '/glossary',
] as const

export type MethodSectionHref = (typeof METHOD_SECTION_HREFS)[number]

/** Ordered walk through how the benchmark is built and audited. */
export const METHOD_SUBNAV: { href: MethodSectionHref; label: string }[] = [
  { href: '/method', label: 'Overview' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/sources', label: 'Sources' },
  { href: '/diagnostics', label: 'Diagnostics' },
  { href: '/delphi', label: 'Delphi panel' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/limits', label: 'Limits' },
  { href: '/decisions', label: 'Decisions' },
  { href: '/glossary', label: 'Glossary' },
]

/** Whether the current path belongs to the method section. */
export function isMethodSection(pathname: string): boolean {
  return METHOD_SECTION_HREFS.some(
    (href) => pathname === href || (href !== '/method' && pathname.startsWith(`${href}/`)),
  )
}

/** Which method subnav entry owns the current path. */
export function methodSubnavOwns(href: MethodSectionHref, pathname: string): boolean {
  if (href === '/method') return pathname === '/method'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Primary nav: reader lenses plus the method hub and challenge entry. */
export const PRIMARY_NAV = [
  { href: '/', label: 'Countries' },
  { href: capabilitiesHref, label: 'Capabilities' },
  { href: '/agenda', label: 'Agendas' },
  { href: '/method', label: 'Method' },
  { href: challengeHref, label: 'Challenge' },
  { href: aboutHref, label: 'About' },
] as const

export type PrimaryNavHref = (typeof PRIMARY_NAV)[number]['href']

/** Whether a primary nav entry owns the current path. */
export function primaryNavOwns(href: PrimaryNavHref, pathname: string): boolean {
  if (href === '/') {
    return pathname === '/' || pathname.startsWith('/country')
  }
  if (href === capabilitiesHref) {
    return pathname === capabilitiesHref || pathname.startsWith(`${capabilitiesHref}/`)
  }
  if (href === '/agenda') {
    return (
      pathname === '/agenda' ||
      pathname.startsWith('/agenda/') ||
      pathname === '/pt/agenda' ||
      pathname.startsWith('/pt/agenda/')
    )
  }
  if (href === '/method') {
    return isMethodSection(pathname)
  }
  if (href === aboutHref) {
    return pathname === aboutHref
  }
  if (href === challengeHref) {
    return pathname === challengeHref
  }
  return pathname === href
}

/** Footer columns: same destinations as the header, grouped for a vertical layout. */
export const FOOTER_NAV_GROUPS = [
  {
    label: 'Explore',
    items: PRIMARY_NAV.filter((entry) => entry.href !== '/method' && entry.href !== challengeHref),
  },
  { label: 'Method', items: METHOD_SUBNAV },
  {
    label: 'Participate',
    items: [{ href: challengeHref, label: 'Challenge' }],
  },
] as const

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

/**
 * The same page in the other language, where one exists.
 *
 * Language switching is not navigation: the Portuguese edition mirrors the
 * interpretation-layer pages that have been translated, so the switch is
 * contextual and appears only where a counterpart page exists. One rule here,
 * one control in the layout, no per-page switch links. See D35.
 */
export function languageCounterpart(
  pathname: string,
  search = '',
): { href: string; label: string; lang: Lang } | null {
  if (pathname === '/' || pathname === '') {
    const portuguese = new URLSearchParams(search).get('lang')?.toLowerCase() === 'pt-br'
    return portuguese
      ? { href: '/?lang=en', label: 'English', lang: 'en' }
      : { href: '/pt', label: 'Português', lang: 'pt-BR' }
  }
  if (pathname === '/pt') return { href: '/?lang=en', label: 'English', lang: 'en' }
  /* The Portuguese edition's reading of the agendas starts at /pt. */
  if (pathname === '/agenda') return { href: '/pt', label: 'Português', lang: 'pt-BR' }
  const agenda = pathname.match(/^\/agenda\/([A-Z]{3})$/)
  if (agenda) return { href: `/pt/agenda/${agenda[1]}`, label: 'Português', lang: 'pt-BR' }
  const ptAgenda = pathname.match(/^\/pt\/agenda\/([A-Z]{3})$/)
  if (ptAgenda) return { href: `/agenda/${ptAgenda[1]}`, label: 'English', lang: 'en' }
  if (pathname === '/pt/agenda') return { href: '/agenda', label: 'English', lang: 'en' }
  const countryAgenda = pathname.match(/^\/country\/([A-Z]{3})\/agenda$/)
  if (countryAgenda) {
    const portuguese = new URLSearchParams(search).get('lang')?.toLowerCase() === 'pt-br'
    return portuguese
      ? { href: `/country/${countryAgenda[1]}/agenda`, label: 'English', lang: 'en' }
      : { href: `/country/${countryAgenda[1]}/agenda?lang=pt-BR`, label: 'Português', lang: 'pt-BR' }
  }
  const credibility = pathname.match(/^\/(method|decisions|limits|glossary)$/)
  if (credibility) return { href: `/pt/${credibility[1]}`, label: 'Português', lang: 'pt-BR' }
  const ptCredibility = pathname.match(/^\/pt\/(method|decisions|limits|glossary)$/)
  if (ptCredibility) return { href: `/${ptCredibility[1]}`, label: 'English', lang: 'en' }
  return null
}
