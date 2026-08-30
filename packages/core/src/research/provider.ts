import { z } from 'zod'
import {
  ResearchCritiqueOutput,
  ResearchScoutOutput,
} from '../model/research.js'
import type { ResearchCritiqueOutput as ResearchCritiqueOutputType, ResearchScoutOutput as ResearchScoutOutputType } from '../model/research.js'

/** AI research calls share provenance with the Delphi layer. */
export interface ResearchProvider {
  readonly name: string
  readonly provenance: 'gateway' | 'mock'
  scout(prompt: string): Promise<ResearchScoutOutputType>
  critique(prompt: string): Promise<ResearchCritiqueOutputType>
}

const RESEARCH_SYSTEM_RULES = `You are an evidence-research assistant for the Envisioning National Capability Benchmark.

The benchmark distinguishes a research lead from a published evidence record.
Never invent facts, statistics, source URLs, coverage, dates or programme results.
A research lead may propose what to investigate, but it must not be presented as
verified. The published evidence layer requires a declared gap, a named
publisher's dated number, an institutional delivery at national scale, and an
honest account of what the number does not show. Survey or perception constructs
cannot be made valid by attaching a programme to them.

The model's output is an internal research artifact. It does not change scores,
confidence, the registry or data/evidence/records.json.`

/** Real research calls use the same AI Gateway configured for Delphi. */
export class GatewayResearchProvider implements ResearchProvider {
  readonly name = 'gateway'
  readonly provenance = 'gateway' as const

  constructor(private readonly model: string) {}

  private async call<S extends z.ZodType>(modelSchema: S, prompt: string): Promise<z.infer<S>> {
    const { generateObject } = await import('ai')
    const { object } = await generateObject({
      model: this.model,
      schema: modelSchema,
      system: RESEARCH_SYSTEM_RULES,
      prompt,
      maxRetries: 2,
    })
    return object as z.infer<S>
  }

  async scout(prompt: string): Promise<ResearchScoutOutputType> {
    return this.call(ResearchScoutOutput, prompt)
  }

  async critique(prompt: string): Promise<ResearchCritiqueOutputType> {
    return this.call(ResearchCritiqueOutput, prompt)
  }
}
