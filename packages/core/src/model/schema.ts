import { z } from 'zod'
import { DIMENSIONS } from './dimensions.js'
import { LEVERAGE_DIMENSIONS } from './leverage.js'

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
export const LeverageDimensionEnum = z.enum(LEVERAGE_DIMENSIONS)

/** The spatial level an observation describes. National is the comparison layer. */
export const Geometry = z.enum(['national', 'state', 'province', 'region', 'municipality'])
export type Geometry = z.infer<typeof Geometry>

/** How a subnational observation relates to the national value it sits beside. */
export const Reconciliation = z.enum(['aggregate', 'independent', 'context_only'])
export type Reconciliation = z.infer<typeof Reconciliation>

/** How a published subnational file recomposes its constituent values. */
export const SubnationalDenominator = z.enum(['population', 'equal', 'none'])
export type SubnationalDenominator = z.infer<typeof SubnationalDenominator>

export const IndicatorSource = z.object({
  /** Publisher, e.g. "World Bank", "OECD", "World Values Survey". */
  publisher: z.string(),
  /** Series or dataset identifier at the publisher, e.g. a World Bank series code. */
  series: z.string().optional(),
  /** Stable id of a reproducible non-World-Bank adapter, where one exists. */
  adapter: z.string().optional(),
  url: z.string().url().optional(),
  tier: SourceTier,
  /** False for proprietary rankings whose underlying data cannot be inspected. */
  inspectable: z.boolean(),
})
export type IndicatorSource = z.infer<typeof IndicatorSource>

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
   * - adapter: fetched or parsed by the reproducible adapter named in `source.adapter`
   * - manual: a value a human entered into data/observations/manual.json
   * - gap: no adequate international dataset exists yet; deliberately unmeasured
   * - retired: a dataset exists and this project disqualified it. The row stays
   *   so the reason stays auditable. Retired indicators are not fetched and not
   *   scored, and they lower coverage exactly as a gap does. See D23.
   */
  ingest: z.enum(['worldbank', 'adapter', 'manual', 'gap', 'retired']),
  /**
   * What the row is read as.
   * - capability: the row observes the country doing what its dimension names,
   *   a behaviour, a throughput, an outcome or performance relative to
   *   resources. It is scored when it has data.
   * - condition: the row records what the country has to work with, a stock of
   *   infrastructure, access, money, people or enrolment, or income itself. It
   *   is fetched like an indicator and published beside its dimension as the
   *   publisher wrote it, and it enters no frame, mean, coverage count,
   *   confidence or trend. See D122, which extends D118 and D60.
   */
  role: z.enum(['capability', 'condition']).default('capability'),
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
  /** How finer-geometry observations may be read beside this indicator. */
  reconciliation: Reconciliation.default('context_only'),
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
  /**
   * The construct cannot be zero for a functioning economy, so a published
   * value of exactly 0 is a placeholder for a missing one. The World Bank
   * ingest drops it and logs the drop with its reason in revisions.json. Set
   * on the row from what it measures, never from which countries print a
   * zero: a share that can legitimately be 0 keeps its zeros. See D157.
   */
  zeroIsMissing: z.boolean().optional(),
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
  /**
   * How the series arrives. A `worldbank` check is requested on the indicator
   * ingest pass. An `adapter` check is emitted by a source adapter under the
   * check prefix and must name the pinned file it was read from. See D121.
   */
  ingest: z.enum(['worldbank', 'adapter']).default('worldbank'),
  /** World Bank API database id. Omit for World Development Indicators. */
  wbSourceId: z.number().int().optional(),
  /**
   * The pinned release an adapter check is read from: what `/sources` prints in
   * place of a World Bank request, so a reader can repeat the fetch. Required
   * when `ingest` is `adapter`.
   */
  pinned: z
    .object({
      /** The release named as a reader would cite it. */
      dataset: z.string(),
      /** The archive the adapter downloads. */
      url: z.string().url(),
      /** The file read inside the archive. */
      file: z.string(),
      /** The column read from that file. */
      variable: z.string(),
      /**
       * The year read. Under `latest_up_to` it is the ceiling: each country's
       * newest coded row up to it is read, and the observation keeps that row's
       * year. An election variable is coded in election years only. See D129.
       */
      year: z.number().int(),
      years: z.enum(['only', 'latest_up_to']).default('only'),
    })
    .optional(),
  /** Why it is beside the score rather than in it. Rendered to the reader. */
  notes: z.string(),
})
export type CheckDef = z.infer<typeof CheckDef>

