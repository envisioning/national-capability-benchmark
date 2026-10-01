# ILOSTAT long-term unemployment share

Task: Adaptability gap `long_term_unemployment_share`, source memo in issue #26

Track: source-backed measurement

Status: wired with a plausibility gate (D120). 44 of 53 countries emitted.

## Source and construct

The registry asks for the unemployed who have been looking for 12 months or
more, as a share of all unemployed. ILOSTAT publishes no ready share for the
53, so the adapter derives it from the dataflow `DF_UNE_TUNE_SEX_AGE_DUR_NB`,
unemployment by sex, age and duration, in thousands, annual, harmonised by the
ILO from national labour force and household survey microdata:

`share = DUR_AGGREGATE_MGE12 / (DUR_AGGREGATE_TOTAL - DUR_AGGREGATE_X) x 100`,
both sexes (`SEX_T`), age 15 and over (`AGE_YTHADULT_YGE15`).

`MGE12` is 12 months or more and `X` is duration not stated, which leaves the
denominator so a country with many unanswered duration questions is not read as
having few long searchers. This is the OECD and Eurostat construct. Where
ILOSTAT holds more than one survey for a country-year, a labour force survey
(`LFS`) wins, then a household survey (`HS`), then anything else, then the
label alphabetically.

One SDMX call covers the frame. No key is needed:

```text
https://sdmx.ilo.org/rest/data/ILO,DF_UNE_TUNE_SEX_AGE_DUR_NB,1.0/{ISO3+ISO3...}.A..SEX_T..?startPeriod=2010
Accept: application/vnd.sdmx.data+csv;version=1.0.0
Accept-Language: en
```

The `Accept-Language` header is required in practice: Node's `fetch` sends
`Accept-Language: *` by default and the endpoint answers HTTP 500
`languageTag1` to it. Each observation carries the same request narrowed to
its own country as `sourceUrl`, so a reader can repeat one country's call.
The dataflow's own description is at
`https://sdmx.ilo.org/rest/dataflow/ILO/DF_UNE_TUNE_SEX_AGE_DUR_NB/1.0`.
ILOSTAT data are licensed CC BY 4.0. ILOSTAT is a live database rather than a
numbered release, so the dataflow version and the retrieval date
(2026-10-01 for the committed file) identify what was read.

Every observation's note records the survey, the share of the unemployed with
no stated duration, and the ILO status codes on the rows used (`B` break in
series, `U` flagged unreliable by the ILO, both read from the
`CL_OBS_STATUS` codelist).

## What it measures, and the two meanings

The row is accepted on its construct. It asks whether the people who lose
work find new work, which is reallocation, the core of Adaptability, and it is
observed behaviour rather than a stock. Lower is better, raw percentage, no
transform.

A high share can mean two different things. It can mean slow reallocation,
where unemployment is a trap: South Africa 76.5, Kenya 59.0, Nigeria 56.1. It
can also mean a small residual pool in a tight market, where the few left
unemployed are the hardest to place: Switzerland 33.5, Japan 35.3. The row
cannot tell the two apart on its own. It is read beside `unemployment_rate`,
which is already in the dimension: a high share on a low rate is the second
case, a high share on a high rate is the first. The registry note says so.

## The plausibility gate

Several national questionnaires cannot record a long search. They either ask
job-search duration with a short recall window or reclassify long searchers
as inactive, and the published share is then a fact about the instrument. The
owner chose a rule applied to every country over a named exclusion list. The
adapter names no country. The rule, in order, with the thresholds in
`LTU_GATE` in `packages/core/src/pipeline/adapters/ilostat.ts`:

1. **Floor.** A country-year under 3% is dropped (`below_floor`).
2. **Instrument floor.** Every year of a survey whose median across all its
   years for that country is under 3% is dropped, including years that clear
   3% (`instrument_floor`). The floor's reason is a property of the
   questionnaire, not of the year: a year at 3.1% from a survey that reports
   2% in every other year is the same instrument. This clause is an addition
   to the owner's two-clause rule; see "What the gate does not settle" below.
