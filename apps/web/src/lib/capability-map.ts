import { buildCapabilityMap, mapIndicatorIds } from '@ncb/core'
import type { CapabilityMap, CountryResult, Dimension } from '@ncb/core'
import { loadCountry, loadDiagnostics, loadIndex, loadIndicatorAcrossCountries } from '@/lib/data'

/**
 * One country's map of one capability, computed on the server from the
 * published files: the slim index for every country's score and conditions,
 * the subject's own file for its rows, the dimension's indicator files for
 * the peers' rows, and the diagnostics for income and the correlations.
 * Nothing is read that a reader could not download. See D130.
 */
export async function loadCapabilityMap(
  iso3: string,
  dimension: Dimension,
): Promise<{ map: CapabilityMap; subject: CountryResult; version: string | null } | null> {
  const [index, subject, diagnostics] = await Promise.all([
    loadIndex(),
    loadCountry(iso3),
    loadDiagnostics(),
  ])
  if (!index || !subject || !diagnostics) return null

  const files = await Promise.all(mapIndicatorIds(dimension).map(loadIndicatorAcrossCountries))
  const map = buildCapabilityMap({
    iso3,
    dimension,
    countries: index.countries,
    subject,
    indicatorFiles: files.filter((f): f is NonNullable<typeof f> => f !== null),
    diagnostics,
  })
  return { map, subject, version: index.version ?? null }
}
