'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { linksOf } from '@ncb/core'
import type { LaneDotState, LaneField, LaneFieldDot, LaneFieldLink } from '@ncb/core'
import { Icon, type IconName } from '@/components/Icon'
import type { LaneArrangement } from '@/lib/links'

/**
 * Every indicator in the lane of the capability it measures.
 *
 * A lane is a capability and a dot is an indicator. The mark says whether the
 * row has data: a filled dot does, a dashed ring asks for a dataset that does
 * not exist, and a thin ring was rejected. A line joins two dots whose series
 * are close enough to be one measurement. None of this is a score, which is
 * why no dot is sized, no dot is a flag and nothing here reads the score ramp.
 *
 * The field has two arrangements. `registry` packs each lane in registry
 * order, so the lane's length is the size of the capability's basket. `measure`
 * moves every dot with data to how closely its series tracks income, with the
 * threshold the diagnostics use drawn as a rule, and parks the rest at the
 * left. A dot keeps its node between the two, so the reader watches it travel.
 *
 * The field owns its readout, the way the radar does. It always reads one dot
 * and never none, at a fixed height a hover cannot change, and it opens on the
 * dot with the most links rather than on a summary. See D108.
 */

export type LaneFieldLabels = {
  state: Record<LaneDotState, string>
  /** What the measure axis is. */
  measure: string
  /** Read after the measure when the dot is past the threshold. */
  flagged: string
  /** What the lane's own tick means. */
  laneMeasure: string
  /** Introduces the list of joined dots. */
  overlaps: string
  /** The heading of the parked zone. */
  parked: string
  /** Read when the field was built without diagnostics. */
  unmeasured: string
  /** Read before the attribution delta. */
  attribution: string
  /** The number of countries behind a correlation. */
  countries: string
}

export const LANE_FIELD_LABELS_EN: LaneFieldLabels = {
  state: { scored: 'has data', gap: 'no dataset', retired: 'retired' },
  measure: 'Correlation with income',
  flagged: 'past the wealth threshold',
  laneMeasure: "the capability's own correlation",
  overlaps: 'Overlaps with',
  parked: 'no data',
  unmeasured: 'No diagnostics are loaded, so nothing here is measured.',
  attribution: 'Dropping it moves the capability by',
  countries: 'countries',
}

const LANE_H = 48
const AXIS_H = 28
const PAD_L = 16
const PAD_R = 20
const DOT_R = 5
const HIT_R = 12
/** Spacing between packed dots, and between the three state groups. */
const STEP = 18
const GROUP_GAP = 10
/** The parked zone in the measure arrangement. */
const PARK_W = 96
const PARK_STEP = 14
const AXIS_X0 = PARK_W + 28
const DEFAULT_WIDTH = 760
const MOVE = 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)'
const FADE = 'opacity 400ms ease'

type Placed = { x: number; y: number }

const STATE_ORDER: Record<LaneDotState, number> = { scored: 0, gap: 1, retired: 2 }

function laneTop(index: number): number {
  return index * LANE_H
}

/**
 * Where every dot sits, for one arrangement at one width.
 *
 * Packed dots never need to wrap at any width the viewer serves, because the
 * largest lane holds eight. Measured dots can land on the same value, so a dot
 * that would touch one already placed steps above or below it.
 */
function layout(
  field: LaneField,
  arrangement: LaneArrangement,
  width: number,
): { dots: Map<string, Placed>; ticks: Map<string, number>; span: number } {
  const dots = new Map<string, Placed>()
  const ticks = new Map<string, number>()
  const span = Math.max(80, width - PAD_R - AXIS_X0)
  const axisX = (measure: number) => AXIS_X0 + measure * span

  field.lanes.forEach((lane, laneIndex) => {
    const centre = laneTop(laneIndex) + LANE_H / 2
    const own = field.dots
      .filter((dot) => dot.laneId === lane.id)
      .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state])

    if (arrangement === 'registry') {
      const available = width - PAD_L - PAD_R - 2 * GROUP_GAP
      const step = Math.min(STEP, available / Math.max(1, own.length))
      own.forEach((dot, i) => {
        dots.set(dot.id, {
          x: PAD_L + i * step + STATE_ORDER[dot.state] * GROUP_GAP,
          y: centre,
        })
      })
      return
    }

    if (lane.measure !== null) ticks.set(lane.id, axisX(lane.measure))

    const parked = own.filter((dot) => dot.measure === null)
    const perRow = Math.max(1, Math.floor((PARK_W - PAD_L) / PARK_STEP))
    parked.forEach((dot, i) => {
      const row = Math.floor(i / perRow)
      const rows = Math.ceil(parked.length / perRow)
      const yOffset = rows > 1 ? (row - (rows - 1) / 2) * 16 : 0
      dots.set(dot.id, { x: PAD_L + (i % perRow) * PARK_STEP, y: centre + yOffset })
    })

    const measured = own
      .filter((dot): dot is LaneFieldDot & { measure: number } => dot.measure !== null)
      .sort((a, b) => a.measure - b.measure)
    const taken: Placed[] = []
    for (const dot of measured) {
      const x = axisX(dot.measure)
      const offset =
        [0, -11, 11, -22, 22].find((dy) =>
          taken.every((p) => Math.abs(p.x - x) > DOT_R * 2 + 2 || p.y !== centre + dy),
        ) ?? 0
      const placed = { x, y: centre + offset }
      taken.push(placed)
      dots.set(dot.id, placed)
    }
  })

  return { dots, ticks, span }
}

