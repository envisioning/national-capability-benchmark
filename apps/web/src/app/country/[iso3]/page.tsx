import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CountryLede } from '@/components/CountryLede'
import { CompareRadar } from '@/components/views/CompareRadar'
import { CheckList } from '@/components/views/CheckList'
import { CountryDimensionTable } from '@/components/views/CountryDimensionTable'
import { CountryIndicatorList } from '@/components/views/CountryIndicatorList'
import { EvidenceList } from '@/components/views/EvidenceList'
import Link from 'next/link'
import {
  Card,
  ClassLegend,
  ConfidenceLegend,
  DefineLink,
  Delta,
  CountryLabel,
  PageTitle,
  PanelProvenanceNote,
  Score,
  Section,
  Sparkline,
} from '@/components/ui'
import { capabilityHref, countryCsvHref, ogCountryHref } from '@/lib/links'
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
        <p className="text-xs text-[var(--muted)]">
          <a href={countryCsvHref(country.iso3)} className="underline underline-offset-4">
            Download this country as CSV
          </a>
        </p>
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

      <Card className="mb-12 max-w-3xl">
        <p className="mb-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
          How to read this page
        </p>
        <p className="text-lg leading-relaxed">
          Each <DefineLink term="Dimension">dimension</DefineLink> has a score from 0 to 100. It
          shows where this country sits among all {COUNTRIES.length} countries in the{' '}
          <DefineLink term="Comparison frame">comparison frame</DefineLink>, not a percentage.{' '}
          <DefineLink term="Confidence" /> sits beside the score. A dashed radar edge and hollow
          point mean the evidence is thin. The records below show each{' '}
          <DefineLink term="Indicator">indicator</DefineLink>, its raw value, year and source.
        </p>
        <p className="mt-3 text-lg leading-relaxed">
          A panel estimate, when present, is a separate judgment about what the indicators miss.
          It does not change the score or confidence. The panel&apos;s provenance is shown beside
          the estimate.
        </p>
        <ClassLegend />
        <ConfidenceLegend className="mt-4" />
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
      </Card>

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
              <CountryIndicatorList
                indicators={dim.indicators}
                countryIso3={country.iso3}
                evidence={evidence}
              />

              <CheckList checks={dim.checks} />

              <EvidenceList records={evidence.filter((e) => INDICATORS_BY_ID[e.indicatorId]?.dimension === d)} />

              {finals.length > 0 && run ? (
                <Card className="mt-6">
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
                </Card>
              ) : null}
            </Section>
          </div>
        )
      })}
    </>
  )
}
