import type { Visualizations } from '@envisioning/app/server'

/**
 * The drawn network.
 *
 * A line carries a relation family through its width and nothing else. It
 * cannot carry a direction or name one of the 13 verbs, which is why the
 * ledger at `/country/{ISO3}/institutions` stays the authoritative reading and
 * this is a second one. See D82.
 *
 * `showSelectedItemNetwork` is on by default because the whole graph is a
 * hairball and one institution's neighbourhood is not: 261 of Brazil's 359
 * institutions carry exactly one relation, so the useful question is always
 * "what reaches this one".
 */
export const Forcefield: Visualizations['forcefieldNetwork'] = {
  type: 'forcefieldNetwork',
  label: { en: 'Network', pt: 'Rede' },
  entityPageId: 'institution',
  titlePath: 'title',
  showDownloadButton: true,
  settings: {
    color: '{level.color.hex}',
    minLineWidth: 0.4,
    maxLineWidth: 2.5,
    maxItemWidth: 220,
    itemMargin: 18,
    labelSize: 'mn',
    repulsionStrength: -220,
    linkDistance: 90,
    linkStrengthFactor: 1.2,
    hopDistance: 260,
    maxHops: 2,
  },
  clusterBy: [
    { label: { en: 'System', pt: 'Sistema' }, joinKey: 'system' },
    { label: { en: 'Level', pt: 'Esfera' }, joinKey: 'level' },
    { label: { en: 'Jurisdiction', pt: 'Jurisdição' }, joinKey: 'jurisdiction' },
    { label: { en: 'None', pt: 'Nenhum' }, joinKey: '' },
  ],
  preferences: {
    showConnections: {
      default: true,
      showOption: true,
      label: { en: 'Show relations', pt: 'Mostrar relações' },
    },
    showSelectedItemNetwork: {
      default: true,
      showOption: true,
      label: { en: 'Focus on the selected institution', pt: 'Focar na instituição selecionada' },
    },
  },
}
