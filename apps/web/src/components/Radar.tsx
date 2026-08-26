import { DIMENSIONS, DIMENSION_LABELS, isThinEvidence } from '@ncb/core'
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
const RADIUS = SIZE / 2 - 46

function point(index: number, value: number): [number, number] {
  const angle = (index / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2
  const r = (value / 100) * RADIUS
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
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
 * thin or very thin band gets a dashed edge, a hollow vertex and a marked axis
 * label. Confidence still never touches the score itself: the vertex sits at
 * the same radius either way, and only the line style changes.
 */
/**
 * How the nine axes are named.
 *
 * `full` prints the icon and the words, for a radar with room. `icons` prints
 * the mark alone, for the small cards where the words render at seven pixels
 * and are unreadable anyway. Either way the accessible description below carries
 * every dimension name and score, so the words are never actually gone.
 */
export type RadarLabels = 'full' | 'icons' | 'none'

/**
 * One dimension mark, drawn inside the radar's own SVG.
 *
 * Every mark is drawn at the same strength. Thin evidence is already carried by
 * the dashed edge, the hollow vertex and the asterisk on the label, and fading
 * the icon as well made the whole ring look washed out on a country where most
 * dimensions are thinly evidenced.
 */
function AxisIcon({ d, x, y, size }: { d: Dimension; x: number; y: number; size: number }) {
  const scale = size / 24
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.9}
      strokeWidth={1.7 / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: iconMarkup(DIMENSION_ICON[d]) }}
    />
  )
}

export function Radar({
  series,
  labels = 'full',
}: {
  series: RadarSeries[]
  labels?: RadarLabels
}) {
  const rings = [25, 50, 75, 100]
  const marked = DIMENSIONS.map((_, i) => series.some((s) => thinAt(s, i)))
  const described = series
    .map(
      (s) =>
        `${s.label}: ` +
        DIMENSIONS.map((d, i) => `${DIMENSION_LABELS[d]} ${s.values[i] ?? 'no data'}`).join(', '),
    )
    .join('. ')

  return (
    <svg viewBox={`-26 0 ${SIZE + 52} ${SIZE}`} className="h-auto w-full" role="img">
      <title>{series.map((s) => s.label).join(' compared with ')}</title>
      <desc>{described}</desc>
      {rings.map((r) => (
        <polygon
          key={r}
          points={DIMENSIONS.map((_, i) => point(i, r).join(',')).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeOpacity={r === 100 ? 0.28 : 0.12}
          strokeWidth={0.75}
        />
      ))}
      {DIMENSIONS.map((_, i) => {
        const [x, y] = point(i, 100)
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
        const pts = DIMENSIONS.map((_, i) => point(i, s.values[i] ?? 0))
        return (
          <g key={s.label}>
            <polygon
              points={pts.map((p) => p.join(',')).join(' ')}
              fill={s.color}
              fillOpacity={s.outline ? 0 : 0.28}
              stroke="none"
            />
            {pts.map((from, i) => {
              const to = pts[(i + 1) % pts.length] as [number, number]
              /* An edge is only as well evidenced as its weaker end. */
              const dashed = thinAt(s, i) || thinAt(s, (i + 1) % pts.length)
              return (
                <line
                  key={i}
                  x1={from[0]}
                  y1={from[1]}
                  x2={to[0]}
                  y2={to[1]}
                  stroke={s.color}
                  strokeWidth={s.outline ? 1.2 : 1.6}
                  strokeDasharray={dashed ? '3 2.5' : undefined}
                />
              )
            })}
            {pts.map((p, i) => {
              const v = s.values[i]
              if (v === null || v === undefined) return null
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
          const [x, y] = point(i, 124)
          return <AxisIcon key={d} d={d} x={x} y={y} size={12} />
        })}

      {labels === 'full' &&
        DIMENSIONS.map((d, i) => {
          const [x, y] = point(i, 122)
          const anchor = x < CENTER - 4 ? 'end' : x > CENTER + 4 ? 'start' : 'middle'
          const dx = anchor === 'end' ? -9 : anchor === 'start' ? 9 : 0
          return (
            <g key={d}>
              <AxisIcon d={d} x={x + dx} y={y} size={10} />
              <text
                x={x + (anchor === 'end' ? -17 : anchor === 'start' ? 17 : 0)}
                y={y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={7}
                fill="currentColor"
                fillOpacity={0.65}
              >
                {marked[i] ? `${shortLabel(d)} *` : shortLabel(d)}
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
