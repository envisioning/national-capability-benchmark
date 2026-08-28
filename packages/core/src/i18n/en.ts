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
      'Scores are relative to a frame built from all {countries} countries together and run 0 to 100 per dimension, with no headline ranking. Confidence is reported beside every score and never folded into it. Read {limits} before quoting any number on its own.',
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
    raiseHeading: 'The dimensions the evidence says to raise',
    raiseIntro:
      'Lowest score first. Only dimensions with usable evidence appear here. A low score with thin evidence is a measurement problem before it is a policy problem, and it moves to the next section.',
    measureHeading: 'The dimensions that must be measured before they can be managed',
    measureIntro:
      'Confidence here is below the usable band, so the score cannot carry a decision. The first intervention is evidence.',
    holdHeading: 'The dimensions the evidence says to hold',
    holdIntro:
      'Strongest first. These score at or above {threshold} on usable evidence, so nothing here asks to be raised or measured first. A held dimension still decays when nobody watches it.',
    holdItemLine: '{dimension}: {score}, confidence {band}',
    scoredOn: 'Currently scored on {n} observed indicators.',
    scoredOnOne: 'Currently scored on a single observed indicator.',
    gapsLine: 'Declared gaps in this dimension: {list}.',
    retiredLine: 'Datasets examined and rejected for this dimension: {list}.',
    exemplarsLine: 'Highest scores with usable evidence: {list}.',
    evidenceElsewhereLine: 'Documented deliveries elsewhere: {list}.',
    agendaHeading: 'The measurement agenda',
    agendaIntro:
      '{n} indicators the specification asks for with no adequate internationally comparable dataset behind them. Each one lowers confidence until it is filled, and each one is a contribution a statistical agency, a research group or a ministry can make. A gap becomes a scored indicator when a comparable series covers at least two countries.',
    colIndicator: 'Missing indicator',
    colAsks: 'What it asks',
    ownEvidenceHeading: 'What the indicators cannot see about {countryTopic}',
    ownEvidenceIntro:
      'Documented deliveries filed as evidence records. They never enter a score and never raise confidence. They exist because the gap list above also describes things this country has partly done and cannot yet prove comparably.',
    contributeHeading: 'How to move a number on this page',
    contributeBody:
      'Fill a gap, file an evidence record, or contest an indicator at {repo}. The method, every decision behind it and the evidence that would overturn each one are in the docs directory of the same repository.',
    profileLink: 'Open the full profile: every indicator, its raw value, its year and its source',
  },
}
