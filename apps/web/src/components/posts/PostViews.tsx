import Link from 'next/link'
import { COUNTRY_NAMES, EN, indicatorName, unitName } from '@ncb/core'
import type { Dimension, GapExplanation, PostFile } from '@ncb/core'
import { CountryLabel, Eyebrow, Headline, PageTitle, Score, Confidence, Scroller, Table, Td, Th } from '@/components/ui'
import { conditionValue } from '@/components/views/ConditionList'
import { dimensionLabel } from '@/lib/labels'
import { artefactHref, countryMapDimensionHref, decisionHref, postHref, postsTagHref } from '@/lib/links'

/**
 * The posts: dated explainers that open the data. Every number on these pages
 * is stored in the post file with the dataset version it came from, and every
 * tag is a link to the other posts that carry it. See D195.
 */

const dateLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

const countryName = (iso3: string): string => COUNTRY_NAMES[iso3] ?? iso3

function Tags({ post }: { post: PostFile }) {
  const chip = 'rounded-full border border-[var(--rule)] px-3 py-1 text-xs font-medium hover:border-[var(--foreground)]'
  return (
    <ul className="flex flex-wrap gap-2">
      {post.tags.countries.map((iso3) => (
        <li key={iso3}>
          <Link href={postsTagHref({ country: iso3 })} className={chip}>
            {countryName(iso3)}
          </Link>
        </li>
      ))}
      {post.tags.dimensions.map((dimension) => (
        <li key={dimension}>
          <Link href={postsTagHref({ dimension })} className={chip}>
            {dimensionLabel(dimension)}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Dateline({ post }: { post: PostFile }) {
  return (
    <p className="mt-3 text-xs text-[var(--muted)]">
      {dateLabel(post.date)} · Dataset {post.datasetVersion} ·{' '}
      <Link href={decisionHref('D195')} className="underline underline-offset-2">
        How posts are made
      </Link>
    </p>
  )
}

/** What the list is narrowed to, as a reader would say it. */
export type PostFilter = { country?: string | undefined; dimension?: Dimension | undefined; indicator?: string | undefined }

export function filterPosts(posts: PostFile[], filter: PostFilter): PostFile[] {
  return posts.filter(
    (p) =>
      (!filter.country || p.tags.countries.includes(filter.country)) &&
      (!filter.dimension || p.tags.dimensions.includes(filter.dimension)) &&
      (!filter.indicator || p.tags.indicators.includes(filter.indicator)),
  )
}

const filterLabel = (filter: PostFilter): string | null =>
  filter.country
    ? countryName(filter.country)
    : filter.dimension
      ? dimensionLabel(filter.dimension)
      : filter.indicator
        ? indicatorName(EN, filter.indicator)
        : null

export function PostList({ posts, filter }: { posts: PostFile[]; filter: PostFilter }) {
  const label = filterLabel(filter)
  const shown = filterPosts(posts, filter)
  return (
    <div>
      <PageTitle>{label ? `Posts about ${label}` : 'Posts'}</PageTitle>
      <Headline>
        Each post answers one question with the data, and says which numbers make the answer.
        {label ? (
          <>
            {' '}
            <Link href={postsTagHref({})} className="underline underline-offset-4">
              See every post
            </Link>
          </>
        ) : null}
      </Headline>
      {shown.length === 0 ? (
        <p className="text-lg text-[var(--muted)]">No post carries this tag yet.</p>
      ) : (
        <ul className="space-y-10">
          {shown.map((post) => (
            <li key={post.slug} className="border-t border-[var(--rule)] pt-6">
              <Eyebrow>{post.question}</Eyebrow>
              <h2 className="mt-2 text-2xl font-light leading-tight sm:text-3xl">
                <Link href={postHref(post.slug)} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <Dateline post={post} />
              <p className="mt-4 max-w-3xl text-lg leading-relaxed">{post.dek}</p>
              <div className="mt-4">
                <Tags post={post} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const signed = (n: number): string => `${n > 0 ? '+' : ''}${n.toFixed(1)}`

function GapBlock({ gap, why }: { gap: GapExplanation; why: string }) {
  const limits = [...gap.countryArtefacts, ...gap.dimensionArtefacts]
  return (
    <section className="mb-14 border-t border-[var(--rule)] pt-6">
      <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xl font-medium tracking-tight">
        <CountryLabel iso3={gap.iso3} name={countryName(gap.iso3)} />
        <span className="font-light text-[var(--muted)]">{dimensionLabel(gap.dimension)}</span>
      </h3>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-lg">
        <Score value={gap.score} />
        <Confidence value={gap.confidence} />
        <span className="text-[var(--muted)]">
          against a median of {gap.peerMedian.toFixed(1)} for its {gap.peersScored} income peers,{' '}
          {signed(gap.gap)} points
        </span>
      </p>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed">{why}</p>
      <div className="mt-6">
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Row of the score</Th>
                <Th align="right">Value</Th>
                <Th align="right">Position, 0 to 100</Th>
                <Th align="right">Peer median</Th>
                <Th align="right">Points of the gap</Th>
              </tr>
            </thead>
            <tbody>
              {gap.drivers.map((d) => (
                <tr key={d.indicatorId}>
                  <Td>{indicatorName(EN, d.indicatorId)}</Td>
                  <Td align="right">
                    {d.value === null ? 'no value' : `${conditionValue(d.value)} ${unitName(EN, d.unit)}`}
                    {d.year ? <span className="text-[var(--muted)]"> ({d.year})</span> : null}
                  </Td>
                  <Td align="right">{d.position.toFixed(1)}</Td>
                  <Td align="right">{d.peerPosition.toFixed(1)}</Td>
                  <Td align="right">{signed(d.contribution)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <Link href={countryMapDimensionHref(gap.iso3, gap.dimension)} className="underline underline-offset-2">
          {countryName(gap.iso3)} on {dimensionLabel(gap.dimension).toLowerCase()}, against its peers
        </Link>
        {limits.length > 0 ? (
          <span className="text-[var(--muted)]">
            Known limits:{' '}
            {limits.map((id, i) => (
              <span key={id}>
                {i > 0 ? ', ' : null}
                <Link href={artefactHref(id)} className="underline underline-offset-2">
                  {id}
                </Link>
              </span>
            ))}
          </span>
        ) : null}
      </p>
    </section>
  )
}

export function PostArticle({ post }: { post: PostFile }) {
  return (
    <article>
      <Eyebrow>{post.question}</Eyebrow>
      <div className="mt-3">
        <PageTitle>{post.title}</PageTitle>
      </div>
      <Dateline post={post} />
      <Headline>{post.dek}</Headline>
      {post.blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={i} className="mb-6 max-w-3xl text-lg leading-relaxed">
                {block.text}
              </p>
            )
          case 'heading':
            return (
              <h2 key={i} className="mb-6 mt-14 text-2xl font-light leading-tight sm:text-3xl">
                {block.text}
              </h2>
            )
          case 'gap':
            return <GapBlock key={i} gap={block.gap} why={block.why} />
        }
      })}
      <section className="mt-16 border-t border-[var(--rule)] pt-6">
        <h2 className="text-xl font-medium tracking-tight">How the gaps are read</h2>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed">
          A country&apos;s income peers are the 10 countries nearest to it in GDP per head, on a log
          scale. The gap is its score minus their median score. A score is the mean of its rows, so
          each row adds its distance from the peers&apos; median on that row, divided by the number of
          rows. That share is the last column of each table, and it is why the
          explanation can name the rows that carry the gap.
        </p>
        <div className="mt-6">
          <Tags post={post} />
        </div>
      </section>
    </article>
  )
}
