import type { Pair, PairRow, PairSide, PostFile } from '../model/index.js'
import type { CapabilityMap, IncomeRow } from './capability-map.js'
import { isThinEvidence } from './confidence.js'
import { valueAsUnit } from './income-gaps.js'
import type { GapCell } from './income-gaps.js'
import { round } from './stats.js'

/**
 * What makes a post more than a list of rows: a second country to read the
 * subject against, and the other posts where the same row did the work.
 *
 * The twin is the income peer whose score on the capability is furthest from
 * the subject's, with usable evidence. Two countries that earn about the same
 * and land far apart are the clearest case that income does not decide the
 * score, and the rows they differ on say what does. Ties go to the peer
 * nearer in income. See D200.
 */

/** The peer furthest from the subject on the capability, or null when no peer has usable evidence. */
export function pickTwin(cell: GapCell): GapCell['peerScores'][number] | null {
  const rank = (iso3: string) => cell.peers.indexOf(iso3)
  return (
    cell.peerScores
      .filter((p) => !isThinEvidence(p.confidence))
      .sort((a, b) => Math.abs(b.score - cell.score) - Math.abs(a.score - cell.score) || rank(a.iso3) - rank(b.iso3))[0] ??
    null
  )
}

const counted = (map: CapabilityMap) => map.rows.filter((r) => r.normalized !== null && r.staleYear === null)

/** The subject and its twin on one capability, from both countries' capability maps. */
export function buildPair(a: CapabilityMap, b: CapabilityMap, income: readonly IncomeRow[]): Pair {
  const side = (map: CapabilityMap): PairSide => {
    const row = income.find((r) => r.iso3 === map.iso3)
    return {
      iso3: map.iso3,
      score: map.score ?? 0,
      confidence: map.confidence,
      gdpPerCapita: row ? round(row.gdpPerCapita, 0) : null,
      incomeYear: row?.year ?? null,
    }
  }
  const twinRows = new Map(counted(b).map((r) => [r.id, r]))
  const rows: PairRow[] = counted(a).flatMap((r) => {
    const t = twinRows.get(r.id)
    if (!t) return []
    return [
      {
        indicatorId: r.id,
        unit: r.unit,
        a: { value: valueAsUnit(r.id, r.raw), year: r.year, position: round(r.normalized as number, 1) },
        b: { value: valueAsUnit(t.id, t.raw), year: t.year, position: round(t.normalized as number, 1) },
      },
    ]
  })
  rows.sort((x, y) => Math.abs(y.a.position - y.b.position) - Math.abs(x.a.position - x.b.position))
  return { dimension: a.dimension, a: side(a), b: side(b), rows }
}

/** A row that carries a gap in this post and in others. */
export type RowEcho = {
  indicatorId: string
  /** The other posts where the row is one of a case's two largest drivers, newest first. */
  elsewhere: Array<{ slug: string; title: string; date: string; iso3: string; dimension: string; contribution: number }>
}

/** A row moves a gap less than this, in points, and it is not one of the rows that carry it. */
export const ECHO_FLOOR = 5

/**
 * A case's leading rows: its two largest drivers, kept only where the row
 * pushes the gap's way by at least `ECHO_FLOOR` points. A capability with two
 * rows would otherwise list both on every case.
 */
const leading = (post: PostFile) =>
  post.blocks.flatMap((b) =>
    b.type !== 'gap'
      ? []
      : [...b.gap.drivers]
          .sort((x, y) => Math.abs(y.contribution) - Math.abs(x.contribution))
          .slice(0, 2)
          .filter((d) => Math.sign(d.contribution) === Math.sign(b.gap.gap) && Math.abs(d.contribution) >= ECHO_FLOOR)
          .map((d) => ({ indicatorId: d.indicatorId, iso3: b.gap.iso3, dimension: b.gap.dimension, contribution: d.contribution })),
  )

/**
 * The rows that lead a case here and a different case in another post: a
 * case is one country on one capability, so the same case held by two posts
 * counts once, under the newer post, and a case this post holds never
 * counts. This reads published posts only, never the current data, and it is
 * the page's navigation, not part of the post: it grows as posts are added
 * while the post itself stays a closed edition. See D200.
 */
export function rowEchoes(post: PostFile, posts: readonly PostFile[]): RowEcho[] {
  const mine = leading(post)
  const cases = new Set(
    post.blocks.flatMap((b) => (b.type === 'gap' ? [`${b.gap.iso3}:${b.gap.dimension}`] : [])),
  )
  const newestFirst = [...posts].filter((p) => p.slug !== post.slug).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
  return [...new Set(mine.map((d) => d.indicatorId))]
    .map((indicatorId) => {
      const seen = new Set(cases)
      const elsewhere: RowEcho['elsewhere'] = []
      for (const p of newestFirst) {
        for (const d of leading(p)) {
          const key = `${d.iso3}:${d.dimension}`
          if (d.indicatorId !== indicatorId || seen.has(key)) continue
          seen.add(key)
          elsewhere.push({ slug: p.slug, title: p.title, date: p.date, iso3: d.iso3, dimension: d.dimension, contribution: d.contribution })
        }
      }
      return { indicatorId, elsewhere }
    })
    .filter((e) => e.elsewhere.length > 0)
    .sort((x, y) => y.elsewhere.length - x.elsewhere.length || x.indicatorId.localeCompare(y.indicatorId))
}
