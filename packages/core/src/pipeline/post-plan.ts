import { DIMENSIONS } from '../model/index.js'
import type { Dimension, PostFile, PostKind } from '../model/index.js'
import { countryArtefactsFor } from './income-gaps.js'
import type { GapCell } from './income-gaps.js'

/**
 * Which post comes next, and which cases it holds. The daily run reads this
 * and never picks a subject itself, so the order of the posts is a rule and
 * not a taste. See D196.
 */

/** A gap narrower than this, in points, is too close to the peers to explain. */
export const GAP_FLOOR = 10

/** Cases per side in a country or capability post. */
export const CASES_PER_SIDE = 3

const byWidth = (direction: 'above' | 'below') => (a: GapCell, b: GapCell) =>
  (direction === 'above' ? b.gap - a.gap : a.gap - b.gap) || a.iso3.localeCompare(b.iso3)

const usable = (c: GapCell): boolean =>
  Math.abs(c.gap) >= GAP_FLOOR && countryArtefactsFor(c.iso3, c.dimension).length === 0

function side(cells: readonly GapCell[], direction: 'above' | 'below', count: number): GapCell[] {
  return cells
    .filter((c) => usable(c) && (direction === 'above' ? c.gap > 0 : c.gap < 0))
    .sort(byWidth(direction))
    .slice(0, count)
}

/** One country's widest gaps on each side, and the capabilities it sits level with its peers on. */
export function countryCases(cells: readonly GapCell[], iso3: string, count = CASES_PER_SIDE) {
  const own = cells.filter((c) => c.iso3 === iso3)
  return {
    above: side(own, 'above', count),
    below: side(own, 'below', count),
    level: own.filter((c) => Math.abs(c.gap) < GAP_FLOOR).map((c) => c.dimension),
    scored: own.length,
  }
}

/** One capability's widest gaps on each side, one country each by construction. */
export function capabilityCases(cells: readonly GapCell[], dimension: Dimension, count = CASES_PER_SIDE) {
  const own = cells.filter((c) => c.dimension === dimension)
  return {
    above: side(own, 'above', count),
    below: side(own, 'below', count),
    level: own.filter((c) => Math.abs(c.gap) < GAP_FLOOR).length,
    scored: own.length,
  }
}

/**
 * Country order: the country whose widest usable gap is widest comes first.
 * A country with no usable gap on either side never gets a country post.
 */
export function countryQueue(cells: readonly GapCell[]): string[] {
  const widest = new Map<string, number>()
  for (const c of cells) if (usable(c)) widest.set(c.iso3, Math.max(widest.get(c.iso3) ?? 0, Math.abs(c.gap)))
  return [...widest.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([iso3]) => iso3)
}

export type NextPost = { kind: Extract<PostKind, 'country' | 'capability'>; subject: string }

/**
 * Monday is a capability, every other day a country. Each walks its queue
 * and takes the first subject no post of that kind has had. When a queue is
 * spent it starts again from the subject posted longest ago.
 */
export function nextPost(date: string, posts: readonly PostFile[], cells: readonly GapCell[]): NextPost {
  const monday = new Date(`${date}T12:00:00Z`).getUTCDay() === 1
  const kind: NextPost['kind'] = monday ? 'capability' : 'country'
  const queue: string[] = monday ? [...DIMENSIONS] : countryQueue(cells)
  const last = new Map<string, string>()
  for (const p of posts) if (p.kind === kind && p.subject && p.date < date) last.set(p.subject, p.date)
  const fresh = queue.find((s) => !last.has(s))
  if (fresh) return { kind, subject: fresh }
  const oldest = [...queue].sort((a, b) => (last.get(a) ?? '').localeCompare(last.get(b) ?? ''))[0]
  if (!oldest) throw new Error(`no subject for a ${kind} post`)
  return { kind, subject: oldest }
}
