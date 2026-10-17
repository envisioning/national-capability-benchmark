import { EVIDENCE_PT_PT } from './evidence-pt-pt.js'
import { withOverride } from './override.js'
import { PT_BR } from './pt-br.js'

/**
 * European Portuguese, read through the Brazilian base.
 *
 * Portugal, Angola, Mozambique and Guinea-Bissau read `pt-br.ts` with this
 * file laid over it. It holds the number formatting (a point between
 * thousands), the layer countries and only the strings a reader in those
 * countries would write differently: the European orthography of the 1990
 * agreement ("facto", "registo", "secção", "artefacto", "controlo"), the
 * enclitic pronoun ("preparar-se", "assenta em"), "rendimento" where the
 * base says "renda", which in Portugal is the rent, "investigação" and
 * "I&D" for research, "inquérito" for a survey, "população ativa",
 * "formação", "valor acrescentado" and the European names of countries.
 * Every other string is the base's, so the two readings cannot drift on a
 * term the project fixed: a score is "pontuação" and the confidence number
 * "solidez" in both.
 *
 * The base is Brazilian because the larger speaker community sets it. This
 * file is an orthography and a set of word choices, not the standard the
 * base is measured against. Angola has not ratified the 1990 agreement and
 * Mozambique applies it unevenly; the four layers share one spelling all the
 * same, and D165 records that cost. The copy was reviewed by Claude, not by
 * a native speaker. See D134, D162 and D165.
 */
