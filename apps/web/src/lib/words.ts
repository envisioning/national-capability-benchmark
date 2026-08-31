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

type PortugueseGlossaryEntry = {
  group: string
  term: string
  short: string
  full: string
  example?: string
}

/** Complete interpretation layer for the glossary terms used by the core model. */
export const PT_GLOSSARY_GROUPS: Record<string, string> = {
  'What is being measured': 'O que é medido',
  'How a number is made': 'Como um número é feito',
  'How good the evidence is': 'Qual é a qualidade da evidência',
  'What is missing': 'O que está faltando',
  'How things change over time': 'Como as coisas mudam ao longo do tempo',
  'What sits beside the score': 'O que acompanha a pontuação',
}

export const PT_GLOSSARY: Record<string, PortugueseGlossaryEntry> = {
  Capability: { group: 'What is being measured', term: 'Capacidade', short: 'O que um país consegue fazer, separadamente de sua riqueza.', full: 'O benchmark pergunta o que um país consegue fazer: antecipar mudanças, coordenar, aprender, adaptar-se e construir sob incerteza. Riqueza e capacidade se relacionam, mas o desenho mantém as duas separadas o suficiente para comparação.' },
  Dimension: { group: 'What is being measured', term: 'Dimensão', short: 'Uma das nove capacidades, cada uma pontuada separadamente.', full: 'Há nove dimensões. Cada uma tem sua própria pergunta e pontuação de 0 a 100. As pontuações permanecem separadas, para que países com a mesma média possam ter formatos diferentes.', example: 'Construção pergunta se um país transforma planos em sistemas funcionais. Confiança pergunta quanta cooperação é possível além das pessoas que já se conhecem.' },
  Indicator: { group: 'What is being measured', term: 'Indicador', short: 'Uma estatística publicada usada como evidência para uma dimensão.', full: 'Cada dimensão usa indicadores publicados com fonte e ano. A pontuação calcula a média dos indicadores com dados; os valores brutos permanecem visíveis para verificação.' },
  'Indicator family': { group: 'What is being measured', term: 'Família de indicadores', short: 'Grupo de indicadores dentro de uma dimensão que responde à mesma pergunta.', full: 'Algumas dimensões abrigam duas perguntas sob um só nome. Confiança pergunta se as pessoas confiam em desconhecidos e em instituições; cada indicador pertence a uma dessas famílias. A família não muda a pontuação, que continua sendo a média com pesos iguais dos dados observados.', example: 'Confiança tem uma família social e uma institucional. Atualmente, apenas a institucional tem dados, então a evidência responde a uma das duas perguntas.' },
  'Behavioral check': { group: 'What sits beside the score', term: 'Verificação comportamental', short: 'Uma série publicada ao lado de uma dimensão e excluída dela.', full: 'Algumas séries medem algo real sobre uma capacidade, mas falham nos testes aplicados antes de uma pontuação, geralmente porque acompanham sobretudo a renda nacional. Uma verificação é publicada, mas excluída da escala, da média, da contagem de indicadores e da confiança. O motivo acompanha o número.', example: 'A incidência de suborno pergunta se uma empresa foi solicitada a pagar propina. Ela informa sobre confiança, mas também acompanha a renda, então fica ao lado da pontuação.' },
  'Measurement class': { group: 'What is being measured', term: 'Classe de medição', short: 'Se um indicador mede a capacidade, um insumo, um resultado ou uma opinião.', full: 'O registro classifica cada indicador como C, I, O ou P. C mede a capacidade; I mede um insumo; O mede um resultado; P registra uma percepção. O benchmark prefere C e I. P foi aposentada depois de acompanhar de perto a renda.', example: 'Tempo para registrar uma empresa é C. Gasto em pesquisa é I. Patentes são O. Pesquisa de especialistas sobre governo é P.' },
  Score: { group: 'How a number is made', term: 'Pontuação', short: 'Uma posição de 0 a 100 dentro de um quadro comparativo fixo.', full: 'A pontuação de uma dimensão vai de 0 a 100. Zero é o mais fraco e 100 o mais forte neste quadro. Um 10 está perto do piso, não representa 10% de uma capacidade.' },
  'Score band': { group: 'How a number is made', term: 'Faixa de pontuação', short: 'Uma das quatro faixas nomeadas em que uma pontuação pode cair.', full: 'Cada pontuação cai em uma de quatro faixas. Os rótulos são relativos a este quadro. Verifique a confiança antes de interpretar uma pontuação baixa.' },
  'Comparison frame': { group: 'How a number is made', term: 'Quadro comparativo', short: 'Os países cujos valores fixam os extremos de cada escala.', full: 'Todos os países definem os extremos de cada indicador. O quadro permanece fixo dentro de uma versão, para que mudanças na pontuação reflitam os dados. Adicionar um país muda o quadro e atualiza as pontuações.' },
  'Frame rebase': { group: 'How a number is made', term: 'Rebase do quadro', short: 'Uma nova escala depois que o conjunto de países muda.', full: 'Adicionar um país pode mover os extremos e atualizar os números publicados. O dataset recebe uma versão majoritária, o benchmark é recalculado e números antigos e novos não podem ser comparados.' },
  Normalization: { group: 'How a number is made', term: 'Normalização', short: 'Transformação de um valor bruto em uma posição de 0 a 100.', full: 'Os valores brutos usam unidades diferentes. A normalização transforma cada um em uma posição de 0 a 100 dentro do quadro do indicador. Indicadores em que menos é melhor são invertidos, para que valores altos sempre sejam melhores.' },
  'Distance from target': { group: 'How a number is made', term: 'Distância do alvo', short: 'Uma transformação que recompensa valores próximos de um alvo definido.', full: 'Algumas medidas são melhores quando estão perto de um alvo. A execução orçamentária calcula a distância até 100, então o país mais próximo fica em primeiro.' },
  Winsorizing: { group: 'How a number is made', term: 'Winsorização', short: 'Retorno de valores extremos a um limite para que um país não estique a escala.', full: 'Um valor extremo pode comprimir todos os outros países em uma faixa estreita. A winsorização limita valores além de três intervalos interquartis antes de criar a escala. É usada com parcimônia.' },
  'Out of frame': { group: 'How a number is made', term: 'Fora do quadro', short: 'Valor além dos extremos da escala, com pontuação limitada e sinalizada.', full: 'Valores atuais ficam dentro do quadro por construção. Valores históricos ou que chegam depois podem ficar fora dele, ser limitados a 0 ou 100 e receber uma marca. A marca mostra onde a informação foi perdida.' },
  Confidence: { group: 'How good the evidence is', term: 'Confiança', short: 'O quanto uma pontuação é bem evidenciada, sempre apresentada ao lado dela.', full: 'Confiança é cobertura × atualidade × qualidade da fonte, de 0 a 1. Ela descreve a evidência, não a pontuação. A mesma pontuação pode ter níveis de confiança muito diferentes.' },
  'Coverage, recency, source quality': { group: 'How good the evidence is', term: 'Cobertura, atualidade e qualidade da fonte', short: 'As três partes da confiança.', full: 'Cobertura é a parcela de indicadores com valor. A atualidade cai depois de dois anos de tolerância em uma janela de 12 anos. Qualidade da fonte é a média do nível das fontes. As três partes se multiplicam.' },
  'Confidence band': { group: 'How good the evidence is', term: 'Faixa de confiança', short: 'Quatro faixas nomeadas: muito fina, fina, utilizável e boa.', full: 'A confiança tem quatro faixas. Muito fina significa que a pontuação depende de um ou dois indicadores e não deve ser citada sozinha. Evidência fina aparece como borda tracejada e ponto vazado no radar.' },
  'Source tier': { group: 'How good the evidence is', term: 'Nível da fonte', short: 'A qualidade atribuída à fonte que publicou um valor.', full: 'O nível registra quem publicou o número e quanto peso a fonte recebe na confiança. Ele nunca é incorporado à capacidade medida.' },
  'Ingest route': { group: 'What is missing', term: 'Rota de ingestão', short: 'Como um valor entra no dataset.', full: 'A rota diz se o valor foi buscado na API, inserido manualmente, declarado como lacuna ou aposentado. Ela mantém a origem do dado visível.' },
  Gap: { group: 'What is missing', term: 'Lacuna', short: 'Indicador sem dataset comparável que possa ser usado agora.', full: 'Uma lacuna permanece no registro e reduz a confiança. Ela só vira indicador pontuável quando uma série comparável cobre pelo menos dois países.' },
  'Retired indicator': { group: 'What is missing', term: 'Indicador aposentado', short: 'Indicador com dataset existente, mas rejeitado pelo benchmark.', full: 'Um indicador aposentado fica visível, não é buscado nem pontuado e reduz a confiança como uma lacuna. A decisão registra a evidência que levou à rejeição.' },
  'Evidence record': { group: 'What is missing', term: 'Registro de evidência', short: 'Entrega documentada que fica ao lado de um indicador ausente.', full: 'Um registro de evidência documenta algo que uma lacuna não consegue medir. Ele tem número publicado, período, fonte e data de consulta, mas nunca altera pontuação ou confiança.' },
  'Institutional capability network': { group: 'What sits beside the score', term: 'Rede de capacidade institucional', short: 'Mapa das instituições e das relações que sustentam uma capacidade.', full: 'O mapa institucional mostra instituições, famílias de relações e contagens. Ele oferece contexto para as dimensões e não é uma pontuação nem um diagrama de nós.' },
  Momentum: { group: 'How things change over time', term: 'Impulso', short: 'Mudança de uma pontuação ao longo do tempo em um quadro comum.', full: 'O impulso compara dois anos usando o quadro atual e apenas os indicadores observados nos dois extremos. O tamanho da cesta acompanha a mudança.' },
  'Matched basket': { group: 'How things change over time', term: 'Cesta compatível', short: 'Indicadores presentes nos dois extremos de uma tendência.', full: 'A cesta compatível impede que a entrada ou saída de um indicador crie uma mudança artificial. Ela pode ser menor que a dimensão.' },
  'Indicator line': { group: 'How things change over time', term: 'Linha do indicador', short: 'A série histórica de um indicador, sem preenchimento de lacunas.', full: 'Cada indicador tem sua própria linha desde 1960, quando há dados. Cada ponto mantém valor bruto, valor normalizado e nível da fonte.' },
  'Delphi panel': { group: 'What sits beside the score', term: 'Painel Delphi', short: 'Modelos que revisam o que os dados publicados não cobrem.', full: 'O painel Delphi usa rodadas anônimas, posições analíticas fixas e uma distribuição de pontuações. Seus resultados ficam separados do score dos indicadores.' },
  Provenance: { group: 'What sits beside the score', term: 'Proveniência', short: 'Registro de onde veio uma estimativa e como ela foi produzida.', full: 'A proveniência é armazenada no arquivo da rodada. Ela informa se o resultado é evidência, painel, sessão ou simulação, em vez de ser deduzida do nome do modelo.' },
  Dissent: { group: 'What sits beside the score', term: 'Divergência', short: 'Desacordo entre as estimativas do painel.', full: 'A divergência é a amplitude interquartil do painel. Uma faixa acima do limite declarado permanece visível como desacordo não resolvido.' },
  'Wealth proxy': { group: 'What sits beside the score', term: 'Proxy de riqueza', short: 'Medida que parece capacidade, mas acompanha sobretudo a renda.', full: 'O teste de proxy de riqueza verifica se um indicador acompanha o PIB per capita. Um indicador que falha pode ser aposentado ou publicado como verificação comportamental.' },
  'Capability agenda': { group: 'What sits beside the score', term: 'Agenda de capacidades', short: 'Leitura prática do que um país pode elevar, medir ou manter.', full: 'A agenda organiza as dimensões em elevar, medir e manter. Ela é calculada a partir do perfil do país e não cria uma nova pontuação.' },
  'Interpretation layer': { group: 'What sits beside the score', term: 'Camada de interpretação', short: 'Texto traduzido ou contextual que interpreta a base de dados.', full: 'A camada de interpretação pode mudar o idioma e a leitura, mas não muda ids, definições numéricas ou dados do modelo.' },
  'Known artefact': { group: 'What sits beside the score', term: 'Artefato conhecido', short: 'Um padrão do benchmark que não deve ser confundido com a realidade.', full: 'Um artefato conhecido registra onde a versão atual pode produzir uma leitura enganosa. Ele acompanha o número para que o leitor saiba onde a cautela é necessária.' },
  'Blended score': { group: 'How a number is made', term: 'Pontuação combinada', short: 'Pontuação de indicador ou estimativa de painel quando não há indicador observado.', full: 'A pontuação combinada usa o score dos indicadores quando existe evidência. Só recorre à estimativa do painel quando nenhum indicador da dimensão foi observado, e registra qual fonte foi usada.' },
  'Revision log': { group: 'How things change over time', term: 'Registro de revisões', short: 'Log das alterações entre uma ingestão e a seguinte.', full: 'Cada ingestão compara o arquivo anterior e registra valores revisados, adicionados ou removidos. Assim, uma mudança de fonte não parece ter existido desde sempre.' },
}