export const Observation = z.object({
  indicatorId: z.string(),
  iso3: z.string().length(3),
  /** Defaults preserve the national comparison layer in pre-two-layer files. */
  geometry: Geometry.default('national'),
  reconciliation: Reconciliation.default('context_only'),
  value: z.number(),
  year: z.number().int(),
  sourceTier: SourceTier,
  sourceUrl: z.string().optional(),
  retrievedAt: z.string(),
  note: z.string().optional(),
})
export type Observation = z.infer<typeof Observation>

/** A published value for one constituent unit, kept outside the score matrix. */
export const SubnationalValue = z.object({
  iso: z.string().min(2),
  name: z.string().min(1),
  value: z.number(),
  year: z.number().int(),
  /** Required when the file's denominator is `population`. */
  denominatorValue: z.number().positive().optional(),
})
export type SubnationalValue = z.infer<typeof SubnationalValue>

/** The computed reconciliation result carried by every subnational file. */
export const SubnationalCheck = z.object({
  /** Null when denominator is `none`, because no recomposition is claimed. */
  recomposed: z.number().nullable(),
  national: z.number(),
  /** Signed as recomposed minus national; null when no recomposition is claimed. */
  residual: z.number().nullable(),
  /** A per-series display and validation tolerance, in the file's unit. */
  tolerance: z.number().nonnegative(),
})
export type SubnationalCheck = z.infer<typeof SubnationalCheck>

/** A published subnational series, kept beside and outside the national score. */
export const SubnationalFile = z.object({
  indicatorId: z.string().min(1),
  iso3: z.string().length(3),
  geometry: Geometry.exclude(['national']),
  reconciliation: Reconciliation,
  denominator: SubnationalDenominator,
  unit: z.string().min(1),
  direction: Direction,
  transform: Transform,
  asOf: z.string().date(),
  retrievedAt: z.string(),
  source: z.string().min(1),
  sourceUrl: z.string().url(),
  denominatorSource: z
    .object({
      publisher: z.string().min(1),
      year: z.number().int(),
      url: z.string().url(),
    })
    .nullable(),
  national: z.object({ value: z.number(), year: z.number().int() }),
  check: SubnationalCheck,
  units: z.array(SubnationalValue),
})
export type SubnationalFile = z.infer<typeof SubnationalFile>

/** Small directory index for readers and layer registries. */
export const SubnationalIndexFile = z.object({
  generatedAt: z.string(),
  files: z.array(
    z.object({
      indicatorId: z.string().min(1),
      iso3: z.string().length(3),
      path: z.string().min(1),
      geometry: Geometry.exclude(['national']),
      year: z.number().int(),
      reconciliation: Reconciliation,
      denominator: SubnationalDenominator,
      residual: z.number().nullable(),
      units: z.number().int().nonnegative(),
    }),
  ),
})
export type SubnationalIndexFile = z.infer<typeof SubnationalIndexFile>

export const ObservationFile = z.object({
  generatedAt: z.string(),
  observations: z.array(Observation),
})

/**
 * Why an ingest rule dropped a published value.
 * - zero_is_missing: the publisher printed exactly 0 on a row whose registry
 *   definition carries `zeroIsMissing`. See D157.
 */
export const IngestDropReason = z.enum(['zero_is_missing'])
export type IngestDropReason = z.infer<typeof IngestDropReason>

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
  geometry: Geometry.default('national'),
  /** Constituent-unit id for subnational revisions; absent for national rows. */
  unit: z.string().optional(),
  year: z.number().int(),
  /** Null when the run added a year that was not there before. */
  from: z.number().nullable(),
  /** Null when the run dropped a year the publisher no longer carries. */
  to: z.number().nullable(),
  /**
   * Set when the value left because an ingest rule dropped it rather than
   * because the publisher stopped carrying it. See `IngestDrop`.
   */
  reason: IngestDropReason.optional(),
})
export type Revision = z.infer<typeof Revision>

