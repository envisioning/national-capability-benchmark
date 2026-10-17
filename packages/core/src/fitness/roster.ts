import { sha256Hex } from '../delphi/sha256.js'

/**
 * The models the fitness module tests and the judges that grade them. The one
 * place either list is declared. Ids are gateway ids, checked against
 * https://ai-gateway.vercel.sh/v1/models, except Sabiá, which is not on the
 * gateway and needs its own provider. Re-check every id before a run: a stale
 * one fails the whole model (D106).
 */

export type Lab = 'maritaca' | 'anthropic' | 'openai' | 'google' | 'spacexai' | 'deepseek'

export type RosterModel = { id: string; lab: Lab; label: string; via: 'gateway' | 'maritaca' }

export const FITNESS_MODELS: readonly RosterModel[] = [
  { id: 'maritaca/sabia-4', lab: 'maritaca', label: 'Sabiá-4', via: 'maritaca' },
  { id: 'anthropic/claude-opus-5.5', lab: 'anthropic', label: 'Claude Opus 5.5', via: 'gateway' },
  { id: 'openai/gpt-5.6-sol', lab: 'openai', label: 'GPT-5.6 Sol', via: 'gateway' },
  { id: 'google/gemini-3.1-pro-preview', lab: 'google', label: 'Gemini 3.1 Pro', via: 'gateway' },
  { id: 'spacexai/grok-4.7', lab: 'spacexai', label: 'Grok 4.7', via: 'gateway' },
  { id: 'deepseek/deepseek-v4-pro', lab: 'deepseek', label: 'DeepSeek V4 Pro', via: 'gateway' },
]

/** Three judges from three labs. No judge grades an answer from its own lab. */
export const FITNESS_JUDGES: readonly RosterModel[] = [
  { id: 'anthropic/claude-sonnet-5.5', lab: 'anthropic', label: 'Claude Sonnet 5.5', via: 'gateway' },
  { id: 'openai/gpt-5.6-terra', lab: 'openai', label: 'GPT-5.6 Terra', via: 'gateway' },
  { id: 'google/gemini-3.5-flash', lab: 'google', label: 'Gemini 3.5 Flash', via: 'gateway' },
]

export const JUDGES_PER_ANSWER = 2

/**
 * The two judges for one answer. Judges from the answer's own lab are
 * excluded. Where that leaves three, the pair rotates by item id, so the
 * assignment is fixed by the item and never by run order.
 */
export function judgesFor(answerLab: Lab, itemId: string): RosterModel[] {
  const eligible = FITNESS_JUDGES.filter((judge) => judge.lab !== answerLab)
  if (eligible.length < JUDGES_PER_ANSWER) {
    throw new Error(`Only ${eligible.length} judge(s) outside ${answerLab}; the roster needs ${JUDGES_PER_ANSWER}.`)
  }
  if (eligible.length === JUDGES_PER_ANSWER) return eligible
  const skip = Number.parseInt(sha256Hex(itemId).slice(0, 8), 16) % eligible.length
  return eligible.filter((_, index) => index !== skip)
}
