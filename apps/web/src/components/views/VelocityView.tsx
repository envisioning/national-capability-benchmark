'use client'

import { DIMENSION_LABELS, DIMENSIONS } from '@ncb/core'
import type { Dimension, VelocityCell, VelocityFile } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { CountryLabel, Note, Section } from '@/components/ui'

type VelocityRow = {
  iso3: string
  country: string
  dimension: Dimension
  cell: VelocityCell | null
  excluded: boolean
}

function numeric(value: string): number {
  return Number(value)
}

function latestValue(cell: VelocityCell): string {
  return cell[`v${cell.latestYear}`] as string
}

export function VelocityView({ velocity }: { velocity: VelocityFile }) {
  const excluded = new Map(velocity.exclusions.map((entry) => [entry.iso3, entry.reason]))
  const rows: VelocityRow[] = Object.entries(velocity.countries).flatMap(([iso3, dimensions]) =>
    DIMENSIONS.map((dimension) => ({
      iso3,
      country: iso3,
      dimension,
      cell: dimensions[dimension] ?? null,
      excluded: excluded.has(iso3),
    })),
  )

  return (
    <>
      <Section
        title="Movement, with no ranking"
        hint="Each row is one country and dimension. Sort the table to inspect the exploratory rates; excluded countries remain visible so missing coverage can be challenged."
      >
        <Note>
          This is an offline fixture. Velocity is a placeholder rate derived from the existing
          momentum series and is not used in scores, confidence, agendas, country pages, or public
          rankings.
        </Note>
        {velocity.exclusions.length > 0 ? (
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            Country-level reads are excluded for {velocity.exclusions.length} countries because
            their coverage is too thin for a complete five-year profile. Their supported dimension
            cells remain in this table.
          </p>
        ) : null}
        <DataTable
          rows={rows}
          initialSort={{ key: 'country' }}
          caption="Provisional capability velocity by country and dimension"
          columns={[
            {
              key: 'country',
              label: 'Country',
              sort: (row) => row.country,
              render: (row) => <CountryLabel iso3={row.iso3} name={row.country} />,
            },
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (row) => DIMENSION_LABELS[row.dimension],
              render: (row) => DIMENSION_LABELS[row.dimension],
            },
            {
              key: 'annual',
              label: 'Annual rate',
              align: 'right',
              sort: (row) => (row.cell ? numeric(latestValue(row.cell)) : null),
              render: (row) => row.cell ? latestValue(row.cell) : <span className="text-[var(--muted)]">no data</span>,
            },
            {
              key: 'fiveYear',
              label: 'Five-year rate',
              align: 'right',
              sort: (row) => (row.cell?.v5y ? numeric(row.cell.v5y) : null),
              render: (row) => row.cell?.v5y ?? <span className="text-[var(--muted)]">no data</span>,
            },
            {
              key: 'year',
              label: 'Latest year',
              align: 'right',
              sort: (row) => (row.cell ? row.cell.latestYear : null),
              render: (row) => row.cell?.latestYear ?? <span className="text-[var(--muted)]">no data</span>,
            },
            {
              key: 'status',
              label: 'Coverage',
              sort: (row) => (row.cell ? 'available' : 'missing'),
              render: (row) => {
                if (!row.cell) return <span className="text-[var(--muted)]">no data</span>
                if (row.excluded) {
                  return (
                    <span title={excluded.get(row.iso3)} className="text-[var(--muted)]">
                      partial country
                    </span>
                  )
                }
                return `${row.cell.series.length} annual points`
              },
            },
          ]}
        />
      </Section>

      <Section
        title="The rate is provisional"
        hint="The denominator floors the five percent base-score allowance at five score points. The fixture keeps the signed annual series so the next review can test the formula against gaps, breaks, and changes in the underlying foundation."
      >
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          A cell needs a consecutive annual series and an exact five-year comparison. The
          excluded list is a coverage warning for country-level interpretation, rather than a
          claim that the supported cells are complete.
        </p>
      </Section>
    </>
  )
}
