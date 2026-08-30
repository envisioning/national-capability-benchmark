# Changelog

Release notes for the benchmark frame and the viewer that publishes it. The
version is the semantic dataset version; the build checks that the newest entry
matches it.

The entries before 4.4.0 are retrospective, high-level summaries reconstructed
from the repository history. They document explicit version bumps and may skip
versions that were never committed.

## 4.4.0 — 2026-08-30

The current published frame brings the full country set, the research layers
around it and the open viewer into one readable release.

- **A complete 52-country benchmark.** Every country is scored on the same nine
  capability dimensions, with confidence, gaps, trends and raw sources kept
  beside the score.
- **Trust has a source-backed adapter.** The pinned Joint EVS/WVS A165 table
  enters the observation store as publisher-weighted data; the behavioural check
  remains visible but outside the score.
- **Brazil has a local reading.** The institutional map and subnational
  corroboration show where capability is held and how a national result can be
  questioned without changing the country score.
- **The published output is inspectable.** Country files, indicator files, a
  flat table, diagnostics, agendas and a self-describing data package are
  produced from the same scoring run.
- **The viewer is ready to distribute.** Country CSV exports, a weekly digest,
  crawler metadata, an agent-readable contract and a public Atom feed now sit
  beside the interactive benchmark.

## 4.3.0 — 2026-08-29

This release made the boundary between scored evidence and useful but
non-scoring checks explicit.

- **Behavioural checks became a first-class output.** Bribery incidence is
  published beside Trust with its reason for exclusion, but does not enter a
  score, coverage floor or confidence calculation.
- **Trust was split by evidence family.** Social and institutional evidence are
  kept distinct, with court-case clearance recorded as a gap for future work.
- **The release added fields without moving published scores.** The version
  jump records a contract change while leaving the existing country results
  comparable.

## 4.1.0 — 2026-08-28

Coordination gained a directly observed measure of whether public budgets are
executed close to plan.

- **Budget execution fidelity was added as a scored indicator.** The pipeline
  uses a distance-from-100 transform so both under-spending and over-spending
  count as deviation.
- **The frame was rescored and the new indicator was published** in the
  country, indicator and flat-table outputs.

## 4.0.0 — 2026-08-28

The benchmark expanded to a complete 52-country frame and rebased its ruler.

- **Twelve Latin American countries completed the registry**, bringing the
  published set to 52 countries and completing the region's coverage.
- **Every score was restated against the new frame.** Because each country
  helps define the normalization endpoints, this was a major, announced
  dataset change; old scores are not directly comparable.
- **The Portuguese country reading covered the full region**, alongside the
  viewer and method-page updates that explained the rebased frame.

## 3.0.0 — 2026-08-28

The scoring frame stopped treating any country as an external reference.

- **All countries were scored against a ruler they helped build.** Tukey fences
  and the 0–100 endpoints now come from the full country set in the frame.
- **Every published score moved as a result**, so the dataset received a major
  version bump.
- **The panel workflow became inspectable.** A second institutionalist
  panelist, chat-ready prompts and merged panel replies were added to the
  research workflow.

## 2.0.0 — 2026-08-27

The benchmark began withholding claims where the evidence could not support a
dimension score.

- **Wealth-correlated evidence was retired where diagnostics showed it was
  misleading**, rather than allowing it to stand in for capability.
- **A coverage floor was introduced.** Thin dimensions publish their indicator
  rows, confidence, trends and evidence gaps, but no numeric dimension score.
- **The viewer learned to preserve missingness honestly**, leaving unsupported
  radar axes empty and labeling them as not measured.

## 1.1.0 — 2026-08-27

The first data contract was regenerated with the provenance and trend details
needed to inspect a result over time.

- **Trend outputs gained clamp counts and matched-basket context.**
- **Diagnostics gained out-of-frame and wealth-attribution fields.**
- **Data gaps and agenda holds became explicit published states**, rather than
  disappearing into an empty result.

## 1.0.0 — 2026-08-27

The first versioned benchmark contract established the project as a published,
inspectable dataset rather than only a prototype viewer.

- **The benchmark model covered nine capability dimensions** with equal-weight
  dimension scores and confidence reported separately.
- **World Bank observations, evidence gaps and Delphi estimates were kept
  distinct**, with provenance carried through the pipeline.
- **The output became self-describing.** A semantic version, JSON Schemas and a
  Frictionless Data Package were emitted alongside country, indicator and table
  outputs.
