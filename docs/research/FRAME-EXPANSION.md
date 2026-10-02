# Widening the frame: feasibility memo

Status: desk study, 2026-10-02. Dataset 8.2.0 on `main`, 53 countries. Nothing
in the registry, the country list or the data has moved. This memo asks
whether a wider country set is worth a rebase, which countries it could take
and what it costs. The owner decides; the decision entry it would need is in
section 5.

Read first: D47 (every country sets the frame, so a country added is a major
version and a full restatement), D51 (the Latin American completion, the only
rebase so far that added countries by rule), D137 and D138 (whose overturn
clauses name a wider set), D64 (the Joint EVS/WVS hold rule), D117 and D118
(objectives and guardrail; a row is never chosen for its income correlation),
D125, D135 and D148. `docs/RESEARCH-ROADMAP.md` keeps country-set changes out
of source work: this memo is the separate project it names.

## Summary

- **What the statistics need.** At 50 complete cases the D137 factor's r with
  income (0.845) carries a standard error of about 0.04, and the D138 (b)
  margin (shape share 0.276 against a null 95th percentile of 0.233, so 0.043)
  carries one of 0.030 to 0.035: the margin sits about 1.3 standard errors
  above the line. Both standard errors reach 0.025, a 95% interval of about
  plus or minus 0.05, at roughly 120 complete cases, and about 0.02 at 150.
  Plus or minus 0.03 on r would need about 350 countries, which do not exist.
  "Within a few hundredths" is therefore reachable only as plus or minus 0.04
  to 0.05, and only with nearly every country that can be measured.
- **Who can be measured.** 107 economies of at least one million people are
  outside the 53. 72 of them clear `MIN_INDICATORS_FOR_SCORE` (2) in all nine
  dimensions on the current registry with no new adapter, 22 clear eight, 8
  clear seven and 5 clear six or fewer. Every one of the 72 has an income
  figure, so all 72 enter the complete cases.
- **Balance.** The 53 are rich and democratic for the world they sample: 3 of
  them sit in the poorest income quartile of the 160 countries of a million or
  more (13 would be proportional), and 36 of 53 are democracies (68%, against
  70 of 158, 44%, in the world). Every expansion set moves both mixes toward the world.
- **The guardrail breaks under every expansion, and the cause is the world's
  data, not the selection.** Mean confidence against log GDP per capita is
  0.27 today; it rises to 0.42, 0.50 and 0.53 for the three sets below, and the
  slope rises with it (0.029 to 0.042 to 0.048 confidence per tenfold income),
  so it is not only a wider income range. Across the whole universe of 154
  measurable countries it is 0.41. The driver is the Joint EVS/WVS release:
  its four scored items cover 35 of the 72 nine-dimension candidates and almost
  none of the poorest, and their presence correlates 0.37 with log GDP in the
  widened set against 0.04 in the 53, which were partly chosen for having it.
  Industrial designs (0.36) is second. The 53 hold the guardrail low partly by
  selection.
- **O1 slips.** Trust (0.418 to 0.398) and Shared purpose (0.411 to 0.383)
  fall below 0.40 at the full set, because their social rows are EVS rows;
  Experimentation falls from 0.364 to 0.319, because GEM stays at 16 countries
  (D125) and the IP office rows thin out.
- **Recommendation.** One rebase to set C, every country of a million people
  or more that clears all nine dimensions: 53 plus 72, 125 countries, about
  122 complete cases, 7.70 billion people. It is the only set that brings
  D137 and D138 to the precision their overturn clauses ask for, and it is
  chosen by a rule rather than by a reason per country. Set B (+30, quartile
  quotas) is the fallback if the evidence grid and foresight register cannot
  absorb 72 countries. Do not do +15 first and more later: every rebase
  restates every number.

## 1. What the statistics need

### Published figures at 8.2.0

From `data/out/diagnostics.json`:

- D137: 51 complete cases (Cuba and Haiti dropped), first-factor share 0.496
  against chance 0.189 (95th 0.215); factor against log GDP per capita r 0.845
  (n 50, Venezuela has no income figure), r squared 0.715.
- D138: 50 complete cases. (a) residual share 0.286 against chance 95th 0.217.
  (b) shape share 0.276 against the random-dealing 95th 0.233, so the
  "differ" reading rests on a margin of 0.043; income-dealt peer distance
  1.523 against a 5th percentile of 1.471.

### Method

Two resampling schemes on the 50 countries with all nine scores and an income
figure, both re-running the D137 and D138 (b) arithmetic from
`pipeline/stats.ts` (`symmetricEigen`, `correlationMatrix`,
`firstFactorShareOf`, per-dimension least squares on log10 GDP, standardised
residuals, shape columns) on every draw:

- **Bootstrap:** draw n countries with replacement from the 50.
- **Gaussian:** fit a multivariate normal to the nine scores and log GDP of
  the 50 and draw n new rows. This avoids the duplicate rows a bootstrap
  produces at n above 50.

300 draws per n; the (b) null 95th percentile at each n is the mean of 20
random-dealing distributions of 300 shuffles. Run on 2026-10-02 against the
committed `data/out/index.json` and `diagnostics.json`. The arithmetic
reproduces the published figures on the 50 (share 0.471 on 50 countries with
an income figure against 0.496 published on 51; shape share 0.277 and null
95th 0.232 against 0.276 and 0.233).

### Results

Standard deviation across draws (Gaussian scheme; bootstrap in brackets where
run):

| Complete cases | Factor share | Factor r with income | 2.5th to 97.5th of r | (b) null 95th | (b) margin |
| ---: | ---: | ---: | --- | ---: | ---: |
| 50 (today) | 0.045 (0.034) | 0.040 (0.034) | 0.756 to 0.913 | 0.231 | 0.030 (0.035) |
| 65 (set A) | 0.037 | 0.037 | 0.760 to 0.898 | 0.216 | 0.028 |
| 80 (set B) | 0.034 | 0.034 | 0.774 to 0.905 | 0.207 | 0.026 |
| 100 | 0.031 | 0.029 | 0.790 to 0.895 | 0.197 | 0.024 |
| 122 (set C) | 0.027 (0.023) | 0.024 (0.020) | 0.795 to 0.889 | 0.190 | 0.021 (0.026) |
| 150 | 0.023 | 0.022 | 0.804 to 0.883 | 0.183 | 0.021 |