/**
 * A value the publisher printed and the ingest declined to store. Listed on
 * every run that drops it, so the rule stays visible after the first diff has
 * recorded the cell leaving the file.
 */
export const IngestDrop = z.object({
  indicatorId: z.string(),
  iso3: z.string().length(3),
  year: z.number().int(),
  value: z.number(),
  series: z.string(),
  reason: IngestDropReason,
})
export type IngestDrop = z.infer<typeof IngestDrop>

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
  /**
   * Every published value an ingest rule dropped on this run, with the reason.
   * Absent on a run that dropped nothing and on every run before D157.
   */
  dropped: z.array(IngestDrop).optional(),
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
  /**
   * SHA-256 of the evidence the panelist read for this country and dimension
   * (`dimensionBrief`). A later dataset keeps the estimate only if the brief it
   * would build now hashes to the same value. Absent on runs written before
   * D160, and such a run never carries across a version. See D160.
   */
  briefHash: z.string().regex(/^[0-9a-f]{64}$/).optional(),
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
  /** SHA-256 of the audit rows of the indicator's dimension (`indicatorAuditHash`). See D160. */
  auditHash: z.string().regex(/^[0-9a-f]{64}$/).optional(),
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

/**
 * Whether a run file may be read for this dataset at all: it was produced on
 * exactly this version, or it is the applied file `bench score` wrote for it
 * (see `applyDelphiRun`, D160). Whether a given estimate in it still holds is
 * decided cell by cell, never by this function.
 */
