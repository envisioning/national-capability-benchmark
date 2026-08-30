/** The nine capability dimensions. Order is fixed: it drives table and radar axis order. */
export const DIMENSIONS = [
  'anticipation',
  'agency',
  'coordination',
  'trust',
  'learning',
  'experimentation',
  'adaptability',
  'building',
  'shared_purpose',
] as const

export type Dimension = (typeof DIMENSIONS)[number]

export const DIMENSION_LABELS: Record<Dimension, string> = {
  anticipation: 'Anticipation',
  agency: 'Agency',
  coordination: 'Coordination',
  trust: 'Trust',
  learning: 'Learning',
  experimentation: 'Experimentation',
  adaptability: 'Adaptability',
  building: 'Building',
  shared_purpose: 'Shared Purpose',
}

/** The question each dimension answers. The Delphi prompts quote these verbatim. */
export const DIMENSION_QUESTIONS: Record<Dimension, string> = {
  anticipation:
    'How capable is the country of identifying and preparing for emerging change?',
  agency:
    'How able are individuals and organizations to turn an intention into action?',
  coordination:
    'How effectively can independent actors organize around shared objectives?',
  trust: 'How much cooperation is possible beyond immediate personal networks?',
  learning:
    'How effectively does the country acquire, distribute, and update knowledge?',
  experimentation:
    'How easily can new approaches be attempted, tested, abandoned, and improved?',
  adaptability:
    'How effectively can the system respond when circumstances change?',
  building:
    'How capable is the country of turning plans and knowledge into functioning systems?',
  shared_purpose:
    'To what extent can people imagine themselves as participants in a common project?',
}

/**
 * What the two ends of one dimension's frame look like.
 *
 * A 0 to 100 axis says where a country sits and never what sitting there
 * means. These name both ends in plain words, so a distribution chart can label
 * its own scale instead of leaving a reader to infer the direction. They are
 * descriptions of a position in the frame every country builds together, never
 * a pass mark. Ground layer English, like every other registry string: a
 * lexicon may translate them and falls back to these. See D35.
 */
export type DimensionEndpoint = {
  /** Two or three words, printed under the end of the axis. */
  label: string
  /** One sentence saying what a country at that end looks like. */
  meaning: string
}

export const DIMENSION_ENDPOINTS: Record<
  Dimension,
  { low: DimensionEndpoint; high: DimensionEndpoint }
> = {
  anticipation: {
    low: { label: 'Reacts to change', meaning: 'Change is met once it has already arrived.' },
    high: { label: 'Sees change early', meaning: 'Signals are read while there is still time to act.' },
  },
  agency: {
    low: { label: 'Intentions stall', meaning: 'Starting something takes permission that is slow to get.' },
    high: { label: 'Intentions become action', meaning: 'A person or a firm can start something and finish it.' },
  },
  coordination: {
    low: { label: 'Acts separately', meaning: 'Independent actors work past each other.' },
    high: { label: 'Acts together', meaning: 'Independent actors organize around one objective.' },
  },
  trust: {
    low: { label: 'Trust stays close', meaning: 'Cooperation stops at the people already known.' },
    high: { label: 'Trust travels', meaning: 'Strangers cooperate on the strength of the rules.' },
  },
  learning: {
    low: { label: 'Knowledge stays put', meaning: 'What one part of the country learns, the rest does not.' },
    high: { label: 'Knowledge spreads', meaning: 'New knowledge reaches the people who can use it.' },
  },
  experimentation: {
    low: { label: 'One attempt only', meaning: 'A new approach is expensive to try and costly to drop.' },
    high: { label: 'Many attempts', meaning: 'Trying something new is cheap, and stopping it is cheaper.' },
  },
  adaptability: {
    low: { label: 'Holds its shape', meaning: 'The system runs as before when conditions move.' },
    high: { label: 'Changes shape', meaning: 'The system reorganizes when conditions move.' },
  },
  building: {
    low: { label: 'Plans stay on paper', meaning: 'Plans and knowledge rarely become working systems.' },
    high: { label: 'Plans get built', meaning: 'Plans and knowledge turn into things that work.' },
  },
  shared_purpose: {
    low: { label: 'Separate projects', meaning: 'People do not read themselves into a common effort.' },
    high: { label: 'One project', meaning: 'People can imagine themselves inside a common project.' },
  },
}
