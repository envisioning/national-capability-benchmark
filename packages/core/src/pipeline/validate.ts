import { readdir, readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import {
  BR_STATES,
  COUNTRY_ISO3,
  DIMENSIONS,
  INDICATORS_BY_ID,
  isScored,
  SubnationalFile,
  SubnationalIndexFile,
  SUBNATIONAL_SERIES,
} from '../model/index.js'
import {
  GLOBAL_ID_PREFIX,
  GlobalInstitutionLedger,
  InstitutionNetworkFile,
} from '../model/institutions.js'
import { DelphiRunFile, EvidenceFile, isEvidential, isPanel, isReversal } from '../model/schema.js'
import { ResearchRunFile, ResearchScoutRunFile } from '../model/research.js'
import { DELPHI_DIR, FILES, RESEARCH_RUNS_DIR, subnationalFile } from './paths.js'
import { recomposeSubnational } from './br-subnational.js'

export type Problem = { file: string; severity: 'error' | 'warning'; problem: string }

/**
 * Validates the published subnational registry and its files. This layer is
 * deliberately separate from the national score: it checks its own source,
 * unit coverage and reconciliation math, but never feeds observations into
 * `buildFrame`.
 */
export async function validateSubnational(
  indexPath = FILES.subnationalIndex,
): Promise<Problem[]> {
  const file = basename(indexPath)
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(indexPath, 'utf8'))
  } catch {
    return [{ file, severity: 'warning', problem: 'no subnational index yet' }]
  }

  const parsedIndex = SubnationalIndexFile.safeParse(raw)
  if (!parsedIndex.success) {
    return parsedIndex.error.issues.slice(0, 8).map((issue) => ({
      file,
      severity: 'error' as const,
      problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
    }))
  }

  const problems: Problem[] = []
  const expected = new Map(
    SUBNATIONAL_SERIES.map((series) => [`${series.iso3}|${series.indicatorId}`, series]),
  )
  const seen = new Set<string>()

  const rounded = (value: number) => Number(value.toFixed(3))
  for (const entry of parsedIndex.data.files) {
    const key = `${entry.iso3}|${entry.indicatorId}`
    if (seen.has(key)) {
      problems.push({ file, severity: 'error', problem: `duplicate subnational entry ${key}` })
      continue
    }
    seen.add(key)
    const definition = expected.get(key)
    if (!definition) {
      problems.push({ file, severity: 'error', problem: `unregistered subnational entry ${key}` })
      continue
    }

    const expectedPath = `subnational/${entry.iso3}/${entry.indicatorId}.json`
    if (entry.path !== expectedPath) {
      problems.push({ file, severity: 'error', problem: `${key}: index path must be ${expectedPath}` })
    }

    const subnationalPath = subnationalFile(entry.iso3, entry.indicatorId)
    let rawSubnational: unknown
    try {
      rawSubnational = JSON.parse(await readFile(subnationalPath, 'utf8'))
    } catch {
      problems.push({ file: subnationalPath, severity: 'error', problem: 'file named by index is missing or unreadable' })
      continue
    }
    const parsedSubnational = SubnationalFile.safeParse(rawSubnational)
    if (!parsedSubnational.success) {
      for (const issue of parsedSubnational.error.issues.slice(0, 8)) {
        problems.push({
          file: subnationalPath,
          severity: 'error',
          problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        })
      }
      continue
    }
    const subnational = parsedSubnational.data

    for (const [field, actual, expectedValue] of [
      ['indicatorId', subnational.indicatorId, definition.indicatorId],
      ['iso3', subnational.iso3, definition.iso3],
      ['geometry', subnational.geometry, definition.geometry],
      ['reconciliation', subnational.reconciliation, definition.reconciliation],
      ['denominator', subnational.denominator, definition.denominator],
      ['unit', subnational.unit, definition.unit],
      ['direction', subnational.direction, definition.direction],
      ['transform', subnational.transform, definition.transform],
    ] as const) {
      if (actual !== expectedValue) {
        problems.push({
          file: subnationalPath,
          severity: 'error',
          problem: `${field} ${String(actual)} disagrees with registry ${String(expectedValue)}`,
        })
      }
    }

    if (subnational.geometry === 'state' && subnational.iso3 === 'BRA') {
      if (subnational.units.length !== BR_STATES.length) {
        problems.push({
          file: subnationalPath,
          severity: 'error',
          problem: `expected ${BR_STATES.length} Brazilian state units, found ${subnational.units.length}`,
        })
      }
      const states = new Map(BR_STATES.map((state) => [`BR-${state.iso}`, state]))
      for (const unit of subnational.units) {
        const state = states.get(unit.iso)
        if (!state) {
          problems.push({ file: subnationalPath, severity: 'error', problem: `unknown Brazilian unit ${unit.iso}` })
          continue
        }
        if (unit.name !== state.name) {
          problems.push({ file: subnationalPath, severity: 'error', problem: `${unit.iso}: name disagrees with state registry` })
        }
        if (unit.year !== subnational.national.year) {
          problems.push({ file: subnationalPath, severity: 'error', problem: `${unit.iso}: year differs from national value` })
        }
        if (subnational.denominator === 'population' && unit.denominatorValue !== state.population) {
          problems.push({ file: subnationalPath, severity: 'error', problem: `${unit.iso}: population denominator disagrees with state registry` })
        }
      }
    }

    if (subnational.denominator === 'population' && !subnational.denominatorSource) {
      problems.push({ file: subnationalPath, severity: 'error', problem: 'population denominator has no source' })
    }

    let recomposed: number | null = null
    try {
      recomposed = recomposeSubnational(subnational.units, subnational.denominator)
    } catch (error) {
      problems.push({
        file: subnationalPath,
        severity: 'error',
        problem: error instanceof Error ? error.message : String(error),
      })
    }
    const expectedRecomposed = recomposed === null ? null : rounded(recomposed)
    if (subnational.check.recomposed !== expectedRecomposed) {
      problems.push({
        file: subnationalPath,
        severity: 'error',
        problem: `check.recomposed ${subnational.check.recomposed} does not match calculated ${expectedRecomposed}`,
      })
    }
    if (subnational.check.national !== subnational.national.value) {
      problems.push({
        file: subnationalPath,
        severity: 'error',
        problem: `check.national ${subnational.check.national} does not match national.value ${subnational.national.value}`,
      })
    }
    const expectedResidual = expectedRecomposed === null ? null : rounded(expectedRecomposed - subnational.check.national)
    if (subnational.check.residual !== expectedResidual) {
      problems.push({
        file: subnationalPath,
        severity: 'error',
        problem: `check.residual ${subnational.check.residual} does not match calculated ${expectedResidual}`,
      })
    }
    if (subnational.reconciliation === 'aggregate') {
      if (subnational.check.residual === null || Math.abs(subnational.check.residual) > subnational.check.tolerance) {
        problems.push({
          file: subnationalPath,
          severity: 'error',
          problem: `aggregate reconciliation residual ${subnational.check.residual ?? 'null'} exceeds tolerance ${subnational.check.tolerance}`,
        })
      }
    }

    if (entry.year !== subnational.national.year || entry.units !== subnational.units.length || entry.residual !== subnational.check.residual) {
      problems.push({ file, severity: 'error', problem: `${key}: index summary disagrees with published file` })
    }
  }

  for (const key of expected.keys()) {
    if (!seen.has(key)) problems.push({ file, severity: 'error', problem: `registry series ${key} is missing from index` })
  }
  return problems
}

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

    const declaredCountries = run.countrySet && run.countrySet.length > 0 ? run.countrySet : COUNTRY_ISO3
    const badDeclaredIso = declaredCountries.filter(
      (iso3) => !COUNTRY_ISO3.includes(iso3 as never),
    )
    for (const iso3 of badDeclaredIso) {
      problems.push({ file, severity: 'error', problem: `unknown declared country code ${iso3}` })
    }

    const badIndicator = [
      ...new Set(run.indicatorJudgements.map((j) => j.indicatorId)),
    ].filter((id) => !INDICATORS_BY_ID[id])
    for (const id of badIndicator) {
      problems.push({ file, severity: 'error', problem: `unknown indicator id ${id}` })
    }

    const covered = new Set(run.cellEstimates.map((e) => `${e.iso3}|${e.dimension}`))
    const expected = declaredCountries.length * DIMENSIONS.length
    if (covered.size < expected) {
      problems.push({
        file,
        severity: 'warning',
        problem:
          (run.maxCoverage ?? 1) < 1
            ? `partial run covers ${covered.size} of ${expected} selected country-dimension cells at coverage ceiling ${run.maxCoverage}`
            : `covers ${covered.size} of ${expected} country-dimension cells`,
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

    if (run.failedCalls && run.failedCalls > 0) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${run.failedCalls} of ${run.attemptedCalls ?? 0} provider calls failed: affected cells carry fewer panelists and their IQR understates disagreement`,
      })
    }

    const perCell = new Map<string, Set<string>>()
    for (const e of run.cellEstimates) {
      const key = `${e.iso3}|${e.dimension}|${e.round}`
      const seen = perCell.get(key) ?? new Set<string>()
      seen.add(e.panelist)
      perCell.set(key, seen)
    }
    const short = [...perCell.values()].filter((seen) => seen.size < run.panel.length).length
    if (short > 0 && run.panel.length > 1) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${short} cell-round(s) have fewer than the declared ${run.panel.length} panelists`,
      })
    }

    if (isEvidential(run.provenance) && !isPanel(run)) {
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

  const countryCounts = new Map<string, number>()
  for (const record of records) {
    countryCounts.set(record.iso3, (countryCounts.get(record.iso3) ?? 0) + 1)
  }
  const countryCeiling = Math.floor(records.length / 3)
  for (const [iso3, count] of countryCounts) {
    if (records.length >= 3 && count > countryCeiling) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${iso3} has ${count} of ${records.length} records; D33's one-third country ceiling is ${countryCeiling}, so new research should move elsewhere`,
      })
    }
  }

  return problems
}