The analytic check agrees: Fisher's standard error of r, (1 - r^2) / sqrt(n -
3), is 0.042 at 50, 0.033 at 80 and 0.026 at 122.

Reading:

1. **D137.** At 50 countries the 95% interval of r spans 0.76 to 0.91, so the
   0.8 band that makes every surface say "looks like income" is inside the
   interval. At about 120 complete cases the interval is roughly 0.80 to 0.89
   and the band reading stops depending on which 50 countries happen to be
   loaded. D137's overturn clause (r "within a few hundredths", replacing the
   bands with an interval) is met at plus or minus 0.05 by set C and by no
   smaller set.
2. **D138 (b).** The margin's standard error falls from 0.030 to 0.035 today
   to 0.021 to 0.026 at 122. The null threshold itself falls as n grows (0.231
   to 0.190), because a chance first eigenvalue shrinks with more rows, so the
   same true shape share clears it by more. A same-sized resample of today's
   set would land below the line on the order of one time in ten; at 122 the
   margin would have to be wrong by about two standard errors to flip. Note
   that resampled shape shares run about 0.02 above the observed one (the
   usual upward bias of a leading eigenvalue in small samples), so the spread
   in the table is the usable figure and the resampled mean margin is not.
3. **What this cannot say.** Both schemes assume new countries look like the
   50. They will not: they are poorer and more autocratic (section 3). The
   income range widens (standard deviation of log10 GDP 0.405 today, 0.483 in
   set C, minimum 2,678 to 1,067 dollars), which on its own tends to raise r
   with income, so the D137 reading is more likely to strengthen than weaken.
   Whether (b) holds on the wider set is exactly what the rebase would test.
   The precision figures carry over; the levels do not.

D138 (c), the release-stability test, compares consecutive releases on the
same country set, so the rebase release starts its history again: the first
pair after the rebase is the next release on the new set.

## 2. Candidate pool

### Threshold

Every World Bank economy of at least one million people (`SP.POP.TOTL`,
latest year) outside the 53: 107 economies. One million because it is the
smallest size already in the frame (Estonia, 1.37 million), because the Growth
Lab's Atlas, which feeds a scored row, ranks only countries above the same
line (and a trade floor), and because below it the frame would be shaped by microstates: of the 57
economies under a million, 15 clear all nine dimensions (Iceland, Luxembourg,
Malta, Montenegro, Fiji and ten others, most of them small island states), and each would move the
Tukey fences as much as India does. Their inclusion is a separate question for
the decision entry.

Taiwan is not in the World Bank API, so it has no value on the 20 World Bank
rows and clears about two dimensions from V-Dem, EVS/WVS, OpenAlex, GitHub,
UNCTAD and Atlas. It is out of reach without a national-statistics adapter,
which would mix source tiers on every row.

### How coverage was counted

The rule the scorer applies: a scored row counts when the country has any
observation, of any year, and a dimension publishes a score at two or more
observed rows. There are 34 scored rows; the two GEM rows are `manual` and
held at 16 countries by D125, so a candidate can reach at most 32.

| Source | Rows | How the candidate coverage was taken |
| --- | --- | --- |
| World Bank | 20 | Every series fetched for every economy through the v2 API with the registry's `wbSourceId`, latest observed year kept |
| Joint EVS/WVS 2017-2022, release 5.0.0 | 4 | Country rows parsed from the pinned results PDF the adapter reads (`access.gesis.org/dbk/69549`); D64's hold applied, so a country with separate EVS and WVS rows has none |
| V-Dem v16 | 2 | Country list of V-Dem's Regimes of the World coding for 2024 to 2025 (Our World in Data's republication); both series exist for every V-Dem country |
| OpenAlex | 1 | The adapter's own grouped request (`openAlexRequests().denominator`), 200 countries with works in 2019 to 2021 |
| GitHub Innovation Graph | 1 | The pinned file at commit `054c7dbc`, 2025 Q1 to 2026 Q1 growth, D145 gate at today's 6.2% threshold |
| ILOSTAT | 1 | The adapter's own SDMX dataflow for all reference areas, derived and gated with `deriveLtuSeries` and `plausibilityGate` from `dist` |
| UNCTAD, Atlas | 2 | Not fetched. Both publish every reporting economy (Atlas through mirror trade); counted as present for all candidates |
| GEM | 2 | Held at 16 (D125); counted absent for every candidate |

**Validation.** The same counting reproduces `observedIndicators` for all 477
cells of the 53 in `data/out/index.json` with no mismatch, and the confidence
formula (`coverage x recency x source quality`, coverage over
`countedForCoverage`) reproduces every published cell confidence to within
0.001. The candidate figures below use the same code path.

### Row coverage

