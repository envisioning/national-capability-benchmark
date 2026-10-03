import {
  COUNTRY_ISO3,
  GITHUB_IG_COMMIT,
  DATASET_VERSION,
  DIMENSIONS,
  GDP_PER_CAPITA_CODE,
  INDICATORS,
  INGEST_FROM_YEAR,
  ObservationFile,
  rawHref,
} from '../model/index.js'
import type { CountryResult, DelphiRunFile, Dimension, ResidualStructure } from '../model/index.js'
import type { AppliedDelphi } from '../delphi/apply.js'
import { ingestWorldBank, recordRevisions } from '../pipeline/ingest.js'
import { fetchJointEvsWvs } from '../pipeline/adapters/joint-evs-wvs.js'
import { fetchVdem } from '../pipeline/adapters/vdem.js'
import { fetchUnctadExportConcentration } from '../pipeline/adapters/unctad.js'
import { fetchIlostatInformalEmployment, fetchIlostatLongTermUnemployment } from '../pipeline/adapters/ilostat.js'
import { fetchAtlasNewExportProducts } from '../pipeline/adapters/atlas.js'
import type { Observation } from '../model/index.js'
import { fetchOpenAlexCitationImpact } from '../pipeline/adapters/openalex.js'
import { fetchGithubNewRepositories } from '../pipeline/adapters/github.js'
import { probeSeries, registrySeries, searchCatalogue } from '../pipeline/probe.js'
import type { ProbeRequest } from '../pipeline/probe.js'
import {
  COUNTRY_OUT_DIR,
  DELPHI_DIR,
  FILES,
  INDICATOR_OUT_DIR,
  SCHEMA_OUT_DIR,
  agendaDoc,
  agendaFile,
  countryFile,
  indicatorFile,
} from '../pipeline/paths.js'
import { resolve } from 'node:path'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { buildDataPackage, jsonSchemas } from '../pipeline/datapackage.js'
import { flatTable, scoreAll } from '../pipeline/score.js'
import { buildAgenda, renderAgenda } from '../pipeline/agenda.js'
import { assertAgendaHistoryFloor, readAgendaHistoryDiscipline } from '../pipeline/agenda-history.js'
import { LANGS, LEXICONS, lexiconRenders } from '../i18n/index.js'
import type { Lang } from '../i18n/index.js'
import { logGdpByCountry, runDiagnostics } from '../pipeline/diagnostics.js'
import { buildFactorHistory, readReleaseSnapshots } from '../pipeline/factor-history.js'
import { residualReleaseStability, withReleaseStability } from '../pipeline/residual-structure.js'
import { buildReport } from '../pipeline/report.js'
import { writeVelocity } from '../pipeline/velocity.js'
import { writeLeverage } from '../pipeline/leverage.js'
import { writeResidual } from '../pipeline/residual.js'
import { writeSubnationalOutputs } from '../pipeline/br-subnational.js'
import { writeInstitutionExplorer } from '../pipeline/institution-explorer-out.js'
import {
  acrossCountries,
  loadDelphi,
  loadEvidence,
  loadInstitutionNetwork,
  loadNoCaseNotes,
  loadObservations,
  saveDelphi,
  summarize,
  toCsv,
  writeOut,
} from '../pipeline/store.js'
import { STANCES, buildPanel, modelsFromEnv } from '../delphi/panel.js'
import { GatewayProvider, MockProvider } from '../delphi/provider.js'
import { InSessionProvider } from '../delphi/in-session.js'
import { runDelphi } from '../delphi/run.js'
import { estimateCost } from '../delphi/cost.js'
import {
  SYSTEM_RULES,
  evidenceBrief,
  indicatorJudgementPrompt,
  round1CellPrompt,
} from '../delphi/prompts.js'
import { CHARS_PER_TOKEN, LAST_VERIFIED, OUTPUT_TOKENS } from '../delphi/pricing.js'
import {
  checkEvidenceUrls,
  validateDelphiRuns,
  validateEvidence,
  validateGlobalInstitutions,
  validateInstitutionNetwork,
  validateNoCaseNotes,
  validateResearchRuns,
  validateSubnational,
} from '../pipeline/validate.js'
import {
  buildEvidenceGrid,
  buildResearchCritiquePrompt,
  buildResearchInventory,
  buildResearchScoutPrompt,
  mockResearchCandidates,
  mockResearchReviews,
  RESEARCH_PROMPT_VERSION,
  selectResearchSlots,
} from '../pipeline/research.js'
import type { EvidenceGrid } from '../model/research.js'
import {
  ResearchCritiqueOutput,
  ResearchCritiqueRunFile,
  ResearchScoutRunFile,
  ResearchScoutOutput,
} from '../model/research.js'
import { GatewayResearchProvider } from '../research/provider.js'
import { RESEARCH_RUNS_DIR } from '../pipeline/paths.js'

type Args = { _: string[]; flags: Map<string, string | boolean> }

function parseArgs(argv: string[]): Args {
  const _: string[] = []
  const flags = new Map<string, string | boolean>()
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] as string
    if (!a.startsWith('--')) {
      _.push(a)
      continue
    }
    const [key, inline] = a.slice(2).split('=', 2)
    if (inline !== undefined) {
      flags.set(key as string, inline)
      continue
    }
    const next = argv[i + 1]
    if (next && !next.startsWith('--')) {
      flags.set(key as string, next)
      i++
    } else {
      flags.set(key as string, true)
    }
  }
  return { _, flags }
}

const str = (a: Args, k: string, d: string): string => {
  const v = a.flags.get(k)
  return typeof v === 'string' ? v : d
}
const num = (a: Args, k: string, d: number): number => {
  const v = a.flags.get(k)
  return typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : d
}
const optionalNum = (a: Args, k: string): number | undefined => {
  const v = a.flags.get(k)
  return typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined
}
const bool = (a: Args, k: string): boolean => a.flags.get(k) === true || a.flags.get(k) === 'true'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Write the run restricted to what applies to this dataset, which is what the
 * viewer reads, or remove a stale file when nothing applies. See D160.
 */
async function writeAppliedDelphi(
  loaded: DelphiRunFile | null,
  applied: AppliedDelphi | null,
): Promise<void> {
  if (!applied?.run?.application) {
    await rm(FILES.delphiApplied, { force: true })
    if (loaded) {
      console.log(`delphi      -> run ${loaded.runId} does not apply to ${DATASET_VERSION} (${applied?.refusal ?? 'not evidential'})`)
    }
    return
  }
  await writeOut(FILES.delphiApplied, `${JSON.stringify(applied.run, null, 2)}\n`)
  const a = applied.run.application
  console.log(
    `delphi      -> ${a.carried} of ${a.cells} cells from ${loaded?.runId} apply to ${a.datasetVersion} (${a.mode}); ${a.dropped.length} dropped`,
  )
}

