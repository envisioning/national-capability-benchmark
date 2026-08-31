import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  COUNTRY_ISO3,
  DIMENSIONS,
  EvidenceFile,
  INDICATORS_BY_ID,
} from '../model/index.js'
import { buildAgendaEvidenceCoverage } from './agenda.js'

const evidence = EvidenceFile.parse(
  JSON.parse(await readFile(new URL('../../../../data/evidence/records.json', import.meta.url), 'utf8')),
)
const coverage = buildAgendaEvidenceCoverage(evidence.records)
const rowByIso3 = new Map(coverage.rows.map((row) => [row.iso3, row]))

assert.equal(coverage.rows.length, COUNTRY_ISO3.length)
assert.equal(coverage.recordCount, evidence.records.length)
assert.equal(
  coverage.filledCells,
  coverage.rows.reduce((total, row) => total + row.capabilitiesCovered, 0),
)

for (const iso3 of COUNTRY_ISO3) {
  const row = rowByIso3.get(iso3)
  assert.ok(row, `${iso3} must remain visible even when it has no documented delivery`)
  assert.deepEqual(
    Object.keys(row.cells),
    [...DIMENSIONS],
    `${iso3} must carry every capability in canonical order`,
  )
}

for (const record of evidence.records) {
  const dimension = INDICATORS_BY_ID[record.indicatorId]?.dimension
  assert.ok(dimension, `${record.id} must point to a known indicator`)
  assert.ok(
    rowByIso3.get(record.iso3)?.cells[dimension].records.some((candidate) => candidate.id === record.id),
    `${record.id} must appear in its country x capability cell`,
  )
}

for (const dimension of DIMENSIONS) {
  const total = coverage.dimensionTotals[dimension]
  assert.equal(
    total.records,
    coverage.rows.reduce((sum, row) => sum + row.cells[dimension].records.length, 0),
  )
  assert.equal(
    total.countries,
    coverage.rows.filter((row) => row.cells[dimension].records.length > 0).length,
  )
}

console.log(
  `Agenda evidence coverage validated: ${coverage.filledCells}/${COUNTRY_ISO3.length * DIMENSIONS.length} country-capability cells filled.`,
)
