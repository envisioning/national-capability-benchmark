import type { MeasurementClass } from '@ncb/core'
import {
  CONFIDENCE_BANDS,
  MEASUREMENT_CLASS_LABELS,
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
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-light leading-tight sm:text-3xl">{title}</h2>
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

export function ClassBadge({ value }: { value: MeasurementClass }) {
  return (
    <span
      title={MEASUREMENT_CLASS_LABELS[value]}
      className="inline-block rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-xs font-medium"
    >
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
