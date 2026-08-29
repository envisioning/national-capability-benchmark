import { z } from 'zod'
import { DIMENSIONS } from './dimensions.js'

/**
 * The methodological test every indicator must pass, recorded in the dataset:
 * is this the capability itself, an input to it, or an outcome correlated with it?
 */
export const MeasurementClass = z.enum(['C', 'I', 'O', 'P'])
export type MeasurementClass = z.infer<typeof MeasurementClass>

export const MEASUREMENT_CLASS_LABELS: Record<MeasurementClass, string> = {
  C: 'direct capability measure',
  I: 'capability input',
  O: 'downstream outcome',
  P: 'perception proxy',
}

/** Source tiers, ordered best to worst. The weight feeds confidence, never the score. */
export const SOURCE_TIERS = {
  official_statistical: 1.0,
  international_organization: 0.95,
  academic_survey: 0.85,
  composite_index: 0.7,
  expert_panel: 0.5,
  llm_delphi: 0.3,
} as const

export const SourceTier = z.enum(
  Object.keys(SOURCE_TIERS) as [keyof typeof SOURCE_TIERS],
)
export type SourceTier = keyof typeof SOURCE_TIERS

export const Direction = z.enum(['higher_better', 'lower_better'])
export type Direction = z.infer<typeof Direction>

/** How a raw fetched series becomes the analysed value. */
export const Transform = z.enum([
  'none',
  'per_million_population',
  'log10',
  'distance_from_100',
])
export type Transform = z.infer<typeof Transform>

export const DimensionEnum = z.enum(DIMENSIONS)

export const IndicatorSource = z.object({
  /** Publisher, e.g. "World Bank", "OECD", "World Values Survey". */
  publisher: z.string(),
  /** Series or dataset identifier at the publisher, e.g. a World Bank series code. */
  series: z.string().optional(),
  url: z.string().url().optional(),
  tier: SourceTier,
  /** False for proprietary rankings whose underlying data cannot be inspected. */
  inspectable: z.boolean(),
})

export const IndicatorDef = z.object({
  id: z.string(),
  dimension: DimensionEnum,
  name: z.string(),
  /** What the number means, in one sentence. */
  definition: z.string(),
  unit: z.string(),
  measurementClass: MeasurementClass,
  direction: Direction,
  transform: Transform.default('none'),
  source: IndicatorSource,
  /**
   * How the value is obtained.
   * - worldbank: fetched live from the World Bank v2 API by `source.series`
   * - manual: a value a human entered into data/observations/manual.json
   * - gap: no adequate international dataset exists yet; deliberately unmeasured
   * - retired: a dataset exists and this project disqualified it. The row stays
   *   so the reason stays auditable. Retired indicators are not fetched and not
   *   scored, and they lower coverage exactly as a gap does. See D23.
   */
  ingest: z.enum(['worldbank', 'manual', 'gap', 'retired']),
  /**
   * Which family inside the dimension the indicator belongs to.
   *
   * A dimension can ask two different questions that both belong under one
   * name. Trust asks whether people rely on strangers and whether they rely on
   * institutions, and three survey items about the first are not three
   * independent signals. The family is recorded so the diagnostics can report
   * what a score actually rests on. It does not weight anything: scoring stays
   * the equal-weight mean of whatever is observed. See D57.
   */
  family: z.string().optional(),
  /** Denominator series, for transform = per_million_population. */
  denominatorSeries: z.string().optional(),
  /**
   * World Bank API database id, named in `WB_DATABASES` in sources.ts. Omit for
   * World Development Indicators. The v2 API refuses a code from any other
   * database when the request carries no source parameter.
   */
  wbSourceId: z.number().int().optional(),
  /** Why this indicator is here, and what it is known to get wrong. */
  notes: z.string(),
  /** Prior suspicion that this mostly measures wealth. 0 = none, 1 = certain. Delphi revises it. */
  wealthProxyPrior: z.number().min(0).max(1),
})
export type IndicatorDef = z.infer<typeof IndicatorDef>

/**
 * A published series that sits beside a dimension and never inside it.
 *
 * A check is fetched like an indicator and published like one, and it is
 * excluded from the frame, the mean, the coverage floor and the confidence. It
 * exists for a series that measures something real about the dimension and
 * fails the project's own test for scoring it, usually because it tracks income
 * too closely. Publishing it beside the score is how the reader sees the
 * evidence without the model claiming the number. See D60.
 */
