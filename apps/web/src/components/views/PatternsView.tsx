'use client'

import { useMemo, useState } from 'react'
import {
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  EVIDENCE_STATUS_LABELS,
  INDICATORS_BY_ID,
  countryFlag,
  isReversal,
} from '@ncb/core'
import type { Dimension, EvidenceRecord, EvidenceStatus } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { PatternCard } from '@/components/PatternCard'
import { Empty, Section } from '@/components/ui'

/**
 * Every documented delivery, narrowed by the reader.
 *
 * The corpus is large enough that a single scroll hides most of it, so the
 * reader picks a country, a dimension, a status or a phrase and the list
 * answers. Grouping stays by dimension, because a delivery is filed against
 * the indicator that should have measured it. See docs/DECISIONS.md D46.
 */

const CONTROL =
  'rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--foreground)]'

/** A status filter value. `reversal` covers the two ways a delivery is lost. */
type StatusFilter = 'all' | 'reversal' | EvidenceStatus

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'any status' },
  { value: 'reversal', label: 'reversals only' },
  { value: 'operating', label: EVIDENCE_STATUS_LABELS.operating },
  { value: 'concluded', label: EVIDENCE_STATUS_LABELS.concluded },
  { value: 'eroded', label: EVIDENCE_STATUS_LABELS.eroded },
  { value: 'dismantled', label: EVIDENCE_STATUS_LABELS.dismantled },
]

function dimensionOf(record: EvidenceRecord): Dimension | null {
  return (INDICATORS_BY_ID[record.indicatorId]?.dimension as Dimension | undefined) ?? null
}

function haystack(record: EvidenceRecord): string {
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

export function PatternsView({ records }: { records: EvidenceRecord[] }) {
  const [query, setQuery] = useState('')
  const [iso3, setIso3] = useState('')
  const [dimension, setDimension] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [mechanismOnly, setMechanismOnly] = useState(false)

  const countries = useMemo(
    () =>
      [...new Set(records.map((r) => r.iso3))]
        .map((code) => ({ iso3: code, name: COUNTRY_NAMES[code] ?? code }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [records],
  )

  const dimensions = useMemo(
    () => DIMENSIONS.filter((d) => records.some((r) => dimensionOf(r) === d)),
    [records],
  )

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return records.filter((r) => {
      if (iso3 && r.iso3 !== iso3) return false
      if (dimension && dimensionOf(r) !== dimension) return false
      if (status === 'reversal' && !isReversal(r.status)) return false
      if (status !== 'all' && status !== 'reversal' && r.status !== status) return false
      if (mechanismOnly && !r.pattern) return false
      if (needle && !haystack(r).includes(needle)) return false
      return true
    })
  }, [records, query, iso3, dimension, status, mechanismOnly])

  const filtered = shown.length !== records.length
  const groups = dimensions
    .map((d) => ({ dimension: d, records: shown.filter((r) => dimensionOf(r) === d) }))
    .filter((g) => g.records.length > 0)

  function clear() {
    setQuery('')
    setIso3('')
    setDimension('')
    setStatus('all')
    setMechanismOnly(false)
  }

  return (
    <>
      <div className="mb-8 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
        <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
          <Icon name="list-filter" size={14} />
          Narrow the list
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-xs">
          <label className="inline-flex items-center gap-2">
            <span className="text-[var(--muted)]">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="title, claim, mechanism"
              className={`${CONTROL} w-56`}
            />
          </label>

          <label className="inline-flex items-center gap-2">
            <span className="text-[var(--muted)]">Country</span>
            <select value={iso3} onChange={(e) => setIso3(e.target.value)} className={CONTROL}>
              <option value="">every country</option>
              {countries.map((c) => (
                <option key={c.iso3} value={c.iso3}>
                  {countryFlag(c.iso3)} {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex items-center gap-2">
            <span className="text-[var(--muted)]">Dimension</span>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className={CONTROL}
            >
              <option value="">every dimension</option>
              {dimensions.map((d) => (
                <option key={d} value={d}>
                  {DIMENSION_LABELS[d]}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex items-center gap-2">
            <span className="text-[var(--muted)]">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className={CONTROL}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={mechanismOnly}
              onChange={(e) => setMechanismOnly(e.target.checked)}
              className="accent-[var(--primary)]"
            />
            <span className="text-[var(--muted)]">With a mechanism</span>
          </label>

          <span className="ml-auto inline-flex items-center gap-3 text-[var(--muted)]">
            <span className="tabular-nums">
              {shown.length} of {records.length}
            </span>
            {filtered ? (
              <button type="button" onClick={clear} className="underline underline-offset-4">
                Clear
              </button>
            ) : null}
          </span>
        </div>
      </div>

      {groups.length === 0 ? (
        <Empty hint="No delivery matches those filters. Clear one and try again." />
      ) : (
        groups.map(({ dimension: d, records: group }) => (
          <Section
            key={d}
            title={DIMENSION_LABELS[d]}
            icon={<Icon name={DIMENSION_ICON[d]} size={22} />}
            hint={`${group.length} documented ${group.length === 1 ? 'delivery' : 'deliveries'}, filed against ${[...new Set(group.map((r) => INDICATORS_BY_ID[r.indicatorId]?.name))].join(', ')}.`}
          >
            <div className="space-y-10">
              {group.map((r) => (
                <PatternCard key={r.id} record={r} />
              ))}
            </div>
          </Section>
        ))
      )}
    </>
  )
}
