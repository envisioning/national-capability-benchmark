import {
  COUNTRIES,
  GITHUB_IG_ADAPTER_ID,
  GITHUB_IG_COMMIT,
  GITHUB_IG_LICENCE,
  GITHUB_IG_PATH,
  GITHUB_IG_PUBLISHER,
  GITHUB_IG_REPOSITORY,
} from '../../model/index.js'
import type { Observation } from '../../model/schema.js'
import { parseCsv } from './csv.js'
import type { SourceAdapterResult } from './types.js'

/*
 * GitHub Innovation Graph, new public repositories. See D145.
 *
 * The publisher's `repositories` column is a stock: public repositories whose
 * members' modal location is the economy, as of the last day of the quarter,
 * including repositories nobody maintains any more. The row is the change in
 * that stock over the four quarters to the latest Q1, so it counts projects
 * started in the year, net of deletions and relocations. It is emitted as a
 * count; the registry row divides by `SP.POP.TOTL` through the
 * `per_million_population` transform, as the patent and trademark rows do.
 * The pin constants live in `model/source-catalog.ts`.
 */

export const GITHUB_IG_INDICATOR_ID = 'new_repositories_per_million'

/**
 * The access gate, applied to every country alike. No country is named in
 * this adapter. A repository stock that barely grows while the platform grows
 * everywhere else records where a country's developers can or do host code,
 * not how many projects they start: the count is net of deletions and of
 * relocations, so a stalled or falling stock cannot be read as few attempts.
 * Such a country is held, never scored at zero. See D145, which follows the
 * pattern of D120.
 */
export const GITHUB_IG_GATE = {
  /**
   * A country is held when its stock grew by less than this fraction of the
   * median benchmark country's growth rate over the same window.
   */
  stallFraction: 0.25,
} as const

/** Why the gate held a country. Only one reason exists today. */
export type GithubGateReason = 'stalled_stock'

export type GithubHeld = {
  iso3: string
  reason: GithubGateReason
  /** Stock growth over the window, percent. */
  growthPct: number
  /** The threshold the growth fell under, percent. */
  thresholdPct: number
  /** Year-on-year Q1 changes in the stock over every window the file holds, oldest first. */
  changes: Array<{ to: number; change: number }>
  /** The sentence a reader sees. Computed, never hand-written. */
  detail: string
}

/** The pin: what was read, and every count the values derive from. */
export type GithubPin = {
  adapterId: string
  repository: string
  commit: string
  path: string
  rawUrl: string
  retrievedAt: string
  licence: string
  /** The latest quarter the file holds, e.g. "2026 Q1". */
  latestQuarter: string
  /** The window the value spans: stock at Q1 of `from` to stock at Q1 of `to`. */
  window: { from: number; to: number; quarter: 1 }
  gate: {
    stallFraction: number
    /** Median stock growth across benchmark countries in the window, percent. */
    medianGrowthPct: number
    thresholdPct: number
  }
  /** Every benchmark country's Q1 stock, by year, from the first year the file holds. */
  q1Stocks: Record<string, Record<string, number>>
}

export type GithubResult = SourceAdapterResult & { pin: GithubPin; held: GithubHeld[] }

const round = (value: number, digits: number): number => {
  const scale = 10 ** digits
  return Math.round(value * scale) / scale
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
}

export function githubRawUrl(commit: string = GITHUB_IG_COMMIT): string {
  return `https://raw.githubusercontent.com/${GITHUB_IG_REPOSITORY}/${commit}/${GITHUB_IG_PATH}`
}

/** The human-readable address of the pinned file. */
export function githubBlobUrl(commit: string = GITHUB_IG_COMMIT): string {
  return `https://github.com/${GITHUB_IG_REPOSITORY}/blob/${commit}/${GITHUB_IG_PATH}`
}

/** The API call that names the newest commit touching the file. */
export function githubLatestCommitUrl(): string {
  return `https://api.github.com/repos/${GITHUB_IG_REPOSITORY}/commits?path=${GITHUB_IG_PATH}&per_page=1`
}

type Stocks = Map<string, Map<number, Map<number, number>>>

