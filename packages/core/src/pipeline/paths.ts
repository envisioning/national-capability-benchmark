import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

/** Repo root, from packages/core/src/pipeline. */
export const ROOT = resolve(here, '../../../..')
export const DATA_DIR = resolve(ROOT, 'data')
export const OBSERVATIONS_DIR = resolve(DATA_DIR, 'observations')
export const DELPHI_DIR = resolve(DATA_DIR, 'delphi')
export const RESEARCH_DIR = resolve(DATA_DIR, 'research')
export const RESEARCH_RUNS_DIR = resolve(RESEARCH_DIR, 'runs')
export const EVIDENCE_DIR = resolve(DATA_DIR, 'evidence')
export const INSTITUTIONS_DIR = resolve(DATA_DIR, 'institutions')
export const SNAPSHOT_DIR = resolve(OBSERVATIONS_DIR, 'snapshots')
export const OUT_DIR = resolve(DATA_DIR, 'out')
export const COUNTRY_OUT_DIR = resolve(OUT_DIR, 'countries')
export const INDICATOR_OUT_DIR = resolve(OUT_DIR, 'indicators')
export const SUBNATIONAL_OUT_DIR = resolve(OUT_DIR, 'subnational')
export const AGENDA_OUT_DIR = resolve(OUT_DIR, 'agenda')
export const INSTITUTION_OUT_DIR = resolve(OUT_DIR, 'institutions')
export const SCHEMA_OUT_DIR = resolve(OUT_DIR, 'schema')

export const FILES = {
  worldBank: resolve(OBSERVATIONS_DIR, 'worldbank.json'),
  jointEvsWvs: resolve(OBSERVATIONS_DIR, 'joint-evs-wvs.json'),
  vdem: resolve(OBSERVATIONS_DIR, 'vdem-cy-core.json'),
  manual: resolve(OBSERVATIONS_DIR, 'manual.json'),
  revisions: resolve(OBSERVATIONS_DIR, 'revisions.json'),
  delphiLatest: resolve(DELPHI_DIR, 'latest.json'),
  researchInventory: resolve(RESEARCH_DIR, 'inventory.json'),
  evidence: resolve(EVIDENCE_DIR, 'records.json'),
  institutionsBrazil: resolve(INSTITUTIONS_DIR, 'BRA.json'),
  index: resolve(OUT_DIR, 'index.json'),
  flatTable: resolve(OUT_DIR, 'table.csv'),
  diagnostics: resolve(OUT_DIR, 'diagnostics.json'),
  report: resolve(OUT_DIR, 'report.md'),
  velocity: resolve(OUT_DIR, 'velocity.json'),
  leverage: resolve(OUT_DIR, 'leverage.json'),
  residual: resolve(OUT_DIR, 'residual.json'),
  datapackage: resolve(OUT_DIR, 'datapackage.json'),
  subnationalIndex: resolve(SUBNATIONAL_OUT_DIR, 'index.json'),
}

/** One country-specific institutional network. */
export function institutionFile(iso3: string): string {
  return resolve(INSTITUTIONS_DIR, `${iso3.toUpperCase()}.json`)
}

/** One file per country, so a page loads what it needs and nothing else. See D27. */
export function countryFile(iso3: string): string {
  return resolve(COUNTRY_OUT_DIR, `${iso3.toUpperCase()}.json`)
}

/** One file per indicator, holding every country's value for it. See D30. */
export function indicatorFile(id: string): string {
  return resolve(INDICATOR_OUT_DIR, `${id}.json`)
}

/** One subnational file per country and indicator. */
export function subnationalFile(iso3: string, indicatorId: string): string {
  return resolve(SUBNATIONAL_OUT_DIR, iso3.toUpperCase(), `${indicatorId}.json`)
}

/** The language-neutral agenda, one file per country. See D35. */
export function agendaFile(iso3: string): string {
  return resolve(AGENDA_OUT_DIR, `${iso3.toUpperCase()}.json`)
}

/**
 * One institution explorer feed per country per lexicon.
 *
 * The feed carries rendered labels, so language is chosen at write time. The
 * language-neutral artefact is the institution map itself. See D82.
 */
export function institutionExplorerFile(iso3: string, lang: string): string {
  return resolve(INSTITUTION_OUT_DIR, `${iso3.toUpperCase()}.${lang}.json`)
}

/** One rendered agenda per country per lexicon. See D35. */
export function agendaDoc(iso3: string, lang: string): string {
  return resolve(AGENDA_OUT_DIR, `${iso3.toUpperCase()}.${lang}.md`)
}
