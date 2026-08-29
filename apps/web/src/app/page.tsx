import Link from 'next/link'
import { headers } from 'next/headers'
import { REPO_URL } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { ConfidenceTable, ScoreTable } from '@/components/views/ScoreTables'
import { contestedDisputeCounts } from '@ncb/core'
import {
  ConfidenceLegend,
  CountryLabel,
  DimensionLegend,
  Empty,
  Eyebrow,
  FrameNote,
  Headline,
  Highlight,
  PageTitle,
  RadarEvidenceLegend,
  ScoreLegend,
  Section,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadDisputes, loadIndex } from '@/lib/data'
import { capabilitiesHref, countryProfileHref } from '@/lib/links'
import { toProfile } from '@/lib/profile'
import PortugueseHomePage from './pt/page'

export const dynamic = 'force-dynamic'

/** The Portuguese edition is the same page read in the other language. See D35. */
export const metadata = {
  alternates: { languages: { 'pt-BR': '/pt' } },
}

/**
 * Schema.org Dataset markup, so the benchmark is indexable by dataset search
 * engines. The production URL comes from Vercel's system env; locally the
 * block still renders and is harmless. See D37.
 */
function datasetJsonLd(data: { generatedAt: string; version?: string }): string {
  const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'NCB, the National Capability Benchmark',
    description:
      'A prototype that measures what a country can do. Nine capability dimensions from public data, each with separate confidence.',
    ...(domain ? { url: `https://${domain}` } : {}),
    version: data.version,
    dateModified: data.generatedAt,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isBasedOn: 'https://data.worldbank.org',
    creator: {
      '@type': 'Organization',
      name: 'Envisioning',
      url: 'https://envisioning.com',
    },
  }
  return JSON.stringify(json).replace(/</g, '\\u003c')
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [requestHeaders, query] = await Promise.all([headers(), searchParams])
  const requested = Array.isArray(query.lang) ? query.lang[0] : query.lang
  const portuguese =
    requested?.toLowerCase() === 'pt-br' ||
    (requested?.toLowerCase() !== 'en' && requestHeaders.get('accept-language')?.toLowerCase().includes('pt-br'))
  if (portuguese) return <PortugueseHomePage />
  const [data, disputes] = await Promise.all([loadIndex(), loadDisputes()])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  /* Alphabetical. Any other order on this page would be a ranking, and there is
   * no headline number to rank by. */
  const countries = [...data.countries].sort((a, b) => a.country.localeCompare(b.country))
  const contestedCounts = contestedDisputeCounts(disputes)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: datasetJsonLd(data) }} />
      <Eyebrow>{countries.length} countries, nine dimensions</Eyebrow>
      <PageTitle>What is a country capable of doing?</PageTitle>
      <Headline>
        Nine capability dimensions, scored from public data and shown as a <Highlight>shape</Highlight>.
        Each score links to its raw indicators and a separate confidence number.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        New here?{' '}
        <Link href="/method" className="underline underline-offset-4">
          method page
        </Link>{' '}
        explains the scoring, the{' '}
        <Link href="/glossary" className="underline underline-offset-4">
          glossary
        </Link>{' '}
        defines the terms, and the{' '}
        <Link href="/limits" className="underline underline-offset-4">
          limits page
        </Link>{' '}
        records known failures. The{' '}
        <Link href={capabilitiesHref} className="underline underline-offset-4">
          capabilities directory
        </Link>{' '}
        compares countries by dimension.
      </p>
      <p className="-mt-6 mb-10 max-w-3xl text-lg leading-relaxed">
        The code and data are open.{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Open the repository on GitHub
        </a>
        .
      </p>

      <Section
        title="Countries have different profiles"
        hint="Scores run 0 to 100 using all countries as the frame. There is no composite, so countries with the same average can have different profiles."
      >
        <DimensionLegend />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => {
            const profile = toProfile(c)
            return (
              <Link
                key={profile.iso3}
                href={countryProfileHref(profile.iso3)}
                className="rounded-xl border border-[var(--rule)] p-4 transition-all duration-200 hover:border-[var(--foreground)]"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs font-medium">
                    <CountryLabel iso3={profile.iso3} name={profile.country} />
                  </span>
                  <span className="text-xs text-[var(--muted)]">{profile.iso3}</span>
                </div>
                <Radar
                  labels="icons"
                  interactive={false}
                  series={[
                    {
                      label: profile.country,
                      values: profile.values,
                      confidences: profile.confidences,
                      color: 'var(--primary)',
                    },
                  ]}
                />
              </Link>
            )
          })}
        </div>
        <RadarEvidenceLegend interactive={false} />
        <FrameNote />
      </Section>

      <Section
        title="The scores in a table"
        hint="Click any heading to sort."
      >
        <ScoreLegend />
        <ScoreTable countries={countries} contestedCounts={contestedCounts} />
      </Section>

      <Section
        title="Score and confidence are separate"
        hint="Confidence is coverage times recency times source quality. It sits beside the score; missing data lowers coverage and is never imputed."
      >
        <ConfidenceLegend />
        <ConfidenceTable countries={countries} />
      </Section>
    </>
  )
}
