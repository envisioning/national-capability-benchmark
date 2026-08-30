'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  COUNTRY_NAMES,
  DIMENSION_LABELS,
  EVIDENCE_STATUS_LABELS,
  INDICATORS_BY_ID,
  SOURCE_TIERS,
  isReversal,
} from '@ncb/core'
import type { EvidenceRecord } from '@ncb/core'
import { DataTable, type Column } from '@/components/DataTable'
import { EvidenceFilters, useEvidenceFilters } from '@/components/EvidenceFilters'
import { CapabilityLink } from '@/components/CapabilityLink'
import { DIMENSION_ICON, Icon, TIER_ICON } from '@/components/Icon'
import { CountryLabel, Empty } from '@/components/ui'
import { EVIDENCE_STATUS_ORDER, evidenceDimension } from '@/lib/evidence'
import {
  NO_PATTERN_FILTERS,
  agendaHref,
  evidenceHref,
  indicatorHref,
  type PatternFilters,
} from '@/lib/links'

/**
 * Every documented delivery as one sortable row, newest first.
 *
 * The agendas name what a country should raise and what it should measure
 * first. This table is the other half of that: what countries actually built
 * against those same missing indicators, with the start year, the published
 * number, the publisher and the delivery status all on the row, so a reader
 * can rank the corpus by recency, by durability or by who published it without
 * opening 50 cards. It opens on the start year descending, because the first
 * question anyone asks of a corpus of deliveries is what is recent.
 *
 * A record is never scored and never raises confidence. See D20 and D46.
 */

function tierLabel(tier: keyof typeof SOURCE_TIERS): string {
  return tier.replace(/_/g, ' ')
}

/** A published number with its reference period, on two lines. */
function MetricCell({ record }: { record: EvidenceRecord }) {
  return (
    <>
      <span className="block tabular-nums text-[var(--foreground)]">
        {record.metric.value.toLocaleString('en-US')} {record.metric.unit}
      </span>
      <span className="block text-[var(--muted)]">
        {record.metric.name.toLowerCase()}, {record.metric.asOf}
      </span>
      {record.secondMetric ? (
        <span className="block text-[var(--muted)]">
          <span className="tabular-nums">
            {record.secondMetric.value.toLocaleString('en-US')} {record.secondMetric.unit}
          </span>{' '}
          {record.secondMetric.name.toLowerCase()}, {record.secondMetric.asOf}
        </span>
      ) : null}
    </>
  )
}

function columns(): Column<EvidenceRecord>[] {
  return [
    {
      key: 'started',
      label: 'Started',
      align: 'right',
      title: 'Year the programme started, as recorded',
      sort: (r) => r.started,
      render: (r) => r.started,
    },
    {
      key: 'delivery',
      label: 'Delivery',
      title: 'What was built, and at what scale',
      sort: (r) => r.title,
      render: (r) => (
        <>
          <Link
            href={evidenceHref(r.id)}
            className="block font-medium underline underline-offset-4"
          >
            {r.title}
          </Link>
          <span className="mt-1 block max-w-[46ch] leading-relaxed text-[var(--muted)]">
            {r.claim}
          </span>
        </>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      title: 'Links to that country’s capability agenda',
      sort: (r) => COUNTRY_NAMES[r.iso3] ?? r.iso3,
      render: (r) => (
        <Link href={agendaHref(r.iso3)} className="hover:underline">
          <CountryLabel iso3={r.iso3} name={COUNTRY_NAMES[r.iso3] ?? r.iso3} />
        </Link>
      ),
    },
    {
      key: 'capability',
      label: 'Capability',
      title: 'The capability, and the missing indicator this record bears on',
      sort: (r) => {
        const d = evidenceDimension(r)
        return d ? DIMENSION_LABELS[d] : null
      },
      render: (r) => {
        const dimension = evidenceDimension(r)
        const def = INDICATORS_BY_ID[r.indicatorId]
        return (
          <>
            {dimension ? (
              <span className="inline-flex items-center gap-2">
                <Icon name={DIMENSION_ICON[dimension]} size={13} />
                <CapabilityLink dimension={dimension} />
              </span>
            ) : (
              <span className="text-[var(--muted)]">no capability</span>
            )}
            <Link
              href={indicatorHref(r.indicatorId)}
              className="mt-1 block text-[var(--muted)] hover:underline"
            >
              {def?.name ?? r.indicatorId}
            </Link>
          </>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      title: 'Where the delivery stands, best first',
      sort: (r) => EVIDENCE_STATUS_ORDER[r.status],
      render: (r) => (
        <span className="inline-flex items-center gap-2">
          {isReversal(r.status) ? (
            <Icon name="triangle-alert" size={13} className="shrink-0 text-[var(--muted)]" />
          ) : null}
          {EVIDENCE_STATUS_LABELS[r.status]}
        </span>
      ),
    },
    {
      key: 'metric',
      label: 'Published number',
      title: 'The number that carries the claim, and the period it covers',
      sort: (r) => r.metric.asOf,
      render: (r) => <MetricCell record={r} />,
    },
    {
      key: 'source',
      label: 'Source',
      title: 'Who published the number, and at which tier',
      sort: (r) => r.source.publisher,
      render: (r) => (
        <>
          <a
            href={r.source.url}
            className="block underline underline-offset-2"
            rel="noreferrer"
            target="_blank"
          >
            {r.source.publisher}
          </a>
          <span className="mt-1 inline-flex items-center gap-2 text-[var(--muted)]">
            <Icon name={TIER_ICON[r.source.tier]} size={13} />
            {tierLabel(r.source.tier)}, retrieved {r.source.retrievedAt}
          </span>
        </>
      ),
    },
    {
      key: 'mechanism',
      label: 'Mechanism',
      title: 'Whether the move behind the delivery is written down. Our reading, not the publisher’s.',
      sort: (r) => (r.pattern ? 1 : 0),
      render: (r) =>
        r.pattern ? (
          <span className="inline-flex items-center gap-2">
            <Icon name="compass" size={13} />
            written
          </span>
        ) : (
          <span className="text-[var(--muted)]">not yet</span>
        ),
    },
  ]
}

export function DeliveryTable({
  records,
  initial = NO_PATTERN_FILTERS,
}: {
  records: EvidenceRecord[]
  initial?: PatternFilters
}) {
  const state = useEvidenceFilters(records, initial)
  const cols = useMemo(columns, [])

  return (
    <>
      <EvidenceFilters records={records} state={state} />
      {state.shown.length === 0 ? (
        <Empty hint="No delivery matches those filters. Clear one and try again." />
      ) : (
        <DataTable
          rows={state.shown}
          columns={cols}
          initialSort={{ key: 'started', dir: 'desc' }}
          caption="Documented deliveries, newest first. Sort by any column."
        />
      )}
    </>
  )
}
