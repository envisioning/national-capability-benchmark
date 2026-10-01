import assert from 'node:assert/strict'
import { parseIlostatLongTermUnemployment, plausibilityGate } from './ilostat.js'
import type { LtuPoint } from './ilostat.js'

const LFS = 'LFS - Labour Force Survey'
const series = (values: Array<[number, number]>, source = LFS): LtuPoint[] =>
  values.map(([year, value]) => ({ year, value, source, unknownPct: 0, status: [] }))
const reasons = (result: ReturnType<typeof plausibilityGate>) =>
  result.dropped.map((d) => `${d.year}:${d.reason}`)
const keptYears = (result: ReturnType<typeof plausibilityGate>) => result.kept.map((p) => p.year)

/* A steady series passes untouched. */
{
  const r = plausibilityGate('AAA', series([[2020, 20], [2021, 22], [2022, 25], [2023, 24]]))
  assert.deepEqual(reasons(r), [])
  assert.deepEqual(keptYears(r), [2020, 2021, 2022, 2023])
}

/* Floor: one year under 3% goes, the rest of a plausible instrument stays. */
{
  const r = plausibilityGate('AAA', series([[2019, 6], [2020, 2.9], [2021, 9]]))
  assert.deepEqual(reasons(r), ['2020:below_floor'])
  assert.deepEqual(keptYears(r), [2019, 2021])
}

/* Instrument floor: a survey whose median is under 3% loses its years above 3% too. */
{
  const r = plausibilityGate('AAA', series([[2019, 1.5], [2020, 1.1], [2021, 4.4], [2022, 3.1], [2023, 2.2]]))
  assert.deepEqual(reasons(r), [
    '2019:below_floor',
    '2020:below_floor',
    '2021:instrument_floor',
    '2022:instrument_floor',
    '2023:below_floor',
  ])
  assert.deepEqual(keptYears(r), [])
}

/* The instrument floor is per survey: a second survey with a plausible median is judged on its own. */
{
  const points = [
    ...series([[2015, 1], [2016, 1.2]], 'HS - Old household survey'),
    ...series([[2018, 20], [2019, 22]]),
  ]
  const r = plausibilityGate('AAA', points)
  assert.deepEqual(reasons(r), ['2015:below_floor', '2016:below_floor'])
  assert.deepEqual(keptYears(r), [2018, 2019])
}

/* Spike: one year that leaves and comes back is dropped. */
{
  const r = plausibilityGate('AAA', series([[2019, 20], [2020, 40], [2021, 21], [2022, 22]]))
  assert.deepEqual(reasons(r), ['2020:spike'])
}

/* Downward spike is a spike too. */
{
  const r = plausibilityGate('AAA', series([[2019, 40], [2020, 10], [2021, 42], [2022, 41]]))
  assert.deepEqual(reasons(r), ['2020:spike'])
}

/* Two-year excursion counts as a spike. */
{
  const r = plausibilityGate('AAA', series([[2018, 20], [2019, 45], [2020, 50], [2021, 22], [2022, 21]]))
  assert.deepEqual(reasons(r), ['2019:spike', '2020:spike'])
}

/* Three-year excursion is longer than a spike and is kept as a level shift and back. */
{
  const r = plausibilityGate('AAA', series([[2017, 20], [2018, 45], [2019, 46], [2020, 47], [2021, 22], [2022, 21]]))
  assert.deepEqual(reasons(r), [])
}

/* Level shift: a jump the next year keeps is real and stays. */
{
  const r = plausibilityGate('AAA', series([[2019, 20], [2020, 40], [2021, 39], [2022, 38]]))
  assert.deepEqual(reasons(r), [])
  assert.equal(r.kept.at(-1)?.year, 2022)
}

/* A jump that overshoots and settles at a new level is not a spike: the neighbours disagree. */
{
  const r = plausibilityGate('AAA', series([[2019, 10], [2020, 50], [2021, 30], [2022, 31]]))
  assert.deepEqual(reasons(r), [])
}

/* A move of exactly the threshold is not a jump. */
{
  const r = plausibilityGate('AAA', series([[2019, 20], [2020, 35]]))
  assert.deepEqual(reasons(r), [])
}

/* Unconfirmed jump: the latest year jumps and nothing follows, so the year before is emitted. */
{
  const r = plausibilityGate('AAA', series([[2022, 22], [2023, 17], [2024, 16.6], [2025, 38.2]]))
  assert.deepEqual(reasons(r), ['2025:unconfirmed_jump'])
  assert.equal(r.kept.at(-1)?.year, 2024)
}

/* A floor-dropped value is not a neighbour: the jump test runs on what survived the floor. */
{
  const r = plausibilityGate('AAA', series([[2020, 30], [2021, 1.0], [2022, 31]]))
  assert.deepEqual(reasons(r), ['2021:below_floor'])
  assert.deepEqual(keptYears(r), [2020, 2022])
}

/* A dropped spike does not vouch against its neighbour: the value after it is judged against the anchor before. */
{
  const r = plausibilityGate('AAA', series([[2018, 10], [2019, 40], [2020, 10], [2021, 40], [2022, 10], [2023, 11]]))
  assert.deepEqual(reasons(r), ['2019:spike', '2021:spike'])
  assert.deepEqual(keptYears(r), [2018, 2020, 2022, 2023])
}

/* Gap years do not break adjacency: neighbours are adjacent observations. */
{
  const r = plausibilityGate('AAA', series([[2012, 20], [2016, 45], [2021, 21]]))
  assert.deepEqual(reasons(r), ['2016:spike'])
}

