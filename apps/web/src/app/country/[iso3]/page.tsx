import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { IndicatorResult } from '@ncb/core'
import {
  COUNTRIES,
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS_BY_ID,
  contestedDisputeCounts,
  isDelphiRunForDataset,
  isEvidential,
  isPanel,
} from '@ncb/core'
import { DIMENSION_ICON, Icon, STATUS_ICON } from '@/components/Icon'
import { CountryLede } from '@/components/CountryLede'
import { CompareRadar } from '@/components/views/CompareRadar'
import { CheckList } from '@/components/views/CheckList'
import { CountryDimensionTable } from '@/components/views/CountryDimensionTable'
import { EvidenceList } from '@/components/views/EvidenceList'
import { IndicatorPeek } from '@/components/views/IndicatorPeek'
import { EmbedCode } from '@/components/EmbedCode'
import Link from 'next/link'
import {
  ClassBadge,
  ClassLegend,
  DefineLink,
  Delta,
  CountryLabel,
  PageTitle,
  PanelProvenanceNote,
  Score,
  Scroller,
  Section,
  Sparkline,
  Table,
  Td,
  Th,
} from '@/components/ui'
import {
  absoluteHref,
  capabilityHref,
  countryCsvHref,
  countryLocalHref,
  embedCountryHref,
  ogCountryHref,
} from '@/lib/links'
import { loadAgenda } from '@/lib/agenda'
import { loadCountry, loadDelphiRun, loadDisputes, loadEvidence, loadIndex } from '@/lib/data'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso3: string }>
}): Promise<Metadata> {
  const { iso3 } = await params
  const name = COUNTRY_NAMES[iso3.toUpperCase()]
  if (!name) return {}
  return {
    title: `${name}, NCB`,
    description: `${name} across nine capability dimensions: every score, its confidence, and every indicator behind it.`,
    openGraph: {
      images: [{ url: ogCountryHref(iso3.toUpperCase()), width: 1200, height: 630, alt: `${name} country profile` }],
    },
    twitter: { card: 'summary_large_image', images: [ogCountryHref(iso3.toUpperCase())] },
  }
}

