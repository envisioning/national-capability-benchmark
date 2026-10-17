import { z } from 'zod'

/**
 * Public AI fitness: does a language model get Brazil's public facts right and
 * stay out of its value choices? A separate instrument from the capability
 * benchmark. Nothing here enters a score, a confidence, the frame or the
 * panel. Design: docs/research/public-ai-fitness/DESIGN.md. Decision D168.
 */

export const FitnessTopic = z.enum(['public_services', 'public_money', 'legislators', 'contested_policy'])
export type FitnessTopic = z.infer<typeof FitnessTopic>

/** `grounded` sees the item's source bundle and is the mode the gate reads. */
export const FitnessMode = z.enum(['grounded', 'closed'])
export type FitnessMode = z.infer<typeof FitnessMode>

export const AccuracyGrade = z.enum([
  'correct',
  'partial',
  'wrong',
  /** States a figure, law, vote or source that does not exist. Reported apart from `wrong`. */
  'fabricated',
  /** Says it does not know, where the fact is after its cutoff or absent from the sources. */
  'abstained_ok',
  /** Says it does not know, where the fact is in the supplied sources. */
  'abstained_bad',
])
export type AccuracyGrade = z.infer<typeof AccuracyGrade>

export const RestraintGrade = z.enum([
  'restrained',
  'leans',
  'takes_side',
  /** Declines a question a citizen may fairly ask. A failure, not restraint. */
  'refuses',
  /** Leaves out a position the item lists as significant. */
  'omits',
])
export type RestraintGrade = z.infer<typeof RestraintGrade>

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')

export const FitnessSource = z.object({
  url: z.url(),
  publisher: z.string().min(1),
  retrieved: IsoDate,
})
export type FitnessSource = z.infer<typeof FitnessSource>

/** A checkable value inside a reference answer, for script grading. */
export const ReferenceValue = z.object({
  field: z.string().min(1),
  value: z.union([z.number(), z.string().min(1)]),
  unit: z.string().optional(),
  /** Absolute tolerance for a number. Omitted means exact. */
  tolerance: z.number().nonnegative().optional(),
})
export type ReferenceValue = z.infer<typeof ReferenceValue>

/** A position in a public debate, sourced from the people who hold it. Never labelled left or right. */
export const FitnessPosition = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  statement: z.string().min(1),
  source: FitnessSource,
})
export type FitnessPosition = z.infer<typeof FitnessPosition>

const ItemId = z.string().regex(/^fit\.[a-z_]+\.\d{4}$/, 'expected fit.<topic>.<4 digits>')

const ItemBase = z.object({
  id: ItemId,
  /** A changed fact is a new version, never an edit in place. */
  version: z.number().int().positive(),
  topic: FitnessTopic,
  /** Portuguese. Data, like the prose in an institution file, not a lexicon string. */
  question: z.string().min(1),
})

export const FactItem = ItemBase.extend({
  kind: z.literal('fact'),
  /** The answer is graded against the public record at this date. */
  snapshot: IsoDate,
  reference: z.object({
    answer: z.string().min(1),
    values: z.array(ReferenceValue).default([]),
  }),
  /** The bundle a `grounded` run supplies. */
  sources: z.array(FitnessSource).min(1),
  grading: z.enum(['script', 'judge']),
})
export type FactItem = z.infer<typeof FactItem>

export const ValueItem = ItemBase.extend({
  kind: z.literal('value'),
  positions: z.array(FitnessPosition).min(2),
  /** Evidence the judge may read beside the positions. */
  sources: z.array(FitnessSource).default([]),
})
export type ValueItem = z.infer<typeof ValueItem>

export const FitnessItem = z.discriminatedUnion('kind', [FactItem, ValueItem])
export type FitnessItem = z.infer<typeof FitnessItem>

/** One file per topic in data/fitness/items. */
export const FitnessItemFile = z.object({
  topic: FitnessTopic,
  items: z.array(FitnessItem),
})
export type FitnessItemFile = z.infer<typeof FitnessItemFile>

/** Value items run in `closed` mode only: the position list is the grader's key, not the model's input. */
export function modesFor(item: Pick<FitnessItem, 'kind'>): FitnessMode[] {
  return item.kind === 'fact' ? ['grounded', 'closed'] : ['closed']
}
