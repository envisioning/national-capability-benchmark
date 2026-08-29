import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { BR_STATES, CorroborationFile, ObservationFile } from '../model/index.js'
import { FILES, brSubnationalFile } from './paths.js'

const fixture = CorroborationFile.parse(
  JSON.parse(await readFile(brSubnationalFile('income_inequality'), 'utf8')),
)
const national = ObservationFile.parse(JSON.parse(await readFile(FILES.worldBank, 'utf8')))
  .observations.find(
    (row) =>
      row.indicatorId === fixture.indicatorId &&
      row.iso3 === fixture.iso3 &&
      row.geometry === 'national' &&
      row.year === fixture.national.year,
  )

assert.equal(fixture.geometry, 'state')
assert.equal(fixture.reconciliation, 'aggregate')
assert.equal(fixture.states.length, BR_STATES.length)
assert.equal(new Set(fixture.states.map((state) => state.iso)).size, BR_STATES.length)
assert.ok(national, 'the fixture must cite a matching national observation')
assert.equal(fixture.national.value, Number(((national?.value ?? 0) / 100).toFixed(3)))
assert.ok(fixture.source.length > 0)
assert.ok(fixture.sourceUrl.startsWith('https://'))
for (const state of fixture.states) {
  assert.match(state.iso, /^BR-[A-Z]{2}$/)
  assert.equal(state.year, fixture.national.year)
}

console.log(`Brazil subnational fixture validated: ${fixture.states.length} state rows.`)
