import type { Metadata } from 'next'
import Link from 'next/link'
import { COUNTRY_NAMES } from '@ncb/core'
import type { GapExplanation } from '@ncb/core'
import { Card, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { GapWaterfall } from '@/components/posts/GapWaterfall'
import { PeerField } from '@/components/posts/PeerField'
import { GapBlock, LeadFigure } from '@/components/posts/PostViews'
import { loadPosts } from '@/lib/data'
import { decisionHref, postHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How a post is drawn, NCB',
  description: 'Every block a post is made of, drawn with real data from a published post.',
}

/**
 * The specimen of the post blocks: every block a post can hold, drawn from a
 * real published post, with the question it answers, the fields it reads and
 * the rule for when it appears. A block that is not on this page is not part
 * of the vocabulary. See D197.
 */

type Spec = { name: string; answers: string; reads: string; rule: string }

const SPECS = {
  lead: {
    name: "Lead number",
    answers: "What is the answer, in one figure?",
    reads: "The post's lead: the figure as printed and the words that say what it counts. Both pass the number rule.",
    rule: "Once, at the top, in the page's one dark band with the question and the title. The figure is the number the dek turns on. It stays white.",
  },
  heading: {
    name: "Heading",
    answers: "Which side of the story am I reading?",
    reads: "Text written by the post's author.",
    rule: "A statement that could be true or false, about six words. A post opens each side of its cases with one.",
  },
  text: {
    name: "Text",
    answers: "What is the question, and what holds it together?",
    reads: "Prose. Every number in it must be one the post stores, or the post fails validation.",
    rule: "Before the cases and after them. Never between a case and its pictures.",
  },
  field: {
    name: "Field strip",
    answers: "Where does this country sit among countries as rich as it?",
    reads: "The case's score and confidence, and each income peer's score and confidence, stored in the post.",
    rule: "Under every case. The line is the peers' median, the gap is the distance from the ringed flag to it. The first case in a post carries the legend.",
  },
  waterfall: {
    name: "Waterfall",
    answers: "Why is the gap there?",
    reads: "The peers' median score, each row's share of the gap, and the country's score.",
    rule: "Under every case, after the field strip. One bar per row, in the order of the gap. What the rows do not account for is its own bar.",
  },
  gap: {
    name: "Case",
    answers: "What is the gap, and what does it come from?",
    reads: "One gap as the facts command printed it: country, capability, score, confidence, peers and drivers.",
    rule: "The unit every kind of post is built from. It holds the why sentence, the field strip, the waterfall and the table behind a toggle.",
  },
} satisfies Record<string, Spec>

function SpecCard({ spec }: { spec: Spec }) {
  return (
    <Card tone="sunken" className="mb-6 max-w-3xl">
      <p className="text-xl font-medium tracking-tight">{spec.name}</p>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-[7rem_1fr]">
        <dt className="text-[var(--muted)]">Answers</dt>
        <dd>{spec.answers}</dd>
        <dt className="text-[var(--muted)]">Reads</dt>
        <dd>{spec.reads}</dd>
        <dt className="text-[var(--muted)]">When</dt>
        <dd>{spec.rule}</dd>
      </dl>
    </Card>
  )
}

function Specimen({ spec, children }: { spec: Spec; children: React.ReactNode }) {
  return (
    <section className="mb-20 border-t border-[var(--rule)] pt-8">
      <SpecCard spec={spec} />
      {children}
    </section>
  )
}

export default async function PostBlocksPage() {
  const posts = await loadPosts()
  const source = posts.find((p) => p.blocks.some((b) => b.type === 'gap' && b.gap.peerScores))
  const leadSource = posts.find((p) => p.lead)
  const block = source?.blocks.find(
    (b): b is { type: 'gap'; gap: GapExplanation; why: string } => b.type === 'gap' && Boolean(b.gap.peerScores),
  )
  const heading = source?.blocks.find((b) => b.type === 'heading')
  const text = source?.blocks.find((b) => b.type === 'text')
  return (
    <div>
      <Eyebrow>Posts</Eyebrow>
      <div className="mt-3">
        <PageTitle>How a post is drawn</PageTitle>
      </div>
      <Headline>
        A post is made of a few blocks, and each one answers one question a reader asks. Every block here is drawn
        from a published post
        {source ? (
          <>
            ,{' '}
            <Link href={postHref(source.slug)} className="underline underline-offset-4">
              {source.title}
            </Link>
          </>
        ) : null}
        . The rules are{' '}
        <Link href={decisionHref('D197')} className="underline underline-offset-4">
          D197
        </Link>{' '}
        and{' '}
        <Link href={decisionHref('D198')} className="underline underline-offset-4">
          D198
        </Link>
        .
      </Headline>
      {!source || !block ? (
        <p className="text-lg text-[var(--muted)]">No post holds a case with peer scores yet.</p>
      ) : (
        <>
          {leadSource?.lead ? (
            <Specimen spec={SPECS.lead}>
              <div className="hero-band px-6 py-10 sm:px-10">
                <LeadFigure lead={leadSource.lead} />
              </div>
            </Specimen>
          ) : null}
          {heading && heading.type === 'heading' ? (
            <Specimen spec={SPECS.heading}>
              <h2 className="text-2xl font-light leading-tight sm:text-3xl">{heading.text}</h2>
            </Specimen>
          ) : null}
          {text && text.type === 'text' ? (
            <Specimen spec={SPECS.text}>
              <p className="max-w-3xl text-lg leading-relaxed">{text.text}</p>
            </Specimen>
          ) : null}
          <Specimen spec={SPECS.field}>
            <PeerField gap={block.gap} legend />
          </Specimen>
          <Specimen spec={SPECS.waterfall}>
            <GapWaterfall gap={block.gap} countryName={COUNTRY_NAMES[block.gap.iso3] ?? block.gap.iso3} />
          </Specimen>
          <Specimen spec={SPECS.gap}>
            <GapBlock gap={block.gap} why={block.why} />
          </Specimen>
        </>
      )}
    </div>
  )
}
