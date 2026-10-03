import {
  COUNTRY_NAMES,
  DIMENSIONS,
  artefactsFor,
  conditionsFor,
  indicatorsFor,
  isDeclaredGap,
  isScored,
  rowFactsFor,
} from '../model/index.js'
import type {
  CountryResult,
  Dimension,
  Direction,
  IndicatorAcrossCountries,
  MeasurementClass,
  RowFactKind,
} from '../model/index.js'
import { LTU_GATE } from './adapters/ilostat.js'
import { confidenceBand } from './confidence.js'
import type { ConfidenceBandId } from './confidence.js'
import type { Diagnostics } from './diagnostics.js'
import { median, round } from './stats.js'

/**
 * The capability map: one country's reading of one capability, laid out as
 * what it does beside what it has, and placed among the countries at similar
 * income.
 *
 * Since D122 a dimension holds two kinds of row. Capability rows record what a
 * country does and make the score. Conditions record what it has, and sit
 * beside the score with a rank. Put side by side, with each condition's
 * correlation with income and with the score, that split is a map: where the
 * country stands, what the standing rests on, and what it has to work with.
 *
 * Descriptive by contract. Every field is a fact about the published data: a
 * value, a median, a correlation, above or below. Nothing here says what a
 * country should do, and no field ranks the country among its peers. A
 * position against the peer median is the whole comparison. See D130.
 *
 * Pure, and parameterised by dimension. Every dimension is published since
 * D133, through this one function: a dimension with no conditions has an
 * empty `conditions` list and nothing else differs.
 */

/** How many countries at the nearest income make the peer set. See D130. */
export const MAP_PEER_COUNT = 10

/**
 * The dimensions a map is published for: all nine since D133. Removing one is
 * a decision entry.
 */
export const MAP_DIMENSIONS: readonly Dimension[] = DIMENSIONS

/** Where a value sits against the peer median, at the published precision. */
export type MapPosition = 'above' | 'below' | 'level'

/** One country's income, as `diagnostics.income` publishes it. */
export type IncomeRow = { iso3: string; gdpPerCapita: number; year: number }

/** One country in the peer set. */
export type MapPeer = {
  iso3: string
  country: string
  gdpPerCapita: number
  year: number
  /** Distance from the subject in log10 GDP per capita. The rule's own measure. */
  distance: number
  /** The peer's score on this dimension, or null where none is published. */
  score: number | null
  confidence: number | null
}

/** One capability row: the subject's value beside the peer median. */
export type MapRow = {
  id: string
  measurementClass: MeasurementClass
  unit: string
  direction: Direction
  /** The value as the publisher wrote it. */
  raw: number | null
  /** Position on the dimension's 0 to 100 frame, higher always better. */
  normalized: number | null
  year: number | null
  /** Year of a latest value set aside as too old to score, else null. See D159. */
  staleYear: number | null
  source: string
  /** Median normalized value among the peers that have the row. */
  peerMedian: number | null
  peersWithValue: number
  /** Null where the subject or every peer lacks the row. */
  position: MapPosition | null
}

/** One condition: the subject's value, rank, the map numbers and the peers. */
export type MapCondition = {
  id: string
  unit: string
  direction: Direction
  value: number | null
  year: number | null
  source: string
  rank: number | null
  n: number
  /** Median published value among the peers that have it. */
  peerMedian: number | null
  peersWithValue: number
  /** More or less of the stock than the peer median, in published units. */
  position: MapPosition | null
  /** Pearson r against log GDP per capita across the set, from diagnostics. */
  incomeR: number | null
  incomeN: number
  /** Pearson r against this dimension's published score, from diagnostics. */
  scoreR: number | null
  scoreN: number
}

export type CapabilityMap = {
  iso3: string
  dimension: Dimension
  score: number | null
  belowCoverageFloor: boolean
  observedIndicators: number
  /** Two numbers, never folded: the score above and this beside it. */
  confidence: number
  band: ConfidenceBandId
  /** The dimension's own correlation with log GDP per capita, from diagnostics. */
  dimensionIncomeR: number | null
  dimensionIncomeN: number
  income: IncomeRow | null
  /** Whether the release publishes income for any country. False only on a file from before 7.2.0. */
  incomePublished: boolean
  peerRule: { count: number; series: string }
  peers: MapPeer[]
  peerIncome: { min: number; max: number } | null
  /** Median score among the peers that publish one. */
  peerScoreMedian: number | null
  peersScored: number
  scorePosition: MapPosition | null
  rows: MapRow[]
  /** Declared gaps in this dimension, by id. They lower confidence. */
  gaps: string[]
  conditions: MapCondition[]
  /**
   * The known artefacts that bear on this capability for this country, by id:
   * the dimension's own and the structural ones. From `ARTEFACT_SCOPES`.
   */
  artefacts: { specific: string[]; structural: string[] }
  /**
   * The hand-written facts about this country's rows that the published
   * output does not carry, from `COUNTRY_ROW_FACTS`, with the values their
   * templates fill: the survey's name and the plausibility gate's floor. Only
   * rows of this dimension. See D136.
   */
  facts: MapRowFact[]
}

