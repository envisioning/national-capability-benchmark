/*
 * The scoring rules on synthetic observations. The registry supplies the
 * indicator and country ids, because scoreAll reads them, but every value is
 * made up here and nothing under data/ is read.
 *
 * Covered: the frame over every country (D47), history clamping (D22), missing
 * values dropped and never imputed, the coverage floor (D45), retired rows out
 * of the coverage denominator (D100), and the Delphi fallback (D63).
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  COUNTRY_ISO3,
  DelphiRunFile,
  countedForCoverage,
  indicatorsFor,
  isScored,
} from '../model/index.js'
import type { Dimension, DimensionResult, IndicatorDef, Observation } from '../model/index.js'
import { MIN_INDICATORS_FOR_SCORE, buildFrames, recencyWeight, scoreAll } from './score.js'
import { buildHistory, normalizedAt } from './trend.js'
import { mean, round } from './stats.js'

const CURRENT_YEAR = 2025
const N = COUNTRY_ISO3.length
const iso = (i: number): string => COUNTRY_ISO3[i] as string

function obs(indicatorId: string, iso3: string, value: number, year = CURRENT_YEAR): Observation {
  return {
    indicatorId,
    iso3,
    geometry: 'national',
    reconciliation: 'context_only',
    value,
    year,
    sourceTier: 'official_statistical',
    retrievedAt: '2025-01-01T00:00:00Z',
  }
}

/*
 * Learning is the fixture dimension: every scored row is a plain, higher-better
 * series with no transform, so a synthetic value is its own transformed value.
 * The guard fails loudly if the registry stops looking like that.
 */
const LEARNING: Dimension = 'learning'
const learningDefs = indicatorsFor(LEARNING)
const learningScored = learningDefs.filter(isScored)
assert.ok(learningScored.length >= 3, 'fixture needs at least three scored learning rows')
for (const d of learningScored) {
  assert.equal(d.transform, 'none', `${d.id} must be untransformed for this fixture`)
  assert.equal(d.direction, 'higher_better', `${d.id} must be higher_better for this fixture`)
}
assert.ok(N >= 10 && isPrime(N), 'the permutation fixture assumes a prime country count')

function isPrime(n: number): boolean {
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false
  return n > 1
}

/*
 * Country i's value on scored row j is a permutation of 0..N-1, different for
 * each row, so a mean over a subset differs from a mean over all rows and from
 * any imputed value. Every row spans 0..N-1, so each normalizes to v / (N-1).
 */
const value = (i: number, j: number): number => (i * (j + 1) * 7) % N
const expectedNormalized = (i: number, j: number): number => (value(i, j) / (N - 1)) * 100

function learningObservations(skip: (i: number, j: number) => boolean = () => false): Observation[] {
  const out: Observation[] = []
  for (let i = 0; i < N; i++) {
    learningScored.forEach((d, j) => {
      if (!skip(i, j)) out.push(obs(d.id, iso(i), value(i, j)))
    })
  }
  return out
}

const baseOpts = { currentYear: CURRENT_YEAR, momentumSpans: [] as number[] }

function learningFor(observations: Observation[], iso3: string, opts = {}) {
  const { countries } = scoreAll(observations, { ...baseOpts, ...opts })
  const c = countries.find((x) => x.iso3 === iso3)
  assert.ok(c)
  const r = c.dimensions[LEARNING]
  assert.ok(r)
  return r
}

test('recency weight: two grace years, linear decay, floor 0.1', () => {
  assert.equal(recencyWeight(2025, 2025), 1)
  assert.equal(recencyWeight(2023, 2025), 1)
  assert.equal(recencyWeight(2017, 2025), 0.5)
  assert.equal(recencyWeight(1990, 2025), 0.1)
})

