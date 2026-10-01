import { DIMENSIONS } from '../model/index.js'
import type { Dimension, ResidualStructure } from '../model/index.js'
import { incomePeers, MAP_PEER_COUNT } from './capability-map.js'
import {
  correlationMatrix,
  firstFactorChance,
  firstFactorShareOf,
  linearFit,
  mean,
  median,
  quantile,
  round,
  sampleSd,
  seededRandom,
  shuffled,
  spearman,
  symmetricEigen,
} from './stats.js'

/*
 * What is left of the nine dimension scores once income is taken out, tested
 * in aggregate. D137 found that the shared factor of the nine looks like
 * income. The strong claim, that capability is separate from wealth, fails
 * there; this file tests the weaker one, that countries at the same income
 * have different capability shapes.
 *
 * Every number returned is a statistic over countries. No country's residual
 * and no country's name leaves this file: per-country residuals stay offline
 * under D65, and residual.json is the only file that holds them. The reading
 * rules were fixed in D138 before the first run, and changing one is a new
 * decision, not an edit.
 */

/** A fit under this many countries is not published, and neither are its residuals. See D68. */
export const MIN_COUNTRIES_FOR_FIT = 20

/** Monte Carlo draws behind the two permutation nulls, and their seeds. See D138. */
export const RESIDUAL_NULL_DRAWS = 2000
export const RESIDUAL_STRUCTURE_SEED = 20261002
export const RESIDUAL_PEER_SEED = 20261003
export const RESIDUAL_INCOME_NULL_SEED = 20261004
/** A residual has to move by at least this many points for a release pair to test its dimension. */
export const RESIDUAL_MOVED_POINTS = 0.05
/** Spearman between consecutive releases: every minimum at or above `stable` is stable, any under `churning` churns. */
export const RESIDUAL_STABILITY_BANDS = { stable: 0.8, churning: 0.5 } as const
/** A dropped country's own residual moving by more than this many residual SDs makes the full-set fit fragile. See D68. */
export const RESIDUAL_LOO_FRAGILE_SD = 1
/** Mean share of a profile income accounts for: at or above `most`, most; at or above `part`, part. */
export const RESIDUAL_INCOME_SHARE_BANDS = { most: 0.5, part: 0.25 } as const

export type ScoreRows = Map<string, Partial<Record<Dimension, number | null>>>

type DimensionFit = {
  dimension: Dimension
  iso3: string[]
  slope: number
  slopeSe: number
  residualSd: number
  residuals: Map<string, number>
  /** Fitted score per country. */
  fitted: Map<string, number>
  maxSlopeShiftSe: number
  maxResidualShiftSd: number
}

/**
 * The D68 fit for one dimension, unrounded: OLS of the score on log10 GDP per
 * capita across every country scored on the dimension with an income figure.
 * Null under `MIN_COUNTRIES_FOR_FIT`.
 */
function fitDimension(dimension: Dimension, scores: ScoreRows, logGdp: Map<string, number>): DimensionFit | null {
  const iso3: string[] = []
  const xs: number[] = []
  const ys: number[] = []
  for (const [code, row] of [...scores.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const y = row[dimension]
    const x = logGdp.get(code)
    if (y === null || y === undefined || x === undefined) continue
    iso3.push(code)
    xs.push(x)
    ys.push(y)
  }
  if (iso3.length < MIN_COUNTRIES_FOR_FIT) return null
  const line = linearFit(xs, ys)
  if (!line) return null
  const residuals = new Map<string, number>()
  const fitted = new Map<string, number>()
  let maxSlopeShift = 0
  let maxResidualShift = 0
  const mx = mean(xs)
  const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0)
  iso3.forEach((code, i) => {
    const e = line.residuals[i] as number
    const h = line.leverage[i] as number
    residuals.set(code, e)
    fitted.set(code, (ys[i] as number) - e)
    /* Dropping point i moves the slope by (x_i - mean) e_i / ((1 - h_i) Sxx)
     * and its own residual from e_i to e_i / (1 - h_i): both closed form. */
    const slopeShift = Math.abs((((xs[i] as number) - mx) * e) / ((1 - h) * sxx))
    const residualShift = Math.abs((e * h) / (1 - h))
    if (slopeShift > maxSlopeShift) maxSlopeShift = slopeShift
    if (residualShift > maxResidualShift) maxResidualShift = residualShift
  })
  return {
    dimension,
    iso3,
    slope: line.slope,
    slopeSe: line.slopeSe,
    residualSd: line.residualSd,
    residuals,
    fitted,
    maxSlopeShiftSe: line.slopeSe > 0 ? maxSlopeShift / line.slopeSe : 0,
    maxResidualShiftSd: line.residualSd > 0 ? maxResidualShift / line.residualSd : 0,
  }
}

