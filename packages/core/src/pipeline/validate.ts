import { readdir, readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { COUNTRY_ISO3, DIMENSIONS, INDICATORS_BY_ID, isScored } from '../model/index.js'
import { DelphiRunFile, EvidenceFile, isReversal } from '../model/schema.js'
import { DELPHI_DIR, FILES } from './paths.js'

export type Problem = { file: string; severity: 'error' | 'warning'; problem: string }

/**
 * Schema-checks every Delphi run on disk and reports coverage holes. Hand-authored
 * runs are legitimate — an in-session or human panel is written by hand — so this
 * exists to catch the mistakes that come with that: a mistyped ISO code, a missing
 * dimension, an unknown indicator id, a run with no provenance.
 */
export async function validateDelphiRuns(dir = DELPHI_DIR): Promise<Problem[]> {
  const problems: Problem[] = []
  let entries: string[]
  try {
    entries = (await readdir(dir)).filter((f) => f.endsWith('.json'))
  } catch {
    return [{ file: dir, severity: 'warning', problem: 'no delphi directory yet' }]
  }
  if (entries.length === 0) {
    return [{ file: dir, severity: 'warning', problem: 'no delphi runs on disk' }]
  }

  for (const entry of entries) {
    const file = basename(entry)
    let raw: unknown
    try {
      raw = JSON.parse(await readFile(resolve(dir, entry), 'utf8'))
    } catch (err) {
      problems.push({
        file,
        severity: 'error',
        problem: `unreadable JSON: ${err instanceof Error ? err.message : String(err)}`,
      })
      continue
    }

    const parsed = DelphiRunFile.safeParse(raw)
    if (!parsed.success) {
      for (const issue of parsed.error.issues.slice(0, 5)) {
        problems.push({
          file,
          severity: 'error',
          problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        })
      }
      continue
    }
    const run = parsed.data

    const badIso = [...new Set(run.cellEstimates.map((e) => e.iso3))].filter(
      (iso3) => !COUNTRY_ISO3.includes(iso3 as never),
    )
    for (const iso3 of badIso) {
      problems.push({ file, severity: 'error', problem: `unknown country code ${iso3}` })
    }

    const badIndicator = [
      ...new Set(run.indicatorJudgements.map((j) => j.indicatorId)),
    ].filter((id) => !INDICATORS_BY_ID[id])
    for (const id of badIndicator) {
      problems.push({ file, severity: 'error', problem: `unknown indicator id ${id}` })
    }

    const covered = new Set(run.cellEstimates.map((e) => `${e.iso3}|${e.dimension}`))
    const expected = COUNTRY_ISO3.length * DIMENSIONS.length
    if (covered.size < expected) {
      problems.push({
        file,
        severity: 'warning',
        problem: `covers ${covered.size} of ${expected} country-dimension cells`,
      })
    }

    for (let round = 1; round <= run.rounds; round++) {
      if (!run.cellEstimates.some((e) => e.round === round)) {
        problems.push({
          file,
          severity: 'error',
          problem: `declares ${run.rounds} rounds but has no estimates for round ${round}`,
        })
      }
    }

    if (run.provenance !== 'mock' && run.panel.length < 3) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${run.panel.length} panelist(s): no distribution, so IQR and dissent are meaningless`,
      })
    }
    if (!run.note) {
      problems.push({
        file,
        severity: 'warning',
        problem: 'no note explaining how this run was produced',
      })
    }
  }

  return problems
}

/**
 * Schema-checks the evidence records and reports the mistakes this layer
 * invites: a record filed against an indicator that is already measured, a
 * duplicate id, an unknown country, a source that cannot be opened.
 *
 * An evidence record is hand-written by design, so it gets the same treatment
 * as a hand-authored Delphi run.
 */
export async function validateEvidence(path = FILES.evidence): Promise<Problem[]> {
  const file = basename(path)
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return [{ file, severity: 'warning', problem: 'no evidence file yet' }]
  }

  const parsed = EvidenceFile.safeParse(raw)
  if (!parsed.success) {
    return parsed.error.issues.slice(0, 5).map((issue) => ({
      file,
      severity: 'error' as const,
      problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
    }))
  }

  const problems: Problem[] = []
  const seen = new Set<string>()
  for (const record of parsed.data.records) {
    if (seen.has(record.id)) {
      problems.push({ file, severity: 'error', problem: `duplicate record id ${record.id}` })
    }
    seen.add(record.id)

    const def = INDICATORS_BY_ID[record.indicatorId]
    if (!def) {
      problems.push({
        file,
        severity: 'error',
        problem: `${record.id}: unknown indicator id ${record.indicatorId}`,
      })
    } else if (isScored(def)) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${record.id}: ${record.indicatorId} is measured, so the record adds nothing the score does not already carry`,
      })
    }

    if (!record.pattern) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${record.id}: no mechanism recorded, so the case cannot travel`,
      })
    }

    if (record.status === 'eroded' && !record.secondMetric) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${record.id}: eroded with no second metric, so the loss has no peak to be measured against`,
      })
    }

    if (!COUNTRY_ISO3.includes(record.iso3 as never)) {
      problems.push({
        file,
        severity: 'error',
        problem: `${record.id}: unknown country code ${record.iso3}`,
      })
    }
  }

  // D33: for every five records, at least one documents a reversal. A corpus
  // of pure successes is a brochure, and this is the only place that can count.
  const records = parsed.data.records
  const reversals = records.filter((r) => isReversal(r.status)).length
  const required = Math.floor(records.length / 5)
  if (reversals < required) {
    problems.push({
      file,
      severity: 'warning',
      problem: `${reversals} reversal(s) in ${records.length} records; D33 asks for one in five, so the next records must document erosion or dismantling`,
    })
  }

  return problems
}

