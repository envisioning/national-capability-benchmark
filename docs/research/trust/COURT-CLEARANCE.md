# Court case clearance source note

Status: screen failed. Value preflight run 2026-10-01: 13 of 53 countries have
in-scope values for 2022 to 2024, against a screen of 27. The row stays a gap.

Track: source-backed measurement (TRUST-2)

Recorded: 2026-10-01

## Question

Can `court_case_clearance` be filled with a comparable series for at least
half of the 53-country frame, and does it add information that the 2019
contract-enforcement row does not?

## How far this preflight got

The desk preflight (coverage map, construct findings, proposed treatment) was
written from a session that could reach no primary host. The value preflight
below was run on 2026-10-01 from a session that reached the World Bank, the
European Commission, CEJA, CNJ and most national judiciaries. `rm.coe.int` and
`www.coe.int` still answer 403 behind a bot challenge, so no CEPEJ document was
read directly. Nothing has been committed to `data/observations`.

## The construct

Every candidate publisher uses the same ratio: cases resolved in a period
divided by cases filed in the same period, times 100. CEPEJ calls it the
clearance rate, the Australian Productivity Commission calls it clearance, the
US National Center for State Courts (CourTools measure 2) calls it the
clearance rate, Brazil's CNJ calls it the *índice de atendimento à demanda*
(IAD) and CEJA calls it the *tasa de resolución* (TR). The numerator and
denominator are the same. What is counted differs: case scope, instance
and court tier.

## Coverage map

| Route | Publisher | Benchmark countries | Count | Reference year | Scope note |
| --- | --- | --- | ---: | --- | --- |
| Regional, harmonised | CEPEJ evaluation, 2024 cycle | NLD CHE EST DEU FRA GBR ESP PRT POL SWE FIN IRL TUR, plus ISR as observer | 14 | 2022 | Civil and commercial litigious cases, first instance, separate from non-litigious and administrative. The United Kingdom reports England and Wales, Scotland and Northern Ireland separately. |
| Regional, harmonised | CEJA *Índice de Congestión Judicial en las Américas* 2025 | BRA BOL CHL COL CRI ECU SLV NIC PAN URY PER DOM | 12 | longitudinal, years to verify | Covers 13 judiciaries, including Puerto Rico, which is outside the registry. Whether matters are pooled or civil only is not yet verified. |
| National | NCSC Court Statistics Project | USA | 1 | annual | State trial courts, reported state by state. No national figure; federal courts are a separate system. |
| National | Productivity Commission, Report on Government Services | AUS | 1 | annual | Civil clearance across supreme, district or county, magistrates' and children's courts. |
| National | Singapore Judiciary caseload statistics | SGP | 1 | annual | Published by court; State Courts civil separable. |
| National | Kenya Judiciary, State of the Judiciary and PMMU reports | KEN | 1 | fiscal year | Published as an all-matter rate; a civil split exists in places. |
| National | National Judicial Data Grid, India Justice Report | IND | 1 | annual | Published by state and court tier; no single national civil figure found. |
| None found | | CAN MEX ARG KOR JPN CHN IDN VNM PHL MYS THA ARE ZAF NGA RWA ETH PRY VEN GTM HND CUB HTI | 22 | | Searched country by country on 2026-10-01; see step 4. |

The two regional routes reach 26 countries, one short of the 27-country
half-frame screen. With the national routes the ceiling is 31, but those five
cannot be put on the same scope without per-country work. USA and IND need an
aggregation rule this project would author. Brazil is in CEJA and also in CNJ's
own IAD, so it becomes the crosswalk test between a regional route and a
national route.

## Findings that bear on the gate

**1. The ratio measures backlog change, not throughput.** Clearance is a flow
divided by a flow, and it sits close to 100 in most systems. A one-off
backlog drive or a filing collapse moves it more than capability does. Brazil's
IAD went from 99.2% for 2023 to 113.6% for 2024 in CNJ's own release, and
Kenya reports 99%. A single year will mostly rank countries by what happened
to their filings that year. A rule that reads a mean over several years
(three, if every publisher has them) is the minimum treatment, and it has to
be decided before any value is looked at.

