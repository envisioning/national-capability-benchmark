'use client'

import { useEffect, useRef, useState } from 'react'
import { INDICATORS_BY_ID, MEASUREMENT_CLASS_MEANING } from '@ncb/core'
import type { IndicatorAcrossCountries } from '@ncb/core'
import { Distribution } from '@/components/Distribution'
import { Icon } from '@/components/Icon'
import { indicatorHref } from '@/lib/links'
import { ClassBadge, CountryLabel, Score } from '@/components/ui'

/**
 * A number in a table is not information until you know what else it could have
 * been. Clicking one opens every country's value for that indicator, ranked,
 * with this country marked and the ten that fix the ends of the scale marked
 * too.
 *
 * The 40-country payload is fetched when the reader asks for it. Shipping all
 * 34 of them with every country page would add weight to a page most readers
 * never expand. See D30.
 */
export function IndicatorPeek({
  indicatorId,
  iso3,
  children,
}: {
  indicatorId: string
  /** The country the reader is looking at, marked in the list. */
  iso3: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<IndicatorAcrossCountries | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const def = INDICATORS_BY_ID[indicatorId]

  useEffect(() => {
    if (!open || view || error) return
    let cancelled = false
    fetch(`/api/indicator/${indicatorId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: IndicatorAcrossCountries) => {
        if (!cancelled) setView(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the other countries.')
      })
    return () => {
      cancelled = true
    }
  }, [open, view, error, indicatorId])

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  if (!def) return <>{children}</>

  const values = view?.values ?? []
  const mine = values.find((v) => v.iso3 === iso3)
  const rank = mine ? values.indexOf(mine) + 1 : null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-left underline decoration-dotted underline-offset-4 hover:decoration-solid"
        title={`See every country on ${def.name}`}
      >
        {children}
        <Icon name="search-x" size={12} className="shrink-0 text-[var(--muted)]" />
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false)
        }}
        className="m-auto w-[min(46rem,92vw)] rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-0 text-left text-[var(--foreground)] backdrop:bg-black/50"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="mb-4 flex items-start justify-between gap-6">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <ClassBadge value={def.measurementClass} />
                <span className="text-xs text-[var(--muted)]">
                  {MEASUREMENT_CLASS_MEANING[def.measurementClass].plain}
                </span>
              </div>
              <h2 className="text-2xl font-light leading-tight">{def.name}</h2>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed">{def.definition}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md border border-[var(--rule)] px-2 py-1 text-xs"
            >
              Close
            </button>
          </div>

          <p className="mb-4 max-w-2xl text-xs leading-relaxed text-[var(--muted)]">
            Measured in {def.unit}, where {def.direction === 'higher_better' ? 'higher' : 'lower'} is
            better. Source:{' '}
            {def.source.url ? (
              <a
                href={def.source.url}
                className="underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                {def.source.publisher}
                {def.source.series ? ` (${def.source.series})` : ''}
              </a>
            ) : (
              <>
                {def.source.publisher}
                {def.source.series ? ` (${def.source.series})` : ''}
              </>
            )}
            , also in the{' '}
            <a href={indicatorHref(def.id)} className="underline underline-offset-4">
              indicator registry
            </a>
            . In the strip below, each dot is a country, the box spans the middle half of the field,
            and the line inside it is the median. The bar in the list is the normalized position
            from 0 to 100 on a scale fixed by ten reference countries, so higher is always better on
            the bar whatever the raw number does.
            {rank ? ` This country ranks ${rank} of ${values.length} on the values we hold.` : ''}
          </p>

          {error ? <p className="text-lg">{error}</p> : null}
          {!view && !error ? <p className="text-lg text-[var(--muted)]">Loading…</p> : null}

          {view ? (
            <Distribution
              points={values.map((v) => ({
                key: v.iso3,
                label: v.country,
                value: v.normalized,
                detail: `${v.raw.toLocaleString('en-US')} ${def.unit}, ${v.year}`,
                focal: v.iso3 === iso3,
                clamped: v.outOfFrame,
              }))}
            />
          ) : null}

          {view ? (
            <ul className="mt-4 space-y-1">
              {values.map((v) => {
                const focal = v.iso3 === iso3
                return (
                  <li
                    key={v.iso3}
                    className={`grid grid-cols-[1.4fr_5rem_3rem_1fr] items-center gap-3 rounded-md px-2 py-1 text-xs ${
                      focal ? 'bg-[var(--surface-sunken)] font-medium' : ''
                    }`}
                  >
                    <span className="truncate">
                      <CountryLabel iso3={v.iso3} name={v.country} />
                    </span>
                    <span className="text-right tabular-nums">{v.raw.toLocaleString('en-US')}</span>
                    <span className="text-right tabular-nums text-[var(--muted)]">{v.year}</span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 grow rounded-full bg-[var(--rule-soft)]">
                        <span
                          className="block h-2 rounded-full"
                          style={{
                            width: `${Math.max(1, v.normalized)}%`,
                            background: focal ? 'var(--primary)' : 'var(--muted)',
                          }}
                        />
                      </span>
                      <Score value={v.normalized} size="sm" />
                      {v.outOfFrame ? (
                        <Icon
                          name="triangle-alert"
                          size={12}
                          className="text-[var(--muted)]"
                        />
                      ) : null}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}

          {view ? (
            <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
              A warning mark means the value sat outside the range the reference countries cover, so
              its position was clamped to 0 or 100 and information was lost. {def.notes}
            </p>
          ) : null}
        </div>
      </dialog>
    </>
  )
}
