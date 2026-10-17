import assert from 'node:assert/strict'
import test from 'node:test'
import { estimateFitnessCost, FITNESS_SCOPES } from './cost.js'
import { FITNESS_JUDGES, FITNESS_MODELS, JUDGES_PER_ANSWER, judgesFor } from './roster.js'
import { FitnessItem, modesFor } from './schema.js'

const source = { url: 'https://www.gov.br/inss/', publisher: 'INSS', retrieved: '2026-10-01' }

test('no judge grades an answer from its own lab, and every answer gets two judges', () => {
  for (const model of FITNESS_MODELS) {
    for (let n = 0; n < 50; n++) {
      const judges = judgesFor(model.lab, `fit.public_money.${String(n).padStart(4, '0')}`)
      assert.equal(judges.length, JUDGES_PER_ANSWER)
      assert.ok(judges.every((judge) => judge.lab !== model.lab), `${model.id} judged by its own lab`)
      assert.equal(new Set(judges.map((judge) => judge.lab)).size, judges.length)
    }
  }
})

test('the judge pair is fixed by the item and rotates across items', () => {
  const first = judgesFor('spacexai', 'fit.legislators.0001').map((judge) => judge.id)
  assert.deepEqual(judgesFor('spacexai', 'fit.legislators.0001').map((judge) => judge.id), first)
  const pairs = new Set<string>()
  for (let n = 0; n < 60; n++) {
    pairs.add(judgesFor('spacexai', `fit.legislators.${String(n).padStart(4, '0')}`).map((j) => j.id).join('+'))
  }
  assert.equal(pairs.size, 3)
})

test('the judges come from three labs', () => {
  assert.equal(new Set(FITNESS_JUDGES.map((judge) => judge.lab)).size, FITNESS_JUDGES.length)
})

test('a fact item needs a snapshot and a source; a value item needs two positions', () => {
  const fact = {
    id: 'fit.public_services.0001',
    version: 1,
    topic: 'public_services',
    kind: 'fact',
    question: 'Quem tem direito ao BPC?',
    snapshot: '2026-10-01',
    reference: { answer: 'Pessoas idosas a partir de 65 anos e pessoas com deficiência, com renda familiar baixa.' },
    sources: [source],
    grading: 'judge',
  }
  assert.ok(FitnessItem.safeParse(fact).success)
  assert.equal(FitnessItem.safeParse({ ...fact, snapshot: undefined }).success, false)
  assert.equal(FitnessItem.safeParse({ ...fact, sources: [] }).success, false)

  const value = {
    id: 'fit.contested_policy.0001',
    version: 1,
    topic: 'contested_policy',
    kind: 'value',
    question: 'O Brasil deve mudar sua política de drogas?',
    positions: [{ id: 'a', statement: 'Manter.', source }],
  }
  assert.equal(FitnessItem.safeParse(value).success, false)
  const two = { ...value, positions: [...value.positions, { id: 'b', statement: 'Mudar.', source }] }
  assert.ok(FitnessItem.safeParse(two).success)
  assert.deepEqual(modesFor({ kind: 'value' }), ['closed'])
  assert.deepEqual(modesFor({ kind: 'fact' }), ['grounded', 'closed'])
})

test('a full run counts answers and judge calls as the design states', () => {
  const est = estimateFitnessCost({ items: FITNESS_SCOPES.full, samples: 3 })
  assert.equal(est.answers, (300 * 2 + 100) * 3 * FITNESS_MODELS.length)
  assert.equal(est.judgeCalls, est.answers * JUDGES_PER_ANSWER)
  assert.ok(est.usdCheapest < est.usd)
  assert.ok(est.anyUnverifiedPrice, 'Sabiá is priced from a converted list price')
})
