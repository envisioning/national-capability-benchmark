import Link from 'next/link'
import { COUNTRIES, DATASET_VERSION, INDICATORS, isScored } from '@ncb/core'
import { FlagHistogram } from '@/components/FlagHistogram'
import {
  Empty,
  FactStrip,
  FrameNote,
  Headline,
  HeroTitle,
  Highlight,
  Score,
  Section,
  type Fact,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadDiagnostics, loadEvidence, loadIndex } from '@/lib/data'
import {
  aboutHref,
  agendasHref,
  capabilitiesHref,
  objectionsHref,
  changelogReleaseHref,
  compareBaseHref,
  contactHref,
  countriesHref,
  countryProfileHref,
  decisionsHref,
  diagnosticsHref,
  indicatorsHref,
  limitsHref,
  methodHref,
  thesisHref,
} from '@/lib/links'
import { toHistogramProfile, widestSpread } from '@/lib/profile'
import { readWealthTracking } from '@/lib/wealth'
import { capitalize, countWord } from '@/lib/words'

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
 *
 * Every section under the chart stands for one part of the site, and each one
 * carries a sentence, a live number and one link out. No section reprints a
 * list that has a page of its own, which is what kept the nine capabilities on
 * this page three times over. See D75.
 */
export default async function Page() {
  const [data, diag, evidence] = await Promise.all([
    loadIndex(),
    loadDiagnostics(),
    loadEvidence(),
  ])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const profiles = [...data.countries]
    .sort((a, b) => a.country.localeCompare(b.country))
    .map(toHistogramProfile)

  const wealth = diag ? readWealthTracking(diag) : null
  const spread = widestSpread(profiles)
  const wired = INDICATORS.filter(isScored).length
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length

  const facts: Fact[] = [
    {
      label: 'Dataset',
      value: data.version ?? DATASET_VERSION,
      href: changelogReleaseHref(data.version ?? DATASET_VERSION),
    },
    { label: 'Countries', value: COUNTRIES.length, href: countriesHref },
    {
      label: 'Indicators',
      value: `${wired} of ${INDICATORS.length}`,
      href: indicatorsHref,
      note: `${gaps} declared gaps.`,
    },
    { label: 'Generated', value: data.generatedAt.slice(0, 10), href: methodHref },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: datasetJsonLd(data) }} />
      {/* The site's one dark band above the footer, and the only place the lime
          glow renders. It spans the window and supplies its own container, the
          way envisioning.com draws a section, so the band reads as the page
          opening rather than as a card sitting on it. */}
      <div className="hero-band hero-glow full-bleed -mt-12 mb-12 sm:-mt-16">
        <div className="m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-20">
          <HeroTitle>What is a country capable of doing?</HeroTitle>
          <Headline>
            Nine capabilities, scored from public data. Pick one and every country lands on the{' '}
            <Highlight>same scale</Highlight>, each carrying its own confidence.
          </Headline>
        </div>
      </div>

      <Section
        title="One capability at a time"
        hint="Switch capability and watch the countries move. A country that sits high on one of these can sit at the floor of the next, which is why there is no overall ranking here."
      >
        <FlagHistogram profiles={profiles} />
        <FrameNote />
      </Section>

      <Section
        title="Nine scores, read together"
        hint="A profile draws all nine at once, so a strength and a weakness show up in the same glance."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          {spread ? (
            <>
              The widest case today is{' '}
              <Link
                href={countryProfileHref(spread.iso3)}
                className="underline underline-offset-4"
              >
                {spread.country}
              </Link>
              , at <Score value={spread.high.value} size="sm" /> on{' '}
              {spread.high.label.toLowerCase()} and <Score value={spread.low.value} size="sm" /> on{' '}
              {spread.low.label.toLowerCase()}, a gap of {spread.range.toFixed(0)} points inside one
              country. An average of the nine would erase it.{' '}
            </>
          ) : null}
          <Link href={countriesHref} className="underline underline-offset-4">
            All {COUNTRIES.length} countries
          </Link>{' '}
          are drawn as shapes, and{' '}
          <Link href={compareBaseHref} className="underline underline-offset-4">
            compare
          </Link>{' '}
          puts one country beside up to three others. The{' '}
          <Link href={capabilitiesHref} className="underline underline-offset-4">
            capabilities directory
          </Link>{' '}
          reads the same data the other way, one capability across every country.
        </p>
      </Section>

      {wealth ? (
        <Section
          title="How much of this is income?"
          hint="If a capability were only a country's income, this would be an income table. The test runs on every release."
        >
          <p className="max-w-3xl text-lg leading-relaxed">
            The nine capabilities correlate with GDP per head from{' '}
            {wealth.weakest?.strength?.toFixed(2)} on {wealth.weakest?.label.toLowerCase()} to{' '}
            {wealth.strongest?.strength?.toFixed(2)} on {wealth.strongest?.label.toLowerCase()}.{' '}
            {capitalize(countWord(wealth.separate.length))} of the nine come through the test and{' '}
            {countWord(wealth.tracking.length)} do not, which the project publishes as a known
            failure.{' '}
            <Link href={thesisHref} className="underline underline-offset-4">
              The thesis
            </Link>{' '}
            makes the argument and draws the result, and the{' '}
            <Link href={diagnosticsHref} className="underline underline-offset-4">
              diagnostics
            </Link>{' '}
            hold the full test.
          </p>
        </Section>
      ) : null}

      <Section
        title="What each country should work on"
        hint="The scores turn into three lists: what to raise, what to measure first and what to hold."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          <Link href={agendasHref()} className="underline underline-offset-4">
            {COUNTRIES.length} agendas
          </Link>{' '}
          are computed from the same data, one per country. Beside them sit{' '}
          {countWord(evidence.length)} documented deliveries, filed against indicators that have no
          dataset behind them. None of those records moves a score. They are what a country has already
          built where the benchmark can only record a gap.
        </p>
      </Section>

      <Section
        title="Check the numbers"
        hint="The method, the limits and the reasoning behind each choice are published beside the data."
      >
        <FactStrip facts={facts} />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The{' '}
          <Link href={methodHref} className="underline underline-offset-4">
            method
          </Link>{' '}
          explains how a statistic becomes a score, the{' '}
          <Link href={limitsHref} className="underline underline-offset-4">
            limits
          </Link>{' '}
          record where the data is wrong about the world, the{' '}
          <Link href={decisionsHref} className="underline underline-offset-4">
            decision log
          </Link>{' '}
          says what would overturn each choice, and the{' '}
          <Link href={objectionsHref} className="underline underline-offset-4">
            challenge page
          </Link>{' '}
          is where an objection enters the record.
        </p>
      </Section>

      <Section
        title="Who built this"
        hint="A research prototype from Envisioning. It is early, the gaps are declared, and it needs institutions to improve it."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          <a href="https://envisioning.com" className="underline underline-offset-4" rel="noopener">
            Envisioning
          </a>{' '}
          researches how societies anticipate and act on change. The benchmark ranks nobody and
          advises nobody: it reads a country&apos;s capability shape from public data and says how
          confident it is. The{' '}
          <Link href={aboutHref} className="underline underline-offset-4">
            about page
          </Link>{' '}
          records where that breaks down, and a{' '}
          <Link href={contactHref} className="underline underline-offset-4">
            correction
          </Link>{' '}
          is worth sending.
        </p>
      </Section>
    </>
  )
}
