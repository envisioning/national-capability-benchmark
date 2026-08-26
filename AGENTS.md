# National Capability Benchmark — agent notes

Prototype benchmark of a country's capacity to anticipate change, coordinate
action, learn, adapt and build under uncertainty. Ten countries, nine
dimensions, equal weights, no headline ranking.

## Commands

```
pnpm install
pnpm bench ingest      fetch World Bank series into data/observations/worldbank.json
pnpm bench score       normalise and score, write data/out/scores.json and table.csv
pnpm bench delphi      run the LLM panel (add --mock to run offline)
pnpm bench diagnose    correlations, redundancy, GDP-sensitivity test
pnpm bench report      write data/out/report.md
pnpm bench cost        measure the panel prompts and price a run before making it
pnpm bench validate    schema-check every file in data/delphi
pnpm bench all         ingest, score, diagnose, report
pnpm build             tsc for packages/core, then next build for apps/web
pnpm typecheck         both packages
pnpm dev               the viewer at localhost:3000
```

The green gate is `pnpm build` plus `pnpm typecheck`. Both must pass. Run
`pnpm bench validate` after touching anything in `data/delphi`.

The viewer is registered in `~/Dev/.claude/launch.json` as `benchmark-web` on
port 3888.

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

## Layout

- `packages/core` — the whole model. Registry, ingestion, normalisation, scoring,
  diagnostics, Delphi, CLI. Compiles to `dist`.
- `apps/web` — Next.js viewer. Reads `data/out/*.json` at request time.
- `data/observations` — raw values with source and year.
- `data/delphi` — one file per panel run, plus `latest.json`, which is a pointer
  to the active run rather than an archive. Keep the original alongside it.
- `data/out` — scores, flat table, diagnostics, report.

## Invariants

- `packages/core/src/model/indicators.ts` is the single source of truth for
  indicators, and `countries.ts` for countries and their frame. Never define
  either anywhere else.
- Confidence thresholds live in `packages/core/src/pipeline/confidence.ts`. The
  viewer colors by them and the report prints their labels, so both read the same
  file. Never hard-code a threshold in a page.
- Delphi estimates never enter `DimensionResult.score`. They live in
  `delphiScore` and `delphiIqr`. `blendedScore` falls back to the panel only
  when no indicator evidence exists, and `blendedFrom` records which was used.
- Confidence is never folded into the capability score. Two numbers, always.
- Missing values are dropped from the mean and lower coverage. Nothing is imputed.
- The normalization frame is pinned to the ten **reference** countries. Their
  values alone set every indicator's Tukey fences and its 0 and 100 endpoints.
  Countries with `frame: 'extended'` are scored against that frame and never
  move it, which is what lets data be added without invalidating what is already
  published. Verified when six countries were added: 0 of 90 reference cells
  moved. See D16, which supersedes D2.
- Adding a country to the **reference** set rebases the whole dataset. Do not do
  it as a side effect of adding data. It is a versioned, announced act.
- A value outside the frame clamps to 0 or 100 and sets `outOfFrame` on the
  cell. Frequent clamping means the frame is too narrow, not that the scale
  should be widened quietly.
- `ingest: 'gap'` indicators stay in the registry. They lower confidence and
  they are the data-collection agenda. Do not delete them to make numbers look
  better.
- Delphi provenance is stored on the run file, never inferred from a model
  string. Branch on `isEvidential(run.provenance)` and `isPanel(run)`, both
  exported from `@ncb/core`. A `mock` run must never be presented as evidence,
  and a run with fewer than three panelists has no distribution to read.
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

## Build order

Do not run `pnpm build` while `next dev` is running: both write `apps/web/.next`
and the production build leaves the dev server serving pages with no CSS. Stop
the dev server, or `rm -rf apps/web/.next` and restart it.


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
- No emoji. No gradients except the one radial lime glow (`.hero-glow`). No
  colored shadows, no backdrop-blur.

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
