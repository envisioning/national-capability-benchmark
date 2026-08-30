import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import {
  DIMENSIONS,
  GDP_PER_CAPITA_CODE,
  IndexFile,
  ObservationFile,
  ResidualFile as ResidualFileSchema,
} from '../model/index.js'
import type {
  CountryResult,
  Dimension,
  Observation,
  ResidualCell,
  ResidualFit,
  ResidualFile as ResidualFileType,
} from '../model/index.js'
import { logGdpByCountry } from './diagnostics.js'
import { mean, pearson, rank, round } from './stats.js'
import { FILES } from './paths.js'

export const RESIDUAL_METHOD_VERSION = 'residual/0.1-exploratory' as const

/**
 * Bands on r², the share of a dimension's variation the income line explains.
 * They are fixed, not fitted, for the same reason the matrix ramp is fixed in
 * D58: a band that moves with the data cannot be compared across runs.
 */
export const RESIDUAL_FIT_BANDS = { strong: 0.5, moderate: 0.25 } as const

/** A fit under this many countries is not published, and neither are its residuals. */
export const MIN_COUNTRIES_FOR_FIT = 20

type Pair = { iso3: string; score: number; logGdp: number }

function fitStrength(rSquared: number): ResidualFit['fitStrength'] {
  if (rSquared >= RESIDUAL_FIT_BANDS.strong) return 'strong'
  if (rSquared >= RESIDUAL_FIT_BANDS.moderate) return 'moderate'
  return 'weak'
}

function pairsFor(
  countries: CountryResult[],
  logGdp: Map<string, number>,
  dimension: Dimension,
): Pair[] {
  const out: Pair[] = []
  for (const country of countries) {
    const score = country.dimensions[dimension]?.score
    const x = logGdp.get(country.iso3)
    if (score === null || score === undefined || x === undefined) continue
    out.push({ iso3: country.iso3, score, logGdp: x })
  }
  return out
}

/**
 * Ordinary least squares of dimension score on log10 GDP per capita, across
 * every country scored on that dimension.
 *
 * The country being read helped fit the line it is measured against, so an
 * outlier pulls the line toward itself and understates its own residual. A
 * leave-one-out fit is the candidate fix and it is not in 0.1.
 */
function fitDimension(
  dimension: Dimension,
  pairs: Pair[],
): { fit: ResidualFit; cells: Map<string, ResidualCell> } | null {
  if (pairs.length < MIN_COUNTRIES_FOR_FIT) return null
  const xs = pairs.map((p) => p.logGdp)
  const ys = pairs.map((p) => p.score)
  const mx = mean(xs)
  const my = mean(ys)
  let sxy = 0
  let sxx = 0
  for (let i = 0; i < pairs.length; i++) {
    const dx = (xs[i] as number) - mx
    sxy += dx * ((ys[i] as number) - my)
    sxx += dx * dx
  }
  if (sxx === 0) return null
  const slope = sxy / sxx
  const intercept = my - slope * mx

  const residuals = pairs.map((p) => p.score - (intercept + slope * p.logGdp))
  const r = pearson(xs, ys)
  if (r === null) return null

  /* Standard error of the estimate: the spread a reader compares a gap against. */
  const sumSquares = residuals.reduce((a, e) => a + e * e, 0)
  const residualSd = Math.sqrt(sumSquares / Math.max(pairs.length - 2, 1))

  /* How far the income line actually moves the order. When this is small the
   * residual re-states the score and ranks countries the same way. */
  const scoreRanks = rank(ys)
  const residualRanks = rank(residuals)
  const meanAbsRankShift = mean(
    scoreRanks.map((v, i) => Math.abs(v - (residualRanks[i] as number))),
  )

  const cells = new Map<string, ResidualCell>()
  pairs.forEach((p, i) => {
    const predicted = intercept + slope * p.logGdp
    cells.set(p.iso3, {
      score: round(p.score, 1),
      predicted: round(predicted, 1),
      residual: round(residuals[i] as number, 1),
      outOfScale: predicted < 0 || predicted > 100,
    })
  })

  return {
    fit: {
      dimension,
      slope: round(slope, 2),
      intercept: round(intercept, 2),
      pearson: round(r, 3),
      rSquared: round(r * r, 3),
      n: pairs.length,
      residualSd: round(residualSd, 2),
      fitStrength: fitStrength(r * r),
      meanAbsRankShift: round(meanAbsRankShift, 1),
    },
    cells,
  }
}

/**
 * The distance between a country's dimension score and the score its income
 * predicts, one number per dimension and never one number per country. See D68.
 */
export function buildResidual(
  countries: CountryResult[],
  observations: Observation[],
  generatedAt = new Date().toISOString(),
): ResidualFileType {
  const logGdp = logGdpByCountry(observations, GDP_PER_CAPITA_CODE)

  const fits: ResidualFit[] = []
  const byDimension = new Map<Dimension, Map<string, ResidualCell>>()
  for (const dimension of DIMENSIONS) {
    const fitted = fitDimension(dimension, pairsFor(countries, logGdp, dimension))
    if (!fitted) continue
    fits.push(fitted.fit)
    byDimension.set(dimension, fitted.cells)
  }

  const cellsFor = (iso3: string): Record<Dimension, ResidualCell | null> =>
    Object.fromEntries(
      DIMENSIONS.map((dimension) => [dimension, byDimension.get(dimension)?.get(iso3) ?? null]),
    ) as Record<Dimension, ResidualCell | null>

  return ResidualFileSchema.parse({
    generatedAt,
    methodVersion: RESIDUAL_METHOD_VERSION,
    gdpSeries: GDP_PER_CAPITA_CODE,
    fits,
    countries: Object.fromEntries(countries.map((c) => [c.iso3, cellsFor(c.iso3)])),
    exclusions: countries
      .filter((c) => !logGdp.has(c.iso3))
      .map((c) => ({
        iso3: c.iso3,
        reason: 'no GDP per capita observation, so no residual on any dimension',
      })),
  })
}

/** Read the published index and the observations, and write the provisional fixture. */
export async function writeResidual(
  generatedAt = new Date().toISOString(),
): Promise<ResidualFileType> {
  const index = IndexFile.safeParse(JSON.parse(await readFile(FILES.index, 'utf8')))
  if (!index.success) throw new Error(`Invalid index output: ${FILES.index}`)
  const observations = ObservationFile.safeParse(
    JSON.parse(await readFile(FILES.worldBank, 'utf8')),
  )
  if (!observations.success) throw new Error(`Invalid observation file: ${FILES.worldBank}`)

  const output = buildResidual(
    index.data.countries,
    observations.data.observations,
    generatedAt,
  )
  await mkdir(dirname(FILES.residual), { recursive: true })
  await writeFile(FILES.residual, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  return output
}
