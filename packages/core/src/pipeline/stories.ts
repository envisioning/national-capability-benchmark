import { DIMENSIONS } from '../model/index.js'
import type { CountryResult, Dimension } from '../model/index.js'
import { MAP_PEER_COUNT, incomePeers } from './capability-map.js'
import type { IncomeRow } from './capability-map.js'
import { isThinEvidence } from './confidence.js'
import { median, round } from './stats.js'

/**
 * Stories: short computed readings of one country, each built for a reader who
 * will share it. A story is a function of the published files and nothing
 * else. It holds numbers, never sentences: the words come from
 * `Lexicon.stories`, so every language reads the same computation.
 *
 * Descriptive by contract, as the capability map is (D130). A story compares a
 * country with another country, with a median or with itself, and no field
 * says what a country should do. A score in a story always travels with its
 * confidence, and a score with thin evidence is never a story's headline. See
 * D192.
 */

/** The stories, in the order an index lists them. */
export const STORY_IDS = ['shape_mirror', 'peer_contrast', 'peer_standing'] as const
export type StoryId = (typeof STORY_IDS)[number]

/** How many nearest shapes the mirror story lists. */
export const MIRROR_COUNT = 3

/** One dimension of a profile: the published score and its confidence. */
export type StoryCell = { score: number; confidence: number; thin: boolean }

/** Two countries dimension by dimension. */
export type StoryPairRow = { dimension: Dimension; subject: StoryCell; other: StoryCell }

/** Another country set against the subject by shape. */
export type ShapeMatch = {
  iso3: string
  country: string
  /** Root mean square difference of the two shapes, in score points. */
  distance: number
  gdpPerCapita: number | null
  /** The other country's income over the subject's, or null where either is missing. */
  incomeRatio: number | null
  rows: StoryPairRow[]
}

export type ShapeMirrorStory = {
  id: 'shape_mirror'
  iso3: string
  /** How many countries publish a score on every dimension, the subject included. */
  candidates: number
  /** Nearest first. */
  matches: ShapeMatch[]
  /** How many of the subject's nine scores rest on thin evidence. */
  subjectThin: number
}

export type PeerContrastStory = {
  id: 'peer_contrast'
  iso3: string
  peerCount: number
  /** Income peers that publish all nine, farthest shape first. */
  peers: ShapeMatch[]
  subjectThin: number
}

export type StandingRow = {
  dimension: Dimension
  subject: StoryCell
  peerMedian: number
  peersScored: number
  /** Subject score minus the peer median. */
  gap: number
}

export type PeerStandingStory = {
  id: 'peer_standing'
  iso3: string
  peerCount: number
  /** The income peers, nearest first. */
  peers: string[]
  /** Every dimension with a subject score and a peer median, largest gap first. */
  rows: StandingRow[]
  /** The largest gap above the median among dimensions without thin evidence. */
  above: StandingRow | null
  /** The largest gap below the median among dimensions without thin evidence. */
  below: StandingRow | null
  /** Dimensions below the median whose subject score rests on thin evidence. */
  thinBelow: StandingRow[]
}

export type Story = ShapeMirrorStory | PeerContrastStory | PeerStandingStory

export type StorySet = {
  iso3: string
  version: string
  generatedAt: string
  stories: Story[]
}

type Profile = { iso3: string; country: string; cells: StoryCell[] }

const cellOf = (country: CountryResult, dimension: Dimension): StoryCell | null => {
  const result = country.dimensions[dimension]
  if (!result || result.score === null) return null
  return { score: result.score, confidence: result.confidence, thin: isThinEvidence(result.confidence) }
}

/** A country with a published score on every dimension, else null. */
function fullProfile(country: CountryResult): Profile | null {
  const cells: StoryCell[] = []
  for (const dimension of DIMENSIONS) {
    const cell = cellOf(country, dimension)
    if (!cell) return null
    cells.push(cell)
  }
  return { iso3: country.iso3, country: country.country, cells }
}

/** The profile minus its own mean: where the country is high and low, with its level taken out. */
const shapeOf = (cells: readonly StoryCell[]): number[] => {
  const mean = cells.reduce((sum, cell) => sum + cell.score, 0) / cells.length
  return cells.map((cell) => cell.score - mean)
}

/** Root mean square difference between two shapes. */
export function shapeDistance(a: readonly StoryCell[], b: readonly StoryCell[]): number {
  const sa = shapeOf(a)
  const sb = shapeOf(b)
  const sum = sa.reduce((acc, x, i) => acc + (x - (sb[i] as number)) ** 2, 0)
  return Math.sqrt(sum / sa.length)
}

