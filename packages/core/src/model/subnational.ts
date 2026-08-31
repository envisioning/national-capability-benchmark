import type {
  Direction,
  Geometry,
  IndicatorSource,
  Reconciliation,
  SubnationalDenominator,
  Transform,
} from './schema.js'
import { BR_SUBNATIONAL_SOURCE } from './sources.js'

/** Publisher-specific coordinates for the current SIDRA adapter family. */
export type SidraSeries = {
  table: string
  variable: string
}

/** One subnational series definition. The adapter reads this; it does not own it. */
export type SubnationalSeriesDef = {
  indicatorId: string
  iso3: string
  geometry: Exclude<Geometry, 'national'>
  source: IndicatorSource & { url: string }
  reconciliation: Reconciliation
  denominator: SubnationalDenominator
  unit: string
  direction: Direction
  years: readonly number[]
  transform: Transform
  tolerance: number
  sidra: SidraSeries
  /** National row and scale used when the same concept has a different unit. */
  national: { indicatorId: string; divisor: number }
}

/**
 * The subnational registry starts with one deliberately modest pilot. New
 * series join here only after a source memo has established construct, unit,
 * coverage and treatment. The file is not a second indicator registry: it
 * describes values that sit beside the national indicator.
 */
export const SUBNATIONAL_SERIES: readonly SubnationalSeriesDef[] = [
  {
    indicatorId: 'income_inequality',
    iso3: 'BRA',
    geometry: 'state',
    source: {
      publisher: BR_SUBNATIONAL_SOURCE.publisher,
      series: `SIDRA table ${BR_SUBNATIONAL_SOURCE.table}, variable ${BR_SUBNATIONAL_SOURCE.variable}`,
      adapter: 'ibge-sidra',
      url: BR_SUBNATIONAL_SOURCE.url,
      tier: 'official_statistical',
      inspectable: true,
    },
    reconciliation: 'independent',
    /** The mean is retained as a diagnostic; it is not asserted as a Gini decomposition. */
    denominator: 'equal',
    unit: 'Gini coefficient (0–1)',
    direction: 'lower_better',
    years: [2024],
    transform: 'none',
    tolerance: 0.005,
    sidra: {
      table: BR_SUBNATIONAL_SOURCE.table,
      variable: BR_SUBNATIONAL_SOURCE.variable,
    },
    national: {
      indicatorId: 'income_inequality',
      divisor: 100,
    },
  },
]

export const SUBNATIONAL_SERIES_BY_ID = Object.fromEntries(
  SUBNATIONAL_SERIES.map((series) => [`${series.iso3}|${series.indicatorId}`, series]),
) as Record<string, SubnationalSeriesDef>
