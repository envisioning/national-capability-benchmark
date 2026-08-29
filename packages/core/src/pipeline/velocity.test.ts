import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { COUNTRIES, DIMENSIONS, VelocityFile } from '../model/index.js'
import type { VelocityCell } from '../model/index.js'
import { FILES } from './paths.js'
import { velocityRate } from './velocity.js'

const raw = JSON.parse(await readFile(FILES.velocity, 'utf8')) as unknown
const parsed = VelocityFile.safeParse(raw)

if (!parsed.success) throw new Error(parsed.error.message)
assert.equal(parsed.success, true, 'velocity.json must match the VelocityFile schema')

const fixture = parsed.data
assert.equal(Object.keys(fixture.countries).length, COUNTRIES.length)
assert.ok(fixture.exclusions.length > 0, 'the fixture must retain at least one exclusion')
assert.equal(velocityRate(20, 25), 1)
assert.equal(velocityRate(0, 5), 1)

for (const country of COUNTRIES) {
  const dimensions = fixture.countries[country.iso3]
  assert.ok(dimensions, `${country.iso3} must have a velocity row`)
  if (!dimensions) throw new Error(`${country.iso3} must have a velocity row`)
  for (const dimension of DIMENSIONS) {
    const cell: VelocityCell | null = dimensions[dimension] ?? null
    if (!cell) continue
    assert.equal(cell.latestYear, cell.series.at(-1)?.year)
    assert.match(cell[`v${cell.latestYear}`] as string, /^[+-]\d+\.\d+$/)
    if (cell.v5y !== null) assert.match(cell.v5y, /^[+-]\d+\.\d+$/)
  }
}

console.log(
  `Velocity fixture validated: ${Object.keys(fixture.countries).length} countries, ${fixture.exclusions.length} exclusions.`,
)
