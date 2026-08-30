import { DIMENSION_LABELS, WEALTH_CORRELATION_THRESHOLD } from '@ncb/core'
import type { Diagnostics, Dimension } from '@ncb/core'

/**
 * How far each capability travels with income, read once.
 *
 * This is the claim the benchmark exists to test: that a country's ability to
 * act can be observed apart from how rich it is. The diagnostics page publishes
 * the full table, the thesis draws it and the front page states its range, so
 * all three read this function rather than each computing a summary of the same
 * column. See D3 and the wealth-sensitivity artefacts in docs/KNOWN-ARTEFACTS.md.
 *
 * The sign is dropped. A capability that fell as income rose would still be
 * explained by income, and no dimension does that in the current data.
 */

/** One capability against GDP per head. */
export type WealthRow = {
  dimension: Dimension
  label: string
  /** Absolute Pearson correlation with log GDP per capita, or null when unscored. */
  strength: number | null
  /** Countries in that correlation. */
  n: number
  /** Whether the capability tracks income at or above the published threshold. */
  tracksWealth: boolean
}

/** The whole column, plus the facts a sentence needs. */
export type WealthReading = {
  rows: WealthRow[]
  /** Rows with a correlation, sorted weakest first: the ones that separate lead. */
  ranked: WealthRow[]
  /** Weakest and strongest tie to income. */
  weakest: WealthRow | null
  strongest: WealthRow | null
  /** Capabilities at or above the threshold, strongest first. */
  tracking: WealthRow[]
  /** Capabilities below it, weakest first. These are the ones that survive the test. */
  separate: WealthRow[]
  /** The published cutoff, so no page writes 0.7 by hand. */
  threshold: number
}

export function readWealthTracking(diag: Diagnostics): WealthReading {
  const rows: WealthRow[] = diag.dimensionVsGdp.map((row) => {
    const strength = row.pearson === null ? null : Math.abs(row.pearson)
    return {
      dimension: row.dimension,
      label: DIMENSION_LABELS[row.dimension],
      strength,
      n: row.n,
      tracksWealth: strength !== null && strength >= WEALTH_CORRELATION_THRESHOLD,
    }
  })

  const ranked = rows
    .filter((row): row is WealthRow & { strength: number } => row.strength !== null)
    .sort((a, b) => a.strength - b.strength)

  return {
    rows,
    ranked,
    weakest: ranked[0] ?? null,
    strongest: ranked[ranked.length - 1] ?? null,
    tracking: ranked.filter((row) => row.tracksWealth).reverse(),
    separate: ranked.filter((row) => !row.tracksWealth),
    threshold: WEALTH_CORRELATION_THRESHOLD,
  }
}

/** The correlation as a reader sees it, or the words for a missing one. */
export const strengthText = (row: WealthRow): string =>
  row.strength === null ? 'no data' : row.strength.toFixed(2)
