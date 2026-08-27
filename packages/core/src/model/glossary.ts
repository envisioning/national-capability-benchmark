import type { MeasurementClass } from './schema.js'

/**
 * Plain-language definitions for every term this project invents or borrows.
 *
 * One source of truth. The viewer renders it, the report can print it, and
 * nothing in either is allowed to explain a term its own way. Written for
 * somebody who has never seen the benchmark before: no jargon inside a
 * definition unless that jargon is itself an entry here.
 */
export type GlossaryGroup =
  | 'What is being measured'
  | 'How a number is made'
  | 'How good the evidence is'
  | 'What is missing'
  | 'How things change over time'
  | 'What sits beside the score'

export type GlossaryEntry = {
  term: string
  group: GlossaryGroup
  /** One line, for a tooltip or a table cell. */
  short: string
  /** The full explanation. Assume the reader knows nothing about this project. */
  full: string
  /** A concrete case from the current data. */
  example?: string
}

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  'What is being measured',
  'How a number is made',
  'How good the evidence is',
  'What is missing',
  'How things change over time',
  'What sits beside the score',
]

/** What each measurement class means, without the vocabulary of the field. */
export const MEASUREMENT_CLASS_MEANING: Record<
  MeasurementClass,
  { label: string; plain: string; example: string }
