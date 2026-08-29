import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { COUNTRY_NAMES, EN, PT_BR } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'
import { countryProfileHref, ogAgendaHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

function requestedLanguage(
  search: Record<string, string | string[] | undefined>,
  acceptLanguage: string | null,
): 'en' | 'pt-BR' {
  const explicit = Array.isArray(search.lang) ? search.lang[0] : search.lang
  if (explicit?.toLowerCase() === 'pt-br') return 'pt-BR'
  return acceptLanguage?.toLowerCase().includes('pt-br') ? 'pt-BR' : 'en'
}

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

export default async function CountryAgendaPage({
  params,
  searchParams,
}: {
  params: Promise<{ iso3: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ iso3 }, search, requestHeaders] = await Promise.all([params, searchParams, headers()])
  const agenda = await loadAgenda(iso3)
  if (!agenda) notFound()

  const lang = requestedLanguage(search, requestHeaders.get('accept-language'))
  return lang === 'pt-BR' ? (
    <div lang="pt-BR">
      <AgendaView agenda={agenda} lex={PT_BR} profileHref={countryProfileHref(agenda.iso3)} />
    </div>
  ) : (
    <AgendaView agenda={agenda} lex={EN} profileHref={countryProfileHref(agenda.iso3)} />
  )
}