3. **Spike.** On what survives the floor, a run of one or two consecutive
   observations that sits more than 15 points above (or below) both the
   observation before it and the observation after it is dropped, provided
   those two neighbours agree within 15 points (`spike`). The series leaves
   and comes back. A jump that the following year keeps is a **level shift**
   and stays. A jump that overshoots and settles at a new level also stays,
   because its neighbours disagree. A run of three years or more is a level
   that held, not a spike.
4. **Unconfirmed jump.** If the latest surviving value is more than 15 points
   from the surviving value before it, it is dropped (`unconfirmed_jump`).
   With no later year, a spike and a level shift look the same, so a genuine
   shift waits one release to be confirmed, and the year before is emitted.

"Adjacent" means adjacent in the series: a gap year does not break it. A value
dropped by the floor is never used as a neighbour, and a value dropped as a
spike never decides whether the next value is one. The latest year that
survives is emitted. Unit tests in `ilostat.test.ts` hold each clause, the
level shift, the overshoot, the threshold edge and the gap-year case.

## Coverage

| Test | Result |
| --- | --- |
| Countries with a derivable share | 50 / 53 |
| No share at all | IND, CHN, HTI (IND has 2010 rows only, with no 12-months-or-more aggregate) |
| Held: every year failed the gate | KOR, MEX, PER, PHL, SLV, URY |
| Emitted | **44 / 53** |
| Emitted at 2024 or later | 36 |
| Emitted before 2020 | CUB 2010, NIC 2012, ETH 2013, JPN 2017, VEN 2017 |
| Values dropped by the gate | 78 country-years in 11 countries |
| Household survey rather than LFS | BRA, HND, KEN, PRY emitted (PER, SLV held) |
| ARG | urban only (EPH) |
| Source tier | `international_organization` |
| Treatment | `indicator`, `adapter` ingest |

Nothing is imputed or carried forward. A country with no surviving year is
held and simply missing from the row.

## Brazil

Brazil's value is **30.2% in 2025**, from **PNAD Contínua**, which ILOSTAT
labels `HS - Pesquisa Nacional por Amostra de Domicílios Contínua`: a
household survey, not a labour force survey. It is the only survey ILOSTAT
holds for Brazil with a duration split; the older PNAD rows for 2010 to 2013
carry the total and no 12-month row, so they cannot produce a share. The 2025
value is 1,918.924 thousand unemployed for 12 months or more over 6,345.526
thousand unemployed, with no not-stated duration row reported. The row has no
ILO status flag and passed every clause of the gate.

The series, all PNAD Contínua: 2016 38.0, 2017 39.5, 2018 39.6, 2019 39.2,
2020 33.8, 2021 45.6, 2022 40.3, 2023 34.1, 2024 32.4, 2025 30.2. The
2020-2021 move (11.8 points) is under the jump threshold. Over 2021-2025 the
unemployed count in the same rows fell from 13,817 to 6,346 thousand while the
long-term share fell from 45.6 to 30.2, so the share's decline happened in a
shrinking pool. Which of the two meanings dominates for Brazil is a question
for the adaptability report, read against `unemployment_rate`.

Brazil's request:
`https://sdmx.ilo.org/rest/data/ILO,DF_UNE_TUNE_SEX_AGE_DUR_NB,1.0/BRA.A..SEX_T..?startPeriod=2010`

## Diagnostics from the local run

Recorded as findings, not as gates. Dataset 6.1.2, before and after the row,
from `pnpm bench score` and `pnpm bench diagnose`:

| | Before | After |
| --- | ---: | ---: |
| Adaptability r with log GDP per capita (Pearson, n 51) | 0.818 | 0.824 |
| Adaptability Spearman | 0.831 | 0.855 |
| Adaptability mean confidence (53 countries) | 0.469 | 0.558 |
| Brazil Adaptability score / confidence / observed rows | 56.6 / 0.475 / 4 | 58.6 / 0.594 / 5 |

