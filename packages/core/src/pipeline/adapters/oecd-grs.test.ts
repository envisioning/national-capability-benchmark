import assert from 'node:assert/strict'
import { parseOecdGrsFill } from './oecd-grs.js'

const header =
  'STRUCTURE,STRUCTURE_ID,STRUCTURE_NAME,ACTION,REF_AREA,Reference area,MEASURE,Measure,SECTOR,Institutional sector,STANDARD_REVENUE,Revenue category,CTRY_SPECIFIC_REVENUE,Country-specific revenue category,UNIT_MEASURE,Unit of measure,FREQ,Frequency of observation,TIME_PERIOD,Time period,OBS_VALUE,Observation value'

const row = (iso3: string, revenue: string, year: number, value: string, sector = 'S1311') =>
  `DATAFLOW,X,X,I,${iso3},,TAX_REV,,${sector},,${revenue},,_T,,PT_B1GQ,,A,,${year},,${value},`

const csv = [
  header,
  /* Bolivia: World Bank stops in 2007, so GRS fills 2008 on and never 2007. */
  row('BOL', '_T', 2007, '15'),
  row('BOL', '_T', 2024, '16.7'),
  row('BOL', 'T_2000', 2024, '0'),
  /* Guinea: no social security line, the total stands and is flagged. */
  row('GIN', '_T', 2024, '12.8'),
  /* Brazil: the World Bank serves a recent year, so GRS is not read. */
  row('BRA', '_T', 2024, '14'),
  row('BRA', 'T_2000', 2024, '5'),
  /* France: the social security line is subtracted. */
  row('FRA', '_T', 2023, '20'),
  row('FRA', 'T_2000', 2023, '7.5'),
  /* A non-central sector row is ignored. */
  row('GIN', '_T', 2024, '99', 'S13'),
  /* Too old to score at 2026 under D159. */
  row('CUB', '_T', 2009, '13'),
  /* Not a benchmark country. */
  row('XKX', '_T', 2024, '10'),
].join('\n')

const worldBank = new Map([
  ['BOL', 2007],
  ['GIN', 1992],
  ['BRA', 2023],
])

const result = parseOecdGrsFill(csv, worldBank, 2026, '2026-11-02T00:00:00.000Z', 'fixture://grs')

assert.equal(result.adapterId, 'oecd-grs-tax-revenue-fill')
assert.deepEqual(result.emittedCountries, ['BOL', 'FRA', 'GIN'])
assert.ok(result.servedByWorldBank.includes('BRA'))
assert.ok(!result.observations.some((o) => o.iso3 === 'BRA'))
/* Never the same year from two publishers. */
assert.deepEqual(
  result.observations.filter((o) => o.iso3 === 'BOL').map((o) => o.year),
  [2024],
)
assert.equal(result.observations.find((o) => o.iso3 === 'FRA')?.value, 12.5)
assert.equal(result.observations.find((o) => o.iso3 === 'GIN')?.value, 12.8)
assert.deepEqual(result.noSocialSecurityLine, ['GIN 2024'])
assert.match(result.observations.find((o) => o.iso3 === 'GIN')?.note ?? '', /no social security line/)
/* Cuba's only value is too old to score, so it is held. */
assert.deepEqual(result.heldCountries, ['CUB'])
for (const o of result.observations) assert.equal(o.indicatorId, 'tax_revenue_gdp')

console.log('OECD GRS adapter validated: fill only, after the last World Bank year, social security subtracted.')
