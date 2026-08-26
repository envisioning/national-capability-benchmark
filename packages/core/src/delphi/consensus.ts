import { COUNTRY_NAMES, DIMENSIONS, INDICATORS_BY_ID } from '../model/index.js'
import type {
  DelphiRunFile,
  Dimension,
  MeasurementClass,
} from '../model/index.js'
import { iqr, mean, median, round } from '../pipeline/stats.js'

export type CellConsensus = {
  iso3: string
  country: string
  dimension: Dimension
  round: number
  median: number
  iqr: number
  min: number
  max: number
  dissent: boolean
  /** Movement of the panel median from the previous round. Delphi convergence. */
  medianShift: number | null
  /** Shrinkage of the interquartile range from the previous round. */
  iqrShift: number | null
  panelists: Array<{ panelist: string; model: string; score: number; selfConfidence: number }>
}

export function cellConsensus(run: DelphiRunFile): CellConsensus[] {
  const groups = new Map<string, typeof run.cellEstimates>()
  for (const e of run.cellEstimates) {
    const key = `${e.iso3}|${e.dimension}|${e.round}`
    const list = groups.get(key) ?? []
    list.push(e)
    groups.set(key, list)
  }

  const rows: CellConsensus[] = []
  for (const [key, list] of groups) {
    const [iso3, dimension, roundStr] = key.split('|') as [string, Dimension, string]
    const scores = list.map((e) => e.score)
    rows.push({
      iso3,
      country: COUNTRY_NAMES[iso3] ?? iso3,
      dimension,
      round: Number(roundStr),
      median: round(median(scores), 1),
      iqr: round(iqr(scores), 1),
      min: round(Math.min(...scores), 1),
      max: round(Math.max(...scores), 1),
      dissent: iqr(scores) > 25,
      medianShift: null,
      iqrShift: null,
      panelists: list.map((e) => ({
        panelist: e.panelist,
        model: e.model,
        score: e.score,
        selfConfidence: e.selfConfidence,
      })),
    })
  }

  for (const row of rows) {
    if (row.round === 1) continue
    const prev = rows.find(
      (r) => r.iso3 === row.iso3 && r.dimension === row.dimension && r.round === row.round - 1,
    )
    if (!prev) continue
    row.medianShift = round(row.median - prev.median, 1)
    row.iqrShift = round(row.iqr - prev.iqr, 1)
  }

  rows.sort(
    (a, b) =>
      a.iso3.localeCompare(b.iso3) ||
      DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension) ||
      a.round - b.round,
  )
  return rows
}

export type IndicatorConsensus = {
  indicatorId: string
  dimension: Dimension | null
  registryClass: MeasurementClass | null
  panelClass: MeasurementClass | null
  classDisputed: boolean
  constructValidity: number
  wealthProxyRisk: number
  wealthProxyPrior: number
  redundancyVotes: Array<{ other: string; votes: number }>
  rationales: string[]
}

export function indicatorConsensus(run: DelphiRunFile): IndicatorConsensus[] {
  const groups = new Map<string, typeof run.indicatorJudgements>()
  for (const j of run.indicatorJudgements) {
    const list = groups.get(j.indicatorId) ?? []
    list.push(j)
    groups.set(j.indicatorId, list)
  }

  const rows: IndicatorConsensus[] = []
  for (const [indicatorId, list] of groups) {
    const def = INDICATORS_BY_ID[indicatorId]
    const classCounts = new Map<MeasurementClass, number>()
    for (const j of list) classCounts.set(j.measurementClass, (classCounts.get(j.measurementClass) ?? 0) + 1)
    const ranked = [...classCounts.entries()].sort((a, b) => b[1] - a[1])
    const top = ranked[0]

    const votes = new Map<string, number>()
    for (const j of list) for (const other of j.redundantWith) votes.set(other, (votes.get(other) ?? 0) + 1)

    rows.push({
      indicatorId,
      dimension: def?.dimension ?? null,
      registryClass: def?.measurementClass ?? null,
      panelClass: top ? top[0] : null,
      classDisputed: classCounts.size > 1,
      constructValidity: round(mean(list.map((j) => j.constructValidity)), 2),
      wealthProxyRisk: round(mean(list.map((j) => j.wealthProxyRisk)), 2),
      wealthProxyPrior: def?.wealthProxyPrior ?? 0,
      redundancyVotes: [...votes.entries()]
        .map(([other, n]) => ({ other, votes: n }))
        .sort((a, b) => b.votes - a.votes),
      rationales: list.map((j) => `${j.panelist}: ${j.rationale}`),
    })
  }
  rows.sort((a, b) => a.constructValidity - b.constructValidity)
  return rows
}

/** What the panel said it would need. The direct answer to the data-collection question. */
export function missingEvidenceRanking(
  run: DelphiRunFile,
): Array<{ evidence: string; mentions: number; dimensions: Dimension[] }> {
  const counts = new Map<string, { mentions: number; dimensions: Set<Dimension> }>()
  for (const e of run.cellEstimates) {
    for (const raw of e.missingEvidence) {
      const key = raw.trim().toLowerCase()
      if (!key) continue
      const cur = counts.get(key) ?? { mentions: 0, dimensions: new Set<Dimension>() }
      cur.mentions += 1
      cur.dimensions.add(e.dimension)
      counts.set(key, cur)
    }
  }
  return [...counts.entries()]
    .map(([evidence, v]) => ({ evidence, mentions: v.mentions, dimensions: [...v.dimensions] }))
    .sort((a, b) => b.mentions - a.mentions)
}
