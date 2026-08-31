import Link from 'next/link'
import { COUNTRY_NAMES, EVIDENCE_STATUS_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import type { EvidenceRecord } from '@ncb/core'
import { Icon } from '@/components/Icon'
import { Card, CountryLabel, Meta } from '@/components/ui'
import { formatEvidenceMetricValue } from '@/lib/evidence'
import { countryProfileHref, evidenceHref } from '@/lib/links'

/**
 * One documented delivery, rendered the same way wherever it appears.
 *
 * The list at /patterns and the record's own page read from this file, so a
 * record says the same thing in both places. The record is never scored. See
 * docs/DECISIONS.md D20 and D46.
 */

/** Country, start year, status and the indicator the record bears on. */
export function PatternMeta({ record }: { record: EvidenceRecord }) {
  const def = INDICATORS_BY_ID[record.indicatorId]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Meta className="bg-[var(--surface)]">
        <Link
          href={countryProfileHref(record.iso3)}
          className="font-medium underline underline-offset-4"
        >
          <CountryLabel iso3={record.iso3} name={COUNTRY_NAMES[record.iso3] ?? record.iso3} />
        </Link>
      </Meta>
      <Meta className="bg-[var(--surface)]">since {record.started}</Meta>
      <Meta className="bg-[var(--surface)]">{EVIDENCE_STATUS_LABELS[record.status]}</Meta>
      <Meta className="bg-[var(--surface)]">bears on {def?.name ?? record.indicatorId}</Meta>
    </div>
  )
}

/** The published numbers and their publisher. */
export function PatternMetrics({ record }: { record: EvidenceRecord }) {
  return (
    <p className="mt-2 text-xs text-[var(--muted)]">
      <span className="tabular-nums text-[var(--foreground)]">
        {formatEvidenceMetricValue(record.metric.value, record.metric.unit)}
      </span>{' '}
      {record.metric.unit}, {record.metric.name.toLowerCase()}, {record.metric.asOf}.{' '}
      {record.secondMetric ? (
        <>
          <span className="tabular-nums text-[var(--foreground)]">
            {formatEvidenceMetricValue(record.secondMetric.value, record.secondMetric.unit)}
          </span>{' '}
          {record.secondMetric.unit}, {record.secondMetric.name.toLowerCase()},{' '}
          {record.secondMetric.asOf}.{' '}
        </>
      ) : null}
      <a
        href={record.source.url}
        className="underline underline-offset-2"
        rel="noreferrer"
        target="_blank"
      >
        {record.source.publisher}
      </a>
      , retrieved {record.source.retrievedAt}.
    </p>
  )
}

/** The mechanism and its preconditions. Our reading, never sourced. See D31. */
export function PatternMechanism({ record }: { record: EvidenceRecord }) {
  if (!record.pattern) return null
  return (
    <Card className="mt-4">
      <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="shuffle" size={14} />
        The move, and what it needed
      </p>
      <p className="text-lg leading-relaxed">{record.pattern.mechanism}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">Preconditions</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed">
        {record.pattern.preconditions.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {record.pattern.travelled ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
          Where it travelled: {record.pattern.travelled}
        </p>
      ) : null}
    </Card>
  )
}

/** What the record does not show. Required on every record. */
export function PatternLimits({ record }: { record: EvidenceRecord }) {
  return (
    <p className="mt-3 flex max-w-3xl gap-2 text-xs leading-relaxed text-[var(--muted)]">
      <Icon name="triangle-alert" size={13} className="mt-0.5 shrink-0" />
      <span>Limits: {record.limits}</span>
    </p>
  )
}

/** The list entry. The title carries the record's own address. */
export function PatternCard({ record }: { record: EvidenceRecord }) {
  return (
    <article className="max-w-3xl border-t border-[var(--rule)] pt-6">
      <div className="mb-1">
        <PatternMeta record={record} />
      </div>
      <h3 className="text-xl font-medium tracking-tight">
        <Link href={evidenceHref(record.id)} className="hover:underline underline-offset-4">
          {record.title}
        </Link>
      </h3>
      <p className="mt-2 text-lg leading-relaxed">{record.claim}</p>
      <PatternMetrics record={record} />
      <PatternMechanism record={record} />
      <PatternLimits record={record} />
    </article>
  )
}
