import { DIMENSION_LABELS, DIMENSION_QUESTIONS } from '../model/dimensions.js'
import { SCORE_BANDS } from '../pipeline/bands.js'
import type { ScoreBandId } from '../pipeline/bands.js'
import { CONFIDENCE_BANDS } from '../pipeline/confidence.js'
import type { ConfidenceBandId } from '../pipeline/confidence.js'
import type { Lexicon } from './types.js'

/**
 * The English lexicon is the ground layer speaking for itself: dimension labels
 * and questions come straight from the registry, and indicator lookups fall
 * back to registry names, so the two cannot drift apart.
 */
export const EN: Lexicon = {
  lang: 'en',
  numberLocale: 'en-US',
  dimensions: DIMENSION_LABELS,
  questions: DIMENSION_QUESTIONS,
  countries: {},
  countryArticles: {},
  indicators: {},
  indicatorDefinitions: {},
  bands: {
    good: 'good',
    usable: 'usable',
    thin: 'thin',
    very_thin: 'very thin',
  },
  /* Read from the band registries rather than restated, so the ground layer
   * cannot drift from itself. */
  bandMeanings: Object.fromEntries(
    CONFIDENCE_BANDS.map((b) => [b.id, b.meaning]),
  ) as Record<ConfidenceBandId, string>,
  scoreBands: Object.fromEntries(
    SCORE_BANDS.map((b) => [b.id, { label: b.label, meaning: b.meaning }]),
  ) as Record<ScoreBandId, { label: string; meaning: string }>,
  legendRange: '{a} to {b}',
  legendRangeTop: '{a} and above',
  radar: {
    compare: 'See every country on this dimension',
  },
  agenda: {
    title: 'Capability agenda: {country}',
    generated: 'Generated {date}',
    intro:
      '{countries} countries set the frame. Scores run 0 to 100 per dimension, with no headline ranking. Confidence sits beside each score. Read {limits} before quoting one.',
    limitsLabel: 'the known limits of the data',
    standingHeading: 'Where {countryTopic} stands',
    colDimension: 'Dimension',
    colScore: 'Score',
    colConfidence: 'Confidence',
    colTrend: 'Trend',
    trendCell: '{delta} over {years} years, on {n} indicators',
    trendCellClamped: '{delta} over {years} years, on {n} indicators, {c} clamped at the frame edge',
    noTrend: 'no trend basket',
    noScore: 'not scored',
    raiseItemHeading: '{dimension}: {score}, confidence {band}',
    measureItemHeading: '{dimension}: confidence {confidence}, {band}',
    raiseHeading: 'Dimensions to raise',
    raiseIntro:
      'Lowest score first. Only dimensions with usable evidence appear here. Thin evidence goes to the next section.',
    measureHeading: 'Dimensions to measure first',
    measureIntro:
      'Confidence is below the usable band, so evidence comes before action.',
    holdHeading: 'Dimensions to hold',
    holdIntro:
      'Strongest first. These score at least {threshold} with usable evidence. They still need watching.',
    holdItemLine: '{dimension}: {score}, confidence {band}',
    scoredOn: 'Based on {n} observed indicators.',
    scoredOnOne: 'Based on one observed indicator.',
    gapsLine: 'Declared gaps: {list}.',
    retiredLine: 'Rejected datasets: {list}.',
    exemplarsLine: 'Highest usable scores: {list}.',
    evidenceElsewhereLine: 'Documented deliveries elsewhere: {list}.',
    agendaHeading: 'Measurement agenda',
    agendaIntro:
      '{n} requested indicators have no adequate comparable dataset. Each lowers confidence. A gap becomes scorable when a comparable series covers at least two countries.',
    colIndicator: 'Missing indicator',
    colAsks: 'What it asks',
    ownEvidenceHeading: 'What indicators cannot see about {countryTopic}',
    ownEvidenceIntro:
      'Documented deliveries filed as evidence. They never affect scores or confidence.',
    contributeHeading: 'Contribute',
    contributeBody:
      'Fill a gap, file evidence, or contest an indicator at {repo}. The docs explain the method and its decisions.',
    profileLink: 'Open the full profile: indicators, values, years and sources',
  },
}
