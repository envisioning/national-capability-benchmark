import { fillLex } from '../i18n/types.js'
import type { Lexicon, StoryStrings } from '../i18n/types.js'
import { countryName, countryTopic, fmt, fmtConf } from './agenda.js'
import type { ShapeMatch, Story, StoryCell } from './stories.js'

/**
 * A story in words: every sentence the page and the share card print, filled
 * from one lexicon. The page and the card call this and never fill a story
 * template themselves, so the two cannot say different things. See D192.
 */
export type StoryText = {
  /** The story as a reader would ask it: the entry point on a front page. */
  question: string
  title: string
  headline: string
  /** The paragraphs under the headline, in order. */
  dek: string[]
  /** The caveat a thin-evidence subject carries, or null. */
  caveat: string | null
  how: string
}

/** The country with the genitive its article needs: "do Brasil", "de Portugal". */
export function ofCountry(lex: Lexicon, strings: StoryStrings, iso3: string): string {
  const article = lex.countryArticles[iso3] ?? ''
  return `${strings.of[article] ?? strings.of[''] ?? ''} ${countryName(lex, iso3)}`.trim()
}

/** A score with its confidence, as one cell prints it. */
export const storyCell = (lex: Lexicon, strings: StoryStrings, cell: StoryCell): string =>
  fillLex(lex, strings.cell, { score: fmt(cell.score, lex.numberLocale), confidence: fmtConf(cell.confidence, lex.numberLocale) })

const percentApart = (ratio: number): number => Math.round(Math.abs(ratio - 1) * 100)

function incomeSentence(lex: Lexicon, s: StoryStrings, match: ShapeMatch): string | null {
  if (match.incomeRatio === null) return null
  const pct = percentApart(match.incomeRatio)
  const values = { ofMatch: ofCountry(lex, s, match.iso3), pct }
  if (pct === 0) return s.shapeMirror.incomeLevel
  return fillLex(lex, match.incomeRatio > 1 ? s.shapeMirror.incomeMore : s.shapeMirror.incomeLess, values)
}

/** The two dimensions where two shapes sit farthest apart, as one list. */
function widestList(lex: Lexicon, s: StoryStrings, subjectIso: string, match: ShapeMatch): string {
  return [...match.rows]
    .sort((a, b) => Math.abs(b.subject.score - b.other.score) - Math.abs(a.subject.score - a.other.score))
    .slice(0, 2)
    .map((row) =>
      fillLex(lex, s.peerContrast.widestItem, {
        dimension: lex.dimensions[row.dimension],
        country: countryName(lex, subjectIso),
        a: fmt(row.subject.score, lex.numberLocale),
        match: countryName(lex, match.iso3),
        b: fmt(row.other.score, lex.numberLocale),
      }),
    )
    .join('; ')
}

/**
 * Every sentence of one story through one lexicon, or null where the lexicon
 * carries no story words.
 */
export function storyText(lex: Lexicon, story: Story): StoryText | null {
  const s = lex.stories
  if (!s) return null
  const iso3 = story.iso3
  const base = {
    countryTopic: countryTopic(lex, iso3),
    country: countryName(lex, iso3),
    ofCountry: ofCountry(lex, s, iso3),
  }
  const caveatOf = (template: string, thin: number): string | null =>
    thin > 0 ? fillLex(lex, template, { ...base, thin: s.countWords[thin] ?? String(thin) }) : null

  switch (story.id) {
    case 'shape_mirror': {
      const match = story.matches[0]
      if (!match) return null
      const values = { ...base, match: countryName(lex, match.iso3), ofMatch: ofCountry(lex, s, match.iso3) }
      return {
        question: fillLex(lex, s.shapeMirror.question, values),
        title: fillLex(lex, s.shapeMirror.title, values),
        headline: fillLex(lex, s.shapeMirror.headline, values),
        dek: [
          fillLex(lex, s.shapeMirror.dek, { ...values, candidates: story.candidates }),
          incomeSentence(lex, s, match),
        ].filter((p): p is string => p !== null),
        caveat: caveatOf(s.shapeMirror.thinCaveat, story.subjectThin),
        how: s.shapeMirror.how,
      }
    }
    case 'peer_contrast': {
      const match = story.peers[0]
      const nearest = story.peers[story.peers.length - 1]
      if (!match || !nearest) return null
      const values = { ...base, match: countryName(lex, match.iso3), peerCount: story.peerCount }
      return {
        question: fillLex(lex, s.peerContrast.question, values),
        title: fillLex(lex, s.peerContrast.title, values),
        headline: fillLex(lex, s.peerContrast.headline, values),
        dek: [
          fillLex(lex, s.peerContrast.dek, {
            distance: fmt(match.distance, lex.numberLocale),
            nearest: countryName(lex, nearest.iso3),
            nearestDistance: fmt(nearest.distance, lex.numberLocale),
          }),
          fillLex(lex, s.peerContrast.widest, { list: widestList(lex, s, iso3, match) }),
        ],
        caveat: caveatOf(s.peerContrast.thinCaveat, story.subjectThin),
        how: fillLex(lex, s.peerContrast.how, { peerCount: story.peerCount }),
      }
    }
    case 'peer_standing': {
      const dimensionList = (rows: typeof story.rows) =>
        rows.map((row) => `${lex.dimensions[row.dimension]} (${fmt(row.gap, lex.numberLocale)})`).join(', ')
      const above = story.above
      const dek: string[] = []
      if (above) {
        dek.push(
          fillLex(lex, s.peerStanding.dek, {
            dimension: lex.dimensions[above.dimension],
            score: storyCell(lex, s, above.subject),
            median: fmt(above.peerMedian, lex.numberLocale),
          }),
        )
      }
      dek.push(
        story.below
          ? fillLex(lex, s.peerStanding.below, {
              dimension: lex.dimensions[story.below.dimension],
              gap: fmt(story.below.gap, lex.numberLocale),
            })
          : s.peerStanding.belowNone,
      )
      if (story.thinBelow.length > 0) {
        dek.push(fillLex(lex, s.peerStanding.thinBelow, { list: dimensionList(story.thinBelow) }))
      }
      return {
        question: fillLex(lex, s.peerStanding.question, base),
        title: fillLex(lex, s.peerStanding.title, base),
        headline: above
          ? fillLex(lex, s.peerStanding.headline, {
              ...base,
              gap: fmt(above.gap, lex.numberLocale),
              dimension: lex.dimensions[above.dimension],
              peerCount: story.peerCount,
            })
          : fillLex(lex, s.peerStanding.headlineNone, base),
        dek,
        caveat: null,
        how: fillLex(lex, s.peerStanding.how, { peerCount: story.peerCount }),
      }
    }
  }
}

/** One line of the nearest-shapes list: the country, the distance and the income difference. */
export function shapeMatchLine(lex: Lexicon, match: ShapeMatch): string {
  const s = lex.stories
  if (!s) return countryName(lex, match.iso3)
  return fillLex(lex, s.shapeMirror.matchLine, {
    match: countryName(lex, match.iso3),
    distance: fmt(match.distance, lex.numberLocale),
    income: incomeSentence(lex, s, match) ?? '',
  }).trim()
}

/** One line of the income-peer list: the country and its shape distance. */
export function peerShapeLine(lex: Lexicon, match: ShapeMatch): string {
  const s = lex.stories
  if (!s) return countryName(lex, match.iso3)
  return fillLex(lex, s.peerContrast.peerLine, {
    match: countryName(lex, match.iso3),
    distance: fmt(match.distance, lex.numberLocale),
  })
}
