# Court case clearance source note

Status: candidate. Desk preflight complete, value preflight not run.

Track: source-backed measurement (TRUST-2)

Recorded: 2026-10-01

## Question

Can `court_case_clearance` be filled with a comparable series for at least
half of the 53-country frame, and does it add information that the 2019
contract-enforcement row does not?

## How far this preflight got

This note was written from a cloud session whose egress policy refused every
primary host: `rm.coe.int`, `www.coe.int`, `cejamericas.org`, `cnj.jus.br`,
`sdmx.oecd.org` and `api.worldbank.org`. Coverage and definitions below come
from publisher pages and search results. No value has been fetched, checked or
committed. A session that can reach those hosts runs the value preflight under
"Next action".

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
| None found | | CAN MEX ARG KOR JPN CHN IDN VNM PHL MYS THA ARE ZAF NGA RWA ETH PRY VEN GTM HND CUB HTI | 22 | | Not searched country by country yet. |

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

## Acceptance gate (from the roadmap, restated against this note)

| Gate | Status |
| --- | --- |
| Numerator, denominator, scope and year known per country-year | Definitions known per publisher; country-year values not fetched |
| Incompatible systems flagged | GBR, USA and IND named above; CEJA scope unverified |
| Coverage reported for all 53 | Mapped: 26 regional, 5 national, 22 unfound |
| Recent enough | CEPEJ 2022, CEJA 2025 release, national annual |
| Adds information over contract enforcement 2019 | Untested; needs values |
| Half-frame screen (27 of 53) | Fails on regional routes alone by one; passes only with national routes |

## Next action

1. From a session that can reach `rm.coe.int` and `cejamericas.org`, pull the
   CEPEJ 2024 country profiles and the CEJA ICJ 2025 annex. Record per country:
   resolved, incoming, pending, year, instance and scope.
2. Confirm CEJA's case scope. If it pools matters, check whether its country
   annexes give a civil split. If they do not, CEJA cannot fill this row and the
   regional ceiling falls to 14.
3. Use Brazil to test the crosswalk: CEJA's figure against CNJ's IAD for the
   same year and scope.
4. Search the 22 unfound countries one by one before calling the row
   unfillable for them, starting with CAN, MEX, KOR, JPN and ZAF.
5. With values in hand, run the GDP correlation and the redundancy check
   against `contract_enforcement_days` for both clearance and disposition time, then
   write the decision entry.

## Sources

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
