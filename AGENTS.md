# NCB, the National Capability Benchmark — agent notes

Prototype benchmark of a country's capacity to anticipate change, coordinate
action, learn, adapt and build under uncertainty. Ten countries, nine
dimensions, equal weights, no headline ranking.

## Commands

```
pnpm install
pnpm bench ingest      fetch World Bank series from 1990 into data/observations/worldbank.json
pnpm bench score       normalise and score, write data/out/index.json, data/out/countries/*.json and table.csv
pnpm bench delphi      run the LLM panel (add --mock to run offline)
pnpm bench diagnose    correlations, redundancy, GDP-sensitivity test
pnpm bench report      write data/out/report.md
pnpm bench agenda      write the capability agenda: JSON per country plus one markdown per lexicon
pnpm bench cost        measure the panel prompts and price a run before making it
pnpm bench validate    schema-check data/delphi and data/evidence; add --fetch to live-check evidence source URLs
pnpm bench all         ingest, score, diagnose, report, agenda
pnpm build             tsc for packages/core, then next build for apps/web
pnpm typecheck         both packages
pnpm dev               the viewer at https://ncb.localhost (port 3888 behind it)
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

## Layout

- `packages/core` — the whole model. Registry, ingestion, normalisation, scoring,
  diagnostics, Delphi, CLI. Compiles to `dist`.
- `apps/web` — Next.js viewer. Reads `data/out/*.json` at request time.
- `data/observations` — raw values with source and year. `worldbank.json` is the
  current file, `revisions.json` is the append-only log of what each run
  restated, added or dropped, and `snapshots/` holds dated full copies written
  only on `--snapshot`.
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
  lexicon. See D35. `datapackage.json` and `schema/` make the directory
  self-describing: a Frictionless Data Package descriptor plus one JSON Schema
  per published shape, generated from the Zod schemas on `bench score`. See D37.

## Invariants

- `packages/core/src/model/indicators.ts` is the single source of truth for
  indicators, and `countries.ts` for countries and their frame. Never define
  either anywhere else.
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
- Evidence records in `data/evidence` never enter a score or a confidence. A
  gap is promoted to a scored indicator only when a comparable series covers at
  least two reference countries, which is the minimum `buildFrame` accepts. See
  D20.
- A dimension with fewer than `MIN_INDICATORS_FOR_SCORE` observed indicators
  publishes no score. `score` is null, `belowCoverageFloor` is true and
  `observedIndicators` carries the count. Render it with `DimensionScore`, never
  with a bare `Score`, and never plot a null at zero: the radar leaves that axis
  empty. Confidence, the indicator rows and the trend still publish. See D45.
- Missing values are dropped from the mean and lower coverage. Nothing is imputed.
- The normalization frame is pinned to the ten **reference** countries. Their
  values alone set every indicator's Tukey fences and its 0 and 100 endpoints.
  Countries with `frame: 'extended'` are scored against that frame and never
  move it, which is what lets data be added without invalidating what is already
  published. Verified when six countries were added: 0 of 90 reference cells
  moved. See D16, which supersedes D2.
- Adding a country to the **reference** set rebases the whole dataset. Do not do
  it as a side effect of adding data. It is a versioned, announced act. Adding
  an **extended** country is safe and was verified twice: 0 of 90 cells moved at
  16 countries and 0 of 144 at 40.
- The dataset version is semantic and lives in
  `packages/core/src/model/version.ts`, nowhere else. Major = frame rebase or a
  published field removed. Minor = countries, indicators or fields added. Patch
  = re-ingest under the same registry. Bump it in the same change that earns
  the bump. See D37.
- A value outside the frame clamps to 0 or 100 and sets `outOfFrame` on the
  cell. Frequent clamping means the frame is too narrow, not that the scale
  should be widened quietly.
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
- A generation date is metadata, never prose. It renders as a dateline under
  the title, from `agenda.generated` in the lexicon, and the intro that follows
  states what a score means. Never put a date back inside a sentence. See D40.
- A repository file named in a rendered document or a page is a link, built by
  `docHref` in `packages/core/src/model/project.ts`, which also holds `REPO_URL`
  and the document constants. Never write a bare `docs/*.md` path or a GitHub
  URL by hand: a published document reaches readers with no checkout. See D40.
- Language is an interpretation layer. The ground layer stays English end to
  end: ids, registry definitions, JSON output. Translations live only in
  lexicons under `packages/core/src/i18n/`, one data file per language, and
  every lookup falls back to the registry English, so a partial lexicon renders
  complete pages. Never translate in place, and never let a rendered document
  compute a number the JSON does not carry. See D35. In the viewer, language
  switching is one control in the layout header, driven by `languageCounterpart`
  in `apps/web/src/lib/links.ts`. Never add a language link to the nav or to a
  page body.
- Every URL shape the viewer writes lives in `apps/web/src/lib/links.ts`, one
  helper per kind of thing. Never build `/country/...`, `/agenda/...`,
  `/indicators#...`, `/patterns/...` or `/limits` inline in a component.
- Every Delphi surface in the viewer gates on `isEvidential` before rendering
  anything from a run, and on `isPanel` before calling anything a panel. A
  non-panel run renders as "session estimate". The shared caveat is
  `PanelProvenanceNote` in `apps/web/src/components/ui.tsx`.
- `docs/KNOWN-ARTEFACTS.md` renders at `/limits` through the markdown-subset
  renderer in `apps/web/src/lib/markdown.tsx`, and the file is listed in
  `outputFileTracingIncludes`. A new doc rendered by a page needs the same
  tracing entry, or the deployed page silently shows its empty state.
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
Indicators, and silently answers "indicator not found" without it.

| Family | Source id | Note |
| --- | --- | --- |
| World Development Indicators | 2 | default, no `source` param needed |
| Doing Business | 1 | discontinued, frozen at 2019, codes differ from the old WDI names |
| Worldwide Governance Indicators | 3 | codes are prefixed: `GOV_WGI_GE.EST`, not `GE.EST` |
| Human Capital Index | 63 | last full round 2020 |
| Economic Fitness 2 | 70 | `EF.EFM.UNIV.XD` |

Other traps found the hard way:

- Doing Business publishes "starting a business: time" only split by sex
  (`IC.REG.DURS.MA.DY`), and "getting electricity: time" only as a rescaled
  score (`IC.ELC.TIME.DFRN`), never as raw days.
- Trademarks are `IP.TMK.RSCT`, not `IP.TMK.RESD`.
- Long-term unemployment is not in the World Bank API at all. It needs an
  ILOSTAT adapter and is filed as a gap until someone writes one.
- Verify a new series against all ten countries before adding it to the
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

The active run is currently `in_session`, one panelist, produced by Claude Opus 5
in a working session. It is useful and it is not a panel. Replace it with a
gateway run before publishing anything.

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
- Octa is display only: the wordmark and page titles, above 24px. Never body,
  labels, tables or anything under 18px. Set it with `font-variation-settings`
  so the width axis travels, never with `font-weight` alone, and hold `wdth` at
  100 across the whole layout.
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
