import { readdir, readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { COUNTRY_ISO3, DIMENSIONS, INDICATORS_BY_ID } from '../model/index.js'
import { DelphiRunFile, EvidenceFile } from '../model/schema.js'
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
    } else if (def.ingest !== 'gap') {
      problems.push({
        file,
        severity: 'warning',
        problem: `${record.id}: ${record.indicatorId} is measured, so the record adds nothing the score does not already carry`,
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
  return problems
}
