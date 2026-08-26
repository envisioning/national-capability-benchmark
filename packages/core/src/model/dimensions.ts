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
  building: 'Execution',
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
