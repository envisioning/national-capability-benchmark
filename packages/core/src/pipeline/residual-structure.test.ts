/*
 * The aggregate residual tests of D138. Each one has to be able to fail, so
 * each is checked on synthetic data where the answer is known: residuals that
 * are pure noise around income must read as no structure, a planted
 * country-specific shape must be found, and a shape that income itself
 * dictates must read as alike.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { DIMENSIONS } from '../model/index.js'
import type { Dimension } from '../model/index.js'
import {
  residualFits,
  residualReleaseStability,
  residualStructureFor,
  weakClaimReading,
  withReleaseStability,
} from './residual-structure.js'
import type { ScoreRows } from './residual-structure.js'
import { gaussian, linearFit, seededRandom } from './stats.js'

const close = (a: number, b: number, eps = 1e-9) =>
  assert.ok(Math.abs(a - b) < eps, `${a} is not within ${eps} of ${b}`)

const DRAWS = 500

/** n synthetic countries, income spread evenly on the log scale, scores from `cell`. */
function synthetic(
  n: number,
  seed: number,
  cell: (ctx: { i: number; x: number; d: number; latent: number; random: () => number }) => number,
): { scores: ScoreRows; logGdp: Map<string, number> } {
  const random = seededRandom(seed)
  const scores: ScoreRows = new Map()
  const logGdp = new Map<string, number>()
  for (let i = 0; i < n; i++) {
    const iso3 = `C${String(i).padStart(2, '0')}`
    const x = 3 + (2 * i) / (n - 1)
    const latent = gaussian(random)
    logGdp.set(iso3, x)
    scores.set(
      iso3,
      Object.fromEntries(DIMENSIONS.map((dim, d) => [dim, cell({ i, x, d, latent, random })])) as Record<
        Dimension,
        number
      >,
    )
  }
  return { scores, logGdp }
}

test('linearFit recovers a known line and its leave-one-out residual in closed form', () => {
  const xs = [1, 2, 3, 4, 5, 6]
  const ys = [2.1, 3.9, 6.2, 7.8, 10.1, 30]
  const line = linearFit(xs, ys)!
  /* Drop the last point by hand and refit. */
  const without = linearFit(xs.slice(0, 5), ys.slice(0, 5))!
  const deleted = (ys[5] as number) - (without.intercept + without.slope * (xs[5] as number))
  const e = line.residuals[5] as number
  const h = line.leverage[5] as number
  close(e / (1 - h), deleted, 1e-9)
  close(line.leverage.reduce((a, b) => a + b, 0), 2, 1e-12)
})

test('the leave-one-out shifts match a brute-force refit', () => {
  const { scores, logGdp } = synthetic(30, 7, ({ x, random }) => 10 + 12 * x + 6 * gaussian(random))
  const fit = residualFits(scores, logGdp)[0]!
  const codes = fit.iso3
  let maxSlope = 0
  let maxOwn = 0
  for (const drop of codes) {
    const keep = codes.filter((c) => c !== drop)
    const xs = keep.map((c) => logGdp.get(c) as number)
    const ys = keep.map((c) => scores.get(c)?.[fit.dimension] as number)
    const line = linearFit(xs, ys)!
    maxSlope = Math.max(maxSlope, Math.abs(line.slope - fit.slope))
    const x = logGdp.get(drop) as number
    const own = (scores.get(drop)?.[fit.dimension] as number) - (line.intercept + line.slope * x)
    maxOwn = Math.max(maxOwn, Math.abs(own - (fit.residuals.get(drop) as number)))
  }
  close(fit.maxSlopeShiftSe, maxSlope / fit.slopeSe, 1e-9)
  close(fit.maxResidualShiftSd, maxOwn / fit.residualSd, 1e-9)
})

test('pure noise around income reads as no structure, peers as noise, and the weaker claim fails', () => {
  const { scores, logGdp } = synthetic(50, 11, ({ x, d, random }) => 5 + (8 + d) * x + 9 * gaussian(random))
  const rs = residualStructureFor(scores, logGdp, { draws: DRAWS })
  assert.equal(rs.completeCases, 50)
  assert.equal(rs.structure?.reading, 'none')
  assert.equal(rs.peers?.reading, 'noise')
  assert.equal(rs.weakClaim, 'fails')
  /* The noise is most of each profile, so income accounts for little of it. */
  assert.ok((rs.incomeShare?.mean ?? 1) < 0.5)
  /* Nothing in the shape names a country or carries a residual of one. */
  assert.doesNotMatch(JSON.stringify(rs), /C\d\d/)
})

