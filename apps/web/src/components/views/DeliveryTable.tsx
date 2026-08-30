'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  COUNTRY_NAMES,
  DIMENSION_LABELS,
  EVIDENCE_STATUS_LABELS,
  INDICATORS_BY_ID,
  SOURCE_TIERS,
  isReversal,
} from '@ncb/core'
import type { EvidenceRecord } from '@ncb/core'
import { compareSortValues, type SortDirection } from '@/components/DataTable'
import { CONTROL, EvidenceFilters, useEvidenceFilters } from '@/components/EvidenceFilters'
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
 * Every documented delivery as one sortable, readable record, newest first.
 *
 * The agendas name what a country should raise and what it should measure
 * first. This register is the other half of that: what countries actually built
 * against those same missing indicators, with the start year, the published
 * number, the publisher and the delivery status in grouped metadata beside the
 * claim. The narrative gets a wide column, while the sort control keeps the
 * register useful for recency, durability or publisher questions without
 * forcing prose into a narrow table cell.
 *
 * A record is never scored and never raises confidence. See D20 and D46.
 */

function tierLabel(tier: keyof typeof SOURCE_TIERS): string {
  return tier.replace(/_/g, ' ')
}

type DeliverySortKey =
  | 'started'
  | 'title'
  | 'country'
  | 'capability'
  | 'status'
  | 'metric'
  | 'source'
  | 'mechanism'

const SORT_OPTIONS: Array<{ key: DeliverySortKey; label: string; defaultDir: SortDirection }> = [
  { key: 'started', label: 'Started', defaultDir: 'desc' },
  { key: 'title', label: 'Delivery', defaultDir: 'asc' },
  { key: 'country', label: 'Country', defaultDir: 'asc' },
  { key: 'capability', label: 'Capability', defaultDir: 'asc' },
  { key: 'status', label: 'Status', defaultDir: 'asc' },
  { key: 'metric', label: 'Published number', defaultDir: 'desc' },
  { key: 'source', label: 'Source', defaultDir: 'asc' },
  { key: 'mechanism', label: 'Mechanism', defaultDir: 'desc' },
]

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

function sortValue(record: EvidenceRecord, key: DeliverySortKey): number | string | null {
  switch (key) {
    case 'started':
      return record.started
    case 'title':
      return record.title
    case 'country':
      return COUNTRY_NAMES[record.iso3] ?? record.iso3
    case 'capability': {
      const dimension = evidenceDimension(record)
      return dimension ? DIMENSION_LABELS[dimension] : null
    }
    case 'status':
      return EVIDENCE_STATUS_ORDER[record.status]
    case 'metric':
      return record.metric.asOf
    case 'source':
      return record.source.publisher
    case 'mechanism':
      return record.pattern ? 1 : 0
  }
}

