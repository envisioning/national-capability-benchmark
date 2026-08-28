'use client'

import { useEffect, useRef, useState } from 'react'
import { DIMENSION_LABELS, DIMENSION_QUESTIONS, confidenceBand, isThinEvidence } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { Distribution } from '@/components/Distribution'
import { CapabilityLink } from '@/components/CapabilityLink'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CountryLabel, Score } from '@/components/ui'

type Row = {
  iso3: string
  country: string
  score: number
  confidence: number
  delta: number | null
  basket: number | null
  spanYears: number | null
}

/**
 * The same peek as the indicator one, for a dimension score.
 *
 * A country page shows one country. This answers the question that page cannot:
 * where does 46.7 sit among the countries we hold, and how well evidenced is
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
                <CapabilityLink dimension={dimension}>{DIMENSION_LABELS[dimension]}</CapabilityLink>
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
            Scores use one 0 to 100 scale for all countries. Each dot is a country. The box covers
            the middle half of the field, and the line is the median. Hollow dots have thin
            evidence. The band beside each score shows its evidence level. The last column shows
            the trend and the number of indicators behind it.
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
                      <Score value={r.score} size="sm" />
                    </span>
                    <span className="text-right text-[var(--muted)]" title={band.meaning}>
                      {band.label}
                    </span>
                    <span
                      className="text-right tabular-nums text-[var(--muted)]"
                      title={
                        r.delta === null
                          ? undefined
                          : `Change over ${r.spanYears} years on ${r.basket} matched indicators.`
                      }
                    >
                      {r.delta === null
                        ? ''
                        : `${r.delta > 0 ? '+' : ''}${r.delta.toFixed(1)} (${r.basket})`}
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
