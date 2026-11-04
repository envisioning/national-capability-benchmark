'use client'

import { useMemo } from 'react'
import { DIMENSIONS } from '@ncb/core'
import type { EvidenceRecord } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityLink } from '@/components/CapabilityLink'
import { EvidenceFilters, useEvidenceFilters } from '@/components/EvidenceFilters'
import { PatternCard } from '@/components/PatternCard'
import { Fold } from '@/components/Fold'
import { RecordRow } from '@/components/RecordRow'
import { Empty } from '@/components/ui'
import { evidenceDimension } from '@/lib/evidence'
import { dimensionLabel } from '@/lib/labels'
import { NO_PATTERN_FILTERS, type PatternFilters } from '@/lib/links'

/**
 * Every documented delivery, narrowed by the reader.
 *
 * The corpus is large enough that a single scroll hides most of it, so the
 * reader picks a country, a capability, a status or a phrase and the list
 * answers. Grouping stays by dimension, because a delivery is filed against
 * the indicator that should have measured it. The controls, the matching rule
 * and the query-string contract are shared with the table at /agenda, which
 * reads the same corpus. See D46.
 */

export function PatternsView({
  records,
  initial = NO_PATTERN_FILTERS,
}: {
  records: EvidenceRecord[]
  initial?: PatternFilters
}) {
  const state = useEvidenceFilters(records, initial)

  /* A narrowed list is short enough to read, so it opens. */
  const narrowed = state.shown.length < records.length

  const groups = useMemo(
    () =>
      DIMENSIONS.map((d) => ({
        dimension: d,
        records: state.shown.filter((r) => evidenceDimension(r) === d),
      })).filter((g) => g.records.length > 0),
    [state.shown],
  )

  return (
    <>
      <EvidenceFilters records={records} state={state} />

      {groups.length === 0 ? (
        <Empty hint="No delivery matches those filters. Clear one and try again." />
      ) : (
        <div className="border-t border-[var(--rule)]">
          {groups.map(({ dimension: d, records: group }) => (
            <Fold
              key={`${d}-${narrowed}`}
              id={d}
              defaultOpen={narrowed}
              summary={
                <h2 className="flex flex-wrap items-baseline gap-x-3 text-xl font-light leading-tight">
                  <span className="inline-flex items-center gap-2 self-center">
                    <Icon name={DIMENSION_ICON[d]} size={18} className="text-[var(--muted)]" />
                    {dimensionLabel(d)}
                  </span>
                  <span className="text-xs tabular-nums text-[var(--muted)]">
                    {group.length} {group.length === 1 ? 'delivery' : 'deliveries'}
                  </span>
                </h2>
              }
            >
              <p className="mb-3 text-xs">
                <CapabilityLink dimension={d} className="underline underline-offset-4">
                  About {dimensionLabel(d)}
                </CapabilityLink>
              </p>
              <div className="border-t border-[var(--rule-soft)]">
                {group.map((r) => (
                  <RecordRow key={r.id} record={r} render={() => <PatternCard record={r} />} />
                ))}
              </div>
            </Fold>
          ))}
        </div>
      )}
    </>
  )
}
