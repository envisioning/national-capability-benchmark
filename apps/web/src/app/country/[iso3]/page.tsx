import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  COUNTRIES,
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  DISSENT_IQR,
  INDICATORS_BY_ID,
  contestedDisputeCounts,
  countedForCoverage,
  indicatorsFor,
  isDelphiRunForDataset,
  isEvidential,
  isPanel,
  isThinEvidence,
  primaryMomentum,
} from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CoverageMark } from '@/components/CoverageMark'
import { CompareRadar } from '@/components/views/CompareRadar'
import { CheckList } from '@/components/views/CheckList'
import { ConditionList } from '@/components/views/ConditionList'
import { CountryHistoryChart } from '@/components/views/CountryHistoryChart'
import { CountryIndicatorList } from '@/components/views/CountryIndicatorList'
import {
  CountrySection,
  CountrySectionRail,
  CountrySectionsToggle,
} from '@/components/views/CountrySections'
import { CountrySummary } from '@/components/views/CountrySummary'
import { EvidenceList } from '@/components/views/EvidenceList'
import Link from 'next/link'
import {
  ClassLegend,
  ConfidenceLegend,
  ConfidenceText,
  DefineLink,
  Delta,
  DimensionScore,
  CountryLabel,
  PageTitle,
  PanelProvenanceNote,
  Score,
  Sparkline,
} from '@/components/ui'
import {
  capabilityHref,
  countryCsvHref,
  countryMapDimensionHref,
  delphiHref,
  glossaryHref,
  limitsHref,
  ogCountryHref,
} from '@/lib/links'
import { loadAgenda } from '@/lib/agenda'
import { loadPeerScoreMedians } from '@/lib/capability-map'
import {
  loadCountry,
  loadDelphiRun,
  loadDisputes,
  loadEvidence,
  loadHistory,
  loadHistoryIndex,
  loadIndex,
} from '@/lib/data'
import { toProfile } from '@/lib/profile'
import { sentenceLabel } from '@/lib/labels'
import { HISTORY_WORDS_EN } from '@/lib/words'

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
  const [data, agenda, loadedRun, allEvidence, disputes, history, historyIndex] = await Promise.all([
    loadIndex(),
    loadAgenda(country.iso3),
    loadDelphiRun(),
    loadEvidence(),
    loadDisputes(),
    loadHistory(country.iso3),
    loadHistoryIndex(),
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
  const historyCohorts = (historyIndex?.cohorts ?? []).filter(
    (c) => c.id === 'all' || c.members.includes(country.iso3),
  )
  const countryHasEstimates = (run?.cellEstimates ?? []).some((e) => e.iso3 === country.iso3)

  const peerData = data ? await loadPeerScoreMedians(country, data.countries) : null
  const peerMedians = peerData?.medians ?? {}
  const peerCount = peerData?.count ?? 0
  const hasPeers = Object.keys(peerMedians).length > 0

  return (
    <>
      <PageTitle>
        <CountryLabel iso3={country.iso3} name={country.country} />
      </PageTitle>

      <div className="mb-8 mt-6 grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <CountrySummary
          country={country}
          agenda={agenda}
          peerMedians={peerMedians}
          peerCount={peerCount}
          contestedCounts={contestedCounts}
          frameSize={COUNTRIES.length}
        />
        <CompareRadar
          focus={toProfile(country)}
          others={others.map(toProfile)}
          peers={
            hasPeers
              ? { label: 'Income peers', values: DIMENSIONS.map((d) => peerMedians[d] ?? null) }
              : null
          }
          contestedCounts={contestedCounts}
        />
      </div>

      <ConfidenceLegend className="mb-6" />

      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
        {meta?.reason ? <p>Why this country is included: {meta.reason}.</p> : null}
        <a href={countryCsvHref(country.iso3)} className="underline underline-offset-4">
          Download this country as CSV
        </a>
      </div>

      <details className="mb-12 max-w-3xl rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-[var(--muted)]">
        <summary className="cursor-pointer font-medium text-[var(--foreground)]">
          How to read this page
        </summary>
        <p className="mt-3">
          Each <DefineLink term="Dimension">dimension</DefineLink> has a score from 0 to 100. It
          shows where this country sits among all {COUNTRIES.length} countries in the{' '}
          <DefineLink term="Comparison frame">comparison frame</DefineLink>, not a percentage.{' '}
          <DefineLink term="Confidence" /> sits beside the score. A dashed radar edge and hollow
          point mean the evidence is thin. The records below show each{' '}
          <DefineLink term="Indicator">indicator</DefineLink>, its raw value, year and source.
        </p>
        <p className="mt-3">
          A panel estimate, when present, is a separate judgment about what the indicators miss.
          It does not change the score or confidence. The panel&apos;s provenance is shown beside
          the estimate.
        </p>
        <p className="mt-3">
          A row marked <em>no dataset exists</em> is a{' '}
          <DefineLink term="Gap">gap</DefineLink>: the benchmark wants data that nobody publishes.
          A <em>retired</em> row has a source this project chose not to use. Both reduce confidence.
          The{' '}
          <Link href={glossaryHref} className="underline underline-offset-4">
            glossary
          </Link>{' '}
          defines each term, and the{' '}
          <Link href={limitsHref} className="underline underline-offset-4">
            limits page
          </Link>{' '}
          lists where these numbers are known to be wrong about the world.
        </p>
      </details>

      {run && countryHasEstimates ? (
        <PanelProvenanceNote provenance={run.provenance} panelists={run.panel.length} />
      ) : null}

      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-2xl font-light leading-tight sm:text-3xl">The record behind each score</h2>
        <CountrySectionsToggle />
      </div>
      <ClassLegend />

      <div className="mt-6 grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <div>
          <CountrySectionRail
            items={DIMENSIONS.flatMap((d) => {
              const dim = country.dimensions[d]
              return dim
                ? [
                    {
                      dimension: d,
                      label: sentenceLabel(DIMENSION_LABELS[d]),
                      score: dim.score === null || dim.belowCoverageFloor ? 'none' : dim.score.toFixed(1),
                    },
                  ]
                : []
            })}
          />
        </div>
        <div className="border-t border-[var(--rule)]">
          {DIMENSIONS.map((d) => {
            const dim = country.dimensions[d]
            if (!dim) return null
            const estimates = (run?.cellEstimates ?? []).filter(
              (e) => e.iso3 === country.iso3 && e.dimension === d,
            )
            const finalRound = estimates.length ? Math.max(...estimates.map((e) => e.round)) : 0
            const finals = estimates.filter((e) => e.round === finalRound)
            const label = sentenceLabel(DIMENSION_LABELS[d])
            const trend = primaryMomentum(dim.momentum)
            const hasHistory = Boolean(history?.dimensions[d])
            const spans = hasHistory && trend ? [trend] : dim.momentum

            return (
              <CountrySection
                key={d}
                id={d}
                summary={
                  <div className="grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-xl font-light leading-tight">
                        <Icon name={DIMENSION_ICON[d]} size={18} className="shrink-0 text-[var(--muted)]" />
                        {label}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                        {DIMENSION_QUESTIONS[d]}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                      <DimensionScore dim={dim} size="sm" thin={isThinEvidence(dim.confidence)} />
                      <ConfidenceText value={dim.confidence} />
                      <CoverageMark
                        observed={dim.observedIndicators}
                        total={countedForCoverage(indicatorsFor(d)).length}
                        className="text-[var(--muted)]"
                      />
                    </div>
                  </div>
                }
              >
                <p className="mb-6 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
                  <span className="tabular-nums">Recency {dim.confidenceParts.recency.toFixed(2)}</span>
                  <Link href={capabilityHref(d)} className="underline underline-offset-4">
                    About {label}
                  </Link>
                  <Link href={countryMapDimensionHref(country.iso3, d)} className="underline underline-offset-4">
                    {country.country} beside its income peers
                  </Link>
                </p>

                {history?.dimensions[d] ? (
                  <CountryHistoryChart
                    history={history.dimensions[d]}
                    dimension={d}
                    label={DIMENSION_LABELS[d]}
                    country={country.country}
                    cohorts={historyCohorts}
                    words={HISTORY_WORDS_EN}
                  />
                ) : null}
                {spans.length > 0 ? (
                  <div className="mb-6 space-y-3">
                    {spans.map((m) => (
                      <div key={m.baseYear} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {hasHistory ? null : <Sparkline series={m.series} />}
                        <p className="text-xs leading-relaxed text-[var(--muted)]">
                          <Delta value={m.delta} /> over {m.currentYear - m.baseYear} years, from{' '}
                          {m.baseScore.toFixed(1)} in {m.baseYear} to {m.currentScore.toFixed(1)} on
                          {` ${m.matchedIndicators}`} indicators seen in both years
                          {m.clamped > 0 ? `, with ${m.clamped} at the frame edge` : ''}. Trends use
                          fewer indicators than the current score and use today&apos;s frame.
                        </p>
                      </div>
                    ))}
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

                <ConditionList conditions={dim.conditions ?? []} />

                <EvidenceList records={evidence.filter((e) => INDICATORS_BY_ID[e.indicatorId]?.dimension === d)} />

                {finals.length > 0 && run ? (
                  <details className="mt-6 rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 text-xs">
                    <summary className="cursor-pointer">
                      <span className="inline-flex flex-wrap items-center gap-2">
                        <span className="font-medium">{isPanel(run) ? 'Panel median' : 'Session estimate'}</span>
                        <Score value={dim.delphiScore} size="sm" />
                        {dim.delphiScore !== null && dim.score !== null ? (
                          <PanelGap gap={dim.delphiScore - dim.score} />
                        ) : null}
                      </span>
                    </summary>
                    <p className="mt-3 text-[var(--muted)]">
                      Round {finalRound}.{' '}
                      <Link href={delphiHref} className="underline underline-offset-4">
                        How this layer works
                      </Link>
                    </p>
                    <ul className="mt-3 space-y-4">
                      {finals.map((e) => (
                        <li key={e.panelist}>
                          <Score value={e.score} size="sm" />{' '}
                          <span className="text-[var(--muted)]">
                            {e.panelist}, self-confidence {e.selfConfidence.toFixed(2)}
                          </span>
                          <p className="mt-1 max-w-3xl leading-relaxed">{e.rationale}</p>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </CountrySection>
            )
          })}
        </div>
      </div>
    </>
  )
}

/**
 * How far an estimate sits from the indicators. A gap above a quarter of the
 * scale is the "unresolved disagreement" threshold the panel uses for dissent,
 * so the two surfaces emphasize divergence at one shared boundary.
 */
function PanelGap({ gap }: { gap: number }) {
  return (
    <span className={Math.abs(gap) >= DISSENT_IQR ? 'font-medium' : 'text-[var(--muted)]'}>
      {gap > 0 ? '+' : ''}
      {gap.toFixed(1)} against the indicators
    </span>
  )
}
