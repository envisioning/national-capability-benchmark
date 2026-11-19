import Link from 'next/link'
import { COUNTRY_NAMES, EN, indicatorName, unitName } from '@ncb/core'
import type { Dimension, GapExplanation, PostFile } from '@ncb/core'
import { Card, CountryLabel, Eyebrow, Headline, PageTitle, Score, Confidence, Scroller, Table, Td, Th } from '@/components/ui'
import { conditionValue } from '@/components/views/ConditionList'
import { GapGlyph } from '@/components/posts/GapGlyph'
import { GapWaterfall } from '@/components/posts/GapWaterfall'
import { PeerField } from '@/components/posts/PeerField'
import { dimensionLabel } from '@/lib/labels'
import { artefactHref, countryMapDimensionHref, decisionHref, postBlocksHref, postHref, postsTagHref } from '@/lib/links'

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

/**
 * One post in the list: the question, the title, the lead number and the
 * post's widest gaps drawn small, so a reader can tell posts apart before
 * reading a word of them. The figure sits in the page's ink: the list has no
 * dark band, and lime stays with the charts. See D199.
 */
export function PostCard({ post }: { post: PostFile }) {
  return (
    <Card tone="plain" padding="lg" className="flex h-full flex-col">
      <Eyebrow>{post.question}</Eyebrow>
      <h2 className="mt-2 text-2xl font-light leading-tight">
        <Link href={postHref(post.slug)} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      {post.lead ? (
        <p className="mt-5 flex items-baseline gap-3">
          <span className="text-4xl font-light leading-none tabular-nums">{post.lead.figure}</span>
          <span className="text-xs leading-snug text-[var(--muted)]">{post.lead.caption}</span>
        </p>
      ) : (
        <p className="mt-4 text-lg leading-relaxed">{post.dek}</p>
      )}
      <div className="mt-5">
        <GapGlyph post={post} />
      </div>
      <div className="mt-auto pt-5">
        <Tags post={post} />
        <Dateline post={post} />
      </div>
    </Card>
  )
}

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
        <ul className="grid gap-6 md:grid-cols-2">
          {shown.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const signed = (n: number): string => `${n > 0 ? '+' : ''}${n.toFixed(1)}`

export function GapBlock({ gap, why, legend = false }: { gap: GapExplanation; why: string; legend?: boolean }) {
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
      {gap.peerScores ? (
        <div className="mt-6">
          <PeerField gap={gap} legend={legend} />
        </div>
      ) : null}
      <div className="mt-8">
        <GapWaterfall gap={gap} countryName={countryName(gap.iso3)} />
      </div>
      <details className="mt-6">
        <summary className="cursor-pointer text-xs font-medium underline underline-offset-2">Show the rows as a table</summary>
        <div className="mt-4">
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
      </details>
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

/** The lead number and what it counts. It sits on the dark band, so it reads the band's tokens. */
export function LeadFigure({ lead }: { lead: NonNullable<PostFile['lead']> }) {
  return (
    <div className="grid max-w-4xl gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-end">
      <p className="text-6xl font-light leading-none tabular-nums sm:text-8xl">{lead.figure}</p>
      <p className="max-w-md pb-1 text-lg leading-snug text-[var(--muted)] sm:pb-2">{lead.caption}</p>
    </div>
  )
}

/**
 * The top of a post: the page's one dark band (DESIGN.md allows one above the
 * footer, and a post page has no other). It holds the question, the title and
 * the lead number, the one figure the post turns on, so a reader who stops here
 * still leaves with the answer. The figure stays white: lime belongs to the
 * charts below. A post without a lead keeps the band and drops the figure. See
 * D198.
 */
export function PostTop({ post }: { post: PostFile }) {
  return (
    <header className="hero-band full-bleed -mt-12 mb-12 sm:-mt-16">
      <div className="m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-16">
        <Eyebrow>{post.question}</Eyebrow>
        <div className="mt-3 max-w-4xl">
          <PageTitle>{post.title}</PageTitle>
        </div>
        <Dateline post={post} />
        {post.lead ? (
          <div className="mt-10 border-t border-[var(--rule)] pt-8">
            <LeadFigure lead={post.lead} />
          </div>
        ) : null}
        <div className="mb-0 max-w-3xl [&>p]:mb-0">
          <Headline>{post.dek}</Headline>
        </div>
      </div>
    </header>
  )
}

export function PostArticle({ post }: { post: PostFile }) {
  return (
    <article>
      <PostTop post={post} />
      {post.blocks.map((block, i) => {
        const firstGap = post.blocks.findIndex((b) => b.type === 'gap') === i
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
            return <GapBlock key={i} gap={block.gap} why={block.why} legend={firstGap} />
        }
      })}
      <section className="mt-16 border-t border-[var(--rule)] pt-6">
        <h2 className="text-xl font-medium tracking-tight">How the gaps are read</h2>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed">
          A country&apos;s income peers are the 10 countries nearest to it in GDP per head, on a log
          scale. The gap is its score minus their median score. A score is the mean of its rows, so
          each row adds its distance from the peers&apos; median on that row, divided by the number of
          rows. Each bar under a gap is that share, and it is why the explanation can name the rows
          that carry the gap.{' '}
          <Link href={postBlocksHref} className="underline underline-offset-2">
            How a post is drawn
          </Link>
        </p>
        <div className="mt-6">
          <Tags post={post} />
        </div>
      </section>
    </article>
  )
}
