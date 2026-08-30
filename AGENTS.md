# NCB, the National Capability Benchmark — agent notes

Prototype benchmark of a country's capacity to anticipate change, coordinate
action, learn, adapt and build under uncertainty. The current registry has 52
countries, nine dimensions, equal weights and no headline ranking.

## Commands

```
pnpm install
pnpm bench ingest      fetch World Bank series from 1990 into data/observations/worldbank.json
pnpm bench trust fetch import the pinned Joint EVS/WVS A165 trust table into data/observations/joint-evs-wvs.json
pnpm bench score       normalise and score, write data/out/index.json, data/out/countries/*.json and table.csv
pnpm bench delphi      run the LLM panel (add --mock to run offline)
pnpm bench diagnose    correlations, redundancy, GDP-sensitivity test
pnpm bench report      write data/out/report.md
pnpm bench agenda      write the capability agenda: JSON per country plus one markdown per lexicon
pnpm bench cost        measure the panel prompts and price a run before making it
pnpm bench residual    write the provisional wealth-residual fixture, one number per dimension
pnpm bench probe       test candidate World Bank series before wiring them: --series a,b[@db]
pnpm bench validate    schema-check data/delphi and data/evidence; add --fetch to live-check evidence source URLs
pnpm bench all         ingest, score, diagnose, report, agenda
pnpm build             tsc for packages/core, then next build for apps/web
pnpm typecheck         both packages
pnpm dev               the viewer at https://ncb.localhost (port 3888 behind it)
pnpm icons             rasterise the favicon set from the brand mark
```

The green gate is `pnpm build` plus `pnpm typecheck`. Both must pass. Run
`pnpm bench validate` after touching anything in `data/delphi` or
`data/evidence`.

`pnpm dev` runs the viewer through portless. The `dev` script in
`apps/web/package.json` is `portless`, and the `portless` key in the same file
names the app `ncb`, pins the child port to 3888, and points portless at the
real command in `dev:app`. Never set that key's `script` to `dev`: portless then
calls itself and the run fails with a duplicate route.

Keep the config in `apps/web/package.json`. A `portless.json` at the repo root
does not apply here. Portless read the package name instead of the root config
and recursed.

Port 3000 is the default for every other Next.js app on this machine, so this
repo fixes 3888 in `dev:app` and in `appPort`. Both must hold the same number.

To run without the proxy, use `PORTLESS=0 pnpm dev` or `pnpm --filter @ncb/web
dev:app`. Both serve http://localhost:3888. Portless needs a global install
(`pnpm add -g portless`); the repo does not depend on it.

The viewer is registered in `~/Dev/.claude/launch.json` as `benchmark-web` on
port 3888. That entry starts Next directly and does not use the proxy.

## Read these before changing the model

- `docs/DECISIONS.md` — every methodological choice, why it was made, what it
  costs, and what evidence would overturn it. **Append, never edit in place.**
  Supersede a decision with a new one so the reasoning stays auditable.
- `docs/KNOWN-ARTEFACTS.md` — where v0 produces a number that is wrong about the
  world rather than informative about it. Read before quoting any score.
  Experimentation (A1) and the GDP inseparability of Coordination and Trust (A3)
  are the ones that will bite you.
- `docs/PANEL.md` — how the Delphi layer works, the provenance rules, model
  selection, cost, and how to hand-author a run.
- `docs/EVIDENCE.md` — the inclusion rule for evidence records and how to
  author one. Read it before adding anything to `data/evidence`. See D33.
- `docs/RESEARCH-ROADMAP.md` — the executable research queue, source promotion
  gates and the Trust work package. Read it before extending the registry or
  adding a source adapter.

## Layout

- `packages/core` — the whole model. Registry, ingestion, normalisation, scoring,
  diagnostics, Delphi, CLI. Compiles to `dist`.
- `apps/web` — Next.js viewer. Reads `data/out/*.json` at request time.
- `data/observations` — raw values with source and year. `worldbank.json` holds
  the World Bank series and `joint-evs-wvs.json` holds the pinned Trust adapter
  output. `revisions.json` is the append-only log of what each run restated,
  added or dropped, and `snapshots/` holds dated full copies written only on
  `--snapshot`.
- `data/delphi` — one file per panel run, plus `latest.json`, which is a pointer
  to the active run rather than an archive. Keep the original alongside it.
- `data/evidence` — evidence records: documented deliveries filed against
  indicators that have no dataset. Never scored. Inclusion rule and authoring
  guide in `docs/EVIDENCE.md`. See D20.
