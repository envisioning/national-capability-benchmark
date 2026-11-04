import { DIMENSION_LABELS } from '@ncb/core'
import type { Dimension } from '@ncb/core'

/**
 * A dimension's name in the viewer's sentence case. The registry is the ground
 * layer and keeps its own casing.
 */
export function sentenceLabel(name: string): string {
  return name === 'Shared Purpose' ? 'Shared purpose' : name
}

export const dimensionLabel = (dimension: Dimension): string =>
  sentenceLabel(DIMENSION_LABELS[dimension])
