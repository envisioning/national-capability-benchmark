import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import {
  COUNTRIES,
  COUNTRY_ISO3,
  CountryFile,
  DIMENSIONS,
  VelocityCell as VelocityCellSchema,
  VelocityFile,
} from '../model/index.js'
import type {
  CountryResult,
  Dimension,
  VelocityCell,
  VelocityFile as VelocityFileType,
} from '../model/index.js'
import { FILES, countryFile } from './paths.js'

export const VELOCITY_METHOD_VERSION = 'velocity/0.1-exploratory' as const

/** A country-level readout is withheld when fewer than two thirds of its
 * dimensions have a complete five-year series. Individual cells remain in the
 * fixture so the missing coverage is visible to reviewers. */
export const MIN_SUPPORTED_DIMENSIONS = 6
export const MIN_YEARS_FOR_VELOCITY = 3

type ScorePoint = { year: number; score: number }
type DimensionResult = NonNullable<CountryResult['dimensions'][Dimension]>

function signed(value: number): string {
  const safe = Math.abs(value) < 0.0005 ? 0 : value
  return `${safe >= 0 ? '+' : ''}${safe.toFixed(1)}`
}

/** The exploratory rate, expressed in five-point score units. */
export function velocityRate(baseScore: number, currentScore: number): number {
  return (currentScore - baseScore) / Math.max(baseScore * 0.05, 5)
}

function uniqueSeries(series: ScorePoint[]): ScorePoint[] {
  const byYear = new Map<number, ScorePoint>()
  for (const point of series) {
    if (Number.isFinite(point.year) && Number.isFinite(point.score)) {
      byYear.set(point.year, point)
    }
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year)
}

function primarySeries(dimension: DimensionResult): ScorePoint[] {
  const momentum = [...dimension.momentum]
    .filter((candidate) => candidate.series.length >= MIN_YEARS_FOR_VELOCITY)
    .sort((a, b) => {
      const span = a.currentYear - a.baseYear - (b.currentYear - b.baseYear)
      return span || b.series.length - a.series.length
    })[0]
  return momentum ? uniqueSeries(momentum.series) : []
}

function dimensionVelocity(
  dimension: DimensionResult,
): VelocityCell | null {
  const series = primarySeries(dimension)
  if (series.length < MIN_YEARS_FOR_VELOCITY) return null

  const annual: Array<{ year: number; value: number }> = []
  for (let i = 1; i < series.length; i++) {
    const base = series[i - 1] as ScorePoint
    const current = series[i] as ScorePoint
    if (current.year !== base.year + 1) continue
    annual.push({ year: current.year, value: velocityRate(base.score, current.score) })
  }
  const latest = annual.at(-1)
  if (!latest) return null

  const latestPoint = series.at(-1) as ScorePoint
  const fiveYearBase = series.find((point) => point.year === latestPoint.year - 5)
  const fiveYear = fiveYearBase
    ? velocityRate(fiveYearBase.score, latestPoint.score)
    : null
  return VelocityCellSchema.parse({
    latestYear: latest.year,
    [`v${latest.year}`]: signed(latest.value),
    v5y: fiveYear === null ? null : signed(fiveYear),
    series: annual.map((point) => ({ year: point.year, value: Number(point.value.toFixed(3)) })),
  })
}

function countryVelocity(country: CountryResult): Record<Dimension, VelocityCell | null> {
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const result = country.dimensions[dimension]
      return [dimension, result ? dimensionVelocity(result) : null]
    }),
  ) as Record<Dimension, VelocityCell | null>
}

function exclusionFor(
  iso3: string,
  dimensions: Record<Dimension, VelocityCell | null>,
): { iso3: string; reason: string } | null {
  const supported = DIMENSIONS.filter((dimension) => {
    const cell = dimensions[dimension]
    return cell !== null && cell !== undefined && cell.v5y !== null
  }).length
  const years = new Set(
    DIMENSIONS.flatMap((dimension) =>
      (dimensions[dimension]?.series ?? []).map((point) => point.year),
    ),
  )
  if (years.size < MIN_YEARS_FOR_VELOCITY) {
    return {
      iso3,
      reason: `fewer than ${MIN_YEARS_FOR_VELOCITY} years of consecutive momentum data`,
    }
  }
  if (supported < MIN_SUPPORTED_DIMENSIONS) {
    return {
      iso3,
      reason: `only ${supported} of ${DIMENSIONS.length} dimensions have a complete five-year series`,
    }
  }
  return null
}

export function buildVelocity(
  countries: CountryResult[],
  generatedAt = new Date().toISOString(),
): VelocityFileType {
  const output = {
    generatedAt,
    methodVersion: VELOCITY_METHOD_VERSION,
    countries: Object.fromEntries(
      countries.map((country) => [country.iso3, countryVelocity(country)]),
    ),
    exclusions: countries
      .map((country) => {
        const dimensions = countryVelocity(country)
        return exclusionFor(country.iso3, dimensions)
      })
      .filter((entry): entry is { iso3: string; reason: string } => entry !== null),
  }
  return VelocityFile.parse(output)
}

async function loadCountry(iso3: string): Promise<CountryResult> {
  const path = countryFile(iso3)
  const parsed = CountryFile.safeParse(JSON.parse(await readFile(path, 'utf8')))
  if (!parsed.success) {
    throw new Error(`Invalid country output for ${iso3}: ${path}`)
  }
  return parsed.data.country
}

/** Read every published country file and write the provisional fixture. */
export async function writeVelocity(
  generatedAt = new Date().toISOString(),
): Promise<VelocityFileType> {
  const countries = await Promise.all(COUNTRY_ISO3.map((iso3) => loadCountry(iso3)))
  if (countries.length !== COUNTRIES.length) {
    throw new Error(`Expected ${COUNTRIES.length} country files, found ${countries.length}`)
  }
  const output = buildVelocity(countries, generatedAt)
  await mkdir(dirname(FILES.velocity), { recursive: true })
  await writeFile(FILES.velocity, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  return output
}
