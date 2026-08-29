import { DIMENSIONS } from '../model/index.js'
import type {
  CountryResult,
  DelphiCellEstimate,
  DelphiIndicatorJudgement,
  DelphiRunFile,
  Dimension,
} from '../model/index.js'
import type { Panelist } from './panel.js'
import type { PanelProvider } from './provider.js'
import {
  anonymiseRound,
  DELPHI_PROMPT_VERSION,
  indicatorJudgementPrompt,
  round1CellPrompt,
  round2CellPrompt,
} from './prompts.js'

export type DelphiOptions = {
  panel: Panelist[]
  provider: PanelProvider
  rounds: number
  /** ISO3 subset. Empty means every scored country. */
  countries: string[]
  /** Dataset frame used to build the evidence briefs. */
  datasetVersion?: string
  /** Run the indicator audit as well as the country scoring. */
  judgeIndicators: boolean
  /** Include dimensions whose source coverage is at or below this ceiling. */
  maxCoverage: number
  concurrency: number
  onProgress?: (message: string) => void
}

/** Dimensions the panel should see for one country in this run. */
export function delphiDimensions(
  result: CountryResult,
  maxCoverage: number,
): Dimension[] {
  return DIMENSIONS.filter(
    (dimension) => (result.dimensions[dimension]?.confidenceParts.coverage ?? 0) <= maxCoverage,
  )
}

type CellJob = {
  result: CountryResult
  panelist: Panelist
  dimensions: Dimension[]
}

/** Bounded-concurrency map. Keeps the panel from opening 40 sockets at once. */
async function pool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<Array<R | null>> {
  const out = new Array<R | null>(items.length).fill(null)
  let next = 0
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    for (;;) {
      const i = next++
      if (i >= items.length) return
      try {
        out[i] = await fn(items[i] as T, i)
      } catch (err) {
        out[i] = null
        console.error(`  ! ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  })
  await Promise.all(workers)
  return out
}

export async function runDelphi(
  results: CountryResult[],
  opts: DelphiOptions,
): Promise<DelphiRunFile> {
  const targets =
    opts.countries.length > 0
      ? results.filter((r) => opts.countries.includes(r.iso3))
      : results
  const log = opts.onProgress ?? (() => {})

  const cellEstimates: DelphiCellEstimate[] = []
  const jobs: CellJob[] = targets.flatMap((result) => {
    const dimensions = delphiDimensions(result, opts.maxCoverage)
    return dimensions.length > 0
      ? opts.panel.map((panelist) => ({ result, panelist, dimensions }))
      : []
  })

  for (let round = 1; round <= opts.rounds; round++) {
    log(`round ${round}: ${jobs.length} panelist-country calls`)
    const prompts = jobs.map(({ result, panelist, dimensions }) => {
      if (round === 1) return round1CellPrompt(panelist, result, dimensions)
      const prior = cellEstimates
        .filter(
          (e) =>
            e.iso3 === result.iso3 &&
            e.round === round - 1 &&
            dimensions.includes(e.dimension),
        )
        .map((e) => ({
          dimension: e.dimension,
          score: e.score,
          rationale: e.rationale,
          panelist: e.panelist,
        }))
      return round2CellPrompt(
        panelist,
        result,
        anonymiseRound(prior, panelist.id),
        dimensions,
      )
    })

    const answers = await pool(jobs, opts.concurrency, async (job, i) =>
      opts.provider.cellScores(job.panelist, prompts[i] as string),
    )

    answers.forEach((answer, i) => {
      if (!answer) return
      const job = jobs[i] as CellJob
      for (const row of answer.dimensions) {
        const dimension = row.dimension as Dimension
        if (!job.dimensions.includes(dimension)) continue
        cellEstimates.push({
          iso3: job.result.iso3,
          dimension,
          round,
          panelist: job.panelist.id,
          model: job.panelist.model,
          score: row.score,
          selfConfidence: row.selfConfidence,
          rationale: row.rationale,
          missingEvidence: row.missingEvidence,
        })
      }
    })
    log(`round ${round}: ${cellEstimates.filter((e) => e.round === round).length} estimates recorded`)
  }

  const indicatorJudgements: DelphiIndicatorJudgement[] = []
  if (opts.judgeIndicators) {
    const auditJobs = DIMENSIONS.flatMap((dimension) =>
      opts.panel.map((panelist) => ({ dimension, panelist })),
    )
    log(`indicator audit: ${auditJobs.length} calls`)
    const audits = await pool(auditJobs, opts.concurrency, async (job) =>
      opts.provider.indicatorJudgements(job.panelist, indicatorJudgementPrompt(job.panelist, job.dimension)),
    )
    audits.forEach((audit, i) => {
      if (!audit) return
      const job = auditJobs[i] as { dimension: Dimension; panelist: Panelist }
      for (const row of audit.indicators) {
        indicatorJudgements.push({
          indicatorId: row.indicatorId,
          round: 1,
          panelist: job.panelist.id,
          model: job.panelist.model,
          measurementClass: row.measurementClass,
          constructValidity: row.constructValidity,
          wealthProxyRisk: row.wealthProxyRisk,
          redundantWith: row.redundantWith,
          rationale: row.rationale,
        })
      }
    })
  }

  const generatedAt = new Date().toISOString()
  const { provenance } = opts.provider
  /** The mock never claims a vendor model, so a dry run cannot be read as one. */
  const modelFor = (model: string) => (provenance === 'mock' ? 'mock' : model)

  return {
    runId: `${generatedAt.replace(/[:.]/g, '-')}-${provenance}`,
    generatedAt,
    provenance,
    note:
      provenance === 'mock'
        ? 'Deterministic offline stand-in. Exercises the pipeline. Not evidence about any country.'
        : `Panel of ${opts.panel.length} over ${opts.rounds} round(s).`,
    datasetVersion: opts.datasetVersion ?? 'unknown',
    countrySet: targets.map((result) => result.iso3).sort(),
    scope: targets.length === results.length ? 'full' : 'subset',
    maxCoverage: opts.maxCoverage,
    promptVersion: DELPHI_PROMPT_VERSION,
    panel: opts.panel.map((p) => ({
      panelist: p.id,
      model: modelFor(p.model),
      stance: p.stance.label,
    })),
    rounds: opts.rounds,
    cellEstimates: cellEstimates.map((e) => ({ ...e, model: modelFor(e.model) })),
    indicatorJudgements: indicatorJudgements.map((j) => ({ ...j, model: modelFor(j.model) })),
  }
}
