import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import {
  CHECKS,
  CHECK_PREFIX,
  COUNTRY_ISO3,
  GDP_PER_CAPITA_CODE,
  INDICATORS,
  INGEST_FROM_YEAR,
  WB_API_BASE,
  WB_DEFAULT_DATABASE,
  worldBankCheckSeries,
  worldBankSeries,
  worldBankSeriesUrl,
} from '../model/index.js'
import { ObservationFile, RevisionFile } from '../model/index.js'
import type { Observation, Revision, RevisionRun } from '../model/index.js'
import { CONTEXT_PREFIX, DENOMINATOR_PREFIX } from './diagnostics.js'
import { FILES, SNAPSHOT_DIR } from './paths.js'

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
  const url = worldBankSeriesUrl({
    series,
    sourceId,
    countries: COUNTRY_ISO3,
    fromYear,
    toYear: new Date().getFullYear(),
  })

  const res = await fetch(url)
  if (!res.ok) throw new Error(`${series}: HTTP ${res.status}`)
  const body: unknown = await res.json()
  if (!Array.isArray(body) || body.length < 2 || !Array.isArray(body[1])) {
    throw new Error(`${series}: the API returned no data block`)
  }
  return (body[1] as WbRow[]).filter((r) => r.value !== null && r.countryiso3code)
}

/**
 * Every non-null year per country, newest first.
 *
 * The scoring pipeline takes the latest value per indicator and ignores the
 * rest, so history costs nothing there. The trend pipeline needs it: momentum
 * is a change between two years and cannot be recovered from a snapshot. See
 * docs/DECISIONS.md D22.
 */
function seriesPerCountry(rows: WbRow[]): Map<string, Array<{ value: number; year: number }>> {
  const out = new Map<string, Array<{ value: number; year: number }>>()
  for (const r of rows) {
    const year = Number(r.date)
    if (!Number.isFinite(year) || r.value === null) continue
    const list = out.get(r.countryiso3code) ?? []
    list.push({ value: r.value, year })
    out.set(r.countryiso3code, list)
  }
  for (const list of out.values()) list.sort((a, b) => b.year - a.year)
  return out
}

export type IngestReport = {
  series: string
  sourceId: number
  countries: number
  latestYear: number | null
  error?: string
}

/** Cap on the revisions listed for one run, so a re-baselining cannot fill the log. */
const REVISION_CAP = 500

async function readJson(path: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return null
  }
}

const cellKey = (o: { indicatorId: string; iso3: string; geometry: string; year: number }) =>
  `${o.indicatorId}|${o.iso3}|${o.geometry}|${o.year}`

/**
 * What moved between the file on disk and the file about to replace it.
 *
 * Statistics agencies restate, rebase and revise. An ingest that overwrites its
 * own file makes that invisible, which would leave the audit trail claiming a
 * number was always what it is now. See D25.
 */
export function diffObservations(
  before: Observation[],
  after: Observation[],
): { revisions: Revision[]; changed: number; added: number; removed: number } {
  const old = new Map(before.map((o) => [cellKey(o), o.value]))
  const next = new Map(after.map((o) => [cellKey(o), o.value]))

  const revisions: Revision[] = []
  let changed = 0
  let added = 0
  let removed = 0

  const parse = (key: string) => {
    const [indicatorId, iso3, geometry, year] = key.split('|')
    return {
      indicatorId: indicatorId as string,
      iso3: iso3 as string,
      geometry: geometry as Revision['geometry'],
      year: Number(year),
    }
  }

  for (const [key, value] of next) {
    const previous = old.get(key)
    if (previous === undefined) {
      added += 1
      revisions.push({ ...parse(key), from: null, to: value })
    } else if (previous !== value) {
      changed += 1
      revisions.push({ ...parse(key), from: previous, to: value })
    }
  }
  for (const [key, value] of old) {
    if (next.has(key)) continue
    removed += 1
    revisions.push({ ...parse(key), from: value, to: null })
  }
  return { revisions, changed, added, removed }
}

export async function recordRevisions(
  before: Observation[],
  previousRetrievedAt: string | null,
  after: Observation[],
  retrievedAt: string,
): Promise<RevisionRun> {
  const { revisions, changed, added, removed } = diffObservations(before, after)
  const listed = revisions.slice(0, REVISION_CAP)
  const run: RevisionRun = {
    retrievedAt,
    previousRetrievedAt,
    observationsBefore: before.length,
    observationsAfter: after.length,
    changed,
    added,
    removed,
    revisions: listed,
    omitted: revisions.length - listed.length,
  }

  const raw = await readJson(FILES.revisions)
  const parsed = raw ? RevisionFile.safeParse(raw) : null
  const runs = parsed?.success ? parsed.data.runs : []
  runs.push(run)
  await writeFile(FILES.revisions, `${JSON.stringify({ runs }, null, 2)}\n`)
  return run
}

