import Link from 'next/link'
import type { AgendaDimension, CountryAgenda } from '@ncb/core'
import { DIMENSION_LABELS, RAISE_BELOW, splitAgenda } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityLink } from '@/components/CapabilityLink'
import { agendaHref } from '@/lib/links'
import { Card, Confidence, DefineLink, Score } from '@/components/ui'

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
            <Confidence value={thinnest.confidence} />.
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
    <Card tone="none">
      <p className="mb-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] table-fixed border-collapse text-sm">
            <caption className="sr-only">{label}</caption>
            <colgroup>
              <col />
              <col className="w-[10.5rem]" />
              <col className="w-[4.5rem]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[var(--rule)]">
                <th
                  scope="col"
                  className="pb-2 text-left text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--muted)]"
                >
                  Dimension
                </th>
                <th
                  scope="col"
                  className="pb-2 text-right text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--muted)]"
                >
                  Confidence
                </th>
                <th
                  scope="col"
                  className="pb-2 text-right text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--muted)]"
                >
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr
                  key={d.dimension}
                  className="border-b border-[var(--rule-soft)] last:border-b-0"
                >
                  <th scope="row" className="py-3 pr-3 text-left font-medium">
                    <CapabilityLink
                      dimension={d.dimension}
                      className="flex min-w-0 items-center gap-2 underline underline-offset-4"
                    >
                      <Icon
                        name={DIMENSION_ICON[d.dimension]}
                        size={16}
                        className="shrink-0 text-[var(--muted)]"
                      />
                      <span className="min-w-0 truncate">{DIMENSION_LABELS[d.dimension]}</span>
                    </CapabilityLink>
                  </th>
                  <td className="py-3 text-right">
                    <span className="inline-flex w-full justify-end">
                      <Confidence value={d.confidence} size="md" />
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right tabular-nums">
                    <Score value={d.score} size="md" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
