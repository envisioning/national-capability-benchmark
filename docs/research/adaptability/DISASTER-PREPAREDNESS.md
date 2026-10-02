# Disaster preparedness: desk triage

Task: Adaptability, desk triage for the declared gap `disaster_preparedness`
(Q2 in `docs/RESEARCH-ROADMAP.md`)

Track: source-backed, check candidate under D60

Status: **triage complete, 2026-10-02.** Eleven candidate sources considered.
Ten fail on construct, coverage or recency. One, the World Risk Poll's
"received a warning before the disaster" item, survives triage as a check
candidate. It is not fit to score. Recommended outcome below. Nothing is wired:
no registry, adapter, observation or output file changes. Dataset 7.7.0.

## The question

The gap is "Demonstrated capacity to prepare for and recover from major
shocks" (`packages/core/src/model/indicators.ts`, `disaster_preparedness`,
`ingest: 'gap'`, measurement class C). The registry names INFORM / UNDRR as the
publisher family and rejects INFORM because it "is largely a hazard-exposure
index". That note is imprecise. INFORM publishes its lack of coping capacity
dimension separately from hazard and exposure, so geography is not the reason
to reject it. Candidate 4 below gives the reason that holds.

The operative word in the definition is *demonstrated*. A candidate has to
observe a country preparing for or recovering from a real shock. A plan that
exists, a stock of hospitals, roads and phones, or a government's grade of
itself does not meet that.

## Method

D118 order. The construct verdicts below were written on 2026-10-02 from the
publishers' documentation before any value of the World Risk Poll, Sendai
Framework Monitor, SPAR or EM-DAT series was read. One exception: the World
Bank catalogue search (`pnpm bench probe --search "risk reduction"`) led to a
`--series` probe of `EN.CLC.DRSK.XQ`, which prints coverage, recency and r
together. That series is dead on recency (2011) whatever its construct.

Only the candidate that passed construct earned a value preflight. For it:
coverage against the 53 registry countries, spread, wave-to-wave stability,
the A13 regime test (mean by V-Dem Regimes of the World, `v2x_regime` 2024 as
served by Our World in Data's `political-regime` grapher: 5 closed autocracies
ARE CHN CUB HTI VNM, 13 electoral autocracies, 20 electoral democracies, 15
liberal democracies), redundancy against the normalised values of the scored
Adaptability rows, and last, r with log GDP per capita (the `diagnostics.json`
income series) and with the Adaptability score. These are reported and decide
nothing. The OWID regime split differs by a few countries from the one in
`docs/research/vdem-sweep/TRIAGE.md` (11 / 21 / 16 in the middle bands); the
closed autocracies are the same five.

## Candidates and construct verdicts

| # | Candidate | Publisher, series | What it observes | Verdict |
| --- | --- | --- | --- | --- |
| 1 | National DRR strategy score | UNDRR, Sendai Framework Monitor E-1, SDG series `SG_DSR_LGRGSR` (1.5.3, 11.b.1, 13.1.2) | A government's own grade of its strategy document | Fail: construct |
| 2 | Disaster losses | UNDRR SFM targets A to D; SDG 1.5.1, 1.5.2, 11.5.1 | Deaths, people affected, economic loss | Fail: construct |
| 3 | EM-DAT | CRED, UCLouvain | Events, deaths, people affected | Fail: construct and licence |
| 4 | INFORM lack of coping capacity | EC JRC, INFORM Risk | HFA self-assessment, WGI, CPI and nine stocks | Fail: construct |
| 5 | ND-GAIN readiness | University of Notre Dame | Doing Business, four WGI, ICT, enrolment, patents | Fail: construct |
| 6 | WorldRiskIndex coping and adaptive capacity | Bündnis Entwicklung Hilft, IFHV | Composite of governance, health and education stocks | Fail: construct |
| 7 | IHR self-assessment (SPAR) | WHO, SDG 3.d.1 | A government's own grade of 15 health-security capacities | Fail: construct |
| 8 | Joint External Evaluation; GHS Index | WHO; NTI and Johns Hopkins | External or expert scoring of health-security capacity | Fail: coverage, recency, construct |
| 9 | DRR progress score | World Bank `EN.CLC.DRSK.XQ` (HFA) | Hyogo Framework self-assessment | Fail: recency (2011), construct |
| 10 | Perceived government preparedness | LRF World Risk Poll `WP24198` | Whether people think the government is well prepared | Fail: construct (perception) |
| 11 | Warning received before a disaster | LRF World Risk Poll, Gallup; `WP24181` to `WP24188` (2025), `WP22248` to `WP22251` (2023) | Whether a person hit by a disaster in the last five years got a warning first | **Passes construct; preflight below** |

