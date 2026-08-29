import { ImageResponse } from 'next/og'
import { COUNTRIES, COUNTRY_NAMES, DIMENSION_LABELS, splitAgenda } from '@ncb/core'
import { OgAgendaBullet, OgCountryMark, OgFrame, OG_SIZE, loadOgFonts } from '@/components/Og'
import { loadAgenda } from '@/lib/agenda'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'National Capability Benchmark capability agenda'

export function generateStaticParams() {
  return COUNTRIES.map(({ iso3 }) => ({ iso3 }))
}

export default async function Image({ params }: { params: Promise<{ iso3: string }> }) {
  const { iso3: raw } = await params
  const iso3 = raw.toUpperCase()
  const agenda = await loadAgenda(iso3)
  const name = agenda?.country ?? COUNTRY_NAMES[iso3]
  if (!agenda || !name) return new Response('Not found', { status: 404 })

  const { raise, measure, hold } = splitAgenda(agenda)
  const items = [...raise, ...measure, ...hold].slice(0, 3)

  return new ImageResponse(
    <OgFrame eyebrow="Capability agenda" title={name}>
      <OgCountryMark iso3={iso3} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
        {items.map((item) => (
          <OgAgendaBullet
            key={item.dimension}
            kind={item.kind}
            dimension={DIMENSION_LABELS[item.dimension]}
            score={item.score}
          />
        ))}
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  )
}