export const PT_PT = withOverride(PT_BR, {
  lang: 'pt-PT',
  base: 'pt-BR',
  htmlLang: 'pt-PT',
  numberLocale: 'pt-PT',
  /* The countries whose European Portuguese pages are published, which is
   * the countries with a pt-PT layer in apps/web/src/lib/layers.ts. They ship
   * together: the metropole never reads alone. See D165. */
  layerCountries: ['PRT', 'AGO', 'MOZ', 'GNB'],
  dimensions: {
    shared_purpose: 'Propósito partilhado',
  },
  questions: {
    anticipation:
      'Em que medida o país consegue identificar mudanças emergentes e preparar-se para elas?',
    coordination:
      'Com que eficácia atores independentes conseguem organizar-se em torno de objetivos comuns?',
    shared_purpose:
      'Até que ponto as pessoas conseguem ver-se como participantes de um projeto comum?',
  },
  countries: {
    EST: 'Estónia',
    POL: 'Polónia',
    KEN: 'Quénia',
    VNM: 'Vietname',
    IRN: 'Irão',
    ROU: 'Roménia',
    ARM: 'Arménia',
    SVN: 'Eslovénia',
    LVA: 'Letónia',
    MKD: 'Macedónia do Norte',
    CZE: 'Chéquia',
    BLR: 'Bielorrússia',
    ZWE: 'Zimbabué',
    MUS: 'Maurícia',
    MDG: 'Madagáscar',
    UZB: 'Usbequistão',
    TTO: 'Trindade e Tobago',
  },
  countryArticles: {
    BLR: 'a',
    MUS: 'a',
  },
  indicators: {
    rd_expenditure_gdp: 'Despesa em I&D',
    researchers_per_million: 'Investigadores em I&D',
    government_foresight_capacity: 'Capacidade governamental de prospetiva',
    basic_research_share: 'Compromissos de investigação de longo prazo',
    business_start_days: 'Tempo para criar uma empresa',
    business_start_procedures: 'Procedimentos para criar uma empresa',
    business_entry_efficiency: 'Eficiência na criação de empresas',
    perceived_control: 'Perceção de controlo sobre a própria vida',
    budget_execution_fidelity: 'Fidelidade da execução orçamental',
    control_of_corruption: 'Controlo da corrupção',
    education_expenditure_gdp: 'Despesa pública em educação',
    vocational_secondary_share: 'Ensino profissional no ensino secundário',
    firm_training_incidence: 'Empresas que dão formação formal',
    research_citation_impact: 'Impacto de citação da investigação',
    early_stage_entrepreneurial_activity: 'Atividade empreendedora em fase inicial',
    regulatory_sandbox_activity: 'Empresas em ambientes de teste regulatório',
    university_spinouts: 'Empresas derivadas da investigação universitária',
    business_rd_share: 'Peso das empresas na I&D',
    labor_force_participation: 'Taxa de atividade',
    broadband_subscriptions: 'Acessos de banda larga fixa',
    disaster_preparedness: 'Preparação e recuperação perante catástrofes',
    manufacturing_value_added: 'Valor acrescentado da indústria transformadora',
    labour_productivity: 'Produto por pessoa empregada',
    electricity_connection_speed: 'Tempo de ligação à rede elétrica',
    economic_complexity: 'Aptidão económica',
    large_project_delivery: 'Execução de grandes projetos',
    tax_revenue_gdp: 'Receita fiscal',
    income_inequality: 'Desigualdade de rendimento',
    national_belonging: 'Sentimento de pertença nacional',
  },
  units: {
    'per 1,000 aged 15-64': 'por mil pessoas dos 15 aos 64 anos',
    '% of labour force': '% da população ativa',
    'percentage points from approved budget': 'pontos percentuais de desvio face ao orçamento aprovado',
    'ratio to world average': 'rácio face à média mundial',
    '% aged 18-64': '% das pessoas dos 18 aos 64 anos',
    '% of new grants': '% dos novos financiamentos',
    'z-score -2.5 to 2.5': 'valor z de -2,5 a 2,5',
    '% of incoming cases': '% dos processos entrados',
    '% of R&D': '% da I&D',
    '% overrun': '% de derrapagem de custo ou prazo',
    '% expressing belonging': '% que declaram pertença',
  },
  indicatorDefinitions: {
    rd_expenditure_gdp: 'Despesa interna bruta em investigação e desenvolvimento, em proporção do PIB.',
    researchers_per_million: 'Investigadores em equivalente a tempo integral, por milhão de pessoas.',
    statistical_performance:
      'Pontuação global do sistema estatístico nacional nos Indicadores de Desempenho Estatístico do Banco Mundial.',
    secure_internet_servers:
      'Servidores que usam cifragem em transações pela internet, por milhão de pessoas.',
    government_foresight_capacity:
      'Existência, mandato e continuidade de uma função nacional de prospetiva estratégica.',
    basic_research_share:
      'Novos financiamentos públicos de investigação atribuídos por concurso com duração de cinco anos ou mais, em proporção de todos os financiamentos públicos por concurso atribuídos no ano.',
    new_business_density:
      'Novas sociedades de responsabilidade limitada registadas por mil pessoas em idade ativa.',
    business_start_days: 'Dias de calendário para cumprir os procedimentos de registo de uma empresa.',
    business_start_procedures:
      'Número de procedimentos oficiais distintos para registar uma empresa.',
    business_entry_efficiency:
      'Pontuação B-READY do tempo e do custo para registar uma nova sociedade por quotas, nacional ou estrangeira.',
    internet_users: 'Proporção da população que usou a internet nos últimos três meses.',
    account_ownership:
      'Adultos com conta num banco ou numa instituição de pagamento por telemóvel.',
    domestic_credit_private:
      'Crédito interno concedido ao setor privado por instituições financeiras, em proporção do PIB.',
    adult_digital_skills:
      'Proporção de adultos que realizaram uma tarefa digital determinada nos últimos três meses, como enviar uma mensagem com um ficheiro anexo, mover um ficheiro entre dispositivos ou usar uma fórmula numa folha de cálculo, contada tarefa a tarefa e nunca como nível de competência.',
    perceived_control:
      'Liberdade de escolha e controlo sobre o rumo da própria vida, segundo os próprios inquiridos.',
    regulatory_quality:
      'Estimativa dos Indicadores Mundiais de Governação para a capacidade de formular e aplicar boa regulação.',
    government_effectiveness:
      'Estimativa dos Indicadores Mundiais de Governação para a qualidade dos serviços públicos e da execução de políticas.',
    logistics_performance:
      'Pontuação global do Índice de Desempenho Logístico, a partir de um inquérito a operadores internacionais de carga.',
    university_industry_collaboration:
      'Intensidade da colaboração em investigação entre universidades e empresas.',
    budget_execution_fidelity:
      'Desvio entre a despesa primária executada pelo governo e o orçamento originalmente aprovado.',
    rule_of_law:
      'Estimativa dos Indicadores Mundiais de Governação para a confiança nas regras da sociedade e o respeito por elas.',
    control_of_corruption:
      'Estimativa dos Indicadores Mundiais de Governação para o uso do poder público em benefício privado.',
    contract_enforcement_days:
      'Dias de calendário entre a entrada de uma ação de cobrança comercial em tribunal e o pagamento.',
    dispute_resolution_efficiency:
      'Pontuação B-READY da fiabilidade, do tempo e do custo de resolver um litígio comercial e executar a decisão.',
    bribery_incidence:
      'Empresas a quem foi pedido pelo menos um suborno em seis transações com o poder público, entre ligações de serviços, licenças, autorizações e impostos.',
    homicide_rate: 'Homicídios voluntários por 100 mil pessoas.',
    interpersonal_trust:
      'Proporção dos inquiridos que concorda que se pode confiar na maioria das pessoas.',
    willingness_to_cooperate_strangers:
      'Proporção de adultos que confia completamente ou um pouco nas pessoas que conhece pela primeira vez.',
    court_case_clearance:
      'Processos cíveis e comerciais findos num ano, em proporção dos processos entrados no mesmo ano.',
    education_expenditure_gdp: 'Despesa pública em educação, em proporção do PIB.',
    vocational_secondary_share:
      'Alunos do ensino profissional, em proporção do total de matrículas no ensino secundário.',
    firm_training_incidence:
      'Proporção das empresas que dão formação formal aos seus trabalhadores permanentes.',
    adult_learning_participation:
      'Proporção de adultos em educação ou formação, formal ou não, nos últimos 12 meses.',
    research_citation_impact:
      'Proporção dos artigos e revisões de um país entre os 10% mais citados da sua subárea e do seu ano, dividida pela mesma proporção calculada sobre todas as publicações com país de afiliação.',
    resident_patents_per_million: 'Pedidos de patente apresentados por residentes, por milhão de pessoas.',
    resident_trademarks_per_million:
      'Pedidos diretos de registo de marca apresentados por residentes, por milhão de pessoas.',
    resident_industrial_designs_per_million:
      'Pedidos de registo de desenho industrial apresentados por residentes no organismo nacional, por milhão de pessoas.',
    venture_capital_gdp:
      'Primeiras rondas de capital de risco fechadas no ano por empresas sediadas no país, por milhão de pessoas, contadas por operação e nunca por valor.',
    early_stage_entrepreneurial_activity:
      'Adultos que estão a criar ou a dirigir um negócio com menos de 42 meses de existência.',
    failure_tolerance:
      'Proporção de adultos que veem boas oportunidades e dizem que o medo de falhar não os impediria de criar um negócio.',
    regulatory_sandbox_activity:
      'Empresas admitidas no ano num ambiente de teste regulatório ou regime de experimentação controlada, e empresas que o concluíram, por milhão de pessoas, somadas entre todos os reguladores do país.',
    university_spinouts:
      'Empresas criadas para levar ao mercado investigação feita em universidades, por milhão de pessoas.',
    business_rd_share: 'Proporção da despesa bruta em I&D executada por empresas.',
    labor_force_participation: 'Proporção da população em idade ativa que pertence à população ativa.',
    unemployment_rate:
      'Desempregados em proporção da população ativa, segundo a estimativa modelada da OIT.',
    long_term_unemployment_share:
      'Pessoas desempregadas há 12 meses ou mais, em proporção do total de desempregados.',
    broadband_subscriptions: 'Acessos de banda larga fixa por 100 pessoas.',
    electricity_transmission_losses:
      'Energia perdida no transporte e na distribuição, incluindo o consumo não faturado. Quanto menor, melhor.',
    new_export_products_rate:
      'Proporção dos produtos que um país não exportava de forma competitiva em 2009-2011 e passou a exportar de forma competitiva em 2022-2024.',
    informal_employment_share:
      'Emprego informal em proporção do emprego total, indicador 8.3.1 dos Objetivos de Desenvolvimento Sustentável. Quanto menor, melhor.',
    disaster_preparedness:
      'Capacidade demonstrada de se preparar para choques graves e de recuperar deles.',
    manufacturing_value_added: 'Valor acrescentado da indústria transformadora, em proporção do PIB.',
    high_tech_exports_share:
      'Exportações de alta tecnologia, em proporção das exportações de produtos industriais.',
    labour_productivity: 'PIB por pessoa empregada, em paridade de poder de compra constante.',
    electricity_connection_speed:
      'Pontuação do Doing Business para os dias que uma empresa espera por uma ligação elétrica definitiva.',
    large_project_delivery:
      'Desempenho em custo e prazo dos grandes projetos públicos de infraestrutura.',
    firm_scale_up_rate:
      'Proporção de empresas jovens que atingem patamares relevantes de emprego ou de volume de negócios.',
    voice_and_accountability:
      'Estimativa dos Indicadores Mundiais de Governação para a capacidade dos cidadãos de participar na escolha do governo.',
    tax_revenue_gdp: 'Receita fiscal da administração central, em proporção do PIB.',
    income_inequality: 'Índice de Gini do rendimento disponível.',
    national_belonging:
      'Identificação e ligação à comunidade nacional, declaradas pelos inquiridos, distintas do orgulho na nação.',
    volunteering_rate:
      'Proporção de adultos que dedicaram tempo como voluntários a alguma organização no último mês.',
    civic_participation:
      'Proporção de adultos que declaram pertencer a uma organização humanitária ou de beneficência.',
  },
  bandMeanings: {
    usable: 'Evidência suficiente para comparar países, com lacunas conhecidas.',
    thin: 'Só uma minoria dos indicadores foi observada, ou a evidência é antiga o bastante para a situação ter mudado. Leia com cautela.',
    very_thin: 'A pontuação assenta em um ou dois indicadores. Não a cite isoladamente.',
  },
  scoreBands: {
    weak: {
      label: 'baixa',
      meaning: 'Perto do mínimo da escala. Confirme a solidez da evidência antes de tirar qualquer conclusão.',
    },
  },
  agenda: {
    historyReadoutClamped:
      'De {from} para {to} ({delta}) em {years} anos, com base em {n} indicadores; {c} chegaram à extremidade da escala',
    trendCellClamped:
      '{delta} em {years} anos, com base em {n} indicadores, {c} cortados na extremidade da escala',
    raiseIntro:
      'São as pontuações mais baixas entre as dimensões com evidência utilizável. As dimensões com evidência fraca aparecem na secção seguinte.',
    scoredOn: 'A pontuação assenta em {n} indicadores observados.',
    scoredOnOne: 'A pontuação assenta num indicador observado.',
    evidenceElsewhereLine:
      'Registos de evidência desta dimensão noutros países, com êxitos e retrocessos, que não entram em nenhuma pontuação: {list}.',
    ownEvidenceIntro:
      'Entregas documentadas ligadas a indicadores ausentes. Não alteram as pontuações nem a solidez da evidência.',
    institutionalHistoryIntro:
      'São mudanças institucionais documentadas neste país, registadas como evidência, entre construções e retrocessos. Aparecem ao lado da pontuação e não alteram a pontuação nem a solidez da evidência.',
    conditionsIntro:
      'As condições descrevem aquilo com que um país conta: infraestrutura, acesso, dinheiro, pessoas, matrículas e o próprio rendimento. Cada uma aparece ao lado de uma capacidade e não entra na pontuação, na solidez da evidência nem na tendência. Lidas ao lado da pontuação, permitem ver se o que o país tem se converte no que faz. A posição conta os países com valor, do melhor para o pior.',
    historyCaveat:
      'Os valores históricos usam a escala atual de 0 a 100 e um conjunto emparelhado de indicadores. Mostram o movimento da evidência disponível, e não uma pontuação geral de desenvolvimento. Os itens datados da agenda aparecem numa linha do tempo separada e não alteram a pontuação. Quando falta uma linha, a evidência não sustenta uma tendência comparável nessa dimensão.',
    contributeBody:
      'Para preencher uma lacuna, registar uma evidência ou contestar um indicador, use {repo}. Os documentos do repositório explicam o método e as decisões por trás dele.',
    conditionRank: '{rank}.º de {n}',
  },
  institutions: {
    systems: {
      oversight_integrity: 'Controlo e integridade',
    },
    families: {
      constitutes: {
        label: 'Autoridade',
        empty: 'Nenhuma relação de autoridade ou vínculo registada.',
      },
      limits: { label: 'Controlo', empty: 'Nenhuma relação de controlo registada.' },
      funds: { label: 'Financiamento', empty: 'Nenhuma relação de financiamento registada.' },
      works_with: {
        label: 'Trabalho conjunto',
        empty: 'Nenhuma relação de trabalho conjunto registada.',
      },
    },
    noMatch: 'Nenhuma instituição corresponde a estes filtros.',
    relationCount: '{n} relações registadas',
    relationCountOne: 'Uma relação registada',
    noRelations: 'Nenhuma relação registada para esta instituição.',
    mapSummary: '{institutions} instituições, {relations} relações registadas',
  },
  capabilityMap: {
    metaDescription:
      'Uma leitura de {dimension} para {countryTopic}: a pontuação e a solidez da evidência, os indicadores em que assenta, as condições ao seu lado e a posição entre os países de rendimento mais próximo. Calculada a partir dos dados publicados.',
    intro:
      'Esta página lê uma capacidade a partir dos dados publicados e é recalculada em cada versão. Separa o que {countryTopic} faz, que forma a pontuação, daquilo com que o país conta, que fica ao lado da pontuação, e situa o país entre os {count} países de rendimento mais próximo. O texto descreve os dados e não recomenda políticas.',
    scoreHeading: 'Em que assenta a pontuação?',
    scoreIntro:
      'A pontuação de {dimension} é a média, com pesos iguais, das posições de {n} indicadores numa escala de 0 a 100 definida por todos os países em conjunto. A solidez da evidência por trás da pontuação aparece ao seu lado, como um segundo número.',
    conditionsIntro:
      'Ao lado de cada condição há dois coeficientes de correlação, calculados sobre todos os países: um com o rendimento e outro com a pontuação da capacidade. Quando o r com o rendimento é bem maior do que o r com a pontuação, a condição acompanha mais a riqueza do país do que a capacidade medida.',
    conditionIncome: 'r com o rendimento: {r} ({n} países)',
    peerRule:
      'Os pares são os {count} países de rendimento mais próximo. O rendimento é o PIB per capita em paridade de poder de compra, em dólares internacionais constantes, no último ano publicado pelo Banco Mundial, e a distância é medida em escala logarítmica, em que a metade e o dobro ficam à mesma distância. Nenhum país é escolhido a dedo, e o conjunto muda quando os dados mudam.',
    peerRange: 'Nesta versão, o rendimento dos pares vai de {min} a {max}; {countryTopic} tem {own} ({year}).',
    fieldAria: '{count} países de rendimento semelhante numa escala de 0 a 100 em {dimension}.',
    noPeers:
      'Esta versão dos dados não publica o rendimento dos países, por isso a página não forma o conjunto de pares.',
    limitPeers:
      'Os pares têm em comum o rendimento e nada mais. Dimensão, estrutura produtiva, região e regime político ficam fora da regra, e um conjunto de {count} países pode mudar com qualquer revisão do PIB.',
    rowCaveats: {
      long_term_unemployment_share: {
        text: 'O desemprego de longa duração vem do ILOSTAT, depois de um filtro de plausibilidade aplicado do mesmo modo a todos os países. Alguns países com pontuação usam um inquérito aos agregados familiares em vez de um inquérito ao emprego. Uma proporção alta admite duas leituras: realocação lenta, onde o desemprego também é alto, ou um pequeno grupo residual, onde é baixo.',
        decisions: ['D120'],
      },
      new_export_products_rate: {
        text: 'Os novos produtos de exportação contam as linhas de mercadorias em que um país passou a exportar de forma competitiva em quinze anos, segundo os dados de comércio do Growth Lab. São exportações brutas, pelo que os centros de reexportação contam o que passa por eles, e um país que não reporta o seu comércio é lido nos registos dos parceiros. Uma janela tão longa muda pouco de uma versão para outra.',
        decisions: ['D149'],
      },
    },
    rowFacts: {
      household_survey:
        'Para {countryTopic}, a série do ILOSTAT tem origem num inquérito aos agregados familiares: {survey}.',
      household_survey_unreliable:
        'Para {countryTopic}, a série do ILOSTAT tem origem num inquérito aos agregados familiares, e a OIT assinala o valor como pouco fiável.',
      urban_survey_unreliable:
        'Para {countryTopic}, a série do ILOSTAT tem origem num inquérito que cobre só aglomerados urbanos ({survey}), e a OIT assinala o valor como pouco fiável.',
      flagged_unreliable: 'Para {countryTopic}, a OIT assinala o valor do ILOSTAT como pouco fiável.',
      gate_never_passed:
        'Para {countryTopic}, nenhum ano da série do ILOSTAT passa o filtro de plausibilidade: o inquérito regista menos de {floor}% na maioria dos anos, pelo que a linha fica sem valor.',
    },
    thinNote:
      'A solidez da evidência está na faixa {band}, pelo que a pontuação assenta em pouca evidência.',
    artefactsLine:
      'Os artefactos conhecidos que afetam {dimension}, descritos em inglês na página de limites:',
    artefactLink: 'artefacto {id}',
    index: {
      metaDescription:
        'Uma leitura de cada capacidade para {countryTopic}: a pontuação, a solidez da evidência e a posição face à mediana dos países de rendimento mais próximo. Calculada a partir dos dados publicados.',
      intro:
        'Esta página lê {n} capacidades para {countryTopic} a partir dos dados publicados e é recalculada em cada versão. Cada linha traz a pontuação e a solidez da evidência como dois números e compara a pontuação com a mediana dos {count} países de rendimento mais próximo. As linhas seguem a ordem do modelo, e cada uma abre o mapa dessa capacidade.',
    },
    checks: {
      label: 'Séries de contraste, fora da pontuação',
      intro:
        'Cada número é publicado ao lado da pontuação e fica fora dela: não entra na escala, na média, na contagem de indicadores nem na solidez da evidência.',
      lowerBetter: 'um valor menor é melhor',
      higherBetter: 'um valor maior é melhor',
      source: '{source}, {year}',
      byId: {
        political_polarization: {
          name: 'Polarização política',
          definition:
            'Se os apoiantes de campos políticos opostos tendem a tratar-se de forma amigável ou hostil, segundo a avaliação dos especialistas de país do V-Dem, de 0, amigável, a 4, hostil.',
          unit: 'índice de 0 a 4',
          reason:
            'Não entra na pontuação porque uma leitura baixa tem duas causas que o número não separa. Onde os campos competem abertamente, a calma significa que quem discorda se trata como concidadão; onde não é permitido organizar uma oposição, significa que não resta um campo a que se opor.',
          decision: 'D121',
        },
        voter_turnout: {
          name: 'Participação eleitoral',
          definition:
            'Proporção dos eleitores inscritos que votaram nas últimas eleições nacionais até 2025, segundo os resultados oficiais que o V-Dem codifica a partir do IDEA, da UIP e da IFES.',
          unit: '% dos eleitores inscritos',
          reason:
            'Não entra na pontuação por três razões que o número não separa: lê o canal democrático, o voto obrigatório transforma-a numa leitura da lei, e as autocracias também obtêm uma participação alta, que é mobilização e não participação.',
          decision: 'D129',
        },
        institutional_trust: {
          name: 'Confiança nos tribunais',
          definition:
            'Proporção dos inquiridos que dizem ter muita confiança no sistema de justiça e nos tribunais, entre quatro respostas (muita, bastante, pouca e nenhuma), na ronda de 2017 a 2022 do inquérito conjunto EVS/WVS.',
          unit: '% que responde muita',
          reason:
            'Não entra na pontuação porque a resposta lê duas coisas que o número não separa. Onde os tribunais são independentes, a confiança neles julga o seu funcionamento; onde respondem ao Estado, é também deferência, e dizer outra coisa a um inquiridor tem um custo. Nesta comparação, as autocracias registam valores mais altos do que as democracias.',
          decision: 'D132',
        },
        customs_clearance_time: {
          name: 'Tempo de desalfandegamento das exportações',
          definition:
            'Média de dias para desalfandegar as exportações diretas, segundo as empresas industriais que exportam diretamente, nos Inquéritos às Empresas do Banco Mundial.',
          unit: 'dias',
          reason:
            'Não entra na pontuação por duas razões. O número de empresas por trás de cada valor só é publicado nos microdados e em vários países pode ser pequeno, e a pergunta mudou em 2024, pelo que um país inquirido antes e depois da mudança pode mover-se muito sem que nada mude na sua fronteira.',
          decision: 'D144',
        },
      },
    },
  },
  evidence: EVIDENCE_PT_PT,
})
