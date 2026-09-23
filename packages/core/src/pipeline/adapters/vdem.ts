import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createInterface } from 'node:readline'
import {
  COUNTRIES,
  VDEM_CY_V15_CSV,
  VDEM_CY_V15_DATASET,
  VDEM_CY_V15_RELEASE,
  VDEM_CY_V15_URL,
  VDEM_CY_V15_VARIABLES,
  VDEM_CY_V15_YEAR,
  VDEM_PUBLISHER,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import type { SourceAdapterResult } from './types.js'

/** Stable adapter id stored in source notes and handoffs. */
export const VDEM_ADAPTER_ID = 'v-dem-cy-full-v15'

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

export type VdemResult = SourceAdapterResult & {
  /** Countries emitted per indicator, so a partial variable cannot hide behind a full one. */
  coverageByIndicator: Record<string, number>
}

/**
 * Accumulates the pinned release year from a stream of CSV lines. The
 * Full+Others file is about 400 MB, so rows are filtered as they arrive
 * instead of being held as one string.
 */
class VdemAccumulator {
  private headers: string[] | null = null
  private index: { iso3: number; year: number; variables: number[] } | null = null
  private readonly benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  private readonly yearText = String(VDEM_CY_V15_YEAR)
  readonly observations: Observation[] = []

  constructor(
    private readonly retrievedAt: string,
    private readonly sourceUrl: string,
  ) {}

  push(line: string): void {
    if (line.length === 0) return
    if (!this.headers) {
      this.headers = parseCsvLine(line)
      const find = (name: string) => {
        const at = this.headers!.indexOf(name)
        if (at < 0) throw new Error(`V-Dem CSV is missing ${name}`)
        return at
      }
      this.index = {
        iso3: find('country_text_id'),
        year: find('year'),
        variables: VDEM_CY_V15_VARIABLES.map((spec) => find(spec.variable)),
      }
      return
    }
    /* Cheap reject before a full parse: the release year must appear in the line. */
    if (!line.includes(this.yearText)) return
    const values = parseCsvLine(line)
    const index = this.index!
    const iso3 = values[index.iso3] ?? ''
    if (!this.benchmark.has(iso3) || Number(values[index.year]) !== VDEM_CY_V15_YEAR) return
    VDEM_CY_V15_VARIABLES.forEach((spec, i) => {
      const rawValue = values[index.variables[i]!] ?? ''
      if (rawValue.trim() === '') return
      const value = Number(rawValue)
      if (!Number.isFinite(value) || value < spec.min || value > spec.max) return
      this.observations.push({
        indicatorId: spec.indicatorId,
        iso3,
        geometry: 'national',
        reconciliation: 'context_only',
        value,
        year: VDEM_CY_V15_YEAR,
        sourceTier: 'expert_panel',
        sourceUrl: this.sourceUrl,
        retrievedAt: this.retrievedAt,
        note: `${spec.variable}; ${VDEM_PUBLISHER} ${VDEM_CY_V15_DATASET} v${VDEM_CY_V15_RELEASE}; ${spec.scaleNote}; CC BY-SA 4.0.`,
      })
    })
  }

  result(): VdemResult {
    if (!this.headers) throw new Error('V-Dem CSV has no header row')
    const observations = [...this.observations].sort(
      (a, b) => a.indicatorId.localeCompare(b.indicatorId) || a.iso3.localeCompare(b.iso3),
    )
    const countries = [...new Set(observations.map((o) => o.iso3))].sort()
    const coverageByIndicator = Object.fromEntries(
      VDEM_CY_V15_VARIABLES.map((spec) => [
        spec.indicatorId,
        observations.filter((o) => o.indicatorId === spec.indicatorId).length,
      ]),
    )
    return {
      adapterId: VDEM_ADAPTER_ID,
      observations,
      availableCountries: countries,
      emittedCountries: countries,
      heldCountries: [],
      unmappedLabels: [],
      sourceUrl: this.sourceUrl,
      release: VDEM_CY_V15_RELEASE,
      coverageByIndicator,
    }
  }
}

/**
 * Parse the pinned V-Dem country-year release into the existing observation
 * shape. Only the latest release year is emitted; the adapter deliberately
 * does not invent a time series from a source whose release is versioned.
 */
export function parseVdem(
  csv: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = VDEM_CY_V15_URL,
): VdemResult {
  const accumulator = new VdemAccumulator(retrievedAt, sourceUrl)
  for (const line of csv.split(/\r?\n/)) accumulator.push(line)
  return accumulator.result()
}

/** Stream the pinned CSV out of the archive and parse it line by line. */
async function parseZip(zip: Uint8Array, retrievedAt: string, sourceUrl: string): Promise<VdemResult> {
  const directory = await mkdtemp(join(tmpdir(), 'ncb-vdem-'))
  const archive = join(directory, 'release.zip')
  await writeFile(archive, zip)
  try {
    const child = spawn('unzip', ['-p', archive, VDEM_CY_V15_CSV])
    const stderr: Buffer[] = []
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
    const exited = new Promise<number | null>((resolve, reject) => {
      child.on('error', (error) => reject(new Error(`Cannot run unzip for V-Dem: ${error.message}`)))
      child.on('close', (code) => resolve(code))
    })
    child.stdin.end()
    const accumulator = new VdemAccumulator(retrievedAt, sourceUrl)
    const lines = createInterface({ input: child.stdout, crlfDelay: Infinity })
    for await (const line of lines) accumulator.push(line)
    const code = await exited
    if (code !== 0) {
      throw new Error(`unzip failed (${code}): ${Buffer.concat(stderr).toString('utf8').trim()}`)
    }
    return accumulator.result()
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

/** Fetch and parse the pinned public V-Dem release. */
export async function fetchVdem(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<VdemResult> {
  const sourceUrl = opts.sourceUrl ?? VDEM_CY_V15_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`V-Dem: HTTP ${response.status}`)
  return parseZip(
    new Uint8Array(await response.arrayBuffer()),
    opts.retrievedAt ?? new Date().toISOString(),
    sourceUrl,
  )
}
