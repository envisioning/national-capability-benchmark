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

/** One published country row, reduced to the value the registry stores. */
type PublishedRow = {
  label: string
  sampleSize: number
  value: number
  /** Valid answers behind a published mean, where the table prints one. */
  base?: number
}

/**
 * One item of the results PDF and the registry row it fills.
 *
 * Every item is read from the same pinned release, with the same country
 * mapping and the same hold rule for countries with separate EVS and WVS rows
 * (D64). What differs is the table layout, so each item names where its table
 * starts and stops, which line is a country row and which published column is
 * the value. Nothing is computed from the category percentages: the value is
 * a number the publisher prints.
 */
type JointEvsWvsItem = {
  variable: string
  indicatorId: string
  /** The table heading after `<variable>- ` in the PDF text. */
  heading: string
  /** The text that ends the country rows. */
  end: string
  /** A country row. Group 1 is the label; `read` picks the rest. */
  rowPattern: RegExp
  read: (match: RegExpMatchArray) => Omit<PublishedRow, 'label'>
  /** What the stored value is, for the observation note. Null keeps D64's note. */
  statistic: ((row: PublishedRow) => string) | null
}

const toNumber = (text: string | undefined): number => Number(text?.replace(/,/g, ''))

/**
 * The items the adapter reads, each with the observation id it fills.
 *
 * A165 keeps the note D64 published, so a refetch records no revision for the
 * trust rows. The items added later name their statistic and fieldwork year in
 * the note. See D64, D127 and D128.
 */