/** iso2 -> year -> quarter -> stock. Rows that do not parse as integers are skipped. */
export function parseRepositories(csv: string): Stocks {
  const rows = parseCsv(csv, ['repositories', 'iso2_code', 'year', 'quarter'], GITHUB_IG_PUBLISHER)
  const out: Stocks = new Map()
  for (const row of rows) {
    const iso2 = (row.iso2_code ?? '').trim().toUpperCase()
    const value = Number(row.repositories)
    const year = Number(row.year)
    const quarter = Number(row.quarter)
    if (!/^[A-Z]{2}$/.test(iso2)) continue
    if (!Number.isInteger(value) || !Number.isInteger(year) || !Number.isInteger(quarter)) continue
    const years = out.get(iso2) ?? new Map<number, Map<number, number>>()
    const quarters = years.get(year) ?? new Map<number, number>()
    quarters.set(quarter, value)
    years.set(year, quarters)
    out.set(iso2, years)
  }
  return out
}

/**
 * Turn the file into observations. Pure. The window closes at the latest Q1
 * any benchmark country holds; a country without both ends of the window is
 * unavailable, not held. The gate runs on every country that has both.
 */
export function buildGithubObservations(
  csv: string,
  opts: { commit?: string; retrievedAt?: string } = {},
): GithubResult {
  const commit = opts.commit ?? GITHUB_IG_COMMIT
  const retrievedAt = opts.retrievedAt ?? new Date().toISOString()
  const stocks = parseRepositories(csv)
  const byIso2 = new Map(COUNTRIES.map((country) => [country.iso2.toUpperCase(), country.iso3]))
  const unmapped = [...stocks.keys()].filter((iso2) => !byIso2.has(iso2)).sort()

  let latestYear = -Infinity
  let latestQuarter = { year: -Infinity, quarter: 0 }
  for (const country of COUNTRIES) {
    for (const [year, quarters] of stocks.get(country.iso2.toUpperCase()) ?? []) {
      if (quarters.has(1)) latestYear = Math.max(latestYear, year)
      for (const quarter of quarters.keys()) {
        if (year > latestQuarter.year || (year === latestQuarter.year && quarter > latestQuarter.quarter)) {
          latestQuarter = { year, quarter }
        }
      }
    }
  }
  if (!Number.isFinite(latestYear)) throw new Error(`${GITHUB_IG_PUBLISHER}: no Q1 stock for any benchmark country`)
  const to = latestYear
  const from = to - 1

  const q1Stocks: Record<string, Record<string, number>> = {}
  type Row = { iso3: string; start: number; end: number; growth: number; changes: Array<{ to: number; change: number }> }
  const rows: Row[] = []
  for (const country of COUNTRIES) {
    const years = stocks.get(country.iso2.toUpperCase())
    if (!years) continue
    const q1 = [...years.entries()]
      .filter(([, quarters]) => quarters.has(1))
      .map(([year, quarters]) => [year, quarters.get(1)!] as const)
      .sort((a, b) => a[0] - b[0])
    if (q1.length === 0) continue
    q1Stocks[country.iso3] = Object.fromEntries(q1.map(([year, value]) => [String(year), value]))
    const start = years.get(from)?.get(1)
    const end = years.get(to)?.get(1)
    if (start === undefined || end === undefined || start <= 0) continue
    const changes: Array<{ to: number; change: number }> = []
    for (let i = 1; i < q1.length; i += 1) {
      if (q1[i]![0] === q1[i - 1]![0] + 1) changes.push({ to: q1[i]![0], change: q1[i]![1] - q1[i - 1]![1] })
    }
    rows.push({ iso3: country.iso3, start, end, growth: (end - start) / start, changes })
  }
  if (rows.length === 0) throw new Error(`${GITHUB_IG_PUBLISHER}: no benchmark country has both ends of ${from} Q1 to ${to} Q1`)

  const medianGrowth = median(rows.map((row) => row.growth))
  const threshold = GITHUB_IG_GATE.stallFraction * medianGrowth
  const medianGrowthPct = round(100 * medianGrowth, 1)
  const thresholdPct = round(100 * threshold, 1)

  const observations: Observation[] = []
  const held: GithubHeld[] = []
  for (const row of rows) {
    const growthPct = round(100 * row.growth, 1)
    if (row.growth < threshold) {
      const fell = row.changes.filter((c) => c.change < 0).length
      held.push({
        iso3: row.iso3,
        reason: 'stalled_stock',
        growthPct,
        thresholdPct,
        changes: row.changes,
        detail: [
          `public repository stock grew ${growthPct}% from ${from} Q1 to ${to} Q1, under the gate's ${thresholdPct}%`,
          `(a quarter of the benchmark median, ${medianGrowthPct}%)`,
          `and fell in ${fell} of ${row.changes.length} year-on-year windows;`,
          'a stock that stalls while the platform grows elsewhere reads access to GitHub, not projects started',
        ].join(' '),
      })
      continue
    }
    const change = row.end - row.start
    observations.push({
      indicatorId: GITHUB_IG_INDICATOR_ID,
      iso3: row.iso3,
      geometry: 'national',
      reconciliation: 'context_only',
      value: change,
      year: to,
      sourceTier: 'academic_survey',
      sourceUrl: githubBlobUrl(commit),
      retrievedAt,
      note: [
        `${GITHUB_IG_PUBLISHER} ${GITHUB_IG_PATH} at ${commit.slice(0, 12)}: public repositories ${row.end} at ${to} Q1 less ${row.start} at ${from} Q1`,
        `stock growth ${growthPct}% (benchmark median ${medianGrowthPct}%)`,
        'net of deletions and relocations; location is the modal IP location of members with triage access',
        'value is a count, divided by SP.POP.TOTL in scoring',
        `passed the D145 access gate; ${GITHUB_IG_LICENCE}.`,
      ].join('; '),
    })
  }

  observations.sort((a, b) => a.iso3.localeCompare(b.iso3))
  held.sort((a, b) => a.iso3.localeCompare(b.iso3))
  const quarterLabel = `${latestQuarter.year} Q${latestQuarter.quarter}`
  return {
    adapterId: GITHUB_IG_ADAPTER_ID,
    observations,
    availableCountries: rows.map((row) => row.iso3).sort(),
    emittedCountries: observations.map((observation) => observation.iso3),
    heldCountries: held.map((h) => h.iso3),
    unmappedLabels: unmapped,
    sourceUrl: githubBlobUrl(commit),
    release: `${GITHUB_IG_REPOSITORY}@${commit.slice(0, 12)}, ${from} Q1 to ${to} Q1`,
    held,
    pin: {
      adapterId: GITHUB_IG_ADAPTER_ID,
      repository: GITHUB_IG_REPOSITORY,
      commit,
      path: GITHUB_IG_PATH,
      rawUrl: githubRawUrl(commit),
      retrievedAt,
      licence: GITHUB_IG_LICENCE,
      latestQuarter: quarterLabel,
      window: { from, to, quarter: 1 },
      gate: { stallFraction: GITHUB_IG_GATE.stallFraction, medianGrowthPct, thresholdPct },
      q1Stocks,
    },
  }
}

