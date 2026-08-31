import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { mkdtemp, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  COUNTRIES,
  VDEM_CY_CORE_V15_RELEASE,
  VDEM_CY_CORE_V15_URL,
  VDEM_CY_CORE_V15_VARIABLE,
  VDEM_CY_CORE_V15_YEAR,
  VDEM_PUBLISHER,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import type { SourceAdapterResult } from './types.js'

/** Stable adapter id stored in source notes and handoffs. */
export const VDEM_CIVIL_SOCIETY_ADAPTER_ID = 'v-dem-cy-core-v15-civil-society'

type CsvRow = Record<string, string>

/** Parse one RFC 4180 row without adding a runtime dependency for one source. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"' && field.length === 0) {
      quoted = true
    } else if (char === ',') {
      fields.push(field)
      field = ''
    } else {
      field += char
    }
  }
  fields.push(field)
  return fields
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length < 2) throw new Error('V-Dem CSV has no data rows')
  const headers = parseCsvLine(lines[0]!)
  const required = ['country_text_id', 'year', VDEM_CY_CORE_V15_VARIABLE]
  for (const name of required) {
    if (!headers.includes(name)) throw new Error(`V-Dem CSV is missing ${name}`)
  }
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

export type VdemCivilSocietyResult = SourceAdapterResult

/**
 * Parse the pinned V-Dem country-year release into the existing observation
 * shape. Only the latest release year is emitted; the adapter deliberately
 * does not invent a time series from a source whose release is versioned.
 */
export function parseVdemCivilSociety(
  csv: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = VDEM_CY_CORE_V15_URL,
): VdemCivilSocietyResult {
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const rows = parseCsv(csv)
  const available = new Set<string>()
  const observations: Observation[] = []

  for (const row of rows) {
    const iso3 = row.country_text_id ?? ''
    if (!benchmark.has(iso3) || Number(row.year) !== VDEM_CY_CORE_V15_YEAR) continue
    const rawValue = row[VDEM_CY_CORE_V15_VARIABLE] ?? ''
    if (rawValue.trim() === '') continue
    const value = Number(rawValue)
    if (!Number.isFinite(value) || value < 0 || value > 1) continue
    available.add(iso3)
    observations.push({
      indicatorId: 'civil_society_strength',
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value,
      year: VDEM_CY_CORE_V15_YEAR,
      sourceTier: 'expert_panel',
      sourceUrl,
      retrievedAt,
      note: `${VDEM_CY_CORE_V15_VARIABLE}; ${VDEM_PUBLISHER} Country-Year Core v${VDEM_CY_CORE_V15_RELEASE}; expert-coded index on a 0-1 scale; CC BY-SA 4.0.`,
    })
  }

  observations.sort((a, b) => a.iso3.localeCompare(b.iso3))
  const emittedCountries = observations.map((observation) => observation.iso3)
  return {
    adapterId: VDEM_CIVIL_SOCIETY_ADAPTER_ID,
    observations,
    availableCountries: [...available].sort(),
    emittedCountries,
    heldCountries: [],
    unmappedLabels: [],
    sourceUrl,
    release: VDEM_CY_CORE_V15_RELEASE,
  }
}

async function unzipCsv(zip: Uint8Array): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'ncb-vdem-'))
  const archive = join(directory, 'release.zip')
  await writeFile(archive, zip)
  try {
    return await new Promise((resolve, reject) => {
    const child: ChildProcessWithoutNullStreams = spawn('unzip', [
      '-p',
      archive,
      'V-Dem-CY-Core-v15.csv',
    ])
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
    child.on('error', (error) => reject(new Error(`Cannot run unzip for V-Dem: ${error.message}`)))
    child.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf8'))
      } else {
        reject(new Error(`unzip failed (${code}): ${Buffer.concat(stderr).toString('utf8').trim()}`))
      }
    })
    child.stdin.end()
    })
  } finally {
    await unlink(archive).catch(() => undefined)
    await unlink(directory).catch(() => undefined)
  }
}

/** Fetch and parse the pinned public V-Dem release. */
export async function fetchVdemCivilSociety(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<VdemCivilSocietyResult> {
  const sourceUrl = opts.sourceUrl ?? VDEM_CY_CORE_V15_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`V-Dem: HTTP ${response.status}`)
  const csv = await unzipCsv(new Uint8Array(await response.arrayBuffer()))
  return parseVdemCivilSociety(csv, opts.retrievedAt ?? new Date().toISOString(), sourceUrl)
}
