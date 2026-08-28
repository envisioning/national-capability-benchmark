'use client'

import { useRef, useState } from 'react'
import {
  CONFIDENCE_BANDS,
  DIMENSIONS,
  DIMENSION_LABELS,
  EN,
  confidenceBand,
  isThinEvidence,
} from '@ncb/core'
import type { Dimension, Lexicon } from '@ncb/core'
import { DIMENSION_ICON, Icon, iconMarkup } from '@/components/Icon'
import { ConfidenceBar, Score } from '@/components/ui'

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

function angleOf(index: number): number {
  return (index / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2
}

function point(index: number, value: number, radius: number): [number, number] {
  const angle = angleOf(index)
  const r = (value / 100) * radius
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

/**
 * The pie slice belonging to one axis.
 *
 * The hit target is the whole sector, not the vertex. A reader aiming at a two
 * pixel dot misses; a reader aiming at a ninth of the chart cannot. It is also
 * what makes the chart work under a finger, where the dot is smaller than the
 * contact patch.
 */
function wedgePath(index: number, radius: number): string {
  const half = Math.PI / DIMENSIONS.length
  const a0 = angleOf(index) - half
  const a1 = angleOf(index) + half
  const x0 = CENTER + radius * Math.cos(a0)
  const y0 = CENTER + radius * Math.sin(a0)
  const x1 = CENTER + radius * Math.cos(a1)
  const y1 = CENTER + radius * Math.sin(a1)
  return `M ${CENTER} ${CENTER} L ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1} Z`
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

function valueAt(series: RadarSeries, i: number): number | null {
  const v = series.values[i]
  return v === undefined ? null : v
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
 *
 * The shape shows nine numbers and prints none of them. A reader who wants one
 * points at its axis and reads it under the chart, which is why the readout is
 * part of this component and not something each page assembles again.
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
 * Every mark is drawn at the same strength until the reader points at one, and
 * then the other eight step back. Thin evidence is still carried by the dashed
 * edge and the hollow vertex and never by the mark, because fading an icon for
 * two different reasons at once tells the reader neither.
 */
function AxisIcon({
  d,
  x,
  y,
  size,
  opacity = 0.9,
}: {
  d: Dimension
  x: number
  y: number
  size: number
  opacity?: number
}) {
  const scale = size / 24
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="none"
      stroke="currentColor"
      strokeOpacity={opacity}
      /* Lucide's own stroke width. The transform scales it down with the shape,
       * which is the point: compensating for the scale here made a 10-unit icon
       * carry a 4-unit stroke and turned every mark into a blob. */
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: 'stroke-opacity 140ms ease' }}
      dangerouslySetInnerHTML={{ __html: iconMarkup(DIMENSION_ICON[d]) }}
    />
  )
}

export function Radar({
  series,
  labels = 'full',
  lex = EN,
  interactive = true,
  onSelectDimension,
}: {
  series: RadarSeries[]
  labels?: RadarLabels
  /**
   * The language the chart speaks. Axis names, the missing-value word and the
   * readout all come from it, and every lookup falls back to the registry
   * English. See D35.
   */
  lex?: Lexicon
  /**
   * Whether the chart answers a pointer. The small grid cards sit inside a
   * link, where a hover readout would compete with the navigation the card
   * exists for, so they turn it off and stay a picture.
   */
  interactive?: boolean
  /** When given, clicking an axis opens that dimension. */
  onSelectDimension?: (dimension: Dimension) => void
}) {
  const g = GEOMETRY[labels]
  const at = (i: number, value: number) => point(i, value, g.radius)
  const nameOf = (d: Dimension) => shortLabel(lex.dimensions[d] ?? DIMENSION_LABELS[d])
  const noDataLabel = lex.agenda.noScore
  const rings = [25, 50, 75, 100]

  /**
   * The chart always reads one axis and never none.
   *
   * `pinned` is the axis the readout falls back to, and `hover` is the axis the
   * pointer is previewing. The readout shows `hover ?? pinned`, so leaving the
   * chart returns it to the last axis the reader chose instead of emptying it.
   * Nothing about the component's size depends on either: the readout holds the
   * same rows and the same height whether the pointer is on the chart or not.
   *
   * The opening axis is the first in the fixed dimension order, which is the
   * one drawn at the top. It is not a summary of the other eight: the mean of
   * nine axes is the headline score this benchmark withholds. See D53.
   */
  const [pinned, setPinned] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const active = hover ?? pinned
  const wedges = useRef<Array<SVGPathElement | null>>([])
  /**
   * Which axis the readout was already showing when the current press started.
   * A mouse click opens the panel outright, because the reader saw the number
   * while hovering. A finger has no hover: the first tap moves the readout and
   * the second one opens it, so a tap can never open a panel about a number the
   * reader has not seen.
   */
  const armed = useRef<number | null>(null)
  const pointerKind = useRef<string>('mouse')

  /** Point the readout at an axis. Hover and click land on the same one. */
  function read(i: number) {
    setHover(i)
    setPinned(i)
  }

  const selectable = Boolean(onSelectDimension)
  /* The sector reaches past the outer ring so the mark and the word that name
   * an axis fall inside the axis's own target. */
  const hitRadius = Math.min(CENTER, (g.ring / 100) * g.radius + (labels === 'full' ? 26 : 8))

  const described = series
    .map(
      (s) =>
        `${s.label}: ` +
        DIMENSIONS.map((d, i) => {
          const v = valueAt(s, i)
          const c = s.confidences?.[i]
          const conf =
            c === null || c === undefined
              ? ''
              : `, ${lex.agenda.colConfidence.toLowerCase()} ${lex.bands[confidenceBand(c).id]}`
          return `${nameOf(d)} ${v === null ? noDataLabel : v.toFixed(1)}${conf}`
        }).join(', '),
    )
    .join('. ')

  function step(delta: number) {
    const next = (active + delta + DIMENSIONS.length) % DIMENSIONS.length
    read(next)
    wedges.current[next]?.focus()
  }

  return (
    <div>
      {/* The chart carries its name in `aria-label` rather than in an SVG
          `<title>`, which the browser renders as a hover tooltip. A tooltip
          over a chart that is itself a hover surface fires on every reading
          and covers the shape it is naming. */}
      <svg
        viewBox={`${-g.padX} 0 ${SIZE + g.padX + g.padRight} ${SIZE}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${series.map((s) => s.label).join(' compared with ')}. ${described}`}
        onPointerLeave={(e) => {
          /* A finger leaves the chart the instant it lifts, so only a mouse
           * releases the preview. Either way the readout keeps the pinned
           * axis and the component keeps its height. */
          if (e.pointerType === 'mouse') setHover(null)
        }}
      >
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
              strokeOpacity={active === i ? 0.42 : 0.12}
              strokeWidth={active === i ? 1 : 0.75}
              style={{ transition: 'stroke-opacity 140ms ease' }}
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
          const measured = DIMENSIONS.map((_, i) => i).filter((i) => valueAt(s, i) !== null)
          const pts = measured.map((i) => at(i, valueAt(s, i) as number))
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
                const on = active === i
                return (
                  <g key={i}>
                    {/* The halo is the hover state of the number itself: the
                        vertex stays exactly where the score puts it and grows a
                        ring, so pointing at an axis never moves the shape. */}
                    <circle
                      cx={p[0]}
                      cy={p[1]}
                      r={5.5}
                      fill={s.color}
                      fillOpacity={on ? 0.24 : 0}
                      style={{ transition: 'fill-opacity 140ms ease' }}
                    />
                    <circle
                      cx={p[0]}
                      cy={p[1]}
                      r={on ? (thin ? 3 : 2.8) : thin ? 2.2 : 2}
                      fill={thin ? 'var(--surface)' : s.color}
                      stroke={thin ? s.color : 'none'}
                      strokeWidth={thin ? 1.1 : 0}
                    />
                  </g>
                )
              })}
            </g>
          )
        })}

        {labels === 'icons' &&
          DIMENSIONS.map((d, i) => {
            const [x, y] = at(i, g.ring)
            return (
              <AxisIcon
                key={d}
                d={d}
                x={x}
                y={y}
                size={13}
                opacity={active === i ? 1 : 0.5}
              />
            )
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
            const dim = active !== i
            return (
              <g
                key={d}
                aria-hidden="true"
                style={interactive ? { cursor: selectable ? 'pointer' : 'default' } : undefined}
                onPointerEnter={
                  interactive
                    ? (e) => {
                        pointerKind.current = e.pointerType
                        armed.current = active
                        setHover(i)
                      }
                    : undefined
                }
                onClick={
                  interactive && selectable
                    ? () => {
                        read(i)
                        onSelectDimension?.(d)
                      }
                    : undefined
                }
              >
                <AxisIcon
                  d={d}
                  x={stacked ? x : x + side * 9}
                  y={stacked ? y + (above ? -8 : 9) : y}
                  size={10}
                  opacity={dim ? 0.5 : 1}
                />
                <text
                  x={stacked ? x : x + side * 17}
                  y={stacked ? y + (above ? 3 : -3) : y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize={7.5}
                  fill="currentColor"
                  fillOpacity={dim ? 0.5 : 1}
                  style={{
                    transition: 'fill-opacity 140ms ease',
                    ...(selectable
                      ? {
                          textDecoration: dim ? 'underline dotted' : 'underline solid',
                          textUnderlineOffset: '2px',
                        }
                      : {}),
                  }}
                >
                  {nameOf(d)}
                </text>
              </g>
            )
          })}

        {/* The pointer layer goes last so it sits above everything it explains.
            One sector per axis: the reader aims at a ninth of the chart rather
            than at a two pixel dot. */}
        {interactive &&
          DIMENSIONS.map((d, i) => {
            const on = active === i
            const focusable = selectable
            return (
              <path
                key={`hit-${d}`}
                ref={(el) => {
                  wedges.current[i] = el
                }}
                d={wedgePath(i, hitRadius)}
                fill="var(--primary)"
                fillOpacity={on ? 0.08 : 0}
                role={focusable ? 'button' : undefined}
                tabIndex={focusable ? (on ? 0 : -1) : undefined}
                aria-label={focusable ? `${nameOf(d)}. ${lex.radar.compare}` : undefined}
                aria-hidden={focusable ? undefined : true}
                style={{
                  pointerEvents: 'all',
                  cursor: selectable ? 'pointer' : 'default',
                  transition: 'fill-opacity 140ms ease',
                  outline: 'none',
                }}
                onPointerDown={(e) => {
                  pointerKind.current = e.pointerType
                }}
                onPointerEnter={(e) => {
                  pointerKind.current = e.pointerType
                  armed.current = active
                  setHover(i)
                }}
                onFocus={() => read(i)}
                onClick={() => {
                  read(i)
                  if (!onSelectDimension) return
                  /* A finger's first tap only moves the readout. The panel opens
                   * on the tap after the reader has seen the number. */
                  if (pointerKind.current !== 'mouse' && armed.current !== i) return
                  onSelectDimension(d)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    read(i)
                    onSelectDimension?.(d)
                  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault()
                    step(1)
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    step(-1)
                  }
                }}
              />
            )
          })}
      </svg>

      {interactive ? (
        <RadarReadout
          series={series}
          index={active}
          lex={lex}
          nameOf={nameOf}
          noDataLabel={noDataLabel}
        />
      ) : null}
    </div>
  )
}

