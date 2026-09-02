import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTRIBUTING_DOC,
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  INDICATORS,
  MEASUREMENT_CLASS_LABELS,
  docHref,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Headline, Note, PageTitle, Section } from '@/components/ui'
import {
  capabilityHref,
  contactTopicHref,
  indicatorHref,
  indicatorsHref,
  objectionsHref,
  supportHref,
} from '@/lib/links'
import { capitalize, countWord } from '@/lib/words'

export const metadata: Metadata = {
  title: 'Open gaps, NCB',
  description:
    'Every indicator the benchmark asks for and cannot measure, what it is trying to observe, and what a usable dataset would have to carry.',
}

/**
 * The declared gaps, read as open work.
 *
 * The registry already carried these and the indicators page already listed
 * them, as rows in a table of everything. That is the right place to look one
 * up and the wrong place to be recruited by one. A gap is the most specific
 * request for help this project can make: it names the thing it cannot see,
 * says why, and closing one raises confidence for every country at once.
 *
 * Nothing here is new data. The page is a second reading of `ingest: 'gap'`
 * and `ingest: 'retired'` from the one indicator registry. See D23 and D78.
 */
export default function GapsPage() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap')
  const retired = INDICATORS.filter((i) => i.ingest === 'retired')
  const byDimension = DIMENSIONS.map((dimension) => ({
    dimension,
    rows: gaps.filter((gap) => gap.dimension === dimension),
  })).filter((group) => group.rows.length > 0)

  return (
    <>
      <PageTitle>What the benchmark cannot measure</PageTitle>
      <Headline>
        A gap is an indicator the model asks for and no comparable dataset answers. It stays in
        the registry, it lowers confidence, and it is never deleted to make the numbers look
        better.
      </Headline>

      <Note>
        A gap closes when somebody names a published series that covers at least two countries
        with comparable definitions, an open URL, a publisher, a reference period and a stated
        method. National statistical sources count.{' '}
        <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
          {CONTRIBUTING_DOC}
        </a>{' '}
        has the full rule.
      </Note>

      <Section
        title={`One gap lowers confidence for all ${COUNTRIES.length} countries`}
        hint={`Confidence combines coverage, recency, and source quality. A gap reduces coverage for all ${COUNTRIES.length} countries, not only for countries with a weak score.`}
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          These {countWord(gaps.length)} gaps sit across{' '}
          {countWord(byDimension.length)} of the nine capabilities. If you know a dataset for one,
          the message takes a minute and it does not need to be complete: a link and a publisher
          is enough to start. Other ways to take part are on{' '}
          <Link href={supportHref} className="underline underline-offset-4">
            the ways to help page
          </Link>
          , and the full registry, scored rows included, is at{' '}
          <Link href={indicatorsHref} className="underline underline-offset-4">
            indicators
          </Link>
          .
        </p>
      </Section>

      {byDimension.map(({ dimension, rows }) => (
        <Section
          key={dimension}
          icon={<Icon name={DIMENSION_ICON[dimension as Dimension]} size={22} />}
          title={
            <Link href={capabilityHref(dimension)} className="hover:underline">
              {DIMENSION_LABELS[dimension]}
            </Link>
          }
          hint={`${capitalize(countWord(rows.length))} of this capability's indicators have no dataset behind them.`}
        >
          <ul className="space-y-6">
            {rows.map((gap) => (
              <li key={gap.id} className="max-w-3xl border-t border-[var(--rule)] pt-5">
                <h3 className="text-xl font-medium tracking-tight">
                  <Link href={indicatorHref(gap.id)} className="hover:underline">
                    {gap.name}
                  </Link>
                </h3>
                <p className="mt-2 text-lg leading-relaxed">{gap.definition}</p>
                {gap.notes ? (
                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                    Why it is open: {gap.notes}
                  </p>
                ) : null}
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="text-[var(--muted)]">
                    {MEASUREMENT_CLASS_LABELS[gap.measurementClass]}, measured in {gap.unit}
                  </span>
                  <Link
                    href={contactTopicHref('data', gap.id)}
                    className="font-medium underline underline-offset-4"
                  >
                    Suggest a dataset for this
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      {retired.length > 0 ? (
        <Section
          title="Datasets we rejected"
          hint="A retired indicator had a dataset and the project turned it down. Those rows also stay in the registry and lower confidence exactly as a gap does."
        >
          <ul className="max-w-3xl space-y-5">
            {retired.map((row) => (
              <li key={row.id} className="border-t border-[var(--rule)] pt-4">
                <h3 className="text-xl font-medium tracking-tight">
                  <Link href={indicatorHref(row.id)} className="hover:underline">
                    {row.name}
                  </Link>{' '}
                  <span className="text-xs font-normal text-[var(--muted)]">
                    {DIMENSION_LABELS[row.dimension]}
                  </span>
                </h3>
                {row.notes ? (
                  <p className="mt-2 text-lg leading-relaxed">{row.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            Retiring an indicator needs a decision entry naming the evidence, so each of these can
            be argued with.{' '}
            <Link href={objectionsHref} className="underline underline-offset-4">
              File an objection
            </Link>{' '}
            if you think one of them should be scored.
          </p>
        </Section>
      ) : null}
    </>
  )
}
