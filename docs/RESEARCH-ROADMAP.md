# Research roadmap

This is the working queue for extending the benchmark. It turns a declared gap
into a source-backed indicator only after the source, construct and country
coverage have survived review.

The roadmap is an execution document. Methodological choices still belong in
`docs/DECISIONS.md`, source records belong in the registry, and documented
deliveries belong in `data/evidence`. If this file conflicts with a decision,
the decision wins and this file must be updated.

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

Choose a dimension and a declared gap. Start with the gap that addresses the
largest known measurement failure or the weakest family balance. Do not choose
a country because it has an interesting story. The same source must be tested
against the full current country set.

Write a short source memo before implementation. It must state:

- the indicator id and the construct it is meant to measure;
- the proposed publisher, dataset and series or variable identifiers;
- the unit, direction, reference period and expected transform;
- the countries and years covered, including exclusions;
- the license and whether the underlying data can be inspected;
- known survey, sampling, denominator and definitional problems;
- whether the source is a candidate for scoring, a behavioural check, or an
  evidence record only.

### 2. Test the candidate

For World Bank candidates:

```bash
pnpm bench probe --search "search terms"
pnpm bench probe --series SERIES[@DATABASE]
```

The probe is a preflight. Its current screen is at least half of the 52-country
frame, a latest value no older than eight years, at least three distinct values,
and correlation with log GDP per capita below 0.70. A pass is necessary, not a
promotion decision. Read what the series measures and run the full diagnostics
after it is wired.

For every other source, produce the same report before writing observations:
country coverage, year coverage, value spread, missingness, harmonisation
rules, source tier and the GDP comparison plan. Do not call a non-World Bank
candidate "tested" merely because a publisher page exists.

### 3. Decide the measurement treatment

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

### 4. Implement the smallest reusable path

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

### 5. Run the model checks

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

An indicator that raises a dimension's wealth correlation or duplicates an
existing row needs a written rejection or a new decision. The diagnostics do
not make that judgment automatically.

### 6. Publish the change

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

## P0: finish Trust

Trust currently has eight registry rows, two observed indicators, three retired
rows and three gaps. The first source-backed release publishes a provisional
Trust score for 36 of 52 countries from one generalized social-trust measure
and the existing institutional-performance contract-enforcement measure. D57's
two-family acceptance test is structurally met for those cells, but the result
remains thin: confidence is 0.159 where both rows are observed, the social
measure is a perception proxy, contract enforcement is frozen at 2019, and
court performance is still missing. D60's bribery-incidence series remains a
useful behavioural check and is deliberately excluded from the score.

Do not treat the first score as the finished Trust construct. The next work is
to pool the held Joint EVS/WVS rows reproducibly and to land court-case
clearance or another comparable institutional-performance measure. Delphi can
interpret the thin release, but it cannot fill either gap.

### TRUST-0: freeze the baseline

**Goal:** establish the exact starting point before collecting new data.

**Read:** D23, D42, D57 and D60; the Trust rows in the registry; the current
`data/out/diagnostics.json`.

**Deliverable:** a source memo under `docs/research/trust/` containing the
current dataset version, observed coverage, family coverage, retired rows,
known artefacts and the two-series acceptance test.

**Status:** complete for dataset 4.4.0. Another agent can reproduce the
baseline and knows which existing series must remain excluded. The source
promotion and generated output are documented below.

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
currently recognizes 39 benchmark countries and emits 36 unique country rows.
Germany, Great Britain and the Netherlands have separate EVS and WVS rows and
are held until pooled microdata weights can be harmonised reproducibly.

The research memo must keep access, licensing, country coverage, fieldwork
years, variable identifiers, response coding, weights, missing-value codes and
question wording explicit. WVS or EVS microdata must not be copied into the
repository if the license does not permit it.

**Fallback:** identify one inspectable survey source with equivalent wording
and a documented harmonisation rule. Do not splice unrelated survey questions
into one series because they share a label.

**Acceptance gate:** the derived series has a named variable and codebook,
documented weighting and missing-value treatment, a comparable reference period,
coverage reported against all 52 countries, and no unexplained country-specific
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
countries. It cannot by itself satisfy the current 52-country performance
measure gate.

**Fallback:** a comparable institutional-performance series that observes
whether public institutions complete their work. A perception of institutional
quality is not enough for this gate.

**Acceptance gate:** the numerator, denominator, case scope and year are known
for every country-year used; countries with incompatible court systems are
flagged rather than silently pooled; coverage is reported for all 52 countries;
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

## The next queue after Trust

These are ordered by measurement risk and expected usefulness, not by country.

| Priority | Work package | First candidate | Completion condition |
| --- | --- | --- | --- |
| P1 | Experimentation | OpenAlex citation impact | Inspectable field-normalized impact series with country coverage and a wealth-attribution review. |
| P1 | Learning | PISA or PIAAC outcomes | Comparable outcome series with an explicit country coverage decision. |
| P1 | Coordination | V-Dem civil society, then cross-agency delivery | A behavioral or institutional series that does not recreate the retired WGI problem. |
| P2 | Adaptability | ILOSTAT long-term unemployment and UNCTAD export diversification | Recent, comparable series with denominator and country mapping documented. |
| P2 | Shared Purpose | WVS civic participation and IDEA voter turnout | A behavioral participation measure that does not confuse pluralism with conformity. |
| P2 | Building | Large-project delivery | A comparable cost and schedule dataset, or a documented decision that it remains an evidence-only gap. |

Each work package begins with a source memo and ends with the same diagnostic
review. A candidate list in a registry note is not a completed task.

## Country-set changes are a separate project

Do not add countries while closing a source gap unless the user explicitly
requests a frame expansion. Adding a country changes the normalization frame
and requires a major version, a full re-ingest, a full rescore, refreshed
diagnostics and a full Delphi rerun. The source research queue should first
make the current 52-country frame more informative.

## Agent handoff template

Every research task ends with a short handoff containing:

```text
Task: TRUST-1, TRUST-2 or another roadmap id
Track: source-backed, evidence or Delphi
Status: research, candidate, blocked, promoted or rejected
Dataset and release:
Indicator ids:
Countries covered: n / 52
Years covered:
Source and license:
Files changed:
Commands run:
Diagnostics result:
Decision entry:
Version impact:
Next action:
```

Use `blocked` only when a named external dependency prevents progress. Record
the attempted source and the evidence for the block so another agent does not
repeat the same search.
