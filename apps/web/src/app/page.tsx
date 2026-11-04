import Link from 'next/link'
import {
  COUNTRIES,
  DATASET_VERSION,
  INDICATORS,
  isDeclaredGap,
  buildIndicatorLanes,
  buildInstitutionMatrix,
  isScored,
} from '@ncb/core'
import { DotField } from '@/components/DotField'
import { FlagHistogram } from '@/components/FlagHistogram'
import { DIMENSION_ICON } from '@/components/Icon'
import { LaneField } from '@/components/LaneField'
import { CountryJump } from '@/components/views/CountryJump'
import {
  Card,
  Empty,
  FactStrip,
  FrameNote,
  Headline,
  HeroTitle,
  Section,
  type Fact,
} from '@/components/ui'
import {
  MISSING_DATA_HINT,
  loadDiagnostics,
  loadEvidence,
  loadIndex,
  loadInstitutionNetwork,
} from '@/lib/data'
import {
  aboutHref,
  agendasHref,
  objectionsHref,
  changelogReleaseHref,
  compareBaseHref,
  countriesHref,
  countryProfileHref,
  decisionsHref,
  diagnosticsHref,
  exploreHref,
  indicatorsHref,
  institutionGraphDatasetHref,
  limitsHref,
  methodHref,
  supportHref,
  thesisHref,
} from '@/lib/links'
import { toHistogramProfile, widestSpread } from '@/lib/profile'
import { readWealthTracking } from '@/lib/wealth'
import { readFactorTest } from '@/lib/factor'
import { readResidualStructure } from '@/lib/residual'
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
 * The order follows what a reader came for: the question and its current
 * answer, their country, the chart, the income test, then a sentence, a live
 * number and a link for the rest of the site. No section reprints a list that
 * has a page of its own. See D75 and D190.
 */
