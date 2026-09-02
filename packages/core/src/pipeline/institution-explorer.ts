import {
  GLOBAL_JURISDICTION,
  INSTITUTION_LEVELS,
  INSTITUTION_RELATION_FAMILIES,
  INSTITUTION_RELATION_FAMILY,
  INSTITUTION_SYSTEMS,
  isGlobalInstitution,
} from '../model/institutions.js'
import { COUNTRY_ISO3 } from '../model/countries.js'
import type {
  InstitutionCoverage,
  InstitutionEdge,
  InstitutionLevel,
  InstitutionRelationFamily,
  LocalizedInstitutionNetwork,
  LocalizedInstitutionNode,
} from '../model/institutions.js'
import { DIMENSIONS } from '../model/dimensions.js'
import type { Lexicon } from '../i18n/types.js'
import { fill } from '../i18n/types.js'

/**
 * The institution map, projected into the feed an external explorer reads.
 *
 * This is a rendering of `data/institutions/{ISO3}.json` and never a second
 * source of truth. Every institution, relation and source comes from that
 * file; every label comes from a lexicon. Nothing here reaches a score or a
 * confidence, which D54 settled and D56 kept.
 *
 * The feed is published so the drawn network can live outside this repository.
 * `@envisioning/app` is closed source and this repository is public, so the
 * viewer cannot depend on it. The explorer is a separate deployment that reads
 * this file over HTTP, and the ledger in the viewer stays the authoritative
 * reading of a relation. See D82.
 */

/**
 * The coverage states whose sub-network is worth drawing.
 *
 * A drawn network needs structure to draw. In the first Brazilian map the 26
 * scaffold states each hold about 10 institutions and about 9 relations, and 8
 * of those 10 carry exactly one relation: every scaffold is one hub with
 * spokes, and 26 identical stars say nothing that the directory does not
 * already say. The union and Sao Paulo carry 85 and 22 internal relations, and
 * those two do have a shape. The file already records which is which, so the
 * rule reads the data rather than a hand-written list.
 */
export const DRAWABLE_COVERAGE: InstitutionCoverage['status'][] = ['baseline', 'pilot']

/**
 * Fixed breaks on a relation count.
 *
 * Not quantiles, for the reason `MATRIX_BANDS` records: a count is absolute, so
 * one relation is one relation in every country and the ramp never moves. Two
 * countries' feeds stay comparable, and a scope filter cannot rescale a band
 * under the reader.
 *
 * Declared high first so `find` takes the first band the count reaches.
 */
export const REACH_BANDS: { id: string; min: number }[] = [
  { id: 'reach-5', min: 10 },
  { id: 'reach-4', min: 5 },
  { id: 'reach-3', min: 3 },
  { id: 'reach-2', min: 2 },
  { id: 'reach-1', min: 0 },
]

/** Fixed breaks on the number of distinct functions an institution holds. */
export const MANDATE_BANDS: { id: string; min: number }[] = [
  { id: 'mandate-4', min: 4 },
  { id: 'mandate-3', min: 3 },
  { id: 'mandate-2', min: 2 },
  { id: 'mandate-1', min: 0 },
]

/**
 * How heavily a relation draws.
 *
 * The explorer renders every connection as one line whose width is its
 * strength, so the four families are the only distinction a picture can carry.
 * It cannot carry direction, and it cannot separate the 13 verbs. Both stay
 * readable in the ledger, which is why the ledger remains the authoritative
 * surface for a relation. See D82.
 */
export const RELATION_FAMILY_STRENGTH: Record<InstitutionRelationFamily, number> = {
  constitutes: 1,
  limits: 0.8,
  funds: 0.6,
  works_with: 0.35,
}

/**
 * How a level is marked.
 *
 * One accent, spent on the federal backbone, and an ink ramp for everything
 * else. Eleven coloured systems would break the rule that lime is rare, so the
 * systems carry no colour and group the layout instead.
 */
export const LEVEL_COLOURS: Record<InstitutionLevel, string> = {
  federal: '#d6f249',
  state: '#8b93b5',
  municipal: '#c9cfe6',
  external: '#5c6180',
  global: '#3b3f5c',
}

export type ExplorerBand = {
  id: string
  label: string
  summary: string
  value: number
}

export type ExplorerConnection = {
  id: string
  strength: number
  label: string
}

export type ExplorerSource = {
  url: string
  title: string
  linkLabel: string
}

export type ExplorerInstitution = {
  id: string
  number: number
  title: string
  summary: string
  description: string
  system: { id: string }
  level: { id: string }
  jurisdiction: { id: string }
  reach: { id: string; value: number }
  mandate: { id: string; value: number }
  relationCount: number
  connections: ExplorerConnection[]
  sources: ExplorerSource[]
}

