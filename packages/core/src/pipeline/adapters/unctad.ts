import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  COUNTRIES,
  UNCTAD_CONCENTRATION_CSV,
  UNCTAD_CONCENTRATION_CSV_SHA256,
  UNCTAD_CONCENTRATION_DATASET,
  UNCTAD_CONCENTRATION_RELEASE,
  UNCTAD_CONCENTRATION_URL,
  UNCTAD_CONCENTRATION_YEAR,
  UNCTAD_EXPORTS_FLOW,
  UNCTAD_LICENCE,
  UNCTAD_PUBLISHER,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import type { SourceAdapterResult } from './types.js'
import { parseCsvLine } from './csv.js'

/** Stable adapter id stored in source notes and handoffs. */
export const UNCTAD_EXPORT_CONCENTRATION_ADAPTER_ID = 'unctadstat-export-concentration'

/**
 * UN M49 numeric codes for the benchmark countries, as UNCTADstat writes them
 * in the `Economy` column. This is a join key for one publisher, not a second
 * country registry: `countries.ts` still decides who is benchmarked, and the
 * test fails if a benchmark country has no code here.
 */
export const UNCTAD_M49: Readonly<Record<string, string>> = {
  ARE: '784', ARG: '032', AUS: '036', BOL: '068', BRA: '076', CAN: '124',
  CHE: '756', CHL: '152', CHN: '156', COL: '170', CRI: '188', CUB: '192',
  DEU: '276', DOM: '214', ECU: '218', ESP: '724', EST: '233', ETH: '231',
  FIN: '246', FRA: '250', GBR: '826', GTM: '320', HND: '340', HTI: '332',
  IDN: '360', IND: '356', IRL: '372', ISR: '376', JPN: '392', KEN: '404',
  KOR: '410', MEX: '484', MYS: '458', NGA: '566', NIC: '558', NLD: '528',
  PAN: '591', PER: '604', PHL: '608', POL: '616', PRT: '620', PRY: '600',
  RWA: '646', SGP: '702', SLV: '222', SWE: '752', THA: '764', TUR: '792',
  URY: '858', USA: '840', VEN: '862', VNM: '704', ZAF: '710',
}

const REQUIRED = ['Year', 'Economy', 'Flow', 'Concentration Index', 'Concentration Index Footnote']

type CsvRow = Record<string, string>

function parseCsv(text: string): CsvRow[] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length < 2) throw new Error('UNCTAD CSV has no data rows')
  const headers = parseCsvLine(lines[0]!)
  for (const name of REQUIRED) {
    if (!headers.includes(name)) throw new Error(`UNCTAD CSV is missing ${name}`)
  }
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

export type UnctadExportConcentrationResult = SourceAdapterResult & {
  /** Benchmark countries whose pinned-year value carries UNCTAD's `Estimated` footnote. */
  estimatedCountries: string[]
}

/**
 * Parse the UNCTADstat concentration file into the observation shape.
 *
 * The value is the publisher's Concentration Index for exports (flow `02`), a
 * normalised Herfindahl-Hirschman index across SITC Rev.3 3-digit products,
 * stored as published: lower is more diversified, and the registry row says
 * `lower_better` rather than this adapter inverting it. Only the pinned year is
 * emitted, as with V-Dem. A country present in the file but without a value
 * for that year is held, never carried forward from an earlier year. UNCTAD's
 * footnote travels in the observation note, so an `Estimated` mirror value is
 * readable as one.
 */
