'use client'

import { useState } from 'react'
import type { FactorHistoryRelease } from '@ncb/core'
import { FACTOR_INCOME_BANDS } from '@ncb/core'
import { CHART_INK, CHART_STROKE } from '@/components/chartTokens'

const WIDTH = 480
const PLOT = { left: 46, right: 14 }
/** Closest two release labels may sit, in chart units, before the later one is dropped. */
const LABEL_GAP = 52
const SHARE = { top: 10, height: 130 }
const INCOME = { top: 168, height: 70 }
const AXIS_Y = 262
const HEIGHT = 272
/** In-chart text, in chart units. The viewBox is 480 wide, so 13 reads at about 9px on a phone. */
const LABEL = 13
const MARK_R = 4

const pct = (x: number) => `${(x * 100).toFixed(1)}%`

/**
 * The one-factor test at every dataset release, as an ordered sequence.
 *
 * A release is a version, not a date, so the x axis is the order of releases
 * at equal steps and labelled by version. The top panel is the first-factor
 * share against the band chance produces at that release's size, from the
 * mean to the 95th percentile. The bottom panel is the first factor's
 * correlation with income, on its own axis because it is a different measure.
 * A hollow point reads fewer than nine capabilities, because too few
 * countries had all nine scored that release. The readout under the chart
 * prints every number for the release under the pointer, so the drawing is a
 * second encoding. See D137.
 */