export type ExplorerGroup = {
  id: string
  label: string
  summary: string
}

export type ExplorerJurisdiction = ExplorerGroup & {
  /** Whether this jurisdiction's sub-network has enough structure to draw. */
  drawable: boolean
}

export type ExplorerLevel = ExplorerGroup & {
  color: { hex: string }
}

export type InstitutionExplorerFeed = {
  project: {
    id: string
    title: string
    summary: string
    description: string
  }
  allJurisdictions: ExplorerJurisdiction[]
  allSystems: ExplorerGroup[]
  allLevels: ExplorerLevel[]
  allInstitutions: ExplorerInstitution[]
  allReaches: ExplorerBand[]
  allMandates: ExplorerBand[]
}

/** Which band a count falls into. Bands are declared high first. */
function bandFor(bands: { id: string; min: number }[], count: number): { id: string; value: number } {
  const index = bands.findIndex((band) => count >= band.min)
  const found = index === -1 ? bands.length - 1 : index
  // Band 1 is the lowest, so invert the declaration order into a value that
  // rises with the count. The explorer places a higher value nearer the centre.
  return { id: bands[found]!.id, value: bands.length - found }
}

/**
 * The legend for one set of bands, lowest first.
 *
 * The label states the count range the band covers, so a reader who sees a
 * ring or a bubble size can read what it counts rather than guess an order.
 */
function bandLegend(bands: { id: string; min: number }[]): ExplorerBand[] {
  return bands
    .map((band, index) => {
      const next = bands[index - 1]
      const range = next ? `${band.min}–${next.min - 1}` : `${band.min}+`
      return { id: band.id, label: range, summary: range, value: bands.length - index }
    })
    .reverse()
}

/** Every relation touching one institution, in the direction it reads from there. */
function relationsByFamily(
  node: LocalizedInstitutionNode,
  edges: InstitutionEdge[],
  names: Map<string, string>,
  lex: Lexicon,
): Map<InstitutionRelationFamily, string[]> {
  const lines = new Map<InstitutionRelationFamily, string[]>()
  for (const family of INSTITUTION_RELATION_FAMILIES) lines.set(family, [])

  for (const edge of edges) {
    const outgoing = edge.sourceId === node.id
    const otherId = outgoing ? edge.targetId : edge.sourceId
    const other = names.get(otherId)
    if (!other) continue
    const family = INSTITUTION_RELATION_FAMILY[edge.relation]
    const verb = lex.institutions.relations[edge.relation]
    lines.get(family)!.push(`${outgoing ? verb.outgoing : verb.incoming} ${other}`)
  }

  return lines
}

/** The markdown body the explorer shows when a reader opens one institution. */
function describe(
  node: LocalizedInstitutionNode,
  edges: InstitutionEdge[],
  names: Map<string, string>,
  lex: Lexicon,
  country: { iso3: string; name: string },
): string {
  const inst = lex.institutions
  const parts: string[] = []

  parts.push(
    [
      node.officialName,
      `${inst.levels[node.level]} · ${inst.natures[node.legalNature]} · ${inst.systems[node.system]}`,
    ].join('\n\n'),
  )

  /* Membership is a fact about the body, held once in the ledger, so a
   * country's feed states it beside the body rather than drawing 53 lines. */
  if (isGlobalInstitution(node) && node.members) {
    const count = fill(inst.memberCount, { n: node.members.length, total: COUNTRY_ISO3.length })
    const here = fill(
      node.members.includes(country.iso3) ? inst.memberHere : inst.notMemberHere,
      { country: country.name },
    )
    parts.push(`**${inst.membersHeading}:** ${count}. ${here}`)
  }

  parts.push(
    `**${inst.rolesHeading}:** ${node.roles.map((role) => inst.roles[role]).join(', ')}.`,
  )

  const dimensions = node.dimensions
    .filter((dimension) => DIMENSIONS.includes(dimension))
    .map((dimension) => lex.dimensions[dimension])
  parts.push(
    `**${inst.dimensionsHeading}:** ${dimensions.length ? dimensions.join(', ') : inst.noDimensions}.`,
  )

  const families = relationsByFamily(node, edges, names, lex)
  const ledger = INSTITUTION_RELATION_FAMILIES.map((family) => {
    const band = families.get(family)!
    const heading = inst.families[family].label
    if (band.length === 0) return `**${heading}.** ${inst.families[family].empty}`
    return `**${heading}.** ${band.join('; ')}.`
  })
  parts.push(ledger.join('\n\n'))

  return parts.join('\n\n')
}

/**
 * Project one country's institution map into the explorer feed.
 *
 * `lex` renders every label. Ids, systems, levels and relations stay the
 * ground layer's English enums, so a second language changes this argument and
 * nothing else.
 */
