import Link from 'next/link'
import { COUNTRY_NAMES } from '@ncb/core'
import { DeliveryTable } from '@/components/views/DeliveryTable'
import { Empty, Headline, Highlight, PageTitle, Section } from '@/components/ui'
import { CountryLabel } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { MISSING_DATA_HINT, loadEvidence, loadIndex } from '@/lib/data'
import { agendaHref, patternsHref, readPatternFilters } from '@/lib/links'

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
 * first. The table answers the same question from the other side: what has
 * already been built against those missing indicators, when it started, what
 * number carries it and whether it still runs. The filters live in the query
 * string, so a reader who has narrowed the table can send that view on. See
 * D46.
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

  const countries = [...data.countries].sort((a, b) =>
    (COUNTRY_NAMES[a.iso3] ?? a.iso3).localeCompare(COUNTRY_NAMES[b.iso3] ?? b.iso3),
  )
  const withRecords = new Set(records.map((r) => r.iso3))

  return (
    <>
      <PageTitle>Capability agendas</PageTitle>
      <Headline>
        Each agenda turns a country&apos;s scores into actions: what to raise, what to measure
        first and what to keep watching. The register below shows what countries have already{' '}
        <Highlight>built</Highlight> against the same missing indicators.
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
        title="What countries built"
        icon={<Icon name="hammer" size={22} />}
        hint="Each delivery keeps its claim readable beside the year, country, capability, status, published number, source and mechanism."
      >
        {records.length === 0 ? (
          <Empty hint="No evidence records yet. Add them to data/evidence/records.json." />
        ) : (
          <DeliveryTable records={records} initial={filters} />
        )}
      </Section>

      <Section
        title="One agenda per country"
        icon={<Icon name="list-filter" size={22} />}
        hint="Every country in the benchmark has an agenda, including the ones with no delivery recorded yet. A marked country has at least one row in the table above."
      >
        <ul className="grid gap-x-8 gap-y-2 text-lg sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <li key={c.iso3}>
              <Link href={agendaHref(c.iso3)} className="underline underline-offset-4">
                <CountryLabel iso3={c.iso3} name={COUNTRY_NAMES[c.iso3] ?? c.iso3} />
              </Link>
              {withRecords.has(c.iso3) ? (
                <span className="ml-2 text-xs text-[var(--muted)]">
                  {records.filter((r) => r.iso3 === c.iso3).length} recorded
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