/** Every dimension's D68 fit, in registry order, skipping the ones that cannot be fitted. */
export function residualFits(scores: ScoreRows, logGdp: Map<string, number>): DimensionFit[] {
  return DIMENSIONS.flatMap((d) => {
    const f = fitDimension(d, scores, logGdp)
    return f ? [f] : []
  })
}

/** (a) The factor test of D137, run on the residual columns. */
function structureTest(
  columns: number[][],
  dimensions: Dimension[],
  draws: number,
): ResidualStructure['structure'] {
  const n = columns[0]?.length ?? 0
  const p = columns.length
  if (n < 4 || p < 2) return null
  const { values, vectors } = symmetricEigen(correlationMatrix(columns))
  const lambda = values[0] ?? 0
  const first = vectors[0] ?? []
  const sign = first.reduce((a, b) => a + b, 0) < 0 ? -1 : 1
  const share = lambda / p
  const chance = firstFactorChance(n - 1, p, { draws })

  const random = seededRandom(RESIDUAL_STRUCTURE_SEED)
  const shares: number[] = []
  for (let k = 0; k < draws; k++) shares.push(firstFactorShareOf(columns.map((c) => shuffled(c, random))))
  shares.sort((a, b) => a - b)

  return {
    countries: n,
    eigenvalues: values.map((v) => round(v, 3)),
    firstFactorShare: round(share, 3),
    loadings: dimensions.map((dimension, j) => ({
      dimension,
      loading: round((first[j] ?? 0) * sign * Math.sqrt(Math.max(lambda, 0)), 3),
    })),
    chance: { ...chance, mean: round(chance.mean, 3), p95: round(chance.p95, 3) },
    permutation: {
      draws,
      seed: RESIDUAL_STRUCTURE_SEED,
      mean: round(mean(shares), 3),
      p95: round(quantile(shares, 0.95), 3),
    },
    reading: share > chance.p95 ? 'structure' : 'none',
  }
}

/**
 * Mean squared distance between each country's shape and its peers' shapes,
 * per dimension. `z[j][i]` is standardised residual j of country i; a shape
 * is a country's values minus their own mean. Squared rather than root mean
 * square, so the average over random pairs is fixed by the spread of the
 * shapes and does not move with how many directions they vary in.
 */
function peerDistances(z: number[][], peerIndex: number[][]): number[] {
  const p = z.length
  const n = z[0]?.length ?? 0
  const shapes: number[][] = Array.from({ length: n }, (_, i) => {
    const row = z.map((col) => col[i] as number)
    const m = mean(row)
    return row.map((v) => v - m)
  })
  return peerIndex.map((peers, i) => {
    const a = shapes[i] as number[]
    let total = 0
    for (const j of peers) {
      const b = shapes[j] as number[]
      let s = 0
      for (let d = 0; d < p; d++) s += ((a[d] as number) - (b[d] as number)) ** 2
      total += s / p
    }
    return peers.length ? total / peers.length : 0
  })
}

