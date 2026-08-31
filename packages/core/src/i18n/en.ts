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
      'The frame includes {countries} countries. Each dimension runs from 0 to 100, with no overall ranking. Confidence sits beside each score. Read {limits} before quoting one.',
    limitsLabel: 'the known limits of the data',
    standingHeading: 'Where {countryTopic} stands',
    colDimension: 'Dimension',
    colScore: 'Score',
    colConfidence: 'Confidence',
    colTrend: 'Trend',
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
      'These scores are at least {threshold} with usable evidence. They still need watching.',
    holdItemLine: '{dimension}: {score}, confidence {band}',
    scoredOn: 'Uses {n} observed indicators.',
    scoredOnOne: 'Uses one observed indicator.',
    gapsLine: 'Missing indicators: {list}.',
    retiredLine: 'Rejected datasets: {list}.',
    exemplarsLine: 'Highest usable scores: {list}.',
    evidenceElsewhereLine: 'Related deliveries in other countries: {list}.',
    agendaHeading: 'Missing data',
    agendaIntro:
      '{n} requested indicators have no comparable dataset. Each lowers confidence. A gap can become an indicator when a comparable series covers at least two countries.',
    colIndicator: 'Missing indicator',
    colAsks: 'What it asks',
    ownEvidenceHeading: 'What the indicators miss about {countryTopic}',
    ownEvidenceIntro:
      'Documented deliveries linked to missing indicators. They do not affect scores or confidence.',
    brazilEvidenceHeading: 'What Brazil built that no indicator counts',
    brazilEvidenceIntro:
      'These are documented Brazilian institutional changes the framework files as evidence. They are not scored. They are the historical record that the capability measurement sits next to.',
    institutionalHistoryHeading: 'What {countryTopic} built that no indicator counts',
    institutionalHistoryIntro:
      'These are documented institutional changes in {country} that the framework files as evidence. They sit beside the score and do not change it or its confidence.',
    contributeHeading: 'Contribute',
    contributeBody:
      'Fill a gap, file evidence or challenge an indicator at {repo}. The docs explain the method and decisions.',
    profileLink: 'Open the profile: indicators, values, years and sources',
  },
  institutions: {
    levels: {
      federal: 'Federal',
      state: 'State',
      municipal: 'Municipal',
      external: 'Outside the state',
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
      public_security_defense: 'Public security and defence',
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
}
