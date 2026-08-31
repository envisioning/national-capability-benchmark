# Brief for an in-session panelist

Read this if you are a model agent working in this repository and you have been
asked to score countries for the Delphi layer. It tells you what to produce,
how to get your exact prompt, and what your output may and may not be used for.

Read `docs/PANEL.md` first. This file does not repeat it.

## What you are

You are one panelist. You are not the panel.

The panel design pairs a **model** with a **stance**, because Delphi needs
disagreement that has a reason behind it. The four stances are defined in
`packages/core/src/delphi/panel.ts` and are fixed. You take one stance and you
argue from it for the whole run. You do not soften it toward a consensus you
imagine the others hold.

| Stance id | Assigned to |
| --- | --- |
| `institutionalist` | Claude |
| `bottom_up` | GPT |
| `wealth_sceptic` | Gemini |
| `execution_realist` | whichever model runs a fourth pass |

The pairing above is a convention for in-session runs so that two vendors never
land on the same stance. A gateway run assigns stances round-robin instead, in
`buildPanel`.

## Get your prompt from the pipeline, not from this file

The prompts are built from the live registry and the current scores. A prompt
copied into a document goes stale the moment an indicator moves. Print yours:

```bash
pnpm bench prompt --system
```

```bash
pnpm bench prompt BRA IND --stance wealth_sceptic
```

```bash
pnpm bench prompt --audit trust --stance bottom_up
```

With no country codes, `pnpm bench prompt` prints all 53 countries in the
current dataset. Each country block is
separated by `---`. The `--system` output is the rule set that governs every
answer, and it binds you even though the per-country prompt does not repeat it.

## What you return

One object per country per dimension, nine dimensions per country. The shape is
`DelphiRunFile` in `packages/core/src/model/schema.ts`. A cell looks like this:

```json
{
  "iso3": "BRA",
  "dimension": "anticipation",
  "round": 1,
  "panelist": "wealth_sceptic@gemini-2.5-pro",
  "model": "gemini-2.5-pro (in-session)",
  "score": 28,
  "selfConfidence": 0.6,
  "rationale": "One or two sentences. Say why you departed from the indicator-derived score, or why you held to it.",
  "missingEvidence": [
    "Name a dataset, a statistic or an observable event",
    "Not \"more data\""
  ]
}
```

Write it to `data/delphi/<runid>.json`. Do not touch `latest.json`: that pointer
is set by a human once the run is reviewed.

Then check it:

```bash
pnpm bench validate
```

That catches mistyped country codes, unknown indicator ids, missing rounds,
coverage holes and a missing note. A run that does not validate does not exist.

## Rules that are easy to get wrong

- **Score against the benchmark countries, not against the world.** Under D47
  the frame is built from the current country set together: 0 is the weakest of
  them on that dimension and 100 the strongest. There is no reference set. Do
  not reach for a global frontier.
- **The indicator-derived score is an input.** You are in the loop because the
  indicators mismeasure some countries. Depart from them when you can say why.
- **Low confidence is a real answer.** `selfConfidence` near 0.3 with an honest
  rationale is worth more to this project than a confident guess.
- **Do not invent statistics.** Reason from the evidence brief plus what you
  reliably know. A number you cannot source is worse than no number.
- **Set `provenance` to `in_session`.** Not `gateway`. `gateway` means the run
  went through the AI Gateway with real API calls, and that field decides
  whether the viewer may cite the run as evidence.

## What your run counts as

`isPanel` in `packages/core/src/model/schema.ts` returns true when a run is
evidential and has three or more panel entries. That check counts entries. It
does not verify that they are independent.

So: **do not write three stances into one panel array from one context.** You
would see your own round-1 answers while writing round 2, the IQR would be
computed across four voices of the same model in the same session, and every
surface in the viewer would render that spread as if it were cross-vendor
disagreement. One agent, one panel entry, one file. Independence is the thing
being measured, and it is the one thing this schema cannot check for you.

Merging separate single-panelist files into one run is a human step, done only
when the files were produced in separate sessions by different models.

## Current state

The current dataset is version 6.0.0 with 53 countries and 477
country-dimension cells. The repository contains three in-session,
one-panelist artifacts. `data/delphi/latest.json` points to an old Claude
round-1 artifact from 2026-08-26 with 144 cell estimates and no
`datasetVersion` or country-set metadata. The two later stance files are
anchored to dataset 4.0.0. None is a current panel for 4.5.0, and none should
be presented as publishable multi-model evidence.

Round 2 and indicator judgements still need to be run for the current dataset.
Generate prompts from the live pipeline after scoring 4.5.0. A reviewed gateway
run should use at least three independent panelists and cover the intended
country set before it replaces `latest.json`.
