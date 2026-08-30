import { CONFIDENCE_BANDS, COUNTRY_NAMES, INDICATORS_BY_ID, isReversal, isThinEvidence } from '@ncb/core'
import type { Dimension, EvidenceRecord, EvidenceStatus } from '@ncb/core'
import type { PatternFilters } from '@/lib/links'

/**
 * How openly a mark should be drawn for a given confidence.
 *
 * Two charts draw evidence the same way: solid at or above the usable band's
 * floor, and progressively broken below it. The radar breaks an edge and the
 * flag bubble breaks a ring, and the two run on different geometries, so what
 * they share is the position on the ramp rather than a length in user units.
 * Keeping that position here is what stops one chart from calling an axis solid
 * while the other dashes the same country. See D32.
 */

/** Read from the bands, so the chart cannot drift from the thresholds the tables use. */
export const SOLID_AT = CONFIDENCE_BANDS.find((b) => b.id === 'usable')?.min ?? 0.45

/**
 * Fully open here. A display tuning deliberately below the thin band's floor,
 * so the most broken drawing is reached only deep inside very thin evidence.
 */
export const OPEN_AT = 0.15

/**
 * 0 at the usable floor and above, rising to 1 at the open point.
 *
 * A missing confidence is not thin evidence, it is no evidence about the
 * evidence, so it returns 0 and the caller decides what to draw.
 */
export function evidenceOpenness(confidence: number | null | undefined): number {
  if (confidence === null || confidence === undefined) return 0
  if (confidence >= SOLID_AT) return 0
  return Math.min(1, Math.max(0, (SOLID_AT - confidence) / (SOLID_AT - OPEN_AT)))
}

/** Whether a mark carries thin or very thin evidence. Never a literal threshold. */
export function isThinConfidence(confidence: number | null | undefined): boolean {
  return confidence === null || confidence === undefined ? false : isThinEvidence(confidence)
}

/* ------------------------- Narrowing a record set ------------------------- */

/**
 * How a set of documented deliveries is narrowed by a reader.
 *
 * Two surfaces read the same corpus: the cards at /patterns and the table at
 * /agenda. They share the query-string contract in `lib/links.ts`, so they have
 * to share the matching rule as well. A second copy of this predicate would let
 * one page answer a filter differently from the other. See D46.
 */

/** The dimension a record belongs to, through the indicator it bears on. */
export function evidenceDimension(record: EvidenceRecord): Dimension | null {
  return (INDICATORS_BY_ID[record.indicatorId]?.dimension as Dimension | undefined) ?? null
}

/** Everything a free-text search reads. Lowercased once per record. */
export function evidenceHaystack(record: EvidenceRecord): string {
  return [
    record.title,
    record.claim,
    record.limits,
    record.pattern?.mechanism ?? '',
    record.pattern?.travelled ?? '',
    record.pattern?.preconditions.join(' ') ?? '',
    COUNTRY_NAMES[record.iso3] ?? record.iso3,
    INDICATORS_BY_ID[record.indicatorId]?.name ?? record.indicatorId,
    record.source.publisher,
  ]
    .join(' ')
    .toLowerCase()
}

/** Whether one record survives one set of filters. */
export function matchesEvidenceFilters(
  record: EvidenceRecord,
  filters: PatternFilters,
): boolean {
  if (filters.iso3 && record.iso3 !== filters.iso3) return false
  if (filters.dimension && evidenceDimension(record) !== filters.dimension) return false
  if (filters.status === 'reversal' && !isReversal(record.status)) return false
  if (
    filters.status !== 'all' &&
    filters.status !== 'reversal' &&
    record.status !== filters.status
  ) {
    return false
  }
  if (filters.mechanismOnly && !record.pattern) return false
  const needle = filters.query.trim().toLowerCase()
  if (needle && !evidenceHaystack(record).includes(needle)) return false
  return true
}

/** The records a reader asked for, in the order they were given. */
export function filterEvidence(
  records: readonly EvidenceRecord[],
  filters: PatternFilters,
): EvidenceRecord[] {
  return records.filter((record) => matchesEvidenceFilters(record, filters))
}

/**
 * Where a status sits on the durability ladder, best first.
 *
 * A table sorts on this rather than on the label, so the two reversals land
 * together at one end instead of wherever their words fall in the alphabet.
 */
export const EVIDENCE_STATUS_ORDER: Record<EvidenceStatus, number> = {
  operating: 0,
  concluded: 1,
  eroded: 2,
  dismantled: 3,
}
