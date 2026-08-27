import { CONFIDENCE_BANDS, DIMENSIONS, DIMENSION_LABELS, isThinEvidence } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, iconMarkup } from '@/components/Icon'

export type RadarSeries = {
  label: string
  values: Array<number | null>
  /**
   * Confidence per axis, in dimension order. Where it is supplied, an axis with
   * thin evidence is drawn dashed and its vertex is hollow, so the shape never
   * looks better evidenced than it is.
   */
  confidences?: Array<number | null>
  color: string
  /** Comparators draw as an outline so the focal country keeps the filled shape. */
  outline?: boolean
}

const SIZE = 260
const CENTER = SIZE / 2

/**
 * How much room the labels need, and therefore how big the shape can be.
 *
 * The plotted polygon competes with whatever names its axes. Words need a wide
 * margin and reduce the chart to a small figure in a large box. Marks need very
 * little, so the icon-labelled radars draw their shape half again as large in
 * the same space. The numbers below are the outcome of that trade, not defaults.
 */
const GEOMETRY = {
  full: { radius: SIZE / 2 - 34, ring: 112, padX: 30, padRight: 58 },
  icons: { radius: SIZE / 2 - 24, ring: 114, padX: 4, padRight: 8 },
  none: { radius: SIZE / 2 - 8, ring: 100, padX: 2, padRight: 4 },
} as const

function point(index: number, value: number, radius: number): [number, number] {
  const angle = (index / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2
  const r = (value / 100) * radius
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

/** How many pieces each edge is cut into for the evidence gradient. */
const SEGMENTS = 14
const DASH = 2.2
/**
 * Solid at or above the usable band's floor, read from the bands so the chart
 * cannot drift from the thresholds the tables use. Fully open at OPEN_AT, a
 * display tuning deliberately below the thin band's floor, so the most broken
 * dashing is reached only deep inside very thin evidence. See D32.
 */
const SOLID_AT = CONFIDENCE_BANDS.find((b) => b.id === 'usable')?.min ?? 0.45
const OPEN_AT = 0.15

/**
 * The gap between dashes for a given confidence.
 *
 * Zero is a solid line. It grows as the evidence thins, so an edge running from
 * a well-evidenced dimension to a poorly evidenced one comes apart gradually
 * instead of switching state at some threshold nobody can see.
 */
function dashGap(confidence: number | null): number {
  if (confidence === null) return 0
  if (confidence >= SOLID_AT) return 0
  const t = Math.min(1, Math.max(0, (SOLID_AT - confidence) / (SOLID_AT - OPEN_AT)))
  return 0.6 + t * 2.6
}

function thinAt(series: RadarSeries, i: number): boolean {
  const c = series.confidences?.[i]
  return c === null || c === undefined ? false : isThinEvidence(c)
}

/**
 * Dependency-free radar. Nine axes, one per dimension, in the fixed dimension
 * order so two charts can be read against each other.
 *
 * Evidence is drawn, never implied. A dimension whose confidence falls in the
 * thin or very thin band gets a dashed edge and a hollow vertex, and the dash
 * gap widens as confidence falls. Confidence still never touches the score
 * itself: the vertex sits at the same radius either way, and only the line
 * style changes.
 */
/**
 * How the nine axes are named.
 *
 * `full` prints the icon and the words, for a radar with room. `icons` prints
 * the mark alone, for the small cards where the words render at seven pixels
 * and are unreadable anyway. Either way the accessible description below carries
 * every dimension name and score, so the words are never actually gone.
 *
 * Thin evidence is drawn and never written: a dashed edge and a hollow point.
 * The asterisk that used to follow a label was a third telling of the same
 * thing and it made every label look footnoted.
 */
export type RadarLabels = 'full' | 'icons' | 'none'

/**
 * One dimension mark, drawn inside the radar's own SVG.
 *
 * Every mark is drawn at the same strength. Thin evidence is already carried by
 * the dashed edge and the hollow vertex, and fading the icon as well made the
 * whole ring look washed out on a country where most dimensions are thinly
 * evidenced.
 */
function AxisIcon({ d, x, y, size }: { d: Dimension; x: number; y: number; size: number }) {
  const scale = size / 24
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.9}
      /* Lucide's own stroke width. The transform scales it down with the shape,
       * which is the point: compensating for the scale here made a 10-unit icon
       * carry a 4-unit stroke and turned every mark into a blob. */
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: iconMarkup(DIMENSION_ICON[d]) }}
    />
  )
}

