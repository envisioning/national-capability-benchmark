import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { DATA_DIR } from '@ncb/core/node'
import type {
  CountryResult,
  DelphiRunFile,
  Diagnostics,
  EvidenceRecord,
  IndicatorAcrossCountries,
} from '@ncb/core'

/**
 * Where the scored output lives, decided once at startup.
 *
 * Locally `@ncb/core` resolves it from its own position in the workspace. A
 * deployment can lay the files out differently: the package may be copied
 * rather than linked, and the working directory is the app rather than the
 * repository. So the candidates are tried in order and the first one that has
 * an index wins, which makes this work the same way on a laptop and on a
 * server without either of them being a special case.
 */
const DATA_ROOT = ((): string => {
  const candidates = [
    DATA_DIR,
    resolve(process.cwd(), 'data'),
    resolve(process.cwd(), '../../data'),
    resolve(dirname(process.cwd()), 'data'),
  ]
  return candidates.find((c) => existsSync(resolve(c, 'out/index.json'))) ?? DATA_DIR
})()

const PATHS = {
  index: resolve(DATA_ROOT, 'out/index.json'),
  diagnostics: resolve(DATA_ROOT, 'out/diagnostics.json'),
  delphiLatest: resolve(DATA_ROOT, 'delphi/latest.json'),
  evidence: resolve(DATA_ROOT, 'evidence/records.json'),
  country: (iso3: string) => resolve(DATA_ROOT, 'out/countries', `${iso3.toUpperCase()}.json`),
  indicator: (id: string) => resolve(DATA_ROOT, 'out/indicators', `${id}.json`),
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    return null
  }
}

/** The slim list: nine scores per country, no indicator rows and no yearly series. */
export async function loadIndex(): Promise<{ generatedAt: string; countries: CountryResult[] } | null> {
  return readJson(PATHS.index)
}

/** One country in full, including every indicator row and its history. */
export async function loadCountry(iso3: string): Promise<CountryResult | null> {
  const file = await readJson<{ generatedAt: string; country: CountryResult }>(
    PATHS.country(iso3),
  )
  return file?.country ?? null
}

export async function loadDiagnostics(): Promise<Diagnostics | null> {
  return readJson(PATHS.diagnostics)
}

export async function loadDelphiRun(): Promise<DelphiRunFile | null> {
  return readJson(PATHS.delphiLatest)
}

/** One indicator across every country, for the peek. */
export async function loadIndicatorAcrossCountries(
  id: string,
): Promise<IndicatorAcrossCountries | null> {
  return readJson<IndicatorAcrossCountries>(PATHS.indicator(id))
}

/** Evidence records for indicators with no dataset. Never scored. */
export async function loadEvidence(): Promise<EvidenceRecord[]> {
  const file = await readJson<{ records: EvidenceRecord[] }>(PATHS.evidence)
  return file?.records ?? []
}

export const MISSING_DATA_HINT =
  'No scored output yet. Run `pnpm bench all` in the repo root, then reload.'
