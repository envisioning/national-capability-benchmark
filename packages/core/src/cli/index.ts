import {
  COUNTRY_ISO3,
  DATASET_VERSION,
  DIMENSIONS,
  GDP_PER_CAPITA_CODE,
  INDICATORS,
  INGEST_FROM_YEAR,
  ObservationFile,
  isDelphiRunForDataset,
  rawHref,
} from '../model/index.js'
import type { CountryResult, Dimension } from '../model/index.js'
import { ingestWorldBank, recordRevisions } from '../pipeline/ingest.js'
import { fetchJointEvsWvsTrust } from '../pipeline/adapters/joint-evs-wvs.js'
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
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { buildDataPackage, jsonSchemas } from '../pipeline/datapackage.js'
import { flatTable, scoreAll } from '../pipeline/score.js'
import { buildAgenda, renderAgenda } from '../pipeline/agenda.js'
import { LANGS, LEXICONS } from '../i18n/index.js'
import type { Lang } from '../i18n/index.js'
import { runDiagnostics } from '../pipeline/diagnostics.js'
import { buildReport } from '../pipeline/report.js'
import { writeVelocity } from '../pipeline/velocity.js'
import { writeLeverage } from '../pipeline/leverage.js'
import {
  acrossCountries,
  loadDelphi,
  loadEvidence,
  loadObservations,
  saveDelphi,
  summarize,
  toCsv,
  writeOut,
} from '../pipeline/store.js'
import { STANCES, buildPanel, modelsFromEnv } from '../delphi/panel.js'
import { GatewayProvider, MockProvider } from '../delphi/provider.js'
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
  validateInstitutionNetwork,
} from '../pipeline/validate.js'

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
const bool = (a: Args, k: string): boolean => a.flags.get(k) === true || a.flags.get(k) === 'true'

const CURRENT_YEAR = new Date().getFullYear()

async function score(args: Args): Promise<CountryResult[]> {
  const observations = await loadObservations()
  if (observations.length === 0) {
    throw new Error('No observations. Run `pnpm bench ingest` first.')
  }
  const delphi = await loadDelphi()
  const { countries } = scoreAll(observations, {
    currentYear: CURRENT_YEAR,
    datasetVersion: DATASET_VERSION,
    delphiRun: delphi ?? undefined,
    minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
  })

  const generatedAt = new Date().toISOString()
  const version = DATASET_VERSION
  /* One slim index for anything that lists countries, one file per country for
   * the detail. A single file carrying every indicator series for 40 countries
   * is 7 MB and every page load pays for it. See D27. */
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
  console.log(`schemas   -> ${SCHEMA_OUT_DIR} (3 files) and ${FILES.datapackage}`)
  return countries
}

async function diagnose(args: Args) {
  const observations = await loadObservations()
  const loadedDelphi = await loadDelphi()
  const delphi =
    loadedDelphi && isDelphiRunForDataset(loadedDelphi, DATASET_VERSION)
      ? loadedDelphi
      : null
  const opts = {
    currentYear: CURRENT_YEAR,
    datasetVersion: DATASET_VERSION,
    delphiRun: delphi ?? undefined,
    minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
  }
  const { countries, matrix } = scoreAll(observations, opts)
  const diag = runDiagnostics(observations, countries, matrix, opts, GDP_PER_CAPITA_CODE, delphi)
  await writeOut(FILES.diagnostics, `${JSON.stringify(diag, null, 2)}\n`)
  console.log(`diagnostics -> ${FILES.diagnostics}`)
  return { countries, diag, delphi }
}

