import {
  COUNTRIES,
  MAP_PEER_COUNT,
  PT_BR,
  RAISE_BELOW,
  STORY_IDS,
  buildStories,
  fill,
  fmt,
  fmtConf,
  incomePeers,
  readFactorTest,
  readWealthTracking,
  splitAgenda,
  storyById,
  storyText,
} from '@ncb/core'
import type { CountryAgenda, CountryResult, Diagnostics, IncomeRow, StorySet } from '@ncb/core'
import { countryForDigest } from '@/lib/digest'
import { dimensionLabel } from '@/lib/labels'
import { countryLayer, layerSection, type LayerSectionId } from '@/lib/layers'
import {
  agendaHref,
  capabilityHref,
  compareHref,
  countryMapHref,
  layerSectionHref,
  pressHref,
  storyHref,
  thesisHref,
} from '@/lib/links'
import { countWord } from '@/lib/words'

/**
 * The ways into the two front pages: example questions under the search and
 * one card per audience. Every question and every preview line is computed
 * from the current release. The ground page's example country is the country
 * of the week, `countryForDigest`, so no country or number is chosen by hand.
 * See D194.
 */

/** One question a reader might type, and the page that answers it. */
export type EntryQuestion = { text: string; href: string }

/** One audience: the job it comes for, one computed line and one link. */
export type EntryAudience = {
  audience: string
  job: string
  preview: string | null
  linkLabel: string
  href: string
}

/** The week's example country and its nearest income peer, by rule. */
export function weekCountry(
  countries: CountryResult[],
  income: readonly IncomeRow[],
  now: Date = new Date(),
): { country: CountryResult; peer: CountryResult | null } | null {
  const country = countryForDigest(now, countries)
  if (!country) return null
  const peerIso = incomePeers(income, country.iso3, 1).peers[0]?.iso3
  return { country, peer: countries.find((c) => c.iso3 === peerIso) ?? null }
}

/** The ground page's three questions, around the week's country. */
export function groundQuestions(countries: CountryResult[], diag: Diagnostics | null): EntryQuestion[] {
  const week = weekCountry(countries, diag?.income ?? [])
  if (!week) return []
  const { country, peer } = week
  const weakest = diag ? readWealthTracking(diag).weakest : null
  return [
    ...(peer
      ? [{ text: `How does ${country.country} compare with ${peer.country}?`, href: compareHref([country.iso3, peer.iso3]) }]
      : []),
    { text: `Where does ${country.country} stand among countries with similar income?`, href: countryMapHref(country.iso3) },
    ...(weakest
      ? [{ text: `Who leads on ${weakest.label.toLowerCase()}, the capability least tied to income?`, href: capabilityHref(weakest.dimension) }]
      : []),
  ]
}

/** The ground page's audiences. */
export function groundAudiences(
  countries: CountryResult[],
  diag: Diagnostics | null,
  version: string,
  weekAgenda: CountryAgenda | null,
): EntryAudience[] {
  const income = diag?.income ?? []
  const week = weekCountry(countries, income)
  if (!week) return []
  const { country } = week
  const raise = weekAgenda ? splitAgenda(weekAgenda).raise.length : null
  const standing = storyById(
    buildStories({ iso3: country.iso3, version, generatedAt: '', countries, income }),
    'peer_standing',
  )
  const above = standing?.above ?? null
  const factor = diag ? readFactorTest(diag) : null
  return [
    {
      audience: 'Governments and ministries',
      job: `See which capabilities sit below ${RAISE_BELOW} on usable evidence, country by country.`,
      preview:
        raise === null
          ? null
          : `This week's example: ${country.country} has ${countWord(raise)} ${raise === 1 ? 'capability' : 'capabilities'} below ${RAISE_BELOW} with usable evidence.`,
      linkLabel: `Open the agenda for ${country.country}`,
      href: agendaHref(country.iso3),
    },
    {
      audience: 'Development banks and agencies',
      job: `Set a country beside the ${MAP_PEER_COUNT} countries nearest to it in income.`,
      preview: above
        ? `${country.country} sits ${fmt(above.gap, 'en')} points above its income peers' median on ${dimensionLabel(above.dimension).toLowerCase()}, with confidence ${fmtConf(above.subject.confidence, 'en')}.`
        : null,
      linkLabel: `Open the map for ${country.country}`,
      href: countryMapHref(country.iso3),
    },
    {
      audience: 'Researchers',
      job: 'Check, release by release, whether capability is more than income.',
      preview: factor?.solution.income
        ? `One shared factor carries ${factor.sharePct} of the variation and correlates ${Math.abs(factor.solution.income.r).toFixed(2)} with income.`
        : null,
      linkLabel: 'Read the result',
      href: thesisHref,
    },
    {
      audience: 'Journalists',
      job: 'Find where each number lives and how to cite it.',
      preview: `${COUNTRIES.length} countries on one scale, dataset ${version}.`,
      linkLabel: 'Open the press page',
      href: pressHref,
    },
  ]
}