- `data/out` — `index.json` is the slim list every page that shows more than one
  country reads. `countries/{ISO3}.json` carries one country in full, including
  every indicator row and its yearly series. `indicators/{id}.json` is the same
  data turned inside out, one file per indicator holding every country, which is
  what the click-to-compare panels fetch. See D30. Never load the country files to
  build a list: that is the 7 MB mistake D27 exists to prevent. Plus the flat
  table, diagnostics and report. `agenda/{ISO3}.json` is the computed capability
  agenda, language neutral, with `{ISO3}.{lang}.md` rendered beside it, one per
  lexicon. See D35. `residual.json` is the provisional wealth residual: each
  dimension score against the score its income predicts, one number per
  dimension and never one per country, offline until D65 promotes it. See D68.
  `datapackage.json` and `schema/` make the directory
  self-describing: a Frictionless Data Package descriptor plus one JSON Schema
  per published shape, generated from the Zod schemas on `bench score`. See D37.

## Invariants

- `packages/core/src/model/indicators.ts` is the single source of truth for
  indicators, and `countries.ts` for countries. Never define either anywhere
  else.
- Every term the project invents is defined once, in
  `packages/core/src/model/glossary.ts`, in language that assumes no prior
  knowledge. The glossary page renders it. Never explain a term a second way in
  a page: add or edit the entry instead. A new concept in the model needs a new
  entry in the same change. See D26.
- Confidence thresholds live in `packages/core/src/pipeline/confidence.ts`. The
  viewer colors by them and the report prints their labels, so both read the same
  file. Never hard-code a threshold in a page.
- Delphi estimates never enter `DimensionResult.score`. They live in
  `delphiScore` and `delphiIqr`. `blendedScore` falls back to the panel only
  when no indicator evidence exists, and `blendedFrom` records which was used.
- The radar owns its own readout. `Radar` in `apps/web/src/components/Radar.tsx`
  is a client component: each axis holds a sector as a hit target, pointing at
  one raises it, and the score, the confidence and the dimension question print
  under the chart. It always reads one axis and never none, at a fixed height
  that a hover cannot change, and it opens on the first dimension rather than on
  a summary: the mean of nine axes is the headline score this project withholds.
  The chart's accessible name is an `aria-label`, never an SVG `<title>`, which
  the browser renders as a tooltip. Grid cards inside a link pass
  `interactive={false}` and stay pictures. Language reaches it as one `lex`
  prop, never as loose strings. See D53.
- One field chart draws every country on one 0 to 100 axis, everywhere it is
  drawn: `FlagField` in `apps/web/src/components/FlagField.tsx`, used by the
  front page, the capability pages, both peek panels and the compare embed.
  `FlagBubble` is the only place a flag mark is drawn, and `FlagHistogram` adds
  the nine-capability switch on top of the field. Certainty is the bubble's ring
  and never the flag's opacity, and the ramp both it and the radar read is
  `evidenceOpenness` in `apps/web/src/lib/evidence.ts`. Never draw a second
  distribution: extend the point type instead. The words at each end of an axis
  come from `DIMENSION_ENDPOINTS` in the registry, never from a page. The grid
  of country radars lives at `/countries`. See D67.
- Confidence is never folded into the capability score. Two numbers, always. The
  radar draws thin evidence as a dashed edge with a hollow point, and the dash
  gap widens as confidence falls (see D32). Use `isThinEvidence` from
  `@ncb/core`, never a literal threshold in a component. The dash gradient's
  solid boundary reads the usable band from `CONFIDENCE_BANDS`.
- `data/observations/worldbank.json` holds every year from 1990, and scoring
  reads only the latest. The history exists for the trend layer. `momentum` is a
  list, one entry per span, shortest first: use `primaryMomentum` when a surface
  shows one number. It is computed against the current frame on the indicators
  observed at both ends, so a trend and a score sit on different baskets, and
  every surface that prints a trend prints its basket size. Each indicator also
  carries its own `series`, which has no basket problem and reaches as far back
  as the data does. Nothing is interpolated or carried forward into it. Every
  point carries its raw value, its normalized value and its own source tier, so
  a mixed international and national series stays readable. See D22, D24 and
  D25.
- Every ingest diffs itself against the file it replaces and appends what moved
  to `data/observations/revisions.json`. Never bypass that by writing
  `worldbank.json` directly: a restated value that is not logged is a number the
  record claims was always this. See D25.
- An evidence record's `pattern` field is analysis, not data. Everything else in
  the record is sourced from a named publisher; the mechanism and preconditions
  are ours. Keep them in that field so the two are never confused. See D31.
- A behavioural check is fetched, published and never scored. Checks live in
  `packages/core/src/model/checks.ts`, are observed under the `__check__` prefix
  and reach the output as `checks` on each `DimensionResult`. Nothing that
  builds the frame, the mean, the coverage floor or the confidence reads them.
  A check carries the reason it is not scored in its `notes`, which renders to
  the reader, and adding one needs a decision entry naming the test it failed.
  A series that passes the tests is an indicator, not a check. See D60.