> = {
  C: {
    label: 'direct capability measure',
    plain: 'Measures the thing itself.',
    example:
      'Days to register a company measures how hard it is to start something, which is the capability being asked about.',
  },
  I: {
    label: 'capability input',
    plain: 'Measures something that feeds the capability, not the capability.',
    example:
      'Money spent on research is an input. Spending it does not prove a country reads the future well.',
  },
  O: {
    label: 'downstream outcome',
    plain: 'Measures a result that usually follows from the capability.',
    example:
      'Patents follow from experimenting, and they also follow from a legal department that files defensively. Korea files at volume, which is why its patent number says less than it looks.',
  },
  P: {
    label: 'perception proxy',
    plain: 'Records what people or experts say rather than what anybody did.',
    example:
      'The Worldwide Governance Indicators aggregate expert opinion about a country. Seven such indicators were retired from this benchmark because they tracked income per head instead of capability.',
  },
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Capability',
    group: 'What is being measured',
    short: 'What a country is able to do, separately from how rich it is.',
    full: 'The benchmark asks what a country can do: anticipate change, coordinate action, learn, adapt and build under uncertainty. That is deliberately not the same question as how wealthy, comfortable or competitive it is. Wealth buys many capabilities, so the two are related, and the whole design exists to keep them apart far enough to see the difference.',
  },
  {
    term: 'Dimension',
    group: 'What is being measured',
    short: 'One of the nine capabilities, each scored on its own.',
    full: 'Nine dimensions, each with a question it has to answer, each scored from 0 to 100 on its own evidence. They are never added together into one number. Two countries with the same average can have opposite shapes, and reading that difference is what the benchmark is for.',
    example: 'Building asks whether a country turns plans into working systems. Trust asks how much cooperation is possible beyond people who already know each other.',
  },
  {
    term: 'Indicator',
    group: 'What is being measured',
    short: 'One published statistic used as evidence for one dimension.',
    full: 'Each dimension is built from several indicators, each a real published number with a source and a year. A dimension score is the average of whichever of its indicators have data. Every indicator stays visible with its raw value, so a score can be argued with rather than only accepted.',
  },
  {
    term: 'Measurement class',
    group: 'What is being measured',
    short: 'Whether an indicator measures the capability, an input, a result, or an opinion.',
    full: 'Every indicator is labelled C, I, O or P and the label is stored in the data. C measures the capability itself. I measures something that feeds it. O measures a result that usually follows from it. P records what people or experts say. The benchmark prefers C, then I, and uses O and P only where nothing better exists. This label turned out to matter more than expected: perception indicators tracked income per head far more closely than direct measures did, which is why the perception layer was retired.',
    example: 'Time to register a company is C. Research spending is I. Patents are O. An expert survey about government quality is P.',
  },
  {
    term: 'Score',
    group: 'How a number is made',
    short: 'A position from 0 to 100 inside a fixed comparison frame.',
    full: 'A dimension score runs from 0 to 100, where 0 is the weakest and 100 the strongest of the ten reference countries on that measure. It is a position in a frame, so a score of 10 means near the floor of this particular comparison. It does not mean ten percent of a capability, and it is not a percentage of anything.',
  },
  {
    term: 'Reference frame',
    group: 'How a number is made',
    short: 'The ten countries whose values fix the ends of every scale.',
    full: 'The endpoints of every indicator scale come from ten reference countries and nothing else. Every other country is measured against that same fixed frame, which is what lets a new country be added without moving anybody else\'s published number. It was checked when six countries were added: zero of ninety existing cells moved. The cost is that those ten were chosen to expose contrasts and are not a sample of the world.',
  },
  {
    term: 'Normalization',
    group: 'How a number is made',
    short: 'Turning a raw value into a 0 to 100 position, reversing where lower is better.',
    full: 'Raw values arrive in different units: days, percentages, counts per million. Normalization places each value inside the reference frame for that indicator and returns a 0 to 100 position. Indicators where a lower number is better, such as days to enforce a contract, are reversed, so higher is always better after normalization.',
  },
  {
    term: 'Winsorizing',
    group: 'How a number is made',
    short: 'Pulling extreme outliers back to a boundary so one country cannot stretch the scale.',
    full: 'One extreme value can compress everybody else into a narrow band. Winsorizing clips values beyond three interquartile ranges back to that boundary before the scale is built. It is applied sparingly on purpose, because clipping harder would destroy the variation the benchmark is trying to see.',
  },
  {
    term: 'Out of frame',
    group: 'How a number is made',
    short: 'A value beyond the reference range, so its score is clamped and flagged.',
    full: 'A country outside the range the reference frame covers has its score clamped to 0 or 100 and the cell is flagged. Clamping loses information, and it is preferred over widening the scale, because widening would silently change what every already-published number means.',
  },
  {
    term: 'Confidence',
    group: 'How good the evidence is',
    short: 'How well a score is evidenced, reported beside it and never inside it.',
    full: 'Confidence is coverage times recency times source quality, from 0 to 1. It says how much evidence stands behind a score. It never changes the score itself, because a well-evidenced 20 and a barely-evidenced 20 are the same claim about the country and completely different claims about what we know.',
    example: 'Coordination for every country currently sits at 0.08 confidence, because one indicator of seven has data and it stopped in 2019.',
  },
  {
    term: 'Coverage, recency, source quality',
    group: 'How good the evidence is',
    short: 'The three parts of confidence.',
    full: 'Coverage is the share of a dimension\'s indicators that have any value. Recency decays after two grace years, over a twelve-year window, down to a floor, so an old number still counts and counts visibly less. Source quality is the average tier of the sources actually used. The three multiply, so a dimension has to do well on all of them.',
  },
  {
    term: 'Confidence band',
    group: 'How good the evidence is',
    short: 'Four named ranges: very thin, thin, usable, good.',
    full: 'Raw confidence numbers are hard to read, so they are grouped into four bands with plain instructions attached. Very thin means the score rests on one or two indicators and should not be quoted alone. Good means most indicators are present, recent and from official sources. The radar draws thin evidence as a dashed line with a hollow point and marks the axis, so a weak dimension looks weak.',
  },
  {
    term: 'Source tier',
    group: 'How good the evidence is',
    short: 'Who published a number, ranked from national statistics office down to a model panel.',
    full: 'Every value carries the kind of source it came from: official statistical agency, international organization, academic survey, composite index, expert panel or model panel. The tier feeds the source quality part of confidence and never touches the score. It matters most when sources are mixed: a Brazilian ministry series and a World Bank series can sit in the same line, and the reader should be able to see which is which.',
  },
  {
    term: 'Gap',
    group: 'What is missing',
    short: 'An indicator the model asks for that no comparable dataset covers.',
    full: 'A gap stays in the registry with everything else. It lowers the confidence of its dimension, it appears in the data-gap report, and it is the collection agenda: the list of things somebody would have to go and measure. Deleting gaps would make the numbers look better and the benchmark worse.',
    example: 'Cost and schedule performance of major public projects is a gap. It is probably the single best measure of execution and no comparable international dataset exists.',
  },
  {
    term: 'Retired indicator',
    group: 'What is missing',
    short: 'A dataset that exists and that this project rejected, with the reason on the record.',
    full: 'A retired indicator keeps its row, is never fetched or scored, and lowers coverage exactly as a gap does. So far every retirement is a perception composite that measured how a country looks rather than what it does. Keeping the row means the decision can be argued with instead of quietly disappearing.',
  },
  {
    term: 'Evidence record',
    group: 'What sits beside the score',
    short: 'A documented national delivery, filed against a gap, never scored.',
    full: 'Where a country visibly did the thing an indicator is supposed to measure, the case is written down: one published number, its reference period, a source, and a required statement of what the case does not show. Each record states where the delivery stands today: still operating, delivered and closed, operating below its peak, or dismantled. A record of erosion carries a second number, the peak the loss is measured against. Records never enter a score and never raise confidence. A gap becomes a real indicator only when a comparable series covers at least two reference countries.',
    example: 'Brazil’s records run from Embrapa in 1973 to Pix in 2020. The immunisation programme is recorded as operating below its peak: 99 percent coverage in 2003, 91 percent in 2024.',
  },
  {
    term: 'Momentum',
    group: 'How things change over time',
    short: 'How much a dimension moved over ten or twenty years, on the same ruler.',
    full: 'History is scored against the frame in use today, so a change in the score is a change in the country and not a change in the scale. Two spans are published, ten years and twenty, because they answer different questions.',
    example: 'Brazil gained 26.2 points on Agency over ten years against a median of 12.7 across all sixteen countries.',
  },
  {
    term: 'Matched basket',
    group: 'How things change over time',
    short: 'Only the indicators present at both ends of a span are used for a trend.',
    full: 'If a dimension gained an indicator halfway through, comparing the old score with the new one would measure the dataset rather than the country. So a trend uses only indicators observed at both ends, and the same set for every year between. That basket is smaller than the full dimension, which is why a trend sits on a different level from the score and why the number of indicators is printed beside every trend.',
  },
  {
    term: 'Indicator line',
    group: 'How things change over time',
    short: 'One indicator\'s own history, as far back as its data goes.',
    full: 'A single indicator is comparable with itself, so nothing has to be matched and its line reaches back to 1990 where the data does. Each point carries the value as published, the normalized value and its source tier. Nothing is filled in or carried forward, so a gap in a line is a real gap.',
  },
  {
    term: 'Delphi panel',
    group: 'What sits beside the score',
    short: 'Language models with fixed analytical stances, judging what the data cannot.',
    full: 'A panel of models, each holding a different analytical stance, estimates the same dimensions the indicators do and audits the indicator set itself. They run two rounds and see each other\'s anonymised reasoning in the second. Panel estimates are stored separately and never enter an indicator-derived score. They sit beside it, and a large distance between the two is a finding about the measurement.',
  },
  {
    term: 'Provenance',
    group: 'What sits beside the score',
    short: 'How a panel run was produced, stored rather than guessed.',
    full: 'A run is labelled as a real multi-vendor panel, a working session, a human panel, or a mock offline run. Mock runs exercise the pipeline and are never evidence about any country. The label is written into the file, because inferring it from a model name is how a dry run ends up quoted in a report.',
  },
  {
    term: 'Dissent',
    group: 'What sits beside the score',
    short: 'Panel disagreement wide enough to be reported rather than averaged away.',
    full: 'The panel keeps a median and the spread around it. When the middle half of the panel spans more than a quarter of the scale, the cell is marked as unresolved disagreement. Panelists are told not to converge for the sake of converging, so a stable disagreement is a result.',
  },
  {
    term: 'Wealth proxy',
    group: 'How good the evidence is',
    short: 'An indicator that mostly restates income per head.',
    full: 'Each indicator is correlated against log GDP per capita. Above 0.7 it is flagged as tracking income rather than capability, and the whole model is re-scored with those indicators removed to see how much the profiles depend on them. This test is the reason the perception layer was retired.',
  },
  {
    term: 'Capability agenda',
    group: 'What sits beside the score',
    short: 'The scores turned into a list of things to do, computed from the data.',
    full: 'A per-country document generated from the scored output. Dimensions with usable evidence and low scores become items to raise. Dimensions with confidence below the usable band become items to measure first, because a score that thin cannot carry a decision. The declared gaps form the measurement agenda, with the countries and documented deliveries that already answer each question listed beside it. Nothing in it is written by hand: every figure comes from the scores, every gap from the registry, every case from the evidence records, so the agenda regenerates whenever the data changes.',
    example: 'The Brazil agenda lists Building, at 9.4 with usable confidence, as the first dimension to raise, and Coordination, at confidence 0.08, as a dimension to measure before managing.',
  },
  {
    term: 'Interpretation layer',
    group: 'What sits beside the score',
    short: 'One language\'s rendering of the ground data. The numbers never translate.',
    full: 'The benchmark keeps one ground layer: English ids, registry definitions and JSON output. A lexicon translates the vocabulary and the document strings into another language, and rendered documents are produced per lexicon from the same JSON. An interpretation layer can differ in language and emphasis and it cannot change a number, which is what lets anyone check a translated page against its source. A lexicon with holes still renders complete pages, because every lookup falls back to the registry English.',
    example: 'BRA.json is the ground record. BRA.en.md and BRA.pt-BR.md render it through two lexicons.',
  },
  {
    term: 'Known artefact',
    group: 'What is missing',
    short: 'A place where the model produces a number that is wrong about the world.',
    full: 'Artefacts are recorded in their own document with severity, evidence and a fix. They are not bugs: the pipeline is doing what it was told. They are failures of measurement, and anyone quoting a score should read them first.',
    example: 'Coordination, Trust and Shared Purpose currently rest on one or two indicators each, so their scores move enough to mislead.',
  },
]

export const GLOSSARY_BY_TERM: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((e) => [e.term, e]),
)
