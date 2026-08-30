'use client'

import { useRouter } from 'next/navigation'
import { countryFlag } from '@ncb/core'
import { Icon } from '@/components/Icon'
import { COMPARE_MAX, compareHref } from '@/lib/links'

export type ComparePickerCountry = { iso3: string; country: string }

/**
 * The control that decides which countries the page holds.
 *
 * The selection lives in the address and nowhere else, so every change here is
 * a navigation. That is what makes a comparison sendable: the reader who built
 * it and the reader who receives the link see the same page. See D70.
 */
export function ComparePicker({
  selected,
  all,
}: {
  selected: ComparePickerCountry[]
  all: ComparePickerCountry[]
}) {
  const router = useRouter()
  const codes = selected.map((c) => c.iso3)
  const go = (next: string[]) => router.push(compareHref(next))

  const available = all
    .filter((c) => !codes.includes(c.iso3))
    .sort((a, b) => a.country.localeCompare(b.country))

  return (
    <div className="mb-10 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        Countries in this comparison
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {selected.map((c, i) => (
          <span
            key={c.iso3}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-1 text-xs"
          >
            <span aria-hidden="true">{countryFlag(c.iso3)}</span>
            <span className="font-medium">{c.country}</span>
            {i === 0 ? (
              <span className="text-[var(--muted)]">reference</span>
            ) : (
              <button
                type="button"
                onClick={() => go([c.iso3, ...codes.filter((code) => code !== c.iso3)])}
                className="text-[var(--muted)] underline underline-offset-4 hover:text-[var(--foreground)]"
              >
                make reference
              </button>
            )}
            <button
              type="button"
              aria-label={`Remove ${c.country} from the comparison`}
              onClick={() => go(codes.filter((code) => code !== c.iso3))}
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Icon name="x" size={13} />
            </button>
          </span>
        ))}

        {selected.length < COMPARE_MAX ? (
          <label className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
            <span>{selected.length === 0 ? 'Start with' : 'Add'}</span>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) go([...codes, e.target.value])
              }}
              className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-1 text-xs"
            >
              <option value="">a country</option>
              {available.map((c) => (
                <option key={c.iso3} value={c.iso3}>
                  {countryFlag(c.iso3)} {c.country}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span className="text-xs text-[var(--muted)]">
            Four is the limit. Remove one to add another.
          </span>
        )}

        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => go([])}
            className="ml-auto text-xs text-[var(--muted)] underline underline-offset-4 hover:text-[var(--foreground)]"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}
