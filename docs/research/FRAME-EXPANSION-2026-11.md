# Widening the frame again: who the D153 rule admits now

Status: desk study, 2026-11-02. Dataset 9.6.0 (commit `16849cbf`, D173), 125
countries. Nothing in the registry, the country list or the data has moved.
This memo applies the D153 rule to the current registry and reports who now
passes, who misses by one dimension, and what a rebase would do to the
guardrail and the factor test. The owner decides; a rebase is a new decision
entry and a major version (D47).

Read first: D153 and `docs/research/FRAME-EXPANSION.md` (the rule and its
first application at 8.3.0), D157 (zeros dropped), D159 (values over 15 years
old do not count), D167 and D171 (four Doing Business rows move to B-READY),
D172 (OECD tax fill), D173 (B-READY insolvency in Experimentation, zero as a
value), D117 and D118 (O1 and the guardrail).

## Summary

- **Ten economies now pass all nine dimensions.** Cameroon, Chad, Senegal,
  Sierra Leone, Togo, Liberia, the Central African Republic, Mauritania,
  Timor-Leste and Eswatini. 106 million people. Eight sit in the world's
  poorest income quartile and two (Mauritania, Eswatini) in the second.
- **What lifted them.** B-READY insolvency (D173) gave Experimentation its
  second row in seven of them: the five OAPI members (Cameroon, Chad, Senegal,
  Togo, the Central African Republic), Timor-Leste and Eswatini. The OECD tax
  fill (D172) gave Shared purpose its second row in Sierra Leone, Liberia,
  Mauritania and Chad. Chad needs both. Three of the seven pass Experimentation
  on a B-READY insolvency zero (Chad, the Central African Republic,
  Timor-Leste), the "no practice" value D173 keeps.
- **Twelve miss by exactly one dimension.** Shared purpose in eight (Saudi
  Arabia, Kuwait, Bahrain, Cambodia, Benin, South Sudan, West Bank and Gaza,
  Djibouti), Experimentation in two OAPI members B-READY has not reached
  (Niger, Gabon), Learning in Equatorial Guinea, Anticipation in Hong Kong.
- **Thirteen clear seven or fewer.** D159 and the loss of the Doing Business
  rows pushed six of them further out: Algeria, Somalia, Oman and Qatar fell
  from eight to seven, Syria from eight to three.
- **The guardrail rises.** Mean confidence against log GDP per capita moves
  from 0.414 to 0.456 (n 123 to 133) with all ten. Each country alone adds
  0.001 to 0.015. It is the same mechanism D153 recorded: poor countries
  carry fewer rows.
- **The factor test barely moves.** First-factor share 0.501 to 0.506 (chance
  95th 0.177 to 0.174), r with income 0.828 to 0.831, complete cases 115 to
  125.
- **O1 slips in Experimentation.** Its mean confidence falls from 0.409 to
  0.394, under 0.40 again one release after D173 lifted it over.
- **The rule also fails ten of the 125.** At 9.6.0 Cuba, Haiti, Venezuela,
  the United Arab Emirates, Denmark, Iran, Malawi, Sudan, Papua New Guinea
  and Trinidad and Tobago publish fewer than nine scores. D153 is an entry
  rule and says nothing about exit. A rebase on the rule has to say which it
  is.

## 1. Method

### Candidates

Every World Bank economy (217, aggregates removed) with `SP.POP.TOTL` of at
least one million in its latest year: 160. Outside the 125: 35, the same 35 as
at 8.3.0 (22 at eight dimensions, 13 at seven or fewer). Taiwan is not in the
World Bank API and stays out. Economies under a million stay out under D153.

### Counting

The rule the scorer applies at 9.6.0: a scored row (`isScored`: no gap, no
retired row, no condition, no check) counts when the country's latest value
is not older than 2011 (D159, reference year 2026), after D157 drops a zero on
a row flagged `zeroIsMissing`. A dimension publishes a score at
`MIN_INDICATORS_FOR_SCORE` (2) such rows. The registry has 35 scored rows; the
two GEM rows are `manual` and held at 16 countries (D125), so a candidate can
reach 33.