export const CheckDef = z.object({
  id: z.string(),
  dimension: DimensionEnum,
  /** The family it speaks to, where the dimension declares families. See D57. */
  family: z.string().optional(),
  name: z.string(),
  definition: z.string(),
  unit: z.string(),
  direction: Direction,
  source: IndicatorSource,
  /** World Bank API database id. Omit for World Development Indicators. */
  wbSourceId: z.number().int().optional(),
  /** Why it is beside the score rather than in it. Rendered to the reader. */
  notes: z.string(),
})
export type CheckDef = z.infer<typeof CheckDef>

export const Observation = z.object({
  indicatorId: z.string(),
  iso3: z.string().length(3),
  value: z.number(),
  year: z.number().int(),
  sourceTier: SourceTier,
  sourceUrl: z.string().optional(),
  retrievedAt: z.string(),
  note: z.string().optional(),
})
export type Observation = z.infer<typeof Observation>

export const ObservationFile = z.object({
  generatedAt: z.string(),
  observations: z.array(Observation),
})

/**
 * One value that changed between two ingest runs.
 *
 * A published statistic is not fixed. Agencies restate, rebase and revise, and
 * an ingest that overwrites its own file makes that invisible. Every run writes
 * what moved into `data/observations/revisions.json`, so a number that changed
 * under us is a record rather than a surprise. See D25.
 */
export const Revision = z.object({
  indicatorId: z.string(),
  iso3: z.string().length(3),
  year: z.number().int(),
  /** Null when the run added a year that was not there before. */
  from: z.number().nullable(),
  /** Null when the run dropped a year the publisher no longer carries. */
  to: z.number().nullable(),
})
export type Revision = z.infer<typeof Revision>

export const RevisionRun = z.object({
  /** When the ingest ran. */
  retrievedAt: z.string(),
  /** Retrieval date of the file this run was compared against. */
  previousRetrievedAt: z.string().nullable(),
  observationsBefore: z.number().int(),
  observationsAfter: z.number().int(),
  changed: z.number().int(),
  added: z.number().int(),
  removed: z.number().int(),
  /** Every change, or the first `cap` of them when a run rewrites everything. */
  revisions: z.array(Revision),
  /** Set when the list above was capped, with the number left out. */
  omitted: z.number().int().default(0),
})
export type RevisionRun = z.infer<typeof RevisionRun>

export const RevisionFile = z.object({
  runs: z.array(RevisionRun),
})

/* ------------------------------- Delphi ------------------------------- */

export const PanelistId = z.string()

/** Round-1 and round-2 judgement of one country x dimension cell. */
export const DelphiCellEstimate = z.object({
  iso3: z.string().length(3),
  dimension: DimensionEnum,
  round: z.number().int().min(1),
  panelist: PanelistId,
  model: z.string(),
  /** 0-100 on the same scale as the indicator-derived dimension score. */
  score: z.number().min(0).max(100),
  /** Panelist's own certainty, 0-1. Not the benchmark confidence score. */
  selfConfidence: z.number().min(0).max(1),
  rationale: z.string(),
  /** What the panelist would need in order to be sure. Feeds the data-gap report. */
  missingEvidence: z.array(z.string()).default([]),
})
export type DelphiCellEstimate = z.infer<typeof DelphiCellEstimate>

/** Panel judgement about an indicator itself, not about a country. */
export const DelphiIndicatorJudgement = z.object({
  indicatorId: z.string(),
  round: z.number().int().min(1),
  panelist: PanelistId,
  model: z.string(),
  measurementClass: MeasurementClass,
  /** Does this measure the dimension it is filed under? 0-1. */
  constructValidity: z.number().min(0).max(1),
  /** Does this mostly track income per head? 0-1. */
  wealthProxyRisk: z.number().min(0).max(1),
  /** Ids of indicators this one is judged to duplicate. */
  redundantWith: z.array(z.string()).default([]),
  rationale: z.string(),
})
export type DelphiIndicatorJudgement = z.infer<typeof DelphiIndicatorJudgement>

