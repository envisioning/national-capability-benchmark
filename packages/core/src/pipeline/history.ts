import { mkdir, writeFile } from 'node:fs/promises'
import {
  COUNTRIES,
  DIMENSIONS,
  GDP_PER_CAPITA_CODE,
  HistoryCountryFile as HistoryCountryFileSchema,
  HistoryIndexFile as HistoryIndexFileSchema,
  INDICATORS,
  LATAM_ISO3,
  indicatorsFor,
  isScored,
} from '../model/index.js'
import type {
  Dimension,
  HistoryCohort,
  HistoryCountryFile,
  HistoryDelta,
  HistoryDimension,
  HistoryFill,
  HistoryIndexFile,
  HistoryPoint,
  HistoryValidationRow,
  IndicatorDef,
  Observation,
} from '../model/index.js'
import { MAX_SCORED_VALUE_AGE } from './confidence.js'
import type { Frame } from './normalize.js'
import { CONTEXT_PREFIX } from './diagnostics.js'
import { buildFrames, buildMatrix } from './score.js'
import { buildHistory, normalizedAt } from './trend.js'
import { gaussian, median, quantile, round, seededRandom } from './stats.js'
import { FILES, HISTORY_OUT_DIR, historyFile } from './paths.js'
import { loadObservations } from './store.js'

/**
 * The reconstructed history: every country's nine dimensions, year by year,
 * with the gaps in the data filled and the fill error carried as a band.
 *
 * Two series per dimension, never merged.
 *
 * 1. **Replay.** What the scorer would have published in a past year: the
 *    values in force then, no older than the D159 limit, against today's frame.
 *    No value is invented. The basket changes from year to year, so part of any
 *    movement is the dataset gaining or losing rows, and the row count is
 *    printed beside every point.
 * 2. **Reconstruction.** The headline basket held fixed across every year, so a
 *    change is a change in the country. Where a basket indicator has no value in
 *    a year, it is filled in this order: interpolated between two observations,
 *    carried forward under the scoring rule, or modelled: the nearest
 *    observation of the country's own series plus the median change of the
 *    countries that stood nearest to it on that indicator. A low-rank model
 *    was tried first and lost to holding the nearest value flat; the donor
 *    rule beats both, and the flat comparison is published beside it.
 *
 * The fill error is measured, never assumed: observed cells are hidden, filled
 * the same way, and compared with what was published. That error sets the
 * noise of the draws, so the band is as wide as the method has shown itself to
 * be wrong. Nothing here enters a score, a confidence or the frame. See D174.
 */
export const HISTORY_METHOD_VERSION = 'history/0.1-provisional' as const
export const HISTORY_FROM_YEAR = 2000
export const HISTORY_SPANS = [10, 20]
/** Countries whose own change lends a modelled cell its movement. */
const DONORS = 25
const MIN_DONORS = 5
const DRAWS = 200
const SEED = 20261102
/** Share of a modelled cell's error that holds across all its years. */
const PERSISTENT_SHARE = 0.5
/** Observations hidden at random for the holdout test. */
const RANDOM_HOLDOUT = 0.1
/** Series hidden before their median year, to test the backcast. */
const BACKCAST_HOLDOUT = 0.2
const MIN_BACKCAST_POINTS = 8
/** Below this many holdout cells, a fill bucket borrows its parent's error. */
const MIN_BUCKET = 30

type Grid = {
  /** country x indicator x year, NaN where nothing was observed. */
  values: Float64Array
  nC: number
  nJ: number
  nY: number
  fromYear: number
}

const at = (g: Grid, c: number, j: number, y: number) => (c * g.nJ + j) * g.nY + y

type Resolved = { fill: HistoryFill; value: number; bucket: string }

const clamp = (v: number) => Math.min(100, Math.max(0, v))

function bucketOf(fill: HistoryFill, distance: number): string {
  if (fill === 'carried') return distance <= 3 ? 'carried:1-3' : 'carried:4-15'
  if (fill === 'modelled') return distance <= 3 ? 'modelled:1-3' : distance <= 7 ? 'modelled:4-7' : 'modelled:8+'
  return fill
}

