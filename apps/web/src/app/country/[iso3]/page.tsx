import { notFound } from 'next/navigation'
import {
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS_BY_ID,
} from '@ncb/core'
import { Radar } from '@/components/Radar'
import { CountryDimensionTable } from '@/components/views/CountryDimensionTable'
import {
  ClassBadge,
  ConfidenceBar,
  Eyebrow,
  PageTitle,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'
import { loadDelphiRun, loadScores } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function CountryPage({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const data = await loadScores()
  const country = data?.countries.find((c) => c.iso3 === iso3.toUpperCase())
  if (!country) notFound()

  const run = await loadDelphiRun()
  const meta = COUNTRIES.find((c) => c.iso3 === country.iso3)

  return (
    <>
      <div className="mb-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div>
          <Eyebrow>In the prototype because</Eyebrow>
          <PageTitle>{country.country}</PageTitle>
          <p className="mt-3 text-lg leading-relaxed">{meta?.reason}</p>
          <div className="mt-4">
            <Radar
              series={[
                {
                  label: country.country,
                  values: DIMENSIONS.map((d) => country.dimensions[d]?.score ?? null),
                  color: 'var(--primary)',
                },
              ]}
            />
          </div>
        </div>

        <CountryDimensionTable country={country} />
      </div>

      {DIMENSIONS.map((d) => {
        const dim = country.dimensions[d]
        if (!dim) return null
        const estimates = (run?.cellEstimates ?? []).filter(
          (e) => e.iso3 === country.iso3 && e.dimension === d,
        )
        const finalRound = estimates.length ? Math.max(...estimates.map((e) => e.round)) : 0
        const finals = estimates.filter((e) => e.round === finalRound)

        return (
          <div key={d} id={d} className="scroll-mt-20">
            <Section title={DIMENSION_LABELS[d]} hint={DIMENSION_QUESTIONS[d]}>
              <Scroller>
                <Table>
                  <thead>
                    <tr>
                      <Th>Indicator</Th>
                      <Th>Class</Th>
                      <Th align="right">Raw</Th>
                      <Th>Unit</Th>
                      <Th align="right">Year</Th>
                      <Th align="right">Normalized</Th>
                      <Th>Source</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {dim.indicators.map((row) => {
                      const def = INDICATORS_BY_ID[row.indicatorId]
                      return (
                        <tr key={row.indicatorId}>
                          <Td>
                            <span title={def?.notes}>{row.name}</span>
                          </Td>
                          <Td>
                            <ClassBadge value={row.measurementClass} />
                          </Td>
                          <Td align="right">{row.raw ?? 'no data'}</Td>
                          <Td dim>{def?.unit}</Td>
                          <Td align="right" dim>
                            {row.year ?? ''}
                          </Td>
                          <Td align="right">{row.normalized?.toFixed(1) ?? ''}</Td>
                          <Td dim>{row.source}</Td>
                          <Td dim>
                            {row.status === 'gap' ? 'no dataset exists' : row.status}
                          </Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Scroller>

              {finals.length > 0 ? (
                <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
                    Panel judgment, round {finalRound}
                  </p>
                  <ul className="space-y-4 text-lg leading-relaxed">
                    {finals.map((e) => (
                      <li key={e.panelist}>
                        <span className="font-medium tabular-nums">{e.score.toFixed(1)}</span>{' '}
                        <span className="text-xs text-[var(--muted)]">
                          {e.panelist}, self-confidence {e.selfConfidence.toFixed(2)}
                        </span>
                        <p>{e.rationale}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Section>
          </div>
        )
      })}
    </>
  )
}
