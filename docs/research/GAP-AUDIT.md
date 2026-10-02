# Construct audit of the declared gaps

Status: desk audit, 2026-10-02. Dataset 8.2.0 (`data/out/index.json` at
`07eb925`). Nothing in the registry, the decisions, the artefacts, the version
or the changelog has moved. This memo classifies; every change it proposes is
a decision for the owner.

Track: source-backed measurement, under D23, D100, D117 and D118.

## The question

Every row with `ingest: 'gap'` (`isDeclaredGap`) claims one thing: the model
asks for a capability and no comparable dataset supplies it. D100 made that
claim load-bearing, because a gap stays in the coverage denominator and a
retired row leaves it. A gap that is really a rejected dataset, or a row whose
definition is not a capability, charges its dimension for something other than
missing evidence. This audit checks the claim for all 17 gaps across the nine
dimensions, on construct and on the evidence already filed, and on nothing
else.

## Classes, and how strictly they were applied

- **(a) Live gap.** The row names a capability the project wants, and no
  comparable source exists yet. A source rejected on coverage, recency,
  harmonisation or inspectability leaves a row here: those failures say the
  measurement cannot be made yet, which is what a gap means. A gap no memo has
  tried is (a) by default.
- **(b) Rejected dataset.** A series that reads the row's own definition was
  inspected and rejected on construct in a dated memo. This is D100's
  description of a retirement. The test is narrow on purpose: a rejected proxy
  for a different construct does not qualify. D142 and D143 are the
  precedents, and in both the rejected series read exactly what the row asked
  for (the R&D sector share; national pride).
- **(c) Not a capability.** The row's own definition names a stock, a spending
  level, an adoption level or a duplicate of a scored row, under the rule in
  `docs/research/CONDITIONS-AUDIT.md` (D122). This is a verdict on the
  definition and holds whatever source appears.
- **(d) Now measurable.** A source has appeared that passes the four desk
  questions of the roadmap (ceiling, spread, construct, cost), with a coverage
  probe run here.

One limit of the rules matters for (c). D100 retires a row on an inspected
dataset, and its overturn clause names "a decision to retire rows for reasons
other than rejecting an inspected dataset" as what would break it. A (c) row
with no dataset behind it therefore cannot be retired under D100 as written.
The honest routes are to redefine it as a capability, to move it to the
conditions layer by decision (D122), or to extend D100 by a new decision.

## The table

Memos are under `docs/research/` unless a decision is named. "Untried" means
no memo in `docs/research/` has triaged a source for the row; the registry
note is then the only evidence.