export function isDelphiRunForDataset(
  run: { datasetVersion?: string | undefined; application?: { datasetVersion: string } | undefined },
  datasetVersion: string,
): boolean {
  return run.application
    ? run.application.datasetVersion === datasetVersion
    : run.datasetVersion === datasetVersion
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

/**
 * What `applyDelphiRun` did with a run on one dataset version. It is written
 * only on the applied file (`data/out/delphi-applied.json`), never on a run in
 * `data/delphi`. A dropped cell is listed, not hidden. See D160.
 */
export const DelphiApplication = z.object({
  /** The dataset the estimates now apply to. */
  datasetVersion: z.string(),
  /** The dataset the run was produced on. */
  sourceDatasetVersion: z.string().nullable(),
  /** `exact`: same version, every cell applies. `carried`: same major, cells matched by brief hash. */
  mode: z.enum(['exact', 'carried']),
  /** Country-dimension cells the run holds. */
  cells: z.number().int(),
  /** Cells that apply on this dataset. */
  carried: z.number().int(),
  dropped: z.array(
    z.object({
      iso3: z.string().length(3),
      dimension: DimensionEnum,
      /** `brief_changed`: the evidence differs. `no_hash`: the run stored no hash to compare. */
      reason: z.enum(['brief_changed', 'no_hash']),
    }),
  ),
  /** Indicator audit judgements kept and dropped, matched the same way on the audit rows. */
  judgementsCarried: z.number().int(),
  judgementsDropped: z.number().int(),
})
export type DelphiApplication = z.infer<typeof DelphiApplication>

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
  /** Provider calls attempted across every round and the audit. */
  attemptedCalls: z.number().int().optional(),
  /**
   * Provider calls that failed after retries. A failed call is dropped and the
   * run continues, so the cells it covered carry fewer panelists than the panel
   * declares. A shorter list narrows the IQR, and IQR is the dissent signal, so
   * a partial failure reads as agreement unless this number is published beside
   * it. See D106.
   */
  failedCalls: z.number().int().optional(),
  cellEstimates: z.array(DelphiCellEstimate),
  indicatorJudgements: z.array(DelphiIndicatorJudgement),
  /** Present only on the applied file, never in `data/delphi`. See D160. */
  application: DelphiApplication.optional(),
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
  /**
   * The latest value, set aside because it is more than
   * `MAX_SCORED_VALUE_AGE` years older than the reference year. The row then
   * reads `missing`: it enters no score, frame or coverage count. The value
   * and its year stay here and in `series`. Null on every other row. See D159.
   */
  staleExcluded: z
    .object({ year: z.number().int(), raw: z.number() })
    .nullable()
    .default(null),
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

/** One annual or five-year rate in the provisional velocity fixture. */
export const VelocityPoint = z.object({
  year: z.number().int(),
  value: z.number(),
})
export type VelocityPoint = z.infer<typeof VelocityPoint>

/** A dimension's exploratory velocity values, kept outside the scored output. */
export const VelocityCell = z.object({
  /** The latest year represented by the annual value, used to name `v<year>`. */
  latestYear: z.number().int(),
  /** Five-year velocity formatted for the fixture's compact display. */
  v5y: z.string().regex(/^[+-]\d+\.\d+$/).nullable(),
  /** Numeric rates by year, retained for sorting and later method review. */
  series: z.array(VelocityPoint),
}).catchall(z.string().regex(/^[+-]\d+\.\d+$/))
export type VelocityCell = z.infer<typeof VelocityCell>

/** The complete provisional velocity fixture written by `bench velocity`. */
export const VelocityFile = z.object({
  generatedAt: z.string(),
  methodVersion: z.literal('velocity/0.1-exploratory'),
  countries: z.record(z.string().length(3), z.record(DimensionEnum, VelocityCell.nullable())),
  exclusions: z.array(
    z.object({
      iso3: z.string().length(3),
      reason: z.string(),
    }),
  ),
})
export type VelocityFile = z.infer<typeof VelocityFile>

/** One provisional leverage input and its placeholder weighted-sum result. */
export const LeverageCell = z.object({
  value: z.number().min(0).max(100).nullable(),
  rawValue: z.number().min(0).max(1).nullable(),
  weight: z.number().nonnegative(),
  baseOffset: z.number().nonnegative(),
  note: z.string(),
  source: z
    .object({
      indicatorId: z.string(),
      publisher: z.string(),
      year: z.number().int(),
    })
    .nullable(),
})
export type LeverageCell = z.infer<typeof LeverageCell>

/** The complete provisional leverage fixture written by `bench leverage`. */
export const LeverageFile = z.object({
  generatedAt: z.string(),
  methodVersion: z.literal('leverage/0.1-exploratory'),
  countries: z.record(z.string().length(3), z.record(LeverageDimensionEnum, LeverageCell)),
})
export type LeverageFile = z.infer<typeof LeverageFile>

/**
 * One dimension's fit of score on log10 GDP per capita, and how much the fit
 * moves the order. A residual read against a weak fit is close to the score
 * itself, so the fit travels with every residual that came out of it.
 */
export const ResidualFit = z.object({
  dimension: DimensionEnum,
  /** Score points per tenfold increase in income, from ordinary least squares. */
  slope: z.number(),
  intercept: z.number(),
  pearson: z.number(),
  /** Share of the dimension's variation the income line explains. */
  rSquared: z.number(),
  n: z.number().int(),
  /** Spread of the residuals, so a reader can see what a large gap is. */
  residualSd: z.number(),
  /** strong, moderate or weak, banded on rSquared. */
  fitStrength: z.enum(['strong', 'moderate', 'weak']),
  /**
   * Mean absolute rank change between the score order and the residual order,
   * in places, read against `n` in the same row. A small number means the
   * residual re-states the score and ranks countries the same way the raw
   * score does.
   */
  meanAbsRankShift: z.number(),
})
export type ResidualFit = z.infer<typeof ResidualFit>

/** One country's distance from the income line on one dimension. */
export const ResidualCell = z.object({
  score: z.number(),
  /** What the dimension's income line predicts for this country. */
  predicted: z.number(),
  /** score minus predicted. Positive is above the line for its income. */
  residual: z.number(),
  /**
   * The fitted value fell outside the 0 to 100 scale, so the line predicts a
   * score that cannot exist and the residual is inflated by the impossible
   * part. Same convention as `outOfFrame` on a scored cell.
   */
  outOfScale: z.boolean(),
})
export type ResidualCell = z.infer<typeof ResidualCell>

/**
 * The complete provisional wealth-residual fixture written by `bench residual`.
 *
 * There is no country-level field in this shape and there never will be. Nine
 * residuals averaged into one number is the headline score D1 withholds, with a
 * regression in front of it. See D68.
 */
export const ResidualFile = z.object({
  generatedAt: z.string(),
  methodVersion: z.literal('residual/0.1-exploratory'),
  /** The World Bank context series the fit reads. Never scored. */
  gdpSeries: z.string(),
  fits: z.array(ResidualFit),
  countries: z.record(z.string().length(3), z.record(DimensionEnum, ResidualCell.nullable())),
  exclusions: z.array(
    z.object({
      iso3: z.string().length(3),
      reason: z.string(),
    }),
  ),
})
export type ResidualFile = z.infer<typeof ResidualFile>

/**
 * The chance level a first-factor share is read against: the same statistic
 * on independent standard normal columns at the same number of countries and
 * dimensions, drawn with a fixed seed so the figure repeats. See D137.
 */
export const FactorChance = z.object({
  draws: z.number().int(),
  seed: z.number().int(),
  /** Mean first-factor share across the draws. */
  mean: z.number(),
  /** 95th percentile of the same. A share at or under it is indistinguishable from noise. */
  p95: z.number(),
})
export type FactorChance = z.infer<typeof FactorChance>

/**
 * One principal-component reading of the dimension scores: the correlation
 * matrix over the countries that have every listed dimension scored, its
 * eigenvalues, and how much of the first component income accounts for.
 */
export const FactorSolution = z.object({
  /** The dimensions this solution reads, in registry order. */
  dimensions: z.array(DimensionEnum),
  /** Countries with every listed dimension scored. The correlations use these and no others. */
  countries: z.number().int(),
  /** Countries left out, each with the listed dimensions it publishes no score for. */
  dropped: z.array(
    z.object({ iso3: z.string().length(3), missing: z.array(DimensionEnum) }),
  ),
  /** Every eigenvalue of the correlation matrix, largest first. They sum to the dimension count. */
  eigenvalues: z.array(z.number()),
  /** Largest eigenvalue over the dimension count: the share of the total variance one factor carries. */
  firstFactorShare: z.number(),
  /**
   * Each dimension's correlation with the first factor (eigenvector times the
   * square root of its eigenvalue). The sign is set so the loadings sum to a
   * positive number.
   */
  loadings: z.array(z.object({ dimension: DimensionEnum, loading: z.number() })),
  /**
   * The first factor's country scores against log GDP per capita, over the
   * countries above that also have an income figure. `rSquared` is the share
   * of the factor income accounts for. Null where too few countries remain.
   */
  income: z
    .object({ r: z.number(), rSquared: z.number(), n: z.number().int() })
    .nullable(),
  chance: FactorChance,
})
export type FactorSolution = z.infer<typeof FactorSolution>

/**
 * The benchmark's central falsification test, computed every release. If the
 * nine dimensions are one factor that tracks income per head, the claim that
 * capability can be read apart from wealth fails. See D137.
 */
export const FactorStructure = z.object({
  /** Below this many complete cases the near-full solution is computed as well. */
  minCountries: z.number().int(),
  /** Share of countries a dimension has to score to count as near-full coverage. */
  nearFullCoverage: z.number(),
  /** All nine dimensions, complete cases only. Null when fewer than three countries remain. */
  complete: FactorSolution.nullable(),
  /**
   * The dimensions scored for at least `nearFullCoverage` of countries, on
   * their own complete cases. Present only when `complete` falls under
   * `minCountries`, and then the page says which dimensions it reads.
   */
  nearFull: FactorSolution.nullable(),
})
export type FactorStructure = z.infer<typeof FactorStructure>

/**
 * The same test at every dataset release whose output was committed, read
 * from git by `bench diagnose`. Past releases are restated only if their
 * committed output changes, which it does not. See D137.
 */
export const FactorHistoryRelease = z.object({
  version: z.string(),
  /** Short commit hash the release's data/out/index.json was read from. Null for the working tree. */
  commit: z.string().nullable(),
  date: z.string(),
  /** Which solution the row reports: all nine on complete cases, or the near-full fallback. */
  basis: z.enum(['complete', 'nearFull']),
  dimensions: z.array(DimensionEnum),
  countries: z.number().int(),
  firstFactorShare: z.number(),
  chance: FactorChance,
  /** Null where that release's diagnostics carried no income column. */
  income: z.object({ r: z.number(), rSquared: z.number(), n: z.number().int() }).nullable(),
})
export type FactorHistoryRelease = z.infer<typeof FactorHistoryRelease>

export const FactorHistoryFile = z.object({
  generatedAt: z.string(),
  releases: z.array(FactorHistoryRelease),
})
export type FactorHistoryFile = z.infer<typeof FactorHistoryFile>

/** A Monte Carlo null: how many draws, the seed that repeats them, and the figures read off them. */
const NullSummary = z.object({
  draws: z.number().int(),
  seed: z.number().int(),
  mean: z.number(),
  p95: z.number(),
})

/** A Monte Carlo null read at both tails. */
const NullSpread = z.object({
  draws: z.number().int(),
  seed: z.number().int(),
  mean: z.number(),
  p5: z.number(),
  p95: z.number(),
})

/**
 * What is left of the nine dimension scores after income, tested in aggregate
 * on the wealth residual of D68. Every field is a statistic over countries:
 * no country's residual, and no country's name, is in this shape, because
 * per-country residuals stay offline under D65. The reading rules were fixed
 * before the first run. See D138.
 */
export const ResidualStructure = z.object({
  /** Countries with all nine residuals: a score on every dimension and an income figure. */
  completeCases: z.number().int(),
  /** Countries in the registry left out of the complete cases. */
  excluded: z.number().int(),
  /** (a) Whether the residuals still move together once income is taken out. */
  structure: z
    .object({
      countries: z.number().int(),
      eigenvalues: z.array(z.number()),
      firstFactorShare: z.number(),
      loadings: z.array(z.object({ dimension: DimensionEnum, loading: z.number() })),
      /** The D137 chance level at one fewer country, because the fit spends a degree of freedom. */
      chance: FactorChance,
      /** Each residual column shuffled across countries on its own: the same distributions, nothing shared. */
      permutation: NullSummary,
      reading: z.enum(['structure', 'none']),
    })
    .nullable(),
  /** (b) Whether countries at the same income have different shapes once income is taken out. */
  peers: z
    .object({
      countries: z.number().int(),
      peerCount: z.number().int(),
      /**
       * Mean over countries of the mean squared distance between a country's
       * shape and its peers' shapes, per dimension, in squared residual
       * standard deviations. A shape is the nine standardised residuals minus
       * their own mean, so a country above its line everywhere has a level and
       * no shape.
       */
      observedMean: z.number(),
      /** The same mean with profiles kept whole and incomes dealt out at random: peers chosen without regard to income. Read at its 5th percentile. */
      incomeNull: NullSpread,
      /** First-factor share of the shape columns: how far shapes line up along shared contrasts. */
      shapeShare: z.number(),
      /** The same share with each residual column dealt out at random first: no country-specific shape. Read at its 95th percentile. */
      shapeNull: NullSpread,
      /** Descriptive, not read: the peer distance under that same random dealing. */
      noiseFloor: NullSpread,
      /** Descriptive, not read: share of countries whose peer distance exceeds the 95th percentile of their own noise floor. */
      shareBeyond: z.number(),
      /** The same share under the null: about 0.05 on average by construction. */
      shareNull: z.object({ mean: z.number(), p95: z.number() }),
      reading: z.enum(['alike', 'differ', 'noise']),
    })
    .nullable(),
  /** (c) Whether the residual order holds still from release to release and when one country is dropped. */
  stability: z.object({
    /** Read from git on `bench diagnose`. Null without git history, in which case the committed figures are kept. */
    releases: z
      .object({
        /** Releases read, oldest to newest. */
        versions: z.array(z.string()),
        /** Consecutive pairs with the same country set. */
        pairs: z.number().int(),
        /** Spearman of each dimension's residual order between consecutive releases that moved it. */
        perDimension: z.array(
          z.object({
            dimension: DimensionEnum,
            pairs: z.number().int(),
            mean: z.number().nullable(),
            min: z.number().nullable(),
            /** Countries in the smallest pair compared. */
            minCountries: z.number().int().nullable(),
          }),
        ),
        reading: z.enum(['stable', 'mixed', 'churning', 'untested']),
      })
      .nullable(),
    leaveOneOut: z.object({
      perDimension: z.array(
        z.object({
          dimension: DimensionEnum,
          n: z.number().int(),
          /** Largest change in the slope when one country is dropped, in standard errors of the slope. */
          maxSlopeShiftSe: z.number(),
          /** Largest change in a dropped country's own residual, in residual standard deviations. */
          maxResidualShiftSd: z.number(),
        }),
      ),
      reading: z.enum(['robust', 'fragile']),
    }),
  }),
  /** (d) How much of how far a country's profile sits from the average profile its income line accounts for. */
  incomeShare: z
    .object({
      countries: z.number().int(),
      mean: z.number(),
      median: z.number(),
      /** One minus all residual squares over all deviation squares, pooled across countries. */
      pooled: z.number(),
      reading: z.enum(['most', 'part', 'little']),
    })
    .nullable(),
  /** The weaker claim, read from (a), (b) and (c) by the rule D138 fixed in advance. */
  weakClaim: z.enum(['holds', 'mixed', 'fails']).nullable(),
})
export type ResidualStructure = z.infer<typeof ResidualStructure>

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
  /**
   * The value is older than an indicator may be and still count
   * (`MAX_SCORED_VALUE_AGE`). A check is never scored, so it stays; the flag
   * says how old it is against the same line. See D159.
   */
  stale: z.boolean().default(false),
  /** Why the number is beside the score. Carried into the file so a consumer reading only JSON still gets it. */
  note: z.string(),
})
export type CheckResult = z.infer<typeof CheckResult>

