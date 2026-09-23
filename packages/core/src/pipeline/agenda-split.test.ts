/*
 * splitAgenda on a synthetic agenda: raise lowest score first, measure thinnest
 * evidence first, hold strongest first. The country lede and the agenda
 * document both read this order, so it is the contract. See D39.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { DIMENSIONS } from '../model/index.js'
import type { Dimension } from '../model/index.js'
import { splitAgenda } from './agenda.js'
import type { AgendaDimension, AgendaKind, CountryAgenda } from './agenda.js'

function item(
  dimension: Dimension,
  kind: AgendaKind,
  score: number | null,
  confidence: number,
): AgendaDimension {
  return {
    dimension,
    kind,
    score,
    confidence,
    band: 'usable',
    trend: null,
    scoredOn: [],
    gaps: [],
    retired: [],
    exemplars: [],
    evidenceElsewhere: [],
    institutionIds: [],
  }
}

function agenda(dimensions: AgendaDimension[]): CountryAgenda {
  return {
    generatedAt: '2025-01-01',
    iso3: 'BRA',
    country: 'Brazil',
    dimensions,
    ownEvidence: [],
    gapCount: 0,
  }
}

const d = (i: number): Dimension => DIMENSIONS[i] as Dimension
const ids = (xs: AgendaDimension[]): Dimension[] => xs.map((x) => x.dimension)

test('each item lands in its own kind and nothing is dropped', () => {
  const dims = [
    item(d(0), 'hold', 70, 0.6),
    item(d(1), 'raise', 40, 0.5),
    item(d(2), 'measure', null, 0.1),
    item(d(3), 'raise', 20, 0.5),
    item(d(4), 'measure', 30, 0.3),
    item(d(5), 'hold', 90, 0.7),
    item(d(6), 'measure', 80, 0.2),
    item(d(7), 'raise', 45, 0.6),
    item(d(8), 'hold', 55, 0.5),
  ]
  const { raise, measure, hold } = splitAgenda(agenda(dims))
  assert.equal(raise.length + measure.length + hold.length, dims.length)
  assert.ok(raise.every((x) => x.kind === 'raise'))
  assert.ok(measure.every((x) => x.kind === 'measure'))
  assert.ok(hold.every((x) => x.kind === 'hold'))

  assert.deepEqual(ids(raise), [d(3), d(1), d(7)], 'raise: lowest score first')
  assert.deepEqual(ids(measure), [d(2), d(6), d(4)], 'measure: thinnest evidence first')
  assert.deepEqual(ids(hold), [d(5), d(0), d(8)], 'hold: strongest first')
})

test('measure orders by confidence and ignores the score', () => {
  const { measure } = splitAgenda(
    agenda([
      item(d(0), 'measure', 10, 0.4),
      item(d(1), 'measure', 90, 0.05),
      item(d(2), 'measure', null, 0.2),
    ]),
  )
  assert.deepEqual(ids(measure), [d(1), d(2), d(0)])
})

test('a hold item with no score sorts after every scored one', () => {
  const { hold } = splitAgenda(
    agenda([item(d(0), 'hold', null, 0.6), item(d(1), 'hold', 51, 0.6), item(d(2), 'hold', 80, 0.6)]),
  )
  assert.deepEqual(ids(hold), [d(2), d(1), d(0)])
})

test('ties keep canonical dimension order', () => {
  const { raise, hold } = splitAgenda(
    agenda([
      item(d(0), 'raise', 30, 0.5),
      item(d(1), 'hold', 60, 0.5),
      item(d(2), 'raise', 30, 0.5),
      item(d(3), 'hold', 60, 0.5),
    ]),
  )
  assert.deepEqual(ids(raise), [d(0), d(2)])
  assert.deepEqual(ids(hold), [d(1), d(3)])
})

test('splitAgenda does not reorder the agenda it reads', () => {
  const dims = [item(d(0), 'raise', 40, 0.5), item(d(1), 'raise', 10, 0.5)]
  const a = agenda(dims)
  splitAgenda(a)
  assert.deepEqual(ids(a.dimensions), [d(0), d(1)])
})

test('an empty kind comes back as an empty list', () => {
  const { raise, measure, hold } = splitAgenda(agenda([item(d(0), 'hold', 60, 0.7)]))
  assert.deepEqual(raise, [])
  assert.deepEqual(measure, [])
  assert.equal(hold.length, 1)
})
