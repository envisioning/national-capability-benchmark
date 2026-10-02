# What could fix A16

Task: A16 (Adaptability rests on two rows in nine countries) names three
fixes. Triage them at the desk under D117 and D118, plus anything better:
construct first, then the ceiling against the 53, the regime test of A13,
redundancy, and only then the correlation with log GDP per capita, printed
and deciding nothing. Test D141's alternative too.

Track: source-backed measurement. Desk triage plus value preflights. Nothing
is wired: no registry row, adapter, observation, decision, artefact, version
or changelog changed.

Date: 2026-10-02. Dataset 8.1.0. Each construct paragraph below was written
before the values under it were pulled. ILOSTAT was read through the SDMX
endpoint the D120 adapter uses (`https://sdmx.ilo.org/rest/data/ILO,{flow},1.0/...`,
`Accept-Language: en`), the Atlas of Economic Complexity through its public
GraphQL endpoint (`https://atlas.hks.harvard.edu/api/graphql`), retrieved
2026-10-02.

## The nine and the arithmetic

Adaptability counts five rows toward coverage: the unemployment rate, the
long-term unemployment share, export concentration and two gaps
(`disaster_preparedness`, `institutional_responsiveness`). South Korea,
India, Mexico, Peru, Uruguay, China, the Philippines, El Salvador and Haiti
are observed on two, coverage 0.4, confidence 0.38. The other 44 are on
three. A new row that covers all 53 moves the denominator to six, so the nine
go to 3/6 and the 44 to 4/6.

The simulation reruns the scorer's own arithmetic in Python: Tukey fences at
three IQRs, min-max over the clipped values, the mean of observed rows, the
two-year grace and twelve-year recency decay, and the tier weights. It
reproduces every published Adaptability score to within 0.1 and every
confidence to within 0.001. "Guardrail" is the correlation of each country's
mean confidence across the nine dimensions with log GDP per capita, with only
Adaptability changed.

| Run | Scored | Mean confidence | Bottom quarter | Score r log GDP (n 51) | Guardrail |
| --- | ---: | ---: | ---: | ---: | ---: |
| Dataset 8.1.0 | 53 | 0.522 | 0.390 | 0.456 | 0.286 |
| D141 alternative: no score below three rows | **44** | 0.522 | 0.390 | 0.429 (n 42) | 0.286 |
| + new export products rate (Atlas, tier 0.85) | 53 | **0.577** | **0.468** | **0.433** | **0.274** |
| + new export products rate (tier 0.95) | 53 | 0.593 | 0.484 | 0.433 | 0.274 |
| + time-related underemployment, survey (46) | 53 | 0.562 | 0.389 | 0.578 | 0.296 |
| + time-related underemployment, ILO modelled (53) | 53 | 0.593 | 0.484 | 0.580 | 0.274 |
| Unemployment rate replaced by LU2, ILO modelled | 53 | 0.522 | 0.390 | 0.578 | 0.286 |
| + new export products + time-related underemployment, survey | 53 | 0.604 | 0.456 | 0.530 | 0.285 |
| + new export products, and no score below three rows | 53 | 0.577 | 0.468 | 0.433 | 0.274 |

**D141's alternative.** Holding Adaptability below three observed rows
removes the score from exactly the nine and nobody else: every other country
has all three rows. 44 countries keep a score. Confidence is unchanged,
because a held score still publishes its confidence. Four of the current top
ten (Mexico, China, El Salvador, India) leave the ranking with it. If the new
export products row in recommendation 1 lands, no country is below three and
the alternative costs nothing, so it could be adopted as a floor for this
dimension at the same release.

## Ranked triage

