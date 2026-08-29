'use client'

import { LEVERAGE_DIMENSION_LABELS, LEVERAGE_DIMENSIONS } from '@ncb/core'
import type { LeverageCell, LeverageDimension, LeverageFile } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { CountryLabel, Note, Section } from '@/components/ui'

type LeverageRow = {
  iso3: string
  country: string
  dimension: LeverageDimension
  cell: LeverageCell
}

function ValueCell({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="rounded-md border border-dashed border-[var(--rule)] px-2 py-1 text-[var(--muted)]">
        null
      </span>
    )
  }
  return <span className="tabular-nums">{value.toFixed(1)}</span>
}

export function LeverageView({ leverage }: { leverage: LeverageFile }) {
  const rows: LeverageRow[] = Object.entries(leverage.countries).flatMap(
    ([iso3, dimensions]) =>
      LEVERAGE_DIMENSIONS.map((dimension) => ({
        iso3,
        country: iso3,
        dimension,
        cell: dimensions[dimension] as LeverageCell,
      })),
  )

  return (
    <>
      <Section
        title="The fixture keeps access separate from capability"
        hint="Each row is one country and provisional leverage resource. Sort the table to inspect the weighted inputs; the null rows mark sources that have not been integrated."
      >
        <Note>
          This is an offline fixture. Six dimensions use transparent public-data proxies from the
          foundation output. Five dimensions remain null with an explicit future-work note. No
          leverage value enters the benchmark score, confidence, agenda, country page, or ranking.
        </Note>
        <DataTable
          rows={rows}
          initialSort={{ key: 'country' }}
          caption="Provisional exponential leverage by country and resource"
          columns={[
            {
              key: 'country',
              label: 'Country',
              sort: (row) => row.country,
              render: (row) => <CountryLabel iso3={row.iso3} name={row.country} />,
            },
            {
              key: 'dimension',
              label: 'Resource',
              sort: (row) => LEVERAGE_DIMENSION_LABELS[row.dimension],
              render: (row) => LEVERAGE_DIMENSION_LABELS[row.dimension],
            },
            {
              key: 'value',
              label: 'Value',
              align: 'right',
              sort: (row) => row.cell.value,
              render: (row) => <ValueCell value={row.cell.value} />,
            },
            {
              key: 'rawValue',
              label: 'Input',
              align: 'right',
              sort: (row) => row.cell.rawValue,
              render: (row) =>
                row.cell.rawValue === null ? (
                  <span className="text-[var(--muted)]">null</span>
                ) : (
                  row.cell.rawValue.toFixed(3)
                ),
            },
            {
              key: 'weight',
              label: 'Weight',
              align: 'right',
              sort: (row) => row.cell.weight,
              render: (row) => row.cell.weight,
            },
            {
              key: 'offset',
              label: 'Base offset',
              align: 'right',
              sort: (row) => row.cell.baseOffset,
              render: (row) => row.cell.baseOffset,
            },
            {
              key: 'source',
              label: 'Source',
              render: (row) =>
                row.cell.source ? (
                  <span title={row.cell.note}>
                    {row.cell.source.publisher}, {row.cell.source.year}
                  </span>
                ) : (
                  <span title={row.cell.note} className="text-[var(--muted)]">
                    future work
                  </span>
                ),
            },
          ]}
        />
      </Section>

      <Section
        title="The weighted sum is a placeholder"
        hint="The current formula is min(100, rawValue × weight + baseOffset). The input is the current normalized foundation value divided by 100, which makes this fixture useful for testing the shape while dedicated source adapters remain future work."
      >
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          The source field identifies the foundation indicator and year behind each populated cell.
          It does not claim that the indicator is a settled measure of leverage. A later review can
          replace the input and constants without changing the foundation layer.
        </p>
      </Section>
    </>
  )
}
