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

/* ------------------------------ runs (FIT-3) ----------------------------- */

/** Mirrors `Provenance` in model/schema.ts: stored on the file, never inferred from a model id (D14). */
export const FitnessProvenance = z.enum(['gateway', 'maritaca', 'mock'])
export type FitnessProvenance = z.infer<typeof FitnessProvenance>

export const FitnessRunModel = z.object({
  id: z.string(),
  lab: z.string(),
  label: z.string(),
  /** The provider that answered for this model. */
  provider: z.string(),
  provenance: FitnessProvenance,
  /** The id actually called: the gateway's `-batch` id where a batch run used one. */
  callId: z.string(),
})
export type FitnessRunModel = z.infer<typeof FitnessRunModel>

/** One answer, or one failed call. A failed call is kept with its error, never dropped. */
export const FitnessAnswer = z.object({
  itemId: z.string(),
  itemVersion: z.number().int().positive(),
  topic: FitnessTopic,
  model: z.string(),
  mode: FitnessMode,
  /** 1-based. */
  sample: z.number().int().positive(),
  promptHash: z.string(),
  text: z.string().nullable(),
  error: z.string().optional(),
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
  ms: z.number().nonnegative(),
})
export type FitnessAnswer = z.infer<typeof FitnessAnswer>

/** A model, an item or an item-mode pair the run did not attempt, and why. */
export const FitnessSkip = z.object({
  model: z.string().optional(),
  itemId: z.string().optional(),
  mode: FitnessMode.optional(),
  reason: z.string(),
})
export type FitnessSkip = z.infer<typeof FitnessSkip>

export const FitnessRunFile = z.object({
  runId: z.string(),
  generatedAt: z.string(),
  /** `mock` if any answer came from the mock. Such a run is never evidence. */
  provenance: FitnessProvenance,
  note: z.string(),
  promptVersion: z.string(),
  samples: z.number().int().positive(),
  modes: z.array(FitnessMode),
  batch: z.boolean(),
  items: z.array(z.object({ id: z.string(), version: z.number().int(), topic: FitnessTopic, kind: z.enum(['fact', 'value']), hash: z.string() })),
  /** Source bundle hash per grounded item, so a rerun can tell a changed bundle. */
  bundles: z.record(z.string(), z.string()),
  models: z.array(FitnessRunModel),
  skipped: z.array(FitnessSkip),
  /** Every distinct prompt, keyed by the hash each answer carries. */
  prompts: z.record(z.string(), z.object({ system: z.string().nullable(), prompt: z.string() })),
  attemptedCalls: z.number().int().nonnegative(),
  failedCalls: z.number().int().nonnegative(),
  answers: z.array(FitnessAnswer),
})
export type FitnessRunFile = z.infer<typeof FitnessRunFile>

/* ----------------------------- grades (FIT-4) ---------------------------- */

/** What one judge returns. The gateway enforces it as structured output. */
export const JudgeOutput = z.object({
  accuracy: AccuracyGrade.nullable(),
  restraint: RestraintGrade,
  favouredPosition: z.string().nullable(),
  omittedPositions: z.array(z.string()),
  rationale: z.string(),
})
export type JudgeOutput = z.infer<typeof JudgeOutput>

export const JudgeVerdict = JudgeOutput.extend({ judge: z.string() })
export type JudgeVerdict = z.infer<typeof JudgeVerdict>

export const Construct = z.enum(['accuracy', 'restraint'])
export type Construct = z.infer<typeof Construct>

export const AnswerGrade = z.object({
  itemId: z.string(),
  topic: FitnessTopic,
  kind: z.enum(['fact', 'value']),
  model: z.string(),
  mode: FitnessMode,
  sample: z.number().int().positive(),
  /** Script grading on `grading: 'script'` items: how many reference values the answer states within tolerance. */
  script: z.object({ matched: z.number().int(), total: z.number().int() }).nullable(),
  verdicts: z.array(JudgeVerdict),
  /** Judge calls that failed for this answer. A grade with fewer than two verdicts is not final. */
  failedJudges: z.array(z.string()),
  /**
   * The grade the profile counts. Script `correct` when every reference value
   * matched; otherwise the judges' grade where both agree. Null where they
   * disagree or a verdict is missing: `disputed` says which.
   */
  accuracy: AccuracyGrade.nullable(),
  accuracyFrom: z.enum(['script', 'judges']).nullable(),
  restraint: RestraintGrade.nullable(),
  disputed: z.array(Construct),
  /** The position both judges name, on `leans` or `takes_side`. */
  favouredPosition: z.string().nullable(),
})
export type AnswerGrade = z.infer<typeof AnswerGrade>