- The wealth residual is never summed across dimensions. `ResidualFile` has no
  country-level field, `buildResidual` in
  `packages/core/src/pipeline/residual.ts` computes one fit per dimension, and
  nine residuals averaged into one number is the headline score D1 withholds
  with a regression in front of it. A residual is published with the strength of
  the fit that produced it, because a weak fit makes the residual repeat the
  score. Nothing in the viewer reads the file until D65 promotes the layer. See
  D68.
- Evidence records in `data/evidence` never enter a score or a confidence. A
  gap is promoted to a scored indicator only when a comparable series covers at
  least two countries, which is the minimum `buildFrame` accepts. See D20.
- A dimension with fewer than `MIN_INDICATORS_FOR_SCORE` observed indicators
  publishes no score. `score` is null, `belowCoverageFloor` is true and
  `observedIndicators` carries the count. Render it with `DimensionScore`, never
  with a bare `Score`, and never plot a null at zero: the radar leaves that axis
  empty. Confidence, the indicator rows and the trend still publish. See D45.
- Missing values are dropped from the mean and lower coverage. Nothing is imputed.
- Every country sets the normalization frame and every country is scored
  against it. All of them together set each indicator's Tukey fences and its 0
  and 100 endpoints. There is no reference set and no extended set: a country
  is never measured against a ruler it is absent from. See D47, which supersedes
  D16.
- **Adding a country rebases the whole dataset.** It moves the endpoints, it
  restates every published score, and it is a versioned, announced act. Do not
  do it as a side effect of adding data. Rescore, bump the major version, and
  say plainly that the old numbers are not comparable.
- The dataset version is semantic and lives in
  `packages/core/src/model/version.ts`, nowhere else. Major = frame rebase,
  which includes any country added, or a published field removed. Minor =
  indicators or fields added with no country added. Patch = re-ingest under the
  same registry and country set. Bump it in the same change that earns the bump.
  See D37 and D47.
- The app release version is also defined in
  `packages/core/src/model/version.ts` as `APP_VERSION`. It covers the
  user-facing viewer, routes, research surfaces and documentation, and is
  recorded in an `App X.Y.Z` changelog entry. It moves independently from the
  dataset version, which is recorded in a `Dataset X.Y.Z` entry.
- A value outside the frame clamps to 0 or 100 and sets `outOfFrame` on the
  cell. A current value cannot do this, because its own country helped build the
  frame. A historical value can, which is what the trend clamp counts report.
- `ingest: 'gap'` indicators stay in the registry. They lower confidence and
  they are the data-collection agenda. Do not delete them to make numbers look
  better.
- `ingest: 'retired'` means a dataset exists and the project rejected it. Those
  rows also stay, are not fetched, are not scored, and lower confidence exactly
  as a gap does. Branch on `isScored(def)` from `@ncb/core`, never on
  `ingest === 'gap'`. Retiring an indicator needs a decision entry naming the
  evidence. See D23.
- Delphi provenance is stored on the run file, never inferred from a model
  string. Branch on `isEvidential(run.provenance)` and `isPanel(run)`, both
  exported from `@ncb/core`. A `mock` run must never be presented as evidence,
  and a run with fewer than three panelists has no distribution to read.
- `splitAgenda` in `packages/core/src/pipeline/agenda.ts` is the only place that
  sorts an agenda into raise, measure and hold. The country lede and the agenda
  document both call it, so both name the same leading dimension. Never re-sort
  an agenda inside a component. See D39.
- The institution map publishes no node-link diagram. `INSTITUTION_RELATION_FAMILY`
  in `packages/core/src/model/institutions.ts` is the only place a relation verb
  is sorted into a family, and `InstitutionsView` renders every family in the
  declared order, including the empty ones. Language reaches the view as one
  `lex` prop and the vocabulary lives in `Lexicon.institutions`, never as
  `*_PT_BR` imports in a component. Never lay an institution out by hand: every
  surface derives from counts, because a country file grows. See D56, which
  supersedes the interface D54 described.
- The one whole-country picture is the system matrix, computed by
  `buildInstitutionMatrix` in `packages/core/src/pipeline/institutions.ts` and
  nowhere else. Its ramp is the three fixed breaks in `MATRIX_BANDS`, on the
  count and never fitted to the data: a count is absolute, so the ramp holds
  still across family filters and across countries. It stops below lime, because
  the page spends its one accent elsewhere. See D58.
- A generation date is metadata, never prose. It renders as a dateline under
  the title, from `agenda.generated` in the lexicon, and the intro that follows
  states what a score means. Never put a date back inside a sentence. See D40.
