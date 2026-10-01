import type { FlagFieldWords } from '@/components/FlagField'
import type { ConditionListWords } from '@/components/views/ConditionList'

/**
 * Copy-rule helpers for text the viewer computes.
 *
 * The count in a heading is derived from the data it sits above, so it cannot
 * contradict the table underneath it. The rules still apply to a computed
 * number: counts up to nine are spelled out, and a sentence starts with a
 * capital. Both live here so every page spells the same number the same way.
 */

const COUNT_WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

/** A count as prose: spelled out to nine, numerals from 10. */
export const countWord = (n: number): string => COUNT_WORDS[n] ?? String(n)

/** The same word at the start of a sentence. */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

const PT_COUNT_WORDS = ['nenhum', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']

/** A count as Portuguese prose, masculine: spelled out to nine, numerals from 10. */
export const ptCountWord = (n: number): string => PT_COUNT_WORDS[n] ?? String(n)

/** The field chart's words in Portuguese, for the Brazil layer. See D130. */
export const PT_FIELD_WORDS: FlagFieldWords = {
  score: 'Nota',
  confidence: 'Solidez',
  trend: 'Tendência',
  highest: 'Maior',
  lowest: 'Menor',
  noScore: 'sem nota',
  clamped: 'Truncado na borda da régua, então a posição real fica além dela.',
  scoredOf: '{scored} de {total} capacidades com nota.',
  clickFlag: ' Clique na bandeira para ver o perfil completo.',
  aria: '{n} países numa régua de 0 a 100. Mediana {median}.',
  legendNote: 'A faixa sombreada é a metade central do campo e a linha dentro dela é a mediana.',
  solidRing: 'Anel contínuo: evidência utilizável ou boa',
  brokenRing: 'Anel interrompido: evidência fraca, mais aberto quanto menor a solidez',
}

/** The conditions panel's words in Portuguese, for the Brazil layer. See D130. */
export const PT_CONDITION_WORDS: ConditionListWords = {
  label: 'Condições, fora da nota',
  intro:
    'O que o país tem para trabalhar nesta capacidade. Os valores aparecem como a fonte os publicou e não entram na nota, na solidez da evidência nem na tendência. A posição conta os países com valor, do melhor para o pior.',
  noValue: 'Sem valor para este país. {definition}',
  rank: '{rank}º de {n}',
}

/** Portuguese labels used by the translated methodology pages. */
export const PT_METHOD = {
  measurementClasses: {
    C: {
      label: 'medida direta de capacidade',
      plain: 'Mede a própria capacidade.',
      example: 'O tempo para registrar uma empresa mede a dificuldade de abrir um negócio.',
    },
    I: {
      label: 'insumo de capacidade',
      plain: 'Mede algo que sustenta a capacidade.',
      example: 'O gasto em pesquisa é um insumo. Ele não prova que um país lê bem o futuro.',
    },
    O: {
      label: 'resultado posterior',
      plain: 'Mede um resultado que costuma decorrer da capacidade.',
      example: 'Patentes podem mostrar experimentação, mas também registros defensivos.',
    },
    P: {
      label: 'proxy de percepção',
      plain: 'Registra o que pessoas ou especialistas dizem, não o que fizeram.',
      example: 'Os indicadores de governança agregam opiniões de especialistas.',
    },
  },
  sourceTiers: {
    official_statistical: 'estatística oficial',
    international_organization: 'organização internacional',
    academic_survey: 'pesquisa acadêmica',
    composite_index: 'índice composto',
    expert_panel: 'painel de especialistas',
    llm_delphi: 'Delphi de modelos',
  } as Record<string, string>,
  countryReasons: {
    BRA: 'Caso de referência principal, grande democracia diversa de renda média-alta.',
    USA: 'Alta inovação e agência, com grande complexidade institucional.',
    NLD: 'Instituições, coordenação e confiança social fortes.',
    CHE: 'Sistema muito descentralizado e excepcionalmente coordenado.',
    SGP: 'Pequeno Estado de alta capacidade e alta coordenação.',
    KOR: 'Desenvolvimento rápido, adoção tecnológica e capacidade de execução.',
    EST: 'Pequeno Estado conhecido pela experimentação institucional digital.',
    IND: 'Grande economia emergente e diversa, com capacidade significativa de baixo para cima.',
    CHL: 'Comparação latino-americana com instituições relativamente fortes.',
    ZAF: 'Caso de renda média desigual e institucionalmente complexo.',
    MEX: 'Segunda maior economia latino-americana, com base manufatureira ligada à América do Norte.',
    ARG: 'Pesquisa e capital humano fortes diante de repetidas rupturas macroeconômicas.',
    COL: 'Grande economia reconstruindo a capacidade estatal após conflito interno prolongado.',
    PER: 'Crescimento sustentado com instabilidade institucional e informalidade persistentes.',
    URY: 'Pequeno Estado com a maior confiança institucional da região.',
    CRI: 'Pequeno Estado que avançou para manufatura e serviços de maior valor.',
    DEU: 'Grande economia manufatureira coordenada por estados federais e associações industriais.',
    FRA: 'Estado centralizado com tradição de política industrial dirigida.',
    GBR: 'Concentração em serviços e finanças, com baixa produtividade recente.',
    ESP: 'Comparação do sul europeu, com infraestrutura forte e desemprego alto.',
    POL: 'Caso de convergência pós-socialista que reconstruiu instituições e indústria.',
    SWE: 'Estado nórdico de alta confiança, com grandes empresas e startups.',
    FIN: 'Pequeno Estado com prospecção institucionalizada e aprendizagem medida forte.',
    IRL: 'Economia aberta pequena, cujos números de produção são distorcidos por investimento estrangeiro.',
    CAN: 'Democracia federal rica em recursos, com dúvidas persistentes sobre produtividade.',
    AUS: 'Exportador de recursos distante dos mercados, com alta capacidade administrativa.',
    JPN: 'Fabricante de alta capacidade que testa a execução diante do declínio demográfico.',
    CHN: 'Desenvolvimento dirigido pelo Estado em escala continental.',
    IDN: 'Grande arquipélago que coordena ações em uma dispersão geográfica extrema.',
    VNM: 'Industrialização rápida sobre uma base de baixa renda.',
    PHL: 'Economia de serviços e remessas, com pouca profundidade industrial.',
    MYS: 'Fabricante de renda média testando a produção de maior valor.',
    THA: 'Caso de armadilha da renda média, com montagem forte e inovação limitada.',
    TUR: 'Potência industrial média com instabilidade macroeconômica recorrente.',
    ISR: 'Pequeno Estado com alta densidade de capital de risco e divisões civis profundas.',
    ARE: 'Diversificação estatal rápida para além do petróleo, conduzida de cima para baixo.',
    NGA: 'Maior economia africana, com capacidade concentrada fora do Estado.',
    KEN: 'Líder africano em finanças digitais, com uma rede privada em escala populacional.',
    RWA: 'Pequeno Estado com reputação forte de entrega e base política estreita.',
    ETH: 'Grande Estado de baixa renda tentando industrialização dirigida em meio a conflito.',
    BOL: 'Estado dependente de recursos, sem litoral, com movimentos sociais fortes e instituições formais fracas.',
    PRY: 'Exportador agrícola sem litoral, com Estado pequeno e crescimento recente rápido.',
    ECU: 'Exportador de petróleo dolarizado, com redesenho institucional recorrente.',
    VEN: 'Caso de colapso estatal; os dados recentes escassos também são um achado.',
    PAN: 'Polo de serviços e logística construído em torno de um ativo único bem operado.',
    GTM: 'Maior economia centro-americana, com Estado cronicamente subfinanciado.',
    HND: 'Estado de baixa capacidade, onde remessas substituem instituições ausentes.',
    SLV: 'Pequeno Estado em reconstrução institucional centralizada e orientada pela segurança.',
    NIC: 'Caso de consolidação autoritária, com estatísticas independentes em retração.',
    DOM: 'Economia de turismo e serviços em rápido crescimento, com baixa entrega pública.',
    CUB: 'Sistema estatal fora da maioria dos programas estatísticos internacionais, por isso com cobertura baixa.',
    HTI: 'Caso de ruptura estatal, mostrando o piso do quadro comparativo.',
  } as Record<string, string>,
} as const
