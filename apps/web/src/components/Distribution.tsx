'use client'

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
const MIN_GAP = 12

/**
 * Where every country sits on one 0 to 100 axis.
 *
 * A ranked list answers "who is above me". This answers "what does the field
 * look like", which is a different question: three countries tied at the top
 * and a long tail below reads completely differently from an even spread, and a
 * rank cannot show either. Dots that would overlap stack upward, so a cluster
 * becomes a column and the shape of the distribution is the shape of the chart.
 *
 * The box is the middle half of the field and the line inside it is the median.
 * Nothing here is a new number: it is the same values the list below prints.
 */
export function Distribution({ points }: { points: DistributionPoint[] }) {
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

  /* Stack anything that would collide, so a cluster reads as a column. */
  const rowEnds: number[] = []
  const placed = sorted.map((p) => {
    const px = x(p.value)
    let row = rowEnds.findIndex((end) => px - end >= MIN_GAP)
    if (row === -1) row = rowEnds.length
    rowEnds[row] = px
    return { ...p, x: px, y: AXIS_Y - 10 - row * ROW }
  })

  const height = Math.max(AXIS_Y + 26, AXIS_Y + 26 - Math.min(...placed.map((p) => p.y)) + 20)
  const focal = placed.find((p) => p.focal)

  return (
    <svg
      viewBox={`0 ${AXIS_Y + 26 - height} ${WIDTH} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Distribution of ${points.length} countries on a 0 to 100 scale. Median ${median.toFixed(1)}.`}
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

      {placed.map((p) => (
        <g key={p.key}>
          <circle
            cx={p.x}
            cy={p.y}
            r={p.focal ? 4.5 : 3.5}
            fill={p.focal ? 'var(--primary)' : p.hollow ? 'var(--surface)' : 'var(--muted)'}
            stroke={p.focal ? 'var(--primary)' : 'var(--muted)'}
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
      ))}

      {focal ? (
        <text
          x={Math.min(WIDTH - PAD, Math.max(PAD, focal.x))}
          y={focal.y - 9}
          textAnchor="middle"
          fontSize={10}
          fontWeight={500}
          fill="currentColor"
        >
          {focal.label}
        </text>
      ) : null}
    </svg>
  )
}
