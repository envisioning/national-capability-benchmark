import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRY_NAMES } from '@ncb/core'
import { CapabilityMapIndex, capabilityMapIndexMetadata } from '@/components/layer/CapabilityMapIndex'
import { groundMapReading } from '@/lib/map-reading'

export const dynamic = 'force-dynamic'

/**
 * One country's capability map in the ground layer, the index: the nine
 * capabilities, each against the median of its income peers, in English, for
 * every country. The same component a layer's `mapa` section renders, read
 * through the English lexicon. See D136.
 */
type Params = { params: Promise<{ iso3: string }> }

const known = (iso3: string): boolean => iso3.toUpperCase() in COUNTRY_NAMES

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { iso3 } = await params
  return known(iso3) ? capabilityMapIndexMetadata(groundMapReading(iso3)) : {}
}

export default async function CountryCapabilityMapIndexPage({ params }: Params) {
  const { iso3 } = await params
  if (!known(iso3)) notFound()
  return <CapabilityMapIndex reading={groundMapReading(iso3)} />
}