**2. Read alone, the rate rewards a court that is falling behind slowly.** CEPEJ
never reads clearance alone. It pairs it with disposition time, the pending
stock divided by resolved cases times 365, which is a level rather than a
change. CEJA pairs it with a congestion rate for the same reason. A clearance
of 100 means the backlog held still. It does not tell a 3-month backlog from a
three-year one.

**3. Disposition time is closer to the construct and closer to the existing
row.** The registry already holds contract-enforcement days from Doing Business
2019. Disposition time is also measured in days, so the redundancy check is
more likely to flag it than clearance. That is a reason to test both. It is not
a reason to pick clearance on the grounds that it is less redundant.

**4. Scope drift is the main comparability risk.** CEPEJ separates litigious
from non-litigious civil cases. CNJ's headline IAD pools every branch and
matter. Kenya's headline rate pools criminal and civil matters. The registry
definition says civil and commercial, so every route needs that split, or the
country is flagged and held, as the Joint EVS/WVS adapter does with its
duplicate rows.

**5. Federal and devolved systems need a rule, not a choice per case.** The
United Kingdom (three jurisdictions in CEPEJ), the United States (state courts
only), India (state by state) and, if found, Canada and Australia's states. The
options are a caseload-weighted pooled ratio (sum resolved over sum filed),
which is the only one that reproduces a national ratio, or a held row. A
population-weighted mean of rates does not reproduce any published figure.

## Proposed treatment, for review

Nothing below is promoted. It is the measurement rule this note proposes for
the review that TRUST-4 requires.

- Primary routes: CEPEJ for Council of Europe members and observers, CEJA for
  Latin America. National routes only where the publisher reports civil and
  commercial first-instance cases separately.
- Value: resolved over filed, civil and commercial litigious, first instance,
  pooled by summing counts across jurisdictions where a country reports more
  than one.
- Reference period: the mean of the latest three published years where all
  three exist; otherwise the row is held, never shortened in silence.
- Companion: fetch disposition time from the same tables and test it as a
  second institutional row, with the redundancy check against contract
  enforcement deciding which one the registry keeps. If both pass, the decision
  entry says why two court rows are not double counting.
- Clamp: a clearance above 100 is not better without limit. Whether the frame
  should cap at 100 or keep the Tukey fences is a decision for the review, not
  for the adapter.

## Value preflight, 2026-10-01

Reference period 2022 to 2024. Clearance is resolved over filed for each year,
then the mean of the three yearly ratios. Disposition time is pending at year
end over resolved, times 365, meaned the same way. A country with fewer than
three years in scope is held, never shortened. Every value below was read from
the file named beside it; none is a search-engine summary.

### Step 1. CEPEJ (14 mapped)

`rm.coe.int` and `www.coe.int` refused every request with a Cloudflare 403. A
headless-browser route was refused by this session's permission policy and was
not pursued. CEPEJ's own profiles, its reuse terms and the four countries only
CEPEJ covers (CHE, GBR, TUR, ISR) are therefore unread.

