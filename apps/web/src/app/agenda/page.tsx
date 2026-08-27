import Link from 'next/link'
import { COUNTRY_NAMES } from '@ncb/core'
import { Empty, Eyebrow, PageTitle } from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Capability agendas',
  description: 'Each country’s scores turned into a list of things to do, computed from the data.',
}

/**
 * The agendas, one per country. The agenda itself explains its own rules; this
 * page only routes. Portuguese lives at /pt as an interpretation layer over
 * the same JSON. See D35.
 */
export default async function AgendaIndexPage() {
  const data = await loadIndex()
  if (!data) return <Empty hint={MISSING_DATA_HINT} />
  const countries = [...data.countries].sort((a, b) =>
    (COUNTRY_NAMES[a.iso3] ?? a.iso3).localeCompare(COUNTRY_NAMES[b.iso3] ?? b.iso3),
  )

  return (
    <>
      <Eyebrow>Computed from the data, regenerated with every run</Eyebrow>
      <PageTitle>Capability agendas</PageTitle>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed">
        Each agenda turns one country&apos;s scores into a list of things to do: dimensions to
        raise, dimensions to measure before managing, and the declared gaps that form the
        measurement agenda. Nothing in it is written by hand.{' '}
        <Link href="/pt" className="underline underline-offset-4">
          Também disponível em português.
        </Link>
      </p>
      <ul className="mt-10 grid gap-x-8 gap-y-2 text-lg sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <li key={c.iso3}>
            <Link href={`/agenda/${c.iso3}`} className="underline underline-offset-4">
              {COUNTRY_NAMES[c.iso3] ?? c.iso3}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
