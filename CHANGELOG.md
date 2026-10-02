# Changelog

Release notes for the benchmark frame and the viewer that publishes it. App
releases describe the whole user-facing product; dataset releases describe the
scored data contract. The build checks that the newest entry in each stream
matches its source version.

The entries before App 1.0.0 are retrospective, high-level summaries
reconstructed from the repository history. They document explicit version bumps
and may skip versions that were never committed.

## App 1.24.5 — 2026-10-02

- **Known limits restated on the current dataset.** Coordination no longer
  reads small states low: Uruguay scores 73.9 and Costa Rica 88.6, and the
  score is unrelated to population. What remains is narrower, and A9 now
  says so: the civil society row pulls down states that coordinate through
  the executive, Singapore most of all. Every other entry is refreshed to
  7.7.1 or names the run its figures come from. No limit quotes the old
  one-panelist estimates any more, because they were scored on a different
  frame (D139). A7 is now about Korea and Japan reading low on Learning.

## Dataset 7.7.1 — 2026-10-02

- **V-Dem moves to release 16 (March 2026).** Court compliance and civil
  society strength now read 2025 values, and the polarization and turnout
  checks follow. V-Dem re-estimated its whole series for this release, so
  2024 values restate as well as gaining a year: 52 of 53 court compliance
  values and 51 of 53 civil society values moved. Trust's correlation with
  income goes from 0.671 to 0.675 and Coordination's from 0.563 to 0.558;
  mean confidence is unchanged in both. The largest country moves are South
  Africa down 3.4 on Trust and Haiti up 6.4 on Coordination. Same registry,
  same 53 countries.

## App 1.24.4 — 2026-10-01

- **31 more documented deliveries, nine of them losses.** Every country now
  has at least three. The losses include HS2, Mexico's disaster fund
  FONDEN, Singapore's Tuaspring desalination partnership, PPP Canada,
  China's PPP programme, India's UDAN regional flights and Sweden's health
  emergency stockpile. The flagships include Crossrail, the Champlain
  Bridge, the Hokuriku Shinkansen, Singapore's Jobs Support Scheme,
  Ireland's research centres and Nicaragua's disaster insurance through
  CCRIF. A second reviewer checked every number at its official source.
  The capability agenda is regenerated.

## App 1.24.3 — 2026-10-01

- **27 more documented deliveries, six of them losses.** The losses are
  Peru's southern gas pipeline, Bolivia's Mutún steel plant, Thailand's
  disaster warning towers, Germany's Bildungsprämie, Spain's fintech
  sandbox and Spanish employer training. The flagships include Peru's
  Talara refinery, Indonesia's 35,000 MW programme, Ecuador's Coca Codo
  Sinclair, Germany's LNG terminals, Argentina's Atucha II, Poland's
  Vistula Spit canal and Rwanda's Marburg response. A second reviewer
  checked every number at its official source. The capability agenda is
  regenerated.

## App 1.24.2 — 2026-10-01

- **30 more documented deliveries, eight of them losses.** The new records
  reach 16 more countries. Among the losses are the US Affordable
  Connectivity Program, Cuba's currency unification, Australia's VET
  FEE-HELP loans, France's pandemic mask stock and Montevideo's Rivera rail
  line. Among the flagships are the Interstate Highway System, Operation
  Warp Speed, the Swiss shelter system, Finland's Report on the Future,
  Estonia's state stockpiles and Chile's infrastructure concessions. A
  second reviewer checked every number at its official source. The
  capability agenda is regenerated.

## App 1.24.1 — 2026-10-01

- **25 documented deliveries for the 16 countries that had one.** Each of
  them now has two to four. Ten of the new records document a loss, among
  them Kenya's adult education centres, Canada's long-gun registry, China's
  zero-COVID policy and Haiti's PetroCaribe projects. The flagships include
  China's high-speed rail, the Barakah nuclear plant, Tel Aviv's Red Line
  and Cuba's hurricane civil defence. Every number was read at an official
  source and checked a second time by a separate reviewer. The capability
  agenda is regenerated.

## App 1.24.0 — 2026-10-01

