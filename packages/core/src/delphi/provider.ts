import { z } from 'zod'
import { DIMENSIONS, indicatorsFor } from '../model/index.js'
import type { CountryResult, Dimension, Provenance } from '../model/index.js'
import type { Panelist } from './panel.js'
import { SYSTEM_RULES } from './prompts.js'

export const CellScoreOutput = z.object({
  dimensions: z.array(
    z.object({
      dimension: z.enum(DIMENSIONS),
      score: z.number().min(0).max(100),
      selfConfidence: z.number().min(0).max(1),
      rationale: z.string(),
      missingEvidence: z.array(z.string()),
    }),
  ),
})
export type CellScoreOutput = z.infer<typeof CellScoreOutput>

export const JudgementOutput = z.object({
  indicators: z.array(
    z.object({
      indicatorId: z.string(),
      measurementClass: z.enum(['C', 'I', 'O', 'P']),
      constructValidity: z.number().min(0).max(1),
      wealthProxyRisk: z.number().min(0).max(1),
      redundantWith: z.array(z.string()),
      rationale: z.string(),
    }),
  ),
})
export type JudgementOutput = z.infer<typeof JudgementOutput>

export interface PanelProvider {
  readonly name: string
  /** Written into the run file. Never inferred downstream from model strings. */
  readonly provenance: Provenance
  cellScores(panelist: Panelist, prompt: string): Promise<CellScoreOutput>
  indicatorJudgements(panelist: Panelist, prompt: string): Promise<JudgementOutput>
}

/**
 * Vercel AI Gateway. Bare model ids such as "anthropic/claude-opus-5" resolve
 * through the gateway, so one AI_GATEWAY_API_KEY covers every vendor on the panel.
 */
export class GatewayProvider implements PanelProvider {
  readonly name = 'gateway'
  readonly provenance: Provenance = 'gateway'

  private async call<S extends z.ZodType>(
    model: string,
    prompt: string,
    schema: S,
  ): Promise<z.infer<S>> {
    const { generateObject } = await import('ai')
    const { object } = await generateObject({
      model,
      schema,
      system: SYSTEM_RULES,
      prompt,
      maxRetries: 2,
    })
    return object as z.infer<S>
  }

  cellScores(panelist: Panelist, prompt: string): Promise<CellScoreOutput> {
    return this.call(panelist.model, prompt, CellScoreOutput)
  }

  indicatorJudgements(panelist: Panelist, prompt: string): Promise<JudgementOutput> {
    return this.call(panelist.model, prompt, JudgementOutput)
  }
}

/* --------------------------------- mock --------------------------------- */

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

const STANCE_BIAS: Record<string, Partial<Record<Dimension, number>>> = {
  institutionalist: { coordination: 6, trust: 5, building: 3, agency: -4, experimentation: -4 },
  bottom_up: { agency: 7, experimentation: 6, adaptability: 4, coordination: -5, trust: -3 },
  wealth_sceptic: { building: -7, anticipation: -5, learning: -3, adaptability: 3, shared_purpose: 2 },
  execution_realist: { building: 6, coordination: 4, anticipation: -4, shared_purpose: -3 },
}

/**
 * Deterministic offline panelist. It anchors on the indicator-derived score,
 * applies the stance bias and a stable pseudo-random jitter, and widens its
 * uncertainty where evidence coverage is low. It exists so the whole pipeline
 * runs without an API key. It is not a substitute for the real panel and every
 * run it produces is written with model "mock" so it cannot be mistaken for one.
 */
export class MockProvider implements PanelProvider {
  readonly name = 'mock'
  readonly provenance: Provenance = 'mock'

  constructor(private readonly results: Map<string, CountryResult>) {}

  private iso3FromPrompt(prompt: string): string {
    const m = /\(([A-Z]{3})\)/.exec(prompt)
    return m?.[1] ?? 'BRA'
  }

  async cellScores(panelist: Panelist, prompt: string): Promise<CellScoreOutput> {
    const iso3 = this.iso3FromPrompt(prompt)
    const result = this.results.get(iso3)
    const bias = STANCE_BIAS[panelist.stance.id] ?? {}
    /** Round 2 halves the spread, so the convergence machinery has something to measure. */
    const spread = prompt.includes('This is round 2') ? 0.5 : 1

    return {
      dimensions: DIMENSIONS.map((dimension) => {
        const dim = result?.dimensions[dimension]
        const anchor = dim?.score ?? 50
        const coverage = dim?.confidenceParts.coverage ?? 0
        const jitter = (hash(`${panelist.id}|${iso3}|${dimension}`) - 0.5) * 12
        const score = Math.max(
          0,
          Math.min(
            100,
            anchor + (bias[dimension] ?? 0) * spread + jitter * (1.4 - coverage) * spread,
          ),
        )
        const gaps = indicatorsFor(dimension)
          .filter((d) => d.ingest === 'gap' || d.ingest === 'retired')
          .slice(0, 3)
          .map((d) => `${d.name} (${d.source.publisher})`)
        return {
          dimension,
          score: Math.round(score * 10) / 10,
          selfConfidence: Math.max(0.15, Math.min(0.9, 0.3 + coverage * 0.6)),
          rationale: `Mock panelist (${panelist.stance.label}). Anchored on the indicator score ${anchor ?? 'n/a'} with the stance adjustment for ${dimension}. Evidence coverage ${Math.round(coverage * 100)}%.`,
          missingEvidence: gaps,
        }
      }),
    }
  }

  async indicatorJudgements(panelist: Panelist, prompt: string): Promise<JudgementOutput> {
    const m = /Dimension: (.+)/.exec(prompt)
    const label = m?.[1]?.trim() ?? ''
    const dimension =
      DIMENSIONS.find((d) => label.toLowerCase().startsWith(d.split('_')[0] as string)) ??
      'anticipation'

    return {
      indicators: indicatorsFor(dimension as Dimension).map((d) => ({
        indicatorId: d.id,
        measurementClass: d.measurementClass,
        constructValidity: Math.round((0.4 + hash(`${panelist.id}|${d.id}`) * 0.5) * 100) / 100,
        wealthProxyRisk: d.wealthProxyPrior,
        redundantWith: [],
        rationale: `Mock judgement (${panelist.stance.label}). Repeats the registry prior for ${d.id}.`,
      })),
    }
  }
}
