import { createHash } from 'node:crypto'
import {
  COUNTRIES,
  OECD_GRS_CSV_SHA256,
  OECD_GRS_DATASET,
  OECD_GRS_LICENCE,
  OECD_GRS_PUBLISHER,
  OECD_GRS_RELEASE,
  OECD_GRS_URL,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import { isTooOldToScore } from '../confidence.js'
import type { SourceAdapterResult } from './types.js'
import { parseCsvLine } from './csv.js'

/** Stable adapter id stored in source notes and handoffs. */
export const OECD_GRS_ADAPTER_ID = 'oecd-grs-tax-revenue-fill'

const REQUIRED = ['REF_AREA', 'MEASURE', 'SECTOR', 'STANDARD_REVENUE', 'UNIT_MEASURE', 'TIME_PERIOD', 'OBS_VALUE']

type CsvRow = Record<string, string>

function parseCsv(text: string): CsvRow[] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length < 2) throw new Error('OECD GRS CSV has no data rows')
  const headers = parseCsvLine(lines[0]!)
  for (const name of REQUIRED) {
    if (!headers.includes(name)) throw new Error(`OECD GRS CSV is missing ${name}`)
  }
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

export type OecdGrsFillResult = SourceAdapterResult & {
  /** Benchmark countries the World Bank already serves inside the D159 window: GRS is not read for them. */
  servedByWorldBank: string[]
  /** Filled years where GRS reports no social security line at central level, so the total stands as published. */
  noSocialSecurityLine: string[]
}

/**
 * Parse the GRS central government file into fill observations for
 * `tax_revenue_gdp`.
 *
 * The value is central government (`S1311`) tax revenue less social security
 * contributions (`T_2000`), as a share of GDP, which is the World Bank
 * definition of `GC.TAX.TOTL.GD.ZS`. A country is filled only when its latest
 * World Bank value is missing or too old to score at `referenceYear` (D159),
 * and only with the years after that value, so one country's series never
 * holds the same year from two publishers. Where GRS has no `T_2000` line for
 * a year, the central total stands, and the note says so.
 */
export function parseOecdGrsFill(
  csv: string,
  worldBankLatestYear: ReadonlyMap<string, number>,
  referenceYear: number,
  retrievedAt = new Date().toISOString(),
  sourceUrl = OECD_GRS_URL,
): OecdGrsFillResult {
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const totals = new Map<string, { total?: number; ssc?: number }>()
  const available = new Set<string>()

  for (const row of parseCsv(csv)) {
    if (row.MEASURE !== 'TAX_REV' || row.SECTOR !== 'S1311' || row.UNIT_MEASURE !== 'PT_B1GQ') continue
    const iso3 = row.REF_AREA ?? ''
    if (!benchmark.has(iso3)) continue
    const raw = (row.OBS_VALUE ?? '').trim()
    if (raw === '') continue
    const value = Number(raw)
    if (!Number.isFinite(value)) continue
    const key = `${iso3}|${row.TIME_PERIOD}`
    const cell = totals.get(key) ?? {}
    if (row.STANDARD_REVENUE === '_T') cell.total = value
    else if (row.STANDARD_REVENUE === 'T_2000') cell.ssc = value
    else continue
    totals.set(key, cell)
    available.add(iso3)
  }

  const served = [...benchmark].filter((iso3) => {
    const year = worldBankLatestYear.get(iso3)
    return year !== undefined && !isTooOldToScore(year, referenceYear)
  })
  const servedSet = new Set(served)
  const observations: Observation[] = []
  const noSsc: string[] = []

  for (const [key, cell] of totals) {
    const [iso3, period] = key.split('|') as [string, string]
    if (servedSet.has(iso3) || cell.total === undefined) continue
    const year = Number(period)
    const lastWorldBank = worldBankLatestYear.get(iso3)
    if (lastWorldBank !== undefined && year <= lastWorldBank) continue
    if (isTooOldToScore(year, referenceYear)) continue
    const value = cell.total - (cell.ssc ?? 0)
    if (value <= 0) continue
    if (cell.ssc === undefined) noSsc.push(`${iso3} ${year}`)
    observations.push({
      indicatorId: 'tax_revenue_gdp',
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: Math.round(value * 1000) / 1000,
      year,
      sourceTier: 'international_organization',
      sourceUrl,
      retrievedAt,
      note:
        `${OECD_GRS_PUBLISHER}, ${OECD_GRS_DATASET}, retrieved ${OECD_GRS_RELEASE}; ` +
        'central government tax revenue less social security contributions, % of GDP; ' +
        (cell.ssc === undefined ? 'no social security line at central level, total as published; ' : '') +
        `fill for a country with no World Bank value inside the scoring window (D172); ${OECD_GRS_LICENCE}.`,
    })
  }

  observations.sort((a, b) => a.iso3.localeCompare(b.iso3) || a.year - b.year)
  const emitted = [...new Set(observations.map((observation) => observation.iso3))]
  const emittedSet = new Set(emitted)
  return {
    adapterId: OECD_GRS_ADAPTER_ID,
    observations,
    availableCountries: [...available].sort(),
    emittedCountries: emitted,
    heldCountries: [...available].filter((iso3) => !servedSet.has(iso3) && !emittedSet.has(iso3)).sort(),
    unmappedLabels: [],
    sourceUrl,
    release: OECD_GRS_RELEASE,
    servedByWorldBank: served.sort(),
    noSocialSecurityLine: noSsc.sort(),
  }
}

/** Fetch the pinned response, check it is the reviewed release, and parse it. */
export async function fetchOecdGrsFill(opts: {
  worldBankLatestYear: ReadonlyMap<string, number>
  referenceYear: number
  sourceUrl?: string
  retrievedAt?: string
}): Promise<OecdGrsFillResult> {
  const sourceUrl = opts.sourceUrl ?? OECD_GRS_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`OECD GRS: HTTP ${response.status}`)
  const csv = await response.text()
  const digest = createHash('sha256').update(csv, 'utf8').digest('hex')
  if (digest !== OECD_GRS_CSV_SHA256) {
    throw new Error(
      `OECD GRS: the response no longer matches the pinned ${OECD_GRS_RELEASE} release (sha256 ${digest}). ` +
        'Review the new file, then update the pin in source-catalog.ts with a decision entry.',
    )
  }
  return parseOecdGrsFill(
    csv,
    opts.worldBankLatestYear,
    opts.referenceYear,
    opts.retrievedAt ?? new Date().toISOString(),
    sourceUrl,
  )
}
