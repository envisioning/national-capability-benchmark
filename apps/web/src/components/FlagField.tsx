'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { confidenceBand } from '@ncb/core'
import { FlagBubble, FlagBubbleLegend } from '@/components/FlagBubble'
import { ConfidenceBar, Delta, Flag, Score } from '@/components/ui'

/* The radar is only needed after a country flag is pointed at. Keep it out of
   the field's initial bundle, especially for surfaces that do not provide a
   country shape. */
const Radar = dynamic(() => import('@/components/Radar').then((m) => m.Radar), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full" />,
})

/**
 * Every country on one 0 to 100 axis, as a field of flags.
 *
 * A ranked list answers "who is above me". This answers "what does the field
 * look like", which is a different question: three countries tied at the top
 * and a long tail below reads nothing like an even spread, and a rank cannot
 * show either. Countries whose scores are close share a column and stack around
 * the axis, so a cluster is a tall column and the shape of the chart is the
 * shape of the distribution.
 *
 * This is the only field chart in the viewer. The front page, the capability
 * pages, the two peek panels and the compare embed all draw the same picture
 * with the same geometry, so a reader who learns it once has learned it
 * everywhere. Certainty is the ring around each flag and never the flag's
 * opacity. See D67.
 */

export const FIELD_WIDTH = 960
const PAD = 48
const R = 15
/** How close two scores can sit before they share a column. Slightly under a
 *  bubble's width, so a dense field overlaps rather than spreading off-scale. */
const COL_STEP = 28
const ROW = 31
const TICK_ROOM = 30
const MOVE = 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)'

export type FlagFieldPoint = {
  /** Stable across a change of field, so a country keeps its node and travels. */
  key: string
  iso3: string
  /** The country name. Always printed beside the flag, never replaced by it. */
  label: string
  /** Position on the 0 to 100 axis. Null parks the country and fades it out. */
  value: number | null
  /** In the indicator's own units, where the surface has one. */
  detail?: string
  /** Evidence confidence from 0 to 1. Drawn as the bubble's ring. */
  confidence?: number | null
  /** Change over the primary momentum span, in score points. */
  delta?: number | null
  /** The country being read. Drawn with a lime ring and named on the chart. */
  focal?: boolean
  /** Clamped at an end of the scale, so its real position is unknown. */
  clamped?: boolean
  /** Where clicking the flag goes. Without it the flag is not a link. */
  href?: string
  /** The country's own spread, for surfaces that hold every dimension. */
  shape?: {
    highest: { label: string; value: number } | null
    lowest: { label: string; value: number } | null
    scored: number
    total: number
  }
  /** The full capability shape, for a surface that shows it on hover. */
  radar?: {
    values: Array<number | null>
    confidences: Array<number | null>
  }
}

type Placed = FlagFieldPoint & { x: number; y: number; value: number }

const axisX = (v: number) => PAD + (Math.min(100, Math.max(0, v)) / 100) * (FIELD_WIDTH - PAD * 2)

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0
  const i = (sorted.length - 1) * q
  const lo = sorted[Math.floor(i)] as number
  const hi = sorted[Math.ceil(i)] as number
  return lo + (hi - lo) * (i - Math.floor(i))
}

export type FlagFieldLayout = {
  placed: Placed[]
  /** Tallest column, which sets the height the frame has to reserve. */
  stack: number
  median: number
  q1: number
  q3: number
}

/**
 * Where every country stands. Pure, so a surface that switches between fields
 * can lay all of them out once and reserve a frame that holds still.
 */
export function layoutField(points: FlagFieldPoint[]): FlagFieldLayout {
  const scored = points
    .filter((p): p is Placed => p.value !== null)
    .sort((a, b) => a.value - b.value || a.iso3.localeCompare(b.iso3))

  const columns = new Map<number, Placed[]>()
  for (const p of scored) {
    const column = Math.round((axisX(p.value) - PAD) / COL_STEP) * COL_STEP + PAD
    const group = columns.get(column) ?? []
    group.push(p)
    columns.set(column, group)
  }

  /* Columns stack around the axis rather than up from it, so a crowded middle
   * stays centered on the scale and the chart does not lean. */
  const placed = [...columns.entries()].flatMap(([column, group]) =>
    group.map((p, i) => ({ ...p, x: column, y: (i - (group.length - 1) / 2) * ROW })),
  )
  const values = scored.map((p) => p.value)
  return {
    placed,
    stack: Math.max(1, ...[...columns.values()].map((g) => g.length)),
    median: quantile(values, 0.5),
    q1: quantile(values, 0.25),
    q3: quantile(values, 0.75),
  }
}

