import {
  DIMENSION_LABELS,
  RESIDUAL_LOO_FRAGILE_SD,
  RESIDUAL_STABILITY_BANDS,
  factorIncomeBand,
} from '@ncb/core'
import type { Diagnostics, ResidualStructure } from '@ncb/core'
import { readFactorTest } from '@/lib/factor'

/**
 * What is left after income, read once for every page that quotes it.
 *
 * The four aggregate tests of D138 sit in `diagnostics.residualStructure`.
 * Every sentence here is a template over the published figures, and the
 * verdict each sentence states is chosen by the reading the core computed
 * under the rules D138 fixed before the first run. A page cannot keep saying
 * shapes differ at the same income after the data stops saying so.
 *
 * Nothing here reads or prints a country's residual. The structure carries
 * none, and per-country residuals stay offline under D65.
 */

export type ResidualReading = {
  rs: ResidualStructure
  /** Countries with all nine residuals: the n behind (a), (b) and (d). */
  n: number
  /** (a) Does what is left after income move together? */
  structureSentence: string | null
  /** (b) Do countries at the same income have different shapes? */
  peerSentence: string | null
  /** (c) Does the order of what is left hold between releases and without any one country? */
  stabilitySentence: string | null
  looSentence: string
  /** (d) How much of a profile is income? */
  incomeShareSentence: string | null
  /** The strong claim, from the shared factor (D137). */
  strongClaimSentence: string | null
  /** The weaker claim, from (a), (b) and (c). */
  weakClaimSentence: string | null
  /** The weaker claim in one clause-length sentence, for the front page's income module. */
  shortSentence: string | null
}

/**
 * Below this gap between the shape share and its random 95th percentile, the
 * page says the margin is narrow. Descriptive only: it never changes a
 * verdict, which is the rule D138 fixed.
 */
export const NARROW_MARGIN = 0.05

const pct = (x: number) => `${(x * 100).toFixed(1)}%`
const two = (x: number) => x.toFixed(2)

