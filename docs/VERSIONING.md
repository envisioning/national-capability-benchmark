# Versioning and changelog

NCB has one version: the semantic dataset version in
`packages/core/src/model/version.ts`. It describes the contract a reader is
quoting, not the number of commits or the age of the viewer.

`CHANGELOG.md` is the human-curated release history. It is deliberately plain
Markdown, following Meet's readable release notes, while the viewer and feed
derive their smaller summaries from that same file. A release entry is not
generated from commit subjects: data revisions and methodological changes need
human explanation, and a build must never silently author a claim about the
benchmark.

## Version rules

- **Major** means the normalization frame was rebased, a country was added, or
  a published field was removed or renamed. Old scores need a new reading.
- **Minor** means indicators or published fields were added without adding a
  country. Existing numbers do not move.
- **Patch** means the same registry and country set were re-ingested. Values may
  be restated, and those movements belong in `data/observations/revisions.json`.

The rules are also recorded in `packages/core/src/model/version.ts` and the
project instructions. The version bump, regenerated output and changelog entry
belong in the same reviewed change.

## Build contract

`pnpm changelog:check` verifies that:

- `CHANGELOG.md` exists and has dated `X.Y.Z` release headings;
- releases are unique and newest first; and
- the newest release is the current `DATASET_VERSION`.

The check runs automatically before `pnpm build` and `pnpm typecheck`. It only
reads files and never creates a refresh commit. This keeps the useful part of
Septena's release discipline — one source feeding every surface — without
making a data build mutate the repository.

## Where it appears

The same source is used by:

- `/changelog`, the human-facing history;
- the footer and About navigation;
- `/feed.xml`, with one dated entry per dataset release;
- `/sitemap.xml`; and
- `/llms.txt`, which points both to the rendered page and the repository source.

For a release, update `DATASET_VERSION`, rescore the output, add the new
`CHANGELOG.md` section, then run `pnpm changelog:check`, `pnpm build` and
`pnpm typecheck`. The data version travels with `index.json`, country files and
`datapackage.json`, so any score quoted from the viewer can be pinned to both a
version and a generation date.
