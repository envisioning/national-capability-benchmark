import Link from 'next/link'
import { fill } from '@ncb/core'
import { Headline, PageTitle, Section } from '@/components/ui'
import type { PressEntry, PressWords } from '@/lib/press'

/**
 * The press page in one language: where each number lives, how to cite it and
 * who to ask. The words and the entries come in as props, so the ground page
 * and a layer page render the same layout. See D193.
 */
export function PressView({
  words,
  entries,
  countryCount,
  rulesHref,
  contactHref,
}: {
  words: PressWords
  entries: PressEntry[]
  countryCount: number
  rulesHref: string
  contactHref: string
}) {
  return (
    <div>
      <PageTitle>{words.title}</PageTitle>
      <Headline>{fill(words.intro, { n: countryCount })}</Headline>
      <Section title={words.whereHeading}>
        <ul className="divide-y divide-[var(--rule-soft)] border-y border-[var(--rule-soft)]">
          {entries.map((entry) => (
            <li key={entry.href} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <Link href={entry.href} className="text-lg underline underline-offset-2 sm:w-80 sm:shrink-0">
                {entry.label}
              </Link>
              <span className="text-lg text-[var(--muted)]">{entry.note}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={words.citeHeading}>
        <p className="max-w-3xl text-lg leading-relaxed">{words.citeBody}</p>
        <p className="mt-4 text-lg">
          <a href={rulesHref} className="underline underline-offset-2">
            {words.citeRules}
          </a>
        </p>
      </Section>
      <Section title={words.contactHeading}>
        <p className="max-w-3xl text-lg leading-relaxed">{words.contactBody}</p>
        <p className="mt-4 text-lg">
          <Link href={contactHref} className="underline underline-offset-2">
            {words.contactLink}
          </Link>
        </p>
      </Section>
    </div>
  )
}
