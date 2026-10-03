/*
 * The capability map on synthetic data: the peer rule picks the nearest
 * incomes on the log scale with a stable tie break, the subject is never its
 * own peer, positions compare at printed precision, and the reading holds ids
 * only. See D130.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { PT_BR } from '../i18n/index.js'
import {
  ARTEFACT_SCOPES,
  DIMENSIONS,
  artefactsFor,
  conditionsFor,
  indicatorsFor,
  isScored,
} from '../model/index.js'
import type { CountryResult, Dimension, DimensionResult } from '../model/index.js'
import {
  MAP_DIMENSIONS,
  buildCapabilityMap,
  incomePeers,
  mapIndicatorIds,
  mapSlug,
  positionAgainst,
  readCapabilityMap,
} from './capability-map.js'
import type { IncomeRow } from './capability-map.js'

const DIM = 'adaptability' as const

test('incomePeers takes the nearest on the log scale and never the subject', () => {
  const income: IncomeRow[] = [
    { iso3: 'AAA', gdpPerCapita: 10_000, year: 2024 },
    { iso3: 'BBB', gdpPerCapita: 20_000, year: 2024 },
    { iso3: 'CCC', gdpPerCapita: 5_000, year: 2024 },
    { iso3: 'DDD', gdpPerCapita: 11_000, year: 2023 },
    { iso3: 'EEE', gdpPerCapita: 80_000, year: 2024 },
  ]
  const { subject, peers } = incomePeers(income, 'AAA', 3)
  assert.equal(subject?.iso3, 'AAA')
  assert.deepEqual(
    peers.map((p) => p.iso3),
    /* Half and double are equally far on the log scale, so BBB and CCC tie
     * and the code breaks it. */
    ['DDD', 'BBB', 'CCC'],
  )
  assert.ok(peers.every((p) => p.iso3 !== 'AAA'))
})

test('incomePeers returns no peers for a country without income', () => {
  const { subject, peers } = incomePeers([{ iso3: 'AAA', gdpPerCapita: 1, year: 2024 }], 'ZZZ')
  assert.equal(subject, null)
  assert.equal(peers.length, 0)
})

test('positionAgainst compares at the printed precision', () => {
  assert.equal(positionAgainst(65.44, 65.36), 'level')
  assert.equal(positionAgainst(65.5, 65.3), 'above')
  assert.equal(positionAgainst(1, 2), 'below')
  assert.equal(positionAgainst(null, 2), null)
  assert.equal(positionAgainst(1, null), null)
})

function dimension(score: number | null, rows: Record<string, number | null>, conditions: Record<string, number | null>): DimensionResult {
  return {
    score,
    observedIndicators: Object.values(rows).filter((v) => v !== null).length,
    belowCoverageFloor: score === null,
    confidence: 0.6,
    confidenceParts: { coverage: 0.7, recency: 1, sourceQuality: 0.9 },
    delphiScore: null,
    delphiIqr: null,
    delphiDissent: false,
    blendedScore: score,
    blendedFrom: 'indicators',
    momentum: [],
    indicators: Object.entries(rows).map(([indicatorId, normalized]) => ({
      indicatorId,
      name: indicatorId,
      measurementClass: 'O',
      raw: normalized,
      transformed: normalized,
      normalized,
      year: normalized === null ? null : 2024,
      source: 'test',
      sourceTier: normalized === null ? null : 'international_organization',
      winsorized: false,
      outOfFrame: false,
      series: [],
      status: normalized === null ? 'gap' : 'observed',
      staleExcluded: null,
    })) as DimensionResult['indicators'],
    checks: [],
    conditions: Object.entries(conditions).map(([indicatorId, value]) => ({
      indicatorId,
      name: indicatorId,
      definition: '',
      unit: 'per 100 people',
      direction: 'higher_better',
      value,
      year: value === null ? null : 2024,
      source: 'test',
      sourceTier: value === null ? null : 'international_organization',
      rank: null,
      n: 3,
      stale: false,
      note: '',
    })),
  }
}

function country(
  iso3: string,
  score: number | null,
  rowValue: number,
  condition: number,
  dim: Dimension = DIM,
): CountryResult {
  const rowIds = indicatorsFor(dim).filter(isScored).map((d) => d.id)
  const conditionIds = conditionsFor(dim).map((d) => d.id)
  const rows = Object.fromEntries(rowIds.map((id) => [id, rowValue]))
  const conds = Object.fromEntries(conditionIds.map((id) => [id, condition]))
  const empty = dimension(null, {}, {})
  return {
    country: iso3,
    iso3,
    dimensions: Object.fromEntries(
      DIMENSIONS.map((d) => [d, d === dim ? dimension(score, rows, conds) : empty]),
    ) as CountryResult['dimensions'],
  }
}

