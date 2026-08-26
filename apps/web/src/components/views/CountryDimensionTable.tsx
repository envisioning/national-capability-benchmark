'use client'

import { DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import type { CountryResult } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { ConfidenceBar, Delta, Score } from '@/components/ui'

export function CountryDimensionTable({ country }: { country: CountryResult }) {
  const rows = DIMENSIONS.map((d) => ({ d, dim: country.dimensions[d] })).filter(
    (r): r is { d: (typeof DIMENSIONS)[number]; dim: NonNullable<typeof r.dim> } => Boolean(r.dim),
  )
  const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

  return (
    <DataTable
      rows={rows}
      initialSort={{ key: 'score', dir: 'desc' }}
      caption={`${country.country} dimension summary`}
      columns={[
        {
          key: 'dimension',
          label: 'Dimension',
          sort: (r) => DIMENSION_LABELS[r.d],
          render: (r) => (
            <a href={`#${r.d}`} className="hover:underline">
              {DIMENSION_LABELS[r.d]}
            </a>
          ),
        },
        {
          key: 'score',
          label: 'Score',
          align: 'right',
          sort: (r) => r.dim.score,
          render: (r) => <Score value={r.dim.score} />,
        },
        {
          key: 'confidence',
          label: 'Confidence',
          sort: (r) => r.dim.confidence,
          render: (r) => <ConfidenceBar value={r.dim.confidence} />,
        },
        {
          key: 'coverage',
          label: 'Coverage',
          align: 'right',
          sort: (r) => r.dim.confidenceParts.coverage,
          render: (r) => muted(r.dim.confidenceParts.coverage.toFixed(2)),
        },
        {
          key: 'recency',
          label: 'Recency',
          align: 'right',
          sort: (r) => r.dim.confidenceParts.recency,
          render: (r) => muted(r.dim.confidenceParts.recency.toFixed(2)),
        },
        {
          key: 'momentum',
          label: 'Since',
          align: 'right',
          sort: (r) => r.dim.momentum?.delta ?? null,
          render: (r) => {
            const m = r.dim.momentum
            return (
              <Delta
                value={m?.delta ?? null}
                title={
                  m
                    ? `Change since ${m.baseYear}, on the ${m.matchedIndicators} indicators observed in both years. ${m.baseScore.toFixed(1)} to ${m.currentScore.toFixed(1)} on that basket.`
                    : 'Too few indicators observed in both years'
                }
              />
            )
          },
        },
        {
          key: 'panel',
          label: 'Panel median',
          align: 'right',
          sort: (r) => r.dim.delphiScore,
          render: (r) => <Score value={r.dim.delphiScore} />,
        },
        {
          key: 'gap',
          label: 'Panel minus indicators',
          align: 'right',
          sort: (r) =>
            r.dim.delphiScore === null || r.dim.score === null
              ? null
              : r.dim.delphiScore - r.dim.score,
          render: (r) => {
            if (r.dim.delphiScore === null || r.dim.score === null) return muted('no run')
            const g = r.dim.delphiScore - r.dim.score
            return (
              <span className={Math.abs(g) >= 15 ? 'font-medium' : 'text-[var(--muted)]'}>
                {g > 0 ? '+' : ''}
                {g.toFixed(1)}
              </span>
            )
          },
        },
      ]}
    />
  )
}