The row's own correlation with log GDP per capita is r = 0.355 on the
normalised score (raw share r = -0.355, n 42, CUB and VEN have no GDP
series): richer countries in this frame have somewhat shorter spells. Its
wealth-attribution delta on the dimension is 0.005, and it forms no redundant
pair with another Adaptability row (`unemployment_rate` r with log GDP 0.155,
`labor_force_participation` 0.575, `electricity_transmission_losses` 0.69,
`broadband_subscriptions` 0.845). The row raises Adaptability's confidence
(O1) and leaves its wealth link where it was (O2 still missed at 0.82); the
O2 load sits on broadband, which takes the dimension to 0.69 when it is
removed.

## What the gate does not settle

- **The instrument floor is an extension.** The owner's rule had two clauses,
  a 3% floor and a 15-point jump. Applied year by year it emits MEX 2022 at
  3.1, SLV 2021 at 4.6 and URY 2021 at 19.9, each one the only year of an
  otherwise sub-1% to sub-3% questionnaire that clears 3%, and MEX and SLV
  would then take the best cells in the frame on a measurement quirk. The
  third clause removes them by the same reasoning as the floor. It is one
  constant and one branch to remove if the owner prefers the literal rule.
- **ETH is emitted at 2013, 53.9.** Its only other year, 2021 at 2.6, is under
  the floor. The issue #26 memo read the pair as a questionnaire break. The
  gate has no basis to drop the 2013 value: it has no neighbour to jump from
  and clears the floor. The recency term marks it down.
- **PAN is emitted at 2024, 16.6.** Its 2025 value, 38.2, jumps 21.6 points
  and is flagged unreliable by the ILO; it waits for 2026 to confirm it.
- **ILO's own `U` flag is not a gate clause.** ARE, ARG, FIN, FRA and KEN are
  emitted on rows the ILO flags as unreliable. The flag is in each note.
- **Values differ from the issue #26 table** in a few places: URY 2021-2022
  read 19.9 and 45.8 today (17.5 and 21.8 in the memo), SLV 2023 reads 21.6
  (21.4). ILOSTAT revises in place, which is why the retrieval date is the
  release identifier.

## Emitted values

The committed `data/observations/ilostat-ltu.json`, retrieved 2026-10-01.

