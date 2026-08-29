import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import {
  ChallengeRecord,
  DelphiRunFile as DelphiRunFileSchema,
  INDICATORS,
  InstitutionNetworkFile,
  isScored,
  VelocityFile as VelocityFileSchema,
} from '@ncb/core'
import { DATA_DIR } from '@ncb/core/node'
import type {
  CountryResult,
  ChallengeRecord as ChallengeRecordType,
  DelphiRunFile,
  Diagnostics,
  EvidenceRecord,
  IndicatorAcrossCountries,
  DisputeRecord,
  VelocityFile,
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
export const DATA_ROOT = ((): string => {
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
  disputes: resolve(DATA_ROOT, 'disputes'),
  country: (iso3: string) => resolve(DATA_ROOT, 'out/countries', `${iso3.toUpperCase()}.json`),
  indicator: (id: string) => resolve(DATA_ROOT, 'out/indicators', `${id}.json`),
  institutions: (iso3: string) =>
    resolve(DATA_ROOT, 'institutions', `${iso3.toUpperCase()}.json`),
  velocity: resolve(DATA_ROOT, 'out/velocity.json'),
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    return null
  }
}

/** The slim list: nine scores per country, no indicator rows and no yearly series. */
export async function loadIndex(): Promise<{
  generatedAt: string
  /** Dataset version, semantic. Absent in output written before D37. */
  version?: string
  countries: CountryResult[]
} | null> {
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

/** The provisional velocity fixture, validated before the sandbox reads it. */
export async function loadVelocity(): Promise<VelocityFile | null> {
  const raw = await readJson<unknown>(PATHS.velocity)
  const parsed = VelocityFileSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

export async function loadDelphiRun(): Promise<DelphiRunFile | null> {
  const raw = await readJson<unknown>(PATHS.delphiLatest)
  const parsed = DelphiRunFileSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

/** One indicator across every country, for the peek. */
export async function loadIndicatorAcrossCountries(
  id: string,
): Promise<IndicatorAcrossCountries | null> {
  return readJson<IndicatorAcrossCountries>(PATHS.indicator(id))
}

/**
 * How much data each fetched indicator actually holds, for the sources page.
 *
 * Read from the per-indicator files rather than the country files: the same
 * numbers turned inside out, and 39 small reads instead of the whole dataset.
 * See D27 and D30.
 */
export async function loadIndicatorCoverage(): Promise<
  Map<string, { countries: number; latestYear: number }>
> {
  const scored = INDICATORS.filter(isScored)
  const files = await Promise.all(scored.map((def) => loadIndicatorAcrossCountries(def.id)))
  const out = new Map<string, { countries: number; latestYear: number }>()
  for (const file of files) {
    if (!file || file.values.length === 0) continue
    out.set(file.indicatorId, {
      countries: file.values.length,
      latestYear: Math.max(...file.values.map((v) => v.year)),
    })
  }
  return out
}

/** Evidence records for indicators with no dataset. Never scored. */
export async function loadEvidence(): Promise<EvidenceRecord[]> {
  const file = await readJson<{ records: EvidenceRecord[] }>(PATHS.evidence)
  return file?.records ?? []
}

/** Read the append-only public challenge ledger, ignoring malformed lines. */
export async function loadDisputes(): Promise<ChallengeRecordType[]> {
  let names: string[]
  try {
    names = (await readdir(PATHS.disputes)).filter((name) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(name))
  } catch {
    return []
  }

  const files = await Promise.all(
    names.sort().map(async (name) => {
      try {
        return await readFile(resolve(PATHS.disputes, name), 'utf8')
      } catch {
        return ''
      }
    }),
  )

  return files.flatMap((contents) =>
    contents
      .split('\n')
      .filter(Boolean)
      .flatMap((line) => {
        try {
          const parsed = ChallengeRecord.safeParse(JSON.parse(line))
          return parsed.success ? [parsed.data] : []
        } catch {
          return []
        }
      }),
  )
}

export async function loadDispute(id: string): Promise<DisputeRecord | null> {
  const record = (await loadDisputes()).find(
    (candidate): candidate is DisputeRecord =>
      candidate.kind === 'dispute' && candidate.id === id,
  )
  return record ?? null
}

/**
 * One country's explanatory institution network. This layer is versioned on
 * its own and never enters scores or confidence.
 */
export async function loadInstitutionNetwork(
  iso3: string,
): Promise<InstitutionNetworkFile | null> {
  const raw = await readJson<unknown>(PATHS.institutions(iso3))
  const parsed = InstitutionNetworkFile.safeParse(raw)
  return parsed.success ? parsed.data : null
}

/**
 * A file from the repository's docs directory, for pages that render an
 * internal document (the limits page). Resolved beside DATA_ROOT, so the same
 * candidates logic covers laptop and server layouts.
 */
export async function loadDoc(name: string): Promise<string | null> {
  try {
    return await readFile(resolve(DATA_ROOT, '../docs', name), 'utf8')
  } catch {
    return null
  }
}

export const MISSING_DATA_HINT =
  'No scored output yet. Run `pnpm bench all` in the repo root, then reload.'
