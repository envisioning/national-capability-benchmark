import type { MeasurementClass } from '@ncb/core'
import { DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import { CLASS_ICON, CONFIDENCE_ICON, DIMENSION_ICON, Icon } from '@/components/Icon'
import {
  CONFIDENCE_BANDS,
  MEASUREMENT_CLASS_LABELS,
  MEASUREMENT_CLASS_MEANING,
  SCORE_BANDS,
  confidenceBand,
  scoreBand,
} from '@ncb/core'

/*
 * Type scale and surfaces follow envisioning.com/DESIGN.md. Titles are
 * font-light 300: the quietness is the point, and the lime highlight carries
 * the visual weight. Lime is used confidently but rarely, so it appears on the
 * radar fill and the highlight marker and nowhere else.
 */

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="font-display text-3xl font-light leading-tight sm:text-4xl"
      style={{ fontVariationSettings: '"wght" 300, "wdth" 100' }}
    >
      {children}
    </h1>
  )
}

export function Headline({ children }: { children: React.ReactNode }) {
  return <p className="my-6 text-xl font-light leading-snug sm:my-8 sm:text-2xl">{children}</p>
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">{children}</p>
  )
}

/** One per page at most. One word or a short phrase, never a full sentence. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="bg-accent px-1 text-black">{children}</span>
}

export function Section({
  title,
  hint,
  icon,
  children,
}: {
  title: string
  hint?: string
  /** Optional mark for the concept this section covers. Never the only cue. */
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="mb-16">
      <h2 className="flex items-center gap-3 text-2xl font-light leading-tight sm:text-3xl">
        {icon ? <span className="text-[var(--muted)]">{icon}</span> : null}
        {title}
      </h2>
      {hint ? <p className="mt-3 max-w-3xl text-lg leading-relaxed">{hint}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Scroller({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>
}

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full min-w-[640px] border-collapse text-xs">{children}</table>
}

export function Th({
  children,
  align = 'left',
}: {
  children?: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <th
      className={`border-b border-[var(--rule)] px-3 py-3 text-xs font-medium text-[var(--muted)] ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  align = 'left',
  dim = false,
}: {
  children?: React.ReactNode
  align?: 'left' | 'right'
  dim?: boolean
}) {
  return (
    <td
      className={`border-b border-[var(--rule-soft)] px-3 py-2.5 ${
        align === 'right' ? 'text-right tabular-nums' : ''
      } ${dim ? 'text-[var(--muted)]' : ''}`}
    >
      {children}
    </td>
  )
}

/**
 * The one display for a 0 to 100 score, used in every table.
 *
 * A filled chip carrying the number, coloured by band. Inline content only:
 * `DataTable` owns the `<td>`, and a component that emits one as well produces
 * `<td><td>`, which fails hydration and silently kills sorting on the table.
 */
export function Score({ value, size = 'md' }: { value: number | null; size?: 'md' | 'sm' }) {
  if (value === null || Number.isNaN(value)) {
    return <span className="text-[var(--muted)]">no data</span>
  }
  const band = scoreBand(value)
  return (
    <span
      title={`${band.label}: ${band.meaning}`}
      className={`inline-block rounded-md text-center font-medium tabular-nums ${
        size === 'sm' ? 'min-w-9 px-1.5 py-0.5' : 'min-w-11 px-2 py-1'
      }`}
      style={{
        background: `var(--score-${band.id})`,
        color: `var(--score-${band.id}-ink)`,
      }}
    >
      {value.toFixed(1)}
    </span>
  )
}

/** Shipped beside any table of scores, so the bands are never colour alone. */
export function ScoreLegend() {
  return (
    <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
      {[...SCORE_BANDS].reverse().map((b, i, all) => {
        const next = all[i + 1]
        const range = next ? `${b.min} to ${next.min}` : `${b.min} and above`
        return (
          <li key={b.id} className="inline-flex items-center gap-2" title={b.meaning}>
            <span
              className="inline-block h-4 w-7 rounded-md"
              style={{ background: `var(--score-${b.id})` }}
            />
            <span className="font-medium">{b.label}</span>
            <span className="tabular-nums text-[var(--muted)]">{range}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function ConfidenceBar({ value }: { value: number }) {
  const band = confidenceBand(value)
  return (
    <span
      className="inline-flex items-center gap-2"
      title={`${band.label}: ${band.meaning}`}
    >
      <Icon name={CONFIDENCE_ICON[band.id]} size={13} className="text-[var(--muted)]" />
      <span className="h-1.5 w-16 rounded-full bg-[var(--rule-soft)]">
        <span
          className="block h-1.5 rounded-full"
          style={{
            width: `${Math.max(4, Math.round(value * 100))}%`,
            background: `var(--band-${band.id})`,
          }}
        />
      </span>
      <span className="tabular-nums text-xs text-[var(--muted)]">{value.toFixed(2)}</span>
    </span>
  )
}

/** Always shipped beside a table of confidence meters. */
export function ConfidenceLegend() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
      {[...CONFIDENCE_BANDS].reverse().map((b, i, all) => {
        const next = all[i + 1]
        const range = next
          ? `${b.min.toFixed(2)} to ${next.min.toFixed(2)}`
          : `${b.min.toFixed(2)} and above`
        return (
          <li key={b.id} className="inline-flex items-center gap-2" title={b.meaning}>
            <Icon name={CONFIDENCE_ICON[b.id]} size={13} className="text-[var(--muted)]" />
            <span
              className="inline-block h-1.5 w-6 rounded-full"
              style={{ background: `var(--band-${b.id})` }}
            />
            <span className="font-medium">{b.label}</span>
            <span className="tabular-nums text-[var(--muted)]">{range}</span>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The measurement class of an indicator: an icon and a letter together.
 *
 * The icon is the same everywhere that class appears, so it becomes learnable.
 * The letter stays because the icon alone would be a puzzle, and the tooltip
 * carries the sentence for anybody who wants it now rather than on the glossary.
 */
export function ClassBadge({ value }: { value: MeasurementClass }) {
  return (
    <span
      title={`${MEASUREMENT_CLASS_LABELS[value]}. ${MEASUREMENT_CLASS_MEANING[value].plain}`}
      className="inline-flex items-center gap-1 rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-xs font-medium"
    >
      <Icon name={CLASS_ICON[value]} size={12} />
      {value}
    </span>
  )
}

export function Note({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'stop'
}) {
  const stop = tone === 'stop'
  return (
    <p
      className={`mb-6 max-w-3xl rounded-lg border px-4 py-3 text-lg leading-relaxed ${
        stop
          ? 'border-[#ef4444]/40 bg-[#ef4444]/10'
          : 'border-[var(--rule)] bg-[var(--surface-sunken)]'
      }`}
    >
      {children}
    </p>
  )
}

export function Empty({ hint }: { hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--rule)] px-6 py-16 text-center text-lg text-[var(--muted)]">
      {hint}
    </div>
  )
}

/**
 * Shipped under any radar drawn with confidences. The dash is a second
 * encoding of the same thing the confidence meters carry, so thin evidence is
 * visible in the shape and not only in a table further down the page.
 */
export function RadarEvidenceLegend() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
      <li className="inline-flex items-center gap-2">
        <svg width="26" height="8" aria-hidden="true">
          <line x1="1" y1="4" x2="25" y2="4" stroke="var(--primary)" strokeWidth="1.6" />
        </svg>
        <span>Usable or good evidence</span>
      </li>
      <li className="inline-flex items-center gap-2">
        <svg width="26" height="8" aria-hidden="true">
          <line
            x1="1"
            y1="4"
            x2="25"
            y2="4"
            stroke="var(--primary)"
            strokeWidth="1.6"
            strokeDasharray="3 2.5"
          />
        </svg>
        <span>Thin evidence</span>
      </li>
      <li>The point still sits at the score, because confidence never moves it.</li>
      <li>Click any axis name to see every country on that dimension.</li>
    </ul>
  )
}

/**
 * What 0 to 100 means. Printed wherever a score is read on its own, because the
 * commonest misreading of this benchmark is that 10 means a tenth of a
 * capability. See docs/DECISIONS.md D16.
 */
export function FrameNote() {
  return (
    <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
      0 to 100 is a position against the 10 reference countries. Zero is the weakest of those 10 on
      a dimension and 100 is the strongest. A score of 10 puts a country near the floor of that
      frame. It does not mean 10 percent of a capability.
    </p>
  )
}

/**
 * Change in a dimension score over the momentum span.
 *
 * Sign and arrow both carry the direction, so nothing here rests on color. The
 * number is the change in score points on the matched basket, which is a
 * smaller set of indicators than the headline score.
 */
export function Delta({
  value,
  title,
}: {
  value: number | null
  title?: string
}) {
  if (value === null) return <span className="text-[var(--muted)]">no trend</span>
  const flat = Math.abs(value) < 0.05
  return (
    <span className="inline-flex items-center gap-1 tabular-nums" title={title}>
      <Icon
        name={flat ? 'minus' : value > 0 ? 'trending-up' : 'trending-down'}
        size={13}
        className="text-[var(--muted)]"
      />
      {flat ? '0.0' : `${value > 0 ? '+' : ''}${value.toFixed(1)}`}
    </span>
  )
}

/**
 * The matched basket over time, on a fixed 0 to 100 axis so the slope of one
 * dimension can be read against another.
 */
export function Sparkline({
  series,
  width = 120,
  height = 28,
}: {
  series: Array<{ year: number; score: number }>
  width?: number
  height?: number
}) {
  if (series.length < 2) return null
  const first = series[0] as { year: number; score: number }
  const last = series[series.length - 1] as { year: number; score: number }
  const span = last.year - first.year || 1
  const x = (year: number) => ((year - first.year) / span) * (width - 4) + 2
  const y = (score: number) => height - 2 - (score / 100) * (height - 4)
  const points = series.map((p) => `${x(p.year).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Score ${first.score.toFixed(1)} in ${first.year}, ${last.score.toFixed(1)} in ${last.year}`}
    >
      <line
        x1={0}
        y1={y(0)}
        x2={width}
        y2={y(0)}
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth={0.75}
      />
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth={1.4} />
      <circle cx={x(last.year)} cy={y(last.score)} r={2} fill="var(--primary)" />
    </svg>
  )
}

/**
 * Shipped under any table showing the C, I, O and P badges.
 *
 * A letter in a table is not an explanation. The full definitions live on the
 * glossary page and the one-liners live here, so a reader never has to guess
 * and never has to leave the page to find out.
 */
export function ClassLegend() {
  const classes: MeasurementClass[] = ['C', 'I', 'O', 'P']
  return (
    <div className="mb-4 max-w-3xl">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        {classes.map((c) => (
          <li key={c} className="inline-flex items-baseline gap-2">
            <ClassBadge value={c} />
            <span>
              <span className="font-medium">{MEASUREMENT_CLASS_LABELS[c]}</span>
              <span className="text-[var(--muted)]"> {MEASUREMENT_CLASS_MEANING[c].plain}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A link to the full definition of a term, for the first place it appears. */
export function DefineLink({ term, children }: { term: string; children?: React.ReactNode }) {
  const anchor = term.toLowerCase().replace(/[^a-z]+/g, '-')
  return (
    <a
      href={`/glossary#${anchor}`}
      className="underline decoration-dotted underline-offset-4"
      title={`What "${term}" means`}
    >
      {children ?? term}
    </a>
  )
}

/**
 * The nine marks and what they stand for.
 *
 * Shipped anywhere a chart names its axes with marks alone, so the grid of
 * country cards is readable without opening one first.
 */
export function DimensionLegend() {
  return (
    <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
      {DIMENSIONS.map((d) => (
        <li key={d} className="inline-flex items-center gap-2">
          <Icon name={DIMENSION_ICON[d]} size={14} className="text-[var(--muted)]" />
          <span>{DIMENSION_LABELS[d]}</span>
        </li>
      ))}
    </ul>
  )
}
