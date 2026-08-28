'use client'

import { useState } from 'react'

export type DistributionPoint = {
  key: string
  label: string
  /** Position on the 0 to 100 axis. */
  value: number
  /** Shown in the hover text, in the indicator's own units where there is one. */
  detail?: string
  /** The country being read. Drawn filled and larger, with its name printed. */
  focal?: boolean
  /** Thin evidence, drawn hollow. Same convention as the radar. */
  hollow?: boolean
  /** Clamped at an end of the scale, so its real position is unknown. */
  clamped?: boolean
}

const WIDTH = 720
const PAD = 26
const AXIS_Y = 96
const ROW = 11
/** How close two dots can sit on the axis before they share one column. */
const COL_STEP = 14
const CARD_W = 168
const CARD_GAP = 10
/** Room for the tallest tooltip above or below a dot. */
const MAX_CARD_H = 14 + 4 * 14

type PlacedPoint = DistributionPoint & { x: number; y: number }

function tooltipLines(p: DistributionPoint) {
  const label = p.label.length > 22 ? `${p.label.slice(0, 21)}…` : p.label
  const lines: Array<{ text: string; muted?: boolean; bold?: boolean }> = [
    { text: label, bold: true },
    { text: `Score ${p.value.toFixed(1)}` },
  ]
  if (p.detail) {
    const detail = p.detail.length > 26 ? `${p.detail.slice(0, 25)}…` : p.detail
    lines.push({ text: detail, muted: true })
  }
  if (p.clamped) lines.push({ text: 'Clamped at the frame edge', muted: true })
  return lines
}

function tooltipLayout(p: PlacedPoint, viewTop: number) {
  const lines = tooltipLines(p)
  const cardH = 14 + lines.length * 14
  const cx = Math.min(WIDTH - PAD - 4, Math.max(PAD + 4, p.x))
  let cardX = Math.min(WIDTH - PAD - CARD_W, Math.max(PAD, cx - CARD_W / 2))
  let cardY = p.y - CARD_GAP - cardH
  let below = false
  if (cardY < viewTop + 4) {
    cardY = p.y + CARD_GAP + 4
    below = true
  }
  return { cardX, cardY, cardH, cx, below }
}

/**
 * Where every country sits on one 0 to 100 axis.
 *
 * A ranked list answers "who is above me". This answers "what does the field
 * look like", which is a different question: three countries tied at the top
 * and a long tail below reads completely differently from an even spread, and a
 * rank cannot show either. Nearby scores snap to the same column and stack
 * upward, so a cluster reads as a column and the shape of the distribution is
 * the shape of the chart. Hover still prints each country's exact score.
 *
 * The box is the middle half of the field and the line inside it is the median.
 * Nothing here is a new number: it is the same values the list below prints.
 */
