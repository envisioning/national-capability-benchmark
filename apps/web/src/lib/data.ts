import { readFile } from 'node:fs/promises'
import { FILES } from '@ncb/core'
import type { CountryResult, DelphiRunFile } from '@ncb/core'
import type { Diagnostics } from '@ncb/core'

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    return null
  }
}

export async function loadScores(): Promise<{ generatedAt: string; countries: CountryResult[] } | null> {
  return readJson(FILES.scores)
}

export async function loadDiagnostics(): Promise<Diagnostics | null> {
  return readJson(FILES.diagnostics)
}

export async function loadDelphiRun(): Promise<DelphiRunFile | null> {
  return readJson(FILES.delphiLatest)
}

export const MISSING_DATA_HINT =
  'No scored output yet. Run `pnpm bench all` in the repo root, then reload.'