/**
 * One condition's latest value for one country. Never scored. See D122.
 *
 * A condition is what a country has to work with: a stock of infrastructure,
 * access, money, people or enrolment. The value is published as the publisher
 * wrote it and is never put on the 0 to 100 scale, because a number on that
 * scale reads as a score. Its place among the countries is a rank instead.
 */
export const ConditionResult = z.object({
  indicatorId: z.string(),
  name: z.string(),
  definition: z.string(),
  unit: z.string(),
  direction: Direction,
  /** Null where the publisher covers no year for this country. */
  value: z.number().nullable(),
  year: z.number().int().nullable(),
  source: z.string(),
  sourceTier: SourceTier.nullable(),
  /**
   * Position among the countries that have a value, 1 the highest where higher
   * is better and the lowest where lower is better. Ties share a rank. Null
   * where this country has no value.
   */
  rank: z.number().int().nullable(),
  /** Countries with a value, the denominator of `rank`. */
  n: z.number().int(),
  /**
   * The value is older than an indicator may be and still count
   * (`MAX_SCORED_VALUE_AGE`). A condition is context and never scored, so it
   * keeps its value and rank and carries this flag. See D159.
   */
  stale: z.boolean().default(false),
  /** Why the row is a condition. Carried into the file so a consumer reading only JSON still gets it. */
  note: z.string(),
})
export type ConditionResult = z.infer<typeof ConditionResult>

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
    /** Observed indicators over the dimension's gap-and-observed rows. Retired
     * rows are excluded from the denominator: see D100. */
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
  /**
   * What the country has to work with on this dimension, published beside it
   * and excluded from every number above. Raw values with a rank, never a 0 to
   * 100 value. Empty for a dimension that declares no condition. See D122.
   */
  conditions: z.array(ConditionResult),
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
  /**
   * `condition` for a row published beside its dimension and never scored.
   * Its values carry no normalised value and are ordered by the raw value in
   * the row's direction. See D122.
   */
  role: z.enum(['capability', 'condition']).default('capability'),
  values: z.array(
    z.object({
      iso3: z.string().length(3),
      country: z.string(),
      raw: z.number(),
      /** Null for a condition, which is never put on the 0 to 100 scale. */
      normalized: z.number().nullable(),
      year: z.number().int(),
      tier: SourceTier,
      outOfFrame: z.boolean(),
      /** True for the ten countries whose values fix the ends of the scale. */
    }),
  ),
})
export type IndicatorAcrossCountries = z.infer<typeof IndicatorAcrossCountries>
