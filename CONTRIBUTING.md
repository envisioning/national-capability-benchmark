# Contributing

This benchmark is open to contributions. Most of what makes a country capable is
not measured anywhere yet. The gap list shows where help is needed.

Every contribution follows the same discipline. Scores are computed, never
edited. Decisions are appended to `docs/DECISIONS.md`. Evidence carries its
source, year and limits. Changes that cannot meet these rules do not belong here.

## What you can contribute

### Fill a gap

The registry declares 26 indicators the specification asks for with no adequate
internationally comparable dataset behind them. Each one lowers confidence
until it is filled. The full list is in every agenda document under
`data/out/agenda/`, and in `packages/core/src/model/indicators.ts` as rows
with `ingest: 'gap'`.

A gap becomes a scored indicator when you can point to a published series that:

- covers at least two reference countries on comparable definitions;
- opens without authentication, so anyone can check the number;
- names its publisher, reference period and method.

Open an issue with the series before writing the adapter. The World Bank API
traps in `AGENTS.md` are real, and an hour of discussion is cheaper than a
rejected pull request. National statistical sources are welcome and wanted:
several gaps are measurable domestically today and internationally never.

### File an evidence record

An evidence record documents a case of a country doing the thing a gap
indicator is meant to measure: a delivery, at national scale, with a published
number behind it. Records never enter a score. They exist so that what the
indicators cannot see is written down with sources and limits instead of
argued in prose.

Read `docs/EVIDENCE.md` first. The inclusion rule has five tests and the
selection discipline is deliberate: for every five records, at least one must
document erosion or collapse. A corpus of successes is a brochure.

Records live in `data/evidence/records.json`. Run `pnpm bench validate` before
opening the pull request, and `pnpm bench validate --fetch` to confirm every
source URL still opens.

### Add a language

Language is an interpretation layer over an English ground layer. A lexicon is
one data file in `packages/core/src/i18n/` mapping the model's vocabulary and
the agenda strings into your language, plus one line in `index.ts` to register
it. A lexicon with holes still renders complete pages, because every lookup
falls back to the registry English, so you can start small and grow.

`pt-br.ts` is the template. Do not translate ids, JSON output or registry
definitions in place: the ground layer stays English so any translated page can
be checked against its source.

### Contest an indicator

If you think an indicator measures the wrong thing, the project agrees this
happens: it has retired seven so far, with the evidence recorded. Open an issue
naming the indicator, what it fails to capture, and the evidence that shows it.
The bar for retiring is a decision entry in `docs/DECISIONS.md`, and
`docs/KNOWN-ARTEFACTS.md` documents every place the current model is known to
be wrong about the world. Read both before arguing: the flaw you found may
already be on the record, and the fastest contribution is the one that brings
the missing dataset instead.

### Add a country

Extended countries are safe to add: they are scored against the fixed frame
and move nothing that is already published. Adding one means one row in
`packages/core/src/model/countries.ts` with `frame: 'extended'` and a stated
reason, then `pnpm bench all`. Verify the ingest log: a World Bank code that
resolves for one country can be silently empty for another.

Adding a **reference** country rebases the entire dataset and is a versioned,
announced act. Propose it in an issue; do not open a pull request for it.

## The rules that hold everything together

1. **The green gate.** `pnpm build` and `pnpm typecheck` must pass. Run
   `pnpm bench validate` after touching `data/delphi` or `data/evidence`.
2. **Decisions are append-only.** To change a methodological choice, supersede
   its entry in `docs/DECISIONS.md` with the evidence that overturned it, in
   the same pull request as the change.
3. **Nothing is imputed, nothing is folded.** Missing data lowers coverage.
   Confidence is published beside every score and never enters it. Delphi
   estimates never enter the indicator score.
4. **Provenance is stored, never inferred.** Every observation carries its
   source, year and URL. Every restatement is logged in
   `data/observations/revisions.json`.
5. **The numbers must be able to embarrass us.** Do not delete a gap to raise
   confidence, widen a frame to unclamp a score, or trim a record's limits
   paragraph. Failures of measurement are findings and get written down in
   `docs/KNOWN-ARTEFACTS.md`.

`AGENTS.md` holds the commands, the layout and the traps. `docs/WHY.md` is the
claim under test and what this project is not allowed to become. If a
contribution seems to conflict with either, say so in the issue: the documents
are contestable too, by the same append-only rule as everything else.