function peerIndexFor(iso3: string[], logGdp: Map<string, number>, peerCount: number): number[][] {
  const income = iso3.map((code) => ({ iso3: code, gdpPerCapita: 10 ** (logGdp.get(code) as number), year: 0 }))
  const position = new Map(iso3.map((code, i) => [code, i]))
  return iso3.map((code) =>
    incomePeers(income, code, peerCount).peers.map((peer) => position.get(peer.iso3) as number),
  )
}

const summary = (xs: number[], draws: number, seed: number) => {
  const sorted = [...xs].sort((a, b) => a - b)
  return {
    draws,
    seed,
    mean: round(mean(sorted), 3),
    p5: round(quantile(sorted, 0.05), 3),
    p95: round(quantile(sorted, 0.95), 3),
  }
}

/** Each standardised residual column minus, row by row, that country's own mean: the shape columns. */
function shapeColumns(z: number[][]): number[][] {
  const n = z[0]?.length ?? 0
  const level = Array.from({ length: n }, (_, i) => mean(z.map((col) => col[i] as number)))
  return z.map((col) => col.map((v, i) => v - (level[i] as number)))
}

/**
 * (b) Same income, different shape. Three readings of the standardised
 * residuals, each against a null built from the data:
 *
 * - whether income peers share a shape: the mean squared distance between a
 *   country's shape and its peers' shapes, against the same figure with
 *   profiles kept whole and incomes dealt out at random (peers chosen without
 *   regard to income);
 * - whether shapes are organised at all: the first-factor share of the shape
 *   columns, against the same share with each residual column dealt out at
 *   random before the shapes are taken (no country-specific shape);
 * - descriptive only, the peer distance against that noise floor, and the
 *   share of countries whose peer distance clears their own noise 95th.
 */
function peerTest(
  columns: number[][],
  iso3: string[],
  logGdp: Map<string, number>,
  draws: number,
  peerCount: number,
): ResidualStructure['peers'] {
  const n = iso3.length
  if (n <= peerCount + 1 || columns.length < 2) return null
  const z = columns.map((col) => {
    const m = mean(col)
    const sd = sampleSd(col) || 1
    return col.map((v) => (v - m) / sd)
  })
  const peerIndex = peerIndexFor(iso3, logGdp, peerCount)
  const observed = peerDistances(z, peerIndex)
  const observedMean = mean(observed)
  const shapeShare = firstFactorShareOf(shapeColumns(z))

  const random = seededRandom(RESIDUAL_PEER_SEED)
  const noiseRuns: number[][] = []
  const noiseShapeShares: number[] = []
  for (let k = 0; k < draws; k++) {
    const dealt = z.map((c) => shuffled(c, random))
    noiseRuns.push(peerDistances(dealt, peerIndex))
    noiseShapeShares.push(firstFactorShareOf(shapeColumns(dealt)))
  }
  const noiseFloor = summary(noiseRuns.map((run) => mean(run)), draws, RESIDUAL_PEER_SEED)
  const shapeNull = summary(noiseShapeShares, draws, RESIDUAL_PEER_SEED)

  const incomeRandom = seededRandom(RESIDUAL_INCOME_NULL_SEED)
  const incomes = iso3.map((code) => logGdp.get(code) as number)
  const incomeMeans: number[] = []
  for (let k = 0; k < draws; k++) {
    const dealt = shuffled(incomes, incomeRandom)
    const fake = new Map(iso3.map((code, i) => [code, dealt[i] as number]))
    incomeMeans.push(mean(peerDistances(z, peerIndexFor(iso3, fake, peerCount))))
  }
  const incomeNull = summary(incomeMeans, draws, RESIDUAL_INCOME_NULL_SEED)

  /* Descriptive only: each country against its own noise floor. About one in
   * twenty clears its 95th percentile by construction. */
  const perCountryP95 = Array.from({ length: n }, (_, i) =>
    quantile(noiseRuns.map((run) => run[i] as number).sort((a, b) => a - b), 0.95),
  )
  const beyond = (run: number[]) =>
    run.reduce((a, d, i) => a + (d > (perCountryP95[i] as number) ? 1 : 0), 0) / n
  const nullShares = noiseRuns.map(beyond).sort((a, b) => a - b)

  /* The rule D138 fixed before the first run, on unrounded figures. */
  const incomeP5 = quantile([...incomeMeans].sort((a, b) => a - b), 0.05)
  const shapeP95 = quantile([...noiseShapeShares].sort((a, b) => a - b), 0.95)
  const reading = observedMean < incomeP5 ? 'alike' : shapeShare > shapeP95 ? 'differ' : 'noise'

  return {
    countries: n,
    peerCount,
    observedMean: round(observedMean, 3),
    incomeNull,
    shapeShare: round(shapeShare, 3),
    shapeNull,
    noiseFloor,
    shareBeyond: round(beyond(observed), 3),
    shareNull: { mean: round(mean(nullShares), 3), p95: round(quantile(nullShares, 0.95), 3) },
    reading,
  }
}

