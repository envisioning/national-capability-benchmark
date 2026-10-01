import { notFound } from 'next/navigation'
import { layerBySlug } from '@/lib/layers'

export const dynamic = 'force-dynamic'

/**
 * Every country layer that has no folder of its own: Mexico, Colombia, Chile
 * and Argentina today. The segment is the layer's slug in `COUNTRY_LAYERS`,
 * so a layer is added in the registry and never by copying a folder. Brazil
 * keeps `/brasil`, a static folder that wins over this segment, because its
 * overview, institutions and support pages are its own. Any other first
 * segment is not a layer and answers 404. Like Brazil's, the layout holds no
 * nav: it declares the language every page under it is written in. See D69,
 * D73 and D134.
 */
type Params = { params: Promise<{ layer: string }> }

export default async function CountryLayerLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  const layer = layerBySlug((await params).layer)
  if (!layer) notFound()

  return <div lang={layer.lang}>{children}</div>
}
