/*
 * The evidence brief prints each row in the unit the registry names. A
 * per-head row used to print the published national total under "per million
 * people", and a retired row printed "raw null ... (null)". Both are fixed in
 * prompt version 3.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { INDICATORS, indicatorsFor } from '../model/index.js'
import type { CountryResult, Dimension, IndicatorDef, IndicatorResult } from '../model/index.js'
import { evidenceBrief } from './prompts.js'

function row(def: IndicatorDef, over: Partial<IndicatorResult>): IndicatorResult {
  return {
    indicatorId: def.id,
    name: def.name,
    measurementClass: def.measurementClass,
    raw: null,
    transformed: null,
    normalized: null,
    year: null,
    source: 'World Bank (TEST)',
    sourceTier: null,
    winsorized: false,
    outOfFrame: false,
    status: 'gap',
    ...over,
  } as IndicatorResult
}

function brief(dimension: Dimension, rows: Record<string, Partial<IndicatorResult>>): string {
  const indicators = indicatorsFor(dimension).map((def) => row(def, rows[def.id] ?? {}))
  const result = {
    iso3: 'TST',
    country: 'Testland',
    dimensions: {
      [dimension]: {
        score: 50,
        confidenceParts: { coverage: 0.5, recency: 1, sourceQuality: 1 },
        indicators,
      },
    },
  } as unknown as CountryResult
  return evidenceBrief(result, [dimension])
}

test('a per-head row prints the per-head value under its unit and the total beside it', () => {
  const def = INDICATORS.find((d) => d.transform === 'per_million_population' && indicatorsFor(d.dimension).includes(d))
  assert.ok(def, 'no scored per-million row in the registry')
  const text = brief(def.dimension, {
    [def.id]: { status: 'observed', raw: 430843, transformed: 1265.4, normalized: 88, year: 2023 },
  })
  const line = text.split('\n').find((l) => l.startsWith(`- ${def.name} `)) ?? ''
  assert.match(line, new RegExp(`1265\\.4 ${def.unit}`))
  assert.match(line, /published as a national total 430843/)
  assert.doesNotMatch(line, new RegExp(`430843 ${def.unit}`))
})

test('a retired row or a row with no value never prints null', () => {
  const retired = INDICATORS.find((d) => d.ingest === 'retired' && indicatorsFor(d.dimension).includes(d))
  assert.ok(retired, 'no retired row in a dimension list')
  const text = brief(retired.dimension, {
    [retired.id]: { status: 'retired' },
  })
  assert.doesNotMatch(text, /null/)
  const line = text.split('\n').find((l) => l.startsWith(`- ${retired.name} `)) ?? ''
  assert.match(line, /NOT SCORED/)

  const observed = indicatorsFor(retired.dimension).find((d) => d.ingest !== 'retired' && d.ingest !== 'gap')
  if (observed) {
    const blank = brief(retired.dimension, { [observed.id]: { status: 'observed', raw: null } })
    assert.doesNotMatch(blank, /null/)
  }
})