| Source | Rows | How the candidate coverage was taken |
| --- | --- | --- |
| World Bank | 21 | Every series fetched for every economy through the v2 API, `country/all`, 1990 to 2026, the registry's database id; zeros dropped where flagged; insolvency (`IC.BRE.BI.P3`) keeps its zeros (D173) |
| OECD GRS | fill | The `OECD_GRS_URL` request in `source-catalog.ts`, read directly, with the adapter's arithmetic (central `TAX_REV` less `T_2000`, % of GDP), only where the World Bank has no value from 2011 on and only for later years |
| ILOSTAT | 1 | `ilostatLtuUrl` for the 35 candidates, `deriveLtuSeries` and `plausibilityGate` from the adapter, D159 on the latest kept year |
| GitHub Innovation Graph | 1 | The pinned file at `054c7dbc`, 2025 Q1 to 2026 Q1, D145 gate at the published 6.7% |
| V-Dem v16, Joint EVS/WVS 5.0.0, OpenAlex | 2, 4, 1 | Unchanged pinned releases and windows, so the 8.3.0 coverage in `FRAME-EXPANSION.md` carries; every one of the ten passers was then fetched through the adapters themselves (section 4) |
| UNCTAD, Atlas | 2 | Counted present for every candidate, as at 8.3.0; confirmed for the ten passers by running both adapters |

**Validation.** The same counting reproduces `observedIndicators` for all
1,125 cells of the 125 in the 9.6.0 `data/out/index.json` with no mismatch.

### Rescore

For the effect estimates the scorer ran offline in a scratch worktree at
`16849cbf`, with the ten passers appended to `countries.ts` and their M49
codes to `UNCTAD_M49`. Their observations came from the World Bank fetch
above, the GRS fill, and the V-Dem, ILOSTAT, UNCTAD, OpenAlex, GitHub and
Atlas adapters run on the extended list; the 125 kept their committed
observations. `scoreAll` and `runDiagnostics` then ran at reference year
2026 with no panel. The same run without the ten reproduces the published
9.6.0 figures exactly: guardrail 0.414 (n 123), first-factor share 0.501 over
115 complete cases, r with income 0.828.

## 2. Dimensions cleared

Per dimension: observed rows in registry order (anticipation, agency,
coordination, trust, learning, experimentation, adaptability, building,
shared purpose). Quartile: world income quartile of GDP per capita (PPP,
constant 2021 dollars, latest year) across the 154 economies of a million or
more with a figure; cuts at 5,901, 16,648 and 41,272. WB: World Bank income
group. 8.3.0: dimensions cleared in `FRAME-EXPANSION.md`.

| ISO3 | Country | Pop. (m) | Quartile | WB | Per dimension | Dims | 8.3.0 | Short of two rows |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | --- |
| CMR | Cameroon | 29.9 | Q1 | LMC | 223332442 | 9 | 8 | none |
| TCD | Chad | 21.0 | Q1 | LIC | 233332422 | 9 | 7 | none |
| SEN | Senegal | 18.9 | Q1 | LMC | 233332442 | 9 | 8 | none |
| SLE | Sierra Leone | 8.8 | Q1 | LIC | 233334442 | 9 | 8 | none |
| TGO | Togo | 8.6 | Q1 | LMC | 233332442 | 9 | 8 | none |
| LBR | Liberia | 5.7 | Q1 | LIC | 222234432 | 9 | 8 | none |
| CAF | Central African Republic | 5.5 | Q1 | LIC | 232332332 | 9 | 8 | none |
| MRT | Mauritania | 5.3 | Q2 | LMC | 222232332 | 9 | 8 | none |
| TLS | Timor-Leste | 1.4 | Q1 | LMC | 233332432 | 9 | 8 | none |
| SWZ | Eswatini | 1.3 | Q2 | LMC | 233332442 | 9 | 8 | none |
| SAU | Saudi Arabia | 37.0 | Q4 | HIC | 222234331 | 8 | 8 | shared purpose |
| NER | Niger | 27.9 | Q1 | LIC | 222231432 | 8 | 8 | experimentation |
| KHM | Cambodia | 17.8 | Q2 | LMC | 233335441 | 8 | 8 | shared purpose |
| BEN | Benin | 14.8 | Q1 | LMC | 233332341 | 8 | 8 | shared purpose |
| SSD | South Sudan | 12.2 | n/a | LIC | 233332331 | 8 | 7 | shared purpose |
| HKG | Hong Kong SAR | 7.5 | Q4 | HIC | 042534432 | 8 | 7 | anticipation |
| PSE | West Bank and Gaza | 5.4 | Q1 | LMC | 232232431 | 8 | 7 | shared purpose |
| KWT | Kuwait | 4.9 | Q4 | HIC | 222234330 | 8 | 8 | shared purpose |
| GAB | Gabon | 2.6 | Q3 | UMC | 222231432 | 8 | 8 | experimentation |
| GNQ | Equatorial Guinea | 1.9 | Q2 | UMC | 222312322 | 8 | 7 | learning |
| BHR | Bahrain | 1.6 | Q4 | HIC | 232335341 | 8 | 8 | shared purpose |
| DJI | Djibouti | 1.2 | Q2 | LMC | 222224421 | 8 | 8 | shared purpose |
| DZA | Algeria | 47.4 | Q2 | UMC | 222124431 | 7 | 8 | trust, shared purpose |
| AFG | Afghanistan | 43.8 | Q1 | LIC | 222231431 | 7 | 7 | experimentation, shared purpose |
| SOM | Somalia | 19.7 | Q1 | LIC | 222222401 | 7 | 8 | building, shared purpose |
| OMN | Oman | 5.5 | Q3 | HIC | 222124330 | 7 | 8 | trust, shared purpose |
| QAT | Qatar | 3.0 | Q4 | HIC | 221233431 | 7 | 8 | coordination, shared purpose |
| YEM | Yemen | 41.8 | n/a | LIC | 211234321 | 6 | 7 | agency, coordination, shared purpose |
| LBY | Libya | 7.5 | Q2 | UMC | 222311331 | 6 | 7 | learning, experimentation, shared purpose |
| TKM | Turkmenistan | 7.6 | Q3 | UMC | 213311310 | 4 | 5 | five |
| SYR | Syria | 25.6 | Q1 | LIC | 211114311 | 3 | 8 | six |
| PRI | Puerto Rico | 3.2 | Q4 | HIC | 130211311 | 3 | 4 | six |
| XKX | Kosovo | 1.6 | Q2 | UMC | 121121211 | 3 | 6 | six |
| PRK | North Korea | 26.6 | n/a | LIC | 101112300 | 2 | 1 | seven |
| ERI | Eritrea | 3.6 | n/a | LIC | 111110300 | 1 | 5 | eight |

