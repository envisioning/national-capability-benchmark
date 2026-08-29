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
  return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)]
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
