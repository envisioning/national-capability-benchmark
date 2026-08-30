import { COUNTRY_NAMES, DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import { countryLayer, hasInstitutionMap, layerBySlug } from '@/lib/layers'
import {
  aboutHref,
  agendaHref,
  capabilitiesHref,
  capabilityHref,
  challengeHref,
  changelogHref,
  compareBaseHref,
  countriesHref,
  countryLayerHref,
  countryLocalHref,
  countryProfileHref,
  hasLocalDestination,
  institutionNetworkHref,
  layerSectionHref,
  thesisHref,
} from '@/lib/links'

/**
 * The navigation tree.
 *
 * One tree, one ownership rule, one renderer. Every row the reader sees is a
 * level of this tree resolved against the current path, so a section cannot
 * light up in the header while a different rule decides what sits under it.
 * Before this there were three: a primary nav, a method subnav and a country
 * subnav, each with its own idea of what counted as current. See D73.
 *
 * The tree is four deep and never more:
 *
 *   1. the sections
 *   2. the country you are in
 *   3. which reading of it, where the project has written more than one
 *   4. the pages of that reading
 *
 * It reaches the reader as two bands, not four rows. Everything above the
 * deepest level is a breadcrumb, and the deepest level is a tab bar, so the
 * trail and the sibling pages never look alike. Countries has 52 children and
 * no control can show them, so its child is resolved from the path: the crumb
 * names the one country you are in. A country layer is a reading of that
 * country, beside the English one rather than under its pages. A country with
 * one reading skips level three entirely. See D69 and D73.
 */
export type NavNode = {
  href: string
  label: string
  /** Draw this country's flag before the label. */
  iso3?: string
  /** The language this node is written in, when it is not the site's English. */
  lang?: string
  /** Owns its own address only, never the paths under it. */
  exact?: boolean
  /** Paths this node owns beyond its own address and subtree. */
  claims?: (pathname: string) => boolean
  /** The row that opens under this node when it is the current one. */
  children?: NavNode[]
  /** The same, for a node whose children are too many to list. */
  resolveChildren?: (pathname: string) => NavNode[]
}

/** Whether one node is the current one for a path. */
export function nodeOwns(node: NavNode, pathname: string): boolean {
  const href = node.href.toLowerCase()
  const path = pathname.toLowerCase()
  if (path === href) return true
  if (node.claims?.(path)) return true
  if (node.exact) return false
  return path.startsWith(`${href}/`)
}

/** How the benchmark is built and audited, in reading order. */
export const METHOD_PAGES: NavNode[] = [
  { href: '/method', label: 'Overview', exact: true },
  { href: '/indicators', label: 'Indicators' },
  { href: '/sources', label: 'Sources' },
  { href: '/diagnostics', label: 'Diagnostics' },
  { href: '/delphi', label: 'Delphi panel' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/limits', label: 'Limits' },
  { href: '/decisions', label: 'Decisions' },
  { href: '/glossary', label: 'Glossary' },
]

/** Whether a path belongs to the method section. */
export const isMethodSection = (pathname: string): boolean =>
  METHOD_PAGES.some((page) => nodeOwns(page, pathname))

/** The country a path is about, whether it is addressed by code or by layer. */
export function pathCountry(pathname: string): string | null {
  const path = pathname.toLowerCase()
  const coded = /^\/country\/([a-z]{3})(?:\/|$)/.exec(path)
  if (coded) return coded[1]!.toUpperCase()
  const first = path.split('/')[1]
  return first ? (layerBySlug(first)?.iso3 ?? null) : null
}

/**
 * One country, and under it the readings the project has written.
 *
 * Two readings become a level of their own, so the crumb can offer both. One
 * reading is no choice at all, so it collapses and the country's pages sit
 * directly under the country. See D69.
 */
export function countryNode(iso3: string): NavNode | null {
  const code = iso3.toUpperCase()
  const name = COUNTRY_NAMES[code]
  if (!name) return null
  const layer = countryLayer(code)

  const englishPages: NavNode[] = [
    { href: countryProfileHref(code), label: 'Profile', exact: true },
    { href: agendaHref(code), label: 'Agenda' },
    ...(hasInstitutionMap(code)
      ? [{ href: institutionNetworkHref(code), label: 'Institutions' }]
      : []),
    ...(hasLocalDestination(code) ? [{ href: countryLocalHref(code), label: 'Local reading' }] : []),
  ]

  const country: NavNode = {
    href: countryProfileHref(code),
    label: name,
    iso3: code,
    claims: (pathname) => pathCountry(pathname) === code,
  }
  if (!layer) return { ...country, children: englishPages }

  return {
    ...country,
    children: [
      { href: countryProfileHref(code), label: 'In English', children: englishPages },
      {
        href: countryLayerHref(layer),
        label: layer.readingLabel,
        lang: layer.lang,
        children: [
          {
            href: countryLayerHref(layer),
            label: layer.overviewLabel,
            lang: layer.lang,
            exact: true,
          },
          ...layer.sections
            .filter((section) => section.slug !== null)
            .map((section) => ({
              href: layerSectionHref(layer, section),
              label: section.label,
              lang: layer.lang,
            })),
        ],
      },
    ],
  }
}

/** The sections. Level one of the tree, and the only level that is always shown. */
export const NAV_TREE: NavNode[] = [
  {
    href: countriesHref,
    label: 'Countries',
    /* A comparison is several countries at once, so it names no single one and
       opens no second row. It still belongs to this section. */
    claims: (pathname) =>
      pathCountry(pathname) !== null ||
      pathname === compareBaseHref ||
      pathname.startsWith(`${compareBaseHref}/`),
    resolveChildren: (pathname) => {
      const iso3 = pathCountry(pathname)
      const node = iso3 ? countryNode(iso3) : null
      return node ? [node] : []
    },
  },
  {
    href: capabilitiesHref,
    label: 'Capabilities',
    children: DIMENSIONS.map((dimension) => ({
      href: capabilityHref(dimension),
      label: DIMENSION_LABELS[dimension],
    })),
  },
  { href: '/agenda', label: 'Agendas' },
  { href: thesisHref, label: 'Thesis' },
  { href: '/method', label: 'Method', claims: isMethodSection, children: METHOD_PAGES },
  { href: challengeHref, label: 'Challenge' },
  {
    href: aboutHref,
    label: 'About',
    claims: (pathname) => pathname === aboutHref || pathname === changelogHref,
    children: [
      { href: aboutHref, label: 'Overview', exact: true },
      { href: changelogHref, label: 'Changelog', exact: true },
    ],
  },
]

/**
 * One rendered row: the entries at that level, which of them is current, and
 * the node above that opened the row. The parent names the row, so a screen
 * reader hears which set it is in.
 */
export type NavRow = { entries: NavNode[]; active: NavNode | null; parent: NavNode | null }

/** The deepest the tree is allowed to go: sections, country, reading, pages. */
const MAX_DEPTH = 4

/**
 * The levels for one path. The first is always the sections; each level after
 * it is the children of the level above's current entry, and the walk stops as
 * soon as a level has no current entry or no children. The renderer turns
 * everything but the deepest level into a breadcrumb and the deepest into
 * tabs.
 */
export function navRows(pathname: string): NavRow[] {
  const rows: NavRow[] = []
  let entries = NAV_TREE
  let parent: NavNode | null = null

  while (entries.length > 0 && rows.length < MAX_DEPTH) {
    const active = entries.find((node) => nodeOwns(node, pathname)) ?? null
    rows.push({ entries, active, parent })
    if (!active) break
    entries = active.children ?? active.resolveChildren?.(pathname) ?? []
    parent = active
  }

  return rows
}

/** Footer columns: the same tree, grouped for a vertical layout. */
export const FOOTER_NAV_GROUPS: { label: string; items: NavNode[] }[] = [
  {
    label: 'Explore',
    items: NAV_TREE.filter((node) => node.href !== '/method' && node.href !== challengeHref),
  },
  { label: 'Method', items: METHOD_PAGES },
  { label: 'Participate', items: NAV_TREE.filter((node) => node.href === challengeHref) },
]