- A repository file named in a rendered document or a page is a link, built by
  `docHref` in `packages/core/src/model/project.ts`, which also holds `REPO_URL`
  and the document constants. Never write a bare `docs/*.md` path or a GitHub
  URL by hand: a published document reaches readers with no checkout. See D40.
- The quoting contract for an automated reader is `docs/FOR-AGENTS.md`: a score
  never travels alone, and the document names the fields that must accompany it.
  `/llms.txt` is the map that points at it, generated in
  `apps/web/src/app/llms.txt/route.ts` from the registry and the current index
  and never hand-written, so a re-ingest cannot leave it stating a stale count.
  Rules go in the document, not in the route. See D59.
- Language is an interpretation layer. The ground layer stays English end to
  end: ids, registry definitions, JSON output. Translations live only in
  lexicons under `packages/core/src/i18n/`, one data file per language, and
  every lookup falls back to the registry English, so a partial lexicon renders
  complete pages. Never translate in place, and never let a rendered document
  compute a number the JSON does not carry. See D35.
- **The viewer publishes no translated edition.** It publishes one English
  benchmark and country layers beside it. A country layer is a second reading
  of one country in that country's language: its shape, its agenda, its
  institutions and its subnational spread. `COUNTRY_LAYERS` in
  `apps/web/src/lib/layers.ts` is the only place a layer is declared, and the
  href helpers, the layer nav and the language gate in
  `apps/web/src/lib/links.ts` all read it. Brazil is the only layer, at
  `/brasil`, and its folder name is that registry entry's slug. Never add a
  language switch, never branch on `Accept-Language`, never honour a `?lang=`
  on a ground-layer page, and never put a layer in the primary nav: a layer
  serves one country's audience and is reached from that country's pages. A
  lexicon that renders a country with no page behind it is not published, so
  it does not reach the feed or the sitemap either. See D69.
- The viewer has one inbox. `/contact` is the only page that carries a form for
  writing to the project, `/api/contact` is the only route that sends one, and
  every invitation to get in touch links there with a topic in the query string.
  The route stores nothing: it validates `ContactSubmission` from
  `packages/core/src/model/contact.ts` and forwards the lead to
  core.envisioning.com through `apps/web/src/lib/core-api.ts`, which signs every
  request with `INTERNAL_REQUEST_SECRET`. Never call Core with a bare fetch.
  Never send `sourcePage`, because Core answers 500 when it is present, and
  never send an empty `title`, because Core rejects a blank one. Support is a
  page per layer: `/support` on the ground layer, `/brasil/apoie` inside
  Brazil's, both declared through `LayerSectionId`. See D71.
- **Navigation is one tree.** `apps/web/src/lib/nav.ts` holds it and `navRows`
  resolves it against the path. Nothing else in the viewer draws navigation,
  and no page or layout renders a nav of its own. The tree is four deep and
  never more: the sections, the country you are in, which reading of it, then
  the pages of that reading. It reaches the reader as two bands: `HeaderNav`
  draws the sections and turns every level above the deepest into a breadcrumb,
  and `SectionTabs` draws the deepest level as a tab strip under the header.
  Never stack nav rows instead. A country layer is a reading beside the English
  one, never a level under its pages, and both readings share one crumb joined
  by a middot, because they are alternatives rather than steps. **There are five
  sections and adding a sixth is a decision, not a page.** A new page joins the
  section that already answers its reader's question: `COUNTRY_INDEX_PAGES`,
  `METHOD_PAGES`, `PARTICIPATE_PAGES` or `ABOUT_PAGES`, all in the same file.
  Countries resolves its row from the path because 52 countries will not fit in
  a control, and before the path names one it offers the cross-country readings
  instead; Method, Participate, Capabilities and About list theirs. See D80.
  Both bands render above every layout that could
  read a file, so which surfaces a country has comes from a registry and never
  from the filesystem: `hasLocalDestination` and `INSTITUTION_MAPS`, both in
  `apps/web/src/lib/layers.ts`. Keep `INSTITUTION_MAPS` in step with
  `data/institutions/*.json`. A new top-level page needs a node in the tree or
  it lights nothing. See D73.
- **One registry declares the ways to take part.**
  `packages/core/src/model/contribute.ts` holds every way in, each with what it
  needs, who brings it, how much work it is and what it changes in the published
  benchmark. `ContributionList` renders it, `contributionHref` in `links.ts`
  addresses it, and `FUNDABLE_PIECES` holds the funded work with a scope and an
  effect on each. Never write a list of ways to help into a page. Taking part is
  a section of the nav tree, `PARTICIPATE_PAGES`, holding `/support`, `/gaps`,
  `/objections` and `/contact`: a page that asks for help and sits in no
  navigation is not published. `/gaps` is a second reading of the indicator
  registry and never a second list of gaps. See D78.
