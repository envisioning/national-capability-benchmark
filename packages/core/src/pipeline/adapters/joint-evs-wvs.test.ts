import assert from 'node:assert/strict'
import { CHECKS, CHECK_PREFIX, INDICATORS, JOINT_EVS_WVS_PUBLISHER } from '../../model/index.js'
import { JOINT_EVS_WVS_ITEMS, parseJointEvsWvs, parseJointEvsWvsFieldworkYears } from './joint-evs-wvs.js'

/* Lines copied from `pdftotext -layout` of the pinned v5.0.0 results PDF,
 * with the page breaks and repeated headers the real text carries. */
const text = `
year- Year survey

                                                           Year survey
                         TOTAL
                                  2017     2018     2019      2020       2021     2022     2023
Brazil                    1,762        -    100.0        -          -         -        -        -
Germany EVS               2,178    100.0        -        -          -         -        -        -
Germany WVS               1,528        -    100.0        -          -         -        -        -
India                     1,692        -        -        -          -         -        -    100.0

                                                                                                    Page 3 of 692
                                          Joint EVS/WVS 2017-2022 Dataset Results by Country      2024-06-30
                                                 Version 5-0-0 - Data weighted by 'gwght

                                                        Year survey
                   TOTAL
                               2017     2018     2019      2020       2021     2022     2023
Vietnam                1,200        -        -        -      100.0         -        -        -
TOTAL              (156,939)   23.4%    41.6%     6.9%      15.3%      4.6%     7.0%     1.1%

A173- How much freedom of choice and control

                                                                               How much freedom of choice and control
                    TOTAL None at                                                                          A great Don´t   No Missing:    Base
                                       2         3          4         5      6      7       8        9                                            Mean Std Dev.
                             all                                                                            deal    know answer Other     mean
Bosnia and           (1,735)     1.9       0.9       2.8        2.1    9.9     7.8   12.1    18.1      9.8     34.4    0.1   0.1      -   (1,731)    7.8    2.3
Herzegovina
Brazil               (1,762)     3.8       1.0       1.8      2.1     16.5    7.3    10.9    11.4    5.1    37.6     1.9    0.5       -   (1,719)      7.5   2.5
Germany EVS          (2,178)     1.0       0.5       2.4      3.4     13.3    9.2    19.9    23.8    9.9    14.5     1.8    0.3       -   (2,132)      7.2   1.9
Germany WVS          (1,528)     0.1       0.9       1.9      3.8     15.5   10.5    20.4    25.7    8.1    12.3     0.7    0.1       -   (1,515)      7.1   1.8
India                (1,692)     4.5       3.5       4.1      5.4      8.0    7.1    13.5    15.0   10.8    27.4     0.7      -       -   (1,681)      7.2   2.7

                                                                                                                                             Page 133 of 692
                                                    Joint EVS/WVS 2017-2022 Dataset Results by Country                                            2024-06-30
                                                           Version 5-0-0 - Data weighted by 'gwght

                                                                         How much freedom of choice and control
                  TOTAL None at                                                                         A great Don´t       No Missing: Base
                                     2       3       4        5        6        7        8        9                                                   Mean Std Dev.
                            all                                                                          deal    know answer Other mean
Netherlands WVS    (2,145)      0.5    0.6     2.3     2.7      6.7     12.0     28.4     29.4      7.4      3.2     3.8       0.4       2.7 (1,999)     7.1    1.5
Vietnam            (1,200)      1.3    0.5     0.2     0.3      5.2      7.5     16.8     27.8     12.0     28.3       -         -         - (1,200)     8.1    1.8
                 (156,939)      2.4    1.4     2.7     3.9     12.0     10.4     16.3     20.5      9.8     19.4     0.8 0.3 (434) 0.1 (106)(155,075)    7.2    2.2
(N)
                           (3,734) (2,229) (4,238) (6,190) (18,788) (16,370) (25,628) (32,111) (15,412) (30,376) (1,324)

A027- Important child qualities: good manners

                                                    Important child qualities: good manners
                         TOTAL
                                  Not mentioned   Mentioned       Don´t know         No answer   Missing: Other
Brazil                    1,762          27.0          73.0                  -               -              -
TOTAL              (156,939)        83.9%           14.4%             0.7%                0.8%             0.1%

A080_01- Member: Belong to humanitarian or charitable organization

                                               Member: Belong to humanitarian or charitable organization
                         TOTAL
                                  Not mentioned    Mentioned        Don´t know          No answer       Missing: Other
Brazil                    1,762          88.1             9.7               2.1                0.2                 -
Germany EVS               2,178          85.3            12.1               0.6                2.0                 -
Germany WVS               1,528          86.0            13.8               0.1                0.1                 -
India                     1,692          64.4            29.4               6.2                  -                 -

                                                                                                                         Page 175 of 692
                                        Joint EVS/WVS 2017-2022 Dataset Results by Country                               2024-06-30
                                               Version 5-0-0 - Data weighted by 'gwght

                                            Member: Belong to humanitarian or charitable organization
                   TOTAL
                               Not mentioned    Mentioned        Don´t know          No answer       Missing: Other
Vietnam                1,200          90.6             9.4                 -                  -                 -
TOTAL              (156,939)        83.9%           14.4%             0.7%                0.8%             0.1%

A165- Most people can be trusted

                                                                 Most people can be trusted
                         TOTAL     Most people can   Can´t be too
                                                                        Don´t know          No answer   Missing: Other
                                     be trusted        careful
Brazil                    1,762             5.3            94.0                0.2                0.5             -
Germany EVS               2,178            44.6            53.6                1.6                0.2             -
Germany WVS               1,528            41.6            57.1                1.0                0.3             -
Vietnam                   1,200            27.0            73.0                  -                  -             -
TOTAL              (156,939)        24.8%           73.2%             1.4%                0.6%             0.1%

E069_17- Confidence: Justice System/Courts

                                                             Confidence: Justice System/Courts
                         TOTAL                               Not very                                      Missing:
                                  A great deal Quite a lot              None at all Don´t know No answer
                                                              much                                          Other
Brazil                    1,762         11.8         38.5        22.9         23.1         3.4       0.2          -
Germany EVS               2,178         11.3         49.3        29.0          6.6         3.3       0.5          -
Germany WVS               1,528         19.8         52.5        20.9          3.3         3.1       0.3          -
India                     1,692         39.7         33.4        15.9          9.0         1.9         -          -

                                                                                                                   Page 294 of 692
                                                   Joint EVS/WVS 2017-2022 Dataset Results by Country                      2024-06-30
                                                          Version 5-0-0 - Data weighted by 'gwght

                                                             Confidence: Justice System/Courts
                   TOTAL                               Not very                                      Missing:
                            A great deal Quite a lot              None at all Don´t know No answer
                                                        much                                          Other
Vietnam                1,200         27.7         63.1         6.3          0.8          2.1        -          -
TOTAL              (155,739)       14.1%        38.2%       29.7%        14.9%         2.5%     0.4%       0.1%

G007_34_B- Trust: People you meet for the first time (B)

                                                              Trust: People you meet for the first time (B)
                         TOTAL      Trust           Trust     Do not trust Do not trust at
                                                                                               Don´t know     No answer   Missing: Other
                                  completely      somewhat    very much          all
Brazil                    1,762         2.5            20.2         30.5           44.9                1.7         0.2              -
Canada                    4,018         2.4            47.1         41.1             9.4                  -          -              -
Germany EVS               2,178         1.0            27.1         49.1           17.2                5.0         0.6              -
Germany WVS               1,528         0.4            33.6         47.3           15.6                2.3         0.9              -
Great Britain EVS         1,794         2.2            52.8         32.2           12.3                0.5           -              -
Great Britain WVS         2,609         2.1            50.7         37.0             9.5               0.5         0.1            0.1
India                     1,692         9.5            23.9         33.4           31.8                1.3           -              -
Japan                     1,353         0.1            10.3         49.0           21.4               17.7         1.5              -

                                                                                                                                    Page 219 of 692
                                            Joint EVS/WVS 2017-2022 Dataset Results by Country                                          2024-06-30
                                                   Version 5-0-0 - Data weighted by 'gwght



                                                           Trust: People you meet for the first time (B)
                   TOTAL         Trust           Trust     Do not trust Do not trust at
                                                                                            Don´t know     No answer   Missing: Other
                               completely      somewhat    very much          all
United States          2,596         1.1            38.3         42.2           17.7                   -         0.6             -
Vietnam                1,200         0.8            30.1         50.3           18.8                   -           -             -
TOTAL              (156,939)        2.7%           25.0%       42.4%         28.2%            1.4%      0.3%        0.1%
`

