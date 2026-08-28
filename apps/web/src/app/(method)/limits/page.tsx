import type { Metadata } from 'next'
import { LIMITS_DOC, docHref } from '@ncb/core'
import { Markdown } from '@/lib/markdown'
import { loadDoc } from '@/lib/data'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Known limits, NCB',
  description:
    'Where the benchmark produces a number that is wrong about the world, recorded with severity, evidence and a fix.',
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
      <Eyebrow>Read before quoting</Eyebrow>
      <PageTitle>Some numbers here are wrong about the world</PageTitle>
      <Headline>
        These are the places we know about, recorded with severity, evidence and a fix. They are
        not bugs: the pipeline is doing what it was told. They are failures of measurement.
      </Headline>
      {doc ? (
        <Markdown source={doc} />
      ) : (
        <Empty
          hint={`The limits document is not available in this deployment. The source of record is ${LIMITS_DOC} in the repository.`}
        />
      )}
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        This page renders{' '}
        <a href={docHref(LIMITS_DOC)} className="underline underline-offset-4">
          {LIMITS_DOC}
        </a>{' '}
        from the repository, unchanged. If the two ever disagree, the repository wins.
      </p>
    </>
  )
}
