import assert from 'node:assert/strict'
import test from 'node:test'
import { checkSovereigntyFile } from './check.js'
import { SOVEREIGNTY_STAGES } from './schema.js'

const TODAY = '2026-10-31'
const institutions = new Set(['bra.federal.bcb'])

function caseWith(overrides: Record<string, unknown> = {}) {
  return {
    id: 'bra.sov.test',
    title: 'Test',
    domain: 'digital_public_infrastructure',
    function: 'Settles payments.',
    status: 'deployed',
    statusSourceIds: ['s1'],
    organizations: [{ name: 'Banco Central do Brasil', role: 'operator', country: 'BRA', institutionId: 'bra.federal.bcb' }],
    stages: SOVEREIGNTY_STAGES.map((stage) => ({ stage, control: 'unknown', basis: 'No source.', sourceIds: [] })),
    dependencies: [],
    constraints: 'None recorded.',
    counterevidence: [],
    uncertainty: 'All stages open.',
    challengesNarrative: false,
    sources: [
      { id: 's1', url: 'https://www.bcb.gov.br/', publisher: 'BCB', title: 'Pix', published: 2024, accessed: TODAY, access: 'fetched', quote: 'Pix' },
      { id: 's2', url: 'https://www.bcb.gov.br/x', publisher: 'BCB', title: 'Blocked', published: null, accessed: TODAY, access: 'blocked' },
    ],
    reviewedAt: TODAY,
    ...overrides,
  }
}

const file = (cases: unknown[]) => ({ iso3: 'BRA', framework: 'D171', updatedAt: TODAY, coverage: 'Test.', cases })
const errors = (cases: unknown[]) =>
  checkSovereigntyFile(file(cases), 'BRA.json', institutions, { today: TODAY }).problems.filter((p) => p.severity === 'error').map((p) => p.problem)

test('a sourced record with every stage unknown is valid', () => {
  assert.deepEqual(errors([caseWith()]), [])
})

test('duplicate ids, missing stages and bad statuses are errors', () => {
  assert.ok(errors([caseWith(), caseWith()]).some((p) => p.includes('duplicate id')))
  assert.ok(errors([caseWith({ stages: [] })]).some((p) => p.includes('stage research missing')))
  assert.ok(errors([caseWith({ status: 'operating' })]).length > 0)
})

test('a working status needs a fetched source', () => {
  assert.ok(errors([caseWith({ statusSourceIds: [] })]).some((p) => p.includes('claims a working capability')))
  assert.ok(errors([caseWith({ statusSourceIds: ['s2'] })]).some((p) => p.includes('blocked')))
})

test('a classification other than unknown needs a fetched source', () => {
  const stages = SOVEREIGNTY_STAGES.map((stage) => ({ stage, control: stage === 'operation' ? 'verified' : 'unknown', basis: 'x', sourceIds: [] }))
  assert.ok(errors([caseWith({ stages })]).some((p) => p.includes('unsourced is unknown')))
})

test('a proposal cannot be verified at operation', () => {
  const stages = SOVEREIGNTY_STAGES.map((stage) => ({ stage, control: stage === 'operation' ? 'verified' : 'unknown', basis: 'x', sourceIds: stage === 'operation' ? ['s1'] : [] }))
  assert.ok(errors([caseWith({ status: 'proposed', stages })]).some((p) => p.includes('a plan earns verified at research only')))
  assert.ok(errors([caseWith({ status: 'pilot', stages })]).some((p) => p.includes('only a working system')))
})

test('an institution id must exist in the map', () => {
  const organizations = [{ name: 'Nobody', role: 'x', country: 'BRA', institutionId: 'bra.federal.nobody' }]
  assert.ok(errors([caseWith({ organizations })]).some((p) => p.includes('not in data/institutions')))
})
