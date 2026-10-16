/* The one-factor reading lives in core since D163, so the bench's brief and
 * every page read the same templates. See packages/core/src/pipeline/factor-reading.ts. */
export { factorHistorySentence, readFactorTest } from '@ncb/core'
export type { FactorReading } from '@ncb/core'
