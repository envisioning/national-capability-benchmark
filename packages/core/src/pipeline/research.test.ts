import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  DATASET_VERSION,
  EvidenceFile,
  ResearchScoutRunFile,
} from '../model/index.js'
import {
  buildResearchInventory,
  mockResearchCandidates,
  selectResearchSlots,
} from './research.js'

const evidence = EvidenceFile.parse(
  JSON.parse(await readFile(new URL('../../../../data/evidence/records.json', import.meta.url), 'utf8')),
)
const inventory = buildResearchInventory(evidence.records, '2026-08-30T00:00:00.000Z', DATASET_VERSION)

assert.equal(inventory.recordCount, evidence.records.length)
assert.equal(inventory.countriesRepresented, 22)
assert.equal(inventory.gapIndicatorsRepresented, 16)
assert.equal(inventory.guardrails.reversalCount, 13)
assert.equal(inventory.guardrails.reversalMinimum, 12)
assert.equal(inventory.guardrails.reversalDeficit, 0)
assert.equal(inventory.guardrails.mostRepresentedCountry, 'BRA')
assert.equal(inventory.guardrails.mostRepresentedCountryRecords, 24)

const slots = selectResearchSlots(inventory, { limit: 12 })
assert.equal(slots.length, 12)
assert.equal(new Set(slots.map((slot) => `${slot.iso3}|${slot.indicatorId}`)).size, slots.length)
assert.ok(slots.every((slot) => slot.priority >= 0))

const run = ResearchScoutRunFile.parse({
  kind: 'scout',
  runId: 'research-test',
  generatedAt: '2026-08-30T00:00:00.000Z',
  provenance: 'mock',
  model: 'mock',
  datasetVersion: DATASET_VERSION,
  countrySet: inventory.countries.map((country) => country.iso3),
  promptVersion: 'research-1',
  note: 'test scaffold',
  slots,
  candidates: mockResearchCandidates(slots),
})
assert.equal(run.candidates.length, slots.length)
assert.ok(run.candidates.every((candidate) => candidate.status === 'lead'))

console.log(`Research inventory validated: ${inventory.slots.length} uncovered slots; ${run.candidates.length} mock leads.`)
