import { MAP_DIMENSIONS, buildCapabilityMap, mapIndicatorIds } from '@ncb/core'
import type { CapabilityMap, CountryResult, Dimension } from '@ncb/core'
import { loadCountry, loadDiagnostics, loadIndex, loadIndicatorAcrossCountries } from '@/lib/data'

/**
 * One country's maps of several capabilities, computed on the server from the
 * published files: the slim index for every country's score and conditions,
 * the subject's own file for its rows, each dimension's indicator files for
 * the peers' rows, and the diagnostics for income and the correlations.
 * Nothing is read that a reader could not download, and the shared files are
 * read once however many dimensions are asked for. See D130 and D133.
 */
export async function loadCapabilityMaps(
  iso3: string,
  dimensions: readonly Dimension[],
): Promise<{ maps: CapabilityMap[]; subject: CountryResult; version: string | null } | null> {
  const [index, subject, diagnostics] = await Promise.all([
    loadIndex(),
    loadCountry(iso3),
    loadDiagnostics(),
  ])
  if (!index || !subject || !diagnostics) return null

  const maps = await Promise.all(
    dimensions.map(async (dimension) => {
      const files = await Promise.all(mapIndicatorIds(dimension).map(loadIndicatorAcrossCountries))
      return buildCapabilityMap({
        iso3,
        dimension,
        countries: index.countries,
        subject,
        indicatorFiles: files.filter((f): f is NonNullable<typeof f> => f !== null),
        diagnostics,
      })
    }),
  )
  return { maps, subject, version: index.version ?? null }
}

/** One country's map of one capability. */
export async function loadCapabilityMap(
  iso3: string,
  dimension: Dimension,
): Promise<{ map: CapabilityMap; subject: CountryResult; version: string | null } | null> {
  const loaded = await loadCapabilityMaps(iso3, [dimension])
  const map = loaded?.maps[0]
  return loaded && map ? { map, subject: loaded.subject, version: loaded.version } : null
}

/**
 * The income-peer median of every capability one country has. The indicator
 * files are left out: they feed a map's rows, and the score median reads the
 * index alone. See D189.
 */
export async function loadPeerScoreMedians(
  subject: CountryResult,
  countries: readonly CountryResult[],
): Promise<{ medians: Partial<Record<Dimension, number>>; count: number } | null> {
  const diagnostics = await loadDiagnostics()
  if (!diagnostics) return null
  const medians: Partial<Record<Dimension, number>> = {}
  let count = 0
  for (const dimension of MAP_DIMENSIONS) {
    if (!subject.dimensions[dimension]) continue
    const map = buildCapabilityMap({
      iso3: subject.iso3,
      dimension,
      countries,
      subject,
      indicatorFiles: [],
      diagnostics,
    })
    count = map.peers.length
    if (map.peerScoreMedian !== null) medians[dimension] = map.peerScoreMedian
  }
  return { medians, count }
}
