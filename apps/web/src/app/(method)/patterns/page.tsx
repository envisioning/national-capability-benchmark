import { PatternsView } from '@/components/views/PatternsView'
import { Empty, Headline, PageTitle } from '@/components/ui'
import { loadEvidence } from '@/lib/data'
import { readPatternFilters } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Patterns, NCB',
  description: 'Documented examples of what countries have built, with sources and limits.',
}

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  /* The filters arrive in the URL, so the first render is already narrowed and
   * a shared link shows what the sender saw. See D46. */
  const filters = readPatternFilters(await searchParams)
  const records = await loadEvidence()
  if (records.length === 0) {
    return <Empty hint="No evidence records yet. Add them to data/evidence/records.json." />
  }

  const withPattern = records.filter((r) => r.pattern)

  return (
    <>
      <PageTitle>Documented examples</PageTitle>
      <Headline>
        What countries built that the indicators do not capture. The source provides the published
        number and the mechanism is our interpretation. {withPattern.length} of {records.length}{' '}
        records include a mechanism, and none affects a score.
      </Headline>

      <PatternsView records={records} initial={filters} />
    </>
  )
}
