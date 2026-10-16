import { EN } from './en.js'
import { ES } from './es.js'
import { ES_ES } from './es-es.js'
import { PT_BR } from './pt-br.js'
import { PT_PT } from './pt-pt.js'
import type { Lang, Lexicon } from './types.js'

export * from './types.js'
export * from './institutions-pt-br.js'
export { EN } from './en.js'
export { PT_BR } from './pt-br.js'
export { PT_PT } from './pt-pt.js'
export { ES } from './es.js'
export { ES_ES } from './es-es.js'
export { mergeOverride, withOverride } from './override.js'
export type { DeepPartial, LexiconOverride } from './override.js'

/** Every lexicon the build knows. Adding a language means adding a file and one line here. */
export const LEXICONS: Record<Lang, Lexicon> = {
  en: EN,
  'pt-BR': PT_BR,
  'pt-PT': PT_PT,
  es: ES,
  'es-ES': ES_ES,
}

export const LANGS: Lang[] = Object.keys(LEXICONS) as Lang[]

/**
 * Whether one lexicon renders documents for one country: every country unless
 * the lexicon names the countries whose layer it is written for. See D134.
 */
export function lexiconRenders(lang: Lang, iso3: string): boolean {
  const countries = LEXICONS[lang].layerCountries
  return !countries || countries.includes(iso3.toUpperCase())
}
