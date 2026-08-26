import { notFound } from 'next/navigation'
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
  ConfidenceBar,
  Eyebrow,
  PageTitle,
  Score,
  Scroller,
  Section,
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
                          <Td align="right">
                            <Score value={row.normalized} size="sm" />
                          </Td>
                          <Td dim>{row.source}</Td>
                          <Td dim>
                            {row.status === 'gap'
                              ? gapLabel(
                                  evidence.filter((e) => e.indicatorId === row.indicatorId).length,
                                )
                              : row.status}
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
