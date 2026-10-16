/**
 * A count as prose: spelled out to nine, numerals from 10.
 *
 * The copy rule applies to a computed number too, so a sentence the core
 * templates (the claim readings and the brief) and a sentence a page templates
 * spell the same count the same way. The viewer re-exports these from
 * `apps/web/src/lib/words.ts`.
 */

const COUNT_WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

/** A count as English prose. */
export const countWord = (n: number): string => COUNT_WORDS[n] ?? String(n)

const PT_COUNT_WORDS = ['nenhum', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']

/** A count as Portuguese prose, masculine: spelled out to nine, numerals from 10. */
export const ptCountWord = (n: number): string => PT_COUNT_WORDS[n] ?? String(n)
