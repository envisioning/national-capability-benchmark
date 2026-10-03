/*
 * The World Bank ingest rules on synthetic observations: a published 0 on a
 * row flagged `zeroIsMissing` is dropped and listed with its reason, and a 0
 * on any other row is kept. No committed data is read. See D157.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { INDICATORS_BY_ID } from '../model/index.js'
import type { IndicatorDef, Observation } from '../model/index.js'
import { applyIngestRules, diffObservations, tagDroppedRevisions } from './ingest.js'

const def = (id: string, zeroIsMissing?: boolean): IndicatorDef =>
  ({
    id,
    source: { publisher: 'World Bank', series: `SERIES.${id}` },
    ...(zeroIsMissing ? { zeroIsMissing } : {}),
  }) as IndicatorDef

const obs = (indicatorId: string, iso3: string, year: number, value: number): Observation => ({
  indicatorId,
  iso3,
  geometry: 'national',
  reconciliation: 'context_only',
  value,
  year,
  sourceTier: 'international_organization',
  sourceUrl: 'https://example.org',
  retrievedAt: '2026-10-03T00:00:00.000Z',
})

const defs = [def('share_of_gdp', true), def('share_of_firms')]

test('a zero on a flagged row is dropped with its reason', () => {
  const { kept, dropped } = applyIngestRules(
    [obs('share_of_gdp', 'AAA', 2011, 0), obs('share_of_gdp', 'AAA', 1990, 14.2)],
    defs,
  )
  assert.deepEqual(
    kept.map((o) => o.year),
    [1990],
  )
  assert.deepEqual(dropped, [
    {
      indicatorId: 'share_of_gdp',
      iso3: 'AAA',
      year: 2011,
      value: 0,
      series: 'SERIES.share_of_gdp',
      reason: 'zero_is_missing',
    },
  ])
})

test('a zero on an unflagged row is kept', () => {
  const { kept, dropped } = applyIngestRules([obs('share_of_firms', 'AAA', 2020, 0)], defs)
  assert.equal(kept.length, 1)
  assert.equal(dropped.length, 0)
})

test('only an exact zero is dropped, never a small value', () => {
  const { kept } = applyIngestRules([obs('share_of_gdp', 'AAA', 2020, 0.004)], defs)
  assert.equal(kept.length, 1)
})

test('series outside the registry keep their zeros', () => {
  const { kept } = applyIngestRules([obs('__check__x', 'AAA', 2020, 0)], defs)
  assert.equal(kept.length, 1)
})

test('the dropped cell reads as removed against a file that held it', () => {
  const before = [obs('share_of_gdp', 'AAA', 2011, 0)]
  const { kept: after, dropped } = applyIngestRules(before, defs)
  const diff = diffObservations(before, after)
  assert.equal(diff.removed, 1)
  const [revision] = tagDroppedRevisions(diff.revisions, dropped)
  assert.equal(revision?.to, null)
  assert.equal(revision?.reason, 'zero_is_missing')
})

test('the registry flags manufacturing and leaves shares that can be zero alone', () => {
  assert.equal(INDICATORS_BY_ID.manufacturing_value_added?.zeroIsMissing, true)
  for (const id of ['internet_users', 'time_to_export', 'bribery_incidence', 'vocational_secondary_share']) {
    assert.notEqual(INDICATORS_BY_ID[id]?.zeroIsMissing, true, id)
  }
})
