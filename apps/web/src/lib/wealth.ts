/* The wealth-tracking reading lives in core since D163, so the bench's brief
 * and every page read the same column. See packages/core/src/pipeline/wealth-reading.ts. */
export { readWealthTracking, strengthText } from '@ncb/core'
export type { WealthReading, WealthRow } from '@ncb/core'
