import {
  COUNTRY_ISO3,
  GDP_PER_CAPITA_CODE,
  INDICATORS,
  WB_API_BASE,
  WB_DEFAULT_DATABASE,
  worldBankSeriesUrl,
} from '../model/index.js'
import { WEALTH_CORRELATION_THRESHOLD } from './diagnostics.js'
import { median, pearson, round, spearman } from './stats.js'

/**
 * Testing a candidate series before it enters the registry.
 *
 * A gap is filled by evidence, and the evidence is boring: does the series
 * cover the country set, is it recent, does it vary, and is it measuring income
 * again. A candidate that fails any of those is a wasted registry row and a
 * false confidence gain, so the test runs before the row is written, not after.
 *
 * Nothing here writes to `data/`. The probe fetches, reports and exits, so it
 * can be run against a live country set while other work is in flight. See D52.
 */

export type ProbeRequest = {
  series: string
  /** World Bank database id. Omit for World Development Indicators. */
  sourceId?: number
  /** Free-text note carried into the report, usually the gap it might fill. */
  note?: string
}

export type ProbeResult = {
  series: string
  sourceId: number
  note: string | null
  /** Countries with at least one value in the window. */
  countries: number
  /** The country set the probe ran against, at the time it ran. */
  countrySet: number
  latestYear: number | null
  medianYear: number | null
  min: number | null
  max: number | null
  /** Correlation of the latest value per country against log GDP per capita. */
  gdpPearson: number | null
  gdpSpearman: number | null
  /** Countries carrying both a value and a GDP figure, which is what the correlation used. */
  n: number
  /** True when the series covers enough of the set, is recent and is not a wealth proxy. */
  usable: boolean
  /** Why it failed, in the order the tests run. Empty when it passed. */
  failures: string[]
  error: string | null
}

type WbRow = { countryiso3code: string; date: string; value: number | null }

/**
 * The API answered, and said it has no such series.
 *
 * A deleted, archived or mistyped code comes back as HTTP 200 carrying a
 * message block. That is a verdict on the candidate and it has to read
 * differently from a request that never arrived, or a probe run on a bad day
 * reports half the shortlist as unknown to the publisher. */
export class UnknownSeries extends Error {}

/** A candidate has to reach this share of the country set to be worth wiring. */
export const PROBE_MIN_COVERAGE = 0.5

/** A value older than this is not evidence about the country today. */
export const PROBE_MAX_AGE_YEARS = 8

/**
 * How long one series may take before the probe gives up on it.
 *
 * The API answers most series in seconds and occasionally stalls on one. A
 * probe of twenty candidates should not be held by the slowest, so a stall is
 * reported as a failed candidate and the run continues.
 */
export const PROBE_TIMEOUT_MS = 45_000

/** How many times one series is asked for before the probe calls it unanswered. */
export const PROBE_ATTEMPTS = 3

/**
 * How long the probe waits between series, and before a retry.
 *
 * The API throttles a burst: a run of candidates that answered one minute ago
 * starts timing out when they are asked for back to back. A probe is not in a
 * hurry, so it waits rather than reporting an empty dataset that is really a
 * closed door.
 */
export const PROBE_PAUSE_MS = 3_000

const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

/**
 * One series, latest value per country.
 *
 * The API is slow under load and a single request can stall past any sensible
 * deadline, so a timeout is retried once. A stall reported as "no data" would
 * be worse than a slow probe: it reads as evidence that a candidate is empty
 * when nobody has tested it.
 */
