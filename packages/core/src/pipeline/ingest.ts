import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import {
  COUNTRY_ISO3,
  GDP_PER_CAPITA_CODE,
  INDICATORS,
  worldBankSeries,
} from '../model/index.js'
import type { Observation } from '../model/index.js'
import { CONTEXT_PREFIX, DENOMINATOR_PREFIX } from './diagnostics.js'
import { FILES } from './paths.js'

const API = 'https://api.worldbank.org/v2'
const COUNTRY_PATH = COUNTRY_ISO3.join(';')

type WbRow = {
  countryiso3code: string
  date: string
  value: number | null
}

async function fetchSeries(
  series: string,
  sourceId: number,
  fromYear: number,
): Promise<WbRow[]> {
  const url =
    `${API}/country/${COUNTRY_PATH}/indicator/${series}` +
    `?format=json&per_page=3000&date=${fromYear}:${new Date().getFullYear()}` +
    (sourceId === 2 ? '' : `&source=${sourceId}`)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`${series}: HTTP ${res.status}`)
  const body: unknown = await res.json()
  if (!Array.isArray(body) || body.length < 2 || !Array.isArray(body[1])) {
    throw new Error(`${series}: the API returned no data block`)
  }
  return (body[1] as WbRow[]).filter((r) => r.value !== null && r.countryiso3code)
}

/** Keep only the most recent non-null year per country. */
function latestPerCountry(rows: WbRow[]): Map<string, { value: number; year: number }> {
  const out = new Map<string, { value: number; year: number }>()
  for (const r of rows) {
    const year = Number(r.date)
    if (!Number.isFinite(year) || r.value === null) continue
    const cur = out.get(r.countryiso3code)
    if (!cur || year > cur.year) out.set(r.countryiso3code, { value: r.value, year })
  }
  return out
}

export type IngestReport = {
  series: string
  sourceId: number
  countries: number
  latestYear: number | null
  error?: string
}

export async function ingestWorldBank(fromYear = 2000): Promise<{
  observations: Observation[]
  report: IngestReport[]
}> {
  const retrievedAt = new Date().toISOString()
  const requests = worldBankSeries()
  requests.push({ series: GDP_PER_CAPITA_CODE, sourceId: 2 })

  const seriesToIndicators = new Map<string, string[]>()
  for (const def of INDICATORS) {
    if (def.ingest !== 'worldbank' || !def.source.series) continue
    const list = seriesToIndicators.get(def.source.series) ?? []
    list.push(def.id)
    seriesToIndicators.set(def.source.series, list)
  }
  const denominators = new Set(
    INDICATORS.map((d) => d.denominatorSeries).filter((s): s is string => Boolean(s)),
  )

  const observations: Observation[] = []
  const report: IngestReport[] = []

  for (const req of requests) {
    try {
      const rows = await fetchSeries(req.series, req.sourceId, fromYear)
      const latest = latestPerCountry(rows)
      const years = [...latest.values()].map((v) => v.year)

      const targets: string[] = [...(seriesToIndicators.get(req.series) ?? [])]
      if (denominators.has(req.series)) targets.push(`${DENOMINATOR_PREFIX}${req.series}`)
      if (req.series === GDP_PER_CAPITA_CODE) targets.push(`${CONTEXT_PREFIX}${req.series}`)

      for (const [iso3, v] of latest) {
        for (const indicatorId of targets) {
          observations.push({
            indicatorId,
            iso3,
            value: v.value,
            year: v.year,
            sourceTier: 'international_organization',
            sourceUrl: `${API}/country/${iso3}/indicator/${req.series}?format=json`,
            retrievedAt,
          })
        }
      }
      report.push({
        series: req.series,
        sourceId: req.sourceId,
        countries: latest.size,
        latestYear: years.length ? Math.max(...years) : null,
      })
    } catch (err) {
      report.push({
        series: req.series,
        sourceId: req.sourceId,
        countries: 0,
        latestYear: null,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  await mkdir(dirname(FILES.worldBank), { recursive: true })
  await writeFile(
    FILES.worldBank,
    `${JSON.stringify({ generatedAt: retrievedAt, observations }, null, 2)}\n`,
  )
  return { observations, report }
}
