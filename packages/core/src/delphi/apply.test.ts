/*
 * A panel estimate carries onto a later dataset of the same major version only
 * if the evidence brief it was made on is unchanged. See D160.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { DIMENSIONS, indicatorsFor } from '../model/index.js'
import type { CountryResult, DelphiRunFile, Dimension, IndicatorResult } from '../model/index.js'
import { applyDelphiRun, majorOf } from './apply.js'
import {
  DELPHI_PROMPT_VERSION,
  cellBriefHash,
  dimensionBrief,
  indicatorAuditHash,
  indicatorAuditRows,
  indicatorJudgementPrompt,
  round1CellPrompt,
  round2CellPrompt,
} from './prompts.js'
import { STANCES } from './panel.js'

function result(iso3: string, score: number): CountryResult {
  const dimensions = Object.fromEntries(
    DIMENSIONS.map((d) => [
      d,
      {
        score,
        confidenceParts: { coverage: 0.5, recency: 1, sourceQuality: 1 },
        indicators: indicatorsFor(d).map(
          (def) =>
            ({
              indicatorId: def.id,
              name: def.name,
              measurementClass: def.measurementClass,
              raw: null,
              transformed: null,
              normalized: null,
              year: null,
              source: 'test',
              status: 'gap',
            }) as unknown as IndicatorResult,
        ),
      },
    ]),
  )
  return { iso3, country: iso3, dimensions } as unknown as CountryResult
}

const D: Dimension = 'anticipation'

function run(over: Partial<DelphiRunFile>, hashed = true): DelphiRunFile {
  const base = result('AAA', 50)
  const est = (iso3: string, dimension: Dimension, round: number, hash?: string) => ({
    iso3,
    dimension,
    round,
    panelist: 'p1',
    model: 'm',
    score: 60,
    selfConfidence: 0.5,
    rationale: 'r',
    missingEvidence: [],
    ...(hashed && hash ? { briefHash: hash } : {}),
  })
  const judgedId = indicatorsFor(D)[0]!.id
  return {
    runId: 'r',
    generatedAt: 'now',
    provenance: 'in_session',
    note: '',
    datasetVersion: '9.0.1',
    promptVersion: DELPHI_PROMPT_VERSION,
    panel: [],
    rounds: 2,
    cellEstimates: [
      est('AAA', D, 1, cellBriefHash(base, D)),
      est('AAA', D, 2, cellBriefHash(base, D)),
      est('BBB', D, 1, cellBriefHash(result('BBB', 50), D)),
    ],
    indicatorJudgements: [
      {
        indicatorId: judgedId,
        round: 1,
        panelist: 'p1',
        model: 'm',
        measurementClass: 'C',
        constructValidity: 0.5,
        wealthProxyRisk: 0.5,
        redundantWith: [],
        rationale: 'r',
        ...(hashed ? { auditHash: indicatorAuditHash(D) } : {}),
      },
    ],
    ...over,
  } as DelphiRunFile
}

test('majorOf reads the first component', () => {
  assert.equal(majorOf('9.2.0'), 9)
  assert.equal(majorOf(undefined), null)
  assert.equal(majorOf('unknown'), null)
})

test('the same dataset version applies every cell without looking at briefs', () => {
  const out = applyDelphiRun(run({}), [], '9.0.1')
  assert.equal(out.run?.application?.mode, 'exact')
  assert.equal(out.run?.cellEstimates.length, 3)
})

test('a later minor keeps a cell whose brief hashes the same and drops one that changed', () => {
  const out = applyDelphiRun(run({}), [result('AAA', 50), result('BBB', 51)], '9.2.0')
  const app = out.run?.application
  assert.equal(app?.mode, 'carried')
  assert.equal(app?.cells, 2)
  assert.equal(app?.carried, 1)
  assert.deepEqual(app?.dropped, [{ iso3: 'BBB', dimension: D, reason: 'brief_changed' }])
  assert.deepEqual(out.run?.cellEstimates.map((e) => `${e.iso3}${e.round}`), ['AAA1', 'AAA2'])
  assert.equal(app?.judgementsCarried, 1)
})

test('both rounds of a cell go together', () => {
  const out = applyDelphiRun(run({}), [result('AAA', 99), result('BBB', 50)], '9.2.0')
  assert.deepEqual(out.run?.cellEstimates.map((e) => e.iso3), ['BBB'])
})

test('a country missing from the current frame drops its cells', () => {
  const out = applyDelphiRun(run({}), [result('AAA', 50)], '9.2.0')
  assert.equal(out.run?.application?.dropped[0]?.iso3, 'BBB')
})

test('a different major never carries, whatever the hashes say', () => {
  const out = applyDelphiRun(run({}), [result('AAA', 50), result('BBB', 50)], '10.0.0')
  assert.equal(out.run, null)
  assert.equal(out.refusal, 'other_major')
})

test('a different prompt version never carries', () => {
  const out = applyDelphiRun(run({ promptVersion: '2' }), [result('AAA', 50)], '9.2.0')
  assert.equal(out.refusal, 'other_prompt_version')
})

test('a run written before hashes existed never carries across versions', () => {
  const out = applyDelphiRun(run({}, false), [result('AAA', 50), result('BBB', 50)], '9.2.0')
  assert.equal(out.run?.application?.carried, 0)
  assert.ok(out.run?.application?.dropped.every((d) => d.reason === 'no_hash'))
  assert.equal(out.run?.cellEstimates.length, 0)
  assert.equal(out.run?.application?.judgementsCarried, 0)
})

test('the brief hash ignores the stance and the round and reads the evidence', () => {
  const a = result('AAA', 50)
  assert.equal(cellBriefHash(a, D), cellBriefHash(result('AAA', 50), D))
  assert.notEqual(cellBriefHash(a, D), cellBriefHash(result('AAA', 51), D))
  const block = dimensionBrief(a, D)
  for (const stance of STANCES.slice(0, 2)) {
    const panelist = { id: stance.id, model: 'm', stance }
    assert.ok(round1CellPrompt(panelist, a, [D]).includes(block))
    assert.ok(round2CellPrompt(panelist, a, 'summary', [D]).includes(block))
    assert.ok(indicatorJudgementPrompt(panelist, D).includes(indicatorAuditRows(D)))
  }
})
