/**
 * Brazil's evidence records in Portuguese: the title and the claim of every
 * record filed against Brazil in `data/evidence/records.json`, by record id.
 *
 * The record stays English and sourced; this is its reading in the layer's
 * language, and nothing here adds a fact the record does not state. Every
 * number in a claim is the record's number, written the Brazilian way, and the
 * test beside the lexicon holds the two to the same digits, so a record that
 * changes its figures fails the build until this entry follows it. A record
 * filed against Brazil with no entry here also fails it. See D35 and D158.
 */
export const EVIDENCE_PT_BR: Record<string, { title: string; claim: string }> = {
  'bra-pix': {
    title: 'Pix, o sistema de pagamentos instantâneos',
    claim:
      'O Banco Central do Brasil especificou, construiu e opera um arranjo de pagamentos instantâneos de adesão obrigatória, que liquidou 7,98 bilhões de transações em julho de 2026, com 152 milhões de pessoas e 14 milhões de empresas transacionando no mês.',
  },
  'bra-govbr': {
    title: 'GOV.BR, a plataforma federal de identidade e serviços',
    claim:
      'O Brasil reuniu os serviços públicos federais sob uma única plataforma de identidade, que registrava 175 milhões de contas ativas e 5.179 serviços digitais em maio de 2026.',
  },
  'bra-sus': {
    title: 'Sistema Único de Saúde, o sistema público e universal de saúde',
    claim:
      'O Brasil inscreveu o direito à saúde na Constituição de 1988 e construiu um sistema público único que atende toda a população do país; o índice de cobertura de serviços da OMS para o Brasil subiu de 71 em 2000 para 84 em 2023.',
  },
  'bra-plano-real': {
    title: 'Plano Real, a estabilização monetária de 1994',
    claim:
      'O Brasil encerrou quatro décadas de inflação alta com uma reforma monetária feita em etapas, que levou a inflação anual ao consumidor de 2.075,9% em 1994 para 3,2% em 1998.',
  },
  'bra-pni': {
    title: 'Programa Nacional de Imunizações e sua erosão',
    claim:
      'O programa nacional de imunizações chegou a 99% de cobertura da vacina tríplice bacteriana (DTP) em 2003 e se manteve acima de 95% por uma década; depois caiu para 68% em 2021 e havia se recuperado para 91% em 2024.',
  },
  'bra-luz-para-todos': {
    title: 'Luz para Todos, a eletrificação rural',
    claim:
      'O Brasil levou energia elétrica aos últimos domicílios rurais por meio de um programa nacional executado com os estados e as distribuidoras privadas, e o acesso passou de 94,4% da população em 2000 para 99,8% em 2024.',
  },
  'bra-embrapa': {
    title: 'Embrapa, uma aposta de cinquenta anos na agricultura tropical',
    claim:
      'O Brasil criou em 1973 uma empresa pública de pesquisa agropecuária para tornar produtivos os solos ácidos tropicais e manteve seu financiamento em todas as trocas de governo desde então; a produção de cereais passou de 46,5 milhões de toneladas em 2000 para 155,9 milhões em 2023.',
  },
  'bra-bolsa-familia': {
    title: 'Bolsa Família e o cadastro único por trás dele',
    claim:
      'O Brasil montou um cadastro nacional único de famílias de baixa renda e pagou transferências condicionadas por meio dele, passando de 6,6 milhões de benefícios em dezembro de 2004 para um pico de 21,0 milhões em 2022 e 18,6 milhões em dezembro de 2025.',
  },
  'bra-urna-eletronica': {
    title: 'Eleições nacionais totalmente eletrônicas',
    claim:
      'Desde 2000, o Brasil realiza todas as eleições em urnas eletrônicas, para um eleitorado que chegou a 155,9 milhões de pessoas em 2024, com resultados divulgados na mesma noite.',
  },
  'bra-proalcool': {
    title: 'Proálcool, a substituição de combustível depois do choque do petróleo',
    claim:
      'O Brasil respondeu ao choque do petróleo de 1973 tornando obrigatória a mistura de etanol à gasolina e construindo uma indústria nacional de álcool combustível; a produção passou de 580 mil metros cúbicos em 1975 para 38.199 mil em 2025, e a partir de 2003 os motores flex passaram a escolha do combustível ao motorista.',
  },
  'bra-presal': {
    title: 'Petróleo em águas profundas e no pré-sal',
    claim:
      'O Brasil desenvolveu a extração em águas profundas, descobriu os campos do pré-sal em 2006 e passou a explorá-los a mais de 5.000 metros de profundidade; a produção nacional de petróleo subiu de 71.844 mil metros cúbicos em 2000 para 219.032 mil em 2025.',
  },
  'bra-bndes': {
    title: 'BNDES, o banco nacional de desenvolvimento',
    claim:
      'Fundado em 1952, o banco federal de desenvolvimento oferece financiamento de longo prazo e investimento em toda a economia nacional, e desembolsou R$ 169,7 bilhões em 2025.',
  },
  'bra-capes': {
    title: 'CAPES, o financiamento federal da pós-graduação',
    claim:
      'Fundada em 1951, a CAPES construiu um sistema nacional de financiamento e avaliação da pós-graduação, e em 1995 o sistema brasileiro já tinha mais de 60.000 alunos em mais de 1.000 cursos de mestrado e 600 de doutorado.',
  },
  'bra-lei-informatica': {
    title: 'Lei de Informática, uma política industrial setorial',
    claim:
      'A Lei 8.248/1991 condicionou os incentivos à tecnologia da informação a um investimento anual em pesquisa, desenvolvimento e inovação de pelo menos 5% do faturamento bruto interno elegível, o que criou um regime previsível para a capacidade do setor.',
  },
  'bra-casa-da-moeda': {
    title: 'Casa da Moeda do Brasil, a fabricante oficial de cédulas e moedas',
    claim:
      'Fundada em 1694, a Casa da Moeda se manteve como instituição pública nos regimes colonial, imperial e republicano e hoje produz cédulas, moedas, documentos de identidade e passaportes, depois de mais de 330 anos em funcionamento.',
  },
  'bra-itaipu': {
    title: 'Itaipu Binacional, o sistema elétrico criado por tratado',
    claim:
      'O Brasil e o Paraguai construíram e operam Itaipu por meio de uma entidade binacional criada por tratado, que chegou a 14.000 megawatts de capacidade instalada e abastece os dois países desde que a primeira unidade entrou em operação, em 1984.',
  },
  'bra-cadunico': {
    title: 'Cadastro Único, o registro social unificado',
    claim:
      'Desde 2001, o Cadastro Único identifica e caracteriza as famílias de baixa renda em todo o Brasil e se tornou a porta de entrada de mais de 40 programas sociais federais, estaduais e municipais.',
  },
  'bra-portal-transparencia': {
    title: 'Portal da Transparência, as contas federais abertas',
    claim:
      'Lançado em 2004, o Portal da Transparência publica há 20 anos informações sobre receitas, despesas, pessoal e transferências federais, para que qualquer cidadão possa verificar como o dinheiro público é usado.',
  },
  'bra-inep': {
    title: 'INEP, a instituição permanente de estatísticas educacionais',
    claim:
      'Criado em 1937, o INEP construiu um sistema permanente de estatísticas e censos educacionais que permite a atores federais, estaduais e municipais acompanhar escolas, alunos e resultados de políticas em todo o Brasil; seu arquivo histórico ocupa hoje 218,68 metros lineares.',
  },
  'bra-cgee': {
    title: 'CGEE, o centro de estudos estratégicos',
    claim:
      'Criado em 2001, o Centro de Gestão e Estudos Estratégicos foi concebido para produzir estudos prospectivos e recomendações de longo prazo para a política brasileira de ciência, tecnologia e inovação; 273 pesquisadores e especialistas assinaram sua ata de criação.',
  },
  'bra-telebras': {
    title: 'Telebras, o sistema de telecomunicações que foi desmontado',
    claim:
      'Criada em 1972, a Telebras coordenou o sistema estatal de telecomunicações até a privatização de 1998, quando 54 concessionárias foram separadas e o Estado deixou de operar a rede para regular e universalizar o serviço.',
  },
  'bra-embrapii': {
    title: 'EMBRAPII, pesquisa aplicada conduzida pela indústria',
    claim:
      'Criada em 2013, a EMBRAPII financia pesquisa industrial que empresas contratam com unidades de pesquisa públicas e privadas credenciadas, e contratou um recorde de 811 novos projetos em 2025, 25,35% a mais que em 2024.',
  },
  'bra-sibratec': {
    title: 'SIBRATEC, as redes nacionais de tecnologia',
    claim:
      'Para aproximar universidades e empresas, o governo federal criou o SIBRATEC, coordenado pelo Ministério da Ciência e Tecnologia com a participação da FINEP, do BNDES e do INMETRO, como um sistema nacional que somava 56 redes de pesquisa e desenvolvimento em 2010: 14 redes de centros de inovação, 20 de serviços tecnológicos e 22 de extensão tecnológica nos estados.',
  },
  'bra-sus-conselhos': {
    title: 'Conselhos de saúde do SUS, participação social permanente',
    claim:
      'Desde que a Lei 8.142 os instituiu, em 1990, o SUS exige conselhos de saúde permanentes e deliberativos nas esferas nacional, estadual e municipal, com metade das vagas para os usuários (50%) e 25% para cada um dos outros dois segmentos: trabalhadores da saúde, e governo ou prestadores de serviço.',
  },
  'bra-salario-minimo': {
    title: 'Salário mínimo e sua regra permanente de valorização',
    claim:
      'O Congresso e o presidente da República instituíram uma política permanente de valorização anual do salário mínimo pela Lei 14.663/2023, que fixou o piso nacional em R$ 1.320 a partir de maio de 2023 e vinculou os reajustes seguintes à inflação medida pelo INPC mais o crescimento real do PIB de dois anos antes.',
  },
  'bra-bcb-sandbox': {
    title: 'Sandbox regulatório do Banco Central, primeiro ciclo',
    claim:
      'O Banco Central abriu inscrições para seu sandbox regulatório em fevereiro de 2021, recebeu 52 projetos, admitiu sete para testes sob regras flexibilizadas a partir de 6 de dezembro de 2021 e conduziu o ciclo por um ano, com uma prorrogação permitida.',
  },
  'bra-mai-dai': {
    title: 'MAI/DAI, bolsas de inovação para pesquisa com empresas parceiras',
    claim:
      'O CNPq, com cofinanciamento da CAPES na chamada de 2024, realizou quatro chamadas do programa Mestrado e Doutorado Acadêmico para Inovação (2018, 2020, 2022 e 2024), das quais haviam participado cerca de 80 instituições de ciência e tecnologia e mais de 200 empresas, com pelo menos 5.000 bolsas concedidas até 2024 para pesquisas de estudantes de graduação e pós-graduação em projetos definidos com empresas parceiras.',
  },
  'bra-eja': {
    title: 'Educação de Jovens e Adultos (EJA) e sua erosão',
    claim:
      'A Educação de Jovens e Adultos, modalidade da educação básica para quem não a concluiu na idade própria, oferecida sobretudo pelas redes públicas, tinha 2.962.322 matrículas em 2021 e 2.252.069 em 2025, uma queda de cerca de 24% em quatro anos, segundo o Censo Escolar do INEP.',
  },
  'bra-auxilio-reconstrucao': {
    title: 'Auxílio Reconstrução, o repasse federal às famílias depois das enchentes de 2024 no Rio Grande do Sul',
    claim:
      'Depois das enchentes que começaram no fim de abril de 2024 no Rio Grande do Sul, o governo federal pagou R$ 2,1 bilhões de Auxílio Reconstrução a 429.000 famílias, segundo o balanço que a secretaria extraordinária para a reconstrução do estado apresentou a uma comissão da Câmara dos Deputados em 12 de fevereiro de 2025.',
  },
}
