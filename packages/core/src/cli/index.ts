import { COUNTRY_ISO3, GDP_PER_CAPITA_CODE, INDICATORS } from '../model/index.js'
import type { CountryResult } from '../model/index.js'
import { ingestWorldBank } from '../pipeline/ingest.js'
import { FILES } from '../pipeline/paths.js'
import { flatTable, scoreAll } from '../pipeline/score.js'
import { runDiagnostics } from '../pipeline/diagnostics.js'
import { buildReport } from '../pipeline/report.js'
import { loadDelphi, loadObservations, saveDelphi, toCsv, writeOut } from '../pipeline/store.js'
import { buildPanel, modelsFromEnv } from '../delphi/panel.js'
import { GatewayProvider, MockProvider } from '../delphi/provider.js'
import { runDelphi } from '../delphi/run.js'
import { estimateCost } from '../delphi/cost.js'
import { CHARS_PER_TOKEN, LAST_VERIFIED, OUTPUT_TOKENS } from '../delphi/pricing.js'
import { validateDelphiRuns, validateEvidence } from '../pipeline/validate.js'

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
  const { countries, matrix } = scoreAll(observations, {
    currentYear: CURRENT_YEAR,
    delphi: delphi?.cellEstimates ?? [],
    minPanelistConfidence: num(args, 'min-panelist-confidence', 0),
  })

  await writeOut(
    FILES.scores,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), countries }, null, 2)}\n`,
  )
  await writeOut(FILES.flatTable, `${toCsv(flatTable(countries))}\n`)
  console.log(`scores    -> ${FILES.scores}`)
  console.log(`flat table-> ${FILES.flatTable}`)
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
  const diag = runDiagnostics(observations, countries, matrix, opts, GDP_PER_CAPITA_CODE)
  await writeOut(FILES.diagnostics, `${JSON.stringify(diag, null, 2)}\n`)
  console.log(`diagnostics -> ${FILES.diagnostics}`)
  return { countries, diag, delphi }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const command = args._[0] ?? 'help'

  switch (command) {
    case 'ingest': {
      const from = num(args, 'from', 2000)
      console.log(`Fetching ${INDICATORS.filter((i) => i.ingest === 'worldbank').length} World Bank indicators from ${from}...`)
      const { report } = await ingestWorldBank(from)
      for (const r of report) {
        const status = r.error
          ? `FAILED ${r.error}`
          : `${r.countries}/${COUNTRY_ISO3.length} countries, latest ${r.latestYear}`
        console.log(`  ${r.series.padEnd(42)} ${status}`)
      }
      const failed = report.filter((r) => r.error)
      console.log(`\nWrote ${FILES.worldBank}. ${failed.length} series failed.`)
      break
    }

    case 'score':
      await score(args)
      break

    case 'diagnose':
      await diagnose(args)
      break

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
      await ingestWorldBank(num(args, 'from', 2000))
      await score(args)
      const { countries, diag, delphi } = await diagnose(args)
      await writeOut(FILES.report, buildReport(countries, diag, delphi))
      console.log(`report      -> ${FILES.report}`)
      break
    }

    default:
      console.log(`National Capability Benchmark

  pnpm bench ingest    [--from 2000]      fetch World Bank series into data/observations
  pnpm bench score                        normalize, score, write scores.json and table.csv
  pnpm bench delphi    [--mock] [--rounds 2] [--countries BRA,IND] [--models a,b]
                       [--max-coverage 0.6] [--no-judge] [--concurrency 4]
  pnpm bench diagnose                     correlations, redundancy, GDP-sensitivity test
  pnpm bench cost      [--rounds 2] [--stances 4] [--models a,b] [--no-judge]
                                          measure the prompts and price the panel run
  pnpm bench validate                     schema-check data/delphi and data/evidence
  pnpm bench report                       write the findings report
  pnpm bench all                          ingest, score, diagnose, report
`)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
