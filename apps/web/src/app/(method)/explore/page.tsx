import type { Metadata } from 'next'
import Link from 'next/link'
import { DIMENSIONS, INDICATORS, buildIndicatorLanes, isScored } from '@ncb/core'
import { ExploreView } from '@/components/views/ExploreView'
import { Headline, PageTitle } from '@/components/ui'
import { loadDiagnostics } from '@/lib/data'
import { diagnosticsHref, indicatorsHref, readLaneArrangement } from '@/lib/links'
import { countWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Explore, NCB',
  description:
    'Every indicator drawn in its capability lane, placed by how closely it tracks income, with the overlapping pairs joined.',
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  /* The arrangement arrives in the URL, so a shared link opens on the view the
   * sender saw. See D108. */
  const arrangement = readLaneArrangement(await searchParams)
  const diag = await loadDiagnostics()
  const field = buildIndicatorLanes(diag)
  const wired = INDICATORS.filter(isScored).length

  return (
    <>
      <PageTitle>Where every indicator sits</PageTitle>
      <Headline>
        {INDICATORS.length} indicators in {countWord(DIMENSIONS.length)} lanes, one per capability.{' '}
        {wired} have data. Point at a mark to read it, and change the arrangement to see how
        closely each series tracks income.
      </Headline>
      <ExploreView field={field} initial={arrangement} />
      <p className="mt-10 max-w-3xl text-lg leading-relaxed">
        The same rows as a table, with source, unit and definition, are in the{' '}
        <Link href={indicatorsHref} className="underline underline-offset-4">
          indicator registry
        </Link>
        . The tests behind the measure and the overlaps are in the{' '}
        <Link href={diagnosticsHref} className="underline underline-offset-4">
          diagnostics
        </Link>
        .
      </p>
    </>
  )
}