/**
 * Validates AI research artifacts without treating them as evidence. The
 * scout and critique runs are deliberately separate from records.json: an AI
 * can generate useful search work while the publication gate remains human
 * and source-grounded.
 */
export async function validateResearchRuns(dir = RESEARCH_RUNS_DIR): Promise<Problem[]> {
  let entries: string[]
  try {
    entries = (await readdir(dir)).filter((entry) => entry.endsWith('.json')).sort()
  } catch {
    return []
  }
  const problems: Problem[] = []

  for (const entry of entries) {
    const file = basename(entry)
    let raw: unknown
    try {
      raw = JSON.parse(await readFile(resolve(dir, entry), 'utf8'))
    } catch (error) {
      problems.push({
        file,
        severity: 'error',
        problem: `unreadable JSON: ${error instanceof Error ? error.message : String(error)}`,
      })
      continue
    }

    const parsed = ResearchRunFile.safeParse(raw)
    if (!parsed.success) {
      for (const issue of parsed.error.issues.slice(0, 8)) {
        problems.push({
          file,
          severity: 'error',
          problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        })
      }
      continue
    }

    const run = parsed.data
    if (run.provenance === 'mock') {
      problems.push({ file, severity: 'warning', problem: 'offline scaffold; not evidence' })
    }
    if (new Set(run.countrySet).size !== run.countrySet.length) {
      problems.push({ file, severity: 'error', problem: 'duplicate country code in declared country set' })
    }
    const badDeclaredIso = run.countrySet.filter(
      (iso3) => !COUNTRY_ISO3.includes(iso3 as never),
    )
    for (const iso3 of badDeclaredIso) {
      problems.push({ file, severity: 'error', problem: `unknown declared country code ${iso3}` })
    }
    if (run.kind === 'scout') {
      const slotKeys = new Set<string>()
      for (const slot of run.slots) {
        const key = `${slot.iso3}|${slot.indicatorId}`
        if (slotKeys.has(key)) {
          problems.push({ file, severity: 'error', problem: `duplicate research slot ${key}` })
        }
        slotKeys.add(key)
        const def = INDICATORS_BY_ID[slot.indicatorId]
        if (!def) {
          problems.push({ file, severity: 'error', problem: `unknown indicator id ${slot.indicatorId}` })
        } else {
          if (def.ingest !== 'gap') {
            problems.push({
              file,
              severity: 'error',
              problem: `${slot.indicatorId}: research slots must target declared gaps`,
            })
          }
          if (def.dimension !== slot.dimension) {
            problems.push({
              file,
              severity: 'error',
              problem: `${slot.indicatorId}: slot dimension ${slot.dimension} disagrees with registry ${def.dimension}`,
            })
          }
        }
        if (!run.countrySet.includes(slot.iso3)) {
          problems.push({ file, severity: 'error', problem: `slot ${key} is outside the declared country set` })
        }
        if (!COUNTRY_ISO3.includes(slot.iso3 as never)) {
          problems.push({ file, severity: 'error', problem: `unknown country code ${slot.iso3}` })
        }
      }

      const candidateIds = new Set<string>()
      const candidateKeys = new Set<string>()
      for (const candidate of run.candidates) {
        if (candidateIds.has(candidate.id)) {
          problems.push({ file, severity: 'error', problem: `duplicate candidate id ${candidate.id}` })
        }
        candidateIds.add(candidate.id)
        const key = `${candidate.iso3}|${candidate.indicatorId}`
        if (candidateKeys.has(key)) {
          problems.push({ file, severity: 'error', problem: `duplicate candidate target ${key}` })
        }
        candidateKeys.add(key)
        if (!slotKeys.has(key)) {
          problems.push({ file, severity: 'error', problem: `${candidate.id}: target is outside the scout slots` })
        }
        if (!run.countrySet.includes(candidate.iso3)) {
          problems.push({ file, severity: 'error', problem: `${candidate.id}: target is outside the declared country set` })
        }
        if (!COUNTRY_ISO3.includes(candidate.iso3 as never)) {
          problems.push({ file, severity: 'error', problem: `${candidate.id}: unknown country code ${candidate.iso3}` })
        }
        const def = INDICATORS_BY_ID[candidate.indicatorId]
        if (!def) {
          problems.push({ file, severity: 'error', problem: `${candidate.id}: unknown indicator id ${candidate.indicatorId}` })
        } else if (def.ingest !== 'gap') {
          problems.push({
            file,
            severity: 'error',
            problem: `${candidate.id}: candidate must target a declared gap`,
          })
        }
      }
      for (const key of slotKeys) {
        if (!candidateKeys.has(key)) {
          problems.push({ file, severity: 'error', problem: `missing candidate for scout slot ${key}` })
        }
      }
    } else {
      let scout: ReturnType<typeof ResearchScoutRunFile.parse> | null = null
      try {
        const scoutRaw = JSON.parse(
          await readFile(resolve(dir, `${run.scoutRunId}.json`), 'utf8'),
        )
        const parsedScout = ResearchScoutRunFile.safeParse(scoutRaw)
        if (!parsedScout.success) {
          problems.push({
            file,
            severity: 'error',
            problem: `linked scout run ${run.scoutRunId} is not a valid scout artifact`,
          })
        } else {
          scout = parsedScout.data
          if (scout.datasetVersion !== run.datasetVersion) {
            problems.push({ file, severity: 'error', problem: 'critique and scout dataset versions differ' })
          }
          if (scout.countrySet.join(',') !== run.countrySet.join(',')) {
            problems.push({ file, severity: 'error', problem: 'critique and scout country sets differ' })
          }
        }
      } catch {
        problems.push({
          file,
          severity: 'error',
          problem: `linked scout run ${run.scoutRunId} is missing`,
        })
      }
      const reviewIds = new Set<string>()
      for (const review of run.reviews) {
        if (reviewIds.has(review.candidateId)) {
          problems.push({ file, severity: 'error', problem: `duplicate review for ${review.candidateId}` })
        }
        reviewIds.add(review.candidateId)
        if (review.verdict === 'ready_for_source_check') {
          problems.push({
            file,
            severity: 'warning',
            problem: `${review.candidateId}: ready for source check is still unpublished`,
          })
        }
      }
      for (const reviewId of reviewIds) {
        if (!reviewId) {
          problems.push({ file, severity: 'error', problem: 'critique contains an empty candidate id' })
        }
      }
      if (scout) {
        const candidateIds = new Set(scout.candidates.map((candidate) => candidate.id))
        for (const reviewId of reviewIds) {
          if (!candidateIds.has(reviewId)) {
            problems.push({ file, severity: 'error', problem: `review refers to unknown candidate ${reviewId}` })
          }
        }
        for (const candidateId of candidateIds) {
          if (!reviewIds.has(candidateId)) {
            problems.push({ file, severity: 'error', problem: `missing review for candidate ${candidateId}` })
          }
        }
      }
    }
  }

  return problems
}

