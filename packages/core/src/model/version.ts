/**
 * The dataset version, semantic. Stamped into `data/out/index.json`, every
 * country file and `datapackage.json`, so a consumer can pin what it reads.
 *
 * Bump rules, from docs/DECISIONS.md D37:
 *
 * - **major** — the reference frame rebased, or a published field removed or
 *   renamed. Published scores move, or a consumer breaks. This is the
 *   "versioned, announced act" the frame invariant already requires.
 * - **minor** — countries, indicators or fields added. Nothing published moves.
 * - **patch** — a re-ingest under the same registry and frame. Values may
 *   restate (and are logged in revisions.json), shapes do not change.
 *
 * The number versions the contract, not the method. Methodological maturity is
 * tracked in docs/KNOWN-ARTEFACTS.md and is a different thing.
 */
export const DATASET_VERSION = '1.1.0'