test('a planted country-specific shape is found by both (a) and (b)', () => {
  /* Each country leans one way on the first four dimensions and the other on
   * the last five, by its own amount, independent of its income. */
  const { scores, logGdp } = synthetic(50, 12, ({ x, d, latent, random }) =>
    5 + 10 * x + (d < 4 ? 8 : -8) * latent + 3 * gaussian(random),
  )
  const rs = residualStructureFor(scores, logGdp, { draws: DRAWS })
  assert.equal(rs.structure?.reading, 'structure')
  assert.ok((rs.structure?.firstFactorShare ?? 0) > (rs.structure?.permutation.p95 ?? 1))
  assert.equal(rs.peers?.reading, 'differ')
  assert.equal(rs.weakClaim, 'holds')
})

test('a level shared across all nine is structure in (a) but no shape in (b), so the claim is mixed', () => {
  /* Each country sits above or below its income line by the same amount on
   * every dimension: what is left after income is a level, not a shape. */
  const { scores, logGdp } = synthetic(50, 17, ({ x, latent, random }) =>
    5 + 10 * x + 8 * latent + 4 * gaussian(random),
  )
  const rs = residualStructureFor(scores, logGdp, { draws: DRAWS })
  assert.equal(rs.structure?.reading, 'structure')
  assert.equal(rs.peers?.reading, 'noise')
  assert.equal(rs.weakClaim, 'mixed')
})

test('a shape that income dictates reads as alike, and the weaker claim fails', () => {
  /* The pattern across the nine flips with income in a way a straight line
   * cannot remove, so neighbours in income share it. */
  const { scores, logGdp } = synthetic(50, 13, ({ x, d, random }) =>
    5 + 10 * x + 10 * Math.sin(6 * x) * (d % 2 === 0 ? 1 : -1) + 1 * gaussian(random),
  )
  const rs = residualStructureFor(scores, logGdp, { draws: DRAWS })
  assert.equal(rs.peers?.reading, 'alike')
  assert.equal(rs.weakClaim, 'fails')
})

test('scores that are income alone leave a profile that is mostly income', () => {
  const { scores, logGdp } = synthetic(40, 14, ({ x, d, random }) => (5 + d) * 3 * x + 0.5 * gaussian(random))
  const rs = residualStructureFor(scores, logGdp, { draws: 100 })
  assert.equal(rs.incomeShare?.reading, 'most')
  assert.ok((rs.incomeShare?.pooled ?? 0) > 0.9)
})

test('the release test: untouched releases are untested, small moves stable, a reshuffle churns', () => {
  const base = synthetic(40, 15, ({ x, random }) => 10 * x + 10 * gaussian(random))
  const nudged = synthetic(40, 15, ({ x, random }) => 10 * x + 10 * gaussian(random) + 0.3)
  /* A small independent wobble on top of the same scores. */
  const wobble = seededRandom(99)
  for (const row of nudged.scores.values()) for (const d of DIMENSIONS) row[d] = (row[d] as number) + gaussian(wobble)
  const reshuffled = synthetic(40, 16, ({ x, random }) => 10 * x + 10 * gaussian(random))

  const same = residualReleaseStability([
    { version: '1.0.0', ...base },
    { version: '1.1.0', ...base },
  ])
  assert.equal(same.pairs, 1)
  assert.equal(same.reading, 'untested')

  const stable = residualReleaseStability([
    { version: '1.0.0', ...base },
    { version: '1.1.0', ...nudged },
  ])
  assert.equal(stable.reading, 'stable')

  const churn = residualReleaseStability([
    { version: '1.0.0', ...base },
    { version: '1.1.0', ...reshuffled },
  ])
  assert.equal(churn.reading, 'churning')

  /* A different country set is a rebase and is never compared. */
  const fewer = new Map([...base.scores.entries()].slice(1))
  const rebased = residualReleaseStability([
    { version: '1.0.0', ...base },
    { version: '2.0.0', scores: fewer, logGdp: base.logGdp },
  ])
  assert.equal(rebased.pairs, 0)
  assert.equal(rebased.reading, 'untested')
})

test('churning keeps a weaker claim that would otherwise hold at mixed', () => {
  const { scores, logGdp } = synthetic(50, 12, ({ x, d, latent, random }) =>
    5 + 10 * x + (d < 4 ? 8 : -8) * latent + 3 * gaussian(random),
  )
  const rs = residualStructureFor(scores, logGdp, { draws: 200 })
  assert.equal(rs.weakClaim, 'holds')
  const churned = withReleaseStability(rs, {
    versions: ['1.0.0', '1.1.0'],
    pairs: 1,
    perDimension: [],
    reading: 'churning',
  })
  assert.equal(churned.weakClaim, 'mixed')
  assert.equal(weakClaimReading(rs.structure, null, null), null)
})
