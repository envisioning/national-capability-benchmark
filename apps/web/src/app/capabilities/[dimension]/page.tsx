import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS_BY_ID,
  indicatorsFor,
  isScored,
  primaryMomentum,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityCountryTable, type CapabilityCountryRow } from '@/components/views/CapabilityCountryTable'
import { EvidenceList } from '@/components/views/EvidenceList'
import { IndicatorRegistry } from '@/components/views/IndicatorRegistry'
import { Empty, Eyebrow, FrameNote, Headline, Meta, PageTitle, Section } from '@/components/ui'
import { MISSING_DATA_HINT, loadEvidence, loadIndex } from '@/lib/data'
import { capabilitiesHref } from '@/lib/links'

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

  const [data, evidence] = await Promise.all([loadIndex(), loadEvidence()])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const definitions = indicatorsFor(dimension)
  const scoredIndicators = definitions.filter(isScored).length
  const dimensionEvidence = evidence.filter(
    (record) => INDICATORS_BY_ID[record.indicatorId]?.dimension === dimension,
  )
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
    }
  })
  const scoredCountries = rows.filter((row) => row.score !== null).length

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

      <Eyebrow>One of nine capability dimensions</Eyebrow>
      <PageTitle>{DIMENSION_LABELS[dimension]}</PageTitle>
      <Headline>{DIMENSION_QUESTIONS[dimension]}</Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        This page puts the country comparison, indicator registry and documented cases together. It
        shows how much of the capability the current data can see.
      </p>

      <p className="mb-10 flex flex-wrap gap-2">
        <Meta icon="globe">{data.countries.length} countries in the frame</Meta>
        <Meta icon="ruler">{definitions.length} indicators in the registry</Meta>
        <Meta icon="circle-check">{scoredIndicators} indicators with data</Meta>
        <Meta icon="target">{scoredCountries} countries with a score</Meta>
      </p>

      <Section
        title="All countries use the same frame"
        hint="The table opens alphabetically. Sort by score, confidence, coverage or trend. Scores need two observed indicators; trends use indicators observed at both ends."
        icon={<Icon name={DIMENSION_ICON[dimension]} size={22} />}
      >
        <p className="mb-4 max-w-2xl text-xs leading-relaxed text-[var(--muted)]">
          Scores use one 0 to 100 scale for all countries. Each dot is a country. The box covers the
          middle half of the field, and the line is the median. Hollow dots have thin evidence.
        </p>
        <CapabilityCountryTable
          dimension={dimension}
          rows={rows}
          indicatorCount={definitions.length}
        />
        <FrameNote />
      </Section>

      <IndicatorRegistry dimension={dimension} />

      {dimensionEvidence.length > 0 ? (
        <Section
          title="Documented deliveries add context to the data"
          hint="These records describe a country doing something this capability should capture. They stay outside the score because one case is not a comparable series."
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
