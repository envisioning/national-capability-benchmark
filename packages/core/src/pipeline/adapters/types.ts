import type { Observation } from '../../model/schema.js'

/**
 * The result every non-World-Bank source adapter returns before observations
 * are joined into the shared store. Coverage is explicit so a partial source
 * cannot look like a complete benchmark refresh.
 */
export type SourceAdapterResult = {
  adapterId: string
  observations: Observation[]
  availableCountries: string[]
  emittedCountries: string[]
  heldCountries: string[]
  unmappedLabels: string[]
  sourceUrl: string
  release: string
}

/** A deterministic importer for one pinned publisher release. */
export type SourceAdapter<Options = { sourceUrl?: string; retrievedAt?: string }> = (
  options?: Options,
) => Promise<SourceAdapterResult>
