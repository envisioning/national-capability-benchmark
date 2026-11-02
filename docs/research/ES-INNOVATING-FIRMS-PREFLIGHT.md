# Enterprise Surveys innovating firms: preflight for Experimentation

Date: 2026-11-02. Dataset 10.0.0, 135 countries (D153, D176). Issue #118.
Track: source-backed measurement, value preflight. Nothing is wired: no
registry row, adapter, observation or decision changed.

Source of the lead: `docs/research/B-READY-PILLAR-MAP.md`, section 4.4. Scripts
and fetched files are kept outside the repository (scratch folder `es118/`);
every figure below is reproducible from the World Bank API and the Enterprise
Surveys portal's indicator service on this date.

## 1. Verdict

**Reject `IC.FRM.NPRD.ZS` as a scored row and as a check.** The series is not
the construct #118 names. It is a conjunction of three acts among medium and
large firms, its median is 3.9%, about a third of the countries rest on fewer
than five firms, and its values break across the 2023 survey rounds.

**Do not score the plain series either.** The Enterprise Surveys share of firms
that introduced a new product or service (`t7`) is the right construct and
covers 130 of 135, evenly across income. It fails on measurement: the 2023 and
later rounds read about 17 points lower than the earlier rounds of the same
countries, two rounds of the same design agree at a rank correlation of only
0.52, and no benchmark country but India has two rounds on the current design.
This is the D144 pattern. The most the data support is a D60 behavioural check
beside Experimentation, built on `t7`, and only after the portal route passes
D154 (section 8).

## 2. The series is a conjunction, not "firms that introduced a new product"

`pnpm bench probe --series IC.FRM.NPRD.ZS` resolves the code in World
Development Indicators (source 2): 126 of 135, latest 2025, r(GDP) 0.145,
verdict "usable". The series metadata (WDI, last updated 2026-10-08, CC BY 4.0)
names it differently from #118:

| Field | Value |
| --- | --- |
| Indicator name | Firms that introduced a new product/service and process, and spent on R&D |
| Long definition | Percentage of medium and large firms that introduced a new product/service and process over last 3 years, and spent on R&D over last fiscal year (excluding small firms) |
| Universe | formal, non-agricultural, non-extractive private firms of five or more employees; this series keeps only medium and large firms (20 or more) |
| Respondent | owner or top manager, face to face |

`B-READY-PILLAR-MAP.md` section 4.4 already printed this definition. Issue #118
then shortened it to "share of firms that introduced a new product or service",
and that shortening is wrong.

The conjunction is confirmed in the values. Wherever a round has all three
parts in the frozen Enterprise Surveys database (source 13), the WDI value sits
below each part: Estonia 2019 reads 9.0 against 36.8 (product), 23.1 (process)
and 14.5 (R&D); India 2014 reads 26.3 against 41.9, 56.4 and 29.7.

`pnpm bench probe --search "new product"` finds the plain series:
`IC.FRM.INNOV.T7`, "percent of firms that introduced a new product/service",
long definition "new or significantly improved products or services over the
last three years", CC BY 4.0. In the API it lives only in source 13, last
updated 2022-03-25: 103 of 135, latest 2020. The probe's default database
reports it as source 2, but the API answers "invalid value" for it there. The
current values are served by the Enterprise Surveys portal's indicator service
(`GetEconomyIndicatorData`, topic 9), the route D144 and #113 used for firm
counts, with no sign-in. Topic 9 serves:

| Portal field | Indicator |
| --- | --- |
| `t7` | firms (5+) that introduced a new product or service, last three years |
| `bready_t7_ml` | the same, medium and large firms only |
| `t8` | firms whose new product is also new to their main market |
| `t9`, `bready_t9_ml` | process innovation, all firms and medium and large |
| `bready_t10` | medium and large firms that spent on R&D last fiscal year |

