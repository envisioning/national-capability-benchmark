# The Delphi layer

The benchmark has two assessment tracks. The source-backed track measures the
country with named indicators and produces the canonical `score` and
`confidence`. World Bank is the only automated ingestion source in v0. A small
set of manually authored observations is stored separately. The Delphi track
interprets the evidence brief where coverage is thin or an indicator may
misread the construct. It never creates an observation, changes confidence or
silently replaces the source-backed score.

The two tracks meet only in the explicitly named output fields. `delphiScore`
and `delphiIqr` hold the panel result. `blendedScore` uses the source-backed
score whenever the dimension clears its coverage floor. It uses Delphi only
when no indicator is observed, and `blendedFrom` records that choice.

## What a panelist is

A panelist is a **model paired with a fixed analytical stance**. The stance is a
standing prior the panelist must argue from. That gives disagreement a reason,
not just sampling noise.

The four stances are defined in `packages/core/src/delphi/panel.ts`:

| Stance | Standing question |
| --- | --- |
| Institutionalist | Does capability live in organisations that outlast their staff? |
| Bottom-up analyst | What does registration data fail to count? |
| Wealth sceptic | Is this capability, or is it money? |
| Execution realist | What has this country actually built or changed? |

Models come from `NCB_PANEL` and are dealt to stances round-robin. With four
stances and three models, one vendor gets two stances. Supply four models or run
`--stances 3`.

## Rounds

**Round 1.** Each panelist sees the evidence brief for one country: every
indicator with its raw value, year, normalised score, measurement class and
source, plus the declared gaps and the coverage figure. By default it scores
only dimensions at or below 50% source coverage. It gives a self-confidence,
writes a rationale, and names the specific evidence it would need to be more
certain. Use `--max-coverage 1` when a full nine-dimension review is needed.

**Round 2.** Each panelist sees the anonymised round-1 scores and rationales for
that country, then revises or defends. The prompt says explicitly not to converge
for the sake of converging.

We keep the median and the interquartile range. IQR above 25 points is recorded
as dissent (D12). Convergence between rounds is reported as the change in median
and IQR, not as a target.

**Indicator audit.** Separately, each panelist reviews one dimension's indicator
list and returns, per indicator: the measurement class it should be filed under,
a construct-validity rating, a wealth-proxy risk rating, and any indicators it
duplicates. This runs once, batched by dimension.

## Every run records its provenance

Every run file declares `provenance`. It is **stored, never inferred** (D14).

| Value | Meaning | Quotable as evidence |
| --- | --- | --- |
| `gateway` | Real multi-vendor LLM panel | Yes |
| `in_session` | An agent or person scoring inside a working session, often N=1 | With the caveat below |
| `human` | Human expert panel | Yes |
| `mock` | Deterministic offline stand-in | **No** |

`isEvidential(provenance)` and `isPanel(run)` are exported from `@ncb/core`. Use
them rather than checking strings. The report and the viewer both refuse to
present a `mock` run as evidence, and both warn when a run has fewer than three
panelists.

**A run with one panelist is not a panel.** The median is one opinion and the
IQR is zero. An in-session run can be useful for finding artefacts, but a real
gateway run must replace it before publication. The model name does not make an
in-session estimate equivalent to a multi-vendor panel.

## Running it

```bash
export AI_GATEWAY_API_KEY=...
export NCB_PANEL=anthropic/claude-opus-5,openai/gpt-5,google/gemini-2.5-pro,...
pnpm bench cost --max-coverage 0.5
pnpm bench delphi --rounds 2 --max-coverage 0.5 --activate
pnpm bench validate                   # schema-check what came out
pnpm bench score && pnpm bench report
```

Without a key the CLI falls back to the mock provider and says so.

Useful flags: `--countries BRA,IND` to make a preflight for a subset,
`--max-coverage 0.5` to include only dimensions with thin source coverage,
`--activate` to make a reviewed run active, `--no-judge` to skip the indicator
audit, `--stances N`, and `--concurrency N`. Subset and coverage-restricted runs
are archived without changing `latest.json` unless `--activate` is explicit.
Adding a country changes the normalization frame, so the published run for the
new dataset version should cover the full rebased country set.

## Cost

`pnpm bench cost` builds the prompts this repo would actually send, measures
them, and prices them. It accepts the same `--countries` and `--max-coverage`
scope as the run command. It is a command rather than a documented figure
because the evidence brief grows with the indicator registry, and round 2
carries round 1 back. Both grow with the registry.

As of 2026-08-26, a four-panelist, two-round, 10-country run that includes every
dimension and the indicator audit is 116 calls, roughly 446k input and 329k
output tokens, and about **$7** with two Anthropic panelists and two others.

Caveats the command prints for itself: characters-per-token is an approximation,
the output figure includes a 3× multiplier for reasoning tokens, list prices are
in `packages/core/src/delphi/pricing.ts` with a `LAST_VERIFIED` date, non-
Anthropic prices are marked unverified, and the gateway may add margin.

**Cost is not a constraint at this scale** (D13). Even a forty-country run is
under thirty dollars. A cheaper model adds variance that can look like
disagreement. The IQR matters most.

## Hand-authoring a run

An agent scoring inside a working session should read `docs/PANELIST-BRIEF.md`,
which covers stance assignment, how to print the exact prompt with `pnpm bench
prompt`, and why separate models must not be merged into one panel array from
one context.

An `in_session` or `human` run is written by hand as JSON in `data/delphi/`.
The schema is `DelphiRunFile` in `packages/core/src/model/schema.ts`. A new run
should include `runId`, `generatedAt`, `provenance`, `note`, `datasetVersion`,
`countrySet`, `scope`, `maxCoverage`, `promptVersion`, `panel`, `rounds`,
`cellEstimates` and `indicatorJudgements`.

Set `note` to say who produced it, when, and what it may be used for. Keep the
dataset version and country set tied to the evidence brief. Then run `pnpm bench
validate`, which checks the schema and catches mistyped country codes, unknown
indicator ids, missing rounds, coverage holes, and a missing note.

The CLI writes every run to an immutable file named by `runId`. Pass
`--activate` only after reviewing the run to copy it to
`data/delphi/latest.json`. The active file is a copy of the selected archive,
not the archive itself.
