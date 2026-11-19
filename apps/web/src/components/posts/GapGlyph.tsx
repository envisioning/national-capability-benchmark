import type { GapExplanation, PostFile } from '@ncb/core'
import { Flag } from '@/components/ui'
import { dimensionLabel } from '@/lib/labels'

/**
 * A post's widest gaps, drawn small for its card in the list. Each row is the
 * 0 to 100 scale with the peers' median as a tick and the gap as a bar from it
 * to the country's score: filled when the country is above, open when below,
 * the same marks the waterfall uses. It shows a gap, not a distribution, so it
 * is no second field chart (D67). Every number comes from the post. See D199.
 */

/** How many gaps a card draws. */
export const GLYPH_ROWS = 3

const pct = (v: number): string => `${Math.min(100, Math.max(0, v))}%`

/** The post's widest gaps, widest first. */
export function widestGaps(post: PostFile, count = GLYPH_ROWS): GapExplanation[] {
  return post.blocks
    .flatMap((b) => (b.type === 'gap' ? [b.gap] : []))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, count)
}

export function GapGlyph({ post }: { post: PostFile }) {
  const gaps = widestGaps(post)
  if (gaps.length === 0) return null
  return (
    <ul className="space-y-2" aria-label="The post's widest gaps against income peers">
      {gaps.map((g) => {
        const lo = Math.min(g.score, g.peerMedian)
        const hi = Math.max(g.score, g.peerMedian)
        const above = g.gap > 0
        return (
          <li
            key={`${g.iso3}-${g.dimension}`}
            className="grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3 text-xs"
          >
            <span className="flex min-w-0 items-baseline gap-1">
              <Flag iso3={g.iso3} />
              <span className="truncate">{dimensionLabel(g.dimension)}</span>
            </span>
            <span className="relative h-3" aria-hidden>
              <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--rule)]" />
              <span
                className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-sm ${
                  above ? 'bg-[var(--foreground)]' : 'border border-[var(--foreground)] bg-[var(--background)]'
                }`}
                style={{ left: pct(lo), width: pct(hi - lo) }}
              />
              <span
                className="absolute top-0 h-3 w-px bg-[var(--muted)]"
                style={{ left: pct(g.peerMedian) }}
              />
            </span>
            <span className="text-right tabular-nums text-[var(--muted)]">
              {g.gap > 0 ? '+' : ''}
              {g.gap.toFixed(1)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
