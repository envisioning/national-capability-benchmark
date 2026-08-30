import type { ContactTopic } from './contact.js'

/**
 * The ways somebody can take part, declared once.
 *
 * The project asked for help in four places and in four different orders: an
 * objection list on the objections page, a three-part offer on the support
 * page, a topic select on the contact form and a set of rules in
 * CONTRIBUTING.md. A reader could not tell whether contributing a series and
 * filling a gap were the same act, because nothing said they were.
 *
 * This registry is the single source. Every surface that invites a
 * contribution renders from it, and each entry names what it needs, who
 * usually brings it, how much work it is and what changes in the benchmark
 * when it lands. The last field matters most: an ask with no visible
 * consequence is a donation box. See D78.
 *
 * Addresses are not here. Core does not know the viewer's URLs, so the web
 * layer maps a channel to an href in `apps/web/src/lib/links.ts`. See D46.
 */

/** How much work an entry is, from the point of view of the person doing it. */
export type ContributionEffort = 'minutes' | 'project' | 'funded'

/** What each tier means, so no page invents its own words for the same size. */
export const CONTRIBUTION_EFFORT_LABELS: Record<ContributionEffort, string> = {
  minutes: 'Minutes',
  project: 'A piece of work',
  funded: 'Funded work',
}

/** The order the tiers are shown in, cheapest first. */
export const CONTRIBUTION_EFFORTS: readonly ContributionEffort[] = [
  'minutes',
  'project',
  'funded',
]

/** Where a contribution goes. The web layer turns this into an address. */
export type ContributionChannel = 'objections' | 'contact' | 'issues' | 'pull-request'

export type ContributionId =
  | 'object'
  | 'gap'
  | 'evidence'
  | 'layer'
  | 'use'
  | 'code'
  | 'fund'

export type ContributionWay = {
  id: ContributionId
  /** What the reader is doing, in the imperative. */
  label: string
  /** The ask itself, one sentence. */
  ask: string
  /** What it has to carry before the project can use it. */
  requires: string
  /** Who usually brings this one. Not a restriction. */
  who: string
  effort: ContributionEffort
  /** What changes in the published benchmark once it lands. */
  outcome: string
  channel: ContributionChannel
  /** The contact form's subject, where the channel is the form. */
  topic: ContactTopic
}

/**
 * Cheapest first inside each tier, so the page reads down into commitment
 * rather than opening on a funding ask.
 */
export const CONTRIBUTION_WAYS: readonly ContributionWay[] = [
  {
    id: 'object',
    label: 'Argue with a score',
    ask: 'Tell us where a number is wrong about the country you know.',
    requires: 'The country, the capability and what the score misses.',
    who: 'Anyone who knows a country better than a global dataset does.',
    effort: 'minutes',
    outcome:
      'The objection is published beside the score it targets, so the disagreement travels with the number.',
    channel: 'objections',
    topic: 'general',
  },
  {
    id: 'gap',
    label: 'Name a dataset for a gap',
    ask: 'Point us at a published series that covers a capability we cannot measure.',
    requires:
      'A comparable series over at least two countries, with an open URL, a publisher, a reference period and a stated method.',
    who: 'Statisticians, researchers, anyone who works with a national source.',
    effort: 'minutes',
    outcome:
      'A gap becomes a scored indicator, which raises confidence for every country at once.',
    channel: 'contact',
    topic: 'data',
  },
  {
    id: 'evidence',
    label: 'File an evidence record',
    ask: 'Document something a country actually delivered where the benchmark can only record a gap.',
    requires:
      'One published number, the period it covers, the publisher, and a statement of what it does not show.',
    who: 'Public servants, journalists, researchers with a case in front of them.',
    effort: 'project',
    outcome:
      'The record is published against the indicator it answers. It never moves a score, and it is how a capability with no dataset can still be read.',
    channel: 'pull-request',
    topic: 'data',
  },
  {
    id: 'use',
    label: 'Use it against a real decision',
    ask: 'Put the benchmark next to a decision your institution is already making, and tell us where it broke.',
    requires: 'The decision, the capability you read, and what the number failed to answer.',
    who: 'Policy teams, development banks, schools of government, newsrooms.',
    effort: 'project',
    outcome:
      'A measure nobody applies stays a hypothesis. Several of the registry gaps came from exactly these conversations.',
    channel: 'contact',
    topic: 'research',
  },
  {
    id: 'code',
    label: 'Fix the code or the data',
    ask: 'Send a source adapter, a broken series, a wrong label or a bug.',
    requires: 'A reproducible case, or a pull request against the repository.',
    who: 'Developers and data engineers.',
    effort: 'project',
    outcome: 'A source adapter raises confidence across every country in one change.',
    channel: 'issues',
    topic: 'general',
  },
  {
    id: 'layer',
    label: 'Build a country layer',
    ask: 'Read one country in its own language, at its own depth, beside the English benchmark.',
    requires:
      'A lexicon, an institution map for that country, and somebody who can keep both current.',
    who: 'Institutions inside the country being read.',
    effort: 'funded',
    outcome:
      'That country gets its shape, its agenda, its institutions and its subnational spread in the language its decisions are made in.',
    channel: 'contact',
    topic: 'layer',
  },
  {
    id: 'fund',
    label: 'Fund a named piece',
    ask: 'Back one capability, one country layer, one source adapter or one reviewed expert panel.',
    requires: 'A scope and a window. The work is modular so a funder backs a piece, not a promise.',
    who: 'Research grants, public procurement, philanthropic funds, multilateral research budgets.',
    effort: 'funded',
    outcome:
      'Each piece has a stated deliverable and a stated effect on the published numbers.',
    channel: 'contact',
    topic: 'support',
  },
]

