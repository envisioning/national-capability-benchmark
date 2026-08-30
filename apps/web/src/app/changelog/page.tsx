import type { Metadata } from 'next'
import { CHANGELOG_DOC, docHref } from '@ncb/core'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { loadChangelog } from '@/lib/distribution'
import { Markdown } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Changelog, NCB',
  description: 'Release notes for the National Capability Benchmark and its viewer.',
}

/**
 * The release history is one human-curated document. It is read here, in the
 * feed and by the build gate rather than copied into separate app data, so a
 * release cannot appear on one surface and disappear on another.
 */
export default async function ChangelogPage() {
  const changelog = await loadChangelog()

  return (
    <>
      <Eyebrow>Release notes</Eyebrow>
      <PageTitle>What changed</PageTitle>
      <Headline>
        A short history of the benchmark frame, the viewer and the research work around them.
        Dataset versions are semantic, so a major version means the numbers need a new reading.
      </Headline>
      {changelog ? (
        <Markdown source={changelog} />
      ) : (
        <Empty
          hint={`The changelog is not available in this deployment. The source of record is ${CHANGELOG_DOC} in the repository.`}
        />
      )}
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        The source of record is{' '}
        <a href={docHref(CHANGELOG_DOC)} className="underline underline-offset-4">
          {CHANGELOG_DOC}
        </a>{' '}
        in the repository. The build checks that its newest release matches the dataset version.
      </p>
    </>
  )
}
