import { DIMENSIONS, DIMENSION_LABELS, median, quantile, round, signed } from '@ncb/core'
import type { Dimension, HistoryCountryFile, HistoryDelta, HistoryIndexFile } from '@ncb/core'

/** One cohort in one year: the median reconstruction, the spread of its members, and how much of it is fill. */
export type CohortYear = {
  year: number
  /** Countries with a reconstruction this year. */
  n: number
  median: number
  /** 25th and 75th percentile of the members' reconstructions: spread between countries, not error. */
  q1: number
  q3: number
  /** Median replay over the members that have one, and how many do. */
  replay: number | null
  replayN: number
  /** Share of the members' basket cells the model filled this year, 0 to 1. */
  modelledShare: number
}

export type CohortDelta = HistoryDelta & { n: number; relative: number }

export type CohortView = {
  id: string
  label: string
  members: number
  dimensions: Partial<Record<Dimension, { series: CohortYear[]; deltas: CohortDelta[] }>>
}

export type CountryDeltaRow = {
  iso3: string
  country: string
  /** Per dimension, the deltas by span, and the basket share modelled in the base year of the longest span. */
  dimensions: Partial<
    Record<Dimension, { deltas: HistoryDelta[]; baseModelledShare: number | null }>
  >
}

export type HistoryPageData = {
  fromYear: number
  toYear: number
  spans: number[]
  dimensions: Array<{ dimension: Dimension; label: string }>
  cohorts: CohortView[]
  countries: CountryDeltaRow[]
  validation: HistoryIndexFile['validation']
}

/**
 * The cohort page's view, built on the server from every country file and the
 * index. Medians come from the index; the spread, the replay median and the
 * modelled share are counted here from the country files, because the index
 * does not carry them. See D178.
 */
export function buildHistoryPage(
  index: HistoryIndexFile,
  files: HistoryCountryFile[],
): HistoryPageData {
  const byIso = new Map(files.map((f) => [f.iso3, f]))
  const cohorts: CohortView[] = index.cohorts.map((cohort) => {
    const members = cohort.members.map((iso3) => byIso.get(iso3)).filter((f) => f !== undefined)
    const dimensions: CohortView['dimensions'] = {}
    for (const d of DIMENSIONS) {
      const summary = cohort.dimensions[d]
      if (!summary) continue
      const series: CohortYear[] = summary.series.map((point) => {
        const estimates: number[] = []
        const replays: number[] = []
        let modelled = 0
        let cells = 0
        for (const file of members) {
          const dim = file.dimensions[d]
          const p = dim?.series.find((s) => s.year === point.year)
          if (!dim || !p) continue
          estimates.push(p.estimate)
          if (p.replay !== null) replays.push(p.replay)
          modelled += p.modelled
          cells += dim.basket.length
        }
        const sorted = [...estimates].sort((a, b) => a - b)
        return {
          year: point.year,
          n: point.n,
          median: point.median,
          q1: sorted.length ? round(quantile(sorted, 0.25)) : point.median,
          q3: sorted.length ? round(quantile(sorted, 0.75)) : point.median,
          replay: replays.length ? round(median(replays)) : null,
          replayN: replays.length,
          modelledShare: cells ? modelled / cells : 0,
        }
      })
      dimensions[d] = { series, deltas: summary.deltas }
    }
    return { id: cohort.id, label: cohort.label, members: cohort.members.length, dimensions }
  })

  const longest = Math.max(...index.params.spans)
  const countries: CountryDeltaRow[] = files
    .map((file) => {
      const dimensions: CountryDeltaRow['dimensions'] = {}
      for (const d of DIMENSIONS) {
        const dim = file.dimensions[d]
        if (!dim) continue
        const base = dim.deltas.find((x) => x.span === longest)
        const point = base ? dim.series.find((s) => s.year === base.baseYear) : undefined
        dimensions[d] = {
          deltas: dim.deltas,
          baseModelledShare:
            point && dim.basket.length ? point.modelled / dim.basket.length : null,
        }
      }
      return { iso3: file.iso3, country: file.country, dimensions }
    })
    /* Alphabetical. Any other order would be a ranking. */
    .sort((a, b) => a.country.localeCompare(b.country))

  return {
    fromYear: index.params.fromYear,
    toYear: index.params.toYear,
    spans: index.params.spans,
    dimensions: DIMENSIONS.map((dimension) => ({ dimension, label: DIMENSION_LABELS[dimension] })),
    cohorts,
    countries,
    validation: index.validation,
  }
}

/** A change in score points with its sign, as both history charts print it. */
export const signedPoints = (value: number, locale = 'en'): string => signed(value, locale)

/** Year labels every five years, ending on the last year without crowding it. */
export function historyYearTicks(from: number, to: number): number[] {
  const ticks: number[] = []
  for (let year = Math.ceil(from / 5) * 5; year <= to; year += 5) ticks.push(year)
  const lastTick = ticks[ticks.length - 1]
  if (lastTick !== undefined && to - lastTick < 3) ticks.pop()
  ticks.push(to)
  return ticks
}