const years = parseJointEvsWvsFieldworkYears(text)
assert.equal(years.get('Brazil'), 2018)
assert.equal(years.get('Germany EVS'), 2017)
assert.equal(years.get('India'), 2023)
assert.equal(years.get('Vietnam'), 2020, 'the year table continues across a page break')

const result = parseJointEvsWvs(text, '2026-10-01T00:00:00.000Z', 'fixture://evs')
const values = (id: string) =>
  result.observations.filter((o) => o.indicatorId === id).map((o) => [o.iso3, o.value])

/* A165 keeps the note and values D64 published, so a refetch restates nothing. */
assert.deepEqual(values('interpersonal_trust'), [
  ['BRA', 5.3],
  ['VNM', 27],
])
assert.equal(
  result.observations.find((o) => o.indicatorId === 'interpersonal_trust')?.note,
  'A165; Joint EVS/WVS v5.0.0 results table; publisher-weighted by gwght; published sample size 1762. Countries with separate EVS and WVS rows are held until pooled microdata are harmonised.',
)

/* A173 stores the published mean, read across the page break, never a sum of categories. */
assert.deepEqual(values('perceived_control'), [
  ['BRA', 7.5],
  ['IND', 7.2],
  ['NLD', 7.1],
  ['VNM', 8.1],
])
const control = result.observations.find((o) => o.indicatorId === 'perceived_control' && o.iso3 === 'BRA')
assert.equal(
  control?.note,
  'A173; Joint EVS/WVS v5.0.0 results table; publisher-weighted by gwght; published mean on the 1-10 scale over 1719 valid answers; published sample size 1762; fieldwork 2018. Countries with separate EVS and WVS rows are held until pooled microdata are harmonised.',
)
assert.equal(control?.year, 2022, 'the release year, as for A165')
assert.equal(control?.sourceUrl, 'fixture://evs')

