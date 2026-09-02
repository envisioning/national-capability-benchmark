import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS_BY_ID,
  checksFor,
  contestedDisputeCounts,
  indicatorsFor,
  isScored,
  primaryMomentum,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityCountryTable, type CapabilityCountryRow } from '@/components/views/CapabilityCountryTable'
import { EvidenceList } from '@/components/views/EvidenceList'
import { IndicatorRegistry } from '@/components/views/IndicatorRegistry'
import { Empty, FrameNote, Headline, Meta, PageTitle, Section } from '@/components/ui'
import { MISSING_DATA_HINT, loadDisputes, loadEvidence, loadIndex } from '@/lib/data'
import { capabilitiesHref, ogDimensionHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

function asDimension(value: string): Dimension | null {
  return DIMENSIONS.includes(value as Dimension) ? (value as Dimension) : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dimension: string }>
}): Promise<Metadata> {
  const { dimension: raw } = await params
  const dimension = asDimension(raw)
  if (!dimension) return {}
  const label = DIMENSION_LABELS[dimension]
  return {
    title: `${label}, NCB`,
    description: `${label} across every country in the National Capability Benchmark: the question, indicators, scores, confidence and trend.`,
    openGraph: {
      images: [{ url: ogDimensionHref(dimension), width: 1200, height: 630, alt: `${label} capability distribution` }],
    },
    twitter: { card: 'summary_large_image', images: [ogDimensionHref(dimension)] },
  }
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ dimension: string }>
}) {
  const { dimension: raw } = await params
  const dimension = asDimension(raw)
  if (!dimension) notFound()

  const [data, evidence, disputes] = await Promise.all([
    loadIndex(),
    loadEvidence(),
    loadDisputes(),
  ])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const definitions = indicatorsFor(dimension)
  const scoredIndicators = definitions.filter(isScored).length
  const dimensionEvidence = evidence.filter(
    (record) => INDICATORS_BY_ID[record.indicatorId]?.dimension === dimension,
  )
  const contestedCounts = contestedDisputeCounts(disputes)
  const rows: CapabilityCountryRow[] = data.countries.map((country) => {
    const result = country.dimensions[dimension]
    const momentum = result ? primaryMomentum(result.momentum) : null
    return {
      iso3: country.iso3,
      country: country.country,
      score: result?.score ?? null,
      belowCoverageFloor: result?.belowCoverageFloor ?? true,
      observedIndicators: result?.observedIndicators ?? 0,
      confidence: result?.confidence ?? 0,
      delta: momentum?.delta ?? null,
      baseYear: momentum?.baseYear ?? null,
      currentYear: momentum?.currentYear ?? null,
      matchedIndicators: momentum?.matchedIndicators ?? null,
      contestedCount: contestedCounts[`${country.iso3}|${dimension}`] ?? 0,
    }
  })
  const scoredCountries = rows.filter((row) => row.score !== null).length
  /* Checks are published on every country and belong to no score, so the
   * capability page reports what they cover rather than ranking them. See D60. */
  const checks = checksFor(dimension).map((check) => {
    const values = data.countries
      .map((country) =>
        country.dimensions[dimension]?.checks.find((row) => row.checkId === check.id),
      )
      .filter((row) => row?.value !== null && row !== undefined)
    const years = values.map((row) => row?.year).filter((y): y is number => typeof y === 'number')
    return {
      check,
      countries: values.length,
      latestYear: years.length > 0 ? Math.max(...years) : null,
    }
  })

  return (
    <>
      <p className="mb-6">
        <Link
          href={capabilitiesHref}
          className="inline-flex items-center gap-2 text-xs text-[var(--muted)] underline underline-offset-4"
        >
          <Icon name="arrow-left" size={13} />
          All capabilities
        </Link>
      </p>

      <PageTitle>{DIMENSION_LABELS[dimension]}</PageTitle>
      <Headline>{DIMENSION_QUESTIONS[dimension]}</Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        This page brings together the country comparison, indicator registry, and documented cases.
        It shows how much of this capability the current data can capture.
      </p>

      <p className="mb-10 flex flex-wrap gap-2">
        <Meta icon="globe">{data.countries.length} countries in the frame</Meta>
        <Meta icon="ruler">{definitions.length} indicators in the registry</Meta>
        <Meta icon="circle-check">{scoredIndicators} indicators with data</Meta>
        <Meta icon="target">{scoredCountries} countries with a score</Meta>
      </p>

      <Section
        title="Compare every country on one scale"
        hint="The table starts in alphabetical order. Sort by score, confidence, coverage, or trend. A score needs two observed indicators; a trend uses indicators observed at both ends."
        icon={<Icon name={DIMENSION_ICON[dimension]} size={22} />}
      >
        <p className="mb-4 max-w-2xl text-xs leading-relaxed text-[var(--muted)]">
          Scores use one 0 to 100 scale for all countries. Each flag is a country, and the ring
          around it carries how well evidenced that score is. Point at a flag to read the country,
          click it to open the profile.
        </p>
        <CapabilityCountryTable
          dimension={dimension}
          rows={rows}
          indicatorCount={definitions.length}
        />
        <FrameNote />
      </Section>

      <IndicatorRegistry dimension={dimension} />

      {checks.length > 0 ? (
        <Section
          title="A check beside the score"
          hint="This check measures something real about the capability, but it does not meet the model's test for scoring. Country pages show its value."
          icon={<Icon name="eye" size={22} />}
        >
          <ul className="space-y-5">
            {checks.map(({ check, countries, latestYear }) => (
              <li key={check.id}>
                <p className="text-xs font-medium tracking-tight">
                  {check.name}
                  <span className="ml-2 font-normal text-[var(--muted)]">
                    {check.source.publisher}
                    {check.source.series ? ` (${check.source.series})` : ''}, {countries} of{' '}
                    {data.countries.length} countries
                    {latestYear === null ? '' : `, latest ${latestYear}`}
                  </span>
                </p>
                <p className="mt-1 max-w-3xl text-lg leading-relaxed">{check.definition}</p>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
                  {check.notes}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {dimensionEvidence.length > 0 ? (
        <Section
          title="Documented examples"
          hint="These records describe something a country has done that this capability should capture. They stay outside the score because one case is not a comparable series."
          icon={<Icon name="file-clock" size={22} />}
        >
          <EvidenceList records={dimensionEvidence} />
        </Section>
      ) : null}

      <p className="text-xs leading-relaxed text-[var(--muted)]">
        Read how the benchmark turns an indicator into a score on the{' '}
        <Link href="/method" className="underline underline-offset-4">
          method page
        </Link>
        . The{' '}
        <Link href="/limits" className="underline underline-offset-4">
          limits page
        </Link>{' '}
        records where this capability is still poorly observed.
      </p>
    </>
  )
}