| Dimension | Row | 53 | 107 candidates | 72 nine-dimension candidates |
| --- | --- | ---: | ---: | ---: |
| anticipation | `sci_articles_per_million` | 53 | 106 | 72 |
| anticipation | `statistical_performance` | 52 | 102 | 72 |
| agency | `new_business_density` | 49 | 97 | 70 |
| agency | `business_start_days` | 52 | 105 | 72 |
| agency | `business_start_procedures` | 52 | 105 | 72 |
| agency | `perceived_control` | 37 | 38 | 35 |
| coordination | `time_to_export` | 52 | 103 | 72 |
| coordination | `budget_execution_fidelity` | 45 | 94 | 68 |
| coordination | `civil_society_strength` | 53 | 104 | 72 |
| trust | `contract_enforcement_days` | 52 | 105 | 72 |
| trust | `bribery_incidence` | 50 | 102 | 71 |
| trust | `court_compliance` | 53 | 104 | 72 |
| trust | `interpersonal_trust` | 37 | 38 | 35 |
| trust | `willingness_to_cooperate_strangers` | 37 | 38 | 35 |
| learning | `human_capital_index` | 50 | 96 | 71 |
| learning | `firm_training_incidence` | 50 | 102 | 71 |
| learning | `research_citation_impact` | 53 | 105 | 72 |
| experimentation | `resident_patents_per_million` | 53 | 84 | 68 |
| experimentation | `resident_trademarks_per_million` | 51 | 79 | 65 |
| experimentation | `resident_industrial_designs_per_million` | 50 | 70 | 58 |
| experimentation | `new_repositories_per_million` | 51 | 103 | 72 |
| experimentation | `early_stage_entrepreneurial_activity` | 16 | 0 | 0 |
| experimentation | `failure_tolerance` | 16 | 0 | 0 |
| adaptability | `unemployment_rate` | 53 | 106 | 72 |
| adaptability | `long_term_unemployment_share` | 44 | 86 | 66 |
| adaptability | `export_diversification` | 53 | 107 | 72 |
| adaptability | `new_export_products_rate` | 53 | 107 | 72 |
| building | `manufacturing_value_added` | 53 | 103 | 71 |
| building | `high_tech_exports_share` | 51 | 97 | 71 |
| building | `electricity_connection_speed` | 52 | 105 | 72 |
| building | `economic_complexity` | 52 | 93 | 71 |
| shared_purpose | `tax_revenue_gdp` | 48 | 87 | 71 |
| shared_purpose | `income_inequality` | 51 | 94 | 71 |
| shared_purpose | `civic_participation` | 37 | 38 | 35 |

The World Bank rows are near universal; the Doing Business rows (business
start days and procedures, time to export, contract enforcement, electricity
connection) are frozen at 2019 for every candidate, as they are for the 53.
The thin columns are the four EVS/WVS items (38 of 107), the three IP office
rows (70 to 84) and the long-term unemployment share (86).

### Dimensions cleared

| Dimensions at two or more rows | Candidates | Who |
| ---: | ---: | --- |
| 9 | 72 | Set C below |
| 8 | 22 | Experimentation missing in nine: seven francophone African members of OAPI, the regional IP office that files their patents and trademarks (Benin, Cameroon, Central African Republic, Gabon, Niger, Senegal, Togo), plus Eswatini and Timor-Leste. Shared purpose missing in 13, among them the five Gulf monarchies outside the 53 (Saudi Arabia, Kuwait and Bahrain have a tax ratio but no Gini, Qatar a Gini but no tax ratio, Oman neither), Algeria, Cambodia, Djibouti, Liberia, Mauritania, Sierra Leone, Somalia and Syria |
| 7 | 8 | Afghanistan, Chad, Equatorial Guinea, Hong Kong, Libya, South Sudan, West Bank and Gaza, Yemen |
| 6 or fewer | 5 | Eritrea, Kosovo, North Korea, Puerto Rico, Turkmenistan |

The eight-dimension group is structural, not a fetch failure: no current
source can add Experimentation for OAPI members, and the Gulf's Shared purpose
waits on a Gini or tax figure its governments do not publish.
Those countries would publish eight scores and stay out of every complete-case
test, so they add frame and pages without adding statistical power.

Seven candidates with both an EVS and a WVS row (Armenia, Czechia, Romania,
Russia, Serbia, Slovakia, Ukraine) lose all four EVS/WVS items to the D64
hold. Lifting the hold with a pooling rule would add 28 cells and lower the
guardrail slightly; it is its own decision.

### Every candidate

Population in millions. Quartile: world income quartile of log GDP per capita
(PPP, constant 2021 dollars) across the 160 economies of a million or more,
cuts at 5,995, 16,834 and 41,161. WB: World Bank income group. Regime: V-Dem
Regimes of the World, latest year. Rows: of the 32 reachable. Per dimension:
observed rows in registry order (anticipation, agency, coordination, trust,
learning, experimentation, adaptability, building, shared purpose). Conf: the
mean of the nine dimension confidences the scorer would compute today. Sets:
membership of A, B and C in section 3. Missing: scored rows without a value,
GEM left out because every candidate lacks it.

