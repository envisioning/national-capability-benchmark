# Research roadmap

This is the working queue for extending the benchmark. It turns a declared gap
into a source-backed indicator only after the source, construct and country
coverage have survived review.

The roadmap is an execution document. Methodological choices still belong in
`docs/DECISIONS.md`, source records belong in the registry, and documented
deliveries belong in `data/evidence`. If this file conflicts with a decision,
the decision wins and this file must be updated.

## What the research is for

The benchmark makes one claim: a country's capability is separate from its
wealth and can be observed (see `docs/WHY.md`). Research serves that claim
through one objective and one reported outcome. Every task names what it
moves, and every handoff reports the move. D117 set this rule and D118 changed
what O2 is.

**Rows are chosen for what they measure (D118).** A candidate is decided on its
construct: what it observes, whether that is a capability or a stock that
money buys, and whether it is behaviour, an outcome or a perception. Write that
argument in the source memo, dated, before any value is fetched. The income
correlation is then computed and printed, and it decides nothing. A benchmark
that keeps or drops rows by their income correlation cannot fail the test it
exists to run.

**What it serves next.** The next real use is a report on Brazil's
adaptability, which maps what produces adaptability rather than scoring
institutions. Adaptability is first in the queue. Every source is still tested
against all 53 countries.

**O1. Informative.** Every dimension carries enough evidence to read. Target: mean
confidence of at least 0.40 in every dimension.

**O2. Separable from wealth, reported and not targeted.** Every release prints
each dimension's correlation with log GDP per capita. Above 0.70 is a finding
against the claim, to be read and published. It is not a target, and no row is
added or dropped to move it.

**Guardrail.** Confidence must not come to track wealth. At 8.0.0 the mean
confidence across dimensions correlates with log GDP per capita at r = 0.29
across 51 countries (0.28 at 7.8.0, before the three Tier B rows became
conditions and two gaps were retired). The bought conditions that left the scores (D122) were
better covered in rich countries, and the ILOSTAT row's plausibility gate still
holds or ages more middle-income countries than rich ones. Watch it, and read
the next source's effect on it first. A source that only covers rich countries
raises O1 and breaks this.

### Where the objectives stand

Dataset 8.0.0 (three Tier B rows to conditions, two gaps retired, customs check). Recompute from `data/out/diagnostics.json` and
`data/out/index.json` after any rescore; never carry these figures forward by
hand.

| Dimension | Mean confidence | Observed rows (mean) | r with log GDP | Reading |
| --- | ---: | ---: | ---: | --- |
| Trust | 0.42 | 4.3 | 0.61 | |
| Experimentation | 0.31 | 3.5 | 0.57 | misses O1 |
| Shared purpose | 0.41 | 2.6 | 0.20 (n 50) | clears O1 on a retirement, not an observation (D143) |
| Coordination | 0.36 | 2.8 | 0.56 | misses O1 |
| Learning | 0.51 | 2.9 | 0.78 | tracks income |
| Agency | 0.48 | 3.6 | 0.58 | |
| Anticipation | 0.45 | 2.0 | 0.87 | tracks income |
| Building | 0.55 | 3.9 | 0.43 | |
| Adaptability | 0.52 | 2.8 | 0.46 | nine countries on two rows |

Ten bought conditions left the scores at 7.0.0 and are published beside their
dimensions (D122): research spending, researchers and secure servers beside
Anticipation, internet users, account ownership and private credit beside
Agency, tertiary enrolment and education spending beside Learning, broadband
beside Adaptability and output per worker beside Building. At 8.0.0 three Tier
B rows joined them (D141): the vocational share beside Learning, and labour
force participation and transmission losses beside Adaptability.

The one-factor test (D137), dataset 8.0.0: one shared factor carries 0.485 of
the variance of the nine dimension scores over 51 complete cases, against
0.189 by chance (95th percentile 0.215), and it correlates 0.845 with log GDP
per capita (n 50), so income accounts for 0.71 of it. The shared factor looks
like income. It was 0.523 at 7.8.0. On the same rule the share was 0.604 at 6.2.0 and 0.498 at 7.0.0
(both 33 complete cases), when the stocks left the scores. Every release's
figure is in `data/out/factor-history.json`.

