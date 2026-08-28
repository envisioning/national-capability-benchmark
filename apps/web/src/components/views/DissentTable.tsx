'use client'

import Link from 'next/link'
import { DIMENSION_LABELS, type CellConsensus } from '@ncb/core'
import { CapabilityLink } from '@/components/CapabilityLink'
import { DataTable } from '@/components/DataTable'
import { countryProfileHref } from '@/lib/links'
import { CountryLabel, Score } from '@/components/ui'

export function DissentTable({ rows }: { rows: CellConsensus[] }) {
  return (
    <DataTable
      rows={rows}
      initialSort={{ key: 'iqr', dir: 'desc' }}
      caption="Cells where the panel does not agree"
      columns={[
        {
          key: 'country',
          label: 'Country',
          sort: (c) => c.country,
          render: (c) => (
            <Link href={countryProfileHref(c.iso3)} className="hover:underline">
              <CountryLabel iso3={c.iso3} name={c.country} />
            </Link>
          ),
        },
        {
          key: 'dimension',
          label: 'Dimension',
          sort: (c) => DIMENSION_LABELS[c.dimension],
          render: (c) => <CapabilityLink dimension={c.dimension} />,
        },
        { key: 'median', label: 'Median', align: 'right', sort: (c) => c.median, render: (c) => <Score value={c.median} size="sm" /> },
        { key: 'iqr', label: 'IQR', align: 'right', sort: (c) => c.iqr, render: (c) => c.iqr.toFixed(1) },
        {
          key: 'range',
          label: 'Range',
          align: 'right',
          sort: (c) => c.max - c.min,
          render: (c) => (
            <span className="text-[var(--muted)]">
              {c.min.toFixed(1)} to {c.max.toFixed(1)}
            </span>
          ),
        },
      ]}
    />
  )
}