| ISO3 | Country | Pop. | Quartile | WB | Regime | Rows | Per dimension | Dims | Conf | Sets | Missing |
| --- | --- | ---: | --- | --- | --- | ---: | --- | ---: | ---: | --- | --- |
| PAK | Pakistan | 255.2 | Q1 | LMC | electoral aut. | 31 | 243534442 | 9 | 0.47 | ABC | tax |
| BGD | Bangladesh | 175.7 | Q2 | LMC | closed aut. | 32 | 243534443 | 9 | 0.48 | ABC | none |
| RUS | Russian Federation | 143.5 | Q4 | HIC | electoral aut. | 28 | 233334442 | 9 | 0.42 | ABC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| EGY | Egypt, Arab Rep. | 118.4 | Q3 | LMC | electoral aut. | 32 | 243534443 | 9 | 0.47 | ABC | none |
| COD | Congo, Dem. Rep. | 112.8 | Q1 | LIC | electoral aut. | 27 | 233333442 | 9 | 0.41 | ABC | EVS-A173, EVS-A165, EVS-G007, designs, EVS-A080 |
| IRN | Iran, Islamic Rep. | 92.4 | Q3 | UMC | electoral aut. | 28 | 242424433 | 9 | 0.38 | ABC | budget, bribery, training, ECI |
| TZA | Tanzania | 70.5 | Q1 | LMC | electoral aut. | 27 | 233333442 | 9 | 0.41 | ABC | EVS-A173, EVS-A165, EVS-G007, designs, EVS-A080 |
| ITA | Italy | 58.9 | Q4 | HIC | liberal dem. | 32 | 243534443 | 9 | 0.50 | AC | none |
| MMR | Myanmar | 54.9 | Q1 | LMC | closed aut. | 30 | 243532443 | 9 | 0.41 | ABC | patents, designs |
| SDN | Sudan | 51.7 | Q1 | LIC | closed aut. | 27 | 223334442 | 9 | 0.33 | ABC | newbiz, EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| UGA | Uganda | 51.4 | Q1 | LIC | electoral aut. | 28 | 233334442 | 9 | 0.43 | ABC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| IRQ | Iraq | 47.0 | Q2 | UMC | electoral aut. | 31 | 243534433 | 9 | 0.45 | ABC | hightech |
| AGO | Angola | 39.0 | Q2 | LMC | electoral aut. | 27 | 233333442 | 9 | 0.42 | ABC | EVS-A173, EVS-A165, EVS-G007, designs, EVS-A080 |
| UKR | Ukraine | 39.0 | Q2 | UMC | electoral aut. | 28 | 233334442 | 9 | 0.40 | ABC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| MAR | Morocco | 38.4 | Q2 | LMC | closed aut. | 32 | 243534443 | 9 | 0.47 | ABC | none |
| UZB | Uzbekistan | 37.1 | Q2 | LMC | electoral aut. | 31 | 243534343 | 9 | 0.48 | BC | ILO-LTU |
| MOZ | Mozambique | 35.6 | Q1 | LIC | electoral aut. | 28 | 233334442 | 9 | 0.43 | BC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| GHA | Ghana | 35.1 | Q2 | LMC | electoral dem. | 28 | 233334442 | 9 | 0.42 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| MDG | Madagascar | 32.7 | Q1 | LIC | closed aut. | 28 | 233334442 | 9 | 0.42 | BC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| CIV | Cote d'Ivoire | 32.7 | Q2 | LMC | electoral aut. | 26 | 233332442 | 9 | 0.39 | C | EVS-A173, EVS-A165, EVS-G007, trademarks, designs, EVS-A080 |
| NPL | Nepal | 29.6 | Q1 | LMC | electoral dem. | 28 | 233334442 | 9 | 0.41 | BC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| MLI | Mali | 25.2 | Q1 | LIC | closed aut. | 26 | 233332442 | 9 | 0.39 | BC | EVS-A173, EVS-A165, EVS-G007, trademarks, designs, EVS-A080 |
| BFA | Burkina Faso | 24.1 | Q1 | LIC | closed aut. | 27 | 233333442 | 9 | 0.41 | BC | EVS-A173, EVS-A165, EVS-G007, trademarks, EVS-A080 |
| MWI | Malawi | 22.2 | Q1 | LIC | electoral dem. | 27 | 233333442 | 9 | 0.38 | BC | EVS-A173, EVS-A165, EVS-G007, designs, EVS-A080 |
| ZMB | Zambia | 21.9 | Q1 | LMC | electoral aut. | 28 | 233334442 | 9 | 0.44 | BC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| LKA | Sri Lanka | 21.8 | Q2 | UMC | electoral dem. | 28 | 233334442 | 9 | 0.43 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| KAZ | Kazakhstan | 20.8 | Q3 | UMC | electoral aut. | 32 | 243534443 | 9 | 0.49 | BC | none |
| ROU | Romania | 19.0 | Q3 | HIC | electoral dem. | 28 | 233334442 | 9 | 0.44 | BC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| ZWE | Zimbabwe | 17.0 | Q1 | LMC | electoral aut. | 32 | 243534443 | 9 | 0.47 | BC | none |
| GIN | Guinea | 15.1 | Q1 | LMC | closed aut. | 25 | 233332342 | 9 | 0.35 | BC | EVS-A173, EVS-A165, EVS-G007, patents, designs, ILO-LTU, EVS-A080 |
| BDI | Burundi | 14.4 | Q1 | LIC | electoral aut. | 28 | 233334442 | 9 | 0.41 | BC | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| TUN | Tunisia | 12.3 | Q2 | LMC | electoral aut. | 31 | 243533443 | 9 | 0.46 | C | trademarks |
| BEL | Belgium | 11.9 | Q4 | HIC | liberal dem. | 26 | 233332442 | 9 | 0.42 | C | EVS-A173, EVS-A165, EVS-G007, trademarks, designs, EVS-A080 |
| JOR | Jordan | 11.5 | Q2 | UMC | closed aut. | 32 | 243534443 | 9 | 0.48 | C | none |
| CZE | Czechia | 10.9 | Q4 | HIC | liberal dem. | 28 | 233334442 | 9 | 0.44 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| TJK | Tajikistan | 10.8 | Q1 | LMC | electoral aut. | 31 | 243534343 | 9 | 0.46 | BC | ILO-LTU |
| PNG | Papua New Guinea | 10.8 | Q1 | LMC | electoral aut. | 27 | 233334342 | 9 | 0.39 | C | EVS-A173, EVS-A165, EVS-G007, ILO-LTU, EVS-A080 |
| GRC | Greece | 10.4 | Q3 | HIC | electoral dem. | 31 | 243533443 | 9 | 0.48 | BC | trademarks |
| AZE | Azerbaijan | 10.2 | Q3 | UMC | electoral aut. | 32 | 243534443 | 9 | 0.47 | BC | none |
| HUN | Hungary | 9.5 | Q4 | HIC | electoral aut. | 32 | 243534443 | 9 | 0.48 | C | none |
| AUT | Austria | 9.2 | Q4 | HIC | liberal dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| BLR | Belarus | 9.1 | Q3 | UMC | closed aut. | 32 | 243534443 | 9 | 0.46 | C | none |
| LAO | Lao PDR | 7.9 | Q2 | LMC | closed aut. | 27 | 233333442 | 9 | 0.41 | C | EVS-A173, EVS-A165, EVS-G007, designs, EVS-A080 |
| KGZ | Kyrgyz Republic | 7.3 | Q2 | LMC | electoral aut. | 32 | 243534443 | 9 | 0.50 | C | none |
| SRB | Serbia | 6.5 | Q3 | UMC | electoral aut. | 28 | 233334442 | 9 | 0.42 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| COG | Congo, Rep. | 6.5 | Q2 | LMC | electoral aut. | 25 | 233332342 | 9 | 0.36 | C | EVS-A173, EVS-A165, EVS-G007, trademarks, designs, ILO-LTU, EVS-A080 |
| BGR | Bulgaria | 6.4 | Q3 | HIC | electoral dem. | 31 | 243534433 | 9 | 0.48 | C | manuf |
| DNK | Denmark | 6.0 | Q4 | HIC | liberal dem. | 31 | 242534443 | 9 | 0.48 | C | budget |
| LBN | Lebanon | 5.8 | Q2 | LMC | electoral aut. | 30 | 233533443 | 9 | 0.42 | C | newbiz, designs |
| NOR | Norway | 5.6 | Q4 | HIC | liberal dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| SVK | Slovak Republic | 5.4 | Q3 | HIC | electoral dem. | 28 | 233334442 | 9 | 0.44 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| NZL | New Zealand | 5.3 | Q4 | HIC | liberal dem. | 30 | 242534442 | 9 | 0.46 | C | budget, Gini |
| GEO | Georgia | 3.9 | Q3 | UMC | electoral aut. | 32 | 243534443 | 9 | 0.50 | C | none |
| HRV | Croatia | 3.9 | Q4 | HIC | electoral dem. | 32 | 243534443 | 9 | 0.49 | C | none |
| MNG | Mongolia | 3.6 | Q3 | UMC | electoral dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| BIH | Bosnia and Herzegovina | 3.1 | Q3 | UMC | electoral aut. | 32 | 243534443 | 9 | 0.49 | C | none |
| NAM | Namibia | 3.1 | Q2 | LMC | electoral dem. | 28 | 233334442 | 9 | 0.42 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| ARM | Armenia | 3.1 | Q3 | UMC | electoral dem. | 28 | 233334442 | 9 | 0.44 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| LTU | Lithuania | 2.9 | Q4 | HIC | liberal dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| JAM | Jamaica | 2.8 | Q2 | UMC | electoral dem. | 28 | 233334442 | 9 | 0.43 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| GMB | Gambia, The | 2.8 | Q1 | LIC | electoral dem. | 26 | 233332442 | 9 | 0.40 | C | EVS-A173, EVS-A165, EVS-G007, patents, designs, EVS-A080 |
| BWA | Botswana | 2.6 | Q3 | UMC | electoral dem. | 28 | 233334442 | 9 | 0.42 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| LSO | Lesotho | 2.4 | Q1 | LMC | electoral dem. | 27 | 233333442 | 9 | 0.41 | C | EVS-A173, EVS-A165, EVS-G007, designs, EVS-A080 |
| MDA | Moldova | 2.4 | Q3 | UMC | electoral dem. | 28 | 233334442 | 9 | 0.44 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| ALB | Albania | 2.3 | Q3 | UMC | electoral aut. | 32 | 243534443 | 9 | 0.49 | C | none |
| GNB | Guinea-Bissau | 2.2 | Q1 | LIC | closed aut. | 26 | 233323442 | 9 | 0.37 | C | EVS-A173, EVS-A165, EVS-G007, HCI, patents, EVS-A080 |
| SVN | Slovenia | 2.1 | Q4 | HIC | electoral dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| LVA | Latvia | 1.8 | Q3 | HIC | liberal dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| MKD | North Macedonia | 1.8 | Q3 | UMC | electoral dem. | 32 | 243534443 | 9 | 0.49 | C | none |
| CYP | Cyprus | 1.4 | Q4 | HIC | liberal dem. | 32 | 243534443 | 9 | 0.50 | C | none |
| TTO | Trinidad and Tobago | 1.4 | Q3 | HIC | liberal dem. | 26 | 232334342 | 9 | 0.37 | C | EVS-A173, budget, EVS-A165, EVS-G007, ILO-LTU, EVS-A080 |
| MUS | Mauritius | 1.2 | Q3 | UMC | electoral dem. | 28 | 233334442 | 9 | 0.43 | C | EVS-A173, EVS-A165, EVS-G007, EVS-A080 |
| DZA | Algeria | 47.4 | Q2 | UMC | electoral aut. | 27 | 233334441 | 8 | 0.34 | - | EVS-A173, EVS-A165, EVS-G007, tax, EVS-A080 |
| SAU | Saudi Arabia | 37.0 | Q4 | HIC | closed aut. | 26 | 233334341 | 8 | 0.41 | - | EVS-A173, EVS-A165, EVS-G007, ILO-LTU, Gini, EVS-A080 |
| CMR | Cameroon | 29.9 | Q1 | LMC | electoral aut. | 24 | 223331442 | 8 | 0.38 | - | newbiz, EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, EVS-A080 |
| NER | Niger | 27.9 | Q1 | LIC | closed aut. | 25 | 233331442 | 8 | 0.39 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, EVS-A080 |
| SYR | Syrian Arab Republic | 25.6 | Q1 | LIC | closed aut. | 22 | 222324331 | 8 | 0.28 | - | newbiz, EVS-A173, budget, EVS-A165, EVS-G007, HCI, ILO-LTU, manuf, tax, EVS-A080 |
| SOM | Somalia, Fed. Rep. | 19.7 | Q1 | LIC | closed aut. | 23 | 233323421 | 8 | 0.34 | - | EVS-A173, EVS-A165, EVS-G007, HCI, designs, hightech, ECI, Gini, EVS-A080 |
| SEN | Senegal | 18.9 | Q1 | LMC | electoral dem. | 25 | 233331442 | 8 | 0.40 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, EVS-A080 |
| KHM | Cambodia | 17.8 | Q2 | LMC | electoral aut. | 27 | 233334441 | 8 | 0.41 | - | EVS-A173, EVS-A165, EVS-G007, Gini, EVS-A080 |
| BEN | Benin | 14.8 | Q1 | LMC | electoral aut. | 24 | 233331342 | 8 | 0.37 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, ILO-LTU, EVS-A080 |
| SLE | Sierra Leone | 8.8 | Q1 | LIC | electoral aut. | 26 | 233333441 | 8 | 0.38 | - | EVS-A173, EVS-A165, EVS-G007, patents, tax, EVS-A080 |
| TGO | Togo | 8.6 | Q1 | LMC | electoral aut. | 25 | 233331442 | 8 | 0.39 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, EVS-A080 |
| LBR | Liberia | 5.7 | Q1 | LIC | electoral dem. | 25 | 233332441 | 8 | 0.36 | - | EVS-A173, EVS-A165, EVS-G007, trademarks, designs, tax, EVS-A080 |
| CAF | Central African Republic | 5.5 | Q1 | LIC | electoral aut. | 23 | 233331332 | 8 | 0.35 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, ILO-LTU, ECI, EVS-A080 |
| OMN | Oman | 5.5 | Q3 | HIC | closed aut. | 24 | 233224440 | 8 | 0.35 | - | EVS-A173, bribery, EVS-A165, EVS-G007, training, tax, Gini, EVS-A080 |
| MRT | Mauritania | 5.3 | Q2 | LMC | electoral aut. | 24 | 233332341 | 8 | 0.37 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, ILO-LTU, tax, EVS-A080 |
| KWT | Kuwait | 4.9 | Q4 | HIC | closed aut. | 26 | 233334341 | 8 | 0.38 | - | EVS-A173, EVS-A165, EVS-G007, ILO-LTU, Gini, EVS-A080 |
| QAT | Qatar | 3.0 | Q4 | HIC | closed aut. | 25 | 232333441 | 8 | 0.37 | - | EVS-A173, budget, EVS-A165, EVS-G007, designs, tax, EVS-A080 |
| GAB | Gabon | 2.6 | Q3 | UMC | electoral aut. | 25 | 233331442 | 8 | 0.40 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, EVS-A080 |
| BHR | Bahrain | 1.6 | Q4 | HIC | closed aut. | 25 | 232334341 | 8 | 0.38 | - | EVS-A173, budget, EVS-A165, EVS-G007, ILO-LTU, Gini, EVS-A080 |
| TLS | Timor-Leste | 1.4 | Q1 | LMC | electoral dem. | 24 | 233331432 | 8 | 0.36 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, ECI, EVS-A080 |
| SWZ | Eswatini | 1.3 | Q2 | LMC | closed aut. | 25 | 233331442 | 8 | 0.40 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, EVS-A080 |
| DJI | Djibouti | 1.2 | Q2 | LMC | electoral aut. | 25 | 233324431 | 8 | 0.37 | - | EVS-A173, EVS-A165, EVS-G007, HCI, ECI, tax, EVS-A080 |
| AFG | Afghanistan | 43.8 | Q1 | LIC | closed aut. | 24 | 233331441 | 7 | 0.36 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, Gini, EVS-A080 |
| YEM | Yemen, Rep. | 41.8 | n/a | LIC | closed aut. | 23 | 221334431 | 7 | 0.27 | - | newbiz, EVS-A173, DBexport, budget, EVS-A165, EVS-G007, manuf, tax, EVS-A080 |
| TCD | Chad | 21.0 | Q1 | LIC | electoral aut. | 22 | 233331421 | 7 | 0.34 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, hightech, ECI, tax, EVS-A080 |
| SSD | South Sudan | 12.2 | n/a | LIC | closed aut. | 22 | 233331331 | 7 | 0.32 | - | EVS-A173, EVS-A165, EVS-G007, patents, trademarks, designs, ILO-LTU, hightech, tax, EVS-A080 |
| HKG | Hong Kong SAR, China | 7.5 | Q4 | HIC | closed aut. | 25 | 042533431 | 7 | 0.36 | - | articles, SPI, budget, GitHub, ECI, tax, Gini |
| LBY | Libya | 7.5 | Q2 | UMC | closed aut. | 23 | 233412341 | 7 | 0.32 | - | newbiz, bribery, HCI, training, trademarks, designs, ILO-LTU, tax, Gini |
| PSE | West Bank and Gaza | 5.4 | Q1 | LMC | closed aut. | 21 | 232231431 | 7 | 0.35 | - | EVS-A173, VD-cs, VD-court, EVS-A165, EVS-G007, patents, trademarks, designs, ECI, tax, EVS-A080 |
| GNQ | Equatorial Guinea | 1.9 | Q2 | UMC | electoral aut. | 18 | 222311322 | 7 | 0.28 | - | newbiz, EVS-A173, budget, EVS-A165, EVS-G007, HCI, OpenAlex, patents, trademarks, designs, ILO-LTU, hightech, ECI, EVS-A080 |
| XKX | Kosovo | 1.6 | Q2 | UMC | n/a | 16 | 132221221 | 6 | 0.26 | - | SPI, EVS-A173, VD-cs, VD-court, EVS-A165, EVS-G007, HCI, patents, trademarks, designs, unemp, ILO-LTU, hightech, ECI, tax, EVS-A080 |
| TKM | Turkmenistan | 7.6 | Q3 | UMC | electoral aut. | 14 | 202212311 | 5 | 0.19 | - | newbiz, DBdays, DBproc, EVS-A173, DBexport, DBcontract, EVS-A165, EVS-G007, HCI, OpenAlex, designs, GitHub, ILO-LTU, hightech, DBelec, ECI, tax, EVS-A080 |
| ERI | Eritrea | 3.6 | n/a | LIC | closed aut. | 14 | 121320320 | 5 | 0.17 | - | SPI, newbiz, EVS-A173, DBexport, budget, EVS-A165, EVS-G007, HCI, patents, trademarks, designs, GitHub, ILO-LTU, hightech, ECI, tax, Gini, EVS-A080 |
| PRI | Puerto Rico (US) | 3.2 | Q4 | HIC | n/a | 17 | 141311321 | 4 | 0.25 | - | SPI, budget, VD-cs, bribery, VD-court, HCI, training, patents, trademarks, designs, ILO-LTU, hightech, ECI, tax, Gini |
| PRK | Korea, Dem. People's Rep. | 26.6 | n/a | LIC | closed aut. | 8 | 101111300 | 1 | 0.12 | - | SPI, newbiz, DBdays, DBproc, EVS-A173, DBexport, budget, DBcontract, bribery, EVS-A165, EVS-G007, HCI, training, trademarks, designs, GitHub, ILO-LTU, manuf, hightech, DBelec, ECI, tax, Gini, EVS-A080 |
## 3. Balance and three expansion sets

