#!/usr/bin/env node
// Capability layers (docs/research/related/MAZZUCATO-KATTEL-2026.md).
//
//   node scripts/capability-layers.mjs
//
// Tags every scored row with one layer of Mazzucato and Kattel (2026), then
// compares the layers on |r| against log GDP per capita, read from
// data/out/diagnostics.json. The tags are a research reading and never reach
// the registry, a score or the published output.
//
// structural  a stock of rules, institutions or accumulated capability
// routine     the level of an activity the country repeats every year
// dynamic     change in what the country does: entry, novelty, reabsorption
// unmapped    a perception or a distribution the framework has no layer for
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

const LAYER = {
  sci_articles_per_million: 'routine',
  statistical_performance: 'routine',
  new_business_density: 'dynamic',
  business_entry_efficiency: 'routine',
  business_start_procedures: 'structural',
  perceived_control: 'unmapped',
  trade_compliance_efficiency: 'routine',
  budget_execution_fidelity: 'routine',
  civil_society_strength: 'structural',
  dispute_resolution_efficiency: 'routine',
  bribery_incidence: 'routine',
  court_compliance: 'structural',
  interpersonal_trust: 'unmapped',
  willingness_to_cooperate_strangers: 'unmapped',
  human_capital_index: 'structural',
  firm_training_incidence: 'routine',
  research_citation_impact: 'routine',
  resident_patents_per_million: 'routine',
  resident_trademarks_per_million: 'routine',
  resident_industrial_designs_per_million: 'routine',
  new_repositories_per_million: 'dynamic',
  early_stage_entrepreneurial_activity: 'dynamic',
  failure_tolerance: 'unmapped',
  unemployment_rate: 'routine',
  long_term_unemployment_share: 'dynamic',
  export_diversification: 'structural',
  new_export_products_rate: 'dynamic',
  manufacturing_value_added: 'routine',
  high_tech_exports_share: 'routine',
  electricity_connection_speed: 'routine',
  economic_complexity: 'structural',
  tax_revenue_gdp: 'structural',
  income_inequality: 'unmapped',
  civic_participation: 'unmapped',
}

// The contested tags. The sensitivity run moves them and reports the result.
const CONTESTED = {
  resident_patents_per_million: 'dynamic',
  resident_trademarks_per_million: 'dynamic',
  resident_industrial_designs_per_million: 'dynamic',
  statistical_performance: 'dynamic',
  long_term_unemployment_share: 'routine',
}

const diagnostics = JSON.parse(readFileSync(join(ROOT, 'data/out/diagnostics.json'), 'utf8'))
const rows = diagnostics.indicatorVsGdp

const untagged = rows.filter((r) => !(r.indicatorId in LAYER)).map((r) => r.indicatorId)
const stale = Object.keys(LAYER).filter((id) => !rows.some((r) => r.indicatorId === id))
if (untagged.length || stale.length) {
  console.error(`untagged: ${untagged.join(', ') || 'none'}; not scored: ${stale.join(', ') || 'none'}`)
  process.exit(1)
}

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length

function summarise(tags) {
  const out = {}
  for (const r of rows) (out[tags[r.indicatorId]] ??= []).push(Math.abs(r.r))
  return out
}

// One-sided permutation test: is the routine mean above the dynamic mean by chance?
function permutation(a, b, runs = 20000) {
  const observed = mean(a) - mean(b)
  const pool = [...a, ...b]
  let seed = 1
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  let hits = 0
  for (let i = 0; i < runs; i++) {
    for (let j = pool.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1))
      ;[pool[j], pool[k]] = [pool[k], pool[j]]
    }
    if (mean(pool.slice(0, a.length)) - mean(pool.slice(a.length)) >= observed) hits++
  }
  return hits / runs
}

function report(label, tags) {
  const groups = summarise(tags)
  console.log(`\n${label}`)
  console.log('| Layer | Rows | Mean abs r | Share above 0.5 |')
  console.log('| --- | ---: | ---: | ---: |')
  for (const layer of ['structural', 'routine', 'dynamic', 'unmapped']) {
    const xs = groups[layer] ?? []
    const above = xs.filter((x) => x > 0.5).length
    console.log(`| ${layer} | ${xs.length} | ${mean(xs).toFixed(3)} | ${above}/${xs.length} |`)
  }
  const p = permutation(groups.routine, groups.dynamic)
  console.log(`routine minus dynamic: ${(mean(groups.routine) - mean(groups.dynamic)).toFixed(3)}, one-sided permutation p ${p.toFixed(3)}`)
}

const conditions = diagnostics.conditions.filter((c) => c.r != null).map((c) => Math.abs(c.r))
console.log(`diagnostics generated ${diagnostics.generatedAt}`)
console.log(`conditions (D122, not scored): ${conditions.length} rows, mean abs r ${mean(conditions).toFixed(3)}`)
report('Primary tags', LAYER)
report('Sensitivity: contested tags moved', { ...LAYER, ...CONTESTED })

console.log('\n| Row | Layer | r |')
console.log('| --- | --- | ---: |')
for (const r of [...rows].sort((a, b) => LAYER[a.indicatorId].localeCompare(LAYER[b.indicatorId]) || Math.abs(b.r) - Math.abs(a.r))) {
  console.log(`| \`${r.indicatorId}\` | ${LAYER[r.indicatorId]} | ${r.r.toFixed(3)} |`)
}
