import Link from 'next/link'
import type { Lexicon, MeasurementClass, Provenance } from '@ncb/core'
import { DIMENSIONS, DIMENSION_LABELS, EN, countryFlag, fill, isEvidential } from '@ncb/core'
import { CLASS_ICON, CONFIDENCE_ICON, DIMENSION_ICON, Icon, type IconName } from '@/components/Icon'
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

/**
 * The flag emoji beside a country name.
 *
 * Same rule as an icon: a second encoding, never the only one. The name always
 * sits next to it, so the flag is `aria-hidden` and a reader who sees a blank
 * box loses nothing. The fixed width keeps a column of names aligned when a
 * flag fails to render.
 */
export function Flag({ iso3 }: { iso3: string }) {
  const flag = countryFlag(iso3)
  if (!flag) return null
  return (
    <span
      aria-hidden
      className="inline-block w-[1.35em] shrink-0 select-none text-center leading-none"
    >
      {flag}
    </span>
  )
}

/** A country name with its flag. Use this anywhere a country is named. */
export function CountryLabel({ iso3, name }: { iso3: string; name: string }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <Flag iso3={iso3} />
      <span>{name}</span>
    </span>
  )
}

/**
 * Metadata rendered as metadata: a generated date, a dataset version, a run id.
 * A pill, not a sentence, so a reader can tell provenance apart from prose at a
 * glance. Group several in one flex row.
 */
