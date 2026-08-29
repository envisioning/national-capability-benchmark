import { ImageResponse } from 'next/og'
import { COUNTRIES, COUNTRY_NAMES, DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import { OgCountryMark, OgFrame, OgRadar, OG_SIZE, loadOgFonts } from '@/components/Og'
import { loadCountry } from '@/lib/data'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'National Capability Benchmark country profile'

export function generateStaticParams() {
  return COUNTRIES.map(({ iso3 }) => ({ iso3 }))
}

export default async function Image({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3: raw } = await params
  const iso3 = raw.toUpperCase()
  const country = await loadCountry(iso3)
  const name = country?.country ?? COUNTRY_NAMES[iso3]
  if (!country || !name) return new Response('Not found', { status: 404 })

  const values = DIMENSIONS.map((dimension) => country.dimensions[dimension]?.score ?? null)
  const confidences = DIMENSIONS.map((dimension) => country.dimensions[dimension]?.confidence ?? null)
  const top = DIMENSIONS.map((dimension) => ({
    dimension,
    score: country.dimensions[dimension]?.score ?? null,
  }))
    .filter((item): item is { dimension: typeof DIMENSIONS[number]; score: number } => item.score !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return new ImageResponse(
    <OgFrame eyebrow="Country profile" title={name}>
      <div style={{ display: 'flex', gap: 40, marginTop: 18 }}>
        <OgCountryMark iso3={iso3} />
        <OgRadar values={values} confidences={confidences} />
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', paddingTop: 28 }}>
          {top.map(({ dimension, score }) => (
            <div key={dimension} style={{ alignItems: 'baseline', borderBottom: '1px solid #525252', display: 'flex', justifyContent: 'space-between', padding: '11px 0' }}>
              <div style={{ fontSize: 22 }}>{DIMENSION_LABELS[dimension]}</div>
              <div style={{ color: '#d6f249', fontSize: 25 }}>{score.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  )
}
