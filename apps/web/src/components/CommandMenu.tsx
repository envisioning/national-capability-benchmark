'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS,
} from '@ncb/core'
import { DIMENSION_ICON, Icon, type IconName } from '@/components/Icon'
import { Flag } from '@/components/ui'
import { METHOD_PAGES, PARTICIPATE_PAGES, READING_PAGES } from '@/lib/nav'
import { capabilityHref, countryProfileHref, indicatorHref } from '@/lib/links'

type SearchItem = {
  href: string
  label: string
  group: 'Pages' | 'Countries' | 'Capabilities' | 'Indicators'
  icon: IconName
  iso3?: string
  keywords?: string
}

const MAX_RESULTS = 40

/** Remove accents so a search for Sao still reaches São Paulo-related content. */
function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function uniqueByHref(items: SearchItem[]): SearchItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.href)) return false
    seen.add(item.href)
    return true
  })
}

/**
 * The palette reads the same page registries as the navigation and the same
 * country/indicator registries as the benchmark. It is intentionally built at
 * module load: these are static definitions, so opening the palette never
 * causes a data request or a render-time walk of the whole site.
 */
const SEARCH_ITEMS = uniqueByHref([
  ...[...READING_PAGES, ...METHOD_PAGES, ...PARTICIPATE_PAGES].map((page) => ({
    href: page.href,
    label: page.label,
    group: 'Pages' as const,
    icon: 'compass' as const,
    keywords: page.href,
  })),
  ...COUNTRIES.map((country) => ({
    href: countryProfileHref(country.iso3),
    label: country.name,
    group: 'Countries' as const,
    icon: 'flag' as const,
    iso3: country.iso3,
    keywords: country.iso3 + ' ' + country.reason,
  })),
  ...DIMENSIONS.map((dimension) => ({
    href: capabilityHref(dimension),
    label: DIMENSION_LABELS[dimension],
    group: 'Capabilities' as const,
    icon: DIMENSION_ICON[dimension],
    keywords: dimension + ' ' + DIMENSION_QUESTIONS[dimension],
  })),
  ...INDICATORS.map((indicator) => ({
    href: indicatorHref(indicator.id),
    label: indicator.name,
    group: 'Indicators' as const,
    icon: 'ruler' as const,
    keywords: indicator.id + ' ' + indicator.dimension + ' ' + indicator.definition,
  })),
])

function itemMatches(item: SearchItem, query: string): boolean {
  if (!query) return true
  const needle = normalize(query)
  return normalize(item.label + ' ' + item.group + ' ' + (item.keywords ?? '')).includes(needle)
}

function itemRank(item: SearchItem, query: string): number {
  if (!query) return 0
  const needle = normalize(query)
  const label = normalize(item.label)
  if (label === needle) return 0
  if (label.startsWith(needle)) return 1
  if (label.includes(needle)) return 2
  return 3
}

function SearchItemIcon({ item }: { item: SearchItem }) {
  return item.iso3 ? (
    <Flag iso3={item.iso3} />
  ) : (
    <Icon name={item.icon} size={16} className="text-[var(--muted)]" />
  )
}

/** A site-wide command palette, available from the header or ⌘K/Ctrl+K. */
export function CommandMenu({ onOpen }: { onOpen?: () => void }) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const results = useMemo(() => {
    return SEARCH_ITEMS.filter((item) => itemMatches(item, query))
      .sort((left, right) => itemRank(left, query) - itemRank(right, query))
      .slice(0, MAX_RESULTS)
  }, [query])

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    input.current?.focus()
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
        onOpen?.()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onOpen])

  function openPalette() {
    setOpen(true)
    onOpen?.()
  }

  function closePalette() {
    setOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }

  function choose(item: SearchItem) {
    closePalette()
    router.push(item.href)
  }

  function moveSelection(delta: number) {
    if (results.length === 0) return
    setSelectedIndex((current) => (current + delta + results.length) % results.length)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search the benchmark"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={openPalette}
        className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-xs font-medium text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)] sm:px-3"
      >
        <Icon name="search" size={15} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-[var(--rule)] px-1.5 py-0.5 font-mono text-[10px] leading-none sm:inline">
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Search the benchmark"
        onClose={closePalette}
        onClick={(event) => {
          if (event.target === dialog.current) closePalette()
        }}
        className="m-auto w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-0 text-left text-[var(--foreground)] shadow-2xl backdrop:bg-black/50"
      >
        <div className="border-b border-[var(--rule)] p-3">
          <div className="flex items-center gap-3">
            <Icon name="search" size={18} className="shrink-0 text-[var(--muted)]" />
            <input
              ref={input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  moveSelection(1)
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  moveSelection(-1)
                } else if (event.key === 'Enter') {
                  event.preventDefault()
                  const selected = results[selectedIndex]
                  if (selected) choose(selected)
                } else if (event.key === 'Escape') {
                  event.preventDefault()
                  closePalette()
                }
              }}
              placeholder="Search pages, countries, capabilities, indicators..."
              aria-label="Search pages, countries, capabilities and indicators"
              aria-controls="site-search-results"
              aria-autocomplete="list"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
            />
            <kbd className="hidden shrink-0 rounded border border-[var(--rule)] px-1.5 py-1 font-mono text-[10px] text-[var(--muted)] sm:inline">
              esc
            </kbd>
          </div>
        </div>

        <div id="site-search-results" className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
          {results.length > 0 ? (
            <ul role="listbox" aria-label="Search results" className="space-y-0.5">
              {results.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={closePalette}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={
                      index === selectedIndex
                        ? 'flex items-center gap-3 rounded-lg bg-[var(--surface-sunken)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors'
                        : 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
                    }
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <SearchItemIcon item={item} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <span className="shrink-0 text-xs text-[var(--muted)]">{item.group}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-8 text-center text-sm text-[var(--muted)]">
              No matching pages, countries, capabilities or indicators.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--rule)] px-3 py-2 text-[10px] text-[var(--muted)]">
          <span>Navigate with ↑ ↓</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </dialog>
    </>
  )
}
