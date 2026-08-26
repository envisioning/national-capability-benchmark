/**
 * Confidence bands.
 *
 * `confidence = coverage x recency x source_quality`, so the scale is
 * multiplicative and the top of it is unreachable in practice: a dimension needs
 * full coverage, current data and official sources to pass 0.8. The bands below
 * are set against what a dimension can realistically reach, not against an even
 * split of the 0 to 1 range.
 *
 * This is the single source of truth for the thresholds. The viewer colors by
 * them and the report prints their labels, so the two cannot drift apart.
 */
export type ConfidenceBandId = 'very_thin' | 'thin' | 'usable' | 'good'

export type ConfidenceBand = {
  id: ConfidenceBandId
  /** Inclusive lower bound. */
  min: number
  label: string
  /** What the reader should do about a number in this band. */
  meaning: string
}

export const CONFIDENCE_BANDS: ConfidenceBand[] = [
  {
    id: 'good',
    min: 0.65,
    label: 'good',
    meaning: 'Most indicators observed, recent, from official or intergovernmental sources.',
  },
  {
    id: 'usable',
    min: 0.45,
    label: 'usable',
    meaning: 'Enough evidence to compare countries, with known holes.',
  },
  {
    id: 'thin',
    min: 0.25,
    label: 'thin',
    meaning: 'A minority of indicators, or evidence old enough to have moved. Read with care.',
  },
  {
    id: 'very_thin',
    min: 0,
    label: 'very thin',
    meaning: 'The score rests on one or two indicators. Do not quote it on its own.',
  },
]

export function confidenceBand(value: number): ConfidenceBand {
  return (
    CONFIDENCE_BANDS.find((b) => value >= b.min) ??
    (CONFIDENCE_BANDS[CONFIDENCE_BANDS.length - 1] as ConfidenceBand)
  )
}

/**
 * Band colors, validated with the dataviz palette checker against the light
 * surface (#ffffff) and the dark card surface (#313650).
 *
 * Ordinal chroma ramp: muted navy for thin evidence rising to brand lime for
 * good. Deliberately not a red-to-green scale, which fails for the most common
 * color vision deficiencies and would read as pass/fail rather than as a
 * quantity. Worst adjacent pair is dE 18.7 light and 18.2 dark under normal
 * vision. The dark pair sits at dE 6.8 under tritanopia, which is legal only
 * because the numeric value is printed beside every bar and the bar length
 * carries the same magnitude.
 */
export const CONFIDENCE_BAND_COLORS: Record<ConfidenceBandId, { light: string; dark: string }> = {
  very_thin: { light: '#b8bdd9', dark: '#565d80' },
  thin: { light: '#7b83a8', dark: '#8b93b5' },
  usable: { light: '#454c70', dark: '#c9cfe6' },
  good: { light: '#aacc00', dark: '#d6f249' },
}

/**
 * Whether a cell's evidence is too thin to draw as a solid shape.
 *
 * The radar dashes these axes and prints a mark beside the label, so a profile
 * never implies more evidence than the dimension actually has. The rule lives
 * here with the bands so the chart and the tables cannot disagree.
 */
export function isThinEvidence(value: number): boolean {
  const id = confidenceBand(value).id
  return id === 'thin' || id === 'very_thin'
}
