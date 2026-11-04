'use client'

import { useState } from 'react'
import { COUNTRY_NAMES, EVIDENCE_STATUS_LABELS } from '@ncb/core'
import type { EvidenceRecord } from '@ncb/core'
import { Icon } from '@/components/Icon'
import { CountryLabel } from '@/components/ui'

/**
 * One documented delivery as one line: year, country, title, status. It opens
 * onto the full record. The corpus has hundreds of records, and a list that
 * prints them all whole cannot be scanned. `render` draws the record only once
 * opened, for a list long enough that the closed rows must stay light. See D190.
 */
export function RecordRow({
  record,
  children,
  render,
}: {
  record: EvidenceRecord
  children?: React.ReactNode
  render?: () => React.ReactNode
}) {
  const [opened, setOpened] = useState(false)
  return (
    <details
      className="group border-b border-[var(--rule-soft)]"
      onToggle={(e) => {
        if (e.currentTarget.open) setOpened(true)
      }}
    >
      <summary className="grid cursor-pointer list-none grid-cols-[1rem_3rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 py-2.5 text-xs sm:grid-cols-[1rem_3rem_11rem_minmax(0,1fr)_auto] [&::-webkit-details-marker]:hidden">
        <Icon
          name="chevron-down"
          size={14}
          className="-rotate-90 self-center text-[var(--muted)] transition-transform duration-200 group-open:rotate-0"
        />
        <span className="tabular-nums text-[var(--muted)]">{record.started}</span>
        <span className="min-w-0 truncate text-[var(--muted)] sm:col-auto">
          <CountryLabel iso3={record.iso3} name={COUNTRY_NAMES[record.iso3] ?? record.iso3} />
        </span>
        <span className="col-start-3 font-medium sm:col-start-auto">{record.title}</span>
        <span className="col-start-3 text-[var(--muted)] sm:col-start-auto">
          {EVIDENCE_STATUS_LABELS[record.status]}
        </span>
      </summary>
      <div className="pb-4 pt-1">{render ? (opened ? render() : null) : children}</div>
    </details>
  )
}
