/**
 * The user-facing application release. This covers the viewer, routes,
 * research surfaces and documentation shipped as one product release. It is
 * separate from DATASET_VERSION because a new page does not restate a score.
 *
 * App release bump rules:
 *
 * - **major** — a breaking route, API or reader-facing contract change;
 * - **minor** — a new public capability, page or non-breaking surface; and
 * - **patch** — a bug fix, copy change or visual refinement.
 *
 * The first formal public product release is 1.0.0. The benchmark remains a
 * prototype as a research object, and the provisional research layers remain
 * under review; that does not make the surrounding application a 0.x release.
 */
export const APP_VERSION = '1.10.0'

/**
 * The dataset version, semantic. Stamped into `data/out/index.json`, every
 * country file and `datapackage.json`, so a consumer can pin what it reads.
 *
 * Bump rules, from docs/DECISIONS.md D37, amended by D47:
 *
 * - **major** — the frame rebased, or a published field removed or renamed.
 *   Published scores move, or a consumer breaks. Adding a country rebases the
 *   frame, so it lands here. This is the "versioned, announced act" the frame
 *   invariant requires.
 * - **minor** — indicators or fields added with no country added. Nothing
 *   published moves.
 * - **patch** — a re-ingest under the same registry and country set. Values may
 *   restate (and are logged in revisions.json), shapes do not change.
 *
 * The number versions the contract, not the method. Methodological maturity is
 * tracked in docs/KNOWN-ARTEFACTS.md and is a different thing.
 */
export const DATASET_VERSION = '6.1.0'
