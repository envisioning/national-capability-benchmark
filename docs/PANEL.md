# The Delphi layer

The benchmark has two assessment tracks. The source-backed track measures the
country with named indicators and produces the canonical `score` and
`confidence`. World Bank ingestion and reproducible source adapters produce
the same observation shape, while a small set of manually authored observations
is stored separately. The Delphi track
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

Models come from `NCB_PANEL` and are dealt to stances round-robin. **On the
gateway, supply four distinct vendors.** With four stances and three models one vendor takes two
stances, the panel loses a quarter of its independence, and nothing in the run
file says so. The default is now four: Anthropic, OpenAI, Google and Mistral.
An in-session run under D154 and D155 may use one or two vendors, and its `note` says so.

Check every id against the gateway's own list before a run. It is public, needs
no key, and carries the price each model is billed at:

```bash
curl -s https://ai-gateway.vercel.sh/v1/models
```

A stale id fails that whole panelist rather than degrading. See D106.

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
| `in_session` | Panelists scored inside a working session, by agents in separate contexts or by a person | Yes when it meets the D154 and D155 panel test below; otherwise a research note |
| `human` | Human expert panel | Yes |
| `mock` | Deterministic offline stand-in | **No** |

`isEvidential(provenance)` and `isPanel(run)` are exported from `@ncb/core`. Use
them rather than checking strings. The report and the viewer both refuse to
present a `mock` run as evidence, and both warn when a run has fewer than three
panelists.

**A run with one panelist is not a panel.** The median is one opinion and the
IQR is zero. Such a run can be useful for finding artefacts and is a research
note, never published as a panel.

**An in-session run is a panel for publication when it passes D154's test,
as D155 amends it.** At least three panelists, each in a separate context
with a distinct fixed stance, all scoring from the same evidence
brief that `pnpm bench prompt` prints for the current dataset. Its provenance
stays `in_session` and is never relabelled `gateway`. This supersedes the
earlier rule that a gateway run must replace every in-session run before
publication. A multi-vendor gateway run is still the stronger instrument (four
vendors, rounds dispatched by code, failed calls counted) and should be
preferred whenever `AI_GATEWAY_API_KEY` exists. `isPanel` counts panel entries
and cannot see context separation or vendor mix, so the run file has to state
both (see "Running it in session" below).

Under D155 the panelists may all come from one vendor, and one model may take
two stances in two separate contexts. The cost is stated there: one model
family shares its blind spots, so the panel's spread measures stance and not
vendor, and its IQR is a floor on the real uncertainty. A multi-vendor
in-session run or a gateway run on the same dataset supersedes a one-vendor
run as soon as one can be made. D139 still applies: a run compares
with the indicators only when its `datasetVersion` is the current one.

## Running it

```bash
export AI_GATEWAY_API_KEY=...
export NCB_PANEL=anthropic/claude-opus-5,openai/gpt-5,google/gemini-2.5-pro,...
pnpm bench cost --max-coverage 1
pnpm bench delphi --rounds 2 --max-coverage 1 --activate
pnpm bench validate                   # schema-check what came out
pnpm bench score && pnpm bench report
```

Without a key the CLI falls back to the mock provider and says so.

### Running it in session (D154, D155)

With no gateway key, the panel runs inside a working session. The vendors
available today are Anthropic, through Claude Code subagents, and OpenAI,
through the codex CLI (`codex exec`). With two vendors and four stances, each
vendor takes two stances, and no vendor takes a stance the other already
holds in the same round. When only one vendor is available (D155), its
models take the stances, one context per stance, and a smaller model is
never added to make up the count (D13).

1. Score the current dataset and print each panelist's prompt from the
   pipeline: `pnpm bench prompt --system` for the rules and `pnpm bench prompt
   --stance <id>` for the country blocks. Never paraphrase a prompt.
2. Start one context per panelist: one subagent per Claude stance, one `codex
   exec` per OpenAI stance. A panelist sees its system rules, its stance and
   the evidence brief, and nothing another panelist wrote. One context never
   writes two panel entries. Each returns round-1 cells in the
   `DelphiRunFile` cell shape (`docs/PANELIST-BRIEF.md`).
