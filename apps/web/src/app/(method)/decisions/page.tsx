import type { Metadata } from 'next'
import { DECISIONS_DOC, docHref } from '@ncb/core'
import { Markdown } from '@/lib/markdown'
import { loadDoc } from '@/lib/data'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Decisions, NCB',
  description: 'The choices behind the benchmark, their trade-offs, and what could overturn them.',
}

/**
 * The decision log, rendered from docs/DECISIONS.md at request time.
 *
 * Every page and every generated document cites decisions by id. Those ids
 * reach readers who have no checkout, so each one has to resolve to something
 * readable. Each heading carries its id (D1, D2, ...) as an anchor, which is
 * what `decisionHref` in `lib/links.ts` points at. See D40.
 */
export default async function DecisionsPage() {
  const doc = await loadDoc('DECISIONS.md')

  return (
    <>
      <Eyebrow>The decision log</Eyebrow>
      <PageTitle>Why the benchmark works this way</PageTitle>
      <Headline>
        Each entry records a choice, its trade-offs and what could overturn it. The log is
        append-only, so later entries supersede earlier ones.
      </Headline>
      {doc ? (
        <Markdown source={doc} />
      ) : (
        <Empty
          hint={`The decision log is not available in this deployment. The source of record is ${DECISIONS_DOC} in the repository.`}
        />
      )}
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        This page reads{' '}
        <a href={docHref(DECISIONS_DOC)} className="underline underline-offset-4">
          {DECISIONS_DOC}
        </a>{' '}
        from the repository. If it differs from the site, the repository is the source of record.
      </p>
    </>
  )
}
