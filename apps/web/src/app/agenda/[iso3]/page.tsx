import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRY_NAMES, EN } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'
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

export default async function AgendaPage({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const agenda = await loadAgenda(iso3)
  if (!agenda) notFound()

  return <AgendaView agenda={agenda} lex={EN} profileHref={countryProfileHref(agenda.iso3)} />
}
