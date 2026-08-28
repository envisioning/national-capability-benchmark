import { EN } from './en.js'
import { PT_BR } from './pt-br.js'
import type { Lang, Lexicon } from './types.js'

export * from './types.js'
export * from './institutions-pt-br.js'
export { EN } from './en.js'
export { PT_BR } from './pt-br.js'

/** Every lexicon the build knows. Adding a language means adding a file and one line here. */
export const LEXICONS: Record<Lang, Lexicon> = {
  en: EN,
  'pt-BR': PT_BR,
}

export const LANGS: Lang[] = Object.keys(LEXICONS) as Lang[]