/** One hand-written fact about one of the subject's rows. */
export type MapRowFact = {
  indicatorId: string
  kind: RowFactKind
  values: Record<string, string | number>
  decisions: string[]
}

/** The country's indicator rows and every peer's, inside out. */
export type MapIndicatorFiles = Pick<IndicatorAcrossCountries, 'indicatorId' | 'values'>[]

/**
 * The `count` countries nearest the subject in log GDP per capita.
 *
 * A distance on the log scale treats a country at half the subject's income
 * and one at double it as equally far, which is how income differences behave.
 * Ties break on the iso3 code, so the set never depends on file order. The
 * subject is never its own peer, and a country with no income is never one.
 */
export function incomePeers(
  income: readonly IncomeRow[],
  iso3: string,
  count: number = MAP_PEER_COUNT,
): { subject: IncomeRow | null; peers: Array<IncomeRow & { distance: number }> } {
  const subject = income.find((row) => row.iso3 === iso3) ?? null
  if (!subject || subject.gdpPerCapita <= 0) return { subject, peers: [] }
  const anchor = Math.log10(subject.gdpPerCapita)
  const peers = income
    .filter((row) => row.iso3 !== iso3 && row.gdpPerCapita > 0)
    .map((row) => ({ ...row, distance: Math.abs(Math.log10(row.gdpPerCapita) - anchor) }))
    .sort((a, b) => a.distance - b.distance || a.iso3.localeCompare(b.iso3))
    .slice(0, Math.max(0, count))
    .map((row) => ({ ...row, distance: round(row.distance, 3) }))
  return { subject, peers }
}

/** Above, below or level, compared at the precision the value is printed at. */
export function positionAgainst(
  value: number | null,
  reference: number | null,
  digits = 1,
): MapPosition | null {
  if (value === null || reference === null) return null
  const a = round(value, digits)
  const b = round(reference, digits)
  return a > b ? 'above' : a < b ? 'below' : 'level'
}

const medianOrNull = (xs: number[]): number | null => (xs.length === 0 ? null : median(xs))

