# Changelog

Release notes for the benchmark frame and the viewer that publishes it. App
releases describe the whole user-facing product; dataset releases describe the
scored data contract. The build checks that the newest entry in each stream
matches its source version.

The entries before App 1.0.0 are retrospective, high-level summaries
reconstructed from the repository history. They document explicit version bumps
and may skip versions that were never committed.

## Dataset 6.1.0 — 2026-08-31

Retired indicator rows leave the coverage denominator. Scores and the
normalization frame are unchanged; published confidence values restate upward
for Coordination, Trust, Building and Shared Purpose.

- **A rejected dataset is no longer counted as a hole.** Coverage is now
  observed indicators over the observed and gap rows. A row retired for cause
  stays in the registry, stays published with `status: "retired"` and stays in
  the diagnostics, but no longer lowers confidence. See D100.
- **Two dimensions cross a band.** Coordination and Shared Purpose move from
  very thin to thin. Trust stays very thin: it rests on two observed rows.

## App 1.9.0 — 2026-09-02

- **The indicator registry can be read as lanes.** A new page at `/explore`
  draws every indicator in the lane of the capability it measures. A filled
  dot has data, a dashed ring is a declared gap and a thin ring is a retired
  row. A second arrangement moves each indicator to how closely its series
  tracks income, with the wealth threshold drawn as a rule and each
  capability's own correlation as a tick. A line joins the indicator pairs the
  diagnostics find redundant. Pointing at a dot reads it under the field, and
  the registry and the diagnostics pages both link to the drawing. See D108.

## App 1.6.1 — 2026-08-31

- **Confidence values are compact.** Every confidence value uses one
  band-colored numeric chip instead of a separate meter and number, while the
  exact value and shared band legend remain visible.

## App 1.6.0 — 2026-08-31

- **Search is available everywhere.** The top navigation opens a searchable
  command palette with ⌘K/Ctrl+K, covering pages, countries, capabilities and
  indicators.

## Dataset 6.0.0 — 2026-08-31

Portugal (`PRT`) joins the benchmark as its 53rd country. The normalization
frame is rebased and every published score is regenerated; Dataset 5.1.0 values
are not comparable with this release.

- **Portugal is source-backed from the existing pipeline.** The release adds
  World Bank history, a Joint EVS/WVS trust observation and a V-Dem civil-society
  observation without adding synthetic or manual values.
- **Portugal enters the research queue.** Five documented, non-scored evidence
  records now cover four of its gap indicators, while the research inventory
  keeps 21 uncovered country-gap slots visible for further source work.

## App 1.5.6 — 2026-08-31

- **Challenge entry is centralized.** Score tables and radar readouts no longer
  repeat a challenge button; the top navigation now opens one shared form where
  readers choose the country and capability they want to contest.

## App 1.5.5 — 2026-08-31

- **Hover menus switch cleanly.** Leaving one top-level item closes its menu
  immediately, so moving across the navigation never leaves two panels open.

## App 1.5.4 — 2026-08-31

- **The top navigation hides while scrolling down.** It returns when the reader
  scrolls up, reaches the top, navigates to a new page or focuses the header.

## App 1.5.3 — 2026-08-31

- **The NCB lockup follows the parent brand alignment.** The glyph now sits
  beside the wordmark, with the full benchmark name aligned beneath it.
- **Hover explanations are quieter.** Scores, confidence, trends and chart
  points now use visible legends, inline context and accessible labels instead
  of a field of native browser tooltips. The intentional country field hover
  card remains.

## App 1.5.2 — 2026-08-31

- **The contextual navigation joins the header.** The subnav now shares the
  top-level navigation's surface and outer rule, with a tighter rhythm between
  the active section and the links it contains.

## App 1.5.1 — 2026-08-31

- **Country shapes appear on the homepage field.** Hovering a flag in the
  distribution now shows its nine-capability radar; the Countries menu remains
  focused on navigation.

## App 1.5.0 — 2026-08-31

- **Agenda evidence is positioned on the timeline.** Dated agenda items now
  appear on an aligned event rail for the selected capability, with the full
  item list kept visible below it.
- **Longer history is the default view.** The chart opens on the longest
  published capability span available for that country.

## Dataset 5.1.0 — 2026-08-31

The historical source window now reaches 1960, and agenda evidence carries its
documented start year into the published agenda JSON.

- **The source request stays complete at the longer horizon.** World Bank
  requests allow the full 52-country historical response instead of truncating
  once the 1960 window exceeds the former page size.
