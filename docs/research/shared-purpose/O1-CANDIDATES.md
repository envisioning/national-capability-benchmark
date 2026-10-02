# What could lift Shared purpose to O1

Task: Shared purpose has a mean confidence of 0.343 on dataset 7.8.0 (O1 target
0.40). Its r with log GDP per capita, 0.20 (n 50), is the lowest of the nine
dimensions. Find new candidate sources for its gaps, mainly
`volunteering_rate`, because the Joint EVS/WVS release has no volunteering
item. Triage every candidate at the desk under D117 and D118: construct
first, then the ceiling against all 53, the A13 regime test and redundancy.
The correlation with log GDP per capita comes last, and it is printed and
decides nothing.

Track: source-backed measurement. Desk triage plus value preflights. Nothing
is wired: no registry row, adapter or observation changed.

Date: 2026-10-02. Dataset 7.8.0 (`data/out` at HEAD). I wrote the construct
paragraphs from each publisher's documentation before reading any values, and
added the numbers after. Not repeated here: everything that
`EVS-WVS-BEHAVIOURAL-ITEMS.md`, `VDEM-POLARIZATION.md`, `VDEM-TURNOUT.md` and
`../O1-TRIAGE-SWEEP.md` already rejected (the joint-release membership,
political-action, voting and pride items, V-Dem polarization and turnout,
CSO participation, union density and the VAT gap). Where this memo reaches a
different verdict from the sweep on the same source, it says so.

## Where the dimension stands

Six rows count toward coverage. Three are scored: tax revenue (WB, 48),
income inequality (WB, 51) and civic participation (EVS/WVS A080_01, 37).
Three are gaps: `national_belonging`, `volunteering_rate` and
`political_polarization`. `voice_and_accountability` is retired and does not
count (D100). A country holding all three scored rows reaches about 0.43. One
holding two reaches about 0.30. Coverage is the binding term: a full-frame
row that fills a gap adds about 0.13 to the mean, and a new row about 0.06,
because it also raises the denominator.

## Simulated O1 effect

The simulation uses the scorer's own recency rule (two grace years, then
linear decay over twelve, current year 2026) and the `SOURCE_TIERS` weights.
It reproduces every published dimension confidence to within 0.001.
"Guardrail" is the correlation of each country's mean confidence across the
nine dimensions with log GDP per capita, recomputed with only Shared purpose
changed. It reads 0.278 on 7.8.0, matching the roadmap's 0.28. Tiers assumed:
ILOSTAT, IFRC and WHO `international_organization` (0.95), and the Gallup and
CAF surveys `academic_survey` (0.85).

| Run | Mean confidence | Shared purpose confidence r log GDP | Guardrail | Bottom quarter mean |
| --- | ---: | ---: | ---: | ---: |
| Dataset 7.8.0 | 0.343 | 0.256 | 0.278 | 0.216 |
| ILOSTAT observed volunteer rate fills `volunteering_rate` (28) | 0.402 | 0.518 | 0.357 | 0.230 |
| Gallup "volunteered time", under a licence, fills `volunteering_rate` (50) | 0.477 | 0.342 | 0.301 | 0.327 |
| CAF World Giving Report 2025, new row (49) | 0.407 | 0.296 | 0.287 | 0.272 |
| IFRC FDRS Red Cross volunteers, new row (53) | 0.405 | 0.261 | 0.278 | 0.294 |
| IFRC FDRS fills `volunteering_rate` (53) | 0.473 | 0.261 | 0.279 | 0.343 |
| WHO voluntary blood donation share, new row (50) | 0.408 | 0.162 | 0.259 | 0.276 |
| `national_belonging` retired, denominator 5 | 0.411 | 0.256 | 0.279 | 0.260 |
| `national_belonging` and `political_polarization` retired, denominator 4 | 0.514 | 0.256 | 0.280 | 0.324 |
| `national_belonging` retired, ILOSTAT fills `volunteering_rate` | 0.482 | 0.518 | 0.368 | 0.276 |
| `national_belonging` retired, Gallup fills `volunteering_rate` | 0.573 | 0.342 | 0.305 | 0.392 |

