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
  ATLAS_HISTORY_FROM,
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
 * The adapter counts for each benchmark country the products it did not
 * export competitively in the rule's start window and does in its end window,
 * and divides by the products it had room to enter. A product absent from a
 * year counts as zero exports and zero RCA. Only codes of four digits count as
 * products, so the publisher's unspecified `XXXX` line is never one. The pin
 * constants live in `model/source-catalog.ts`.
 *
 * Beside the pinned end year, the same rule runs on every earlier end year
 * whose start window begins on or after `ATLAS_HISTORY_FROM`: both windows
 * move back together and keep their length and gap (D183). Those values are
 * history for trends and the reconstructed history; scoring reads the latest.
 * A history value is emitted only for a country the pinned year emits and only
 * when the file holds that country in every year of both windows, so a
 * country the file starts late never reads its first year as entry.
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

const round2 = (value: number): number => Math.round(value * 100) / 100

const yearsOf = (window: { from: number; to: number }): number[] => {
  const out: number[] = []
  for (let year = window.from; year <= window.to; year += 1) out.push(year)
  return out
}

/** The rule with both windows moved so the end window closes in `endYear`. */
export function ruleEndingIn(rule: Rule, endYear: number): Rule {
  const shift = endYear - rule.end.to
  return {
    ...rule,
    start: { from: rule.start.from + shift, to: rule.start.to + shift },
    end: { from: rule.end.from + shift, to: rule.end.to + shift },
  }
}

/** Every end year the file can carry the rule for, oldest first, the pinned one last. */
export function atlasEndYears(rule: Rule = ATLAS_NEW_PRODUCTS_RULE, firstYear = ATLAS_HISTORY_FROM): number[] {
  const first = rule.end.to - (rule.start.from - firstYear)
  return yearsOf({ from: Math.min(first, rule.end.to), to: rule.end.to })
}

/* One country-product's values, three per year from `firstYear`: exports, imports, RCA. */
const EXPORTS = 0
const IMPORTS = 1
const RCA = 2

/**
 * Accumulates the rows of the file one line at a time, so a 450 MB file never
 * has to sit in memory as one string. Pure apart from its own state.
 */
export class AtlasAccumulator {
  private readonly rule: Rule
  private readonly firstYear: number
  private readonly span: number
  private readonly benchmark: Set<string>
  private readonly cells = new Map<string, Map<string, Float64Array>>()
  /** The years each four-digit product appears in, for any country. */
  private readonly productYears = new Map<string, Uint8Array>()
  /** The years the file holds any row for each benchmark country. */
  private readonly countryYears = new Map<string, Uint8Array>()
  private index: Record<string, number> | null = null
  readonly seenCountries = new Set<string>()

  constructor(rule: Rule = ATLAS_NEW_PRODUCTS_RULE, firstYear = ATLAS_HISTORY_FROM) {
    this.rule = rule
    this.firstYear = Math.min(firstYear, rule.start.from)
    this.span = rule.end.to - this.firstYear + 1
    this.benchmark = new Set(COUNTRIES.map((country) => country.iso3))
  }

  line(text: string): void {
    if (text.length === 0) return
    if (!this.index) {
      const headers = parseCsvLine(text.replace(/^\uFEFF/, ''))
      const required = ['country_iso3_code', 'product_hs92_code', 'year', 'export_value', 'import_value', 'export_rca']
      for (const name of required) {
        if (!headers.includes(name)) throw new Error(`${ATLAS_PUBLISHER}: ${ATLAS_FILE} is missing ${name}`)
      }
      this.index = Object.fromEntries(required.map((name) => [name, headers.indexOf(name)]))
      return
    }
    const cols = text.split(',')
    const at = Number(cols[this.index.year!]) - this.firstYear
    if (!Number.isInteger(at) || at < 0 || at >= this.span) return
    const product = cols[this.index.product_hs92_code!] ?? ''
    if (!/^\d{4}$/.test(product)) return
    const seen = this.productYears.get(product) ?? new Uint8Array(this.span)
    seen[at] = 1
    this.productYears.set(product, seen)
    const iso3 = cols[this.index.country_iso3_code!] ?? ''
    if (!this.benchmark.has(iso3)) return
    this.seenCountries.add(iso3)
    const years = this.countryYears.get(iso3) ?? new Uint8Array(this.span)
    years[at] = 1
    this.countryYears.set(iso3, years)
    const num = (name: string): number => {
      const value = Number(cols[this.index![name]!])
      return Number.isFinite(value) ? value : 0
    }
    const byProduct = this.cells.get(iso3) ?? new Map<string, Float64Array>()
    const values = byProduct.get(product) ?? new Float64Array(3 * this.span)
    values[3 * at + EXPORTS] = num('export_value')
    values[3 * at + IMPORTS] = num('import_value')
    values[3 * at + RCA] = num('export_rca')
    byProduct.set(product, values)
    this.cells.set(iso3, byProduct)
  }