What is left after income (D138), dataset 8.0.0, on the 50 countries with all
nine residuals: the leftovers still move together (first-factor share 0.285
against chance 0.191, 95th 0.217), loading mostly on Anticipation, Trust,
Learning, Coordination and Shared purpose. Income peers are no more alike in
shape than countries picked at random (mean peer distance 1.55 against 1.56,
5th percentile 1.49), and the shapes line up beyond random dealing (0.280
against a 95th of 0.232), so under the pre-registered rule the weaker claim,
different shapes at the same income, holds. The margin is narrow and peers
differ less than random dealing would (1.55 against 1.78), because part of
what is left is a level. Residual order between releases is mixed (lowest rank
r 0.72 on Trust, n 36; none under 0.5), no single country moves its own
residual by more than 0.37 of the spread around its line (Adaptability), and
income accounts for 43% of the typical country's distance from the average
profile (mean 30%). No reading changed at 8.0.0. The objective this
serves is to widen the country set and deepen Trust and Coordination, the two
dimensions whose leftovers moved most when indicators changed.

Two dimensions still track income above 0.70. Anticipation stays at 0.87 on
its two capability rows, articles per head and statistical performance, which
both track income themselves; that is a finding against the claim. Learning is
0.78 on the Human Capital Index, firm training and citation impact.
Adaptability fell to 0.46 when its two Tier B rows left, and rests on two rows
in nine countries (D141). Agency and Learning missed O1 at 7.0.0: the evidence on them was thinner
than the stocks made it look. Agency crosses it on perceived control (D127),
with the regime and response-style caveats in A15.

## The queue

Ordered by what the Brazil adaptability report needs first, then by expected
gain on O1 per session, cheapest proven route first (D118). A work package that
passes triage runs to its gate. One that fails triage costs one paragraph.