| Rank | Candidate | Construct | Ceiling of 53 (current) | Of the nine | Regime test (A13) | Redundancy | r log GDP (printed) | Cost | Verdict |
| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | New export products rate (Atlas, HS92 4-digit, RCA < 0.5 in 2009-11 to RCA >= 1 in 2022-24, over products available) | behaviour: the economy moving into new lines | 53 at 2024 | 9 of 9 | passes, with two traps: entrepot hubs (ARE, NLD, SGP) and sanctioned trade (CUB, VEN) | 0.54 with export concentration, 0.08 unemployment, -0.04 LTU, 0.18 economic fitness | 0.18 normalised | one CC0 file (Dataverse) or the GraphQL API | **preflight, indicator** |
| 2 | Informal employment share, SDG 8.3.1 (`DF_SDG_0831_SEX_ECO_RT`) | structure of the labour market; sign not defensible | 43, 32 at 2024 or later; no USA, CAN, AUS, JPN, SGP, ISR, MYS, CHN, PHL, CUB | 7 of 9 (no CHN, PHL; HTI 2012; KOR 2019, one panel year) | passes | 0.14 unemployment, -0.07 LTU, -0.42 export concentration | -0.90 raw | ILOSTAT, same adapter family | **not an indicator; publish as a condition** (check if the owner prefers) |
| 3 | Time-related underemployment rate, survey (`DF_EMP_XTRU_SEX_RT`) | slack inside employment: workers who want and can take more hours | 46, 39 at 2024 or later; no IND, MEX, CHN, JPN, MYS, VEN, CUB | 6 of 9 (no IND, MEX, CHN) | passes | -0.18 unemployment, -0.19 LTU, -0.45 export concentration | 0.60 normalised | ILOSTAT, same adapter family | **hold**: misses the three that matter and reads slack, not reallocation |
| 4 | Same, ILO modelled (`DF_EMP_2TRU_SEX_AGE_RT`) | as 3 | 53, projected to 2027 | 9 of 9, but IND, MEX, CHN are imputed | passes | as 3 | 0.56 raw | ILOSTAT | **dead**: the nine that need it are the ones the model imputes |
| 5 | LU2 (unemployment plus time-related underemployment), modelled, in place of the unemployment rate | slack, broader | 53 | 9 of 9, three imputed | passes | 0.69 with the unemployment rate | 0.50 raw | ILOSTAT | **dead**: does not add a row, moves the score toward income (0.456 to 0.578) and leaves the nine on two rows |
| 6 | LU3 and LU4, survey (`DF_LUU_XLU3_SEX_RT`, `XLU4`) | slack including the potential labour force | 42 | 5 of 9 (no IND, MEX, PER, CHN); KOR LU4 2014 | passes | 0.90 (LU3) and 0.70 (LU4) with the unemployment rate | 0.30 and 0.54 raw | ILOSTAT | **dead**: ceiling, and LU3 is the unemployment rate again |
| 7 | LU3, LU4 and informality, ILO modelled (`DF_LUU_2LU4_SEX_RT`, `DF_EMP_2IFL_SEX_RT`) | | **0**: ILOSTAT serves these at regional aggregate only | | | | | | **dead** |
| 8 | Unemployment duration for the nine, any band (ILOSTAT, OECD, national LFS) | as `long_term_unemployment_share` | 0 of the 9 pass the gate | 0 | | | | | **dead**: the instrument, not the threshold |
| 9 | Recovery after the 2020 shock from `worldbank.json` (years to regain 2019 GDP per head; unemployment rise and persistence) | outcome of one shock, confounded by trend growth and shock size | 51 (GDP), 53 (unemployment) | 9 of 9 | passes | not tested | not computed | already ingested | **dead on construct**; usable as narrative |
| 10 | Labour market transition rates | behaviour: flows between states | none: ILOSTAT publishes no flows dataflow among its 1,215; OECD flows cover a few members | 0 | | | | | **dead** |
| 11 | Firm entry and exit churn | behaviour | entry is `new_business_density` in Agency; exit has no source near 27 (OECD business demography is members only, GEM exit is 29 and held under D125) | | | | | | **dead** |
| 12 | Sectoral reallocation speed (Lilien index on ILOSTAT employment by activity) | turbulence, sign not defensible | about 50 with breaks at ISIC revisions | | | | | ILOSTAT | **dead at the desk**: high dispersion is churn or collapse |