The guardrail beside O1 says confidence must not come to track wealth. A
widened set of well-measured rich countries would break it, and the obvious
rich additions (Italy, Austria, Belgium, the Nordics, New Zealand, Czechia)
all clear nine dimensions. So each set is defined by a rule that does not look
at a country's scores or reason, and each is read against the world mix.

- **A, +15.** The 15 most populous candidates that clear all nine dimensions.
- **B, +30.** Quotas that bring each world income quartile to a quarter of an
  83-country set (17 from the poorest quartile, 6 from the second, 6 from the
  third, 1 from the richest), filled within each quartile by population from
  the nine-dimension candidates.
- **C, +72.** Every candidate that clears all nine dimensions.

For reference, D is every candidate that clears eight or more (+94, 147
countries).

| | 53 today | A, +15 | B, +30 | C, +72 | D, +94 | World (160) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Countries | 53 | 68 | 83 | 125 | 147 | 160 |
| Complete cases (nine scores and income) | 50 | 65 | 80 | 122 | 122 | |
| Population covered, billions | 5.72 | 7.06 | 7.35 | 7.70 | 7.99 | |
| Income quartile Q1 / Q2 / Q3 / Q4 | 3 / 14 / 14 / 20 | 9 / 19 / 16 / 22 | 20 / 20 / 20 / 21 | 24 / 31 / 35 / 33 | 35 / 36 / 37 / 37 | 38 / 39 / 38 / 39 |
| Poorest quartile share | 6% | 13% | 24% | 19% | 24% | 25% |
| Closed / electoral autocracy | 5 / 12 | 9 / 22 | 13 / 30 | 17 / 41 | 26 / 51 | 34 / 54 |
| Electoral / liberal democracy | 21 / 15 | 21 / 16 | 25 / 15 | 41 / 26 | 44 / 26 | 44 / 26 |
| Democracy share | 68% | 54% | 48% | 54% | 48% | 44% |
| WB groups HIC / UMC / LMC / LIC | 24 / 19 / 8 / 2 | 26 / 22 / 15 / 5 | 27 / 24 / 21 / 11 | 43 / 38 / 31 / 13 | 48 / 40 / 40 / 19 | 50 / 44 / 41 / 25 |
| Countries with any EVS/WVS item | 37 | 45 | 50 | 72 | 72 | |
| Trust scored on institutional rows only | 15 | 22 | 32 | 52 | 74 | |
| Guardrail: mean confidence r with log GDP | 0.27 | 0.42 | 0.50 | 0.53 | 0.52 | 0.41 (154) |
| Guardrail slope, confidence per tenfold income | 0.029 | 0.042 | 0.044 | 0.048 | | |
| Mean confidence, all nine | 0.459 | 0.453 | 0.449 | 0.449 | 0.438 | |
| Trust mean confidence (O1 0.40) | 0.418 | 0.408 | 0.399 | 0.398 | 0.380 | |
| Shared purpose mean confidence | 0.411 | 0.394 | 0.385 | 0.383 | 0.349 | |
| Experimentation mean confidence | 0.364 | 0.348 | 0.331 | 0.319 | 0.301 | |
| Coordination mean confidence | 0.362 | 0.366 | 0.370 | 0.371 | 0.368 | |