/**
 * The country under the pointer, read at a glance.
 *
 * A position on an axis is one number about a country, and a reader who has
 * just found a flag halfway down the field wants to know whether that is
 * typical of it. Nothing here is calculated for the card: every number is the
 * one the tables print.
 *
 * It never takes the pointer, so moving toward it is impossible and the flag
 * underneath stays hovered. The flag itself is the link.
 */
function CountryCard({
  point,
  viewTop,
  viewHeight,
}: {
  point: Placed
  viewTop: number
  viewHeight: number
}) {
  const leftPercent = (point.x / FIELD_WIDTH) * 100
  const topPercent = ((point.y - viewTop) / viewHeight) * 100
  const shiftX = leftPercent < 20 ? '-18px' : leftPercent > 80 ? 'calc(-100% + 18px)' : '-50%'
  const shiftY = topPercent < 50 ? '26px' : 'calc(-100% - 26px)'
  const band = point.confidence === null || point.confidence === undefined
    ? null
    : confidenceBand(point.confidence)

  return (
    <div
      className="pointer-events-none absolute z-10 w-60 rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-4"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: `translate(${shiftX}, ${shiftY})`,
      }}
    >
      <p className="flex items-baseline justify-between gap-2 text-xs font-medium">
        <span className="inline-flex items-baseline gap-2">
          <Flag iso3={point.iso3} />
          <span>{point.label}</span>
        </span>
        <span className="text-[var(--muted)]">{point.iso3}</span>
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--rule)] pt-3">
        <span className="text-xs text-[var(--muted)]">Score</span>
        <Score value={point.value} size="md" />
      </div>
      {point.detail ? (
        <p className="mt-2 text-right text-xs text-[var(--muted)]">{point.detail}</p>
      ) : null}
      {band ? (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs">
          <span className="text-[var(--muted)]">Confidence</span>
          <ConfidenceBar value={point.confidence ?? null} />
        </div>
      ) : null}
      {point.delta !== undefined ? (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs">
          <span className="text-[var(--muted)]">Trend</span>
          <Delta value={point.delta} />
        </div>
      ) : null}

      {point.shape ? (
        <dl className="mt-3 space-y-1 border-t border-[var(--rule)] pt-3 text-xs">
          <Row label="Highest" entry={point.shape.highest} />
          <Row label="Lowest" entry={point.shape.lowest} />
        </dl>
      ) : null}

      {point.clamped ? (
        <p className="mt-3 border-t border-[var(--rule)] pt-3 text-xs text-[var(--muted)]">
          Clamped at the edge of the frame, so the real position is further out.
        </p>
      ) : null}
      {point.shape ? (
        <p className="mt-3 border-t border-[var(--rule)] pt-3 text-xs text-[var(--muted)]">
          {point.shape.scored} of {point.shape.total} capabilities scored.
          {point.href ? ' Click the flag for the full profile.' : ''}
        </p>
      ) : null}
      {point.radar ? (
        <div className="mt-3 border-t border-[var(--rule)] pt-3">
          <Radar
            labels="icons"
            interactive={false}
            series={[
              {
                label: point.label,
                iso3: point.iso3,
                values: point.radar.values,
                confidences: point.radar.confidences,
                color: 'var(--primary)',
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  )
}

function Row({
  label,
  entry,
}: {
  label: string
  entry: { label: string; value: number } | null
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="inline-flex items-center gap-2">
        {entry ? (
          <>
            <span>{entry.label}</span>
            <Score value={entry.value} size="sm" />
          </>
        ) : (
          <span className="text-[var(--muted)]">no score</span>
        )}
      </dd>
    </div>
  )
}

export function FlagField({
  points,
  layout,
  reserveStack,
  ariaLabel,
  legend = true,
}: {
  points: FlagFieldPoint[]
  /** Precomputed layout, for a surface that switches between fields. */
  layout?: FlagFieldLayout
  /** Rows of frame to reserve, so a switch never resizes the chart. */
  reserveStack?: number
  ariaLabel?: string
  /** Off where the surface already prints the ring rule beneath it. */
  legend?: boolean
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const field = layout ?? layoutField(points)
  if (field.placed.length === 0) return null

  const stack = Math.max(field.stack, reserveStack ?? 0)
  const half = ((stack - 1) / 2) * ROW
  const top = -(half + R + 10)
  const bottom = half + R + 10 + TICK_ROOM
  const height = bottom - top

  const positions = new Map(field.placed.map((p) => [p.key, p]))
  const active = hovered ? positions.get(hovered) ?? null : null
  const focal = field.placed.find((p) => p.focal) ?? null

  return (
    <div>
      <div className="relative rounded-xl bg-[var(--surface-sunken)] px-2 py-4 sm:px-6">
        <svg
          viewBox={`0 ${top} ${FIELD_WIDTH} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={
            ariaLabel ??
            `${field.placed.length} countries on a 0 to 100 scale. Median ${field.median.toFixed(1)}.`
          }
          onMouseLeave={() => setHovered(null)}
        >
          {/* The middle half of the field, drawn behind everything. */}
          <rect
            x={0}
            y={top + 6}
            width={1}
            height={height - TICK_ROOM - 12}
            fill="currentColor"
            fillOpacity={0.05}
            style={{
              transformBox: 'view-box',
              transformOrigin: '0 0',
              transform: `translateX(${axisX(field.q1)}px) scaleX(${Math.max(
                1,
                axisX(field.q3) - axisX(field.q1),
              )})`,
              transition: MOVE,
            }}
          />
          <line
            x1={PAD}
            y1={0}
            x2={FIELD_WIDTH - PAD}
            y2={0}
            stroke="currentColor"
            strokeOpacity={0.18}
            strokeWidth={0.75}
          />
          <line
            x1={0}
            y1={top + 6}
            x2={0}
            y2={bottom - TICK_ROOM - 6}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={1}
            style={{
              transformBox: 'view-box',
              transformOrigin: '0 0',
              transform: `translateX(${axisX(field.median)}px)`,
              transition: MOVE,
            }}
          />

          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <line
                x1={axisX(t)}
                y1={bottom - TICK_ROOM + 4}
                x2={axisX(t)}
                y2={bottom - TICK_ROOM + 9}
                stroke="currentColor"
                strokeOpacity={0.25}
                strokeWidth={0.75}
              />
              <text
                x={axisX(t)}
                y={bottom - TICK_ROOM + 21}
                textAnchor="middle"
                fontSize={10}
                fill="currentColor"
                fillOpacity={0.55}
              >
                {t}
              </text>
            </g>
          ))}

          {/* One node per country, kept across a change of field so it can
              travel. A country with no value keeps its node and fades, because
              remounting it would cost the animation. */}
          {points.map((point) => {
            const placed = positions.get(point.key)
            const shown = placed !== undefined
            const shared = {
              'aria-label': `${point.label}, ${
                shown ? placed.value.toFixed(1) : 'no score'
              }${point.detail ? `, ${point.detail}` : ''}`,
              'aria-hidden': shown ? undefined : true,
              tabIndex: shown && point.href ? undefined : -1,
              onMouseEnter: () => setHovered(point.key),
              onFocus: () => setHovered(point.key),
              style: {
                opacity: shown ? 1 : 0,
                cursor: shown && point.href ? 'pointer' : 'default',
                transformBox: 'view-box' as const,
                transformOrigin: '0 0',
                pointerEvents: (shown ? 'auto' : 'none') as 'auto' | 'none',
                transform: `translate(${(placed?.x ?? axisX(field.median)).toFixed(2)}px, ${(
                  placed?.y ?? 0
                ).toFixed(2)}px)`,
                transition: `${MOVE}, opacity 250ms ease`,
              },
            }
            const mark = (
              <>
                <circle r={R + 2} fill="transparent" />
                <FlagBubble
                  iso3={point.iso3}
                  r={R}
                  confidence={point.confidence ?? null}
                  focal={point.focal ?? false}
                  active={hovered === point.key}
                />
                {point.clamped ? (
                  <line
                    x1={0}
                    y1={-R - 3}
                    x2={0}
                    y2={-R - 7}
                    stroke="currentColor"
                    strokeOpacity={0.5}
                    strokeWidth={1}
                  />
                ) : null}
              </>
            )
            return point.href ? (
              <Link key={point.key} href={point.href} {...shared}>
                {mark}
              </Link>
            ) : (
              <g key={point.key} role="img" {...shared}>
                {mark}
              </g>
            )
          })}

          {/* The country being read is named on the chart, so a static picture
              still says who it is about. */}
          {focal && hovered !== focal.key ? (
            <text
              x={Math.min(FIELD_WIDTH - PAD, Math.max(PAD, focal.x))}
              y={focal.y - R - 10}
              textAnchor="middle"
              fontSize={11}
              fontWeight={500}
              fill="currentColor"
            >
              {focal.label}
            </text>
          ) : null}
        </svg>

        {active ? <CountryCard point={active} viewTop={top} viewHeight={height} /> : null}
      </div>

      {legend ? <FlagBubbleLegend note="The shaded band is the middle half of the field and the line inside it is the median." /> : null}

      <ul className="sr-only">
        {[...field.placed]
          .sort((a, b) => b.value - a.value)
          .map((p) => (
            <li key={p.key}>{`${p.label}: ${p.value.toFixed(1)}`}</li>
          ))}
      </ul>
    </div>
  )
}