export function buildCapabilityMap(input: {
  iso3: string
  dimension: Dimension
  /** The slim index: every country's dimension scores and conditions. */
  countries: readonly CountryResult[]
  /** The subject in full, with its indicator rows. */
  subject: CountryResult
  /** The dimension's capability rows across every country. */
  indicatorFiles: MapIndicatorFiles
  diagnostics: Pick<Diagnostics, 'gdpSeries' | 'income' | 'conditions' | 'dimensionVsGdp'>
  peerCount?: number
}): CapabilityMap {
  const { iso3, dimension, countries, subject, indicatorFiles, diagnostics } = input
  const result = subject.dimensions[dimension]
  if (!result) throw new Error(`${iso3} has no result for ${dimension}`)
  const count = input.peerCount ?? MAP_PEER_COUNT

  const { subject: income, peers: incomeSet } = incomePeers(diagnostics.income ?? [], iso3, count)
  const byIso = new Map(countries.map((c) => [c.iso3, c]))

  const peers: MapPeer[] = incomeSet.map((row) => {
    const dim = byIso.get(row.iso3)?.dimensions[dimension]
    return {
      iso3: row.iso3,
      country: COUNTRY_NAMES[row.iso3] ?? row.iso3,
      gdpPerCapita: row.gdpPerCapita,
      year: row.year,
      distance: row.distance,
      score: dim?.score ?? null,
      confidence: dim?.confidence ?? null,
    }
  })
  const peerIsos = new Set(peers.map((p) => p.iso3))
  const peerScores = peers.flatMap((p) => (p.score === null ? [] : [p.score]))
  const peerScoreMedian = medianOrNull(peerScores)

  const files = new Map(indicatorFiles.map((f) => [f.indicatorId, f]))
  const rows: MapRow[] = indicatorsFor(dimension)
    .filter(isScored)
    .map((def) => {
      const own = result.indicators.find((i) => i.indicatorId === def.id)
      const peerValues = (files.get(def.id)?.values ?? []).flatMap((v) =>
        peerIsos.has(v.iso3) && v.normalized !== null ? [v.normalized] : [],
      )
      const peerMedian = medianOrNull(peerValues)
      const normalized = own?.normalized ?? null
      return {
        id: def.id,
        measurementClass: def.measurementClass,
        unit: def.unit,
        direction: def.direction,
        raw: own?.raw ?? null,
        normalized,
        year: own?.year ?? null,
        staleYear: own?.staleExcluded?.year ?? null,
        source: own?.source ?? def.source.publisher,
        peerMedian: peerMedian === null ? null : round(peerMedian, 1),
        peersWithValue: peerValues.length,
        position: positionAgainst(normalized, peerMedian),
      }
    })

  const conditions: MapCondition[] = conditionsFor(dimension).map((def) => {
    const own = result.conditions.find((c) => c.indicatorId === def.id)
    const peerValues = peers.flatMap((p) => {
      const v = byIso
        .get(p.iso3)
        ?.dimensions[dimension]?.conditions.find((c) => c.indicatorId === def.id)?.value
      return v === null || v === undefined ? [] : [v]
    })
    const peerMedian = medianOrNull(peerValues)
    const diag = diagnostics.conditions.find((c) => c.indicatorId === def.id)
    const value = own?.value ?? null
    return {
      id: def.id,
      unit: def.unit,
      direction: def.direction,
      value,
      year: own?.year ?? null,
      source: own?.source ?? def.source.publisher,
      rank: own?.rank ?? null,
      n: own?.n ?? 0,
      peerMedian: peerMedian === null ? null : round(peerMedian, 3),
      peersWithValue: peerValues.length,
      /* Published units, three decimals: the precision the file carries. */
      position: positionAgainst(value, peerMedian, 3),
      incomeR: diag?.r ?? null,
      incomeN: diag?.n ?? 0,
      scoreR: diag?.dimensionR ?? null,
      scoreN: diag?.dimensionN ?? 0,
    }
  })

  const fit = diagnostics.dimensionVsGdp.find((d) => d.dimension === dimension)

  return {
    iso3,
    dimension,
    score: result.score,
    belowCoverageFloor: result.belowCoverageFloor,
    observedIndicators: result.observedIndicators,
    confidence: result.confidence,
    band: confidenceBand(result.confidence).id,
    dimensionIncomeR: fit?.pearson ?? null,
    dimensionIncomeN: fit?.n ?? 0,
    income,
    incomePublished: (diagnostics.income ?? []).length > 0,
    peerRule: { count, series: diagnostics.gdpSeries },
    peers,
    peerIncome:
      peers.length === 0
        ? null
        : {
            min: Math.min(...peers.map((p) => p.gdpPerCapita)),
            max: Math.max(...peers.map((p) => p.gdpPerCapita)),
          },
    peerScoreMedian: peerScoreMedian === null ? null : round(peerScoreMedian, 1),
    peersScored: peerScores.length,
    scorePosition: positionAgainst(result.score, peerScoreMedian),
    rows,
    gaps: indicatorsFor(dimension)
      .filter(isDeclaredGap)
      .map((d) => d.id),
    conditions,
    artefacts: artefactsFor(dimension, iso3),
    facts: rowFactsFor(iso3)
      .filter((fact) => rows.some((row) => row.id === fact.indicatorId))
      .map((fact) => ({
        indicatorId: fact.indicatorId,
        kind: fact.kind,
        values: { floor: LTU_GATE.floorPct, ...(fact.survey ? { survey: fact.survey } : {}) },
        decisions: [...fact.decisions],
      })),
  }
}

/**
 * The reading the page prints, split by direction. Ids only: the words are the
 * lexicon's. A row with no position is in none of the lists, because a missing
 * value is not a fact about where the country sits.
 */
export function readCapabilityMap(map: CapabilityMap): {
  rowsAbove: string[]
  rowsBelow: string[]
  rowsLevel: string[]
  conditionsMore: string[]
  conditionsLess: string[]
  conditionsLevel: string[]
  /**
   * The conditions above that read the other way: a lower value is better.
   * A condition is compared in published units, so "more than the peer
   * median" of transmission losses is more losses. The page says which ones
   * after the comparison, so the sentence is never read backwards.
   */
  conditionsLowerBetter: string[]
} {
  const ids = <T extends { id: string; position: MapPosition | null }>(
    xs: T[],
    p: MapPosition,
  ): string[] => xs.filter((x) => x.position === p).map((x) => x.id)
  return {
    /* A row's position is on the 0 to 100 frame, where higher is always
     * better, so above the median is better whichever way the raw value
     * runs. */
    rowsAbove: ids(map.rows, 'above'),
    rowsBelow: ids(map.rows, 'below'),
    rowsLevel: ids(map.rows, 'level'),
    conditionsMore: ids(map.conditions, 'above'),
    conditionsLess: ids(map.conditions, 'below'),
    conditionsLevel: ids(map.conditions, 'level'),
    conditionsLowerBetter: map.conditions
      .filter((c) => c.position !== null && c.direction === 'lower_better')
      .map((c) => c.id),
  }
}

/** The capability rows a map reads for one dimension: the files a page loads. */
export const mapIndicatorIds = (dimension: Dimension): string[] =>
  indicatorsFor(dimension)
    .filter(isScored)
    .map((d) => d.id)

/**
 * The path segment a layer gives one capability's map: the lexicon's name for
 * the dimension, lowercased, without accents, words joined by a hyphen.
 * Adaptação becomes `adaptacao`, Propósito compartilhado
 * `proposito-compartilhado`. The lexicon is the one place the name is
 * declared, so the address follows it; renaming a dimension there moves its
 * address, which the test beside this file pins. See D133.
 */
export function mapSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