- **The thesis argues, the about page describes, and neither restates the
  other.** `/thesis` owns the claim and draws how far the data supports it.
  `/about` owns the object: size, date, refusals, known failures and how to
  argue with it. The front page carries one module per section of the site, each
  a sentence, a live number and one link out, and no module reprints a list that
  has a page of its own. Every number in those three pages is computed:
  `readWealthTracking` in `apps/web/src/lib/wealth.ts` is the only place the GDP
  correlation column is summarised, and all three read it. Never type a
  correlation, a count or a dimension name into that copy by hand. See D75.
- The World Bank fetch is described once, in
  `packages/core/src/model/sources.ts`: the API base, the database ids, the
  first year, the route labels and the request builder. `pipeline/ingest.ts`
  builds its calls from it and the `/sources` page prints the same call back.
  Never write the API shape a second time, and keep `WB_DATABASES` and the trap
  table below in step. See D49.
- Every URL shape the viewer writes lives in `apps/web/src/lib/links.ts`, one
  helper per kind of thing. Never build `/country/...`, `/agenda/...`,
  `/indicators#...`, `/patterns/...`, `/limits` or `/decisions` inline in a
  component. The patterns filters are part of that contract:
  `readPatternFilters` parses the query string and `patternsHref` builds it, and
  the server page and the client view both use them, so the address is read
  where it is written. See D46.
- The comparison at `/compare` holds one reference country plus at most three
  others, and the selection is the address. `compareHref` and
  `readCompareCodes` in `apps/web/src/lib/links.ts` are the only place that
  shape is written or parsed, `COMPARE_MAX` is the cap, and the page redirects
  to the canonical hyphen form before it draws anything. The first code is the
  reference: it keeps the filled shape and every other column is a distance
  from it. Never stack four shapes on one radar, and never put a combination in
  the sitemap. See D70.
- A decision id or an artefact id written in a document is a link. The markdown
  renderer turns a bare `D47` or `A10` into a link to `/decisions#D47` or
  `/limits#A10`, so write the bare id and never hand a URL to it.
- `docs/KNOWN-ARTEFACTS.md` states what is wrong now, not what we used to think.
  Never write edit history into it: no "was high, now medium", no "rewritten on
  this date", no account of a realization. Refresh the numbers against the
  current dataset and name the run a figure comes from where it is not the
  current one. The history belongs in `docs/DECISIONS.md` and in git.
- Every Delphi surface in the viewer gates on `isEvidential` before rendering
  anything from a run, and on `isPanel` before calling anything a panel. A
  non-panel run renders as "session estimate". The shared caveat is
  `PanelProvenanceNote` in `apps/web/src/components/ui.tsx`.
- `docs/KNOWN-ARTEFACTS.md` renders at `/limits` and `docs/DECISIONS.md` at
  `/decisions`, both through the markdown-subset renderer in
  `apps/web/src/lib/markdown.tsx`, and both files are listed in
  `outputFileTracingIncludes`. A new doc rendered by a page needs the same
  tracing entry, or the deployed page silently shows its empty state.
- A decision's falsification clause is labelled `**Overturned by.**`. The
  `/objections` page lifts that clause out of every entry, so a differently
  named label drops the decision off the page and nothing errors. See D50.
- Two sessions appending to `docs/DECISIONS.md` collide. Read the highest number
  in the file immediately before you write, and re-check it after: a concurrent
  session can take your number, or rewrite the file from a stale copy and drop
  your entry entirely. D39 is an unused number for that reason. The same hazard
  applies to any append-only file in `docs/`.
- A decision in `docs/DECISIONS.md` is the contract. If you are about to break
  one, supersede it there in the same change, with the evidence that overturned
  it. Silent divergence is how this falls apart.

## World Bank API traps

The v2 API needs `&source=<id>` for anything outside World Development
Indicators, and silently answers "indicator not found" without it. The ids the
registry uses are declared in `WB_DATABASES` in
`packages/core/src/model/sources.ts`, which the `/sources` page renders. This
table adds the traps that are not in the code.

| Family | Source id | Note |
| --- | --- | --- |
| World Development Indicators | 2 | default, no `source` param needed |
| Doing Business | 1 | discontinued, frozen at 2019, codes differ from the old WDI names |
| Worldwide Governance Indicators | 3 | codes are prefixed: `GOV_WGI_GE.EST`, not `GE.EST` |
| Human Capital Index | 63 | last full round 2020 |
| Economic Fitness 2 | 70 | `EF.EFM.UNIV.XD` |

