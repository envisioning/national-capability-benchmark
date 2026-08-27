import { notFound } from 'next/navigation'
import { EN } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'

export const dynamic = 'force-dynamic'

export default async function AgendaPage({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const agenda = await loadAgenda(iso3)
  if (!agenda) notFound()

  return (
    <AgendaView
      agenda={agenda}
      lex={EN}
      profileHref={`/country/${agenda.iso3}`}
      switchHref={`/pt/agenda/${agenda.iso3}`}
    />
  )
}
