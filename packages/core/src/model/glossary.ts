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
      'Days to register a company measures how hard it is to start a business.',
  },
  I: {
    label: 'capability input',
    plain: 'Measures something that supports the capability.',
    example:
      'Research spending is an input. It does not prove a country reads the future well.',
  },
  O: {
    label: 'downstream outcome',
    plain: 'Measures a result that usually follows from the capability.',
    example:
      'Patents can show experimentation, but also defensive filing. Korea files at volume, so its patent number says less than it looks.',
  },
  P: {
    label: 'perception proxy',
    plain: 'Records what people or experts say, not what they did.',
    example:
      'The Worldwide Governance Indicators aggregate expert opinion. Seven were retired because they tracked income per head more than capability.',
  },
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Capability',
    group: 'What is being measured',
    short: 'What a country is able to do, separately from how rich it is.',
    full: 'The benchmark asks what a country can do: anticipate change, coordinate, learn, adapt and build under uncertainty. Wealth and capability are related, but the design keeps them separate enough to compare.',
  },
  {
    term: 'Dimension',
    group: 'What is being measured',
    short: 'One of the nine capabilities, each scored on its own.',
    full: 'There are nine dimensions. Each has its own question and 0 to 100 score. Scores stay separate, so countries with the same average can have different shapes.',
    example: 'Building asks whether a country turns plans into working systems. Trust asks how much cooperation is possible beyond people who already know each other.',
  },
  {
    term: 'Indicator',
    group: 'What is being measured',
    short: 'One published statistic used as evidence for one dimension.',
    full: 'Each dimension uses published indicators with a source and year. The score averages indicators with data; raw values stay visible for checking.',
  },
  {
    term: 'Measurement class',
    group: 'What is being measured',
    short: 'Whether an indicator measures the capability, an input, a result, or an opinion.',
    full: 'Every indicator is labeled C, I, O or P. C measures capability; I an input; O an outcome; P a perception. The benchmark prefers C, then I. P was retired after tracking income closely.',
    example: 'Time to register a company is C. Research spending is I. Patents are O. An expert survey about government quality is P.',
  },
  {
    term: 'Score',
    group: 'How a number is made',
    short: 'A position from 0 to 100 inside a fixed comparison frame.',
    full: 'A dimension score runs from 0 to 100. Zero is weakest and 100 strongest in this frame. A 10 is near the floor, not 10 percent of a capability.',
  },
  {
    term: 'Score band',
    group: 'How a number is made',
    short: 'Four named ranges a score falls in: weak, below middle, above middle, strong.',
    full: 'Each score falls into one of four bands. The labels are relative to this frame. Check confidence before interpreting a weak score.',
  },
  {
    term: 'Comparison frame',
    group: 'How a number is made',
    short: 'The countries whose values fix the ends of every scale.',
    full: 'All countries set each indicator’s endpoints. The frame stays fixed within a version, so score changes reflect data. Adding a country changes the frame and restates scores.',
  },
  {
    term: 'Frame rebase',
    group: 'How a number is made',
    short: 'Recomputing every scale after the country set changes, and saying so.',
    full: 'Adding a country can move the endpoints and restate published numbers. The dataset gets a major version bump, the benchmark is rescored, and old and new numbers cannot be compared. A rebase is announced.',
  },
  {
    term: 'Normalization',
    group: 'How a number is made',
    short: 'Turning a raw value into a 0 to 100 position, reversing where lower is better.',
    full: 'Raw values use different units. Normalization turns each into a 0 to 100 position within its indicator frame. Lower-is-better indicators are reversed so higher always means better.',
  },
  {
    term: 'Distance from target',
    group: 'How a number is made',
    short: 'A transform that rewards values close to a defined target.',
    full: 'Some measures are best near a target. Budget execution scores distance from 100, so the closest country ranks highest.',
    example: 'A budget execution value of 95 is five percentage points from the approved budget. A value of 130 is thirty points away.',
  },
  {
    term: 'Winsorizing',
    group: 'How a number is made',
    short: 'Pulling extreme outliers back to a boundary so one country cannot stretch the scale.',
    full: 'An extreme value can compress every other country into a narrow band. Winsorizing clips values beyond three interquartile ranges before building the scale. It is used sparingly.',
  },
  {
    term: 'Out of frame',
    group: 'How a number is made',
    short: 'A value beyond the ends of the scale, so its score is clamped and flagged.',
    full: 'Current values sit inside the frame by construction. Historical or late-arriving values can fall outside it, clamp to 0 or 100, and get flagged. The flag shows where information was lost.',
  },
  {
    term: 'Confidence',
    group: 'How good the evidence is',
    short: 'How well a score is evidenced, reported beside it and never inside it.',
    full: 'Confidence is coverage × recency × source quality, from 0 to 1. It describes the evidence, not the score. The same score can have very different confidence.',
    example: 'Coordination for every country currently sits at 0.08 confidence, because one indicator of seven has data and it stopped in 2019.',
  },
  {
    term: 'Coverage, recency, source quality',
    group: 'How good the evidence is',
    short: 'The three parts of confidence.',
    full: 'Coverage is the share of indicators with a value. Recency declines after two grace years over a twelve-year window. Source quality is the average source tier. The three multiply.',
  },
  {
    term: 'Confidence band',
    group: 'How good the evidence is',
    short: 'Four named ranges: very thin, thin, usable, good.',
    full: 'Confidence has four bands. Very thin means the score rests on one or two indicators and should not be quoted alone. Good means most indicators are present, recent and official. Thin evidence appears as a dashed radar edge and hollow point.',
  },
  {
    term: 'Source tier',
    group: 'How good the evidence is',
    short: 'Who published a number, ranked from national statistics office down to a model panel.',
    full: 'Every value carries a source type, such as a statistical agency, international organization, survey or model panel. The tier affects confidence, not the score, and shows when a line mixes sources.',
  },
  {
    term: 'Ingest route',
    group: 'How a number is made',
    short: 'How a value reaches the dataset: fetched from an API, entered by hand, or not collected at all.',
    full: 'Every indicator declares one of four routes. Fetched values come from an API. Hand-entered values come from a published table and keep the retrieval date. A gap has no comparable dataset. A retired row has a rejected dataset. Both lower confidence.',
    example: 'Two indicators are entered by hand from the Global Entrepreneurship Monitor, which publishes its adult population survey as a table.',
  },
  {
    term: 'Gap',
    group: 'What is missing',
    short: 'An indicator the model asks for that no comparable dataset covers.',
    full: 'A gap stays in the registry, lowers confidence and appears in the collection agenda. Removing it would improve the numbers without adding evidence.',
    example: 'Cost and schedule performance of major public projects is a gap. It is probably the single best measure of execution and no comparable international dataset exists.',
  },
  {
    term: 'Retired indicator',
    group: 'What is missing',
    short: 'A dataset that exists and that this project rejected, with the reason on the record.',
    full: 'A retired indicator keeps its row, is never fetched or scored, and lowers coverage like a gap. The row stays so the decision can be challenged.',
  },
  {
    term: 'Evidence record',
    group: 'What sits beside the score',
    short: 'A documented national delivery, filed against a gap, never scored.',
    full: 'An evidence record documents a country doing what a gap indicator should measure. It carries a published number, reference period, source, limits and delivery status. Records never affect scores or confidence. A gap becomes an indicator when a comparable series covers at least two countries.',
    example: 'Brazil’s records run from Embrapa in 1973 to Pix in 2020. The immunisation programme is recorded as operating below its peak: 99 percent coverage in 2003, 91 percent in 2024.',
  },
  {
    term: 'Institutional capability network',
    group: 'What sits beside the score',
    short: 'A sourced map of which organisations hold capability and how they constrain or support one another.',
    full: 'A country-specific network maps public institutions and selected outside organizations through sourced links such as funding, regulation, audit, appointment, training and delivery. It guides investigation and never affects scores or confidence.',
    example: 'Brazil’s first network links the federal backbone to a São Paulo pilot, including the BNDES, Finep, Enap, the STF, the STJ, FAPESP, state universities and the municipality of São Paulo.',
  },
  {
    term: 'Momentum',
    group: 'How things change over time',
    short: 'How much a dimension moved over ten or twenty years, on the same ruler.',
    full: 'History uses today\'s frame, so score change reflects the country. Ten-year and twenty-year spans answer different questions. Values up to five years old can count at a span end, and clamped values are reported.',
    example: 'Brazil gained 26.2 points on Agency over ten years, against a median of 11.4 across all 40 countries, with two of the four basket indicators clamped at the frame edge.',
  },
  {
    term: 'Matched basket',
    group: 'How things change over time',
    short: 'Only the indicators present at both ends of a span are used for a trend.',
    full: 'A trend uses only indicators observed at both ends of the span. The basket can be smaller than the full dimension, so its level can differ from the score.',
  },
  {
    term: 'Indicator line',
    group: 'How things change over time',
    short: 'One indicator\'s own history, as far back as its data goes.',
    full: 'An indicator is comparable with itself, so its line reaches back to 1990 where data exists. Each point carries the published, normalized and source-tier values. Nothing is filled in or carried forward.',
  },
  {
    term: 'Delphi panel',
    group: 'What sits beside the score',
    short: 'Language models with fixed analytical stances, judging what the data cannot.',
    full: 'A panel of models with different analytical stances scores the dimensions and audits the indicators. In round two, panelists see anonymized reasoning from round one. Panel estimates stay separate from indicator scores.',
  },
  {
    term: 'Provenance',
    group: 'What sits beside the score',
    short: 'How a panel run was produced, recorded on the run file itself.',
    full: 'A run records whether it is a gateway panel, working session, human panel or mock run. Mock runs exercise the pipeline and are never country evidence. The label lives in the file.',
  },
  {
    term: 'Dissent',
    group: 'What sits beside the score',
    short: 'Panel disagreement wide enough to be reported rather than averaged away.',
    full: 'The panel keeps a median and interquartile range. A cell is unresolved when its middle half spans more than a quarter of the scale. Stable disagreement is a result.',
  },
  {
    term: 'Wealth proxy',
    group: 'How good the evidence is',
    short: 'An indicator that mostly restates income per head.',
    full: 'Each indicator is correlated with log GDP per capita. Above 0.7, it is flagged as a wealth proxy and removed in a sensitivity test. The panel gets the same test.',
  },
  {
    term: 'Capability agenda',
    group: 'What sits beside the score',
    short: 'The scores turned into a list of things to do, computed from the data.',
    full: 'A country document generated from scored output. Low scores with usable evidence are items to raise. Thin evidence becomes an item to measure first. The rest are holds. Declared gaps form the measurement agenda. The agenda regenerates with the data.',
    example: 'The Brazil agenda lists Building, at 9.4 with usable confidence, as the first dimension to raise, and Coordination, at confidence 0.08, as a dimension to measure before managing.',
  },
  {
    term: 'Interpretation layer',
    group: 'What sits beside the score',
    short: 'One language\'s rendering of the ground data. The numbers never translate.',
    full: 'The ground layer keeps English ids, registry definitions and JSON output. Lexicons translate vocabulary and document strings from that data. They cannot change numbers. Missing translations fall back to registry English.',
    example: 'BRA.json is the ground record. BRA.en.md and BRA.pt-BR.md render it through two lexicons.',
  },
  {
    term: 'Known artefact',
    group: 'What is missing',
    short: 'A place where the model produces a number that is wrong about the world.',
    full: 'Artefacts are measurement failures recorded with severity, evidence and a possible fix. The viewer publishes them on the limits page. Read them before quoting a score.',
    example: 'Coordination, Trust and Shared Purpose currently rest on one or two indicators each, so their scores move enough to mislead.',
  },
  {
    term: 'Blended score',
    group: 'What sits beside the score',
    short: 'The published fallback: the indicator score, or the panel estimate when no indicator evidence exists.',
    full: 'Every dimension carries a blendedScore and blendedFrom label. The value is the indicator score when evidence exists, the panel estimate only when it does not, or none. It is never a mix.',
    example: 'Every published cell currently reads blendedFrom: indicators, so the delphi fallback has never been exercised in shipped data.',
  },
  {
    term: 'Revision log',
    group: 'What sits beside the score',
    short: 'The append-only record of what each ingest restated, added or dropped.',
    full: 'Each ingest compares its data with the previous file and appends restated, added or dropped values. The log records when a published number changes.',
  },
]

export const GLOSSARY_BY_TERM: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((e) => [e.term, e]),
)
