import type { Config } from '@envisioning/app'
import { Forcefield } from './forcefield'

export const settings: Config['settings'] = {
  projectMainLabel: 'NCB',
  projectExtraLabel: 'Institutions',
  locales: ['en', 'pt'],
  seo: {
    title: 'Institution network, NCB',
    description:
      'How one country is organized to act: the institutions the benchmark maps, and the relations recorded between them.',
  },
  visualization: [Forcefield],
  filters: [
    {
      label: { en: 'Jurisdiction', pt: 'Jurisdição' },
      type: 'SELECTION',
      joinKey: 'jurisdiction',
    },
    {
      label: { en: 'System', pt: 'Sistema' },
      type: 'SELECTION',
      joinKey: 'system',
    },
    {
      label: { en: 'Level', pt: 'Esfera' },
      type: 'SELECTION',
      joinKey: 'level',
    },
  ],
  headerSettings: [
    {
      type: 'buttons',
      settingType: 'fullscreen',
      options: [{ label: { en: 'Full screen', pt: 'Tela cheia' }, value: 'fullscreen' }],
    },
  ],
}
