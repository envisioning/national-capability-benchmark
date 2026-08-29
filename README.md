# NCB, the National Capability Benchmark

NCB is a prototype benchmark of a country's capacity to anticipate change,
coordinate action, learn, adapt and build under uncertainty.

The benchmark covers the countries in the registry and nine dimensions. Each
dimension is scored from 0 to 100 with equal weights. There is no composite
score or headline ranking. Every raw indicator remains visible with its source
and year. Confidence is published beside the score and is never folded into it.

Brazil is the primary case. The same dimensions, indicators, transforms and
normalization frame apply to every country in the set. Read
[docs/WHY.md](docs/WHY.md) for the claim under test and what would disprove it.

## Quick start

~~~bash
pnpm install
pnpm bench all
pnpm dev
~~~

pnpm bench all fetches World Bank observations from 1990, scores the countries,
runs diagnostics, writes the report, and regenerates the capability agendas.

The viewer runs at https://ncb.localhost through portless on port 3888. To run
without the proxy, use either:

~~~bash
PORTLESS=0 pnpm dev
pnpm --filter @ncb/web dev:app
~~~

Both commands serve http://localhost:3888.

Run the offline Delphi pipeline with:

~~~bash
pnpm bench delphi --mock
pnpm bench score
pnpm bench report
~~~

Mock output is deterministic and is not evidence about a country.

The green gate is:

~~~bash
pnpm build
pnpm typecheck
~~~

Run pnpm bench validate after changing data/delphi or data/evidence.

## Commands

The CLI lives in packages/core and is available through pnpm bench.

| Command | Purpose |
| --- | --- |
| pnpm bench ingest [--from 1990] [--snapshot] | Fetch World Bank history into data/observations and record restatements in revisions.json. |
| pnpm bench score | Normalize and score the current observations, writing the published output. |
| pnpm bench diagnose | Run correlations, redundancy checks and the GDP-sensitivity test. |
| pnpm bench report | Write data/out/report.md. |
| pnpm bench agenda [BRA ...] [--lang pt-BR] | Write one capability agenda per requested country and language. |
| pnpm bench delphi [--mock] | Run the model panel or the deterministic offline stand-in. |
| pnpm bench cost | Measure panel prompts and estimate the cost before a real run. |
| pnpm bench prompt ... | Print exact panel prompts or write chat-ready bundles. |
| pnpm bench merge ... | Merge pasted chat replies into a Delphi run file. |
| pnpm bench probe --search <regex> | Find candidate World Bank series by name and database. |
| pnpm bench probe --series a,b[@db] | Test candidate series across the country set before wiring them. |
| pnpm bench validate [--fetch] | Schema-check Delphi, evidence and institutional data. --fetch checks evidence URLs too. |
| pnpm bench all | Run ingest, score, diagnose, report and agenda in order. |

## The nine dimensions

The benchmark measures:

1. Anticipation
2. Agency
3. Coordination
4. Trust
5. Learning
6. Experimentation
7. Adaptability
8. Building
9. Shared Purpose

The indicator registry in
packages/core/src/model/indicators.ts is the single source of truth. It
contains scored indicators, declared gaps and retired indicators. Gaps remain
visible, lower confidence and form the data-collection agenda. Retired
indicators stay visible with the reason they were rejected.

Missing values are dropped from the mean. Nothing is imputed. A dimension with
fewer than two observed indicators publishes no score: score is null and
belowCoverageFloor is true.

## How scoring works

For each scored indicator, the pipeline:

1. takes the most recent comparable value for each country, with source and year;
2. applies its declared transform, such as per-million, logarithmic or none;
3. winsorizes extreme values with Tukey fences at three interquartile ranges;
4. normalizes to 0 through 100 against the current country set, reversing
   lower-is-better indicators;
5. averages the available indicators inside each dimension with equal weights;
6. computes confidence = coverage × recency × source_quality separately.

Every country in the registry sets the normalization frame. The frame stays
fixed within a dataset version. Adding a country changes the frame, restates
published scores and requires a major version bump. The semantic version is defined in
packages/core/src/model/version.ts.

Ingestion keeps the full World Bank history from 1990 while scoring uses the
latest value. Every ingest compares itself with the previous observation file
and appends changes to data/observations/revisions.json. Snapshots are written
only when --snapshot is passed.

## Trends and agendas

The default momentum spans are ten and twenty years. A trend uses only
indicators observed at both ends of the span, so its basket can be smaller than
the current dimension score. Momentum entries carry the span, change, basket
size and any historical clamp count. Indicator series retain raw, normalized and
source-tier values without interpolation or carry-forward.

The agenda pipeline turns each country into three lists:

- **raise** for low scores with usable evidence;
- **measure** for dimensions whose confidence is below the usable band;
- **hold** for the remaining dimensions.

The language-neutral agenda JSON and rendered English or Brazilian Portuguese
documents are written to data/out/agenda. The agenda is computed from the
score and registry; it does not invent a new number.

## Two assessment tracks

The benchmark keeps measurement and interpretation in separate tracks.