| ISO3 | Year | Share (%) | Survey | Not stated (%) | ILO status |
| --- | ---: | ---: | --- | ---: | --- |
| ARE | 2025 | 43.8 | LFS - Labour Force Survey | 1.6 | flagged unreliable by ILO |
| ARG | 2025 | 30.1 | LFS - Encuesta Permanente de Hogares, Urbano | 0.2 | flagged unreliable by ILO |
| AUS | 2025 | 21.8 | LFS - Labour Force Survey | 0 |  |
| BOL | 2025 | 21.4 | LFS - Encuesta Continua de Empleo | 6 |  |
| BRA | 2025 | 30.2 | HS - Pesquisa Nacional por Amostra de Domicílios Contínua | 0 |  |
| CAN | 2025 | 7.6 | LFS - Labour Force Survey | 3.7 |  |
| CHE | 2025 | 33.5 | LFS - Enquête sur la Population Active | 2.7 |  |
| CHL | 2025 | 19.4 | LFS - Encuesta Nacional de Empleo | 23.3 |  |
| COL | 2025 | 28.9 | LFS - Gran Encuesta Integrada de Hogares | 12.7 |  |
| CRI | 2025 | 12.3 | LFS - Encuesta Continua de Empleo | 13.8 |  |
| CUB | 2010 | 15.6 | LFS - Encuesta Nacional de la Ocupación | 0 |  |
| DEU | 2025 | 27.9 | LFS - EU Labour Force Survey | 0 |  |
| DOM | 2025 | 15.7 | LFS - Encuesta Nacional Continua de Fuerza de Trabajo | 2.7 |  |
| ECU | 2025 | 13.4 | LFS - Encuesta Nacional de Empleo, Desempleo y SubEmpleo | 0 |  |
| ESP | 2025 | 32.1 | LFS - EU Labour Force Survey | 0 |  |
| EST | 2025 | 23.8 | LFS - Labour Force Survey | 0 |  |
| ETH | 2013 | 53.9 | LFS - National Labor Force Survey | 0 |  |
| FIN | 2025 | 25.5 | LFS - EU Labour Force Survey | 1.6 | flagged unreliable by ILO |
| FRA | 2025 | 23.1 | LFS - Enquête sur l'emploi | 0.3 | flagged unreliable by ILO |
| GBR | 2025 | 23.7 | LFS - Labour Force Survey | 1.1 |  |
| GTM | 2025 | 21.1 | LFS - Encuesta Nacional de Empleo e Ingresos | 5.1 |  |
| HND | 2025 | 34.2 | HS - Encuesta Permanente de Hogares de Propósitos Múltiples | 16.1 |  |
| IDN | 2023 | 35 | LFS - National Labour Force Survey | 2.3 |  |
| IRL | 2025 | 23.4 | LFS - EU Labour Force Survey | 0 |  |
| ISR | 2025 | 8.7 | LFS - Labour Force Survey | 27.4 |  |
| JPN | 2017 | 35.3 | LFS - Labour Force Survey | 0 |  |
| KEN | 2021 | 59 | HS - Continuous household survey | 0.4 | flagged unreliable by ILO |
| MYS | 2022 | 8.3 | LFS - Labour Force Survey | 0 |  |
| NGA | 2024 | 56.1 | LFS - Unemployment, Under-employment Watch | 2.4 | break in series |
| NIC | 2012 | 8.1 | LFS - Encuesta Continua de Hogares | 0.8 | break in series |
| NLD | 2025 | 14.1 | LFS - EU Labour Force Survey | 2.7 |  |
| PAN | 2024 | 16.6 | LFS - Encuesta de Mercado Laboral | 0 |  |
| POL | 2025 | 28.8 | LFS - SWITCH TO EULFS | 0 |  |
| PRT | 2025 | 36.8 | LFS - EU Labour Force Survey | 0 |  |
| PRY | 2025 | 23.3 | HS - Encuesta Permanente de Hogares Continua | 12 |  |
| RWA | 2025 | 19.9 | LFS - Enquête sur la Population Active | 21.8 |  |
| SGP | 2025 | 10.5 | LFS - Labour Force Survey | 0 |  |
| SWE | 2025 | 20.8 | LFS - EU Labour Force Survey | 1.4 |  |
| THA | 2025 | 10.1 | LFS - Labour Force Survey | 7.1 |  |
| TUR | 2025 | 26.5 | LFS - Household Labour Force Survey | 20.2 |  |
| USA | 2025 | 13.8 | LFS - Current Population Survey | 0 | break in series |
| VEN | 2017 | 17.9 | LFS - Encuesta de Hogares por Muestreo | 29.8 |  |
| VNM | 2024 | 19.4 | LFS - Labour Force Survey | 0 |  |
| ZAF | 2024 | 76.5 | LFS - Quarterly Labour Force Survey | 0.4 |  |

## Every value the gate dropped

As printed by `pnpm bench ilostat fetch` on 2026-10-01. Shares are rounded
to one decimal.