/* A080_01 stores the "Mentioned" column, the second percentage, not "Not mentioned". */
assert.deepEqual(values('civic_participation'), [
  ['BRA', 9.7],
  ['IND', 29.4],
  ['VNM', 9.4],
])
assert.match(
  result.observations.find((o) => o.indicatorId === 'civic_participation' && o.iso3 === 'IND')?.note ?? '',
  /^A080_01; .*published share mentioned, .*; published sample size 1692; fieldwork 2023\./,
)

/* E069_17 is a check: it stores the published "a great deal" share under the
 * check prefix, quotes the other published shares, and never sums them. D132. */
const courtId = `${CHECK_PREFIX}institutional_trust`
assert.deepEqual(values(courtId), [
  ['BRA', 11.8],
  ['IND', 39.7],
  ['VNM', 27.7],
])
assert.equal(
  result.observations.find((o) => o.indicatorId === courtId && o.iso3 === 'BRA')?.note,
  "E069_17; Joint EVS/WVS v5.0.0 results table; publisher-weighted by gwght; published share answering a great deal of confidence in the justice system and courts, over all respondents including don't know and no answer; the other published shares are quite a lot 38.5, not very much 22.9, none at all 23.1, don't know 3.4, no answer 0.2; published sample size 1762; fieldwork 2018. Countries with separate EVS and WVS rows are held until pooled microdata are harmonised.",
)
assert.match(
  result.observations.find((o) => o.indicatorId === courtId && o.iso3 === 'IND')?.note ?? '',
  /no answer 0\.0; published sample size 1692; fieldwork 2023\./,
  'an empty cell is printed as zero',
)
assert.deepEqual(result.coverageByIndicator[courtId]?.heldCountries, ['DEU'])
assert.ok(!INDICATORS.some((i) => i.id === courtId), 'the court confidence row is never a scored indicator')