The confidences are what the scorer would compute from the coverage counted
above and each row's year and source tier; they do not depend on the rebase.
Scores, correlations with income and the D137 and D138 readings do, and were
not computed: they need the full ingest and rescore the decision would buy.

Reading the guardrail:

1. **Every set raises it, and B and C about equally.** The rise is not a
   rich-country effect: the rich candidates are as well measured as the rich
   members. It comes from the poor end, where the Joint EVS/WVS release has
   few countries (4 of the 17 poorest-quartile countries in B: Pakistan,
   Myanmar, Tajikistan and Zimbabwe) and IP office rows are often regional.
2. **Today's 0.27 is partly selection.** In the 53, EVS presence correlates
   0.04 with log GDP, because the low-income members (Ethiopia, Nigeria,
   Kenya, Bolivia, Nicaragua, Guatemala) were among the few poor countries the
   survey reached. Across the 154 measurable countries of a million or more,
   the guardrail is 0.41. A frame closer to the world inherits the world's
   measurement gradient.
3. **What it means for the rule.** The guardrail is a check on research drift
   inside a fixed frame: a new source that only covers rich countries. A frame
   change moves it for a different reason. The decision entry has to say
   which: either the guardrail is re-baselined at the rebase and watched for
   drift from the new figure, or a frame that raises it is refused, in which
   case no balanced expansion is possible on today's sources.