export function Distribution({ points }: { points: DistributionPoint[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  if (points.length === 0) return null

  const x = (v: number) => PAD + (Math.min(100, Math.max(0, v)) / 100) * (WIDTH - PAD * 2)
  const sorted = [...points].sort((a, b) => a.value - b.value)
  const at = (q: number) => {
    const i = (sorted.length - 1) * q
    const lo = sorted[Math.floor(i)] as DistributionPoint
    const hi = sorted[Math.ceil(i)] as DistributionPoint
    return lo.value + (hi.value - lo.value) * (i - Math.floor(i))
  }
  const q1 = at(0.25)
  const median = at(0.5)
  const q3 = at(0.75)

  /* Snap nearby scores to one x, then stack. Exact values stay in hover text. */
  const columnX = (v: number) => {
    const px = x(v)
    return Math.round((px - PAD) / COL_STEP) * COL_STEP + PAD
  }
  const columns = new Map<number, DistributionPoint[]>()
  for (const p of sorted) {
    const bx = columnX(p.value)
    const group = columns.get(bx) ?? []
    group.push(p)
    columns.set(bx, group)
  }
  const placed = [...columns.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([bx, group]) =>
      group.map((p, i) => ({
        ...p,
        x: bx,
        y: AXIS_Y - 10 - i * ROW,
      })),
    )

  const dotMinY = Math.min(...placed.map((p) => p.y))
  const dotMaxY = Math.max(...placed.map((p) => p.y))
  const viewTop = dotMinY - MAX_CARD_H - CARD_GAP - 12
  const viewBottom = Math.max(AXIS_Y + 26, dotMaxY + MAX_CARD_H + CARD_GAP + 12)
  const height = viewBottom - viewTop
  const focal = placed.find((p) => p.focal)
  const active = placed.find((p) => p.key === hovered) ?? null

  return (
    <svg
      viewBox={`0 ${viewTop} ${WIDTH} ${height}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label={`Distribution of ${points.length} countries on a 0 to 100 scale. Median ${median.toFixed(1)}.`}
      onMouseLeave={() => setHovered(null)}
    >
      <rect
        x={x(q1)}
        y={AXIS_Y - 18}
        width={Math.max(1, x(q3) - x(q1))}
        height={16}
        fill="currentColor"
        fillOpacity={0.06}
      />
      <line
        x1={x(median)}
        y1={AXIS_Y - 20}
        x2={x(median)}
        y2={AXIS_Y}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={1}
      />

      <line
        x1={PAD}
        y1={AXIS_Y}
        x2={WIDTH - PAD}
        y2={AXIS_Y}
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={0.75}
      />
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line
            x1={x(t)}
            y1={AXIS_Y}
            x2={x(t)}
            y2={AXIS_Y + 4}
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={0.75}
          />
          <text
            x={x(t)}
            y={AXIS_Y + 15}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
            fillOpacity={0.5}
          >
            {t}
          </text>
        </g>
      ))}

      {placed.map((p) => {
        const isActive = hovered === p.key
        const dimmed = hovered !== null && !isActive
        return (
          <g
            key={p.key}
            onMouseEnter={() => setHovered(p.key)}
            style={{ cursor: 'pointer' }}
            opacity={dimmed ? 0.35 : 1}
          >
            {/* A generous invisible target, because a 3.5 unit dot is hard to hit. */}
            <circle cx={p.x} cy={p.y} r={7} fill="transparent" />
            {isActive ? (
              <circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill="none"
                stroke="var(--foreground)"
                strokeOpacity={0.2}
                strokeWidth={1.5}
              />
            ) : null}
            <circle
              cx={p.x}
              cy={p.y}
              r={p.focal || isActive ? 4.5 : 3.5}
              fill={
                p.focal
                  ? 'var(--primary)'
                  : isActive
                    ? 'var(--foreground)'
                    : p.hollow
                      ? 'var(--surface)'
                      : 'var(--muted)'
              }
              stroke={p.focal ? 'var(--primary)' : isActive ? 'var(--foreground)' : 'var(--muted)'}
              strokeWidth={p.hollow ? 1.2 : 0}
            >
              <title>
                {`${p.label}: ${p.value.toFixed(1)}${p.detail ? `, ${p.detail}` : ''}${
                  p.clamped ? ', clamped at the edge of the frame' : ''
                }`}
              </title>
            </circle>
            {p.clamped ? (
              <line
                x1={p.x}
                y1={p.y - 6.5}
                x2={p.x}
                y2={p.y - 9.5}
                stroke="currentColor"
                strokeOpacity={0.5}
                strokeWidth={1}
              />
            ) : null}
          </g>
        )
      })}

      {focal && hovered !== focal.key ? (
        <g>
          <rect
            x={Math.min(WIDTH - PAD - 72, Math.max(PAD, focal.x - 36))}
            y={focal.y - 22}
            width={144}
            height={18}
            rx={4}
            fill="var(--surface)"
            stroke="var(--rule)"
            strokeWidth={0.75}
          />
          <text
            x={Math.min(WIDTH - PAD - 4, Math.max(PAD + 4, focal.x))}
            y={focal.y - 10}
            textAnchor="middle"
            fontSize={10}
            fontWeight={500}
            fill="currentColor"
          >
            {focal.label}
          </text>
        </g>
      ) : null}

      {active ? (() => {
        const tip = tooltipLayout(active, viewTop)
        const lines = tooltipLines(active)
        const stemY1 = tip.below ? tip.cardY : tip.cardY + tip.cardH
        const stemY2 = tip.below ? active.y + 5 : active.y - 5
        return (
          <g key={`hover-${active.key}`} pointerEvents="none">
            <line
              x1={tip.cx}
              y1={stemY1}
              x2={active.x}
              y2={stemY2}
              stroke="var(--rule)"
              strokeWidth={0.75}
            />
            <rect
              x={tip.cardX}
              y={tip.cardY}
              width={CARD_W}
              height={tip.cardH}
              rx={6}
              fill="var(--surface)"
              stroke="var(--rule)"
              strokeWidth={0.75}
            />
            {lines.map((line, i) => (
              <text
                key={i}
                x={tip.cardX + 10}
                y={tip.cardY + 14 + (i + 1) * 14}
                fontSize={line.bold ? 11 : line.muted ? 9 : 10}
                fontWeight={line.bold ? 500 : 400}
                fill={line.muted ? 'var(--muted)' : 'currentColor'}
                style={line.bold ? undefined : { fontVariantNumeric: 'tabular-nums' }}
              >
                {line.text}
              </text>
            ))}
          </g>
        )
      })() : null}
    </svg>
  )
}
