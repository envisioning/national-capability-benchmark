import {
  CHECKS,
  CHECK_PREFIX,
  COUNTRIES,
  COUNTRY_ISO3,
  DISSENT_IQR,
  DIMENSIONS,
  INDICATORS,
  SOURCE_TIERS,
  checksFor,
  isDelphiRunForDataset,
  isEvidential,
  indicatorsFor,
  isScored,
} from '../model/index.js'
import type {
  CheckResult,
  CountryResult,
  DelphiCellEstimate,
  DelphiRunFile,
  Dimension,
  DimensionResult,
  IndicatorDef,
  IndicatorResult,
  Observation,
  SourceTier,
} from '../model/index.js'
import { applyTransform, buildFrame, scoreAgainstFrame } from './normalize.js'
import { buildHistory, indicatorSeries, momentumFor } from './trend.js'
import type { Frame } from './normalize.js'
import { iqr, mean, median, round } from './stats.js'

/**
 * How many of a dimension's indicators must be observed before it publishes a
 * score.
 *
 * Two, matching the minimum D20 requires before a gap is promoted to a scored
 * indicator. Below it the dimension still publishes its confidence and its
 * indicator rows, because a reader needs to see that the evidence is missing
 * rather than see a number standing in for it. See D45.
 */
export const MIN_INDICATORS_FOR_SCORE = 2

export type Cell = {
  indicatorId: string
  iso3: string
  raw: number
  transformed: number
  normalized: number
  year: number
  sourceTier: SourceTier
  clipped: boolean
  /** The raw value sat outside the frame and the score was clamped. */
  outOfFrame: boolean
}

/** indicatorId -> iso3 -> cell. The auditable middle layer between data and scores. */
export type Matrix = Map<string, Map<string, Cell>>

export type ScoreOptions = {
  /** Year the recency penalty counts back from. */
  currentYear: number
  /** Indicators to drop, used by the GDP-sensitivity test. */
  exclude?: ReadonlySet<string>
  /** Tukey fence multiplier for winsorizing. */
  winsorK?: number
  /** A persisted, provenance-checked Delphi run, kept separate from source scores. */
  delphiRun?: DelphiRunFile | undefined
  /** The output version that the Delphi run must match before it is used. */
  datasetVersion?: string | undefined
  /** Panel estimates below this self-confidence are ignored. */
  minPanelistConfidence?: number
  /** Spans the momentum comparison reaches back, shortest first. Empty to skip trends. */
  momentumSpans?: number[]
}

/** Latest observation per indicator x country. */
function latest(observations: Observation[]): Map<string, Observation> {
  const best = new Map<string, Observation>()
  for (const o of observations) {
    const key = `${o.indicatorId}|${o.iso3}`
    const cur = best.get(key)
    if (!cur || o.year > cur.year) best.set(key, o)
  }
  return best
}

/**
 * Evidence decays. Two grace years, then linear decay over a twelve-year window
 * down to a floor of 0.1, so a Doing Business number from 2019 still counts but
 * counts visibly less than a 2024 number.
 */
export function recencyWeight(year: number, currentYear: number): number {
  const age = currentYear - year
  if (age <= 2) return 1
  const decayed = 1 - (age - 2) / 12
  return Math.max(0.1, Math.min(1, decayed))
}

type TransformedRow = { iso3: string; obs: Observation; transformed: number }

function transformedRows(
  def: IndicatorDef,
  byKey: Map<string, Observation>,
): TransformedRow[] {
  const rows: TransformedRow[] = []
  for (const iso3 of COUNTRY_ISO3) {
    const obs = byKey.get(`${def.id}|${iso3}`)
    if (!obs) continue
    const denom = def.denominatorSeries
      ? byKey.get(`__denominator__${def.denominatorSeries}|${iso3}`)?.value ?? null
      : null
    const transformed = applyTransform(def, obs.value, denom)
    if (transformed === null || !Number.isFinite(transformed)) continue
    rows.push({ iso3, obs, transformed })
  }
  return rows
}

/**
 * The normalization frame per indicator, built from every country's latest
 * value.
 *
 * This is the ruler. Scores and trends are both measured against it, so a
 * change in a country's score over time is a change in the country rather than
 * a change in the scale. The frame holds still within a dataset version and is
 * rebased when the country set changes. See docs/DECISIONS.md D47 and D22.
 */
export function buildFrames(
  observations: Observation[],
  opts: ScoreOptions,
): Map<string, Frame> {
  const byKey = latest(observations)
  const frames = new Map<string, Frame>()
  for (const def of INDICATORS) {
    if (!isScored(def)) continue
    if (opts.exclude?.has(def.id)) continue
    const rows = transformedRows(def, byKey)
    const frame = buildFrame(
      rows.map((r) => r.transformed),
      opts.winsorK ?? 3,
    )
    if (frame) frames.set(def.id, frame)
  }
  return frames
}