| Gap | Dimension | Class | Evidence: memo and date | Proposed action |
| --- | --- | --- | --- | --- |
| `government_foresight_capacity` | Anticipation | (a) | `anticipation/O1-CANDIDATES.md`, 2026-10-02; `FORESIGHT-REGISTER-PILOT.md`, `-SPOTCHECK.md`, `-RUNBOOK.md`; D146, D148 (2026-10-02) | Keep. The candidate is the project's own register, cleared to code the 53 after the human spot-check. Wireable when the 53 are coded, the D148 gates hold, and a promotion decision names the tier |
| `basic_research_share` | Anticipation | (c) | Untried in any memo. D142 (2026-10-02) argues the identical construct for `business_rd_share`: the make-up of an R&D spending stock | Owner: run the D142 inspection on OECD MSTI (UIS no longer serves R&D by type of research: its public API lists 12 STI series, none by type), then retire under D100 or move beside R&D spending as a condition |
| `adult_digital_skills` | Agency | (c) | Untried in any memo. Probe here, 2026-10-02: UIS SDG 4.4.1 items are self-reported use of a device ("sent messages with attached files": 33 of 53, 25 at 2018 or later; no USA, IND, CHN, most of Africa and Central America) | Owner: the definition reads a skill or adoption level, the kind D122 moved out with `internet_users` and `account_ownership`. Redefine it as a condition beside Agency, or retire by a decision that extends D100 |
| `university_industry_collaboration` | Coordination | (a) | `coordination/O1-CANDIDATES.md`, 2026-10-02 (OpenAlex preflight); registry note on GII (D10, inspectability) | Keep. OpenAlex co-authorship was rejected because it reads the size of business research, a different construct; GII's item is a non-inspectable executive opinion survey. Neither reads collaboration directly and fails on construct. Wireable only with a series of joint projects or contracts per firm or per researcher |
| `public_private_collaboration` | Coordination | (a) | `coordination/O1-CANDIDATES.md`, 2026-10-02: "gets no candidate"; V-Dem sweep `vdem-sweep/TRIAGE.md`, 2026-10-01 | Keep. No source. PPP investment databases (registry note) read infrastructure finance. IBGE MUNIC is a Brazil-only lead (`subnational/BRIEF.md`) |
| `institutional_trust` | Trust | (b) | `trust/EVS-WVS-INSTITUTIONAL-TRUST.md`, 2026-10-01; D132. The Joint EVS/WVS E069 battery reads the row's definition and fails A13 on every item (courts, civil service, police, parliament, government) | Owner. D100 says retire; D132 kept the gap open for a measure that does not reward deference. D143 retired `national_belonging` on the same A13 failure of its only item. One of the two decisions should give way |
| `court_case_clearance` | Trust | (a) | `trust/COURT-CLEARANCE.md`, value preflight 2026-10-01: 13 of 53, ceiling 19 | Keep. Rejected on coverage. The memo also found the ratio sits near 100 (0.87 to 1.02 in 12 of 13) and reads backlog change; disposition time is the better construct but tracks `contract_enforcement_days`. Wireable if CEPEJ and a non-European harmonised series reach 27 |
| `adult_learning_participation` | Learning | (a) | Untried in any memo. Probe here, 2026-10-02: UIS SDG 4.3.1 (`PRYA.12MO.AG25T54`) | Keep. The probe found 50 of 53 (no JPN, PHL, CUB), 44 at 2018 or later, but every value is a UIS estimate from ILO-harmonised labour force survey microdata, and the value follows the questionnaire (Sweden EU-LFS 41.3, USA CPS 4.3, Korea 1.9, Singapore 1.6). Fails harmonisation. Wireable on a 12-month adult survey for 27 or more of the frame; PIAAC cycle 2 reaches about 19 |
| `venture_capital_gdp` | Experimentation | (c) | D21, 2026-08-26 (OECD scoreboard, 6 of 16); `experimentation/O1-CANDIDATES.md`, 2026-10-02, row 14 | Owner. Every rejection so far is on coverage. The definition, money deployed as a share of GDP, is a financial-depth level of the kind `domestic_credit_private` is (Condition A, D122). If filled it belongs beside Experimentation as a condition. A1's fix names it as the missing series, so this needs the owner |
| `regulatory_sandbox_activity` | Experimentation | (c) | `O1-TRIAGE-SWEEP.md`, 2026-10-01: "a count of regimes is a policy stock, not experimentation" | Owner. No dataset exists, so D100 cannot retire it. Redefine as a behaviour (firms admitted to and exiting sandboxes, trials concluded) or retire by a decision that extends D100 |
| `university_spinouts` | Experimentation | (a) | `O1-TRIAGE-SWEEP.md`, 2026-10-01; `experimentation/O1-CANDIDATES.md`, 2026-10-02: no harmonised source | Keep. Rejected on comparability (national TTO definitions). Wireable on a cross-national register with one spinout definition |
| `disaster_preparedness` | Adaptability | (a) | `adaptability/DISASTER-PREPAREDNESS.md`, 2026-10-02: 11 sources | Keep. INFORM, ND-GAIN and WorldRiskIndex were rejected on construct, but none reads "demonstrated capacity": they are self-assessments, retired perceptions and stocks. The World Risk Poll warning item reads part of the construct and fails A13, so it is a check candidate. The registry note still rejects INFORM for the wrong reason (memo, candidate 4) |
| `institutional_responsiveness` | Adaptability | (a) | `adaptability/OXCGRT-RESPONSIVENESS.md`, 2026-10-01; `DISASTER-PREPAREDNESS.md`, 2026-10-02 | Keep. OxCGRT first economic support is "a real behaviour adjacent to the construct" and fails on measurement (cheapest decree, backfilled dates, one 2020 event). Wireable on dated legislative and regulatory timestamps assembled comparably |
| `large_project_delivery` | Building | (a) | Roadmap parked note; D20 and the evidence corpus; V-Dem sweep 2026-10-01 | Keep. No comparable source. Delivered cases stay evidence records (D20) |
| `firm_scale_up_rate` | Building | (a) | `O1-TRIAGE-SWEEP.md`, 2026-10-01: OECD business demography reaches 23 of 53. Probe here, 2026-10-02: Enterprise Surveys annual employment growth (`IC.FRM.EMP.GROW.PEFT2`, db 13), 34 of 53, latest 2019, the mean growth of all firms rather than young firms crossing a threshold | Keep. Rejected on ceiling; the probed series is off construct and stale |
| `volunteering_rate` | Shared purpose | (a) | `shared-purpose/O1-CANDIDATES.md`, 2026-10-02; `EVS-WVS-BEHAVIOURAL-ITEMS.md`; `O1-TRIAGE-SWEEP.md`, 2026-10-01 | Keep. Gallup's item is the row's definition word for word, 50 of 53, and is blocked by licence (D10), not by construct. ILOSTAT (28 of 53) fails harmonisation. Wireable under a Gallup licence and a decision on D10, or when ILOSTAT four-week rates reach 27 |
| `political_polarization` | Shared purpose | (b) | `shared-purpose/VDEM-POLARIZATION.md`; D121, 2026-10-01. V-Dem `v2cacamps` reads the row's definition and fails A13 (a U across regime classes) | Owner. D100 says retire; D121 kept the gap open for a reading conditioned on competition, and the Shared purpose memo of 2026-10-02 declined to offer it on D143's terms. The definition is also class P and describes a state of the polity rather than an act, which is a (c) reading the owner may prefer |

