import { INDICATORS } from '../model/index.js'
import type {
  CountryResult,
  DelphiApplication,
  DelphiRunFile,
  Dimension,
} from '../model/index.js'
import { DELPHI_PROMPT_VERSION, cellBriefHash, indicatorAuditHash } from './prompts.js'

/** The major component of a semantic version, or null when it does not parse. */
export function majorOf(version: string | undefined): number | null {
  const m = /^(\d+)\.\d+\.\d+/.exec(version ?? '')
  return m ? Number(m[1]) : null
}

export type AppliedDelphi = {
  /** The run restricted to what applies, with its `application` record. Null when none applies. */
  run: DelphiRunFile | null
  /** Why a run did not apply at all. Null when it did, or when there was no run. */
  refusal: 'no_version' | 'other_major' | 'other_prompt_version' | null
}

/**
 * Decide which of a run's estimates apply to the current dataset. See D160.
 *
 * - Same dataset version: every estimate applies, as before.
 * - Same major version and same prompt version: an estimate applies only if
 *   the evidence brief the current dataset would show for its country and
 *   dimension hashes to the `briefHash` stored with it. A cell whose evidence
 *   moved is dropped and listed; a cell with no stored hash is dropped too,
 *   because nothing says what the panelist read.
 * - A different major version, or a different prompt version, never carries.
 *   A major version rebases the frame (D47), so the same words can sit on a
 *   different ruler, and D139 and D153 hold that no estimate crosses it.
 *
 * `results` must be scored without the run: the brief reads the indicator
 * rows, the indicator-derived score and the confidence parts, none of which a
 * panel estimate touches.
 */
export function applyDelphiRun(
  run: DelphiRunFile,
  results: readonly CountryResult[],
  datasetVersion: string,
): AppliedDelphi {
  const cellKey = (iso3: string, dimension: string) => `${iso3}/${dimension}`
  const cells = new Set(run.cellEstimates.map((e) => cellKey(e.iso3, e.dimension)))

  if (run.datasetVersion === datasetVersion) {
    const application: DelphiApplication = {
      datasetVersion,
      sourceDatasetVersion: run.datasetVersion,
      mode: 'exact',
      cells: cells.size,
      carried: cells.size,
      dropped: [],
      judgementsCarried: run.indicatorJudgements.length,
      judgementsDropped: 0,
    }
    return { run: { ...run, application }, refusal: null }
  }

  const major = majorOf(datasetVersion)
  const runMajor = majorOf(run.datasetVersion)
  if (runMajor === null || major === null) return { run: null, refusal: 'no_version' }
  if (runMajor !== major) return { run: null, refusal: 'other_major' }
  if (run.promptVersion !== DELPHI_PROMPT_VERSION) return { run: null, refusal: 'other_prompt_version' }

  const byIso = new Map(results.map((r) => [r.iso3, r]))
  const hashes = new Map<string, string>()
  const currentHash = (iso3: string, dimension: Dimension): string | null => {
    const key = cellKey(iso3, dimension)
    const cached = hashes.get(key)
    if (cached) return cached
    const result = byIso.get(iso3)
    if (!result || !result.dimensions[dimension]) return null
    const h = cellBriefHash(result, dimension)
    hashes.set(key, h)
    return h
  }

  /* One verdict per cell, taken from the stored hashes of its estimates. A cell
   * carries only if every one of its estimates agrees with the current brief. */
  const verdict = new Map<string, 'ok' | 'brief_changed' | 'no_hash'>()
  for (const e of run.cellEstimates) {
    const key = cellKey(e.iso3, e.dimension)
    const prior = verdict.get(key)
    if (prior === 'no_hash') continue
    if (!e.briefHash) {
      verdict.set(key, 'no_hash')
      continue
    }
    const now = currentHash(e.iso3, e.dimension as Dimension)
    if (now !== e.briefHash) verdict.set(key, 'brief_changed')
    else if (!prior) verdict.set(key, 'ok')
  }

  const cellEstimates = run.cellEstimates.filter(
    (e) => verdict.get(cellKey(e.iso3, e.dimension)) === 'ok',
  )
  const dropped = [...verdict.entries()]
    .filter(([, v]) => v !== 'ok')
    .map(([key, reason]) => {
      const [iso3, dimension] = key.split('/') as [string, Dimension]
      return { iso3, dimension, reason: reason as 'brief_changed' | 'no_hash' }
    })
    .sort((a, b) => a.dimension.localeCompare(b.dimension) || a.iso3.localeCompare(b.iso3))

  const dimensionOf = new Map(INDICATORS.map((d) => [d.id, d.dimension as Dimension]))
  const auditNow = new Map<Dimension, string>()
  const indicatorJudgements = run.indicatorJudgements.filter((j) => {
    const dimension = dimensionOf.get(j.indicatorId)
    if (!dimension || !j.auditHash) return false
    const now = auditNow.get(dimension) ?? indicatorAuditHash(dimension)
    auditNow.set(dimension, now)
    return now === j.auditHash
  })

  const application: DelphiApplication = {
    datasetVersion,
    sourceDatasetVersion: run.datasetVersion ?? null,
    mode: 'carried',
    cells: cells.size,
    carried: cells.size - dropped.length,
    dropped,
    judgementsCarried: indicatorJudgements.length,
    judgementsDropped: run.indicatorJudgements.length - indicatorJudgements.length,
  }
  return { run: { ...run, cellEstimates, indicatorJudgements, application }, refusal: null }
}
