import Link from 'next/link'
import { Radar } from '@/components/Radar'
import { ConfidenceTable, ScoreTable } from '@/components/views/ScoreTables'
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
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

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
      'A prototype that measures what a country can do, separately from how rich it is. Nine capability dimensions scored from public data, each with a separate confidence number.',
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

export default async function Page() {
  const data = await loadIndex()
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  /* Alphabetical. Any other order on this page would be a ranking, and there is
   * no headline number to rank by. */
  const countries = [...data.countries].sort((a, b) => a.country.localeCompare(b.country))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: datasetJsonLd(data) }} />
      <Eyebrow>{countries.length} countries, nine dimensions</Eyebrow>
      <PageTitle>What is a country capable of doing?</PageTitle>
      <Headline>
        Nine capability dimensions, scored from public data and read as a{' '}
        <Highlight>shape</Highlight> rather than a rank. Every score carries the raw indicators it
        came from and a separate number saying how well we know it.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        New here? The{' '}
        <a href="/glossary" className="underline underline-offset-4">
          glossary
        </a>{' '}
        defines every term on these pages, including the four letters beside each indicator and what
        a dashed line on a chart means. Nothing assumes you have seen this before.
      </p>

      <Section
        title="Each country comes out a different shape"
        hint="Scores run 0 to 100 against a frame fixed by ten reference countries, and every country is measured the same way. We never compute a composite. Two countries with the same average can have opposite profiles, and that difference is the whole point of the exercise. Open any country to read it dimension by dimension and to hold a second country against it."
      >
        <DimensionLegend />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => {
            const profile = toProfile(c)
            return (
              <Link
                key={profile.iso3}
                href={`/country/${profile.iso3}`}
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
        title="The same numbers, ready for a chart"
        hint="Click any heading to sort."
      >
        <ScoreLegend />
        <ScoreTable countries={countries} />
      </Section>

      <Section
        title="A score and its confidence are two different claims"
        hint="Confidence is coverage times recency times source quality. It sits beside the score and never inside it. A thin evidence base stays visible, because nothing gets imputed to cover it."
      >
        <ConfidenceLegend />
        <ConfidenceTable countries={countries} />
      </Section>
    </>
  )
}
