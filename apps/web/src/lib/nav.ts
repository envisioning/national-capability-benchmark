import { COUNTRY_NAMES, DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import { countryLayer, hasInstitutionMap, layerBySlug } from '@/lib/layers'
import {
  aboutHref,
  agendaHref,
  agendasIndexHref,
  capabilitiesHref,
  capabilityHref,
  changelogHref,
  compareBaseHref,
  contactHref,
  countriesHref,
  countryLayerHref,
  countryLocalHref,
  countryProfileHref,
  gapsHref,
  hasLocalDestination,
  institutionNetworkHref,
  layerSectionHref,
  objectionsHref,
  supportHref,
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
 * The tree is data, not a promise that every level gets its own horizontal
 * row. The sections occupy the global header, and the contextual levels plus
 * the deepest page set share one subnav band. Countries has 53 children and no
 * control can show them, so its child is resolved from the path: the context
 * names the one country you are in. A country layer is a reading of that
 * country, beside the English one rather than under its pages. See D69 and
 * D91.
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
  /**
   * The row this node offers in a menu, where the resolved row would name
   * where the reader is standing instead of what the section holds. See D85.
   */
  menuChildren?: NavNode[]
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

/**
 * The cross-country views, which is what the row under Countries offers before
 * the reader has picked a country.
 *
 * That row answers one question, "which country", and these are the readings
 * that take all of them at once. An agenda is one country's scores turned into
 * actions, so the index of 53 agendas belongs here rather than in a section of
 * its own: it is a way of reading the country set, not a sixth thing the site
 * is about. See D80.
 */
export const COUNTRY_INDEX_PAGES: NavNode[] = [
  { href: countriesHref, label: 'All countries', exact: true },
  { href: compareBaseHref, label: 'Compare' },
  { href: agendasIndexHref, label: 'Agendas' },
]

/**
 * What the project says about itself.
 *
 * The thesis argues and the overview describes, which D75 settled, and both
 * answer the one question a newcomer asks before either: what is this and
 * should I believe it. Two jobs are two pages, never two sections. See D80.
 */
export const ABOUT_PAGES: NavNode[] = [
  { href: aboutHref, label: 'Overview', exact: true },
  { href: thesisHref, label: 'Thesis' },
  { href: changelogHref, label: 'Changelog', exact: true },
]

/** Whether a path belongs to the about section. */
export const isAboutSection = (pathname: string): boolean =>
  ABOUT_PAGES.some((page) => nodeOwns(page, pathname))

/**
 * How somebody takes part, in reading order.
 *
 * The project had four ways in and no address for three of them: `/support`
 * and `/contact` were in no navigation at all, reachable only from a sentence
 * at the foot of another page. A section that asks for help has to be findable
 * by a reader who has decided to give it. See D78.
 */
export const PARTICIPATE_PAGES: NavNode[] = [
  { href: supportHref, label: 'Ways to help', exact: true },
  { href: gapsHref, label: 'Open gaps' },
  { href: objectionsHref, label: 'Objections' },
  { href: contactHref, label: 'Contact' },
]

/** Whether a path belongs to the participate section. */
export const isParticipateSection = (pathname: string): boolean =>
  PARTICIPATE_PAGES.some((page) => nodeOwns(page, pathname))

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
    /* A comparison and an agenda index are both several countries at once, so
       neither names a single one. Both belong to this section. */
    claims: (pathname) =>
      pathCountry(pathname) !== null ||
      nodeOwns({ href: compareBaseHref, label: '' }, pathname) ||
      nodeOwns({ href: agendasIndexHref, label: '' }, pathname),
    /* The row under Countries answers "which country". Once the path names one,
       that country is the row, because 53 of them will not fit in a control.
       Before it does, the row offers the readings that take the whole set. See
       D73 and D80. */
    resolveChildren: (pathname) => {
      const iso3 = pathCountry(pathname)
      if (!iso3) return COUNTRY_INDEX_PAGES
      const node = countryNode(iso3)
      return node ? [node] : COUNTRY_INDEX_PAGES
    },
    /* Opened from a country page, the resolved row is that one country, which
       is the crumb's job. A menu is opened from anywhere, so it offers the
       readings that hold whatever the path says. See D85. */
    menuChildren: COUNTRY_INDEX_PAGES,
  },
  {
    href: capabilitiesHref,
    label: 'Capabilities',
    children: DIMENSIONS.map((dimension) => ({
      href: capabilityHref(dimension),
      label: DIMENSION_LABELS[dimension],
    })),
  },
  { href: '/method', label: 'Method', claims: isMethodSection, children: METHOD_PAGES },
  {
    href: supportHref,
    label: 'Participate',
    claims: isParticipateSection,
    children: PARTICIPATE_PAGES,
  },
  {
    href: aboutHref,
    label: 'About',
    claims: isAboutSection,
    children: ABOUT_PAGES,
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
 * soon as a level has no current entry or no children. `SiteNav` groups the
 * contextual rows and the deepest row into one subnav band.
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

/**
 * What a section opens in the header, before the reader has gone there.
 *
 * The tab strip shows a section's pages once the reader is inside it. A menu
 * shows them from anywhere, so it reads the same tree at the same level, and
 * takes `menuChildren` where a resolved row would answer a different question
 * than the one the reader asked by opening the menu. See D85.
 */
export function sectionMenuEntries(node: NavNode, pathname: string): NavNode[] {
  return node.menuChildren ?? node.children ?? node.resolveChildren?.(pathname) ?? []
}

/**
 * Footer columns: one per section, from the same tree.
 *
 * This was a hand-written list of four groups that happened to spread the same
 * page arrays the tree walks, which is a copy that agrees with its original
 * only for as long as somebody edits both. It already disagreed: Capabilities
 * opened nine dimensions in the header and was a single link down here, and a
 * sixth section would have reached the header and never the footer. See D73
 * and D88.
 *
 * A section is asked what it opens while standing at its own address, so the
 * answer is the one that holds from anywhere: `menuChildren` where a node has
 * one, and the walk where it does not.
 */
export const FOOTER_NAV_GROUPS: { label: string; items: NavNode[] }[] = NAV_TREE.map(
  (section) => ({
    label: section.label,
    items: sectionMenuEntries(section, section.href),
  }),
)

/**
 * The pages a reader lands on, flat.
 *
 * The header shows five sections and opens the rest a level down. A machine
 * reading `/llms.txt` has no rows to open, so it gets the destinations instead,
 * from the same lists the header walks. See D59 and D80.
 */
export const READING_PAGES: NavNode[] = [
  { href: '/', label: 'Overview', exact: true },
  ...COUNTRY_INDEX_PAGES,
  { href: capabilitiesHref, label: 'Capabilities' },
  ...ABOUT_PAGES,
]