function matchOf(subject: Profile, other: Profile, income: Map<string, number>): ShapeMatch {
  const own = income.get(subject.iso3) ?? null
  const theirs = income.get(other.iso3) ?? null
  return {
    iso3: other.iso3,
    country: other.country,
    distance: round(shapeDistance(subject.cells, other.cells), 1),
    gdpPerCapita: theirs,
    incomeRatio: own && theirs ? round(theirs / own, 2) : null,
    rows: DIMENSIONS.map((dimension, i) => ({
      dimension,
      subject: subject.cells[i] as StoryCell,
      other: other.cells[i] as StoryCell,
    })),
  }
}

/* Unrounded distance first, then the code, so a tie never depends on file order. */
const byDistance = (subject: Profile) => (a: Profile, b: Profile) =>
  shapeDistance(subject.cells, a.cells) - shapeDistance(subject.cells, b.cells) ||
  a.iso3.localeCompare(b.iso3)

const thinCount = (profile: Profile): number => profile.cells.filter((cell) => cell.thin).length

/**
 * Every story for one country. A story the data cannot support is left out:
 * a subject without all nine scores has no shape, and one without income has
 * no peers.
 */
export function buildStories(input: {
  iso3: string
  version: string
  generatedAt: string
  countries: readonly CountryResult[]
  income: readonly IncomeRow[]
}): StorySet {
  const { iso3, countries } = input
  const incomeByIso = new Map(input.income.map((row) => [row.iso3, row.gdpPerCapita]))
  const profiles = countries.map(fullProfile).filter((p): p is Profile => p !== null)
  const subject = profiles.find((p) => p.iso3 === iso3) ?? null
  const subjectRow = countries.find((c) => c.iso3 === iso3) ?? null
  const peerSet = incomePeers(input.income, iso3, MAP_PEER_COUNT).peers
  const stories: Story[] = []

  if (subject) {
    const others = profiles.filter((p) => p.iso3 !== iso3).sort(byDistance(subject))
    stories.push({
      id: 'shape_mirror',
      iso3,
      candidates: profiles.length,
      matches: others.slice(0, MIRROR_COUNT).map((p) => matchOf(subject, p, incomeByIso)),
      subjectThin: thinCount(subject),
    })

    const peerProfiles = peerSet
      .map((peer) => profiles.find((p) => p.iso3 === peer.iso3))
      .filter((p): p is Profile => p !== undefined)
      .sort(byDistance(subject))
      .reverse()
    if (peerProfiles.length > 0) {
      stories.push({
        id: 'peer_contrast',
        iso3,
        peerCount: peerSet.length,
        peers: peerProfiles.map((p) => matchOf(subject, p, incomeByIso)),
        subjectThin: thinCount(subject),
      })
    }
  }

  if (subjectRow && peerSet.length > 0) {
    const peerRows = peerSet
      .map((peer) => countries.find((c) => c.iso3 === peer.iso3))
      .filter((c): c is CountryResult => c !== undefined)
    const rows: StandingRow[] = []
    for (const dimension of DIMENSIONS) {
      const cell = cellOf(subjectRow, dimension)
      const scores = peerRows.map((c) => c.dimensions[dimension]?.score).filter((s): s is number => s != null)
      if (!cell || scores.length === 0) continue
      const peerMedian = round(median(scores), 1)
      rows.push({ dimension, subject: cell, peerMedian, peersScored: scores.length, gap: round(cell.score - peerMedian, 1) })
    }
    rows.sort((a, b) => b.gap - a.gap || a.dimension.localeCompare(b.dimension))
    const solid = rows.filter((row) => !row.subject.thin)
    const above = solid.find((row) => row.gap > 0) ?? null
    const below = [...solid].reverse().find((row) => row.gap < 0) ?? null
    stories.push({
      id: 'peer_standing',
      iso3,
      peerCount: peerSet.length,
      peers: peerSet.map((peer) => peer.iso3),
      rows,
      above,
      below,
      thinBelow: rows.filter((row) => row.gap < 0 && row.subject.thin).reverse(),
    })
  }

  return { iso3, version: input.version, generatedAt: input.generatedAt, stories }
}

/** One story by id, or null where the data does not support it. */
export const storyById = <T extends StoryId>(set: StorySet, id: T): Extract<Story, { id: T }> | null =>
  (set.stories.find((story) => story.id === id) as Extract<Story, { id: T }> | undefined) ?? null
