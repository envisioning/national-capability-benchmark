import { PatternsView } from '@/components/views/PatternsView'
import { Empty, Eyebrow, Headline, Highlight, PageTitle } from '@/components/ui'
import { loadEvidence } from '@/lib/data'
import { readPatternFilters } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Patterns, NCB',
  description:
    'Documented national deliveries, filed against the indicators that should have measured them: the number, the mechanism, and its limits.',
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
        Every record here is a thing a country built, filed against the indicator that should have
        measured it and could not. The number is sourced. The{' '}
        <Highlight>mechanism</Highlight> is our reading, and it is the part that can travel.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        A score says how a country is doing. This says what it did, how the move worked and what had
        to be true first. Copying a form rarely works. Understanding a mechanism and rebuilding it
        under different conditions sometimes does, and the preconditions are where most attempts
        fail. {withPattern.length} of {records.length} records carry a mechanism so far. Each record
        has its own page, and none of this enters any score.
      </p>

      <PatternsView records={records} initial={filters} />
    </>
  )
}
