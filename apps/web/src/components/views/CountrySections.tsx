'use client'

import { useEffect, useState } from 'react'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'

const SECTION_SELECTOR = 'details[data-fold-section]'

/** Opens or closes every section, for a reader who wants the whole record. */
export function CountrySectionsToggle() {
  const [allOpen, setAllOpen] = useState(false)
  return (
    <button
      type="button"
      className="text-xs underline underline-offset-4"
      onClick={() => {
        const next = !allOpen
        document.querySelectorAll<HTMLDetailsElement>(SECTION_SELECTOR).forEach((el) => {
          el.open = next
        })
        setAllOpen(next)
      }}
    >
      {allOpen ? 'Close every capability' : 'Open every capability'}
    </button>
  )
}

/**
 * The nine capabilities beside the sections, in the model's order, marking the
 * one the reader is in. Wide screens only: on a narrow one the closed sections
 * already fit a screen or two and read as their own list.
 */
export function CountrySectionRail({
  items,
}: {
  items: Array<{ dimension: Dimension; label: string; score: string }>
}) {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    document.querySelectorAll(SECTION_SELECTOR).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="Capabilities on this page" className="sticky top-24 hidden lg:block">
      <ul className="space-y-1">
        {items.map(({ dimension, label, score }) => {
          const here = current === dimension
          return (
            <li key={dimension}>
              <a
                href={`#${dimension}`}
                aria-current={here ? 'location' : undefined}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors duration-200 hover:bg-[var(--surface-sunken)] ${
                  here ? 'bg-[var(--surface-sunken)] font-medium' : 'text-[var(--muted)]'
                }`}
              >
                <Icon name={DIMENSION_ICON[dimension]} size={14} className="shrink-0" />
                <span className="min-w-0 grow truncate">{label}</span>
                <span className="tabular-nums">{score}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
