import { DIMENSION_LABELS, factorIncomeBand, headlineFactor } from '@ncb/core'
import type { Diagnostics, FactorHistoryFile, FactorSolution } from '@ncb/core'
import { countWord } from '@/lib/words'

/**
 * The one-factor test, read once for every page that quotes it.
 *
 * If the nine capabilities collapse into one factor that tracks GDP per head,
 * the benchmark's claim fails, and this is the number that would show it.
 * Every sentence below is a template over the published figures: the
 * interpretation moves when the numbers do, so a page cannot keep saying the
 * shared factor is not income after it becomes income. See D137.
 */

export type FactorReading = {
  basis: 'complete' | 'nearFull'
  solution: FactorSolution
  /** The dimensions the solution reads, as a phrase. */
  scope: string
  sharePct: string
  chanceMeanPct: string
  chanceP95Pct: string
  /** The share sits above the 95th percentile of the chance draws. */
  aboveChance: boolean
  incomeBand: 'strong' | 'moderate' | 'weak' | null
  /** One paragraph on the share against chance. */
  shareSentence: string
  /** One paragraph on the factor against income, or null without income. */
  incomeSentence: string | null
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`

export function readFactorTest(diag: Diagnostics): FactorReading | null {
  if (!diag.factorStructure) return null
  const head = headlineFactor(diag.factorStructure)
  if (!head) return null
  const s = head.solution
  const n = s.countries
  const scope =
    head.basis === 'complete'
      ? 'all nine capabilities'
      : `the ${countWord(s.dimensions.length)} capabilities scored almost everywhere (${s.dimensions
          .map((d) => DIMENSION_LABELS[d])
          .join(', ')})`
  const aboveChance = s.firstFactorShare > s.chance.p95
  const rest = pct(1 - s.firstFactorShare)

  const shareSentence = `Over the ${n} countries with ${scope} scored, one shared factor carries ${pct(
    s.firstFactorShare,
  )} of the variation. The same number of unrelated capabilities measured on ${n} countries would give ${pct(
    s.chance.mean,
  )} by chance, and ${pct(s.chance.p95)} in 19 draws out of 20. ${
    aboveChance
      ? `So the capabilities do move together, and ${rest} of the variation sits outside that one factor.`
      : 'So this data cannot tell the shared factor apart from noise.'
  }`

  const band = factorIncomeBand(s.income?.r ?? null)
  const incomeSentence = s.income
    ? `Across the ${s.income.n} of those countries with an income figure, the shared factor correlates ${Math.abs(
        s.income.r,
      ).toFixed(2)} with log GDP per head, so income accounts for ${Math.round(
        s.income.rSquared * 100,
      )}% of it. ${
        band === 'strong'
          ? `The shared factor looks like income. What the benchmark can add beyond income sits in the other ${rest} of the variation and in how a country's capabilities differ from each other.`
          : band === 'moderate'
            ? 'Income accounts for part of the shared factor and leaves a real part of it unexplained.'
            : 'The shared factor is mostly something other than income.'
      }`
    : null

  return {
    basis: head.basis,
    solution: s,
    scope,
    sharePct: pct(s.firstFactorShare),
    chanceMeanPct: pct(s.chance.mean),
    chanceP95Pct: pct(s.chance.p95),
    aboveChance,
    incomeBand: band,
    shareSentence,
    incomeSentence,
  }
}

/** The release history in one sentence: its range and its largest single move. */
export function factorHistorySentence(history: FactorHistoryFile): string | null {
  const rows = history.releases
  if (rows.length < 2) return null
  const shares = rows.map((r) => r.firstFactorShare)
  let move = { at: 1, delta: 0 }
  for (let i = 1; i < rows.length; i++) {
    const delta = (shares[i] as number) - (shares[i - 1] as number)
    if (Math.abs(delta) > Math.abs(move.delta)) move = { at: i, delta }
  }
  const before = rows[move.at - 1]
  const after = rows[move.at]
  const range = `Across ${rows.length} dataset releases the share has run from ${pct(
    Math.min(...shares),
  )} to ${pct(Math.max(...shares))}.`
  if (!before || !after || move.delta === 0) return range
  return `${range} The largest move between two releases came at dataset ${after.version}, from ${pct(
    before.firstFactorShare,
  )} on ${before.countries} countries to ${pct(after.firstFactorShare)} on ${after.countries}.`
}