async function fetchLatest(
  series: string,
  sourceId: number,
  fromYear: number,
  timeoutMs = PROBE_TIMEOUT_MS,
  attempt = 1,
): Promise<Map<string, { value: number; year: number }>> {
  const url = worldBankSeriesUrl({
    series,
    sourceId,
    countries: COUNTRY_ISO3,
    fromYear,
    toYear: new Date().getFullYear(),
  })
  let res: Response
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
  } catch (e) {
    if (e instanceof UnknownSeries) throw e
    if (attempt >= PROBE_ATTEMPTS) {
      throw new Error(`no answer after ${attempt} attempts: ${e instanceof Error ? e.message : e}`)
    }
    await wait(PROBE_PAUSE_MS * attempt)
    return fetchLatest(series, sourceId, fromYear, timeoutMs, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const body: unknown = await res.json()
  if (Array.isArray(body) && body.length > 0) {
    const first = body[0] as { message?: Array<{ value?: string }> }
    if (Array.isArray(first?.message)) {
      throw new UnknownSeries(first.message[0]?.value ?? 'the API rejected this code')
    }
  }
  if (!Array.isArray(body) || body.length < 2) throw new Error('no data block')
  const rows = Array.isArray(body[1]) ? (body[1] as WbRow[]) : []
  const latest = new Map<string, { value: number; year: number }>()
  for (const row of rows) {
    if (row.value === null || !row.countryiso3code) continue
    const year = Number(row.date)
    if (!Number.isFinite(year)) continue
    const held = latest.get(row.countryiso3code)
    if (!held || year > held.year) latest.set(row.countryiso3code, { value: row.value, year })
  }
  return latest
}

/**
 * Probe candidate series against the live country set.
 *
 * The GDP series is fetched once and reused, because the wealth test is the
 * point: a candidate that correlates with income above the same threshold the
 * diagnostics use would add a number the benchmark already has.
 */
export async function probeSeries(
  requests: ProbeRequest[],
  fromYear = 2010,
): Promise<ProbeResult[]> {
  const gdp = await fetchLatest(GDP_PER_CAPITA_CODE, WB_DEFAULT_DATABASE, fromYear)
  const thisYear = new Date().getFullYear()
  const out: ProbeResult[] = []

  let first = true
  for (const req of requests) {
    if (!first) await wait(PROBE_PAUSE_MS)
    first = false
    const sourceId = req.sourceId ?? WB_DEFAULT_DATABASE
    const base = {
      series: req.series,
      sourceId,
      note: req.note ?? null,
      countrySet: COUNTRY_ISO3.length,
    }
    try {
      const latest = await fetchLatest(req.series, sourceId, fromYear)
      const values = [...latest.values()]
      const years = values.map((v) => v.year)
      const xs: number[] = []
      const ys: number[] = []
      for (const [iso3, held] of latest) {
        const income = gdp.get(iso3)
        if (!income || income.value <= 0) continue
        xs.push(held.value)
        ys.push(Math.log10(income.value))
      }
      const gdpPearson = pearson(xs, ys)
      const failures: string[] = []
      const coverage = latest.size / COUNTRY_ISO3.length
      if (coverage < PROBE_MIN_COVERAGE) {
        failures.push(`covers ${latest.size} of ${COUNTRY_ISO3.length}`)
      }
      const latestYear = years.length > 0 ? Math.max(...years) : null
      if (latestYear !== null && thisYear - latestYear > PROBE_MAX_AGE_YEARS) {
        failures.push(`latest value is ${latestYear}`)
      }
      if (values.length > 0 && new Set(values.map((v) => v.value)).size < 3) {
        failures.push('fewer than three distinct values')
      }
      if (gdpPearson !== null && Math.abs(gdpPearson) >= WEALTH_CORRELATION_THRESHOLD) {
        failures.push(`tracks log GDP at ${round(gdpPearson, 3)}`)
      }
      out.push({
        ...base,
        countries: latest.size,
        latestYear,
        medianYear: years.length > 0 ? Math.round(median(years)) : null,
        min: values.length > 0 ? round(Math.min(...values.map((v) => v.value)), 3) : null,
        max: values.length > 0 ? round(Math.max(...values.map((v) => v.value)), 3) : null,
        gdpPearson: gdpPearson === null ? null : round(gdpPearson, 3),
        gdpSpearman: (() => {
          const s = spearman(xs, ys)
          return s === null ? null : round(s, 3)
        })(),
        n: xs.length,
        usable: latest.size > 0 && failures.length === 0,
        failures,
        error: null,
      })
    } catch (e) {
      out.push({
        ...base,
        countries: 0,
        latestYear: null,
        medianYear: null,
        min: null,
        max: null,
        gdpPearson: null,
        gdpSpearman: null,
        n: 0,
        usable: false,
        /* A fetch that failed is not a verdict on the candidate. Say so, so
         * nobody reads a stalled request as an empty dataset. A code the API
         * rejects is a verdict, and reads as one. */
        failures: [
          e instanceof UnknownSeries
            ? 'the API does not know this code'
            : 'not tested: the request failed',
        ],
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }
  return out
}

export type CatalogueEntry = {
  series: string
  name: string
  /** The database the series lives in, which the request has to name. */
  sourceId: number
  sourceName: string
}

/** Pages of the indicator catalogue. It runs to about 30,000 entries. */
const CATALOGUE_PAGE_SIZE = 25_000

/**
 * Search the World Bank's own list of series by name.
 *
 * Guessing a code wastes a request and answers nothing: a code that does not
 * exist and a code in the wrong database fail the same way. The catalogue says
 * which series exist and which database each one lives in, so a candidate list
 * starts here rather than from memory. See D52.
 *
 * Presence in the catalogue is not coverage. Archived series are listed and
 * answer nothing, which is why a hit still has to be probed.
 */
export async function searchCatalogue(pattern: RegExp): Promise<CatalogueEntry[]> {
  const out: CatalogueEntry[] = []
  for (let page = 1; ; page++) {
    const url = `${WB_API_BASE}/indicator?format=json&per_page=${CATALOGUE_PAGE_SIZE}&page=${page}`
    const res = await fetch(url, { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS * 4) })
    if (!res.ok) throw new Error(`catalogue page ${page}: HTTP ${res.status}`)
    const body: unknown = await res.json()
    if (!Array.isArray(body) || body.length < 2) break
    const meta = body[0] as { pages?: number }
    const rows = (body[1] ?? []) as Array<{
      id: string
      name: string
      source: { id: string; value: string }
    }>
    for (const row of rows) {
      if (!pattern.test(row.name)) continue
      out.push({
        series: row.id,
        name: row.name,
        sourceId: Number(row.source.id),
        sourceName: row.source.value,
      })
    }
    if (!meta.pages || page >= meta.pages) break
  }
  return out
}

/** Series already in the registry, so a probe never re-tests what is wired. */
export function registrySeries(): Set<string> {
  return new Set(
    INDICATORS.filter((i) => i.source.series).map((i) => i.source.series as string),
  )
}
