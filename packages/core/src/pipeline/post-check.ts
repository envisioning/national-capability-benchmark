import { COUNTRY_ISO3, INDICATORS_BY_ID } from '../model/index.js'
import type { PostFile } from '../model/index.js'

/**
 * The rule that keeps a post tied to the data: every number its prose prints
 * must be a number the post stores, at the precision the prose prints it.
 * Stored numbers are every numeric field in the blocks, the post's named
 * figures, the sum of each gap's two largest drivers (prose says "these two
 * rows carry 36 of the 40 points"), the count of each list, the numbers inside
 * unit names, and the ends of the 0 to 100 scale. See D195.
 */

const NUMBER = /\d[\d,]*(?:\.\d+)?/g

function numericLeaves(value: unknown, out: number[]): void {
  if (typeof value === 'number') out.push(value)
  else if (Array.isArray(value)) {
    out.push(value.length)
    for (const v of value) numericLeaves(v, out)
  } else if (value && typeof value === 'object') for (const v of Object.values(value)) numericLeaves(v, out)
  else if (typeof value === 'string') for (const m of value.match(NUMBER) ?? []) out.push(Number(m.replace(/,/g, '')))
}

/** The numbers a post may print. */
export function storedNumbers(post: PostFile): number[] {
  const out: number[] = [0, 100, ...Object.values(post.figures)]
  for (const block of post.blocks) {
    if (block.type !== 'gap') continue
    numericLeaves(block.gap, out)
    const drivers = block.gap.drivers
    const top = [...drivers].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    if (top.length >= 2) out.push(Math.abs((top[0]?.contribution ?? 0) + (top[1]?.contribution ?? 0)))
    for (const d of drivers) out.push(Math.abs(d.contribution))
    out.push(Math.abs(block.gap.gap))
  }
  return out
}

const decimals = (text: string): number => (text.includes('.') ? (text.split('.')[1]?.length ?? 0) : 0)

/** Every number the prose prints that the post does not store, with where it appears. */
export function unbackedNumbers(post: PostFile): string[] {
  const stored = storedNumbers(post)
  const prose: Array<[string, string]> = [
    ['dek', post.dek],
    ['title', post.title],
    ...post.blocks.flatMap((b, i): Array<[string, string]> =>
      b.type === 'gap' ? [[`blocks.${i}.why`, b.why]] : [[`blocks.${i}`, b.text]],
    ),
  ]
  const problems: string[] = []
  for (const [where, text] of prose) {
    for (const m of text.match(NUMBER) ?? []) {
      const x = Number(m.replace(/,/g, ''))
      const d = decimals(m.replace(/,/g, ''))
      const ok = stored.some((v) => Math.abs(Number(Math.abs(v).toFixed(d)) - x) < 1e-9)
      if (!ok) problems.push(`${where}: ${m} is not a number the post stores`)
    }
  }
  return problems
}

/** Tags that name nothing in the registry. */
export function unknownTags(post: PostFile): string[] {
  return [
    ...post.tags.countries.filter((c) => !COUNTRY_ISO3.includes(c)).map((c) => `country ${c}`),
    ...post.tags.indicators.filter((i) => !INDICATORS_BY_ID[i]).map((i) => `indicator ${i}`),
  ]
}
