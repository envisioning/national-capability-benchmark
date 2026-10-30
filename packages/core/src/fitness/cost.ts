import { batchPriceFor, CHARS_PER_TOKEN, priceFor } from '../delphi/pricing.js'
import type { Price } from '../delphi/pricing.js'
import { answerPrompt, FITNESS_RUBRIC, judgePrompt } from './prompts.js'
import type { BundleSource } from './prompts.js'
import { FITNESS_JUDGES, FITNESS_MODELS, JUDGES_PER_ANSWER } from './roster.js'
import type { RosterModel } from './roster.js'
import type { FitnessItem } from './schema.js'

/**
 * Token assumptions per call. `measureFitnessTokens` replaces every input
 * figure with the prompts the run and the grade steps actually build, where
 * items exist. Output cannot be measured before a run: it includes thinking,
 * which vendors bill as output, and dominates the total.
 */
export const FITNESS_TOKENS = {
  closedInput: 800,
  /** The question plus the item's source bundle. */
  groundedInput: 3_800,
  answerOutput: 1_500,
  judgeInput: 3_300,
  /** The rubric part of the judge prompt: the same prefix on every call, so it caches. */
  judgeRubric: 2_000,
  judgeOutput: 600,
  /** Cached input is billed at about a tenth of the list rate. */
  cachedShare: 0.1,
  /** The visible part of an answer, which the judge reads. Thinking is not passed on. */
  answerVisible: 500,
}

export type FitnessTokens = typeof FITNESS_TOKENS

/** Which input figures came from real prompts and which are still assumptions. */
export type MeasuredTokens = { tokens: FitnessTokens; measured: Array<keyof FitnessTokens>; groundedWithoutBundle: number }

const tokensOf = (chars: number) => Math.round(chars / CHARS_PER_TOKEN)
const mean = (xs: number[]) => (xs.length === 0 ? null : Math.round(xs.reduce((a, b) => a + b, 0) / xs.length))

/**
 * Builds the answer and judge prompts for the items given, the way `bench
 * cost` builds the panel's, and measures them. The judge prompt is sized with
 * a placeholder answer of `answerVisible` tokens. A fact item with no pinned
 * bundle is measured without one and counted, because its grounded prompt
 * does not exist yet.
 */
export function measureFitnessTokens(items: readonly FitnessItem[], bundles: Map<string, BundleSource[]>): MeasuredTokens {
  const tokens = { ...FITNESS_TOKENS }
  const measured: Array<keyof FitnessTokens> = []
  const placeholder = 'x'.repeat(Math.round(FITNESS_TOKENS.answerVisible * CHARS_PER_TOKEN))
  const closed = mean(items.map((item) => tokensOf(answerPrompt(item, 'closed').prompt.length)))
  const withBundle = items.filter((item) => item.kind === 'fact' && bundles.has(item.id))
  const grounded = mean(withBundle.map((item) => tokensOf(answerPrompt(item, 'grounded', bundles.get(item.id)).prompt.length)))
  const judge = mean(items.map((item) => tokensOf(FITNESS_RUBRIC.length + judgePrompt(item, 'closed', placeholder).length)))
  if (closed !== null) {
    tokens.closedInput = closed
    measured.push('closedInput')
  }
  if (grounded !== null) {
    tokens.groundedInput = grounded
    measured.push('groundedInput')
  }
  if (judge !== null) {
    tokens.judgeInput = judge
    tokens.judgeRubric = tokensOf(FITNESS_RUBRIC.length)
    measured.push('judgeInput', 'judgeRubric')
  }
  return { tokens, measured, groundedWithoutBundle: items.filter((item) => item.kind === 'fact').length - withBundle.length }
}

/** When the roster's prices were read from the gateway list, in `pricing.ts`. */
export const FITNESS_PRICES_VERIFIED = '2026-10-17'

