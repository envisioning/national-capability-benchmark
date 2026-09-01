import type { Config } from '@envisioning/app'

/**
 * The shape `bench institutions` writes.
 *
 * Every object here maps onto one array in the feed at
 * `/api/institutions/{ISO3}`. Ids, systems, levels and relations stay the
 * ground layer's English enums; the labels are already rendered into the feed
 * in one language, which is why the page loads a feed per language rather than
 * translating here. See D82.
 */
export const schema = {
  objects: {
    entities: {
      type: 'entity',
      src: 'allInstitutions',
      titlePath: 'title',
      filter: null,
      label: { en: 'Institution', pt: 'Instituição' },
      singular: { en: 'Institution', pt: 'Instituição' },
      plural: { en: 'Institutions', pt: 'Instituições' },
      joins: {
        system: {
          from: 'system',
          localPath: 'system',
          cardinality: 'single',
          localIdentifier: 'id',
        },
        level: {
          from: 'level',
          localPath: 'level',
          cardinality: 'single',
          localIdentifier: 'id',
        },
        jurisdiction: {
          from: 'jurisdiction',
          localPath: 'jurisdiction',
          cardinality: 'single',
          localIdentifier: 'id',
        },
        reach: {
          from: 'reach',
          localPath: 'reach',
          cardinality: 'single',
          localIdentifier: 'value',
        },
        mandate: {
          from: 'mandate',
          localPath: 'mandate',
          cardinality: 'single',
          localIdentifier: 'value',
        },
      },
    },
    system: {
      type: 'cluster',
      src: 'allSystems',
      titlePath: 'label',
      filter: null,
      label: { en: 'System', pt: 'Sistema' },
      singular: { en: 'System', pt: 'Sistema' },
      plural: { en: 'Systems', pt: 'Sistemas' },
    },
    level: {
      type: 'tag',
      src: 'allLevels',
      titlePath: 'label',
      filter: null,
      label: { en: 'Level', pt: 'Esfera' },
      singular: { en: 'Level', pt: 'Esfera' },
      plural: { en: 'Levels', pt: 'Esferas' },
    },
    jurisdiction: {
      type: 'cluster',
      src: 'allJurisdictions',
      titlePath: 'label',
      filter: null,
      label: { en: 'Jurisdiction', pt: 'Jurisdição' },
      singular: { en: 'Jurisdiction', pt: 'Jurisdição' },
      plural: { en: 'Jurisdictions', pt: 'Jurisdições' },
    },
    reach: {
      type: 'metric',
      src: 'allReaches',
      identifier: 'value',
      titlePath: 'label',
      filter: {},
      label: { en: 'Recorded relations', pt: 'Relações registradas' },
      singular: { en: 'Recorded relations', pt: 'Relações registradas' },
      plural: { en: 'Recorded relations', pt: 'Relações registradas' },
      description: {
        en: 'How many relations the map records for this institution, in five bands. The bands are fixed counts, so they mean the same thing in every country.',
        pt: 'Quantas relações o mapa registra para esta instituição, em cinco faixas. As faixas são contagens fixas, então significam o mesmo em qualquer país.',
      },
      metricOrigin: 1,
      metricDomain: [1, 5],
    },
    mandate: {
      type: 'metric',
      src: 'allMandates',
      identifier: 'value',
      titlePath: 'label',
      filter: {},
      label: { en: 'Distinct functions', pt: 'Funções distintas' },
      singular: { en: 'Distinct functions', pt: 'Funções distintas' },
      plural: { en: 'Distinct functions', pt: 'Funções distintas' },
      description: {
        en: 'How many distinct functions the map records for this institution, in four bands.',
        pt: 'Quantas funções distintas o mapa registra para esta instituição, em quatro faixas.',
      },
      metricOrigin: 1,
      metricDomain: [1, 4],
    },
  },
} satisfies Config['schema']