export function Meta({ icon, children }: { icon?: IconName; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
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
export function Score({
  value,
  size = 'md',
  nullLabel = 'no data',
}: {
  value: number | null
  /**
   * `lg` is the readout size: one number a surface is built around, such as the
   * axis the reader is pointing at on a radar. It is the same chip and the same
   * band ramp, set in the light weight the type scale gives large numerals.
   */
  size?: 'lg' | 'md' | 'sm'
  /** What a missing value reads as. A language page passes its lexicon's word. */
  nullLabel?: string
}) {
  if (value === null || Number.isNaN(value)) {
    return <span className="text-[var(--muted)]">{nullLabel}</span>
  }
  const band = scoreBand(value)
  const sizing =
    size === 'lg'
      ? 'min-w-24 px-3 py-1 text-3xl font-light'
      : size === 'sm'
        ? 'min-w-9 px-1.5 py-0.5 font-medium'
        : 'min-w-11 px-2 py-1 font-medium'
  return (
    <span
      title={`${band.label}: ${band.meaning}`}
      className={`inline-block rounded-md text-center tabular-nums ${sizing}`}
      style={{
        background: `var(--score-${band.id})`,
        color: `var(--score-${band.id}-ink)`,
      }}
    >
      {value.toFixed(1)}
    </span>
  )
}

/**
 * A dimension's score, or the reason there is not one.
 *
 * The model withholds a score when fewer than two of a dimension's indicators
 * are observed, because a mean of one number is not a measurement. Rendering
 * that as "no data" would tell the reader nothing about why, and rendering it
 * as a number would be the claim the floor exists to prevent. Everything with
 * an actual score still goes through `Score`. See D45.
 */
export function DimensionScore({
  dim,
  size = 'md',
}: {
  dim: { score: number | null; belowCoverageFloor?: boolean; observedIndicators?: number } | null
  size?: 'md' | 'sm'
}) {
  if (dim?.belowCoverageFloor) {
    const n = dim.observedIndicators ?? 0
    return (
      <span
        className="text-xs text-[var(--muted)]"
        title={`Withheld. ${n === 1 ? 'One indicator is' : `${n} indicators are`} observed here, and this model needs two before it averages them into a dimension score.`}
      >
        not measured
      </span>
    )
  }
  return <Score value={dim?.score ?? null} size={size} />
}

/**
 * Shipped beside any table of scores, so the bands are never colour alone. A
 * language page passes its lexicon; the thresholds come from the band registry
 * either way.
 */
export function ScoreLegend({ lex = EN }: { lex?: Lexicon } = {}) {
  return (
    <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
      {[...SCORE_BANDS].reverse().map((b, i, all) => {
        const next = all[i + 1]
        const range = next
          ? fill(lex.legendRange, { a: b.min, b: next.min })
          : fill(lex.legendRangeTop, { a: b.min })
        const band = lex.scoreBands[b.id]
        return (
          <li key={b.id} className="inline-flex items-center gap-2" title={band.meaning}>
            <span
              className="inline-block h-4 w-7 rounded-md"
              style={{ background: `var(--score-${b.id})` }}
            />
            <span className="font-medium">{band.label}</span>
            <span className="tabular-nums text-[var(--muted)]">{range}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function ConfidenceBar({ value }: { value: number | null }) {
  /* A missing confidence must never draw as a very short bar: 0.00 and "we do
   * not know" are different claims. Score makes the same distinction. */
  if (value === null || Number.isNaN(value)) {
    return <span className="text-[var(--muted)]">no data</span>
  }
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

/**
 * Always shipped beside a table of confidence meters.
 *
 * The band meanings are printed, not tucked into tooltips: "do not quote it on
 * its own" is the strongest caveat in the system and has to survive touch
 * screens and skim reading.
 */
export function ConfidenceLegend({ lex = EN }: { lex?: Lexicon } = {}) {
  return (
    <div className="mt-4">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        {[...CONFIDENCE_BANDS].reverse().map((b, i, all) => {
          const next = all[i + 1]
          const range = next
            ? fill(lex.legendRange, { a: b.min.toFixed(2), b: next.min.toFixed(2) })
            : fill(lex.legendRangeTop, { a: b.min.toFixed(2) })
          return (
            <li key={b.id} className="inline-flex items-center gap-2">
              <Icon name={CONFIDENCE_ICON[b.id]} size={13} className="text-[var(--muted)]" />
              <span
                className="inline-block h-1.5 w-6 rounded-full"
                style={{ background: `var(--band-${b.id})` }}
              />
              <span className="font-medium">{lex.bands[b.id]}</span>
              <span className="tabular-nums text-[var(--muted)]">{range}</span>
            </li>
          )
        })}
      </ul>
      <ul className="mt-2 max-w-3xl space-y-0.5 text-xs leading-relaxed text-[var(--muted)]">
        {[...CONFIDENCE_BANDS].reverse().map((b) => (
          <li key={b.id}>
            <span className="font-medium">{lex.bands[b.id]}</span>: {lex.bandMeanings[b.id]}
          </li>
        ))}
      </ul>
    </div>
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
export function RadarEvidenceLegend({
  /**
   * Whether the radar this sits under passes `onSelectDimension`. The small
   * grid cards do not, so the click line would promise a control that is not
   * there.
   */
  interactive = true,
}: {
  interactive?: boolean
} = {}) {
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
        <span>Thin evidence, hollow point. The dashes open further as confidence falls.</span>
      </li>
      <li>The point still sits at the score, because confidence never moves it.</li>
      {interactive ? <li>Click any axis name to see every country on that dimension.</li> : null}
    </ul>
  )
}

/**
 * What 0 to 100 means. Printed wherever a score is read on its own, because the
 * commonest misreading of this benchmark is that 10 means a tenth of a
 * capability. See docs/DECISIONS.md D47.
 */
export function FrameNote() {
  return (
    <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
      0 to 100 is a position inside the frame every country builds together. Zero is the weakest on
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
    <Link
      href={`/glossary#${anchor}`}
      className="underline decoration-dotted underline-offset-4"
      title={`What "${term}" means`}
    >
      {children ?? term}
    </Link>
  )
}

/**
 * The provenance caveat for anything rendered from a Delphi run.
 *
 * The run file carries how it was produced, and this note travels with the
 * numbers wherever they appear, so a single working-session judgment can never
 * silently dress up as a panel. A mock run should not reach this component:
 * gate on `isEvidential` and render nothing from it at all.
 */
export function PanelProvenanceNote({
  provenance,
  panelists,
}: {
  provenance: Provenance
  panelists: number
}) {
  if (!isEvidential(provenance)) {
    return (
      <Note tone="stop">
        This run came from the deterministic offline stand-in. It exercises the pipeline and is
        not evidence about any country.
      </Note>
    )
  }
  if (panelists >= 3) return null
  return (
    <Note tone="stop">
      These estimates come from {panelists === 1 ? 'a single analyst' : `${panelists} analysts`}{' '}
      working in session. There is no distribution behind the median: read every number here as
      one judgment. <Link href="/delphi" className="underline underline-offset-4">How the panel layer works</Link>.
    </Note>
  )
}

/**
 * The nine marks and what they stand for.
 *
 * Shipped anywhere a chart names its axes with marks alone, so the grid of
 * country cards is readable without opening one first. A language page passes
 * its lexicon's dimension names; the registry English is the fallback, as
 * everywhere else in the interpretation layer. See D35.
 */
export function DimensionLegend({
  names,
}: {
  names?: Partial<Record<(typeof DIMENSIONS)[number], string>>
} = {}) {
  return (
    <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
      {DIMENSIONS.map((d) => (
        <li key={d} className="inline-flex items-center gap-2">
          <Icon name={DIMENSION_ICON[d]} size={14} className="text-[var(--muted)]" />
          <span>{names?.[d] ?? DIMENSION_LABELS[d]}</span>
        </li>
      ))}
    </ul>
  )
}
