import { AgendaEvidenceMatrix } from '@/components/views/AgendaEvidenceMatrix'
import { DeliveryTable } from '@/components/views/DeliveryTable'
import { Empty, Headline, PageTitle, Section } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { MISSING_DATA_HINT, loadEvidence, loadIndex } from '@/lib/data'
import { patternFiltersQuery, readPatternFilters } from '@/lib/links'

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
        Each agenda turns a country&apos;s scores into what to raise, what to measure first and what
        to keep watching. The register records what countries have built where the benchmark cannot
        yet measure, and none of it moves a score.
      </Headline>
      <Section
        title="Where examples exist"
        icon={<Icon name="list-filter" size={22} />}
        hint="Filled cells link to source-checked examples. Empty cells show where research is open."
      >
        <AgendaEvidenceMatrix records={records} active={filters} />
      </Section>

      <Section
        title="Documented examples"
        icon={<Icon name="hammer" size={22} />}
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
