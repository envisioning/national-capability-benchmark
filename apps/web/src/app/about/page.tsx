import type { Metadata } from 'next'
import Link from 'next/link'
import {
  COUNTRIES,
  DATASET_VERSION,
  INDICATORS,
  REPO_URL,
  docHref,
  isScored,
  LIMITS_DOC,
} from '@ncb/core'
import {
  Empty,
  Eyebrow,
  FactStrip,
  Headline,
  Note,
  PageTitle,
  Section,
  type Fact,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadDiagnostics, loadIndex } from '@/lib/data'
import { countryLayer } from '@/lib/layers'
import {
  agendasHref,
  capabilitiesHref,
  challengeHref,
  changelogHref,
  changelogReleaseHref,
  contactHref,
  countriesHref,
  countryLayerHref,
  decisionsHref,
  diagnosticsHref,
  glossaryHref,
  indicatorsHref,
  limitsHref,
  methodHref,
  supportHref,
  thesisHref,
} from '@/lib/links'
import { readWealthTracking } from '@/lib/wealth'
import { capitalize, countWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About, NCB',
  description:
    'What the National Capability Benchmark is made of, who built it, what it refuses to do, and where to start reading.',
}

/**
 * The object, not the argument.
 *
 * This page says what the benchmark is made of, what stage it is at, what it
 * will not do and how to argue with it. Why capability is worth measuring is
 * the thesis page's job, and the claim is stated there once. See D75.
 */
