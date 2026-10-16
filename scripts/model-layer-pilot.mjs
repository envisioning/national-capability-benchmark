#!/usr/bin/env node
// Model layer pilot (#91, docs/research/MODEL-LAYER.md).
//
//   node scripts/model-layer-pilot.mjs prompts   write the blind prompts
//   node scripts/model-layer-pilot.mjs score     score the estimates, write results
//
// The prompt carries the country, the registry definition, the unit and the
// reference year, and nothing else. The reference year is the year of the
// hard value where one exists, else the row's modal year, so an estimate and
// the value it is scored against describe the same year.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const OUT = join(ROOT, 'data/research/model-layer-pilot')
const PROMPT_VERSION = '1.0.0'

const INDICATORS = ['interpersonal_trust', 'bribery_incidence', 'unemployment_rate', 'large_project_delivery']

/* --------------------------------- inputs --------------------------------- */

function readJson(p) {
  return JSON.parse(readFileSync(join(ROOT, p), 'utf8'))
}

function countries() {
  const src = readFileSync(join(ROOT, 'packages/core/src/model/countries.ts'), 'utf8')
  const out = []
  for (const m of src.matchAll(/\{\s*iso3:\s*'([A-Z]{3})',\s*iso2:\s*'[A-Z]{2}',\s*name:\s*'((?:[^'\\]|\\.)*)'/g)) {
    out.push({ iso3: m[1], name: m[2].replace(/\\'/g, "'") })
  }
  return out
}

function registryRow(id) {
  const src = readFileSync(join(ROOT, 'packages/core/src/model/indicators.ts'), 'utf8')
  const at = src.indexOf(`id: '${id}'`)
  if (at < 0) throw new Error(`indicator ${id} not in registry`)
  const block = src.slice(at, src.indexOf('\n  },', at))
  const definition = /definition:\s*\n?\s*'((?:[^'\\]|\\.)*)'/.exec(block)[1].replace(/\\'/g, "'")
  const unit = /unit:\s*'((?:[^'\\]|\\.)*)'/.exec(block)[1]
  const direction = /direction:\s*'([a-z_]+)'/.exec(block)[1]
  return { id, definition, unit, direction }
}

/** Latest hard value per country, with year, for the three measured rows. */
function hardValues() {
  const wb = readJson('data/observations/worldbank.json').observations
  const evs = readJson('data/observations/joint-evs-wvs.json').observations
  const hard = {}
  for (const id of INDICATORS) hard[id] = new Map()
  for (const o of [...wb, ...evs]) {
    if (!hard[o.indicatorId] || o.value == null) continue
    const prev = hard[o.indicatorId].get(o.iso3)
    if (!prev || o.year > prev.year) hard[o.indicatorId].set(o.iso3, { value: o.value, year: o.year })
  }
  return hard
}

function gdpPerCapita() {
  const wb = readJson('data/observations/worldbank.json').observations
  const gdp = new Map()
  for (const o of wb) {
    if (o.indicatorId !== '__context__NY.GDP.PCAP.PP.KD' || o.value == null) continue
    const prev = gdp.get(o.iso3)
    if (!prev || o.year > prev.year) gdp.set(o.iso3, { value: o.value, year: o.year })
  }
  return gdp
}

