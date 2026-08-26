import { DIMENSIONS } from '../model/index.js'
import type { CountryResult } from '../model/index.js'
import { buildPanel } from './panel.js'
import type { Panelist } from './panel.js'
import {
  anonymiseRound,
  indicatorJudgementPrompt,
  round1CellPrompt,
  round2CellPrompt,
  SYSTEM_RULES,
} from './prompts.js'
import { CHARS_PER_TOKEN, OUTPUT_TOKENS, priceFor } from './pricing.js'

export type CostOptions = {
  countries: CountryResult[]
  models: string[]
  stances: number
  rounds: number
  judgeIndicators: boolean
}

export type CostEstimate = {
  calls: { cell: number; audit: number; total: number }
  tokens: { input: number; output: number }
  perPanelist: Array<{
    panelist: string
    model: string
    verifiedPrice: boolean
    inputTokens: number
    outputTokens: number
    usd: number
  }>
  usdTotal: number
  anyUnverifiedPrice: boolean
}

const tokens = (chars: number) => Math.round(chars / CHARS_PER_TOKEN)

/**
 * Estimates cost by building the prompts this repo would actually send and
 * measuring them, rather than by guessing. Re-run it after any prompt change:
 * the evidence brief grows with the indicator registry, and round 2 carries
 * round 1 back, so both scale with the registry rather than staying fixed.
 */
export function estimateCost(opts: CostOptions): CostEstimate {
  const panel = buildPanel(opts.models, opts.stances)
  const sample = panel[0] as Panelist
  const systemTokens = tokens(SYSTEM_RULES.length)

  const round1 = opts.countries.map((c) => tokens(round1CellPrompt(sample, c).length))

  /** A worked round-1 answer set, so the round-2 prompt is sized with real content. */
  const priorFor = (c: CountryResult) =>
    DIMENSIONS.flatMap((dimension) =>
      panel.map((p) => ({
        dimension,
        score: 55,
        panelist: p.id,
        rationale:
          'The indicator base is thin here and the two observable measures point in opposite directions, so I am anchoring below the derived score.',
      })),
    )
  const round2 = opts.countries.map((c) =>
    tokens(round2CellPrompt(sample, c, anonymiseRound(priorFor(c), sample.id)).length),
  )
  const audit = DIMENSIONS.map((d) => tokens(indicatorJudgementPrompt(sample, d).length))

  const cellCallsPerPanelist = opts.countries.length * opts.rounds
  const auditCallsPerPanelist = opts.judgeIndicators ? DIMENSIONS.length : 0
  const callsPerPanelist = cellCallsPerPanelist + auditCallsPerPanelist

  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)
  const cellInput =
    sum(round1) + (opts.rounds > 1 ? sum(round2) * (opts.rounds - 1) : 0)
  const auditInput = opts.judgeIndicators ? sum(audit) : 0
  const inputPerPanelist = cellInput + auditInput + systemTokens * callsPerPanelist

  const outputPerPanelist =
    (cellCallsPerPanelist * OUTPUT_TOKENS.cellCall + auditCallsPerPanelist * OUTPUT_TOKENS.auditCall) *
    OUTPUT_TOKENS.thinkingMultiplier

  const perPanelist = panel.map((p) => {
    const price = priceFor(p.model)
    const usd =
      (inputPerPanelist / 1_000_000) * price.input +
      (outputPerPanelist / 1_000_000) * price.output
    return {
      panelist: p.stance.label,
      model: p.model,
      verifiedPrice: price.verified,
      inputTokens: inputPerPanelist,
      outputTokens: outputPerPanelist,
      usd: Math.round(usd * 100) / 100,
    }
  })

  return {
    calls: {
      cell: cellCallsPerPanelist * panel.length,
      audit: auditCallsPerPanelist * panel.length,
      total: callsPerPanelist * panel.length,
    },
    tokens: {
      input: inputPerPanelist * panel.length,
      output: outputPerPanelist * panel.length,
    },
    perPanelist,
    usdTotal: Math.round(perPanelist.reduce((a, b) => a + b.usd, 0) * 100) / 100,
    anyUnverifiedPrice: perPanelist.some((p) => !p.verifiedPrice),
  }
}
