import { COUNTRIES, DIMENSIONS, FOR_AGENTS_DOC, docHref, incomePeers } from '@ncb/core'
import type { CountryResult, IncomeRow } from '@ncb/core'
import { countryForDigest } from '@/lib/digest'
import { countryLayer, layerSection, type LayerSectionId } from '@/lib/layers'
import {
  capabilityHref,
  compareHref,
  contactTopicHref,
  countryCsvHref,
  countryMapHref,
  countryProfileHref,
  decisionsHref,
  layerSectionHref,
  limitsHref,
  sourcesHref,
} from '@/lib/links'
import { MCP_URL } from '@/lib/mcp-card'

/**
 * The press page: where each kind of number lives, how to cite it, who to ask.
 * Each entry links one real page. The ground page's example country is the
 * country of the week, a rule and never a hand-picked country, so the page
 * shows a different country each week. See D193.
 */

export type PressEntry = { label: string; note: string; href: string }

export type PressWords = {
  title: string
  /** {n}: the number of countries. */
  intro: string
  whereHeading: string
  citeHeading: string
  citeBody: string
  citeRules: string
  contactHeading: string
  contactBody: string
  contactLink: string
}

export const PRESS_WORDS_EN: PressWords = {
  title: 'Where each number lives and how to cite it',
  intro:
    'NCB scores {n} countries on nine capabilities from public data, and every score comes with the confidence behind it. Each line below opens a real page you can quote from.',
  whereHeading: 'Where each number lives',
  citeHeading: 'How to cite',
  citeBody:
    'The box at the foot of every page gives the dataset version, the page address and the date you read it. Quote a score with its confidence beside it. A score without its confidence claims more than the data supports.',
  citeRules: 'Read the quoting rules',
  contactHeading: 'Who to ask',
  contactBody: 'Send a question about a number, or ask for an interview, through the contact form.',
  contactLink: 'Open the contact form',
}

export const PRESS_WORDS_PT_BR: PressWords = {
  title: 'Onde está cada número e como citar',
  intro:
    'O NCB pontua {n} países em nove capacidades com dados públicos, e cada pontuação traz ao lado a solidez da evidência. Cada linha abaixo abre uma página que pode ser citada.',
  whereHeading: 'Onde está cada número',
  citeHeading: 'Como citar',
  citeBody:
    'O quadro no pé de cada página traz a versão dos dados, o endereço da página e a data da consulta. Cite cada pontuação com a solidez ao lado. Sem a solidez, a pontuação afirma mais do que os dados sustentam.',
  citeRules: 'Veja as regras de citação, em inglês',
  contactHeading: 'Com quem falar',
  contactBody: 'Dúvidas sobre um número ou pedidos de entrevista vão pelo formulário de contato, em inglês.',
  contactLink: 'Abrir o formulário',
}

export const pressRulesHref = docHref(FOR_AGENTS_DOC)
export const pressContactHref = contactTopicHref('general')
export const pressCountryCount = COUNTRIES.length

/** The ground page's entries, around the week's country and its nearest income peer. */
export function groundPressEntries(
  countries: CountryResult[],
  income: readonly IncomeRow[],
  now: Date = new Date(),
): PressEntry[] {
  const country = countryForDigest(now, countries)
  if (!country) return []
  const iso3 = country.iso3
  const peer = incomePeers(income, iso3, 1).peers[0]?.iso3
  const name = country.country
  const firstDimension = DIMENSIONS[0]
  return [
    { label: `${name}: nine scores`, note: 'Each score with its confidence and the indicators it rests on.', href: countryProfileHref(iso3) },
    ...(firstDimension
      ? [{ label: 'One capability in every country', note: 'All countries on one 0 to 100 scale.', href: capabilityHref(firstDimension) }]
      : []),
    { label: `${name} against its income peers`, note: 'Each capability against the median of the 10 countries nearest in income.', href: countryMapHref(iso3) },
    ...(peer
      ? [{ label: 'Countries side by side', note: 'Up to four countries on one chart, with every score.', href: compareHref([iso3, peer]) }]
      : []),
    { label: `${name} as a spreadsheet`, note: 'Every indicator row, value, year and source.', href: countryCsvHref(iso3) },
    { label: 'Every source', note: 'Who publishes each series and how it is fetched.', href: sourcesHref },
    { label: 'What the numbers get wrong', note: 'Known artefacts to read before quoting a score.', href: limitsHref },
    { label: 'Every method decision', note: 'Why each choice was made and what would overturn it.', href: decisionsHref },
    { label: 'For AI assistants', note: 'A read-only MCP server. No account is needed.', href: MCP_URL },
  ]
}

const sectionHref = (iso3: string, id: LayerSectionId): string | null => {
  const layer = countryLayer(iso3)
  const section = layer ? layerSection(layer, id) : null
  return layer && section ? layerSectionHref(layer, section) : null
}

/** Brazil's layer entries, in Portuguese. */
export function brazilPressEntries(): PressEntry[] {
  const entries: Array<PressEntry | null> = [
    href('Achados sobre o Brasil', 'Três comparações com um número na manchete, cada uma com imagem para compartilhar.', sectionHref('BRA', 'stories')),
    href('O Brasil entre países de renda parecida', 'Cada capacidade contra a mediana dos 10 países de renda mais próxima.', sectionHref('BRA', 'map')),
    href('A agenda de capacidades', 'O que medir e o que acompanhar, calculado dos dados.', sectionHref('BRA', 'agenda')),
    href('Os estados', 'A leitura subnacional do Brasil.', sectionHref('BRA', 'local')),
    href('Como o Brasil mudou desde 2000', 'As nove capacidades ano a ano, com a faixa de erro.', sectionHref('BRA', 'history')),
    href('Resumo em duas páginas', 'O retrato do Brasil para ler ou imprimir.', sectionHref('BRA', 'brief')),
    { label: 'Os dados do Brasil em planilha', note: 'Cada indicador com valor, ano e fonte.', href: countryCsvHref('BRA') },
    { label: 'Fontes, em inglês', note: 'Quem publica cada série e como ela é coletada.', href: sourcesHref },
    { label: 'Limites conhecidos, em inglês', note: 'O que ler antes de citar uma pontuação.', href: limitsHref },
    { label: 'Para assistentes de IA', note: 'Um servidor MCP só de leitura. Não precisa de conta.', href: MCP_URL },
  ]
  return entries.filter((e): e is PressEntry => e !== null)
}

function href(label: string, note: string, target: string | null): PressEntry | null {
  return target ? { label, note, href: target } : null
}