function modalYear(map) {
  const n = new Map()
  for (const { year } of map.values()) n.set(year, (n.get(year) ?? 0) + 1)
  return [...n.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? 2025
}

/* --------------------------------- prompts -------------------------------- */

// Fixed shuffle so no prompt lists countries in an order that carries
// information (alphabetical by region, or by income).
function seededShuffle(xs, seed) {
  const a = [...xs]
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildPrompts() {
  const list = seededShuffle(countries(), 91)
  if (list.length !== 125) throw new Error(`expected 125 countries, read ${list.length}`)
  const hard = hardValues()
  mkdirSync(join(OUT, 'prompts'), { recursive: true })
  const manifest = { promptVersion: PROMPT_VERSION, indicators: {} }
  for (const id of INDICATORS) {
    const row = registryRow(id)
    const fallbackYear = id === 'large_project_delivery' ? 2025 : modalYear(hard[id])
    const cells = list.map((c) => ({ iso3: c.iso3, name: c.name, year: hard[id].get(c.iso3)?.year ?? fallbackYear }))
    const lines = cells.map((c) => `${c.iso3}\t${c.name}\t${c.year}`).join('\n')
    const prompt = `Estimate one statistic for each of ${cells.length} countries, from your own knowledge.

Definition: ${row.definition}
Unit: ${row.unit}

Each line below gives an ISO3 code, a country name and the reference year. Give your best point estimate of the value for that country in that year, in the unit above, and your confidence in it from 0 (a guess) to 1 (you know the published figure). Give a number for every country, even where you are unsure.

${lines}`
    // Blindness check: the prompt must hold no hard value. Every hard value
    // for this row is printed to one decimal and searched for as a token.
    for (const { value } of hard[id].values()) {
      for (const form of [String(value), value.toFixed(1)]) {
        if (form.length >= 3 && new RegExp(`(^|[^0-9.])${form.replace('.', '\\.')}([^0-9]|$)`).test(prompt.replace(/\t\d{4}\n?/g, '\t'))) {
          throw new Error(`prompt for ${id} contains the value ${form}`)
        }
      }
    }
    writeFileSync(join(OUT, 'prompts', `${id}.txt`), prompt + '\n')
    manifest.indicators[id] = { definition: row.definition, unit: row.unit, cells: cells.length, fallbackYear }
  }
  writeFileSync(join(OUT, 'prompts', 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log('wrote prompts for', INDICATORS.join(', '))
}

/* --------------------------------- scoring -------------------------------- */

// The gate of #91, fixed before any estimate was scored.
const GATE = {
  minRankCorrelation: 0.7,
  // Post-cutoff cells replace the full set in the gate only when at least
  // this many exist (MODEL-LAYER.md rule 4, "where enough such cells exist").
  minPostCutoffCells: 20,
  // The error band is the 80th percentile of absolute error, in the
  // indicator's unit: four fills in five fall inside it.
  bandQuantile: 0.8,
  // A band needs this many cells in an income group to be reported.
  minBandCells: 10,
}
const MODELS = ['opus', 'sonnet', 'fable']

// First publication. No ingest the project holds predates the models'
// cutoff (the history of worldbank.json starts on 2026-08-26), so the date a
// value was first published is set by the publisher's calendar:
// - interpersonal_trust: the Joint EVS/WVS 2017-2022 results, fieldwork
//   ended 2022, all released before 2026. Never post-cutoff.
// - unemployment_rate: the ILO modelled estimates first carry a year in the
//   November edition of that year, so 2025 values were out in November 2025.
//   Never post-cutoff for a June 2026 cutoff.
// - bribery_incidence: an Enterprise Survey is released after fieldwork,
//   usually within a year. A value from a 2025 survey is counted as probably
//   published after a 2026-06 cutoff. This is a proxy, not a date.
function postCutoff(indicatorId, year, cutoff) {
  if (indicatorId !== 'bribery_incidence') return false
  const cutoffYear = Number(String(cutoff).slice(0, 4))
  return year >= cutoffYear - 1
}

function ranks(xs) {
  const idx = xs.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0])
  const r = new Array(xs.length)
  for (let i = 0; i < idx.length; ) {
    let j = i
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1
    i = j + 1
  }
  return r
}
function pearson(a, b) {
  const n = a.length
  if (n < 3) return null
  const ma = a.reduce((s, x) => s + x, 0) / n
  const mb = b.reduce((s, x) => s + x, 0) / n
  let sab = 0, saa = 0, sbb = 0
  for (let i = 0; i < n; i++) {
    sab += (a[i] - ma) * (b[i] - mb)
    saa += (a[i] - ma) ** 2
    sbb += (b[i] - mb) ** 2
  }
  return saa && sbb ? sab / Math.sqrt(saa * sbb) : null
}
const spearman = (a, b) => (a.length < 3 ? null : pearson(ranks(a), ranks(b)))
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
function quantile(xs, q) {
  const s = [...xs].sort((a, b) => a - b)
  const pos = (s.length - 1) * q
  const lo = Math.floor(pos)
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (pos - lo)
}
const r3 = (x) => (x == null ? null : Math.round(x * 1000) / 1000)
const r2 = (x) => (x == null ? null : Math.round(x * 100) / 100)

/** Accuracy of estimates `est` against `truth` over the pairs given. */
function accuracy(pairs) {
  if (!pairs.length) return { n: 0 }
  const e = pairs.map((p) => p.est)
  const t = pairs.map((p) => p.truth)
  const err = pairs.map((p) => p.est - p.truth)
  const abs = err.map(Math.abs)
  return {
    n: pairs.length,
    rankCorrelation: r3(spearman(e, t)),
    meanAbsoluteError: r2(abs.reduce((s, x) => s + x, 0) / abs.length),
    bias: r2(err.reduce((s, x) => s + x, 0) / err.length),
    band: pairs.length >= GATE.minBandCells ? r2(quantile(abs, GATE.bandQuantile)) : null,
  }
}

function loadEstimates(model, id) {
  const p = join(OUT, 'estimates', `${model}__${id}.json`)
  const run = JSON.parse(readFileSync(p, 'utf8'))
  return { modelId: run.modelId, cutoff: run.trainingCutoff, cells: new Map(run.cells.map((c) => [c.iso3, c])) }
}

function score() {
  const list = countries()
  const gdp = gdpPerCapita()
  const logGdp = new Map([...gdp].map(([k, v]) => [k, Math.log(v.value)]))
  const sortedGdp = list.map((c) => logGdp.get(c.iso3)).filter((x) => x != null).sort((a, b) => a - b)
  const cuts = [0.25, 0.5, 0.75].map((q) => quantile(sortedGdp, q))
  const quartileOf = (iso3) => {
    const g = logGdp.get(iso3)
    if (g == null) return null
    return 1 + cuts.filter((c) => g > c).length
  }
  const hard = hardValues()
  const evidence = JSON.parse(readFileSync(join(OUT, 'evidence-overruns.json'), 'utf8')).records
  const results = { generatedFrom: 'scripts/model-layer-pilot.mjs score', gate: GATE, incomeQuartileCuts: cuts.map((c) => Math.round(Math.exp(c))), models: {}, indicators: {} }

  for (const id of INDICATORS) {
    const runs = Object.fromEntries(MODELS.map((m) => [m, loadEstimates(m, id)]))
    for (const m of MODELS) results.models[m] = { modelId: runs[m].modelId, trainingCutoff: runs[m].cutoff }
    const cutoff = runs.opus.cutoff
    // Ensemble: the median of the three models, cell by cell.
    const series = { ...Object.fromEntries(MODELS.map((m) => [m, new Map([...runs[m].cells].map(([k, c]) => [k, c.value]))])) }
    series.ensemble = new Map(list.map((c) => [c.iso3, median(MODELS.map((m) => runs[m].cells.get(c.iso3).value))]))
    const spread = list.map((c) => {
      const v = MODELS.map((m) => runs[m].cells.get(c.iso3).value)
      return Math.max(...v) - Math.min(...v)
    })

    // Truth: hard values for measured rows; per-country median overruns from
    // evidence records for the gap row.
    const truths = {}
    if (id === 'large_project_delivery') {
      const by = (field, keep) => {
        const g = new Map()
        for (const r of evidence) {
          if (r[field] == null || !keep(r)) continue
          if (!g.has(r.iso3)) g.set(r.iso3, [])
          g.get(r.iso3).push(r[field])
        }
        return new Map([...g].map(([k, v]) => [k, { value: median(v), year: null }]))
      }
      const clean = (r) => !r.flags.some((f) => ['lowerBound', 'bidEstimate', 'subproject', 'perKm'].includes(f))
      truths.cost = by('costOverrunPct', () => true)
      truths.schedule = by('scheduleOverrunPct', () => true)
      truths.costClean = by('costOverrunPct', clean)
    } else {
      truths.hard = hard[id]
    }

    const out = { cutoff, truths: {} }
    for (const [tname, truth] of Object.entries(truths)) {
      const block = { n: truth.size, models: {} }
      const isoWith = list.map((c) => c.iso3).filter((k) => truth.has(k))
      const truthVals = isoWith.map((k) => truth.get(k).value)
      block.truthVsLogGdp = r3(pearson(isoWith.filter((k) => logGdp.has(k)).map((k) => truth.get(k).value), isoWith.filter((k) => logGdp.has(k)).map((k) => logGdp.get(k))))
      block.truthIqr = r2(quantile(truthVals, 0.75) - quantile(truthVals, 0.25))
      block.truthMedian = r2(median(truthVals))
      for (const [name, s] of Object.entries(series)) {
        const pairs = isoWith.map((k) => ({ iso3: k, est: s.get(k), truth: truth.get(k).value, year: truth.get(k).year }))
        const m = { overall: accuracy(pairs), byIncomeQuartile: {} }
        for (const q of [1, 2, 3, 4]) m.byIncomeQuartile[q] = accuracy(pairs.filter((p) => quartileOf(p.iso3) === q))
        const post = pairs.filter((p) => p.year != null && postCutoff(id, p.year, cutoff))
        m.postCutoff = accuracy(post)
        m.preCutoff = accuracy(pairs.filter((p) => !(p.year != null && postCutoff(id, p.year, cutoff))))
        const g = pairs.filter((p) => logGdp.has(p.iso3))
        m.estimateVsLogGdp = r3(pearson(g.map((p) => p.est), g.map((p) => logGdp.get(p.iso3))))
        const all = list.filter((c) => logGdp.has(c.iso3))
        m.estimateVsLogGdpAll125 = r3(pearson(all.map((c) => s.get(c.iso3)), all.map((c) => logGdp.get(c.iso3))))
        if (name !== 'ensemble') {
          const conf = pairs.map((p) => runs[name].cells.get(p.iso3).selfConfidence)
          m.selfConfidenceVsAbsError = r3(spearman(conf, pairs.map((p) => Math.abs(p.est - p.truth))))
          m.meanSelfConfidence = r2(conf.reduce((a, b) => a + b, 0) / conf.length)
        }
        // The gate, exactly as #91 writes it.
        if (name === 'ensemble') {
          // Held out means published after the cutoff. Where too few such
          // cells exist the measured cells can only show recall, so the
          // first criterion cannot be met and the recall figure is reported
          // beside it.
          const usePost = post.length >= GATE.minPostCutoffCells
          const heldOut = usePost ? m.postCutoff : { rankCorrelation: null }
          const bands = [1, 2, 3, 4].map((q) => m.byIncomeQuartile[q].band).filter((b) => b != null)
          const worstQ = [1, 2, 3, 4].filter((q) => m.byIncomeQuartile[q].band != null).sort((a, b) => m.byIncomeQuartile[b].band - m.byIncomeQuartile[a].band)[0]
          const incomeOk = m.estimateVsLogGdp != null && block.truthVsLogGdp != null && Math.abs(m.estimateVsLogGdp) <= Math.abs(block.truthVsLogGdp)
          m.gate = {
            heldOutSet: usePost ? 'post-cutoff cells' : 'none: too few post-cutoff cells to separate estimation from recall',
            heldOutCells: post.length,
            heldOutRankCorrelation: heldOut.rankCorrelation,
            recallRankCorrelation: m.overall.rankCorrelation,
            rankCorrelationPasses: heldOut.rankCorrelation != null && heldOut.rankCorrelation >= GATE.minRankCorrelation,
            bandInUnit: bands.length ? Math.max(...bands) : null,
            bandPasses: bands.length > 0,
            worstIncomeQuartile: worstQ ?? null,
            incomeTrackingEstimate: m.estimateVsLogGdp,
            incomeTrackingHard: block.truthVsLogGdp,
            incomeTrackingPasses: incomeOk,
          }
          m.gate.passes = m.gate.rankCorrelationPasses && m.gate.bandPasses && m.gate.incomeTrackingPasses
          // Context, not gate: a seeded paired bootstrap of the income gap,
          // |r(estimate, log GDP)| - |r(hard, log GDP)|, over the same cells.
          let seed = 9100
          const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32)
          const gaps = []
          for (let b = 0; b < 2000; b++) {
            const s2 = g.map(() => g[Math.floor(rand() * g.length)])
            const lg = s2.map((p) => logGdp.get(p.iso3))
            const re = pearson(s2.map((p) => p.est), lg)
            const rh = pearson(s2.map((p) => p.truth), lg)
            if (re != null && rh != null) gaps.push(Math.abs(re) - Math.abs(rh))
          }
          m.gate.incomeGap = r3(Math.abs(m.estimateVsLogGdp) - Math.abs(block.truthVsLogGdp))
          m.gate.incomeGap90 = [r3(quantile(gaps, 0.05)), r3(quantile(gaps, 0.95))]
        }
        block.models[name] = m
      }
      // Agreement between models on every cell, measured or not.
      block.interModelRankCorrelation = Object.fromEntries(
        [['opus', 'sonnet'], ['opus', 'fable'], ['sonnet', 'fable']].map(([a, b]) => [`${a}-${b}`, r3(spearman(list.map((c) => series[a].get(c.iso3)), list.map((c) => series[b].get(c.iso3))))]),
      )
      out.truths[tname] = block
    }
    out.medianSpreadAcrossModels = r2(median(spread))
    // Do the models know when they are guessing? Mean self-confidence on
    // cells with a measured value against cells with none.
    const measured = truths.hard ?? truths.cost
    out.selfConfidence = Object.fromEntries(
      MODELS.map((m) => {
        const c = [...runs[m].cells.values()]
        const avg = (xs) => (xs.length ? r2(xs.reduce((a, b) => a + b, 0) / xs.length) : null)
        return [m, { measured: avg(c.filter((x) => measured.has(x.iso3)).map((x) => x.selfConfidence)), unmeasured: avg(c.filter((x) => !measured.has(x.iso3)).map((x) => x.selfConfidence)) }]
      }),
    )
    out.unmeasuredCells = list.filter((c) => !(truths.hard ?? truths.cost).has(c.iso3)).length
    results.indicators[id] = out
  }
  writeFileSync(join(OUT, 'calibration.json'), JSON.stringify(results, null, 2) + '\n')
  console.log('wrote', join(OUT, 'calibration.json'))
}

const cmd = process.argv[2]
if (cmd === 'prompts') buildPrompts()
else if (cmd === 'score') score()
else {
  console.error('usage: model-layer-pilot.mjs prompts|score')
  process.exit(1)
}
