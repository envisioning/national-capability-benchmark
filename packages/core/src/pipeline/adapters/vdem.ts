import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createInterface } from 'node:readline'
import {
  CHECK_PREFIX,
  COUNTRIES,
  VDEM_CY_V15_CSV,
  VDEM_CY_V15_DATASET,
  VDEM_CY_V15_RELEASE,
  VDEM_CY_V15_URL,
  VDEM_CY_V15_YEAR,
  VDEM_PUBLISHER,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import type { SourceAdapterResult } from './types.js'

/** Stable adapter id stored in source notes and handoffs. */
export const VDEM_ADAPTER_ID = 'v-dem-cy-full-v15'

/**
 * The V-Dem variables the adapter reads, each with the observation id it fills
 * and the scale the publisher states. A value outside the scale is dropped,
 * never clamped.
 *
 * An id under `CHECK_PREFIX` is a behavioural check from `checks.ts`: it is
 * stored beside the indicators and never enters a frame, a mean or a
 * confidence. Polarization and voter turnout are checks and not scored rows.
 * See D60, D121 and D129. Compliance with the courts is a scored Trust row
 * (D131).
 *
 * `years` says which country-year a variable is read from. `release_year`
 * reads the pinned release year and nothing else. `latest_election` exists
 * because V-Dem codes election variables in election years only, so a single
 * pinned year would leave most of the frame blank: it reads each country's most
 * recent row up to the release year that carries a value, records that row's
 * year on the observation, and never falls back to an earlier election when the
 * latest one is unreadable. `context` names variables read from that same
 * country-year and written into the observation note, never as values.
 */
export const VDEM_CY_V15_VARIABLES = [
  {
    variable: 'v2x_cspart',
    indicatorId: 'civil_society_strength',
    min: 0,
    max: 1,
    scaleNote: 'expert-coded index on a 0-1 scale',
    years: 'release_year',
    context: [],
  },
  {
    variable: 'v2cacamps_osp',
    indicatorId: `${CHECK_PREFIX}political_polarization`,
    min: 0,
    max: 4,
    scaleNote: 'expert-coded polarization on the original 0-4 response scale, 0 friendly and 4 hostile',
    years: 'release_year',
    context: [],
  },
  {
    variable: 'v2eltrnout',
    indicatorId: `${CHECK_PREFIX}voter_turnout`,
    min: 0,
    max: 100,
    scaleNote:
      'percent of registered voters who cast a vote in the national election, official results; where executive and legislative elections fall on one day V-Dem codes the executive turnout, and the country-year takes the maximum',
    years: 'latest_election',
    context: ['v2elcomvot', 'v2x_regime'],
  },
  {
    variable: 'v2jucomp_osp',
    indicatorId: 'court_compliance',
    min: 0,
    max: 4,
    scaleNote:
      'expert-coded frequency with which the government complies with important decisions of courts other than the high court that it disagrees with, on the original 0-4 response scale, 0 never and 4 always',
    years: 'release_year',
    context: [],
  },
] as const satisfies ReadonlyArray<{
  variable: string
  indicatorId: string
  min: number
  max: number
  scaleNote: string
  years: 'release_year' | 'latest_election'
  context: readonly string[]
}>

/** Codebook 3.1.2.3 response labels for compulsory voting. */
const COMPULSORY_VOTING: Record<string, string> = {
  '0': 'not compulsory',
  '1': 'compulsory, no sanctions or sanctions not enforced',
  '2': 'compulsory, sanctions enforced at minimal cost',
  '3': 'compulsory, sanctions enforced at considerable cost',
}

/** Codebook 5.1.1 response labels for Regimes of the World. */
const REGIME: Record<string, string> = {
  '0': 'closed autocracy',
  '1': 'electoral autocracy',
  '2': 'electoral democracy',
  '3': 'liberal democracy',
}

/** Render one context variable for an observation note. */
function contextNote(variable: string, raw: string): string {
  const code = raw.trim()
  if (code === '') return `${variable} not coded`
  const label = variable === 'v2elcomvot' ? COMPULSORY_VOTING[code] : variable === 'v2x_regime' ? REGIME[code] : undefined
  return label ? `${variable} ${code} (${label})` : `${variable} ${code}`
}

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

/** The first `count` fields of a row, enough to read the country and year cheaply. */
function parseCsvPrefix(line: string, count: number): string[] {
  const fields: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length && fields.length < count; i += 1) {
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
  if (fields.length < count) fields.push(field)
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
  private index: {
    iso3: number
    year: number
    prefix: number
    variables: number[]
    context: number[][]
  } | null = null
  private readonly benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  private readonly anyLatest = VDEM_CY_V15_VARIABLES.some((spec) => spec.years === 'latest_election')
  /** Per latest-election variable, the newest coded row per country so far. */
  private readonly latest: Array<Map<string, { year: number; raw: string; context: string[] }>> =
    VDEM_CY_V15_VARIABLES.map(() => new Map())
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
      const iso3 = find('country_text_id')
      const year = find('year')
      this.index = {
        iso3,
        year,
        prefix: Math.max(iso3, year) + 1,
        variables: VDEM_CY_V15_VARIABLES.map((spec) => find(spec.variable)),
        context: VDEM_CY_V15_VARIABLES.map((spec) => spec.context.map((name) => find(name))),
      }
      return
    }
    const index = this.index!
    /* Cheap reject before a full parse: read only the leading fields. */
    const head = parseCsvPrefix(line, index.prefix)
    const iso3 = head[index.iso3] ?? ''
    const year = Number(head[index.year])
    if (!this.benchmark.has(iso3) || !Number.isInteger(year) || year > VDEM_CY_V15_YEAR) return
    if (year !== VDEM_CY_V15_YEAR && !this.anyLatest) return
    const values = parseCsvLine(line)
    VDEM_CY_V15_VARIABLES.forEach((spec, i) => {
      const rawValue = values[index.variables[i]!] ?? ''
      if (spec.years === 'latest_election') {
        if (rawValue.trim() === '') return
        const seen = this.latest[i]!.get(iso3)
        if (seen && seen.year >= year) return
        this.latest[i]!.set(iso3, {
          year,
          raw: rawValue,
          context: index.context[i]!.map((at, k) => contextNote(spec.context[k]!, values[at] ?? '')),
        })
        return
      }
      if (year !== VDEM_CY_V15_YEAR) return
      this.emit(spec, iso3, rawValue, VDEM_CY_V15_YEAR, [])
    })
  }

  private emit(
    spec: (typeof VDEM_CY_V15_VARIABLES)[number],
    iso3: string,
    rawValue: string,
    year: number,
    context: string[],
  ): void {
    if (rawValue.trim() === '') return
    const value = Number(rawValue)
    if (!Number.isFinite(value) || value < spec.min || value > spec.max) return
    const yearNote =
      spec.years === 'latest_election' ? ` election year ${year}, the latest coded up to ${VDEM_CY_V15_YEAR};` : ''
    const contextText = context.length ? ` ${context.join('; ')};` : ''
    this.observations.push({
      indicatorId: spec.indicatorId,
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value,
      year,
      sourceTier: 'expert_panel',
      sourceUrl: this.sourceUrl,
      retrievedAt: this.retrievedAt,
      note: `${spec.variable}; ${VDEM_PUBLISHER} ${VDEM_CY_V15_DATASET} v${VDEM_CY_V15_RELEASE}; ${spec.scaleNote};${yearNote}${contextText} CC BY-SA 4.0.`,
    })
  }

  result(): VdemResult {
    if (!this.headers) throw new Error('V-Dem CSV has no header row')
    /* The newest coded election is the reading; an out-of-scale value there
     * drops the country rather than reaching back to an older election. */
    VDEM_CY_V15_VARIABLES.forEach((spec, i) => {
      for (const [iso3, row] of this.latest[i]!) this.emit(spec, iso3, row.raw, row.year, row.context)
    })
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
 * shape. One value per country and variable is emitted: the release year, or
 * for an election variable the latest election up to it. The adapter
 * deliberately does not invent a time series from a source whose release is
 * versioned.
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