| ISO3 | Year | Share (%) | Reason | Survey |
| --- | ---: | ---: | --- | --- |
| CAN | 2020 | 2.9 | `below_floor` | LFS - Labour Force Survey |
| ETH | 2021 | 2.6 | `below_floor` | LFS - National Labor Force Survey |
| GTM | 2011 | 31.2 | `spike` | LFS - Encuesta Nacional de Empleo e Ingresos |
| GTM | 2023 | 1.9 | `below_floor` | HS - Encuesta Nacional de Condiciones de Vida |
| HND | 2013 | 1.6 | `below_floor` | HS - Encuesta Permanente de Hogares de Propósitos Múltiples |
| HND | 2014 | 39.3 | `spike` | HS - Encuesta Permanente de Hogares de Propósitos Múltiples |
| KOR | 2010 | 0.3 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2011 | 0.4 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2012 | 0.3 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2013 | 0.4 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2014 | 0.2 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2015 | 0.2 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2016 | 0.4 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2017 | 0.7 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2018 | 0.8 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2019 | 0.4 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2020 | 0.3 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2021 | 0.7 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2022 | 0.6 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2023 | 0.5 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2024 | 0.3 | `below_floor` | LFS - Economically Active Population Survey |
| KOR | 2025 | 0.5 | `below_floor` | LFS - Economically Active Population Survey |
| MEX | 2010 | 1.9 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2011 | 2.1 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2012 | 1.8 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2013 | 1.7 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2014 | 1.6 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2015 | 1.7 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2016 | 2 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2017 | 2 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2018 | 1.5 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2019 | 1.7 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2020 | 1.1 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2021 | 4.4 | `instrument_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2022 | 3.1 | `instrument_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2023 | 2.3 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2024 | 2.2 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| MEX | 2025 | 2.2 | `below_floor` | LFS - Encuesta Nacional de Ocupación y Empleo |
| PAN | 2025 | 38.2 | `unconfirmed_jump` | LFS - Encuesta de Mercado Laboral |
| PER | 2018 | 0.8 | `below_floor` | HS - Encuesta Nacional de Hogares |
| PER | 2020 | 0.1 | `below_floor` | HS - Encuesta Nacional de Hogares |
| PER | 2021 | 0.4 | `below_floor` | HS - Encuesta Nacional de Hogares |
| PHL | 2010 | 0.6 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2011 | 0.5 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2012 | 0.5 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2013 | 0.3 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2014 | 0.4 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2015 | 0.5 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2016 | 0.4 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2017 | 0.3 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2018 | 0.2 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2019 | 0.2 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2020 | 0.5 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2021 | 0.5 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2022 | 0.5 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2023 | 0.3 | `below_floor` | LFS - Labour Force Survey |
| PHL | 2024 | 0.2 | `below_floor` | LFS - Labour Force Survey |
| SLV | 2020 | 1.4 | `below_floor` | HS - Encuesta de Hogares de Propósitos Múltiples |
| SLV | 2021 | 4.6 | `instrument_floor` | HS - Encuesta de Hogares de Propósitos Múltiples |
| SLV | 2022 | 2.1 | `below_floor` | HS - Encuesta de Hogares de Propósitos Múltiples |
| SLV | 2023 | 21.6 | `instrument_floor` | HS - Encuesta de Hogares de Propósitos Múltiples |
| SLV | 2025 | 1.3 | `below_floor` | HS - Encuesta de Hogares de Propósitos Múltiples |
| URY | 2010 | 0.7 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2011 | 0.7 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2012 | 0.7 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2013 | 0.5 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2014 | 0.5 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2015 | 0.5 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2016 | 0.4 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2017 | 0.4 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2018 | 0.4 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2019 | 0.8 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2020 | 0.5 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2021 | 19.9 | `instrument_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2022 | 45.8 | `instrument_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2023 | 1.1 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2024 | 0.5 | `below_floor` | LFS - Encuesta Continua de Hogares |
| URY | 2025 | 0.5 | `below_floor` | LFS - Encuesta Continua de Hogares |

## Reproduction

```text
pnpm bench ilostat fetch
pnpm bench score
pnpm bench diagnose
```

The adapter is `packages/core/src/pipeline/adapters/ilostat.ts`, with tests in
`ilostat.test.ts` beside it; the source identifiers live in
`packages/core/src/model/source-catalog.ts`, and the output is
`data/observations/ilostat-ltu.json`. The fetch prints every dropped value.
