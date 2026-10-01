import assert from 'node:assert/strict'
import { CHECKS, CHECKS_BY_ID, INDICATORS, VDEM_PUBLISHER } from '../../model/index.js'
import { parseVdem, VDEM_CY_V15_VARIABLES } from './vdem.js'

const csv = [
  'country_name,country_text_id,country_id,year,v2x_cspart,v2cacamps_osp,v2eltrnout,v2elcomvot,v2x_regime',
  '"Brazil",BRA,1,2018,0.9,3.2,79.7,2,2',
  '"Brazil",BRA,1,2022,0.89,3.5,79.42,2,2',
  '"Brazil",BRA,1,2023,0.88,3.4,,,2',
  '"Brazil",BRA,1,2024,0.898,3.561,,,2',
  '"United States",USA,2,2024,0.981,3.613,70.75,0,3',
  '"United States",USA,2,2025,0.97,3.7,99,0,3',
  '"Outside, example",ZZZ,3,2024,0.5,1,60,0,3',
  '"Missing",NLD,4,2024,,,,,',
  '"Out of scale",IRL,5,2020,1.2,0.5,62,0,3',
  '"Out of scale",IRL,5,2024,1.2,0.401,104,0,3',
].join('\n')

const result = parseVdem(csv, '2026-08-31T00:00:00.000Z', 'fixture://vdem')

assert.equal(result.adapterId, 'v-dem-cy-full-v15')
assert.deepEqual(result.emittedCountries, ['BRA', 'IRL', 'USA'])
assert.deepEqual(result.coverageByIndicator, {
  civil_society_strength: 2,
  __check__political_polarization: 3,
  __check__voter_turnout: 2,
})
assert.equal(result.observations.length, 7)
const civil = result.observations.filter((o) => o.indicatorId === 'civil_society_strength')
assert.equal(civil[0]?.indicatorId, 'civil_society_strength')
assert.equal(civil[0]?.iso3, 'BRA')
assert.equal(civil[0]?.year, 2024)
assert.equal(civil[0]?.sourceUrl, 'fixture://vdem')
assert.equal(civil[0]?.sourceTier, 'expert_panel')
const polarization = result.observations.filter((o) => o.indicatorId === '__check__political_polarization')
assert.deepEqual(
  polarization.map((o) => [o.iso3, o.value]),
  [
    ['BRA', 3.561],
    ['IRL', 0.401],
    ['USA', 3.613],
  ],
)
assert.ok(polarization[0]?.note?.startsWith('v2cacamps_osp;'))

/* Turnout is coded in election years only: the latest coded row up to the
 * release year is read and keeps its own year, a year past the release is
 * ignored, and an out-of-scale latest election drops the country instead of
 * reaching back to an older one. */
const turnout = result.observations.filter((o) => o.indicatorId === '__check__voter_turnout')
assert.deepEqual(
  turnout.map((o) => [o.iso3, o.year, o.value]),
  [
    ['BRA', 2022, 79.42],
    ['USA', 2024, 70.75],
  ],
)
assert.ok(turnout[0]?.note?.startsWith('v2eltrnout;'))
assert.match(turnout[0]?.note ?? '', /election year 2022/)
assert.match(turnout[0]?.note ?? '', /v2elcomvot 2 \(compulsory, sanctions enforced at minimal cost\)/)
assert.match(turnout[0]?.note ?? '', /v2x_regime 2 \(electoral democracy\)/)
assert.match(turnout[1]?.note ?? '', /v2elcomvot 0 \(not compulsory\); v2x_regime 3 \(liberal democracy\)/)

/* Every V-Dem row either registry asks for is one the adapter reads, under the
 * id its registry stores it at. A check under the indicator id would be scored. */
const read = new Map(VDEM_CY_V15_VARIABLES.map((spec) => [spec.variable as string, spec.indicatorId as string]))
for (const def of INDICATORS.filter((i) => i.ingest === 'adapter' && i.source.publisher === VDEM_PUBLISHER)) {
  assert.equal(read.get(def.source.series ?? ''), def.id, `adapter does not read ${def.id}`)
}
for (const check of CHECKS.filter((c) => c.source.publisher === VDEM_PUBLISHER)) {
  assert.equal(read.get(check.source.series ?? ''), `__check__${check.id}`, `adapter does not read check ${check.id}`)
}

/* The turnout check maps to v2eltrnout under its prefixed id, reads the
 * latest election, and is a check rather than a scored row. */
const turnoutSpec = VDEM_CY_V15_VARIABLES.find((spec) => spec.variable === 'v2eltrnout')
assert.equal(turnoutSpec?.indicatorId, '__check__voter_turnout')
assert.equal(turnoutSpec?.years, 'latest_election')
assert.deepEqual(turnoutSpec?.context, ['v2elcomvot', 'v2x_regime'])
assert.equal(CHECKS_BY_ID.voter_turnout?.source.series, 'v2eltrnout')
assert.equal(CHECKS_BY_ID.voter_turnout?.dimension, 'shared_purpose')
assert.equal(CHECKS_BY_ID.voter_turnout?.pinned?.years, 'latest_up_to')
assert.ok(!INDICATORS.some((i) => i.id === 'voter_turnout' || i.source.series === 'v2eltrnout'))

assert.throws(() => parseVdem('country_text_id,year,v2x_cspart\nBRA,2024,0.5'), /missing v2cacamps_osp/)
assert.throws(
  () => parseVdem('country_text_id,year,v2x_cspart,v2cacamps_osp,v2eltrnout,v2x_regime\nBRA,2024,0.5,1,70,2'),
  /missing v2elcomvot/,
)

console.log('V-Dem adapter validated: pinned year, latest election, benchmark filtering, per-variable scale.')
