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
  /* The names that take an article inside a sentence, so the map reads
   * "Where does the United States stand" (D136). */
  countryArticles: { USA: 'the', NLD: 'the', GBR: 'the', ARE: 'the', PHL: 'the', DOM: 'the' },
  indicators: {},
  indicatorDefinitions: {},
  units: {},
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
      'The frame includes {countries} countries. Each dimension is scored from 0 to 100, with no overall ranking, and each score shows its confidence beside it. Read {limits} before you quote a score.',
    limitsLabel: 'the known limits of the data',
    standingHeading: 'Where {countryTopic} stands',
    colDimension: 'Dimension',
    colScore: 'Score',
    colConfidence: 'Confidence',
    colTrend: 'Trend',
    historyHeading: 'Capability over time',
    historyIntro:
      'Select a dimension to see how {country}’s comparable evidence has moved over time. The vertical scale is the current comparison frame, from 0 to 100.',
    historyDimension: 'Dimension',
    historyPeriod: 'Period',
    historyAxis: 'Capability position in the current frame',
    historyAxisRange: '0 to 100',
    historyYears: 'years',
    historyNoHistory: 'No dimension has enough comparable historical evidence yet.',
    historyNoSpan: 'No comparable history is available for this period.',
    historyReadout: '{from} to {to} ({delta}) over {years} years using {n} indicators',
    historyReadoutClamped:
      '{from} to {to} ({delta}) over {years} years using {n} indicators; {c} touched the frame edge',
    historyCaveat:
      'Historical values use today’s frame from 0 to 100 and a matched basket of indicators. They show movement in the available evidence, not an overall development score. Dated agenda items appear on a separate timeline and do not change the score. A missing line means the evidence does not support a comparable trend for that dimension.',
    historyChartAria: '{dimension} history from {baseYear} to {currentYear}',
    historyAgendaItems: 'Agenda items on this timeline',
    historyEventTimelineAria: '{dimension} agenda items from {baseYear} to {currentYear}',
    historyEventAria: '{title}, agenda item started in {year}',
    trendCell: '{delta} over {years} years using {n} indicators',
    trendCellClamped: '{delta} over {years} years using {n} indicators, with {c} at the frame edge',
    noTrend: 'no trend',
    noScore: 'not scored',
    raiseItemHeading: '{dimension}: {score}, confidence {band}',
    measureItemHeading: '{dimension}: confidence {confidence}, {band}',
    raiseHeading: 'What to raise',
    raiseIntro:
      'These are the lowest scores with usable evidence. Thin evidence appears below.',
    measureHeading: 'What to measure first',
    measureIntro:
      'The evidence is too thin to manage these dimensions confidently.',
    holdHeading: 'What to keep watching',
    holdIntro:
      'These dimensions score at least {threshold} with usable evidence.',
    holdItemLine: '{dimension}: {score}, confidence {band}',
    scoredOn: 'Uses {n} observed indicators.',
    scoredOnOne: 'Uses one observed indicator.',
    gapsLine: 'Missing indicators: {list}.',
    retiredLine: 'Rejected datasets: {list}.',
    exemplarsLine: 'Highest usable scores: {list}.',
    evidenceElsewhereLine: 'Related deliveries in other countries: {list}.',
    agendaHeading: 'Missing data',
    agendaIntro:
      '{n} requested indicators have no comparable dataset, and each one lowers confidence. A gap can become an indicator when a comparable series covers at least two countries.',
    colIndicator: 'Missing indicator',
    colAsks: 'What it asks',
    ownEvidenceHeading: 'What the indicators miss about {countryTopic}',
    ownEvidenceIntro:
      'Documented deliveries linked to missing indicators. They do not affect scores or confidence.',
    brazilEvidenceHeading: 'What Brazil built that no indicator counts',
    brazilEvidenceIntro:
      'These are documented institutional changes in Brazil that the framework records as evidence. They are not scored, and they appear beside the capability scores as a historical record.',
    institutionalHistoryHeading: 'What {countryTopic} built that no indicator counts',
    institutionalHistoryIntro:
      'These are documented institutional changes in {country} that the framework records as evidence. They appear beside the score and do not change it or its confidence.',
    contributeHeading: 'Contribute',
    contributeBody:
      'Fill a gap, file evidence or challenge an indicator at {repo}. The docs explain the method and decisions.',
    profileLink: 'Open the profile: indicators, values, years and sources',
    conditionsHeading: 'What {countryTopic} has to work with',
    conditionsIntro:
      'Conditions describe what a country has to work with: infrastructure, access, money, people, enrolment and income itself. Each is published beside a capability and is not part of its score, its confidence or its trend. Read against the score, they show whether what a country has turns into what it does. The rank counts the countries with a value, best first.',
    colCondition: 'Condition',
    colValue: 'Value',
    colYear: 'Year',
    colRank: 'Rank',
    conditionRank: '{rank} of {n}',
  },
  institutions: {
    levels: {
      federal: 'Federal',
      state: 'State',
      municipal: 'Municipal',
      external: 'Outside the state',
      global: 'Global',
    },
    systems: {
      democratic_authority: 'Democratic authority',
      justice_rights: 'Justice and rights',
      oversight_integrity: 'Oversight and integrity',
      strategy_management: 'Strategy and management',
      finance_investment: 'Finance and investment',
      science_technology: 'Science and technology',
      learning_workforce: 'Learning and workforce',
      data_digital: 'Data and digital infrastructure',
      regulation: 'Regulation',
      public_security_defense: 'Public security and defense',
      territorial_delivery: 'Territorial delivery',
    },
    natures: {
      constitutional_body: 'Constitutional body',
      direct_administration: 'Direct administration',
      autarchy: 'Autarchy',
      public_foundation: 'Public foundation',
      public_company: 'Public company',
      mixed_capital_company: 'Mixed capital company',
      public_university: 'Public university',
      private_education: 'Private education institution',
      international_organization: 'International organization',
    },
    roles: {
      governs: 'governs',
      legislates: 'legislates',
      adjudicates: 'settles disputes',
      checks_constitutionality: 'reviews constitutionality',
      prosecutes: 'brings public prosecutions',
      represents_state: 'represents the state in law',
      defends_rights: 'defends rights',
      checks: 'reviews public acts',
      audits: 'audits',
      coordinates: 'coordinates',
      plans: 'plans',
      administers: 'administers',
      finances: 'finances',
      regulates: 'regulates',
      produces_evidence: 'produces evidence',
      researches: 'runs research',
      trains: 'trains people',
      operates_infrastructure: 'operates infrastructure',
      delivers_services: 'delivers services',
      investigates: 'investigates',
      protects: 'protects',
      intelligence: 'produces intelligence',
      defends: 'defends the country',
    },
    relations: {
      appoints: { outgoing: 'appoints members of', incoming: 'has members appointed by' },
      approves_appointment: {
        outgoing: 'approves appointments to',
        incoming: 'has appointments approved by',
      },
      legislates_with: { outgoing: 'legislates with', incoming: 'legislates with' },
      linked_to: { outgoing: 'is attached to', incoming: 'has an administrative link with' },
      audits: { outgoing: 'audits', incoming: 'is audited by' },
      checks: { outgoing: 'reviews acts of', incoming: 'has its acts reviewed by' },
      regulates: { outgoing: 'regulates', incoming: 'is regulated by' },
      funds: { outgoing: 'funds', incoming: 'is funded by' },
      coordinates: { outgoing: 'coordinates', incoming: 'is coordinated by' },
      trains: { outgoing: 'trains people from', incoming: 'has people trained by' },
      provides_evidence_to: {
        outgoing: 'produces evidence for',
        incoming: 'uses evidence produced by',
      },
      operates_for: {
        outgoing: 'operates infrastructure for',
        incoming: 'uses infrastructure operated by',
      },
      delivers_with: { outgoing: 'delivers alongside', incoming: 'delivers alongside' },
    },
    families: {
      constitutes: {
        label: 'Authority',
        empty: 'No authority or attachment relation is recorded.',
      },
      limits: { label: 'Control', empty: 'No control relation is recorded.' },
      funds: { label: 'Funding', empty: 'No funding relation is recorded.' },
      works_with: { label: 'Joint work', empty: 'No joint work relation is recorded.' },
    },
    findHeading: 'Find an institution',
    findName: 'Name or function',
    findNamePlaceholder: 'audit, research, funding...',
    findLevel: 'Level',
    findSystem: 'System',
    findJurisdiction: 'Jurisdiction',
    nationalJurisdiction: 'Union',
    globalJurisdiction: 'Global',
    globalJurisdictionNote:
      'International bodies that no single country controls, recorded in the global ledger.',
    membersHeading: 'Membership',
    memberCount: '{n} of the {total} benchmarked countries are members',
    memberHere: '{country} is a member.',
    notMemberHere: '{country} is not a member.',
    anyLevel: 'All',
    anySystem: 'All',
    shown: '{n} shown',
    noMatch: 'No institution matches these filters.',
    rolesHeading: 'What it does',
    dimensionsHeading: 'Capabilities it bears on',
    noDimensions: 'No dimension recorded',
    incomingHeading: 'Acts on this institution',
    outgoingHeading: 'This institution acts on',
    ledgerHint:
      'Each line reads left to right, in the direction of the relation. Select any institution to open its own profile.',
    relationCount: '{n} recorded relations',
    relationCountOne: 'One recorded relation',
    noRelations: 'No relation is recorded for this institution.',
    sourceLink: 'Institutional source',
    matrixHeading: 'How authority, control and money move',
    matrixIntro:
      'Each cell counts the relations running from the system in its row to the system in its column. Select a cell to read them.',
    matrixFrom: 'From',
    matrixTo: 'To',
    matrixAllFamilies: 'All relations',
    matrixLegendLabel: 'Relations per cell',
    matrixCell: '{n} relations from {from} to {to}',
    matrixCellOne: 'One relation from {from} to {to}',
    matrixCellNone: 'No relation from {from} to {to}',
    matrixSummary: '{total} relations in {filled} of {cells} cells',
    mapSummary: '{institutions} institutions, {relations} recorded relations',
  },
  capabilityMap: {
    title: 'Where does {countryTopic} stand on {dimension}?',
    metaTitle: '{dimension} map, {country}, NCB',
    metaDescription:
      'A reading of {dimension} for {countryTopic}: the score and its confidence, the indicators it rests on, the conditions beside it and its position among the countries at the nearest income. Computed from the published data.',
    dataset: 'Dataset {version}',
    intro:
      'This page reads one capability from the published data and is recomputed with every release. It separates what {countryTopic} does, which makes the score, from what the country has, which sits beside the score, and places the country among the {count} countries at the nearest income. The text describes the data and recommends no policy.',
    scoreHeading: 'What does the score rest on?',
    scoreIntro:
      'The {dimension} score is the equal-weight mean of the positions of {n} indicators on a 0 to 100 scale that every country sets together. Confidence measures the evidence behind the score and sits beside it as a second number.',
    scoreLabel: 'Score',
    confidenceLabel: 'Confidence',
    bandLine: '{band} evidence',
    rowsHeading: 'Observed indicators',
    colPosition: 'Position on the scale',
    colPeerMedian: 'Peer median',
    rowSource: '{source}, {year}',
    noValue: 'no value',
    rowStale: 'The latest value is from {year}, more than {age} years old, so it does not count toward the score.',
    gapsLine: 'No comparable source yet, so lowering confidence: {list}.',
    dimensionIncome:
      'The {dimension} score tracks GDP per capita at r = {r} across {n} countries.',
    conditionsIntro:
      'Beside each condition, two r values read every country at once, one against income and one against the capability score. Where the r with income is much higher than the r with the score, having the condition goes with being rich more than with the capability measured.',
    conditionIncome: 'r with income: {r} ({n} countries)',
    conditionScore: 'r with the {dimension} score: {r} ({n} countries)',
    conditionPeerMedian: 'Peer median: {value} {unit} ({n} peers with a value)',
    peersHeading: 'Where does {countryTopic} sit among its peers?',
    peerRule:
      'The peers are the {count} countries at the nearest income. Income is GDP per capita at purchasing power parity, in constant international dollars, for the latest year the World Bank publishes, and distance is measured on a log scale, where half and double are equally far. No country is picked by hand, and the set changes when the data does.',
    peerRange: 'In this release peer income runs from {min} to {max}, and {countryTopic} has {own} ({year}).',
    peersUnscored: '{n} of the {count} peers have no score on this capability and are left out of the median.',
    colCountry: 'Country',
    colIncome: 'GDP per capita, PPP',
    colScore: 'Score',
    fieldAria: '{count} countries at similar income on a 0 to 100 scale for {dimension}.',
    fieldNote: 'The shaded band is the middle half of the set and the line inside it is the median.',
    readingHeading: 'What separates {countryTopic} from its peers?',
    scoreAbove:
      '{countryTopic} scores {score} on {dimension}, above the median of the {n} scored peers, which is {median}.',
    scoreBelow:
      '{countryTopic} scores {score} on {dimension}, below the median of the {n} scored peers, which is {median}.',
    scoreLevel: '{countryTopic} scores {score} on {dimension}, level with the median of the {n} scored peers.',
    rowsAbove: 'Indicators placed above the peer median on the scale: {list}.',
    rowsBelow: 'Indicators placed below the peer median on the scale: {list}.',
    rowsLevel: 'At the peer median: {list}.',
    conditionsMore: '{countryTopic} has more than the peer median of {list}.',
    conditionsLess: '{countryTopic} has less than the peer median of {list}.',
    conditionsLevel: '{countryTopic} sits at the peer median on {list}.',
    conditionsLowerBetter: 'On {list}, a lower value is better.',
    readingNote:
      'Each sentence compares one position with one median. Why a difference exists, and what to do about it, lie outside this data.',
    noPeers:
      'This release does not publish country income, so the page cannot form the peer set.',
    noIncome:
      'The World Bank publishes no GDP per capita for {countryTopic}, so the page forms no peer set and draws no comparison.',
    limitsHeading: 'What this reading does not show',
    limitProxy:
      'A national score is a coarse proxy. A capability forms in firms, cities, networks and groups below the level of the country, and a national average only describes the conditions they work in.',
    limitPeers:
      'Peers share income and nothing else. Size, production structure, region and political regime are outside the rule, and a set of {count} countries can change with any revision to GDP.',
    limitCorrelation:
      'An r reads the whole set at once and says nothing about one country alone. A correlation does not show a cause either.',
    rowCaveats: {
      long_term_unemployment_share: {
        text: 'Long-term unemployment comes from ILOSTAT, after a plausibility gate applied the same way to every country. Some scored countries use a household survey instead of a labor force survey. A high share reads two ways: slow reallocation where unemployment is also high, or a small residual pool where it is low.',
        decisions: ['D120'],
      },
      export_diversification: {
        text: 'Export diversification reads the concentration of the merchandise basket UNCTAD publishes. How fast a country switches products is outside it, so are services, and countries selling a few high-value products read as concentrated.',
        decisions: ['D119'],
      },
      new_export_products_rate: {
        text: "New export products counts the merchandise lines a country entered over fifteen years, from the Growth Lab's trade data. Exports are gross, so a re-export hub counts what passes through it, and a country that does not report its trade is read from its partners' records. A window this long moves little from one release to the next.",
        decisions: ['D149'],
      },
    },
    /* One template per kind of row fact. Which country has which fact is
     * COUNTRY_ROW_FACTS in the model (D136). */
    rowFacts: {
      household_survey: 'For {countryTopic}, the ILOSTAT series comes from {survey}, a household survey.',
      household_survey_unreliable:
        'For {countryTopic}, the ILOSTAT series comes from a household survey, and the ILO flags the value unreliable.',
      urban_survey_unreliable:
        'For {countryTopic}, the ILOSTAT series comes from the {survey}, which covers urban areas only, and the ILO flags the value unreliable.',
      flagged_unreliable: 'For {countryTopic}, the ILO flags the ILOSTAT value unreliable.',
      gate_never_passed:
        'For {countryTopic}, no year of the ILOSTAT series passes the plausibility gate, because the survey records under {floor}% in most or all years, so the row has no value.',
    },
    noConditions:
      'No condition is published beside {dimension} in this release, so the page shows only the indicators that make the score.',
    floorNote:
      'No score in this release. Observed indicators: {n}, under the minimum the model needs to form a mean.',
    thinNote: 'Confidence is in the {band} band, so the score rests on little evidence.',
    artefactsLine: 'The known artefacts that bear on {dimension}, described on the limits page:',
    artefactsStructural: 'And the ones every score in the benchmark carries:',
    artefactLink: 'artefact {id}',
    rowPeers: '{n} peers with a value',
    indexLink: 'See every capability on the map',
    index: {
      navLabel: 'Map',
      title: 'Where does {countryTopic} stand on each capability?',
      metaTitle: 'Capability map, {country}, NCB',
      metaDescription:
        "{countryTopic}'s capabilities, each with the score, the confidence and the position against the median of the countries at the nearest income. Computed from the published data.",
      intro:
        'This page reads {n} capabilities of {countryTopic} from the published data and is recomputed with every release. Each row carries the score and the confidence as two numbers and compares the score with the median of the {count} countries at the nearest income. The rows follow the model order, and each opens the map of that capability.',
      heading: 'How does each capability compare with the peers?',
      colDimension: 'Capability',
      colPeerMedian: 'Peer median',
      above: 'above the peer median',
      below: 'below the peer median',
      level: 'at the peer median',
      none: 'no comparison',
      peersScored: '{n} of {count} peers scored',
      note: 'Each row compares one score with one median. The capabilities do not add up, and the page forms no overall score.',
    },
    decisionLink: 'decision {id}',
    agendaLink: 'Open the capability agenda',
    capabilityLink: 'See {dimension} across every country',
  },
}