- **The thesis tests what is left after income.** "Where the claim holds,
  and where it fails" now reads in three steps: what the nine capabilities
  share (the one-factor test of D137, which looks like income), what is left
  once income is taken out, and what that means for the strong claim
  (capability separate from wealth) and the weaker one (countries at the same
  income have different capability shapes). Every verdict is a template the
  computed reading chooses, with the n beside it. On dataset 7.7.0 the
  strong claim does not hold for the shared part and the weaker one holds on
  50 countries, on a narrow margin the page states. The per-capability
  wealth chart stays.
- `/diagnostics` gains a section with all four tests, their nulls, the rule
  that reads each and the release and leave-one-out table. The front page's
  income module gains one sentence, and the glossary defines "capability
  shape". No country's residual is published anywhere. See D138.

## Dataset 7.7.0 — 2026-10-01

- **New published field: `diagnostics.residualStructure` (D138).** Four
  aggregate tests on the wealth residual over the countries with all nine
  residuals: whether the residuals share a factor (against D137's chance level
  and a permutation baseline), whether income peers differ in shape (against
  incomes dealt at random and residuals dealt at random), whether each
  dimension's residual order holds between consecutive releases (read from
  git) and when one country is dropped, and how much of a country's profile
  income accounts for. Each carries its reading under rules fixed before the
  first run, and the weaker claim's verdict. Only statistics over countries:
  `residual.json` is unchanged and remains the only file with per-country
  residuals. `schema/residual-structure.schema.json` describes the field. No
  score or confidence changes.

## App 1.23.1 — 2026-10-01

- **Israel's desalination joins the documented deliveries.** Private
  concessions supplied a third of the country's fresh water in 2022,
  according to a State Comptroller audit that also records the weak
  oversight behind it. The capability agenda is regenerated.

## App 1.23.0 — 2026-10-01

- **The thesis shows whether the nine capabilities are one thing.** "Where
  the claim holds, and where it fails" gains a computed reading of the
  one-factor test: how much of the variation one shared factor carries
  (52.9% over 51 countries), what chance would give at that size (18.9%,
  21.5% at the 95th percentile), and how closely the factor follows income
  (r 0.86, n 50). At that strength the page says plainly that the shared
  factor looks like income. A chart draws the share against the chance band
  and the factor's correlation with income at every dataset release since
  1.0.0. `/diagnostics` publishes the loadings, the eigenvalues, the countries
  left out and the full release table, the front page's income module gains
  one sentence, and the glossary defines "first factor". See D137.

## Dataset 7.6.0 — 2026-10-01

- **New published field: `diagnostics.factorStructure` (D137).** The
  correlation matrix of the nine dimension scores over the countries with all
  nine scored, its eigenvalues, the first factor's share and loadings, its
  correlation with log GDP per capita, and a seeded Monte Carlo chance level.
  Below 30 complete cases the dimensions scored for at least 90% of countries
  are solved as well. `data/out/factor-history.json` holds the same test at
  every committed dataset release, read from git by `bench diagnose`, and
  `schema/factor-structure.schema.json` and `schema/factor-history.schema.json`
  describe both. No score or confidence changes.
## App 1.22.1 — 2026-10-01

- **Two sandbox records.** Brazil's central bank admitted seven of 52
  applicants to its first sandbox cycle. India's central bank admitted 28
  entities across four themed cohorts and found 13 products viable in the
  three whose exits it published. The capability agenda is regenerated.

## App 1.22.0 — 2026-10-01

- **Every country has a capability map in English.** `/country/<ISO3>/map`
  lists the nine capabilities with the score and the confidence as two
  numbers and the median of the 10 countries nearest in income, and
  `/country/<ISO3>/map/<dimension>` reads one capability: the indicators the
  score rests on, the conditions beside it and the country among its peers on
  the field chart. It is the same computed reading as the Brazilian and
  Spanish layers' maps, for all 53 countries, in the ground layer's English.
  It is the Map tab in each country's pages, beside the agenda. On a country
  with a layer, the header's language switch moves between the two maps on
  the same capability. The sitemap lists the 530 new pages and `/llms.txt`
  points at the pattern. See D136.
- **Facts about one country's row come from one table.** The few things a
  map says about one country's indicator that the published data does not
  carry, such as the survey behind a long-term unemployment series or why
  the row is empty, are now one table read by every language, held to the
  pinned ILOSTAT release by a test. The ground-layer map shows them for every
  country they are true of, 14 in all. The Brazilian and Spanish pages read
  as before.
