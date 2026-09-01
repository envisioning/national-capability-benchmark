import type { Config } from '@envisioning/app'
import { schema } from './schema'

export const pages: Config['navigation']['pages'] = [
  {
    id: 'home',
    menuId: 'home',
    label: { en: 'Start', pt: 'Início' },
    content_blocks: ['spacerSm', 'homeIntro'],
  },
  {
    id: 'institutions',
    menuId: 'institutions',
    label: schema.objects.entities.plural,
    context: { schemaKey: 'entities', plurality: 'many' },
    content_blocks: ['listToolbar', 'spacerSm', 'institutionsList'],
    footerPanel_blocks: ['panelSearch'],
    sortOptions: [
      { title: { en: 'Name', pt: 'Nome' }, sortCriteria: { title: 1 } },
      { title: { en: 'Relations', pt: 'Relações' }, sortCriteria: { 'reach.value': 1 } },
    ],
    groupOptions: [{ joinKey: 'system' }, { joinKey: 'level' }, { joinKey: 'jurisdiction' }],
  },
  {
    id: 'institution',
    menuId: 'institutions',
    label: schema.objects.entities.singular,
    context: { schemaKey: 'entities', plurality: 'one' },
    content_blocks: [
      'spacerMd',
      'institutionTitle',
      'spacerMd',
      'contextSummary',
      'spacerLg',
      'contextDescription',
      'divisionRelations',
      'relatedConnections',
      'divisionSources',
      'institutionSources',
      'spacerMd',
    ],
    footerPanel_blocks: ['institutionsPagination'],
    showFavorite: false,
  },
  {
    id: 'systems',
    menuId: 'systems',
    label: schema.objects.system.plural,
    context: { schemaKey: 'system', plurality: 'many' },
    content_blocks: ['systemsList'],
    footerPanel_blocks: ['panelSearch'],
  },
  {
    id: 'system',
    menuId: 'systems',
    label: schema.objects.system.singular,
    context: { schemaKey: 'system', plurality: 'one' },
    content_blocks: ['spacerMd', 'groupTitle', 'spacerSm', 'relatedEntitiesList'],
    showFavorite: false,
  },
]
