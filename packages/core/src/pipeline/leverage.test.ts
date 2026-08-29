import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  COUNTRIES,
  LEVERAGE_DIMENSIONS,
  LeverageFile,
} from '../model/index.js'
import type { LeverageCell } from '../model/index.js'
import { FILES } from './paths.js'
import { LEVERAGE_SPECS, leverageScore } from './leverage.js'

const raw = JSON.parse(await readFile(FILES.leverage, 'utf8')) as unknown
const parsed = LeverageFile.safeParse(raw)
if (!parsed.success) throw new Error(parsed.error.message)

const fixture = parsed.data
assert.equal(Object.keys(fixture.countries).length, COUNTRIES.length)
assert.equal(LEVERAGE_SPECS.length, LEVERAGE_DIMENSIONS.length)
assert.equal(LEVERAGE_SPECS.filter((spec) => spec.indicatorId === null).length, 5)
assert.equal(leverageScore(0.97, 50, 23), 71.5)
assert.equal(leverageScore(2, 50, 23), 100)

for (const country of COUNTRIES) {
  const dimensions = fixture.countries[country.iso3]
  assert.ok(dimensions, `${country.iso3} must have a leverage row`)
  if (!dimensions) throw new Error(`${country.iso3} must have a leverage row`)
  for (const dimension of LEVERAGE_DIMENSIONS) {
    const cell: LeverageCell = dimensions[dimension] as LeverageCell
    const spec = LEVERAGE_SPECS.find((candidate) => candidate.dimension === dimension)
    assert.ok(spec)
    if (!spec || spec.indicatorId === null) {
      assert.equal(cell.value, null)
      assert.equal(cell.rawValue, null)
      assert.equal(cell.note, 'source not yet integrated; future work.')
    } else if (cell.source === null) {
      assert.equal(cell.value, null)
      assert.equal(cell.rawValue, null)
      assert.equal(cell.note, 'source series has no current value; future work.')
    } else {
      assert.equal(typeof cell.value, 'number')
      assert.equal(typeof cell.rawValue, 'number')
      if (cell.value === null || cell.rawValue === null) {
        throw new Error(`${country.iso3}/${dimension} unexpectedly has no sourced value`)
      }
      assert.ok(cell.value >= 0 && cell.value <= 100)
    }
  }
}

console.log(
  `Leverage fixture validated: ${Object.keys(fixture.countries).length} countries, ${LEVERAGE_DIMENSIONS.length} dimensions.`,
)
