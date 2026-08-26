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
  indicatorJudgementPrompt,
  round1CellPrompt,
  round2CellPrompt,
} from './prompts.js'

export type DelphiOptions = {
  panel: Panelist[]
  provider: PanelProvider
  rounds: number
  /** ISO3 subset. Empty means all ten. */
  countries: string[]
  /** Run the indicator audit as well as the country scoring. */
  judgeIndicators: boolean
  /** Only score cells whose indicator coverage is below this, to save calls. */
  maxCoverage: number
  concurrency: number
  onProgress?: (message: string) => void
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
  const jobs = targets.flatMap((result) => opts.panel.map((panelist) => ({ result, panelist })))

  for (let round = 1; round <= opts.rounds; round++) {
    log(`round ${round}: ${jobs.length} panelist-country calls`)
    const prompts = jobs.map(({ result, panelist }) => {
      if (round === 1) return round1CellPrompt(panelist, result)
      const prior = cellEstimates
        .filter((e) => e.iso3 === result.iso3 && e.round === round - 1)
        .map((e) => ({
          dimension: e.dimension,
          score: e.score,
          rationale: e.rationale,
          panelist: e.panelist,
        }))
      return round2CellPrompt(panelist, result, anonymiseRound(prior, panelist.id))
    })

    const answers = await pool(jobs, opts.concurrency, async (job, i) =>
      opts.provider.cellScores(job.panelist, prompts[i] as string),
    )

    answers.forEach((answer, i) => {
      if (!answer) return
      const job = jobs[i] as { result: CountryResult; panelist: Panelist }
      for (const row of answer.dimensions) {
        const dim = job.result.dimensions[row.dimension as Dimension]
        if (dim && dim.confidenceParts.coverage > opts.maxCoverage) continue
        cellEstimates.push({
          iso3: job.result.iso3,
          dimension: row.dimension as Dimension,
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