test('every country sets the frame and every country is scored against it', () => {
  const observations = learningObservations()
  const frames = buildFrames(observations, baseOpts)
  for (const d of learningScored) {
    const f = frames.get(d.id)
    assert.ok(f, `${d.id} has a frame`)
    assert.equal(f.min, 0)
    assert.equal(f.max, N - 1)
  }
  // Gap and retired rows never get a frame.
  for (const d of learningDefs.filter((x) => !isScored(x))) assert.equal(frames.has(d.id), false)

  const { countries, matrix } = scoreAll(observations, baseOpts)
  for (const [, byCountry] of matrix) {
    for (const [, cell] of byCountry) assert.equal(cell.outOfFrame, false, 'a current cell never clamps')
  }
  for (let i = 0; i < N; i++) {
    const r: DimensionResult | undefined = countries.find((c) => c.iso3 === iso(i))?.dimensions[LEARNING]
    assert.ok(r)
    const expected = round(mean(learningScored.map((_, j) => expectedNormalized(i, j))), 1)
    assert.equal(r.score, expected, iso(i))
    assert.equal(r.observedIndicators, learningScored.length)
    assert.equal(r.belowCoverageFloor, false)
  }
})

test('observations for countries outside the registry never move the frame', () => {
  const observations = learningObservations()
  const withStranger = [...observations, obs(learningScored[0]!.id, 'ZZZ', 1e9)]
  const a = buildFrames(observations, baseOpts).get(learningScored[0]!.id)
  const b = buildFrames(withStranger, baseOpts).get(learningScored[0]!.id)
  assert.deepEqual(a, b)
})

test('a historical value outside the current frame clamps and sets outOfFrame', () => {
  const def = learningScored[0] as IndicatorDef
  const top = iso(1) // value(1, 0) = 7, well inside the frame
  const observations = [
    ...learningObservations(),
    obs(def.id, top, 10 * N, 2010),
    obs(def.id, iso(2), -10 * N, 2011),
  ]
  const frames = buildFrames(observations, baseOpts)
  const frame = frames.get(def.id)
  assert.ok(frame)
  // The frame is built from the latest values only; the history does not stretch it.
  assert.equal(frame.max, N - 1)
  assert.equal(frame.min, 0)

  const history = buildHistory(observations)
  const high = normalizedAt(def, history, top, 2010, 0, frame)
  assert.deepEqual(high && { n: high.normalized, o: high.outOfFrame }, { n: 100, o: true })
  const low = normalizedAt(def, history, iso(2), 2011, 0, frame)
  assert.deepEqual(low && { n: low.normalized, o: low.outOfFrame }, { n: 0, o: true })
  const now = normalizedAt(def, history, top, CURRENT_YEAR, 0, frame)
  assert.equal(now?.outOfFrame, false)

  // The published series carries the clamped history, and the current cell stays in frame.
  const r = learningFor(observations, top, { momentumSpans: [15] })
  const row = r.indicators.find((x) => x.indicatorId === def.id)
  assert.ok(row)
  assert.equal(row.outOfFrame, false)
  assert.deepEqual(
    row.series.map((p) => [p.year, p.normalized]),
    [
      [2010, 100],
      [CURRENT_YEAR, round(expectedNormalized(1, 0), 1)],
    ],
  )
})

test('a missing value drops from the mean and lowers coverage; nothing is imputed', () => {
  // Drop row 0 for one country whose value there is neither end of the frame,
  // so the frame is the same with or without it.
  const target = 5
  assert.ok(value(target, 0) !== 0 && value(target, 0) !== N - 1)
  const observations = learningObservations((i, j) => i === target && j === 0)
  const r = learningFor(observations, iso(target))
  const full = learningFor(learningObservations(), iso(target))

  const others = learningScored.slice(1).map((_, k) => expectedNormalized(target, k + 1))
  assert.equal(r.score, round(mean(others), 1))
  assert.notEqual(r.score, full.score)
  assert.equal(r.observedIndicators, learningScored.length - 1)

  const row = r.indicators.find((x) => x.indicatorId === learningScored[0]!.id)
  assert.ok(row)
  assert.equal(row.status, 'missing')
  assert.equal(row.normalized, null)
  assert.equal(row.raw, null)
  assert.deepEqual(row.series, [])

  const denominator = countedForCoverage(learningDefs).length
  assert.equal(r.confidenceParts.coverage, round((learningScored.length - 1) / denominator, 3))
  assert.equal(full.confidenceParts.coverage, round(learningScored.length / denominator, 3))
  assert.ok(r.confidence < full.confidence)
})