async function trust(args: Args): Promise<void> {
  const action = args._[1] ?? 'fetch'
  if (action !== 'fetch') {
    throw new Error(`Unknown trust action "${action}". Use pnpm bench trust fetch.`)
  }
  const retrievedAt = new Date().toISOString()
  const result = await fetchJointEvsWvsTrust({ retrievedAt })
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

  console.log(`Joint EVS/WVS ${result.release}: ${result.observations.length}/${COUNTRY_ISO3.length} benchmark countries emitted`)
  console.log(`  source coverage: ${result.availableCountries.length}/${COUNTRY_ISO3.length}`)
  if (result.heldCountries.length > 0) {
    console.log(`  held for pooled microdata: ${result.heldCountries.join(', ')}`)
  }
  if (result.unmappedLabels.length > 0) {
    console.log(`  source labels outside this country registry: ${result.unmappedLabels.length}`)
  }
  console.log(`trust data  -> ${FILES.jointEvsWvs}`)
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
  const requested = args._.slice(1).map((s) => s.toUpperCase())
  const targets = requested.length > 0 ? requested : countries.map((c) => c.iso3)
  const langFlag = str(args, 'lang', 'all')
  const langs =
    langFlag === 'all' ? LANGS : ([langFlag] as Lang[]).filter((l) => l in LEXICONS)
  if (langs.length === 0) {
    throw new Error(`Unknown lexicon "${langFlag}". Known: ${LANGS.join(', ')}`)
  }
  const generatedAt = new Date().toISOString()
  for (const iso3 of targets) {
    const built = buildAgenda(countries, evidence, iso3, generatedAt)
    await writeOut(agendaFile(iso3), `${JSON.stringify(built, null, 2)}\n`)
    for (const lang of langs) {
      const lex = LEXICONS[lang]
      await writeOut(agendaDoc(iso3, lang), renderAgenda(built, lex))
    }
  }
  console.log(
    `agenda      -> ${targets.length} countries x ${langs.length} lexicons -> data/out/agenda`,
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

    case 'trust':
      await trust(args)
      break

    case 'agenda': {
      const observations = await loadObservations()
      const loadedDelphi = await loadDelphi()
      const delphi =
        loadedDelphi && isDelphiRunForDataset(loadedDelphi, DATASET_VERSION)
          ? loadedDelphi
          : null
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
      const useMock = bool(args, 'mock') || !process.env['AI_GATEWAY_API_KEY']

      if (useMock && !bool(args, 'mock')) {
        console.log('AI_GATEWAY_API_KEY is not set. Falling back to the deterministic mock panel.')
      }
      const provider = useMock
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

      const partial = run.scope === 'subset' || maxCoverage < 1
      const activate = bool(args, 'activate') || !partial
      const path = await saveDelphi(run, { activate })
      console.log(`\n${run.cellEstimates.length} cell estimates, ${run.indicatorJudgements.length} indicator judgements`)
      console.log(`delphi      -> ${path}`)
      console.log(
        activate
          ? `latest      -> ${FILES.delphiLatest}`
          : 'active run   unchanged (use --activate after reviewing this subset or thin-cell run)',
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
- Coordination and Trust carry no indicator score for any country, because the
  perception composites were retired. Your estimate is the only signal there, so
  slow down on those two and set confidence honestly.

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
        const verdict = r.usable ? 'usable' : r.failures.join('; ')
        console.log(
          `${r.series.padEnd(30)} ${String(r.sourceId).padEnd(3)} ${cov.padEnd(7)} ${String(r.latestYear ?? '').padEnd(6)} ${String(r.gdpPearson ?? '').padEnd(7)} ${verdict}`,
        )
      }
      const usable = results.filter((r) => r.usable).length
      console.log(
        `\n${usable} of ${results.length} pass coverage, recency, spread and the wealth test.`,
      )
      console.log(
        'A pass is a candidate, not a decision: read what it measures before writing a registry row.',
      )
      break
    }

    case 'validate': {
      const problems = [
        ...(await validateDelphiRuns()),
        ...(await validateEvidence()),
        ...(await validateInstitutionNetwork()),
      ]
      if (args.flags.get('fetch')) {
        console.log('Checking evidence source URLs against the live web...')
        problems.push(...(await checkEvidenceUrls()))
      }
      if (problems.length === 0) {
        console.log('All Delphi runs, evidence records and institutional networks pass validation.')
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
      await score(args)
      const { countries, diag, delphi } = await diagnose(args)
      await writeOut(FILES.report, buildReport(countries, diag, delphi))
      console.log(`report      -> ${FILES.report}`)
      await agenda(args, countries)
      break
    }

    default:
      console.log(`National Capability Benchmark

  pnpm bench ingest    [--from 1990] [--snapshot]  fetch World Bank series into data/observations
  pnpm bench score                        normalize, score, write index.json, one file per country, table.csv
  pnpm bench delphi    [--mock] [--rounds 2] [--countries BRA,IND] [--models a,b]
                       [--max-coverage 0.5] [--no-judge] [--concurrency 4] [--activate]
  pnpm bench diagnose                     correlations, redundancy, GDP-sensitivity test
  pnpm bench velocity                     write the provisional five-year velocity fixture
  pnpm bench leverage                     write the provisional leverage fixture
  pnpm bench trust    fetch                fetch and parse Joint EVS/WVS A165 trust results
  pnpm bench prompt    [BRA IND ...] [--stance wealth_sceptic] [--system] [--audit trust]
                       [--paste] [--batch 4] [--out paste] [--local]
                                          print the exact panel prompt; --paste writes chat-ready bundles
  pnpm bench merge     --stance X --model "gpt-5 (chat)" [--in replies] [--out file.json]
                                          merge pasted chat replies into one run file
  pnpm bench cost      [--rounds 2] [--stances 4] [--models a,b] [--countries BRA,IND]
                       [--max-coverage 0.5] [--no-judge]
                                          measure the prompts and price the panel run
  pnpm bench probe     --search <regex> [--limit 40]             find World Bank series by name, with the database each needs
  pnpm bench probe     --series a,b[@db] [--from 2010] [--json]  test candidate World Bank series before wiring them
  pnpm bench validate  [--fetch]          schema-check Delphi, evidence and institution data; --fetch live-checks evidence URLs
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