## Candidate notes

### 1. New export products rate

**Construct (written first).** Adaptability asks whether a country can
absorb a shock and reallocate. Export concentration (D119) reads the result
of past reallocation as a standing mix and says in its own overturning
clause that "entry into new export products" would answer the construct more
directly. The Growth Lab's new-product measure is that entry: a product the
country did not export competitively at the start of a window (revealed
comparative advantage under 0.5) and does at the end (RCA of 1 or more). It
is behaviour, an economy moving capital and workers into lines it was not in,
and it is not a stock money buys. Counted over the products a country had
room to enter, it does not reward a basket that was already broad.

**Definition used in the preflight.** HS92 at 4 digits. New = mean RCA under
0.5 over 2009-2011, mean RCA of 1 or more over 2022-2024, and mean exports of
at least USD 1 million over 2022-2024. Rate = new products over products with
mean RCA under 0.5 in 2009-2011, in percent. Three-year means at both ends
damp single-year noise.

**Source.** Harvard Growth Lab, Atlas of Economic Complexity, "International
Trade Data (HS, 92)" on Harvard Dataverse, `doi:10.7910/DVN/T4CHWJ`, version
18.0 released 2026-04-22, licence CC0 1.0, file
`hs92_country_product_year_4.csv` (UN Comtrade, reconciled from exporter and
importer reports by the Growth Lab). The same data are served by the public
GraphQL endpoint (`countryProductYear`, `productClass: HS92`,
`productLevel: 4`), which the preflight used. One file serves the frame. The
adapter would pin the Dataverse version and the file checksum, as the UNCTAD
adapter does. Tier: the publisher is an academic group; `academic_survey`
(0.85) was used, 0.95 is shown for comparison.

**Ceiling and spread.** 53 of 53 at 2024. Rate from 0.36 (Cuba) to 8.23
(Poland): Poland 8.2, Vietnam 7.3, UAE 7.3, Turkey 7.2, Estonia 6.9, India
6.6 ... Brazil 2.4 ... Uruguay 1.1, Chile 1.1, Switzerland 1.0, Ecuador 0.9,
Haiti 0.7, Cuba 0.4. No value reaches a Tukey fence.

**Stability.** Rank order against other windows: Spearman 0.94 with a 10-year
window (2012-2014 to 2022-2024), 0.94 with the window ending 2019-2021, 0.92
between the windows ending 2019-2021 and 2021-2023. The rate is a property of
the country, not of the year chosen.

**The nine.** India 6.59 (6th of 53), China 5.59 (9th), the Philippines 4.83,
South Korea 4.53, El Salvador 1.53, Mexico 1.44, Peru 1.23, Uruguay 1.09,
Haiti 0.73. Mexico's raw count is 12 new products, but they carry 9.3% of its
2024 exports, so a value-weighted variant would read Mexico differently;
the count over room is the variant chosen here because the value share is
dominated by resource finds (Argentina 25% from oil and gas, the United States
5.7%).

**Regime test (A13).** The reading does not sort by regime: closed and
electoral autocracies sit at both ends (Vietnam 7.3, China 5.6, the UAE 7.3,
Cuba 0.4), and so do democracies (Poland 8.2, Switzerland 1.0). Two traps
must be stated in the registry note and checked in the preflight. Entrepot
hubs (UAE, the Netherlands, Singapore) export what passes through them, so
re-exports can read as entry; the Growth Lab's cleaning handles some of this
and the preflight has to say how much. Sanctions shape what Cuba and
Venezuela can sell and to whom, and their flows are mirrored from partner
reports. If the preflight finds either effect moves a country by more than
noise, the treatment is a published gate in the manner of D120 and D145,
never a named list.

