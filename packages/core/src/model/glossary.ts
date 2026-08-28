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
    full: 'The benchmark asks what a country can do: anticipate change, coordinate action, learn, adapt and build under uncertainty. That differs from wealth, comfort and competitiveness. Wealth buys capabilities, so the two are related. The design keeps them separate enough to compare.',
  },
  {
    term: 'Dimension',
    group: 'What is being measured',
    short: 'One of the nine capabilities, each scored on its own.',
    full: 'The benchmark has nine dimensions. Each answers its own question and gets a 0 to 100 score from its own evidence. The scores are never combined. Countries with the same average can have different shapes.',
    example: 'Building asks whether a country turns plans into working systems. Trust asks how much cooperation is possible beyond people who already know each other.',
  },
  {
    term: 'Indicator',
    group: 'What is being measured',
    short: 'One published statistic used as evidence for one dimension.',
    full: 'Each dimension uses published indicators with a source and year. The dimension score averages the indicators with data. Raw values stay visible so readers can check the score.',
  },
  {
    term: 'Measurement class',
    group: 'What is being measured',
    short: 'Whether an indicator measures the capability, an input, a result, or an opinion.',
    full: 'Every indicator is labeled C, I, O or P in the data. C measures the capability, I an input, O an outcome and P a perception. The benchmark prefers C, then I, and uses O or P when needed. Perception indicators tracked income per head closely, so that layer was retired.',
    example: 'Time to register a company is C. Research spending is I. Patents are O. An expert survey about government quality is P.',
  },
  {
    term: 'Score',
    group: 'How a number is made',
    short: 'A position from 0 to 100 inside a fixed comparison frame.',
    full: 'A dimension score runs from 0 to 100. Zero is the weakest country in this frame and 100 the strongest. A score of 10 is near the floor; it is not 10 percent of a capability.',
  },
  {
    term: 'Score band',
    group: 'How a number is made',
    short: 'Four named ranges a score falls in: weak, below middle, above middle, strong.',
    full: 'Each score chip uses one of four bands. The labels are relative to this frame: strong is near the top and weak near the bottom. Check confidence before interpreting a weak score.',
  },
  {
    term: 'Comparison frame',
    group: 'How a number is made',
    short: 'The countries whose values fix the ends of every scale.',
    full: 'Every country sets the endpoints of every indicator scale. The frame stays fixed within a published version, so a score change between runs reflects the data. Adding a country changes the frame and restates every score. That is a frame rebase.',
  },
  {
    term: 'Frame rebase',
    group: 'How a number is made',
    short: 'Recomputing every scale after the country set changes, and saying so.',
    full: 'Adding a country can move the scale endpoints and restate published numbers. The dataset gets a major version bump, the benchmark is rescored, and old and new numbers are not comparable. A rebase is announced, not hidden in a data load.',
  },
  {
    term: 'Normalization',
    group: 'How a number is made',
    short: 'Turning a raw value into a 0 to 100 position, reversing where lower is better.',
    full: 'Raw values use different units: days, percentages or counts per million. Normalization turns each into a 0 to 100 position within its indicator frame. Lower-is-better indicators are reversed so higher always means better.',
  },
  {
    term: 'Distance from target',
    group: 'How a number is made',
    short: 'A transform that rewards values close to a defined target.',
    full: 'Some measures are best near a target. Budget execution is one: spending far below budget can mean non-delivery, while spending far above it can mean weak control. The benchmark scores distance from 100, so the closest country ranks highest.',
    example: 'A budget execution value of 95 is five percentage points from the approved budget. A value of 130 is thirty points away.',
  },
  {
    term: 'Winsorizing',
    group: 'How a number is made',
    short: 'Pulling extreme outliers back to a boundary so one country cannot stretch the scale.',
    full: 'An extreme value can compress every other country into a narrow band. Winsorizing clips values beyond three interquartile ranges before the scale is built. It is used sparingly to preserve real variation.',
  },
  {
    term: 'Out of frame',
    group: 'How a number is made',
    short: 'A value beyond the ends of the scale, so its score is clamped and flagged.',
    full: 'Current values sit inside the frame by construction. Historical or late-arriving values can fall outside it. They clamp to 0 or 100 and the cell is flagged. Clamping loses information; the flag shows where.',
  },
  {
    term: 'Confidence',
    group: 'How good the evidence is',
    short: 'How well a score is evidenced, reported beside it and never inside it.',
    full: 'Confidence is coverage × recency × source quality, from 0 to 1. It describes the evidence behind a score and never changes the score. A well-evidenced 20 and a barely evidenced 20 make the same claim about the country, but not about what we know.',
    example: 'Coordination for every country currently sits at 0.08 confidence, because one indicator of seven has data and it stopped in 2019.',
  },
  {
    term: 'Coverage, recency, source quality',
    group: 'How good the evidence is',
    short: 'The three parts of confidence.',
    full: 'Coverage is the share of indicators with a value. Recency declines after two grace years over a twelve-year window. Source quality is the average tier of the sources used. The three multiply.',
  },
  {
    term: 'Confidence band',
    group: 'How good the evidence is',
    short: 'Four named ranges: very thin, thin, usable, good.',
    full: 'Confidence is grouped into four bands with plain instructions. Very thin means the score rests on one or two indicators and should not be quoted alone. Good means most indicators are present, recent and official. Thin evidence appears on the radar as a dashed edge and hollow point.',
  },
  {
    term: 'Source tier',
    group: 'How good the evidence is',
    short: 'Who published a number, ranked from national statistics office down to a model panel.',
    full: 'Every value carries a source type: statistical agency, international organization, academic survey, composite index, expert panel or model panel. The tier affects confidence, not the score. It also shows when a line mixes sources.',
  },
  {
    term: 'Ingest route',
    group: 'How a number is made',
    short: 'How a value reaches the dataset: fetched from an API, entered by hand, or not collected at all.',
    full: 'Every indicator declares one of four routes. Fetched values come from a public API. Hand-entered values come from a published table and keep the retrieval date. A declared gap has no comparable dataset. A retired row has a dataset this project rejected. Both carry no value and lower confidence.',
    example: 'Two of the 67 indicators are entered by hand, both from the Global Entrepreneurship Monitor, which publishes its adult population survey as a table and not as a feed.',
  },
  {
    term: 'Gap',
    group: 'What is missing',
    short: 'An indicator the model asks for that no comparable dataset covers.',
    full: 'A gap stays in the registry, lowers confidence and appears in the collection agenda. Removing it would make the numbers look better without adding evidence.',
    example: 'Cost and schedule performance of major public projects is a gap. It is probably the single best measure of execution and no comparable international dataset exists.',
  },
  {
    term: 'Retired indicator',
    group: 'What is missing',
    short: 'A dataset that exists and that this project rejected, with the reason on the record.',
    full: 'A retired indicator keeps its row, is never fetched or scored, and lowers coverage like a gap. Retirements so far are perception composites. Keeping the row leaves the decision open to challenge.',
  },
  {
    term: 'Evidence record',
    group: 'What sits beside the score',
    short: 'A documented national delivery, filed against a gap, never scored.',
    full: 'An evidence record documents a country doing what a gap indicator should measure. It carries one published number, a reference period, a source and its limits. It also records whether the delivery is operating, concluded, eroded or dismantled. Records never enter a score or raise confidence. A gap becomes an indicator when a comparable series covers at least two countries.',
    example: 'Brazil’s records run from Embrapa in 1973 to Pix in 2020. The immunisation programme is recorded as operating below its peak: 99 percent coverage in 2003, 91 percent in 2024.',
  },
  {
    term: 'Institutional capability network',
    group: 'What sits beside the score',
    short: 'A sourced map of which organisations hold capability and how they constrain or support one another.',
    full: 'A country-specific network links public institutions and selected outside organizations through sourced relationships such as funding, regulation, audit, appointment, training and delivery. Links to the nine dimensions guide investigation. They never affect scores or confidence.',
    example: 'Brazil’s first network links the federal backbone to a São Paulo pilot, including the BNDES, Finep, Enap, the STF, the STJ, FAPESP, state universities and the municipality of São Paulo.',
  },
  {
    term: 'Momentum',
    group: 'How things change over time',
    short: 'How much a dimension moved over ten or twenty years, on the same ruler.',
    full: 'History uses today\'s frame, so score change reflects the country, not a changing scale. Ten-year and twenty-year spans answer different questions. An observation up to five years old can count at a span end. Values clamped at either end are counted and reported.',
    example: 'Brazil gained 26.2 points on Agency over ten years, against a median of 11.4 across all 40 countries, with two of the four basket indicators clamped at the frame edge.',
  },
  {
    term: 'Matched basket',
    group: 'How things change over time',
    short: 'Only the indicators present at both ends of a span are used for a trend.',
    full: 'A trend uses only indicators observed at both ends of the span, with the same set for every year between. The basket can be smaller than the full dimension, so its level can differ from the score.',
  },
  {
    term: 'Indicator line',
    group: 'How things change over time',
    short: 'One indicator\'s own history, as far back as its data goes.',
    full: 'An indicator is comparable with itself, so its line reaches back to 1990 where data exists. Each point carries the published value, normalized value and source tier. Nothing is filled in or carried forward.',
  },
  {
    term: 'Delphi panel',
    group: 'What sits beside the score',
    short: 'Language models with fixed analytical stances, judging what the data cannot.',
    full: 'A panel of models with different analytical stances scores the same dimensions and audits the indicators. In round two, panelists see anonymized reasoning from round one. Panel estimates stay separate from indicator scores; a large difference is a measurement finding.',
  },
  {
    term: 'Provenance',
    group: 'What sits beside the score',
    short: 'How a panel run was produced, recorded on the run file itself.',
    full: 'A run records whether it is a gateway panel, working session, human panel or mock run. Mock runs exercise the pipeline and are never country evidence. The label lives in the file, not in a model name.',
  },
  {
    term: 'Dissent',
    group: 'What sits beside the score',
    short: 'Panel disagreement wide enough to be reported rather than averaged away.',
    full: 'The panel keeps a median and interquartile range. A cell is marked as unresolved when the middle half spans more than a quarter of the scale. Stable disagreement is a result.',
  },
  {
    term: 'Wealth proxy',
    group: 'How good the evidence is',
    short: 'An indicator that mostly restates income per head.',
    full: 'Each indicator is correlated with log GDP per capita. Above 0.7, it is flagged as a wealth proxy and removed in a sensitivity test. The panel gets the same test because it reads the same published record.',
  },
  {
    term: 'Capability agenda',
    group: 'What sits beside the score',
    short: 'The scores turned into a list of things to do, computed from the data.',
    full: 'A country document generated from scored output. Low scores with usable evidence are items to raise. Thin evidence becomes an item to measure first. The rest are holds. Declared gaps form the measurement agenda, alongside countries and evidence records that help answer each question. The agenda regenerates with the data.',
    example: 'The Brazil agenda lists Building, at 9.4 with usable confidence, as the first dimension to raise, and Coordination, at confidence 0.08, as a dimension to measure before managing.',
  },
  {
    term: 'Interpretation layer',
    group: 'What sits beside the score',
    short: 'One language\'s rendering of the ground data. The numbers never translate.',
    full: 'The ground layer keeps English ids, registry definitions and JSON output. Lexicons translate the vocabulary and document strings from the same JSON. They cannot change numbers. Missing translations fall back to registry English.',
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
    full: 'Every dimension carries a blendedScore and blendedFrom label. The value is the indicator score when evidence exists, the panel estimate only when no indicator evidence exists, or none. It is never a mix.',
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
