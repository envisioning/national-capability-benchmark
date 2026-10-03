import { LEXICONS, countryName } from '@ncb/core'
import type { Lang, Lexicon } from '@ncb/core'
import { layerBySlug } from '@/lib/layers'
import type { NavNode } from '@/lib/nav'

/**
 * The site's own chrome in the reader's language.
 *
 * The header, the search palette, the objection dialog and the footer sit
 * above and below every page, so on a layer page they were the English that
 * leaked into a Portuguese reading. A layer page is known by its path alone:
 * the first segment is a layer's slug in `COUNTRY_LAYERS`. Everywhere else
 * the chrome stays English, because the ground layer is English and no page
 * outside a layer is ever offered in another language (D69). This is not a
 * language switch: nothing here changes what a page says, only the words
 * around it. A language with no entry in `CHROME_WORDS` keeps the English
 * chrome. See D158.
 */

/** The language a path is written in: a layer's own, or the ground layer's English. */
export function pathLang(pathname: string | null | undefined): Lang {
  const first = (pathname ?? '').split('/')[1]
  return (first ? layerBySlug(first)?.lang : undefined) ?? 'en'
}

export type ChromeWords = {
  skipToContent: string
  /** Accessible name of the wordmark link. */
  home: string
  sectionsAria: string
  breadcrumbAria: string
  pagesAria: string
  siteAria: string
  mobileSectionsAria: string
  openMenu: string
  closeMenu: string
  /** {label}: the disclosure that opens one section's pages on a phone. */
  sectionPages: string
  /**
   * Nav labels by their English label. The tree in `nav.ts` stays English;
   * a label with no entry here is printed as the tree has it.
   */
  nav: Record<string, string>
  search: {
    button: string
    aria: string
    placeholder: string
    inputAria: string
    resultsAria: string
    empty: string
    navigate: string
    open: string
    close: string
    groups: Record<'Pages' | 'Countries' | 'Capabilities' | 'Indicators', string>
  }
  challenge: {
    button: string
    title: string
    intro: string
    close: string
    country: string
    capability: string
    attaches: string
    argument: string
    argumentPlaceholder: string
    sourceUrl: string
    optional: string
    /** {status}: the status a new objection starts in. */
    publicNote: string
    cancel: string
    submit: string
    submitting: string
    failed: string
  }
  footer: {
    tagline: string
    sub: string
    /** Before and after the Envisioning link. */
    poweredBefore: string
    poweredAfter: string
    projectAria: string
    app: string
    dataset: string
    changelog: string
    license: string
  }
}

export const CHROME_WORDS_EN: ChromeWords = {
  skipToContent: 'Skip to content',
  home: 'NCB, National Capability Benchmark home',
  sectionsAria: 'Sections',
  breadcrumbAria: 'Breadcrumb',
  pagesAria: 'Pages',
  siteAria: 'Site',
  mobileSectionsAria: 'Mobile sections',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  sectionPages: '{label} pages',
  nav: {},
  search: {
    button: 'Search',
    aria: 'Search the benchmark',
    placeholder: 'Search pages, countries, capabilities, indicators...',
    inputAria: 'Search pages, countries, capabilities and indicators',
    resultsAria: 'Search results',
    empty: 'No matching pages, countries, capabilities or indicators.',
    navigate: 'Navigate with ↑ ↓',
    open: 'Enter to open',
    close: 'Esc to close',
    groups: {
      Pages: 'Pages',
      Countries: 'Countries',
      Capabilities: 'Capabilities',
      Indicators: 'Indicators',
    },
  },
  challenge: {
    button: 'Challenge',
    title: 'Challenge the benchmark',
    intro: 'Choose a score and give the benchmark a specific reason to reconsider it.',
    close: 'Close',
    country: 'Country',
    capability: 'Capability',
    attaches:
      'When you submit, the form attaches the current score and confidence for the country and capability you chose.',
    argument: 'Your argument',
    argumentPlaceholder: 'What evidence or reasoning shows that this score misreads the country?',
    sourceUrl: 'Source URL',
    optional: '(optional)',
    publicNote:
      'Submissions are public and start as {status}. A maintainer can add a response and signature after review.',
    cancel: 'Cancel',
    submit: 'Submit dispute',
    submitting: 'Submitting…',
    failed: 'Could not submit the dispute.',
  },
  footer: {
    tagline:
      'NCB measures whether a country can anticipate change, coordinate around it and build what it decides to build.',
    sub: 'Nine capabilities from public data, each with the confidence behind it.',
    poweredBefore: 'Powered by ',
    poweredAfter: ', a technology research institute and advisory.',
    projectAria: 'Project and legal information',
    app: 'App',
    dataset: 'Dataset',
    changelog: 'Changelog',
    license: 'License',
  },
}

/**
 * The chrome in Brazilian Portuguese. The pages these links reach are
 * English, as the ground layer is; the words around a Portuguese page are
 * not. See D158.
 */
