import { z } from 'zod'

/**
 * Sovereign technological capability: for one nationally material function,
 * who controls each stage of its life and what would stop it working. A
 * research layer only. Nothing here enters a score, a confidence, the frame,
 * the panel or the viewer, and no field adds records up into a country
 * number. Framework: docs/research/sovereignty/FRAMEWORK.md. Decision D171.
 */

/** A filing label. A domain is never a unit of assessment. */
export const SovereigntyDomain = z.enum([
  'digital_public_infrastructure',
  'aerospace',
  'space',
  'agriculture',
  'nuclear',
  'energy',
  'health_biotech',
  'electronics',
  'ai_cloud',
  'secure_communications',
])
export type SovereigntyDomain = z.infer<typeof SovereigntyDomain>

/** The eight lifecycle stages, in the order every record lists them. */
export const SOVEREIGNTY_STAGES = [
  'research',
  'design_ip',
  'components',
  'production',
  'deployment',
  'operation',
  'maintenance',
  'governance',
] as const
export const SovereigntyStage = z.enum(SOVEREIGNTY_STAGES)
export type SovereigntyStage = z.infer<typeof SovereigntyStage>

/**
 * Stage control, tested in the order FRAMEWORK.md section 3 gives:
 * unknown, foreign provision, foreign-dependent domestic operation,
 * partial or joint, verified.
 */
export const StageControl = z.enum([
  'verified',
  'partial',
  'foreign_dependent_operation',
  'foreign_provision',
  'unknown',
])
export type StageControl = z.infer<typeof StageControl>

export const CapabilityStatus = z.enum(['deployed', 'demonstrated', 'pilot', 'proposed', 'discontinued'])
export type CapabilityStatus = z.infer<typeof CapabilityStatus>

export const DependencyKind = z.enum([
  'imported_input',
  'single_vendor',
  'foreign_jurisdiction',
  'foreign_licence',
  'open_source',
  'foreign_service',
  'skills',
])
export type DependencyKind = z.infer<typeof DependencyKind>

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')
const Iso3 = z.string().regex(/^[A-Z]{3}$/, 'expected an ISO3 code')
const SourceIds = z.array(z.string().min(1))

/**
 * A source the researcher tried. Only `fetched` supports a claim: the page
 * was opened and the claim read there. `blocked` records a page that would
 * not load, so the next researcher knows it was tried.
 */
export const SovereigntySource = z.object({
  id: z.string().regex(/^s\d+$/, 'source ids are s1, s2, ...'),
  url: z.url(),
  publisher: z.string().min(1),
  title: z.string().min(1),
  /** Year of publication, or null when the page carries none. */
  published: z.number().int().min(1950).max(2100).nullable(),
  accessed: IsoDate,
  access: z.enum(['fetched', 'blocked']),
  /** A short verbatim excerpt in the original language, so an auditor can find the claim. */
  quote: z.string().optional(),
  note: z.string().optional(),
})
export type SovereigntySource = z.infer<typeof SovereigntySource>

export const SovereigntyOrganization = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  /** ISO3 of the country whose law the organisation answers to. */
  country: Iso3,
  /** A node id in data/institutions, when the organisation has one. */
  institutionId: z.string().optional(),
})

export const StageAssessment = z.object({
  stage: SovereigntyStage,
  control: StageControl,
  /** The fact the classification rests on, in one or two sentences. */
  basis: z.string().min(1),
  sourceIds: SourceIds,
})
export type StageAssessment = z.infer<typeof StageAssessment>

export const SovereigntyDependency = z.object({
  kind: DependencyKind,
  stage: SovereigntyStage,
  item: z.string().min(1),
  supplier: z.string().min(1),
  /** ISO3, or `multiple` or `unknown`. */
  jurisdiction: z.union([Iso3, z.literal('multiple'), z.literal('unknown')]),
  substitutes: z.string().min(1),
  /** What replacing it would take and how long, or `unknown`. */
  switching: z.string().min(1),
  sourceIds: SourceIds,
})

export const Counterevidence = z.object({
  claim: z.string().min(1),
  sourceIds: SourceIds.min(1),
})

export const SovereigntyCase = z.object({
  id: z.string().regex(/^[a-z]{3}\.sov\.[a-z0-9-]+$/, 'ids are {iso3}.sov.{slug}'),
  title: z.string().min(1),
  domain: SovereigntyDomain,
  function: z.string().min(1),
  status: CapabilityStatus,
  statusSourceIds: SourceIds,
  organizations: z.array(SovereigntyOrganization).min(1),
  stages: z.array(StageAssessment),
  dependencies: z.array(SovereigntyDependency),
  /** Reproducibility and maintenance constraints. */
  constraints: z.string().min(1),
  counterevidence: z.array(Counterevidence),
  uncertainty: z.string().min(1),
  /** True when the case shows a dependence, reversal or failure a success story would omit. */
  challengesNarrative: z.boolean(),
  sources: z.array(SovereigntySource).min(1),
  reviewedAt: IsoDate,
})
export type SovereigntyCase = z.infer<typeof SovereigntyCase>

export const SovereigntyFile = z.object({
  iso3: Iso3,
  /** The decision the records were authored under. */
  framework: z.string().regex(/^D\d+$/),
  updatedAt: IsoDate,
  /** Where the researcher looked and what remains open, in prose. */
  coverage: z.string().min(1),
  cases: z.array(SovereigntyCase),
})
export type SovereigntyFile = z.infer<typeof SovereigntyFile>
