/**
 * Prices the gateway charges, US dollars per million tokens.
 *
 * These are read from https://ai-gateway.vercel.sh/v1/models, which is public,
 * needs no key, and states the rate the panel is actually billed at. That is a
 * better source than a vendor pricing page, because the run does not go to the
 * vendor. Every entry below was checked against that endpoint on LAST_VERIFIED.
 *
 * Re-verify and update `LAST_VERIFIED` when you change the panel:
 *
 *   curl -s https://ai-gateway.vercel.sh/v1/models
 *
 * A stale price here produces a confident wrong number, which is worse than no
 * number.
 */
export const LAST_VERIFIED = '2026-08-31'

export type Price = { input: number; output: number; verified: boolean }

export const PRICES: Record<string, Price> = {
  'anthropic/claude-opus-5': { input: 5, output: 25, verified: true },
  'anthropic/claude-sonnet-5': { input: 3, output: 15, verified: true },
  'anthropic/claude-haiku-4-5': { input: 1, output: 5, verified: true },
  'openai/gpt-5': { input: 1.25, output: 10, verified: true },
  'google/gemini-2.5-pro': { input: 1.25, output: 10, verified: true },
  'mistral/mistral-medium-3.5': { input: 1.5, output: 7.5, verified: true },
}

/** Fallback used when a model id is not in the table. Deliberately Opus-tier. */
export const UNKNOWN_PRICE: Price = { input: 5, output: 25, verified: false }

export function priceFor(model: string): Price {
  return PRICES[model] ?? UNKNOWN_PRICE
}

/**
 * Characters per token, measured against this repo's own prompts (mostly English
 * prose with numbers and indicator names). Good to about 10%. For an exact count
 * use the vendor's token-counting endpoint.
 */
export const CHARS_PER_TOKEN = 3.7

/**
 * Output tokens per call, measured from mock runs and rounded up.
 *
 * A cell call returns nine dimensions, each with a score, a self-confidence, a
 * rationale of roughly sixty words and two or three missing-evidence strings.
 * An audit call returns one row per indicator in the dimension.
 *
 * `thinkingMultiplier` covers reasoning tokens, which vendors bill as output.
 * Adaptive thinking on a hard judgement call runs two to four times the visible
 * answer, so the default is deliberately near the top of that range.
 */
export const OUTPUT_TOKENS = {
  cellCall: 1_100,
  auditCall: 600,
  thinkingMultiplier: 3,
}
