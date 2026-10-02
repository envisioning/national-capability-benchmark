import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as WebReadableStream } from 'node:stream/web'
import {
  ATLAS_DATASET,
  ATLAS_DOI,
  ATLAS_FILE,
  ATLAS_FILE_ID,
  ATLAS_FILE_MD5,
  ATLAS_FILE_SHA256,
  ATLAS_FILE_URL,
  ATLAS_LICENCE,
  ATLAS_NEW_PRODUCTS_ADAPTER_ID,
  ATLAS_NEW_PRODUCTS_RULE,
  ATLAS_PAGE_URL,
  ATLAS_PUBLISHER,
  ATLAS_VERSION,
  COUNTRIES,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import { parseCsvLine } from './csv.js'
import type { SourceAdapterResult } from './types.js'

/*
 * Harvard Growth Lab, Atlas of Economic Complexity, new export products. See
 * D149 and the preflight in docs/research/adaptability/A16-FIXES.md.
 *
 * The file holds one row per country, HS92 4-digit product and year, with
 * gross exports, imports and the publisher's revealed comparative advantage.
 * The adapter reads only the two windows the rule names, counts for each
 * benchmark country the products it did not export competitively at the start
 * and does at the end, and divides by the products it had room to enter. A
 * product absent from a year counts as zero exports and zero RCA. Only codes
 * of four digits count as products, so the publisher's unspecified `XXXX`
 * line is never one. The pin constants live in `model/source-catalog.ts`.
 */

export const ATLAS_INDICATOR_ID = 'new_export_products_rate'

type Rule = {
  start: { from: number; to: number }
  end: { from: number; to: number }
  absentRca: number
  presentRca: number
  minExportsUsd: number
}

/** One benchmark country's counts, which the value derives from and the pin records. */
export type AtlasCount = {
  /** Products with mean RCA under the absence line at the start: the room to enter. */
  available: number
  /** Products in `available` that cross the presence line and the export floor at the end. */
  new: number
  /**
   * Of `new`, those the country exports more of than it imports over the end
   * window. The re-export test of the preflight: published, not scored.
   */
  newNetExporter: number
  /** New products' HS92 codes, sorted. */
  products: string[]
}

export type AtlasPin = {
  adapterId: string
  publisher: string
  dataset: string
  doi: string
  version: string
  file: string
  fileId: number
  md5: string
  sha256: string
  url: string
  retrievedAt: string
  licence: string
  rule: Rule
  /** Four-digit codes present in the file in either window: the product universe. */
  productUniverse: number
  counts: Record<string, AtlasCount>
}

export type AtlasResult = SourceAdapterResult & { pin: AtlasPin }

type Cell = { exports: number; imports: number; rca: number }

const round2 = (value: number): number => Math.round(value * 100) / 100

const yearsOf = (window: { from: number; to: number }): number[] => {
  const out: number[] = []
  for (let year = window.from; year <= window.to; year += 1) out.push(year)
  return out
}

/**
 * Accumulates the rows of the file one line at a time, so a 450 MB file never
 * has to sit in memory as one string. Pure apart from its own state.
 */
export class AtlasAccumulator {
  private readonly rule: Rule
  private readonly benchmark: Set<string>
  private readonly years: Set<number>
  private readonly cells = new Map<string, Map<string, Map<number, Cell>>>()
  private readonly products = new Set<string>()
  private index: Record<string, number> | null = null
  readonly seenCountries = new Set<string>()

  constructor(rule: Rule = ATLAS_NEW_PRODUCTS_RULE) {
    this.rule = rule
    this.benchmark = new Set(COUNTRIES.map((country) => country.iso3))
    this.years = new Set([...yearsOf(rule.start), ...yearsOf(rule.end)])
  }

  line(text: string): void {
    if (text.length === 0) return
    if (!this.index) {
      const headers = parseCsvLine(text.replace(/^﻿/, ''))
      const required = ['country_iso3_code', 'product_hs92_code', 'year', 'export_value', 'import_value', 'export_rca']
      for (const name of required) {
        if (!headers.includes(name)) throw new Error(`${ATLAS_PUBLISHER}: ${ATLAS_FILE} is missing ${name}`)
      }
      this.index = Object.fromEntries(required.map((name) => [name, headers.indexOf(name)]))
      return
    }
    const cols = text.split(',')
    const year = Number(cols[this.index.year!])
    if (!this.years.has(year)) return
    const product = cols[this.index.product_hs92_code!] ?? ''
    if (!/^\d{4}$/.test(product)) return
    this.products.add(product)
    const iso3 = cols[this.index.country_iso3_code!] ?? ''
    if (!this.benchmark.has(iso3)) return
    this.seenCountries.add(iso3)
    const num = (name: string): number => {
      const value = Number(cols[this.index![name]!])
      return Number.isFinite(value) ? value : 0
    }
    const byProduct = this.cells.get(iso3) ?? new Map<string, Map<number, Cell>>()
    const byYear = byProduct.get(product) ?? new Map<number, Cell>()
    byYear.set(year, { exports: num('export_value'), imports: num('import_value'), rca: num('export_rca') })
    byProduct.set(product, byYear)
    this.cells.set(iso3, byProduct)
  }

  /** The counts for every benchmark country the file holds. */
  counts(): { productUniverse: number; counts: Map<string, AtlasCount> } {
    const startYears = yearsOf(this.rule.start)
    const endYears = yearsOf(this.rule.end)
    const mean = (byYear: Map<number, Cell> | undefined, years: number[], key: keyof Cell): number =>
      years.reduce((sum, year) => sum + (byYear?.get(year)?.[key] ?? 0), 0) / years.length
    const out = new Map<string, AtlasCount>()
    for (const iso3 of [...this.seenCountries].sort()) {
      const byProduct = this.cells.get(iso3)
      const count: AtlasCount = { available: 0, new: 0, newNetExporter: 0, products: [] }
      for (const product of [...this.products].sort()) {
        const byYear = byProduct?.get(product)
        if (mean(byYear, startYears, 'rca') >= this.rule.absentRca) continue
        count.available += 1
        const exports = mean(byYear, endYears, 'exports')
        if (mean(byYear, endYears, 'rca') < this.rule.presentRca || exports < this.rule.minExportsUsd) continue
        count.new += 1
        count.products.push(product)
        if (exports > mean(byYear, endYears, 'imports')) count.newNetExporter += 1
      }
      out.set(iso3, count)
    }
    return { productUniverse: this.products.size, counts: out }
  }
}

/** Turn accumulated rows into observations and the pin. Pure. */
export function buildAtlasObservations(
  accumulator: AtlasAccumulator,
  opts: { retrievedAt?: string; md5?: string; sha256?: string; rule?: Rule } = {},
): AtlasResult {
  const rule = opts.rule ?? ATLAS_NEW_PRODUCTS_RULE
  const retrievedAt = opts.retrievedAt ?? new Date().toISOString()
  const { productUniverse, counts } = accumulator.counts()
  const observations: Observation[] = []
  const held: string[] = []
  for (const [iso3, count] of counts) {
    if (count.available === 0) {
      held.push(iso3)
      continue
    }
    observations.push({
      indicatorId: ATLAS_INDICATOR_ID,
      iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: round2((100 * count.new) / count.available),
      year: rule.end.to,
      sourceTier: 'academic_survey',
      sourceUrl: ATLAS_PAGE_URL,
      retrievedAt,
      note: [
        `${ATLAS_PUBLISHER}, ${ATLAS_DATASET}, ${ATLAS_DOI} v${ATLAS_VERSION}, ${ATLAS_FILE}`,
        `${count.new} new of ${count.available} HS92 4-digit products under RCA ${rule.absentRca} over ${rule.start.from}-${rule.start.to}`,
        `new = mean RCA at least ${rule.presentRca} and mean exports at least USD ${rule.minExportsUsd.toLocaleString('en-US')} over ${rule.end.from}-${rule.end.to}`,
        `${count.newNetExporter} of the ${count.new} exported more than imported (re-export test, not scored)`,
        `gross merchandise exports, reconciled from exporter and importer reports by the publisher; ${ATLAS_LICENCE}.`,
      ].join('; '),
    })
  }
  observations.sort((a, b) => a.iso3.localeCompare(b.iso3))
  const emitted = observations.map((observation) => observation.iso3)
  return {
    adapterId: ATLAS_NEW_PRODUCTS_ADAPTER_ID,
    observations,
    availableCountries: [...counts.keys()].sort(),
    emittedCountries: emitted,
    heldCountries: held.sort(),
    unmappedLabels: COUNTRIES.map((country) => country.iso3).filter((iso3) => !counts.has(iso3)).sort(),
    sourceUrl: ATLAS_FILE_URL,
    release: `${ATLAS_DOI} v${ATLAS_VERSION}, ${ATLAS_FILE}`,
    pin: {
      adapterId: ATLAS_NEW_PRODUCTS_ADAPTER_ID,
      publisher: ATLAS_PUBLISHER,
      dataset: ATLAS_DATASET,
      doi: ATLAS_DOI,
      version: ATLAS_VERSION,
      file: ATLAS_FILE,
      fileId: ATLAS_FILE_ID,
      md5: opts.md5 ?? ATLAS_FILE_MD5,
      sha256: opts.sha256 ?? ATLAS_FILE_SHA256,
      url: ATLAS_FILE_URL,
      retrievedAt,
      licence: ATLAS_LICENCE,
      rule,
      productUniverse,
      counts: Object.fromEntries(counts),
    },
  }
}

/**
 * Download the pinned file to a temporary directory while hashing it, refuse
 * it unless both checksums match the pin, then read it one line at a time.
 */
export async function fetchAtlasNewExportProducts(
  opts: { retrievedAt?: string; sourceUrl?: string } = {},
): Promise<AtlasResult> {
  const sourceUrl = opts.sourceUrl ?? ATLAS_FILE_URL
  const response = await fetch(sourceUrl)
  if (!response.ok || !response.body) throw new Error(`${ATLAS_PUBLISHER}: HTTP ${response.status} for ${sourceUrl}`)
  const directory = await mkdtemp(join(tmpdir(), 'ncb-atlas-'))
  const path = join(directory, ATLAS_FILE)
  try {
    const md5 = createHash('md5')
    const sha256 = createHash('sha256')
    const body = Readable.fromWeb(response.body as unknown as WebReadableStream<Uint8Array>)
    body.on('data', (chunk: Buffer) => {
      md5.update(chunk)
      sha256.update(chunk)
    })
    await pipeline(body, createWriteStream(path))
    const md5Hex = md5.digest('hex')
    const sha256Hex = sha256.digest('hex')
    if (md5Hex !== ATLAS_FILE_MD5 || sha256Hex !== ATLAS_FILE_SHA256) {
      throw new Error(
        `${ATLAS_PUBLISHER}: ${ATLAS_FILE} no longer matches the pinned ${ATLAS_DOI} v${ATLAS_VERSION} (md5 ${md5Hex}). ` +
          'Review the new release, then update the pin in source-catalog.ts with a decision entry.',
      )
    }
    const accumulator = new AtlasAccumulator()
    const lines = createInterface({ input: createReadStream(path, { encoding: 'utf8' }), crlfDelay: Infinity })
    for await (const line of lines) accumulator.line(line)
    return buildAtlasObservations(accumulator, {
      retrievedAt: opts.retrievedAt ?? new Date().toISOString(),
      md5: md5Hex,
      sha256: sha256Hex,
    })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