O1: Trust and Shared purpose slip under 0.40 at B and C by 0.001 to 0.03, for
the same reason. Coordination, already under 0.40, rises slightly, because V-Dem
and the World Bank budget row cover the candidates well.

## 4. What each set costs

| Work | A, +15 | B, +30 | C, +72 | Note |
| --- | --- | --- | --- | --- |
| Registry | 15 entries | 30 | 72 | `countries.ts` wants iso3, iso2, name and a one-line `reason` per country. At 72 the reason becomes the rule; the decision should say so rather than write 72 case sentences |
| Adapter edits | EVS/WVS aliases | same | same | `sourceLabelToIso3` matches the registry name, so labels that differ need `SOURCE_COUNTRY_ALIASES` (the PDF spells Uzbekistan "Uzbequistan"; Hong Kong, Iran, Kyrgyzstan and Bosnia need checking against the chosen names). Every other adapter iterates `COUNTRIES` and needs nothing |
| Re-ingest | one run | one run | one run | `pnpm bench ingest` plus the seven adapters; `worldbank.json` grows from 17 MB to about 40 MB at C. The GitHub gate's median is over the benchmark, so it moves with the set (held today at C: Turkmenistan, Eritrea; North Korea absent) |
| Rescore and version | Dataset 9.0.0 | 9.0.0 | 9.0.0 | Major (D47): every published number restated, `revisions.json` logs the additions, CHANGELOG entry says the old numbers are not comparable |
| Diagnostics history | breaks | breaks | breaks | `factor-history.json` keeps past releases as published; D138 (c) starts a new same-set history |
| Delphi | about $32 | about $38 | about $58 | `pnpm bench cost --max-coverage 1` prices the 53 at $24.57 with today's four panelists, about $0.46 a country. Needed anyway: no panel is on the current dataset (D139) |
| Evidence grid (D135) | 120 cells | 240 | 576 | Eight grid columns per country. Today's grid is 424 cells, all closed (310 records, 114 no-case notes). This is the largest work item |
| Foresight register (D148) | 3 batches | 5 | 12 | The runbook codes the 53 in nine batches of about six, two coders of different families, 20% second-coded |
| Institution maps | none | none | none | Only Brazil has one; `INSTITUTION_MAPS` is a registry, not an obligation |
| Layers | none | none | none | Layers are Brazil and four Spanish-language countries; a new country gets the English ground layer, agenda and map |
| Output size | +28% | +57% | +136% | `data/out` is 19 MB, 6.9 MB of it country files and 8.5 MB agendas. `index.json`, which every list page reads whole (D27), grows from 1.4 MB to about 3.2 MB at C and needs a size check |
| Viewer | small | medium | medium | `FlagField` draws every country on one axis: 125 flags on 0 to 100 needs a crowding check. Country menus, compare and the sitemap are already registry driven |
| Copy and docs | | | | 128 lines in `docs/` say 53, 15 in code comments; `KNOWN-ARTEFACTS.md` figures, `COUNTRY_ROW_FACTS` (re-derived against the ILOSTAT file by its own test) and the roadmap tables all restate |

