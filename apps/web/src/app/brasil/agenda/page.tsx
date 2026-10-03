import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PT_BR } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'
import { loadCountry } from '@/lib/data'
import { countryProfileHref, ogAgendaHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Agenda de capacidades do Brasil, NCB',
  description:
    'A agenda de capacidades do Brasil, calculada a partir dos dados públicos: as pontuações, a solidez da evidência, as lacunas de medição e as entregas documentadas.',
  openGraph: {
    images: [{ url: ogAgendaHref('BRA'), width: 1200, height: 630, alt: 'Agenda de capacidades do Brasil' }],
  },
  twitter: { card: 'summary_large_image', images: [ogAgendaHref('BRA')] },
}

/**
 * Brazil's agenda, read in Portuguese because Brazil's layer is written in
 * Portuguese. The same document in English is the ground-layer page at
 * /country/BRA/agenda, and both render the same JSON. See D69.
 */
export default async function BrazilAgendaPage() {
  const [agenda, country] = await Promise.all([loadAgenda('BRA'), loadCountry('BRA')])
  if (!agenda || !country) notFound()

  return <AgendaView agenda={agenda} country={country} lex={PT_BR} profileHref={countryProfileHref('BRA')} />
}