export type GithubFetchOptions = {
  /** A full commit SHA, or `latest` to resolve the newest commit touching the file. */
  commit?: string
  retrievedAt?: string
  fetchImpl?: typeof fetch
}

/** Resolve `latest` to a SHA through the GitHub API. Anything else must already be a full SHA. */
export async function resolveGithubCommit(commit: string, doFetch: typeof fetch = fetch): Promise<string> {
  if (commit !== 'latest') {
    if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error(`${GITHUB_IG_PUBLISHER}: "${commit}" is not a full commit SHA`)
    return commit
  }
  const response = await doFetch(githubLatestCommitUrl(), { headers: { Accept: 'application/vnd.github+json' } })
  if (!response.ok) throw new Error(`${GITHUB_IG_PUBLISHER}: HTTP ${response.status} resolving the latest commit`)
  const body = (await response.json()) as Array<{ sha?: unknown }>
  const sha = Array.isArray(body) ? body[0]?.sha : undefined
  if (typeof sha !== 'string' || !/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`${GITHUB_IG_PUBLISHER}: no commit found for ${GITHUB_IG_PATH}`)
  }
  return sha
}

/** Read the pinned CSV at one commit and build the observations. */
export async function fetchGithubNewRepositories(opts: GithubFetchOptions = {}): Promise<GithubResult> {
  const doFetch = opts.fetchImpl ?? fetch
  const commit = await resolveGithubCommit(opts.commit ?? GITHUB_IG_COMMIT, doFetch)
  const response = await doFetch(githubRawUrl(commit))
  if (!response.ok) throw new Error(`${GITHUB_IG_PUBLISHER}: HTTP ${response.status} for ${githubRawUrl(commit)}`)
  const csv = await response.text()
  return buildGithubObservations(csv, { commit, retrievedAt: opts.retrievedAt ?? new Date().toISOString() })
}
