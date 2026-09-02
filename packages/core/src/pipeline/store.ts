import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { DelphiRunFile, EvidenceFile, ObservationFile } from '../model/schema.js'
import { GlobalInstitutionLedger, InstitutionNetworkFile } from '../model/institutions.js'
import type { InstitutionNetwork } from '../model/institutions.js'
import { attachGlobalInstitutions } from './institutions.js'
import type { EvidenceRecord, Observation } from '../model/schema.js'

import type {
  CountryResult,
  Dimension,
  IndicatorAcrossCountries,
} from '../model/index.js'
import { DELPHI_DIR, FILES, institutionFile } from './paths.js'

async function readJson(path: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return null
  }
}

/** All observations from the registered source files. */
export async function loadObservations(): Promise<Observation[]> {
  const out: Observation[] = []
  for (const path of [FILES.worldBank, FILES.jointEvsWvs, FILES.vdem, FILES.manual]) {
    const raw = await readJson(path)
    if (!raw) continue
    const parsed = ObservationFile.safeParse(raw)
    if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
    out.push(...parsed.data.observations)
  }
  return out
}

/**
 * Evidence records for indicators that have no dataset. Never scored, never
 * folded into confidence. See docs/DECISIONS.md D20.
 */
export async function loadEvidence(path = FILES.evidence): Promise<EvidenceRecord[]> {
  const raw = await readJson(path)
  if (!raw) return []
  const parsed = EvidenceFile.safeParse(raw)
  if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
  return parsed.data.records
}

/**
 * Load the optional country institution network for agenda cross-references.
 * A malformed network is an error rather than an empty map, so generated
 * agenda links cannot silently disappear behind a bad source file.
 */
export async function loadInstitutionNetwork(
  iso3: string,
  path = institutionFile(iso3),
): Promise<InstitutionNetworkFile | null> {
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw new Error(`Cannot read institutional network ${path}: ${String(error)}`)
  }
  const parsed = InstitutionNetworkFile.safeParse(raw)
  if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
  if (parsed.data.iso3 !== iso3.toUpperCase()) {
    throw new Error(`${path}: network country ${parsed.data.iso3} does not match ${iso3.toUpperCase()}`)
  }
  return parsed.data
}

/**
 * The global ledger. Missing is an empty ledger, because a country map is
 * complete without it; malformed is an error, for the same reason as above.
 */
export async function loadGlobalInstitutions(
  path = FILES.institutionsGlobal,
): Promise<GlobalInstitutionLedger | null> {
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw new Error(`Cannot read global institution ledger ${path}: ${String(error)}`)
  }
  const parsed = GlobalInstitutionLedger.safeParse(raw)
  if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
  return parsed.data
}

/**
 * One country's map with the global bodies it reaches attached: what every
 * rendering surface reads. The agenda reads the file alone, because its links
 * point at the institutions a country can act through. See D107.
 */
export async function loadAttachedInstitutionNetwork(
  iso3: string,
): Promise<InstitutionNetwork | null> {
  const network = await loadInstitutionNetwork(iso3)
  if (!network) return null
  return attachGlobalInstitutions(network, await loadGlobalInstitutions())
}

export async function loadDelphi(path = FILES.delphiLatest): Promise<DelphiRunFile | null> {
  const raw = await readJson(path)
  if (!raw) return null
  const parsed = DelphiRunFile.safeParse(raw)
  if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
  return parsed.data
}

export async function saveDelphi(
  run: DelphiRunFile,
  options: { activate?: boolean } = {},
): Promise<string> {
  const path = resolve(DELPHI_DIR, `${run.runId}.json`)
  await mkdir(DELPHI_DIR, { recursive: true })
  const body = `${JSON.stringify(run, null, 2)}\n`
  await writeFile(path, body)
  if (options.activate ?? true) await writeFile(FILES.delphiLatest, body)
  return path
}

export async function writeOut(path: string, body: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, body)
}

/** RFC 4180: CRLF line endings, quotes doubled, fields with commas, quotes or line breaks quoted. */
export function toCsv(rows: Array<Record<string, string | number | null>>): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0] as Record<string, unknown>)
  const escape = (v: string | number | null) => {
    if (v === null) return ''
    const s = String(v)
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return `${[
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h] ?? null)).join(',')),
  ].join('\r\n')}\r\n`
}

/**
 * Strip a country down to what a list needs: the nine scores, their confidence
 * and their trend headlines. The indicator rows and the yearly series stay in
 * the per-country file, because a grid of the current country set does not need them and they
 * are most of the weight. See D27.
 */
export function summarize(country: CountryResult): CountryResult {
  const dimensions = {} as CountryResult['dimensions']
  for (const [dimension, result] of Object.entries(country.dimensions)) {
    dimensions[dimension as Dimension] = {
      ...result,
      indicators: [],
      momentum: result.momentum.map((m) => ({ ...m, series: [] })),
    }
  }
  return { ...country, dimensions }
}

/**
 * Turn the scored countries inside out: one entry per indicator, holding every
 * country that has a value for it, ranked best first.
 *
 * The country files answer "what is in this country". This answers "where does
 * this number sit", which is the question a reader actually has when they see
 * 17.6 in a table. See D30.
 */
export function acrossCountries(countries: CountryResult[]): IndicatorAcrossCountries[] {
  const byIndicator = new Map<string, IndicatorAcrossCountries['values']>()

  for (const country of countries) {
    for (const dimension of Object.values(country.dimensions)) {
      for (const row of dimension.indicators) {
        /* An observed row always carries a year and a tier; a row missing either
         * is malformed and is skipped rather than given an invented value. */
        if (row.status !== 'observed' || row.raw === null || row.normalized === null) continue
        if (row.year === null || row.sourceTier === null) continue
        const list = byIndicator.get(row.indicatorId) ?? []
        list.push({
          iso3: country.iso3,
          country: country.country,
          raw: row.raw,
          normalized: row.normalized,
          year: row.year,
          tier: row.sourceTier,
          outOfFrame: row.outOfFrame,
        })
        byIndicator.set(row.indicatorId, list)
      }
    }
  }

  return [...byIndicator.entries()].map(([indicatorId, values]) => ({
    indicatorId,
    values: values.sort((a, b) => b.normalized - a.normalized),
  }))
}