Totals: 10 at nine, 12 at eight, 5 at seven, 8 at six or fewer.

## 3. What moved since 8.3.0

### The ten that pass

| ISO3 | Lifted by | Dimension | Rows that carry it |
| --- | --- | --- | --- |
| CMR | insolvency (D173) | experimentation | GitHub, insolvency 76.0 |
| SEN | insolvency | experimentation | GitHub, insolvency 61.5 |
| TGO | insolvency | experimentation | GitHub, insolvency 47.5 |
| SWZ | insolvency | experimentation | GitHub, insolvency 41.0 |
| CAF | insolvency | experimentation | GitHub, insolvency 0 |
| TLS | insolvency | experimentation | GitHub, insolvency 0 |
| TCD | insolvency and GRS fill (D172) | experimentation, shared purpose | GitHub, insolvency 0; GRS 2024 and Gini 2022 |
| SLE | GRS fill | shared purpose | GRS 2024, Gini 2018 |
| LBR | GRS fill | shared purpose | GRS 2024, Gini 2016 |
| MRT | GRS fill | shared purpose | GRS 2024, Gini 2019 |

Without insolvency seven of the ten stay at eight; without the GRS fill four
stay at eight. The four B-READY rows that replaced Doing Business (D167,
D171) lifted nobody, because the Doing Business row each replaced counted at
8.3.0. They do hold three passes: without them Cameroon (Agency), Chad
(Building) and the Central African Republic (Coordination) drop to one row
there. B-READY's 2025 round reached eight of the ten; Liberia and Mauritania
lost the four rows with Doing Business and pass on other rows.

Three passes rest on a zero. Chad, the Central African Republic and
Timor-Leste publish 0 on `IC.BRE.BI.P3`: no liquidation and no reorganisation
closed in three years. D173 holds that 0 is a value, so they pass by the rule
as written, and their Experimentation score is 0 to 1 out of 100. Sierra
Leone also reads 0 there but passes Experimentation on its IP office rows.

### The twelve that miss by one

- **Shared purpose, eight.** Saudi Arabia, Bahrain and Cambodia have a tax
  ratio and no Gini. Benin, South Sudan, West Bank and Gaza and Djibouti have
  a Gini and no tax ratio, and none of them is in the GRS dataset the fill
  reads. Kuwait has neither: its last World Bank tax value is 1998, which
  D159 sets aside, and GRS does not carry it. No Gulf state is in the GRS
  dataflow `OECD_GRS_URL` names, so D172 cannot reach the Gulf. The Joint
  EVS/WVS civic participation row is absent for all eight.