Find a series by name instead of guessing a code: `pnpm bench probe --search
"long.term unemploy"` reads the World Bank's own catalogue of about 30,000
series and prints the database each one needs. A name that is absent there is
absent from the API at every id, which is how a gap gets closed as unfillable
rather than untried.

The API answers an unknown or archived code with HTTP 200 and a message block,
not an error status. `pnpm bench probe` reads that block and says the code is
unknown, so a stalled request and a dead code never read the same.

`IC.BRE.*`, B-READY, is the Doing Business successor and it is in World
Development Indicators. It covered 12 of the 52 countries in the 2024 round, so
it is not wireable yet, and it is what replaces the 2019-frozen Doing Business
rows when its coverage arrives.

Other traps found the hard way:

- Doing Business publishes "starting a business: time" only split by sex
  (`IC.REG.DURS.MA.DY`), and "getting electricity: time" only as a rescaled
  score (`IC.ELC.TIME.DFRN`), never as raw days.
- Trademarks are `IP.TMK.RSCT`, not `IP.TMK.RESD`.
- Long-term unemployment (`SL.UEM.LTRM.ZS`) is listed in the catalogue under
  "WDI Database Archives", source 57, and the API refuses the code from that
  source. It is not fetchable. The gap still needs an ILOSTAT adapter.
- Verify a new series against every country before adding it to the
  registry. A code that resolves for Brazil can be empty for Singapore.

## Deployment

The viewer deploys to Vercel under the `ev-io` scope, project
`national-capability-benchmark`, with **Root Directory set to `apps/web`**. The
build command is `pnpm --filter @ncb/core build && next build`, because the app
imports the core package from `dist`.

Two traps, both of which cost a failed deploy once:

- With Root Directory at the repository root, Vercel reports "No Next.js version
  detected". The Next builder needs the directory holding the app's
  `package.json`, and `apps/web/vercel.json` is the config it reads.
- The viewer loads its data from `data/out` at request time, through paths no
  bundler can see. `outputFileTracingIncludes` in `apps/web/next.config.ts` lists
  them, and `apps/web/src/lib/data.ts` resolves the data root by trying
  candidates and taking the first with an index. A tracing miss is silent: every
  page renders its empty state and nothing errors.

Data is committed, so a deploy ships whatever `data/out` held at the last commit.
Refreshing the site means running `pnpm bench all`, committing the output and
deploying again.

## Build order

Do not run `pnpm build` while `next dev` is running: both write `apps/web/.next`
and the production build leaves the dev server serving pages with no CSS. Stop
the dev server, or `rm -rf apps/web/.next` and restart it.

When somebody else is using the dev server, build into your own directory
instead: `NEXT_DIST_DIR=.next-$$ pnpm build`. The `$$` is the shell PID, so two
agents never pick the same name. That build rewrites two files to point at
whichever directory it used, so check both afterwards and revert the churn
before committing: `apps/web/tsconfig.json` gains a types path, and
`apps/web/next-env.d.ts` repoints its route-types reference. Both must name
`.next` on `main`, because that is where a normal build writes.

Two `next build` runs at once destroy each other, which is why that directory
name carries a PID. A fixed name collides: the second agent writes into the
first agent's directory, or deletes it, while the first build still runs. The
errors that follow name real files and mean nothing. The webpack cache reports
`ENOENT` on a pack file, and `next build` dies with `require is not defined in
ES module scope` inside a generated `pages/_document.js`. The code is correct.
Do not debug those errors.

Check for a running build before you start one:

```
ps aux | grep "[n]ext build"
```

`.gitignore` covers `.next-*`. Delete your directory when the build finishes.
Never `rm -rf` a directory that another build writes.


`apps/web` imports `@ncb/core` from `dist`, not from source. Run
`pnpm --filter @ncb/core build` before building the web app on its own.
`pnpm build` already does this in the right order.

`@ncb/core` has two entries. `@ncb/core` is browser-safe and is what client
components import. `@ncb/core/node` adds the filesystem, network and model
provider code and may only be imported from server components and the CLI. A
single `node:` import reaching the browser graph fails the production build at
bundle time, not at typecheck, so the compiler will not warn you.

Table columns carry render functions, so any component defining them has to be a
client component. Pages load data on the server and pass plain JSON to a client
view in `apps/web/src/components/views/`. Defining columns inside a server
component builds in dev and fails on `next build`.

## Delphi

Full contract in `docs/PANEL.md`. In short: panelists are model plus stance. Stances are fixed analytical priors so
disagreement has a reason behind it. Models come from `NCB_PANEL` and route
through the Vercel AI Gateway, so one `AI_GATEWAY_API_KEY` covers every vendor.