**Source-backed measurement.** The registry defines each indicator and its
source, units, transform and direction. World Bank is the only automated
ingestion source in v0. A small set of manually authored observations is kept
separately. Other named sources remain explicit gaps until their adapters and
coverage are ready. The pipeline turns observations into the canonical
`score`, `confidence` and indicator rows. Documented deliveries in
`data/evidence` explain gaps but never change a score or its confidence. Read
[docs/EVIDENCE.md](docs/EVIDENCE.md) before adding one.

**Delphi panel.** The panel pairs language models with fixed analytical
stances. It reviews thin or questionable dimensions using the source-backed
evidence brief. It does not create observations or silently replace measured
values. It uses two rounds: in round two, each panelist sees anonymized
round-one scores and rationales. The run stores medians, interquartile ranges,
model identity, country scope, dataset version, prompt version and provenance.
Panel estimates remain in `delphiScore` and `delphiIqr`. The explicit
`blendedScore` falls back to Delphi only when no indicator is observed, and
`blendedFrom` says which track supplied it.

Real runs use the Vercel AI Gateway:

~~~bash
export AI_GATEWAY_API_KEY=...
export NCB_PANEL=anthropic/claude-opus-5,openai/gpt-5,google/gemini-2.5-pro
pnpm bench cost --max-coverage 0.5
pnpm bench delphi --rounds 2 --max-coverage 0.5 --activate
~~~

A country-restricted or coverage-restricted run is saved as an archive and does
not replace `data/delphi/latest.json` unless `--activate` is passed. Use a
restricted run as a preflight. A published run after a country-set change must
cover the rebased set. A run with provenance "mock" is an offline stand-in and
is not evidence. A run with fewer than three panelists is a session estimate,
not a panel. Read
[docs/PANEL.md](docs/PANEL.md) for the full contract.

**Institutional data.** Country-specific institutional networks are explanatory
data. They show where capability is held and how it moves. They never enter a
score or confidence. The current data and authoring rules are in
[docs/INSTITUTIONS.md](docs/INSTITUTIONS.md).

## Published output

data/out is generated output. pnpm bench score also writes the Frictionless Data
Package descriptor and JSON Schemas.

| File | Contents |
| --- | --- |
| data/out/index.json | Slim list of every country with nine dimension results. |
| data/out/countries/{ISO3}.json | One country in full, including indicator rows and yearly series. |
| data/out/indicators/{id}.json | One indicator across the country set. |
| data/out/table.csv | Flat country by dimension table. |
| data/out/diagnostics.json | Correlations, redundancy and GDP-sensitivity diagnostics. |
| data/out/report.md | Human-readable findings report. |
| data/delphi/{runId}.json | Immutable record of one Delphi run and its provenance. |
| data/delphi/latest.json | Active Delphi run copied from one archived run. |
| data/out/agenda/{ISO3}.json | Language-neutral computed agenda. |
| data/out/agenda/{ISO3}.{lang}.md | Rendered agenda for a language lexicon. |
| data/out/datapackage.json | Dataset metadata, sources, license, resources and schemas. |
| data/out/schema/*.json | JSON Schemas for the published data shapes. |

Use index.json for cross-country lists. Use a country file for one detailed
profile and an indicator file for one measure across countries. Do not load all
country files to build a list.

## Viewer and deployment

The Next.js viewer is in apps/web. It provides country profiles, capability
comparisons, agendas, indicators, sources, diagnostics, the Delphi panel,
patterns, limits, decisions, the glossary and a challenge page. The Portuguese
interpretation layer starts at /pt.

Vercel deploys the project national-capability-benchmark under the ev-io scope
with apps/web as the Root Directory. The build command is:

~~~bash
pnpm --filter @ncb/core build && next build
~~~

Data is read from data/out at request time, so refreshed output must be
committed before deploying.

## Before quoting a number

Read [docs/KNOWN-ARTEFACTS.md](docs/KNOWN-ARTEFACTS.md) before using a score.
The main risks are:

- Experimentation is still partly inferred from formal invention data.
- Coordination and Trust remain difficult to separate from wealth-correlated
  evidence.
- A country score is a coarse national proxy for capability below the national
  level.
- The current country frame is a comparison set, not the world.

Keep the score beside its confidence, observed-indicator count and
coverage-floor status. When quoting a trend, include its span and matched
basket size. When quoting a Delphi estimate, include its run ID, provenance,
panel size and dataset version. Record the generation date too.

## Repository map

~~~text
packages/core   registry, ingestion, normalization, scoring, diagnostics, Delphi and CLI
apps/web        Next.js viewer
data/           observations, Delphi runs, evidence, institution maps and generated output
docs/           rationale, decisions, limits, panel and authoring guides
~~~

Start with:

- [CONTRIBUTING.md](CONTRIBUTING.md) for gap fills, evidence, languages and
  country changes;
- [docs/WHY.md](docs/WHY.md) for the claim and scope;
- [docs/DECISIONS.md](docs/DECISIONS.md) for methodological choices;
- [docs/KNOWN-ARTEFACTS.md](docs/KNOWN-ARTEFACTS.md) for known measurement
  failures;
- [AGENTS.md](AGENTS.md) for repository invariants and World Bank API traps.

## License

The code is MIT. World Bank data is published under CC BY 4.0. The typefaces
use the SIL Open Font License 1.1. The Envisioning brand is not covered by the
code license. See [NOTICE.md](NOTICE.md) before reusing the repository.
