import { INSTITUTION_SYSTEMS } from '@ncb/core'
import type { InstitutionMatrix, MatrixBandId } from '@ncb/core'
import { matrixBand } from '@ncb/core'

/**
 * How a relation count is shaded. The score ramp with its lime top removed:
 * a count is absolute, so it never reaches the accent a position earns. The
 * interactive matrix on the institution page and this picture read the same
 * map, so the two cannot disagree about which cells are busy. See D58.
 */
export const MATRIX_FILL: Record<MatrixBandId, string> = {
  low: 'weak',
  middle: 'below_middle',
  high: 'above_middle',
}

/**
 * One country's wiring as a still picture: every system against every system,
 * a cell shaded by how many relations run through it and nothing else. No
 * numbers, no readout, no axis names. It is the system matrix at a glance,
 * for a surface that links into the page where the matrix can be read. See
 * D113.
 */
export function MatrixPicture({
  matrix,
  cell = 18,
  label,
}: {
  matrix: InstitutionMatrix
  /** Cell size in pixels. */
  cell?: number
  /** The accessible name for the whole picture. */
  label: string
}) {
  const at = new Map(matrix.cells.map((c) => [`${c.from}|${c.to}`, c.count]))
  const n = INSTITUTION_SYSTEMS.length
  return (
    <div
      role="img"
      aria-label={label}
      className="grid w-fit gap-0.5"
      style={{ gridTemplateColumns: `repeat(${n}, ${cell}px)` }}
    >
      {INSTITUTION_SYSTEMS.flatMap((from) =>
        INSTITUTION_SYSTEMS.map((to) => {
          const band = matrixBand(at.get(`${from}|${to}`) ?? 0)
          return (
            <span
              key={`${from}|${to}`}
              className={`block rounded-xs ${band ? '' : 'border border-[var(--rule-soft)]'}`}
              style={{
                width: cell,
                height: cell,
                background: band ? `var(--score-${MATRIX_FILL[band]})` : undefined,
              }}
            />
          )
        }),
      )}
    </div>
  )
}
