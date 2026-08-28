/**
 * Copy-rule helpers for text the viewer computes.
 *
 * The count in a heading is derived from the data it sits above, so it cannot
 * contradict the table underneath it. The rules still apply to a computed
 * number: counts up to nine are spelled out, and a sentence starts with a
 * capital. Both live here so every page spells the same number the same way.
 */

const COUNT_WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

/** A count as prose: spelled out to nine, numerals from 10. */
export const countWord = (n: number): string => COUNT_WORDS[n] ?? String(n)

/** The same word at the start of a sentence. */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)
