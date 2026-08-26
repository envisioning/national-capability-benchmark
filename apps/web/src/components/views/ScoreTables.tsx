'use client'

import Link from 'next/link'
import { COUNTRY_FRAMES, DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import type { CountryResult } from '@ncb/core'
import { DataTable, type Column } from '@/components/DataTable'
import { ConfidenceBar, ScoreCell } from '@/components/ui'

function countryColumn(): Column<CountryResult> {
  return {
    key: 'country',
    label: 'Country',
    sort: (c) => c.country,
    render: (c) => (
      <Link href={`/country/${c.iso3}`} className="hover:underline">
        {c.country}
        {COUNTRY_FRAMES[c.iso3] === 'extended' ? (
          <span className="ml-2 text-[var(--muted)]" title="Added after the frame was fixed">
            ext
          </span>
        ) : null}
      </Link>
    ),
  }
}

export function ScoreTable({ countries }: { countries: CountryResult[] }) {
  return (
    <DataTable
      rows={countries}
      initialSort={{ key: 'country' }}
      caption="Dimension scores by country"
      columns={[
        countryColumn(),
        ...DIMENSIONS.map((d) => ({
          key: d,
          label: DIMENSION_LABELS[d],
          align: 'right' as const,
          sort: (c: CountryResult) => c.dimensions[d]?.score ?? null,
          render: (c: CountryResult) => <ScoreCell value={c.dimensions[d]?.score ?? null} />,
        })),
      ]}
    />
  )
}

export function ConfidenceTable({ countries }: { countries: CountryResult[] }) {
  return (
    <DataTable
      rows={countries}
      initialSort={{ key: 'country' }}
      caption="Confidence by country and dimension"
      columns={[
        countryColumn(),
        ...DIMENSIONS.map((d) => ({
          key: d,
          label: DIMENSION_LABELS[d],
          align: 'right' as const,
          sort: (c: CountryResult) => c.dimensions[d]?.confidence ?? null,
          render: (c: CountryResult) => <ConfidenceBar value={c.dimensions[d]?.confidence ?? 0} />,
        })),
      ]}
    />
  )
}
