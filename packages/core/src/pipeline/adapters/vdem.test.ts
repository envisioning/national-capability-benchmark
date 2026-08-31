import assert from 'node:assert/strict'
import { parseVdemCivilSociety } from './vdem.js'

const csv = [
  'country_name,country_text_id,country_id,year,v2x_cspart',
  '"Brazil",BRA,1,2024,0.898',
  '"United States",USA,2,2024,0.981',
  '"Brazil",BRA,1,2023,0.88',
  '"Outside, example",ZZZ,3,2024,0.5',
  '"Missing",NLD,4,2024,',
].join('\n')

const result = parseVdemCivilSociety(csv, '2026-08-31T00:00:00.000Z', 'fixture://vdem')

assert.equal(result.adapterId, 'v-dem-cy-core-v15-civil-society')
assert.deepEqual(result.emittedCountries, ['BRA', 'USA'])
assert.deepEqual(result.availableCountries, ['BRA', 'USA'])
assert.equal(result.observations.length, 2)
assert.equal(result.observations[0]?.indicatorId, 'civil_society_strength')
assert.equal(result.observations[0]?.year, 2024)
assert.equal(result.observations[0]?.sourceUrl, 'fixture://vdem')
assert.equal(result.observations[0]?.sourceTier, 'expert_panel')

console.log('V-Dem adapter validated: pinned year and benchmark filtering.')
