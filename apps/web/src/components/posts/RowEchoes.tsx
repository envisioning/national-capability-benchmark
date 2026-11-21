import Link from 'next/link'
import { COUNTRY_NAMES, EN, countWord, indicatorName, rowEchoes } from '@ncb/core'
import type { Dimension, PostFile } from '@ncb/core'
import { Flag } from '@/components/ui'
import { dimensionLabel } from '@/lib/labels'
import { postHref, postsTagHref } from '@/lib/links'

/**
 * The rows that carry a gap in this post and in other posts. A row that keeps
 * coming back across countries is a pattern, not a country's quirk, and this
 * is where a reader sees it. It reads published posts only, and it is the
 * page's navigation rather than part of the post: it grows as posts are added.
 * See D200.
 */

const signed = (n: number): string => `${n > 0 ? '+' : ''}${n.toFixed(1)}`

export function RowEchoes({ post, posts }: { post: PostFile; posts: PostFile[] }) {
  const echoes = rowEchoes(post, posts)
  if (echoes.length === 0) return null
  return (
    <section className="mt-16 border-t border-[var(--rule)] pt-6">
      <h2 className="text-xl font-medium tracking-tight">The same rows in other posts</h2>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed">
        These rows carry a gap here and carry one for other countries in other posts. A row that keeps coming back is a
        pattern across countries, not one country&apos;s story.
      </p>
      <ul className="mt-6 space-y-6">
        {echoes.map((e) => {
          const down = e.elsewhere.filter((x) => x.contribution < 0).length
          const up = e.elsewhere.length - down
          return (
            <li key={e.indicatorId}>
              <p className="text-xs font-medium">
                <Link href={postsTagHref({ indicator: e.indicatorId })} className="underline underline-offset-2">
                  {indicatorName(EN, e.indicatorId)}
                </Link>
                <span className="font-normal text-[var(--muted)]">
                  {' '}
                  · {down > 0 ? `pulls the score down for ${countWord(down)} other ${down === 1 ? 'country' : 'countries'}` : null}
                  {up > 0 && down > 0 ? ', ' : null}
                  {up > 0 ? `${down > 0 ? 'lifts it' : 'lifts the score'} for ${countWord(up)} other ${up === 1 ? 'country' : 'countries'}` : null}
                </span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {e.elsewhere.map((x) => (
                  <li key={`${x.slug}-${x.iso3}-${x.dimension}`}>
                    <Link
                      href={postHref(x.slug)}
                      title={x.title}
                      className="inline-flex items-baseline gap-1 rounded-full border border-[var(--rule)] px-3 py-1 text-xs hover:border-[var(--foreground)]"
                    >
                      <Flag iso3={x.iso3} />
                      <span>{COUNTRY_NAMES[x.iso3] ?? x.iso3}</span>
                      <span className="text-[var(--muted)]">
                        {dimensionLabel(x.dimension as Dimension)} {signed(x.contribution)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
