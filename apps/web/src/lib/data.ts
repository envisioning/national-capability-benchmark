import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import {
  ChallengeRecord,
  CorroborationFile as CorroborationFileSchema,
  DelphiRunFile as DelphiRunFileSchema,
  INDICATORS,
  InstitutionNetworkFile,
  isScored,
  LeverageFile as LeverageFileSchema,
  ResidualFile as ResidualFileSchema,
  VelocityFile as VelocityFileSchema,
} from '@ncb/core'
import { DATA_DIR } from '@ncb/core/node'
import type {
  CountryResult,
  InstitutionExplorerFeed,
  Lang,
  ChallengeRecord as ChallengeRecordType,
  CorroborationFile,
  DelphiRunFile,
  Diagnostics,
  EvidenceRecord,
  IndicatorAcrossCountries,
  DisputeRecord,
  LeverageFile,
  ResidualFile,
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
  institutionExplorer: (iso3: string, lang: string) =>
    resolve(DATA_ROOT, 'out/institutions', `${iso3.toUpperCase()}.${lang}.json`),
  corroboration: (indicatorId: string) =>
    resolve(DATA_ROOT, 'out/br-subnational', `${indicatorId}.json`),
  velocity: resolve(DATA_ROOT, 'out/velocity.json'),
  leverage: resolve(DATA_ROOT, 'out/leverage.json'),
  residual: resolve(DATA_ROOT, 'out/residual.json'),
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

/** The provisional leverage fixture, validated before the sandbox reads it. */
export async function loadLeverage(): Promise<LeverageFile | null> {
  const raw = await readJson<unknown>(PATHS.leverage)
  const parsed = LeverageFileSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

/** The provisional wealth-residual fixture, validated before the sandbox reads it. */
export async function loadResidual(): Promise<ResidualFile | null> {
  const raw = await readJson<unknown>(PATHS.residual)
  const parsed = ResidualFileSchema.safeParse(raw)
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
): Promise<InstitutionNetworkLoad> {
  const code = iso3.toUpperCase()
  const path = PATHS.institutions(code)
  const label = `data/institutions/${code}.json`

  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : undefined
    return {
      network: null,
      error: {
        kind: code === 'ENOENT' ? 'missing' : 'read',
        message:
          code === 'ENOENT'
            ? `${label} was not found.`
            : `${label} could not be read.`,
      },
    }
  }

  let raw: unknown
  try {
    raw = JSON.parse(text) as unknown
  } catch (error) {
    return {
      network: null,
      error: {
        kind: 'invalid_json',
        message: `${label} is not valid JSON${error instanceof Error ? `: ${error.message}` : '.'}`,
      },
    }
  }

  const parsed = InstitutionNetworkFile.safeParse(raw)
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 3).map((issue) => {
      const location = issue.path.length ? issue.path.join('.') : 'root'
      return `${location}: ${issue.message}`
    })
    const more = parsed.error.issues.length > issues.length
      ? ` ${parsed.error.issues.length - issues.length} more validation error(s).`
      : ''
    return {
      network: null,
      error: {
        kind: 'invalid_schema',
        message: `${label} failed validation. ${issues.join(' ')}${more}`,
      },
    }
  }

  return { network: parsed.data, error: null }
}

export type InstitutionNetworkError = {
  kind: 'missing' | 'read' | 'invalid_json' | 'invalid_schema'
  message: string
}

export type InstitutionNetworkLoad =
  | { network: InstitutionNetworkFile; error: null }
  | { network: null; error: InstitutionNetworkError }

/**
 * One subnational corroboration fixture, kept outside the national score
 * files. The file is keyed by indicator because v1 has one Brazil fixture, and
 * the parsed country check prevents a future indicator from being shown on the
 * wrong destination page.
 */
/**
 * One country's institution map, projected for an external explorer.
 *
 * Written by `pnpm bench institutions`, one file per lexicon. The viewer
 * serves it and never renders it: the drawn network lives outside this
 * repository, because the library that draws it is closed source and this
 * repository is public. See D82.
 */
export async function loadInstitutionExplorer(
  iso3: string,
  lang: Lang,
): Promise<InstitutionExplorerFeed | null> {
  return readJson<InstitutionExplorerFeed>(PATHS.institutionExplorer(iso3, lang))
}

export async function loadCorroboration(
  iso3: string,
  indicatorId: string,
): Promise<CorroborationFile | null> {
  const raw = await readJson<unknown>(PATHS.corroboration(indicatorId))
  const parsed = CorroborationFileSchema.safeParse(raw)
  if (!parsed.success || parsed.data.iso3 !== iso3.toUpperCase()) return null
  return parsed.data
}

/** The constituent-unit rows from a corroboration fixture. */
export async function loadSubnationalIndicator(
  iso3: string,
  indicatorId: string,
): Promise<CorroborationFile['states']> {
  const file = await loadCorroboration(iso3, indicatorId)
  return file?.states ?? []
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