This memo reports both `IC.FRM.NPRD.ZS` (the code #118 names) and portal `t7`
(the construct #118 describes). 382 portal rounds were read, one per benchmark
country and survey year from 2006.

## 3. Construct (D118)

Written from the definitions above, before the values in sections 4 to 7 were
read for this memo. The B-READY map fetched coverage and the income
correlation of `IC.FRM.NPRD.ZS` in the same step as its construct note; this
memo does not lean on those figures.

- **What it observes.** A firm manager's report that the firm brought a new or
  significantly improved product or service to market in the last three years.
  That is behaviour, an attempt, and a capability row for Experimentation in
  the family of `firm_training_incidence` (Learning) and `bribery_incidence`
  (Trust). It is not a stock that money buys.
- **New to the firm.** The standard is the firm's own product line, not the
  market (Oslo Manual sense). A retailer that stocks a new line or a
  manufacturer that copies a competitor's product answers yes. `t8` asks
  whether the new product was also new to the main market. That is closer to
  an attempt with uncertain outcome, but it is asked only of firms that said
  yes to `t7`, which brings back the base problem of section 6.
- **Self-report.** One manager answers, with a three-year recall. "Significantly
  improved" is judged by the respondent. The item has no cost or outcome
  attached, so a country's response culture moves it.
- **Who is excluded.** Firms under five employees, informal firms, agriculture,
  extractives, finance and the public sector. In low-income countries most
  attempts happen in the excluded part. `IC.FRM.NPRD.ZS` drops firms under 20
  as well.
- **The conjunction.** `IC.FRM.NPRD.ZS` counts a firm only if it did three
  things: a new product, a new process and R&D spending. R&D spending is the
  firm-level form of the spending stock D122 moved out of the scores
  (research spending is a condition beside Anticipation), and D142 retired
  `business_rd_share` for reading the make-up of that stock. A row that
  requires R&D spending folds the condition back into the capability.

Reading: `t7` passes on construct, with the informal-sector and self-report
caveats that every Enterprise Surveys row carries. `IC.FRM.NPRD.ZS` fails on
construct because of the R&D condition inside it.

## 4. Coverage and round years

D159 counts values from 2011 onwards in a 2026 release. Income quartiles are
log GDP per head from `data/out/diagnostics.json` (`income`, 133 countries,
Cuba and Venezuela have none): Q1 1,067 to 6,194; Q2 6,559 to 17,087; Q3
17,245 to 40,845; Q4 41,160 to 139,592 (34, 33, 33, 33 countries).

| Series | Any year | D159 window (2011+) | 2018 or later | Window by quartile Q1 / Q2 / Q3 / Q4 | 2018+ by quartile |
| --- | ---: | ---: | ---: | --- | --- |
| `IC.FRM.NPRD.ZS` (WDI) | 126 | 123 | 109 | 33 / 32 / 30 / 28 | 28 / 26 / 27 / 28 |
| portal `t7` | 131 | 130 | 126 | 33 / 32 / 33 / 32 | 31 / 30 / 33 / 32 |

`IC.FRM.NPRD.ZS` is missing Brazil, Switzerland, Australia, Japan, the United
Arab Emirates, Cuba, Haiti, Iran and Norway. Chile, Panama and Venezuela have
only 2010 values, set aside by D159. Portal `t7` is missing the United Arab
Emirates, Cuba, Haiti and Iran, and Venezuela's only round is 2010. Brazil,
Switzerland, Australia, Japan and Norway have 2025 portal rounds that WDI does
not yet serve. WDI lags the portal for 28 countries in all (Argentina 2017 in
WDI against 2026 on the portal; Chile 2010 against 2025).

Latest round year of `IC.FRM.NPRD.ZS`:

| Year | 2010 | 2011 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Countries | 3 | 1 | 1 | 2 | 1 | 6 | 3 | 3 | 7 | 5 | 4 | 5 | 37 | 40 | 8 |

85 of 126 latest values are 2023 to 2025, 24 are 2018 to 2022 and 17 are
older. Portal `t7` is more recent: 116 of 130 window values are 2023 or later.

Coverage is not the problem, and it is even across income. The spread of round
years matters because of section 5.

## 5. The values break at the 2023 rounds

Countries surveyed both in 2021 or earlier and in 2023 or later, latest round
of each period:

| Series | Countries | Median, 2021 or earlier | Median, 2023+ | Fell | Spearman, old against new |
| --- | ---: | ---: | ---: | ---: | ---: |
| `IC.FRM.NPRD.ZS` | 73 | 6.7 | 3.1 | 50 | 0.28 |
| `t7` | 99 | 39.3 | 22.2 | 69 | 0.50 |
| `bready_t7_ml` | 99 | 46.9 | 26.0 | 71 | 0.47 |
| `t9` (process) | 99 | 20.2 | 14.5 | 64 | 0.34 |
| `bready_t10` (R&D) | 99 | 19.9 | 16.8 | 63 | 0.35 |

Against that, two consecutive rounds both fielded in 2021 or earlier:

| Series | Countries | Median, earlier | Median, later | Spearman |
| --- | ---: | ---: | ---: | ---: |
| `IC.FRM.NPRD.ZS` | 58 | 12.0 | 4.9 | 0.53 |
| `t7` | 58 | 33.9 | 34.7 | 0.52 |

The product item held its level across the older rounds and fell by about 17
points at the 2023 rounds. The cause is not verified here. Two facts point at
the instrument and not at the firms: the fall is in most countries at once,
and the cases are large. India read 41.9 in 2014, 5.8 in 2022 and 3.9 in 2025
on samples of thousands of firms. Colombia read 63 to 64 in three rounds from
2006 to 2017 and 12.5 in 2023. Estonia read 36.8 in 2019 and 14.9 in 2023; its
`IC.FRM.NPRD.ZS` value went from 9.0 to 0.

Even inside one design the rank agreement is weak: 0.52 between two older
rounds of `t7`. For comparison, the World Risk Poll warning item was held as a
check at a wave-to-wave Spearman of 0.78. Only India has two rounds from 2022
on, so stability within the current design cannot be tested, which is the
second reason D144 gave for holding customs time as a check.

Mixed round years then change the ranking. `t7` correlates 0.26 (Spearman,
n 130) with its own round year, and `IC.FRM.NPRD.ZS` -0.14 (n 123), because a
country last surveyed under the older rounds keeps a higher level.

Face validity is poor in both series. `IC.FRM.NPRD.ZS`, window values:
United States 0.9 (2024), Korea 0.6 (2024), India 1.4 (2022), United Kingdom
1.8 (2024), Canada 1.6 (2024); Uganda 50.7 (2013), Finland 48.5 (2020),
Denmark 32.4 (2020), Ecuador 28.3 (2024), China 18.2 (2024). Portal `t7`:
United States 7.3, Korea 5.6, Portugal 5.1, India 3.9; Guatemala 88.3, Ecuador
73.5, Uruguay 72.6, Australia 70.8. China sits in the top fifth of
`IC.FRM.NPRD.ZS`, which is the pattern the A13 regime test looks for; it was
not run here.

## 6. Firm base per country (D144, #113)

The D144 proxy is the firms surveyed in the round the value comes from
(`GetAllEconomiesSubGroups`, `firmsSurveyed`) times the share of firms the
item applies to. 121 of the 123 window values of `IC.FRM.NPRD.ZS` match a
portal round of the same year; Belgium 2024 and Czechia 2024 have none.

- **Firms surveyed.** Median 600, range 114 to 9,376. Three rounds have fewer
  than 150.
- **Medium and large firms.** The portal does not serve the sample's size
  split. This memo assumes 60% of the sample is medium or large (Enterprise
  Surveys stratify by size and over-sample larger firms); the assumption is not
  verified. The base proxy is then median 360, and 15 rounds fall under 100.
- **Firms behind the numerator.** The proxy for firms that did all three acts
  is base times the value. **41 of 121 rest on fewer than five firms, 59 on
  fewer than ten, 84 on fewer than 30.** By quartile, fewer than five firms:
  Q1 16 of 33, Q2 7 of 32, Q3 12 of 30, Q4 6 of 26. The thin bases fall
  hardest in the poorest quartile.
- **Precision.** On simple random sampling and with no design effect, the
  relative standard error of the share has a median of 0.30, and 35 of 121 are
  above 0.5. The eight zeros (Bangladesh 2022, Cyprus 2024, Estonia 2023,
  Guinea 2025, the Gambia 2023, Myanmar 2016, Malawi 2025, Timor-Leste 2021)
  are zero firms among a few hundred, which a scored row would read as the
  frame's floor.

`t7` has no base problem of this kind. It is asked of every surveyed firm, its
median is 21.7%, and a share near 20% on 114 or more firms is estimated to
within a few points. The question for `t7` is the instrument, not the base.
`t8` (new to the market) is asked only of firms that answered yes to `t7`, so
it inherits the D144 base problem in full.

## 7. Income and the other rows (reported, deciding nothing; D118)

Spearman correlations on latest values in the D159 window. Existing rows use
the `normalized` latest value from `data/out/indicators/<id>.json`.

| Against | `IC.FRM.NPRD.ZS` | `t7` |
| --- | --- | --- |
| log GDP per head | 0.12 (n 123); 0.20 at 2018+ (n 109) | 0.17 (n 130); 0.19 at 2018+ (n 126) |
| `resident_patents_per_million` | 0.07 (n 107) | -0.02 (n 114) |
| `resident_trademarks_per_million` | 0.12 (n 108) | 0.14 (n 115) |
| `resident_industrial_designs_per_million` | -0.09 (n 104) | -0.14 (n 111) |
| `new_repositories_per_million` | 0.07 (n 121) | 0.14 (n 128) |
| `insolvency_efficiency` | -0.05 (n 82) | -0.01 (n 82) |
| `early_stage_entrepreneurial_activity` | 0.26 (n 13) | 0.39 (n 16) |
| `failure_tolerance` | -0.54 (n 13) | -0.22 (n 16) |
| `new_business_density` (Agency) | 0.06 (n 117) | 0.19 (n 124) |
| `firm_training_incidence` (Learning) | 0.43 (n 123) | 0.59 (n 130) |

Pearson with log GDP: 0.14 (`IC.FRM.NPRD.ZS`), 0.22 (`t7`). The probe printed
0.145 for `IC.FRM.NPRD.ZS`. `IC.FRM.NPRD.ZS` and `t7` correlate 0.72 with each
other (n 123).

Redundancy with the existing Experimentation rows is absent: nothing passes
0.2 except against the two GEM rows, which cover 13 to 16 countries. The
strongest link is to `firm_training_incidence`, another Enterprise Surveys
item in another dimension, at 0.59. Two answers from the same managers in the
same round agreeing more than either agrees with any other attempt count is
what a shared survey effect (round, interviewer, response style) would
produce. It is not proof of one. Read beside section 5, it suggests that the
country level of an Enterprise Surveys yes/no item carries a large survey
component.

## 8. What a row would move (simulation, not wired)

The simulation follows `docs/research/experimentation/SWEEP-2026-11.md`:
confidence is coverage times mean recency times mean tier quality, the
coverage denominator rises from 10 to 11, recency is the `recencyWeight` rule
against 2026, and the new row's tier quality is 0.95 (international
organisation). It starts from each country's published `confidenceParts`; the
starting mean is 0.394. No code was changed.

| | Mean confidence | Q1 / Q2 / Q3 / Q4 | Guardrail (n 133) |
| --- | ---: | --- | ---: |
| 10.0.0 | 0.394 | 0.285 / 0.396 / 0.463 / 0.440 | 0.455 |
| with `IC.FRM.NPRD.ZS` | 0.424 | 0.327 / 0.426 / 0.487 / 0.465 | 0.439 |
| with `t7` | 0.436 | 0.336 / 0.434 / 0.503 / 0.481 | 0.449 |

Either row would take Experimentation over O1 and lower the guardrail.

Countries that gain a third or fourth Experimentation row. At 10.0.0, 12
countries have two observed rows and 10 have three; none is below the D45
floor.

| Observed rows now | Countries | Gain from `IC.FRM.NPRD.ZS` | Gain from `t7` |
| --- | ---: | ---: | ---: |
| 2 → 3 | 12 | 12 | 12 |
| 3 → 4 | 10 | 8 | 8 |

The 12 at two rows are Mali, Burkina Faso, Guinea, the Republic of the Congo,
Cameroon, Chad, Senegal, Togo, the Central African Republic, Mauritania,
Timor-Leste and Eswatini (ten in Q1, two in Q2). The eight at three rows that
gain are China, Myanmar, Côte d'Ivoire, Malawi, Belgium, Belarus, Lebanon and
Guinea-Bissau; Cuba and Haiti have no survey. Guinea, Timor-Leste, Myanmar
and Malawi would gain that row as a zero in `IC.FRM.NPRD.ZS`.

The O1 gain is real and falls where the dimension is thin. It does not decide
the row: the project chooses rows on construct and measurement (D118), and a
row whose country level moves 17 points with the questionnaire would put that
movement into the score of the countries it helps most.

## 9. Against the project's rules

| Test | `IC.FRM.NPRD.ZS` | `t7` |
| --- | --- | --- |
| Construct (D118) | fails: R&D spending inside the count folds a D122 condition into the row; conjunction of three acts | passes, with the self-report and informal-sector caveats |
| Open data (D154) | passes: WDI, CC BY 4.0 | the API copy (source 13) is CC BY 4.0 but frozen at 2020; current values need the portal service, whose terms were not checked here |
| Coverage and recency (D117, D159) | passes: 123 in window, 109 at 2018+, even by quartile | passes: 130 in window, 126 at 2018+, even by quartile |
| Spread | passes on the probe, but median 3.9% with eight zeros | passes: 0 to 88, median 21.7 |
| Firm base (D144, #113) | fails: 41 of 121 under five firms | passes |
| Instrument stability (D144) | fails: falls with the 2023 rounds, old-to-new Spearman 0.28 | fails: falls 17 points with the 2023 rounds; old-to-old Spearman 0.52; one country with two current-design rounds |
| Redundancy | none with Experimentation rows; 0.43 with `firm_training_incidence` | none with Experimentation rows; 0.59 with `firm_training_incidence` |
| Income (reported) | 0.12 | 0.17 |

**Admit as a scored row: no, for either series.** **Publish as a check:** not
`IC.FRM.NPRD.ZS`, which fails on construct as well as measurement. `t7`
fits D60 the way customs clearance time did under D144: the construct passes
and the measurement cannot yet be trusted. It would need an adapter for the
portal service (or a WDI copy, which does not exist today) and a D154 reading
of the portal's terms. **Reject** `IC.FRM.NPRD.ZS` and close #118 on that.

What would reopen `t7` as a scored row: a second round on the current
questionnaire for 30 or more benchmark countries with a round-to-round
Spearman of 0.7 or more, and a published account from the Enterprise Analysis
Unit of what changed in the 2023 innovation module.

## 10. What was not done

- The medium and large share of each sample is assumed at 60%; the microdata
  that would give it need a registration (D154).
- The portal's terms of use were not read. The API copy's CC BY 4.0 is
  verified from series metadata.
- The A13 regime test was not run.
- The cause of the 2023 level shift is inferred from the values, not from a
  questionnaire document.
- The simulation leaves Experimentation's score and its correlation with
  income uncomputed, because that needs the scorer. Section 8 moves confidence
  only.

## Sources

- World Bank API, `IC.FRM.NPRD.ZS` (source 2), `NY.GDP.PCAP.PP.KD` (source 2),
  `IC.FRM.INNOV.T7`, `T8`, `T9`, `T10` (source 13), fetched 2026-11-02 for the
  135 registry countries, 2006 to 2025. Series metadata:
  `https://api.worldbank.org/v2/sources/2/series/IC.FRM.NPRD.ZS/metadata?format=json`.
- Enterprise Surveys portal indicator service:
  `https://extdataportal.worldbank.org/api/esapi/GetAllEconomiesSubGroups` and
  `.../GetEconomyIndicatorData/economyid/{id}/topicid/9/year/{year}`, 382
  rounds, fetched 2026-11-02.
- Repository, dataset 10.0.0: `data/out/diagnostics.json` (`income`),
  `data/out/indicators/<id>.json`, `data/out/countries/<ISO3>.json`.
