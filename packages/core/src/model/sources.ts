import { INDICATORS, WB_PUBLISHER } from './indicators.js'
import type { IndicatorDef, SourceTier } from './schema.js'

/**
 * Where the data comes from, described once for both the fetcher and the reader.
 *
 * The ingester builds its requests from this file and the sources page prints
 * the same request back, so a reader can run the call the benchmark ran. A
 * second copy of the API shape would let the page describe a fetch that no
 * longer happens. See D49.
 */

export const WB_API_BASE = 'https://api.worldbank.org/v2'

/** World Development Indicators. The v2 API assumes it and takes no source parameter for it. */
export const WB_DEFAULT_DATABASE = 2

/** The first year every series is asked for. History feeds the trend layer. See D22. */
export const INGEST_FROM_YEAR = 1990

export type WbDatabase = {
  id: number
  name: string
  /** What a reader has to know about this database before trusting a value from it. */
  note: string
}

/**
 * The World Bank databases this registry pulls from.
 *
 * The v2 API answers "indicator not found" for a code outside the default
 * database when the source parameter is missing, so every id here is load
 * bearing rather than descriptive.
 */
export const WB_DATABASES: Record<number, WbDatabase> = {
  2: {
    id: 2,
    name: 'World Development Indicators',
    note: 'Default database; no source parameter needed.',
  },
  1: {
    id: 1,
    name: 'Doing Business',
    note: 'Discontinued and frozen at 2019. Recency marks its values down.',
  },
  3: {
    id: 3,
    name: 'Worldwide Governance Indicators',
    note: 'Perception composites; all rows from it are retired. Codes use the GOV_WGI_ prefix.',
  },
  63: {
    id: 63,
    name: 'Human Capital Index',
    note: 'Last full round: 2020.',
  },
  70: {
    id: 70,
    name: 'Economic Fitness 2',
    note: 'Research database.',
  },
}

/** The exact call the ingester makes for one series. */
export function worldBankSeriesUrl(opts: {
  series: string
  /** The database id. Omit for World Development Indicators. */
  sourceId?: number
  countries: readonly string[]
  fromYear: number
  toYear: number
}): string {
  const sourceId = opts.sourceId ?? WB_DEFAULT_DATABASE
  return (
    `${WB_API_BASE}/country/${opts.countries.join(';')}/indicator/${opts.series}` +
    `?format=json&per_page=3000&date=${opts.fromYear}:${opts.toYear}` +
    (sourceId === WB_DEFAULT_DATABASE ? '' : `&source=${sourceId}`)
  )
}

/**
 * The front door of a publisher that supplies values.
 *
 * An indicator row links to the page for its own series, which is the right
 * link on that row and the wrong one for the publisher as a whole. Both the
 * sources page and the data package name the publisher, so both want this.
 */
export const PUBLISHER_HOME: Record<string, string> = {
  [WB_PUBLISHER]: 'https://data.worldbank.org',
  'Global Entrepreneurship Monitor': 'https://www.gemconsortium.org',
}

export type IngestRoute = IndicatorDef['ingest']

/** How a value reaches the dataset, in the reader's words. Defined in the glossary. */
export const INGEST_ROUTE_LABELS: Record<IngestRoute, string> = {
  worldbank: 'fetched from the API',
  manual: 'entered by hand',
  gap: 'declared gap',
  retired: 'retired',
}

export const INGEST_ROUTES: IngestRoute[] = ['worldbank', 'manual', 'gap', 'retired']

/** The publisher named on an indicator whose dataset does not exist yet. */
export const NO_PUBLISHER = 'none'

export type PublisherSummary = {
  publisher: string
  /** Null where the registry names no publisher, which is a gap with no candidate dataset. */
  named: boolean
  /** Every tier this publisher's rows carry. More than one means the rows differ in kind. */
  tiers: SourceTier[]
  /** The publisher's own page, or the first series link the registry offers. Null where neither exists. */
  url: string | null
  routes: Record<IngestRoute, number>
  /** Rows that produce a value today: fetched or entered by hand. */
  live: number
  total: number
  indicators: IndicatorDef[]
  /** World Bank database ids behind the fetched rows, empty for every other publisher. */
  databases: number[]
}

/**
 * The registry grouped by who publishes the number.
 *
 * Sorted by what the publisher currently contributes, then by how much of the
 * collection agenda it carries, so the top of the list is what the scores rest
 * on and the bottom is what somebody would have to go and get.
 */
export function publisherSummaries(): PublisherSummary[] {
  const byPublisher = new Map<string, IndicatorDef[]>()
  for (const def of INDICATORS) {
    const list = byPublisher.get(def.source.publisher) ?? []
    list.push(def)
    byPublisher.set(def.source.publisher, list)
  }

  const summaries = [...byPublisher].map(([publisher, indicators]): PublisherSummary => {
    const routes: Record<IngestRoute, number> = { worldbank: 0, manual: 0, gap: 0, retired: 0 }
    for (const def of indicators) routes[def.ingest] += 1
    const databases = [
      ...new Set(
        indicators
          .filter((def) => def.ingest === 'worldbank')
          .map((def) => def.wbSourceId ?? WB_DEFAULT_DATABASE),
      ),
    ].sort((a, b) => a - b)
    return {
      publisher,
      named: publisher !== NO_PUBLISHER,
      tiers: [...new Set(indicators.map((def) => def.source.tier))],
      url:
        PUBLISHER_HOME[publisher] ??
        indicators.find((def) => def.source.url)?.source.url ??
        null,
      routes,
      live: routes.worldbank + routes.manual,
      total: indicators.length,
      indicators,
      databases,
    }
  })

  return summaries.sort(
    (a, b) =>
      Number(b.named) - Number(a.named) ||
      b.live - a.live ||
      b.total - a.total ||
      a.publisher.localeCompare(b.publisher),
  )
}