/** (d) The share of each profile's distance from the average profile its income line accounts for. */
function incomeShareTest(fits: DimensionFit[], iso3: string[], scores: ScoreRows): ResidualStructure['incomeShare'] {
  if (iso3.length < 3 || fits.length === 0) return null
  const means = fits.map((f) => mean(iso3.map((c) => scores.get(c)?.[f.dimension] as number)))
  let pooledRes = 0
  let pooledDev = 0
  const shares: number[] = []
  for (const code of iso3) {
    let res = 0
    let dev = 0
    fits.forEach((f, j) => {
      res += (f.residuals.get(code) as number) ** 2
      dev += ((scores.get(code)?.[f.dimension] as number) - (means[j] as number)) ** 2
    })
    pooledRes += res
    pooledDev += dev
    if (dev > 0) shares.push(1 - res / dev)
  }
  if (shares.length === 0 || pooledDev === 0) return null
  const m = mean(shares)
  return {
    countries: shares.length,
    mean: round(m, 3),
    median: round(median(shares), 3),
    pooled: round(1 - pooledRes / pooledDev, 3),
    reading:
      m >= RESIDUAL_INCOME_SHARE_BANDS.most ? 'most' : m >= RESIDUAL_INCOME_SHARE_BANDS.part ? 'part' : 'little',
  }
}

/** The weaker claim, read from (a), (b) and the release test of (c) by the rule D138 fixed in advance. */
export function weakClaimReading(
  structure: ResidualStructure['structure'],
  peers: ResidualStructure['peers'],
  releases: ResidualStructure['stability']['releases'],
): ResidualStructure['weakClaim'] {
  if (!peers) return null
  if (peers.reading === 'alike') return 'fails'
  if (peers.reading === 'noise' && structure?.reading === 'none') return 'fails'
  if (peers.reading === 'differ' && releases?.reading !== 'churning') return 'holds'
  return 'mixed'
}

/**
 * The four tests on one release. The release comparison in (c) needs git and
 * is filled in by `residualReleaseStability` from the CLI; here it is null.
 */
export function residualStructureFor(
  scores: ScoreRows,
  logGdp: Map<string, number>,
  { draws = RESIDUAL_NULL_DRAWS, peerCount = MAP_PEER_COUNT }: { draws?: number; peerCount?: number } = {},
): ResidualStructure {
  const fits = residualFits(scores, logGdp)
  const complete = [...scores.keys()]
    .filter((code) => fits.length === DIMENSIONS.length && fits.every((f) => f.residuals.has(code)))
    .sort()
  const dimensions = fits.map((f) => f.dimension)
  const columns = fits.map((f) => complete.map((code) => f.residuals.get(code) as number))

  const structure = complete.length ? structureTest(columns, dimensions, draws) : null
  const peers = complete.length ? peerTest(columns, complete, logGdp, draws, peerCount) : null
  return {
    completeCases: complete.length,
    excluded: scores.size - complete.length,
    structure,
    peers,
    stability: {
      releases: null,
      leaveOneOut: {
        perDimension: fits.map((f) => ({
          dimension: f.dimension,
          n: f.iso3.length,
          maxSlopeShiftSe: round(f.maxSlopeShiftSe, 3),
          maxResidualShiftSd: round(f.maxResidualShiftSd, 3),
        })),
        reading: fits.some((f) => f.maxResidualShiftSd > RESIDUAL_LOO_FRAGILE_SD) ? 'fragile' : 'robust',
      },
    },
    incomeShare: incomeShareTest(fits, complete, scores),
    weakClaim: weakClaimReading(structure, peers, null),
  }
}

