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
    term: 'Geometry',
    group: 'What sits beside the score',
    short: 'The spatial level an observation describes, such as a country or state.',
    full: 'National geometry is the comparison layer. State, province, region and municipality geometries describe constituent units and can appear on a destination page without entering the national score.',
  },
  {
    term: 'Reconciliation rule',
    group: 'What sits beside the score',
    short: 'The declared relationship between a national value and its constituent values.',
    full: 'An aggregate can be read as a national quantity assembled from its parts. An independent value should be compared alongside the national value. A context-only value adds detail without claiming that the two layers can be combined.',
  },
  {
    term: 'Indicator family',
    group: 'What is being measured',
    short: 'A group of indicators inside one dimension that answer the same question.',
    full: 'Some dimensions ask two questions under one name. Trust asks whether people rely on strangers and whether they rely on institutions, and an indicator belongs to one of those two families. The family changes nothing about the score, which stays the equal-weight average of whatever is observed. It exists so the diagnostics can report which family the evidence came from, because several readings of one question are not several independent signals.',
    example: 'Trust holds a social family and an institutional family. The current release observes one row in each family where it scores, while court performance remains a gap.',
  },
  {
    term: 'Behavioral check',
    group: 'What sits beside the score',
    short: 'A published series shown next to a dimension and left out of it.',
    full: 'Some series measure something real about a capability and still fail the tests this benchmark applies before a number is scored, because they mostly track national income, because the same reading means opposite things in different countries, or because the sample behind each figure cannot be checked or the survey question changed between rounds. A check is fetched and published like an indicator and then excluded from the scale, the average, the indicator count and the confidence. The reason it is not scored travels with the number, so a reader can weigh the evidence without the benchmark asserting it.',
    example: 'Customs clearance time asks exporting firms how many days their goods took at the border. It reads on coordination, but the survey changed its question in 2024 and the number of firms behind each figure is not published, so Coordination shows it beside the score and never inside it.',
  },
  {
    term: 'Condition',
    group: 'What sits beside the score',
    short: 'What a country has to work with, published beside a capability and left out of its score.',
    full: 'Some published series record what a country has rather than what it does: roads and cables, bank accounts and credit, researchers and students, money spent on schools and laboratories, and income itself. These are conditions. A capability score reads what a country does with what it has, so a condition is published beside the capability it bears on and kept out of the score, the confidence and the trend. Its value is shown as the publisher wrote it, with its rank among the countries that have one, never on the 0 to 100 scale. Reading a condition against the score shows whether what a country has turns into what it does.',
    example: 'Fixed broadband subscriptions are a condition beside Adaptability. A country can have fast lines everywhere and still be slow to move workers into new jobs, and the two readings side by side show that.',
  },
  {
    term: 'Measurement class',
    group: 'What is being measured',
    short: 'Whether an indicator measures the capability, an input, a result, or an opinion.',
    full: 'The registry labels every indicator C, I, O or P. C measures the capability itself; I measures an input; O measures a result; P records a perception. The benchmark prefers C. Most I rows record a stock the country has, so they are published as conditions beside the score. P was retired after it tracked income too closely.',
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
    term: 'Reference country',
    group: 'How a number is made',
    short: 'The country a side-by-side comparison is read from.',
    full: 'When countries are put side by side, one of them is named the reference. It keeps the filled shape on the charts and every other column is read as a distance from it. The reference changes nothing in the data: the scores, the confidence and the indicator values are the published ones, and swapping the reference only changes which country the differences are measured from. It is not a benchmark, a target or a best case.',
    example: 'With Brazil as the reference, Indonesia’s Coordination column shows its own score and how far that sits above or below Brazil’s.',
  },
  {
    term: 'Frame rebase',
    group: 'How a number is made',
    short: 'A new scale after the country set changes.',
    full: 'Adding a country can move the endpoints and restate published numbers. The dataset gets a major version bump, the benchmark is rescored, and old and new numbers cannot be compared. The change is announced.',
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
    term: 'Plausibility gate',
    group: 'How good the evidence is',
    short: 'A rule an adapter applies to every country to drop values a survey could not have measured.',
    full: 'Some national surveys ask their questions in a way that cannot record what the indicator asks for, and the published number then describes the questionnaire and says nothing about the country. A plausibility gate is a fixed rule, the same for every country and naming none, that drops such values before scoring. Each dropped value is logged with its country, year and reason, and the latest value that survives is the one scored.',
    example: 'Long-term unemployment share drops any year under 3 percent, every year of a survey whose typical year is under 3 percent, and a one- or two-year spike of more than 15 points that the series comes back from. Korea and the Philippines report under 1 percent every year and are not scored on this row.',
  },
  {
    term: 'Access gate',
    group: 'How good the evidence is',
    short: 'A rule that holds a country whose count on a platform stalls while the platform grows everywhere else.',
    full: 'A count taken from one platform reads what people do there only where they can and do use it. Where a country blocks the platform, has its own, or is cut off from it, the count stays flat while it grows in every other country, and a low value would describe access instead of the country. An access gate is a fixed rule, the same for every country and naming none, that holds such a country out of the row. A held country has no value on that row, which lowers its coverage. It is never scored at zero, and the reason is published with the numbers behind it.',
    example: 'New public software repositories holds any country whose repository count grew by less than a quarter of the median growth across the benchmark. In the 2026 file the median was 24.6 percent, and China (down 0.1 percent) and Cuba (up 2.8 percent) were held.',
  },
  {
    term: 'New export product',
    group: 'What is being measured',
    short: 'A product a country barely exported fifteen years ago and now exports more of than its share of world trade.',
    full: 'A country exports a product competitively when that product takes a larger share of its exports than it takes of world exports. A new export product is one the country exported at less than half that share in 2009-2011 and at least at that share in 2022-2024, with at least USD 1 million a year of sales at the end. Counting them shows an economy moving people and capital into lines it was not in. The rate divides the new products by the products the country was not exporting at the start, so a country that already exported almost everything is not rewarded for having little left to enter.',
    example: 'Poland entered 53 of 638 products it had room to enter, a rate of 8.3 percent, third in the benchmark after Uzbekistan and Bulgaria. Cuba entered 4 of 1,142.',
  },
  {
    term: 'Ingest route',
    group: 'How a number is made',
    short: 'How a value gets into the dataset: from an API, a published table, or nowhere yet.',
    full: 'Every indicator declares one of five routes. World Bank values come from its API. Values from a reproducible source adapter are fetched or parsed by code tied to a named release. Values from published tables keep the retrieval date. A gap has no comparable dataset. A retired row has a rejected dataset. Both lower confidence.',
    example: 'Generalised interpersonal trust is parsed by the Joint EVS/WVS adapter from the publisher-weighted A165 results table. GEM indicators remain entered by hand from published tables.',
  },
  {
    term: 'Gap',
    group: 'What is missing',
    short: 'An indicator the model asks for that no comparable dataset covers.',
    full: 'A gap stays in the registry, lowers confidence and appears in the collection agenda. Removing it would make the numbers look better without adding evidence. A row stays a gap when the only series aimed at it was inspected and failed a test, such as reading highest in the most closed regimes, as long as the project still wants the thing it asks about measured.',
    example: 'Cost and schedule performance of major public projects is a gap. It is probably the single best measure of execution and no comparable international dataset exists.',
  },
  {
    term: 'Retired indicator',
    group: 'What is missing',
    short: 'A row this project no longer asks for, with the reason recorded.',
    full: 'A row is retired when the project no longer wants its construct measured, or when its definition is not a capability, for example a row defined as one rejected dataset or as the make-up of a spending total. A retired indicator stays in the registry and is not fetched or scored. Unlike a gap it does not lower confidence, because it is not a measurement anyone is still trying to make. The reason remains available for challenge.',
  },
  {
    term: 'Evidence record',
    group: 'What sits beside the score',
    short: 'A documented case for something the indicators cannot measure. It does not change the score.',
    full: 'An evidence record describes a country doing something the current indicators miss. It includes a published number, the period it covers, its source, limits and delivery status. It does not affect scores or confidence. If a comparable series later covers at least two countries, the gap can become an indicator.',
    example: 'Brazil’s records run from Embrapa in 1973 to Pix in 2020. The immunisation programme is recorded as operating below its peak: 99 percent coverage in 2003, 91 percent in 2024.',
  },
  {
    term: 'Evidence grid',
    group: 'What is missing',
    short: 'Every country against every gap that a documented delivery can speak to, with each cell either closed or open.',
    full: 'The evidence grid is how this project knows whether its evidence records are complete. Each row is a country and each column is a gap where a delivered programme can show the capability, such as large project delivery or disaster preparedness. A cell is closed by an evidence record, or by a no-case note: a dated record of which sources were searched and why no programme passed the inclusion rules. A no-case note says the search found nothing this method can carry. It does not say the country lacks the capability.',
    example: 'Finland’s disaster preparedness cell is closed by its civil defence shelters record. A country whose regulators have never run a sandbox can have that cell closed by a no-case note.',
  },
  {
    term: 'Research lead',
    group: 'What is missing',
    short: 'An AI-generated hypothesis about what to investigate, not a verified fact.',
    full: 'A research lead names an uncovered country-gap question, a possible route and the source search needed to test it. It remains outside scores, confidence and published evidence until a researcher opens the source, verifies the number and writes a record that passes the evidence rules.',
    example: 'A scout may suggest looking for a national disaster-recovery programme in Chile. That suggestion is not a Chilean delivery until its publisher, metric, scale and limits are checked.',
  },
  {
    term: 'Institutional capability network',
    group: 'What sits beside the score',
    short: 'A sourced map of which organisations hold capability and how they constrain or support one another.',
    full: 'A country-specific network maps public institutions and selected outside organizations through sourced links such as funding, regulation, audit, appointment, training and delivery. It guides investigation and never affects scores or confidence.',
    example: 'Brazil’s first network links the federal backbone to a São Paulo pilot, including the BNDES, Finep, Enap, the STF, the STJ, FAPESP, state universities and the municipality of São Paulo.',
  },
  {
    term: 'Global institution ledger',
    group: 'What sits beside the score',
    short: 'The bodies no country owns, recorded once and reached from each country map by id.',
    full: 'A United Nations agency or a development bank belongs to no country, so it is not written into any country network. The ledger holds each such body once, with its source and the list of benchmarked countries that are members of it. A country network reaches the body through a sourced relation, such as a programme delivered together, and the body then appears in that country\'s map at the global level. Membership and relations never enter a score or a confidence.',
    example: 'UNDP produces the Atlas of Human Development in Brazil with Ipea, so UNDP appears in Brazil\'s map, attached to the UN, with a note that every benchmarked country is a UN member.',
  },
  {
    term: 'Momentum',
    group: 'How things change over time',
    short: 'How much a dimension moved over ten, twenty or longer spans, on the same ruler.',
    full: 'History uses today\'s frame, so score change reflects the country. Ten-year, twenty-year and longer spans answer different questions. Values up to five years old can count at a span end, and clamped values are reported.',
    example: 'Brazil gained 26.2 points on Agency over ten years, against a median of 11.4 across the current country set, with two of the four basket indicators clamped at the frame edge.',
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
    full: 'An indicator is comparable with itself, so its line reaches back to 1960 where data exists. Each point carries the published, normalized and source-tier values. Nothing is filled in or carried forward.',
  },
  {
    term: 'Delphi panel',
    group: 'What sits beside the score',
    short: 'Language models with fixed analytical stances, interpreting what the data misses.',
    full: 'A panel of models with different analytical stances reviews thin or questionable dimensions from the source-backed evidence brief and audits the indicators. In round two, panelists see anonymized reasoning from round one. Panel estimates stay separate from indicator scores, observations and confidence.',
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
    short: 'Panel disagreement above the reporting threshold.',
    full: 'The panel keeps a median and interquartile range. A cell is unresolved when its middle half spans more than a quarter of the scale. Stable disagreement is a result.',
  },
  {
    term: 'Wealth proxy',
    group: 'How good the evidence is',
    short: 'An indicator that mostly restates income per head.',
    full: 'Each indicator is correlated with log GDP per capita. Above 0.7, it is flagged as a wealth proxy and removed in a sensitivity test. The panel gets the same test.',
  },
  {
    term: 'First factor',
    group: 'How good the evidence is',
    short: 'The single pattern that explains the most of how countries differ across all nine capabilities at once.',
    full: 'Take every country with all nine capabilities scored and ask how far the nine rise and fall together. The first factor is the one combined pattern that accounts for the most of that shared movement, found by principal component analysis of how the nine scores correlate. Its share is the part of all the variation that one pattern carries: 100% would mean the nine are one number under nine names, and the share an unrelated set of nine would show by chance, at the same number of countries, is published beside it. The first factor is then compared with income per head. If it carries most of the variation and follows income closely, the nine capabilities are measuring wealth, and the benchmark\'s claim fails. Like every correlation here, it is read on a few dozen countries, so treat it as a hint that more countries could overturn.',
    example: 'In dataset 7.6.0 the first factor carries 52.9% of the variation across 51 countries, against 18.9% expected by chance, and it correlates 0.86 with log GDP per head.',
  },
  {
    term: 'Capability shape',
    group: 'How good the evidence is',
    short: 'Which of its nine capabilities a country is strong or weak on, once its income and its overall level are taken out.',
    full: 'Take each capability score, subtract the score the country\'s income predicts, and divide by how widely those gaps spread, so every capability counts the same. What is left is nine numbers per country. Subtract their own average and the remainder is the shape: a country above its income line on everything has a level and no shape, and one above on some capabilities and below on others has a shape. The diagnostics ask whether countries at the same income have different shapes, and whether those shapes line up along patterns that numbers dealt out at random would not produce. Only counts and averages over countries are published. No country\'s shape is.',
    example: 'A country that sits above its income line on Trust and Coordination and below it on Experimentation has a different shape from one of the same income that sits the other way round, even if the two are at the same overall level.',
  },
  {
    term: 'Wealth residual',
    group: 'What sits beside the score',
    short: 'The gap between a dimension score and the score a country\'s income predicts.',
    full: 'Richer countries score higher on most of these dimensions. The wealth residual removes that pattern from one dimension at a time: a line is fitted through every country\'s score against its income per head, and the residual is how far above or below its own line a country sits. It is published per dimension and never added up, because nine residuals averaged into one number is the single ranking this benchmark withholds. A residual is only as meaningful as the line behind it, so every residual carries the strength of its fit. Where the fit is weak, income explains little and the residual almost repeats the score. The layer is provisional: it is computed and inspectable, and no country page or score reads it.',
    example: 'Two countries with the same income can sit on opposite sides of the line on one capability: one above what its income predicts, the other below. Per-country residuals stay offline until the layer is promoted (D65).',
  },
  {
    term: 'Capability agenda',
    group: 'What sits beside the score',
    short: 'The scores turned into a list of things to do, computed from the data.',
    full: 'A country document generated from scored output. Low scores with usable evidence are items to raise. Thin evidence becomes an item to measure first. The rest are holds. Declared gaps form the measurement agenda. The agenda regenerates with the data.',
    example: 'The Brazil agenda lists Building, at 9.4 with usable confidence, as the first dimension to raise, and Coordination, at confidence 0.08, as a dimension to measure before managing.',
  },
  {
    term: 'Capability map',
    group: 'What sits beside the score',
    short: 'One country\'s reading of one capability: what it does, what it has, and where it sits among countries at similar income.',
    full: 'A page computed from the published data for one country and one capability. It shows the score and its confidence, each indicator the score rests on, the conditions published beside it, where the capability has any, with their correlation with income and with the score, and the country\'s position among its income peers. Every sentence on it compares a value with a median. It describes the data and makes no recommendation, and it regenerates with every release.',
    example: 'Brazil\'s Adaptability map shows its score beside the median of its 10 income peers, and fixed broadband beside its correlation with income and with the Adaptability score.',
  },
  {
    term: 'Income peers',
    group: 'What sits beside the score',
    short: 'The countries nearest to one country in GDP per capita, chosen by a fixed rule.',
    full: 'The 10 countries whose GDP per capita, at purchasing power parity and for the latest published year, sits closest to the country being read. Distance is measured on a log scale, so a country at half the income and one at double it are equally far. No country is picked by hand, and the set changes when the income data does. Peers share income and nothing else: size, region and production structure are outside the rule.',
    example: 'Brazil\'s income peers in dataset 7.2.0 are Colombia, Mexico, Thailand, Paraguay, the Dominican Republic, Peru, China, Vietnam, Indonesia and Argentina.',
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
    full: 'Every dimension carries a blendedScore and blendedFrom label. The value is the indicator score when the dimension clears its coverage floor, the panel estimate only when no indicator is observed, or none. It is never a mix.',
    example: 'A dimension with one observed indicator remains unmeasured and does not fall back to Delphi. The fallback is reserved for a dimension with no observed indicators.',
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