- **English names that take an article get one.** The agenda and the map
  write "the United States", "the Netherlands", "the United Kingdom", "the
  United Arab Emirates", "the Philippines" and "the Dominican Republic"
  inside a sentence. The six English agenda documents are re-rendered. No
  score changes.

## App 1.21.0 — 2026-10-01

- **The evidence corpus has a finish line (D135).** Every country is checked
  against eight gaps a documented delivery can speak to, 424 cells in all. A
  cell closes with an evidence record or with a dated note of what was
  searched and why nothing qualified. 142 cells are closed today. The
  glossary gains an entry for the grid, and the research queue no longer
  offers a cell that is already closed.

## App 1.20.0 — 2026-10-01

- **Mexico, Colombia, Chile and Argentina get Spanish layers.** `/mexico`,
  `/colombia`, `/chile` and `/argentina` each hold an overview, the agenda and
  the capability map with its nine pages, in Latin American Spanish, read from
  the same files as the English pages. The overview is computed: the nine
  scores with the solidez de la evidencia beside each, links to the map and
  the agenda, and the known artefacts that bear on the country's capabilities.
  The layers hold no institutions, states or support pages, because the
  project has not done that work for these countries. Each country's English
  profile offers its Spanish reading in the header, the sitemap lists every
  new page, and the feed carries the four Spanish agendas. Brazil's pages are
  unchanged. See D134.

## App 1.19.1 — 2026-10-01

- **Portuguese copy names confidence "solidez da evidência".** In pt-BR,
  "Confiança" was both the Trust dimension and the label for the 0 to 1
  evidence number, so the Trust map page used the word twice in two senses
  (the cost D133 recorded). The evidence number is now "solidez da evidência",
  shortened to "solidez" in table headers, chips and the agenda's item
  headings, across the lexicon, the Portuguese glossary, the Brazil pages and
  the rendered `.pt-BR` agendas. Trust keeps "Confiança". English copy is
  unchanged. Copy change only; no score or confidence changes.

## Dataset 7.5.0 — 2026-10-01

- **Confidence in the courts is published beside Trust as a check (D132).**
  The Joint EVS/WVS share answering "a great deal" for the justice system,
  37 countries. It is not scored: closed and electoral autocracies read far
  higher than democracies on every confidence item tested (Vietnam and China
  above 85% on "a great deal or quite a lot"), and it does not follow what
  governments do with court rulings (r -0.13 with court compliance). The
  `institutional_trust` gap stays open. No score or confidence changes.

## App 1.19.0 — 2026-10-01

- **Brazil's layer maps all nine capabilities.** `/brasil/mapa` lists the
  nine in the model's order, each with Brazil's score, its confidence and
  where the score sits against the median of the 10 income peers, and links
  to one page per capability at `/brasil/mapa/<name>`, computed by the same
  `buildCapabilityMap` as D130's Adaptability page. A capability with no
  conditions (Coordination, Trust, Experimentation, Shared purpose) says so
  and draws no conditions panel; thin confidence is stated beside the score.
  Each page names the known artefacts that bear on its capability, by id,
  from one table checked against the limits document. The layer's tab strip
  gains one Mapa tab in place of the Adaptação tab, and `/brasil/adaptacao`
  redirects to `/brasil/mapa/adaptacao`. The sitemap lists all ten pages.
  See D133.

## Dataset 7.4.0 — 2026-10-01