/**
 * Live-checks every evidence source URL. An evidence record claims its URL
 * opens and carries the number; agencies reorganise and pages move, so that
 * claim decays silently — one record's publisher was renamed and re-domained
 * within a year of publishing the number. This is the only check that needs
 * the network, so it runs behind `validate --fetch` rather than by default.
 *
 * Reading the verdicts:
 * - 404 or 410 is an error: the page is gone and the record's URL claim is false.
 * - Any other failure (403, 5xx, timeout, DNS) is a warning: from here, a
 *   server that blocks non-browser clients is indistinguishable from a dead
 *   one, and several corpus sources 403 exactly this kind of request. Check
 *   those by hand before touching the record.
 * - A redirect that lands 200 on another host is a warning: the number may
 *   still be there, but the record should cite where the page lives now.
 *
 * The corpus holds slow publishers: ipeadata.gov.br has taken 14s and
 * pmjdy.gov.in 10s in a measured run. The ceiling is therefore 30s, four
 * requests run at a time, and a request that fails the network rather than
 * answering is tried once more. Without that, a warning list changed on every
 * run and named a different half of the corpus each time.
 */
export async function checkEvidenceUrls(
  path = FILES.evidence,
  opts: { timeoutMs?: number; concurrency?: number; retries?: number } = {},
): Promise<Problem[]> {
  const file = basename(path)
  const timeoutMs = opts.timeoutMs ?? 30_000
  const concurrency = opts.concurrency ?? 4
  const retries = opts.retries ?? 1

  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return [{ file, severity: 'warning', problem: 'no evidence file yet' }]
  }
  const parsed = EvidenceFile.safeParse(raw)
  if (!parsed.success) {
    return [{ file, severity: 'error', problem: 'evidence file does not parse; run plain validate first' }]
  }

  // One request per unique URL; several records may share a publisher page.
  const byUrl = new Map<string, string[]>()
  for (const record of parsed.data.records) {
    const ids = byUrl.get(record.source.url) ?? []
    ids.push(record.id)
    byUrl.set(record.source.url, ids)
  }

  const host = (u: string) => new URL(u).hostname.replace(/^www\./, '')

  /**
   * One request. Returns a verdict, or a network failure for the caller to
   * retry. An abort and a refused connection are different facts, so they are
   * reported as different things.
   */
  async function attempt(url: string, who: string): Promise<Problem | null | { failure: string }> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          // A bare node UA trips bot-blocking on several statistical sites.
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          accept: 'text/html,application/xhtml+xml,application/pdf,application/json,*/*',
        },
      })
      // Headers are the verdict; do not download the body (some sources are multi-MB PDFs).
      await res.body?.cancel().catch(() => {})
      if (res.status === 404 || res.status === 410) {
        return { file, severity: 'error', problem: `${who}: source URL is gone (${res.status}) — find where the page moved, re-verify the number, update url and retrievedAt` }
      }
      if (!res.ok) {
        return { file, severity: 'warning', problem: `${who}: source URL answered ${res.status} — possibly bot-blocking, check in a browser before touching the record` }
      }
      if (res.url && host(res.url) !== host(url)) {
        return { file, severity: 'warning', problem: `${who}: source URL redirects to ${new URL(res.url).hostname} — the page moved hosts, update the record to cite where it lives now` }
      }
      return null
    } catch (err) {
      /* Name what actually happened. `fetch` reports a timeout as an abort and
       * everything else as a TypeError carrying the real code, so a message
       * that says "timed out" for all of them describes the wrong problem. */
      const aborted = controller.signal.aborted
      const cause = (err as { cause?: { code?: string } }).cause?.code
      return {
        failure: aborted
          ? `did not answer within ${timeoutMs / 1000}s`
          : `did not answer (${cause ?? (err as Error).name})`,
      }
    } finally {
      clearTimeout(timer)
    }
  }

  async function check(url: string, ids: string[]): Promise<Problem | null> {
    const who = ids.join(', ')
    let failure = ''
    for (let tries = 0; tries <= retries; tries++) {
      if (tries > 0) await new Promise((r) => setTimeout(r, 1_000))
      const result = await attempt(url, who)
      if (result === null || 'severity' in result) return result
      failure = result.failure
    }
    const attempts = retries + 1
    return {
      file,
      severity: 'warning',
      problem: `${who}: source URL ${failure}${attempts > 1 ? `, ${attempts} times` : ''} — network failure or a hung server, check in a browser before touching the record`,
    }
  }

  const entries = [...byUrl.entries()]
  const problems: Problem[] = []
  let next = 0
  const workers = Array.from({ length: Math.min(concurrency, entries.length) }, async () => {
    while (next < entries.length) {
      const [url, ids] = entries[next++] as [string, string[]]
      const problem = await check(url, ids)
      if (problem) problems.push(problem)
    }
  })
  await Promise.all(workers)
  return problems
}
