import { DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import type { Dimension } from '@ncb/core'

export type RadarSeries = {
  label: string
  values: Array<number | null>
  color: string
}

const SIZE = 260
const CENTER = SIZE / 2
const RADIUS = SIZE / 2 - 46

function point(index: number, value: number): [number, number] {
  const angle = (index / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2
  const r = (value / 100) * RADIUS
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

/**
 * Dependency-free radar. Nine axes, one per dimension, in the fixed dimension
 * order so two charts can be read against each other.
 */
export function Radar({ series, showLabels = true }: { series: RadarSeries[]; showLabels?: boolean }) {
  const rings = [25, 50, 75, 100]

  return (
    <svg viewBox={`-26 0 ${SIZE + 52} ${SIZE}`} className="h-auto w-full" role="img">
      {rings.map((r) => (
        <polygon
          key={r}
          points={DIMENSIONS.map((_, i) => point(i, r).join(',')).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeOpacity={r === 100 ? 0.28 : 0.12}
          strokeWidth={0.75}
        />
      ))}
      {DIMENSIONS.map((_, i) => {
        const [x, y] = point(i, 100)
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={0.75}
          />
        )
      })}

      {series.map((s) => {
        const pts = DIMENSIONS.map((_, i) => point(i, s.values[i] ?? 0).join(',')).join(' ')
        return (
          <g key={s.label}>
            <polygon points={pts} fill={s.color} fillOpacity={0.28} stroke={s.color} strokeWidth={1.6} />
            {DIMENSIONS.map((_, i) => {
              const v = s.values[i]
              if (v === null || v === undefined) return null
              const [x, y] = point(i, v)
              return <circle key={i} cx={x} cy={y} r={2} fill={s.color} />
            })}
          </g>
        )
      })}

      {showLabels &&
        DIMENSIONS.map((d, i) => {
          const [x, y] = point(i, 122)
          const anchor = x < CENTER - 4 ? 'end' : x > CENTER + 4 ? 'start' : 'middle'
          return (
            <text
              key={d}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={7}
              fill="currentColor"
              fillOpacity={0.65}
            >
              {shortLabel(d)}
            </text>
          )
        })}
    </svg>
  )
}

function shortLabel(d: Dimension): string {
  return d === 'building' ? 'Building' : d === 'shared_purpose' ? 'Shared purpose' : DIMENSION_LABELS[d]
}
