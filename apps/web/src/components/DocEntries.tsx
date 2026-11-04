'use client'

import { useMemo, useState } from 'react'
import { Fold } from '@/components/Fold'
import { fieldClass } from '@/components/ui'

export type DocEntry = { id: string; text: string; title: React.ReactNode; body: React.ReactNode }

/**
 * A long record as one line per entry, filtered by title. Every entry keeps the
 * address other pages cite, and that address opens it. See D190.
 */
export function DocEntries({
  entries,
  placeholder,
  noun,
  open = 0,
}: {
  entries: DocEntry[]
  placeholder: string
  noun: string
  /** How many entries from the top start open. */
  open?: number
}) {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const shown = useMemo(
    () => new Set(entries.filter((e) => e.text.toLowerCase().includes(needle)).map((e) => e.id)),
    [entries, needle],
  )
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="min-w-56 grow sm:max-w-sm">
          <span className="sr-only">{placeholder}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className={fieldClass()}
          />
        </label>
        <p aria-live="polite" className="text-xs text-[var(--muted)]">
          {shown.size} of {entries.length} {noun}
        </p>
      </div>
      <div className="border-t border-[var(--rule)]">
        {/* A filtered-out entry stays in the document, so its address still works. */}
        {entries.map((e, i) => (
          <div key={e.id} hidden={!shown.has(e.id)}>
            <Fold id={e.id} defaultOpen={i < open} summary={<h2 className="text-base font-medium leading-snug">{e.title}</h2>}>
              {e.body}
            </Fold>
          </div>
        ))}
      </div>
    </div>
  )
}