The ten EU members in the frame are covered by a second publisher. The
[2026 EU Justice Scoreboard quantitative data](https://commission.europa.eu/document/download/926bcd02-9354-4517-889a-557aae16b189_en?filename=2026_EUJS_quantitative.zip)
(`2026_EUJS_quantitative.xlsx`) republishes the CEPEJ study series at exactly
the registry's scope: litigious civil and commercial cases, first instance.
Sheet `Fig(10)CR.Lit.civ&comm` is the clearance ratio, `Fig(5)DT.Lit.civ&comm`
is disposition time in days, `Fig(2)` incoming and `Fig(13)` pending per 100
inhabitants. The Commission's [legal notice](https://commission.europa.eu/legal-notice_en)
licenses EU-owned content under CC BY 4.0 and excludes third-party works; the
sheets credit "CEPEJ study", so whether CC BY covers these figures needs
confirming before an adapter republishes them.

| Country | CR 2022 | CR 2023 | CR 2024 | DT 2022 | DT 2023 | DT 2024 | Held? |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| DEU | 1.04 | 0.97 | 1.00 | 240.90 | 248.78 | 232.16 | |
| EST | 0.99 | 0.91 | 1.10 | 157.99 | 195.54 | 184.92 | |
| ESP | 0.98 | 0.84 | 0.82 | 359.35 | 443.99 | 422.77 | |
| FIN | 1.00 | 0.89 | 0.75 | 327.17 | 349.11 | 463.91 | |
| FRA | 1.03 | 0.96 | 0.95 | 332.62 | 354.37 | 433.69 | |
| IRL | 0.71 | 0.72 | 0.72 | NA | NA | NA | DT held |
| NLD | NA | NA | 1.02 | NA | NA | 124.25 | held, one year |
| POL | 0.98 | 0.95 | 0.94 | 361.75 | 357.49 | 360.27 | |
| PRT | 1.03 | 0.96 | 0.97 | 237.95 | 267 | 263.37 | |
| SWE | 1.02 | 0.97 | 0.98 | 152.20 | 156.61 | 150.21 | |

Clearance in scope: 9. Disposition time in scope: 8.

### Step 2. CEJA (12 mapped)

CEJA's [2025 index](https://cejamericas.org/wp-content/uploads/2025/12/I-Indice-de-Congestion-Judicial-en-las-Americas-CEJA-2025_DICIEMBRE.pdf)
pools every matter and every court tier. Page 11, *Alcance y límites*: the study
uses national aggregates and "no incorpora desagregaciones por materia,
complejidad de los casos, jerarquía de los órganos jurisdiccionales". Its
Table 6 runs 2018 to 2024, with Brazil's 2024 projected from 2023 and Bolivia,
El Salvador, Uruguay and Puerto Rico ending in 2022. Uruguay's TR of 0.23 to
0.29 is not a plausible court system and is a scope artefact. **CEJA cannot fill
a civil and commercial row.** Each country's own judiciary was then searched:

| Country | Result | Source | Scope | 2022 to 2024 in scope? |
| --- | --- | --- | --- | --- |
| BRA | found | CNJ Justiça em Números database, [`23-jun-2026.zip`](https://www.cnj.jus.br/wp-content/uploads/2026/06/23-jun-2026.zip), file `JN_23-Jun-2026.csv`, row `sigla=TJ`, fields `cncncrim1`, `tbaixcncrim1`, `cpcncrim1` | State courts, first instance, non-criminal fact-finding, special courts excluded | yes |
| CRI | found | Dirección de Planificación, [*Materia Civil I Instancia* analyses](https://sistemaplanificacion.poder-judicial.go.cr/php/estadistica_ju_po/), table *Movimiento de Trabajo* | Civil first instance; debt collection reported separately | yes; 2024 pending not published |
| CHL | found, flagged | [estadisticaservices.pjud.cl](https://estadisticaservices.pjud.cl/descargas/descargas/civil/) `Ingresos` and `Terminos` CSV per year | Civil jurisdiction, Juzgados de Letras | yes, but see below |
| COL | found, flagged | UDAE-SIERJU yearly workbooks, [ramajudicial.gov.co](https://www.ramajudicial.gov.co/web/estadisticas-judiciales/ano-2022), TOTAL GENERAL row, municipal plus circuit | Especialidad civil; *ingresos efectivos* include tutelas | yes, but see below |
| ECU | held | Consejo de la Judicatura `FUE02_CAUSAS_COGEP_DNEJEJ_DNGP_N.xlsx` | Civil, first instance; resolved counts only cases filed the same year; cut-off August 2023 | no |
| BOL | held | Anuario Estadístico Judicial 2022 and 2023, Cuadro 5.1.1.1 | Civil and commercial, capital cities and El Alto only | two years |
| SLV | held | CSJ Rendición de Cuentas 2022 | First instance civil, civil y mercantil, mercantil | 2021 and 2022 only |
| PAN | held | Órgano Judicial, *Resolución eficaz y oportuna de conflictos 2021-2024* | All civil, instance not split; table and text disagree for 2024 | 2024 only |
| URY | held | Anuario 2022, Cuadros 11, 38, 40 | Montevideo civil filings; no resolved count | no |
| PER | blocked | portalestadistico.pj.gob.pe reset or 503 | | no |
| DOM | not usable | First instance only in a Power BI embed | | no |
| NIC | not found | poderjudicial.gob.ni failed at TLS | | no |

Values for the in-scope rows, filed / resolved / pending at year end:

| Country | 2022 | 2023 | 2024 |
| --- | --- | --- | --- |
| BRA | 6,526,604 / 6,456,585 / 15,987,877 | 7,187,183 / 7,207,840 / 16,016,779 | 7,873,113 / 7,740,655 / 16,168,832 |
| CRI | 15,101 / 14,351 / 42,679 | 15,510 / 13,482 / 44,185 | 15,690 / 14,003 / not published |
| CHL | 891,171 / 567,737 | 1,264,899 / 630,256 | 1,229,890 / 673,390 |
| COL municipal | 362,890 / 266,012 / 266,320 | 455,701 / 311,611 / 290,336 | 567,347 / 386,712 / 324,545 |
| COL circuit | 136,177 / 107,650 / 76,029 | 156,655 / 121,497 / 77,506 | 176,942 / 137,966 / 80,204 |

Chile and Colombia are flagged, not counted. Chile's three-year clearance is
0.56 and Colombia's 0.72. Neither looks like court performance. Colombia's
ingresos include constitutional complaints (tutelas). Chile's gap is unexplained
here; the likely cause is preparatory and collection filings that never reach a
decision, but this note has not read the codebook that would confirm it. Both
need a scope rule before they can count.

### Step 3. Brazil crosswalk

CEJA's Brazil TR is 0.93 for 2022 and 0.94 for 2023. CNJ's state-court civil
first-instance ratio from the same database is 0.989 for 2022 and 1.003 for
2023, and CNJ's headline all-branch IAD for 2023 is 99.2%. CEJA sits about six
points under both, so it differs in scope from both. The row should use CNJ's
state-court civil first-instance fields.

### Step 4. The other national routes and the 22 unfound countries

| Country | Result | Source and scope | In scope for 2022 to 2024? |
| --- | --- | --- | --- |
| AUS | found | [ROGS 2026 section 7 dataset](https://assets.pc.gov.au/2026-01/rogs-2026-partc-section7-courts-dataset_0.csv), table 7A.26, all civil courts excluding federal, family and coroners', financial years: 91.8 (2022-23), 95.5 (2023-24), 98.7 (2024-25) | yes, clearance only; financial years |
| JPN | found | [courts.go.jp `db2026_212.pdf`](https://www.courts.go.jp/assets/db2026_212.pdf), district courts, first-instance ordinary civil suits, filed / disposed / pending: R4 126,666 / 131,803 / 101,434; R5 135,674 / 137,607 / 99,501; R6 141,530 / 139,387 / 101,644 | yes |
| SGP | partial | [State Courts civil, 2023](https://www.judiciary.gov.sg/who-we-are/statistics/caseload-statistics-2023): 20,358 filed, 21,816 disposed. 2022 and 2024 pages exist, values not read | one year read |
| CAN | flagged | StatCan table 35-10-0112-01, nine jurisdictions; Quebec, Manitoba, Newfoundland and Labrador and Saskatchewan missing | no national figure |
| MEX | flagged | INEGI CNIJE 2024, table 13, state judiciaries, all matters; civil only as a share | no civil count |
| HND | held | Boletín Estadístico Judicial 2023, Juzgados de Letras civil: 14,953 filed, 4,451 resolved | one year, implausible ratio |
| USA | partial | NCSC CSP: national civil filings estimate only; outgoing by state in a portal | no national ratio |
| KEN | partial | SOJAR: civil filings published; resolved published for all matters only | no |
| IND | partial | NJDG: rolling last-month counts only | no annual series |
| ZAF | partial | Annual Judiciary Report 2023/24, Table 10, High Court civil caseload and finalised; caseload is not filings | no |
| VNM | flagged | Supreme People's Court: *thụ lý* includes carried-over cases | no |
| KOR | partial | Judicial Yearbook; 2023 civil filings in press only | no |
| CHN | partial | SPC work report, all matters | no |
| IDN | partial | Supreme Court annual report, all branches; civil split not read | no |
| ARG, MYS, THA, ARE, RWA, PRY, PHL | partial or blocked | fragmented subnational, filings only, or host down | no |
| NGA, ETH, VEN, GTM, CUB, HTI | not found | judiciary sites, statistics offices and yearbooks searched | no |

No cross-country publisher outside Europe was found. OECD's 2013 judicial
performance study was a one-off; Government at a Glance reuses CEPEJ; the World
Justice Project civil justice factor is a perception survey; UNODC covers
criminal justice only.

### Step 5. Coverage verdict

| Group | Countries | Count |
| --- | --- | ---: |
| In scope, three years read | DEU EST ESP FIN FRA IRL POL PRT SWE BRA CRI JPN AUS | 13 |
| Three years read, scope flagged | CHL COL | 2 |
| Mapped, CEPEJ unread | CHE GBR TUR ISR | 4 |
| Held: too few years or scope mismatch | NLD ECU BOL SLV PAN URY SGP CAN MEX HND | 10 |
| No usable series | the other 24 | 24 |

**The half-frame screen fails: 13 of 53, against 27.** Reading CEPEJ directly
would add at most four, and resolving the two flagged scopes two more, for a
ceiling of 19. `court_case_clearance` stays a gap. Step 6 was not run: no
fixture, decision entry, adapter or version bump.

### Diagnostics on the in-scope countries, for the record

Indicative only, because the sample is small and two-thirds European. Log GDP
per capita (PPP) and contract-enforcement days are the values in the current
dataset.

| Series | Against | n | Pearson | Spearman |
| --- | --- | ---: | ---: | ---: |
| Clearance, three-year mean | log GDP per capita | 13 | -0.55 | -0.25 |
| Clearance, three-year mean | contract-enforcement days | 13 | -0.22 | -0.31 |
| Disposition time, three-year mean | log GDP per capita | 10 | -0.81 | -0.28 |
| Disposition time, three-year mean | contract-enforcement days | 10 | +0.58 | +0.38 |

Two findings survive the small n. Clearance sits between 0.87 and 1.02 in 12 of
13 countries, so it separates few of them, which is finding 1 above
showing up in values. Disposition time tracks the 2019 contract row more
closely than clearance does (+0.58 against -0.22), as finding 3 predicted, and
its Pearson against GDP comes from Brazil's 826 days alone (Spearman -0.28).

## Acceptance gate (from the roadmap, restated against this note)

| Gate | Status |
| --- | --- |
| Numerator, denominator, scope and year known per country-year | Met for 13 countries; flagged for CHL and COL |
| Incompatible systems flagged | CEJA rejected for scope; CHL, COL, CAN, MEX, VNM, ECU flagged |
| Coverage reported for all 53 | Done, step 5 |
| Recent enough | 2022 to 2024 for all 13 |
| Adds information over contract enforcement 2019 | Clearance r = -0.22 (n = 13); disposition time r = +0.58 (n = 10) |
| Half-frame screen (27 of 53) | **Fails: 13** |

## Next action

The row stays a gap until one of these changes:

1. CEPEJ publishes, or a session can read, its 2026 cycle (2024 data). Even
   with all four non-EU members it reaches 17 at most.
2. A comparable series appears for Asia and Africa. None exists now, and
   building one from national yearbooks means this project writing a
   scope rule per country, which is a harmonisation the source-backed track
   should not author alone.
3. Disposition time is the better construct, but it is worth reopening only as
   a replacement for `contract_enforcement_days` once B-READY covers the frame,
   not as a second court row.

Do not spend another session searching national judiciaries country by
country: steps 2 and 4 did that, and the result is above.

```text
Task: TRUST-2
Track: source-backed
Status: rejected at the coverage screen; row stays a gap
Dataset and release: 6.1.2, app 1.15.1
Indicator ids: court_case_clearance (gap, unchanged)
Countries covered: 13 / 53 in scope; 2 more flagged; ceiling 19
Years covered: 2022 to 2024 (AUS financial years 2022-23 to 2024-25)
Source and license: EU Justice Scoreboard 2026 (CC BY 4.0, CEPEJ third-party status unconfirmed); CNJ, Costa Rica Poder Judicial, courts.go.jp, ROGS (terms not stated); CEPEJ unread (403)
Files changed: docs/research/trust/COURT-CLEARANCE.md, docs/RESEARCH-ROADMAP.md
Commands run: none against the pipeline; source files fetched and parsed in a scratch directory
Diagnostics result: clearance vs log GDP r -0.55, rho -0.25 (n 13); vs contract days r -0.22 (n 13); disposition vs contract days r +0.58 (n 10)
Objective moved: none; Trust stays at mean confidence 0.21 (O1). The desk ceiling of 26 should have stopped it at triage (D117).
Decision entry: none; no model change
Version impact: none
Next action: none on this row until CEPEJ is readable or a non-European comparable series exists
```

## Sources

- [2026 EU Justice Scoreboard, quantitative data](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/upholding-rule-law/eu-justice-scoreboard_en)
- [CEPEJ 2024 evaluation report, special file](https://www.coe.int/en/web/cepej/special-file): 44 member states and two observers, Israel and Morocco, 2022 data.
- [CEPEJ 2024 country profiles](https://rm.coe.int/cepej-evaluation-report-2024-country-profiles/1680b1e7d0)
- [CEPEJ Israel profile, 2024 cycle](https://rm.coe.int/israel-2024-2022-/1680b1f6d7)
- [2024 EU Justice Scoreboard](https://reseau-presidents.eu/sites/default/files/2024%20EU%20Justice%20Scoreboard.pdf), which republishes the CEPEJ clearance rate for EU members.
- [CEJA, *Índice de Congestión Judicial en las Américas* 2025](https://cejamericas.org/wp-content/uploads/2025/12/I-Indice-de-Congestion-Judicial-en-las-Americas-CEJA-2025_DICIEMBRE.pdf) and [its announcement listing the 13 judiciaries](https://cejamericas.org/2025/07/07/nueva-publicacion-de-ceja-primer-indice-de-congestion-judicial-en-las-americas-icj-ceja-2025-2/)
- [CNJ, Justiça em Números 2024 release](https://www.cnj.jus.br/justica-em-numeros-judiciario-reduziu-acervo-e-alcancou-produtividade-historica-em-2024/): IAD 113.6% for 2024; 99.2% for 2023 in the [2024 report coverage](https://www.tjba.jus.br/primeirograu/relatorio-justica-em-numeros-2024-tjba-se-destaca-em-produtividade-entre-os-tribunais-do-brasil/).
- [NCSC CourTools measure 2, clearance rates](https://www.ncsc.org/sites/default/files/media/document/CourTools-measure-2-clearance-rates.pdf)
- [Productivity Commission, Report on Government Services 2026, courts](https://www.pc.gov.au/ongoing/report-on-government-services/justice/courts/)
- [Singapore Judiciary caseload statistics 2023](https://www.judiciary.gov.sg/who-we-are/statistics/caseload-statistics-2023)
- [Kenya Judiciary PMMU evaluation report 2022/2023](https://www.judiciary.go.ke/wp-content/uploads/2024/07/PERFORMANCE-MANAGEMENT-AND-MEASUREMENT-UNDERSTANDINGS-EVALUATION-REPORT-20222023.pdf)
- [India Justice Report, subordinate court clearance](https://indiajusticereport.org/indicator/315/ijr-3/large-states/map)
