# Evidence records: inclusion rule and authoring guide

An evidence record documents a case of a country doing the thing an indicator
is meant to measure, filed against an indicator whose `ingest` is `gap`.
Records live in `data/evidence/records.json`, are schema-checked by
`pnpm bench validate`, and never enter a score or a confidence. D20 says why
the layer exists. D31 says why each record carries a mechanism. D33 is the
decision behind this document.

This document answers the question those decisions left open: which cases get
in, and how a record is written.

---

## The inclusion rule

A candidate becomes a record only when it passes all five tests.

1. **It bears on a declared gap.** The record must be filed against a registry
   indicator with `ingest: 'gap'`, and it must evidence the construct that
   indicator asks for, not something adjacent. Read the indicator's
   `definition` and `notes` in `packages/core/src/model/indicators.ts` first.
   If the case fits a measured indicator, the score already carries it and the
   validator warns.

2. **A named publisher carries the number.** The claim must rest on one
   published figure with a reference period, from a source that maps to a tier
   in `SOURCE_TIERS`. The URL must open without authentication. A programme
   reporting on itself is admissible, but the `limits` field must say so
   (see `bra-govbr` for the template).

3. **The delivery is institutional.** The case must be attributable to the
   country's own institutions making a move: a mandate, a build, a tender, a
   programme. A favourable endowment, a multinational's plant, or a trend that
   happened to a country does not qualify.

4. **It was delivered, not announced.** The programme must have operated at
   national scale. A plan, a strategy document, a pilot, or a launch press
   release disqualifies. `started` records the year delivery began, not the
   year of announcement.

5. **The limits can be written honestly.** Before authoring, you must be able
   to state what the number does not show. If the honest limits paragraph
   destroys the claim, the case is not evidence and does not go in.

What always disqualifies: rankings, awards, and press coverage as the metric;
a metric with no reference period; a case whose only source is prose.

## Selection discipline

The schema stops a record from being advocacy. This section stops the corpus
from being advocacy.

- **The set carries its reversals.** For every five records, at least one must
  document erosion, collapse, or a delivery that ran backwards. `bra-pni` is
  the template: a capability that reached the whole country and then lost a
  third of its coverage. A corpus of pure successes is a brochure. Every record
  carries a `status`, a reversal is a record whose status is `eroded` or
  `dismantled`, and `pnpm bench validate` warns when the corpus falls below the
  quota.

- **Expand by dimension, not by country.** File the next record against the
  dimension with the fewest records. Not every desert can be filled: the gaps
  in trust and agency are survey constructs (interpersonal trust, perceived
  control), and a "delivery" of one fails test three of the inclusion rule.
  Their fix is a dataset, not an evidence record. Do not force a weak record
  in to cover a dimension.

- **One country never dominates.** When one country holds more than a third of
  the corpus, the next records come from elsewhere. Brazil holds 25 of the
  current 204 records and the Netherlands 21; the rule exists because of that
  concentration.

- **A record is one delivery.** One programme, one record. If a programme has
  two distinct phases with separate evidence, that is still one record; put
  the second number in the claim, as `bra-pni` does.

## Authoring a record

Records are hand-written JSON in `data/evidence/records.json`. The schema is
`EvidenceRecord` in `packages/core/src/model/schema.ts`. Field by field:

- **`id`** — lowercase ISO3, hyphen, short programme slug: `bra-pix`,
  `ury-ceibal`, `est-x-road`. The slug is the name people use for the
  programme, not a description.

- **`indicatorId`** — must exist in the registry and must be a gap. The
  validator errors on unknown ids and warns on measured ones.

- **`title`** — the programme's name. If the record documents a reversal, the
  title says so: "Programa Nacional de Imunizacoes, and its erosion".

- **`claim`** — one sentence. Name the actor, state what was delivered and at
  what scale, carry the years. Past tense. The claim must be checkable against
  the source, not a summary of the programme's ambitions.