const brazilSectionHref = (id: LayerSectionId): string | null => {
  const layer = countryLayer('BRA')
  const section = layer ? layerSection(layer, id) : null
  return layer && section ? layerSectionHref(layer, section) : null
}

/** Brazil's three questions: the stories, asked the way a reader would. */
export function brazilQuestions(set: StorySet | null): EntryQuestion[] {
  const slugs = PT_BR.stories?.slugs
  if (!set || !slugs) return []
  return STORY_IDS.flatMap((id) => {
    const story = storyById(set, id)
    const text = story ? storyText(PT_BR, story) : null
    const href = storyHref('BRA', slugs[id])
    return text && href ? [{ text: text.question, href }] : []
  })
}

/** Brazil's audiences, in Portuguese. */
export function brazilAudiences(
  set: StorySet | null,
  agenda: CountryAgenda | null,
  scoredCount: number,
): EntryAudience[] {
  const lead = agenda ? splitAgenda(agenda).raise[0] ?? null : null
  const standing = set ? storyById(set, 'peer_standing') : null
  const mirror = set ? storyById(set, 'shape_mirror') : null
  const standingText = standing ? storyText(PT_BR, standing) : null
  const mirrorText = mirror ? storyText(PT_BR, mirror) : null
  const locale = PT_BR.numberLocale
  const cards: Array<EntryAudience | null> = [
    entry(
      'Governo e ministérios',
      `Ver quais capacidades ficam abaixo de ${RAISE_BELOW} com evidência utilizável.`,
      lead && lead.score !== null
        ? fill('A mais baixa: {dimension}, pontuação {score}, solidez {confidence}.', {
            dimension: PT_BR.dimensions[lead.dimension],
            score: fmt(lead.score, locale),
            confidence: fmtConf(lead.confidence, locale),
          })
        : agenda
          ? `Nenhuma capacidade fica abaixo de ${RAISE_BELOW} com evidência utilizável.`
          : null,
      'Abrir a agenda',
      brazilSectionHref('agenda'),
    ),
    entry(
      'Bancos de desenvolvimento e agências',
      `Comparar o Brasil com os ${MAP_PEER_COUNT} países de renda mais próxima, capacidade por capacidade.`,
      standingText ? `${standingText.headline}.` : null,
      'Abrir o mapa',
      brazilSectionHref('map'),
    ),
    entry(
      'Pesquisa',
      'Acompanhar as nove capacidades ano a ano desde 2000, com a faixa de erro.',
      agenda
        ? fill('{scored} indicadores com pontuação e {gaps} lacunas declaradas.', {
            scored: scoredCount,
            gaps: agenda.gapCount,
          })
        : null,
      'Abrir a história',
      brazilSectionHref('history'),
    ),
    entry(
      'Imprensa',
      'Encontrar cada número e saber como citá-lo.',
      mirrorText ? `${mirrorText.headline}.` : null,
      'Abrir a página de imprensa',
      brazilSectionHref('press'),
    ),
  ]
  return cards.filter((c): c is EntryAudience => c !== null)
}

function entry(
  audience: string,
  job: string,
  preview: string | null,
  linkLabel: string,
  href: string | null,
): EntryAudience | null {
  return href ? { audience, job, preview, linkLabel, href } : null
}
