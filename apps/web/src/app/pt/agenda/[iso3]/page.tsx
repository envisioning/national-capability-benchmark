import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PT_BR } from '@ncb/core'
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
  const name = PT_BR.countries[iso3.toUpperCase()]
  if (!name) return {}
  return {
    title: `Agenda de capacidades: ${name}, NCB`,
    description: `O que a evidência diz que ${name} deve elevar, medir ou manter, calculado a partir dos dados.`,
    openGraph: {
      images: [{ url: ogAgendaHref(iso3.toUpperCase()), width: 1200, height: 630, alt: `Capability agenda for ${name}` }],
    },
    twitter: { card: 'summary_large_image', images: [ogAgendaHref(iso3.toUpperCase())] },
  }
}

export default async function AgendaPagePt({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const agenda = await loadAgenda(iso3)
  if (!agenda) notFound()

  return (
    <div lang="pt-BR">
      <AgendaView agenda={agenda} lex={PT_BR} profileHref={countryProfileHref(agenda.iso3)} />
    </div>
  )
}