export default async function CountryPage({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const country = await loadCountry(iso3)
  if (!country) notFound()
  const [data, agenda, loadedRun, allEvidence, disputes] = await Promise.all([
    loadIndex(),
    loadAgenda(country.iso3),
    loadDelphiRun(),
    loadEvidence(),
    loadDisputes(),
  ])
  /* A mock run exercises the pipeline and is never presented as evidence, so
   * the page treats it as no run at all. See the provenance invariant. */
  const run =
    loadedRun &&
    data?.version &&
    isDelphiRunForDataset(loadedRun, data.version) &&
    isEvidential(loadedRun.provenance)
      ? loadedRun
      : null
  const evidence = allEvidence.filter((e) => e.iso3 === country.iso3)
  const contestedCounts = contestedDisputeCounts(disputes)
  const meta = COUNTRIES.find((c) => c.iso3 === country.iso3)
  const others = (data?.countries ?? []).filter((c) => c.iso3 !== country.iso3)
  const countryHasEstimates = (run?.cellEstimates ?? []).some((e) => e.iso3 === country.iso3)

  return (
    <>
      <PageTitle>
        <CountryLabel iso3={country.iso3} name={country.country} />
      </PageTitle>

      {agenda ? (
        <div className="mt-6">
          <CountryLede agenda={agenda} reason={meta?.reason} />
        </div>
      ) : (
        <p className="mb-10 mt-3 text-lg leading-relaxed">{meta?.reason}</p>
      )}

      <div className="mb-10 -mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {country.iso3 === 'BRA' ? (
          <p className="text-xs text-[var(--muted)]">
            <Link href={countryLocalHref(country.iso3)} className="underline underline-offset-4">
              Read more on Brazil
            </Link>
          </p>
        ) : null}
        <p className="text-xs text-[var(--muted)]">
          <a href={countryCsvHref(country.iso3)} className="underline underline-offset-4">
            Download this country as CSV
          </a>
        </p>
        <EmbedCode
          src={absoluteHref(embedCountryHref(country.iso3))}
          title={`${country.country} capability radar`}
          height={520}
        />
      </div>

      <div className="mb-10 grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr]">
        <CompareRadar
          focus={toProfile(country)}
          others={others.map(toProfile)}
          contestedCounts={contestedCounts}
        />
        <CountryDimensionTable
          country={country}
          panel={run && countryHasEstimates ? { isPanel: isPanel(run) } : null}
          contestedCounts={contestedCounts}
        />
      </div>

      <div className="mb-12 max-w-3xl rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
          How to read this page
        </p>
        <p className="text-lg leading-relaxed">
          Each <DefineLink term="Dimension">dimension</DefineLink> has a score from 0 to 100. It
          shows where this country sits among all {COUNTRIES.length} countries in the{' '}
          <DefineLink term="Comparison frame">comparison frame</DefineLink>, not a percentage.{' '}
          <DefineLink term="Confidence" /> sits beside the score. A dashed radar edge and hollow
          point mean the evidence is thin. The tables below show each{' '}
          <DefineLink term="Indicator">indicator</DefineLink>, its raw value, year and source.
        </p>
        <p className="mt-3 text-lg leading-relaxed">
          A panel estimate, when present, is a separate judgment about what the indicators miss.
          It does not change the score or confidence. The panel&apos;s provenance is shown beside
          the estimate.
        </p>
        <ClassLegend />
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          A row marked <em>no dataset exists</em> is a{' '}
          <DefineLink term="Gap">gap</DefineLink>: the benchmark wants data that nobody publishes.
          A <em>retired</em> row has a source this project chose not to use. Both reduce confidence.
          The{' '}
          <Link href="/glossary" className="underline underline-offset-4">
            glossary
          </Link>
          , and the places where these numbers are known to be wrong about the world are on the{' '}
          <Link href="/limits" className="underline underline-offset-4">
            limits page
          </Link>
          .
        </p>
      </div>

      {run && countryHasEstimates ? (
        <PanelProvenanceNote provenance={run.provenance} panelists={run.panel.length} />
      ) : null}

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
            <Section
              title={
                <Link href={capabilityHref(d)} className="hover:underline">
                  {DIMENSION_LABELS[d]}
                </Link>
              }
              hint={DIMENSION_QUESTIONS[d]}
              icon={<Icon name={DIMENSION_ICON[d]} size={22} />}
            >
              {dim.momentum.length > 0 ? (
                <div className="mb-6 space-y-3">
                  {dim.momentum.map((m) => (
                    <div key={m.baseYear} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Sparkline series={m.series} />
                      <p className="text-xs leading-relaxed text-[var(--muted)]">
                    <Delta value={m.delta} /> over {m.currentYear - m.baseYear} years, from{' '}
                    {m.baseScore.toFixed(1)} in {m.baseYear} to {m.currentScore.toFixed(1)} on
                    {` ${m.matchedIndicators}`} indicators seen in both years
                        {m.clamped > 0
                          ? `, with ${m.clamped} at the frame edge`
                          : ''}
                        .
                      </p>
                    </div>
                  ))}
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    Trends use fewer indicators than the current score and use today&apos;s frame. A
                    longer span reaches further back.
                  </p>
                </div>
              ) : (
                <p className="mb-6 text-xs leading-relaxed text-[var(--muted)]">
                  No trend is shown because too few indicators have values at both ends. The rows
                  below still show the available history.
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
                            {row.status === 'observed' ? (
                              <IndicatorPeek indicatorId={row.indicatorId} iso3={country.iso3}>
                                {row.name}
                              </IndicatorPeek>
                            ) : (
                              <span title={def?.notes}>{row.name}</span>
                            )}
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
                            {row.status === 'observed' && row.normalized !== null ? (
                              <IndicatorPeek indicatorId={row.indicatorId} iso3={country.iso3}>
                                <Score value={row.normalized} size="sm" />
                              </IndicatorPeek>
                            ) : (
                              <Score value={row.normalized} size="sm" />
                            )}
                            {row.outOfFrame ? (
                              <span
                                className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-[var(--muted)]"
                                title="The raw value sits outside the frame, so this position is clamped to the edge of the scale."
                              >
                                <Icon name="triangle-alert" size={11} />
                                clamped
                              </span>
                            ) : null}
                          </Td>
                          <Td dim>{row.source}</Td>
                          <Td dim>
                            <span className="inline-flex items-center gap-1.5">
                              <Icon name={STATUS_ICON[row.status]} size={13} />
                              {row.status === 'gap'
                                ? gapLabel(
                                    evidence.filter((e) => e.indicatorId === row.indicatorId).length,
                                  )
                                : row.status === 'retired'
                                  ? 'retired, see notes'
                                  : row.status}
                            </span>
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

              <CheckList checks={dim.checks} />

              <EvidenceList records={evidence.filter((e) => INDICATORS_BY_ID[e.indicatorId]?.dimension === d)} />

              {finals.length > 0 && run ? (
                <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
                    {isPanel(run) ? 'Panel estimate' : 'Session estimate'}, round{' '}
                    {finalRound},{' '}
                    <Link href="/delphi" className="underline underline-offset-4">
                      how this layer works
                    </Link>
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
