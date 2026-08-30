import type { Metadata } from 'next'
import { LIMITS_DOC, docHref } from '@ncb/core'
import { Markdown } from '@/lib/markdown'
import { loadDoc } from '@/lib/data'
import { Empty, Headline, PageTitle } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Known limits, NCB',
  description: 'Known measurement failures, with evidence and possible fixes.',
}

/**
 * The project's limits record, rendered from docs/KNOWN-ARTEFACTS.md at request
 * time so the page and the repository cannot say different things. Each
 * artefact heading carries its id (A1, A2, ...) as an anchor, so any surface
 * can point at the limit that affects it.
 */
export default async function LimitsPage() {
  const doc = await loadDoc('KNOWN-ARTEFACTS.md')

  return (
    <>
      <PageTitle>Some numbers here are wrong</PageTitle>
      <Headline>
        These are known measurement failures, with the evidence and possible fix. The pipeline is
        working as designed; the design is sometimes wrong.
      </Headline>
      {doc ? (
        <Markdown source={doc} />
      ) : (
        <Empty
          hint={`The limits document is not available in this deployment. The source of record is ${LIMITS_DOC} in the repository.`}
        />
      )}
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        This page reads{' '}
        <a href={docHref(LIMITS_DOC)} className="underline underline-offset-4">
          {LIMITS_DOC}
        </a>{' '}
        from the repository. If it differs from the site, the repository is the source of record.
      </p>
    </>
  )
}
