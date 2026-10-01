import { z } from 'zod'
import { DimensionEnum, Provenance } from './schema.js'

/**
 * The three routes a research lead may take. A route is a workflow decision,
 * not evidence and never enters the benchmark score.
 */
export const ResearchLane = z.enum(['case', 'source_backed', 'do_not_force'])
export type ResearchLane = z.infer<typeof ResearchLane>

/** A lead is not a finding: it still needs a publisher and a checked number. */
export const ResearchCandidateStatus = z.enum([
  'lead',
  'researchable',
  'source_required',
  'do_not_pursue',
])
export type ResearchCandidateStatus = z.infer<typeof ResearchCandidateStatus>

/** A country x declared-gap slot selected by the deterministic inventory. */
export const ResearchSlot = z.object({
  iso3: z.string().length(3),
  indicatorId: z.string(),
  dimension: DimensionEnum,
  priority: z.number().int().min(0),
  reason: z.string(),
})
export type ResearchSlot = z.infer<typeof ResearchSlot>

/** A publisher or dataset to search for; this is deliberately not a source citation. */
export const ResearchSourceLead = z.object({
  publisher: z.string(),
  datasetOrPage: z.string(),
  why: z.string(),
  searchQueries: z.array(z.string()).min(1).max(5),
})
export type ResearchSourceLead = z.infer<typeof ResearchSourceLead>

/**
 * Structured output from the scouting model. It contains hypotheses and search
 * targets only. It must never be copied into data/evidence/records.json.
 */
export const ResearchCandidate = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  iso3: z.string().length(3),
  indicatorId: z.string(),
  lane: ResearchLane,
  status: ResearchCandidateStatus,
  title: z.string(),
  hypothesis: z.string(),
  expectedMetric: z.string(),
  scaleTest: z.string(),
  disqualifiers: z.array(z.string()).min(1).max(8),
  sourceLeads: z.array(ResearchSourceLead).min(1).max(4),
  rationale: z.string(),
})
export type ResearchCandidate = z.infer<typeof ResearchCandidate>

export const ResearchScoutOutput = z.object({
  candidates: z.array(ResearchCandidate).min(1),
})
export type ResearchScoutOutput = z.infer<typeof ResearchScoutOutput>

const ResearchRunBase = z.object({
  runId: z.string(),
  generatedAt: z.string(),
  provenance: Provenance,
  model: z.string(),
  datasetVersion: z.string(),
  countrySet: z.array(z.string().length(3)),
  promptVersion: z.string(),
  note: z.string(),
})

/** An immutable, AI-generated scout run. */
export const ResearchScoutRunFile = ResearchRunBase.extend({
  kind: z.literal('scout'),
  slots: z.array(ResearchSlot).min(1),
  candidates: z.array(ResearchCandidate).min(1),
})
export type ResearchScoutRunFile = z.infer<typeof ResearchScoutRunFile>

export const ResearchTestResult = z.enum(['pass', 'fail', 'unknown'])
export type ResearchTestResult = z.infer<typeof ResearchTestResult>

/**
 * Critique output is intentionally unable to approve publication. Even a
 * promising lead remains source_required until a source packet is checked.
 */
export const ResearchCandidateReview = z.object({
  candidateId: z.string(),
  verdict: z.enum(['reject', 'needs_source', 'ready_for_source_check']),
  tests: z.object({
    declaredGap: ResearchTestResult,
    institutionalDelivery: ResearchTestResult,
    nationalScale: ResearchTestResult,
    publisherMetric: ResearchTestResult,
    limitsCanBeHonest: ResearchTestResult,
  }),
  requiredEvidence: z.array(z.string()).min(1).max(8),
  blockers: z.array(z.string()),
  rationale: z.string(),
})
export type ResearchCandidateReview = z.infer<typeof ResearchCandidateReview>

export const ResearchCritiqueOutput = z.object({
  reviews: z.array(ResearchCandidateReview).min(1),
})
export type ResearchCritiqueOutput = z.infer<typeof ResearchCritiqueOutput>

/** An immutable critique run linked to one scout run. */
export const ResearchCritiqueRunFile = ResearchRunBase.extend({
  kind: z.literal('critique'),
  scoutRunId: z.string(),
  reviews: z.array(ResearchCandidateReview).min(1),
})
export type ResearchCritiqueRunFile = z.infer<typeof ResearchCritiqueRunFile>

export const ResearchRunFile = z.discriminatedUnion('kind', [
  ResearchScoutRunFile,
  ResearchCritiqueRunFile,
])
export type ResearchRunFile = z.infer<typeof ResearchRunFile>