/* A lone value has nothing to jump from and stays if it clears the floor. */
{
  const r = plausibilityGate('AAA', series([[2010, 15.6]]))
  assert.deepEqual(reasons(r), [])
}

/* End to end: derive, prefer the LFS, gate, emit the latest surviving year, log drops. */
const header =
  'DATAFLOW,REF_AREA,FREQ,MEASURE,SEX,AGE,DUR,TIME_PERIOD,OBS_VALUE,OBS_STATUS,UNIT_MEASURE_TYPE,UNIT_MEASURE,UNIT_MULT,SOURCE,NOTE_SOURCE,NOTE_INDICATOR,NOTE_CLASSIF,DECIMALS,UPPER_BOUND,LOWER_BOUND'
const row = (iso3: string, dur: string, year: number, value: number | '', source: string, status = '', age = 'AGE_YTHADULT_YGE15', sex = 'SEX_T') =>
  `F,${iso3},A,UNE_TUNE_NB,${sex},${age},${dur},${year},${value},${status},NB,PS,3,"${source}",,,,1,,`
const BRA_HS = 'HS - Pesquisa Nacional por Amostra de Domicílios Contínua'
const csv = [
  header,
  // Brazil: a household survey only, two years, no unknown duration.
  row('BRA', 'DUR_AGGREGATE_TOTAL', 2024, 7451.627, BRA_HS),
  row('BRA', 'DUR_AGGREGATE_MGE12', 2024, 2417.866, BRA_HS),
  row('BRA', 'DUR_AGGREGATE_TOTAL', 2025, 6345.526, BRA_HS),
  row('BRA', 'DUR_AGGREGATE_MGE12', 2025, 1918.924, BRA_HS),
  // Chile: unknown duration is removed from the denominator; an HS row in the same year loses to the LFS.
  row('CHL', 'DUR_AGGREGATE_TOTAL', 2025, 100, 'LFS - Encuesta Nacional de Empleo', 'U'),
  row('CHL', 'DUR_AGGREGATE_X', 2025, 20, 'LFS - Encuesta Nacional de Empleo', 'U'),
  row('CHL', 'DUR_AGGREGATE_MGE12', 2025, 16, 'LFS - Encuesta Nacional de Empleo', 'U'),
  row('CHL', 'DUR_AGGREGATE_TOTAL', 2025, 100, 'HS - Some household survey'),
  row('CHL', 'DUR_AGGREGATE_MGE12', 2025, 90, 'HS - Some household survey'),
  // Other ages and sexes are ignored.
  row('CHL', 'DUR_AGGREGATE_MGE12', 2025, 99, 'LFS - Encuesta Nacional de Empleo', '', 'AGE_YTHADULT_Y15-24'),
  row('CHL', 'DUR_AGGREGATE_MGE12', 2025, 99, 'LFS - Encuesta Nacional de Empleo', '', 'AGE_YTHADULT_YGE15', 'SEX_F'),
  // Korea: every year under the floor, so it is held, not emitted.
  row('KOR', 'DUR_AGGREGATE_TOTAL', 2025, 800, 'LFS - Economically Active Population Survey'),
  row('KOR', 'DUR_AGGREGATE_MGE12', 2025, 4, 'LFS - Economically Active Population Survey'),
  // A country outside the benchmark.
  row('ZZZ', 'DUR_AGGREGATE_TOTAL', 2025, 10, LFS),
  row('ZZZ', 'DUR_AGGREGATE_MGE12', 2025, 5, LFS),
  // Missing the 12-month row: no share.
  row('USA', 'DUR_AGGREGATE_TOTAL', 2025, 10, 'LFS - Current Population Survey'),
  row('USA', 'DUR_AGGREGATE_MGE12', 2025, '', 'LFS - Current Population Survey'),
].join('\n')

const result = parseIlostatLongTermUnemployment(csv, '2026-10-01T00:00:00.000Z', 'fixture://ilostat')
assert.equal(result.adapterId, 'ilostat-une-tune-sex-age-dur-long-term-share')
assert.deepEqual(result.availableCountries, ['BRA', 'CHL', 'KOR'])
assert.deepEqual(result.emittedCountries, ['BRA', 'CHL'])
assert.deepEqual(result.heldCountries, ['KOR'])
assert.deepEqual(result.unmappedLabels, ['ZZZ'])
assert.deepEqual(result.dropped, [
  { iso3: 'KOR', year: 2025, value: 0.5, source: 'LFS - Economically Active Population Survey', reason: 'below_floor' },
])
const bra = result.observations.find((o) => o.iso3 === 'BRA')!
assert.equal(bra.indicatorId, 'long_term_unemployment_share')
assert.equal(bra.year, 2025)
assert.equal(bra.value, 30.2)
assert.equal(bra.sourceTier, 'international_organization')
assert.match(bra.note ?? '', /PNAD|Domicílios Contínua/)
assert.match(bra.sourceUrl ?? '', /\/BRA\.A\.\.SEX_T\.\.\?startPeriod=2010$/)
const chl = result.observations.find((o) => o.iso3 === 'CHL')!
assert.equal(chl.value, 20)
assert.match(chl.note ?? '', /survey: LFS - Encuesta Nacional de Empleo/)
assert.match(chl.note ?? '', /duration not stated: 20% of unemployed/)
assert.match(chl.note ?? '', /flagged unreliable by ILO/)

console.log('ILOSTAT adapter validated: share derivation, survey preference and the plausibility gate.')
