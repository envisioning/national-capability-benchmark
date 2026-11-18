import Link from 'next/link'
import { Card, Section } from '@/components/ui'
import type { EntryAudience, EntryQuestion } from '@/lib/entry'

/**
 * The ways into a front page: questions a reader might ask, and one card per
 * audience. Both take computed entries from `lib/entry.ts`, so the ground page
 * and Brazil's layer draw the same layout in their own words. See D194.
 */

export function ExampleQuestions({ label, questions }: { label: string; questions: EntryQuestion[] }) {
  if (questions.length === 0) return null
  return (
    <nav aria-label={label} className="mt-5">
      <ul className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <li key={q.href}>
            <Link
              href={q.href}
              className="inline-block rounded-full border border-[var(--rule)] px-3 py-1.5 text-xs font-medium hover:border-[var(--foreground)]"
            >
              {q.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function AudienceCards({ title, audiences }: { title: string; audiences: EntryAudience[] }) {
  if (audiences.length === 0) return null
  return (
    <Section title={title}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => (
          <Card key={a.audience} padding="lg">
            <h3 className="text-xl font-light leading-tight">{a.audience}</h3>
            <p className="mt-3 text-xs leading-relaxed">{a.job}</p>
            {a.preview ? <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">{a.preview}</p> : null}
            <Link href={a.href} className="mt-4 inline-block text-xs underline underline-offset-4">
              {a.linkLabel}
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  )
}
