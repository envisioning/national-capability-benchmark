import { createHash } from 'node:crypto'
import {
  COUNTRIES,
  OECD_WDD_ADAPTER_ID,
  OECD_WDD_CSV_SHA256,
  OECD_WDD_DATASET,
  OECD_WDD_LICENCE,
  OECD_WDD_PUBLISHER,
  OECD_WDD_RELEASE,
  OECD_WDD_URL,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import { parseCsvLine } from './csv.js'
import type { SourceAdapterResult } from './types.js'

const REQUIRED = ['REF_AREA', 'MEASURE', 'UNIT_MEASURE', 'TIME_PERIOD', 'OBS_VALUE', 'OBS_STATUS']

/** OECD observation status codes that change how a value reads. */
const STATUS_NOTES: Record<string, string> = {
  B: 'time series break',
  D: 'definition differs',
}

/**
 * Parse the top 10% share of household net wealth. Every published year is
 * emitted as published, with no gate, because the row is a condition and is
 * never scored (D191). A country outside the registry is listed as unmapped.
 */
export function parseOecdWealthTop10(
  csv: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = OECD_WDD_URL,
): SourceAdapterResult {
  const lines = csv.replace(/^﻿/, '').split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length < 2) throw new Error('OECD WDD CSV has no data rows')
  const headers = parseCsvLine(lines[0]!)
  for (const name of REQUIRED) {
    if (!headers.includes(name)) throw new Error(`OECD WDD CSV is missing ${name}`)
  }
  const benchmark: Set<string> = new Set(COUNTRIES.map((country) => country.iso3))
  const observations: Observation[] = []
  const unmapped = new Set<string>()

  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line)
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
    if (row.MEASURE !== 'SH_TOP10' || row.UNIT_MEASURE !== 'PT_B90_S14') continue
    const raw = (row.OBS_VALUE ?? '').trim()
    const value = Number(raw)
    const year = Number(row.TIME_PERIOD)
    if (raw === '' || !Number.isInteger(year) || !Number.isFinite(value) || value < 0 || value > 100) continue
    const iso3 = row.REF_AREA ?? ''
    if (!benchmark.has(iso3)) {
      unmapped.add(iso3)
      continue
    }
    const status = STATUS_NOTES[row.OBS_STATUS ?? '']
    observations.push({
      indicatorId: 'wealth_share_top10',
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: Math.round(value * 10) / 10,
      year,
      sourceTier: 'international_organization',
      sourceUrl,
      retrievedAt,
      note:
        `${OECD_WDD_PUBLISHER}, ${OECD_WDD_DATASET}, retrieved ${OECD_WDD_RELEASE}; ` +
        'share of top 10% of households in household net wealth, excluding pensions; ' +
        (status ? `flagged by the OECD: ${status}; ` : '') +
        `${OECD_WDD_LICENCE}.`,
    })
  }

  observations.sort((a, b) => a.iso3.localeCompare(b.iso3) || a.year - b.year)
  const emitted = [...new Set(observations.map((observation) => observation.iso3))]
  return {
    adapterId: OECD_WDD_ADAPTER_ID,
    observations,
    availableCountries: emitted,
    emittedCountries: emitted,
    heldCountries: [],
    unmappedLabels: [...unmapped].sort(),
    sourceUrl,
    release: OECD_WDD_RELEASE,
  }
}

/** Fetch the pinned response, check it is the reviewed release, and parse it. */
export async function fetchOecdWealthTop10(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<SourceAdapterResult> {
  const sourceUrl = opts.sourceUrl ?? OECD_WDD_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`OECD WDD: HTTP ${response.status}`)
  const csv = await response.text()
  const digest = createHash('sha256').update(csv, 'utf8').digest('hex')
  if (digest !== OECD_WDD_CSV_SHA256) {
    throw new Error(
      `OECD WDD: the response no longer matches the pinned ${OECD_WDD_RELEASE} release (sha256 ${digest}). ` +
        'Review the new file, then update the pin in source-catalog.ts with a decision entry.',
    )
  }
  return parseOecdWealthTop10(csv, opts.retrievedAt ?? new Date().toISOString(), sourceUrl)
}
