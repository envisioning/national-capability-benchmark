import {
  COUNTRY_ISO3,
  DATASET_VERSION,
  DIMENSIONS,
  GDP_PER_CAPITA_CODE,
  INDICATORS,
} from '../model/index.js'
import type { CountryResult, Dimension } from '../model/index.js'
import { ingestWorldBank } from '../pipeline/ingest.js'
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
import { checkEvidenceUrls, validateDelphiRuns, validateEvidence } from '../pipeline/validate.js'

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
    delphi: delphi?.cellEstimates ?? [],
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
  const delphi = await loadDelphi()
  const opts = {
    currentYear: CURRENT_YEAR,
    delphi: delphi?.cellEstimates ?? [],
    minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
  }
  const { countries, matrix } = scoreAll(observations, opts)
  const diag = runDiagnostics(observations, countries, matrix, opts, GDP_PER_CAPITA_CODE, delphi)
  await writeOut(FILES.diagnostics, `${JSON.stringify(diag, null, 2)}\n`)
  console.log(`diagnostics -> ${FILES.diagnostics}`)
  return { countries, diag, delphi }
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
      const from = num(args, 'from', 1990)
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

    case 'agenda': {
      const observations = await loadObservations()
      const delphi = await loadDelphi()
      const { countries } = scoreAll(observations, {
        currentYear: CURRENT_YEAR,
        delphi: delphi?.cellEstimates ?? [],
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

      const run = await runDelphi(countries, {
        panel,
        provider,
        rounds: num(args, 'rounds', 2),
        countries: str(args, 'countries', '').split(',').map((s) => s.trim()).filter(Boolean),
        judgeIndicators: !bool(args, 'no-judge'),
        maxCoverage: num(args, 'max-coverage', 1),
        concurrency: num(args, 'concurrency', 4),
        onProgress: (m) => console.log(`  ${m}`),
      })

      const path = await saveDelphi(run)
      console.log(`\n${run.cellEstimates.length} cell estimates, ${run.indicatorJudgements.length} indicator judgements`)
      console.log(`delphi      -> ${path}`)
      console.log(`latest      -> ${FILES.delphiLatest}`)
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

Score all nine dimensions for each of ${codes} on 0-100, against the frame set by the ten reference countries.

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
      console.log(`${written.length} paste bundle(s) for stance "${stance.id}", ${batch} country/countries each\n`)
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
      const est = estimateCost({
        countries,
        models: models.length ? models : modelsFromEnv(),
        stances: num(args, 'stances', 4),
        rounds: num(args, 'rounds', 2),
        judgeIndicators: !bool(args, 'no-judge'),
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

    case 'validate': {
      const problems = [...(await validateDelphiRuns()), ...(await validateEvidence())]
      if (args.flags.get('fetch')) {
        console.log('Checking evidence source URLs against the live web...')
        problems.push(...(await checkEvidenceUrls()))
      }
      if (problems.length === 0) {
        console.log('All Delphi runs and evidence records parse and cover the expected cells.')
        break
      }
      for (const p of problems) console.log(`  ${p.file.padEnd(46)} ${p.problem}`)
      const errors = problems.filter((p) => p.severity === 'error').length
      console.log(`\n${problems.length} finding(s), ${errors} error(s).`)
      if (errors > 0) process.exitCode = 1
      break
    }

    case 'all': {
      await ingestWorldBank(num(args, 'from', 1990), {
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
                       [--max-coverage 0.6] [--no-judge] [--concurrency 4]
  pnpm bench diagnose                     correlations, redundancy, GDP-sensitivity test
  pnpm bench prompt    [BRA IND ...] [--stance wealth_sceptic] [--system] [--audit trust]
                       [--paste] [--batch 4] [--out paste]
                                          print the exact panel prompt; --paste writes chat-ready bundles
  pnpm bench merge     --stance X --model "gpt-5 (chat)" [--in replies] [--out file.json]
                                          merge pasted chat replies into one run file
  pnpm bench cost      [--rounds 2] [--stances 4] [--models a,b] [--no-judge]
                                          measure the prompts and price the panel run
  pnpm bench validate  [--fetch]          schema-check data/delphi and data/evidence; --fetch also live-checks evidence source URLs
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