/**
 * How a Delphi run was produced. This is the field that decides whether a run
 * may be cited as evidence, so it is stored rather than inferred. Inferring it
 * from a model string is how a dry run ends up in a report.
 *
 * - gateway    a real multi-vendor LLM panel through the AI Gateway
 * - in_session an agent or person scoring inside a working session, often N=1
 * - human      a human expert panel
 * - mock       the deterministic offline stand-in; exercises the pipeline only
 */
export const Provenance = z.enum(['gateway', 'in_session', 'human', 'mock'])
export type Provenance = z.infer<typeof Provenance>

/** Whether a run of this provenance may be quoted as evidence about a country. */
export function isEvidential(provenance: Provenance): boolean {
  return provenance !== 'mock'
}

/** A panel estimate is usable for published output only on its source frame. */
export function isDelphiRunForDataset(
  run: { datasetVersion?: string | undefined },
  datasetVersion: string,
): boolean {
  return run.datasetVersion === datasetVersion
}

/** The provenance kinds in plain language, for any surface that names one. */
export const PROVENANCE_LABELS: Record<Provenance, string> = {
  gateway: 'multi-vendor model panel',
  in_session: 'working session',
  human: 'human expert panel',
  mock: 'offline stand-in, not evidence',
}

/** Whether a run of this provenance carries a real distribution across panelists. */
export function isPanel(run: { provenance: Provenance; panel: unknown[] }): boolean {
  return isEvidential(run.provenance) && run.panel.length >= 3
}

/**
 * Panel IQR above this many points is unresolved disagreement rather than
 * noise: a quarter of the scale between the middle half of the panel. Every
 * surface that computes or explains dissent reads this constant. See D12.
 */
export const DISSENT_IQR = 25

export const DelphiRunFile = z.object({
  runId: z.string(),
  generatedAt: z.string(),
  provenance: Provenance,
  /** One line on how this run was produced and what it may be used for. */
  note: z.string().default(''),
  /** Dataset frame the evidence brief and panel scores were built from. */
  datasetVersion: z.string().optional(),
  /** Countries included in the run. Empty means a legacy run with unknown scope. */
  countrySet: z.array(z.string().length(3)).optional(),
  /** A subset run is a preflight and must not replace the active full run by accident. */
  scope: z.enum(['full', 'subset']).optional(),
  /** Highest dimension coverage included in the panel prompt. */
  maxCoverage: z.number().min(0).max(1).optional(),
  /** Version of the prompt contract used to produce the estimates. */
  promptVersion: z.string().optional(),
  panel: z.array(z.object({ panelist: z.string(), model: z.string(), stance: z.string() })),
  rounds: z.number().int(),
  cellEstimates: z.array(DelphiCellEstimate),
  indicatorJudgements: z.array(DelphiIndicatorJudgement),
})
export type DelphiRunFile = z.infer<typeof DelphiRunFile>

/* ------------------------------- Results ------------------------------- */

export const IndicatorResult = z.object({
  indicatorId: z.string(),
  name: z.string(),
  measurementClass: MeasurementClass,
  raw: z.number().nullable(),
  transformed: z.number().nullable(),
  normalized: z.number().nullable(),
  year: z.number().nullable(),
  source: z.string(),
  sourceTier: SourceTier.nullable(),
  winsorized: z.boolean(),
  /** The value sat outside the frame, so the score was clamped to 0 or 100. */
  outOfFrame: z.boolean().default(false),
  /**
   * Every observed year for this country, with the value as published and the
   * same value normalised against the current frame.
   *
   * Observations only: nothing is carried forward and nothing is interpolated,
   * so a gap in the line is a real gap. Each point carries its own source tier,
   * because a series will eventually mix an international republisher with a
   * national statistics office and the reader has to see which is which.
   * Normalised values reverse lower-is-better indicators, so higher is always
   * better on that axis and never on `raw`. See D25.
   */
  series: z
    .array(
      z.object({
        year: z.number().int(),
        raw: z.number(),
        normalized: z.number(),
        tier: SourceTier,
      }),
    )
    .default([]),
  status: z.enum(['observed', 'missing', 'gap', 'retired']),
})
export type IndicatorResult = z.infer<typeof IndicatorResult>

/**
 * Change in a dimension over a fixed span, measured on the current frame and on
 * the indicators observed at both ends. `baseScore` and `currentScore` describe
 * that matched basket and are not the headline score. See docs/DECISIONS.md D22.
 */
