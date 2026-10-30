import { pool } from '../delphi/run.js'
import type { CallTally } from '../delphi/run.js'
import { sha256Hex } from '../delphi/sha256.js'
import { answerPrompt, FITNESS_PROMPT_VERSION, promptHash } from './prompts.js'
import type { BundleSource } from './prompts.js'
import { callIdFor } from './provider.js'
import type { FitnessProvider } from './provider.js'
import type { RosterModel } from './roster.js'
import { modesFor } from './schema.js'
import type { FitnessAnswer, FitnessItem, FitnessMode, FitnessRunFile, FitnessRunModel, FitnessSkip } from './schema.js'

export type FitnessRunOptions = {
  items: FitnessItem[]
  models: readonly RosterModel[]
  /** Providers in order of preference; a model goes to the first that serves it. */
  providers: FitnessProvider[]
  samples: number
  /** Run only these modes. Each item still runs only in the modes `modesFor` allows. */
  modes: FitnessMode[]
  /** Pinned source text per item id. A fact item without one cannot run `grounded`. */
  bundles: Map<string, BundleSource[]>
  batch: boolean
  concurrency: number
  onProgress?: (message: string) => void
}

type Job = { item: FitnessItem; model: RosterModel; provider: FitnessProvider; callId: string; mode: FitnessMode; sample: number; hash: string }

const bundleHash = (bundle: BundleSource[]) =>
  sha256Hex(bundle.map((s) => `${s.url}\u0000${s.retrieved}\u0000${s.text}`).join('\u0001'))

/**
 * Answers every item with every model, `samples` times per mode. A model no
 * provider serves, and a grounded item with no pinned bundle, are listed in
 * `skipped` with the reason. A call that fails after the provider's retries
 * is kept as an answer with `text: null` and its error, and counted in
 * `failedCalls`, so a run that lost a vendor never reads as complete (D106).
 */
export async function runFitness(opts: FitnessRunOptions): Promise<FitnessRunFile> {
  const log = opts.onProgress ?? (() => {})
  const skipped: FitnessSkip[] = []
  const prompts: FitnessRunFile['prompts'] = {}
  const bundles: Record<string, string> = {}

  const served: Array<{ model: RosterModel; provider: FitnessProvider; callId: string }> = []
  for (const model of opts.models) {
    const provider = opts.providers.find((p) => p.serves(model))
    if (!provider) {
      skipped.push({ model: model.id, reason: `no provider serves via ${model.via}` })
      continue
    }
    served.push({ model, provider, callId: callIdFor(model, opts.batch && provider.provenance !== 'mock') })
  }

  const jobs: Job[] = []
  for (const item of opts.items) {
    for (const mode of modesFor(item).filter((m) => opts.modes.includes(m))) {
      const bundle = opts.bundles.get(item.id) ?? []
      if (mode === 'grounded' && bundle.length === 0) {
        skipped.push({ itemId: item.id, mode, reason: `no pinned source bundle in data/fitness/sources/${item.id}` })
        continue
      }
      if (mode === 'grounded') bundles[item.id] = bundleHash(bundle)
      const prompt = answerPrompt(item, mode, bundle)
      const hash = promptHash(prompt)
      prompts[hash] = prompt
      for (const { model, provider, callId } of served) {
        for (let sample = 1; sample <= opts.samples; sample++) jobs.push({ item, model, provider, callId, mode, sample, hash })
      }
    }
  }

  log(`${jobs.length} calls: ${opts.items.length} items, ${served.length} models, ${opts.samples} samples`)
  const tally: CallTally = { attempted: 0, failed: 0 }
  let done = 0
  const answers = await pool(jobs, opts.concurrency, tally, async (job): Promise<FitnessAnswer> => {
    const base = {
      itemId: job.item.id,
      itemVersion: job.item.version,
      topic: job.item.topic,
      model: job.model.id,
      mode: job.mode,
      sample: job.sample,
      promptHash: job.hash,
    }
    const started = Date.now()
    try {
      const result = await job.provider.answer(job.callId, prompts[job.hash] as FitnessRunFile['prompts'][string])
      return { ...base, text: result.text, inputTokens: result.inputTokens, outputTokens: result.outputTokens, ms: Date.now() - started }
    } catch (err) {
      return { ...base, text: null, error: err instanceof Error ? err.message : String(err), ms: Date.now() - started }
    } finally {
      if (++done % 50 === 0) log(`  ${done}/${jobs.length}`)
    }
  })
  const recorded = answers.filter((a): a is FitnessAnswer => a !== null)
  const failedCalls = recorded.filter((a) => a.text === null).length

  const models: FitnessRunModel[] = served.map(({ model, provider, callId }) => ({
    id: model.id,
    lab: model.lab,
    label: model.label,
    provider: provider.name,
    provenance: provider.provenance,
    callId,
  }))
  const mock = models.some((m) => m.provenance === 'mock')
  const generatedAt = new Date().toISOString()
  const provenance = mock ? 'mock' : (models[0]?.provenance ?? 'gateway')

  return {
    runId: `${generatedAt.replace(/[:.]/g, '-')}-${provenance}`,
    generatedAt,
    provenance,
    note: mock
      ? 'Deterministic offline stand-in. Exercises the pipeline. Not evidence about any model.'
      : `${served.length} models, ${opts.samples} samples per item and mode.`,
    promptVersion: FITNESS_PROMPT_VERSION,
    samples: opts.samples,
    modes: opts.modes,
    batch: opts.batch,
    items: opts.items.map((item) => ({
      id: item.id,
      version: item.version,
      topic: item.topic,
      kind: item.kind,
      hash: sha256Hex(JSON.stringify(item)),
    })),
    bundles,
    models,
    skipped,
    prompts,
    attemptedCalls: tally.attempted,
    failedCalls: failedCalls + tally.failed,
    answers: recorded,
  }
}