function listLabels(labels: string[]): string {
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

export function readResidualStructure(diag: Diagnostics): ResidualReading | null {
  const rs = diag.residualStructure
  if (!rs) return null
  const n = rs.completeCases

  let structureSentence: string | null = null
  const a = rs.structure
  if (a) {
    const heavy = a.loadings
      .filter((l) => Math.abs(l.loading) >= 0.5)
      .sort((x, y) => Math.abs(y.loading) - Math.abs(x.loading))
      .map((l) => DIMENSION_LABELS[l.dimension])
    structureSentence =
      a.reading === 'structure'
        ? `Take out of each capability the part its income predicts, and the leftovers still move together. Across the ${a.countries} countries with all nine, one factor carries ${pct(a.firstFactorShare)} of what is left, where unrelated leftovers would give ${pct(a.chance.mean)} by chance and ${pct(a.chance.p95)} in 19 draws out of 20.${
            heavy.length ? ` It runs mostly through ${listLabels(heavy)}.` : ''
          }`
        : `Take out of each capability the part its income predicts, and the leftovers do not move together. Across the ${a.countries} countries with all nine, one factor carries ${pct(a.firstFactorShare)} of what is left, which chance alone reaches (${pct(a.chance.p95)} in 19 draws out of 20). What is left looks like separate noise around each income line.`
  }

  let peerSentence: string | null = null
  const b = rs.peers
  if (b) {
    const levelNote =
      b.observedMean < b.noiseFloor.p5
        ? ` Neighbors still differ less than leftovers dealt out at random would (${two(b.observedMean)} against ${two(b.noiseFloor.mean)}), because part of what is left is a level: a country above its income line on one capability tends to sit above it on others.`
        : ''
    peerSentence =
      b.reading === 'differ'
        ? `Countries at the same income do not share a shape. A country's shape sits ${b.observedMean > b.incomeNull.p95 ? 'farther from' : 'about as far from'} its ${b.peerCount} nearest neighbors in income ${b.observedMean > b.incomeNull.p95 ? 'than from' : 'as from'} countries picked at random (a mean distance of ${two(b.observedMean)} against ${two(b.incomeNull.mean)}), and the shapes line up along patterns that leftovers dealt out at random do not produce: one pattern carries ${pct(b.shapeShare)} of them, against ${pct(b.shapeNull.p95)} at the random 95th percentile.${levelNote}`
        : b.reading === 'alike'
          ? `Countries at the same income share a shape. A country's ${b.peerCount} nearest neighbors in income are closer to it in shape than countries picked at random (a mean distance of ${two(b.observedMean)} against ${two(b.incomeNull.p5)} at the random 5th percentile), so income predicts which capabilities a country is strong on as well as how strong it is.`
          : `Countries at the same income differ in shape, but only by as much as leftovers dealt out at random would. Their shapes line up along no pattern chance does not also produce: one pattern carries ${pct(b.shapeShare)} of them, against ${pct(b.shapeNull.p95)} at the random 95th percentile.${levelNote}`
  }

  let stabilitySentence: string | null = null
  const c = rs.stability.releases
  if (c) {
    const tested = c.perDimension.filter((d) => d.min !== null)
    const worst = tested.reduce<(typeof tested)[number] | null>(
      (w, d) => (w === null || (d.min as number) < (w.min as number) ? d : w),
      null,
    )
    const pairs = tested.reduce((sum, d) => sum + d.pairs, 0)
    if (c.reading === 'untested' || !worst) {
      stabilitySentence = `No pair of releases has yet changed the leftovers on the same countries, so whether their order holds still is untested.`
    } else if (c.reading === 'churning') {
      const churned = tested
        .filter((d) => (d.min as number) < RESIDUAL_STABILITY_BANDS.churning)
        .map((d) => DIMENSION_LABELS[d.dimension])
      stabilitySentence = `On ${listLabels(churned)}, the order of the leftovers reshuffles when the indicators change: the rank correlation with the release before falls to ${two(worst.min as number)} (n ${worst.minCountries}). There the leftovers read the choice of indicators more than the countries.`
    } else if (c.reading === 'stable') {
      stabilitySentence = `The order of the leftovers holds between releases. Across ${pairs} capability-by-release comparisons where an indicator change moved them, the rank correlation with the release before never fell below ${two(worst.min as number)}.`
    } else {
      stabilitySentence = `The order of the leftovers mostly holds between releases. Across ${pairs} capability-by-release comparisons where an indicator change moved them, the rank correlation with the release before fell as low as ${two(worst.min as number)} on ${DIMENSION_LABELS[worst.dimension]} (n ${worst.minCountries}), and never below ${two(RESIDUAL_STABILITY_BANDS.churning)}, where the page would say the leftovers read the indicators more than the countries.`
    }
  }

  const loo = rs.stability.leaveOneOut
  const maxSlope = Math.max(...loo.perDimension.map((d) => d.maxSlopeShiftSe))
  const maxOwn = loo.perDimension.reduce((w, d) => (d.maxResidualShiftSd > w.maxResidualShiftSd ? d : w))
  const looSentence =
    loo.reading === 'robust'
      ? `Dropping any one country moves an income line by at most ${two(maxSlope)} standard errors, and that country's own leftover by at most ${two(maxOwn.maxResidualShiftSd)} of the spread around the line, so no single country carries a line.`
      : `Dropping one country moves its own leftover on ${DIMENSION_LABELS[maxOwn.dimension]} by ${two(maxOwn.maxResidualShiftSd)} of the spread around the line, past the ${RESIDUAL_LOO_FRAGILE_SD} the method allows, so that line leans on single countries.`

  const d = rs.incomeShare
  const incomeShareSentence = d
    ? `For the typical country, income accounts for ${pct(d.median)} of how far its profile sits from the average profile, and ${pct(d.mean)} on average across ${d.countries} countries${
        d.mean < d.median ? ', pulled down by countries the income line misses by more than the average profile does' : ''
      }. ${
        d.reading === 'most'
          ? 'Most of a capability profile is income.'
          : d.reading === 'part'
            ? 'Income is part of a capability profile, and most of it is something else.'
            : 'Little of a capability profile is income.'
      }`
    : null

  const factor = readFactorTest(diag)
  const band = factorIncomeBand(factor?.solution.income?.r ?? null)
  const strongClaimSentence = band
    ? band === 'strong'
      ? 'The strong claim, that capability is separate from wealth, does not hold for what the nine capabilities share: that shared part is mostly income.'
      : band === 'moderate'
        ? 'The strong claim, that capability is separate from wealth, holds in part: income accounts for some of what the nine capabilities share and leaves a real part of it.'
        : 'The strong claim, that capability is separate from wealth, holds for what the nine capabilities share: that shared part is mostly something other than income.'
    : null

  let weakClaimSentence: string | null = null
  if (rs.weakClaim === 'holds') {
    weakClaimSentence = `The weaker claim holds on this data. Countries at the same income have different capability shapes, and the shapes are organized beyond chance, so a capability profile carries information that income does not.${
      c?.reading === 'mixed' ? ' The order of the leftovers mostly survives indicator changes, so the shapes are not only a product of which indicators were chosen.' : ''
    }${
      b && b.shapeShare - b.shapeNull.p95 < NARROW_MARGIN
        ? ` The margin over chance is narrow, ${pct(b.shapeShare)} against ${pct(b.shapeNull.p95)}, so this is the reading most likely to change as countries are added.`
        : ''
    }`
  } else if (rs.weakClaim === 'mixed') {
    weakClaimSentence =
      b?.reading === 'differ'
        ? 'The weaker claim is not settled. Countries at the same income have different shapes, but the order of what is left reshuffles when the indicators change, so part of the difference is the choice of indicators.'
        : 'The weaker claim is not settled. Something is left after income, but it behaves like a level more than a shape: the test cannot show that countries at the same income differ in which capabilities they are strong on by more than chance.'
  } else if (rs.weakClaim === 'fails') {
    weakClaimSentence =
      b?.reading === 'alike'
        ? 'The weaker claim fails on this data. Countries at the same income share a shape, so a capability profile adds little that income does not already say.'
        : 'The weaker claim fails on this data. What is left after income behaves like noise, so a capability profile adds little that income does not already say.'
  }

  const shortSentence =
    rs.weakClaim === 'holds'
      ? `Take income out and countries at the same income still differ in which capabilities they are strong on, by more than chance would give across ${n} countries. `
      : rs.weakClaim === 'mixed'
        ? `Take income out and it is not settled, across ${n} countries, whether countries at the same income differ in which capabilities they are strong on. `
        : rs.weakClaim === 'fails'
          ? `Take income out and countries at the same income show no capability shape of their own across ${n} countries. `
          : null

  return {
    rs,
    n,
    shortSentence,
    structureSentence,
    peerSentence,
    stabilitySentence,
    looSentence,
    incomeShareSentence,
    strongClaimSentence,
    weakClaimSentence,
  }
}