/**
 * The columns of the evidence grid: the declared gaps whose construct a
 * documented delivery can evidence. The other gaps are survey constructs or
 * wait on a dataset, so a case story would be the wrong instrument for them.
 * Every id here must stay a declared gap; the validator errors when one is
 * promoted or retired, because a closed column would then be counting cells
 * the score already carries. See docs/EVIDENCE.md and D135.
 */
export const EVIDENCE_GRID_INDICATORS = [
  'large_project_delivery',
  'institutional_responsiveness',
  'disaster_preparedness',
  'public_private_collaboration',
  'university_industry_collaboration',
  'government_foresight_capacity',
  'regulatory_sandbox_activity',
  'adult_learning_participation',
] as const
export type EvidenceGridIndicator = (typeof EVIDENCE_GRID_INDICATORS)[number]

/** The five inclusion tests in docs/EVIDENCE.md, in their published order. */
export const InclusionTest = z.enum([
  'declared_gap',
  'publisher_metric',
  'institutional',
  'delivered',
  'honest_limits',
])
export type InclusionTest = z.infer<typeof InclusionTest>

/**
 * A grid cell closed without a record. It says the candidate lists were
 * searched on a date and nothing passed the inclusion rule, which is a
 * finding about what this protocol can carry, not a claim that the country
 * lacks the capability. A record for the same cell supersedes it.
 */
export const NoCaseNote = z.object({
  iso3: z.string().length(3),
  indicatorId: z.string(),
  /** The day the search was run, YYYY-MM-DD. */
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** The candidate lists or publishers searched, so the search can be repeated. */
  searched: z.array(z.string()).min(1),
  /** Each programme considered, and the first inclusion test it failed. */
  candidates: z.array(
    z.object({
      name: z.string(),
      failed: InclusionTest,
      why: z.string(),
    }),
  ),
  note: z.string().optional(),
})
export type NoCaseNote = z.infer<typeof NoCaseNote>

export const NoCaseFile = z.object({
  generatedAt: z.string(),
  notes: z.array(NoCaseNote),
})
export type NoCaseFile = z.infer<typeof NoCaseFile>

export const EvidenceGridCellStatus = z.enum(['record', 'no_case', 'open'])
export type EvidenceGridCellStatus = z.infer<typeof EvidenceGridCellStatus>

/** Every country against every grid column, and how far each is closed. */
export const EvidenceGrid = z.object({
  total: z.number().int().min(0),
  closedByRecord: z.number().int().min(0),
  closedByNote: z.number().int().min(0),
  open: z.number().int().min(0),
  columns: z.array(
    z.object({
      indicatorId: z.string(),
      record: z.number().int().min(0),
      noCase: z.number().int().min(0),
      open: z.number().int().min(0),
    }),
  ),
  countries: z.array(
    z.object({
      iso3: z.string().length(3),
      record: z.number().int().min(0),
      noCase: z.number().int().min(0),
      open: z.number().int().min(0),
    }),
  ),
  cells: z.array(
    z.object({
      iso3: z.string().length(3),
      indicatorId: z.string(),
      status: EvidenceGridCellStatus,
      records: z.number().int().min(0),
    }),
  ),
})
export type EvidenceGrid = z.infer<typeof EvidenceGrid>

/** Counts and queues derived from the current evidence corpus. */
export const ResearchInventory = z.object({
  generatedAt: z.string(),
  datasetVersion: z.string(),
  recordCount: z.number().int().min(0),
  countriesRepresented: z.number().int().min(0),
  gapIndicatorsRepresented: z.number().int().min(0),
  dimensions: z.array(
    z.object({
      dimension: DimensionEnum,
      records: z.number().int().min(0),
      countries: z.number().int().min(0),
      indicators: z.number().int().min(0),
    }),
  ),
  countries: z.array(
    z.object({
      iso3: z.string().length(3),
      country: z.string(),
      records: z.number().int().min(0),
    }),
  ),
  indicators: z.array(
    z.object({
      indicatorId: z.string(),
      dimension: DimensionEnum,
      name: z.string(),
      records: z.number().int().min(0),
      countries: z.number().int().min(0),
    }),
  ),
  guardrails: z.object({
    reversalCount: z.number().int().min(0),
    reversalMinimum: z.number().int().min(0),
    reversalDeficit: z.number().int().min(0),
    mostRepresentedCountry: z.string().nullable(),
    mostRepresentedCountryRecords: z.number().int().min(0),
    countryCeilingAtCurrentSize: z.number().int().min(0),
  }),
  slots: z.array(ResearchSlot),
  grid: EvidenceGrid,
})
export type ResearchInventory = z.infer<typeof ResearchInventory>