- **Long spans remain selective.** Ten-, twenty-, thirty-, fifty- and
  oldest-window momentum entries are attempted; only matched baskets that pass
  the existing evidence floor are published.

## App 1.4.0 — 2026-08-31

- **Agendas show capability history.** Each country agenda now has a selectable
  dimension chart with ten-year, twenty-year and longer spans where the matched
  evidence supports them.
- **Long history stays honest.** The chart keeps the current 0–100 frame,
  reports the matched-indicator count and leaves unsupported spans absent rather
  than interpolating them.

## Dataset 5.0.1 — 2026-08-31

The historical observation window now starts in 1976, adding the older source
values needed to test approximately 50-year capability movement.

- **Longer spans are published when earned.** The score output now attempts
  ten-, twenty-, thirty- and oldest-available-year momentum entries.
- **Current scores remain the same contract.** Older observations feed history
  and do not enter the current frame or headline dimension score.

## App 1.3.1 — 2026-08-31

- **Country navigation uses one contextual band.** The country context,
  reading choices and page tabs no longer occupy separate horizontal rows.

## App 1.3.0 — 2026-08-31

- **The agenda shows its research blind spots.** A complete 52-country by
  nine-capability matrix keeps every empty cell visible and links each filled
  cell to its source-checked delivery records.
- **Counts remain inventory, not scores.** Row and column totals describe the
  evidence corpus only; they never enter capability scores or confidence.

## Dataset 5.0.0 — 2026-08-31

The Brazil subnational pilot is now a maintained, self-describing diagnostic
layer.

- **Reconciliation is computed.** The former aggregate claim for the state Gini
  is now independent, with the equal-unit recomposition and signed residual
  published beside the national coefficient.
- **The output contract is generic.** Files live under
  `subnational/{ISO3}/{indicatorId}.json`, are indexed, and are generated from
  a registry rather than a one-off adapter.
- **Subnational values remain outside the benchmark.** They never enter a
  national frame, score, confidence, agenda or ranking. Aggregate claims are
  rejected when their per-series tolerance is exceeded.

## App 1.2.2 — 2026-08-31

- **Brazil's local reading names the diagnostic clearly.** The page now shows
  the computed recomposition and residual without describing the independent
  state Gini as corroborating a national value.

## Dataset 4.5.0 — 2026-08-31

Coordination gained a full-frame, adapter-backed civil-society measure.

- **V-Dem civil society strength is now scored.** The pinned Country-Year Core
  v15 release contributes `v2x_cspart` for all 52 benchmark countries at 2024.
- **The adapter and provenance are reproducible.** The source release, variable,
  year and archive URL are fixed in the catalog; the derived observation file
  carries the expert-coded source tier and license note.
- **The frame stays at 52 countries.** This is a minor release: the new row
  changes scores and confidence, but does not rebase the country ruler.

## App 1.2.1 — 2026-08-31

- **The footer lists what the header opens.** Its columns are now the site's
  sections, read from the same navigation tree the header walks, so every
  capability appears there alongside every method page. The footer had drifted:
  Capabilities opened nine pages in the header and offered one at the foot of
  the page.

## App 1.2.0 — 2026-08-31

Sections open their pages from the header, and the header stays with the reader.

- **A section can be opened without being entered.** Hovering a section in the
  header shows the pages under it, so what Countries, Capabilities, Method,
  Participate and About hold is reachable from anywhere instead of only from
  inside. The section is still one control: a click goes there. On a phone,
  where there is no hover, the menu sheet opens a section in place.
- **The Countries menu shows the country you are reading.** Open it from a
  country page and it draws that country's shape above the links, the same
  nine-axis radar the countries grid uses. Away from a country the menu is
  unchanged.
- **The menus close the way a reader expects.** Moving the pointer away,
  Escape with focus back on the section, or arriving at a new page. For a
  keyboard, ArrowDown opens a section and the arrow keys walk it, with Home and
  End reaching its ends.
- **The front page opens on what the benchmark is testing.** The band now
  states the claim it can fail, that a country's capability is separate from
  its wealth, instead of describing the shape of the data. The dimension count,
  the common scale and the confidence beside each score are all still there, in
  the sections under it that draw them.
- **The dot motif on the front page is quieter.** The band's texture was
  competing with the sentence it sits behind, so the dots now read as
  atmosphere rather than as something to look at.
- **The header and the tab strip travel together.** Both are pinned to the top
  of the window, so a section is one click away at any depth of a long page.

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
