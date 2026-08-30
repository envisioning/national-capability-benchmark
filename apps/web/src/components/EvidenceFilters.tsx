'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  EVIDENCE_STATUS_LABELS,
  countryFlag,
} from '@ncb/core'
import type { Dimension, EvidenceRecord } from '@ncb/core'
import { Icon } from '@/components/Icon'
import { Card, controlClass } from '@/components/ui'
import { evidenceDimension, filterEvidence } from '@/lib/evidence'
import { NO_PATTERN_FILTERS, patternFiltersQuery, type PatternFilters } from '@/lib/links'

/**
 * The one control bar that narrows a set of documented deliveries.
 *
 * The cards at /patterns and the table at /agenda read the same corpus and the
 * same query-string contract, so they carry the same controls. Keeping the bar
 * and its state in one file is what stops one page from offering a filter the
 * other lacks. See D46.
 */

/** The shared filter-control treatment. Geometry lives in ui.tsx. */
export const CONTROL = controlClass()

/** A status filter value. `reversal` covers the two ways a delivery is lost. */
type StatusFilter = PatternFilters['status']

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'any status' },
  { value: 'reversal', label: 'reversals only' },
  { value: 'operating', label: EVIDENCE_STATUS_LABELS.operating },
  { value: 'concluded', label: EVIDENCE_STATUS_LABELS.concluded },
  { value: 'eroded', label: EVIDENCE_STATUS_LABELS.eroded },
  { value: 'dismantled', label: EVIDENCE_STATUS_LABELS.dismantled },
]

export type EvidenceFilterState = {
  filters: PatternFilters
  /** Change one field. The rest of the selection is kept. */
  set: (patch: Partial<PatternFilters>) => void
  clear: () => void
  /** The records that survive the current filters, in the order given. */
  shown: EvidenceRecord[]
  filtered: boolean
}

/**
 * Filter state that writes itself into the address.
 *
 * `replaceState` keeps the server out of a keystroke and keeps 30 filter
 * changes out of the back button, at the cost of the back button not stepping
 * through them.
 */
export function useEvidenceFilters(
  records: EvidenceRecord[],
  initial: PatternFilters = NO_PATTERN_FILTERS,
): EvidenceFilterState {
  const [filters, setFilters] = useState<PatternFilters>(initial)

  useEffect(() => {
    const search = patternFiltersQuery(filters)
    if (search === window.location.search) return
    window.history.replaceState(null, '', `${window.location.pathname}${search}`)
  }, [filters])

  const shown = useMemo(() => filterEvidence(records, filters), [records, filters])

  return {
    filters,
    set: (patch) => setFilters((current) => ({ ...current, ...patch })),
    clear: () => setFilters(NO_PATTERN_FILTERS),
    shown,
    filtered: shown.length !== records.length,
  }
}

export function EvidenceFilters({
  records,
  state,
  /** What one row is called, so the count reads in the surface's own words. */
  noun = 'delivery',
  nounPlural = 'deliveries',
}: {
  records: EvidenceRecord[]
  state: EvidenceFilterState
  noun?: string
  nounPlural?: string
}) {
  const { filters, set, clear, shown, filtered } = state

  const countries = useMemo(
    () =>
      [...new Set(records.map((r) => r.iso3))]
        .map((code) => ({ iso3: code, name: COUNTRY_NAMES[code] ?? code }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [records],
  )

  const dimensions = useMemo(
    () => DIMENSIONS.filter((d) => records.some((r) => evidenceDimension(r) === d)),
    [records],
  )

  return (
    <Card className="mb-8">
      <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="list-filter" size={14} />
        Narrow the list
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <span className="text-[var(--muted)]">Search</span>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="title, claim, mechanism"
            className={`${CONTROL} w-56`}
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <span className="text-[var(--muted)]">Country</span>
          <select
            value={filters.iso3}
            onChange={(e) => set({ iso3: e.target.value })}
            className={CONTROL}
          >
            <option value="">every country</option>
            {countries.map((c) => (
              <option key={c.iso3} value={c.iso3}>
                {countryFlag(c.iso3)} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="inline-flex items-center gap-2">
          <span className="text-[var(--muted)]">Capability</span>
          <select
            value={filters.dimension}
            onChange={(e) => set({ dimension: e.target.value })}
            className={CONTROL}
          >
            <option value="">every capability</option>
            {dimensions.map((d: Dimension) => (
              <option key={d} value={d}>
                {DIMENSION_LABELS[d]}
              </option>
            ))}
          </select>
        </label>

        <label className="inline-flex items-center gap-2">
          <span className="text-[var(--muted)]">Status</span>
          <select
            value={filters.status}
            onChange={(e) => set({ status: e.target.value as StatusFilter })}
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
            checked={filters.mechanismOnly}
            onChange={(e) => set({ mechanismOnly: e.target.checked })}
            className="accent-[var(--primary)]"
          />
          <span className="text-[var(--muted)]">With a mechanism</span>
        </label>

        <span className="ml-auto inline-flex items-center gap-3 text-[var(--muted)]">
          <span className="tabular-nums">
            {shown.length} of {records.length} {records.length === 1 ? noun : nounPlural}
          </span>
          {filtered ? (
            <button type="button" onClick={clear} className="underline underline-offset-4">
              Clear
            </button>
          ) : null}
        </span>
      </div>
    </Card>
  )
}