## Counts

| Class | Gaps | Count |
| --- | --- | ---: |
| (a) live gap | `government_foresight_capacity`, `university_industry_collaboration`, `public_private_collaboration`, `court_case_clearance`, `adult_learning_participation`, `university_spinouts`, `disaster_preparedness`, `institutional_responsiveness`, `large_project_delivery`, `firm_scale_up_rate`, `volunteering_rate` | 11 |
| (b) rejected dataset | `institutional_trust`, `political_polarization` | 2 |
| (c) not a capability | `basic_research_share`, `adult_digital_skills`, `venture_capital_gdp`, `regulatory_sandbox_activity` | 4 |
| (d) now measurable | none | 0 |

No gap is (d). The two probes that reached a frame-sized ceiling failed on
something else: UIS SDG 4.3.1 on harmonisation, and the foresight register is
not yet coded beyond the ten pilot countries.

## Effect on mean confidence, printed for transparency

**This effect is not a reason for any classification above and must not
become one.** AGENTS.md is explicit that gaps are not deleted to make numbers
look better, and D118 decides rows on construct. The figures are printed so
that a reader can see what a reclassification would move, and so that nobody
mistakes the move for new evidence: in every row below, no country gains an
observation.

Method: removing a gap from `countedForCoverage` multiplies coverage by
n / (n - 1), because a gap is never observed. Recomputed from the published
`confidenceParts` of every country (it reproduces each published dimension
mean to within 0.001). No score moves in any case.

| Gap (class) | Dimension | Counted rows | Mean confidence now | If it left the denominator |
| --- | --- | ---: | ---: | ---: |
| `basic_research_share` (c) | Anticipation | 4 to 3 | 0.451 | 0.601 |
| `adult_digital_skills` (c) | Agency | 5 to 4 | 0.483 | 0.604 |
| `institutional_trust` (b) | Trust | 7 to 6 | 0.418 | 0.488 |
| `venture_capital_gdp` (c) | Experimentation | 9 to 8 | 0.364 | 0.409 |
| `regulatory_sandbox_activity` (c) | Experimentation | 9 to 8 | 0.364 | 0.409 |
| both Experimentation rows (c) | Experimentation | 9 to 7 | 0.364 | 0.468 |
| `political_polarization` (b) | Shared purpose | 5 to 4 | 0.411 | 0.514 |

One of these would cross the O1 line of 0.40 on arithmetic alone:
Experimentation, 0.364 to 0.409 on either row. Trust and Shared purpose are
already above it. That is exactly the case the roadmap warns about. If the owner
reclassifies any of these rows, the release should say, as A5 does for D143,
that the confidence rose with nothing behind it.

