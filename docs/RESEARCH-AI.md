# AI-first evidence research

This document defines how AI helps expand the capability agenda without turning
the evidence layer into a catalogue of plausible stories.

## The boundary

The project has three different things that must not be merged:

1. **A research slot** is an uncovered country × declared-gap combination.
2. **A research lead** is an AI-generated hypothesis about what to investigate.
3. **An evidence record** is a source-checked, human-approved documented
   delivery in `data/evidence/records.json`.

Only the third appears as a documented delivery on `/agenda`. Research runs
never change a score, confidence, registry row or published evidence record.

This separation is the central safety property of the workflow. AI is good at
search-space construction, analogy, extraction planning and adversarial review.
It is not a source of facts by itself.

## The loop

```text
inventory → AI scout → AI critique → source retrieval → human/browser check
         → evidence record → validation → published agenda
```

### 1. Inventory

Run:

```bash
pnpm bench research inventory
```

This writes `data/research/inventory.json`. It counts deliveries by country,
dimension and gap indicator, records the reversal deficit and produces bounded
uncovered country-gap slots. The queue is deterministic, so two researchers
start from the same work list.

### 2. Scout

Run an offline prompt bundle:

```bash
pnpm bench research scout --prompt-only --limit 24
```

Or run a real structured AI call through the Vercel AI Gateway:

```bash
export AI_GATEWAY_API_KEY=...
export NCB_RESEARCH_MODEL=...
pnpm bench research scout --limit 24
```

The scout returns one lead per selected slot. Each lead must name its lane:

- `case`: a possible institutional delivery to investigate;
- `source_backed`: a possible comparable dataset or adapter task;
- `do_not_force`: the gap should not be filled with a case story.

The model receives the registry definition and notes for every slot. It must
return search targets, not asserted URLs or numbers. Real source citations only
appear after a separate verification step.

Use `--countries` and `--indicators` to run focused batches. Keep batches small
enough that a researcher can inspect every lead:

```bash
pnpm bench research scout --countries CHL,COL,PER --limit 18
pnpm bench research scout --indicators government_foresight_capacity,public_private_collaboration --limit 18
```

### 3. Critique

Run:

```bash
pnpm bench research critique --in data/research/runs/<scout-run>.json
```

The red-team model marks each inclusion test as `pass`, `fail` or `unknown` and
can only return `reject`, `needs_source` or `ready_for_source_check`.
`ready_for_source_check` is still unpublished. A critique is useful when it
rejects attractive but adjacent cases, especially rankings, announcements,
pilots, private-company outcomes and survey constructs dressed up as delivery.

### 4. Source retrieval

For every surviving lead, the researcher must retrieve the source before
writing the record. Prefer an official statistical table or API, then an audit,
administrative report, evaluation or inspectable academic source. Capture:

- publisher and exact title;
- URL and retrieval date;
- the exact metric, unit and reference period;
- the locator needed to find the number again;
- evidence of national-scale operation;
- the limits that remain true even if the number is correct.

The browser/agent may use AI to find and extract the relevant passage, but the
source must be opened and checked. Search snippets, model memory and generated
URLs are leads only. Do not copy licensed microdata into the repository.

### 5. Publication gate

The final author writes the normal `EvidenceRecord` by hand. It must pass all
five tests in `docs/EVIDENCE.md`, including the hostile limits paragraph. Then
run:

```bash
pnpm bench validate
pnpm bench validate --fetch
```

The AI research artifacts remain beside the published record as provenance for
how the lead was found, not as a substitute for the record's source.

## Selection policy

The first expansion milestone is a planning target, not a score threshold:

- 100 qualified deliveries;
- at least 40 represented countries;
- at least 20 represented gap indicators;
- at least 20 reversals;
- no country above one-third of the corpus.

The current corpus has 52 deliveries, 20 represented countries, 15 represented
gap indicators and 7 reversals. Until the reversal deficit is repaired, the
next four published records should be reversals or the corpus remains below its
own one-in-five rule. New work should come from outside Brazil while Brazil is
above one-third.

The queue prioritises thin dimensions, but it does not force a record into a
dimension whose construct cannot support one. Dataset-first work should follow
the source-promotion gates in `docs/RESEARCH-ROADMAP.md`.

## AI operating rules

- The model may propose, compare and criticise; it may not self-certify.
- Every factual field in a published record comes from a named source, not the
  scout or critique output.
- A source URL is not evidence that the number appears at that URL.
- A model confidence score is not benchmark confidence.
- A plausible analogy is not a delivery.
- A clean JSON parse is not conceptual validity.
- A rejected lead is useful research output and should not be silently lost.
- A gap promotion strands evidence records; do not build a large case corpus
  around a gap that is already close to a comparable source-backed series.

## What success looks like

Success is not merely more rows. It is a larger, more even and more falsifiable
library of mechanisms. Every batch should increase at least one of country
coverage, gap coverage or mechanism comparability while preserving the reversal
quota and source discipline. Once several countries face the same constraint,
the `pattern` fields can be compared for preconditions and failure modes rather
than presented as a list of national trophies.
