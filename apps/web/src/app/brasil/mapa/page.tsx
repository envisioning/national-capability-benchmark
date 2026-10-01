import { notFound } from 'next/navigation'
import { CapabilityMapIndex, capabilityMapIndexMetadata } from '@/components/layer/CapabilityMapIndex'
import { countryLayer } from '@/lib/layers'

export const dynamic = 'force-dynamic'

/**
 * Brazil's capability map, the index. The page is the layer component every
 * layer renders, read through Brazil's lexicon. See D133 and D134.
 */
const layer = countryLayer('BRA')

export const metadata = layer ? capabilityMapIndexMetadata(layer) : {}

export default function BrazilCapabilityMapIndexPage() {
  if (!layer) notFound()
  return <CapabilityMapIndex layer={layer} />
}
