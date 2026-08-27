import Link from 'next/link'
import {
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  EVIDENCE_STATUS_LABELS,
  INDICATORS_BY_ID,
} from '@ncb/core'
import type { Dimension, EvidenceRecord } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Empty, Eyebrow, Headline, Highlight, PageTitle, Section } from '@/components/ui'
import { loadEvidence } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function PatternsPage() {
  const records = await loadEvidence()
  if (records.length === 0) {
    return <Empty hint="No evidence records yet. Add them to data/evidence/records.json." />
  }

  const countries = new Set(records.map((r) => r.iso3))
  const withPattern = records.filter((r) => r.pattern)
  const byDimension = DIMENSIONS.map((d) => ({
    dimension: d,
    records: records.filter((r) => INDICATORS_BY_ID[r.indicatorId]?.dimension === d),
  })).filter((g) => g.records.length > 0)

  return (
    <>
      <Eyebrow>
        {records.length} deliveries, {countries.size} countries
      </Eyebrow>
      <PageTitle>What countries actually did</PageTitle>
      <Headline>
        Every record here is a thing a country built, filed against the indicator that should have
        measured it and could not. The number is sourced. The{' '}
        <Highlight>mechanism</Highlight> is our reading, and it is the part that can travel.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        A score says how a country is doing. This says what it did, how the move worked and what had
        to be true first. Copying a form rarely works. Understanding a mechanism and rebuilding it
        under different conditions sometimes does, and the preconditions are where most attempts
        fail. {withPattern.length} of {records.length} records carry a mechanism so far. None of
        this enters any score.
      </p>

      {byDimension.map(({ dimension, records: group }) => (
        <Section
          key={dimension}
          title={DIMENSION_LABELS[dimension as Dimension]}
          icon={<Icon name={DIMENSION_ICON[dimension as Dimension]} size={22} />}
          hint={`${group.length} documented ${group.length === 1 ? 'delivery' : 'deliveries'}, filed against ${[...new Set(group.map((r) => INDICATORS_BY_ID[r.indicatorId]?.name))].join(', ')}.`}
        >
          <div className="space-y-10">
            {group.map((r) => (
              <PatternCard key={r.id} record={r} />
            ))}
          </div>
        </Section>
      ))}
    </>
  )
}

function PatternCard({ record }: { record: EvidenceRecord }) {
  const def = INDICATORS_BY_ID[record.indicatorId]
  return (
    <article id={record.id} className="max-w-3xl border-t border-[var(--rule)] pt-6">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 text-xs text-[var(--muted)]">
        <Link href={`/country/${record.iso3}`} className="font-medium underline underline-offset-4">
          {COUNTRY_NAMES[record.iso3] ?? record.iso3}
        </Link>
        <span>since {record.started}</span>
        <span>{EVIDENCE_STATUS_LABELS[record.status]}</span>
        <span>bears on {def?.name ?? record.indicatorId}</span>
      </div>
      <h3 className="text-xl font-medium tracking-tight">{record.title}</h3>
      <p className="mt-2 text-lg leading-relaxed">{record.claim}</p>

      <p className="mt-2 text-xs text-[var(--muted)]">
        <span className="tabular-nums text-[var(--foreground)]">
          {record.metric.value.toLocaleString('en-US')}
        </span>{' '}
        {record.metric.unit}, {record.metric.name.toLowerCase()}, {record.metric.asOf}.{' '}
        {record.secondMetric ? (
          <>
            <span className="tabular-nums text-[var(--foreground)]">
              {record.secondMetric.value.toLocaleString('en-US')}
            </span>{' '}
            {record.secondMetric.unit}, {record.secondMetric.name.toLowerCase()},{' '}
            {record.secondMetric.asOf}.{' '}
          </>
        ) : null}
        <a href={record.source.url} className="underline underline-offset-2" rel="noreferrer" target="_blank">
          {record.source.publisher}
        </a>
      </p>

      {record.pattern ? (
        <div className="mt-4 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
          <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
            <Icon name="shuffle" size={14} />
            The move, and what it needed
          </p>
          <p className="text-lg leading-relaxed">{record.pattern.mechanism}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
            Preconditions
          </p>
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
        </div>
      ) : null}

      <p className="mt-3 flex max-w-3xl gap-2 text-xs leading-relaxed text-[var(--muted)]">
        <Icon name="triangle-alert" size={13} className="mt-0.5 shrink-0" />
        <span>Limits: {record.limits}</span>
      </p>
    </article>
  )
}