**Redundancy.** Normalised against the existing rows: export concentration
0.54, unemployment rate 0.08, long-term share -0.04. Against economic
fitness in Building, 0.18 raw (Spearman 0.39). Below the 0.85 flag
everywhere. The overlap with export concentration is expected (both read
the same basket) and is about half of what would make it a duplicate.

**Income (printed, not deciding).** Raw and normalised r with log GDP per
capita 0.18 (n 51). Adaptability's correlation with income moves from 0.456
to 0.433.

**Effect.** Mean confidence 0.522 to 0.577, bottom quarter 0.390 to 0.468,
guardrail 0.286 to 0.274. The nine go from 0.38 to 0.46 and from two rows to
three. Scores move for every country (Spearman 0.79 between the two orders),
because a third of each score is now the new row.

| Country | 8.1.0 | With the row |
| --- | --- | --- |
| Mexico | 88.0, 6th | 63.2, 29th |
| China | 87.0, 7th | 80.1, 7th |
| El Salvador | 86.5, 8th | 62.7, 32nd |
| India | 85.4, 10th | 83.4, 4th |
| South Korea | 83.4, 13th | 73.2, 13th |
| Philippines | 74.5, 34th | 68.6, 24th |
| Peru | 70.4, 39th | 50.6, 46th |
| Uruguay | 64.8, 44th | 46.3, 49th |
| Haiti | 31.6, 52nd | 22.6, 53rd |

Elsewhere: the United States 88.4 (5th) to 71.5 (17th), Cuba 82.9 to 62.2,
Ecuador 80.9 to 62.4, Brazil 73.7 (35th) to 61.7 (37th), Switzerland 65.3 to
51.1, the UAE 68.7 (41st) to 73.6 (11th). The top ten becomes Poland,
Vietnam, Thailand, India, the Netherlands, Israel, China, Turkey, Estonia,
Malaysia. Two of A16's four top-ten names leave it (Mexico, El Salvador) on
evidence that observes reallocation; two stay (China, India) on evidence that
they did reallocate. That is the row disagreeing with the unemployment rate
where it should, not the row agreeing with income.

