import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRY_NAMES } from '@ncb/core'
import {
  CapabilityMapDimension,
  capabilityMapDimensionMetadata,
} from '@/components/layer/CapabilityMapDimension'
import { groundMapReading } from '@/lib/map-reading'

export const dynamic = 'force-dynamic'

/**
 * One country's map of one capability in the ground layer, in English. The
 * segment is the dimension id, as `/capabilities/<id>` writes it. See D130
 * and D136.
 */
type Params = { params: Promise<{ iso3: string; dimension: string }> }

const known = (iso3: string): boolean => iso3.toUpperCase() in COUNTRY_NAMES

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { iso3, dimension } = await params
  return known(iso3) ? capabilityMapDimensionMetadata(groundMapReading(iso3), dimension) : {}
}

export default async function CountryCapabilityMapPage({ params }: Params) {
  const { iso3, dimension } = await params
  if (!known(iso3)) notFound()
  return <CapabilityMapDimension reading={groundMapReading(iso3)} slug={dimension} />
}
