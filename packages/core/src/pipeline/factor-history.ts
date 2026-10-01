import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { DIMENSIONS, GDP_PER_CAPITA_CODE } from '../model/index.js'
import type {
  Dimension,
  FactorHistoryFile,
  FactorHistoryRelease,
  FactorStructure,
  Observation,
} from '../model/index.js'
import { factorStructureFor, headlineFactor, logGdpByCountry } from './diagnostics.js'
import { ROOT } from './paths.js'

/*
 * The factor test at every dataset release whose output was committed.
 *
 * A past release's numbers are whatever its data/out/index.json held at the
 * last commit that carried that version, so this reads git rather than
 * rescoring old observations under today's code: a rescore would answer what
 * the current model makes of old data, and the question is what each release
 * published. Only versions with a `Dataset X.Y.Z` changelog heading count.
 * The current release is not read from git but passed in from the diagnostics
 * just computed, so the file never trails the working tree. See D137.
 */

const INDEX_PATH = 'data/out/index.json'
const DIAGNOSTICS_PATH = 'data/out/diagnostics.json'
const WORLD_BANK_PATH = 'data/observations/worldbank.json'

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
}

function compareVersions(a: string, b: string): number {
  const x = a.split('.').map(Number)
  const y = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return (x[i] ?? 0) - (y[i] ?? 0)
  return 0
}

type IndexShape = {
  version?: string
  countries: Array<{ iso3: string; dimensions: Record<string, { score: number | null } | undefined> }>
}

function rowFor(
  version: string,
  commit: string | null,
  date: string,
  fs: FactorStructure,
): FactorHistoryRelease | null {
  const head = headlineFactor(fs)
  if (!head) return null
  const s = head.solution
  return {
    version,
    commit,
    date,
    basis: head.basis,
    dimensions: s.dimensions,
    countries: s.countries,
    firstFactorShare: s.firstFactorShare,
    chance: s.chance,
    income: s.income,
  }
}

/** Dataset versions the changelog announces. */
async function announcedDatasetVersions(): Promise<Set<string>> {
  const changelog = await readFile(resolve(ROOT, 'CHANGELOG.md'), 'utf8')
  return new Set(
    [...changelog.matchAll(/^##\s+Dataset\s+v?(\d+\.\d+\.\d+)\s/gm)].map((m) => m[1] as string),
  )
}

/**
 * Build the history. Returns null when git is not available, so a checkout
 * without history keeps the committed file instead of overwriting it with
 * one row.
 */
export async function buildFactorHistory(
  current: { version: string; date: string; factorStructure: FactorStructure },
): Promise<FactorHistoryFile | null> {
  let log: string
  try {
    log = git(['log', '--format=%H%x09%h%x09%ad', '--date=short', '--', INDEX_PATH])
  } catch {
    return null
  }
  const announced = await announcedDatasetVersions()
  const seen = new Set<string>([current.version])
  const releases: FactorHistoryRelease[] = []

  /* Newest first, so the first commit seen for a version is the last one
   * that carried it: the numbers that release ended on. */
  for (const line of log.trim().split('\n')) {
    const [sha, short, date] = line.split('\t') as [string, string, string]
    let index: IndexShape
    try {
      index = JSON.parse(git(['show', `${sha}:${INDEX_PATH}`])) as IndexShape
    } catch {
      continue
    }
    const version = index.version
    if (!version || seen.has(version) || !announced.has(version)) continue
    seen.add(version)

    const scores = new Map<string, Partial<Record<Dimension, number | null>>>(
      index.countries.map((c) => [
        c.iso3,
        Object.fromEntries(DIMENSIONS.map((d) => [d, c.dimensions[d]?.score ?? null])),
      ]),
    )
    /* Income as that release read it: the same commit's diagnostics carry it
     * from D130 on, and before that the World Bank file at the commit holds
     * the context series the diagnostics read, latest year per country. */
    let gdp = new Map<string, number>()
    try {
      const diag = JSON.parse(git(['show', `${sha}:${DIAGNOSTICS_PATH}`])) as {
        income?: Array<{ iso3: string; gdpPerCapita: number }>
      }
      for (const row of diag.income ?? []) {
        if (row.gdpPerCapita > 0) gdp.set(row.iso3, Math.log10(row.gdpPerCapita))
      }
    } catch {
      /* No diagnostics at that commit. */
    }
    if (gdp.size === 0) {
      try {
        const wb = JSON.parse(git(['show', `${sha}:${WORLD_BANK_PATH}`])) as {
          observations: Observation[]
        }
        gdp = logGdpByCountry(
          wb.observations.filter((o) => o.value > 0),
          GDP_PER_CAPITA_CODE,
        )
      } catch {
        /* No income at that commit: the row publishes the share alone. */
      }
    }
    const row = rowFor(version, short, date, factorStructureFor(scores, gdp))
    if (row) releases.push(row)
  }

  const now = rowFor(current.version, null, current.date, current.factorStructure)
  if (now) releases.push(now)
  releases.sort((a, b) => compareVersions(a.version, b.version))
  return { generatedAt: new Date().toISOString(), releases }
}
