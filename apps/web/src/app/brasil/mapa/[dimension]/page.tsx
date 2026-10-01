import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  CapabilityMapDimension,
  capabilityMapDimensionMetadata,
} from '@/components/layer/CapabilityMapDimension'
import { countryLayer } from '@/lib/layers'

export const dynamic = 'force-dynamic'

/**
 * Brazil's map of one capability, in Portuguese. The page is the layer
 * component every layer renders, read through Brazil's lexicon. See D130,
 * D133 and D134.
 */
type Params = { params: Promise<{ dimension: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const layer = countryLayer('BRA')
  return layer ? capabilityMapDimensionMetadata(layer, (await params).dimension) : {}
}

export default async function BrazilCapabilityMapPage({ params }: Params) {
  const layer = countryLayer('BRA')
  if (!layer) notFound()
  return <CapabilityMapDimension layer={layer} slug={(await params).dimension} />
}
