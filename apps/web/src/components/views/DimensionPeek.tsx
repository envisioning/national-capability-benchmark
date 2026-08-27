'use client'

import { useEffect, useRef, useState } from 'react'
import { DIMENSION_LABELS, DIMENSION_QUESTIONS, confidenceBand, isThinEvidence } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { Distribution } from '@/components/Distribution'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CountryLabel } from '@/components/ui'

type Row = {
  iso3: string
  country: string
  score: number
  confidence: number
  delta: number | null
  reference: boolean
}

/**
 * The same peek as the indicator one, for a dimension score.
 *
 * A country page shows one country. This answers the question that page cannot:
 * where does 46.7 sit among the 40 countries we hold, and how well evidenced is
 * everybody else's number. See D30.
 */
/**
 * The trigger most surfaces use: a number you can click.
 *
 * The dialog itself is separate, because the radar opens the same panel from an
 * axis label and cannot nest a button inside its SVG.
 */
export function DimensionPeek({
  dimension,
  iso3,
  children,
}: {
  dimension: Dimension
  iso3: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 underline decoration-dotted underline-offset-4 hover:decoration-solid"
        title={`See every country on ${DIMENSION_LABELS[dimension]}`}
      >
        {children}
      </button>
      <DimensionDialog
        dimension={dimension}
        iso3={iso3}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export function DimensionDialog({
  dimension,
  iso3,
  open,
  onClose,
}: {
  dimension: Dimension
  iso3: string
  open: boolean
  onClose: () => void
}) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!open || rows || error) return
    let cancelled = false
    fetch(`/api/dimension/${dimension}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { values: Row[] }) => {
        if (!cancelled) setRows(data.values)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the other countries.')
      })
    return () => {
      cancelled = true
    }
  }, [open, rows, error, dimension])

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  const mine = rows?.find((r) => r.iso3 === iso3)
  const rank = mine && rows ? rows.indexOf(mine) + 1 : null

  return (
    <>
      <dialog
        ref={dialog}
        onClose={onClose}
        onClick={(e) => {
          if (e.target === dialog.current) onClose()
        }}
        className="m-auto w-[min(44rem,92vw)] rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-0 text-left text-[var(--foreground)] backdrop:bg-black/50"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="mb-4 flex items-start justify-between gap-6">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-light leading-tight">
                <Icon name={DIMENSION_ICON[dimension]} size={22} className="text-[var(--muted)]" />
                {DIMENSION_LABELS[dimension]}
              </h2>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed">
                {DIMENSION_QUESTIONS[dimension]}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md border border-[var(--rule)] px-2 py-1 text-xs"
            >
              Close
            </button>
          </div>

          <p className="mb-4 max-w-2xl text-xs leading-relaxed text-[var(--muted)]">
            Every country is scored the same way, as a position from 0 to 100 on a scale fixed by
            ten reference countries. The band beside each score says how well evidenced it is, and a
            thin band means the number moves on very little. The last column is the change over ten
            years where there is enough history to compute one.
            {rank && rows ? ` This country ranks ${rank} of ${rows.length}.` : ''}
          </p>

          {error ? <p className="text-lg">{error}</p> : null}
          {!rows && !error ? <p className="text-lg text-[var(--muted)]">Loading…</p> : null}

          {rows ? (
            <Distribution
              points={rows.map((r) => ({
                key: r.iso3,
                label: r.country,
                value: r.score,
                detail: `${confidenceBand(r.confidence).label} evidence`,
                focal: r.iso3 === iso3,
                hollow: isThinEvidence(r.confidence),
              }))}
            />
          ) : null}

          {rows ? (
            <ul className="mt-4 space-y-1">
              {rows.map((r) => {
                const focal = r.iso3 === iso3
                const band = confidenceBand(r.confidence)
                return (
                  <li
                    key={r.iso3}
                    className={`grid grid-cols-[1.4fr_1fr_5rem_4rem] items-center gap-3 rounded-md px-2 py-1 text-xs ${
                      focal ? 'bg-[var(--surface-sunken)] font-medium' : ''
                    }`}
                  >
                    <span className="truncate">
                      <CountryLabel iso3={r.iso3} name={r.country} />
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 grow rounded-full bg-[var(--rule-soft)]">
                        <span
                          className="block h-2 rounded-full"
                          style={{
                            width: `${Math.max(1, r.score)}%`,
                            background: focal ? 'var(--primary)' : 'var(--muted)',
                          }}
                        />
                      </span>
                      <span className="w-9 text-right tabular-nums">{r.score.toFixed(1)}</span>
                    </span>
                    <span className="text-right text-[var(--muted)]" title={band.meaning}>
                      {band.label}
                    </span>
                    <span className="text-right tabular-nums text-[var(--muted)]">
                      {r.delta === null ? '' : `${r.delta > 0 ? '+' : ''}${r.delta.toFixed(1)}`}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </dialog>
    </>
  )
}
