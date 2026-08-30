import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTACT_TOPICS,
  INDICATORS_BY_ID,
  REPO_URL,
  contributionWay,
} from '@ncb/core'
import type { ContactTopic, ContributionId } from '@ncb/core'
import { ContactForm } from '@/components/ContactForm'
import { ContributionList } from '@/components/ContributionList'
import { Headline, PageTitle, Section } from '@/components/ui'
import { gapsHref, supportHref } from '@/lib/links'

/** The three that keep their record in public, so they never come through the form. */
const PUBLIC_CHANNELS: ContributionId[] = ['object', 'gap', 'code']

export const metadata: Metadata = {
  title: 'Contact, NCB',
  description: 'One place to write to the people who build the National Capability Benchmark.',
}

/**
 * The one communication page.
 *
 * Every invitation to get in touch, on the ground layer and inside a country
 * layer, ends here. The page also names the channels that are not this form,
 * because an argument about a score belongs beside that score and a bug
 * belongs in the issue tracker. See D71.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const raw = Array.isArray(params.topic) ? params.topic[0] : params.topic
  const topic = (CONTACT_TOPICS as readonly string[]).includes(raw ?? '')
    ? (raw as ContactTopic)
    : 'general'

  /* A reader who arrives from a gap should not have to remember which gap it
     was. The id is resolved against the registry, so an unknown one prefills
     nothing rather than pasting a stray string into the message. */
  const about = Array.isArray(params.about) ? params.about[0] : params.about
  const indicator = about ? INDICATORS_BY_ID[about] : undefined
  const draft = indicator
    ? `About the gap "${indicator.name}" (${indicator.id}). The dataset I know is:\n\n`
    : ''

  return (
    <>
      <PageTitle>Write to us</PageTitle>
      <Headline>
        The most useful messages name a dataset we missed or a number that looks wrong.
      </Headline>

      <Section
        title="Send a message"
        hint="Your message reaches the Envisioning team directly. Nothing you write here is published."
      >
        <ContactForm topic={topic} draft={draft} />
      </Section>

      <Section
        title="Faster ways to reach an answer"
        hint="These leave a public record, so the answer stays useful to the next person."
      >
        <ContributionList
          ways={PUBLIC_CHANNELS.map(contributionWay).filter((way) => way !== null)}
        />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The{' '}
          <Link href={gapsHref} className="underline underline-offset-4">
            open gaps
          </Link>{' '}
          list names every indicator with no dataset behind it, and{' '}
          <Link href={supportHref} className="underline underline-offset-4">
            ways to help
          </Link>{' '}
          holds the rest, including the funded pieces.
        </p>
      </Section>

      <Section title="Who answers">
        <p className="max-w-3xl text-lg leading-relaxed">
          NCB is built by{' '}
          <a
            href="https://envisioning.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Envisioning
          </a>
          , a technology research institute and advisory. The code and the data are open, at{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            the repository on GitHub
          </a>
          . If you want to back the work rather than ask about it, start at{' '}
          <Link href={supportHref} className="underline underline-offset-4">
            support
          </Link>
          .
        </p>
      </Section>
    </>
  )
}