  /** Whether the file holds `iso3` in every year of both windows of `rule`. */
  covers(iso3: string, rule: Rule = this.rule): boolean {
    const years = this.countryYears.get(iso3)
    return [...yearsOf(rule.start), ...yearsOf(rule.end)].every((year) => years?.[year - this.firstYear] === 1)
  }

  /** The counts for every benchmark country the file holds, under `rule` or one of its moved copies. */
  counts(rule: Rule = this.rule): { productUniverse: number; counts: Map<string, AtlasCount> } {
    const startAt = yearsOf(rule.start).map((year) => year - this.firstYear)
    const endAt = yearsOf(rule.end).map((year) => year - this.firstYear)
    if ([...startAt, ...endAt].some((at) => at < 0 || at >= this.span)) {
      throw new Error(`${ATLAS_PUBLISHER}: a window of ${rule.start.from}-${rule.end.to} is outside the years read`)
    }
    const products = [...this.productYears]
      .filter(([, seen]) => [...startAt, ...endAt].some((at) => seen[at] === 1))
      .map(([product]) => product)
      .sort()
    const mean = (values: Float64Array | undefined, at: number[], key: number): number =>
      at.reduce((sum, i) => sum + (values?.[3 * i + key] ?? 0), 0) / at.length
    const out = new Map<string, AtlasCount>()
    for (const iso3 of [...this.seenCountries].sort()) {
      const byProduct = this.cells.get(iso3)
      const count: AtlasCount = { available: 0, new: 0, newNetExporter: 0, products: [] }
      for (const product of products) {
        const values = byProduct?.get(product)
        if (mean(values, startAt, RCA) >= rule.absentRca) continue
        count.available += 1
        const exports = mean(values, endAt, EXPORTS)
        if (mean(values, endAt, RCA) < rule.presentRca || exports < rule.minExportsUsd) continue
        count.new += 1
        count.products.push(product)
        if (exports > mean(values, endAt, IMPORTS)) count.newNetExporter += 1
      }
      out.set(iso3, count)
    }
    return { productUniverse: products.length, counts: out }
  }
}

function observationFor(iso3: string, count: AtlasCount, rule: Rule, retrievedAt: string): Observation {
  return {
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
  }
}

/** Turn accumulated rows into observations and the pin. Pure. */
export function buildAtlasObservations(
  accumulator: AtlasAccumulator,
  opts: { retrievedAt?: string; md5?: string; sha256?: string; rule?: Rule; firstYear?: number } = {},
): AtlasResult {
  const rule = opts.rule ?? ATLAS_NEW_PRODUCTS_RULE
  const retrievedAt = opts.retrievedAt ?? new Date().toISOString()
  const { productUniverse, counts } = accumulator.counts(rule)
  const observations: Observation[] = []
  const held: string[] = []
  for (const [iso3, count] of counts) {
    if (count.available === 0) {
      held.push(iso3)
      continue
    }
    observations.push(observationFor(iso3, count, rule, retrievedAt))
  }
  const emitted = observations.map((observation) => observation.iso3).sort()
  /* History: the same rule on each earlier end year, for countries the pinned year emits (D183). */
  for (const endYear of atlasEndYears(rule, opts.firstYear).slice(0, -1)) {
    const moved = ruleEndingIn(rule, endYear)
    const past = accumulator.counts(moved).counts
    for (const iso3 of emitted) {
      const count = past.get(iso3)
      if (!count || count.available === 0 || !accumulator.covers(iso3, moved)) continue
      observations.push(observationFor(iso3, count, moved, retrievedAt))
    }
  }
  observations.sort((a, b) => a.iso3.localeCompare(b.iso3) || a.year - b.year)
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
