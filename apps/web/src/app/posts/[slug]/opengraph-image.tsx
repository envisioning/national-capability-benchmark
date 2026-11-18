import { ImageResponse } from 'next/og'
import { COLORS, OgFrame, OG_SIZE, loadOgFonts } from '@/components/Og'
import { loadPost } from '@/lib/data'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'NCB post'

/** One post's share card: the question, the title and the answer. See D195. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await loadPost((await params).slug)
  if (!post) return new Response('Not found', { status: 404 })
  return new ImageResponse(
    <OgFrame eyebrow={post.question} title={post.title} titleSize={52}>
      <div style={{ color: COLORS.muted, display: 'flex', fontSize: 26, lineHeight: 1.35, marginTop: 24, maxWidth: 1000 }}>
        {post.dek}
      </div>
      <div style={{ color: COLORS.muted, display: 'flex', fontSize: 18, marginTop: 24 }}>
        {`${post.date} · Dataset ${post.datasetVersion}`}
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  )
}