- **`metric`** — the one published number that carries the claim, with its
  unit and reference period as published. If you compute the number from a
  published series rather than quote a headline figure, the `limits` must say
  so (see `ury-electricity`).

- **`secondMetric`** — optional, same shape as `metric`, for the claims one
  number cannot hold. An `eroded` record pairs the current value with the peak
  it fell from (`bra-pni`: 91 percent in 2024 against 99 in 2003). A delivery
  record can pair scale with a cost or schedule figure, which is what
  `large_project_delivery` asks for. The `name` on each metric says
  which is which. The validator warns on an `eroded` record without one.

- **`started`** — the year delivery began.

- **`status`** — where the delivery stands as of `retrievedAt`. One of
  `operating` (running now, at or near the claimed scale), `concluded` (the
  delivery finished and the result stands), `eroded` (still running, but a
  documented part of its peak is gone), `dismantled` (ended by decision or
  collapse). Choose `eroded` or `dismantled` whenever the honest limits
  paragraph documents a loss: the status is how the reversal quota is counted,
  and a reversal hidden in prose does not count.

- **`source`** — publisher named as institution plus dataset, the URL that
  opens, the tier, and the date you retrieved it. Prefer the statistical API
  over the press page: an API URL keeps the claim checkable by machine.

- **`limits`** — required, and the most important field. State what the number
  does not show, why it is weak evidence for the construct, and every known
  problem with the source: self-reporting, single antigen, wet-year effects,
  whatever applies. A case without its limits is advocacy. When in doubt,
  write the paragraph a hostile reviewer would write, then keep it.

- **`pattern`** — our reading, not data; see D31 and the invariant in
  AGENTS.md. `mechanism` is the move in one or two sentences, active voice,
  name the actor. `preconditions` list what had to already exist — they are
  the reason a copy fails elsewhere, and three honest lines beat five vague
  ones. `travelled` is optional: where the move was tried again and what
  changed in the retelling. The validator warns when `pattern` is missing,
  because a case that cannot travel is a trophy.

## Verification protocol

The schema makes a record checkable. This protocol is what makes it checked.
Every record in the corpus was authored this way; follow it and yours will
survive review.

1. **Verify before you write.** Open the source URL on the day you author the
   record and read the number there. Never write a number from memory, a press
   summary or a search-result snippet. Those are leads, not sources. If you
   cannot see the number at the URL, do not write the record.

2. **`retrievedAt` is the day you checked.** It says the URL opened and carried
   the number on that date.

3. **Prefer the page a machine can check.** A statistical API beats a
   statistics page, which beats a press release, which beats a report. When
   the number exists only inside a PDF or is read off a chart, say so in
   `limits` — a reviewer must know how much work checking will take.

4. **When the official series does not reach the number, say so.** Sometimes
   no official source covers the claim (Argentina's pre-1998 inflation is the
   corpus example: the IMF and World Bank series are empty there). A
   republication by a named institution is admissible at the honest tier, with
   the republication disclosed in `limits`. A number that exists nowhere
   citable does not get a record.

5. **URLs rot, and the validator can check.** Agencies reorganise and pages
   move; one corpus record's publisher was renamed and re-domained within a
   year of the number being published. `pnpm bench validate --fetch`
   live-checks every source URL: a 404 is an error, a bot-block or a moved
   host is a warning to check by hand. If you find a dead source URL, fixing
   it is a contribution: locate the moved page, verify the number still
   appears, update `url` and `retrievedAt`.

After editing, run:

```bash
pnpm bench validate
```

Zero errors is the gate. Read the warnings: each one names a record that is
either misfiled or incomplete.

## When a gap is promoted

A gap becomes a scored indicator only when a comparable series covers at least
two reference countries (D20). Promotion strands the records filed against it,
and the validator starts warning that they add nothing the score does not
carry. Handle them in the same change that promotes the gap: delete each
stranded record, and name the deleted ids in the decision entry that records
the promotion. The case remains in git. The decision entry records what it once
stood in for.
