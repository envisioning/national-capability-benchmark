import { ImageResponse } from 'next/og'
import { DIMENSIONS, PT_BR, countryName, storyById, storyText } from '@ncb/core'
import type { Story } from '@ncb/core'
import { COLORS, OgFrame, OgRadar, OG_SIZE, loadOgFonts } from '@/components/Og'
import { loadStorySet, storyIdBySlug } from '@/lib/stories'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'NCB Brasil: achado'

/** The two shapes a story's card draws: the subject filled, the other as an outline. */
function shapes(story: Story): { values: number[]; confidences: number[]; compare: (number | null)[]; legend: [string, string] } | null {
  const name = (iso3: string) => countryName(PT_BR, iso3)
  if (story.id === 'peer_standing') {
    const byDim = new Map(story.rows.map((row) => [row.dimension, row]))
    const rows = DIMENSIONS.map((d) => byDim.get(d))
    if (rows.some((row) => !row)) return null
    return {
      values: rows.map((row) => row!.subject.score),
      confidences: rows.map((row) => row!.subject.confidence),
      compare: rows.map((row) => row!.peerMedian),
      legend: [name(story.iso3), PT_BR.stories?.colPeerMedian ?? ''],
    }
  }
  const match = story.id === 'shape_mirror' ? story.matches[0] : story.peers[0]
  if (!match) return null
  return {
    values: match.rows.map((row) => row.subject.score),
    confidences: match.rows.map((row) => row.subject.confidence),
    compare: match.rows.map((row) => row.other.score),
    legend: [name(story.iso3), name(match.iso3)],
  }
}

/** One story's share card, from the same sentences the page prints. See D192. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = storyIdBySlug(PT_BR, slug)
  const set = id ? await loadStorySet('BRA') : null
  const story = set && id ? storyById(set, id) : null
  const text = story ? storyText(PT_BR, story) : null
  const drawn = story ? shapes(story) : null
  if (!set || !story || !text || !drawn || !PT_BR.stories) return new Response('Not found', { status: 404 })

  return new ImageResponse(
    <OgFrame eyebrow={text.title} title={text.headline} titleSize={40} footer={PT_BR.stories.cardFooter}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 40, marginTop: 8 }}>
        <OgRadar values={drawn.values} confidences={drawn.confidences} compare={drawn.compare} />
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 14 }}>
          <div style={{ alignItems: 'center', display: 'flex', gap: 12, fontSize: 22 }}>
            <div style={{ background: COLORS.accent, display: 'flex', height: 6, width: 32 }} />
            {drawn.legend[0]}
          </div>
          <div style={{ alignItems: 'center', display: 'flex', gap: 12, fontSize: 22 }}>
            <div style={{ background: COLORS.muted, display: 'flex', height: 3, width: 32 }} />
            {drawn.legend[1]}
          </div>
          <div style={{ color: COLORS.muted, display: 'flex', fontSize: 18, marginTop: 10 }}>
            {`NCB ${set.version}`}
          </div>
        </div>
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  )
}