/**
 * The line between two dots.
 *
 * Two dots in one lane join over the top, so the arc reads as a bracket. Two
 * dots in different lanes join with a vertical S, which leaves the lanes
 * between them readable underneath.
 */
function linkPath(a: Placed, b: Placed): string {
  if (a.y === b.y) {
    const lift = Math.min(28, Math.abs(a.x - b.x) / 3 + 10)
    return `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${a.y - lift} ${b.x} ${b.y}`
  }
  const mid = (a.y + b.y) / 2
  return `M ${a.x} ${a.y} C ${a.x} ${mid} ${b.x} ${mid} ${b.x} ${b.y}`
}

function linkWidth(link: LaneFieldLink, threshold: number): number {
  const above = Math.max(0, Math.min(1, (link.strength - threshold) / Math.max(0.01, 1 - threshold)))
  return 1 + above * 1.5
}

function Mark({ state, active }: { state: LaneDotState; active: boolean }) {
  const r = state === 'retired' ? DOT_R - 1 : DOT_R
  if (active) {
    return (
      <circle r={r} fill="var(--primary)" stroke="var(--foreground)" strokeWidth={1.25} />
    )
  }
  if (state === 'scored') return <circle r={r} fill="currentColor" fillOpacity={0.85} />
  if (state === 'gap') {
    return (
      <circle
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="2.2 2"
      />
    )
  }
  return <circle r={r} fill="none" stroke="var(--muted)" strokeWidth={1.25} />
}

/** One legend sample, drawn with the same mark the field draws. */
function Sample({ children }: { children: React.ReactNode }) {
  return (
    <svg width={16} height={16} viewBox="-8 -8 16 16" aria-hidden="true" className="shrink-0">
      {children}
    </svg>
  )
}

