import { DIMENSIONS } from '@ncb/core'

export type RadarGeometry = {
  size: number
  radius: number
}

/** The angle shared by the interactive radar and the static OG cards. */
export function radarAngle(index: number): number {
  return (index / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2
}

/** A point on one of the benchmark's fixed, nine-axis radar geometries. */
export function radarPoint(index: number, value: number, geometry: RadarGeometry): [number, number] {
  const center = geometry.size / 2
  const angle = radarAngle(index)
  const radius = (value / 100) * geometry.radius
  return [snap(center + radius * Math.cos(angle)), snap(center + radius * Math.sin(angle))]
}

/**
 * A coordinate rounded to a thousandth of a unit. Node and the browser can
 * disagree in the last bits of `Math.cos`, and a server-rendered path that
 * differs from the client's by one ulp is a hydration mismatch. A thousandth
 * of a 260 unit field is far below a pixel.
 */
export function snap(n: number): number {
  return Math.round(n * 1000) / 1000
}

/** The measured vertices in their canonical axis order. Missing axes stay empty. */
export function measuredRadarPoints(
  values: readonly (number | null)[],
  geometry: RadarGeometry,
): Array<[number, number]> {
  return values.flatMap((value, index) =>
    value === null || value === undefined ? [] : [radarPoint(index, value, geometry)],
  )
}