Without a key the CLI falls back to `MockProvider`, a deterministic offline
panelist. Mock runs are written with `provenance: "mock"` and model `"mock"`;
the report and the viewer both refuse to present them as evidence.

Do not add a cheap model to widen the panel. `pnpm bench cost` puts a full run in
single-digit dollars, so cost is not the constraint — see D13.

The repository contains old in-session one-panelist artifacts, including the
run pointed to by `data/delphi/latest.json`. They are useful research notes, but
they are not a current panel for dataset 4.4.0. Replace them with a reviewed
gateway run covering the current country set before publishing anything.

## Brand

The viewer follows the Envisioning brand system, published at
https://envisioning.com/about/brand and https://envisioning.com/about/brand/octa.

Inside Envisioning, the working guide is `DESIGN.md` and `VOICE.md` in the
`envisioning.com` repository, and that repository's `app/global.css` is the
source of truth for color values. Do not sample colors from the SwiftUI package
(different radius scale), from the Signals site (a deliberately different warm
palette), or from the visualization library (an OKLCH system with a blue
accent). Outside contributors should treat `apps/web/src/app/globals.css` here
as the reference, and see NOTICE.md before reusing the brand.

- Tokens live in `apps/web/src/app/globals.css` as a Tailwind v4 `@theme` block
  plus light and dark `:root` blocks. Mirror the upstream values, do not invent.
- Typefaces are self-hosted in `apps/web/src/app/fonts`: `InterVariable.woff2`,
  `InterVariable-Italic.woff2`, `EnvisioningOcta-VF.woff2`. Copied from
  `envisioning.com/app/fonts`. Re-copy if upstream updates them.
- Octa is display only and rare: the wordmark, and one hero title on the front
  page. Every other page title is Inter, through `PageTitle`. `HeroTitle` in
  `apps/web/src/components/ui.tsx` is the only Octa title on the site, and it
  is larger than a page title because a display face needs the size to earn its
  place. Never body, labels, tables or anything under 18px. Set it with
  `font-variation-settings` so the width axis travels, never with `font-weight`
  alone, and hold `wdth` at 100 across the whole layout. See D79.
- **There is one button, one field and one filter control.** `Button`,
  `ButtonLink`, `buttonClass`, `fieldClass` and `controlClass`, all in
  `apps/web/src/components/ui.tsx`, hold every geometry: a button is 40px tall
  (32px at `size="sm"`) with a 12px medium label, a form field is 40px with body
  type because a reader writes prose into it, and a filter control is 32px with
  label type so it lines up with a small button beside it. Never hand-roll a
  `px-3 py-2 rounded-md` control in a page or a view. `accent` is the one loud
  variant, so a page carries at most one. See D81.
- Panels are `Card` in the same file, at `rounded-lg` over a 1px rule. **The
  viewer publishes no shadows.** envisioning.com's four-tier shadow scale is a
  deliberate omission here: under a dense table of scores an elevation reads as
  chrome, and the rule already separates the panel from the page. Two panels in
  `EvidenceList` and `CheckList` keep their hand-written classes because the
  `:has()` rules in `globals.css` select on them. See D81.
- Navigation carries label type, `text-xs`, at all three levels. There is no
  `text-sm` on the site. envisioning.com's own nav uses 14px; NCB does not,
  because its header draws sections, a crumb trail and a tab strip in one stack,
  and the lime underline says where the reader is. See D81.
- The front page opens on `hero-band`, the site's one dark surface above the
  footer, and `hero-glow` is the one gradient the brand permits. Both live in
  `globals.css`. A band spans the window through `full-bleed` and supplies its
  own `max-w-6xl` container, the way envisioning.com draws a section: `main` is
  a centred container, so a band that only sits inside it reads as a card.
  `html, body { overflow-x: clip }` absorbs the scrollbar overshoot `100vw`
  causes, and `clip` is required over `hidden` because `hidden` would make the
  element a scroll container and break any future sticky chrome. Never put a
  second dark band on a page and never draw the glow anywhere else. See D81.
- Navigation hangs from one edge. The sections sit right from `md` up, so the
  crumb trail and the tab strip are `md:justify-end` as well and the reader
  tracks one column down. Below `md` the sections fold into the sheet, there is
  no right edge to agree with, and all three read from the left. See D81.
- Every 0 to 100 score renders through `Score` in `apps/web/src/components/ui.tsx`,
  banded by `packages/core/src/pipeline/bands.ts`. Never render a score as a bare
  number or invent a per-table treatment. See D18.
- Components that go inside a table render inline content only. `DataTable` owns
  the `<td>`, so a component that emits one as well produces `<td><td>`. React
  reports it as a nesting error, hydration fails, and the table silently stops
  sorting while still looking correct. Check the browser console after touching
  any cell component.