**Traps.** Merchandise only, so services exporters (the United States, the
United Kingdom, India's IT sector) are read on goods. Fifteen years is a slow
window and the row will move little between releases. Resource discoveries
count as entry when they cross the RCA line (Argentina and the United
States show this in the value share, less in the count).

### 2. Informal employment share (SDG 8.3.1)

**Construct (written first).** The share of employment that is informal
describes how a labour market is built: whether work carries a contract,
social protection and registration. It is the context A16 says the
unemployment rate lacks, because where most work is informal a person who
loses a job takes any work within weeks. It does not observe reallocation,
and its sign for Adaptability cannot be defended: informal work is both the
flexibility that absorbs a shock and the precarity that stops a worker moving
up. That is the test it fails as an indicator: no defensible direction.

**Ceiling.** 43 of 53. Missing the United States, Canada, Australia, Japan,
Singapore, Israel, Malaysia, China, the Philippines and Cuba. 28 at 2025, 32
at 2024 or later; Haiti 2012, Nicaragua 2012, Venezuela 2017, Honduras 2017,
the United Kingdom 2018, Korea and Kenya 2019.

**Harmonisation.** Weak across income groups. The EU members come from
EU-SILC (`HIES - EU Statistics on Income and Living Conditions`), an income
survey with a proxy definition, and read 1% to 6% (the United Kingdom 19.8%
in 2018 on the same source). Korea's one value, 29.1% for 2019, is from a
panel survey. The rest come from ILO processing of labour force and household
survey microdata under the 17th or 21st ICLS. ILOSTAT's modelled informality,
which would fill the gaps, is published at regional aggregate only.

**Does it disambiguate?** For a reader, partly. Of the nine, India 87.2%,
Haiti 91.6% (2012), Peru 70.5%, El Salvador 63.6% and Mexico 56.9% are
marked as informal markets, which is the reading A16 needs printed beside a
low unemployment rate; Uruguay 32.7% and Korea 29.1% are not; China and the
Philippines have no value. Across the frame it barely tracks the unemployment
rate (r -0.12, Spearman -0.23, n 43), so it does not explain low unemployment
in general: Thailand (0.8% unemployed, 63% informal) and the UAE (2.2%, 4%)
are both low. It changes no score. Raw r with log GDP per capita -0.90 (n
42): in this frame it is very nearly income.

**Treatment.** It is not a reading of the capability the model declined to
score, which is what D60 makes a check; it is a fact about the labour market
the capability works through, which is what D122 makes a condition, the
same reasoning D141 gave for labour force participation. Published as a
condition beside Adaptability it prints with its year and its rank of 43,
next to participation, where a reader of India's 4.2% unemployment would see
both. If the owner prefers a check, the test to name is the direction test
above, with harmonisation as the second.

### 3 to 7. Underutilisation measures

**Construct (written first).** Time-related underemployment counts the
employed who work fewer hours than a threshold and want and can take more. In
informal markets slack shows here rather than as open unemployment, so it is
a better slack measure where informality is high. It is still slack. It does
not observe anyone moving after a shock, so adding it makes Adaptability read
labour market slack twice and reallocation once.

The survey series reaches 46, and the three it misses are India, Mexico and
China, three of A16's four top-ten names. The ILO modelled series reaches 53
and is projected to 2027, but for those three it is imputed by the ILO's
model, which uses income among its predictors; the unemployment rate row is
also the ILO modelled estimate, but there the model is anchored by national
unemployment data in all three. Simulated as a sixth row it moves Adaptability's income
correlation from 0.456 to 0.578 and reorders the nine much less than row 1
(Mexico 6th to 17th on the modelled series, unchanged on the survey series
where it has no value). LU2 in place of the unemployment rate does the same
to income and adds no row. LU3 is the unemployment rate plus the potential
labour force and correlates 0.90 with it. ILOSTAT serves modelled LU3, LU4
and informality at regional level only.

### 8. Unemployment duration for the nine

**ILOSTAT, every survey and every band.** Retrieved 2026-10-02 from
`DF_UNE_TUNE_SEX_AGE_DUR_NB`, both sexes, 15 and over:

- **South Korea** (Economically Active Population Survey): 12 months or more
  0.2% to 1.1% of the unemployed in every year from 2005 to 2025; under one
  month 33% to 39%. The survey requires a search in the last four weeks and
  long searchers leave unemployment for inactivity.
- **Mexico** (ENOE): 1.1% to 4.4%, 2.2% in 2025; 46% under one month.
- **Peru**: ENAHO (household survey) 0.1% to 1.2% where published, and the
  new Permanent Employment Survey from 2022 records nobody past six months
  (99.9% to 100% under six months).
- **Uruguay** (ECH): 0.4% to 1.1% outside 2021 and 2022, when 19.9% and
  45.8% coincide with 12.2% and 52.3% of the unemployed with no stated
  duration, a questionnaire change, not a labour market.
- **Philippines** (LFS): 0.2% to 1.2%; 58% under one month.
- **El Salvador** (EHPM, a household survey): 1.3% to 4.6% with a 21.6% spike
  in 2023 that the series returns from.
- **India**: National Sample Survey 2005 and 2010 only, with no 12-months
  band. PLFS microdata are processed by ILOSTAT for informality but no
  duration table is published.
- **China, Haiti**: nothing.

**A shorter band does not rescue it.** The share of the unemployed out of
work six months or more, computed the same way across the frame (latest
year, labour force survey preferred), puts the same six countries in a
cluster of their own: the Philippines 1.3, Peru 2.3, Uruguay 3.8, El Salvador
5.3, Mexico 6.5, Korea 6.7, then a gap to Nicaragua 17.5, Malaysia 19.5 and
Singapore 20.2, with the other 41 between 17.5 and 85.0. A 6-month row would
pass four of the six through a 3% floor and hand them the best cells in the
frame, which is the failure the instrument floor in D120 exists to stop. The
signature is the questionnaire at every band.

**OECD and national tables.** OECD's duration tables for Korea and Mexico
are built from the same two surveys, so they cannot be the independent second
source D120's overturning clause asks for. Building India's share from PLFS
unit records would be a harmonisation this project authors for one country,
which the roadmap's cost question rules out.

### 9. Recovery after 2020, from data already ingested

**Construct (written first).** How fast employment or output regains its
pre-shock level after a common shock is the closest outcome to "absorb and
reallocate". `worldbank.json` holds GDP per head (PPP, constant) from 1990
and the unemployment rate from 1991, so it is computable without a source.

It fails on construct. One shock, of very different size by country
(lockdown stringency, tourism), and a recovery measured in years rewards
trend growth: China, Vietnam, Ireland, Turkey and Ethiopia never fell in
2020-2021 on GDP per head, India and Korea recovered in two years, South
Africa, Nigeria and Haiti have not recovered. Every recession episode since
1990 (mean years to regain the previous peak) has the same problem and
leaves China, Vietnam, the UAE, Venezuela, Cuba and Haiti without a
completed episode. The unemployment side reads the ILO model where a survey is
missing. The 2020 sequence is narrative for a country report, as the OxCGRT
memo found for response speed.

## Recommendations

At most two, in order.

1. **Wire the new export products rate as an Adaptability indicator**, class
   `O`, `higher_better`, unit "% of products not exported competitively at
   the start of the window", from the Growth Lab's HS92 4-digit file on
   Dataverse (CC0, pinned by version and checksum), through a small adapter
   that computes the rate with the windows and thresholds above and states
   them in the observation note. Tier `academic_survey`. Reason: it is the
   observation D119's own overturning clause names, it covers all 53 at 2024,
   it is stable across windows (Spearman 0.92 to 0.94), and it is the only
   candidate that gives all nine a third row on evidence about reallocation
   rather than slack. Effect: mean confidence 0.522 to 0.577, the nine 0.38
   to 0.46, Adaptability r with log GDP 0.456 to 0.433, guardrail 0.286 to
   0.274. Mexico and El Salvador leave the top ten, China and India stay.
   The preflight must settle the two regime traps (entrepot re-exports,
   sanctioned trade) before wiring. It needs a decision entry and a dataset
   version (under the D37 rule a row added with no country added is minor,
   though every Adaptability score moves). With it, D141's alternative
   (no Adaptability score below three rows) costs no country and could be
   adopted in the same change.

2. **Publish informal employment (SDG 8.3.1) as a condition beside
   Adaptability**, unscored, under D122, with the EU-SILC proxy and the
   missing ten named in its note. Reason: it is the context A16 asks for
   beside a low unemployment rate (India 87%, Peru 71%, El Salvador 64%,
   Mexico 57%), the same kind of fact as labour force participation, which
   D141 already moved to that layer; but its direction for Adaptability is
   not defensible, its harmonisation is weak across income groups, and it
   misses China and the Philippines. It changes no score or confidence. A
   check (D60) is the fallback, naming the direction test as the one it
   fails.

Not recommended: time-related underemployment and LU2 to LU4 (slack, not
reallocation; the survey series misses India, Mexico and China and the
modelled series imputes them), any duration route for the nine (the
instrument, at every band), recovery from 2020 (construct), flows, firm
exit and sectoral reallocation (no source, or no sign). If recommendation 1
fails its preflight, D141's alternative is what is left: nine countries lose
an Adaptability score, 44 keep one, and that is a decision and a major
version.