export function FactorHistory({ releases }: { releases: FactorHistoryRelease[] }) {
  const [active, setActive] = useState(releases.length - 1)
  if (releases.length === 0) return null
  const step = (WIDTH - PLOT.left - PLOT.right) / Math.max(releases.length - 1, 1)
  const x = (i: number) => PLOT.left + i * step
  const yShare = (v: number) => SHARE.top + SHARE.height * (1 - v)
  const yIncome = (v: number) => INCOME.top + INCOME.height * (1 - v)

  const path = (ys: Array<number | null>) =>
    ys
      .map((y, i) => (y === null ? null : `${x(i)},${y}`))
      .reduce<string[]>((segments, point, i) => {
        if (point === null) return segments
        const join = i > 0 && ys[i - 1] !== null && segments.length > 0
        segments.push(`${join ? 'L' : 'M'}${point}`)
        return segments
      }, [])
      .join(' ')

  const band = [
    ...releases.map((r, i) => `${x(i)},${yShare(r.chance.p95)}`),
    ...releases.map((r, i) => `${x(i)},${yShare(r.chance.mean)}`).reverse(),
  ].join(' ')

  /* Label the first release of each major version and the latest one. */
  const labelled = new Set<number>([releases.length - 1])
  releases.forEach((r, i) => {
    const major = r.version.split('.')[0]
    if (i === 0 || releases[i - 1]?.version.split('.')[0] !== major) labelled.add(i)
  })
  /* Keep the latest label, then walk back and drop any that would crowd the
   * one kept after it. */
  let kept = x(releases.length - 1)
  for (const i of [...labelled].sort((a, b) => b - a)) {
    if (i === releases.length - 1) continue
    if (kept - x(i) < LABEL_GAP) labelled.delete(i)
    else kept = x(i)
  }

  const current = releases[active] as FactorHistoryRelease
  const first = releases[0] as FactorHistoryRelease
  const last = releases[releases.length - 1] as FactorHistoryRelease

  return (
    <figure>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full max-w-2xl text-[var(--foreground)]"
        role="img"
        aria-label={`First-factor share at ${releases.length} dataset releases, from ${pct(first.firstFactorShare)} at ${first.version} to ${pct(last.firstFactorShare)} at ${last.version}, against the share chance alone would produce.`}
        onPointerLeave={() => setActive(releases.length - 1)}
      >
        {[0, 0.5, 1].map((v) => (
          <g key={`s${v}`}>
            <line
              x1={PLOT.left}
              x2={WIDTH - PLOT.right}
              y1={yShare(v)}
              y2={yShare(v)}
              stroke="currentColor"
              strokeWidth={CHART_STROKE.hair}
              strokeOpacity={v === 0 ? CHART_INK.frame : CHART_INK.grid}
            />
            <text
              x={PLOT.left - 6}
              y={yShare(v)}
              dy="0.35em"
              textAnchor="end"
              fontSize={LABEL}
              fill="currentColor"
              fillOpacity={CHART_INK.label}
            >
              {v * 100}%
            </text>
          </g>
        ))}
        <polygon points={band} fill="currentColor" fillOpacity={CHART_INK.grid} />
        <path
          d={path(releases.map((r) => yShare(r.chance.p95)))}
          fill="none"
          stroke="currentColor"
          strokeWidth={CHART_STROKE.hair}
          strokeOpacity={CHART_INK.emphasis}
          strokeDasharray="3 3"
        />
        <text
          x={WIDTH - PLOT.right}
          y={yShare(last.chance.p95) - 6}
          textAnchor="end"
          fontSize={LABEL}
          fill="currentColor"
          fillOpacity={CHART_INK.label}
        >
          chance, 95th percentile
        </text>
        <path
          d={path(releases.map((r) => yShare(r.firstFactorShare)))}
          fill="none"
          stroke="currentColor"
          strokeWidth={CHART_STROKE.data}
        />
        <text
          x={WIDTH - PLOT.right}
          y={yShare(last.firstFactorShare) - 10}
          textAnchor="end"
          fontSize={LABEL}
          fill="currentColor"
        >
          first-factor share
        </text>

        {[0, FACTOR_INCOME_BANDS.strong, 1].map((v) => (
          <g key={`i${v}`}>
            <line
              x1={PLOT.left}
              x2={WIDTH - PLOT.right}
              y1={yIncome(v)}
              y2={yIncome(v)}
              stroke="currentColor"
              strokeWidth={v === FACTOR_INCOME_BANDS.strong ? CHART_STROKE.rule : CHART_STROKE.hair}
              strokeOpacity={v === FACTOR_INCOME_BANDS.strong ? CHART_INK.emphasis : CHART_INK.grid}
              strokeDasharray={v === FACTOR_INCOME_BANDS.strong ? '3 3' : undefined}
            />
            {v === 1 ? null : (
            <text
              x={PLOT.left - 6}
              y={yIncome(v)}
              dy="0.35em"
              textAnchor="end"
              fontSize={LABEL}
              fill="currentColor"
              fillOpacity={CHART_INK.label}
            >
              {v.toFixed(1)}
            </text>
            )}
          </g>
        ))}
        <path
          d={path(releases.map((r) => (r.income ? yIncome(Math.abs(r.income.r)) : null)))}
          fill="none"
          stroke="currentColor"
          strokeWidth={CHART_STROKE.line}
        />
        <text
          x={PLOT.left + 4}
          y={INCOME.top - 8}
          fontSize={LABEL}
          fill="currentColor"
          fillOpacity={CHART_INK.label}
        >
          r of the first factor with log GDP per head
        </text>

        {releases.map((r, i) => {
          const hollow = r.basis !== 'complete'
          const on = i === active
          return (
            <g key={r.version}>
              <circle
                cx={x(i)}
                cy={yShare(r.firstFactorShare)}
                r={MARK_R}
                fill={hollow ? 'var(--background)' : 'currentColor'}
                stroke="currentColor"
                strokeWidth={CHART_STROKE.mark}
              />
              {r.income ? (
                <circle
                  cx={x(i)}
                  cy={yIncome(Math.abs(r.income.r))}
                  r={MARK_R - 1}
                  fill={hollow ? 'var(--background)' : 'currentColor'}
                  stroke="currentColor"
                  strokeWidth={CHART_STROKE.mark}
                />
              ) : null}
              {on ? (
                <line
                  x1={x(i)}
                  x2={x(i)}
                  y1={SHARE.top}
                  y2={INCOME.top + INCOME.height}
                  stroke="currentColor"
                  strokeWidth={CHART_STROKE.rule}
                  strokeOpacity={CHART_INK.emphasis}
                />
              ) : null}
              {labelled.has(i) ? (
                <text
                  x={x(i)}
                  y={AXIS_Y}
                  textAnchor={i === releases.length - 1 ? 'end' : 'middle'}
                  fontSize={LABEL}
                  fill="currentColor"
                  fillOpacity={CHART_INK.label}
                >
                  {r.version}
                </text>
              ) : null}
              <rect
                x={x(i) - step / 2}
                y={0}
                width={step}
                height={HEIGHT}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
              />
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-3 min-h-[3.5em] max-w-2xl text-xs leading-relaxed">
        <span className="font-medium">Dataset {current.version}</span>
        <span className="text-[var(--muted)]">
          {' '}
          · {current.countries} countries, {current.dimensions.length} capabilities · share{' '}
          {pct(current.firstFactorShare)} · chance {pct(current.chance.mean)}, 95th percentile{' '}
          {pct(current.chance.p95)}
          {current.income
            ? ` · r with income ${Math.abs(current.income.r).toFixed(2)} (${current.income.n} countries)`
            : ''}
          {current.basis !== 'complete' ? ' · hollow: fewer than nine capabilities' : ''}
        </span>
      </figcaption>
    </figure>
  )
}