async function score(args: Args): Promise<CountryResult[]> {
  const observations = await loadObservations()
  if (observations.length === 0) {
    throw new Error('No observations. Run `pnpm bench ingest` first.')
  }
  const delphi = await loadDelphi()
  const { countries, delphi: applied } = scoreAll(observations, {
    currentYear: CURRENT_YEAR,
    datasetVersion: DATASET_VERSION,
    delphiRun: delphi ?? undefined,
    minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
  })
  await writeAppliedDelphi(delphi, applied)

  const generatedAt = new Date().toISOString()
  const version = DATASET_VERSION
  /* One slim index for anything that lists countries, one file per country for
   * the detail. A single file carrying every indicator series for the current
   * country set is 7 MB and every page load pays for it. See D27. */
  await writeOut(
    FILES.index,
    `${JSON.stringify({ generatedAt, version, countries: countries.map(summarize) }, null, 2)}\n`,
  )
  for (const country of countries) {
    await writeOut(
      countryFile(country.iso3),
      `${JSON.stringify({ generatedAt, version, country }, null, 2)}\n`,
    )
  }
  const views = acrossCountries(countries)
  for (const view of views) {
    await writeOut(indicatorFile(view.indicatorId), `${JSON.stringify(view, null, 2)}\n`)
  }
  await writeOut(FILES.flatTable, toCsv(flatTable(countries)))
  /* The self-describing layer: JSON Schema per shape, one Data Package naming
   * every file, its schema and its license. See D37. */
  for (const [file, body] of Object.entries(jsonSchemas())) {
    await writeOut(resolve(SCHEMA_OUT_DIR, file), `${JSON.stringify(body, null, 2)}\n`)
  }
  await writeOut(
    FILES.datapackage,
    `${JSON.stringify(buildDataPackage(views.map((v) => v.indicatorId), generatedAt), null, 2)}\n`,
  )
  console.log(`index     -> ${FILES.index} (dataset ${version})`)
  console.log(`countries -> ${COUNTRY_OUT_DIR} (${countries.length} files)`)
  console.log(`indicators-> ${INDICATOR_OUT_DIR} (${views.length} files)`)
  console.log(`flat table-> ${FILES.flatTable}`)
  console.log(`schemas   -> ${SCHEMA_OUT_DIR} (${Object.keys(jsonSchemas()).length} files) and ${FILES.datapackage}`)
  return countries
}

async function diagnose(args: Args) {
  const observations = await loadObservations()
  const loadedDelphi = await loadDelphi()
  const opts = {
    currentYear: CURRENT_YEAR,
    datasetVersion: DATASET_VERSION,
    delphiRun: loadedDelphi ?? undefined,
    minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
  }
  const { countries, matrix, delphi: applied } = scoreAll(observations, opts)
  const delphi = applied?.run ?? null
  const computed = runDiagnostics(observations, countries, matrix, opts, GDP_PER_CAPITA_CODE, delphi)
  /* Both release tests read the committed releases from git, once. Without
   * git the committed figures stay as they are. See D137 and D138. */
  const snapshots = await readReleaseSnapshots()
  let releaseStability: ResidualStructure['stability']['releases'] = null
  if (snapshots) {
    releaseStability = residualReleaseStability([
      ...snapshots
        .filter((s) => s.version !== DATASET_VERSION)
        .map((s) => ({ version: s.version, scores: s.scores, logGdp: s.logGdp })),
      {
        version: DATASET_VERSION,
        scores: new Map(
          countries.map((c) => [
            c.iso3,
            Object.fromEntries(DIMENSIONS.map((d) => [d, c.dimensions[d]?.score ?? null])),
          ]),
        ),
        logGdp: logGdpByCountry(observations, GDP_PER_CAPITA_CODE),
      },
    ])
  } else {
    try {
      const committed = JSON.parse(await readFile(FILES.diagnostics, 'utf8')) as {
        residualStructure?: ResidualStructure
      }
      releaseStability = committed.residualStructure?.stability.releases ?? null
    } catch {
      /* No committed diagnostics either. */
    }
  }
  const diag = computed.residualStructure
    ? { ...computed, residualStructure: withReleaseStability(computed.residualStructure, releaseStability) }
    : computed
  await writeOut(FILES.diagnostics, `${JSON.stringify(diag, null, 2)}\n`)
  console.log(`diagnostics -> ${FILES.diagnostics}`)
  const history = await buildFactorHistory(
    {
      version: DATASET_VERSION,
      date: diag.generatedAt.slice(0, 10),
      factorStructure: diag.factorStructure,
    },
    snapshots,
  )
  if (history) {
    await writeOut(FILES.factorHistory, `${JSON.stringify(history, null, 2)}\n`)
    console.log(`factor history -> ${FILES.factorHistory} (${history.releases.length} releases)`)
  } else {
    console.log('factor history: git unavailable, kept the committed file')
  }
  return { countries, diag, delphi }
}

