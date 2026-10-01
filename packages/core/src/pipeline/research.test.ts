import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  COUNTRY_ISO3,
  DATASET_VERSION,
  EVIDENCE_GRID_INDICATORS,
  EvidenceFile,
  INDICATORS_BY_ID,
  isDeclaredGap,
  ResearchScoutRunFile,
} from '../model/index.js'
import {
  buildEvidenceGrid,
  buildResearchInventory,
  mockResearchCandidates,
  selectResearchSlots,
} from './research.js'

const evidence = EvidenceFile.parse(
  JSON.parse(await readFile(new URL('../../../../data/evidence/records.json', import.meta.url), 'utf8')),
)
const inventory = buildResearchInventory(evidence.records, '2026-08-30T00:00:00.000Z', DATASET_VERSION)

assert.equal(inventory.recordCount, evidence.records.length)
// Derived from the records rather than pinned, so adding evidence never breaks the test.
const iso3s = new Set(evidence.records.map((record) => record.iso3))
const perCountry = new Map<string, number>()
for (const record of evidence.records) perCountry.set(record.iso3, (perCountry.get(record.iso3) ?? 0) + 1)
const maxRecords = Math.max(...perCountry.values())
assert.equal(inventory.countriesRepresented, inventory.countries.filter((c) => iso3s.has(c.iso3)).length)
assert.equal(
  inventory.gapIndicatorsRepresented,
  inventory.indicators.filter((indicator) => indicator.records > 0).length,
)
assert.equal(inventory.guardrails.reversalMinimum, Math.floor(evidence.records.length / 5))
assert.equal(inventory.guardrails.reversalDeficit, 0, 'the evidence base must hold its reversal minimum')
assert.equal(inventory.guardrails.mostRepresentedCountryRecords, maxRecords)
assert.equal(perCountry.get(inventory.guardrails.mostRepresentedCountry ?? ''), maxRecords)
assert.ok(
  maxRecords <= inventory.guardrails.countryCeilingAtCurrentSize,
  'no country may hold more than a third of the records',
)

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

// D135: every grid column is a declared gap, and the grid covers every country.
for (const id of EVIDENCE_GRID_INDICATORS) {
  const def = INDICATORS_BY_ID[id]
  assert.ok(def && isDeclaredGap(def), `${id} must be a declared gap to be a grid column`)
}
const grid = inventory.grid
assert.equal(grid.total, COUNTRY_ISO3.length * EVIDENCE_GRID_INDICATORS.length)
assert.equal(grid.closedByRecord + grid.closedByNote + grid.open, grid.total)
assert.equal(grid.closedByNote, 0, 'no notes were passed to this inventory')

// A note closes an open cell and drops it from the queue; a record outranks a note.
const openCell = grid.cells.find((cell) => cell.status === 'open')
const recordCell = grid.cells.find((cell) => cell.status === 'record')
assert.ok(openCell && recordCell)
const notes = [openCell, recordCell].map((cell) => ({
  iso3: cell.iso3,
  indicatorId: cell.indicatorId,
  checkedAt: '2026-10-01',
  searched: ['test list'],
  candidates: [],
}))
const noted = buildEvidenceGrid(evidence.records, notes)
assert.equal(noted.closedByNote, 1)
assert.equal(noted.closedByRecord, grid.closedByRecord)
const notedInventory = buildResearchInventory(evidence.records, '2026-08-30T00:00:00.000Z', DATASET_VERSION, notes)
assert.ok(
  !notedInventory.slots.some((slot) => slot.iso3 === openCell.iso3 && slot.indicatorId === openCell.indicatorId),
  'a closed cell leaves the research queue',
)

console.log(`Research inventory validated: ${inventory.slots.length} uncovered slots; ${run.candidates.length} mock leads.`)
