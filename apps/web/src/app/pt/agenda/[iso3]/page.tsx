import { notFound } from 'next/navigation'
import { PT_BR } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'

export const dynamic = 'force-dynamic'

export default async function AgendaPagePt({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const agenda = await loadAgenda(iso3)
  if (!agenda) notFound()

  return (
    <div lang="pt-BR">
      <AgendaView
        agenda={agenda}
        lex={PT_BR}
        profileHref={`/country/${agenda.iso3}`}
        switchHref={`/agenda/${agenda.iso3}`}
      />
    </div>
  )
}