export function LaneFieldLegend({
  labels = LANE_FIELD_LABELS_EN,
  arrangement,
}: {
  labels?: LaneFieldLabels
  arrangement: LaneArrangement
}) {
  const items: Array<{ key: string; sample: React.ReactNode; label: string }> = [
    { key: 'scored', sample: <Mark state="scored" active={false} />, label: labels.state.scored },
    { key: 'gap', sample: <Mark state="gap" active={false} />, label: labels.state.gap },
    { key: 'retired', sample: <Mark state="retired" active={false} />, label: labels.state.retired },
    {
      key: 'link',
      sample: <path d="M -7 4 Q 0 -8 7 4" fill="none" stroke="currentColor" strokeWidth={1.5} />,
      label: labels.overlaps.toLowerCase(),
    },
  ]
  if (arrangement === 'measure') {
    items.push({
      key: 'tick',
      sample: <rect x={-0.75} y={-7} width={1.5} height={14} fill="currentColor" fillOpacity={0.4} />,
      label: labels.laneMeasure,
    })
  }
  return (
    <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[var(--muted)]">
      {items.map((item) => (
        <li key={item.key} className="inline-flex items-center gap-2 text-[var(--foreground)]">
          <Sample>{item.sample}</Sample>
          <span className="text-[var(--muted)]">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}

export type LaneFieldProps = {
  field: LaneField
  arrangement: LaneArrangement
  labels?: LaneFieldLabels
  /** A mark for each lane, drawn beside its name and never instead of it. */
  laneIcon?: (laneId: LaneFieldDot['laneId']) => IconName
  /** Where a lane's name goes. */
  laneHref?: (laneId: LaneFieldDot['laneId']) => string
  /** Where a dot's name goes. */
  dotHref?: (dot: LaneFieldDot) => string
  /** Page-specific rows under the readout: a class badge, a publisher, a link out. */
  renderDetail?: (dot: LaneFieldDot) => React.ReactNode
}

export function LaneField({
  field,
  arrangement,
  labels = LANE_FIELD_LABELS_EN,
  laneIcon,
  laneHref,
  dotHref,
  renderDetail,
}: LaneFieldProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(DEFAULT_WIDTH)

  /* The field lays out in pixels rather than through a scaled viewBox, so a
   * dot is the same size on a phone as on a desk and the lane names beside it
   * stay in DOM text. The width is the only thing measured. */
  useEffect(() => {
    const el = frame.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width
      if (next) setWidth((current) => (Math.abs(next - current) > 1 ? next : current))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const byId = useMemo(() => new Map(field.dots.map((dot) => [dot.id, dot])), [field])
  const placed = useMemo(() => layout(field, arrangement, width), [field, arrangement, width])

  /** The dot with the most links opens the readout; a field with no links opens on its first dot with data. */
  const opening = useMemo(() => {
    const degree = new Map<string, number>()
    for (const link of field.links) {
      degree.set(link.a, (degree.get(link.a) ?? 0) + 1)
      degree.set(link.b, (degree.get(link.b) ?? 0) + 1)
    }
    let best: string | null = null
    for (const dot of field.dots) {
      if ((degree.get(dot.id) ?? 0) > (best ? degree.get(best) ?? 0 : 0)) best = dot.id
    }
    return best ?? field.dots.find((dot) => dot.state === 'scored')?.id ?? field.dots[0]?.id ?? null
  }, [field])

  const [pinned, setPinned] = useState<string | null>(opening)
  const [hover, setHover] = useState<string | null>(null)
  /* A focus ring on an SVG group is not drawn by every browser, so the field
   * draws its own when a keyboard lands on a dot. */
  const [focused, setFocused] = useState<string | null>(null)
  const activeId = hover ?? pinned ?? opening
  const active = activeId ? byId.get(activeId) ?? null : null
  const activeLinks = active ? linksOf(field, active.id) : []
  const joined = new Set(activeLinks.flatMap((link) => [link.a, link.b]))

  const height = field.lanes.length * LANE_H + AXIS_H
  const lanesBottom = field.lanes.length * LANE_H
  const measure = arrangement === 'measure'
  const thresholdX = AXIS_X0 + field.thresholds.measure * placed.span

  /** Keyboard travel: along the lane by position, across lanes by nearest position. */
  const move = (from: LaneFieldDot, dx: number, dy: number) => {
    const here = placed.dots.get(from.id)
    if (!here) return
    if (dx !== 0) {
      const lane = field.dots
        .filter((dot) => dot.laneId === from.laneId)
        .map((dot) => ({ dot, x: placed.dots.get(dot.id)?.x ?? 0 }))
        .sort((a, b) => a.x - b.x)
      const i = lane.findIndex((entry) => entry.dot.id === from.id)
      const next = lane[i + dx]
      if (next) setPinned(next.dot.id)
      return
    }
    const laneIndex = field.lanes.findIndex((lane) => lane.id === from.laneId)
    const target = field.lanes[laneIndex + dy]
    if (!target) return
    const candidates = field.dots
      .filter((dot) => dot.laneId === target.id)
      .map((dot) => ({ dot, x: placed.dots.get(dot.id)?.x ?? 0 }))
      .sort((a, b) => Math.abs(a.x - here.x) - Math.abs(b.x - here.x))
    if (candidates[0]) setPinned(candidates[0].dot.id)
  }

  const counts = field.lanes.reduce(
    (acc, lane) => ({
      scored: acc.scored + lane.counts.scored,
      gap: acc.gap + lane.counts.gap,
      retired: acc.retired + lane.counts.retired,
    }),
    { scored: 0, gap: 0, retired: 0 },
  )
  const described = `${field.dots.length} indicators in ${field.lanes.length} lanes. ${counts.scored} ${labels.state.scored}, ${counts.gap} ${labels.state.gap}, ${counts.retired} ${labels.state.retired}. ${field.links.length} pairs overlap.`

  return (
    <div className="text-[var(--foreground)]">
      <LaneFieldLegend labels={labels} arrangement={arrangement} />
      <div className="grid grid-cols-[auto_1fr] rounded-xl border border-[var(--rule)] bg-[var(--surface)]">
        <ol className="border-r border-[var(--rule-soft)]" aria-hidden="true">
          {field.lanes.map((lane) => {
            const name = (
              <span className="hidden text-xs font-medium sm:inline">{lane.label}</span>
            )
            return (
              <li
                key={lane.id}
                className="flex items-center gap-2 px-3 sm:pr-4"
                style={{ height: LANE_H }}
              >
                {laneIcon ? (
                  <Icon name={laneIcon(lane.id)} size={14} className="text-[var(--muted)]" />
                ) : null}
                {laneHref ? (
                  <Link href={laneHref(lane.id)} className="hover:underline">
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </li>
            )
          })}
          <li style={{ height: AXIS_H }} />
        </ol>

        <div ref={frame} className="min-w-0">
          <svg
            width="100%"
            height={height}
            role="img"
            aria-label={described}
            className="block overflow-visible"
            onPointerLeave={() => setHover(null)}
          >
            {/* Lane rules, drawn behind everything. */}
            {field.lanes.map((lane, i) =>
              i > 0 ? (
                <line
                  key={lane.id}
                  x1={0}
                  x2={width}
                  y1={laneTop(i)}
                  y2={laneTop(i)}
                  stroke="var(--rule-soft)"
                  strokeWidth={1}
                />
              ) : null,
            )}

            {/* The measure axis: the parked zone, the threshold and the ticks. */}
            <g style={{ opacity: measure ? 1 : 0, transition: FADE }} aria-hidden="true">
              <rect
                x={6}
                y={4}
                width={PARK_W - 6}
                height={lanesBottom - 8}
                rx={6}
                fill="var(--surface-sunken)"
              />
              <text
                x={PAD_L}
                y={lanesBottom + 18}
                fontSize={11}
                fontWeight={500}
                fill="var(--muted)"
              >
                {labels.parked}
              </text>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <g key={t}>
                  <line
                    x1={AXIS_X0 + t * placed.span}
                    x2={AXIS_X0 + t * placed.span}
                    y1={lanesBottom}
                    y2={lanesBottom + 5}
                    stroke="var(--rule)"
                    strokeWidth={1}
                  />
                  <text
                    x={AXIS_X0 + t * placed.span}
                    y={lanesBottom + 18}
                    fontSize={11}
                    fontWeight={500}
                    textAnchor={t === 0 ? 'start' : t === 1 ? 'end' : 'middle'}
                    fill="var(--muted)"
                  >
                    {t.toFixed(2)}
                  </text>
                </g>
              ))}
              <line
                x1={thresholdX}
                x2={thresholdX}
                y1={2}
                y2={lanesBottom}
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {field.lanes.map((lane, i) => {
                const x = placed.ticks.get(lane.id)
                return x === undefined ? null : (
                  <rect
                    key={lane.id}
                    x={x - 0.75}
                    y={laneTop(i) + 8}
                    width={1.5}
                    height={LANE_H - 16}
                    fill="currentColor"
                    fillOpacity={0.4}
                  />
                )
              })}
            </g>

            {/* Links, under the dots. The active dot's lines come forward and the rest step back. */}
            <g fill="none" aria-hidden="true">
              {field.links.map((link) => {
                const a = placed.dots.get(link.a)
                const b = placed.dots.get(link.b)
                if (!a || !b) return null
                const near = active !== null && (link.a === active.id || link.b === active.id)
                const dim = activeLinks.length > 0 && !near
                return (
                  <path
                    key={`${link.a}-${link.b}`}
                    d={linkPath(a, b)}
                    stroke="currentColor"
                    strokeWidth={linkWidth(link, field.thresholds.link)}
                    strokeOpacity={near ? 0.9 : dim ? 0.12 : 0.3}
                    style={{ transition: 'stroke-opacity 250ms ease' }}
                  />
                )
              })}
            </g>

            {field.dots.map((dot) => {
              const p = placed.dots.get(dot.id)
              if (!p) return null
              const on = active?.id === dot.id
              const lane = field.lanes.find((l) => l.id === dot.laneId)
              const state = labels.state[dot.state]
              const measureText =
                measure && dot.measure !== null
                  ? ` ${labels.measure} ${dot.measure.toFixed(2)}.`
                  : ''
              return (
                <g
                  key={dot.id}
                  role="button"
                  tabIndex={pinned === dot.id ? 0 : -1}
                  aria-label={`${dot.label}, ${lane?.label ?? ''}, ${state}.${measureText}`}
                  aria-pressed={on}
                  className="cursor-pointer outline-none motion-reduce:transition-none"
                  style={{
                    transform: `translate(${p.x}px, ${p.y}px)`,
                    transformBox: 'view-box',
                    transition: MOVE,
                  }}
                  onPointerEnter={() => setHover(dot.id)}
                  onPointerDown={() => setPinned(dot.id)}
                  onFocus={() => {
                    setPinned(dot.id)
                    setFocused(dot.id)
                  }}
                  onBlur={() => setFocused((f) => (f === dot.id ? null : f))}
                  onKeyDown={(e) => {
                    const keys: Record<string, [number, number]> = {
                      ArrowLeft: [-1, 0],
                      ArrowRight: [1, 0],
                      ArrowUp: [0, -1],
                      ArrowDown: [0, 1],
                    }
                    const step = keys[e.key]
                    if (!step) return
                    e.preventDefault()
                    move(dot, step[0], step[1])
                  }}
                >
                  <circle r={HIT_R} fill="transparent" />
                  {joined.has(dot.id) && !on ? (
                    <circle r={DOT_R + 3} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
                  ) : null}
                  <Mark state={dot.state} active={on} />
                  {on || focused === dot.id ? (
                    <circle
                      r={DOT_R + 4}
                      fill="none"
                      stroke="var(--foreground)"
                      strokeOpacity={focused === dot.id ? 0.9 : 0.25}
                      strokeWidth={focused === dot.id ? 1.5 : 1}
                    />
                  ) : null}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* The readout: always one dot, fixed height, so pointing changes words and not layout. */}
      <div
        className="mt-4 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4"
        style={{ minHeight: 148 }}
        aria-live="polite"
      >
        {active ? (
          <Readout
            dot={active}
            laneLabel={field.lanes.find((l) => l.id === active.laneId)?.label ?? ''}
            links={activeLinks}
            byId={byId}
            field={field}
            labels={labels}
            href={dotHref?.(active)}
            onRead={setPinned}
            detail={renderDetail?.(active)}
          />
        ) : null}
      </div>
    </div>
  )
}

/** The words under the field: one dot, its lane, its measure and what it overlaps. */
function Readout({
  dot,
  laneLabel,
  links,
  byId,
  field,
  labels,
  href,
  onRead,
  detail,
}: {
  dot: LaneFieldDot
  laneLabel: string
  links: LaneFieldLink[]
  byId: Map<string, LaneFieldDot>
  field: LaneField
  labels: LaneFieldLabels
  href?: string | undefined
  onRead: (id: string) => void
  detail?: React.ReactNode | undefined
}) {
  const name = href ? (
    <Link href={href} className="hover:underline">
      {dot.label}
    </Link>
  ) : (
    dot.label
  )
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-xl font-medium tracking-tight">{name}</span>
        <span className="text-xs font-medium text-[var(--muted)]">
          {laneLabel} · {labels.state[dot.state]}
        </span>
      </div>
      <p className="mt-1 max-w-3xl text-lg leading-relaxed">{dot.definition}</p>
      {field.measured && dot.measure !== null ? (
        <p className="mt-2 text-xs font-medium text-[var(--muted)]">
          {labels.measure}{' '}
          <span className="text-[var(--foreground)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {dot.measure.toFixed(2)}
          </span>
          {dot.flagged ? `, ${labels.flagged}` : ''}
          {dot.attribution !== null ? (
            <>
              {' · '}
              {labels.attribution}{' '}
              <span className="text-[var(--foreground)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {dot.attribution > 0 ? '+' : ''}
                {dot.attribution.toFixed(3)}
              </span>
            </>
          ) : null}
        </p>
      ) : !field.measured ? (
        <p className="mt-2 text-xs font-medium text-[var(--muted)]">{labels.unmeasured}</p>
      ) : null}
      {links.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
          {links.map((link) => {
            const otherId = link.a === dot.id ? link.b : link.a
            const other = byId.get(otherId)
            if (!other) return null
            return (
              <li key={otherId} className="inline-flex items-baseline gap-1.5">
                <span className="text-[var(--muted)]">{labels.overlaps}</span>
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => onRead(otherId)}
                >
                  {other.label}
                </button>
                <span className="text-[var(--muted)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  r {link.strength.toFixed(2)}, {link.n} {labels.countries}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
      {detail ? <div className="mt-3">{detail}</div> : null}
    </div>
  )
}
