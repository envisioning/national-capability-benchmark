/** Small, dependency-free statistics. Everything here is used by scoring or diagnostics. */

export function mean(xs: number[]): number {
  if (xs.length === 0) return Number.NaN
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return Number.NaN
  const pos = (sorted.length - 1) * q
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  const a = sorted[lo] as number
  const b = sorted[hi] as number
  return a + (b - a) * (pos - lo)
}

export function median(xs: number[]): number {
  return quantile([...xs].sort((a, b) => a - b), 0.5)
}

export function iqr(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  return quantile(s, 0.75) - quantile(s, 0.25)
}

/** Pearson correlation. Returns null when either series is constant or too short. */
export function pearson(xs: number[], ys: number[]): number | null {
  const n = Math.min(xs.length, ys.length)
  if (n < 3) return null
  const mx = mean(xs.slice(0, n))
  const my = mean(ys.slice(0, n))
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    const dx = (xs[i] as number) - mx
    const dy = (ys[i] as number) - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  if (sxx === 0 || syy === 0) return null
  return sxy / Math.sqrt(sxx * syy)
}

/** Spearman rank correlation, used where a monotone but non-linear relation is expected. */
export function spearman(xs: number[], ys: number[]): number | null {
  return pearson(rank(xs), rank(ys))
}

/** Ascending ranks, ties averaged. Exported for the residual layer. */
export function rank(xs: number[]): number[] {
  const order = xs.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
  const out = new Array<number>(xs.length)
  let i = 0
  while (i < order.length) {
    let j = i
    while (j + 1 < order.length && (order[j + 1] as { v: number }).v === (order[i] as { v: number }).v) j++
    const r = (i + j) / 2 + 1
    for (let k = i; k <= j; k++) out[(order[k] as { i: number }).i] = r
    i = j + 1
  }
  return out
}

export function round(x: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(x * f) / f
}

/**
 * Pearson correlation matrix of `columns`, one column per variable, every
 * column the same length. A constant column correlates 0 with everything but
 * itself, so a degenerate input still yields a valid symmetric matrix.
 */
export function correlationMatrix(columns: number[][]): number[][] {
  const p = columns.length
  const out = Array.from({ length: p }, () => new Array<number>(p).fill(0))
  for (let i = 0; i < p; i++) {
    out[i]![i] = 1
    for (let j = i + 1; j < p; j++) {
      const r = pearson(columns[i] as number[], columns[j] as number[]) ?? 0
      out[i]![j] = r
      out[j]![i] = r
    }
  }
  return out
}

/**
 * Eigenvalues and eigenvectors of a real symmetric matrix by cyclic Jacobi
 * rotation. Exact enough for the 9 by 9 correlation matrices the factor test
 * reads, and dependency free. Eigenvalues are sorted largest first and
 * `vectors[k]` is the unit eigenvector of `values[k]`.
 */
export function symmetricEigen(
  matrix: number[][],
  { tolerance = 1e-12, maxSweeps = 100 }: { tolerance?: number; maxSweeps?: number } = {},
): { values: number[]; vectors: number[][] } {
  const n = matrix.length
  const a = matrix.map((row) => [...row])
  /* v holds the accumulated rotations; its columns become the eigenvectors. */
  const v: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  )
  const at = (i: number, j: number) => a[i]![j]!
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += at(i, j) ** 2
    if (off < tolerance) break
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = at(p, q)
        if (Math.abs(apq) < 1e-300) continue
        const theta = (at(q, q) - at(p, p)) / (2 * apq)
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const s = t * c
        for (let k = 0; k < n; k++) {
          const akp = at(k, p)
          const akq = at(k, q)
          a[k]![p] = c * akp - s * akq
          a[k]![q] = s * akp + c * akq
        }
        for (let k = 0; k < n; k++) {
          const apk = at(p, k)
          const aqk = at(q, k)
          a[p]![k] = c * apk - s * aqk
          a[q]![k] = s * apk + c * aqk
        }
        for (let k = 0; k < n; k++) {
          const vkp = v[k]![p]!
          const vkq = v[k]![q]!
          v[k]![p] = c * vkp - s * vkq
          v[k]![q] = s * vkp + c * vkq
        }
      }
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((x, y) => at(y, y) - at(x, x))
  return {
    values: order.map((i) => at(i, i)),
    vectors: order.map((i) => v.map((row) => row[i]!)),
  }
}

/** A small seeded generator (mulberry32), so a Monte Carlo figure is the same on every run. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** One standard normal draw from a uniform generator, by Box and Muller. */
export function gaussian(random: () => number): number {
  let u = 0
  while (u === 0) u = random()
  const w = random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w)
}

/**
 * What the largest eigenvalue's share looks like when nothing is shared.
 *
 * Draws `draws` samples of `n` rows by `p` independent standard normal
 * columns, takes each sample's correlation matrix, and reads its largest
 * eigenvalue over `p`. Sampling noise alone pushes that share above 1/p, and
 * further the smaller `n` is, which is why a first-factor share is never read
 * without this beside it.
 */
export function firstFactorChance(
  n: number,
  p: number,
  { draws = 2000, seed = 20261001 }: { draws?: number; seed?: number } = {},
): { draws: number; seed: number; mean: number; p95: number } {
  const random = seededRandom(seed)
  const shares: number[] = []
  for (let d = 0; d < draws; d++) {
    const columns = Array.from({ length: p }, () =>
      Array.from({ length: n }, () => gaussian(random)),
    )
    const { values } = symmetricEigen(correlationMatrix(columns))
    shares.push((values[0] ?? 0) / p)
  }
  shares.sort((a, b) => a - b)
  return { draws, seed, mean: mean(shares), p95: quantile(shares, 0.95) }
}
