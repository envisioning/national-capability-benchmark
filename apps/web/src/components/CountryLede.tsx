import Link from 'next/link'
import type { AgendaDimension, CountryAgenda } from '@ncb/core'
import { DIMENSION_LABELS, RAISE_BELOW, splitAgenda } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityLink } from '@/components/CapabilityLink'
import { agendaHref } from '@/lib/links'
import { ConfidenceBar, DefineLink, Score } from '@/components/ui'

/**
 * The computed agenda at the top of a country page.
 *
 * It selects from the agenda and never calculates. Scores and confidence come
 * from `data/out/agenda/{ISO3}.json`; the groups come from `splitAgenda`, which
 * the agenda document also uses. See D35 and D38.
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
            Strongest usable evidence: <DimensionLink d={strongest} />, at{' '}
            <Score value={strongest.score} size="sm" />.{' '}
          </>
        ) : (
          <>
            No dimension reaches {RAISE_BELOW} on usable evidence.{' '}
          </>
        )}
        {lowest ? (
          <>
            Raise <DimensionLink d={lowest} /> first, at{' '}
            <Score value={lowest.score} size="sm" />.{' '}
          </>
        ) : null}
        {thinnest ? (
          <>
            <DimensionLink d={thinnest} /> needs more evidence: confidence is{' '}
            <ConfidenceBar value={thinnest.confidence} />.
          </>
        ) : null}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Group
          label="Raise, lowest first"
          items={raise}
          empty="No low-scoring dimension has usable evidence."
        />
        <Group
          label="Measure before managing"
          items={measure}
          empty="Every dimension here has usable evidence."
        />
      </div>

      <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
        These lists are the country's{' '}
        <DefineLink term="Capability agenda">capability agenda</DefineLink>, computed from the
        scores.{' '}
        <Link href={agendaHref(agenda.iso3)} className="font-medium underline underline-offset-4">
          Read the full agenda
        </Link>{' '}
        It names comparable evidence from other countries and the {agenda.gapCount} gaps in the registry.
      </p>
      {reason ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          Why this country is included: {reason}.
        </p>
      ) : null}
    </div>
  )
}

/** A dimension name that opens the capability's canonical landing page. */
function DimensionLink({ d }: { d: AgendaDimension }) {
  return <CapabilityLink dimension={d.dimension} className="underline underline-offset-4" />
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
              <CapabilityLink
                dimension={d.dimension}
                className="inline-flex items-center gap-2 text-xs font-medium underline underline-offset-4"
              >
                <Icon
                  name={DIMENSION_ICON[d.dimension]}
                  size={14}
                  className="text-[var(--muted)]"
                />
                {DIMENSION_LABELS[d.dimension]}
              </CapabilityLink>
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
