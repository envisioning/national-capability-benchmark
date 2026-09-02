import { DIMENSIONS, DIMENSION_LABELS } from '../model/dimensions.js'
import { INDICATORS, isScored } from '../model/indicators.js'
import type { Dimension, IndicatorDef, MeasurementClass } from '../model/index.js'
import {
  REDUNDANCY_THRESHOLD,
  WEALTH_CORRELATION_THRESHOLD,
  type Diagnostics,
} from './diagnostics.js'

/**
 * The indicator registry and its diagnostics projected onto lanes.
 *
 * A lane is a capability. A dot is an indicator, marked by whether it has data.
 * A dot also carries a measure, its absolute correlation with log GDP per
 * capita, and a link joins two dots whose series are close enough to be one
 * measurement. This is the shape the lane field draws, and it is computed here
 * rather than in the viewer so the same projection can feed a second drawing
 * later without a second reading of the registry. Nothing here reaches a
 * score, a confidence or `data/out`. See D108.
 */

/** Whether the row has data, asks for a dataset that does not exist, or was rejected. */
export type LaneDotState = 'scored' | 'gap' | 'retired'

export const LANE_DOT_STATES: readonly LaneDotState[] = ['scored', 'gap', 'retired']

export type LaneFieldLane = {
  id: Dimension
  label: string
  /** The capability's own absolute correlation with log GDP per capita. */
  measure: number | null
  /** Countries behind that correlation. */
  measureN: number
  counts: Record<LaneDotState, number>
}

export type LaneFieldDot = {
  id: string
  laneId: Dimension
  label: string
  state: LaneDotState
  measurementClass: MeasurementClass
  publisher: string
  definition: string
  /** Absolute correlation with log GDP per capita. Null when the row has no data. */
  measure: number | null
  /** Past the wealth threshold, so the diagnostics flag it as a wealth proxy. */
  flagged: boolean
  /**
   * What dropping this row does to its capability's wealth correlation.
   * Positive means the row raises it. See D42.
   */
  attribution: number | null
}

export type LaneFieldLink = {
  a: string
  b: string
  /** Absolute correlation between the two series. */
  strength: number
  /** Countries observed on both. */
  n: number
}

export type LaneField = {
  lanes: LaneFieldLane[]
  dots: LaneFieldDot[]
  links: LaneFieldLink[]
  thresholds: {
    /** A dot at or past this tracks income closely enough to be flagged. */
    measure: number
    /** Two dots at or past this are drawn joined. */
    link: number
  }
  /** Whether the measures and links were available. False when no diagnostics were loaded. */
  measured: boolean
}

export function laneDotState(def: IndicatorDef): LaneDotState {
  if (isScored(def)) return 'scored'
  return def.ingest === 'retired' ? 'retired' : 'gap'
}

const abs = (r: number | null | undefined): number | null =>
  r === null || r === undefined ? null : Math.abs(r)

export function buildIndicatorLanes(diag: Diagnostics | null): LaneField {
  const gdpByIndicator = new Map(
    (diag?.indicatorVsGdp ?? []).map((row) => [row.indicatorId, row] as const),
  )
  const attributionByIndicator = new Map(
    (diag?.wealthAttribution ?? []).map((row) => [row.indicatorId, row.delta] as const),
  )
  const gdpByDimension = new Map(
    (diag?.dimensionVsGdp ?? []).map((row) => [row.dimension, row] as const),
  )

  const dots: LaneFieldDot[] = INDICATORS.map((def) => {
    const gdp = gdpByIndicator.get(def.id)
    return {
      id: def.id,
      laneId: def.dimension,
      label: def.name,
      state: laneDotState(def),
      measurementClass: def.measurementClass,
      publisher: def.source.publisher,
      definition: def.definition,
      measure: abs(gdp?.r),
      flagged: gdp?.flaggedAsWealthProxy ?? false,
      attribution: attributionByIndicator.get(def.id) ?? null,
    }
  })

  const lanes: LaneFieldLane[] = DIMENSIONS.map((dimension) => {
    const own = dots.filter((dot) => dot.laneId === dimension)
    const gdp = gdpByDimension.get(dimension)
    return {
      id: dimension,
      label: DIMENSION_LABELS[dimension],
      measure: abs(gdp?.pearson),
      measureN: gdp?.n ?? 0,
      counts: {
        scored: own.filter((dot) => dot.state === 'scored').length,
        gap: own.filter((dot) => dot.state === 'gap').length,
        retired: own.filter((dot) => dot.state === 'retired').length,
      },
    }
  })

  const known = new Set(dots.map((dot) => dot.id))
  const links: LaneFieldLink[] = (diag?.redundantIndicatorPairs ?? [])
    .filter((pair) => pair.r !== null && known.has(pair.a) && known.has(pair.b))
    .map((pair) => ({ a: pair.a, b: pair.b, strength: Math.abs(pair.r as number), n: pair.n }))

  return {
    lanes,
    dots,
    links,
    thresholds: { measure: WEALTH_CORRELATION_THRESHOLD, link: REDUNDANCY_THRESHOLD },
    measured: diag !== null,
  }
}

/** The links that touch one dot, strongest first. */
export function linksOf(field: LaneField, dotId: string): LaneFieldLink[] {
  return field.links
    .filter((link) => link.a === dotId || link.b === dotId)
    .sort((x, y) => y.strength - x.strength)
}
