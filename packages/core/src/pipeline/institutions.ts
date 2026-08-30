import {
  INSTITUTION_RELATION_FAMILY,
  INSTITUTION_SYSTEMS,
} from '../model/institutions.js'
import type {
  InstitutionEdge,
  InstitutionNode,
  InstitutionRelationFamily,
  InstitutionSystem,
} from '../model/institutions.js'
import type { Dimension } from '../model/dimensions.js'

/**
 * Derived views over an institution map.
 *
 * Nothing here reaches a score or a confidence, and nothing here is published
 * into `data/out`. The institution layer explains capability and never measures
 * it, which D54 settled and D56 kept. These functions exist so the viewer and
 * any later report read one computation rather than two. See D58.
 */

export type MatrixFamily = InstitutionRelationFamily | 'all'

export type MatrixCell = {
  from: InstitutionSystem
  to: InstitutionSystem
  count: number
}

export type MatrixBandId = 'low' | 'middle' | 'high'

/**
 * Fixed breaks on the relation count, coarsely logarithmic.
 *
 * Not quantiles. Relation counts are one big spike at 1 with a thin long tail:
 * in the first Brazilian map 13 of 33 filled cells hold exactly one relation
 * and the busiest holds 52. Terciles over that put 2 and 52 in the same band
 * and left a band empty, which is the ramp saying nothing.
 *
 * Fixed breaks are legitimate here because a count is absolute. One relation is
 * one relation in every country, unlike a score, which is a position inside a
 * frame. So the ramp never moves: it does not rescale when the family filter
 * changes, and two countries' matrices can be read side by side.
 *
 * Declared high first so `find` takes the first band the count reaches, which
 * is how `scoreBand` reads its own ramp.
 */
export const MATRIX_BANDS: { id: MatrixBandId; min: number }[] = [
  { id: 'high', min: 5 },
  { id: 'middle', min: 2 },
  { id: 'low', min: 1 },
]

export type InstitutionMatrix = {
  family: MatrixFamily
  /** Row major over `INSTITUTION_SYSTEMS`, both axes, including the diagonal. */
  cells: MatrixCell[]
  /** Relations counted into this matrix. */
  total: number
  /** Cells holding at least one relation. */
  filled: number
  max: number
}

/**
 * Find the institution nodes that a country's dimension-level agenda item
 * should point to. `InstitutionNode.dimensions` is already the curated
 * navigation relationship between an institution and an NCB question. Keep
 * this lookup in one place so the agenda does not grow a second mapping.
 * These ids are links for investigation, never evidence, scores or weights.
 */
export function institutionIdsForDimension(
  nodes: InstitutionNode[],
  dimension: Dimension,
): string[] {
  return [...new Set(nodes.filter((node) => node.dimensions.includes(dimension)).map((node) => node.id))].sort()
}

/** Where a count falls on the ramp. Empty cells have no band. */
export function matrixBand(count: number): MatrixBandId | null {
  if (count <= 0) return null
  return (MATRIX_BANDS.find((band) => count >= band.min) ?? MATRIX_BANDS[MATRIX_BANDS.length - 1])!
    .id
}

/**
 * Count the relations running from every system to every system. `family`
 * narrows the count to one relation family; 'all' counts every relation.
 */
export function buildInstitutionMatrix(
  nodes: InstitutionNode[],
  edges: InstitutionEdge[],
  family: MatrixFamily = 'all',
): InstitutionMatrix {
  const systemOf = new Map(nodes.map((node) => [node.id, node.system]))
  const counts = new Map<string, number>()
  let total = 0

  for (const edge of edges) {
    if (family !== 'all' && INSTITUTION_RELATION_FAMILY[edge.relation] !== family) continue
    const from = systemOf.get(edge.sourceId)
    const to = systemOf.get(edge.targetId)
    if (!from || !to) continue
    const key = `${from}|${to}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
    total += 1
  }

  const cells: MatrixCell[] = []
  for (const from of INSTITUTION_SYSTEMS) {
    for (const to of INSTITUTION_SYSTEMS) {
      cells.push({ from, to, count: counts.get(`${from}|${to}`) ?? 0 })
    }
  }

  const values = cells
    .filter((cell) => cell.count > 0)
    .map((cell) => cell.count)
    .sort((a, b) => a - b)

  return {
    family,
    cells,
    total,
    filled: values.length,
    max: values.length ? (values[values.length - 1] as number) : 0,
  }
}