function csvFlag(args: Args, key: string): string[] | undefined {
  const raw = str(args, key, '')
  if (!raw) return undefined
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function researchRunId(args: Args, stage: string): string {
  const supplied = str(args, 'run-id', '')
  if (supplied) return supplied
  return `research-${stage}-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`
}

/** How far the evidence grid is closed, column by column. See D135. */
function printEvidenceGrid(grid: EvidenceGrid): void {
  console.log(
    `evidence grid: ${grid.closedByRecord + grid.closedByNote}/${grid.total} cells closed (${grid.closedByRecord} by a record, ${grid.closedByNote} by a no-case note), ${grid.open} open`,
  )
  const columns = [...grid.columns].sort((a, b) => b.open - a.open || a.indicatorId.localeCompare(b.indicatorId))
  for (const column of columns) {
    console.log(
      `  ${column.indicatorId.padEnd(36)} ${String(column.record).padStart(3)} record  ${String(column.noCase).padStart(3)} no-case  ${String(column.open).padStart(3)} open`,
    )
  }
}

async function research(args: Args): Promise<void> {
  const action = args._[1] ?? 'inventory'
  const evidence = await loadEvidence()

  if (action === 'inventory') {
    const inventory = buildResearchInventory(evidence, undefined, undefined, await loadNoCaseNotes())
    await writeOut(FILES.researchInventory, `${JSON.stringify(inventory, null, 2)}\n`)
    console.log(`inventory   -> ${FILES.researchInventory}`)
    console.log(
      `${inventory.recordCount} deliveries, ${inventory.countriesRepresented}/${COUNTRY_ISO3.length} countries, ${inventory.gapIndicatorsRepresented}/${inventory.indicators.length} gap indicators represented`,
    )
    console.log(
      `${inventory.guardrails.reversalCount}/${inventory.guardrails.reversalMinimum} reversals required; ${inventory.guardrails.reversalDeficit} still needed at the current corpus size`,
    )
    printEvidenceGrid(inventory.grid)
    console.log(`next queue  -> ${inventory.slots.length} uncovered country-gap slots`)
    return
  }

  if (action === 'scout') {
    const inventory = buildResearchInventory(evidence, undefined, undefined, await loadNoCaseNotes())
    const countries = csvFlag(args, 'countries')
    const indicators = csvFlag(args, 'indicators')
    const slots = selectResearchSlots(inventory, {
      ...(countries ? { countries } : {}),
      ...(indicators ? { indicators } : {}),
      limit: num(args, 'limit', 24),
    })
    if (slots.length === 0) throw new Error('No uncovered country-gap slots match the requested filters.')
    const prompt = buildResearchScoutPrompt(slots)
    if (bool(args, 'prompt-only')) {
      console.log(prompt)
      return
    }

    const model = str(args, 'model', process.env['NCB_RESEARCH_MODEL'] ?? modelsFromEnv()[0] ?? 'unknown')
    const useMock = bool(args, 'mock') || !process.env['AI_GATEWAY_API_KEY']
    if (useMock && !bool(args, 'mock')) {
      console.log('AI_GATEWAY_API_KEY is not set. Falling back to the deterministic research scaffold.')
    }
    const output = useMock
      ? ResearchScoutOutput.parse({ candidates: mockResearchCandidates(slots) })
      : await new GatewayResearchProvider(model).scout(prompt)
    const run = ResearchScoutRunFile.parse({
      kind: 'scout',
      runId: researchRunId(args, 'scout'),
      generatedAt: new Date().toISOString(),
      provenance: useMock ? 'mock' : 'gateway',
      model: useMock ? 'mock' : model,
      datasetVersion: DATASET_VERSION,
      countrySet: COUNTRY_ISO3,
      promptVersion: RESEARCH_PROMPT_VERSION,
      note: useMock
        ? 'Deterministic offline research scaffold. It is not evidence and must not be copied into data/evidence/records.json.'
        : 'AI-generated research leads. Source leads are unverified and this run is not evidence.',
      slots,
      candidates: output.candidates,
    })
    const slotKeys = new Set(slots.map((slot) => `${slot.iso3}|${slot.indicatorId}`))
    const invalid = run.candidates.filter((candidate) => !slotKeys.has(`${candidate.iso3}|${candidate.indicatorId}`))
    if (invalid.length > 0) {
      throw new Error(`Scout returned ${invalid.length} candidate(s) outside the requested slots.`)
    }
    const candidateKeys = run.candidates.map((candidate) => `${candidate.iso3}|${candidate.indicatorId}`)
    const missing = slots.filter((slot) => !candidateKeys.includes(`${slot.iso3}|${slot.indicatorId}`))
    if (missing.length > 0) {
      throw new Error(`Scout omitted ${missing.length} requested slot(s); rerun the scout with the same prompt.`)
    }
    if (new Set(candidateKeys).size !== candidateKeys.length) {
      throw new Error('Scout returned duplicate candidates for the same country-gap slot.')
    }
    const outFile = resolve(RESEARCH_RUNS_DIR, `${run.runId}.json`)
    await writeOut(outFile, `${JSON.stringify(run, null, 2)}\n`)
    console.log(`scout       -> ${outFile}`)
    console.log(`${run.candidates.length} research lead(s); none are publishable evidence`)
    return
  }

  if (action === 'critique') {
    const input = str(args, 'in', '')
    if (!input) throw new Error('`pnpm bench research critique --in data/research/runs/<scout>.json` requires --in.')
    const scout = ResearchScoutRunFile.parse(JSON.parse(await readFile(resolve(input), 'utf8')))
    const prompt = buildResearchCritiquePrompt(scout.candidates)
    const model = str(args, 'model', process.env['NCB_RESEARCH_MODEL'] ?? modelsFromEnv()[0] ?? 'unknown')
    const useMock = bool(args, 'mock') || !process.env['AI_GATEWAY_API_KEY']
    if (useMock && !bool(args, 'mock')) {
      console.log('AI_GATEWAY_API_KEY is not set. Falling back to the deterministic research critique.')
    }
    const output = useMock
      ? { reviews: mockResearchReviews(scout.candidates) }
      : await new GatewayResearchProvider(model).critique(prompt)
    const parsedOutput = ResearchCritiqueOutput.parse(output)
    const candidateIds = new Set(scout.candidates.map((candidate) => candidate.id))
    const unknown = parsedOutput.reviews.filter((review) => !candidateIds.has(review.candidateId))
    if (unknown.length > 0) throw new Error(`Critique returned ${unknown.length} review(s) for unknown candidates.`)
    const reviewIds = parsedOutput.reviews.map((review) => review.candidateId)
    const missingReviews = scout.candidates.filter((candidate) => !reviewIds.includes(candidate.id))
    if (missingReviews.length > 0) {
      throw new Error(`Critique omitted ${missingReviews.length} candidate review(s); rerun the critique.`)
    }
    if (new Set(reviewIds).size !== reviewIds.length) {
      throw new Error('Critique returned duplicate reviews for the same candidate.')
    }
    const run = ResearchCritiqueRunFile.parse({
      kind: 'critique',
      runId: researchRunId(args, 'critique'),
      generatedAt: new Date().toISOString(),
      provenance: useMock ? 'mock' : 'gateway',
      model: useMock ? 'mock' : model,
      datasetVersion: scout.datasetVersion,
      countrySet: scout.countrySet,
      promptVersion: RESEARCH_PROMPT_VERSION,
      note: useMock
        ? 'Deterministic offline critique. It is not evidence and cannot approve publication.'
        : 'AI red-team critique of research leads. It cannot approve publication.',
      scoutRunId: scout.runId,
      reviews: parsedOutput.reviews,
    })
    const outFile = resolve(RESEARCH_RUNS_DIR, `${run.runId}.json`)
    await writeOut(outFile, `${JSON.stringify(run, null, 2)}\n`)
    console.log(`critique    -> ${outFile}`)
    console.log(`${run.reviews.length} lead critique(s); source verification remains outstanding`)
    return
  }

  throw new Error(`Unknown research action "${action}". Use inventory, scout or critique.`)
}

async function evs(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown Joint EVS/WVS action "${action}". Use pnpm bench evs fetch.`)
  }
  const retrievedAt = new Date().toISOString()
  const result = await fetchJointEvsWvs({ retrievedAt })
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(FILES.jointEvsWvs, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing Joint EVS/WVS observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing Joint EVS/WVS observations failed schema validation: ${FILES.jointEvsWvs}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  const body = `${JSON.stringify({ generatedAt: retrievedAt, observations: result.observations }, null, 2)}\n`
  await writeOut(FILES.jointEvsWvs, body)
  const revisions = await recordRevisions(before, previousRetrievedAt, result.observations, retrievedAt)

  console.log(`Joint EVS/WVS ${result.release}: ${result.observations.length} observations`)
  for (const [indicatorId, coverage] of Object.entries(result.coverageByIndicator)) {
    const years = Object.values(coverage.fieldworkYears)
    const span = years.length > 0 ? `, fieldwork ${Math.min(...years)}-${Math.max(...years)}` : ''
    console.log(
      `  ${coverage.variable} ${indicatorId}: ${coverage.emittedCountries.length}/${COUNTRY_ISO3.length} emitted, ${coverage.availableCountries.length} in source${span}`,
    )
  }
  if (result.heldCountries.length > 0) {
    console.log(`  held for pooled microdata: ${result.heldCountries.join(', ')}`)
  }
  if (result.unmappedLabels.length > 0) {
    console.log(`  source labels outside this country registry: ${result.unmappedLabels.length}`)
  }
  console.log(`evs data    -> ${FILES.jointEvsWvs}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

async function vdem(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown V-Dem action "${action}". Use pnpm bench vdem fetch.`)
  }
  const retrievedAt = new Date().toISOString()
  const result = await fetchVdem({ retrievedAt })
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(FILES.vdem, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing V-Dem observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing V-Dem observations failed schema validation: ${FILES.vdem}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  await writeOut(FILES.vdem, `${JSON.stringify({ generatedAt: retrievedAt, observations: result.observations }, null, 2)}\n`)
  const revisions = await recordRevisions(before, previousRetrievedAt, result.observations, retrievedAt)

  console.log(
    `V-Dem ${result.release}: ${result.observations.length} observations for ${result.emittedCountries.length}/${COUNTRY_ISO3.length} benchmark countries`,
  )
  console.log(`  source coverage: ${result.availableCountries.length}/${COUNTRY_ISO3.length}`)
  for (const [indicatorId, count] of Object.entries(result.coverageByIndicator)) {
    console.log(`  ${indicatorId}: ${count}/${COUNTRY_ISO3.length}`)
  }
  console.log(`vdem data   -> ${FILES.vdem}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

async function unctad(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown UNCTAD action "${action}". Use pnpm bench unctad fetch.`)
  }
  const retrievedAt = new Date().toISOString()
  const result = await fetchUnctadExportConcentration({ retrievedAt })
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(FILES.unctad, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing UNCTAD observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing UNCTAD observations failed schema validation: ${FILES.unctad}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  await writeOut(FILES.unctad, `${JSON.stringify({ generatedAt: retrievedAt, observations: result.observations }, null, 2)}\n`)
  const revisions = await recordRevisions(before, previousRetrievedAt, result.observations, retrievedAt)

  console.log(`UNCTAD ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  console.log(`  source coverage: ${result.availableCountries.length}/${COUNTRY_ISO3.length}`)
  console.log(`  estimated (UNCTAD footnote): ${result.estimatedCountries.length} ${result.estimatedCountries.join(' ')}`)
  if (result.heldCountries.length > 0) console.log(`  held, no pinned-year value: ${result.heldCountries.join(' ')}`)
  if (result.unmappedLabels.length > 0) console.log(`  no M49 code: ${result.unmappedLabels.join(' ')}`)
  console.log(`unctad data -> ${FILES.unctad}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

/**
 * Write one adapter's observation file, with any pin beside the observations,
 * and log what the run restated against the file it replaces (D25).
 */
async function writeAdapterFile(
  path: string,
  label: string,
  observations: Observation[],
  retrievedAt: string,
  extra: Record<string, unknown> = {},
): Promise<void> {
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing ${label} observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing ${label} observations failed schema validation: ${path}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  await writeOut(path, `${JSON.stringify({ generatedAt: retrievedAt, observations, ...extra }, null, 2)}\n`)
  const revisions = await recordRevisions(before, previousRetrievedAt, observations, retrievedAt)
  console.log(`${label} data -> ${path}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

async function ilostatInformal(): Promise<void> {
  const retrievedAt = new Date().toISOString()
  const result = await fetchIlostatInformalEmployment({ retrievedAt })
  console.log(`ILOSTAT ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  const missing = COUNTRY_ISO3.filter((iso3) => !result.emittedCountries.includes(iso3))
  if (missing.length > 0) console.log(`  no value: ${missing.join(' ')}`)
  await writeAdapterFile(FILES.ilostatInformal, 'ILOSTAT informality', result.observations, retrievedAt)
}

async function atlas(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown Atlas action "${action}". Use pnpm bench atlas fetch.`)
  }
  const retrievedAt = new Date().toISOString()
  const result = await fetchAtlasNewExportProducts({ retrievedAt })
  const { pin } = result
  console.log(`Atlas ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  console.log(`  md5 ${pin.md5} matches the pin; ${pin.productUniverse} four-digit products in the windows`)
  if (result.heldCountries.length > 0) console.log(`  held, no product to enter: ${result.heldCountries.join(' ')}`)
  if (result.unmappedLabels.length > 0) console.log(`  not in the file: ${result.unmappedLabels.join(' ')}`)
  /* The pin travels in the same file: release, checksums, the rule and every count the values derive from. */
  await writeAdapterFile(FILES.atlas, 'Atlas', result.observations, retrievedAt, { atlas: pin })
}

async function ilostat(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown ILOSTAT action "${action}". Use pnpm bench ilostat fetch [--only ltu|informality].`)
  }
  const only = str(args, 'only', 'all')
  if (!['all', 'ltu', 'informality'].includes(only)) {
    throw new Error(`Unknown ILOSTAT series "${only}". Use --only ltu or --only informality.`)
  }
  if (only !== 'ltu') await ilostatInformal()
  if (only === 'informality') return
  const retrievedAt = new Date().toISOString()
  const result = await fetchIlostatLongTermUnemployment({ retrievedAt })
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(FILES.ilostat, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing ILOSTAT observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing ILOSTAT observations failed schema validation: ${FILES.ilostat}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  await writeOut(FILES.ilostat, `${JSON.stringify({ generatedAt: retrievedAt, observations: result.observations }, null, 2)}\n`)
  const revisions = await recordRevisions(before, previousRetrievedAt, result.observations, retrievedAt)

  console.log(`ILOSTAT ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  console.log(`  source coverage: ${result.availableCountries.length}/${COUNTRY_ISO3.length}`)
  if (result.heldCountries.length > 0) {
    console.log(`  held, every year failed the plausibility gate: ${result.heldCountries.join(', ')}`)
  }
  console.log(`  dropped by the plausibility gate (D120): ${result.dropped.length} country-years`)
  for (const d of result.dropped) {
    console.log(`    ${d.iso3} ${d.year} ${d.value} ${d.reason} (${d.source})`)
  }
  console.log(`ilostat data -> ${FILES.ilostat}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

async function openalex(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown OpenAlex action "${action}". Use pnpm bench openalex fetch.`)
  }
  const retrievedAt = new Date().toISOString()
  const mailto = str(args, 'mailto', process.env.OPENALEX_MAILTO ?? '')
  if (!mailto) console.log('  no --mailto or OPENALEX_MAILTO: requests go without a contact address')
  const apiKey = process.env.OPENALEX_API_KEY ?? ''
  const result = await fetchOpenAlexCitationImpact({
    retrievedAt,
    ...(mailto ? { mailto } : {}),
    ...(apiKey ? { apiKey } : {}),
  })
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(FILES.openalex, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing OpenAlex observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing OpenAlex observations failed schema validation: ${FILES.openalex}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  /* The pin travels in the same file: the requests, the totals and every count the values derive from. */
  await writeOut(
    FILES.openalex,
    `${JSON.stringify({ generatedAt: retrievedAt, observations: result.observations, openalex: result.pin }, null, 2)}\n`,
  )
  const revisions = await recordRevisions(before, previousRetrievedAt, result.observations, retrievedAt)

  const { pin } = result
  console.log(`OpenAlex ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  console.log(`  window ${pin.window.from}-${pin.window.to}, stamped ${pin.year}`)
  console.log(
    `  affiliated-world baseline: ${pin.totals.baselineTop10} of ${pin.totals.baselineWorks} works in the top 10% (${(100 * pin.baselineShare).toFixed(2)}%)`,
  )
  const fallback = Object.entries(pin.counts).filter(([, c]) => c.via === 'per_country').map(([iso3]) => iso3)
  if (fallback.length > 0) console.log(`  counted one by one, missing from a grouped call: ${fallback.join(' ')}`)
  if (result.heldCountries.length > 0) console.log(`  held, no works: ${result.heldCountries.join(' ')}`)
  console.log(`openalex data -> ${FILES.openalex}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

async function github(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown GitHub action "${action}". Use pnpm bench github fetch [--commit <sha>|latest].`)
  }
  const retrievedAt = new Date().toISOString()
  const commit = str(args, 'commit', GITHUB_IG_COMMIT)
  const result = await fetchGithubNewRepositories({ commit, retrievedAt })
  let existing: unknown | null = null
  try {
    existing = JSON.parse(await readFile(FILES.github, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Cannot read existing GitHub observations: ${String(error)}`)
    }
  }
  const parsedExisting = existing ? ObservationFile.safeParse(existing) : null
  if (existing && !parsedExisting?.success) {
    throw new Error(`Existing GitHub observations failed schema validation: ${FILES.github}`)
  }
  const before = parsedExisting?.success ? parsedExisting.data.observations : []
  const previousRetrievedAt = parsedExisting?.success ? parsedExisting.data.generatedAt : null
  /* The pin and the gate travel in the same file: commit, path, window, every Q1 stock and each held country's reason. */
  await writeOut(
    FILES.github,
    `${JSON.stringify({ generatedAt: retrievedAt, observations: result.observations, github: result.pin, held: result.held }, null, 2)}\n`,
  )
  const revisions = await recordRevisions(before, previousRetrievedAt, result.observations, retrievedAt)

  const { pin } = result
  console.log(`GitHub ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  console.log(`  latest quarter in file ${pin.latestQuarter}; window ${pin.window.from} Q1 to ${pin.window.to} Q1`)
  console.log(`  gate: stock growth under ${pin.gate.thresholdPct}% (a quarter of the median ${pin.gate.medianGrowthPct}%) is held`)
  for (const held of result.held) console.log(`  held ${held.iso3}: ${held.detail}`)
  const missing = COUNTRY_ISO3.filter((iso3) => !result.availableCountries.includes(iso3))
  if (missing.length > 0) console.log(`  not in the file for both quarters: ${missing.join(' ')}`)
  if (commit === 'latest') console.log(`  resolved latest commit ${pin.commit}; bump GITHUB_IG_COMMIT to pin it`)
  console.log(`github data -> ${FILES.github}`)
  console.log(
    `revisions   -> ${revisions.changed} changed, ${revisions.added} added, ${revisions.removed} removed in ${FILES.revisions}`,
  )
}

/**
 * Write the capability agenda: language-neutral JSON per country, plus one
 * rendered markdown per lexicon. The JSON is the ground layer, the markdown is
 * the interpretation layer, and both regenerate from the same scored output.
 * See docs/DECISIONS.md D35.
 */
async function agenda(args: Args, countries: CountryResult[]): Promise<void> {
  const evidence = await loadEvidence()
  const discipline = await readAgendaHistoryDiscipline()
  const requested = args._.slice(1).map((s) => s.toUpperCase())
  const targets = requested.length > 0 ? requested : countries.map((c) => c.iso3)
  const langFlag = str(args, 'lang', 'all')
  const langs =
    langFlag === 'all' ? LANGS : ([langFlag] as Lang[]).filter((l) => l in LEXICONS)
  if (langs.length === 0) {
    throw new Error(`Unknown lexicon "${langFlag}". Known: ${LANGS.join(', ')}`)
  }
  const generatedAt = new Date().toISOString()
  let documents = 0
  for (const iso3 of targets) {
    const institutionNetwork = await loadInstitutionNetwork(iso3)
    const built = buildAgenda(countries, evidence, iso3, generatedAt, institutionNetwork)
    assertAgendaHistoryFloor(iso3, built.ownEvidence.length, discipline)
    await writeOut(agendaFile(iso3), `${JSON.stringify(built, null, 2)}\n`)
    /* A lexicon written for some layers renders only their countries: a
     * document with no page behind it is not published (D69, D134). */
    for (const lang of langs.filter((l) => lexiconRenders(l, iso3))) {
      const lex = LEXICONS[lang]
      await writeOut(agendaDoc(iso3, lang), renderAgenda(built, lex))
      documents += 1
    }
  }
  console.log(
    `agenda      -> ${targets.length} countries, ${documents} documents over ${langs.length} lexicons -> data/out/agenda`,
  )
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const command = args._[0] ?? 'help'

  switch (command) {
    case 'ingest': {
      const from = num(args, 'from', INGEST_FROM_YEAR)
      console.log(`Fetching ${INDICATORS.filter((i) => i.ingest === 'worldbank').length} World Bank indicators from ${from}...`)
      const { report, revisions } = await ingestWorldBank(from, {
        snapshot: Boolean(args.flags.get('snapshot')),
      })
      for (const r of report) {
        const status = r.error
          ? `FAILED ${r.error}`
          : `${r.countries}/${COUNTRY_ISO3.length} countries, latest ${r.latestYear}`
        console.log(`  ${r.series.padEnd(42)} ${status}`)
      }
      const failed = report.filter((r) => r.error)
      console.log(`\nWrote ${FILES.worldBank}. ${failed.length} series failed.`)
      console.log(
        `Against the previous file: ${revisions.changed} value(s) restated, ${revisions.added} added, ${revisions.removed} dropped. Logged in ${FILES.revisions}.`,
      )
      if (revisions.changed > 0) {
        for (const r of revisions.revisions.filter((x) => x.from !== null && x.to !== null).slice(0, 10)) {
          console.log(`  ${r.iso3} ${r.year} ${r.indicatorId.padEnd(30)} ${r.from} -> ${r.to}`)
        }
      }
      if (revisions.dropped?.length) {
        const byRow = new Map<string, number>()
        for (const d of revisions.dropped) byRow.set(d.indicatorId, (byRow.get(d.indicatorId) ?? 0) + 1)
        console.log(
          `Ingest rules dropped ${revisions.dropped.length} published value(s) (D157): ${[...byRow].map(([id, n]) => `${id} ${n}`).join(', ')}.`,
        )
      }
      break
    }

    case 'score':
      await score(args)
      break

    case 'diagnose':
      await diagnose(args)
      break

    case 'velocity': {
      const output = await writeVelocity()
      console.log(
        `velocity   -> ${FILES.velocity} (${Object.keys(output.countries).length} countries, ${output.exclusions.length} excluded from country-level reads)`,
      )
      break
    }

    case 'leverage': {
      const output = await writeLeverage()
      console.log(
        `leverage   -> ${FILES.leverage} (${Object.keys(output.countries).length} countries, 11 dimensions)`,
      )
      break
    }

    case 'residual': {
      const output = await writeResidual()
      const weak = output.fits.filter((fit) => fit.fitStrength === 'weak')
      console.log(
        `residual   -> ${FILES.residual} (${output.fits.length} dimensions fitted, ${weak.length} weak, ${output.exclusions.length} countries without income data)`,
      )
      break
    }

    case 'br-subnational': {
      const output = await writeSubnationalOutputs(optionalNum(args, 'year'))
      console.log(
        `subnational -> ${FILES.subnationalIndex} (${output.files.length} published series)`,
      )
      break
    }

    case 'institutions': {
      const iso3 = str(args, 'country', 'BRA')
      const output = await writeInstitutionExplorer(iso3)
      console.log(
        `institutions -> ${output.written.join(', ')} (${output.institutions} institutions, drawable: ${output.drawable.join(', ') || 'none'})`,
      )
      break
    }

    case 'evs':
    case 'trust':
      await evs(args)
      break

    case 'vdem':
      await vdem(args)
      break

    case 'unctad':
      await unctad(args)
      break
    case 'ilostat':
      await ilostat(args)
      break
    case 'atlas':
      await atlas(args)
      break
    case 'openalex':
      await openalex(args)
      break
    case 'github':
      await github(args)
      break

    case 'research':
      await research(args)
      break

    case 'agenda': {
      const observations = await loadObservations()
      const delphi = await loadDelphi()
      const { countries } = scoreAll(observations, {
        currentYear: CURRENT_YEAR,
        datasetVersion: DATASET_VERSION,
        delphiRun: delphi ?? undefined,
        minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
      })
      await agenda(args, countries)
      break
    }

    case 'report': {
      const { countries, diag, delphi } = await diagnose(args)
      await writeOut(FILES.report, buildReport(countries, diag, delphi))
      console.log(`report      -> ${FILES.report}`)
      break
    }

    case 'delphi': {
      const observations = await loadObservations()
      const { countries } = scoreAll(observations, { currentYear: CURRENT_YEAR })

      const models = str(args, 'models', '').split(',').map((s) => s.trim()).filter(Boolean)
      const panel = buildPanel(models.length ? models : modelsFromEnv(), num(args, 'stances', 4))
      /* --in-session <dir>: separate working sessions answer the prompts this
       * command writes, byte for byte the gateway's. See InSessionProvider and D154. */
      const inSessionDir = str(args, 'in-session', '')
      const inSession = inSessionDir ? new InSessionProvider(resolve(inSessionDir)) : null
      if (inSession) await InSessionProvider.writeContract(resolve(inSessionDir))
      const useMock = !inSession && (bool(args, 'mock') || !process.env['AI_GATEWAY_API_KEY'])

      if (useMock && !bool(args, 'mock')) {
        console.log('AI_GATEWAY_API_KEY is not set. Falling back to the deterministic mock panel.')
      }
      const provider = inSession
        ? inSession
        : useMock
          ? new MockProvider(new Map(countries.map((c) => [c.iso3, c])))
          : new GatewayProvider()

      console.log(`Panel (${provider.name}):`)
      for (const p of panel) console.log(`  ${p.stance.label.padEnd(20)} ${useMock ? 'mock' : p.model}`)

      const requestedCountries = str(args, 'countries', '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const maxCoverage = num(args, 'max-coverage', 0.5)
      const run = await runDelphi(countries, {
        panel,
        provider,
        rounds: num(args, 'rounds', 2),
        countries: requestedCountries,
        datasetVersion: DATASET_VERSION,
        judgeIndicators: !bool(args, 'no-judge'),
        maxCoverage,
        concurrency: num(args, 'concurrency', 4),
        onProgress: (m) => console.log(`  ${m}`),
      })

      if (inSession && inSession.dumped.size > 0) {
        for (const [round, n] of [...inSession.dumped.entries()].sort()) {
          console.log(`${n} prompt(s) awaiting answers for ${round === 0 ? 'the indicator audit' : `round ${round}`}`)
        }
        console.log(`prompts     -> ${resolve(inSessionDir, 'prompts')}`)
        console.log('No run written. Answer the prompts, then rerun the same command.')
        break
      }
      const note = str(args, 'note', '')
      if (note) run.note = note

      /* Activation is always explicit. A full-frame run used to activate itself,
       * which put an unreviewed panel behind every Delphi surface the moment it
       * finished, and a run that lost calls looks complete. PANEL.md and the
       * research roadmap both say to activate after review; this makes the code
       * agree with them. See D106. */
      const activate = bool(args, 'activate')
      const path = await saveDelphi(run, { activate })
      console.log(`\n${run.cellEstimates.length} cell estimates, ${run.indicatorJudgements.length} indicator judgements`)
      if (run.failedCalls) {
        console.log(
          `WARNING ${run.failedCalls} of ${run.attemptedCalls ?? 0} calls failed. Cells they covered carry fewer panelists, so their IQR understates disagreement. Review before activating.`,
        )
      }
      console.log(`delphi      -> ${path}`)
      console.log(
        activate
          ? `latest      -> ${FILES.delphiLatest}`
          : 'active run   unchanged (pass --activate once you have reviewed this run)',
      )
      break
    }

    case 'prompt': {
      const stanceId = str(args, 'stance', 'institutionalist')
      const stance = STANCES.find((s) => s.id === stanceId)
      if (!stance) {
        console.error(`unknown stance "${stanceId}". one of: ${STANCES.map((s) => s.id).join(', ')}`)
        process.exitCode = 1
        break
      }
      const panelist = { id: `${stance.id}@${str(args, 'model', 'in-session')}`, model: str(args, 'model', 'in-session'), stance }

      if (bool(args, 'system')) {
        console.log(SYSTEM_RULES)
        break
      }

      const dimension = str(args, 'audit', '')
      if (dimension) {
        if (!(DIMENSIONS as readonly string[]).includes(dimension)) {
          console.error(`unknown dimension "${dimension}". one of: ${DIMENSIONS.join(', ')}`)
          process.exitCode = 1
          break
        }
        console.log(indicatorJudgementPrompt(panelist, dimension as Dimension))
        break
      }

      const observations = await loadObservations()
      const { countries } = scoreAll(observations, { currentYear: CURRENT_YEAR })
      const wanted = args._.slice(1).map((s) => s.toUpperCase())
      const picked = wanted.length ? countries.filter((c) => wanted.includes(c.iso3)) : countries
      if (!picked.length) {
        console.error(`no country matched ${wanted.join(', ')}`)
        process.exitCode = 1
        break
      }
      if (!bool(args, 'paste')) {
        console.log(picked.map((c) => round1CellPrompt(panelist, c)).join('\n\n---\n\n'))
        break
      }

      /**
       * Paste mode. One self-contained block per batch, for a panelist working in
       * a chat window with no API access. The stance and the system rules appear
       * once instead of once per country, and the JSON contract is spelled out,
       * because a chat answer has to be pasted back into a file by hand.
       */
      const batch = Math.max(1, num(args, 'batch', 4))
      const outDir = resolve(DELPHI_DIR, str(args, 'out', 'paste'))
      await mkdir(outDir, { recursive: true })
      const batches: CountryResult[][] = []
      for (let i = 0; i < picked.length; i += batch) batches.push(picked.slice(i, i + batch))

      const written: string[] = []
      for (const [i, group] of batches.entries()) {
        const n = String(i + 1).padStart(2, '0')
        const codes = group.map((c) => c.iso3).join(', ')
        const body = `${SYSTEM_RULES}

---

${stance.prompt}

---

${group.map((c) => evidenceBrief(c)).join('\n\n---\n\n')}

---

Score all nine dimensions for each of ${codes} on 0-100, against the frame set by the current benchmark country set.

The indicator-derived score is one input, not the answer. Where evidence is thin or stale, say so and use your own knowledge, and set a lower selfConfidence. Where the indicators clearly mismeasure the dimension for this country, depart from them and explain why in one or two sentences.

For each dimension also list the specific evidence you would need in order to raise your confidence. Be concrete: name a dataset, a statistic or an observable event, not "more data".

Reply with JSON only. No commentary before or after it, no markdown fence. One object per country per dimension, ${group.length * DIMENSIONS.length} objects in total, in this exact shape:

{"cellEstimates":[{"iso3":"${group[0]?.iso3 ?? 'BRA'}","dimension":"anticipation","round":1,"panelist":"${panelist.id}","model":"${panelist.model}","score":28,"selfConfidence":0.6,"rationale":"One or two sentences.","missingEvidence":["A named dataset or observable event","Another one"]}]}

The nine dimension ids, exactly: ${DIMENSIONS.join(', ')}.
`
        const file = resolve(outDir, `${stance.id}-${n}.txt`)
        await writeFile(file, body, 'utf8')
        written.push(`${file}  (${codes})`)
      }
      /**
       * The kickoff message. A chat model cannot run this CLI, so it is told to
       * fetch the bundles it needs by raw URL. Regenerated with the bundles so
       * the file list can never drift from what is on disk.
       */
      const rel = (f: string) => `data/delphi/${str(args, 'out', 'paste')}/${f}`
      /**
       * A model with a checkout reads the files. A model in a browser fetches
       * them. Same bundles either way, so only the address changes.
       */
      const local = bool(args, 'local')
      const at = (path: string) => (local ? path : rawHref(path))
      const list = batches
        .map((group, i) => {
          const n = String(i + 1).padStart(2, '0')
          return `${i + 1}. ${at(rel(`${stance.id}-${n}.txt`))}  (${group
            .map((c) => c.iso3)
            .join(', ')})`
        })
        .join('\n')
      const start = `# You are a panelist on the National Capability Benchmark

Your stance is **${stance.label}**. Hold it for every country. Do not drift toward a
neutral view, and do not soften a score because you imagine other panelists disagree.

> ${stance.prompt}

## What to do

Work through these ${batches.length} files in order. ${
        local ? 'Read each one from the repository' : 'Fetch each one'
      }, and answer it before you open the next. Each file is self-contained: it carries the rules, your
stance, the evidence briefs, and the exact JSON shape to reply with.

${list}

## Rules that decide whether your run is usable

- Reply with JSON only. No commentary, no markdown fence. One object per country
  per dimension.
- Answer **one file per message**. Do not batch several files into one reply, and
  do not summarise. If a reply would be cut off, say so and split it yourself.
- The indicator-derived score in each brief is an input, not the answer. You are
  being asked because the indicators mismeasure some countries. Depart from them
  when you can say why in one or two sentences.
- Low confidence is a real answer. \`selfConfidence\` of 0.3 with an honest
  rationale is worth more than a confident guess.
- Do not invent statistics. Reason from the brief plus what you reliably know.
- Coordination and Trust have thin source evidence. Trust has one social-trust
  measure and one 2019 contract-enforcement measure where both are observed, but
  court performance and several institutional and social rows remain gaps. Treat
  the source-backed score as the measured baseline. Your Delphi estimate is an
  interpretation layer, not a replacement. Keep model self-confidence separate
  from source confidence.

## Background, only if you want it

- Method and provenance rules: ${at('docs/PANELIST-BRIEF.md')}
- Known artefacts, where the model is wrong about the world: ${at('docs/KNOWN-ARTEFACTS.md')}

Start with file 1.
`
      const startFile = resolve(outDir, `00-START-${stance.id}.md`)
      await writeFile(startFile, start, 'utf8')

      console.log(`${written.length} paste bundle(s) for stance "${stance.id}", ${batch} country/countries each\n`)
      console.log(`  ${startFile}  <- give this to the chat model first`)
      for (const w of written) console.log(`  ${w}`)
      console.log(`\nPaste one file per message. Save each reply, then merge with bench merge.`)
      break
    }

    case 'merge': {
      /**
       * Merges the JSON replies a panelist pasted back from a chat window into one
       * run file. Accepts either a bare array of cells or an object carrying
       * `cellEstimates`, because chat models return both. Later files win on a
       * repeated country-dimension pair, so re-pasting a corrected reply fixes it.
       */
      const stanceId = str(args, 'stance', '')
      const stance = STANCES.find((st) => st.id === stanceId)
      if (!stance) {
        console.error(`--stance is required. one of: ${STANCES.map((st) => st.id).join(', ')}`)
        process.exitCode = 1
        break
      }
      const model = str(args, 'model', '')
      if (!model) {
        console.error('--model is required, for example --model "gpt-5 (chat, in-session)"')
        process.exitCode = 1
        break
      }
      const inDir = resolve(DELPHI_DIR, str(args, 'in', 'replies'))
      const files = (await readdir(inDir)).filter((f) => f.endsWith('.json')).sort()
      if (!files.length) {
        console.error(`no .json files in ${inDir}`)
        process.exitCode = 1
        break
      }

      const panelistId = `${stance.id}@${model}`
      const byKey = new Map<string, Record<string, unknown>>()
      let read = 0
      for (const f of files) {
        const raw = JSON.parse(await readFile(resolve(inDir, f), 'utf8')) as unknown
        const list = Array.isArray(raw)
          ? raw
          : ((raw as { cellEstimates?: unknown[] }).cellEstimates ?? [])
        for (const cell of list as Array<Record<string, unknown>>) {
          read++
          byKey.set(`${String(cell['iso3'])}:${String(cell['dimension'])}`, {
            ...cell,
            round: cell['round'] ?? 1,
            panelist: panelistId,
            model,
          })
        }
      }

      const run = {
        runId: `${str(args, 'run-id', `chat-${stance.id}`)}`,
        generatedAt: str(args, 'generated-at', new Date().toISOString()),
        provenance: 'in_session',
        datasetVersion: str(args, 'dataset-version', 'unknown'),
        countrySet: [...new Set([...byKey.values()].map((cell) => String(cell['iso3'])))].sort(),
        scope: 'subset',
        maxCoverage: 1,
        promptVersion: 'chat',
        note: str(
          args,
          'note',
          `Pasted into ${model} through its chat interface, taking the ${stance.label} stance. One panelist, one round. Not a panel: the median is one opinion and the IQR is zero.`,
        ),
        panel: [{ panelist: panelistId, model, stance: `${stance.label} (N=1, not a panel)` }],
        rounds: 1,
        cellEstimates: [...byKey.values()],
        indicatorJudgements: [],
      }

      const outFile = resolve(DELPHI_DIR, str(args, 'out', `chat-${stance.id}.json`))
      await writeFile(outFile, `${JSON.stringify(run, null, 2)}\n`, 'utf8')
      console.log(`read ${read} cell(s) from ${files.length} file(s), ${byKey.size} unique after dedupe`)
      console.log(`merge       -> ${outFile}`)
      console.log(`\nNow run: pnpm bench validate`)
      break
    }

    case 'cost': {
      const observations = await loadObservations()
      const { countries } = scoreAll(observations, { currentYear: CURRENT_YEAR })
      const models = str(args, 'models', '').split(',').map((s) => s.trim()).filter(Boolean)
      const requestedCountries = str(args, 'countries', '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const pickedCountries = requestedCountries.length
        ? countries.filter((country) => requestedCountries.includes(country.iso3))
        : countries
      const est = estimateCost({
        countries: pickedCountries,
        models: models.length ? models : modelsFromEnv(),
        stances: num(args, 'stances', 4),
        rounds: num(args, 'rounds', 2),
        judgeIndicators: !bool(args, 'no-judge'),
        maxCoverage: num(args, 'max-coverage', 0.5),
      })

      console.log(
        `\n${est.calls.total} calls (${est.calls.cell} cell, ${est.calls.audit} audit) across ${est.perPanelist.length} panelists`,
      )
      console.log(
        `${(est.tokens.input / 1000).toFixed(0)}k input tokens, ${(est.tokens.output / 1000).toFixed(0)}k output tokens\n`,
      )
      for (const p of est.perPanelist) {
        console.log(
          `  ${p.panelist.padEnd(20)} ${p.model.padEnd(28)} $${p.usd.toFixed(2)}${p.verifiedPrice ? '' : '  (price unverified)'}`,
        )
      }
      console.log(`\n  ${'TOTAL'.padEnd(49)} $${est.usdTotal.toFixed(2)}`)
      console.log(
        `\nPrompt sizes are measured from the prompts this repo builds now, so re-run this after any prompt or registry change.`,
      )
      console.log(
        `Assumes ${CHARS_PER_TOKEN} chars per token and a ${OUTPUT_TOKENS.thinkingMultiplier}x thinking multiplier on output.`,
      )
      console.log(`List prices last verified ${LAST_VERIFIED}. The gateway may add margin.`)
      if (est.anyUnverifiedPrice) {
        console.log(`Some prices are unverified. Check the vendor page before quoting a figure.`)
      }
      break
    }

    case 'probe': {
      const search = str(args, 'search', '')
      if (search) {
        const wired = registrySeries()
        const hits = await searchCatalogue(new RegExp(search, 'i'))
        console.log(`${hits.length} series whose name matches /${search}/i\n`)
        for (const h of hits.slice(0, num(args, 'limit', 40))) {
          const mark = wired.has(h.series) ? ' (wired)' : ''
          console.log(
            `  ${h.series.padEnd(28)} db${String(h.sourceId).padEnd(4)} ${h.name.slice(0, 70)}${mark}`,
          )
        }
        if (hits.length > num(args, 'limit', 40)) {
          console.log(`  ... ${hits.length - num(args, 'limit', 40)} more. Narrow the pattern or raise --limit.`)
        }
        console.log('\nA listed series may still answer nothing. Probe it with --series before believing it.')
        break
      }
      const raw = str(args, 'series', '')
      if (!raw) {
        console.log('Give the series to test: pnpm bench probe --series IC.FRM.CORR.ZS,IQ.CPA.FINQ.XQ')
        console.log('Add @<id> to a code to name its database: IC.LGL.CRED.XQ@1')
        break
      }
      const wired = registrySeries()
      const requests = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((token) => {
          const [series, id] = token.split('@')
          const request: ProbeRequest = { series: series as string }
          if (id) request.sourceId = Number(id)
          return request
        })
      const already = requests.filter((r) => wired.has(r.series)).map((r) => r.series)
      if (already.length > 0) {
        console.log(`Already in the registry, probing anyway: ${already.join(', ')}`)
      }
      const from = num(args, 'from', 2010)
      console.log(
        `Probing ${requests.length} series against ${COUNTRY_ISO3.length} countries, ${from} onward...`,
      )
      const results = await probeSeries(requests, from)
      if (args.flags.get('json')) {
        console.log(JSON.stringify({ from, countrySet: COUNTRY_ISO3.length, results }, null, 2))
        break
      }
      console.log(
        `\n${'series'.padEnd(30)} ${'db'.padEnd(3)} ${'cov'.padEnd(7)} ${'latest'.padEnd(6)} ${'r(GDP)'.padEnd(7)} verdict`,
      )
      for (const r of results) {
        const cov = `${r.countries}/${r.countrySet}`
        const verdict = [r.usable ? 'usable' : r.failures.join('; '), ...r.flags].join('; ')
        console.log(
          `${r.series.padEnd(30)} ${String(r.sourceId).padEnd(3)} ${cov.padEnd(7)} ${String(r.latestYear ?? '').padEnd(6)} ${String(r.gdpPearson ?? '').padEnd(7)} ${verdict}`,
        )
      }
      const usable = results.filter((r) => r.usable).length
      console.log(
        `\n${usable} of ${results.length} pass coverage, recency and spread.`,
      )
      console.log(
        'A pass is a candidate, not a decision: read what it measures before writing a registry row. r(GDP) is a finding, not a gate (D118).',
      )
      break
    }

    case 'validate': {
      const problems = [
        ...(await validateDelphiRuns()),
        ...(await validateEvidence()),
        ...(await validateNoCaseNotes()),
        ...(await validateResearchRuns()),
        ...(await validateGlobalInstitutions()),
        ...(await validateInstitutionNetwork()),
        ...(await validateSubnational()),
      ]
      printEvidenceGrid(buildEvidenceGrid(await loadEvidence(), await loadNoCaseNotes()))
      if (args.flags.get('fetch')) {
        console.log('Checking evidence source URLs against the live web...')
        problems.push(...(await checkEvidenceUrls()))
      }
      if (problems.length === 0) {
        console.log('All Delphi runs, evidence records, institutional networks and subnational files pass validation.')
        break
      }
      for (const p of problems) console.log(`  ${p.file.padEnd(46)} ${p.problem}`)
      const errors = problems.filter((p) => p.severity === 'error').length
      console.log(`\n${problems.length} finding(s), ${errors} error(s).`)
      if (errors > 0) process.exitCode = 1
      break
    }

    case 'all': {
      await ingestWorldBank(num(args, 'from', INGEST_FROM_YEAR), {
        snapshot: Boolean(args.flags.get('snapshot')),
      })
      const subnational = await writeSubnationalOutputs()
      console.log(`subnational -> ${FILES.subnationalIndex} (${subnational.files.length} published series)`)
      await score(args)
      const { countries, diag, delphi } = await diagnose(args)
      await writeOut(FILES.report, buildReport(countries, diag, delphi))
      console.log(`report      -> ${FILES.report}`)
      await agenda(args, countries)
      break
    }

    default:
      console.log(`National Capability Benchmark

  pnpm bench ingest    [--from 1960] [--snapshot]  fetch World Bank series into data/observations
  pnpm bench score                        normalize, score, write index.json, one file per country, table.csv
  pnpm bench delphi    [--mock] [--rounds 2] [--countries BRA,IND] [--models a,b]
                       [--in-session <dir>] [--note text]  write the prompts for separate sessions to answer, then assemble the run
                       [--max-coverage 0.5] [--no-judge] [--concurrency 4] [--activate]
                       0.5 reviews thin dimensions; use 1 for all nine dimensions
  pnpm bench diagnose                     correlations, redundancy, GDP-sensitivity test
  pnpm bench velocity                     write the provisional five-year velocity fixture
  pnpm bench leverage                     write the provisional leverage fixture
  pnpm bench residual                     write the provisional wealth-residual fixture
  pnpm bench br-subnational [--year 2024]          fetch the registered Brazil subnational series
  pnpm bench institutions [--country BRA]  project the institution map into the explorer feed, one file per lexicon
  pnpm bench evs      fetch                fetch the Joint EVS/WVS items: A165 trust, A173 control, A080_01 charitable membership, G007_34_B trust in strangers, E069_17 court confidence check (alias: trust)
  pnpm bench vdem     fetch                fetch and parse V-Dem v16 civil society, court compliance and the polarization and turnout checks
  pnpm bench unctad   fetch                fetch and parse the pinned UNCTADstat export concentration index
  pnpm bench ilostat  fetch [--only ltu|informality]  ILOSTAT: long-term unemployment share behind its gate, and the informal employment rate (a condition)
  pnpm bench atlas    fetch                new export products rate from the pinned Growth Lab HS92 4-digit file (about 450 MB)
  pnpm bench openalex fetch [--mailto a@b] count the OpenAlex top 10% cited share, pin counts and requests
  pnpm bench github   fetch [--commit sha|latest]  new public repositories from the pinned GitHub Innovation Graph CSV, access gate applied
  pnpm bench research inventory           write the deterministic country-gap research inventory
  pnpm bench research scout               ask AI for bounded, unpublished research leads
  pnpm bench research critique --in FILE  red-team a scout run; still cannot approve publication
  pnpm bench prompt    [BRA IND ...] [--stance wealth_sceptic] [--system] [--audit trust]
                       [--paste] [--batch 4] [--out paste] [--local]
                                          print the exact panel prompt; --paste writes chat-ready bundles
  pnpm bench merge     --stance X --model "gpt-5 (chat)" [--in replies] [--out file.json]
                                          merge pasted chat replies into one run file
  pnpm bench cost      [--rounds 2] [--stances 4] [--models a,b] [--countries BRA,IND]
                       [--max-coverage 0.5] [--no-judge]
                       0.5 reviews thin dimensions; use 1 for all nine dimensions
                                          measure the prompts and price the panel run
  pnpm bench probe     --search <regex> [--limit 40]             find World Bank series by name, with the database each needs
  pnpm bench probe     --series a,b[@db] [--from 2010] [--json]  test candidate World Bank series before wiring them
  pnpm bench validate  [--fetch]          schema-check Delphi, evidence, institution and subnational data; --fetch live-checks evidence URLs
  pnpm bench report                       write the findings report
  pnpm bench agenda    [BRA IND ...] [--lang pt-BR]
                                          write the capability agenda, JSON plus one markdown per lexicon
  pnpm bench all                          ingest, score, diagnose, report, agenda
`)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
