'use client'

import Link from 'next/link'
import { DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import type { CountryResult } from '@ncb/core'
import { DataTable, type Column } from '@/components/DataTable'
import { countryProfileHref } from '@/lib/links'
import { Confidence, CountryLabel, DimensionScore } from '@/components/ui'
import { ContestedBadge } from '@/components/ChallengeDialog'

function countryColumn(): Column<CountryResult> {
  return {
    key: 'country',
    label: 'Country',
    sort: (c) => c.country,
    render: (c) => (
      <Link href={countryProfileHref(c.iso3)} className="hover:underline">
        <CountryLabel iso3={c.iso3} name={c.country} />
      </Link>
    ),
  }
}

export function ScoreTable({
  countries,
  contestedCounts = {},
}: {
  countries: CountryResult[]
  contestedCounts?: Record<string, number>
}) {
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
          render: (c: CountryResult) => {
            const dim = c.dimensions[d] ?? null
            return (
              <span className="inline-flex items-center gap-2">
                <DimensionScore dim={dim} />
                <ContestedBadge count={contestedCounts[`${c.iso3}|${d}`] ?? 0} />
              </span>
            )
          },
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
          render: (c: CountryResult) => (
            <Confidence value={c.dimensions[d]?.confidence ?? null} />
          ),
        })),
      ]}
    />
  )
}
