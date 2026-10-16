/* The residual reading lives in core since D163, so the bench's brief and
 * every page read the same templates. See packages/core/src/pipeline/residual-reading.ts. */
export { NARROW_MARGIN, readResidualStructure } from '@ncb/core'
export type { ResidualReading } from '@ncb/core'