- **Experimentation, two.** Niger and Gabon are OAPI members (no national IP
  office series) outside B-READY's 2025 round, so GitHub is their only row.
  B-READY's next round would bring both in if it reaches them.
- **Learning, one.** Equatorial Guinea has firm training only: no Human
  Capital Index, and OpenAlex has no Equatorial Guinea rows in its window.
- **Anticipation, one.** Hong Kong: the World Bank publishes neither
  scientific articles nor the Statistical Performance Index for it. No
  adapter covers it.

### Who fell back

D159 and the end of the Doing Business rows took six candidates further out.
Algeria and Oman lost Trust: contract enforcement left with Doing Business,
B-READY has not reached them, and Algeria's bribery figure is from 2007.
Qatar lost Coordination the same way (time to export gone, no budget row).
Somalia lost Building (manufacturing last observed 1990). Syria's enterprise
survey rows are from 2009 and 2010 and its other gaps remain, so it falls
from eight to three. Kosovo (six to three) and Eritrea (five to one) fell
for the same two causes.

### Nothing else moved

The adapters cover the same candidates as at 8.3.0. GitHub holds Hong Kong
(4.5% stock growth), Turkmenistan and Eritrea. ILOSTAT's gate leaves the
candidate set as it was, except that Yemen's last kept year (2010) is now too
old. Joint EVS/WVS still reaches only Hong Kong, Libya and Puerto Rico among
the 35, and none of the ten passers.

## 4. What a rebase to 135 would do

Rescored offline as section 1 describes. "All ten" adds every passer; the
other rows add one country to the 125.

| Reading | 9.6.0, 125 | +10, 135 |
| --- | ---: | ---: |
| Guardrail: mean confidence r with log GDP | 0.414 (n 123) | 0.456 (n 133) |
| Guardrail slope, confidence per tenfold income | 0.054 | 0.057 |
| D137 first-factor share | 0.501 (chance 95th 0.177) | 0.506 (chance 95th 0.174) |
| D137 factor r with log GDP | 0.828 (n 115) | 0.831 (n 125) |
| Complete cases | 115 | 125 |
| Population covered, billions | about 7.70 | about 7.81 |
| Income quartile Q1 / Q2 / Q3 / Q4 (with an income figure) | 24 / 31 / 36 / 32 | 32 / 33 / 36 / 32 |

Mean confidence per dimension (O1 asks 0.40):

| Dimension | 9.6.0 | +10 |
| --- | ---: | ---: |
| Anticipation | 0.453 | 0.453 |
| Agency | 0.471 | 0.468 |
| Coordination | 0.361 | 0.363 |
| Trust | 0.392 | 0.386 |
| Learning | 0.523 | 0.524 |
| Experimentation | 0.409 | 0.394 |
| Adaptability | 0.580 | 0.578 |
| Building | 0.550 | 0.547 |
| Shared purpose | 0.329 | 0.322 |

Dimension r with log GDP moves by at most 0.015 (Building 0.614 to 0.629,
Experimentation 0.751 to 0.739).

Each country alone:

| ISO3 | Quartile | Mean confidence | Guardrail | Factor share | Factor r with income |
| --- | --- | ---: | ---: | ---: | ---: |
| CMR | Q1 | 0.417 | 0.417 | 0.500 | 0.829 |
| TCD | Q1 | 0.392 | 0.422 | 0.506 | 0.832 |
| SEN | Q1 | 0.436 | 0.415 | 0.499 | 0.821 |
| SLE | Q1 | 0.434 | 0.415 | 0.503 | 0.829 |
| TGO | Q1 | 0.427 | 0.416 | 0.501 | 0.825 |
| LBR | Q1 | 0.358 | 0.429 | 0.500 | 0.825 |
| CAF | Q1 | 0.383 | 0.425 | 0.506 | 0.833 |
| MRT | Q2 | 0.340 | 0.420 | 0.503 | 0.830 |
| TLS | Q1 | 0.398 | 0.420 | 0.499 | 0.830 |
| SWZ | Q2 | 0.433 | 0.415 | 0.501 | 0.829 |

Reading:

1. **The guardrail cost is the poorest countries' thin rows, as at D153.**
   Liberia and Mauritania are outside B-READY's round and miss all five
   B-READY rows; the Central African Republic and Chad have no IP office
   rows. A frame closer to the world inherits the world's
   measurement gradient. The figure would need re-baselining at the rebase,
   as D153 did with 0.526.