/**
 * Checks the curated capability network. Official registries can provide an
 * organisational skeleton, but the explanatory edges are hand-authored, so
 * broken references and orphaned nodes need the same explicit gate as evidence
 * records and Delphi runs.
 */
export async function validateInstitutionNetwork(
  path = FILES.institutionsBrazil,
  ledgerPath = FILES.institutionsGlobal,
): Promise<Problem[]> {
  const file = basename(path)
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return [{ file, severity: 'warning', problem: 'no institutional network file yet' }]
  }

  const parsed = InstitutionNetworkFile.safeParse(raw)
  if (!parsed.success) {
    return parsed.error.issues.slice(0, 8).map((issue) => ({
      file,
      severity: 'error' as const,
      problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
    }))
  }

  /* A country edge may name a global body. Those ids resolve against the
   * ledger, and the ledger's own problems are reported by its own check. */
  const globalIds = new Set<string>()
  try {
    const ledger = GlobalInstitutionLedger.safeParse(JSON.parse(await readFile(ledgerPath, 'utf8')))
    if (ledger.success) for (const node of ledger.data.nodes) globalIds.add(node.id)
  } catch {
    /* No ledger: every global reference below is reported as unknown. */
  }

  const problems: Problem[] = []
  const network = parsed.data
  const nodeIds = new Set<string>()
  for (const node of network.nodes) {
    if (nodeIds.has(node.id)) {
      problems.push({ file, severity: 'error', problem: `duplicate institution id ${node.id}` })
    }
    nodeIds.add(node.id)
    if (node.id.startsWith(GLOBAL_ID_PREFIX)) {
      problems.push({
        file,
        severity: 'error',
        problem: `${node.id}: a global body lives in the global ledger, never in a country file`,
      })
    }
    if (node.iso3 !== network.iso3) {
      problems.push({
        file,
        severity: 'error',
        problem: `${node.id}: country ${node.iso3} does not match network ${network.iso3}`,
      })
    }
  }

  const edgeIds = new Set<string>()
  const degree = new Map(network.nodes.map((node) => [node.id, 0]))
  for (const edge of network.edges) {
    if (edgeIds.has(edge.id)) {
      problems.push({ file, severity: 'error', problem: `duplicate relation id ${edge.id}` })
    }
    edgeIds.add(edge.id)
    for (const id of [edge.sourceId, edge.targetId]) {
      if (nodeIds.has(id)) {
        degree.set(id, (degree.get(id) ?? 0) + 1)
      } else if (!globalIds.has(id)) {
        problems.push({
          file,
          severity: 'error',
          problem: `${edge.id}: unknown institution id ${id}`,
        })
      }
    }
    if (globalIds.has(edge.sourceId) && globalIds.has(edge.targetId)) {
      problems.push({
        file,
        severity: 'error',
        problem: `${edge.id}: a relation between two global bodies belongs in the global ledger`,
      })
    }
    if (edge.sourceId === edge.targetId) {
      problems.push({ file, severity: 'error', problem: `${edge.id}: relation points to itself` })
    }
  }

  for (const [id, count] of degree) {
    if (count === 0) {
      problems.push({
        file,
        severity: 'warning',
        problem: `${id}: no relation recorded, so the node explains no network`,
      })
    }
  }

  const coverageCodes = new Set<string>()
  for (const area of network.coverage) {
    if (coverageCodes.has(area.jurisdictionCode)) {
      problems.push({
        file,
        severity: 'error',
        problem: `duplicate coverage area ${area.jurisdictionCode}`,
      })
    }
    coverageCodes.add(area.jurisdictionCode)
  }

  return problems
}

