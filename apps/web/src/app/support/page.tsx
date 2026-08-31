import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTRIBUTION_EFFORTS,
  COUNTRIES,
  FUNDABLE_PIECES,
  INDICATORS,
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
    'Every way to take part in the National Capability Benchmark, from a five-minute correction to a funded piece of work.',
}

/** What each tier is for, above the cards in it. */
const EFFORT_HINT: Record<(typeof CONTRIBUTION_EFFORTS)[number], string> = {
  minutes:
    'You know something the data does not. These take one message and no commitment beyond it.',
  project:
    'You have a case, a series or a decision to test the benchmark against. These take real work and change what the benchmark can measure.',
  funded:
    'The work is modular on purpose, so a funder backs a named piece with a scope and a stated effect.',
}

/**
 * The front door for taking part.
 *
 * The page renders the contribution registry in `@ncb/core` rather than
 * restating it, and it opens on the cheapest thing a reader can do rather than
 * on a funding ask. A country layer may hold its own reading of this page,
 * written for that country's institutions and its own funding venues. See D71
 * and D78.
 */
export default function SupportPage() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length

  return (
    <>
      <PageTitle>Support the benchmark</PageTitle>
      <Headline>
        {COUNTRIES.length} countries, nine capabilities, public data, open code. What it still
        needs is use, evidence and time. Ways to help are below, cheapest first.
      </Headline>

      <Note>
        The benchmark is free to read, free to quote and free to fork. Nothing on this page is a
        condition of using it.
      </Note>

      {CONTRIBUTION_EFFORTS.map((effort) => (
        <Section
          key={effort}
          title={
            effort === 'minutes'
              ? 'Start here if you have five minutes'
              : effort === 'project'
                ? 'These take a piece of work'
                : 'These need funding'
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
        title="What funding pays for"
        hint="Each piece names its scope and what changes in the published data once it is done."
      >
        <div className="space-y-8">
          {FUNDABLE_PIECES.map((piece) => (
            <div key={piece.id} className="max-w-3xl">
              <h3 className="text-xl font-medium tracking-tight">{piece.label}</h3>
              <dl className="mt-3 space-y-2 text-lg leading-relaxed">
                <div>
                  <dt className="inline font-medium">Scope. </dt>
                  <dd className="inline">{piece.scope}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Effect. </dt>
                  <dd className="inline">{piece.effect}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Funded by. </dt>
                  <dd className="inline text-[var(--muted)]">{piece.funders}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed">
          If you hold one of those windows, or you know which one this fits,{' '}
          <Link href={contactTopicHref('support')} className="underline underline-offset-4">
            write to us
          </Link>{' '}
          and say which piece.
        </p>
      </Section>

      <Section
        title="Read the limits first"
        hint="Do not fund it or quote it without knowing where it fails."
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
            {COUNTRY_LAYERS.map((layer) => (
              <Link
                key={layer.slug}
                href={countryLayerHref(layer)}
                className="underline underline-offset-4"
              >
                {layer.label}
              </Link>
            ))}{' '}
            is the first country layer, and the shape it uses works for any country whose
            institutions want to build the same thing.
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
