import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTRIBUTION_EFFORTS,
  COUNTRIES,
  INDICATORS,
  isDeclaredGap,
  REPO_URL,
  contributionsByEffort,
} from '@ncb/core'
import { ContributionList } from '@/components/ContributionList'
import { Headline, Note, PageTitle, Section } from '@/components/ui'
import { COUNTRY_LAYERS } from '@/lib/layers'
import {
  contactTopicHref,
  countryLayerHref,
  gapsHref,
  limitsHref,
  objectionsHref,
  thesisHref,
} from '@/lib/links'

export const metadata: Metadata = {
  title: 'Ways to help, NCB',
  description:
    'Every way to take part in the National Capability Benchmark, from a five-minute correction to hosting a discussion of the results.',
}

/** What each tier is for, above the cards in it. */
const EFFORT_HINT: Record<(typeof CONTRIBUTION_EFFORTS)[number], string> = {
  minutes:
    'You know something the data does not. Each of these takes one message.',
  project:
    'You have a case, a series or a decision to test the benchmark against. These take real work and change what the benchmark can measure.',
  commitment:
    'These ask an institution to stay with the benchmark for a while: to keep a country reading current, or to put the results in front of people who will argue with them.',
}

/**
 * The front door for taking part.
 *
 * The page renders the contribution registry in `@ncb/core` rather than
 * restating it, and it opens on the cheapest thing a reader can do rather than
 * on a funding ask. Envisioning funds the project itself, so the page asks
 * for no money (D164). A country layer may hold its own reading of this page,
 * written for that country's institutions. See D71, D78 and D158.
 */
export default function SupportPage() {
  const gaps = INDICATORS.filter(isDeclaredGap).length

  return (
    <>
      <PageTitle>Support the benchmark</PageTitle>
      <Headline>
        The benchmark scores {COUNTRIES.length} countries on nine capabilities from public data,
        and its code is open. Envisioning pays for the work and asks for no money. It needs use,
        evidence, an outside review and people who will argue with it. The ways to help below start
        with the cheapest.
      </Headline>

      <Note>
        Anyone can read, quote and fork the benchmark for free.
      </Note>

      {CONTRIBUTION_EFFORTS.map((effort) => (
        <Section
          key={effort}
          title={
            effort === 'minutes'
              ? 'Start here if you have five minutes'
              : effort === 'project'
                ? 'These take a piece of work'
                : 'These take an ongoing commitment'
          }
          hint={EFFORT_HINT[effort]}
        >
          <ContributionList ways={contributionsByEffort(effort)} showEffort={false} />
          {effort === 'minutes' ? (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">
              The fastest useful thing is to close a gap. {gaps} indicators in the registry have no
              dataset behind them, and each one lowers confidence for every country at once. The{' '}
              <Link href={gapsHref} className="underline underline-offset-4">
                open gaps
              </Link>{' '}
              list says what each is trying to measure and what a usable series would look like.
            </p>
          ) : null}
        </Section>
      ))}


      <Section
        title="Read the limits first"
        hint="Do not quote it or build on it without knowing where it fails."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            <Link href={thesisHref} className="underline underline-offset-4">
              The thesis
            </Link>{' '}
            states the claim under test and shows how far the data supports it today.
          </li>
          <li>
            <Link href={limitsHref} className="underline underline-offset-4">
              The known limits
            </Link>{' '}
            name the numbers that say more about a missing dataset than about the country.
          </li>
          <li>
            <Link href={objectionsHref} className="underline underline-offset-4">
              The objections
            </Link>{' '}
            are published beside the scores they argue with.
          </li>
          <li>
            {COUNTRY_LAYERS.map((layer, i) => (
              <span key={layer.slug}>
                {i === 0 ? null : i === COUNTRY_LAYERS.length - 1 ? ' and ' : ', '}
                <Link href={countryLayerHref(layer)} className="underline underline-offset-4">
                  {layer.label}
                </Link>
              </span>
            ))}{' '}
            {COUNTRY_LAYERS.length === 1
              ? 'is the first country layer. Its structure works'
              : 'have country layers, each in its own language. The structure works'}{' '}
            for any country whose institutions want to build the same thing.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The code and the data are at{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            the repository on GitHub
          </a>
          .
        </p>
      </Section>

      <Section
        title="If none of that fits"
        hint="Several of the gaps in the registry came out of a conversation with somebody who measures a country for a living."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Tell us what your institution measures, what it cannot measure, and which decision it
          would want this to inform.{' '}
          <Link href={contactTopicHref('general')} className="underline underline-offset-4">
            Write to us
          </Link>
          .
        </p>
      </Section>
    </>
  )
}
