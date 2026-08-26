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
export const Transform = z.enum(['none', 'per_million_population', 'log10'])
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
   */
  ingest: z.enum(['worldbank', 'manual', 'gap']),
  /** Denominator series, for transform = per_million_population. */
  denominatorSeries: z.string().optional(),
  /**
   * World Bank API database id. Omit for World Development Indicators (2).
   * 1 = Doing Business, 3 = Worldwide Governance Indicators, 63 = Human Capital
   * Index, 70 = Economic Fitness 2. The v2 API refuses these codes without it.
   */
  wbSourceId: z.number().int().optional(),
  /** Why this indicator is here, and what it is known to get wrong. */
  notes: z.string(),
  /** Prior suspicion that this mostly measures wealth. 0 = none, 1 = certain. Delphi revises it. */
  wealthProxyPrior: z.number().min(0).max(1),
})
export type IndicatorDef = z.infer<typeof IndicatorDef>

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

/** Whether a run of this provenance carries a real distribution across panelists. */
export function isPanel(run: { provenance: Provenance; panel: unknown[] }): boolean {
  return isEvidential(run.provenance) && run.panel.length >= 3
}

export const DelphiRunFile = z.object({
  runId: z.string(),
  generatedAt: z.string(),
  provenance: Provenance,
  /** One line on how this run was produced and what it may be used for. */
  note: z.string().default(''),
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
  /** The value sat outside the reference frame, so the score was clamped to 0 or 100. */
  outOfFrame: z.boolean().default(false),
  status: z.enum(['observed', 'missing', 'gap']),
})
export type IndicatorResult = z.infer<typeof IndicatorResult>

export const DimensionResult = z.object({
  /** Indicator-derived score. Delphi never enters this number. */
  score: z.number().nullable(),
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
  /** score when present, else delphiScore. The blended view, kept explicitly separate. */
  blendedScore: z.number().nullable(),
  blendedFrom: z.enum(['indicators', 'delphi', 'none']),
  indicators: z.array(IndicatorResult),
})
export type DimensionResult = z.infer<typeof DimensionResult>

export const CountryResult = z.object({
  country: z.string(),
  iso3: z.string(),
  dimensions: z.record(DimensionEnum, DimensionResult),
})
export type CountryResult = z.infer<typeof CountryResult>

/* ------------------------------ Evidence ------------------------------ */

/**
 * A documented case of a country doing the thing an indicator is meant to
 * measure, recorded against an indicator that has no dataset behind it.
 *
 * Evidence records never enter `DimensionResult.score` and never raise
 * confidence. A gap stays a gap until an indicator covers at least two
 * reference countries and can be normalised against the frame. The records
 * exist so a known national delivery is written down with its source, its year
 * and its limits, instead of being argued in prose beside the chart. See
 * docs/DECISIONS.md D20.
 */
export const EvidenceRecord = z.object({
  id: z.string(),
  /** The indicator this record bears on. Must exist in the registry. */
  indicatorId: z.string(),
  iso3: z.string().length(3),
  title: z.string(),
  /** What was delivered, and at what scale. One sentence. */
  claim: z.string(),
  /** The published number that carries the claim. */
  metric: z.object({
    name: z.string(),
    value: z.number(),
    unit: z.string(),
    /** Reference period of the number, as published. */
    asOf: z.string(),
  }),
  /** Year the programme started. */
  started: z.number().int(),
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
})
export type EvidenceRecord = z.infer<typeof EvidenceRecord>

export const EvidenceFile = z.object({
  generatedAt: z.string(),
  records: z.array(EvidenceRecord),
})