export function buildMatrix(
  observations: Observation[],
  opts: ScoreOptions,
  prebuiltFrames?: Map<string, Frame>,
): Matrix {
  const byKey = latest(observations)
  const frames = prebuiltFrames ?? buildFrames(observations, opts)
  const matrix: Matrix = new Map()

  for (const def of INDICATORS) {
    if (!isScored(def)) continue
    if (opts.exclude?.has(def.id)) continue

    const rows = transformedRows(def, byKey)
    const frame = frames.get(def.id)
    if (!frame) continue

    const inner = new Map<string, Cell>()
    for (const r of rows) {
      const scored = scoreAgainstFrame(r.transformed, frame, def.direction)
      inner.set(r.iso3, {
        indicatorId: def.id,
        iso3: r.iso3,
        raw: r.obs.value,
        transformed: scored.transformed,
        normalized: scored.normalized,
        year: r.obs.year,
        sourceTier: r.obs.sourceTier,
        clipped: scored.winsorized,
        outOfFrame: scored.outOfFrame,
      })
    }
    matrix.set(def.id, inner)
  }
  return matrix
}

function indicatorRow(
  def: IndicatorDef,
  cell: Cell | undefined,
  series: IndicatorResult['series'],
): IndicatorResult {
  const status =
    def.ingest === 'gap'
      ? 'gap'
      : def.ingest === 'retired'
        ? 'retired'
        : cell
          ? 'observed'
          : 'missing'
  return {
    indicatorId: def.id,
    name: def.name,
    measurementClass: def.measurementClass,
    raw: cell ? round(cell.raw, 3) : null,
    transformed: cell ? round(cell.transformed, 3) : null,
    normalized: cell ? round(cell.normalized, 1) : null,
    year: cell ? cell.year : null,
    source: def.source.publisher + (def.source.series ? ` (${def.source.series})` : ''),
    sourceTier: cell ? cell.sourceTier : null,
    winsorized: cell ? cell.clipped : false,
    outOfFrame: cell ? cell.outOfFrame : false,
    series,
    status,
  }
}

function confidenceFor(
  defs: IndicatorDef[],
  cells: Array<Cell | undefined>,
  currentYear: number,
): DimensionResult['confidenceParts'] {
  const observed = cells.filter((c): c is Cell => Boolean(c))
  const coverage = defs.length === 0 ? 0 : observed.length / defs.length
  const recency =
    observed.length === 0 ? 0 : mean(observed.map((c) => recencyWeight(c.year, currentYear)))
  const sourceQuality =
    observed.length === 0 ? 0 : mean(observed.map((c) => SOURCE_TIERS[c.sourceTier]))
  return {
    coverage: round(coverage, 3),
    recency: round(recency, 3),
    sourceQuality: round(sourceQuality, 3),
  }
}

function delphiFor(
  estimates: DelphiCellEstimate[] | undefined,
  iso3: string,
  dimension: Dimension,
  minConfidence: number,
): { score: number | null; iqr: number | null; dissent: boolean } {
  if (!estimates || estimates.length === 0) return { score: null, iqr: null, dissent: false }
  const rounds = estimates.filter((e) => e.iso3 === iso3 && e.dimension === dimension)
  if (rounds.length === 0) return { score: null, iqr: null, dissent: false }
  const finalRound = Math.max(...rounds.map((e) => e.round))
  const useable = rounds.filter(
    (e) => e.round === finalRound && e.selfConfidence >= minConfidence,
  )
  if (useable.length === 0) return { score: null, iqr: null, dissent: false }
  const scores = useable.map((e) => e.score)
  const spread = iqr(scores)
  return {
    score: round(median(scores), 1),
    iqr: round(spread, 1),
    dissent: spread > DISSENT_IQR,
  }
}

type CheckValue = { value: number; year: number; sourceTier: SourceTier }

/**
 * The latest observed value of every check, per country.
 *
 * Checks live in the same observation file as the indicators under their own
 * prefix, and they never touch `buildFrame` or `buildMatrix`. The value is
 * published as the publisher wrote it: a check is not normalised, because
 * normalising it would place it on the score's own scale and invite exactly the
 * reading it refuses. See D60.
 */
function checkValues(observations: Observation[]): Map<string, Map<string, CheckValue>> {
  const known = new Set(CHECKS.map((c) => c.id))
  const out = new Map<string, Map<string, CheckValue>>()
  for (const o of observations) {
    if (!o.indicatorId.startsWith(CHECK_PREFIX)) continue
    const id = o.indicatorId.slice(CHECK_PREFIX.length)
    if (!known.has(id)) continue
    const byCountry = out.get(id) ?? new Map<string, CheckValue>()
    const cur = byCountry.get(o.iso3)
    if (!cur || o.year > cur.year) {
      byCountry.set(o.iso3, { value: o.value, year: o.year, sourceTier: o.sourceTier })
    }
    out.set(id, byCountry)
  }
  return out
}

