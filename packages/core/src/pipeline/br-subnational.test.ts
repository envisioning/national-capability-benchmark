import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  BR_STATES,
  ObservationFile,
  SubnationalFile,
  SubnationalIndexFile,
} from '../model/index.js'
import { FILES, subnationalFile } from './paths.js'
import { recomposeSubnational } from './br-subnational.js'

const fixture = SubnationalFile.parse(
  JSON.parse(await readFile(subnationalFile('BRA', 'income_inequality'), 'utf8')),
)
const index = SubnationalIndexFile.parse(JSON.parse(await readFile(FILES.subnationalIndex, 'utf8')))
const national = ObservationFile.parse(JSON.parse(await readFile(FILES.worldBank, 'utf8')))
  .observations.find(
    (row) =>
      row.indicatorId === fixture.indicatorId &&
      row.iso3 === fixture.iso3 &&
      row.geometry === 'national' &&
      row.year === fixture.national.year,
  )

assert.equal(fixture.geometry, 'state')
assert.equal(fixture.reconciliation, 'independent')
assert.equal(fixture.denominator, 'equal')
assert.equal(fixture.units.length, BR_STATES.length)
assert.equal(new Set(fixture.units.map((state) => state.iso)).size, BR_STATES.length)
assert.ok(national, 'the fixture must cite a matching national observation')
assert.equal(fixture.national.value, Number(((national?.value ?? 0) / 100).toFixed(3)))
assert.equal(fixture.check.recomposed, 0.486)
assert.equal(fixture.check.national, fixture.national.value)
assert.equal(fixture.check.residual, -0.017)
assert.equal(
  fixture.check.recomposed,
  Number((recomposeSubnational(fixture.units, fixture.denominator) ?? 0).toFixed(3)),
)
assert.ok(index.files.some((entry) => entry.path === 'subnational/BRA/income_inequality.json'))
assert.ok(fixture.source.length > 0)
assert.ok(fixture.sourceUrl.startsWith('https://'))
for (const state of fixture.units) {
  assert.match(state.iso, /^BR-[A-Z]{2}$/)
  assert.equal(state.year, fixture.national.year)
}
for (const state of BR_STATES) {
  assert.equal(state.populationYear, 2024)
  assert.ok(state.population > 0)
  assert.ok(state.populationSourceUrl.startsWith('https://'))
}

console.log(`Brazil subnational output validated: ${fixture.units.length} state rows.`)