export const Momentum = z.object({
  baseYear: z.number().int(),
  currentYear: z.number().int(),
  baseScore: z.number(),
  currentScore: z.number(),
  delta: z.number(),
  matchedIndicators: z.number().int(),
  basket: z.array(z.string()),
  /** Cells that sat outside the current frame at one end and were clamped. */
  clamped: z.number().int(),
  series: z.array(z.object({ year: z.number().int(), score: z.number() })),
})
export type Momentum = z.infer<typeof Momentum>

/** One check's latest observed value for one country. Never scored. See D60. */
export const CheckResult = z.object({
  checkId: z.string(),
  name: z.string(),
  definition: z.string(),
  unit: z.string(),
  direction: Direction,
  family: z.string().optional(),
  /** Null where the publisher covers no year for this country. */
  value: z.number().nullable(),
  year: z.number().int().nullable(),
  source: z.string(),
  sourceTier: SourceTier.nullable(),
  /** Why the number is beside the score. Carried into the file so a consumer reading only JSON still gets it. */
  note: z.string(),
})
export type CheckResult = z.infer<typeof CheckResult>

export const DimensionResult = z.object({
  /**
   * Indicator-derived score. Delphi never enters this number.
   *
   * Null when fewer than `MIN_INDICATORS_FOR_SCORE` of the dimension's
   * indicators are observed for this country. A mean of one number is not a
   * measurement of a dimension, and printing it invites a decision the evidence
   * cannot carry. `observedIndicators` says how many there were. See D45.
   */
  score: z.number().nullable(),
  /** How many of the dimension's indicators have a value for this country. */
  observedIndicators: z.number().int(),
  /** True when the score is withheld because too few indicators are observed. */
  belowCoverageFloor: z.boolean(),
  /** coverage x recency x source_quality. Reported separately, never folded into score. */
  confidence: z.number(),
  confidenceParts: z.object({
    coverage: z.number(),
    recency: z.number(),
    sourceQuality: z.number(),
  }),
  /** Panel median for this cell, when a Delphi run is loaded. */
  delphiScore: z.number().nullable(),
  /** Interquartile range of panel estimates. Wide range = unresolved disagreement. */
  delphiIqr: z.number().nullable(),
  delphiDissent: z.boolean(),
  /** score when present, else delphiScore only when no indicator is observed. */
  blendedScore: z.number().nullable(),
  blendedFrom: z.enum(['indicators', 'delphi', 'none']),
  /**
   * One entry per span, shortest first. Empty when no span has enough
   * indicators observed at both ends. The short span is broad and shallow, the
   * long one is narrow and deep, and they answer different questions.
   */
  momentum: z.array(Momentum),
  indicators: z.array(IndicatorResult),
  /**
   * Series published beside this dimension and excluded from every number above.
   * Empty for a dimension that declares no check. See D60.
   */
  checks: z.array(CheckResult),
})
export type DimensionResult = z.infer<typeof DimensionResult>

export const CountryResult = z.object({
  country: z.string(),
  iso3: z.string(),
  dimensions: z.record(DimensionEnum, DimensionResult),
})
export type CountryResult = z.infer<typeof CountryResult>

/*
 * The published files themselves, not just the rows inside them. These are the
 * shapes `bench score` emits as JSON Schema into `data/out/schema/`, so a
 * consumer that is not TypeScript can validate what it reads. See D37.
 */

export const IndexFile = z.object({
  generatedAt: z.string(),
  /** Dataset version, semantic. Bump rules in model/version.ts. */
  version: z.string(),
  /** Summarized: indicator rows and momentum series are stripped. See D27. */
  countries: z.array(CountryResult),
})
export type IndexFile = z.infer<typeof IndexFile>

export const CountryFile = z.object({
  generatedAt: z.string(),
  version: z.string(),
  country: CountryResult,
})
export type CountryFile = z.infer<typeof CountryFile>

/* ------------------------------ Evidence ------------------------------ */

/**
 * A documented case of a country doing the thing an indicator is meant to
 * measure, recorded against an indicator that has no dataset behind it.
 *
 * Evidence records never enter `DimensionResult.score` and never raise
 * confidence. A gap stays a gap until an indicator covers at least two
 * countries and can be normalised against the frame. The records
 * exist so a known national delivery is written down with its source, its year
 * and its limits, instead of being argued in prose beside the chart. See
 * docs/DECISIONS.md D20.
 */