/** How one cell is filled from the rest of its own series and, failing that, from its donors. */
function resolveCell(g: Grid, c: number, j: number, y: number): Resolved | null {
  const v = g.values[at(g, c, j, y)] as number
  if (!Number.isNaN(v)) return { fill: 'observed', value: v, bucket: 'observed' }

  let prev = -1
  for (let t = y - 1; t >= 0; t--) {
    if (!Number.isNaN(g.values[at(g, c, j, t)] as number)) {
      prev = t
      break
    }
  }
  let next = -1
  for (let t = y + 1; t < g.nY; t++) {
    if (!Number.isNaN(g.values[at(g, c, j, t)] as number)) {
      next = t
      break
    }
  }
  if (prev < 0 && next < 0) return null

  if (prev >= 0 && next >= 0) {
    const a = g.values[at(g, c, j, prev)] as number
    const b = g.values[at(g, c, j, next)] as number
    return { fill: 'interpolated', value: a + ((b - a) * (y - prev)) / (next - prev), bucket: 'interpolated' }
  }
  if (prev >= 0 && y - prev <= MAX_SCORED_VALUE_AGE) {
    return { fill: 'carried', value: g.values[at(g, c, j, prev)] as number, bucket: bucketOf('carried', y - prev) }
  }

  /* Before the first observation, or after one too old to carry: start from
   * the nearest observation and add the median change, over the same years, of
   * the countries that stood nearest to it on the same indicator then. The
   * donors are chosen by level on that indicator alone, never by income. */
  const t0 = prev >= 0 && (next < 0 || y - prev <= next - y) ? prev : next
  const anchor = g.values[at(g, c, j, t0)] as number
  const donors: Array<[number, number]> = []
  for (let o = 0; o < g.nC; o++) {
    if (o === c) continue
    const a = g.values[at(g, o, j, t0)] as number
    const b = g.values[at(g, o, j, y)] as number
    if (Number.isNaN(a) || Number.isNaN(b)) continue
    donors.push([Math.abs(a - anchor), b - a])
  }
  donors.sort((p, q) => p[0] - q[0])
  const change = donors.length >= MIN_DONORS ? median(donors.slice(0, DONORS).map((d) => d[1])) : 0
  return { fill: 'modelled', value: clamp(anchor + change), bucket: bucketOf('modelled', Math.abs(y - t0)) }
}

/**
 * Hide observed cells, fill them, and measure the error per fill bucket.
 *
 * Two masks. A random tenth of the observed cells tests interpolation and
 * carrying. A fifth of the long series lose every value before their median
 * year, which is the case the reconstruction exists for: a country whose
 * early record is missing. Only cells inside the published years are scored.
 */
function holdout(g: Grid, outFrom: number): { rows: HistoryValidationRow[]; sd: Map<string, number> } {
  const random = seededRandom(SEED + 1)
  const masked: Grid = { ...g, values: Float64Array.from(g.values) }
  const hidden: Array<[number, number, number]> = []
  for (let c = 0; c < g.nC; c++) {
    for (let j = 0; j < g.nJ; j++) {
      const years: number[] = []
      for (let y = 0; y < g.nY; y++) if (!Number.isNaN(g.values[at(g, c, j, y)] as number)) years.push(y)
      if (years.length >= MIN_BACKCAST_POINTS && random() < BACKCAST_HOLDOUT) {
        const cut = years[Math.floor(years.length / 2)] as number
        for (const y of years) {
          if (y >= cut) continue
          masked.values[at(g, c, j, y)] = Number.NaN
          if (y >= outFrom) hidden.push([c, j, y])
        }
        continue
      }
      for (const y of years) {
        if (y < outFrom || years.length < 2 || random() >= RANDOM_HOLDOUT) continue
        masked.values[at(g, c, j, y)] = Number.NaN
        hidden.push([c, j, y])
      }
    }
  }

  const errors = new Map<string, number[]>()
  const push = (key: string, e: number) => {
    const list = errors.get(key) ?? []
    list.push(e)
    errors.set(key, list)
  }
  for (const [c, j, y] of hidden) {
    const r = resolveCell(masked, c, j, y)
    if (!r) continue
    const e = r.value - (g.values[at(g, c, j, y)] as number)
    push(r.bucket, e)
    push(r.fill, e)
    if (r.fill === 'modelled') {
      /* The comparison the donor rule has to beat: the nearest observation, held flat. */
      let nearest = -1
      for (let t = 0; t < g.nY; t++) {
        if (Number.isNaN(masked.values[at(g, c, j, t)] as number)) continue
        if (nearest < 0 || Math.abs(t - y) < Math.abs(nearest - y)) nearest = t
      }
      push('flat', (masked.values[at(g, c, j, nearest)] as number) - (g.values[at(g, c, j, y)] as number))
    }
  }

  const rows: HistoryValidationRow[] = [...errors]
    .map(([fill, es]) => ({
      fill,
      n: es.length,
      rmse: round(Math.sqrt(es.reduce((s, e) => s + e * e, 0) / es.length), 2),
      bias: round(es.reduce((s, e) => s + e, 0) / es.length, 2),
    }))
    .sort((a, b) => a.fill.localeCompare(b.fill))

  const byKey = new Map(rows.map((r) => [r.fill, r]))
  const worst = Math.max(...rows.map((r) => r.rmse))
  const sd = new Map<string, number>()
  for (const bucket of ['interpolated', 'carried:1-3', 'carried:4-15', 'modelled:1-3', 'modelled:4-7', 'modelled:8+']) {
    const own = byKey.get(bucket)
    const parent = byKey.get(bucket.split(':')[0] as string)
    sd.set(bucket, own && own.n >= MIN_BUCKET ? own.rmse : parent && parent.n >= MIN_BUCKET ? parent.rmse : worst)
  }
  sd.set('observed', 0)
  return { rows, sd }
}

