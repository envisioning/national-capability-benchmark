import type { Metadata } from 'next'
import Link from 'next/link'
import { countryName, fillLex, peerShapeLine, shapeMatchLine, storyText } from '@ncb/core'
import type { Lexicon, ShapeMatch, Story, StorySet } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { ShareLink } from '@/components/layer/ShareLink'
import { Confidence, Empty, Eyebrow, Headline, Note, PageTitle, Score, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { MISSING_DATA_HINT } from '@/lib/data'
import { absoluteHref, decisionHref, methodHref, storyHref } from '@/lib/links'

/**
 * The stories of one country, read through one layer's lexicon. Every
 * sentence comes from `storyText`, which the share card calls too, so the
 * page and the card cannot disagree. See D192.
 */

const dateIn = (iso: string, locale: string): string =>
  new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function Edition({ lex, set }: { lex: Lexicon; set: StorySet }) {
  const s = lex.stories
  if (!s) return null
  return (
    <p className="mt-3 text-xs text-[var(--muted)]">
      {fillLex(lex, s.edition, { version: set.version, date: dateIn(set.generatedAt, lex.numberLocale) })}
      {' · '}
      <Link href={decisionHref('D192')} className="underline underline-offset-2">
        D192
      </Link>
    </p>
  )
}

export function storiesIndexMetadata(lex: Lexicon, iso3: string): Metadata {
  const s = lex.stories
  return s ? { title: `${s.indexTitle}, ${countryName(lex, iso3)}, NCB`, description: s.indexIntro.replace(/\{version\}/g, '').trim() } : {}
}

export function StoriesIndex({ lex, set }: { lex: Lexicon; set: StorySet | null }) {
  const s = lex.stories
  if (!s || !set) return <Empty hint={MISSING_DATA_HINT} />
  return (
    <div>
      <PageTitle>{s.indexTitle}</PageTitle>
      <Edition lex={lex} set={set} />
      <Headline>{fillLex(lex, s.indexIntro, { version: set.version })}</Headline>
      <ul className="grid gap-6 sm:grid-cols-3">
        {set.stories.map((story) => {
          const text = storyText(lex, story)
          const href = storyHref(set.iso3, s.slugs[story.id])
          if (!text || !href) return null
          return (
            <li key={story.id} className="rounded-lg border border-[var(--rule)] p-5">
              <Eyebrow>{text.title}</Eyebrow>
              <p className="mt-3 text-xl font-light leading-snug">
                <Link href={href} className="hover:underline">
                  {text.headline}
                </Link>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function storyMetadata(lex: Lexicon, story: Story | null): Metadata {
  const text = story ? storyText(lex, story) : null
  return text ? { title: `${text.title}, NCB`, description: text.headline } : {}
}

function Cell({ lex, value, confidence }: { lex: Lexicon; value: number; confidence: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Score value={value} size="sm" locale={lex.numberLocale} />
      <Confidence value={confidence} locale={lex.numberLocale} />
    </span>
  )
}

/** Two countries on one radar and in one table, dimension by dimension. */
function PairView({ lex, iso3, match, heading }: { lex: Lexicon; iso3: string; match: ShapeMatch; heading: string }) {
  const s = lex.stories
  if (!s) return null
  const subjectName = countryName(lex, iso3)
  const matchName = countryName(lex, match.iso3)
  return (
    <Section title={heading}>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Radar
          lex={lex}
          series={[
            {
              label: subjectName,
              iso3,
              values: match.rows.map((r) => r.subject.score),
              confidences: match.rows.map((r) => r.subject.confidence),
              color: 'var(--primary)',
            },
            {
              label: matchName,
              iso3: match.iso3,
              values: match.rows.map((r) => r.other.score),
              confidences: match.rows.map((r) => r.other.confidence),
              color: 'var(--muted)',
              outline: true,
            },
          ]}
        />
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>{s.colDimension}</Th>
                <Th align="right">{subjectName}</Th>
                <Th align="right">{matchName}</Th>
              </tr>
            </thead>
            <tbody>
              {match.rows.map((row) => (
                <tr key={row.dimension}>
                  <Td>{lex.dimensions[row.dimension]}</Td>
                  <Td align="right">
                    <Cell lex={lex} value={row.subject.score} confidence={row.subject.confidence} />
                  </Td>
                  <Td align="right">
                    <Cell lex={lex} value={row.other.score} confidence={row.other.confidence} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </div>
    </Section>
  )
}

function StoryBody({ lex, story }: { lex: Lexicon; story: Story }) {
  const s = lex.stories
  if (!s) return null
  switch (story.id) {
    case 'shape_mirror': {
      const first = story.matches[0]
      return (
        <>
          {first ? <PairView lex={lex} iso3={story.iso3} match={first} heading={s.shapeMirror.tableHeading} /> : null}
          <Section title={s.shapeMirror.nextHeading}>
            <ol className="space-y-2 text-lg">
              {story.matches.map((match) => (
                <li key={match.iso3}>
                  {shapeMatchLine(lex, match)}
                </li>
              ))}
            </ol>
          </Section>
        </>
      )
    }
    case 'peer_contrast': {
      const first = story.peers[0]
      return (
        <>
          {first ? <PairView lex={lex} iso3={story.iso3} match={first} heading={s.peerContrast.tableHeading} /> : null}
          <Section title={s.peerContrast.peersHeading}>
            <ol className="space-y-2 text-lg">
              {story.peers.map((peer) => (
                <li key={peer.iso3}>
                  {peerShapeLine(lex, peer)}
                </li>
              ))}
            </ol>
          </Section>
        </>
      )
    }
    case 'peer_standing':
      return (
        <Section
          title={s.peerStanding.tableHeading}
          hint={fillLex(lex, s.peerStanding.peersLine, { list: story.peers.map((iso3) => countryName(lex, iso3)).join(', ') })}
        >
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>{s.colDimension}</Th>
                  <Th align="right">{s.colScore}</Th>
                  <Th align="right">{s.colConfidence}</Th>
                  <Th align="right">{s.colPeerMedian}</Th>
                  <Th align="right">{s.colGap}</Th>
                </tr>
              </thead>
              <tbody>
                {story.rows.map((row) => (
                  <tr key={row.dimension}>
                    <Td>
                      {lex.dimensions[row.dimension]}
                      {row.subject.thin ? <span className="ml-2 text-[var(--muted)]">({s.thin})</span> : null}
                    </Td>
                    <Td align="right">
                      <Score value={row.subject.score} size="sm" locale={lex.numberLocale} thin={row.subject.thin} />
                    </Td>
                    <Td align="right">
                      <Confidence value={row.subject.confidence} locale={lex.numberLocale} />
                    </Td>
                    <Td align="right">{row.peerMedian.toLocaleString(lex.numberLocale)}</Td>
                    <Td align="right">{(row.gap > 0 ? '+' : '') + row.gap.toLocaleString(lex.numberLocale)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        </Section>
      )
  }
}

export function StoryPage({ lex, set, story, path }: { lex: Lexicon; set: StorySet; story: Story; path: string }) {
  const s = lex.stories
  const text = storyText(lex, story)
  if (!s || !text) return <Empty hint={MISSING_DATA_HINT} />
  return (
    <article>
      <Eyebrow>{text.title}</Eyebrow>
      <div className="mt-3">
        <PageTitle>{text.headline}</PageTitle>
      </div>
      <Edition lex={lex} set={set} />
      <div className="my-8 max-w-3xl space-y-4 text-lg leading-relaxed">
        {text.dek.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {text.caveat ? <Note>{text.caveat}</Note> : null}
      <StoryBody lex={lex} story={story} />
      <Section title={s.howHeading}>
        <p className="max-w-3xl text-lg leading-relaxed">{text.how}</p>
        <p className="mt-4 text-lg">
          <Link href={methodHref} className="underline underline-offset-2">
            {s.methodLink}
          </Link>
        </p>
      </Section>
      <Section title={s.shareHeading}>
        <ShareLink url={absoluteHref(path)} label={s.copyLink} copied={s.copied} />
      </Section>
    </article>
  )
}