test('below MIN_INDICATORS_FOR_SCORE the score is null but confidence and rows publish', () => {
  assert.equal(MIN_INDICATORS_FOR_SCORE, 2)
  const one = 3
  const two = 4
  const none = 6
  const observations = learningObservations(
    (i, j) => (i === one && j >= 1) || (i === two && j >= 2) || i === none,
  )
  const { countries } = scoreAll(observations, baseOpts)
  const get = (i: number) => countries.find((c) => c.iso3 === iso(i))?.dimensions[LEARNING]

  const r1 = get(one)
  assert.ok(r1)
  assert.equal(r1.score, null)
  assert.equal(r1.belowCoverageFloor, true)
  assert.equal(r1.observedIndicators, 1)
  assert.ok(r1.confidence > 0, 'confidence still publishes below the floor')
  assert.equal(r1.indicators.length, learningDefs.length)
  assert.equal(r1.indicators.filter((x) => x.status === 'observed').length, 1)
  assert.equal(r1.blendedScore, null)
  assert.equal(r1.blendedFrom, 'none')

  const r2 = get(two)
  assert.ok(r2)
  assert.equal(r2.observedIndicators, 2)
  assert.equal(r2.belowCoverageFloor, false)
  assert.equal(r2.score, round(mean([expectedNormalized(two, 0), expectedNormalized(two, 1)]), 1))
  assert.equal(r2.blendedFrom, 'indicators')

  const r0 = get(none)
  assert.ok(r0)
  assert.equal(r0.score, null)
  assert.equal(r0.belowCoverageFloor, true)
  assert.equal(r0.observedIndicators, 0)
  assert.equal(r0.confidence, 0)
})

test('retired rows leave the coverage denominator and gaps stay in it (D100)', () => {
  const dimension: Dimension = 'coordination'
  const defs = indicatorsFor(dimension)
  const scored = defs.filter(isScored)
  const retired = defs.filter((d) => d.ingest === 'retired')
  const gaps = defs.filter((d) => d.ingest === 'gap')
  assert.ok(retired.length > 0 && gaps.length > 0 && scored.length >= MIN_INDICATORS_FOR_SCORE)

  const counted = countedForCoverage(defs)
  assert.equal(counted.length, defs.length - retired.length)
  for (const g of gaps) assert.ok(counted.includes(g), `gap ${g.id} stays counted`)
  for (const r of retired) assert.ok(!counted.includes(r), `retired ${r.id} leaves the denominator`)

  const observations: Observation[] = []
  for (let i = 0; i < N; i++) {
    scored.forEach((d, j) => observations.push(obs(d.id, iso(i), 10 + ((i * (j + 1)) % N))))
    // A value filed against a retired row is never scored.
    for (const r of retired) observations.push(obs(r.id, iso(i), i))
  }
  const { countries, matrix } = scoreAll(observations, baseOpts)
  for (const r of retired) assert.equal(matrix.has(r.id), false)

  const res = countries[0]?.dimensions[dimension]
  assert.ok(res)
  assert.equal(res.observedIndicators, scored.length)
  // Every observed row is current and official, so confidence is coverage alone.
  assert.equal(res.confidenceParts.recency, 1)
  assert.equal(res.confidenceParts.sourceQuality, 1)
  assert.equal(res.confidenceParts.coverage, round(scored.length / (scored.length + gaps.length), 3))
  assert.notEqual(res.confidenceParts.coverage, round(scored.length / defs.length, 3))
  assert.equal(res.confidence, res.confidenceParts.coverage)

  for (const r of retired) {
    assert.equal(res.indicators.find((x) => x.indicatorId === r.id)?.status, 'retired')
  }
  for (const g of gaps) {
    assert.equal(res.indicators.find((x) => x.indicatorId === g.id)?.status, 'gap')
  }
})

test('confidence multiplies coverage, recency and source quality', () => {
  const observations = learningObservations().map((o) =>
    o.iso3 === iso(7) ? { ...o, year: CURRENT_YEAR - 8, sourceTier: 'composite_index' as const } : o,
  )
  const r = learningFor(observations, iso(7))
  assert.equal(r.confidenceParts.recency, 0.5)
  assert.equal(r.confidenceParts.sourceQuality, 0.7)
  const coverage = round(learningScored.length / countedForCoverage(learningDefs).length, 3)
  assert.equal(r.confidenceParts.coverage, coverage)
  assert.equal(r.confidence, round(coverage * 0.5 * 0.7, 3))
})

