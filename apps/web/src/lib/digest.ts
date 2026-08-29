import type { CountryResult, Dimension } from '@ncb/core'
import { DIMENSIONS } from '@ncb/core'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const FIRST_WEEK = Date.UTC(1970, 0, 5)

export type DigestDimension = {
  dimension: Dimension
  score: number
  average: number
  delta: number
}
/** Parse the public digest date without allowing JavaScript to normalize it. */
export function parseDigestDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date
}

/** Pick a stable country by the Monday-based week containing the digest date. */
export function countryForDigest(date: Date, countries: CountryResult[]): CountryResult | null {
  if (countries.length === 0) return null
  const monday = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const day = new Date(monday).getUTCDay()
  const mondayOffset = day === 0 ? 6 : day - 1
  const week = Math.floor((monday - mondayOffset * 24 * 60 * 60 * 1000 - FIRST_WEEK) / WEEK_MS)
  const index = ((week % countries.length) + countries.length) % countries.length
  return countries.slice().sort((a, b) => a.iso3.localeCompare(b.iso3))[index] ?? null
}

/** Compare every scored dimension with the current frame average. */
export function digestDimensions(
  country: CountryResult,
  countries: CountryResult[],
): DigestDimension[] {
  return DIMENSIONS.flatMap((dimension) => {
    const score = country.dimensions[dimension]?.score
    if (score === null || score === undefined) return []
    const values = countries
      .map((candidate) => candidate.dimensions[dimension]?.score)
      .filter((value): value is number => value !== null && value !== undefined)
    if (values.length === 0) return []
    const average = values.reduce((sum, value) => sum + value, 0) / values.length
    return [{ dimension, score, average, delta: score - average }]
  })
}
