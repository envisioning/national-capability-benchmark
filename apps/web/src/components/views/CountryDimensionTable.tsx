'use client'

import { CapabilityLink } from '@/components/CapabilityLink'
import { DIMENSIONS, DIMENSION_LABELS, DISSENT_IQR, primaryMomentum } from '@ncb/core'
import type { CountryResult } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { Confidence, Delta, DimensionScore, Score } from '@/components/ui'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { DimensionPeek } from '@/components/views/DimensionPeek'
import { ContestedBadge } from '@/components/ChallengeDialog'
import { scoreAnchorId } from '@/lib/links'

export function CountryDimensionTable({
  country,
  /**
   * How the Delphi layer should be presented, decided by the server page from
   * the run's provenance. `null` means no evidential run: the two estimate
   * columns disappear rather than showing a median of nothing. `isPanel` false
   * means an evidential run without a distribution, so the columns say
   * "estimate" and never "panel". See the provenance invariant.
   */
  panel,
  contestedCounts = {},
}: {
  country: CountryResult
  panel: { isPanel: boolean } | null
  contestedCounts?: Record<string, number>
}) {
  const rows = DIMENSIONS.map((d) => ({ d, dim: country.dimensions[d] })).filter(
    (r): r is { d: (typeof DIMENSIONS)[number]; dim: NonNullable<typeof r.dim> } => Boolean(r.dim),
  )
  const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

  const columns = [
    {
      key: 'dimension',
      label: 'Dimension',
      sort: (r: (typeof rows)[number]) => DIMENSION_LABELS[r.d],
      render: (r: (typeof rows)[number]) => (
        <CapabilityLink dimension={r.d} className="inline-flex items-center gap-2">
          <Icon name={DIMENSION_ICON[r.d]} size={14} className="text-[var(--muted)]" />
          {DIMENSION_LABELS[r.d]}
        </CapabilityLink>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      align: 'right' as const,
      sort: (r: (typeof rows)[number]) => r.dim.score,
      render: (r: (typeof rows)[number]) => (
        <span id={scoreAnchorId(country.iso3, r.d)} className="inline-flex scroll-mt-20 items-center gap-2">
          <span id={`score-${r.d}`} aria-hidden="true" className="scroll-mt-20" />
          <DimensionPeek dimension={r.d} iso3={country.iso3}>
            <DimensionScore dim={r.dim} />
          </DimensionPeek>
          <ContestedBadge count={contestedCounts[`${country.iso3}|${r.d}`] ?? 0} />
        </span>
      ),
    },
    {
      key: 'confidence',
      label: 'Confidence',
      sort: (r: (typeof rows)[number]) => r.dim.confidence,
      render: (r: (typeof rows)[number]) => <Confidence value={r.dim.confidence} />,
    },
    {
      key: 'coverage',
      label: 'Coverage',
      align: 'right' as const,
      sort: (r: (typeof rows)[number]) => r.dim.confidenceParts.coverage,
      render: (r: (typeof rows)[number]) => muted(r.dim.confidenceParts.coverage.toFixed(2)),
    },
    {
      key: 'recency',
      label: 'Recency',
      align: 'right' as const,
      sort: (r: (typeof rows)[number]) => r.dim.confidenceParts.recency,
      render: (r: (typeof rows)[number]) => muted(r.dim.confidenceParts.recency.toFixed(2)),
    },
    {
      key: 'momentum',
      label: 'Since',
      align: 'right' as const,
      sort: (r: (typeof rows)[number]) => primaryMomentum(r.dim.momentum)?.delta ?? null,
      render: (r: (typeof rows)[number]) => {
        const m = primaryMomentum(r.dim.momentum)
        if (!m) return <Delta value={null} />
        return (
          <span className="inline-flex items-center gap-1">
            <Delta
              value={m.delta}
            />
            {/* The basket size is printed, never tooltip only: a trend and a
                score sit on different baskets and the reader must see the size. */}
            <span className="text-[10px] text-[var(--muted)]">({m.matchedIndicators})</span>
            {m.clamped > 0 ? (
              <span className="text-[10px] text-[var(--muted)]">
                <Icon name="triangle-alert" size={11} className="mr-0.5 inline" />
                {m.clamped} at edge
              </span>
            ) : null}
          </span>
        )
      },
    },
  ]

  const panelColumns = panel
    ? [
        {
          key: 'panel',
          label: panel.isPanel ? 'Panel median' : 'Session estimate',
          align: 'right' as const,
          sort: (r: (typeof rows)[number]) => r.dim.delphiScore,
          render: (r: (typeof rows)[number]) => <Score value={r.dim.delphiScore} />,
        },
        {
          key: 'gap',
          label: panel.isPanel ? 'Panel minus indicators' : 'Estimate minus indicators',
          align: 'right' as const,
          sort: (r: (typeof rows)[number]) =>
            r.dim.delphiScore === null || r.dim.score === null
              ? null
              : r.dim.delphiScore - r.dim.score,
          render: (r: (typeof rows)[number]) => {
            if (r.dim.delphiScore === null || r.dim.score === null) return muted('no estimate')
            const g = r.dim.delphiScore - r.dim.score
            /* A gap above a quarter of the scale is the same "unresolved
             * disagreement" threshold the panel uses for dissent, so the two
             * surfaces emphasize divergence at one shared boundary. */
            const wide = Math.abs(g) >= DISSENT_IQR
            return (
              <span
                className={wide ? 'font-medium' : 'text-[var(--muted)]'}
              >
                {g > 0 ? '+' : ''}
                {g.toFixed(1)}
              </span>
            )
          },
        },
      ]
    : []

  return (
    <DataTable
      rows={rows}
      initialSort={{ key: 'score', dir: 'desc' }}
      caption={`${country.country} dimension summary`}
      columns={[...columns, ...panelColumns]}
    />
  )
}