- Tables are `DataTable` from `apps/web/src/components/DataTable.tsx`, a client
  component with sortable headers. Numeric columns open descending, text columns
  ascending, and cells with no data always sort last in both directions. Give a
  column a `sort` accessor to make it sortable and omit it for prose columns.
- Type scale: page title `text-3xl sm:text-4xl font-light`, section header
  `text-2xl sm:text-3xl font-light`, prose heading `text-xl font-medium
  tracking-tight`, body `text-lg leading-relaxed` (18px), labels and table text
  `text-xs font-medium`, eyebrow `text-xs uppercase tracking-[0.05em]`. There is
  no `text-sm` in the scale.
- Titles are `font-light` (300). The quietness is deliberate: the lime carries
  the visual weight.
- Lime is used confidently but rarely. It appears on the radar fill and on the
  `Highlight` marker, at most one per page. Score cells use a neutral ink ramp
  on purpose, because a full table of lime would break that rule.
- No emoji, with one exception: the country flag. It renders through `Flag` and
  `CountryLabel` in `apps/web/src/components/ui.tsx`, which derive it from the
  `iso2` code in the country registry. Never write a flag character into a page
  or a data file. Every other emoji stays out.
- No gradients except the one radial lime glow (`.hero-glow`). No colored
  shadows, no backdrop-blur.
- The favicon set is generated, never hand-drawn. `scripts/generate-favicons.mjs`
  reads `apps/web/public/brand/envisioning-mark.svg`, composes it on a rounded
  near-black tile in lime, and writes `icon.png`, `apple-icon.png` and
  `favicon.ico` into `apps/web/src/app`, plus the PNG sizes and
  `manifest.webmanifest` into `apps/web/public`. It is the same generator the
  other Envisioning sites use, so keep the padding, radius and colours in step
  with them. The outputs are committed and `sharp` is a devDependency of the
  repository root, so no deploy rasterises anything. The mark SVG carries the
  same geometry as `EnvisioningMark` in `apps/web/src/components`: change one and
  change the other, then run `pnpm icons`.
- Icons come from `apps/web/src/components/Icon.tsx`, which holds Lucide path
  data copied in rather than installed. Add a new one by copying its path from
  lucide.dev into that file. One icon per concept, reused everywhere that
  concept appears, and always beside the words it marks. An icon is a second
  encoding and never the only one, so it is `aria-hidden` and the text carries
  the meaning.

### Copy rules that bite

`VOICE.md` is authoritative for text and beats `DESIGN.md` where they disagree.

- Sentence case everywhere, including headings and feature names.
- Headings must be statements that could be true or false, never stacked noun
  phrases. "Two dimensions do not survive without wealth-correlated data", not
  "Wealth sensitivity".
- A heading is short, plain and obvious. Aim for six words. Say what the section
  holds, not what the project believes about it. "How much of this is income?",
  never "The claim is that capability is not simply wealth". Cut every
  aphorism: a heading that reads as a maxim is the loudest AI tell on the page.
  A question is allowed when it is the question the section answers. See D79.
- A sentence that only names two pages and joins them with "and" is filler.
  "About says what it is made of and what it refuses to do, and contact reaches
  a person" tells a reader nothing they could act on. Say what the page holds
  and link the words a reader would look for. See D79.
- **Never put an internal fact in reader copy.** "One inbox for the whole
  project", "one registry", "a single source of truth" are contracts between
  agents, and a reader did not ask how many inboxes exist. They belong in this
  file and in the decision log. See D79.
- **Never reassure.** "A person reads it and replies" invites the suspicion it
  denies, and promises something the page cannot keep. State what happens, once:
  "Nothing you write here is published." See D79.
- Three short sentences in a row is the rhythm of generated text, whatever the
  words are. Vary the length or cut to one. See D79.
- **The project describes itself by what it measures, never by what it refuses
  to be.** The footer line, the metadata description and the social card all
  say the same positive thing, and none of them leads with a count or the word
  ranking. The refusals have a home on `/about`, which is the page whose job is
  to hold them. See D79.
- **No em dashes or en dashes in rendered copy.** This repo's internal docs still
  use them; the viewer must not.
- The "X, not Y" inversion is capped at one per page. VOICE.md calls it the most
  recognizable AI-copy signature. Grep for `, not ` and `rather than` before
  shipping copy changes.
- American spelling in the viewer: normalize, judgment, labeled. The `docs/` and
  `packages/core` comments use British spelling and are internal, so the two
  conventions coexist by design.
- Numbers one to nine spelled out in prose, numerals from 10 and for every
  measurement.
- Run human-facing copy through the `humanizer` skill before shipping.
