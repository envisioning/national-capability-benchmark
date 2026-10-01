import { EN } from './en.js'
import { ES } from './es.js'
import { PT_BR } from './pt-br.js'
import type { Lang, Lexicon } from './types.js'

export * from './types.js'
export * from './institutions-pt-br.js'
export { EN } from './en.js'
export { PT_BR } from './pt-br.js'
export { ES } from './es.js'

/** Every lexicon the build knows. Adding a language means adding a file and one line here. */
export const LEXICONS: Record<Lang, Lexicon> = {
  en: EN,
  'pt-BR': PT_BR,
  es: ES,
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
