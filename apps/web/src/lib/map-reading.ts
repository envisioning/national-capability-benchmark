import { MAP_DIMENSIONS } from '@ncb/core'
import type { Dimension, Lang } from '@ncb/core'
import {
  countryLayer,
  layerBySlug,
  layerSection,
  mapDimensionBySlug,
  type CountryLayer,
} from '@/lib/layers'
import {
  agendaHref,
  capabilityMapHref,
  capabilityMapIndexHref,
  countryMapDimensionHref,
  countryMapHref,
  layerSectionHref,
} from '@/lib/links'

/**
 * One reading of one country's capability map: the language it is read in
 * and the addresses its pages link between.
 *
 * The map is one pair of components, `CapabilityMapIndex` and
 * `CapabilityMapDimension`, rendered in two places: the ground layer at
 * `/country/<ISO3>/map`, in English for every country, and a country layer's
 * `mapa` section, in that layer's language. Both read the same
 * `buildCapabilityMap` output; a reading only says which lexicon prints it and
 * where its links go, so the two cannot diverge in structure. See D134 and
 * D136.
 */
export type MapReading = {
  iso3: string
  lang: Lang
  /** The map index of this reading. */
  indexHref: string
  /** One capability's map in this reading. */
  dimensionHref: (dimension: Dimension) => string
  /** The capability a path segment names in this reading, or null. */
  dimensionBySlug: (slug: string) => Dimension | null
  /** The same country's agenda in this reading, or null where it has none. */
  agendaHref: string | null
  /** The decisions the index cites. */
  indexDecisions: readonly string[]
  /** The decisions each capability's page cites. */
  dimensionDecisions: readonly string[]
}

/** The ground layer's map of one country, in English. See D136. */
export function groundMapReading(iso3: string): MapReading {
  const code = iso3.toUpperCase()
  return {
    iso3: code,
    lang: 'en',
    indexHref: countryMapHref(code),
    dimensionHref: (dimension) => countryMapDimensionHref(code, dimension),
    dimensionBySlug: (slug) => MAP_DIMENSIONS.find((d) => d === slug.toLowerCase()) ?? null,
    agendaHref: agendaHref(code),
    indexDecisions: ['D136'],
    dimensionDecisions: ['D130', 'D136'],
  }
}

/** A layer's map, in the layer's language. See D133 and D134. */
export function layerMapReading(layer: CountryLayer): MapReading {
  const agenda = layerSection(layer, 'agenda')
  return {
    iso3: layer.iso3,
    lang: layer.lang,
    indexHref: capabilityMapIndexHref(layer.iso3) ?? countryMapHref(layer.iso3),
    dimensionHref: (dimension) =>
      capabilityMapHref(layer.iso3, dimension) ?? countryMapDimensionHref(layer.iso3, dimension),
    dimensionBySlug: (slug) => mapDimensionBySlug(layer, slug),
    agendaHref: agenda ? layerSectionHref(layer, agenda) : null,
    indexDecisions: ['D133'],
    dimensionDecisions: ['D130', 'D133'],
  }
}

/**
 * The same map page in both readings of a country that has a layer, so the
 * crumb that offers both readings lands on the page the reader is on rather
 * than on the other reading's front page. Null for any path that is not a
 * map page, or a country with no layer map. See D136.
 */
export function mapCounterparts(pathname: string): { iso3: string; ground: string; layer: string } | null {
  const segments = pathname.toLowerCase().split('/').filter(Boolean)
  let layer: CountryLayer | null = null
  let dimension: Dimension | null = null

  if (segments[0] === 'country' && segments[2] === 'map' && segments.length <= 4) {
    layer = countryLayer(segments[1] ?? '')
    if (segments[3] !== undefined) {
      dimension = groundMapReading(segments[1] ?? '').dimensionBySlug(segments[3])
      if (!dimension) return null
    }
  } else if (segments.length >= 2 && segments.length <= 3) {
    layer = layerBySlug(segments[0] ?? '')
    const section = layer ? layerSection(layer, 'map') : null
    if (!layer || !section?.slug || segments[1] !== section.slug) return null
    if (segments[2] !== undefined) {
      dimension = mapDimensionBySlug(layer, segments[2])
      if (!dimension) return null
    }
  } else {
    return null
  }

  if (!layer || !capabilityMapIndexHref(layer.iso3)) return null
  const ground = groundMapReading(layer.iso3)
  const local = layerMapReading(layer)
  return {
    iso3: layer.iso3,
    ground: dimension ? ground.dimensionHref(dimension) : ground.indexHref,
    layer: dimension ? local.dimensionHref(dimension) : local.indexHref,
  }
}
