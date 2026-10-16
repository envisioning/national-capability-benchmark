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
export type ContributionEffort = 'minutes' | 'project' | 'commitment'

/** What each tier means, so no page invents its own words for the same size. */
export const CONTRIBUTION_EFFORT_LABELS: Record<ContributionEffort, string> = {
  minutes: 'Minutes',
  project: 'A piece of work',
  commitment: 'An ongoing commitment',
}

/** The order the tiers are shown in, cheapest first. */
export const CONTRIBUTION_EFFORTS: readonly ContributionEffort[] = [
  'minutes',
  'project',
  'commitment',
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
  | 'review'
  | 'venue'

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
 * Cheapest first inside each tier, so the page reads down into commitment.
 * Envisioning funds the project itself, so no entry asks for money (D164).
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
    id: 'review',
    label: 'Review the method from outside',
    ask: 'Read how the benchmark separates capability from income, and tell us where the method fails.',
    requires:
      'Familiarity with composite indicators or with regression on country data, and time to read the decision record.',
    who: 'Statisticians, econometricians and researchers who build or audit indices.',
    effort: 'project',
    outcome:
      'The reading of what is left after income stays offline until someone outside the project has reviewed it. A review is what publishes it, or withdraws it.',
    channel: 'contact',
    topic: 'research',
  },
  {
    id: 'layer',
    label: 'Build a country layer',
    ask: 'Read one country in its own language, at its own depth, beside the English benchmark.',
    requires:
      'A lexicon, an institution map for that country, and somebody who can keep both current.',
    who: 'Institutions inside the country being read.',
    effort: 'commitment',
    outcome:
      'That country gets its shape, its agenda, its institutions and its subnational spread in the language its decisions are made in.',
    channel: 'contact',
    topic: 'layer',
  },
  {
    id: 'venue',
    label: 'Host a discussion of the results',
    ask: 'Put the benchmark in front of people who will argue with it: a seminar, a working group or a newsroom.',
    requires: 'An audience that makes or studies the decisions a capability score is meant to inform.',
    who: 'Universities, schools of government, think tanks, statistical offices.',
    effort: 'commitment',
    outcome:
      'A discussion surfaces objections and missing measures. Each objection filed is published beside the score it targets, and a missing measure can become a declared gap.',
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
