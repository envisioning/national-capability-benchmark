import { LANGS, LEXICONS } from '../i18n/index.js'
import { localizeInstitutionNetwork } from '../i18n/institutions-pt-br.js'
import type { Lang } from '../i18n/types.js'
import { COUNTRY_NAMES } from '../model/countries.js'
import { buildInstitutionExplorer } from './institution-explorer.js'
import type { InstitutionExplorerFeed } from './institution-explorer.js'
import { institutionExplorerFile } from './paths.js'
import { loadInstitutionNetwork, writeOut } from './store.js'

/**
 * Write one country's explorer feed, one file per lexicon.
 *
 * The feed embeds rendered labels, so language is baked in at write time. That
 * follows the agenda, which publishes one language-neutral JSON and one
 * document per lexicon: here the neutral artefact is the institution map
 * itself, which the viewer already reads. See D35 and D82.
 */
export async function writeInstitutionExplorer(
  iso3: string,
  langs: Lang[] = LANGS,
): Promise<{ iso3: string; written: string[]; institutions: number; drawable: string[] }> {
  const network = await loadInstitutionNetwork(iso3)
  if (!network) throw new Error(`No institution map for ${iso3.toUpperCase()}`)

  const countryName = COUNTRY_NAMES[network.iso3] ?? network.iso3
  const written: string[] = []
  let feed: InstitutionExplorerFeed | null = null

  for (const lang of langs) {
    const localized = localizeInstitutionNetwork(network, lang)
    feed = buildInstitutionExplorer(
      localized,
      LEXICONS[lang],
      LEXICONS[lang].countries[network.iso3] ?? countryName,
    )
    const path = institutionExplorerFile(network.iso3, lang)
    await writeOut(path, `${JSON.stringify(feed, null, 2)}\n`)
    written.push(path)
  }

  return {
    iso3: network.iso3,
    written,
    institutions: network.nodes.length,
    drawable: (feed?.allJurisdictions ?? []).filter((entry) => entry.drawable).map((entry) => entry.id),
  }
}