2. **The factor reading is stable.** The ten sit low on most dimensions at
   once, so they lengthen the shared factor's axis and the income line
   together. r stays inside the 0.8 band and its interval narrows slightly
   with 125 complete cases.
3. **O1.** Experimentation falls back under 0.40, because five of the ten
   reach it on exactly two of six rows. Trust and Shared purpose, already
   under, fall further.
4. **Not computed.** D138's residual tests and the D138 (c) release history
   were not read from the rescore; the precision figures in
   `FRAME-EXPANSION.md` section 1 apply (about 0.024 standard error on r at
   125).

## 5. What a rebase would cost

- **Registry.** Ten entries in `countries.ts` with the D153 shared reason,
  ten M49 codes in `UNCTAD_M49` (Cameroon 120, Chad 148, Senegal 686, Sierra
  Leone 694, Togo 768, Liberia 430, Central African Republic 140, Mauritania
  478, Timor-Leste 626, Eswatini 748), names in the Spanish and Portuguese
  lexicons, ILOSTAT facts in `COUNTRY_ROW_FACTS`. No Joint EVS/WVS alias is
  needed: none of the ten is in the release.
- **The UNCTAD pin fails.** The UNCTADstat bulk file was republished on
  2026-10-23 and no longer matches the 2026-06-24 checksum, so
  `pnpm bench unctad fetch` stops. 94 of the 125 values differ in the new
  file. A rebase ingest needs the pin reviewed and updated with its own
  decision entry first. This memo read the new file without the pin for the
  ten passers only.
- **Gates.** The GitHub gate median rises from 26.9% to 27.8% with the ten
  (threshold 6.7% to 7.0%); it holds the same three countries (Belarus,
  China, Cuba). ILOSTAT's plausibility gate holds the same six.
- **Version.** Dataset 10.0.0 under D47: every score restated.
- **Evidence grid and panel.** 80 new grid cells at eight per country; the
  panel prices at about $0.46 a country.
- **Layers.** Timor-Leste is Portuguese-speaking. D165 gives Portugal,
  Angola, Mozambique and Guinea-Bissau the `pt-PT` layer together; whether
  Timor-Leste joins them is a question for that entry. The six French-
  speaking passers have no lexicon to read through.
- **Fragility.** Several passes rest on one row at the floor that will age
  out under D159: Timor-Leste's Gini (2014) leaves at reference year 2030,
  Liberia's and Eswatini's (2016) at 2032. The Doing Business procedures row
  (2019) carries Agency for Liberia and Mauritania until 2035.

## 6. What the decision entry would have to say

1. Whether the D153 rule is re-applied at each registry change, or only at
   named rebases. The rule picked 72 at 8.3.0 and picks 10 more at 9.6.0 with
   no change in the rule.
2. Whether the rule is also an exit rule. Ten of the 125 fail it at 9.6.0.
3. Whether a pass that rests on an insolvency zero counts (Chad, the Central
   African Republic, Timor-Leste). D173 says a zero is a value; the frame
   rule did not exist in that light when D173 was written.
4. The guardrail re-baseline (0.414 to about 0.456) and O1 in
   Experimentation.
5. The UNCTAD pin, before any ingest.

## What could not be verified

- V-Dem, Joint EVS/WVS and OpenAlex coverage for the 25 candidates that do
  not pass is carried from the 8.3.0 memo, on the same pinned releases; it
  was not re-fetched for them. None of the near misses turns on those rows
  except Hong Kong (V-Dem present) and Equatorial Guinea (OpenAlex absent).
- UNCTAD and Atlas presence for the 25 is assumed, as at 8.3.0.
- The GRS coverage list is the current response of `OECD_GRS_URL`; the
  adapter's own checksum was not checked against it.
- B-READY's 2026 round was not in the API on 2026-11-02. If it lands
  before a rebase, the counts above change, most likely for Niger, Gabon,
  Liberia, Mauritania and the Gulf.

## Reproducing this

Scratch scripts are not committed. World Bank: `country/all`, 1990 to 2026,
per registry series. GRS: the `OECD_GRS_URL` CSV. ILOSTAT, GitHub, V-Dem,
UNCTAD (parse only), OpenAlex and Atlas: the adapters' own functions in a
worktree with the ten appended to `COUNTRIES`. The count reproduced every
published `observedIndicators` cell of the 125, and the rescore without the
ten reproduced the published guardrail and factor figures, before any
candidate was read. Data read 2026-11-02.
