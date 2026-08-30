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
