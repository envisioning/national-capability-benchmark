import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CapabilityMapIndex, capabilityMapIndexMetadata } from '@/components/layer/CapabilityMapIndex'
import { layerBySlug, layerSection } from '@/lib/layers'
import { layerMapReading } from '@/lib/map-reading'

export const dynamic = 'force-dynamic'

/**
 * One layer's capability map index, for every layer served by the `[layer]`
 * route. The folder is `mapa` because that is the map section's slug in each
 * of them; a layer whose map section lives elsewhere answers 404 here. See
 * D133 and D134.
 */
type Params = { params: Promise<{ layer: string }> }

function mapLayer(slug: string) {
  const layer = layerBySlug(slug)
  return layer && layerSection(layer, 'map')?.slug === 'mapa' ? layer : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const layer = mapLayer((await params).layer)
  return layer ? capabilityMapIndexMetadata(layerMapReading(layer)) : {}
}

export default async function LayerCapabilityMapIndexPage({ params }: Params) {
  const layer = mapLayer((await params).layer)
  if (!layer) notFound()
  return <CapabilityMapIndex reading={layerMapReading(layer)} />
}
