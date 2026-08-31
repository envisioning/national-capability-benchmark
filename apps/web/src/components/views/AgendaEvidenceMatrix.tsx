import Link from 'next/link'
import {
  COUNTRY_ISO3,
  DIMENSIONS,
  DIMENSION_LABELS,
  buildAgendaEvidenceCoverage,
} from '@ncb/core'
import type { Dimension, EvidenceRecord } from '@ncb/core'
import { CountryLabel } from '@/components/ui'
import {
  NO_PATTERN_FILTERS,
  agendaHref,
  agendasHref,
  capabilityHref,
  type PatternFilters,
} from '@/lib/links'

/**
 * The source-checked evidence corpus turned into a complete country x
 * capability grid. Empty cells stay visible because they are research slots,
 * not evidence that the country lacks the capability.
 */
export function AgendaEvidenceMatrix({
  records,
  active = NO_PATTERN_FILTERS,
}: {
  records: EvidenceRecord[]
  active?: PatternFilters
}) {
  const coverage = buildAgendaEvidenceCoverage(records)
  const rows = [...coverage.rows].sort((a, b) => a.country.localeCompare(b.country))
  const possibleCells = COUNTRY_ISO3.length * DIMENSIONS.length

  const cellHref = (iso3: string, dimension: Dimension) =>
    agendasHref({
      ...NO_PATTERN_FILTERS,
      iso3,
      dimension,
    })

  return (
    <>
      <dl className="mb-5 grid gap-px overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-3">
        <div className="bg-[var(--surface)] p-4">
          <dt className="text-xs text-[var(--muted)]">Documented deliveries</dt>
          <dd className="mt-1 text-2xl font-light tabular-nums">{coverage.recordCount}</dd>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <dt className="text-xs text-[var(--muted)]">Countries represented</dt>
          <dd className="mt-1 text-2xl font-light tabular-nums">
            {coverage.countriesRepresented}/{COUNTRY_ISO3.length}
          </dd>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <dt className="text-xs text-[var(--muted)]">Country-capability cells filled</dt>
          <dd className="mt-1 text-2xl font-light tabular-nums">
            {coverage.filledCells}/{possibleCells}
          </dd>
        </div>
      </dl>

      <p className="mb-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        A number is the count of source-checked delivery records in that cell. A dash is an
        uncovered research slot, not evidence that the country lacks the capability. Select a
        number to filter the full register below.
      </p>

      <div className="overflow-x-auto pb-2">
        <table className="min-w-[1120px] border-separate border-spacing-0 text-xs">
          <caption className="sr-only">
            Documented delivery coverage for every benchmark country and capability
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 min-w-48 border-b border-[var(--rule)] bg-[var(--surface)] px-3 py-3 text-left font-medium text-[var(--muted)]"
              >
                Country
              </th>
              {DIMENSIONS.map((dimension) => (
                <th
                  key={dimension}
                  scope="col"
                  className="min-w-24 border-b border-[var(--rule)] px-2 py-3 text-center font-medium text-[var(--muted)]"
                >
                  <Link href={capabilityHref(dimension)} className="hover:underline">
                    {DIMENSION_LABELS[dimension]}
                  </Link>
                </th>
              ))}
              <th
                scope="col"
                className="min-w-24 border-b border-[var(--rule)] px-3 py-3 text-right font-medium text-[var(--muted)]"
              >
                Coverage
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.iso3}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 whitespace-nowrap border-b border-[var(--rule-soft)] bg-[var(--surface)] px-3 py-2.5 text-left font-normal"
                >
                  <Link href={agendaHref(row.iso3)} className="hover:underline">
                    <CountryLabel iso3={row.iso3} name={row.country} />
                  </Link>
                </th>
                {DIMENSIONS.map((dimension) => {
                  const cell = row.cells[dimension]
                  const selected = active.iso3 === row.iso3 && active.dimension === dimension
                  const titles = cell.records.map((record) => record.title).join('; ')
                  return (
                    <td
                      key={dimension}
                      className="border-b border-[var(--rule-soft)] px-2 py-2 text-center tabular-nums"
                    >
                      {cell.records.length > 0 ? (
                        <Link
                          href={cellHref(row.iso3, dimension)}
                          aria-current={selected ? 'location' : undefined}
                          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-medium transition-colors hover:border-[var(--primary)] hover:bg-[var(--surface-sunken)] ${
                            selected
                              ? 'border-[var(--primary)] bg-[var(--surface-sunken)]'
                              : 'border-[var(--rule)]'
                          }`}
                        >
                          <span aria-hidden="true">{cell.records.length}</span>
                          <span className="sr-only">
                            {cell.records.length} documented {cell.records.length === 1 ? 'delivery' : 'deliveries'} for {row.country}, {DIMENSION_LABELS[dimension]}: {titles}
                          </span>
                        </Link>
                      ) : (
                        <span
                          className="text-[var(--muted)]"
                          aria-label={`No documented delivery for ${row.country}, ${DIMENSION_LABELS[dimension]}`}
                        >
                          —
                        </span>
                      )}
                    </td>
                  )
                })}
                <td className="border-b border-[var(--rule-soft)] px-3 py-2 text-right tabular-nums">
                  <span>{row.capabilitiesCovered}/{DIMENSIONS.length}</span>
                  <span className="block text-[var(--muted)]">
                    {row.recordCount} {row.recordCount === 1 ? 'record' : 'records'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 border-t border-[var(--rule)] bg-[var(--surface)] px-3 py-3 text-left font-medium text-[var(--muted)]"
              >
                Countries with a record
              </th>
              {DIMENSIONS.map((dimension) => {
                const total = coverage.dimensionTotals[dimension]
                return (
                  <td
                    key={dimension}
                    className="border-t border-[var(--rule)] px-2 py-3 text-center tabular-nums"
                  >
                    <span>{total.countries}/{COUNTRY_ISO3.length}</span>
                    <span className="block text-[var(--muted)]">{total.records} records</span>
                  </td>
                )
              })}
              <td className="border-t border-[var(--rule)] px-3 py-3 text-right tabular-nums">
                {coverage.countriesRepresented}/{COUNTRY_ISO3.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