/* The check the adapter emits is declared in checks.ts as an adapter check on this release. */
const courtCheck = CHECKS.find((c) => c.id === 'institutional_trust')
assert.equal(courtCheck?.ingest, 'adapter')
assert.equal(courtCheck?.dimension, 'trust')
assert.equal(courtCheck?.pinned?.variable, 'E069_17')
assert.equal(courtCheck?.source.publisher, JOINT_EVS_WVS_PUBLISHER)
assert.equal(INDICATORS.find((i) => i.id === 'institutional_trust')?.ingest, 'gap', 'the gap stays open')

/* G007_34_B is the one summed value: trust completely plus trust somewhat, held
 * at the printed resolution, read across the page break, with both addends and
 * every other published share quoted in the note. D140. */
const strangersId = 'willingness_to_cooperate_strangers'
assert.deepEqual(values(strangersId), [
  ['BRA', 22.7],
  ['CAN', 49.5],
  ['IND', 33.4],
  ['JPN', 10.4],
  ['USA', 39.4],
  ['VNM', 30.9],
])
assert.equal(
  result.observations.find((o) => o.indicatorId === strangersId && o.iso3 === 'BRA')?.note,
  "G007_34_B; Joint EVS/WVS v5.0.0 results table; publisher-weighted by gwght; sum of the two published shares trusting people met for the first time, over all respondents including don't know and no answer (D140): trust completely 2.5 plus trust somewhat 20.2; the other published shares are do not trust very much 30.5, do not trust at all 44.9, don't know 1.7, no answer 0.2; published sample size 1762; fieldwork 2018. Countries with separate EVS and WVS rows are held until pooled microdata are harmonised.",
)
assert.match(
  result.observations.find((o) => o.indicatorId === strangersId && o.iso3 === 'CAN')?.note ?? '',
  /don't know 0\.0, no answer 0\.0; published sample size 4018\./,
  'an empty cell is printed as zero',
)
assert.deepEqual(result.coverageByIndicator[strangersId]?.heldCountries, ['DEU', 'GBR'])
assert.equal(INDICATORS.find((i) => i.id === strangersId)?.source.series, 'G007_34_B', 'the first-time item only')

/* Countries with an EVS and a WVS row are held per item; one row alone is emitted. */
assert.deepEqual(result.coverageByIndicator.perceived_control?.heldCountries, ['DEU'])
assert.deepEqual(result.coverageByIndicator.civic_participation?.heldCountries, ['DEU'])
assert.deepEqual(result.coverageByIndicator.interpersonal_trust?.heldCountries, ['DEU'])
assert.deepEqual(result.heldCountries, ['DEU', 'GBR'])
assert.deepEqual(result.coverageByIndicator.perceived_control?.fieldworkYears, {
  BRA: 2018,
  IND: 2023,
  VNM: 2020,
})
assert.ok(result.unmappedLabels.includes('Bosnia and'), 'a wrapped label is reported, not guessed')
assert.ok(!result.observations.some((o) => o.indicatorId === 'perceived_control' && o.value === 7.2 && o.iso3 === 'DEU'))

/* Every registry row this adapter fills is one it reads, under the id the registry stores. */
const read = new Map(JOINT_EVS_WVS_ITEMS.map((item) => [item.variable, item.indicatorId]))
const wired = INDICATORS.filter((i) => i.ingest === 'adapter' && i.source.publisher === JOINT_EVS_WVS_PUBLISHER)
assert.deepEqual(wired.map((d) => d.id).sort(), [
  'civic_participation',
  'interpersonal_trust',
  'perceived_control',
  'willingness_to_cooperate_strangers',
])
for (const def of wired) assert.equal(read.get(def.source.series ?? ''), def.id, `adapter does not read ${def.id}`)

assert.throws(() => parseJointEvsWvs(text.replace('A173- How much', 'A999- How much')), /do not contain A173/)

console.log('Joint EVS/WVS adapter validated: A165 unchanged, A173 mean, A080_01 mentioned, E069_17 check, G007_34_B summed share, per-item hold rule.')