## 5. Recommendation

**Set C, in one rebase: every country of at least one million people that
clears `MIN_INDICATORS_FOR_SCORE` in all nine dimensions on the current
registry. 125 countries, about 122 complete cases, dataset 9.0.0.**

Why C:

- It is the only set that reaches the precision D137 and D138 name in their
  overturn clauses: an interval of about plus or minus 0.05 on the factor's r
  with income and a standard error of about 0.02 on the (b) margin. B gets
  part of the way (standard errors 0.034 on r and 0.026 on the margin) and
  leaves r's interval straddling 0.8.
- It is a rule with no judgment in it, which D47 asks of anything that sets
  the frame, and which B's quotas only partly are.
- It is close to the world on regime (54% democracies against 44%) and much
  closer than today on income (19% from the poorest quartile against 6%). B
  is closer on income, but the guardrail cost of B and C is the same.
- One rebase restates every number once. A then B then C would restate them
  three times.

Fallback: B, if the owner will not take 576 evidence-grid cells and 72
foresight codings now. B gets the income balance right and 80 complete cases.
Do not choose A: it moves the statistics least and carries most of the
restatement cost.

What C does not fix: the eight-dimension countries (francophone West Africa,
the Gulf) stay out of the complete cases on any set, and Taiwan stays out.

### What the decision entry has to say

1. **Choice.** The country rule, quoted: population threshold, nine of nine
   dimensions at the floor on the current registry, World Bank economies only.
   Whether economies under a million that clear the rule are in or out, and
   why.
2. **Supersessions.** That it amends the `reason` field's role (a rule, not a
   case per country) and extends D51's precedent of a rule-based completion.
3. **Version.** Dataset 9.0.0, every score restated and not comparable with
   8.x; the CHANGELOG entry says so.
4. **Guardrail.** That it rises from 0.27 to about 0.53 and why (the Joint
   EVS/WVS gradient and regional IP offices, not rich additions); whether
   D117's guardrail is re-baselined at the new figure or the rebase is
   refused on it. This is the clause the owner has to write; this memo cannot.
5. **O1.** That Trust and Shared purpose fall under 0.40 by construction of
   the frame, not by a source change, and that the roadmap queue reads the new
   figures.
6. **D64.** Whether the hold on two-programme countries stays (seven
   candidates lose all EVS/WVS cells) or a pooling rule replaces it.
7. **Evidence grid and foresight register.** Whether the grid's "exhaustive"
   now means 1,000 cells, or the new countries' cells open as a queue and the
   pages say which are unexamined; the same for the register.
8. **Diagnostics.** That D137 replaces its 0.8 and 0.5 bands with a
   confidence interval once the rebased r is known, as its overturn clause
   says, and that D138 (c) restarts its history.
9. **Cost.** Everything in section 4, and the restatement of every published
   figure.
10. **Overturned by.** A rescore on the wider set whose (b) margin or factor
    r interval is no tighter than the bootstrap here predicts, which would mean
    the new countries are noisier than the 50 and the precision argument
    failed; or a source that measures the eight-dimension group, which would
    reopen the rule.

## Reproducing this

The scratch scripts are not committed. The counts come from: the World Bank v2
API for the 20 rows with `country/all` and the registry's `wbSourceId`; the
Joint EVS/WVS PDF the adapter reads, through `pdftotext -layout`; V-Dem
country coverage from the Regimes of the World series; the adapters'
own request builders and parsers from `packages/core/dist` for OpenAlex,
GitHub and ILOSTAT. Every count was checked by reproducing the 53's published
`observedIndicators` and cell confidences exactly before reading a candidate.
Data read 2026-10-02.
