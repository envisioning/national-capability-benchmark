import type { Config } from '@envisioning/app'
import { blocks } from './blocks'
import { pages } from './pages'
import { schema } from './schema'

const menu: Config['navigation']['menu'] = [
  { id: 'home', label: { en: 'Start', pt: 'Início' }, icon: 'homeEv', pageId: 'home' },
  {
    id: 'institutions',
    label: schema.objects.entities.plural,
    icon: 'circlesGroup3Ev',
    pageId: 'institutions',
  },
  { id: 'systems', label: schema.objects.system.plural, icon: 'box', pageId: 'systems' },
]

export const navigation: Config['navigation'] = { menu, pages, blocks }