const CHROME_WORDS_PT_BR: ChromeWords = {
  skipToContent: 'Ir para o conteúdo',
  home: 'NCB, página inicial',
  sectionsAria: 'Seções',
  breadcrumbAria: 'Trilha de navegação',
  pagesAria: 'Páginas',
  siteAria: 'Mapa do site',
  mobileSectionsAria: 'Seções',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  sectionPages: 'Páginas de {label}',
  nav: {
    Countries: 'Países',
    Capabilities: 'Capacidades',
    Method: 'Método',
    Participate: 'Participe',
    About: 'Sobre',
    'All countries': 'Todos os países',
    Compare: 'Comparar',
    Agendas: 'Agendas',
    Overview: 'Visão geral',
    Indicators: 'Indicadores',
    Explore: 'Explorar',
    Sources: 'Fontes',
    Diagnostics: 'Diagnósticos',
    'Delphi panel': 'Painel Delphi',
    Patterns: 'Padrões',
    Limits: 'Limites',
    Decisions: 'Decisões',
    Glossary: 'Glossário',
    'Ways to help': 'Como ajudar',
    'Open gaps': 'Lacunas abertas',
    Objections: 'Contestações',
    Contact: 'Contato',
    Thesis: 'Tese',
    Changelog: 'Histórico de versões',
    Profile: 'Perfil',
    Agenda: 'Agenda',
    Map: 'Mapa',
    Institutions: 'Instituições',
    'Local reading': 'Leitura local',
  },
  search: {
    button: 'Buscar',
    aria: 'Buscar no NCB',
    placeholder: 'Buscar páginas, países, capacidades, indicadores…',
    inputAria: 'Buscar páginas, países, capacidades e indicadores',
    resultsAria: 'Resultados da busca',
    empty: 'Nenhuma página, país, capacidade ou indicador encontrado.',
    navigate: 'Navegue com ↑ ↓',
    open: 'Enter para abrir',
    close: 'Esc para fechar',
    groups: {
      Pages: 'Páginas',
      Countries: 'Países',
      Capabilities: 'Capacidades',
      Indicators: 'Indicadores',
    },
  },
  challenge: {
    button: 'Contestar',
    title: 'Contestar uma pontuação',
    intro: 'Escolha uma pontuação e dê ao NCB um motivo específico para revê-la.',
    close: 'Fechar',
    country: 'País',
    capability: 'Capacidade',
    attaches:
      'Ao enviar, o formulário anexa a pontuação e a solidez da evidência atuais do país e da capacidade escolhidos.',
    argument: 'Seu argumento',
    argumentPlaceholder: 'Que evidência ou raciocínio mostra que esta pontuação lê mal o país?',
    sourceUrl: 'Link da fonte',
    optional: '(opcional)',
    publicNote:
      'As contestações são públicas, ficam na página de contestações, em inglês, e começam aguardando revisão. Um mantenedor pode acrescentar uma resposta assinada depois de examiná-las.',
    cancel: 'Cancelar',
    submit: 'Enviar contestação',
    submitting: 'Enviando…',
    failed: 'Não foi possível enviar a contestação.',
  },
  footer: {
    tagline:
      'O NCB mede se um país consegue antecipar mudanças, coordenar-se diante delas e construir o que decide construir.',
    sub: 'Nove capacidades medidas com dados públicos, cada uma com a solidez da evidência ao lado.',
    poweredBefore: 'Desenvolvido pela ',
    poweredAfter: ', instituto de pesquisa e consultoria em tecnologia.',
    projectAria: 'Informações sobre o projeto e a licença',
    app: 'Site',
    dataset: 'Dados',
    changelog: 'Histórico de versões',
    license: 'Licença',
  },
}

const CHROME_WORDS: Partial<Record<Lang, ChromeWords>> = {
  en: CHROME_WORDS_EN,
  'pt-BR': CHROME_WORDS_PT_BR,
}

/** The chrome's words for one language, English where a language has none. */
export const chromeWords = (lang: Lang): ChromeWords => CHROME_WORDS[lang] ?? CHROME_WORDS_EN

/**
 * Whether the chrome reads in the page's language. A language with no chrome
 * words keeps every English label, including country and capability names,
 * so the header never mixes two languages.
 */
const chromeTranslated = (lang: Lang): boolean => lang !== 'en' && lang in CHROME_WORDS

/** The lexicon the chrome reads names from: the page's, where its chrome is translated. */
export const chromeLexicon = (lang: Lang): Lexicon | null =>
  chromeTranslated(lang) ? LEXICONS[lang] : null

/**
 * One nav node's label in the chrome's language. A node written in a layer's
 * language already carries it; a country takes the lexicon's name and a
 * capability the lexicon's dimension; everything else goes through the
 * label table.
 */
export function navLabel(node: NavNode, lang: Lang): string {
  const lex = chromeLexicon(lang)
  if (!lex || node.lang) return node.label
  if (node.iso3) return countryName(lex, node.iso3)
  const capability = /^\/capabilities\/([^/]+)$/.exec(node.href)?.[1]
  if (capability && capability in lex.dimensions) {
    return lex.dimensions[capability as keyof Lexicon['dimensions']]
  }
  return chromeWords(lang).nav[node.label] ?? node.label
}
