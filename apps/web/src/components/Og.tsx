import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { ReactNode } from 'react'
import { COUNTRY_ISO2, DIMENSIONS } from '@ncb/core'
import { radarAngle, radarPoint, measuredRadarPoints, type RadarGeometry } from './radarGeometry'

export const OG_SIZE = { width: 1200, height: 630 } as const

const COLORS = {
  background: '#202333',
  surface: '#313650',
  foreground: '#fafafa',
  muted: '#b8bdd9',
  accent: '#d6f249',
  rule: '#525252',
} as const

const OG_RADAR: RadarGeometry = { size: 430, radius: 172 }

/**
 * The server-only geometry entry point for OG cards.
 *
 * The confidence argument is part of the contract so callers pass the same
 * profile they give the interactive radar. Confidence changes the line style
 * in the viewer, never the score's position, so this pure path helper keeps
 * the geometry identical without inventing a second confidence treatment.
 */
export function radarToSvgPath(
  values: readonly (number | null)[],
  confidences: readonly (number | null)[] = [],
  options: RadarGeometry = OG_RADAR,
): string {
  void confidences
  const points = measuredRadarPoints(values, options)
  return points.length < 2 ? '' : `M ${points.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`
}

export async function loadOgFonts() {
  /* Satori's bundled font parser accepts TTF but not the WOFF2 web fonts used
   * by the page. Reuse the Latin font shipped inside Next so build-time image
   * generation stays dependency-free and works on Vercel as well as locally. */
  const font = await readFile(
    resolve(
      process.cwd(),
      'node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf',
    ),
  )
  return [
    { name: 'Inter', data: font, weight: 400 as const, style: 'normal' as const },
    { name: 'Octa', data: font, weight: 500 as const, style: 'normal' as const },
  ]
}

export function OgFrame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 64px 42px',
        background: COLORS.background,
        color: COLORS.foreground,
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: COLORS.accent,
              fontFamily: 'Octa',
              fontSize: 48,
              lineHeight: 0.9,
              fontWeight: 500,
            }}
          >
            NCB
          </div>
          <div style={{ color: COLORS.muted, display: 'flex', fontSize: 12, letterSpacing: 1.2, marginTop: 10 }}>
            NATIONAL CAPABILITY BENCHMARK
          </div>
        </div>
        <div style={{ color: COLORS.muted, display: 'flex', fontSize: 20 }}>Envisioning</div>
      </div>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: COLORS.accent, display: 'flex', fontSize: 18, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', fontFamily: 'Octa', fontSize: 54, fontWeight: 300, lineHeight: 1.05, marginTop: 14 }}>
          {title}
        </div>
        {children}
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.rule}`, color: COLORS.muted, display: 'flex', fontSize: 16, paddingTop: 16 }}>
        Nine capabilities from public data, each with the confidence behind it
      </div>
    </div>
  )
}

export function OgCountryMark({ iso3 }: { iso3: string }) {
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 16, marginTop: 20 }}>
      <div
        style={{
          alignItems: 'center',
          background: COLORS.accent,
          color: COLORS.background,
          display: 'flex',
          fontSize: 25,
          fontWeight: 700,
          height: 58,
          justifyContent: 'center',
          letterSpacing: 1,
          width: 84,
        }}
      >
        {COUNTRY_ISO2[iso3] ?? iso3}
      </div>
      <div style={{ color: COLORS.muted, display: 'flex', fontSize: 22, letterSpacing: 2 }}>{iso3}</div>
    </div>
  )
}

export function OgRadar({
  values,
  confidences,
}: {
  values: readonly (number | null)[]
  confidences?: readonly (number | null)[]
}) {
  const center = OG_RADAR.size / 2
  const rings = [25, 50, 75, 100]
  const path = radarToSvgPath(values, confidences, OG_RADAR)

  return (
    <svg width={OG_RADAR.size} height={OG_RADAR.size} viewBox={`0 0 ${OG_RADAR.size} ${OG_RADAR.size}`}>
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={Array.from({ length: DIMENSIONS.length }, (_, index) => radarPoint(index, ring, OG_RADAR).join(',')).join(' ')}
          fill="none"
          stroke={COLORS.rule}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: DIMENSIONS.length }, (_, index) => {
        const [x, y] = radarPoint(index, 100, OG_RADAR)
        return <line key={index} x1={center} y1={center} x2={x} y2={y} stroke={COLORS.rule} strokeWidth={1} />
      })}
      {path ? <path d={path} fill={COLORS.accent} fillOpacity={0.34} stroke={COLORS.accent} strokeWidth={4} /> : null}
      {measuredRadarPoints(values, OG_RADAR).map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={6} fill={COLORS.accent} />
      ))}
    </svg>
  )
}

export function OgDistribution({
  values,
  focal,
}: {
  values: Array<{ country: string; score: number }>
  focal: { country: string; score: number } | null
}) {
  const width = 820
  const left = 32
  const right = width - 32
  const xFor = (score: number) => left + ((right - left) * score) / 100
  const focalX = focal ? xFor(focal.score) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width }}>
      {focal ? (
        <div style={{ color: COLORS.accent, display: 'flex', fontSize: 18, justifyContent: 'center' }}>
          {focal.country} pinned at {focal.score.toFixed(1)}
        </div>
      ) : null}
      <svg width={width} height={142} viewBox={`0 0 ${width} 142`}>
        <line x1={left} y1={86} x2={right} y2={86} stroke={COLORS.rule} strokeWidth={2} />
        {values.map((value, index) => (
          <circle
            key={`${value.country}-${index}`}
            cx={xFor(value.score)}
            cy={70 + (index % 4) * 11}
            r={4}
            fill={focal?.country === value.country ? COLORS.accent : COLORS.muted}
          />
        ))}
        {focal && focalX !== null ? (
          <line x1={focalX} y1={12} x2={focalX} y2={98} stroke={COLORS.accent} strokeWidth={3} />
        ) : null}
      </svg>
      <div style={{ color: COLORS.muted, display: 'flex', fontSize: 16, justifyContent: 'space-between', padding: `0 ${left}px` }}>
        {[0, 25, 50, 75, 100].map((tick) => (
          <div key={tick} style={{ display: 'flex' }}>{tick}</div>
        ))}
      </div>
    </div>
  )
}

export function OgAgendaBullet({
  kind,
  dimension,
  score,
}: {
  kind: string
  dimension: string
  score: number | null
}) {
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 18, marginTop: 14 }}>
      <div style={{ background: COLORS.accent, color: COLORS.background, display: 'flex', fontSize: 14, fontWeight: 700, padding: '6px 10px', textTransform: 'uppercase' }}>
        {kind}
      </div>
      <div style={{ display: 'flex', fontSize: 25 }}>{dimension}</div>
      <div style={{ color: COLORS.muted, display: 'flex', fontSize: 22, marginLeft: 'auto' }}>
        {score === null ? 'not scored' : score.toFixed(1)}
      </div>
    </div>
  )
}

export { COLORS }