- **Trust scores court compliance (D131).** V-Dem's coding of how often the
  government complies with important court rulings it dislikes, 53 of 53. It
  records what the state does when a court rules against it, which is what
  "strangers cooperate on the strength of the rules" rests on. Trust now
  scores 52 countries, mean confidence 0.31 to 0.35, and its correlation with
  income rises from 0.57 to 0.67, reported as a finding. The row tracks regime
  type closely (r 0.88 with V-Dem's electoral democracy index), and it pulls
  down Trust where bribery under-reporting had lifted it: China 88.7 to 67.5,
  Rwanda 78.9 to 63.9.
- **The V-Dem sweep declines every other candidate.** Bribery and corruption
  items read reputation, the construct D23 retired; deliberation and
  common-good items read closed autocracies as good (A13); administration and
  fiscal items are conditions. Coordination gains nothing from V-Dem. See
  `docs/research/vdem-sweep/TRIAGE.md`.

## Dataset 7.3.0 — 2026-10-01

- **Experimentation scores industrial design applications (D126).** Resident
  design filings per million people, World Bank `IP.IDS.RSCT`, 50 of 53. A
  filed design is a registered attempt at a new product form, cheaper and more
  frequent than a patent. Experimentation now scores all 53 countries, mean
  confidence 0.23 to 0.27, and its correlation with income falls from 0.62 to
  0.57. It partly overlaps trademarks (r 0.82).
- **The GEM extension is held (D125).** GEM's 2019 to 2025 reports would take
  entrepreneurial activity and fear of failure from 16 countries to 40, but
  the 14 they miss are mostly lower-income, and confidence would come to track
  income (0.29 to 0.39). The values are recorded in the research memo and not
  scored.

## App 1.18.0 — 2026-10-01

- **Brazil's layer maps Adaptability.** `/brasil/adaptacao` reads Brazil's
  Adaptability in Portuguese: the score and its confidence, the five rows it
  rests on with their published values, the broadband condition beside it with
  its correlation with income and with the score, and Brazil's place among its
  10 income peers on the flag field. Every sentence compares a value with a
  peer median, and the page recommends nothing. It is computed by
  `buildCapabilityMap` from the published files and regenerates with every
  release. The field chart and the conditions panel take Portuguese words, and
  the glossary defines capability map and income peers. See D130.

## Dataset 7.2.0 — 2026-10-01

- **`diagnostics.json` gains `income`.** The latest GDP per capita (PPP,
  constant international dollars) for each country, with its year, from the
  series the wealth tests already read. It is context and enters no score. It
  is published so the capability map's income peers are computed from the data
  (D130).
- **Agency scores perceived control (D127).** The Joint EVS/WVS mean answer
  to how much freedom of choice and control people feel over their lives, 1 to
  10, for 37 countries. It is a perception and labelled as one. Agency's mean
  confidence rises from 0.38 to 0.48 and its correlation with income falls
  from 0.64 to 0.58.
- **Shared purpose scores charitable membership (D128).** The share
  mentioning membership of a humanitarian or charitable organisation, the
  same release and 37 countries. Shared purpose now scores 51 countries
  instead of 47, mean confidence 0.26 to 0.34, and its correlation with
  income falls from 0.46 to 0.20.
- **Voter turnout is published beside Shared purpose as a check (D129).**
  V-Dem's turnout of registered voters at each country's latest election, 52
  of 53. Compulsory voting moves it by about 17 points and regime type barely
  at all, and it reads the democratic channel A5 retired, so it is not scored.
- **Confidence tracks income less.** Mean confidence against log GDP per
  capita falls from 0.33 to 0.29.

## Dataset 7.1.0 — 2026-10-01

- **Trust scores bribery incidence (D123).** The share of firms asked for a
  bribe in public transactions moves from a check to a scored row in Trust's
  institutional family. It records experience, not reputation, and D60 held it
  out only for its income correlation, which D118 no longer allows. Trust now
  scores 50 countries instead of 37, mean confidence 0.21 to 0.31, and its
  correlation with income falls from 0.61 to 0.57.
- **Learning scores research citation impact (D124).** The share of a
  country's articles and reviews in OpenAlex's top 10% for their field, as a
  ratio to the world, covers 53 of 53. Learning's mean confidence rises from
  0.37 to 0.50 and its correlation with income from 0.66 to 0.75.

## App 1.17.0 — 2026-10-01

- **Conditions sit beside every capability.** Country pages list what the
  country has to work with under each capability, with the published value,
  the year and its rank, in a panel separate from the behavioural checks.
  Capability pages show how each condition goes with income and with the
  capability's score. The Brazil layer and both agenda lexicons carry the
  same reading in Portuguese and English. `/sources` and `/indicators` mark
  conditions, `/explore` draws them as squares, and the glossary defines the
  term. See D122.

## Dataset 7.0.0 — 2026-10-01

- **Ten bought conditions leave the scores (D122).** Research spending,
  researchers and secure servers (Anticipation), internet users, account
  ownership and private credit (Agency), tertiary enrolment and education
  spending (Learning), broadband (Adaptability) and output per worker
  (Building) are fetched and published as `conditions` on each dimension,
  with a rank and never a 0 to 100 value. They enter no score, confidence or
  trend. `diagnostics.json` gains `conditions`: each one against income and
  against its dimension's score.
- **Scores move in five dimensions and are not comparable with 6.x.** Agency
  falls from r 0.85 to 0.64 against log GDP per capita, Learning from 0.73 to
  0.66, Adaptability from 0.84 to 0.74 and Building from 0.64 to 0.43.
  Anticipation stays at 0.87. The first factor's share of the dimension scores
  falls from 0.62 to 0.50. Agency and Learning confidence fall below 0.40.
  Brazil reads 45.8 on Anticipation, 51.6 on Agency, 30.2 on Learning, 65.4 on
  Adaptability and 28.2 on Building.

## App 1.16.1 — 2026-10-01

- **Three evidence records, one of them a reversal.** The Gotthard Base
  Tunnel opened on schedule at 51 percent over its 1998 cost basis. Finland
  has shelter places for about 4.8 million people. Germany ran its public
  shelter places down from about 1.6 million to 477,593, none of them
  operational. The capability agenda is regenerated on the larger corpus.

## App 1.16.0 — 2026-10-01

- **Checks can come from any source.** The sources page gains a database or
  release column for behavioural checks and prints the pinned file and
  variable behind a check that does not come from the World Bank. The first
  is political polarization from V-Dem. See D121.

## Dataset 6.2.0 — 2026-10-01

- **A row is chosen for what it measures (D118).** A candidate is decided on
  its construct. Its correlation with income is published as a finding and
  no longer passes or fails it. Dimension correlations with income are
  reported, not targeted.
- **Adaptability gains two observed rows.** Export concentration from
  UNCTADstat covers 53 of 53 countries (D119). The long-term unemployment
  share from ILOSTAT covers 44, behind a plausibility gate that drops
  questionnaire artefacts by rule, not by country name (D120).
- **Political polarization is published as a check, not scored.** V-Dem's
  `v2cacamps` reads closed autocracies as calm, and low polarization under
  repression is not shared purpose. It sits beside Shared purpose with that
  reason (D121, A13).

## App 1.15.1 — 2026-09-24

- **Reader copy says what each page holds.** Headings, ledes, the llms.txt
  summary and the English and Portuguese lexicons drop metaphor, slogans and
  internal facts, and follow American spelling. No number, score or
  dimension changes. Agenda markdown keeps its old intro lines until the next
  agenda run.

## Dataset 6.1.2 — 2026-09-23

- **The business R&D gap says why it is still a gap.** Its note claimed UIS
  publishes the series. UIS stopped in 2023, the remaining sources cover too
  few countries, and together they track income over the screen. No value
  changes.

## App 1.15.0 — 2026-09-23

- **The sources page prints every call.** Behavioural checks are fetched on
  every ingest and never scored; `/sources` now lists them with the request
  that fetches each one, so the page repeats every call the benchmark makes.
  See D116.
- **Charts and type follow the scale.** Every chart line reads a named stroke
  weight, the last `text-sm` is gone, and the agenda history axis reads "0 to
  100". Internal links all come from one set of helpers.

## Dataset 6.1.1 — 2026-09-23

A correctness fix to the out-of-frame flag and a regeneration of three stale
research layers. No score and no confidence changes.

- **A historical value beyond every current value is flagged.** When a current
  outlier was winsorized onto its fence, a historical value further out clamped
  without setting `outOfFrame`. Four more cells now count as clamped in the
  momentum baskets. See D115.
- **Residual, velocity and leverage cover 53 countries.** The three offline
  layers had not been regenerated since Portugal joined the frame.
- **Docs quote the current dataset.** KNOWN-ARTEFACTS, the research roadmap and
  the panelist brief now state 6.1 figures, recomputed from the output.

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

## App 1.14.0 — 2026-09-06

- **Coverage is drawn as the count it is.** How many of a capability's
  indicator rows were observed for a country used to read as a two decimal
  ratio, and as the words "not measured" where the count fell below the floor.
  It is now one tick per row, filled where the row was observed, with a notch at
  the two rows a score needs. The count is still printed beside it.
- **An observed year sits on a rail.** Every indicator record and every
  publisher row now shows when the value was observed as a position between 1990
  and this year, with the line trailing the tick showing how long ago that was.
- **A workbench page collects every mark.** Not published and in no navigation:
  it draws each chart beside the states it can take, from the live index.

## App 1.13.0 — 2026-09-02

- **The front page shows two drawings instead of naming them.** The wealth
  module carries the lane field in its measured arrangement, and a new module
  carries Brazil's system matrix. Each picture is the link to its page. See
  D113.

## App 1.12.0 — 2026-09-02

- **The dot motif behind the front page breathes.** The bubbles grow and
  shrink on the parent brand's 3.2 second cycle, at the same faint alphas as
  before. A reader whose system asks for reduced motion gets the still frame,
  and the motion stops while the band is off screen. See D112.

## App 1.11.0 — 2026-09-02

- **The institution network sidebar is a facet navigator.** Systems, levels and
  jurisdictions now have their own index and detail destinations beside the
  institution directory. Their cards show the number of institutions they
  contain, while the institution list keeps exact filters and group-by controls.
  See D111.

## App 1.10.0 — 2026-09-02

- **The institution network has a readable scope.** Broad network views open
  with state-level institutions hidden, because Brazil's feed has 282 of them
  against 75 federal institutions. A route-owned switch adds them back without
  losing the current URL filters, and institution-specific views keep their
  state relations visible by default. The full multi-select Level filter stays
  available for more exact combinations. See D110.

## App 1.9.1 — 2026-09-02

- **The institution network chrome is solid and deterministic.** The
  Envisioning panel aliases now resolve inside the route-owned theme, and the
  dense network toolbar no longer lets graph lines bleed through its controls.

## App 1.9.0 — 2026-09-02

- **The indicator registry can be read as lanes.** A new page at `/explore`
  draws every indicator in the lane of the capability it measures. A filled
  dot has data, a dashed ring is a declared gap and a thin ring is a retired
  row. A second arrangement moves each indicator to how closely its series
  tracks income, with the wealth threshold drawn as a rule and each
  capability's own correlation as a tick. A line joins the indicator pairs the
  diagnostics find redundant. Pointing at a dot reads it under the field, and
  the registry and the diagnostics pages both link to the drawing. See D108.

## App 1.8.0 — 2026-09-02

- **Bodies no country owns have a place.** A global ledger at
  `data/institutions/global.json` holds the UN, its programmes and agencies,
  the multilateral lenders and the intergovernmental standard setters, each
  once, with the benchmarked countries that are members of it. A country map
  reaches a body by id in a sourced relation, and the body then appears in
  that country's institution pages and drawn network at the global level.
  Brazil's map reaches UNDP, the IMF and the UN today.
- **Membership is a fact about the body.** Each global profile states how many
  of the benchmarked countries belong to it and whether the country being read
  does. Nothing in the ledger enters a score or a confidence. See D107.

## App 1.7.0 — 2026-09-01

- **The institution map can be read as a network.** A new page at `/network`
  draws Brazil's institutions and the relations between them, opening on one
  institution's neighbourhood rather than on the whole graph. Both institution
  pages link to it.
- **The relation ledger is still where a relation is read.** A drawn line shows
  that two institutions are connected and which family the relation belongs to.
  Which way it runs, and the verb that names it, stay on the institution page.

## App 1.6.3 — 2026-08-31

Panel run path, ahead of the first gateway run.

- **A run no longer activates itself.** A full-frame run used to replace
  `latest.json` whether or not `--activate` was passed, which put an unreviewed
  panel behind every Delphi surface the moment it finished. Activation is now
  always explicit.
- **Failed provider calls are counted and published.** A call that fails after
  retries is still dropped so the run survives, but `attemptedCalls` and
  `failedCalls` now travel on the run file, the command prints a warning, and
  `bench validate` reports both the failure count and any cell-round that came
  back with fewer panelists than the panel declares.
- **The default panel is four distinct vendors.** Mistral joins Anthropic,
  OpenAI and Google. The previous three-model default dealt one vendor two
  stances.
- **Panel prices come from the gateway.** The pricing table is read from the
  gateway's public model list, which states the rate a run is billed at, so no
  panel model carries an unverified price. See D106.
## App 1.6.2 — 2026-09-01

- **The charts draw from one set of weights and shades.** The radar, the flag
  field, the flag bubble and the sparkline carried nine stroke widths and twelve
  opacities between them, each chosen in its own file. They now read one scale
  of five weights and five shades, so a hairline means the frame and a heavy
  line means the data on every chart. Nothing moved by more than 0.1.
- **A design check runs before every build.** It warns, and never fails, when a
  stroke width is written by hand, when text-sm appears in a viewer file, when
  an em dash reaches reader copy, or when a repository document is named as a
  bare path instead of a link.

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