/**
 * Checks the global ledger: the bodies no country owns. Ids carry the global
 * prefix so a country file cannot mint one, members are registry codes, and a
 * ledger edge joins two ledger bodies. See D107.
 */
export async function validateGlobalInstitutions(
  path = FILES.institutionsGlobal,
): Promise<Problem[]> {
  const file = basename(path)
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return [{ file, severity: 'warning', problem: 'no global institution ledger yet' }]
  }

  const parsed = GlobalInstitutionLedger.safeParse(raw)
  if (!parsed.success) {
    return parsed.error.issues.slice(0, 8).map((issue) => ({
      file,
      severity: 'error' as const,
      problem: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
    }))
  }

  const problems: Problem[] = []
  const ledger = parsed.data
  const known = new Set(COUNTRY_ISO3)
  const nodeIds = new Set<string>()
  for (const node of ledger.nodes) {
    if (nodeIds.has(node.id)) {
      problems.push({ file, severity: 'error', problem: `duplicate institution id ${node.id}` })
    }
    nodeIds.add(node.id)
    for (const member of node.members ?? []) {
      if (!known.has(member)) {
        problems.push({
          file,
          severity: 'error',
          problem: `${node.id}: member ${member} is not in the country registry`,
        })
      }
    }
    const seen = new Set(node.members ?? [])
    if (seen.size !== (node.members ?? []).length) {
      problems.push({ file, severity: 'error', problem: `${node.id}: a member is listed twice` })
    }
  }

  const edgeIds = new Set<string>()
  for (const edge of ledger.edges) {
    if (edgeIds.has(edge.id)) {
      problems.push({ file, severity: 'error', problem: `duplicate relation id ${edge.id}` })
    }
    edgeIds.add(edge.id)
    for (const id of [edge.sourceId, edge.targetId]) {
      if (!nodeIds.has(id)) {
        problems.push({
          file,
          severity: 'error',
          problem: `${edge.id}: ${id} is not in the ledger; a relation with a country's institution lives in that country's file`,
        })
      }
    }
    if (edge.sourceId === edge.targetId) {
      problems.push({ file, severity: 'error', problem: `${edge.id}: relation points to itself` })
    }
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