## Notes on the calls that could go either way

**Why `university_industry_collaboration` and `disaster_preparedness` are not
(b).** Sources were tried and rejected, some on construct. But the rejected
series read something other than the row: OpenAlex reads the size of business
research, INFORM reads self-assessment plus stocks. Under D100 a retirement
records that the measurement the row asks for was made and found wrong. Here
it was never made, so the row is still a gap. Retiring rows whose proxies
failed would let any construct leave the denominator by trying one bad proxy.

**Why `volunteering_rate` and `court_case_clearance` are not (b).** Both were
rejected on licence or coverage, not on construct. Gallup's item is the
registry definition word for word.

**Why `adult_learning_participation` is (a) and not (c).** D122 moved
`tertiary_enrollment` out as a volume of enrolment, and the same argument could
be made here. It was not adopted, because adult participation is a voluntary
act by people already out of the school ladder, closer to
`firm_training_incidence` (firms acting to build skills, scored) than to a
cohort passing through a system. The owner may read it the other way.

**Why `venture_capital_gdp` is (c) against A1.** A1 names venture capital as
the series Experimentation is missing. The registry definition asks for money
deployed relative to GDP, and D122 classes money and financial depth as Tier A
conditions. A behavioural form exists in principle (the number of first-round
deals per million, which counts attempts rather than money) and would be a
new row.

**The two (b) rows set D132 and D121 against D143.** All three rows were
tested the same way: the one cross-national series that reads the definition
fails A13 because closed or electoral autocracies read best. D143 retired its
row. D121 and D132 kept theirs, and named the measures that would reopen them.
The difference D143 gives is that the project "does not believe pride is a
capability". If the owner believes confidence in institutions and hostility
between free camps are capabilities that a better instrument could read, the
gaps can stay, but then the overturn clauses of D121 and D132 are what keeps
them honest, and D100's description of a retirement needs a sentence saying
that a construct still wanted is not retired when its only series fails A13.

## Probes run for this audit

All 2026-10-02, raw values read only after the construct verdicts above were
written from the definitions.

- `pnpm bench probe --search` for "ICT skills", "digital skill", "venture
  capital", "basic research", "high-growth", "volunteer", "spin", "sandbox":
  no World Bank series. "adult education" returns only expenditure series.
- `pnpm bench probe --series UIS.PRYA.12MO@12,UIS.ICTSKILLATTACH@12`: 40 and
  20 of 53 in the World Bank's Education Statistics archive, latest 2018 and
  2019.
- UIS public API (`api.uis.unesco.org/api/public/data/indicators`, February
  2026 release): `PRYA.12MO.AG25T54` 50 of 53, all values `UIS_EST`, source
  footnotes name ILO-harmonised labour force and household surveys;
  `ICTSKILLEMAIL` 33 of 53, `ICTSKILLCOPA` 31, `ICTSKILLINFOBAS` 16.
- UIS STI definitions: 12 series, none for R&D by type of research or by
  sector of performance.
- `pnpm bench probe --series IC.FRM.EMP.GROW.PEFT2@13`: 34 of 53, latest 2019,
  r with log GDP -0.36 (printed, deciding nothing).

## Gaps whose classification needs the owner

1. `institutional_trust` (b): retire under D100, or amend D100 so that a
   construct still wanted survives the A13 failure of its only series (and
   say why D143 differs).
2. `political_polarization` (b): the same question, with D121; or reclassify
   as (c), a state of the polity rather than a capability.
3. `basic_research_share` (c): confirm the D142 argument applies, then retire
   or move to conditions. Needs one inspection of OECD MSTI to satisfy D100.
4. `venture_capital_gdp` (c): a condition beside Experimentation, or a new
   behavioural row (deal counts) against A1's fix.
5. `adult_digital_skills` (c): a condition beside Agency, or retire by a
   decision extending D100.
6. `regulatory_sandbox_activity` (c): redefine as a behaviour or retire by a
   decision extending D100; no dataset exists for D100 to cite.
7. `adult_learning_participation` (a, contested): confirm it is a behaviour and
   not an enrolment level under D122.

Every (c) and (b) change is a decision entry, a registry note, and a dataset
version under D37 (a change to the coverage denominator restates published
confidence, as D100 did at a minor bump).
