# NCB, the National Capability Benchmark

A prototype for measuring what a country is **capable of doing** — anticipating
change, coordinating action, learning, adapting and building under uncertainty —
rather than how rich, comfortable or competitive it is.

Nine capability dimensions, forty countries, 0 to 100 per dimension, no
headline ranking. Every raw indicator stays visible with its source and year.
Evidence quality is reported as a separate confidence score and is never folded
into the capability score.

Brazil is the case this work is meant to serve first. The frame applies to every
country in the set on the same terms, because a capability frame that only fits
one country describes that country instead of measuring capability.
[docs/WHY.md](docs/WHY.md) states the claim being tested and what would sink it.

## Quick start

```bash
pnpm install
pnpm bench all
pnpm bench delphi --mock
pnpm dev
```

`pnpm bench cost` prices a real panel run before you make one.

`pnpm bench all` fetches live World Bank data, scores every country, runs the
diagnostics and writes `data/out/report.md`. Scoring writes a slim
`data/out/index.json` for anything that lists countries and one file per country
under `data/out/countries`. `pnpm dev` opens the viewer.

## The layers

**Hard indicators.** 66 indicators across the nine dimensions. 38 are pulled
live from the World Bank API and two are entered by hand from the GEM Adult
Population Survey, which has no open API. The other 26 are declared gaps: the
spec asks for them and no adequate internationally comparable dataset exists
that passes the inspectability rule. Gaps stay in the registry, lower the confidence
score, and form the data-collection agenda.

**Momentum.** Ingestion keeps every year from 1990, scoring reads the latest,
and each dimension also carries its change over ten and twenty years. History is
normalized against the frame in use today and computed on the indicators
observed at both ends, so a trend is a change in the country instead of a change
in the scale. Every indicator carries its own line as well, which reaches as far
back as its data goes, and every point on it carries the value as published, the
normalized value and its source tier. Nothing is interpolated or extrapolated.
Each data run also logs what it restated, added or dropped against the file it
replaced, so a number that changes under us is a record. See D22, D24 and D25.

**Evidence records.** `data/evidence/records.json` documents a delivery that a
gap indicator cannot see, with one published number, a source, a reference
period and a required statement of what the case does not show. Records never
enter a score and never raise confidence. A gap becomes an indicator when a
comparable series covers at least two reference countries. See D20.

**The Delphi panel.** A panel of language models, each holding a fixed
analytical stance, does two things the indicators cannot:

1. Estimates dimension scores for cells where the evidence is thin or stale, and
   says what it would need in order to be sure.
2. Audits the indicator set itself — re-classifying each indicator as C/I/O/P,
   rating construct validity and wealth-proxy risk, and naming redundant pairs.

Two rounds. Round 2 shows each panelist the anonymised round-1 scores and
rationales. Panelists are told not to converge for the sake of converging, and a
stable disagreement is recorded as a finding rather than averaged away.

Panel estimates never enter the indicator-derived score. They sit beside it.

```bash
export AI_GATEWAY_API_KEY=...
export NCB_PANEL=anthropic/claude-opus-5,openai/gpt-5,google/gemini-2.5-pro
pnpm bench delphi --rounds 2
```

Without a key, `pnpm bench delphi --mock` runs a deterministic offline panel so
the whole pipeline works. Mock runs are labelled everywhere and are not evidence
about any country.

## What the prototype found

Run `pnpm bench report` and read `data/out/report.md`. The headline results from
the first run:

- **The nine dimensions separate once the country set is wide enough.** At 16
  countries, two dimension pairs correlated at 0.94 and the model looked like
  three signals wearing nine names. At 40 countries no pair passes the
  redundancy threshold, and Trust fell from 0.79 to 0.39 against income per head.
- **The wealth correlation was a property of the evidence class, not of the
  dimensions.** Perception indicators averaged 0.75 against log GDP per capita.
  Direct capability measures averaged 0.55. Retiring the perception layer took
  Coordination from 0.90 to 0.68, Trust from 0.88 to 0.79 and Shared Purpose
  from 0.34 to 0.18, and dissolved the strongest duplicate pair in the model.
- **The cost is three dimensions with almost no evidence left.** Coordination
  now rests on one indicator, Trust and Shared Purpose on two. Read artefact A12
  before quoting any of the three.
- **Experimentation was the least measurable dimension** and is now the least
  wealth-tracking one. Patents and trademarks used to carry it alone. With GEM
  early-stage entrepreneurial activity and fear of failure wired, four of eight
  indicators are observed, confidence rises from 0.18 to 0.39, and the
  correlation with income per head falls to 0.57. Four indicators are still
  gaps.
- The four Worldwide Governance Indicators correlated with each other above 0.92.
  They were one measurement wearing four names, and none of them are scored now.
- Switzerland, Singapore and Estonia do come out with genuinely different
  shapes, which is the main thing the prototype had to demonstrate.

## License

Code is MIT. The World Bank data is CC BY 4.0, both typefaces are SIL OFL 1.1,
and the Envisioning brand is not covered by either. Read
[NOTICE.md](NOTICE.md) before reusing any of it.

## Repository

```
packages/core   registry, ingestion, scoring, diagnostics, Delphi, CLI
apps/web        Next.js viewer: profiles, indicator audit trail, diagnostics, panel
data/           observations in, scores and reports out
```

```
docs/WHY.md              the claim being tested, and what this must not become
docs/DECISIONS.md        every methodological choice and what would overturn it
docs/KNOWN-ARTEFACTS.md  where v0 is wrong about the world, not just uncertain
docs/PANEL.md            the Delphi contract: provenance, models, cost
```

See [AGENTS.md](AGENTS.md) for commands, invariants and the World Bank API traps.

## Before you quote a number

Read [docs/KNOWN-ARTEFACTS.md](docs/KNOWN-ARTEFACTS.md). Two things will bite
you: Experimentation is inferred from patent counts with six of eight indicators
missing, and Coordination and Trust cannot be scored at all once
wealth-correlated indicators are removed.

## Method in one page

1. Most recent comparable value per indicator per country, with source and year.
2. Declared transform: per million people, log, or none.
3. Winsorize with Tukey fences at three interquartile ranges. Extremes only.
4. Min-max to 0-100 against the ten reference countries, reversed for lower-is-better.
5. Equal-weight mean of the available indicators inside each dimension.
6. `confidence = coverage × recency × source_quality`, reported separately.

Scores are relative, but the scale does not move. The 0 and 100 endpoints are
fixed by the ten reference countries, and any country added later is measured
against that same frame. Verified twice: zero of 90 existing scores moved when
six countries were added, and zero of 144 moved when 24 more arrived. See D16
and D27 in [docs/DECISIONS.md](docs/DECISIONS.md).
