import { PatternsView } from '@/components/views/PatternsView'
import { Empty, Eyebrow, Headline, Highlight, PageTitle } from '@/components/ui'
import { loadEvidence } from '@/lib/data'
import { readPatternFilters } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Patterns, NCB',
  description:
    'Documented national deliveries, with their numbers, mechanisms and limits.',
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

  const countries = new Set(records.map((r) => r.iso3))
  const withPattern = records.filter((r) => r.pattern)

  return (
    <>
      <Eyebrow>
        {records.length} deliveries, {countries.size} countries
      </Eyebrow>
      <PageTitle>What countries actually did</PageTitle>
      <Headline>
        Each record describes something a country built, filed against an indicator that could not
        measure it. The number is sourced. The{' '}
        <Highlight>mechanism</Highlight> is our reading and the part that may travel.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        A score says how a country is doing. These records say what it did, how the move worked and
        what it needed first. Copying a form rarely works. Rebuilding the mechanism under different
        conditions sometimes does. {withPattern.length} of {records.length} records include one, and
        none of this enters a score.
      </p>

      <PatternsView records={records} initial={filters} />
    </>
  )
}
