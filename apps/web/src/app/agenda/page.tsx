import Link from 'next/link'
import { COUNTRY_NAMES } from '@ncb/core'
import { CountryLabel } from '@/components/ui'
import { Empty, Eyebrow, PageTitle } from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'
import { agendaHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Capability agendas',
  description: 'Country agendas computed from the benchmark data.',
}

/**
 * The agendas, one per country. The agenda itself explains its own rules; this
 * page only routes. Portuguese lives at /pt as an interpretation layer over
 * the same JSON. See D35.
 */
export default async function AgendaIndexPage() {
  const data = await loadIndex()
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />
  const countries = [...data.countries].sort((a, b) =>
    (COUNTRY_NAMES[a.iso3] ?? a.iso3).localeCompare(COUNTRY_NAMES[b.iso3] ?? b.iso3),
  )

  return (
    <>
      <Eyebrow>One agenda per country</Eyebrow>
      <PageTitle>Capability agendas</PageTitle>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed">
        Each agenda turns a country&apos;s scores into actions: what to raise, what to measure first
        and what to keep watching. It also lists the missing data. The lists come from the data.
      </p>
      <ul className="mt-10 grid gap-x-8 gap-y-2 text-lg sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <li key={c.iso3}>
            <Link href={agendaHref(c.iso3)} className="underline underline-offset-4">
              <CountryLabel iso3={c.iso3} name={COUNTRY_NAMES[c.iso3] ?? c.iso3} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
