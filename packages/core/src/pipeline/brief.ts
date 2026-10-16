import { DATA_OUT_URL, DIMENSIONS, DIMENSION_LABELS, SITE_ORIGIN } from '../model/index.js'
import type { Dimension, FactorHistoryFile } from '../model/index.js'
import { PT_BR } from '../i18n/pt-br.js'
import { countWord, ptCountWord } from '../i18n/count-words.js'
import { isThinEvidence } from './confidence.js'
import type { Diagnostics } from './diagnostics.js'
import { factorHistorySentence, readFactorTest } from './factor-reading.js'
import { readResidualStructure } from './residual-reading.js'
import { factorHistorySentencePtBr, readVerdictPtBr } from './verdict-pt.js'
import { readWealthTracking } from './wealth-reading.js'

/**
 * The two-page brief, in English and in Brazilian Portuguese.
 *
 * A brief goes ahead of a meeting or is left behind after one, so it has to
 * stand on its own and still say only what the release says. Every number in
 * it comes from the published files, through the same readings `/thesis` and
 * Brazil's verdict section use: `readFactorTest`, `readResidualStructure` and
 * `readWealthTracking` in English, `readVerdictPtBr` in Portuguese. The
 * prose around them restates docs/WHY.md and the decisions, never more. The
 * bench writes it to `data/out/brief/brief.{lang}.md`, and `/brief` and
 * `/brasil/resumo` render the same structure for print. A test holds every
 * number in it to the release files. See D163.
 *
 * It describes and never prescribes (D130): no sentence tells a country what
 * to do, and the one ask in it is the project's own, for outside review and
 * open data. It names no institution.
 */

export type BriefLang = 'en' | 'pt-BR'

export const BRIEF_LANGS: readonly BriefLang[] = ['en', 'pt-BR']

/** A link the brief prints: a viewer path, or an absolute address outside the viewer. */
export type BriefLink = { label: string; href: string; note?: string }

export type BriefSectionId = 'claim' | 'verdict' | 'instrument' | 'use' | 'needs' | 'links'

export type BriefSection = {
  id: BriefSectionId
  heading: string
  paragraphs: string[]
  links?: BriefLink[]
}

export type Brief = {
  lang: BriefLang
  title: string
  /** Dataset version and the generation date, printed as a dateline (D40). */
  dateline: string
  sections: BriefSection[]
  /** Where the numbers come from, in one line. */
  provenance: string
}

/** The release files the brief reads. */
export type BriefInput = {
  /** The dataset version and generation date from `index.json`, and its country count. */
  index: { version?: string; generatedAt: string; countries: readonly unknown[] }
  diagnostics: Diagnostics
  history: FactorHistoryFile | null
}

/** The viewer pages the brief links. Paths, so the page links them in place and the markdown makes them absolute. */
export const BRIEF_PATHS = {
  en: '/brief',
  ptBR: '/brasil/resumo',
  thesis: '/thesis',
  diagnostics: '/diagnostics',
  brazilMap: '/brasil/mapa',
  brazilVerdict: '/brasil#teste',
  support: '/support',
  brazilSupport: '/brasil/apoie',
} as const

/** A thin capability: its mean confidence across countries sits in a thin band. */
type ThinRow = { dimension: Dimension; meanConfidence: number }

function thinDimensions(diag: Diagnostics): ThinRow[] {
  return diag.measurability
    .filter((m) => isThinEvidence(m.meanConfidence))
    .map((m) => ({ dimension: m.dimension, meanConfidence: m.meanConfidence }))
}

function scoredIndicators(diag: Diagnostics): { observed: number; gaps: number } {
  return diag.measurability.reduce(
    (sum, m) => ({ observed: sum.observed + m.indicatorsObserved, gaps: sum.gaps + m.gaps }),
    { observed: 0, gaps: 0 },
  )
}

