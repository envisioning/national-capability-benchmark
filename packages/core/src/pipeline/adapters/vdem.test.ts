import assert from 'node:assert/strict'
import { parseVdem } from './vdem.js'

const csv = [
  'country_name,country_text_id,country_id,year,v2x_cspart,v2cacamps_osp',
  '"Brazil",BRA,1,2024,0.898,3.561',
  '"United States",USA,2,2024,0.981,3.613',
  '"Brazil",BRA,1,2023,0.88,3.4',
  '"Outside, example",ZZZ,3,2024,0.5,1',
  '"Missing",NLD,4,2024,,',
  '"Out of scale",IRL,5,2024,1.2,0.401',
].join('\n')

const result = parseVdem(csv, '2026-08-31T00:00:00.000Z', 'fixture://vdem')

assert.equal(result.adapterId, 'v-dem-cy-full-v15')
assert.deepEqual(result.emittedCountries, ['BRA', 'IRL', 'USA'])
assert.deepEqual(result.coverageByIndicator, { civil_society_strength: 2, political_polarization: 3 })
assert.equal(result.observations.length, 5)
assert.equal(result.observations[0]?.indicatorId, 'civil_society_strength')
assert.equal(result.observations[0]?.iso3, 'BRA')
assert.equal(result.observations[0]?.year, 2024)
assert.equal(result.observations[0]?.sourceUrl, 'fixture://vdem')
assert.equal(result.observations[0]?.sourceTier, 'expert_panel')
const polarization = result.observations.filter((o) => o.indicatorId === 'political_polarization')
assert.deepEqual(
  polarization.map((o) => [o.iso3, o.value]),
  [
    ['BRA', 3.561],
    ['IRL', 0.401],
    ['USA', 3.613],
  ],
)
assert.ok(polarization[0]?.note?.startsWith('v2cacamps_osp;'))

assert.throws(() => parseVdem('country_text_id,year,v2x_cspart\nBRA,2024,0.5'), /missing v2cacamps_osp/)

console.log('V-Dem adapter validated: pinned year, benchmark filtering, per-variable scale.')
