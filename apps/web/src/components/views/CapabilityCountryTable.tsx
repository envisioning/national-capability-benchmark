'use client'

import Link from 'next/link'
import { DIMENSION_LABELS, confidenceBand, isThinEvidence } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { Distribution } from '@/components/Distribution'
import { ConfidenceBar, CountryLabel, Delta, DimensionScore } from '@/components/ui'
import { countryProfileHref } from '@/lib/links'

export type CapabilityCountryRow = {
  iso3: string
  country: string
  score: number | null
  belowCoverageFloor: boolean
  observedIndicators: number
  confidence: number
  delta: number | null
  baseYear: number | null
  currentYear: number | null
  matchedIndicators: number | null
}

/**
 * One capability across the full country set.
 *
 * The table opens alphabetically so the page does not quietly become a
 * ranking. A reader can sort by score, confidence or trend when that is the
 * comparison they want to make.
 */
export function CapabilityCountryTable({
  dimension,
  rows,
  indicatorCount,
}: {
  dimension: Dimension
  rows: CapabilityCountryRow[]
  indicatorCount: number
}) {
  const scored = rows.filter((row): row is CapabilityCountryRow & { score: number } => row.score !== null)

  return (
    <>
      {scored.length > 0 ? (
        <div className="mb-8">
          <Distribution
            points={scored.map((row) => ({
              key: row.iso3,
              label: row.country,
              value: row.score,
              detail: `${confidenceBand(row.confidence).label} evidence`,
              hollow: isThinEvidence(row.confidence),
            }))}
          />
        </div>
      ) : null}
      <DataTable
      rows={rows}
      initialSort={{ key: 'country' }}
      caption={`${DIMENSION_LABELS[dimension]} scores by country`}
      columns={[
        {
          key: 'country',
          label: 'Country',
          sort: (row) => row.country,
          render: (row) => (
            <Link href={countryProfileHref(row.iso3)} className="hover:underline">
              <CountryLabel iso3={row.iso3} name={row.country} />
            </Link>
          ),
        },
        {
          key: 'score',
          label: 'Score',
          align: 'right',
          sort: (row) => row.score,
          render: (row) => <DimensionScore dim={row} />,
        },
        {
          key: 'confidence',
          label: 'Confidence',
          align: 'right',
          sort: (row) => row.confidence,
          render: (row) => <ConfidenceBar value={row.confidence} />,
        },
        {
          key: 'coverage',
          label: 'Observed',
          align: 'right',
          sort: (row) => row.observedIndicators,
          render: (row) => (
            <span className="text-[var(--muted)]">
              {row.observedIndicators} of {indicatorCount}
            </span>
          ),
        },
        {
          key: 'trend',
          label: 'Trend',
          align: 'right',
          sort: (row) => row.delta,
          render: (row) => {
            if (row.delta === null) return <Delta value={null} />
            return (
              <span className="inline-flex items-center gap-1">
                <Delta
                  value={row.delta}
                  title={`Change from ${row.baseYear} to ${row.currentYear} using ${row.matchedIndicators} indicators.`}
                />
                <span className="text-[10px] text-[var(--muted)]">
                  ({row.matchedIndicators})
                </span>
              </span>
            )
          },
        },
      ]}
    />
    </>
  )
}
