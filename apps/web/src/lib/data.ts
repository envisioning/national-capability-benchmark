import { readFile } from 'node:fs/promises'
import { FILES, countryFile } from '@ncb/core/node'
import type { CountryResult, DelphiRunFile, Diagnostics, EvidenceRecord } from '@ncb/core'

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    return null
  }
}

/** The slim list: nine scores per country, no indicator rows and no yearly series. */
export async function loadIndex(): Promise<{ generatedAt: string; countries: CountryResult[] } | null> {
  return readJson(FILES.index)
}

/** One country in full, including every indicator row and its history. */
export async function loadCountry(iso3: string): Promise<CountryResult | null> {
  const file = await readJson<{ generatedAt: string; country: CountryResult }>(
    countryFile(iso3),
  )
  return file?.country ?? null
}

export async function loadDiagnostics(): Promise<Diagnostics | null> {
  return readJson(FILES.diagnostics)
}

export async function loadDelphiRun(): Promise<DelphiRunFile | null> {
  return readJson(FILES.delphiLatest)
}

/** Evidence records for indicators with no dataset. Never scored. */
export async function loadEvidence(): Promise<EvidenceRecord[]> {
  const file = await readJson<{ records: EvidenceRecord[] }>(FILES.evidence)
  return file?.records ?? []
}

export const MISSING_DATA_HINT =
  'No scored output yet. Run `pnpm bench all` in the repo root, then reload.'