function listEn(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

function listPt(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`
}

const two = (x: number): string => x.toFixed(2)
const twoPt = (x: number): string =>
  x.toLocaleString(PT_BR.numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

function briefEn(input: BriefInput): Brief | null {
  const diag = input.diagnostics
  const factor = readFactorTest(diag)
  const residual = readResidualStructure(diag)
  if (!factor || !residual) return null
  const wealth = readWealthTracking(diag)
  const history = input.history ? factorHistorySentence(input.history) : null
  const thin = thinDimensions(diag)
  const { observed, gaps } = scoredIndicators(diag)
  const n = input.index.countries.length
  const version = input.index.version ?? 'unversioned'
  const date = input.index.generatedAt.slice(0, 10)

  const tracking = wealth.tracking.map((row) => `${row.label} (${two(row.strength as number)})`)
  const thinList = thin.map((row) => `${DIMENSION_LABELS[row.dimension]} (${two(row.meanConfidence)})`)

  return {
    lang: 'en',
    title: 'The National Capability Benchmark in two pages',
    dateline: `Dataset ${version}, generated ${date}`,
    sections: [
      {
        id: 'claim',
        heading: 'The claim under test',
        paragraphs: [
          "A country's wealth and capability are different. Most international indices measure income, comfort, competitiveness or governance, and often capture much the same thing. The National Capability Benchmark (NCB) tests whether a country's ability to anticipate, act, coordinate, learn, experiment, adapt, build and sustain shared purpose is separate from its income and observable. No indicator is chosen for its correlation with income, so the test can fail.",
          'The claim comes in two strengths. The strong claim is that capability is separate from wealth, so the nine capabilities do not simply follow income. The weaker claim is that countries at the same income have different capability shapes, so a profile says something income does not. If both fail, the nine collapse into one factor that tracks GDP per head.',
        ],
      },
      {
        id: 'verdict',
        heading: 'The test and what it reads today',
        paragraphs: [
          [factor.shareSentence, factor.incomeSentence].filter(Boolean).join(' '),
          ...(history ? [history] : []),
          ...(residual.structureSentence ? [residual.structureSentence] : []),
          [residual.strongClaimSentence, residual.weakClaimSentence].filter(Boolean).join(' '),
          ...(residual.incomeShareSentence ? [residual.incomeShareSentence] : []),
          `All of it rests on ${residual.n} countries with all nine capabilities scored. At that size a handful of countries can move any of these numbers, so each one is a hint a wider country set could overturn. No country's own residual is published while the layer is under review.`,
        ],
      },
      {
        id: 'instrument',
        heading: 'What the instrument is',
        paragraphs: [
          `The benchmark scores ${n} countries on nine capabilities: ${listEn(DIMENSIONS.map((d) => DIMENSION_LABELS[d]))}. Each score runs from 0 to 100 on a scale all ${n} countries set together. Beside it sits a confidence from 0 to 1, which says how much evidence the score rests on, and the two are never combined. The nine are never summed: there is no overall score and no ranking.`,
          `The scores rest on ${observed} indicators from public sources, and ${gaps} more are declared gaps, things the benchmark sets out to measure that no open dataset covers yet. Every observation carries its source, year and address. The published data is under CC BY 4.0 and the code under the MIT license, and every methodological choice is recorded with what would overturn it.`,
        ],
      },
      {
        id: 'use',
        heading: 'What it is good for, and what it is not',
        paragraphs: [
          "It is built for description: one country's nine scores read beside the countries nearest it in income, each with the evidence behind it. It does not rank countries, set targets or give policy advice. A high score is not a model to copy, because mechanisms depend on local conditions.",
          `${capitalize(countWord(wealth.tracking.length))} of the nine track income at or above r ${two(wealth.threshold)}: ${listEn(tracking)}. On ${wealth.tracking.length === 1 ? 'that one' : 'those'}, a score says much of what GDP per head already says, and the benchmark publishes that beside the number.`,
          ...(thin.length
            ? [
                `${capitalize(countWord(thin.length))} of the nine rest on thin evidence, on average across countries: ${listEn(thinList)}. That is a finding about what public data can see, not a gap to hide, and those scores are read with care.`,
              ]
            : []),
        ],
      },
      {
        id: 'needs',
        heading: 'Where it stands and what it needs',
        paragraphs: [
          'The benchmark is a prototype. Envisioning builds it with its own resources, and it asks for no money. Everything is open: the data, the code, the decision record and the known limits.',
          "It needs an outside review of the residual method. The country-by-country reading of what is left after income stays offline until someone outside the project has reviewed it. The questions are set: whether a residual can be read as a second capability score or only as a different shape at the same income, whether fitting the income line without the country being read should replace the fit on all of them, and whether a weak fit should withhold its residuals.",
          `It needs open data partners. The ${gaps} declared gaps, and the evidence grid that documents what countries delivered where no dataset exists, close only when a comparable series or a sourced record is published openly. One series closes a gap for every country at once.`,
        ],
      },
      {
        id: 'links',
        heading: 'Read further',
        paragraphs: [],
        links: [
          { label: 'Thesis', href: BRIEF_PATHS.thesis, note: 'the argument and the computed verdict' },
          { label: 'Diagnostics', href: BRIEF_PATHS.diagnostics, note: 'every figure with its null and the rule that reads it' },
          { label: "Brazil's capability map", href: BRIEF_PATHS.brazilMap, note: 'in Portuguese, Brazil against its income peers' },
          { label: 'The data', href: DATA_OUT_URL, note: 'every published file, CC BY 4.0' },
        ],
      },
    ],
    provenance: `Computed from dataset ${version}: data/out/diagnostics.json (diagnostics.factorStructure, diagnostics.residualStructure) and data/out/factor-history.json. The readings are D137 and D138; the brief is D163.`,
  }
}

