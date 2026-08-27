# The Delphi layer

The indicator model measures what international datasets cover. The panel exists
to do the two things it cannot: judge the cells where the evidence is thin, and
audit the indicator set itself.

## What a panelist is

A panelist is a **model paired with a fixed analytical stance**. The stance is a
standing prior the panelist must argue from, so disagreement between panelists
has a reason behind it rather than being sampling noise.

The four stances are defined in `packages/core/src/delphi/panel.ts`:

| Stance | Standing question |
| --- | --- |
| Institutionalist | Does capability live in organisations that outlast their staff? |
| Bottom-up analyst | What does registration data fail to count? |
| Wealth sceptic | Is this capability, or is it money? |
| Execution realist | What has this country actually built or changed? |

Models come from `NCB_PANEL` and are dealt to stances round-robin. With four
stances and three models, one vendor gets two stances — supply four models, or
run `--stances 3`.

## Rounds

**Round 1.** Each panelist sees the evidence brief for one country: every
indicator with its raw value, year, normalised score, measurement class and
source, plus the declared gaps and the coverage figure. It scores all nine
dimensions, gives a self-confidence, writes a rationale, and names the specific
evidence it would need to be more certain.

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

## Provenance — read this before quoting any panel number

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
IQR is zero. `data/delphi/in-session-round1.json` is exactly this: ninety cells
scored by Claude Opus 5 in a working session on 2026-08-26, with a rationale and
a self-confidence per cell. It is genuinely useful — it produced most of
`KNOWN-ARTEFACTS.md` — and it must be replaced by a real gateway run before
anything is published.

## Running it

```bash
pnpm bench cost                       # price the run before you make it
export AI_GATEWAY_API_KEY=...
export NCB_PANEL=anthropic/claude-opus-5,openai/gpt-5,google/gemini-2.5-pro,...
pnpm bench delphi --rounds 2
pnpm bench validate                   # schema-check what came out
pnpm bench score && pnpm bench report
```

Without a key the CLI falls back to the mock provider and says so.

Useful flags: `--countries BRA,IND` to restrict the run, `--max-coverage 0.5` to
score only cells where the indicator evidence is thin, `--no-judge` to skip the
indicator audit, `--stances N`, `--concurrency N`.

## Cost

`pnpm bench cost` builds the prompts this repo would actually send, measures
them, and prices them. It is a command rather than a documented figure because
the evidence brief grows with the indicator registry and round 2 carries round 1
back, so both scale as the registry grows.

As of 2026-08-26, a four-panelist, two-round, ten-country run with the indicator
audit is 116 calls, roughly 446k input and 329k output tokens, and about **$7**
with two Anthropic panelists and two others.

Caveats the command prints for itself: characters-per-token is an approximation,
the output figure includes a 3× multiplier for reasoning tokens, list prices are
in `packages/core/src/delphi/pricing.ts` with a `LAST_VERIFIED` date, non-
Anthropic prices are marked unverified, and the gateway may add margin.

**Cost is not a constraint at this scale and must not be treated as one** (D13).
Even a forty-country run is under thirty dollars. Do not put a cheap model on the
panel to save money — it adds variance that reads as disagreement but is just a
weaker model, and the IQR is the output that matters most.

## Hand-authoring a run

An agent scoring inside a working session should read `docs/PANELIST-BRIEF.md`,
which covers stance assignment, how to print the exact prompt with `pnpm bench
prompt`, and why separate models must not be merged into one panel array from
one context.

An `in_session` or `human` run is written by hand as JSON in `data/delphi/`.
The schema is `DelphiRunFile` in `packages/core/src/model/schema.ts`. Required:
`runId`, `generatedAt`, `provenance`, `note`, `panel`, `rounds`,
`cellEstimates`, `indicatorJudgements`.

Set `note` to say who produced it, when, and what it may be used for. Then run
`pnpm bench validate`, which checks the schema and catches mistyped country
codes, unknown indicator ids, missing rounds, coverage holes, and a missing note.

To make a run active, copy it to `data/delphi/latest.json`. Keep the original
file: `latest.json` is a pointer, not the archive.
