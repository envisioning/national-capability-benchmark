import assert from 'node:assert/strict'
import { ATLAS_NEW_PRODUCTS_RULE } from '../../model/index.js'
import { AtlasAccumulator, atlasEndYears, buildAtlasObservations, ruleEndingIn } from './atlas.js'

const header = 'country_id,country_iso3_code,product_id,product_hs92_code,year,export_value,import_value,global_market_share,export_rca,distance,cog,pci'
const row = (iso3: string, product: string, year: number, exports: number, imports: number, rca: number) =>
  `0,${iso3},0,${product},${year},${exports},${imports},0,${rca},0,0,0`
const window = (iso3: string, product: string, start: [number, number], end: [number, number, number]) => [
  ...[2009, 2010, 2011].map((year) => row(iso3, product, year, start[0], 0, start[1])),
  ...[2022, 2023, 2024].map((year) => row(iso3, product, year, end[0], end[1], end[2])),
]

const lines = [
  header,
  // Brazil: 0101 new and net exporter; 0102 new but imported more than exported;
  // 0103 crosses RCA 1 under the USD 1 million floor; 0104 already exported at the start.
  ...window('BRA', '0101', [0, 0.1], [5_000_000, 0, 2]),
  ...window('BRA', '0102', [0, 0.2], [3_000_000, 9_000_000, 1.5]),
  ...window('BRA', '0103', [0, 0], [500_000, 0, 3]),
  ...window('BRA', '0104', [9_000_000, 2], [9_000_000, 0, 2]),
  // 0105 exists only through another country, so Brazil had room to enter it.
  row('USA', '0105', 2010, 1, 0, 0),
  // An absent year counts as zero: mean RCA over the end window is (3 + 0 + 0) / 3 = 1.
  row('BRA', '0106', 2022, 3_000_000, 0, 3),
  // The unspecified line is not a product, and a year outside both windows is ignored.
  row('BRA', 'XXXX', 2023, 9_000_000, 0, 9),
  row('BRA', '0107', 2017, 9_000_000, 0, 9),
  // A country outside the benchmark still defines products but emits nothing.
  row('ZZZ', '0108', 2024, 1, 0, 0),
]

const accumulator = new AtlasAccumulator()
for (const line of lines) accumulator.line(line)
const result = buildAtlasObservations(accumulator, { retrievedAt: '2026-10-02T00:00:00.000Z' })

assert.equal(result.adapterId, 'atlas-hs92-new-export-products-v1')
assert.equal(result.pin.productUniverse, 7) // 0101-0106 and 0108; not XXXX, not 0107
const bra = result.pin.counts.BRA!
assert.equal(bra.available, 6) // every product but 0104
assert.equal(bra.new, 3) // 0101, 0102, 0106
assert.deepEqual(bra.products, ['0101', '0102', '0106'])
assert.equal(bra.newNetExporter, 2) // 0102 is imported more than exported
assert.deepEqual(result.emittedCountries, ['BRA', 'USA'])
/* The fixture holds Brazil in no full earlier pair of windows, so the pinned year is all it emits. */
assert.deepEqual(result.observations.map((o) => `${o.iso3} ${o.year}`), ['BRA 2024', 'USA 2024'])
const obs = result.observations.find((o) => o.iso3 === 'BRA')!
assert.equal(obs.indicatorId, 'new_export_products_rate')
assert.equal(obs.value, 50)
assert.equal(obs.year, ATLAS_NEW_PRODUCTS_RULE.end.to)
assert.equal(obs.sourceTier, 'academic_survey')
assert.match(obs.note ?? '', /3 new of 6/)
assert.match(obs.note ?? '', /2 of the 3 exported more than imported/)
assert.equal(result.observations.find((o) => o.iso3 === 'USA')!.value, 0)
assert.ok(!result.emittedCountries.includes('ZZZ'))
assert.ok(result.unmappedLabels.includes('ARE'))

/*
 * History (D183): the rule moves back one end year at a time, keeping both
 * windows and the gap. Chile is in the file every year from 2007; product
 * 0201 turns competitive in 2020 and 0202 in 2023.
 */
assert.deepEqual(atlasEndYears().slice(0, 2), [2010, 2011])
assert.equal(atlasEndYears().at(-1), ATLAS_NEW_PRODUCTS_RULE.end.to)
assert.deepEqual(ruleEndingIn(ATLAS_NEW_PRODUCTS_RULE, 2020).start, { from: 2005, to: 2007 })
const history = new AtlasAccumulator()
history.line(header)
for (let year = 2007; year <= 2024; year += 1) {
  history.line(row('CHL', '0201', year, year >= 2020 ? 5_000_000 : 0, 0, year >= 2020 ? 2 : 0))
  history.line(row('CHL', '0202', year, year >= 2023 ? 5_000_000 : 0, 0, year >= 2023 ? 2 : 0))
}
const past = buildAtlasObservations(history, { retrievedAt: '2026-10-02T00:00:00.000Z' })
const chile = new Map(past.observations.map((o) => [o.year, o]))
/* Start windows before 2007 are not covered, so the first end year is 2022 (start 2007-2009). */
assert.deepEqual([...chile.keys()], [2022, 2023, 2024])
assert.equal(chile.get(2022)!.value, 50) // 0201 only: mean RCA over 2020-2022 is 2
assert.equal(chile.get(2023)!.value, 50) // 0202 mean RCA over 2021-2023 is 2/3, under 1
assert.equal(chile.get(2024)!.value, 100) // 0202 mean RCA over 2022-2024 is 4/3
assert.match(chile.get(2022)!.note ?? '', /over 2007-2009/)
assert.equal(past.pin.counts.CHL!.new, 2)

/* A file without the columns the rule reads is refused. */
assert.throws(() => new AtlasAccumulator().line('country_iso3_code,year'), /missing product_hs92_code/)

console.log('Atlas adapter validated: windows, absence and presence lines, export floor, product universe, re-export count, moved windows.')
