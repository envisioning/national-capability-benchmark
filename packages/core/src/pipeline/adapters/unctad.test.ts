import assert from 'node:assert/strict'
import { COUNTRIES } from '../../model/index.js'
import { parseUnctadExportConcentration, UNCTAD_M49 } from './unctad.js'

const header =
  'Year,Economy,Economy Label,Flow,Flow Label,Number of products,Number of products Footnote,Number of products Missing value,Concentration Index,Concentration Index Footnote,Concentration Index Missing value,Diversification Index,Diversification Index Footnote,Diversification Index Missing value'

const csv = [
  header,
  '2025,076,"Brazil",02,"Exports",250,,,0.17851,,,0.5,,',
  '2025,076,"Brazil",01,"Imports",255,,,0.05,,,0.2,,',
  '2024,076,"Brazil",02,"Exports",250,,,0.2,,,0.5,,',
  '2025,528,"Netherlands (Kingdom of the)",02,"Exports",258,,,0.076891,"Estimated",,0.3,"Estimated",',
  '2025,0000,"World",02,"Exports",261,,,0.05,,,0,,',
  '2024,840,"United States",02,"Exports",259,,,0.1,,,0.2,,',
  '2025,840,"United States",02,"Exports",,,,,,"No value reported or collected",,,',
].join('\n')

const result = parseUnctadExportConcentration(csv, '2026-10-01T00:00:00.000Z', 'fixture://unctad')

assert.equal(result.adapterId, 'unctadstat-export-concentration')
assert.deepEqual(result.emittedCountries, ['BRA', 'NLD'])
assert.deepEqual(result.availableCountries, ['BRA', 'NLD', 'USA'])
/* USA has a 2024 value but none for the pinned year: held, never carried forward. */
assert.deepEqual(result.heldCountries, ['USA'])
assert.deepEqual(result.estimatedCountries, ['NLD'])
assert.equal(result.observations[0]?.indicatorId, 'export_diversification')
assert.equal(result.observations[0]?.value, 0.17851)
assert.equal(result.observations[0]?.year, 2025)
assert.equal(result.observations[0]?.sourceTier, 'international_organization')
assert.match(result.observations[1]?.note ?? '', /UNCTAD footnote: Estimated/)
assert.doesNotMatch(result.observations[0]?.note ?? '', /footnote/)

/* Every benchmark country has an M49 code, and no two share one. */
assert.deepEqual(result.unmappedLabels, [])
for (const country of COUNTRIES) assert.ok(UNCTAD_M49[country.iso3], `${country.iso3} has no M49 code`)
assert.equal(new Set(Object.values(UNCTAD_M49)).size, Object.keys(UNCTAD_M49).length)

console.log('UNCTAD adapter validated: exports flow, pinned year, held and estimated countries.')