export default async function AboutPage() {
  const [data, diag] = await Promise.all([loadIndex(), loadDiagnostics()])
  if (!data) return <Empty hint={MISSING_DATA_HINT} />

  /* The count of wealth-tracking dimensions is computed, never typed into the
     copy: the thesis prints the same figure and a hand-written one drifts the
     first time a re-ingest moves a correlation across the line. */
  const tracking = diag ? readWealthTracking(diag).tracking.length : null
  const brazilLayer = countryLayer('BRA')
  const wired = INDICATORS.filter(isScored).length
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length

  const facts: Fact[] = [
    {
      label: 'Dataset',
      value: data.version ?? DATASET_VERSION,
      href: changelogReleaseHref(data.version ?? DATASET_VERSION),
      note: 'Adding a country rebases every score and bumps the major number.',
    },
    {
      label: 'Countries',
      value: COUNTRIES.length,
      href: countriesHref,
      note: 'All of them build the frame every score is measured against.',
    },
    {
      label: 'Indicators',
      value: `${wired} of ${INDICATORS.length}`,
      href: indicatorsHref,
      note: `${gaps} are declared gaps. They stay in the registry and lower confidence.`,
    },
    {
      label: 'Generated',
      value: data.generatedAt.slice(0, 10),
      href: changelogHref,
      note: 'Every published number comes from this run.',
    },
  ]

  return (
    <>
      <Eyebrow>About</Eyebrow>
      <PageTitle>We measure what a country can do</PageTitle>
      <Headline>
        NCB is a research prototype from Envisioning. It scores {COUNTRIES.length} countries on
        nine capabilities using public data, gives every score its own confidence value, and
        publishes no overall ranking.
      </Headline>

      <Section
        title="Every number here comes from one dated run"
        hint="How big the dataset is, how much of it is measured, and when it last ran."
      >
        <FactStrip facts={facts} />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Raw values carry their source and their year. Missing values are dropped rather than
          filled in, so a thin dimension shows as low confidence instead of a confident guess. Why
          any of this is worth measuring is the{' '}
          <Link href={thesisHref} className="underline underline-offset-4">
            thesis
          </Link>
          , which also shows how far the claim survives contact with the data.
        </p>
      </Section>

      <Section
        title="The benchmark refuses to rank, average, advise or guess"
        hint="The things it refuses are as much of the design as the things it computes."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            No overall score. Nine capabilities averaged into one number would hide the shape,
            which is the only interesting thing here.
          </li>
          <li>
            No ranking table and no league position. A country sits in a distribution, and its
            confidence sits beside it.
          </li>
          <li>
            No policy advice. The{' '}
            <Link href={agendasHref()} className="underline underline-offset-4">
              agendas
            </Link>{' '}
            say what to raise and what to measure first, computed from the data, and stop there.
          </li>
          <li>
            No score from a language model. Panel estimates stay in their own field, are labeled
            as estimates, and never enter a published capability score.
          </li>
        </ul>
      </Section>

      <Section
        title="It is a prototype, and the gaps are published"
        hint="The benchmark is early. Reading it well means reading what it gets wrong."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          {tracking === null
            ? 'Some capabilities correlate closely enough with income that the current indicators cannot separate the two.'
            : `${capitalize(countWord(tracking))} of the nine capabilities correlate closely enough with income that the current indicators cannot separate the two.`}{' '}
          Several dimensions rest on thin evidence, and the Delphi layer has no reviewed panel run
          behind it yet. All of that is written down:
        </p>
        <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            The{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limits
            </Link>{' '}
            record every place the data is wrong about the world, from{' '}
            <a href={docHref(LIMITS_DOC)} className="underline underline-offset-4">
              {LIMITS_DOC}
            </a>
            .
          </li>
          <li>
            The{' '}
            <Link href={diagnosticsHref} className="underline underline-offset-4">
              diagnostics
            </Link>{' '}
            test the model against itself: wealth sensitivity, redundant indicators, dimensions
            that overlap.
          </li>
          <li>
            The{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              decision log
            </Link>{' '}
            holds each methodological choice, what it costs and what evidence would overturn it.
          </li>
          <li>
            The{' '}
            <Link href={challengeHref} className="underline underline-offset-4">
              challenge page
            </Link>{' '}
            is where an objection, a gap fill or a documented delivery enters the record.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Code, data and documents live in the{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            open repository on GitHub
          </a>
          . Every number can be traced to the series it came from.
        </p>
      </Section>

      <Section
        title="Envisioning built it"
        hint="Envisioning researches how societies anticipate and act on change. The benchmark is one instrument in that work."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          <a href="https://envisioning.com" className="underline underline-offset-4" rel="noopener">
            Envisioning
          </a>{' '}
          is a technology research institute and advisory. Brazil is the first field case, and it
          gets no special treatment in the model. What it has is a reading of its own: the{' '}
          {brazilLayer ? (
            <Link href={countryLayerHref(brazilLayer)} className="underline underline-offset-4">
              Brazilian layer
            </Link>
          ) : (
            'Brazilian layer'
          )}{' '}
          carries the institution map and the subnational spread in Portuguese. The benchmark
          itself is published once, in English.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          Envisioning is looking for institutional partners to sharpen the method, close gaps with
          comparable data, and connect a diagnosis to an intervention.{' '}
          <Link href={supportHref} className="underline underline-offset-4">
            Support
          </Link>{' '}
          says what backing the work looks like, and{' '}
          <Link href={contactHref} className="underline underline-offset-4">
            contact
          </Link>{' '}
          reaches a person.
        </p>
      </Section>

      <Section title="Start with the countries page">
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            <Link href={countriesHref} className="underline underline-offset-4">
              Countries
            </Link>{' '}
            draws each one as a nine-capability shape and opens its full profile.
          </li>
          <li>
            <Link href={capabilitiesHref} className="underline underline-offset-4">
              Capabilities
            </Link>{' '}
            reads one capability across the whole set, with the indicators behind it.
          </li>
          <li>
            <Link href={agendasHref()} className="underline underline-offset-4">
              Agendas
            </Link>{' '}
            turn a country&apos;s scores into a raise, measure and hold list.
          </li>
          <li>
            The{' '}
            <Link href={methodHref} className="underline underline-offset-4">
              method
            </Link>{' '}
            explains the scoring, and the{' '}
            <Link href={glossaryHref} className="underline underline-offset-4">
              glossary
            </Link>{' '}
            defines every term this project invents.
          </li>
        </ul>
        <Note>
          Check the confidence before quoting a score. A thin dimension rests on one or two
          indicators, and the viewer marks it wherever it is drawn.
        </Note>
      </Section>
    </>
  )
}
