import { ARTEFACT_SCOPES, COUNTRY_NAMES, DIMENSIONS, INDICATORS_BY_ID } from '../model/index.js'
import type { CountryResult, Dimension, GapExplanation } from '../model/index.js'
import { MAP_PEER_COUNT, incomePeers } from './capability-map.js'
import type { CapabilityMap, IncomeRow } from './capability-map.js'
import { isThinEvidence } from './confidence.js'
import { median, round } from './stats.js'

/**
 * Where capability does not follow income, and why.
 *
 * A gap is one country's score on one capability minus the median score of
 * its `MAP_PEER_COUNT` income peers, the comparison the capability map has
 * published since D130. It is never a regression residual: per-country
 * residuals stay offline under D65.
 *
 * The why is the decomposition the score itself allows. A score is the mean
 * of its observed rows, so the gap splits into each row's distance from the
 * peers' median on that row, divided by the rows counted. The rows that carry
 * most of the gap are its drivers. See D195.
 */

/** Fewer scored peers than this and a median says too little to publish a gap. */
export const MIN_GAP_PEERS = 5

export type GapCell = {
  iso3: string
  country: string
  dimension: Dimension
  score: number
  confidence: number
  peerMedian: number
  peersScored: number
  /** Score minus the peer median, in points. */
  gap: number
  /** The income peers, nearest first. */
  peers: string[]
}

/** Every gap with usable evidence and enough scored peers, for every country. */
export function incomeGaps(countries: readonly CountryResult[], income: readonly IncomeRow[]): GapCell[] {
  const byIso = new Map(countries.map((c) => [c.iso3, c]))
  const cells: GapCell[] = []
  for (const country of countries) {
    const peers = incomePeers(income, country.iso3, MAP_PEER_COUNT).peers.map((p) => p.iso3)
    if (peers.length === 0) continue
    for (const dimension of DIMENSIONS) {
      const result = country.dimensions[dimension]
      if (!result || result.score === null || isThinEvidence(result.confidence)) continue
      const scores = peers
        .map((iso3) => byIso.get(iso3)?.dimensions[dimension]?.score)
        .filter((s): s is number => s != null)
      if (scores.length < MIN_GAP_PEERS) continue
      const peerMedian = round(median(scores), 1)
      cells.push({
        iso3: country.iso3,
        country: COUNTRY_NAMES[country.iso3] ?? country.country,
        dimension,
        score: result.score,
        confidence: result.confidence,
        peerMedian,
        peersScored: scores.length,
        gap: round(result.score - peerMedian, 1),
        peers,
      })
    }
  }
  return cells
}

/** The artefacts that name a country on a capability, from `ARTEFACT_SCOPES`. */
export const countryArtefactsFor = (iso3: string, dimension: Dimension): string[] =>
  ARTEFACT_SCOPES.filter(
    (a) => a.countries?.includes(iso3) && (a.dimensions === 'all' || a.dimensions.includes(dimension)),
  ).map((a) => a.id)

const dimensionArtefactsFor = (dimension: Dimension): string[] =>
  ARTEFACT_SCOPES.filter((a) => !a.countries && a.dimensions !== 'all' && a.dimensions.includes(dimension)).map(
    (a) => a.id,
  )

/**
 * The widest gaps in one direction: one per country, at most `perDimension`
 * per capability, and none where a known artefact names the country on that
 * capability, because that gap is the artefact's.
 */
export function widestGaps(
  cells: readonly GapCell[],
  direction: 'above' | 'below',
  count: number,
  perDimension = 2,
): GapCell[] {
  const sorted = cells
    .filter((c) => (direction === 'above' ? c.gap > 0 : c.gap < 0))
    .filter((c) => countryArtefactsFor(c.iso3, c.dimension).length === 0)
    .sort((a, b) => (direction === 'above' ? b.gap - a.gap : a.gap - b.gap) || a.iso3.localeCompare(b.iso3))
  const countries = new Set<string>()
  const perDim = new Map<Dimension, number>()
  const out: GapCell[] = []
  for (const cell of sorted) {
    if (out.length >= count) break
    if (countries.has(cell.iso3) || (perDim.get(cell.dimension) ?? 0) >= perDimension) continue
    countries.add(cell.iso3)
    perDim.set(cell.dimension, (perDim.get(cell.dimension) ?? 0) + 1)
    out.push(cell)
  }
  return out
}

/**
 * The value printed against a row's unit. A distance row's unit names the
 * distance ("percentage points from approved budget") while the map's `raw`
 * is the publisher's value (spending as a share of the budget), so the post
 * prints the distance the unit describes.
 */
function valueAsUnit(id: string, raw: number | null): number | null {
  if (raw === null) return null
  return INDICATORS_BY_ID[id]?.transform === 'distance_from_100' ? round(Math.abs(raw - 100), 1) : raw
}

/** A gap with its drivers, read from the country's capability map. */
export function explainGap(cell: GapCell, map: CapabilityMap): GapExplanation {
  const counted = map.rows.filter((r) => r.normalized !== null && r.staleYear === null)
  const drivers = counted
    .filter((r) => r.peerMedian !== null)
    .map((r) => ({
      indicatorId: r.id,
      unit: r.unit,
      value: valueAsUnit(r.id, r.raw),
      year: r.year,
      position: round(r.normalized as number, 1),
      peerPosition: r.peerMedian as number,
      contribution: round(((r.normalized as number) - (r.peerMedian as number)) / counted.length, 1),
    }))
    .sort((a, b) => (cell.gap >= 0 ? b.contribution - a.contribution : a.contribution - b.contribution))
  return {
    ...cell,
    drivers,
    rowsCounted: counted.length,
    countryArtefacts: countryArtefactsFor(cell.iso3, cell.dimension),
    dimensionArtefacts: dimensionArtefactsFor(cell.dimension),
  }
}
