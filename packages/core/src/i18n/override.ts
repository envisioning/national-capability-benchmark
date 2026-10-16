import type { Lang, Lexicon } from './types.js'

/**
 * A regional lexicon is a thin override of a base lexicon.
 *
 * The larger speaker community sets the base: Latin American Spanish (es,
 * written for es-419) is the base Spanish and Brazilian Portuguese (pt-BR)
 * the base Portuguese. Spain reads through es-ES, an override that holds
 * number formatting, its own layer countries and only the strings that
 * actually differ. An override is never the default the others are measured
 * against, and it is an orthography and a set of word choices, not a
 * standard of correct Spanish or Portuguese.
 *
 * The merge is deep for objects and replaces everything else: a string, an
 * array (`layerCountries`, `contractions`) or a function is taken whole from
 * the override. A key the override leaves out reads the base. The same
 * helper merges the viewer's chrome and page words, so a regional language
 * is declared once per surface, as a difference.
 */

/** Every key optional, all the way down; arrays and functions are leaves. */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** The base with the override laid over it, deep for plain objects. */
export function mergeOverride<T>(base: T, override: DeepPartial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(override)) return (override ?? base) as T
  const out: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    out[key] = isPlainObject(value) && isPlainObject(out[key]) ? mergeOverride(out[key], value) : value
  }
  return out as T
}

/**
 * What a regional lexicon must declare itself: its id, the base it reads
 * through, the tag its pages carry, its number formatting and its layer
 * countries. Everything else is optional and differs from the base.
 */
export type LexiconOverride = DeepPartial<Lexicon> & {
  lang: Lang
  base: Lang
  htmlLang: string
  numberLocale: string
  layerCountries: readonly string[]
}

/** A regional lexicon: the base with the override's differences laid over it. */
export const withOverride = (base: Lexicon, override: LexiconOverride): Lexicon =>
  mergeOverride<Lexicon>(base, override as DeepPartial<Lexicon>)