export default async function Page() {
  /* Brazil is the one country with an institution map, so its wiring is the
   * one such picture the front page can draw. A second map makes this a list
   * and a choice. See D113. */
  const [data, diag, evidence, brazil] = await Promise.all([
    loadIndex(),
    loadDiagnostics(),
    loadEvidence(),
    loadInstitutionNetwork('BRA'),
  ])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const profiles = [...data.countries]
    .sort((a, b) => a.country.localeCompare(b.country))
    .map(toHistogramProfile)

  const wealth = diag ? readWealthTracking(diag) : null
  const factor = diag ? readFactorTest(diag) : null
  const residual = diag ? readResidualStructure(diag) : null
  const lanes = diag ? buildIndicatorLanes(diag) : null
  const wiring = brazil.network
    ? buildInstitutionMatrix(brazil.network.nodes, brazil.network.edges)
    : null
  const spread = widestSpread(profiles)
  const wired = INDICATORS.filter(isScored).length
  const gaps = INDICATORS.filter(isDeclaredGap).length

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
      {/* The site's one dark band above the footer. It spans the window and
          supplies its own container, the way envisioning.com draws a section, so
          the band reads as the page opening rather than as a card. It asks the
          question under test, states the current answer from the diagnostics,
          and hands the reader the one thing most arrive for: their country. See
          D75, D86 and D190. */}
      <div className="hero-band full-bleed -mt-12 mb-12 sm:-mt-16">
        <DotField id="hero-dots" />
        <div className="relative m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-16">
          <HeroTitle>Is wealth the same as capability?</HeroTitle>
          <Headline>
            NCB tests whether a country&apos;s ability to anticipate change, coordinate around it and
            build what it decides is separate from its income, and whether public data can see it.
          </Headline>
          {factor?.solution.income ? (
            <p className="-mt-4 mb-8 max-w-3xl text-lg leading-relaxed">
              So far the data says mostly no. One shared factor carries {factor.sharePct} of the
              variation across {factor.solution.countries} countries and correlates{' '}
              {Math.abs(factor.solution.income.r).toFixed(2)} with income.{' '}
              <Link href={thesisHref} className="underline underline-offset-4">
                Read the result
              </Link>
            </p>
          ) : null}
          <div className="flex max-w-xl flex-wrap items-center gap-x-6 gap-y-3">
            <div className="min-w-64 grow">
              <CountryJump
                countries={profiles.map((p) => ({ code: p.iso3, name: p.country }))}
              />
            </div>
            <Link href={countriesHref} className="text-xs underline underline-offset-4">
              All {COUNTRIES.length} countries
            </Link>
            <Link href={compareBaseHref} className="text-xs underline underline-offset-4">
              Compare
            </Link>
          </div>
        </div>
      </div>

      <Section
        title="One capability at a time"
        hint="Switch capability and watch the countries move. A country high on one can sit at the floor of the next, so there is no overall ranking."
      >
        <FlagHistogram profiles={profiles} />
        <FrameNote />
        {spread ? (
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
            The widest case today is{' '}
            <Link href={countryProfileHref(spread.iso3)} className="underline underline-offset-4">
              {spread.country}
            </Link>
            , at {spread.high.value.toFixed(1)} on {spread.high.label.toLowerCase()} and{' '}
            {spread.low.value.toFixed(1)} on {spread.low.label.toLowerCase()}. An average of the nine
            would erase that gap of {spread.range.toFixed(0)} points.
          </p>
        ) : null}
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
            failure. {residual?.shortSentence ?? null}{' '}
            <Link href={diagnosticsHref} className="underline underline-offset-4">
              The diagnostics
            </Link>{' '}
            hold the full test.
          </p>
          {lanes ? (
            <Link
              href={exploreHref('measure')}
              aria-label="Every indicator by how closely it tracks income, drawn as lanes"
              className="mt-8 block rounded-xl transition-opacity hover:opacity-90"
            >
              <LaneField
                field={lanes}
                arrangement="measure"
                interactive={false}
                laneIcon={DIMENSION_ICON}
              />
            </Link>
          ) : null}
        </Section>
      ) : null}

      <div className="mb-16 grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="text-xl font-light leading-tight">What each country should work on</h2>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            The scores turn into three lists: raise, measure first, and keep watching. Beside them
            sit {evidence.length} documented deliveries, which never move a score.
          </p>
          <Link href={agendasHref()} className="mt-4 inline-block text-xs underline underline-offset-4">
            {COUNTRIES.length} agendas
          </Link>
        </Card>
        {wiring && brazil.network ? (
          <Card>
            <h2 className="text-xl font-light leading-tight">How Brazil&apos;s institutions connect</h2>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              {wiring.filled} of {wiring.cells.length} system pairs hold a relation, across{' '}
              {brazil.network.nodes.length} institutions. The map explains a score and is no input
              to one.
            </p>
            <Link
              href={institutionGraphDatasetHref('BRA')}
              className="mt-4 inline-block text-xs underline underline-offset-4"
            >
              Open the network
            </Link>
          </Card>
        ) : null}
        <Card>
          <h2 className="text-xl font-light leading-tight">Help improve it</h2>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            {gaps} indicators have no dataset yet. A research prototype from Envisioning, early, with
            its gaps declared.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <Link href={supportHref} className="underline underline-offset-4">
              Ways to help
            </Link>
            <Link href={objectionsHref} className="underline underline-offset-4">
              Challenge a score
            </Link>
            <Link href={aboutHref} className="underline underline-offset-4">
              About
            </Link>
          </p>
        </Card>
      </div>

      <Section title="Check the numbers">
        <FactStrip facts={facts} />
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
          <Link href={methodHref} className="underline underline-offset-4">
            How a statistic becomes a score
          </Link>
          <Link href={limitsHref} className="underline underline-offset-4">
            Where the data is wrong
          </Link>
          <Link href={decisionsHref} className="underline underline-offset-4">
            Every decision and what would overturn it
          </Link>
        </p>
      </Section>
    </>
  )
}