/** GDP per capita in force at a year: the latest at or before it, else the earliest within five years after. */
export function gdpAt(observations: Observation[], year: number): Map<string, number> {
  const id = `${CONTEXT_PREFIX}${GDP_PER_CAPITA_CODE}`
  const best = new Map<string, { year: number; value: number }>()
  for (const o of observations) {
    if (o.indicatorId !== id || o.year > year + 5) continue
    const cur = best.get(o.iso3)
    const better =
      !cur ||
      (o.year <= year && (cur.year > year || o.year > cur.year)) ||
      (o.year > year && cur.year > year && o.year < cur.year)
    if (better) best.set(o.iso3, { year: o.year, value: o.value })
  }
  return new Map([...best].map(([iso3, v]) => [iso3, v.value]))
}

/** Cohorts with membership fixed at the first published year, so no one leaves a group by succeeding. */
function cohortsAt(observations: Observation[], year: number): Array<{ id: string; label: string; members: string[] }> {
  const all = COUNTRIES.map((c) => c.iso3 as string)
  const gdp = gdpAt(observations, year)
  const ranked = all.filter((iso3) => gdp.has(iso3)).sort((a, b) => (gdp.get(a) as number) - (gdp.get(b) as number))
  const quartiles = [0, 1, 2, 3].map((q) => ({
    id: `income_${year}_q${q + 1}`,
    label: `Income quartile ${q + 1} of 4 in ${year}${q === 0 ? ', lowest' : q === 3 ? ', highest' : ''}`,
    members: ranked.slice(Math.round((q * ranked.length) / 4), Math.round(((q + 1) * ranked.length) / 4)),
  }))
  return [
    { id: 'all', label: 'Every country in the frame', members: all },
    { id: 'latam', label: 'Latin America', members: [...LATAM_ISO3] },
    ...quartiles,
  ]
}

/**
 * The 10th to 90th percentile spread of the draws, placed around the estimate.
 *
 * Clamping a noisy cell at 0 or 100 pushes the draws inward, and a median over
 * noisy zeros drifts, so the raw percentiles can sit to one side of the
 * estimate they are meant to qualify. The spread is kept and the offset is not.
 */
function band(estimate: number, draws: number[]): { lo: number; hi: number } {
  const sorted = [...draws].sort((p, q) => p - q)
  const mid = quantile(sorted, 0.5)
  return { lo: estimate + quantile(sorted, 0.1) - mid, hi: estimate + quantile(sorted, 0.9) - mid }
}

type CellDraws = {
  estimate: Float64Array
  draws: Float64Array[]
}

export type HistoryOutput = { countries: HistoryCountryFile[]; index: HistoryIndexFile }

