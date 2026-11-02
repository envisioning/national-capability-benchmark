'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Dimension, HistoryDelta } from '@ncb/core'
import { CHART_INK, CHART_STROKE } from '@/components/chartTokens'
import { countryProfileHref } from '@/lib/links'
import type { CohortYear, HistoryPageData } from '@/lib/history'
import { historyYearTicks as yearTicks, signedPoints as signed } from '@/lib/history'

const WIDTH = 760
const HEIGHT = 260
const PLOT = { left: 40, right: 12, top: 12, bottom: 48 }
const STRIP = { top: HEIGHT - 30, height: 8 }
const Y_TICKS = [0, 50, 100]

const BUTTON =
  'rounded-md border px-3 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40'
const BUTTON_ON = 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
const BUTTON_OFF =
  'border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'

/**
 * Cohorts and countries over time, one dimension at a time. The chart draws a
 * cohort's median reconstruction with the middle half of its members, the
 * median replay beside it, and how much of every year the model filled. The
 * tables give every cohort's and every country's change with its band. See
 * D174 and D178.
 */
export function CohortHistoryView({ data }: { data: HistoryPageData }) {
  const [dimension, setDimension] = useState<Dimension>(data.dimensions[0]!.dimension)
  const [cohortId, setCohortId] = useState(data.cohorts.find((c) => c.id !== 'all')?.id ?? 'all')
  const [span, setSpan] = useState(Math.min(...data.spans))

  const label = data.dimensions.find((d) => d.dimension === dimension)?.label ?? dimension
  const cohort = data.cohorts.find((c) => c.id === cohortId) ?? data.cohorts[0]!
  const all = data.cohorts.find((c) => c.id === 'all')
  const series = cohort.dimensions[dimension]?.series ?? []
  const reference = cohort.id === 'all' ? [] : (all?.dimensions[dimension]?.series ?? [])

  return (
    <div>
      <div className="mb-5 space-y-4">
        <Choice label="Capability">
          {data.dimensions.map((d) => (
            <button
              key={d.dimension}
              type="button"
              aria-pressed={d.dimension === dimension}
              onClick={() => setDimension(d.dimension)}
              className={`${BUTTON} ${d.dimension === dimension ? BUTTON_ON : BUTTON_OFF}`}
            >
              {d.label}
            </button>
          ))}
        </Choice>
        <Choice label="Cohort">
          {data.cohorts.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === cohort.id}
              onClick={() => setCohortId(c.id)}
              className={`${BUTTON} ${c.id === cohort.id ? BUTTON_ON : BUTTON_OFF}`}
            >
              {c.id === 'all' ? 'All countries' : c.label} ({c.members})
            </button>
          ))}
        </Choice>
      </div>

      <CohortChart
        series={series}
        reference={reference}
        from={data.fromYear}
        to={data.toYear}
        ariaLabel={`${label}, ${cohort.label}: median reconstruction from ${data.fromYear} to ${data.toYear}`}
      />
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
        <li className="inline-flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <rect x="0" y="0" width="22" height="10" fill="var(--primary)" fillOpacity={0.18} />
            <line x1="0" y1="5" x2="22" y2="5" stroke="var(--primary)" strokeWidth={CHART_STROKE.data} />
          </svg>
          Median reconstruction, band the middle half of the cohort&apos;s countries
        </li>
        <li className="inline-flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <line x1="0" y1="5" x2="22" y2="5" stroke="var(--foreground)" strokeOpacity={0.7} strokeWidth={CHART_STROKE.line} strokeDasharray="4 3" />
          </svg>
          Median replay, over the countries that have one that year
        </li>
        {reference.length ? (
          <li className="inline-flex items-center gap-2">
            <svg width="22" height="10" aria-hidden="true">
              <line x1="0" y1="5" x2="22" y2="5" stroke="var(--foreground)" strokeOpacity={0.35} strokeWidth={CHART_STROKE.line} />
            </svg>
            Median reconstruction, all countries
          </li>
        ) : null}
        <li className="inline-flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <rect x="0" y="1" width="22" height="8" fill="var(--foreground)" fillOpacity={0.5} />
          </svg>
          Darker means a larger share of indicators modelled
        </li>
      </ul>
      <SeriesNote series={series} />

      <h3 className="mb-3 mt-10 text-lg font-medium">Change by cohort, {label}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs tabular-nums">
          <thead className="text-left text-[var(--muted)]">
            <tr className="border-b border-[var(--rule)]">
              <th className="py-2 pr-4 font-normal">Cohort</th>
              {data.spans.map((s) => (
                <th key={s} className="py-2 pr-4 font-normal">
                  {s} years: median change, band, against all
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.cohorts.map((c) => (
              <tr key={c.id} className="border-b border-[var(--rule)] align-top">
                <td className="py-2 pr-4">{c.id === 'all' ? 'All countries' : c.label}</td>
                {data.spans.map((s) => {
                  const d = c.dimensions[dimension]?.deltas.find((x) => x.span === s)
                  return (
                    <td key={s} className="py-2 pr-4">
                      {d ? (
                        <>
                          <DeltaWithBand delta={d} />{' '}
                          <span className="text-[var(--muted)]">
                            {c.id === 'all' ? '' : `${signed(d.relative)} against all, `}n {d.n}
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--muted)]">none</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-3 mt-10 flex flex-wrap items-end justify-between gap-4">
        <h3 className="text-lg font-medium">Change by country, {label}</h3>
        {data.spans.length > 1 ? (
          <Choice label="Span">
            {data.spans.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === span}
                onClick={() => setSpan(s)}
                className={`${BUTTON} ${s === span ? BUTTON_ON : BUTTON_OFF}`}
              >
                {s} years
              </button>
            ))}
          </Choice>
        ) : null}
      </div>
      <p className="mb-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Alphabetical, because any other order would be a ranking. A band that includes zero means the
        change cannot be told apart from no change. The last column is the share of the country&apos;s
        indicators the model filled in the first year of the longest span.
      </p>
      <div className="max-h-[32rem] overflow-auto rounded-xl border border-[var(--rule)]">
        <table className="w-full text-xs tabular-nums">
          <thead className="sticky top-0 bg-[var(--surface)] text-left text-[var(--muted)]">
            <tr className="border-b border-[var(--rule)]">
              <th className="px-3 py-2 font-normal">Country</th>
              <th className="px-3 py-2 font-normal">Change, band</th>
              <th className="px-3 py-2 font-normal">Modelled at start</th>
            </tr>
          </thead>
          <tbody>
            {data.countries.map((row) => {
              const dim = row.dimensions[dimension]
              const d = dim?.deltas.find((x) => x.span === span)
              return (
                <tr key={row.iso3} className="border-b border-[var(--rule)] last:border-0">
                  <td className="px-3 py-1.5">
                    <Link href={`${countryProfileHref(row.iso3)}#${dimension}`} className="hover:underline">
                      {row.country}
                    </Link>
                  </td>
                  <td className="px-3 py-1.5">
                    {d ? <DeltaWithBand delta={d} /> : <span className="text-[var(--muted)]">none</span>}
                  </td>
                  <td className="px-3 py-1.5 text-[var(--muted)]">
                    {dim?.baseModelledShare == null
                      ? 'none'
                      : `${Math.round(dim.baseModelledShare * 100)}%`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Choice({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={label}>
        {children}
      </div>
    </div>
  )
}

function CohortChart({
  series,
  reference,
  from,
  to,
  ariaLabel,
}: {
  series: CohortYear[]
  reference: CohortYear[]
  from: number
  to: number
  ariaLabel: string
}) {
  if (series.length < 2) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--rule)] px-6 py-12 text-center text-lg text-[var(--muted)]">
        This cohort has no reconstruction for this capability.
      </div>
    )
  }
  const x = (year: number) => PLOT.left + ((year - from) / (to - from || 1)) * (WIDTH - PLOT.left - PLOT.right)
  const y = (score: number) => HEIGHT - PLOT.bottom - (score / 100) * (HEIGHT - PLOT.top - PLOT.bottom)
  const step = (WIDTH - PLOT.left - PLOT.right) / (to - from || 1)
  const line = (points: Array<{ year: number; v: number }>) =>
    points.map((p) => `${x(p.year).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
  const band = [
    ...series.map((p) => `${x(p.year).toFixed(1)},${y(p.q3).toFixed(1)}`),
    ...[...series].reverse().map((p) => `${x(p.year).toFixed(1)},${y(p.q1).toFixed(1)}`),
  ].join(' ')
  const replay = series.filter((p) => p.replay !== null).map((p) => ({ year: p.year, v: p.replay! }))

  return (
    <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface-sunken)] p-3 sm:p-4">
      <svg
        width="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMinYMin meet"
        role="img"
        aria-label={ariaLabel}
        className="block h-auto w-full"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      >
        {Y_TICKS.map((tick) => (
          <g key={tick}>
            <line
              x1={PLOT.left}
              y1={y(tick)}
              x2={WIDTH - PLOT.right}
              y2={y(tick)}
              stroke="currentColor"
              strokeOpacity={tick === 0 ? CHART_INK.frame : CHART_INK.grid}
              strokeWidth={tick === 0 ? CHART_STROKE.rule : CHART_STROKE.hair}
            />
            <text x={PLOT.left - 8} y={y(tick) + 4} textAnchor="end" fill="var(--muted)" fontSize="11">
              {tick}
            </text>
          </g>
        ))}
        {yearTicks(from, to).map((year) => (
          <text key={year} x={x(year)} y={STRIP.top - 6} textAnchor="middle" fill="var(--muted)" fontSize="11">
            {year}
          </text>
        ))}
        <polygon points={band} fill="var(--primary)" fillOpacity={0.18} stroke="none" />
        {reference.length > 1 ? (
          <polyline
            points={line(reference.map((p) => ({ year: p.year, v: p.median })))}
            fill="none"
            stroke="var(--foreground)"
            strokeOpacity={0.35}
            strokeWidth={CHART_STROKE.line}
          />
        ) : null}
        <polyline
          points={line(series.map((p) => ({ year: p.year, v: p.median })))}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={CHART_STROKE.data}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {replay.length > 1 ? (
          <polyline
            points={line(replay)}
            fill="none"
            stroke="var(--foreground)"
            strokeOpacity={0.7}
            strokeWidth={CHART_STROKE.line}
            strokeDasharray="4 3"
          />
        ) : null}
        {series.map((p) => (
          <rect
            key={p.year}
            x={x(p.year) - step / 2 + 0.5}
            y={STRIP.top}
            width={Math.max(step - 1, 1)}
            height={STRIP.height}
            fill="var(--foreground)"
            fillOpacity={p.modelledShare === 0 ? CHART_INK.band : 0.12 + 0.6 * p.modelledShare}
          >
            <title>{`${p.year}: ${Math.round(p.modelledShare * 100)}% of indicators modelled, ${p.n} countries, replay for ${p.replayN}`}</title>
          </rect>
        ))}
        <text x={PLOT.left - 8} y={STRIP.top + STRIP.height} textAnchor="end" fill="var(--muted)" fontSize="10">
          model
        </text>
      </svg>
    </div>
  )
}

function SeriesNote({ series }: { series: CohortYear[] }) {
  const first = series[0]
  const last = series[series.length - 1]
  if (!first || !last) return null
  return (
    <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
      In {first.year} the model fills {Math.round(first.modelledShare * 100)}% of the indicators behind
      this median, over {first.n} countries, and {first.replayN} of them have a replay. In {last.year}{' '}
      it fills {Math.round(last.modelledShare * 100)}%, over {last.n} countries. The band shows how far
      apart the countries are, not how wrong the median is. The change tables carry the error bands.
    </p>
  )
}

function DeltaWithBand({ delta }: { delta: HistoryDelta }) {
  const none = delta.lo <= 0 && delta.hi >= 0
  return (
    <span>
      <span className="font-medium">{signed(delta.estimate)}</span>{' '}
      <span className={none ? 'text-[var(--muted)]' : ''}>
        [{signed(delta.lo)}, {signed(delta.hi)}]
      </span>
    </span>
  )
}
