'use client'

import { useMemo } from 'react'
import { DIMENSIONS, DIMENSION_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import type { EvidenceRecord } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityLink } from '@/components/CapabilityLink'
import { EvidenceFilters, useEvidenceFilters } from '@/components/EvidenceFilters'
import { PatternCard } from '@/components/PatternCard'
import { Empty, Section } from '@/components/ui'
import { evidenceDimension } from '@/lib/evidence'
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
        groups.map(({ dimension: d, records: group }) => (
          <Section
            key={d}
            title={<CapabilityLink dimension={d}>{DIMENSION_LABELS[d]}</CapabilityLink>}
            icon={<Icon name={DIMENSION_ICON[d]} size={22} />}
            hint={`${group.length} ${group.length === 1 ? 'delivery' : 'deliveries'} linked to ${[...new Set(group.map((r) => INDICATORS_BY_ID[r.indicatorId]?.name))].join(', ')}.`}
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