function briefPt(input: BriefInput): Brief | null {
  const diag = input.diagnostics
  const verdict = readVerdictPtBr(diag)
  const residual = readResidualStructure(diag)
  if (!verdict || !residual) return null
  const wealth = readWealthTracking(diag)
  const history = input.history ? factorHistorySentencePtBr(input.history) : null
  const thin = thinDimensions(diag)
  const { observed, gaps } = scoredIndicators(diag)
  const n = input.index.countries.length
  const version = input.index.version ?? 'sem versão'
  const date = input.index.generatedAt.slice(0, 10)
  const name = (d: Dimension) => PT_BR.dimensions[d]

  const tracking = wealth.tracking.map((row) => `${name(row.dimension)} (${twoPt(row.strength as number)})`)
  const thinList = thin.map((row) => `${name(row.dimension)} (${twoPt(row.meanConfidence)})`)

  return {
    lang: 'pt-BR',
    title: 'O NCB em duas páginas',
    dateline: `Versão dos dados ${version}, gerada em ${date}`,
    sections: [
      {
        id: 'claim',
        heading: 'A afirmação em teste',
        paragraphs: [
          'Riqueza e capacidade de um país são coisas diferentes. A maior parte dos índices internacionais mede renda, bem-estar, competitividade ou governança, e muitas vezes capta quase a mesma coisa. O NCB (National Capability Benchmark) testa se a capacidade de um país de antecipar, agir, coordenar, aprender, experimentar, se adaptar, construir e sustentar um propósito compartilhado é separada da renda e observável. Nenhum indicador é escolhido pela correlação com a renda, para que o teste possa falhar.',
          verdict.claim,
        ],
      },
      {
        id: 'verdict',
        heading: 'O teste e o que ele mostra hoje',
        paragraphs: [
          [verdict.shareSentence, verdict.incomeSentence].filter(Boolean).join(' '),
          ...(history ? [history] : []),
          ...(verdict.structureSentence ? [verdict.structureSentence] : []),
          [verdict.strongSentence, verdict.weakSentence].filter(Boolean).join(' '),
          ...(verdict.profileSentence ? [verdict.profileSentence] : []),
          `Tudo isso se apoia em ${residual.n} países com as nove capacidades pontuadas. Com esse número, poucos países podem mover qualquer um destes resultados, e cada um é um indício que um conjunto maior de países pode derrubar. O que sobra depois da renda em cada país não é publicado enquanto essa camada estiver em revisão.`,
        ],
      },
      {
        id: 'instrument',
        heading: 'O que é o instrumento',
        paragraphs: [
          `O NCB dá pontuações a ${n} países em nove capacidades: ${listPt(DIMENSIONS.map(name))}. Cada pontuação vai de 0 a 100, numa escala que os ${n} países definem juntos. Ao lado dela fica a solidez da evidência, de 0 a 1, que diz em quanta evidência a pontuação se apoia, e as duas nunca se combinam. As nove nunca se somam: não há pontuação geral nem classificação. Confiança é uma das nove capacidades, e não a solidez da evidência.`,
          `As pontuações se apoiam em ${observed} indicadores de fontes públicas, e outros ${gaps} são lacunas declaradas: o que o NCB pretende medir e nenhuma base aberta cobre ainda. Cada observação traz fonte, ano e endereço. Os dados publicados estão sob a licença CC BY 4.0 e o código sob a licença MIT, e cada escolha de método está registrada com o que a derrubaria.`,
        ],
      },
      {
        id: 'use',
        heading: 'Para que serve, e para que não serve',
        paragraphs: [
          'O NCB serve para descrever: as nove pontuações de um país lidas ao lado das dos países de renda mais próxima, cada uma com a evidência que a sustenta. Não classifica países, não fixa metas e não dá recomendações de política. Uma pontuação alta não é um modelo a copiar, porque os mecanismos dependem das condições locais.',
          `${capitalize(ptCountWord(wealth.tracking.length))} das nove acompanham a renda com correlação de ${twoPt(wealth.threshold)} ou mais: ${listPt(tracking)}. ${wealth.tracking.length === 1 ? 'Nela' : 'Nelas'}, a pontuação diz muito do que o PIB per capita já diz, e o NCB publica isso ao lado do número.`,
          ...(thin.length
            ? [
                `${capitalize(ptCountWord(thin.length))} das nove se apoiam em evidência fraca, na média dos países: ${listPt(thinList)}. Isso é um resultado sobre o que os dados públicos conseguem ver, e não uma falha a esconder; essas pontuações se leem com cuidado.`,
              ]
            : []),
        ],
      },
      {
        id: 'needs',
        heading: 'Onde está e do que precisa',
        paragraphs: [
          'O NCB é um protótipo. A Envisioning o constrói com recursos próprios, e ele não pede dinheiro. Tudo é aberto: os dados, o código, o registro de decisões e os limites conhecidos.',
          'O projeto precisa de uma revisão externa do método do resíduo. A leitura, país por país, do que sobra depois da renda fica fora do ar até que alguém de fora do projeto a revise. As perguntas estão definidas: se um resíduo pode ser lido como uma segunda pontuação de capacidade ou apenas como um perfil diferente com a mesma renda, se ajustar a linha de renda sem o país em leitura deve substituir o ajuste com todos, e se um ajuste fraco deve reter os seus resíduos.',
          `Precisa também de parceiros de dados abertos. As ${gaps} lacunas declaradas, e a grade de evidência que documenta o que países entregaram onde não há base de dados, só se fecham quando uma série comparável ou um registro com fonte é publicado de forma aberta. Uma série fecha uma lacuna para todos os países de uma vez.`,
        ],
      },
      {
        id: 'links',
        heading: 'Para continuar',
        paragraphs: [],
        links: [
          { label: 'O teste na camada do Brasil', href: BRIEF_PATHS.brazilVerdict, note: 'em português' },
          { label: 'A tese', href: BRIEF_PATHS.thesis, note: 'o argumento e o veredito calculado, em inglês' },
          { label: 'Os diagnósticos', href: BRIEF_PATHS.diagnostics, note: 'cada número com o seu nulo e a regra que o lê, em inglês' },
          { label: 'O mapa de capacidades do Brasil', href: BRIEF_PATHS.brazilMap, note: 'o Brasil diante dos pares de renda' },
          { label: 'Os dados', href: DATA_OUT_URL, note: 'todos os arquivos publicados, CC BY 4.0' },
        ],
      },
    ],
    provenance: `Calculado a partir da versão dos dados ${version}: data/out/diagnostics.json (diagnostics.factorStructure, diagnostics.residualStructure) e data/out/factor-history.json. As leituras são as decisões D137 e D138; o resumo, a D163.`,
  }
}

/** The brief in one language, or null when the release carries no factor or residual test. */
export function buildBrief(input: BriefInput, lang: BriefLang): Brief | null {
  return lang === 'en' ? briefEn(input) : briefPt(input)
}

/** A viewer path as an absolute address; an absolute address stays as it is. */
export const briefAbsolute = (href: string, origin: string = SITE_ORIGIN): string =>
  /^https?:\/\//.test(href) ? href : `${origin.replace(/\/+$/, '')}${href}`

/** The brief as markdown, the file the bench writes. */
export function renderBriefMarkdown(brief: Brief, origin: string = SITE_ORIGIN): string {
  const out: string[] = [`# ${brief.title}`, '', `*${brief.dateline}*`, '']
  brief.sections.forEach((section, i) => {
    out.push(`## ${i + 1}. ${section.heading}`, '')
    for (const p of section.paragraphs) out.push(p, '')
    for (const link of section.links ?? []) {
      out.push(`- [${link.label}](${briefAbsolute(link.href, origin)})${link.note ? `: ${link.note}` : ''}`)
    }
    if (section.links?.length) out.push('')
  })
  out.push('---', '', `*${brief.provenance}*`, '')
  return out.join('\n')
}
