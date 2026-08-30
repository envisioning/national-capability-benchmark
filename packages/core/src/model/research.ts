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
})
export type ResearchInventory = z.infer<typeof ResearchInventory>