/** Krippendorff's alpha between the judges, nominal, over one construct, topic and model. */
export const JudgeAgreement = z.object({
  construct: Construct,
  topic: FitnessTopic,
  model: z.string(),
  /** Answers where at least two judges graded the construct. */
  units: z.number().int().nonnegative(),
  /** Null where every judge gave one grade to every unit: agreement is then undefined, not perfect. */
  alpha: z.number().nullable(),
})
export type JudgeAgreement = z.infer<typeof JudgeAgreement>

export const RestraintStatus = z.enum(['readable', 'revise_rubric', 'stopped', 'no_reading'])
export type RestraintStatus = z.infer<typeof RestraintStatus>

export const FitnessGradeFile = z.object({
  runId: z.string(),
  gradedAt: z.string(),
  /** `mock` if the run or any judge was the mock. */
  provenance: FitnessProvenance,
  rubricRevision: z.number().int().nonnegative(),
  /** sha256 of the revision and the rubric text, fixed before the first call. */
  rubricHash: z.string(),
  judges: z.array(z.object({ id: z.string(), lab: z.string(), provenance: FitnessProvenance, callId: z.string() })),
  /** D168 rule 3, as fixed before any grading. */
  stopRule: z.object({
    alphaFloor: z.number(),
    revisionsAllowed: z.number().int(),
    /** Restraint alpha over every judged answer in the run. */
    restraintAlpha: z.number().nullable(),
    status: RestraintStatus,
  }),
  attemptedCalls: z.number().int().nonnegative(),
  failedCalls: z.number().int().nonnegative(),
  agreement: z.array(JudgeAgreement),
  grades: z.array(AnswerGrade),
})
export type FitnessGradeFile = z.infer<typeof FitnessGradeFile>

/* ----------------------------- outputs (FIT-6) ---------------------------- */

const Shares = <T extends z.ZodEnum>(grades: T) =>
  z.object({
    /** Answers with a final grade in this construct. */
    graded: z.number().int().nonnegative(),
    /** Answers the judges disagreed on, or that lack a verdict. Counted in no grade. */
    disputed: z.number().int().nonnegative(),
    counts: z.partialRecord(grades, z.number().int().nonnegative()),
    /** Share of every answer in the cell, disputed ones included in the denominator. */
    shares: z.partialRecord(grades, z.number()),
  })

export const FitnessProfileCell = z.object({
  topic: FitnessTopic,
  mode: FitnessMode,
  items: z.number().int().nonnegative(),
  answers: z.number().int().nonnegative(),
  failedAnswers: z.number().int().nonnegative(),
  accuracy: Shares(AccuracyGrade).nullable(),
  /** Null when the stop rule withholds the restraint reading. */
  restraint: Shares(RestraintGrade).nullable(),
  /** Value items: per item, how often each listed position was favoured. */
  favouredPositions: z.record(z.string(), z.record(z.string(), z.number().int())).nullable(),
  /** Share of items whose samples all received the same final grade. */
  sampleConsistency: z.object({ accuracy: z.number().nullable(), restraint: z.number().nullable() }),
  alpha: z.object({ accuracy: z.number().nullable(), restraint: z.number().nullable() }),
})
export type FitnessProfileCell = z.infer<typeof FitnessProfileCell>

export const FitnessProfileFile = z.object({
  generatedAt: z.string(),
  runId: z.string(),
  model: z.object({ id: z.string(), lab: z.string(), label: z.string(), provider: z.string() }),
  provenance: FitnessProvenance,
  rubricHash: z.string(),
  restraintStatus: RestraintStatus,
  cells: z.array(FitnessProfileCell),
})
export type FitnessProfileFile = z.infer<typeof FitnessProfileFile>

export const GateMeasure = z.object({
  measure: z.enum(['correct_share', 'fabricated_share', 'restrained_share', 'refuses_share']),
  op: z.enum(['>=', '<=']),
  threshold: z.number(),
  value: z.number().nullable(),
  pass: z.boolean().nullable(),
})
export type GateMeasure = z.infer<typeof GateMeasure>

export const GateStatus = z.enum(['pass', 'fail', 'undetermined'])
export type GateStatus = z.infer<typeof GateStatus>

/** Pass or fail per model and topic. Absolute, never an ordering (D168 rule 4). */
export const FitnessGateFile = z.object({
  generatedAt: z.string(),
  runId: z.string(),
  provenance: FitnessProvenance,
  thresholds: z.object({
    /** `provisional` until MZ sets them under FIT-0. */
    status: z.enum(['provisional', 'set']),
    source: z.string(),
  }),
  entries: z.array(
    z.object({
      model: z.string(),
      topic: FitnessTopic,
      mode: FitnessMode,
      status: GateStatus,
      reason: z.string().optional(),
      measures: z.array(GateMeasure),
    }),
  ),
})
export type FitnessGateFile = z.infer<typeof FitnessGateFile>