function checkRows(
  values: Map<string, Map<string, CheckValue>>,
  dimension: Dimension,
  iso3: string,
): CheckResult[] {
  return checksFor(dimension).map((c) => {
    const v = values.get(c.id)?.get(iso3)
    return {
      checkId: c.id,
      name: c.name,
      definition: c.definition,
      unit: c.unit,
      direction: c.direction,
      family: c.family,
      value: v ? round(v.value, 3) : null,
      year: v ? v.year : null,
      source: c.source.publisher + (c.source.series ? ` (${c.source.series})` : ''),
      sourceTier: v ? v.sourceTier : null,
      note: c.notes,
    }
  })
}

export type ScoreOutput = {
  countries: CountryResult[]
  matrix: Matrix
}

export function scoreAll(observations: Observation[], opts: ScoreOptions): ScoreOutput {
  const allFrames = buildFrames(observations, opts)
  const matrix = buildMatrix(observations, opts, allFrames)
  const minPanelistConfidence = opts.minPanelistConfidence ?? 0
  const usableDelphiRun =
    opts.delphiRun &&
    isEvidential(opts.delphiRun.provenance) &&
    (!opts.datasetVersion || isDelphiRunForDataset(opts.delphiRun, opts.datasetVersion))
      ? opts.delphiRun
      : undefined
  const spans = opts.momentumSpans ?? [10, 20]
  const frames = spans.length > 0 ? allFrames : null
  const history = spans.length > 0 ? buildHistory(observations) : null
  const checks = checkValues(observations)

  const countries: CountryResult[] = COUNTRIES.map((country) => {
    const dimensions = {} as Record<Dimension, DimensionResult>

    for (const dimension of DIMENSIONS) {
      const defs = indicatorsFor(dimension).filter((d) => !opts.exclude?.has(d.id))
      const cells = defs.map((d) => matrix.get(d.id)?.get(country.iso3))
      const observed = cells.filter((c): c is Cell => Boolean(c))

      /* A dimension needs at least two observed indicators before it publishes a
       * score. One number is not a mean, and Coordination and Trust each sit on
       * a single frozen 2019 series, which printed as a confident-looking 46.7
       * and moved when nothing about the country had. The floor is the same
       * "at least two" D20 uses to promote a gap. Confidence still publishes,
       * because how little is known is the useful signal here. See D45. */
      const belowCoverageFloor = observed.length < MIN_INDICATORS_FOR_SCORE
      const score =
        observed.length === 0 || belowCoverageFloor
          ? null
          : round(mean(observed.map((c) => c.normalized)), 1)
      const parts = confidenceFor(defs, cells, opts.currentYear)
      const delphi = delphiFor(
        usableDelphiRun?.cellEstimates,
        country.iso3,
        dimension,
        minPanelistConfidence,
      )
      const momentum =
        history && frames
          ? spans
              .map((span) =>
                momentumFor(history, frames, country.iso3, dimension, {
                  currentYear: opts.currentYear,
                  span,
                }),
              )
              .filter((m): m is NonNullable<typeof m> => Boolean(m))
          : []

      const blendedScore = observed.length === 0 ? delphi.score : score
      dimensions[dimension] = {
        score,
        observedIndicators: observed.length,
        belowCoverageFloor,
        confidence: round(parts.coverage * parts.recency * parts.sourceQuality, 3),
        confidenceParts: parts,
        delphiScore: delphi.score,
        delphiIqr: delphi.iqr,
        delphiDissent: delphi.dissent,
        blendedScore,
        blendedFrom:
          score !== null ? 'indicators' : observed.length === 0 && delphi.score !== null ? 'delphi' : 'none',
        momentum,
        indicators: defs.map((d, i) =>
          indicatorRow(
            d,
            cells[i],
            history && frames ? indicatorSeries(history, frames.get(d.id), d, country.iso3) : [],
          ),
        ),
        checks: checkRows(checks, dimension, country.iso3),
      }
    }

    return { country: country.name, iso3: country.iso3, dimensions }
  })

  return { countries, matrix }
}

/** The flat table the spec asks for, ready for a radar chart. */
export function flatTable(countries: CountryResult[]): Array<Record<string, string | number | null>> {
  return countries.map((c) => {
    const row: Record<string, string | number | null> = { country: c.country, iso3: c.iso3 }
    for (const d of DIMENSIONS) row[d] = c.dimensions[d]?.score ?? null
    return row
  })
}
