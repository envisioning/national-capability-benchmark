import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PT_BR } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'
import { countryProfileHref, ogAgendaHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Agenda de capacidades do Brasil, NCB',
  description:
    'O que a evidência diz que o Brasil deve elevar, medir antes de gerir ou manter, calculado a partir dos dados públicos.',
  openGraph: {
    images: [{ url: ogAgendaHref('BRA'), width: 1200, height: 630, alt: 'Capability agenda for Brazil' }],
  },
  twitter: { card: 'summary_large_image', images: [ogAgendaHref('BRA')] },
}

/**
 * Brazil's agenda, read in Portuguese because Brazil's layer is written in
 * Portuguese. The same document in English is the ground-layer page at
 * /country/BRA/agenda, and both render the same JSON. See D69.
 */
export default async function BrazilAgendaPage() {
  const agenda = await loadAgenda('BRA')
  if (!agenda) notFound()

  return <AgendaView agenda={agenda} lex={PT_BR} profileHref={countryProfileHref('BRA')} />
}
