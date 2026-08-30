import type { Metadata } from 'next'
import Link from 'next/link'
import {
  COUNTRIES,
  CONTRIBUTING_DOC,
  EVIDENCE_DOC,
  ISSUES_URL,
  REPO_URL,
  docHref,
} from '@ncb/core'
import { Eyebrow, Headline, Highlight, Note, PageTitle, Section } from '@/components/ui'
import { COUNTRY_LAYERS } from '@/lib/layers'
import {
  challengeHref,
  contactHref,
  countryLayerHref,
  limitsHref,
  patternsHref,
  thesisHref,
} from '@/lib/links'

export const metadata: Metadata = {
  title: 'Support this work, NCB',
  description:
    'Three ways an institution can back the National Capability Benchmark: use it, contribute to it, fund it.',
}

/**
 * How an institution backs the work.
 *
 * The page names three things and no more: use the benchmark, contribute to
 * it, fund it. Each one ends at an address a reader can act on today, and all
 * three end at the same contact page, because the project has one inbox. A
 * country layer may hold its own reading of this page, written for that
 * country's institutions and its own funding venues. See D71.
 */
export default function SupportPage() {
  return (
    <>
      <Eyebrow>Support</Eyebrow>
      <PageTitle>A prototype becomes an instrument when institutions use it</PageTitle>
      <Headline>
        {COUNTRIES.length} countries, nine capabilities, public data, open code. What it still
        needs is <Highlight>use, evidence and time</Highlight>. An institution can give all
        three.
      </Headline>

      <Note>
        The benchmark is free to read, free to quote and free to fork. Nothing on this page is a
        condition of using it.
      </Note>

      <Section
        title="Use it, and tell us where it broke"
        hint="A measure nobody applies stays a hypothesis. The most useful thing an institution can do is put the benchmark against a decision it is already making."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            Read{' '}
            <Link href={thesisHref} className="underline underline-offset-4">
              the thesis
            </Link>{' '}
            first. It states the claim under test and what would sink it.
          </li>
          <li>
            Then read{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              the known limits
            </Link>
            . Some numbers say more about a missing dataset than about the country, and the
            project names which ones before anybody quotes them.
          </li>
          <li>
            Argue with a score at{' '}
            <Link href={challengeHref} className="underline underline-offset-4">
              the challenge page
            </Link>
            . A dispute is published next to the number it targets, so the objection travels with
            the score.
          </li>
        </ul>
      </Section>

      <Section
        title="Contribute data, evidence or a country layer"
        hint="Every declared gap in the registry is a data-collection agenda item. Closing one is worth more than any commentary."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            A comparable series that covers at least two countries can become a scored indicator.{' '}
            <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
              CONTRIBUTING.md
            </a>{' '}
            says how to propose one.
          </li>
          <li>
            A documented delivery, with a publisher behind it, becomes{' '}
            <Link href={patternsHref()} className="underline underline-offset-4">
              an evidence record
            </Link>
            . Records are never scored. They are what lets a capability with no dataset behind it
            still be read.{' '}
            <a href={docHref(EVIDENCE_DOC)} className="underline underline-offset-4">
              The inclusion rule
            </a>{' '}
            is short.
          </li>
          <li>
            A country layer is a second reading of one country, in that country's language and at
            that country's depth.{' '}
            {COUNTRY_LAYERS.map((layer) => (
              <Link
                key={layer.slug}
                href={countryLayerHref(layer)}
                className="underline underline-offset-4"
              >
                {layer.label}
              </Link>
            ))}{' '}
            is the first one, and the shape it uses works for any country whose institutions want
            to build the same thing.
          </li>
          <li>
            Everything else, including a bug, goes to{' '}
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              the issue tracker
            </a>
            . The code and the data live at{' '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              the repository on GitHub
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section
        title="Fund a piece of it"
        hint="The work is modular on purpose, so a funder backs a named piece with a scope and a deliverable."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            <span className="font-medium">A capability</span>: one dimension, its indicator set, its
            gaps closed and its evidence corpus built out. Most research grants are already this
            size.
          </li>
          <li>
            <span className="font-medium">A country layer</span>: one country read in its own language,
            with its institution map and its subnational spread. Usually funded by a development
            bank, a school of government or a public foundation in that country.
          </li>
          <li>
            <span className="font-medium">A source adapter</span>: one publisher wired in and kept
            current, which raises confidence across every country at once.
          </li>
          <li>
            <span className="font-medium">The expert panel</span>: a reviewed run across the full country
            set, which is what turns session estimates into evidence.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Research grants, public-sector procurement, philanthropic funds and multilateral
          research budgets have all funded pieces of work shaped like these. If you hold one, or
          you know which window this fits,{' '}
          <Link href={`${contactHref}?topic=support`} className="underline underline-offset-4">
            write to us
          </Link>{' '}
          and say which piece.
        </p>
      </Section>

      <Section
        title="Keep the conversation going"
        hint="The benchmark improves through argument, not through agreement."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          If none of the above fits yet, the useful thing is still to talk. Tell us what your
          institution measures, what it cannot measure, and which decision it would want this to
          inform.{' '}
          <Link href={contactHref} className="underline underline-offset-4">
            One message reaches a person
          </Link>
          , and those conversations are where several of the gaps in the registry came from.
        </p>
      </Section>
    </>
  )
}
