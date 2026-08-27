import Link from 'next/link'
import type { AgendaDimension, CountryAgenda } from '@ncb/core'
import { DIMENSION_LABELS, RAISE_BELOW, splitAgenda } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { agendaHref } from '@/lib/links'
import { ConfidenceBar, DefineLink, Score } from '@/components/ui'

/**
 * What this country's shape says, before the tables say it.
 *
 * A reader landing here used to meet a radar and nine tables and had to read
 * all of them to learn where to look. This block answers that first, from the
 * computed agenda, so the page opens on a finding.
 *
 * It selects and never calculates. Every score and confidence printed here is
 * read straight out of `data/out/agenda/{ISO3}.json`, and the three groups come
 * from `splitAgenda`, which the agenda document also uses. See D35 and D38.
 */
export function CountryLede({
  agenda,
  reason,
}: {
  agenda: CountryAgenda
  /** Why the country is in the prototype, from the registry. */
  reason?: string | undefined
}) {
  const { raise, measure, hold } = splitAgenda(agenda)
  const strongest = hold[0]
  const lowest = raise[0]
  const thinnest = measure[0]

  return (
    <div className="mb-10">
      <p className="text-lg leading-relaxed">
        {strongest ? (
          <>
            Strongest where the evidence is usable: <DimensionLink d={strongest} />, at{' '}
            <Score value={strongest.score} size="sm" />.{' '}
          </>
        ) : (
          <>
            Nothing here scores {RAISE_BELOW} or higher on evidence strong enough to act on.{' '}
          </>
        )}
        {lowest ? (
          <>
            The evidence says to raise <DimensionLink d={lowest} /> first, at{' '}
            <Score value={lowest.score} size="sm" />.{' '}
          </>
        ) : null}
        {thinnest ? (
          <>
            <DimensionLink d={thinnest} /> cannot be judged yet: its confidence,{' '}
            <ConfidenceBar value={thinnest.confidence} />, is too thin to carry a decision.
          </>
        ) : null}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Group
          label="Raise, lowest first"
          items={raise}
          empty="Nothing here has usable evidence and a low score."
        />
        <Group
          label="Measure before managing, thinnest first"
          items={measure}
          empty="Every dimension here has usable evidence."
        />
      </div>

      <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
        These two lists are the country's{' '}
        <DefineLink term="Capability agenda">capability agenda</DefineLink>, computed from the
        scores below.{' '}
        <Link href={agendaHref(agenda.iso3)} className="font-medium underline underline-offset-4">
          Read the full agenda
        </Link>
        , which names the countries whose own evidence already answers each question and works
        through the {agenda.gapCount} gaps the registry declares across every dimension.
      </p>
      {reason ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          Why this country is included: {reason}.
        </p>
      ) : null}
    </div>
  )
}

/** A dimension name that jumps to its section further down the same page. */
function DimensionLink({ d }: { d: AgendaDimension }) {
  return (
    <a href={`#${d.dimension}`} className="underline underline-offset-4">
      {DIMENSION_LABELS[d.dimension]}
    </a>
  )
}

function Group({
  label,
  items,
  empty,
}: {
  label: string
  items: AgendaDimension[]
  empty: string
}) {
  return (
    <div className="rounded-lg border border-[var(--rule)] p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">{label}</p>
      {items.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((d) => (
            <li
              key={d.dimension}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
            >
              <a
                href={`#${d.dimension}`}
                className="inline-flex items-center gap-2 text-xs font-medium underline underline-offset-4"
              >
                <Icon
                  name={DIMENSION_ICON[d.dimension]}
                  size={14}
                  className="text-[var(--muted)]"
                />
                {DIMENSION_LABELS[d.dimension]}
              </a>
              <span className="inline-flex items-center gap-3">
                <ConfidenceBar value={d.confidence} />
                <Score value={d.score} size="sm" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