export async function ingestWorldBank(
  fromYear = INGEST_FROM_YEAR,
  opts: { snapshot?: boolean } = {},
): Promise<{
  observations: Observation[]
  report: IngestReport[]
  revisions: RevisionRun
}> {
  const retrievedAt = new Date().toISOString()
  const requests = worldBankSeries()
  requests.push({ series: GDP_PER_CAPITA_CODE, sourceId: WB_DEFAULT_DATABASE })
  /* Checks are fetched on the same pass and stored under their own prefix. They
   * never reach the frame or the mean. See D60. */
  for (const req of worldBankCheckSeries()) {
    if (!requests.some((r) => r.series === req.series && r.sourceId === req.sourceId)) {
      requests.push(req)
    }
  }

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
  const seriesToChecks = new Map<string, string[]>()
  for (const c of CHECKS) {
    if (!c.source.series) continue
    const list = seriesToChecks.get(c.source.series) ?? []
    list.push(`${CHECK_PREFIX}${c.id}`)
    seriesToChecks.set(c.source.series, list)
  }

  const observations: Observation[] = []
  const report: IngestReport[] = []

  for (const req of requests) {
    try {
      const rows = await fetchSeries(req.series, req.sourceId, fromYear)
      const series = seriesPerCountry(rows)
      const years = [...series.values()].flatMap((list) => list.map((v) => v.year))

      const targets: string[] = [...(seriesToIndicators.get(req.series) ?? [])]
      if (denominators.has(req.series)) targets.push(`${DENOMINATOR_PREFIX}${req.series}`)
      if (req.series === GDP_PER_CAPITA_CODE) targets.push(`${CONTEXT_PREFIX}${req.series}`)
      targets.push(...(seriesToChecks.get(req.series) ?? []))

      for (const [iso3, list] of series) {
        for (const v of list) {
          for (const indicatorId of targets) {
            observations.push({
              indicatorId,
              iso3,
              geometry: 'national',
              reconciliation: 'context_only',
              value: v.value,
              year: v.year,
              sourceTier: 'international_organization',
              sourceUrl: `${WB_API_BASE}/country/${iso3}/indicator/${req.series}?format=json`,
              retrievedAt,
            })
          }
        }
      }
      report.push({
        series: req.series,
        sourceId: req.sourceId,
        countries: series.size,
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

  const existing = await readJson(FILES.worldBank)
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null

  /* A series that failed this run is carried forward from the previous file
   * rather than dropped. Dropping it would score the run on less data and, per
   * D25, write the loss into the revision log as the publisher removing decades
   * of observations, when the truth is one failed request. */
  const failedTargets = new Set<string>()
  for (const r of report) {
    if (!r.error) continue
    for (const id of seriesToIndicators.get(r.series) ?? []) failedTargets.add(id)
    if (denominators.has(r.series)) failedTargets.add(`${DENOMINATOR_PREFIX}${r.series}`)
    if (r.series === GDP_PER_CAPITA_CODE) failedTargets.add(`${CONTEXT_PREFIX}${r.series}`)
    for (const id of seriesToChecks.get(r.series) ?? []) failedTargets.add(id)
  }
  if (failedTargets.size > 0) {
    observations.push(...before.filter((o) => failedTargets.has(o.indicatorId)))
  }

  const body = `${JSON.stringify({ generatedAt: retrievedAt, observations }, null, 2)}\n`
  await mkdir(dirname(FILES.worldBank), { recursive: true })
  await writeFile(FILES.worldBank, body)

  /* A full copy is 3.8 MB, so it is written only when asked for. The revision
   * log is the durable record and stays small enough to keep forever. */
  if (opts.snapshot) {
    await mkdir(SNAPSHOT_DIR, { recursive: true })
    await writeFile(resolve(SNAPSHOT_DIR, `worldbank-${retrievedAt.slice(0, 10)}.json`), body)
  }

  const revisions = await recordRevisions(before, previousRetrievedAt, observations, retrievedAt)
  return { observations, report, revisions }
}
