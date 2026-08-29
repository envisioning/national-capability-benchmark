import { z } from 'zod'
import { DIMENSIONS } from './dimensions.js'

/** A score target that a reader can challenge from the viewer. */
export const ChallengeTarget = z.object({
  iso3: z.string().length(3),
  dimension: z.enum(DIMENSIONS),
  /** The canonical score at the time the dispute was filed. */
  value: z.number().min(0).max(100).nullable(),
  /** The canonical confidence at the time the dispute was filed. */
  confidence: z.number().min(0).max(1).nullable(),
})
export type ChallengeTarget = z.infer<typeof ChallengeTarget>

export const ChallengeStatus = z.enum(['submitted', 'accepted', 'rejected'])
export type ChallengeStatus = z.infer<typeof ChallengeStatus>

export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  submitted: 'awaiting review',
  accepted: 'accepted',
  rejected: 'rejected',
}

/** Input accepted by the public dispute endpoint. */
export const ChallengeSubmission = z.object({
  argument: z.string().trim().min(20).max(4000),
  sourceUrl: z.string().trim().url().max(2048).optional(),
})
export type ChallengeSubmission = z.infer<typeof ChallengeSubmission>

const ChallengeBase = {
  id: z.string().min(1),
  submittedAt: z.string().datetime(),
  status: ChallengeStatus,
  maintainerResponse: z.string().optional(),
  maintainerSignature: z.string().optional(),
}

/** A reader's argument against one country and dimension score. */
export const DisputeRecord = z.object({
  ...ChallengeBase,
  kind: z.literal('dispute'),
  target: ChallengeTarget,
  argument: z.string().min(20).max(4000),
  sourceUrl: z.string().url().optional(),
})
export type DisputeRecord = z.infer<typeof DisputeRecord>

/** Reserved shape for a future paper or external analysis attached to a challenge. */
export const PaperRecord = z.object({
  ...ChallengeBase,
  kind: z.literal('paper'),
  title: z.string().min(1),
  claim: z.string().min(1),
  sourceUrl: z.string().url().optional(),
})
export type PaperRecord = z.infer<typeof PaperRecord>

/** The JSONL ledger can hold disputes and later paper records under one discriminator. */
export const ChallengeRecord = z
  .discriminatedUnion('kind', [DisputeRecord, PaperRecord])
  .refine(
    (record) => record.status !== 'accepted' || Boolean(record.maintainerSignature),
    'accepted challenge records require a maintainer signature',
  )
export type ChallengeRecord = z.infer<typeof ChallengeRecord>

/** The threshold is deliberately explicit. Changing it needs a decision entry. */
export const MIN_DISPUTES_FOR_CONTESTED = 3

export function disputeCellKey(iso3: string, dimension: string): string {
  return `${iso3.toUpperCase()}|${dimension}`
}

function publicDisputes(records: readonly ChallengeRecord[]): DisputeRecord[] {
  return records.filter(
    (record): record is DisputeRecord =>
      record.kind === 'dispute' && record.status !== 'rejected',
  )
}

/**
 * Cells with at least three non-rejected disputes from distinct target
 * countries, grouped by dimension. The badge appears only on countries that
 * have actually been named in that dimension's disputes.
 */
export function contestedDisputeCounts(
  records: readonly ChallengeRecord[],
): Record<string, number> {
  const byDimension = new Map<string, Set<string>>()
  for (const record of publicDisputes(records)) {
    const countries = byDimension.get(record.target.dimension) ?? new Set<string>()
    countries.add(record.target.iso3.toUpperCase())
    byDimension.set(record.target.dimension, countries)
  }

  const counts: Record<string, number> = {}
  for (const record of publicDisputes(records)) {
    const countries = byDimension.get(record.target.dimension)
    if (!countries || countries.size < MIN_DISPUTES_FOR_CONTESTED) continue
    counts[disputeCellKey(record.target.iso3, record.target.dimension)] = countries.size
  }
  return counts
}