/** The item counts the design plans. A run over real items counts them instead. */
export const FITNESS_SCOPES = {
  pilot: { fact: 60, value: 20 },
  full: { fact: 300, value: 100 },
} as const
export type FitnessScope = keyof typeof FITNESS_SCOPES

export type FitnessCostOptions = {
  items: { fact: number; value: number }
  samples: number
  models?: readonly RosterModel[]
  judges?: readonly RosterModel[]
  /** Measured figures from `measureFitnessTokens`; the assumptions otherwise. */
  tokens?: FitnessTokens
}

export type FitnessCostLine = {
  role: 'answer' | 'judge'
  model: string
  calls: number
  inputTokens: number
  outputTokens: number
  usd: number
  /** Null where the gateway lists no batch rate. */
  usdBatch: number | null
  verifiedPrice: boolean
}

export type FitnessCostEstimate = {
  answers: number
  judgeCalls: number
  lines: FitnessCostLine[]
  usd: number
  /** Batch where a rate exists, list price otherwise, rubric cached. */
  usdCheapest: number
  anyUnverifiedPrice: boolean
}

const usdFor = (price: Price, input: number, output: number) =>
  (input / 1_000_000) * price.input + (output / 1_000_000) * price.output
const cents = (n: number) => Math.round(n * 100) / 100

/**
 * Prices one run. Fact items run in both modes, value items in `closed`
 * only, every answer is sampled `samples` times, and every answer is graded
 * by two judges. Judge calls are spread evenly over the judges, which is what
 * the rotation in `judgesFor` produces across many items.
 */
export function estimateFitnessCost(opts: FitnessCostOptions): FitnessCostEstimate {
  const models = opts.models ?? FITNESS_MODELS
  const judges = opts.judges ?? FITNESS_JUDGES
  const t = opts.tokens ?? FITNESS_TOKENS

  const groundedPerModel = opts.items.fact * opts.samples
  const closedPerModel = (opts.items.fact + opts.items.value) * opts.samples
  const answersPerModel = groundedPerModel + closedPerModel
  const answerInput = groundedPerModel * t.groundedInput + closedPerModel * t.closedInput
  const answerOutput = answersPerModel * t.answerOutput

  const lines: FitnessCostLine[] = models.map((model) => {
    const price = priceFor(model.id)
    const batch = batchPriceFor(model.id)
    return {
      role: 'answer',
      model: model.id,
      calls: answersPerModel,
      inputTokens: answerInput,
      outputTokens: answerOutput,
      usd: cents(usdFor(price, answerInput, answerOutput)),
      usdBatch: batch ? cents(usdFor(batch, answerInput, answerOutput)) : null,
      verifiedPrice: price.verified,
    }
  })

  const answers = answersPerModel * models.length
  const judgeCalls = answers * JUDGES_PER_ANSWER
  const callsPerJudge = judgeCalls / judges.length
  const judgeInput = callsPerJudge * t.judgeInput
  const judgeInputCached = callsPerJudge * (t.judgeInput - t.judgeRubric + t.judgeRubric * t.cachedShare)
  const judgeOutput = callsPerJudge * t.judgeOutput

  for (const judge of judges) {
    const price = priceFor(judge.id)
    const batch = batchPriceFor(judge.id)
    lines.push({
      role: 'judge',
      model: judge.id,
      calls: callsPerJudge,
      inputTokens: judgeInput,
      outputTokens: judgeOutput,
      usd: cents(usdFor(price, judgeInput, judgeOutput)),
      usdBatch: cents(usdFor(batch ?? price, judgeInputCached, judgeOutput)),
      verifiedPrice: price.verified,
    })
  }

  return {
    answers,
    judgeCalls,
    lines,
    usd: cents(lines.reduce((sum, line) => sum + line.usd, 0)),
    usdCheapest: cents(lines.reduce((sum, line) => sum + (line.usdBatch ?? line.usd), 0)),
    anyUnverifiedPrice: lines.some((line) => !line.verifiedPrice),
  }
}