function DeliveryCard({ record }: { record: EvidenceRecord }) {
  const dimension = evidenceDimension(record)
  const def = INDICATORS_BY_ID[record.indicatorId]

  return (
    <article className="rounded-lg border border-[var(--rule)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--rule-soft)] px-4 py-3 text-xs text-[var(--muted)] sm:px-5">
        <span className="tabular-nums text-[var(--foreground)]">{record.started}</span>
        <Link href={agendaHref(record.iso3)} className="font-medium hover:underline">
          <CountryLabel iso3={record.iso3} name={COUNTRY_NAMES[record.iso3] ?? record.iso3} />
        </Link>
        {dimension ? (
          <span className="inline-flex items-center gap-2">
            <Icon name={DIMENSION_ICON[dimension]} size={13} />
            <CapabilityLink dimension={dimension} />
            <Link
              href={indicatorHref(record.indicatorId)}
              className="hover:underline"
            >
              {def?.name ?? record.indicatorId}
            </Link>
          </span>
        ) : (
          <span>no capability</span>
        )}
        <span className="inline-flex items-center gap-2">
          {isReversal(record.status) ? (
            <Icon name="triangle-alert" size={13} className="shrink-0" />
          ) : null}
          {EVIDENCE_STATUS_LABELS[record.status]}
        </span>
      </div>

      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(15rem,0.75fr)] lg:gap-8">
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-tight">
            <Link href={evidenceHref(record.id)} className="underline underline-offset-4">
              {record.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-[var(--muted)]">
            {record.claim}
          </p>
        </div>

        <dl className="grid content-start gap-4 border-t border-[var(--rule-soft)] pt-4 text-xs sm:grid-cols-2 lg:block lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
          <div>
            <dt className="uppercase tracking-[0.05em] text-[var(--muted)]">Published number</dt>
            <dd className="mt-1">
              <MetricCell record={record} />
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.05em] text-[var(--muted)]">Source</dt>
            <dd className="mt-1">
              <a
                href={record.source.url}
                className="underline underline-offset-2"
                rel="noreferrer"
                target="_blank"
              >
                {record.source.publisher}
              </a>
              <span className="mt-1 inline-flex items-center gap-2 text-[var(--muted)]">
                <Icon name={TIER_ICON[record.source.tier]} size={13} />
                {tierLabel(record.source.tier)}, retrieved {record.source.retrievedAt}
              </span>
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.05em] text-[var(--muted)]">Mechanism</dt>
            <dd className="mt-1">
              {record.pattern ? (
                <span className="inline-flex items-center gap-2">
                  <Icon name="compass" size={13} />
                  written
                </span>
              ) : (
                <span className="text-[var(--muted)]">not yet</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

function DeliverySortBar({
  sort,
  onSort,
  onDirection,
}: {
  sort: { key: DeliverySortKey; dir: SortDirection }
  onSort: (key: DeliverySortKey) => void
  onDirection: () => void
}) {
  const option = SORT_OPTIONS.find((candidate) => candidate.key === sort.key) ?? SORT_OPTIONS[0]!
  const direction = sort.key === 'started'
    ? sort.dir === 'desc' ? 'newest first' : 'oldest first'
    : sort.dir === 'asc' ? 'A to Z' : 'Z to A'
  const nextDirection = direction === 'newest first'
    ? 'oldest first'
    : direction === 'oldest first'
      ? 'newest first'
      : direction === 'A to Z'
        ? 'Z to A'
        : 'A to Z'

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] px-4 py-3 text-xs">
      <label htmlFor="delivery-sort" className="text-[var(--muted)]">Sort by</label>
      <select
        id="delivery-sort"
        value={sort.key}
        onChange={(event) => onSort(event.target.value as DeliverySortKey)}
        className={CONTROL}
      >
        {SORT_OPTIONS.map((candidate) => (
          <option key={candidate.key} value={candidate.key}>
            {candidate.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onDirection}
        className="rounded-md border border-[var(--rule)] px-2 py-1 text-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label={`Sort ${option.label.toLowerCase()} ${nextDirection}`}
      >
        {direction}
      </button>
    </div>
  )
}

export function DeliveryTable({
  records,
  initial = NO_PATTERN_FILTERS,
}: {
  records: EvidenceRecord[]
  initial?: PatternFilters
}) {
  const state = useEvidenceFilters(records, initial)
  const [sort, setSort] = useState<{ key: DeliverySortKey; dir: SortDirection }>({
    key: 'started',
    dir: 'desc',
  })

  const sorted = useMemo(() => {
    return [...state.shown].sort((a, b) => compareSortValues(sortValue(a, sort.key), sortValue(b, sort.key), sort.dir))
  }, [sort, state.shown])

  return (
    <>
      <EvidenceFilters records={records} state={state} />
      {state.shown.length === 0 ? (
        <Empty hint="No delivery matches those filters. Clear one and try again." />
      ) : (
        <>
          <DeliverySortBar
            sort={sort}
            onSort={(key) => {
              const option = SORT_OPTIONS.find((candidate) => candidate.key === key) ?? SORT_OPTIONS[0]!
              setSort({ key, dir: option.defaultDir })
            }}
            onDirection={() => setSort((current) => ({
              ...current,
              dir: current.dir === 'asc' ? 'desc' : 'asc',
            }))}
          />
          <div className="space-y-4" role="list" aria-label="Documented deliveries">
            {sorted.map((record) => (
              <div key={record.id} role="listitem">
                <DeliveryCard record={record} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
