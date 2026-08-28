import { z } from 'zod'
import { DIMENSIONS } from './dimensions.js'

/**
 * A country-specific map of the organisations that hold, constrain or transmit
 * public capability. This is an explanatory evidence layer. It never enters a
 * capability score or confidence calculation.
 */

export const InstitutionLevel = z.enum(['federal', 'state', 'municipal', 'external'])
export type InstitutionLevel = z.infer<typeof InstitutionLevel>

export const InstitutionSystem = z.enum([
  'democratic_authority',
  'justice_rights',
  'oversight_integrity',
  'strategy_management',
  'finance_investment',
  'science_technology',
  'learning_workforce',
  'data_digital',
  'regulation',
  'territorial_delivery',
])
export type InstitutionSystem = z.infer<typeof InstitutionSystem>

/**
 * Reading order for the systems. The ground layer owns the order, so two
 * lexicons cannot present the same matrix with its rows in different places.
 */
export const INSTITUTION_SYSTEMS: InstitutionSystem[] = InstitutionSystem.options

export const InstitutionLegalNature = z.enum([
  'constitutional_body',
  'direct_administration',
  'autarchy',
  'public_foundation',
  'public_company',
  'mixed_capital_company',
  'public_university',
  'private_education',
])
export type InstitutionLegalNature = z.infer<typeof InstitutionLegalNature>

export const InstitutionRole = z.enum([
  'governs',
  'legislates',
  'adjudicates',
  'checks_constitutionality',
  'prosecutes',
  'represents_state',
  'checks',
  'audits',
  'coordinates',
  'plans',
  'finances',
  'regulates',
  'produces_evidence',
  'researches',
  'trains',
  'operates_infrastructure',
  'delivers_services',
])
export type InstitutionRole = z.infer<typeof InstitutionRole>

export const InstitutionRelation = z.enum([
  'appoints',
  'approves_appointment',
  'legislates_with',
  'linked_to',
  'audits',
  'checks',
  'regulates',
  'funds',
  'coordinates',
  'trains',
  'provides_evidence_to',
  'operates_for',
  'delivers_with',
])
export type InstitutionRelation = z.infer<typeof InstitutionRelation>

/**
 * The four questions a reader asks of an institution: who constitutes it, who
 * limits it, who pays for it and who it works beside. Every relation belongs to
 * exactly one family, and the order declared here is the order a profile reads
 * them in. The family is ground layer vocabulary, so a lexicon translates the
 * label and never the membership. See D56.
 */
export const InstitutionRelationFamily = z.enum([
  'constitutes',
  'limits',
  'funds',
  'works_with',
])
export type InstitutionRelationFamily = z.infer<typeof InstitutionRelationFamily>

/** Reading order for the relation families. */
export const INSTITUTION_RELATION_FAMILIES: InstitutionRelationFamily[] = [
  'constitutes',
  'limits',
  'funds',
  'works_with',
]

/**
 * The single place a relation verb is sorted into a family. Any surface that
 * groups relations reads this map, so two surfaces cannot group them
 * differently.
 */
export const INSTITUTION_RELATION_FAMILY: Record<
  InstitutionRelation,
  InstitutionRelationFamily
> = {
  appoints: 'constitutes',
  approves_appointment: 'constitutes',
  legislates_with: 'constitutes',
  linked_to: 'constitutes',
  audits: 'limits',
  checks: 'limits',
  regulates: 'limits',
  funds: 'funds',
  coordinates: 'works_with',
  trains: 'works_with',
  provides_evidence_to: 'works_with',
  operates_for: 'works_with',
  delivers_with: 'works_with',
}

export const InstitutionSource = z.object({
  title: z.string(),
  url: z.string().url(),
  retrievedAt: z.string(),
})

export const InstitutionNode = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
  iso3: z.string().length(3),
  /** BR, BR-SP or a municipality code such as BR-SP-SAO. */
  jurisdictionCode: z.string(),
  /** Official name in the institution's own language. */
  officialName: z.string(),
  shortName: z.string(),
  level: InstitutionLevel,
  system: InstitutionSystem,
  legalNature: InstitutionLegalNature,
  roles: z.array(InstitutionRole).min(1),
  dimensions: z.array(z.enum(DIMENSIONS)),
  /** English ground-layer description. Display translations live in i18n. */
  summary: z.string(),
  source: InstitutionSource,
  registry: z
    .object({
      kind: z.enum(['siorg', 'state_directory', 'manual']),
      id: z.string().optional(),
    })
    .default({ kind: 'manual' }),
  status: z.enum(['current', 'historical']).default('current'),
})
export type InstitutionNode = z.infer<typeof InstitutionNode>

export const InstitutionEdge = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
  sourceId: z.string(),
  targetId: z.string(),
  relation: InstitutionRelation,
  dimensions: z.array(z.enum(DIMENSIONS)).default([]),
  source: InstitutionSource,
})
export type InstitutionEdge = z.infer<typeof InstitutionEdge>

export const InstitutionCoverage = z.object({
  jurisdictionCode: z.string(),
  label: z.string(),
  level: z.enum(['federal', 'state', 'municipal']),
  status: z.enum(['baseline', 'pilot', 'scaffold', 'planned']),
  note: z.string(),
})
export type InstitutionCoverage = z.infer<typeof InstitutionCoverage>

export const InstitutionNetworkFile = z.object({
  version: z.string(),
  generatedAt: z.string(),
  iso3: z.string().length(3),
  scope: z.string(),
  nodes: z.array(InstitutionNode),
  edges: z.array(InstitutionEdge),
  coverage: z.array(InstitutionCoverage),
})
export type InstitutionNetworkFile = z.infer<typeof InstitutionNetworkFile>

export type LocalizedInstitutionNode = Omit<InstitutionNode, 'summary'> & {
  summary: string
}

export type LocalizedInstitutionNetwork = Omit<InstitutionNetworkFile, 'scope' | 'nodes'> & {
  scope: string
  nodes: LocalizedInstitutionNode[]
}
