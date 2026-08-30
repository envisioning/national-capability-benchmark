# Versioning and changelog

NCB has two version tracks, both defined in
`packages/core/src/model/version.ts`:

- `APP_VERSION` identifies the whole user-facing product: the viewer, routes,
  research surfaces and documentation shipped together.
- `DATASET_VERSION` identifies the scored data contract a reader is quoting. It
  is stamped into `data/out/index.json`, every country file and
  `datapackage.json`.

The two numbers move independently. A new page can be an app release without
restating a score. A new country can be a dataset major release without being a
new app feature. This keeps a score's comparability separate from the age of
the viewer around it.

`CHANGELOG.md` is the human-curated release history for both tracks. It is
deliberately plain Markdown, following Meet's readable release notes, while
the viewer and feed derive their smaller summaries from that same file. A
release entry is not generated from commit subjects: data revisions and
methodological changes need human explanation, and a build must never silently
author a claim about the benchmark.

## Dataset version rules

- **Major** means the normalization frame was rebased, a country was added, or
  a published field was removed or renamed. Old scores need a new reading.
- **Minor** means indicators or published fields were added without adding a
  country. Existing numbers do not move.
- **Patch** means the same registry and country set were re-ingested. Values may
  be restated, and those movements belong in `data/observations/revisions.json`.

The rules are also recorded in `packages/core/src/model/version.ts` and the
project instructions. The dataset version bump, regenerated output and dataset
changelog entry belong in the same reviewed change.

## App release rules

- **Major** means a breaking route, API or reader-facing contract change.
- **Minor** means a new public capability, page or non-breaking surface.
- **Patch** means a bug fix, copy change or visual refinement.

An app release can include a dataset release, but it must name the dataset
version it publishes. The first tracked product release is `0.1.0` while the
benchmark remains a prototype and the provisional research layers remain under
review.

## Build contract

`pnpm changelog:check` verifies that:

- `CHANGELOG.md` exists and has dated `App X.Y.Z` and `Dataset X.Y.Z` headings;
- each release stream is unique and newest first; and
- the newest App and Dataset releases match `APP_VERSION` and
  `DATASET_VERSION`.

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

For an app release, update `APP_VERSION`, add an `App X.Y.Z` section naming the
dataset it publishes, then run the release check and the app gate. For a dataset
release, update `DATASET_VERSION`, rescore the output when required, add a
`Dataset X.Y.Z` section, then run the same checks. The data version travels with
`index.json`, country files and `datapackage.json`, so any score quoted from the
viewer can be pinned to a dataset version and a generation date while the
surrounding product can be identified by its app release.