export function Radar({
  series,
  labels = 'full',
  onSelectDimension,
}: {
  series: RadarSeries[]
  labels?: RadarLabels
  /** When given, each axis label becomes a control that opens that dimension. */
  onSelectDimension?: (dimension: Dimension) => void
}) {
  const g = GEOMETRY[labels]
  const at = (i: number, value: number) => point(i, value, g.radius)
  const rings = [25, 50, 75, 100]
  const described = series
    .map(
      (s) =>
        `${s.label}: ` +
        DIMENSIONS.map((d, i) => `${DIMENSION_LABELS[d]} ${s.values[i] ?? 'no data'}`).join(', '),
    )
    .join('. ')

  return (
    <svg
      viewBox={`${-g.padX} 0 ${SIZE + g.padX + g.padRight} ${SIZE}`}
      className="h-auto w-full"
      role="img"
    >
      <title>{series.map((s) => s.label).join(' compared with ')}</title>
      <desc>{described}</desc>
      {rings.map((r) => (
        <polygon
          key={r}
          points={DIMENSIONS.map((_, i) => at(i, r).join(',')).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeOpacity={r === 100 ? 0.28 : 0.12}
          strokeWidth={0.75}
        />
      ))}

      {/* What the rings are worth. Without them a small shape reads as a weak
          country rather than as a low position on a 0 to 100 scale. They run
          downward from the centre, where nine axes leave a gap and nothing
          collides. */}
      {labels !== 'none' &&
        rings.map((r) => (
          <text
            key={`ring-${r}`}
            x={CENTER + 3}
            y={CENTER + (r / 100) * g.radius + 2}
            fontSize={6}
            fill="currentColor"
            fillOpacity={0.4}
          >
            {r}
          </text>
        ))}
      {DIMENSIONS.map((_, i) => {
        const [x, y] = at(i, 100)
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={0.75}
          />
        )
      })}

      {series.map((s) => {
        /* An axis with no score is left empty rather than plotted at zero.
         * Collapsing it to the centre drew a country as catastrophically weak
         * on a dimension nobody had measured, which is the exact claim the
         * coverage floor exists to stop the model making. The shape closes
         * across the gap, the spoke stays bare, and the accessible description
         * says "no data" for that axis. See D45. */
        const measured = DIMENSIONS.map((_, i) => i).filter(
          (i) => s.values[i] !== null && s.values[i] !== undefined,
        )
        const pts = measured.map((i) => at(i, s.values[i] as number))
        if (pts.length < 2) return null
        return (
          <g key={s.label}>
            <polygon
              points={pts.map((p) => p.join(',')).join(' ')}
              fill={s.color}
              fillOpacity={s.outline ? 0 : 0.32}
              stroke="none"
            />
            {pts.flatMap((from, k) => {
              const kNext = (k + 1) % pts.length
              const i = measured[k] as number
              const j = measured[kNext] as number
              const to = pts[kNext] as [number, number]
              const a = s.confidences?.[i]
              const b = s.confidences?.[j]
              /* An edge runs between two dimensions that are evidenced
               * differently, so its own evidence changes along its length. Each
               * edge is cut into segments and each segment carries the gap its
               * own position deserves: solid where the evidence is usable,
               * opening into dots as it approaches the thin end. */
              return Array.from({ length: SEGMENTS }, (_, seg) => {
                const t0 = seg / SEGMENTS
                const t1 = (seg + 1) / SEGMENTS
                const conf =
                  a === null || a === undefined || b === null || b === undefined
                    ? null
                    : a + (b - a) * ((t0 + t1) / 2)
                const gap = dashGap(conf)
                return (
                  <line
                    key={`${i}-${seg}`}
                    x1={from[0] + (to[0] - from[0]) * t0}
                    y1={from[1] + (to[1] - from[1]) * t0}
                    x2={from[0] + (to[0] - from[0]) * t1}
                    y2={from[1] + (to[1] - from[1]) * t1}
                    stroke={s.color}
                    strokeWidth={s.outline ? 1.3 : 1.9}
                    strokeLinecap={gap > 0 ? 'round' : 'butt'}
                    strokeDasharray={gap > 0 ? `${DASH} ${gap}` : undefined}
                  />
                )
              })
            })}
            {pts.map((p, k) => {
              const i = measured[k] as number
              const thin = thinAt(s, i)
              return (
                <circle
                  key={i}
                  cx={p[0]}
                  cy={p[1]}
                  r={thin ? 2.2 : 2}
                  fill={thin ? 'var(--surface)' : s.color}
                  stroke={thin ? s.color : 'none'}
                  strokeWidth={thin ? 1.1 : 0}
                />
              )
            })}
          </g>
        )
      })}

      {labels === 'icons' &&
        DIMENSIONS.map((d, i) => {
          const [x, y] = at(i, g.ring)
          return <AxisIcon key={d} d={d} x={x} y={y} size={13} />
        })}

      {labels === 'full' &&
        DIMENSIONS.map((d, i) => {
          const [x, y] = at(i, g.ring)
          const anchor = x < CENTER - 4 ? 'end' : x > CENTER + 4 ? 'start' : 'middle'
          /* On the axes that point straight up or down there is no side to put
           * the mark on, so it goes above the words instead of on top of them. */
          const stacked = anchor === 'middle'
          const side = anchor === 'end' ? -1 : 1
          const above = y < CENTER
          const interactive = Boolean(onSelectDimension)
          return (
            <g
              key={d}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={interactive ? `See every country on ${DIMENSION_LABELS[d]}` : undefined}
              style={interactive ? { cursor: 'pointer' } : undefined}
              onClick={interactive ? () => onSelectDimension?.(d) : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') onSelectDimension?.(d)
                    }
                  : undefined
              }
            >
              {interactive ? (
                <title>{`See every country on ${DIMENSION_LABELS[d]}`}</title>
              ) : null}
              <AxisIcon
                d={d}
                x={stacked ? x : x + side * 9}
                y={stacked ? y + (above ? -8 : 9) : y}
                size={10}
              />
              <text
                x={stacked ? x : x + side * 17}
                y={stacked ? y + (above ? 3 : -3) : y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={7.5}
                fill="currentColor"
                fillOpacity={0.75}
                style={onSelectDimension ? { textDecoration: 'underline dotted', textUnderlineOffset: '2px' } : undefined}
              >
                {shortLabel(d)}
              </text>
            </g>
          )
        })}
    </svg>
  )
}

function shortLabel(d: Dimension): string {
  return d === 'shared_purpose' ? 'Shared purpose' : DIMENSION_LABELS[d]
}