/** One release as `bench diagnose` reads it from git: its scores and the income it read. */
export type ReleaseScores = { version: string; scores: ScoreRows; logGdp: Map<string, number> }

/**
 * (c) Rank stability of each dimension's residual order between consecutive
 * releases with the same country set. A pair tests a dimension only when one
 * of its residuals moved by `RESIDUAL_MOVED_POINTS` or more, so a release that
 * left a dimension untouched does not count as agreeing with itself.
 */
export function residualReleaseStability(
  releases: ReleaseScores[],
): NonNullable<ResidualStructure['stability']['releases']> {
  const fitsByRelease = releases.map((r) => ({
    version: r.version,
    countries: [...r.scores.keys()].sort().join(','),
    fits: new Map(residualFits(r.scores, r.logGdp).map((f) => [f.dimension, f])),
  }))
  const rhos = new Map<Dimension, Array<{ rho: number; n: number }>>(DIMENSIONS.map((d) => [d, []]))
  let pairs = 0
  for (let i = 1; i < fitsByRelease.length; i++) {
    const before = fitsByRelease[i - 1]!
    const after = fitsByRelease[i]!
    if (before.countries !== after.countries) continue
    pairs += 1
    for (const d of DIMENSIONS) {
      const a = before.fits.get(d)
      const b = after.fits.get(d)
      if (!a || !b) continue
      const common = [...a.residuals.keys()].filter((c) => b.residuals.has(c))
      const xs = common.map((c) => a.residuals.get(c) as number)
      const ys = common.map((c) => b.residuals.get(c) as number)
      const moved =
        common.length !== a.residuals.size ||
        common.length !== b.residuals.size ||
        xs.some((x, k) => Math.abs(x - (ys[k] as number)) >= RESIDUAL_MOVED_POINTS)
      if (!moved) continue
      const rho = spearman(xs, ys)
      if (rho !== null) rhos.get(d)!.push({ rho, n: common.length })
    }
  }
  const perDimension = DIMENSIONS.map((dimension) => {
    const list = rhos.get(dimension) ?? []
    if (!list.length) return { dimension, pairs: 0, mean: null, min: null, minCountries: null }
    const worst = list.reduce((a, b) => (b.rho < a.rho ? b : a))
    return {
      dimension,
      pairs: list.length,
      mean: round(mean(list.map((x) => x.rho)), 3),
      min: round(worst.rho, 3),
      minCountries: worst.n,
    }
  })
  const tested = perDimension.filter((d) => d.min !== null)
  const reading = !tested.length
    ? 'untested'
    : tested.some((d) => (d.min as number) < RESIDUAL_STABILITY_BANDS.churning)
      ? 'churning'
      : tested.every((d) => (d.min as number) >= RESIDUAL_STABILITY_BANDS.stable)
        ? 'stable'
        : 'mixed'
  return { versions: releases.map((r) => r.version), pairs, perDimension, reading }
}

/** Put the release comparison into a structure computed without it, and re-read the weaker claim. */
export function withReleaseStability(
  rs: ResidualStructure,
  releases: ResidualStructure['stability']['releases'],
): ResidualStructure {
  return {
    ...rs,
    stability: { ...rs.stability, releases },
    weakClaim: weakClaimReading(rs.structure, rs.peers, releases),
  }
}
