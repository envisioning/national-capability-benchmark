import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  CapabilityMapDimension,
  capabilityMapDimensionMetadata,
} from '@/components/layer/CapabilityMapDimension'
import { layerBySlug, layerSection } from '@/lib/layers'
import { layerMapReading } from '@/lib/map-reading'

export const dynamic = 'force-dynamic'

/**
 * One layer's map of one capability, for every layer served by the `[layer]`
 * route. The segment is the layer lexicon's name for the dimension through
 * `mapSlug`. See D130, D133 and D134.
 */
type Params = { params: Promise<{ layer: string; dimension: string }> }

function mapLayer(slug: string) {
  const layer = layerBySlug(slug)
  return layer && layerSection(layer, 'map')?.slug === 'mapa' ? layer : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { layer: slug, dimension } = await params
  const layer = mapLayer(slug)
  return layer ? capabilityMapDimensionMetadata(layerMapReading(layer), dimension) : {}
}

export default async function LayerCapabilityMapPage({ params }: Params) {
  const { layer: slug, dimension } = await params
  const layer = mapLayer(slug)
  if (!layer) notFound()
  return <CapabilityMapDimension reading={layerMapReading(layer)} slug={dimension} />
}
