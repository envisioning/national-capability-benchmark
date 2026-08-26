import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

/** Repo root, from packages/core/src/pipeline. */
export const ROOT = resolve(here, '../../../..')
export const DATA_DIR = resolve(ROOT, 'data')
export const OBSERVATIONS_DIR = resolve(DATA_DIR, 'observations')
export const DELPHI_DIR = resolve(DATA_DIR, 'delphi')
export const EVIDENCE_DIR = resolve(DATA_DIR, 'evidence')
export const OUT_DIR = resolve(DATA_DIR, 'out')

export const FILES = {
  worldBank: resolve(OBSERVATIONS_DIR, 'worldbank.json'),
  manual: resolve(OBSERVATIONS_DIR, 'manual.json'),
  delphiLatest: resolve(DELPHI_DIR, 'latest.json'),
  evidence: resolve(EVIDENCE_DIR, 'records.json'),
  scores: resolve(OUT_DIR, 'scores.json'),
  flatTable: resolve(OUT_DIR, 'table.csv'),
  diagnostics: resolve(OUT_DIR, 'diagnostics.json'),
  report: resolve(OUT_DIR, 'report.md'),
}