Any full-frame row crosses 0.40, because the dimension starts close and the
denominator is small. That is why this memo decides on construct and not on
this table. Only the ILOSTAT row moves the guardrail (+0.08), because its 28
countries are mostly rich. Every other row adds evidence evenly across
incomes and holds the guardrail within 0.02.

## Ranked triage

Regime means use V-Dem v16 `v2x_regime` for 2025 (closed autocracy 5:
ARE CHN CUB HTI VNM; electoral autocracy 12; electoral democracy 21; liberal
democracy 15), read from the archive the V-Dem adapter pins. r log GDP is
Pearson against the `diagnostics.json` income series.

| Rank | Candidate | Construct | Ceiling of 53 | Regime test (A13) | Redundancy (max r) | r log GDP (printed) | Cost | Verdict |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | Gallup World Poll: volunteered time to an organisation, past month | behaviour, the gap's own definition | 50 (no CUB HTI RWA in WHR 2025) | passes as groups; ARE 19th of 147 is the outlier | 0.60 `civic_participation` | -0.17 (ranks) | licence; D10 blocks it | **blocked: needs a human (licence) and a decision (D10)** |
| 2 | `national_belonging`: gap or rejected dataset? | not a source | | the only cross-national item (G006) fails A13 | | | one decision entry | **decision for the owner (D100)** |
| 3 | ILOSTAT volunteer rate (`DF_POP_XVOL_SEX_VOL_RT`) | behaviour, ICLS-19 definition | 28 any type; 18 organisation-based; 14 at a 12-month reference | no closed or electoral autocracy observed | 0.80 `civic_participation` (n 12) | 0.54 (org-based, n 18) | SDMX, no key | dead: reference periods 1 week to 12 months; watch |
| 4 | ILO/UNV SWVR 2026 modelled country rates | model output | 189 modelled, country table not published | | | | | dead: imputation with GDP per capita as a covariate |
| 5 | IFRC FDRS volunteers per 1,000 (`KPI_PeopleVol_Tot`) | the size of one organisation's volunteer corps | 53 (46 at 2022) | fails: closed 3.2, electoral autocracy 1.8, electoral democracy 0.8, liberal 2.4 | 0.46 interpersonal trust | 0.19 (log) | open CSV export, no key | dead on construct |
| 6 | WHO voluntary non-remunerated share of whole-blood donations | blood-service model | 50 (no IRL ISR VEN) | closed 82, el. autocracy 79, el. democracy 64, liberal 90 | -0.47 `income_inequality` | 0.38 | one PDF annex | dead: 26 of 50 at 99% or more (withdraws the sweep's check verdict) |
| 7 | CAF World Giving Report 2025, % of income donated | self-reported money, religious giving included | 49 (no CUB HTI PRY VEN) | closed 1.9, liberal 0.6 | -0.47 tax revenue | -0.52 | PDF appendix | dead: online panel, religiosity |
| 8 | Gallup: helped a stranger, past month | behaviour, partly need | 50 | lowest in closed autocracies and liberal democracies | 0.52 `civic_participation` | -0.30 (ranks) | as rank 1 | hold behind rank 1: direction ambiguous |
| 9 | Gallup: donated money, past month | money | 50 | | -0.55 `income_inequality` | 0.43 (ranks) | as rank 1 | dead: reads disposable income |
| 10 | Global Flourishing Study, wave 1 and 2, "volunteered time to an organisation" | same item as rank 1, open microdata | 19 | | | not computed | open (COS) | dead on ceiling; **validation sample for rank 1** |
| 11 | ISSP 2023 National Identity and Citizenship (ZA10010) | perception and civic acts | 16 | | | | GESIS | dead on ceiling |
| 12 | WVS wave 8 (2024 to 2026) | memberships, political acts | WVS countries only | | | | not released | dead for volunteering: no item; EVS 6 is the watch item |
| 13 | Afrobarometer, Latinobarómetro, Asian Barometer splice | community-meeting and joint-action items, worded differently | about 31, no Europe, North America, Oceania, Israel, Turkey or the Gulf | | | | harmonisation the project would author | dead on cost |
| 14 | Older WVS/EVS volunteering items; Manda et al. 2025 meta-analysis | behaviour | 31 countries, 2000 to 2018 | | | | | dead: recency floor |
| 15 | Organ donation (GODT deceased donors per million; registries) | transplant system and opt-out law | about 50 | | | | | dead on construct |
| 16 | Census and survey response rates | | no harmonised source | | | | | dead (sweep stands) |
| 17 | Tax morale (F116) and ISORA on-time filing rates | attitude; administration performance | 40; ISORA not counted | | | | | dead on construct |

## Candidate notes

### 1. Gallup World Poll volunteering

**Construct (written first).** "In the past month, have you volunteered your
time to an organisation?" is a reported behaviour, recent and binary. It is
the registry's own definition of `volunteering_rate`, nearly word for word.
It observes time given through an organisation, so it sits closer to acting
for strangers than membership does. It counts religious organisations, which
D128 excluded from membership because they read religiosity. This item
cannot be split that way.

**Access.** Gallup holds the microdata and the country aggregates. The
registry note and D10 reject it on inspectability. Three public routes
exist, and none of them changes that:

- the World Happiness Report 2025, Table 2.2, prints country **ranks** among
  147 for donated, volunteered and helped a stranger, pooled 2022 to 2024. It
  prints no values. The "raw data" link on the WHR dashboard leads to Gallup
  Analytics, which is paid.
- CAF's World Giving Index printed Gallup percentages until its 2024 edition
  (2023 data). CAF's 2025 report moved to a Focaldata online panel (rank 7),
  so that series has no successor.
- The Global Flourishing Study (rank 10) asks the same item, is fielded by
  Gallup, and its waves 1 and 2 are now open on the Center for Open Science.
  It covers 19 of the 53: ARG AUS BRA DEU ESP GBR IDN IND ISR JPN KEN MEX NGA
  PHL POL SWE TUR USA ZAF.

**Values (WHR 2025 ranks, negated so that higher means more).** In the 53:
Indonesia 1st, Kenya 3rd, Nigeria 5th, Philippines 6th, India 10th, UAE 19th,
Venezuela 23rd, Canada 25th ... Brazil 85th, Vietnam 124th, Turkey 132nd,
Poland 143rd. Regime means of the rank: closed 72 (n 3), electoral autocracy
50, electoral democracy 57, liberal democracy 73. Autocracies are not
inflated as a group. The UAE is the single case to read first (19th, with an
expatriate majority, Gallup samples residents). r with
`civic_participation` 0.60 (n 37), with interpersonal trust -0.06. It reads
what membership does not. r with log GDP -0.17 (n 49). Added to the scored
rows as an approximate 0 to 100 transform of the rank, Shared purpose's own
correlation with income would fall from 0.20 to about 0.09. The largest rises
are Venezuela (+21), Paraguay, Singapore and the UAE (+13 each), and the
largest falls are Poland (-14), Sweden and Vietnam (about -10). Singapore's
rise is the A5 question answered from a behaviour.

**Traps.** Ranks are an ordinal transform of a proprietary estimate. Scoring
ranks would itself be a new rule, so a licence to the percentages is the
only clean route. Religious volunteering is inside the item. Pooling three
years smooths the post-COVID fall the report describes.

**O1.** Filling the gap: 0.343 to 0.477, bottom quarter 0.216 to 0.327,
guardrail 0.278 to 0.301.

### 2. `national_belonging`: a declared gap or a rejected dataset

This is not a source. The registry declares `national_belonging` as a gap
pointing at the WVS, and its note already says that high national pride is
not the capacity for collective action. The joint EVS/WVS sweep read G006,
the only cross-national item aimed at it. G006 fails A13: electoral
autocracies read 75% "very proud" against 47% in liberal democracies. The
same memo closed the gap as unfillable from that source. The other
candidate found here, ISSP 2023's closeness-to-country item, is also a
perception and covers 16 countries.

Under D100 a gap says nobody publishes a comparable series, and a retirement
says a series exists, was inspected and measures the wrong thing. On the
evidence filed, `national_belonging` fits the second description. Retiring
it moves the denominator from 6 to 5, which takes mean confidence from
0.343 to 0.411 with no new observation, holds the guardrail at 0.279 and
moves no score. That effect is not the reason to do it, and AGENTS.md is
explicit that gaps are never removed to make numbers look better. The case
has to rest on construct: if the owner believes belonging is a capability
that a behaviour could one day observe, the gap stays. `political_polarization`
is not offered on the same terms, because D121 deliberately kept that gap
open for a reading conditioned on competition.

### 3. ILOSTAT volunteer rates

**Construct.** The ICLS-19 definition: unpaid, non-compulsory work for
others, at least one hour, in a reference period, split into
organisation-based and direct. Behaviour, from national statistical
surveys. This is the best construct on file.

**Ceiling and harmonisation.** The SDMX flow `DF_POP_XVOL_SEX_VOL_RT` (65
countries in all) holds 28 of the 53. 18 have an organisation-based rate and
14 of those use a 12-month reference. Reference periods run from one week
(Brazil, Colombia, Costa Rica, Mexico, Guatemala, Kenya) through four weeks
to 12 months, and the values follow the period: Kenya 0.3 (one week) against
Canada 79.4 (12 months, total). The SWVR 2026 harmonises with one averaged
multiplier per period, which is a model rather than an observation. No
closed or electoral autocracy is observed. Latest years run from 2015
(Germany, EU-SILC) to 2023. r with log GDP 0.54 for the organisation-based
rates (n 18), and r with `civic_participation` 0.80 (n 12).

**Verdict.** Dead now, on harmonisation and on the guardrail, which it would
raise from 0.278 to 0.357. Watch item: if ILOSTAT publishes four-week rates
from labour force surveys for 27 or more of the frame, this becomes the
gap's natural source and supersedes rank 1.

### 4. SWVR 2026 country estimates

Appendix B of the report (read from the Wayback snapshot of 2026-01-11,
because unv.org blocks scripted requests) describes estimates for 189
countries, 2008 to 2025. They come from a model whose covariates include
GDP per capita, poverty, urbanisation, religiosity, blood donors and Red
Cross volunteers. Where a country has no data at all, the model benchmarks
it on regional averages. The report prints regional figures only. Two
problems end it whatever the access: most country values would be
imputations, and income enters by construction.

### 5. IFRC FDRS volunteers

**Construct.** People who gave at least four hours in the year to their
national Red Cross or Red Crescent society. That counts one organisation's
volunteer corps, so it reads the national society's role as much as how
much the population volunteers.

**Values.** The open export (`data-api.ifrc.org/csv/export`, codebook
included) reaches 53 of 53 at 2020 to 2022. Japan 6.8 per 1,000,
Switzerland 5.8, Spain 5.5, Germany 5.3, Rwanda 4.9, UAE 4.9, Israel 4.4
(Magen David Adom), Vietnam 4.3, Cuba 4.3 ... Brazil 0.05, Bolivia 0.05,
Venezuela 0.02. The United States reads 0.83 against an organisation-based
rate of 28% in ILOSTAT. The file marks the Nicaraguan Red Cross as
dissolved. Regime means: closed autocracies 3.2, electoral democracies 0.8.
Scored, it would raise Singapore, Vietnam, the UAE and Rwanda by 15 to 18
points. It fails A13 the way state-linked mass organisations would, which
the membership item avoided (D128). Dead.

### 6. WHO voluntary blood donation share

The sweep called this a check candidate. Annex 3 of the 2025 Global status
report, parsed for the 53, settles it. 26 of the 50 reporting countries sit
at 99% or more, including China, Cuba, Rwanda, the UAE and Nicaragua. Most of
the variation is Latin America's family-replacement systems: Guatemala 3.4,
Panama 5.2 (2018), Mexico 8.3, Paraguay 10.2 ... Brazil 66.9. The series reads
the blood-service model and national mandates, and in China a donation system that has long been
organised through employers and work units. It is not a reading of the
capability, so it is not a check either. Dead.

### 7. CAF World Giving Report 2025

Online Focaldata panels in 101 countries. Samples run from 112 (Honduras)
to about 1,000, and the method statement says panels outside the OECD skew
urban and educated. The only country-level figure printed is the share of
income donated, which includes religious giving, and it has no volunteering
rate by country. r with log GDP -0.52. Dead on mode and construct. CAF says
it will open the data to academic proposals, which is not open data.

## Recommendations

At most two, in order.

1. **`volunteering_rate`: keep the gap and seek a licence for Gallup's
   "volunteered time to an organisation" country percentages. The treatment
   is `indicator`, and only after a decision that supersedes D10.** It is
   the only candidate that observes the gap's own behaviour across 50 of
   the 53 at a current date. It passes A13 as groups, is not redundant with
   membership (0.60), and fills the gap at 0.343 to 0.477 with the guardrail
   near flat (0.301). The D10 supersession needs a reason that is better
   than coverage. The Global Flourishing Study puts the identical item, also
   fielded by Gallup, in open microdata for 19 frame countries. Anyone can
   recompute those aggregates and compare them with Gallup's, which is a
   form of inspection D10 did not consider. The licence has to allow the
   project to publish country aggregates in `data/out` under the data
   package's terms. If it does not, the route is dead. Until then the gap
   stays, and the WHR ranks are not scored.

2. **Decide whether `national_belonging` is a declared gap or a rejected
   dataset, with G006's A13 failure and the registry's own construct note as
   the evidence. The treatment is `retired` or `gap`, by decision entry
   (D100).** No source in this sweep or the EVS/WVS one can fill it without
   failing A13, and the row's own note disowns pride as the capacity.
   Retiring it would put the dimension at 0.411, with the guardrail flat and
   no score moved. A reader must then read `observedIndicators` (still about
   2.6) beside that confidence, as D100 already requires. If the owner keeps
   it as a gap, O1 in Shared purpose waits for recommendation 1.

Not recommended: ILOSTAT volunteer rates (harmonisation; watch for
four-week rates), the SWVR model (imputation), FDRS (A13), the blood share
(spread, policy), CAF 2025 (mode), ISSP and GFS on their own (ceiling).

## Reproduction

All in a scratch directory, nothing committed.

- ILOSTAT: `https://sdmx.ilo.org/rest/data/ILO,DF_POP_XVOL_SEX_VOL_RT/?format=csv`,
  `SEX_T`, latest year per `VOL` type.
- FDRS: `https://data-api.ifrc.org/csv/export` (zip with
  `time_series_*.csv` and `codebook.xlsx`, export dated 2026-09-18),
  `KPI_PeopleVol_Tot / Population`.
- WHO: Global status report on blood safety and availability 2025,
  `iris.who.int` bitstream `aa36bd85-6947-4097-adf6-f734922c8026`, Annex 3
  (pp. 81 to 93), VNRD over total whole-blood donations at the latest year.
- WHR 2025: `files.worldhappiness.report/WHR25.pdf`, Table 2.2 parts 1 to 5.
- CAF: World Giving Report 2025, appendix "Generosity scores", and the 2025
  method statement.
- SWVR 2026: `web.archive.org/web/20260111044548/` snapshot of the UNV PDF,
  Appendix B.
- Regimes: V-Dem Country-Year Full+Others v16, `v2x_regime` at 2025.
- Confidence: per-country cells from `data/out/countries/*.json`, the
  scorer's `recencyWeight` and `SOURCE_TIERS`. Rows that fill a gap keep the
  denominator, and a new row adds one to it.