/* ------------------------------- Delphi -------------------------------- */

const DATASET = '9.9.9'
const NO_DATA = 10
const ONE_ROW = 11
const FULL = 12

function run(provenance: 'human' | 'gateway' | 'mock', datasetVersion = DATASET) {
  const est = (iso3: string, round: number, panelist: string, score: number, selfConfidence = 0.8) => ({
    iso3,
    dimension: LEARNING,
    round,
    panelist,
    model: 'fixture',
    score,
    selfConfidence,
    rationale: 'synthetic',
  })
  const cellEstimates = [NO_DATA, ONE_ROW, FULL].flatMap((i) => [
    est(iso(i), 1, 'a', 5),
    est(iso(i), 1, 'b', 5),
    est(iso(i), 2, 'a', 40),
    est(iso(i), 2, 'b', 50),
    est(iso(i), 2, 'c', 60),
    est(iso(i), 2, 'd', 99, 0.1),
  ])
  return DelphiRunFile.parse({
    runId: 'fixture',
    generatedAt: '2025-01-01T00:00:00Z',
    provenance,
    datasetVersion,
    panel: ['a', 'b', 'c', 'd'].map((p) => ({ panelist: p, model: 'fixture', stance: 'none' })),
    rounds: 2,
    cellEstimates,
    indicatorJudgements: [],
  })
}

const delphiObservations = learningObservations(
  (i, j) => i === NO_DATA || (i === ONE_ROW && j >= 1),
)

function delphiScore(provenance: 'human' | 'gateway' | 'mock', runVersion = DATASET) {
  const { countries } = scoreAll(delphiObservations, {
    ...baseOpts,
    delphiRun: run(provenance, runVersion),
    datasetVersion: DATASET,
    minPanelistConfidence: 0.5,
  })
  const get = (i: number) => {
    const r = countries.find((c) => c.iso3 === iso(i))?.dimensions[LEARNING]
    assert.ok(r)
    return r
  }
  return { noData: get(NO_DATA), oneRow: get(ONE_ROW), full: get(FULL) }
}

test('blendedScore falls back to Delphi only when no indicator is observed (D63)', () => {
  const { noData, oneRow, full } = delphiScore('human')

  // Final round only, low self-confidence dropped: median of 40, 50, 60.
  assert.equal(noData.delphiScore, 50)
  assert.equal(noData.delphiIqr, 10)
  assert.equal(noData.score, null, 'Delphi never enters score')
  assert.equal(noData.blendedScore, 50)
  assert.equal(noData.blendedFrom, 'delphi')

  // One observed row: below the floor, but indicator evidence exists, so no fallback.
  assert.equal(oneRow.observedIndicators, 1)
  assert.equal(oneRow.delphiScore, 50)
  assert.equal(oneRow.score, null)
  assert.equal(oneRow.blendedScore, null)
  assert.equal(oneRow.blendedFrom, 'none')

  // Full coverage: the indicator score wins and the panel sits beside it.
  assert.equal(full.delphiScore, 50)
  assert.notEqual(full.score, null)
  assert.notEqual(full.score, 50)
  assert.equal(full.blendedScore, full.score)
  assert.equal(full.blendedFrom, 'indicators')
})

test('Delphi never changes confidence', () => {
  const withRun = delphiScore('human')
  const without = scoreAll(delphiObservations, baseOpts).countries
  for (const [i, r] of [
    [NO_DATA, withRun.noData],
    [ONE_ROW, withRun.oneRow],
    [FULL, withRun.full],
  ] as const) {
    const base: DimensionResult | undefined = without.find((c) => c.iso3 === iso(i))?.dimensions[LEARNING]
    assert.equal(r.confidence, base?.confidence)
    assert.equal(r.score, base?.score)
  }
})

test('a mock run or a run for another dataset is never used', () => {
  for (const r of [delphiScore('mock'), delphiScore('gateway', '0.0.1')]) {
    assert.equal(r.noData.delphiScore, null)
    assert.equal(r.noData.blendedScore, null)
    assert.equal(r.noData.blendedFrom, 'none')
  }
})
