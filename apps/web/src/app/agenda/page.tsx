import Link from 'next/link'
import { AgendaEvidenceMatrix } from '@/components/views/AgendaEvidenceMatrix'
import { DeliveryTable } from '@/components/views/DeliveryTable'
import { Empty, Headline, PageTitle, Section } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { MISSING_DATA_HINT, loadEvidence, loadIndex } from '@/lib/data'
import { patternFiltersQuery, patternsHref, readPatternFilters } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Capability agendas',
  description:
    'Country agendas computed from the benchmark data, and every documented delivery filed against the indicators they say to measure first.',
}

/**
 * The agendas, one per country, and the deliveries they point at.
 *
 * An agenda names what a country should raise and what it should measure
 * first. The matrix shows which country-capability cells already carry a
 * documented delivery; the register below gives each one its claim, date,
 * source and status. The filters live in the query string, so a reader who has
 * narrowed the table can send that view on. See D46 and D90.
 *
 * Every agenda here is English, because the ground layer is. A country with a
 * layer of its own publishes the same agenda inside that layer, in that
 * layer's language, from the same JSON. See D35 and D69.
 */
export default async function AgendaIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const filters = readPatternFilters(await searchParams)
  const [data, records] = await Promise.all([loadIndex(), loadEvidence()])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  return (
    <>
      <PageTitle>Capability agendas</PageTitle>
      <Headline>
        Each agenda turns a country&apos;s scores into actions: what to raise, what to measure
        first and what to keep watching. The register below shows what countries have already built
        against the same missing indicators.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        A delivery is filed against an indicator that has no dataset behind it, so none of these
        records moves a score or a confidence. Filter or sort the register to find a delivery,
        then open its full record. The grouped view of the same corpus, with preconditions and
        where each move has travelled, is at{' '}
        <Link href={patternsHref()} className="underline underline-offset-4">
          patterns
        </Link>
        .
      </p>

      <Section
        title="Where examples exist"
        icon={<Icon name="list-filter" size={22} />}
        hint="Every benchmark country and all nine capabilities stay visible. Filled cells link to the source-checked examples; empty cells show where the research agenda is still open."
      >
        <AgendaEvidenceMatrix records={records} active={filters} />
      </Section>

      <Section
        title="What countries built"
        icon={<Icon name="hammer" size={22} />}
        hint="Each delivery keeps its claim readable beside the year, country, capability, status, published number, source and mechanism."
      >
        {records.length === 0 ? (
          <Empty hint="No evidence records yet. Add them to data/evidence/records.json." />
        ) : (
          <DeliveryTable
            key={patternFiltersQuery(filters)}
            records={records}
            initial={filters}
          />
        )}
      </Section>
    </>
  )
}