/**
 * The number the reader is pointing at, under the chart that holds nine of them.
 *
 * Every row is always drawn and every row has a fixed height, so the readout
 * occupies the same box before, during and after a hover. A block that grew
 * under the pointer would move the axes while the reader was aiming at them,
 * which makes the next axis harder to hit than the last one.
 *
 * There is no resting summary. The mean of nine dimensions would be the
 * headline score this benchmark refuses to publish, so the readout opens on the
 * first axis in the fixed dimension order and waits to be moved. See D53.
 */
function RadarReadout({
  series,
  index,
  lex,
  nameOf,
  noDataLabel,
}: {
  series: RadarSeries[]
  index: number
  lex: Lexicon
  nameOf: (d: Dimension) => string
  noDataLabel: string
}) {
  const d = DIMENSIONS[index] as Dimension
  const focal = series[0] as RadarSeries
  const confidence = focal.confidences?.[index] ?? null

  return (
    <div className="mt-3 flex flex-col items-center gap-2 text-center">
      <span className="flex h-5 items-center gap-2 text-xs font-medium">
        <Icon name={DIMENSION_ICON[d]} size={14} className="text-[var(--muted)]" />
        {nameOf(d)}
      </span>

      <span className="flex h-12 flex-wrap items-center justify-center gap-x-4">
        {series.map((s, si) => (
          <span key={s.label} className="inline-flex items-center gap-2">
            {series.length > 1 ? (
              <span className="text-xs text-[var(--muted)]">{s.label}</span>
            ) : null}
            <Score
              value={valueAt(s, index)}
              size={si === 0 ? 'lg' : 'md'}
              nullLabel={noDataLabel}
            />
          </span>
        ))}
      </span>

      {/* Confidence keeps its row whether or not there is one to report, and it
          stays a separate statement from the score beside it. */}
      <span className="flex h-5 items-center gap-2 text-xs text-[var(--muted)]">
        <span>{lex.agenda.colConfidence}</span>
        {confidence === null ? (
          <span>{noDataLabel}</span>
        ) : (
          <>
            <ConfidenceBar value={confidence} />
            <span>{lex.bands[confidenceBand(confidence).id]}</span>
          </>
        )}
      </span>

      {/* Two lines of question, always. Every dimension's question fits in two
          at this width in both lexicons, and the fixed box holds the height for
          the ones that fit in one. */}
      <span className="h-11 max-w-md text-xs leading-relaxed text-[var(--muted)]">
        {lex.questions[d]}
      </span>
    </div>
  )
}

/**
 * Sentence case for the one registry label that carries two capitals. The
 * registry is the ground layer and keeps its own casing; the viewer prints
 * sentence case everywhere, including here.
 */
function shortLabel(name: string): string {
  return name === DIMENSION_LABELS.shared_purpose ? 'Shared purpose' : name
}
