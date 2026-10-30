import { sha256Hex } from '../delphi/sha256.js'
import { batchPriceFor } from '../delphi/pricing.js'
import { FITNESS_RUBRIC } from './prompts.js'
import type { AnswerPrompt } from './prompts.js'
import type { RosterModel } from './roster.js'
import { AccuracyGrade, JudgeOutput, RestraintGrade } from './schema.js'
import type { FitnessProvenance } from './schema.js'

export type AnswerResult = { text: string; inputTokens?: number | undefined; outputTokens?: number | undefined }

/**
 * What the run and the grade steps call. One provider serves one route: the
 * gateway, Maritaca (FIT-1, not built), or the mock. The provider is written
 * per model into the run file, so provenance is stored, never inferred (D14).
 */
export interface FitnessProvider {
  readonly name: string
  readonly provenance: FitnessProvenance
  /** Whether this provider can call a roster model at all. */
  serves(model: RosterModel): boolean
  answer(callId: string, prompt: AnswerPrompt): Promise<AnswerResult>
  judge(callId: string, prompt: string): Promise<JudgeOutput>
}

/**
 * The id to call. With `batch`, the gateway's `-batch` id where it lists one,
 * which bills at the batch rate in `pricing.ts`; otherwise the roster id.
 */
export function callIdFor(model: RosterModel, batch: boolean): string {
  return batch && model.via === 'gateway' && batchPriceFor(model.id) ? `${model.id}-batch` : model.id
}

/** Vercel AI Gateway. One AI_GATEWAY_API_KEY covers every roster model but Sabiá. */
export class GatewayFitnessProvider implements FitnessProvider {
  readonly name = 'gateway'
  readonly provenance: FitnessProvenance = 'gateway'

  serves(model: RosterModel): boolean {
    return model.via === 'gateway'
  }

  async answer(callId: string, prompt: AnswerPrompt): Promise<AnswerResult> {
    const { generateText } = await import('ai')
    const result = await generateText({
      model: callId,
      ...(prompt.system ? { instructions: prompt.system } : {}),
      prompt: prompt.prompt,
      maxRetries: 2,
    })
    return { text: result.text, inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens }
  }

  /** Judges run at low effort, with the rubric as the whole system prompt so the prefix caches. */
  async judge(callId: string, prompt: string): Promise<JudgeOutput> {
    const { generateText, Output } = await import('ai')
    const { output } = await generateText({
      model: callId,
      output: Output.object({ schema: JudgeOutput }),
      instructions: FITNESS_RUBRIC,
      prompt,
      reasoning: 'low',
      maxRetries: 2,
    })
    return output as JudgeOutput
  }
}

const unit = (s: string) => Number.parseInt(sha256Hex(s).slice(0, 8), 16) / 0xffffffff

/**
 * Deterministic offline stand-in for every model and judge. It exercises the
 * run, grade and report steps without a key. Its answers and grades are
 * noise: a run that touches it is written with provenance `mock`, and the
 * report refuses to publish it.
 */
export class MockFitnessProvider implements FitnessProvider {
  readonly name = 'mock'
  readonly provenance: FitnessProvenance = 'mock'

  serves(): boolean {
    return true
  }

  async answer(callId: string, prompt: AnswerPrompt): Promise<AnswerResult> {
    const text = `Resposta simulada (${callId}). Não é evidência sobre nenhum modelo. ${prompt.prompt.slice(-80)}`
    return { text, inputTokens: Math.round(prompt.prompt.length / 3.7), outputTokens: Math.round(text.length / 3.7) }
  }

  async judge(callId: string, prompt: string): Promise<JudgeOutput> {
    const fact = /, fact item,/.test(prompt)
    const accuracy = AccuracyGrade.options
    const restraint = RestraintGrade.options
    const positions = [...prompt.matchAll(/^ {2}([a-z0-9_]+): /gm)].map((m) => m[1] as string)
    /* Mostly the same grade from every judge, so the alpha machinery has agreement to measure. */
    const shared = unit(prompt)
    const own = unit(`${callId}|${prompt}`)
    const pick = <T>(list: readonly T[]) => list[Math.floor((own < 0.2 ? own * 5 : shared) * list.length) % list.length] as T
    const grade = pick(restraint)
    return {
      accuracy: fact ? pick(accuracy) : null,
      restraint: grade,
      favouredPosition: !fact && (grade === 'leans' || grade === 'takes_side') ? (positions[0] ?? null) : null,
      omittedPositions: [],
      rationale: `Mock judge (${callId}). Not a grade of any answer.`,
    }
  }
}
