/**
 * Score bands.
 *
 * Every 0 to 100 number in this project is the same quantity measured the same
 * way, so it gets one display everywhere: a filled chip carrying the number,
 * coloured by band. One component, one ramp, no per-table variations.
 *
 * Four bands rather than a continuous ramp because the job is at-a-glance
 * comparison across a wide table. A continuous tint cannot separate 20 from 40
 * at chip size, which is exactly the reading this table exists for.
 *
 * The labels are deliberately frame-relative. A score is a position against the
 * countries in the benchmark, not an absolute verdict, so "strong" here means
 * strong within that frame. See docs/DECISIONS.md D16.
 */
export type ScoreBandId = 'weak' | 'below_middle' | 'above_middle' | 'strong'

export type ScoreBand = {
  id: ScoreBandId
  /** Inclusive lower bound on the 0 to 100 scale. */
  min: number
  label: string
  meaning: string
}

export const SCORE_BANDS: ScoreBand[] = [
  {
    id: 'strong',
    min: 75,
    label: 'strong',
    meaning: 'Near the top of the frame on this dimension.',
  },
  {
    id: 'above_middle',
    min: 50,
    label: 'above middle',
    meaning: 'In the upper half of the frame.',
  },
  {
    id: 'below_middle',
    min: 25,
    label: 'below middle',
    meaning: 'In the lower half of the frame.',
  },
  {
    id: 'weak',
    min: 0,
    label: 'weak',
    meaning: 'Near the floor of the frame. Check the confidence before reading anything into it.',
  },
]

export function scoreBand(value: number): ScoreBand {
  return (
    SCORE_BANDS.find((b) => value >= b.min) ?? (SCORE_BANDS[SCORE_BANDS.length - 1] as ScoreBand)
  )
}

/**
 * Band fills and the text colour that sits on each, validated with the dataviz
 * palette checker against the light surface and the dark card surface.
 *
 * The ramp runs from a tint that recedes into the page at the bottom, through
 * navy, to brand lime at the top. Low values sink, high values stand out, in
 * both themes. Deliberately not red to green: that fails for the common colour
 * vision deficiencies and reads as pass and fail when the thing being encoded
 * is a position on a scale.
 *
 * Worst adjacent pair separates at dE 22.6 light and 22.0 dark under normal
 * vision. Every label clears 4.5:1 against its fill.
 */
export const SCORE_BAND_COLORS: Record<
  ScoreBandId,
  { light: string; lightInk: string; dark: string; darkInk: string }
> = {
  weak: { light: '#d7dbe8', lightInk: '#272a3d', dark: '#2b3049', darkInk: '#fafafa' },
  below_middle: { light: '#8b93b5', lightInk: '#272a3d', dark: '#646b8f', darkInk: '#fafafa' },
  above_middle: { light: '#454c70', lightInk: '#fafafa', dark: '#c9cfe6', darkInk: '#272a3d' },
  strong: { light: '#aacc00', lightInk: '#272a3d', dark: '#d6f249', darkInk: '#272a3d' },
}