/** One published number with its reference period, as published. */
export const EvidenceMetric = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  /** Reference period of the number, as published. */
  asOf: z.string(),
})
export type EvidenceMetric = z.infer<typeof EvidenceMetric>

/**
 * Where the delivery stands as of the record's retrieval date.
 *
 * The field exists so a reversal is a value, not a nuance buried in prose.
 * D33 requires the corpus to carry its reversals, and a quota over free text
 * cannot be checked. `pnpm bench validate` counts these.
 *
 * - operating   running now, at or near the scale the claim describes
 * - concluded   the delivery finished and the result stands
 * - eroded      still running, but a documented part of its peak is gone
 * - dismantled  ended by decision or collapse
 */
export const EvidenceStatus = z.enum(['operating', 'concluded', 'eroded', 'dismantled'])
export type EvidenceStatus = z.infer<typeof EvidenceStatus>

export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  operating: 'still operating',
  concluded: 'delivered and closed',
  eroded: 'operating below its peak',
  dismantled: 'dismantled',
}

/** A reversal is evidence about durability, not about peak performance. */
export function isReversal(status: EvidenceStatus): boolean {
  return status === 'eroded' || status === 'dismantled'
}

export const EvidenceRecord = z.object({
  id: z.string(),
  /** The indicator this record bears on. Must exist in the registry. */
  indicatorId: z.string(),
  iso3: z.string().length(3),
  title: z.string(),
  /** What was delivered, and at what scale. One sentence. */
  claim: z.string(),
  /** The published number that carries the claim. */
  metric: EvidenceMetric,
  /**
   * A second published number, for the claims one number cannot hold. A record
   * of erosion pairs the current value with the peak it fell from. A delivery
   * record can pair scale with a cost or schedule figure. The `name` on each
   * metric says which is which. Validation warns when an `eroded` record has
   * no second metric, because a loss with no peak recorded cannot be seen.
   */
  secondMetric: EvidenceMetric.optional(),
  /** Year the programme started. */
  started: z.number().int(),
  status: EvidenceStatus,
  source: z.object({
    publisher: z.string(),
    url: z.string().url(),
    tier: SourceTier,
    retrievedAt: z.string(),
  }),
  /**
   * What this record does not show. Required: a case without its limits is
   * advocacy, and this layer exists to avoid exactly that.
   */
  limits: z.string(),
  /**
   * How it worked, and what had to be true for it to work.
   *
   * The rest of the record is sourced: a published number from a named
   * publisher. This field is not. It is Envisioning's reading of the mechanism,
   * and it is the part that travels between countries, because a number
   * describes one country and a mechanism describes a move somebody else could
   * make. Kept separate from the sourced fields for exactly that reason.
   *
   * Optional, because a documented delivery whose mechanism nobody has worked
   * out yet is still worth recording. Validation warns when it is missing.
   */
  pattern: z
    .object({
      /** The move itself, in one or two sentences. Active voice, name the actor. */
      mechanism: z.string(),
      /** What had to already exist. The reason a copy fails elsewhere. */
      preconditions: z.array(z.string()),
      /** Where this has been tried again, and what changed in the retelling. */
      travelled: z.string().optional(),
    })
    .optional(),
})
export type EvidenceRecord = z.infer<typeof EvidenceRecord>

export const EvidenceFile = z.object({
  generatedAt: z.string(),
  records: z.array(EvidenceRecord),
})

/* -------------------------- Cross-country views -------------------------- */

/**
 * One indicator across every country, so a single number can be read against
 * the field it sits in. A score of 17.6 means nothing alone. Beside the other
 * 39 countries and the two values that fix the ends of the scale, it means
 * something. See D30.
 */
export const IndicatorAcrossCountries = z.object({
  indicatorId: z.string(),
  values: z.array(
    z.object({
      iso3: z.string().length(3),
      country: z.string(),
      raw: z.number(),
      normalized: z.number(),
      year: z.number().int(),
      tier: SourceTier,
      outOfFrame: z.boolean(),
      /** True for the ten countries whose values fix the ends of the scale. */
    }),
  ),
})
export type IndicatorAcrossCountries = z.infer<typeof IndicatorAcrossCountries>