### 1. Sendai Framework Monitor E-1

The SDG metadata for 13.1.2 (last updated 2024-12-20, retrieved 2026-10-02,
https://unstats.un.org/sdgs/metadata/files/Metadata-13-01-02.pdf) defines E-1
as the mean of ten key-element levels of the national DRR strategy, each
entered by the country's own Sendai Framework focal point: "Member States will
assess the level of implementation for ten key elements". Validation is "by
UNDRR and national focal points". Quality management and assessment are "Not
applicable". The score observes how well a strategy document matches the
Sendai template, graded by the government that wrote it. That is adoption
self-assessed and not demonstrated, and a decree can raise it. The sibling
series `SG_DSR_SFDRR` and `SG_DSR_LEGREG` are yes/no flags for the same
documents. The Sendai G series (multi-hazard early warning) is the same kind
of self-report. Fail.

### 2. Sendai outcome targets and SDG 1.5.1

Deaths, missing and affected people per 100,000 and direct economic loss as a
share of GDP are outcomes, which is the right kind of evidence. But an outcome
is hazard times exposure times vulnerability times capacity, and a single
event sets the value: one earthquake (Turkey, February 2023) outweighs a
decade of floods. The series are also self-reported from national loss
databases, so completeness varies by country, and nothing in them carries a
hazard denominator that would let capacity be read off. Building one would
mean hazard-intensity modelling this project would author. Fail.

### 3. EM-DAT

Same construct problem as 2. In addition, the terms of use
(https://doc.emdat.be/docs/legal/terms-of-use/, retrieved 2026-10-02) forbid
users to "create substitute or derivative databases" or to redistribute "a
substantial part of EM-DAT", and access needs a registered account. A
committed derived series would breach the first clause. Fail.

### 4. INFORM lack of coping capacity

From the INFORM Concept and Methodology, version 2017 (EC JRC, retrieved
2026-10-02, SHA-256 `52d782eaef8c21e5bf469604867d15ed28cfdb2b12566e0b9afbdf3b7908c555`),
tables 15 and following: the institutional category averages the Hyogo
Framework self-assessment scores with WGI government effectiveness and the
Corruption Perceptions Index; the infrastructure category averages access to
electricity, internet users, mobile subscriptions, road density, improved
water, improved sanitation, physician density, health expenditure per head
and measles immunisation. The JRC itself notes that "Self-evaluation has a
risk of being perceived as a process of presenting inflated grades". This is
the perception layer D23 retired plus nine stocks money buys (D122). The
dimension is separate from hazard, so the registry's stated reason is wrong,
but it fails on construct.

### 5. ND-GAIN readiness

The indicator list (https://gain.nd.edu/our-work/country-index/methodology/indicators/,
retrieved 2026-10-02): economic readiness is the frozen Doing Business set;
governance readiness is four WGI series (political stability, control of
corruption, rule of law, regulatory quality), all retired here under D23;
social readiness is inequality, ICT infrastructure, tertiary enrolment and
patents, which are stocks. Fail.

### 6. WorldRiskIndex

Its coping and adaptive capacity components are the same family of governance
perceptions and health and education stocks. Not fetched. Fail on construct.

### 7. WHO SPAR, SDG 3.d.1

The States Parties Self-assessment Annual Reporting tool asks each government
to place itself on five cumulative levels for each of 15 capacities
(legislation, financing, coordination, surveillance, laboratories, human
resources, emergency management, services, IPC, risk communication, points of
entry, zoonoses, food safety, chemical, radiation)
(SDG metadata 3.d.1, https://unstats.un.org/sdgs/metadata/files/metadata-03-0d-01.pdf;
WHO SPAR second edition,
https://cdn.who.int/media/docs/default-source/health-security-preparedness/cap/spar/9789240040120-eng-new.pdf,
both retrieved 2026-10-02). It is a government's own grade of plans, laws and
laboratories, so a self-report of stocks, and it covers health emergencies
only. Fukuda-Parr (2022, *Policy and Society* 41(4),
https://academic.oup.com/policyandsociety/article/41/4/528/6645390) finds
countries scoring above 80, the United States, the United Kingdom, Sweden and
Mexico among them, among the highest COVID-19 mortality. Fail.

### 8. JEE and the GHS Index

The Joint External Evaluation is peer-reviewed, which answers the
self-assessment objection, but each evaluation is a one-off country report in
its own year, there is no single file, and not every benchmark country has
one. The GHS Index (2019, 2021) is expert-coded from public documents, has
not been updated since 2021, and ranked the United States first before 2020.
Fail on coverage and cost (JEE) and recency and construct (GHS).

### 9. World Bank DRR progress score

`EN.CLC.DRSK.XQ`, Disaster risk reduction progress score (1 to 5), WDI. The
probe on 2026-10-02 reports 33 of 53 and a latest value of 2011. It is the
Hyogo self-assessment that INFORM uses. Fail on recency before construct.

### 10. World Risk Poll: perceived government preparedness

`WP24198`, "National government is well prepared to deal with a disaster",
yes or no. A perception of the state, the kind D23 retired. Fail. It is used
below only as a probe for response style.

### 11. World Risk Poll: warning received

**Source.** Lloyd's Register Foundation World Risk Poll, fieldwork by Gallup,
about 1,000 interviews per country (3,000 in China and India), 2019, 2021,
2023 and 2025 waves. Respondents who say they were impacted by a disaster in
this country in the past five years (`WP24213` in 2025, `WP23344` in 2023)
name the most impactful one (`WP24180`, `WP22247`) and are asked whether they
received a warning about it from each of several channels: internet or apps,
radio, television, newspapers, SMS, WhatsApp, billboards and loudspeakers in
2025; internet, local government or police, radio, TV or newspapers, and
local community organisations in 2023. LRF's rule, followed here: warned if
any channel is yes, not warned if none is yes and at least one is no, dropped
if every channel is a non-response (report 2024, chart 3.1 note).

**What it observes.** Whether a warning reached a person before a disaster
that actually hit them. That is a delivery in a real event, reported by the
people it was meant to reach, which is closer to "demonstrated" than anything
else in this list. It is reported behaviour of the system, not an opinion of
it.

**Threats, named before the values were read.**

1. *Hazard mix.* Earthquakes cannot be forecast and heatwaves can: the 2024
   report gives about half unwarned for earthquakes and 94% warned for
   heatwaves. A country's rate depends on which hazard hit it. Mitigation:
   restrict to forecastable weather events (codes 1 to 4, 10 and 51 to 53:
   flood and heavy rain, cyclone, tornado, thunderstorm, blizzard, heatwave,
   sandstorm, gale).
2. *Conditional denominator.* Only respondents hit by a disaster answer, so
   the base shrinks where disasters are rare.
3. *One link of the chain.* It observes warning, not response or recovery,
   and the definition asks for both.
4. *Channels are not all public.* A warning on social media or WhatsApp may
   not come from an official source, and the 2025 wave dropped the "local
   government or police" channel.
5. *Phone stock.* SMS and app warnings need phones, which money buys.
6. *Response style under closed regimes.* A survey answer under an autocracy
   may be shaped by deference, which is the A15 caveat.

Verdict at the desk: passes construct as a check candidate, not as a score,
because threats 3 and 4 mean it observes part of the capability through a
channel the state does not fully own. It earned a value preflight.

## Release pin

| Item | Value |
| --- | --- |
| Publisher page | https://www.lrfoundation.org.uk/world-risk-poll-data, retrieved 2026-10-02: "All World Risk Poll data is freely available to download and use (with attribution)". The 2024 report carries CC BY-SA 4.0, doi.org/10.60743/c0rm-h862 |
| Archive | `https://storage.googleapis.com/wrp_shares/site_live/wrp_data.zip`, 132,331,042 bytes, Last-Modified 2026-09-02, SHA-256 `326d07eca97c816457cf33242a6ab19da1e2b8df6beb0224b8f81c1868c73403` |
| Files used | `WRP_2025.csv` (SHA-256 `060331b39ced734dd5bf87b824950a07f2acc44d55d6db03c9c63d589c3a0553`, 143,459 cases) and `WRP_2023.csv` (SHA-256 `1551cc8420aa8b12f4245094efeb85470078dc925892695925d12fb9799435db`, 146,910 cases), each with its data dictionary and README. The README says the files are a harmonised build from LRF's public-release SPSS files, dated 2026-08-31 |
| Weight | `WGT`, within-country survey weight |
| Country key | `COUNTRY_ISO3` |

Downloaded 2026-10-02 to a scratch directory. Nothing is committed.

## Coverage and spread

| Test | Result |
| --- | --- |
| Benchmark countries in the 2025 wave | 49 / 53. Missing CUB, HTI, NIC, RWA |
| In the 2023 wave | 50 / 53. Missing CUB, HTI, RWA |
| 2025, weather events, base of 30 or more | 46 / 53 (ISR 2, TUR 9, CHL 16 drop out) |
| Respondents hit, share of sample (2025) | 0.5% (ISR) to 80% (PHL) |
| Base for the weather reading (2025) | median 88; 15 countries under 60 |
| Spread, weather events, 2025 | min 14.6 (ETH), 25th 63.0, median 77.4, 75th 86.1, max 100 (ISR, n 2) |
| Spread, all natural events, 2025 | min 24.9, 25th 59.0, median 74.8, 75th 84.3, max 100 |

Turkey shows the hazard-mix problem directly. In 2025, 92% of its weighted
natural-event base is earthquake: 25.7% warned across all natural events
against 94.2% for weather events (n 9). The weather restriction is required.

Sampling error. At a base of 88 and a rate near 77%, the 95% interval is
about ±9 points before any design effect. The interquartile range is 23
points, so quartiles separate and neighbouring countries do not.

**Stability between waves.** The 2023 and 2025 five-year windows overlap
(2018 to 2023 and 2020 to 2025), with fresh samples. Weather events, base of
30 or more: Pearson 0.82, Spearman 0.78 (n 46). All natural events: 0.73 and
0.69 (n 49). Singapore moves from 42.6 to 74.2 and Chile from 79.2 to 46.4,
both on bases under 60.

## A13 regime test

Mean percentage warned, 2025, weather events, by `v2x_regime` 2024:

| Regime | n | Warned | Perceived government preparedness (`WP24198`) |
| --- | ---: | ---: | ---: |
| Closed autocracy (ARE, CHN, VNM) | 3 | 93.3 | 89.9 |
| Electoral autocracy | 11 | 66.3 | 47.4 |
| Electoral democracy | 20 | 70.3 | 26.7 |
| Liberal democracy | 15 | 78.8 | 39.9 |

Pooling both waves gives the same order (92.8, 65.5, 66.6, 80.4).

The closed autocracies read highest. Vietnam is 99.7% in 2025 and 99.5% in
2023, China 97.4% and 92.9%, against 84 to 94 for Japan, the United States
and the United Kingdom. Two readings are possible and the data cannot choose
between them. Either the reach of a party-state apparatus (loudspeakers,
mandatory cell broadcast, ward cadres) really delivers warnings, which is a
real if uncomfortable capability. Or the answers carry deference: the same
respondents call their government well prepared at 90% against 27% in
electoral democracies, and that perception item is pure response style. Outside the
closed autocracies the warned rate barely tracks the perception item (r 0.14,
n 46; 0.27 with them, n 49), which suggests the warning item is mostly not
response style elsewhere. Cuba, the textbook case of hurricane evacuation
under a closed regime, is not surveyed, so the group is three countries.

This is the A13 shape in a milder form: regime type sorts the top of the
scale, and the number cannot say whether that is capability or answer style.
It disqualifies scoring. It is the same failure that kept
`political_polarization` a check under D121.

## Redundancy

r with the normalised values of the scored Adaptability rows, 2025 weather
reading, base 30 or more (n 46, 38 for the ILOSTAT row): labour force
participation 0.27, unemployment 0.22, long-term unemployment share 0.24,
transmission losses 0.34, export diversification 0.40. With the broadband
condition, 0.47. No redundancy; the broadband figure is consistent with
threat 5.

## Findings: wealth and the Adaptability score

Reported, deciding nothing (D118). Log GDP per capita from
`data/out/diagnostics.json`, Adaptability from `data/out/index.json`, dataset
7.7.0.

| Reading | r log GDP | Spearman GDP | r Adaptability | Spearman Adaptability |
| --- | ---: | ---: | ---: | ---: |
| Weather events, 2025, base 30+ | 0.441 (n 45) | 0.372 | 0.468 (n 46) | 0.425 |
| Weather events, 2025, all bases | 0.437 (n 48) | 0.374 | 0.467 (n 49) | 0.431 |
| All natural events, 2025 | 0.369 (n 48) | 0.358 | 0.457 (n 49) | 0.469 |
| Weather events, 2023 and 2025 pooled | 0.399 (n 49) | 0.386 | 0.471 (n 50) | |

Venezuela and Cuba have no income figure; Cuba is also absent from the poll.

## Brazil

| Item | Value |
| --- | --- |
| Weather events, 2025 | 55.7% warned, base 97, rank 42 of 49 |
| Weather events, 2023 | 53.1%, base 186 |
| All natural events | 60.3% (2025), 55.0% (2023) |
| Hit by a disaster in five years | 14.2% of adults (2025), 27.4% (2023) |
| Perceived national preparedness | 16.6% say well prepared (2025) |

Brazil sits in the bottom fifth with Colombia (31.8), Argentina (40.2),
Venezuela (43.5), Chile (46.4), Panama (46.6), Nigeria, South Africa and
Indonesia, below Mexico (79.7) and Honduras (76.4). Two waves agree. For the
adaptability report this is the most direct cross-country number this triage
found: when weather disasters hit Brazilians, about 45% got no warning by any
channel. It should be quoted with the base and the interval.

## Recommendation

**Publish as a check beside Adaptability. Do not score. The gap stays
declared.**

It passes what a D60 check needs: it is real (a reported delivery in a real
event), current (2025, repeated every two years), from one publisher in one
file for the whole frame (46 / 53 at a base of 30 on weather events), and
stable across waves (Spearman 0.78). The tests it fails, and the reasons that
travel with it:

- **A13.** The three closed autocracies read highest, and the same
  respondents' perception of government preparedness shows that regime shapes
  the answers. The number cannot separate reach from deference.
- **Part of the construct.** It observes warning, not response or recovery,
  and not every channel is the state's.
- **Precision.** The base is the subset hit by a disaster: median 88, 15
  countries under 60, so neighbouring countries sit inside each other's
  interval.

Measurement rule for the adapter, if the owner accepts: latest wave, weather
events only (codes 1 to 4, 10, 51 to 53), LRF's warned rule, weighted by
`WGT`, published only where the base is 30 or more, with the base in the
observation note. Indicator id under the check prefix, for example
`__check__disaster_warning_reach`, `ingest: 'adapter'`, `pinned` naming the
archive, file and wave (D121). Cost is low: one public archive and one CSV per
wave.

What this needs from the owner: a decision entry naming the A13 failure, as
D60 requires for every check; a minor dataset version, since a published field
is added; and a correction to the registry note on `disaster_preparedness`,
which rejects INFORM for the wrong reason (candidate 4).

Triage paragraph for the roadmap:

> **`disaster_preparedness` (triage 2026-10-02).** Eleven sources considered.
> Sendai E-1, SPAR and the HFA score are governments grading themselves;
> INFORM's coping capacity, ND-GAIN readiness and WorldRiskIndex are retired
> perceptions plus stocks; Sendai losses and EM-DAT are outcomes set by the
> hazard, and EM-DAT forbids derived databases. The World Risk Poll's
> "received a warning before the disaster", restricted to weather events,
> passes construct as a check: 46 of 53 at a base of 30, waves stable at
> Spearman 0.78, r 0.44 with log GDP. It fails A13 (closed autocracies 93,
> liberal democracies 79) and is a small conditional sample, so it is a check
> candidate, not a score. Brazil 55.7%, 42nd of 49. The gap stays. Memo:
> `docs/research/adaptability/DISASTER-PREPAREDNESS.md`.

## `institutional_responsiveness`

No source different from OxCGRT turned up in this sweep. The World Risk Poll
has no item on how fast rules change, and the Sendai, INFORM and ND-GAIN
families carry nothing on it. The gap and the OxCGRT verdict stand.

## Not verified

- Sendai E-1 and SPAR coverage of the 53 countries. Both failed on construct,
  so no values were fetched.
- Whether the harmonised WRP build is LRF's own. It is served from the
  publisher's bucket and the README names `build_wrp_waves.py`, but its author
  is not stated. An adapter should check its counts against LRF's SPSS files.
- The interview mode by country in 2025. China was surveyed online (CAWI) in
  2023, unlike every other country; the 2025 mode was not checked.
- Design effects. The intervals above assume simple random sampling.

## Reproduction

```text
curl -sLO https://storage.googleapis.com/wrp_shares/site_live/wrp_data.zip
shasum -a 256 wrp_data.zip
unzip wrp_data.zip && unzip WRP_2025.zip && unzip WRP_2023.zip
# 2025: base WP24213 == 1; type WP24180; channels WP24181..WP24188.
# 2023: base WP23344 == 1; type WP22247; channels WP22248..WP22251.
# warned = any channel == 1; not warned = none == 1 and any == 2; else dropped.
# weather = type in {1,2,3,4,10,51,52,53}; weight WGT; COUNTRY_ISO3 in
# packages/core/src/model/countries.ts; regime from
# https://ourworldindata.org/grapher/political-regime.csv (2024).
```