| # | Work package | Moves | Route | First output |
| --- | --- | --- | --- | --- |
| Q1 | Adaptability: wire the researched gaps | O1 and the report: Adaptability | UNCTAD export concentration (#24, D119) and ILOSTAT long-term unemployment with a plausibility gate (#26, D120) | Adapters, decision entries, one minor release |
| Q2 | Adaptability: the remaining gaps | Adaptability | Desk triage for `disaster_preparedness` and `institutional_responsiveness`. `broadband_subscriptions` is a condition since D122 | One triage paragraph per gap |
| Q3 | Construct audit of stock rows | Reported O2: Anticipation, Agency, Learning | Done for Tier A at 7.0.0 (D122) and for three Tier B rows at 8.0.0 (D141): the vocational share, labour force participation and transmission losses are conditions. Open: business start days and procedures (Agency) and income inequality (Shared purpose), each only once its dimension has a capability row to replace it, and replacements for the two borderline rows, `sci_articles_per_million` and `human_capital_index` | One decision per remaining Tier B row; a learning-outcome series |
| Q4 | Reopen exclusions that rested on income alone | O1: Trust | `bribery_incidence` (check since D60) | Done: scored in Trust (D123), 50 / 53 |
| Q5 | V-Dem sweep | O1: Trust, Coordination, Shared purpose | The pinned V-Dem adapter, 53 / 53. Polarization is published as a check (D121) | Done: court compliance scored in Trust (D131); nothing for Coordination |
| Q6 | EVS/WVS sweep beyond A165 | O1: Shared purpose, Trust | The Joint EVS/WVS adapter (TRUST-1) | Done: trust in strangers scored in Trust (D140), 37 / 53 |
| Q7 | OpenAlex research impact | Learning | OpenAlex API, full frame. Memo on #23 recommends the share of works in the top 10% for their field, as a ratio to world | Wired as `research_citation_impact` (D124), 53 / 53 |
| Q8 | IDEA voter turnout | O1: Shared purpose | IDEA open data, full frame | Triage note, including the compulsory-voting rule |
| Q9 | Full Delphi rerun (TRUST-5) | Reading, not measurement | Needs `AI_GATEWAY_API_KEY` | After the dataset changes |

**Q2 status (2026-10-02): triaged, nothing scored.** Memo:
`docs/research/adaptability/DISASTER-PREPAREDNESS.md`. Eleven sources; ten
fail before values (self-assessments such as Sendai E-1 and SPAR, retired
perception indices plus stocks such as INFORM and ND-GAIN, hazard-driven
outcomes such as EM-DAT, coverage or recency). The survivor is the World Risk
Poll item "received a warning before the disaster", restricted to weather
events: 46 of 53 at a base of 30, stable between waves (Spearman 0.78), r with
log GDP 0.44. It fails A13 (closed autocracies read highest), so the proposal
is a check, `__check__disaster_warning_reach`, and the gap stays declared.
`institutional_responsiveness`: no source other than OxCGRT exists.

**Q6 status (2026-10-02): done, one row scored (D140, dataset 7.8.0).** Memo:
`docs/research/shared-purpose/EVS-WVS-BEHAVIOURAL-ITEMS.md`. Trust in people
met for the first time (G007_34_B) fills `willingness_to_cooperate_strangers`,
37 of 53, scored as the share trusting completely or somewhat. Trust's mean
confidence 0.347 to 0.418, which clears O1; r with log GDP 0.675 to 0.606;
scored countries 52 either way. The guardrail moves from 0.298 to 0.278. The
D137 factor share moves from 0.531 to 0.523, and no D138 reading changes. Petitions (E025) rejected on A5. The release has no volunteering
item, and national pride fails A13 for `national_belonging`.

**Experimentation (2026-10-02).** Memo:
`docs/research/experimentation/O1-CANDIDATES.md`. A full-coverage row adds
about 0.06 to mean confidence, and O1 needs 0.13. GitHub Innovation Graph new
repositories per million is the strongest candidate (53 of 53, China and Cuba
gated); with the GEM extension D125 held, the two together reach 0.402. Both
wait on a decision. `business_rd_share` is retired (D142): RICYT fills Latin
America (34 of 53 with OECD MSTI), but the row is the make-up of a spending
stock. B-READY
(#37): 13 of 53 in the API, 26 in the 2025 package, gate 27.

**Q5 status (2026-10-01): done, one row scored (D131).** The triage table
is `docs/research/vdem-sweep/TRIAGE.md`: 21 codebook variables, construct
first, then coverage, the A13 regime test, redundancy and r with log GDP.

- Trust gains `court_compliance` (institutional family) from `v2jucomp`,
  government compliance with court decisions it disagrees with: one public act
  of the state, not a reputation, and autocracies read low on it rather than
  high. 53 of 53. Trust's mean confidence 0.311 to 0.347 (still under O1), r
  with log GDP 0.571 to 0.671, scored countries 50 to 52. The guardrail holds
  at 0.298.
- Coordination gains nothing. Range of consultation (`v2dlconslt`) is a
  deliberative-democracy item that fails A13 (closed autocracies above
  electoral ones, Vietnam level with Uruguay); the state-apparatus items are
  conditions; the CSO items feed `v2x_cspart`. No V-Dem variable observes
  independent actors acting together.
- Dead on construct: the corruption items (`v2exbribe`, `v2excrptps`,
  `v2jucorrdc`: hidden acts, so reputation, and the corruption construct D23
  retired), impartial administration (`v2clrspct`) and predictable enforcement
  (`v2cltrnslw`), both characterisations of the WGI kind, and common-good
  justification (`v2dlcommon`, Cuba second of 53).
- `political_polarization` (D121) and `voter_turnout` (D129) stay checks.
- Nothing in V-Dem answers `institutional_trust` (public confidence),
  `court_case_clearance`, `volunteering_rate`, `national_belonging`,
  `government_foresight_capacity` or cross-agency delivery.

V-Dem is pinned to v16 (March 2026, 2025 values) since dataset 7.7.1. A13
still quotes v15 polarization figures and needs restating.

Parked, with the reason:

- **TRUST-1 pooling** (DEU, GBR, NLD): needs a GESIS account; every `gesis.org`
  host answered 403 from a cloud session.
- **TRUST-2 court clearance**: rejected at the coverage screen, 13 of 53.
  Reopen only if a harmonised non-European series appears.
- **Cross-agency delivery** (Coordination) and **large-project delivery**
  (Building): no full-frame source family exists, and the V-Dem sweep found none (D131).
- **PISA or PIAAC** (Learning): coverage skips much of the frame and would feed
  the guardrail. Reopen only as part of the Q3 construct audit.
- **OxCGRT response speed** (`institutional_responsiveness`): failed triage on
  construct, not coverage (53 of 53). The first non-zero economic-support code
  is set by the cheapest decree, coded dates are effective dates backfilled
  after the fact, 25 of 53 countries fall inside the coding error, and it is
  one 2020 event that never updates. Not wired, not even as a check. Brazil's
  dated 2020 sequence is usable as narrative in the adaptability report. See
  the memo in `docs/research/adaptability/`.
- **SUBNATIONAL-1**: waits on a construct decision (plan fidelity,
  reallocation or execution), not on research.

## Read before starting

An agent taking a research task reads these files in this order:

1. `AGENTS.md` for repository invariants and build rules.
2. `docs/WHY.md` for the claim under test.
3. `docs/DECISIONS.md` for the current methodological contract.
4. `docs/KNOWN-ARTEFACTS.md` for the failures the next source must address.
5. `docs/EVIDENCE.md` when the work produces a documented case rather than a
   comparable series.
6. The relevant registry rows in
   `packages/core/src/model/indicators.ts`.

Do not start by adding a number to `data/observations/manual.json`. First write
down what the number measures, why it answers the indicator definition, who
publishes it, and how its country and year coverage will be made comparable.

## The three research tracks

Every task must name its track before work begins.

### A. Source-backed measurement

This track produces observations that can enter `score`, `confidence` and the
indicator rows. A series needs a registry definition, a named inspectable
publisher, a source URL, a year, a clear unit, a direction and a documented
transform. It must pass the coverage and quality gates below.

World Bank ingestion and reproducible source adapters are live in v0.
`manual.json` is for human-entered values from a source that has no usable API.
A repeated manual process is a signal to build an adapter, not a reason to
grow a larger hand-maintained file. The first adapter is the pinned official
Joint EVS/WVS results table for generalized interpersonal trust.

### B. Evidence records

This track records a delivered institutional case when no comparable series
exists. Evidence records live in `data/evidence` and never enter a score or
confidence. Use `docs/EVIDENCE.md`. Do not turn a collection of country stories
into a synthetic indicator.

### C. Delphi interpretation

This track reviews thin or questionable source-backed evidence and records
judgment, disagreement and missing evidence. Its outputs are research leads:
disagreement can identify likely mismeasurement, and repeated `missingEvidence`
items can become source-research tickets. It does not create observations. Run
it after a source-backed change, not as a shortcut around one. A Delphi estimate
can help choose the next source task, but it cannot close that task.

## The source-to-indicator workflow

An agent should leave a clear artifact at every stage.

### 1. Select the research question

Take the next item in the queue above, or name the objective a new item moves
and the dimension it moves it in. Do not choose a country because it has an
interesting story. The same source must be tested against the full current
country set.

Write a short source memo before implementation. It must state:

- the indicator id and the construct it is meant to measure;
- the proposed publisher, dataset and series or variable identifiers;
- the unit, direction, reference period and expected transform;
- the countries and years covered, including exclusions;
- the license and whether the underlying data can be inspected;
- known survey, sampling, denominator and definitional problems;
- whether the source is a candidate for scoring, a behavioural check, or an
  evidence record only.

### 2. Triage at the desk

Before fetching a single value, answer four questions from the publisher's own
documentation. One paragraph per candidate is enough, and a table when a sweep
covers many.

1. **Ceiling.** How many of the 53 does the publisher list, at the registry's
   scope? Below 27 the candidate is dead. Below 40 it needs a reason.
2. **Spread.** Will the values separate countries, or do they sit near a fixed
   point the way a clearance ratio sits near 100?
3. **Construct.** What does it observe, and is that the capability the
   dimension names or a stock that money buys? Behaviour, outcomes, rates and
   measures relative to resources usually observe capability, and levels of
   adoption or spending usually do not. Answer this in writing before seeing the
   value or its income correlation (D118).
4. **Cost.** Is there an adapter, or a publisher that serves the whole frame in
   one file? A row assembled from 53 national yearbooks is a harmonisation this
   project would author, and the answer is no unless the gain is large.

A candidate that fails a question stops there, with the paragraph filed in the
dimension's research folder. Only a pass earns a value preflight.

### 3. Test the candidate

For World Bank candidates:

```bash
pnpm bench probe --search "search terms"
pnpm bench probe --series SERIES[@DATABASE]
```

The probe is a preflight. Its current screen is at least half of the 53-country
frame, a latest value no older than eight years and at least three distinct
values. A correlation with log GDP per capita of 0.70 or more is printed as a
flag, not a failure (D118). A pass is necessary, not a promotion decision. Read what the series measures and run the full diagnostics
after it is wired.

For every other source, produce the same report before writing observations:
country coverage, year coverage, value spread, missingness, harmonisation
rules, source tier and the GDP comparison plan. Do not call a non-World Bank
candidate "tested" merely because a publisher page exists.

### 4. Decide the measurement treatment

The candidate must be assigned one treatment:

- `indicator`: enters the source-backed score after promotion;
- `check`: is published beside a dimension but excluded from every score and
  confidence calculation;
- `manual`: enters `data/observations/manual.json` while the source has no
  adapter, with an explicit reproducible extraction note;
- `gap`: remains unmeasured because coverage, inspectability or validity fails;
- `retired`: stays in the registry with the evidence for rejection.

If the choice changes a methodological rule, append a decision before changing
the code. Read the highest decision number immediately before writing and
re-check it after writing because another agent may append at the same time.

### 5. Implement the smallest reusable path

The registry remains the only place that defines indicators. A source adapter
may fetch, parse and normalize publisher data, but it must emit the existing
observation shape: indicator id, ISO3, value, year, source tier, source URL and
retrieval date.

The World Bank ingestion path remains in
`packages/core/src/pipeline/ingest.ts`. Non-World-Bank sources use the shared
adapter result contract in `packages/core/src/pipeline/adapters/types.ts`.
An adapter must be deterministic for a pinned source release, preserve the
publisher's raw value, make missingness explicit, and report coverage before
scoring. Its observations are loaded with World Bank and manual observations,
so the normal scoring and diagnostic code does not care which source produced
them.

Never commit licensed microdata or credentials. Commit a permitted derived
series, the extraction or transformation code, its source metadata and enough
documentation for another agent to reproduce the result.

### 6. Run the model checks

After a source-backed change:

```bash
pnpm bench ingest
pnpm bench score
pnpm bench diagnose
pnpm bench report
pnpm bench validate
pnpm build
pnpm typecheck
```

Use the applicable adapter command instead of `bench ingest` for a new source,
then run the same score and diagnostic commands. Inspect all of these before
calling the work complete:

- country and year coverage;
- the dimension's coverage floor and confidence;
- family balance, where the dimension declares families;
- indicator redundancy;
- wealth attribution and the dimension's correlation with log GDP per capita;
- source recency, missingness and outliers;
- whether a historical trend has enough matched observations.

Report the change against the objectives: the dimension's mean confidence
before and after, its r with log GDP before and after, and the guardrail.

An indicator that raises a dimension's wealth correlation or duplicates an
existing row needs a written rejection or a new decision. The diagnostics do
not make that judgment automatically.

### 7. Publish the change

Update the registry notes, source documentation, the relevant known artefact,
and the decision log when the evidence changes a methodological choice. Bump
the dataset version in `packages/core/src/model/version.ts` in the same change:

- major: the country set or normalization frame changes;
- minor: an indicator or published field is added without adding a country;
- patch: the same registry and country set are re-ingested.

Commit the generated observations and output together with their source code.
Record the old and new version in the handoff. If a country was added, rerun the
full frame and full Delphi process after the rebase. A subset panel run is a
preflight, not the published panel.

## Work package records

The detail behind finished, running and parked packages. The queue above says
what to do next; these sections say what was done and why.

### TRUST-0: freeze the baseline

**Goal:** establish the exact starting point before collecting new data.

**Read:** D23, D42, D57 and D60; the Trust rows in the registry; the current
`data/out/diagnostics.json`.

**Deliverable:** a source memo under `docs/research/trust/` containing the
current dataset version, observed coverage, family coverage, retired rows,
known artefacts and the two-series acceptance test.

**Status:** complete. `docs/research/trust/BASELINE.md` freezes the baseline as
it stood at dataset 4.4.0; current figures come from `data/out/diagnostics.json`
for dataset 6.1.0. Another agent can reproduce the baseline and knows which
existing series must remain excluded. The source promotion and generated output
are documented below.

### TRUST-1: harmonise the social measure

**Target:** `interpersonal_trust` first. Consider
`willingness_to_cooperate_strangers` only if the same source and harmonisation
process support it without weakening comparability.

**Current source:** the official [Joint EVS/WVS 2017-2022 results release](https://www.gesis.org/en/european-values-study/data-and-documentation/joint-evs/wvs-2017-2022-dataset),
release 5.0.0, published by GESIS. The `A165` table asks whether most people
can be trusted. Its published country results are weighted by `gwght`; `1`
means trusted, `2` means careful, and negative codes are missing in the source
codebook. The adapter uses the publisher's weighted percentage for `1`, stores
the release year 2022, and does not copy respondent-level microdata. It
currently recognizes 40 benchmark countries and emits 37 unique country rows.
Germany, Great Britain and the Netherlands have separate EVS and WVS rows and
are held until pooled microdata weights can be harmonised reproducibly.
Pooling them needs the registered GESIS microdata download. On 2026-10-01
every `gesis.org` host answered 403 from a cloud session, so the pooling rule
must be written from a machine with a GESIS account.

The research memo must keep access, licensing, country coverage, fieldwork
years, variable identifiers, response coding, weights, missing-value codes and
question wording explicit. WVS or EVS microdata must not be copied into the
repository if the license does not permit it.

**Fallback:** identify one inspectable survey source with equivalent wording
and a documented harmonisation rule. Do not splice unrelated survey questions
into one series because they share a label.

**Acceptance gate:** the derived series has a named variable and codebook,
documented weighting and missing-value treatment, a comparable reference period,
coverage reported against all 53 countries, and no unexplained country-specific
recoding. Use the half-frame screen as the first coverage test. If it fails,
keep the row as a gap and explain why.

**Deliverable:** the adapter, its permitted derived observation file, source
metadata and a coverage report. The current implementation is
`pnpm bench trust fetch`; it writes
`data/observations/joint-evs-wvs.json`, records additions in
`data/observations/revisions.json`, and then uses the ordinary `score`,
`diagnose` and `report` commands. The extraction note is
`docs/research/trust/JOINT-EVS-WVS.md`.

### TRUST-2: land the institutional-performance measure

**Target:** `court_case_clearance`.

**Status:** rejected at the coverage screen, 2026-10-01. The value preflight
found in-scope civil and commercial first-instance values for 2022 to 2024 in
13 of 53 countries, against a screen of 27, with a ceiling of 19 if CEPEJ
becomes readable and two flagged scopes resolve. CEJA pools every matter and
cannot fill the row. The row stays a gap. Values, sources and diagnostics are
in `docs/research/trust/COURT-CLEARANCE.md`.

**Primary candidates:** [CEPEJ-STAT](https://www.coe.int/en/web/cepej/cepej-stat),
OECD and national court statistics, as already named in the registry and A12.
CEPEJ defines clearance rate as resolved cases divided by incoming cases and
warns that court-system differences affect comparison. The target is resolved
civil and commercial cases divided by incoming cases in the same year. The memo
must specify whether pending cases, appeal cases, criminal cases and
administrative cases are included. Those choices cannot vary silently by
country.

The [OECD Trust Survey](https://www.oecd.org/en/publications/2024/07/oecd-survey-on-drivers-of-trust-in-public-institutions-2024-results_eeb36452.html)
is a useful comparator for institutional trust, but its 2023 wave covers 30 OECD
countries. It cannot by itself satisfy the current 53-country performance
measure gate.

**Fallback:** a comparable institutional-performance series that observes
whether public institutions complete their work. A perception of institutional
quality is not enough for this gate.

**Acceptance gate:** the numerator, denominator, case scope and year are known
for every country-year used; countries with incompatible court systems are
flagged rather than silently pooled; coverage is reported for all 53 countries;
and the series is recent enough to be useful. The series must add information
to the existing 2019 contract-enforcement row rather than duplicate it.

**Deliverable:** a harmonisation table, source notes, quality exclusions and a
reusable adapter or a clearly bounded manual import while the adapter is built.

### TRUST-3: build the adapter path

**Goal:** make the social and institutional imports repeatable.

**Status:** first path complete for the Joint EVS/WVS social measure. The shared
contract is in `packages/core/src/pipeline/adapters/types.ts`; the adapter is
in `packages/core/src/pipeline/adapters/joint-evs-wvs.ts`.

**Deliverable for the remaining work:** add adapters for court or other
institutional-performance sources with fixture data, a coverage report and a
deterministic output matching the observation schema. Keep the World Bank
ingestion behavior unchanged.

**Done when:** an agent can rerun the import from a pinned source release
without editing values by hand, and a failed fetch cannot silently erase the
previous published observations.

### TRUST-4: promote only after the diagnostics review

The first social-plus-contract release is promoted in dataset 4.4.0. Future
promotion is a single reviewed change. It must include the registry row or
rows, adapter or permitted manual data, source metadata, version bump, decision
entry and generated output.

The review must show:

- at least one social and one institutional-performance series in the frame;
- country overlap and coverage for the resulting Trust cells;
- no use of retired WGI, homicide or bribery-incidence rows;
- the Trust dimension's wealth attribution and GDP correlation;
- redundancy checks across the two families;
- confidence and coverage beside every published Trust score.

The current release passes the structural family test where it publishes, but
it does not close the research package: court performance, broader coverage,
and the wealth and redundancy review remain open. Do not use Delphi to fill
those missing measurements.

### TRUST-5: rerun interpretation after release

After the source-backed Trust release is committed, run a cost preflight and a
full multi-model gateway Delphi against the new dataset version. Activate only
after review:

```bash
pnpm bench cost --max-coverage 1
pnpm bench delphi --rounds 2 --max-coverage 1 --activate
pnpm bench validate
```

Use `--max-coverage 0.5` for a cheaper focused preflight on thin dimensions.
Use `--max-coverage 1` for the full nine-dimension panel against the current
dataset version and country set.

The panel may disagree with the new Trust score. That disagreement is a
research result. It does not alter the observations, score or confidence.

### COORD-1: V-Dem civil-society adapter

**Goal:** add one inspectable Coordination signal without reviving the retired
World Bank perception composites.

**Status:** complete in dataset 4.5.0. The pinned V-Dem Country-Year Core v15
release emits `v2x_cspart` for all 53 countries at 2024. The adapter, source
memo, derived observation file and diagnostic review are committed together.

**Open:** this is expert-coded evidence, not administrative delivery. The next
Coordination task is a cross-agency performance series; the next Trust task is
court-case clearance. Neither can be inferred from V-Dem.

### SUBNATIONAL-0: make the Brazil diagnostic layer maintainable

**Goal:** keep subnational research useful without creating a second capability
score or a hidden input to the national frame.

**Status:** complete in dataset 5.0.0. D89 supersedes the old fixture contract.
The registry, computed reconciliation check, revision log, datapackage schemas,
`bench all` integration and viewer tracing are live. The current IBGE SIDRA
state Gini is explicitly `independent`: its equal-unit mean is a diagnostic and
does not claim to recompose the national Gini.

**Read:** D66 and D89; `docs/research/subnational/BRIEF.md`.

**Open:** source-backed series selection. The layer should grow only where a
national dimension is weak and a subnational source reveals delivery,
coordination or variation the national frame cannot observe.

### SUBNATIONAL-1: test budget-execution fidelity

**Target:** `budget_execution_fidelity` by Brazilian state, as a Coordination
candidate.

**Status:** candidate; source and coverage preflight complete. The source memo
at `docs/research/subnational/SICONFI-BUDGET-EXECUTION.md` records 27 / 27 state
coverage for sampled RREO Anexo 01 releases in 2020, 2022 and 2024, with all
five candidate fields present. No SICONFI values have been promoted or
committed. The denominator and construct remain open because original-to-updated
budget revisions are material and execution ratios cross 100%.

**Primary source:** Secretaria do Tesouro Nacional's SICONFI RREO open-data
API, with Anexo 01 Balanço Orçamentário as the starting table. The candidate is
not assumed to be aggregate merely because it is administrative budget data.

**Acceptance gate:** distinguish original from amended budgets and empenhado
from liquidado or pago, inspect retifications, settle the construct and
denominator, then review GDP attribution and redundancy. If it fails, record the
result as a gap or evidence-only source and retain the Coordination gap.

**Next action:** resolve whether the layer is measuring plan fidelity, budget
reallocation or current-budget execution before adding a second registry entry
or adapter.

## Country-set changes are a separate project

Do not add countries while closing a source gap unless the user explicitly
requests a frame expansion. Adding a country changes the normalization frame
and requires a major version, a full re-ingest, a full rescore, refreshed
diagnostics and a full Delphi rerun. The source research queue should first
make the current 53-country frame more informative.

## Agent handoff template

Every research task ends with a short handoff containing:

```text
Task: TRUST-1, TRUST-2 or another roadmap id
Track: source-backed, evidence or Delphi
Status: research, candidate, blocked, promoted or rejected
Dataset and release:
Indicator ids:
Countries covered: n / 53
Years covered:
Source and license:
Files changed:
Commands run:
Diagnostics result:
Objective moved: O1 or O2, dimension, before and after
Decision entry:
Version impact:
Next action:
```

Use `blocked` only when a named external dependency prevents progress.
Use `rejected` for a triage or screen failure; it is a finished result. Record
the attempted source and the evidence for the block so another agent does not
repeat the same search.
