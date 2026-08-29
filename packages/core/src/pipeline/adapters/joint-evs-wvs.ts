import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { COUNTRIES } from '../../model/countries.js'
import {
  JOINT_EVS_WVS_PUBLISHER,
  JOINT_EVS_WVS_RELEASE_YEAR,
  JOINT_EVS_WVS_RESULTS_URL,
} from '../../model/source-catalog.js'
import type { Observation } from '../../model/schema.js'
import type { SourceAdapterResult } from './types.js'

/** Stable adapter id stored on the registry row. */
export const JOINT_EVS_WVS_ADAPTER_ID = 'joint-evs-wvs-results-pdf'

/** The item used for generalised interpersonal trust in the joint data file. */
export const JOINT_EVS_WVS_TRUST_VARIABLE = 'A165'

type PublishedRow = {
  label: string
  sampleSize: number
  trustedPercent: number
}

export type JointEvsWvsTrustResult = SourceAdapterResult

type Country = (typeof COUNTRIES)[number]

/** Source labels that do not use the project's canonical country name. */
const SOURCE_COUNTRY_ALIASES: Record<string, Country['iso3']> = {
  'Great Britain': 'GBR',
}

function sourceLabelToIso3(label: string): string | null {
  const base = label.replace(/\s+(?:EVS|WVS)$/, '')
  const alias = SOURCE_COUNTRY_ALIASES[base]
  if (alias) return alias
  return COUNTRIES.find((country) => country.name === base)?.iso3 ?? null
}

/**
 * Parse the A165 table from the publisher's fixed-width results PDF text.
 *
 * The PDF is an official aggregate table weighted by `gwght`, so this adapter
 * preserves the published percentage rather than reconstructing it from
 * respondent records. Countries with both EVS and WVS rows are held until a
 * pooled microdata rule can use both samples' weights without guessing.
 */
export function parseJointEvsWvsA165(
  text: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = JOINT_EVS_WVS_RESULTS_URL,
): JointEvsWvsTrustResult {
  const marker = `${JOINT_EVS_WVS_TRUST_VARIABLE}- Most people can be trusted`
  const start = text.indexOf(marker)
  if (start < 0) throw new Error(`Joint EVS/WVS results do not contain ${JOINT_EVS_WVS_TRUST_VARIABLE}`)

  const afterMarker = text.slice(start + marker.length)
  const end = afterMarker.indexOf('\nTOTAL')
  if (end < 0) throw new Error('Joint EVS/WVS A165 table has no total row')

  const section = afterMarker.slice(0, end)
  const rowPattern = /^(.+?)\s{2,}([\d,]+)\s+([0-9]+(?:\.[0-9]+)?)\s+[0-9]+(?:\.[0-9]+)?(?:\s|$)/gm
  const rows: PublishedRow[] = []
  for (const match of section.matchAll(rowPattern)) {
    const label = match[1]?.trim()
    const sampleSize = Number(match[2]?.replace(/,/g, ''))
    const trustedPercent = Number(match[3])
    if (!label || !Number.isFinite(sampleSize) || !Number.isFinite(trustedPercent)) continue
    rows.push({ label, sampleSize, trustedPercent })
  }
  if (rows.length === 0) throw new Error('Joint EVS/WVS A165 table has no country rows')

  const byCountry = new Map<string, PublishedRow[]>()
  const unmappedLabels: string[] = []
  for (const row of rows) {
    const iso3 = sourceLabelToIso3(row.label)
    if (!iso3) {
      unmappedLabels.push(row.label)
      continue
    }
    const list = byCountry.get(iso3) ?? []
    list.push(row)
    byCountry.set(iso3, list)
  }

  const heldDuplicateCountries = [...byCountry.entries()]
    .filter(([, countryRows]) => countryRows.length > 1)
    .map(([iso3]) => iso3)
    .sort()
  const emitted = [...byCountry.entries()]
    .filter(([, countryRows]) => countryRows.length === 1)
    .sort(([a], [b]) => a.localeCompare(b))

  const note = (sampleSize: number) =>
    `${JOINT_EVS_WVS_TRUST_VARIABLE}; ${JOINT_EVS_WVS_PUBLISHER} v5.0.0 results table; publisher-weighted by gwght; published sample size ${sampleSize}. Countries with separate EVS and WVS rows are held until pooled microdata are harmonised.`
  const observations: Observation[] = emitted.map(([iso3, countryRows]) => {
    const row = countryRows[0] as PublishedRow
    return {
      indicatorId: 'interpersonal_trust',
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: row.trustedPercent,
      year: JOINT_EVS_WVS_RELEASE_YEAR,
      sourceTier: 'academic_survey',
      sourceUrl,
      retrievedAt,
      note: note(row.sampleSize),
    }
  })

  return {
    adapterId: JOINT_EVS_WVS_ADAPTER_ID,
    observations,
    availableCountries: [...byCountry.keys()].sort(),
    emittedCountries: emitted.map(([iso3]) => iso3),
    heldCountries: heldDuplicateCountries,
    unmappedLabels: [...new Set(unmappedLabels)].sort(),
    sourceUrl: JOINT_EVS_WVS_RESULTS_URL,
    release: '5.0.0 (2024-06-24)',
  }
}

function pdfToText(pdf: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const child: ChildProcessWithoutNullStreams = spawn('pdftotext', ['-layout', '-', '-'])
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
    child.on('error', (error) => {
      reject(new Error(`Cannot run pdftotext. Install Poppler before running the adapter: ${error.message}`))
    })
    child.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf8'))
        return
      }
      reject(new Error(`pdftotext failed (${code}): ${Buffer.concat(stderr).toString('utf8').trim()}`))
    })
    child.stdin.end(Buffer.from(pdf))
  })
}

/** Fetch and parse the pinned official Joint EVS/WVS results release. */
export async function fetchJointEvsWvsTrust(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<JointEvsWvsTrustResult> {
  const sourceUrl = opts.sourceUrl ?? JOINT_EVS_WVS_RESULTS_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`Joint EVS/WVS: HTTP ${response.status}`)
  const pdf = new Uint8Array(await response.arrayBuffer())
  const text = await pdfToText(pdf)
  const result = parseJointEvsWvsA165(text, opts.retrievedAt ?? new Date().toISOString(), sourceUrl)
  return { ...result, sourceUrl }
}