export const JOINT_EVS_WVS_ITEMS: readonly JointEvsWvsItem[] = [
  {
    variable: JOINT_EVS_WVS_TRUST_VARIABLE,
    indicatorId: 'interpersonal_trust',
    heading: 'Most people can be trusted',
    end: '\nTOTAL',
    // label, sample size, "most people can be trusted" %, "can't be too careful" %
    rowPattern: /^(.+?)\s{2,}([\d,]+)\s+([0-9]+(?:\.[0-9]+)?)\s+[0-9]+(?:\.[0-9]+)?(?:\s|$)/gm,
    read: (m) => ({ sampleSize: toNumber(m[2]), value: Number(m[3]) }),
    statistic: null,
  },
  {
    variable: 'A173',
    indicatorId: 'perceived_control',
    heading: 'How much freedom of choice and control',
    end: '\n(N)',
    // label, (total), ten categories, don't know, no answer, missing, (base), mean, std dev
    rowPattern: /^(\S.*?)\s{2,}\(([\d,]+)\)\s.*\s\(([\d,]+)\)\s+([0-9]+\.[0-9])\s+([0-9]+\.[0-9])\s*$/gm,
    read: (m) => ({ sampleSize: toNumber(m[2]), base: toNumber(m[3]), value: Number(m[4]) }),
    statistic: (row) => `published mean on the 1-10 scale over ${row.base} valid answers`,
  },
  {
    variable: 'A080_01',
    indicatorId: 'civic_participation',
    heading: 'Member: Belong to humanitarian or charitable organization',
    end: '\nTOTAL',
    // label, sample size, not mentioned %, mentioned %
    rowPattern: /^(.+?)\s{2,}([\d,]+)\s+([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)(?:\s|$)/gm,
    read: (m) => ({ sampleSize: toNumber(m[2]), value: Number(m[4]) }),
    statistic: () =>
      "published share mentioned, which is belongs in EVS and active or inactive member in WVS, over all respondents including don't know and no answer",
  },
]

export type JointEvsWvsItemCoverage = {
  variable: string
  availableCountries: string[]
  emittedCountries: string[]
  heldCountries: string[]
  /** Fieldwork year of each emitted country's survey, from the release's `year` table. */
  fieldworkYears: Record<string, number>
}

export type JointEvsWvsResult = SourceAdapterResult & {
  /** Coverage per registry row, so a thin item cannot hide behind a full one. */
  coverageByIndicator: Record<string, JointEvsWvsItemCoverage>
}

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

function itemSection(text: string, item: JointEvsWvsItem): string {
  const marker = `${item.variable}- ${item.heading}`
  const start = text.indexOf(marker)
  if (start < 0) throw new Error(`Joint EVS/WVS results do not contain ${item.variable}`)
  const afterMarker = text.slice(start + marker.length)
  const end = afterMarker.indexOf(item.end)
  if (end < 0) throw new Error(`Joint EVS/WVS ${item.variable} table has no total row`)
  return afterMarker.slice(0, end)
}

/**
 * The survey year of each source row, read from the release's `year` table,
 * where every row carries 100.0 under exactly one year. A row that does not is
 * left out rather than guessed.
 */
export function parseJointEvsWvsFieldworkYears(text: string): Map<string, number> {
  const marker = 'year- Year survey'
  const start = text.indexOf(marker)
  const years = new Map<string, number>()
  if (start < 0) return years
  const afterMarker = text.slice(start + marker.length)
  const end = afterMarker.indexOf('\nTOTAL')
  const section = end < 0 ? afterMarker : afterMarker.slice(0, end)
  let columns: number[] = []
  for (const line of section.split('\n')) {
    const header = line.trim()
    if (/^\d{4}(?:\s+\d{4})+$/.test(header)) {
      columns = header.split(/\s+/).map(Number)
      continue
    }
    const row = /^(.+?)\s{2,}[\d,]+((?:\s+(?:-|[0-9]+(?:\.[0-9]+)?))+)\s*$/.exec(line)
    if (!row || columns.length === 0) continue
    const cells = (row[2] ?? '').trim().split(/\s+/)
    if (cells.length !== columns.length) continue
    const full = cells.flatMap((cell, i) => (cell === '100.0' ? [columns[i] as number] : []))
    if (full.length === 1) years.set((row[1] ?? '').trim(), full[0] as number)
  }
  return years
}

/**
 * Parse the configured items from the publisher's fixed-width results PDF text.
 *
 * The PDF is an official aggregate table weighted by `gwght`, so this adapter
 * preserves the published figure rather than reconstructing it from
 * respondent records. Countries with both EVS and WVS rows are held until a
 * pooled microdata rule can use both samples' weights without guessing.
 */
export function parseJointEvsWvs(
  text: string,
  retrievedAt = new Date().toISOString(),
  sourceUrl = JOINT_EVS_WVS_RESULTS_URL,
  items: readonly JointEvsWvsItem[] = JOINT_EVS_WVS_ITEMS,
): JointEvsWvsResult {
  const fieldwork = parseJointEvsWvsFieldworkYears(text)
  const observations: Observation[] = []
  const coverageByIndicator: Record<string, JointEvsWvsItemCoverage> = {}
  const available = new Set<string>()
  const emittedAll = new Set<string>()
  const held = new Set<string>()
  const unmappedLabels = new Set<string>()

  for (const item of items) {
    const section = itemSection(text, item)
    const rows: PublishedRow[] = []
    for (const match of section.matchAll(item.rowPattern)) {
      const label = match[1]?.trim()
      const { sampleSize, value, base } = item.read(match)
      if (!label || !Number.isFinite(sampleSize) || !Number.isFinite(value)) continue
      rows.push(base === undefined ? { label, sampleSize, value } : { label, sampleSize, value, base })
    }
    if (rows.length === 0) throw new Error(`Joint EVS/WVS ${item.variable} table has no country rows`)

    const byCountry = new Map<string, PublishedRow[]>()
    for (const row of rows) {
      const iso3 = sourceLabelToIso3(row.label)
      if (!iso3) {
        unmappedLabels.add(row.label)
        continue
      }
      const list = byCountry.get(iso3) ?? []
      list.push(row)
      byCountry.set(iso3, list)
    }

    const heldCountries = [...byCountry.entries()]
      .filter(([, countryRows]) => countryRows.length > 1)
      .map(([iso3]) => iso3)
      .sort()
    const emitted = [...byCountry.entries()]
      .filter(([, countryRows]) => countryRows.length === 1)
      .sort(([a], [b]) => a.localeCompare(b))

    const fieldworkYears: Record<string, number> = {}
    for (const [iso3, countryRows] of emitted) {
      const row = countryRows[0] as PublishedRow
      const year = fieldwork.get(row.label)
      if (year !== undefined) fieldworkYears[iso3] = year
      const parts = [item.variable, `${JOINT_EVS_WVS_PUBLISHER} v5.0.0 results table`, 'publisher-weighted by gwght']
      if (item.statistic) parts.push(item.statistic(row))
      parts.push(`published sample size ${row.sampleSize}`)
      if (item.statistic && year !== undefined) parts.push(`fieldwork ${year}`)
      observations.push({
        indicatorId: item.indicatorId,
        iso3,
        geometry: 'national',
        reconciliation: 'context_only',
        value: row.value,
        year: JOINT_EVS_WVS_RELEASE_YEAR,
        sourceTier: 'academic_survey',
        sourceUrl,
        retrievedAt,
        note: `${parts.join('; ')}. Countries with separate EVS and WVS rows are held until pooled microdata are harmonised.`,
      })
    }

    coverageByIndicator[item.indicatorId] = {
      variable: item.variable,
      availableCountries: [...byCountry.keys()].sort(),
      emittedCountries: emitted.map(([iso3]) => iso3),
      heldCountries,
      fieldworkYears,
    }
    for (const iso3 of byCountry.keys()) available.add(iso3)
    for (const [iso3] of emitted) emittedAll.add(iso3)
    for (const iso3 of heldCountries) held.add(iso3)
  }

  return {
    adapterId: JOINT_EVS_WVS_ADAPTER_ID,
    observations,
    availableCountries: [...available].sort(),
    emittedCountries: [...emittedAll].sort(),
    heldCountries: [...held].sort(),
    unmappedLabels: [...unmappedLabels].sort(),
    sourceUrl: JOINT_EVS_WVS_RESULTS_URL,
    release: '5.0.0 (2024-06-24)',
    coverageByIndicator,
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

/** Fetch and parse every configured item from the pinned official Joint EVS/WVS results release. */
export async function fetchJointEvsWvs(
  opts: { sourceUrl?: string; retrievedAt?: string } = {},
): Promise<JointEvsWvsResult> {
  const sourceUrl = opts.sourceUrl ?? JOINT_EVS_WVS_RESULTS_URL
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`Joint EVS/WVS: HTTP ${response.status}`)
  const pdf = new Uint8Array(await response.arrayBuffer())
  const text = await pdfToText(pdf)
  const result = parseJointEvsWvs(text, opts.retrievedAt ?? new Date().toISOString(), sourceUrl)
  return { ...result, sourceUrl }
}
