# Changelog

Release notes for the benchmark frame and the viewer that publishes it. App
releases describe the whole user-facing product; dataset releases describe the
scored data contract. The build checks that the newest entry in each stream
matches its source version.

The entries before App 1.0.0 are retrospective, high-level summaries
reconstructed from the repository history. They document explicit version bumps
and may skip versions that were never committed.

## Dataset 4.5.0 — 2026-08-31

Coordination gained a full-frame, adapter-backed civil-society measure.

- **V-Dem civil society strength is now scored.** The pinned Country-Year Core
  v15 release contributes `v2x_cspart` for all 52 benchmark countries at 2024.
- **The adapter and provenance are reproducible.** The source release, variable,
  year and archive URL are fixed in the catalog; the derived observation file
  carries the expert-coded source tier and license note.
- **The frame stays at 52 countries.** This is a minor release: the new row
  changes scores and confidence, but does not rebase the country ruler.

## App 1.1.0 — 2026-08-30

- **Brazil's institution map is published for a drawn network.** The map is
  projected into a feed at `/api/institutions/BRA`, in English and in
  Portuguese, so the network can be drawn on a surface of its own. The relation
  ledger on the institution page is still where a relation's direction and its
  verb are read.
- **Only a jurisdiction the map has actually mapped is drawable.** The union,
  the state of Sao Paulo and the municipality of Sao Paulo carry enough
  recorded relations to have a shape. The 26 state entries that are still
  scaffolds do not, and the feed says so rather than drawing them.

## App 1.0.1 — 2026-08-30

- **The viewer has an icon.** The Envisioning mark now sits on a rounded
  near-black tile in the browser tab, on a home screen and in a bookmark list,
  generated at every size the platforms ask for.
- **The front page opens on a dark band.** It spans the window, on the same
  surface the footer uses, patterned with the dot motif the rest of Envisioning
  draws behind a hero.
- **The navigation hangs from one edge.** The sections, the trail into a page
  and the tabs under the header now line up on the right on a wide screen.
- **Buttons, fields and filters share one shape.** Every control on the site now
  comes from one place, so a form, a filter strip and a dialog agree about how
  tall a button is and how large its label reads.

## App 1.0.0 — 2026-08-30

The first formal product release gathers the benchmark, its research surfaces
and its public viewer into one navigable application.

- **The viewer is a complete reading surface.** Country profiles, comparisons,
  capability pages, agendas, diagnostics, sources and method pages are linked
  through one navigation tree.
- **Research is visible without being confused with scores.** Brazil's
  institutional map and subnational reading, the thesis, evidence workflow and
  provisional leverage, velocity and residual layers each state their scope.
- **The project is ready to be used and challenged.** Contact/support paths,
  embeddable views, social metadata, an agent-readable contract, public feeds
  and a human changelog are part of the release.
- **This app release publishes Dataset 4.4.0.** The dataset remains the stable
  reference for any quoted score; this app version identifies the surrounding
  product release.

## Dataset 4.4.0 — 2026-08-29

The Trust dimension gained its first source-backed international adapter while
the 52-country frame stayed fixed.

- **Trust now has a source-backed adapter.** The pinned Joint EVS/WVS A165 table
  enters the observation store as publisher-weighted data.
- **Behavioural evidence remains separate.** The bribery-incidence check stays
  visible beside Trust but remains outside scores, confidence and coverage.
- **The existing 52-country frame remains the reference.** No country was added
  and no normalization rebase was performed in this release.

## Dataset 4.3.0 — 2026-08-29

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

## Dataset 4.1.0 — 2026-08-28

Coordination gained a directly observed measure of whether public budgets are
executed close to plan.

- **Budget execution fidelity was added as a scored indicator.** The pipeline
  uses a distance-from-100 transform so both under-spending and over-spending
  count as deviation.
- **The frame was rescored and the new indicator was published** in the
  country, indicator and flat-table outputs.

## Dataset 4.0.0 — 2026-08-28

The benchmark expanded to a complete 52-country frame and rebased its ruler.

- **Twelve Latin American countries completed the registry**, bringing the
  published set to 52 countries and completing the region's coverage.
- **Every score was restated against the new frame.** Because each country
  helps define the normalization endpoints, this was a major, announced
  dataset change; old scores are not directly comparable.
- **The Portuguese country reading covered the full region**, alongside the
  viewer and method-page updates that explained the rebased frame.

## Dataset 3.0.0 — 2026-08-28

The scoring frame stopped treating any country as an external reference.

- **All countries were scored against a ruler they helped build.** Tukey fences
  and the 0–100 endpoints now come from the full country set in the frame.
- **Every published score moved as a result**, so the dataset received a major
  version bump.
- **The panel workflow became inspectable.** A second institutionalist
  panelist, chat-ready prompts and merged panel replies were added to the
  research workflow.

## Dataset 2.0.0 — 2026-08-27

The benchmark began withholding claims where the evidence could not support a
dimension score.

- **Wealth-correlated evidence was retired where diagnostics showed it was
  misleading**, rather than allowing it to stand in for capability.
- **A coverage floor was introduced.** Thin dimensions publish their indicator
  rows, confidence, trends and evidence gaps, but no numeric dimension score.
- **The viewer learned to preserve missingness honestly**, leaving unsupported
  radar axes empty and labeling them as not measured.

## Dataset 1.1.0 — 2026-08-27

The first data contract was regenerated with the provenance and trend details
needed to inspect a result over time.

- **Trend outputs gained clamp counts and matched-basket context.**
- **Diagnostics gained out-of-frame and wealth-attribution fields.**
- **Data gaps and agenda holds became explicit published states**, rather than
  disappearing into an empty result.

## Dataset 1.0.0 — 2026-08-27

The first versioned benchmark contract established the project as a published,
inspectable dataset rather than only a prototype viewer.

- **The benchmark model covered nine capability dimensions** with equal-weight
  dimension scores and confidence reported separately.
- **World Bank observations, evidence gaps and Delphi estimates were kept
  distinct**, with provenance carried through the pipeline.
- **The output became self-describing.** A semantic version, JSON Schemas and a
  Frictionless Data Package were emitted alongside country, indicator and table
  outputs.