export function buildReconstructedHistory(
  observations: Observation[],
  currentYear: number,
  generatedAt = new Date().toISOString(),
): HistoryOutput {
  const opts = { currentYear }
  const frames = buildFrames(observations, opts)
  const matrix = buildMatrix(observations, opts, frames)
  const history = buildHistory(observations)
  const defs: IndicatorDef[] = INDICATORS.filter((d) => isScored(d) && frames.has(d.id))
  const col = new Map(defs.map((d, j) => [d.id, j]))

  /* The grid starts early enough that a value carried into the first published
   * year is in the grid, under the same age limit the scorer uses. */
  const gridFrom = HISTORY_FROM_YEAR - MAX_SCORED_VALUE_AGE
  const g: Grid = {
    values: new Float64Array(COUNTRIES.length * defs.length * (currentYear - gridFrom + 1)).fill(Number.NaN),
    nC: COUNTRIES.length,
    nJ: defs.length,
    nY: currentYear - gridFrom + 1,
    fromYear: gridFrom,
  }
  COUNTRIES.forEach((country, c) => {
    defs.forEach((def, j) => {
      /* Each observation is normalised with the denominator in force in its
       * own year, the rule the replay uses, so a count published a year ahead
       * of its population still has a line. Earlier points anchor the first
       * grid year: a series that stops before it carries its last value in. */
      const frame = frames.get(def.id) as Frame
      const years = [...(history.get(def.id)?.get(country.iso3) ?? [])].map((p) => p.year).sort((a, b) => a - b)
      const point = (year: number) => {
        const cell = normalizedAt(def, history, country.iso3, year, MAX_SCORED_VALUE_AGE, frame)
        return cell && cell.year === year ? cell.normalized : null
      }
      const before = years.filter((year) => year < gridFrom).at(-1)
      if (before !== undefined && gridFrom - before <= MAX_SCORED_VALUE_AGE) {
        const v = point(before)
        if (v !== null) g.values[at(g, c, j, 0)] = v
      }
      for (const year of years) {
        if (year < gridFrom || year > currentYear) continue
        const v = point(year)
        if (v !== null) g.values[at(g, c, j, year - gridFrom)] = v
      }
    })
  })

  const outFrom = HISTORY_FROM_YEAR - gridFrom
  const validation = holdout(g, outFrom)
  const years = Array.from({ length: g.nY - outFrom }, (_, i) => HISTORY_FROM_YEAR + i)
  const random = seededRandom(SEED + 2)

  const cells = new Map<string, CellDraws>()
  const countryFiles: HistoryCountryFile[] = COUNTRIES.map((country, c) => {
    const dimensions: Partial<Record<Dimension, HistoryDimension | null>> = {}
    for (const dimension of DIMENSIONS) {
      const scored = indicatorsFor(dimension).filter((d) => col.has(d.id))
      /* The headline basket, less any row whose yearly line is empty: a value
       * scored today with no same-year denominator has no history to fill. */
      const basket: string[] = []
      const resolved: Resolved[][] = []
      for (const def of scored) {
        if (!matrix.get(def.id)?.get(country.iso3)) continue
        const row = years.map((year) => resolveCell(g, c, col.get(def.id) as number, year - gridFrom))
        if (row.some((r) => r === null)) continue
        basket.push(def.id)
        resolved.push(row as Resolved[])
      }
      if (basket.length < 2) {
        dimensions[dimension] = null
        continue
      }
      const estimate = new Float64Array(years.length)
      const modelled = new Int32Array(years.length)
      years.forEach((_, y) => {
        let s = 0
        for (const row of resolved) {
          const r = row[y] as Resolved
          s += r.value
          if (r.fill === 'modelled') modelled[y] = (modelled[y] as number) + 1
        }
        estimate[y] = s / basket.length
      })

      const draws: Float64Array[] = []
      const a = Math.sqrt(PERSISTENT_SHARE)
      const b = Math.sqrt(1 - PERSISTENT_SHARE)
      for (let d = 0; d < DRAWS; d++) {
        const out = new Float64Array(years.length)
        for (const row of resolved) {
          const zp = gaussian(random)
          for (let y = 0; y < years.length; y++) {
            const r = row[y] as Resolved
            /* The end year is the headline score, and the scorer carries a
             * value forward too, so a carried cell there is the published value
             * rather than a fill. */
            const sd = r.fill === 'carried' && y === years.length - 1 ? 0 : (validation.sd.get(r.bucket) ?? 0)
            const v = sd > 0 ? clamp(r.value + sd * (a * zp + b * gaussian(random))) : r.value
            out[y] = (out[y] as number) + v / basket.length
          }
        }
        draws.push(out)
      }
      cells.set(`${country.iso3}|${dimension}`, { estimate, draws })

      const series: HistoryPoint[] = years.map((year, y) => {
        const replayValues: number[] = []
        for (const def of scored) {
          const cell = normalizedAt(def, history, country.iso3, year, MAX_SCORED_VALUE_AGE, frames.get(def.id) as Frame)
          if (cell) replayValues.push(cell.normalized)
        }
        const { lo, hi } = band(estimate[y] as number, draws.map((dr) => dr[y] as number))
        return {
          year,
          replay: replayValues.length >= 2 ? round(replayValues.reduce((s, v) => s + v, 0) / replayValues.length, 1) : null,
          replayIndicators: replayValues.length,
          estimate: round(estimate[y] as number, 1),
          lo: round(clamp(lo), 1),
          hi: round(clamp(hi), 1),
          modelled: modelled[y] as number,
        }
      })

      const end = years.length - 1
      const deltas: HistoryDelta[] = HISTORY_SPANS.filter((span) => span <= end).map((span) => {
        const base = end - span
        const delta = (estimate[end] as number) - (estimate[base] as number)
        const { lo, hi } = band(delta, draws.map((dr) => (dr[end] as number) - (dr[base] as number)))
        return {
          span,
          baseYear: years[base] as number,
          endYear: years[end] as number,
          estimate: round(delta, 1),
          lo: round(lo, 1),
          hi: round(hi, 1),
        }
      })
      dimensions[dimension] = { basket, series, deltas }
    }
    return HistoryCountryFileSchema.parse({
      generatedAt,
      methodVersion: HISTORY_METHOD_VERSION,
      iso3: country.iso3,
      country: country.name,
      dimensions,
    })
  })

  /* A cohort's delta is the median of its members' own deltas, never the
   * difference of two medians over different countries. The band repeats that
   * median once per draw. */
  const end = years.length - 1
  const cohortDelta = (members: string[], dimension: Dimension, span: number) => {
    const present = members
      .map((iso3) => cells.get(`${iso3}|${dimension}`))
      .filter((x): x is CellDraws => Boolean(x))
    const base = end - span
    const estimate = median(present.map((p) => (p.estimate[end] as number) - (p.estimate[base] as number)))
    const perDraw = Array.from({ length: DRAWS }, (_, d) =>
      median(present.map((p) => ((p.draws[d] as Float64Array)[end] as number) - ((p.draws[d] as Float64Array)[base] as number))),
    )
    return { n: present.length, estimate, ...band(estimate, perDraw) }
  }

  const groups = cohortsAt(observations, HISTORY_FROM_YEAR)
  const allMembers = groups[0]?.members ?? []
  const cohorts: HistoryCohort[] = groups.map((group) => {
    const dims: HistoryCohort['dimensions'] = {}
    for (const dimension of DIMENSIONS) {
      const present = group.members
        .map((iso3) => cells.get(`${iso3}|${dimension}`))
        .filter((x): x is CellDraws => Boolean(x))
      if (present.length === 0) continue
      dims[dimension] = {
        series: years.map((year, y) => ({
          year,
          median: round(median(present.map((p) => p.estimate[y] as number)), 1),
          n: present.length,
        })),
        deltas: HISTORY_SPANS.filter((span) => span <= end).map((span) => {
          const own = cohortDelta(group.members, dimension, span)
          const everyone = cohortDelta(allMembers, dimension, span)
          return {
            span,
            baseYear: years[end - span] as number,
            endYear: years[end] as number,
            estimate: round(own.estimate, 1),
            lo: round(own.lo, 1),
            hi: round(own.hi, 1),
            n: own.n,
            relative: round(own.estimate - everyone.estimate, 1),
          }
        }),
      }
    }
    return { ...group, dimensions: dims }
  })

  const index = HistoryIndexFileSchema.parse({
    generatedAt,
    methodVersion: HISTORY_METHOD_VERSION,
    params: {
      fromYear: HISTORY_FROM_YEAR,
      toYear: currentYear,
      donors: DONORS,
      draws: DRAWS,
      seed: SEED,
      spans: HISTORY_SPANS,
    },
    validation: validation.rows,
    cohorts,
  })
  return { countries: countryFiles, index }
}

/** Read every observation file, rebuild the history and write one file per country plus the index. */
export async function writeHistory(currentYear: number, generatedAt = new Date().toISOString()): Promise<HistoryOutput> {
  const output = buildReconstructedHistory(await loadObservations(), currentYear, generatedAt)
  await mkdir(HISTORY_OUT_DIR, { recursive: true })
  for (const file of output.countries) {
    await writeFile(historyFile(file.iso3), `${JSON.stringify(file)}\n`, 'utf8')
  }
  await writeFile(FILES.historyIndex, `${JSON.stringify(output.index, null, 2)}\n`, 'utf8')
  return output
}