test('buildCapabilityMap places the subject against the peer medians', () => {
  const countries = [
    country('BRA', 60, 50, 20),
    country('AAA', 70, 40, 10),
    country('BBB', 80, 60, 10),
    country('CCC', null, 30, 30),
    country('FAR', 10, 99, 99),
  ]
  const income: IncomeRow[] = [
    { iso3: 'BRA', gdpPerCapita: 20_000, year: 2025 },
    { iso3: 'AAA', gdpPerCapita: 19_000, year: 2025 },
    { iso3: 'BBB', gdpPerCapita: 22_000, year: 2025 },
    { iso3: 'CCC', gdpPerCapita: 25_000, year: 2025 },
    { iso3: 'FAR', gdpPerCapita: 90_000, year: 2025 },
  ]
  const ids = mapIndicatorIds(DIM)
  const indicatorFiles = ids.map((id) => ({
    indicatorId: id,
    values: countries.map((c) => {
      const row = c.dimensions[DIM]!.indicators.find((i) => i.indicatorId === id)!
      return {
        iso3: c.iso3,
        country: c.iso3,
        raw: row.raw ?? 0,
        normalized: row.normalized,
        year: 2024,
        tier: 'international_organization' as const,
        outOfFrame: false,
      }
    }),
  }))
  const map = buildCapabilityMap({
    iso3: 'BRA',
    dimension: DIM,
    countries,
    subject: countries[0]!,
    indicatorFiles,
    diagnostics: {
      gdpSeries: 'NY.GDP.PCAP.PP.KD',
      income,
      dimensionVsGdp: [{ dimension: DIM, pearson: 0.7, spearman: 0.7, n: 5 }],
      conditions: conditionsFor(DIM).map((d) => ({
        indicatorId: d.id,
        dimension: DIM,
        name: d.name,
        measurementClass: d.measurementClass,
        countries: 5,
        latestYear: 2024,
        r: 0.8,
        n: 5,
        dimensionR: 0.6,
        dimensionN: 5,
      })),
    },
    peerCount: 3,
  })

  assert.deepEqual(map.peers.map((p) => p.iso3), ['AAA', 'BBB', 'CCC'])
  assert.deepEqual(map.peerIncome, { min: 19_000, max: 25_000 })
  /* CCC has no score: the median reads the two that do. */
  assert.equal(map.peersScored, 2)
  assert.equal(map.peerScoreMedian, 75)
  assert.equal(map.scorePosition, 'below')
  assert.equal(map.dimensionIncomeR, 0.7)
  assert.equal(map.rows.length, ids.length)
  for (const row of map.rows) {
    assert.equal(row.peerMedian, 40)
    assert.equal(row.peersWithValue, 3)
    assert.equal(row.position, 'above')
  }
  for (const c of map.conditions) {
    assert.equal(c.peerMedian, 10)
    assert.equal(c.position, 'above')
    assert.equal(c.incomeR, 0.8)
    assert.equal(c.scoreR, 0.6)
  }

  const reading = readCapabilityMap(map)
  assert.deepEqual(reading.rowsAbove, ids)
  assert.deepEqual(reading.rowsBelow, [])
  assert.deepEqual(reading.conditionsMore, conditionsFor(DIM).map((d) => d.id))
  /* More transmission losses than the peers is more of a bad thing, and the
   * reading says which conditions run that way so no sentence reads
   * backwards. */
  assert.deepEqual(
    reading.conditionsLowerBetter,
    conditionsFor(DIM)
      .filter((d) => d.direction === 'lower_better')
      .map((d) => d.id),
  )
  assert.ok(reading.conditionsLowerBetter.includes('electricity_transmission_losses'))
})

test('every dimension is published and each has capability rows', () => {
  assert.deepEqual([...MAP_DIMENSIONS], [...DIMENSIONS])
  for (const d of MAP_DIMENSIONS) assert.ok(mapIndicatorIds(d).length > 0, d)
})

test('a dimension with no conditions maps with an empty conditions list', () => {
  const bare = DIMENSIONS.find((d) => conditionsFor(d).length === 0)
  assert.ok(bare, 'some dimension has no conditions today')
  const countries = [country('BRA', 50, 50, 0, bare), country('AAA', 40, 40, 0, bare)]
  const map = buildCapabilityMap({
    iso3: 'BRA',
    dimension: bare,
    countries,
    subject: countries[0]!,
    indicatorFiles: [],
    diagnostics: {
      gdpSeries: 'NY.GDP.PCAP.PP.KD',
      income: [
        { iso3: 'BRA', gdpPerCapita: 20_000, year: 2025 },
        { iso3: 'AAA', gdpPerCapita: 19_000, year: 2025 },
      ],
      dimensionVsGdp: [],
      conditions: [],
    },
  })
  assert.deepEqual(map.conditions, [])
  assert.equal(map.scorePosition, 'above')
  assert.deepEqual(readCapabilityMap(map).conditionsMore, [])
})

test('the artefact table and the known-artefacts document name the same ids', () => {
  const doc = readFileSync(new URL('../../../../docs/KNOWN-ARTEFACTS.md', import.meta.url), 'utf8')
  const headings = [...doc.matchAll(/^## (A\d+)\b/gm)].map((m) => m[1])
  assert.deepEqual(
    ARTEFACT_SCOPES.map((a) => a.id),
    headings,
  )
})

test('artefactsFor keeps a country-scoped artefact on its own country', () => {
  assert.ok(artefactsFor('experimentation', 'IND').specific.includes('A2'))
  assert.ok(!artefactsFor('experimentation', 'BRA').specific.includes('A2'))
  assert.ok(artefactsFor('experimentation', 'BRA').specific.includes('A1'))
  assert.deepEqual(artefactsFor('adaptability', 'BRA').structural, ['A8', 'A10'])
})

test('map slugs come from the lexicon names and are pinned', () => {
  assert.deepEqual(
    DIMENSIONS.map((d) => mapSlug(PT_BR.dimensions[d] ?? d)),
    /* Published addresses under /brasil/mapa. A lexicon rename that moves one
     * needs a redirect from the old address. */
    [
      'antecipacao',
      'agencia',
      'coordenacao',
      'confianca',
      'aprendizagem',
      'experimentacao',
      'adaptacao',
      'construcao',
      'proposito-compartilhado',
    ],
  )
})
