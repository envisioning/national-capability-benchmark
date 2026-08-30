import Link from 'next/link'
import { COUNTRIES, DIMENSIONS, DIMENSION_LABELS, DIMENSION_QUESTIONS, REPO_URL } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { FlagHistogram } from '@/components/FlagHistogram'
import { Empty, Eyebrow, FrameNote, Headline, Highlight, PageTitle, Section } from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'
import { capabilitiesHref, capabilityHref, countriesHref } from '@/lib/links'
import { toHistogramProfile } from '@/lib/profile'

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

/**
 * The home page is the benchmark, and the benchmark is comparative and
 * English. It does not change language with the browser: the project publishes
 * no second copy of itself, so there is nothing to switch to. A country layer
 * is reached from that country's pages. See D69.
 */
export default async function Page() {
  const data = await loadIndex()
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const profiles = [...data.countries]
    .sort((a, b) => a.country.localeCompare(b.country))
    .map(toHistogramProfile)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: datasetJsonLd(data) }} />
      <Eyebrow>{profiles.length} countries, nine capabilities</Eyebrow>
      <PageTitle>What is a country capable of doing?</PageTitle>
      <Headline>
        Nine capabilities, scored from public data. Pick one and every country lands on the{' '}
        <Highlight>same scale</Highlight>, each carrying its own confidence.
      </Headline>

      <Section
        title="One capability at a time"
        hint="Switch capability and watch the countries move. A country that sits high on one of these can sit at the floor of the next, which is why there is no overall ranking here."
      >
        <FlagHistogram profiles={profiles} />
        <FrameNote />
      </Section>

      <Section
        title="The nine capabilities"
        hint="Each one asks a question the others do not, and each has its own indicators, country comparison and known gaps."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map((dimension) => (
            <Link
              key={dimension}
              href={capabilityHref(dimension)}
              className="group rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
            >
              <div className="flex items-center gap-3">
                <Icon name={DIMENSION_ICON[dimension]} size={20} className="text-[var(--muted)]" />
                <h3 className="text-xl font-medium tracking-tight group-hover:underline">
                  {DIMENSION_LABELS[dimension]}
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                {DIMENSION_QUESTIONS[dimension]}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="Where to go next"
        hint="The benchmark is built to be argued with, so every number links back to the data and the reasoning behind it."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          <Link href={countriesHref} className="underline underline-offset-4">
            All {COUNTRIES.length} countries
          </Link>{' '}
          reads each one as a nine-dimension shape.{' '}
          <Link href={capabilitiesHref} className="underline underline-offset-4">
            The capabilities directory
          </Link>{' '}
          carries the full score table. The{' '}
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
          records where the current data is wrong about the world.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
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
      </Section>
    </>
  )
}
