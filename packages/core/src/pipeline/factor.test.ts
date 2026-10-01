/*
 * The factor test reads three helpers: the symmetric eigen solver, the chance
 * level and the complete-case solution built on both. The solver is checked
 * on matrices whose eigenvalues are known in closed form, and the chance level
 * on repeating itself under one seed. See D137.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { DIMENSIONS } from '../model/index.js'
import type { Dimension } from '../model/index.js'
import { factorSolution, factorStructureFor } from './diagnostics.js'
import { correlationMatrix, firstFactorChance, gaussian, seededRandom, symmetricEigen } from './stats.js'

const close = (a: number, b: number, eps = 1e-9) =>
  assert.ok(Math.abs(a - b) < eps, `${a} is not within ${eps} of ${b}`)

test('a 2 by 2 matrix has the textbook eigenvalues', () => {
  const { values, vectors } = symmetricEigen([
    [2, 1],
    [1, 2],
  ])
  close(values[0] as number, 3)
  close(values[1] as number, 1)
  const v = vectors[0] as number[]
  close(Math.abs(v[0] as number), Math.SQRT1_2)
  close(Math.abs(v[1] as number), Math.SQRT1_2)
})

test('an equicorrelation matrix has 1 + (p - 1) rho on top and 1 - rho below', () => {
  const p = 9
  const rho = 0.4
  const m = Array.from({ length: p }, (_, i) =>
    Array.from({ length: p }, (_, j) => (i === j ? 1 : rho)),
  )
  const { values } = symmetricEigen(m)
  close(values[0] as number, 1 + (p - 1) * rho)
  for (const v of values.slice(1)) close(v, 1 - rho)
})

test('every eigenpair satisfies A v = lambda v and the vectors are orthonormal', () => {
  const m = [
    [4, 1, -2, 0.5],
    [1, 3, 0, 1],
    [-2, 0, 5, -1],
    [0.5, 1, -1, 2],
  ]
  const { values, vectors } = symmetricEigen(m)
  close(values.reduce((a, b) => a + b, 0), 14)
  for (let k = 0; k < 4; k++) {
    const v = vectors[k] as number[]
    for (let i = 0; i < 4; i++) {
      const av = (m[i] as number[]).reduce((a, x, j) => a + x * (v[j] as number), 0)
      close(av, (values[k] as number) * (v[i] as number), 1e-8)
    }
    for (let l = 0; l < 4; l++) {
      const dot = v.reduce((a, x, j) => a + x * ((vectors[l] as number[])[j] as number), 0)
      close(dot, k === l ? 1 : 0, 1e-8)
    }
  }
  for (let k = 1; k < 4; k++) assert.ok((values[k - 1] as number) >= (values[k] as number))
})

test('the chance level repeats under one seed and moves under another', () => {
  const a = firstFactorChance(50, 9, { draws: 200, seed: 7 })
  const b = firstFactorChance(50, 9, { draws: 200, seed: 7 })
  const c = firstFactorChance(50, 9, { draws: 200, seed: 8 })
  assert.deepEqual(a, b)
  assert.notEqual(a.mean, c.mean)
  /* Sampling noise alone puts the first share above 1/p, and the 95th
   * percentile above the mean. */
  assert.ok(a.mean > 1 / 9)
  assert.ok(a.p95 > a.mean)
  /* Fewer countries, more room for noise. */
  assert.ok(firstFactorChance(15, 9, { draws: 200, seed: 7 }).mean > a.mean)
})

/** n countries, nine dimensions, each dimension = loading * common + noise. */
function synthetic(n: number, loading: number, seed: number) {
  const random = seededRandom(seed)
  const scores = new Map<string, Partial<Record<Dimension, number | null>>>()
  const gdp = new Map<string, number>()
  for (let i = 0; i < n; i++) {
    const iso3 = `C${String(i).padStart(2, '0')}`
    const common = gaussian(random)
    gdp.set(iso3, common)
    scores.set(
      iso3,
      Object.fromEntries(
        DIMENSIONS.map((d) => [d, 50 + 10 * (loading * common + gaussian(random))]),
      ),
    )
  }
  return { scores, gdp }
}

test('one strong common factor is found and reads as income when income is that factor', () => {
  const { scores, gdp } = synthetic(60, 2, 1)
  const s = factorSolution(scores, gdp, DIMENSIONS, { draws: 100 })
  assert.ok(s)
  assert.equal(s.countries, 60)
  assert.ok(s.firstFactorShare > 0.7, `share ${s.firstFactorShare}`)
  assert.ok(s.firstFactorShare > s.chance.p95)
  assert.ok((s.income?.r ?? 0) > 0.9)
  assert.ok(s.loadings.every((l) => l.loading > 0))
  close(s.eigenvalues.reduce((a, b) => a + b, 0), 9, 0.01)
})

test('independent dimensions sit inside the chance band', () => {
  const { scores, gdp } = synthetic(60, 0, 2)
  const s = factorSolution(scores, gdp, DIMENSIONS, { draws: 300 })
  assert.ok(s)
  assert.ok(s.firstFactorShare <= s.chance.p95 + 0.05, `share ${s.firstFactorShare}`)
})

test('a country missing any dimension is dropped and named, and the near-full fallback says which dimensions it reads', () => {
  const { scores, gdp } = synthetic(40, 1, 3)
  /* Blank one dimension for 15 of the 40, leaving 25 complete cases. */
  let k = 0
  for (const row of scores.values()) if (k++ < 15) row.shared_purpose = null
  const fs = factorStructureFor(scores, gdp, { draws: 50 })
  assert.equal(fs.complete?.countries, 25)
  assert.equal(fs.complete?.dropped.length, 15)
  assert.deepEqual(fs.complete?.dropped[0]?.missing, ['shared_purpose'])
  assert.ok(fs.nearFull)
  assert.equal(fs.nearFull.countries, 40)
  assert.deepEqual(
    fs.nearFull.dimensions,
    DIMENSIONS.filter((d) => d !== 'shared_purpose'),
  )
})

test('a correlation matrix of identical columns is all ones', () => {
  const m = correlationMatrix([
    [1, 2, 3, 4],
    [2, 4, 6, 8],
  ])
  close((m[0] as number[])[1] as number, 1)
})
