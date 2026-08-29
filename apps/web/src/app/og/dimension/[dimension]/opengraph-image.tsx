import { ImageResponse } from 'next/og'
import { COUNTRIES, DIMENSIONS, DIMENSION_LABELS, type Dimension } from '@ncb/core'
import { OgDistribution, OgFrame, OG_SIZE, loadOgFonts } from '@/components/Og'
import { loadIndex } from '@/lib/data'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'National Capability Benchmark capability distribution'

export function generateStaticParams() {
  return DIMENSIONS.map((dimension) => ({ dimension }))
}

function asDimension(value: string): Dimension | null {
  return DIMENSIONS.includes(value as Dimension) ? (value as Dimension) : null
}

export default async function Image({ params }: { params: Promise<{ dimension: string }> }) {
  const { dimension: raw } = await params
  const dimension = asDimension(raw)
  const data = await loadIndex()
  if (!dimension || !data) return new Response('Not found', { status: 404 })

  const values = data.countries
    .map((country) => ({
      country: country.country,
      score: country.dimensions[dimension]?.score ?? null,
    }))
    .filter((item): item is { country: string; score: number } => item.score !== null)
    .sort((a, b) => a.score - b.score)
  const focal = values.find((value) => value.country === COUNTRIES.find((c) => c.iso3 === 'BRA')?.name) ?? null

  return new ImageResponse(
    <OgFrame eyebrow="Capability distribution" title={DIMENSION_LABELS[dimension]}>
      <div style={{ color: '#b8bdd9', display: 'flex', fontSize: 20, marginTop: 16 }}>
        {values.length} countries with a score, with Brazil pinned for reference
      </div>
      <div style={{ display: 'flex', marginTop: 12 }}>
        <OgDistribution values={values} focal={focal} />
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  )
}
