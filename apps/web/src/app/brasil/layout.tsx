import { notFound } from 'next/navigation'
import { countryLayer } from '@/lib/layers'

export const dynamic = 'force-dynamic'

/**
 * Brazil's country layer.
 *
 * The layer holds no nav of its own. It is a reading of Brazil inside the
 * Countries section, so the header's tree already shows where the reader is:
 * Countries, then the readings of Brazil, then this layer's pages. All this
 * layout does is declare the language every page under it is written in. The
 * folder name is the layer's slug in `COUNTRY_LAYERS`. See D69 and D73.
 */
export default function BrazilLayerLayout({ children }: { children: React.ReactNode }) {
  const layer = countryLayer('BRA')
  if (!layer) notFound()

  return <div lang={layer.lang}>{children}</div>
}
