'use client'

import Link from 'next/link'
import { COUNTRY_NAMES, DIMENSION_LABELS, DIMENSIONS } from '@ncb/core'
import type { Dimension, ResidualCell, ResidualFile, ResidualFit } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { CountryLabel, DefineLink, Note, Section } from '@/components/ui'
import { artefactHref, decisionHref } from '@/lib/links'

type ResidualRow = {
  iso3: string
  country: string
  cells: Record<Dimension, ResidualCell | null>
}

function Missing({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--muted)]">{children}</span>
}

function signed(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}`
}

/**
 * One country's distance from the income line, in score points.
 *
 * Not a score, so it never takes the band ramp. A gap no larger than its own
 * column's spread is inside the noise of that fit and prints quiet. A fitted
 * value outside the 0 to 100 scale prints in brackets, because the gap carries
 * the impossible part of the prediction with it.
 */
function Gap({ cell, fit }: { cell: ResidualCell | null; fit: ResidualFit | null }) {
  if (!cell) return <Missing>no data</Missing>
  const spread = fit?.residualSd ?? 0
  const inside = Math.abs(cell.residual) <= spread
  return (
    <span className={`tabular-nums ${inside ? 'text-[var(--muted)]' : ''}`}>
      {cell.outOfScale ? `[${signed(cell.residual)}]` : signed(cell.residual)}
    </span>
  )
}

export function ResidualView({ residual }: { residual: ResidualFile }) {
  const fits = new Map(residual.fits.map((fit) => [fit.dimension, fit]))
  const rows: ResidualRow[] = Object.entries(residual.countries).map(([iso3, cells]) => ({
    iso3,
    country: COUNTRY_NAMES[iso3] ?? iso3,
    cells: Object.fromEntries(
      DIMENSIONS.map((dimension) => [dimension, cells[dimension] ?? null]),
    ) as Record<Dimension, ResidualCell | null>,
  }))
  const every = rows.flatMap((row) => DIMENSIONS.map((dimension) => row.cells[dimension]))
  const observed = every.filter((cell) => cell).length
  const outOfScale = every.filter((cell) => cell?.outOfScale).length
  const weak = residual.fits.filter((fit) => fit.fitStrength === 'weak')

  return (
    <>
      <Section
        title="One income line per dimension"
        hint="Read a gap against the spread of its own dimension. A gap smaller than that spread sits inside the noise of the fit."
      >
        <Note>
          This is an offline fixture. No score, confidence, agenda or country page reads it. The
          nine numbers are never added together, because nine residuals averaged into one figure is
          the ranking this benchmark withholds.
        </Note>
        <DataTable
          rows={residual.fits}
          initialSort={{ key: 'explained', dir: 'desc' }}
          caption="The fitted income line for each dimension"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (fit) => DIMENSION_LABELS[fit.dimension],
              render: (fit) => DIMENSION_LABELS[fit.dimension],
            },
            {
              key: 'slope',
              label: 'Points per 10× income',
              align: 'right',
              sort: (fit) => fit.slope,
              render: (fit) => <span className="tabular-nums">{fit.slope.toFixed(1)}</span>,
            },
            {
              key: 'explained',
              label: 'Income explained',
              align: 'right',
              sort: (fit) => fit.rSquared,
              render: (fit) => (
                <span className="tabular-nums">{`${Math.round(fit.rSquared * 100)}%`}</span>
              ),
            },
            {
              key: 'strength',
              label: 'Fit',
              sort: (fit) => fit.rSquared,
              render: (fit) => fit.fitStrength,
            },
            {
              key: 'spread',
              label: 'Fit spread',
              align: 'right',
              sort: (fit) => fit.residualSd,
              render: (fit) => <span className="tabular-nums">{fit.residualSd.toFixed(1)}</span>,
            },
            {
              key: 'shift',
              label: 'Mean order shift',
              align: 'right',
              sort: (fit) => fit.meanAbsRankShift,
              render: (fit) => (
                <span className="tabular-nums">{`${fit.meanAbsRankShift.toFixed(1)} of ${fit.n}`}</span>
              ),
            },
          ]}
        />
        {weak.length > 0 ? (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            Income explains under a quarter of{' '}
            {weak.map((fit) => DIMENSION_LABELS[fit.dimension]).join(' and ')}. Countries move
            fewest places on those two when the line comes out, so read a weak fit as the score
            with an income caveat beside it.
          </p>
        ) : null}
      </Section>

      <Section
        title="Above the line here, below it there"
        hint="One row per country, one column per dimension, each cell in score points. Sort by a dimension to see who is furthest from its line."
      >
        <DataTable
          rows={rows}
          initialSort={{ key: 'country' }}
          caption="Provisional wealth residual, one row per country"
          columns={[
            {
              key: 'country',
              label: 'Country',
              sort: (row) => row.country,
              render: (row) => <CountryLabel iso3={row.iso3} name={row.country} />,
            },
            ...DIMENSIONS.map((dimension) => {
              const fit = fits.get(dimension) ?? null
              return {
                key: dimension,
                label: DIMENSION_LABELS[dimension],
                align: 'right' as const,
                sort: (row: ResidualRow) => row.cells[dimension]?.residual ?? null,
                render: (row: ResidualRow) => <Gap cell={row.cells[dimension]} fit={fit} />,
              }
            }),
          ]}
        />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          A quiet number sits inside the spread of its own column and is not a finding. Brackets
          mark a fitted value the 0 to 100 scale cannot hold. Read each cell against the fit and
          spread shown in the first table. Venezuela and Cuba carry no income observation, so they
          read no data across the row and stay visible rather than being dropped.
        </p>
      </Section>

      <Section
        title="A gap is only as good as its fit"
        hint="The layer stays offline until a review answers these. The method is in D68 and the promotion gate is in D65."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed text-[var(--muted)]">
          <li>
            The gap inherits every artefact in the score. A score that is wrong about the world
            makes a gap that is wrong about the world and larger with it. China reads +74.8 on
            Experimentation from a score of 100 that{' '}
            <Link href={artefactHref('A1')} className="underline decoration-dotted underline-offset-4">
              A1
            </Link>{' '}
            attributes to patent filings.
          </li>
          <li>
            A country helps fit the line it is then measured against. The widest gaps pull the line
            toward themselves, so they understate what the same country would read against the
            other 49.
          </li>
          {outOfScale > 0 ? (
            <li>
              A straight line can predict a score that cannot exist. The fitted value falls below
              zero on {outOfScale} of {observed} cells, all of them in the poorest countries, and
              the gap carries that impossible part with it.
            </li>
          ) : null}
        </ul>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          A negative gap describes a fitted line and says nothing about effort or intent. See{' '}
          <DefineLink term="Wealth residual" /> for what the number means, and{' '}
          <Link href={decisionHref('D68')} className="underline decoration-dotted underline-offset-4">
            D68
          </Link>{' '}
          for why the nine are never summed.
        </p>
      </Section>
    </>
  )
}
