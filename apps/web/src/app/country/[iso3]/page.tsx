import { notFound } from 'next/navigation'
import type { IndicatorResult } from '@ncb/core'
import {
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS_BY_ID,
} from '@ncb/core'
import { CompareRadar } from '@/components/views/CompareRadar'
import { CountryDimensionTable } from '@/components/views/CountryDimensionTable'
import { EvidenceList } from '@/components/views/EvidenceList'
import {
  ClassBadge,
  Delta,
  ConfidenceBar,
  Eyebrow,
  PageTitle,
  Score,
  Scroller,
  Section,
  Sparkline,
  Table,
  Td,
  Th,
} from '@/components/ui'
import { loadDelphiRun, loadEvidence, loadScores } from '@/lib/data'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export default async function CountryPage({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const data = await loadScores()
  const country = data?.countries.find((c) => c.iso3 === iso3.toUpperCase())
  if (!country) notFound()

  const run = await loadDelphiRun()
  const evidence = (await loadEvidence()).filter((e) => e.iso3 === country.iso3)
  const meta = COUNTRIES.find((c) => c.iso3 === country.iso3)
  const others = (data?.countries ?? []).filter((c) => c.iso3 !== country.iso3)

  return (
    <>
      <div className="mb-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div>
          <Eyebrow>In the prototype because</Eyebrow>
          <PageTitle>{country.country}</PageTitle>
          <p className="mt-3 text-lg leading-relaxed">{meta?.reason}</p>
          <div className="mt-4">
            <CompareRadar focus={toProfile(country)} others={others.map(toProfile)} />
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
              {dim.momentum.length > 0 ? (
                <div className="mb-6 space-y-3">
                  {dim.momentum.map((m) => (
                    <div key={m.baseYear} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Sparkline series={m.series} />
                      <p className="text-xs leading-relaxed text-[var(--muted)]">
                        <Delta value={m.delta} /> over {m.currentYear - m.baseYear} years, from{' '}
                        {m.baseScore.toFixed(1)} in {m.baseYear} to {m.currentScore.toFixed(1)} on
                        the {m.matchedIndicators} indicators observed in both years.
                      </p>
                    </div>
                  ))}
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    Each basket is smaller than the score above and is measured against the frame in
                    use today. A longer span reaches further back and holds fewer indicators.
                  </p>
                </div>
              ) : (
                <p className="mb-6 text-xs leading-relaxed text-[var(--muted)]">
                  No trend: too few indicators here are observed at both ends of a span. The
                  indicator lines below still show what history exists.
                </p>
              )}
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
                      <Th>History</Th>
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
                          <Td align="right">
                            <Score value={row.normalized} size="sm" />
                          </Td>
                          <Td dim>{row.source}</Td>
                          <Td dim>
                            {row.status === 'gap'
                              ? gapLabel(
                                  evidence.filter((e) => e.indicatorId === row.indicatorId).length,
                                )
                              : row.status === 'retired'
                                ? 'retired, see notes'
                                : row.status}
                          </Td>
                          <Td>
                            {row.series.length > 1 ? (
                              <span title={seriesTitle(row, def?.unit)}>
                                <Sparkline series={seriesForSparkline(row.series)} width={90} height={22} />
                              </span>
                            ) : (
                              <span className="text-[var(--muted)]">-</span>
                            )}
                          </Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Scroller>

              <EvidenceList records={evidence.filter((e) => INDICATORS_BY_ID[e.indicatorId]?.dimension === d)} />

              {finals.length > 0 ? (
                <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
                    Panel judgment, round {finalRound}
                  </p>
                  <ul className="space-y-4 text-lg leading-relaxed">
                    {finals.map((e) => (
                      <li key={e.panelist}>
                        <Score value={e.score} size="sm" />{' '}
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

/** A gap row says what is missing, and says when somebody wrote down a case anyway. */
function gapLabel(records: number): string {
  if (records === 0) return 'no dataset exists'
  return records === 1 ? 'no dataset exists, 1 record' : `no dataset exists, ${records} records`
}

/** The indicator line uses the same component as the dimension line. */
function seriesForSparkline(
  series: Array<{ year: number; normalized: number }>,
): Array<{ year: number; score: number }> {
  return series.map((p) => ({ year: p.year, score: p.normalized }))
}

/** Everything a reader needs to check the line: count, span, raw ends, tier. */
function seriesTitle(row: IndicatorResult, unit: string | undefined): string {
  const first = row.series[0]
  const last = row.series[row.series.length - 1]
  if (!first || !last) return ''
  const tiers = [...new Set(row.series.map((p) => p.tier))].join(', ').replace(/_/g, ' ')
  const gaps = last.year - first.year + 1 - row.series.length
  return [
    `${row.series.length} observations, ${first.year} to ${last.year}${gaps > 0 ? `, ${gaps} year(s) with no value` : ''}.`,
    `As published: ${first.raw} in ${first.year}, ${last.raw} in ${last.year}${unit ? ` ${unit}` : ''}.`,
    `Source tier: ${tiers}.`,
    'The line plots the normalized value, where higher is always better.',
  ].join(' ')
}
