import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LEXICONS, countryName, fill } from '@ncb/core'
import { AgendaView } from '@/components/views/AgendaView'
import { loadAgenda } from '@/lib/agenda'
import { loadCountry } from '@/lib/data'
import { layerBySlug, layerSection } from '@/lib/layers'
import { countryProfileHref, ogAgendaHref } from '@/lib/links'
import { LAYER_WORDS } from '@/lib/words'

export const dynamic = 'force-dynamic'

/**
 * One country's agenda, read in its layer's language. The same document in
 * English is the ground-layer page at /country/<ISO3>/agenda, and both render
 * the same JSON. See D69 and D134.
 */
type Params = { params: Promise<{ layer: string }> }

function agendaLayer(slug: string) {
  const layer = layerBySlug(slug)
  const pages = layer ? LAYER_WORDS[layer.lang]?.pages : undefined
  return layer && pages && layerSection(layer, 'agenda')?.slug === 'agenda' ? { layer, pages } : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = agendaLayer((await params).layer)
  if (!found) return {}
  const { layer, pages } = found
  const country = countryName(LEXICONS[layer.lang], layer.iso3)
  return {
    title: fill(pages.agendaMetaTitle, { country }),
    description: fill(pages.agendaMetaDescription, { country }),
    openGraph: {
      images: [
        {
          url: ogAgendaHref(layer.iso3),
          width: 1200,
          height: 630,
          alt: `Capability agenda for ${countryName(LEXICONS.en, layer.iso3)}`,
        },
      ],
    },
    twitter: { card: 'summary_large_image', images: [ogAgendaHref(layer.iso3)] },
  }
}

export default async function LayerAgendaPage({ params }: Params) {
  const found = agendaLayer((await params).layer)
  if (!found) notFound()
  const { layer } = found
  const [agenda, country] = await Promise.all([loadAgenda(layer.iso3), loadCountry(layer.iso3)])
  if (!agenda || !country) notFound()

  return (
    <AgendaView
      agenda={agenda}
      country={country}
      lex={LEXICONS[layer.lang]}
      profileHref={countryProfileHref(layer.iso3)}
    />
  )
}