export function buildInstitutionExplorer(
  network: LocalizedInstitutionNetwork,
  lex: Lexicon,
  countryName: string,
): InstitutionExplorerFeed {
  const inst = lex.institutions
  const names = new Map(network.nodes.map((node) => [node.id, node.shortName]))

  const edgesByNode = new Map<string, InstitutionEdge[]>()
  const degree = new Map<string, number>()
  for (const node of network.nodes) {
    edgesByNode.set(node.id, [])
    degree.set(node.id, 0)
  }
  for (const edge of network.edges) {
    // An edge naming an institution the file does not carry is a broken
    // reference. `pnpm bench validate` reports it; drop it here rather than
    // drawing a line to nothing.
    if (!edgesByNode.has(edge.sourceId) || !edgesByNode.has(edge.targetId)) continue
    edgesByNode.get(edge.sourceId)!.push(edge)
    edgesByNode.get(edge.targetId)!.push(edge)
    degree.set(edge.sourceId, degree.get(edge.sourceId)! + 1)
    degree.set(edge.targetId, degree.get(edge.targetId)! + 1)
  }

  const coverageByCode = new Map(network.coverage.map((entry) => [entry.jurisdictionCode, entry]))

  const allInstitutions: ExplorerInstitution[] = network.nodes.map((node, index) => {
    const nodeEdges = edgesByNode.get(node.id)!
    const relationCount = degree.get(node.id)!

    const connections: ExplorerConnection[] = []
    const seen = new Set<string>()
    for (const edge of nodeEdges) {
      const otherId = edge.sourceId === node.id ? edge.targetId : edge.sourceId
      if (otherId === node.id || seen.has(otherId)) continue
      seen.add(otherId)
      const family = INSTITUTION_RELATION_FAMILY[edge.relation]
      connections.push({
        id: otherId,
        strength: RELATION_FAMILY_STRENGTH[family],
        label: inst.families[family].label,
      })
    }

    const sources: ExplorerSource[] = []
    const seenUrls = new Set<string>()
    for (const source of [node.source, ...nodeEdges.map((edge) => edge.source)]) {
      if (seenUrls.has(source.url)) continue
      seenUrls.add(source.url)
      sources.push({ url: source.url, title: source.title, linkLabel: inst.sourceLink })
    }

    return {
      id: node.id,
      number: index + 1,
      title: node.shortName,
      summary: node.summary,
      description: describe(node, nodeEdges, names, lex, {
        iso3: network.iso3,
        name: countryName,
      }),
      system: { id: node.system },
      level: { id: node.level },
      jurisdiction: { id: node.jurisdictionCode },
      reach: bandFor(REACH_BANDS, relationCount),
      mandate: bandFor(MANDATE_BANDS, node.roles.length),
      relationCount,
      connections,
      sources,
    }
  })

  const countByJurisdiction = new Map<string, number>()
  for (const node of network.nodes) {
    countByJurisdiction.set(
      node.jurisdictionCode,
      (countByJurisdiction.get(node.jurisdictionCode) ?? 0) + 1,
    )
  }

  const allJurisdictions: ExplorerJurisdiction[] = [...countByJurisdiction.keys()]
    .sort()
    .map((code) => {
      const entry = coverageByCode.get(code)
      if (code === GLOBAL_JURISDICTION) {
        return {
          id: code,
          label: inst.globalJurisdiction,
          summary: inst.globalJurisdictionNote,
          drawable: false,
        }
      }
      return {
        id: code,
        label: entry?.label ?? code,
        summary: entry?.note ?? '',
        drawable: entry ? DRAWABLE_COVERAGE.includes(entry.status) : false,
      }
    })

  const usedSystems = new Set(network.nodes.map((node) => node.system))
  const allSystems: ExplorerGroup[] = INSTITUTION_SYSTEMS.filter((system) =>
    usedSystems.has(system),
  ).map((system) => ({
    id: system,
    label: inst.systems[system],
    summary: '',
  }))

  const usedLevels = new Set(network.nodes.map((node) => node.level))
  const allLevels: ExplorerLevel[] = INSTITUTION_LEVELS.filter((level) => usedLevels.has(level))
    .map((level) => ({
      id: level,
      label: inst.levels[level],
      summary: '',
      color: { hex: LEVEL_COLOURS[level] },
    }))

  const allReaches = bandLegend(REACH_BANDS)
  const allMandates = bandLegend(MANDATE_BANDS)

  return {
    project: {
      id: `ncb-institutions-${network.iso3.toLowerCase()}`,
      title: countryName,
      summary: fill(inst.mapSummary, {
        institutions: network.nodes.length,
        relations: network.edges.length,
      }),
      description: network.scope,
    },
    allJurisdictions,
    allSystems,
    allLevels,
    allInstitutions,
    allReaches,
    allMandates,
  }
}