/** The ways in one effort tier, in registry order. */
export const contributionsByEffort = (effort: ContributionEffort): ContributionWay[] =>
  CONTRIBUTION_WAYS.filter((way) => way.effort === effort)

/** One way by id, for a surface that invites a single contribution. */
export const contributionWay = (id: ContributionId): ContributionWay | null =>
  CONTRIBUTION_WAYS.find((way) => way.id === id) ?? null

/**
 * A funded piece of work: its scope, and what it moves.
 *
 * The support page used to name four pieces with no size on any of them, so a
 * funder could not tell a week from a year, or see what the money bought in
 * the published data. Each entry now states the boundary of the work and the
 * change a reader would see afterwards.
 */
export type FundablePiece = {
  id: 'capability' | 'layer' | 'adapter' | 'panel'
  label: string
  /** Where the work starts and stops. */
  scope: string
  /** What the reader sees change in the benchmark when it lands. */
  effect: string
  /** Where money for work this shape usually comes from. */
  funders: string
}

export const FUNDABLE_PIECES: readonly FundablePiece[] = [
  {
    id: 'capability',
    label: 'One capability',
    scope:
      'One of the nine dimensions: its indicator set reviewed, its declared gaps closed where a dataset exists, and its evidence corpus built out across the country set.',
    effect:
      'That dimension stops resting on two or three indicators. Its confidence rises for every country, and the ones below the coverage floor start publishing a score.',
    funders: 'Most research grants are already this size.',
  },
  {
    id: 'layer',
    label: 'One country layer',
    scope:
      'One country read in its own language: the lexicon, the institution map, the subnational spread and the agenda, kept current for a defined period.',
    effect:
      "That country's institutions can argue with the benchmark in the language they make decisions in, and the map shows who would have to act.",
    funders:
      'Development banks, schools of government and public foundations inside the country.',
  },
  {
    id: 'adapter',
    label: 'One source adapter',
    scope:
      'One publisher wired into the ingest, validated against every country in the registry, and kept current through their release cycle.',
    effect:
      'Confidence rises across all countries at once, because coverage and recency are two of the three things confidence is made of.',
    funders: 'Statistical agencies, data philanthropies, research infrastructure funds.',
  },
  {
    id: 'panel',
    label: 'One reviewed expert panel',
    scope:
      'A full Delphi run across the country set with named panelists, published dissent and a documented review.',
    effect:
      'The estimate layer stops being a session artifact and becomes evidence, which is the difference between a labeled guess and a second reading of a capability.',
    funders: 'Research programmes and foresight units.',
  },
]
