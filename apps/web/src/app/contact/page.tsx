import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTACT_TOPICS,
  CONTRIBUTING_DOC,
  ISSUES_URL,
  REPO_URL,
  docHref,
} from '@ncb/core'
import type { ContactTopic } from '@ncb/core'
import { ContactForm } from '@/components/ContactForm'
import { Eyebrow, Headline, PageTitle, Section } from '@/components/ui'
import { challengeHref, supportHref } from '@/lib/links'

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

  return (
    <>
      <Eyebrow>Contact</Eyebrow>
      <PageTitle>Write to the people who build this</PageTitle>
      <Headline>
        One address for the whole project. Tell us who you are and what you are working on, and a
        person answers.
      </Headline>

      <Section
        title="Send a message"
        hint="Your message reaches the Envisioning team directly. Nothing you write here is published."
      >
        <ContactForm topic={topic} />
      </Section>

      <Section
        title="Some things belong somewhere else"
        hint="Three channels stay separate, because each one keeps its record in public where it is useful."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            An objection to a specific score goes through{' '}
            <Link href={challengeHref} className="underline underline-offset-4">
              the challenge page
            </Link>
            . A dispute is published beside the number it argues with, so the disagreement stays
            attached to the score.
          </li>
          <li>
            A bug, a broken series or a wrong label goes to{' '}
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              the issue tracker on GitHub
            </a>
            .
          </li>
          <li>
            A source, an evidence record or a lexicon comes as a pull request.{' '}
            <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
              CONTRIBUTING.md
            </a>{' '}
            says what each one has to carry.
          </li>
        </ul>
      </Section>

      <Section title="Envisioning builds this">
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