3. For round 2, the orchestrating session anonymises the merged round-1 cells
   with `anonymiseRound` and builds each panelist's prompt with
   `round2CellPrompt`, both in `packages/core/src/delphi/prompts.ts`, then
   sends them to fresh contexts, one per panelist, on the same vendor and
   stance as round 1.

`pnpm bench delphi --in-session <dir> --models a,b,c --stances 3` does steps
1, 3 and 4 with the gateway's own loop. It writes every prompt a gateway run
would send, byte for byte, to `<dir>/prompts/` (round 1, the indicator audit,
the system rules and the two answer schemas), and saves nothing while an
answer is missing. Each panelist writes JSON to `<dir>/answers/`, in the
layout `packages/core/src/delphi/in-session.ts` describes. Rerun the same
command: once round 1 is complete it writes the round-2 prompts from the
merged round-1 cells, and once every answer is in it writes the run file with
provenance `in_session`. Pass `--note` for the run's note. The prompts carry
the stance but not the system rules, so a panelist reads `system.txt` first.
4. Merge into one run file in `data/delphi/<runId>.json` with `provenance:
   "in_session"`, the current `datasetVersion` and `countrySet`, and one
   `panel` entry per panelist naming its stance and its model as the vendor
   reports it, plus the route, for example `gpt-5.x (codex CLI, in-session)`.
   The `note` states the vendors, that each panelist ran in its own context,
   the round count, any panelist or cell that failed and was not rerun, and
   that the run is an interpretation layer whose estimates never enter
   `score`.
5. `pnpm bench validate`, read the cell-round counts it reports, then
   `pnpm bench score` and review before `--activate` copies it to
   `latest.json`. A cell short of the declared panel narrows the IQR and reads
   as agreement, so rerun the missing panelist rather than activating around
   it.

**Nothing activates itself.** `--activate` is required for every run, including
a full-frame one. Until you pass it, `latest.json` keeps pointing at the
previous run and the new file sits beside it for review.

**A failed call is dropped, counted and published.** One vendor rate-limiting
does not cost the other 459 calls, so the run continues. The cells that call
covered come back with fewer panelists, and a shorter list has a narrower IQR,
so a partial failure would otherwise read as agreement. `attemptedCalls` and
`failedCalls` travel on the run file, the command prints a warning, and
`bench validate` reports both the count and any cell-round short of the declared
panel. Read that warning before you activate.

Useful flags: `--countries BRA,IND` to make a preflight for a subset,
`--max-coverage 0.5` to include only dimensions with thin source coverage,
`--max-coverage 1` to review all nine dimensions, `--activate` to make a
reviewed run active, `--no-judge` to skip the indicator audit, `--stances N`,
and `--concurrency N`. A subset or 0.5 coverage run is a preflight. Such runs
are archived without changing `latest.json` unless `--activate` is explicit.
Adding a country changes the normalization frame, so the published run for the
new dataset version should cover the full rebased country set.

## Cost

`pnpm bench cost` builds the prompts this repo would actually send, measures
them, and prices them. It accepts the same `--countries` and `--max-coverage`
scope as the run command. It is a command rather than a documented figure
because the evidence brief grows with the indicator registry, and round 2
carries round 1 back. Both grow with the registry.

Run `pnpm bench cost --max-coverage 1` for the current full-frame estimate
before starting the full panel. Prices come from the gateway's public model
list, which states the rate a run is billed at, so re-verify them there rather
than on a vendor pricing page.

Caveats the command prints for itself: characters-per-token is an approximation,
the output figure includes a 3× multiplier for reasoning tokens, list prices are
in `packages/core/src/delphi/pricing.ts` with a `LAST_VERIFIED` date, non-
Anthropic prices are marked unverified, and the gateway may add margin.

**Cost is not the primary constraint at this scale** (D13). Price the current
scope before running it, then choose models for independent, useful judgments.
A cheaper model adds variance that can look like disagreement. The IQR matters
most.

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