export function parseUnctadExportConcentration(
  csv: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = UNCTAD_CONCENTRATION_URL,
): UnctadExportConcentrationResult {
  const byCode = new Map(Object.entries(UNCTAD_M49).map(([iso3, code]) => [code, iso3]))
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const available = new Set<string>()
  const observations: Observation[] = []
  const estimated: string[] = []

  for (const row of parseCsv(csv)) {
    if (row.Flow !== UNCTAD_EXPORTS_FLOW) continue
    const iso3 = byCode.get(row.Economy ?? '')
    if (!iso3 || !benchmark.has(iso3)) continue
    available.add(iso3)
    if (Number(row.Year) !== UNCTAD_CONCENTRATION_YEAR) continue
    const rawValue = (row['Concentration Index'] ?? '').trim()
    if (rawValue === '') continue
    const value = Number(rawValue)
    if (!Number.isFinite(value) || value < 0 || value > 1) continue
    const footnote = (row['Concentration Index Footnote'] ?? '').trim()
    if (/^Estimated/.test(footnote)) estimated.push(iso3)
    const products = (row['Number of products'] ?? '').trim()
    observations.push({
      indicatorId: 'export_diversification',
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value,
      year: UNCTAD_CONCENTRATION_YEAR,
      sourceTier: 'international_organization',
      sourceUrl,
      retrievedAt,
      note:
        `${UNCTAD_CONCENTRATION_DATASET} Concentration Index, exports; ${UNCTAD_PUBLISHER} bulk file ${UNCTAD_CONCENTRATION_RELEASE}; ` +
        `normalised HHI across SITC Rev.3 3-digit products${products ? ` (${products} products exported)` : ''}, 0-1, lower is more diversified; ` +
        (footnote ? `UNCTAD footnote: ${footnote}; ` : '') +
        `${UNCTAD_LICENCE}, source: UNCTAD Data Hub.`,
    })
  }

  observations.sort((a, b) => a.iso3.localeCompare(b.iso3))
  const emittedCountries = observations.map((observation) => observation.iso3)
  const emitted = new Set(emittedCountries)
  return {
    adapterId: UNCTAD_EXPORT_CONCENTRATION_ADAPTER_ID,
    observations,
    availableCountries: [...available].sort(),
    emittedCountries,
    heldCountries: [...available].filter((iso3) => !emitted.has(iso3)).sort(),
    unmappedLabels: [...benchmark].filter((iso3) => !(iso3 in UNCTAD_M49)).sort(),
    sourceUrl,
    release: UNCTAD_CONCENTRATION_RELEASE,
    estimatedCountries: estimated.sort(),
  }
}

/** Extract the one CSV from UNCTAD's 7z archive. `bsdtar` reads 7z and ships with macOS. */
async function extractCsv(archiveBytes: Uint8Array): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'ncb-unctad-'))
  const archive = join(directory, 'release.7z')
  await writeFile(archive, archiveBytes)
  try {
    return await new Promise((resolve, reject) => {
      const child: ChildProcessWithoutNullStreams = spawn('bsdtar', ['-xOf', archive, UNCTAD_CONCENTRATION_CSV])
      const stdout: Buffer[] = []
      const stderr: Buffer[] = []
      child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk))
      child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
      child.on('error', (error) => reject(new Error(`Cannot run bsdtar for UNCTAD: ${error.message}`)))
      child.on('close', (code) => {
        if (code === 0) {
          resolve(Buffer.concat(stdout).toString('utf8'))
        } else {
          reject(new Error(`bsdtar failed (${code}): ${Buffer.concat(stderr).toString('utf8').trim()}`))
        }
      })
      child.stdin.end()
    })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

/** Fetch the bulk file, check it is the pinned release, and parse it. */
export async function fetchUnctadExportConcentration(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<UnctadExportConcentrationResult> {
  const sourceUrl = opts.sourceUrl ?? UNCTAD_CONCENTRATION_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`UNCTAD: HTTP ${response.status}`)
  const csv = await extractCsv(new Uint8Array(await response.arrayBuffer()))
  const digest = createHash('sha256').update(csv, 'utf8').digest('hex')
  if (digest !== UNCTAD_CONCENTRATION_CSV_SHA256) {
    throw new Error(
      `UNCTAD: the bulk file no longer matches the pinned ${UNCTAD_CONCENTRATION_RELEASE} release (sha256 ${digest}). ` +
        'Review the new file, then update the pin in source-catalog.ts with a decision entry.',
    )
  }
  return parseUnctadExportConcentration(csv, opts.retrievedAt ?? new Date().toISOString(), sourceUrl)
}
