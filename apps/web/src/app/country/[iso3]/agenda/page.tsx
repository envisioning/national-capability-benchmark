import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRY_NAMES, EN } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'
import { loadCountry } from '@/lib/data'
import { countryProfileHref, ogAgendaHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso3: string }>
}): Promise<Metadata> {
  const { iso3 } = await params
  const name = COUNTRY_NAMES[iso3.toUpperCase()]
  if (!name) return {}
  return {
    title: `Capability agenda: ${name}, NCB`,
    description: `The capability agenda for ${name}, computed from the benchmark data.`,
    openGraph: {
      images: [{ url: ogAgendaHref(iso3.toUpperCase()), width: 1200, height: 630, alt: `${name} capability agenda` }],
    },
    twitter: { card: 'summary_large_image', images: [ogAgendaHref(iso3.toUpperCase())] },
  }
}

/**
 * One country's agenda in the ground layer, which is English for every
 * country. A country with a layer of its own also publishes its agenda inside
 * that layer, in that layer's language, from this same JSON. The page does not
 * change language with a query string or a browser header: that turned every
 * country into a second edition nobody had written. See D69.
 */
export default async function CountryAgendaPage({
  params,
}: {
  params: Promise<{ iso3: string }>
}) {
  const { iso3 } = await params
  const [agenda, country] = await Promise.all([loadAgenda(iso3), loadCountry(iso3)])
  if (!agenda || !country) notFound()

  return <AgendaView agenda={agenda} country={country} lex={EN} profileHref={countryProfileHref(agenda.iso3)} />
}
