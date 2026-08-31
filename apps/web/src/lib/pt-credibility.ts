/**
 * Portuguese interpretation-layer material for the credibility pages.
 *
 * The English decision and artefact files remain the source records. These
 * entries preserve their ids and translate the reader-facing explanation so
 * the Portuguese pages never fall back to an English paragraph.
 */

type PortugueseDecision = {
  id: string
  title: string
  choice: string
  why: string
  cost: string
  overturned: string
}

type DecisionTuple = [string, string, string, string, string, string]

const decisions: PortugueseDecision[] = ([
  ['D1', 'Nove dimensões, sem ranking geral', 'O benchmark publica nove dimensões separadas e não cria um ranking geral.', 'Um perfil mostra onde as capacidades se combinam e onde divergem.', 'O leitor precisa interpretar uma forma, não um único número.', 'Evidência de que um agregado melhora decisões sem esconder diferenças entre dimensões.'],
  ['D2', 'Normalização relativa ao conjunto de países', 'Cada indicador é normalizado dentro do conjunto comparado.', 'A escala é verificável e não depende de uma fronteira teórica difícil de observar.', 'Os números são relativos e mudam quando o quadro muda.', 'Uma medida absoluta, auditável e disponível para todos os indicadores.'],
  ['D3', 'Pesos iguais dentro de uma dimensão', 'Os indicadores observados têm o mesmo peso na média da dimensão.', 'Pesos iguais deixam o julgamento aberto e evitam que uma preferência escondida domine o resultado.', 'Um indicador fraco pode ter a mesma influência de um indicador forte.', 'Validação empírica de pesos alternativos que seja mais robusta e interpretável.'],
  ['D4', 'Confiança ao lado da pontuação', 'A confiança é publicada separadamente e nunca entra na pontuação.', 'Uma pontuação e a qualidade da evidência respondem a perguntas diferentes.', 'O leitor precisa considerar dois números.', 'Evidência de que combinar confiança e capacidade melhora a interpretação sem penalizar dados legítimos.'],
  ['D5', 'Dados ausentes não são imputados', 'Valores ausentes são retirados da média e reduzem a cobertura.', 'Preencher lacunas faria o modelo afirmar mais do que a fonte informa.', 'Dimensões com poucos dados ficam mais incertas.', 'Uma regra de imputação que possa ser auditada e que preserve a incerteza.'],
  ['D6', 'Cobertura mínima para publicar uma pontuação', 'A dimensão publica uma pontuação somente quando pelo menos dois indicadores são observados.', 'Uma única observação não sustenta uma média de dimensão.', 'Algumas dimensões exibem confiança e evidência sem publicar score.', 'Evidência de que uma única série representa a dimensão de forma estável em vários países.'],
  ['D7', 'Winsorização com cercas de Tukey em k igual a três', 'Valores extremos são limitados antes de a escala ser criada, usando três intervalos interquartis.', 'Um outlier não deve comprimir todos os outros países.', 'Parte da informação extrema é perdida.', 'Um método de escala que controle influência sem reduzir a comparabilidade.'],
  ['D8', 'A observação mais recente e nenhuma tendência inicial', 'A pontuação usa a observação mais recente de cada país e indicador.', 'A camada de score deve ser simples antes de incorporar séries temporais.', 'O score não conta sozinho a história da mudança.', 'Uma regra temporal validada que melhore a atualidade sem misturar anos incomparáveis.'],
  ['D9', 'Lacunas permanecem no registro', 'Indicadores sem dataset comparável permanecem visíveis como lacunas.', 'A agenda de coleta é parte do resultado e não deve ser apagada.', 'Lacunas reduzem confiança e deixam a dimensão incompleta.', 'Um dataset comparável que cubra ao menos dois países.'],
  ['D10', 'Inspecionabilidade é filtro obrigatório', 'A fonte precisa permitir inspeção suficiente do dado e do método.', 'Um número que não pode ser verificado não sustenta uma afirmação pública.', 'Algumas medidas conhecidas ficam fora do score.', 'Acesso independente aos dados subjacentes e à metodologia.'],
  ['D11', 'Delphi não entra no score de capacidade', 'Estimativas Delphi permanecem separadas do score baseado em indicadores.', 'Julgamento de modelos é uma camada diferente de evidência.', 'O painel não preenche automaticamente todos os vazios.', 'Evidência de que uma combinação validada melhora previsões sem apagar a origem do número.'],
  ['D12', 'Divergência do painel é preservada', 'A distribuição e a divergência do painel são publicadas, sem reduzi-las a uma média única.', 'Discordância é informação sobre incerteza e não um erro a ser escondido.', 'O leitor vê uma faixa menos conveniente.', 'Convergência repetida e explicada entre panelistas em rodadas independentes.'],
  ['D13', 'Diversidade vem dos fornecedores', 'A diversidade do painel vem de modelos e fornecedores diferentes, não apenas do tamanho do modelo.', 'Perspectivas e priors distintos tornam o desacordo mais informativo.', 'A coordenação e o custo da rodada aumentam.', 'Evidência de que modelos do mesmo fornecedor produzem diversidade suficiente e estável.'],
  ['D14', 'Proveniência é armazenada', 'A proveniência fica no arquivo da rodada e não é deduzida do nome do modelo.', 'O nome de um modelo não prova como uma estimativa foi produzida.', 'Arquivos carregam mais metadados.', 'Uma cadeia de origem mais completa e verificável que possa substituir esse campo.'],
  ['D15', 'World Bank é a única ingestão conectada em v0', 'A primeira ingestão automática usa a API do World Bank.', 'Um adaptador comum permite testar o pipeline antes de ampliar fontes.', 'A cobertura inicial tem lacunas conhecidas.', 'Outra fonte com cobertura, estabilidade e inspeção comparáveis.'],
  ['D16', 'Quadro preso aos dez países de referência', 'A versão inicial normaliza contra os dez países de referência.', 'O conjunto foi pequeno o bastante para inspeção manual.', 'O quadro não representa o mundo inteiro.', 'Uma rebase anunciada e validada, com conjunto de países definido explicitamente.'],
  ['D17', 'Faixas de confiança fixas', 'As faixas usam limites fixos, sem uma escala visual vermelho-verde.', 'O leitor não deve confundir confiança com uma nota de qualidade ou aprovação.', 'As faixas não se ajustam à distribuição de uma versão.', 'Limites validados que comuniquem melhor a incerteza sem criar um ranking moral.'],
  ['D18', 'Uma apresentação para todo score de 0 a 100', 'Todo score de 0 a 100 usa a mesma apresentação visual.', 'Consistência reduz interpretações acidentais entre páginas.', 'Uma tabela pode ter menos espaço para tratamentos especiais.', 'Um problema de acessibilidade ou compreensão que a apresentação comum não resolva.'],
  ['D19', 'Países estendidos não recebem marca visual', 'O viewer não marca visualmente um subconjunto como extensão.', 'Todos os países presentes participam do quadro e devem ser lidos com a mesma regra.', 'O leitor precisa consultar o conjunto e a versão.', 'Uma finalidade pública que exija uma distinção explícita e não distorça a leitura.'],
  ['D20', 'Entregas documentadas são evidência, nunca score', 'Casos documentados ficam ao lado de indicadores ausentes e nunca são pontuados.', 'Uma entrega real pode ser relevante sem ser comparável entre países.', 'A evidência narrativa não altera a média.', 'Uma série comparável que cubra pelo menos dois países e passe pelos testes do registro.'],
  ['D21', 'GEM é manual e capital de risco continua lacuna', 'A atividade empreendedora do GEM entra por tabela publicada; capital de risco fica como lacuna.', 'A primeira medida tem uma fonte inspecionável e a segunda ainda não tem cobertura suficiente.', 'A experimentação continua submedida.', 'Uma série de capital de risco comparável e uma rota de ingestão inspecionável.'],
  ['D22', 'Impulso usa uma régua e uma cesta compatível', 'Tendências usam o quadro atual e apenas indicadores observados nos dois extremos.', 'Isso separa mudança real de mudança causada pela entrada ou saída de indicadores.', 'A cesta da tendência pode ser menor que a dimensão.', 'Uma série temporal mais completa que preserve a mesma comparabilidade.'],
  ['D23', 'A camada de percepção é aposentada', 'Compostos de percepção que acompanham riqueza são retirados do score.', 'A capacidade que o benchmark quer medir não deve ser substituída por uma opinião sobre prosperidade.', 'Coordenação, Confiança e Propósito compartilhado ficam com menos indicadores.', 'Medidas comportamentais e institucionais que cubram as mesmas perguntas sem o mesmo viés.'],
  ['D24', 'Duas extensões e uma linha para cada indicador', 'O viewer publica extensões de 10 e 20 anos e a linha histórica de cada indicador.', 'A tendência da dimensão e a história de uma série são perguntas diferentes.', 'Há mais dados para ler e interpretar.', 'Evidência de que outra janela é mais útil e preserva a cesta compatível.'],
  ['D25', 'Cada ponto carrega origem e cada rodada registra mudanças', 'Valores históricos carregam valor bruto, valor normalizado e fonte; cada ingestão registra alterações.', 'O leitor precisa saber tanto o que mudou quanto de onde veio.', 'Os arquivos e revisões são maiores.', 'Uma trilha de auditoria equivalente que seja mais simples e completa.'],
  ['D26', 'Cada termo é definido uma vez', 'O vocabulário do benchmark vive no modelo e é reutilizado pelo viewer.', 'Definições duplicadas inevitavelmente divergem.', 'Uma mudança de linguagem exige atualizar a camada central.', 'Um sistema de vocabulário versionado que mantenha uma única definição.'],
  ['D27', 'Quarenta países e um arquivo por país', 'A saída pública separa o índice curto dos arquivos completos de cada país.', 'Listas não precisam carregar megabytes de séries históricas.', 'Há mais arquivos para manter.', 'Uma forma de entrega com o mesmo custo de leitura e a mesma inspeção.'],
  ['D28', 'Ícones são copiados e nunca aparecem sozinhos', 'Ícones são definidos localmente, reutilizados por conceito e acompanhados de texto.', 'O ícone reforça o significado, mas não pode ser a única explicação.', 'A biblioteca visual precisa ser mantida.', 'Um sistema acessível que comunique os mesmos conceitos com menos manutenção.'],
  ['D29', 'A oitava dimensão mantém um só nome', 'A dimensão building é exibida como Construção, com marca própria nos eixos.', 'Um nome estável é melhor que alternar entre rótulos parecidos.', 'A tradução precisa respeitar o termo escolhido.', 'Evidência de que leitores entendem melhor outro nome sem quebrar ids e dados.'],
  ['D30', 'Todo número abre o campo onde está', 'Scores e indicadores apontam para a distribuição ou série comparável.', 'Um número sem contexto convida a uma leitura excessiva.', 'Cada interação precisa de uma página ou painel adicional.', 'Evidência de que o contexto inline melhora mais a compreensão que a navegação.'],
  ['D31', 'Um registro carrega seu mecanismo', 'Padrões documentados informam o mecanismo e têm uma página própria.', 'O caso não deve parecer uma anedota sem explicação causal.', 'A autoria analítica permanece visível.', 'Evidência que ligue mecanismo, pré-condições e resultado em comparações replicáveis.'],
  ['D32', 'Evidência fina aparece como controle no gráfico', 'O radar mostra baixa confiança com borda tracejada e ponto vazado.', 'Incerteza precisa aparecer na leitura principal sem entrar no score.', 'O visual tem uma convenção que precisa ser aprendida.', 'Teste de compreensão que favoreça outra codificação sem perder a distinção.'],
  ['D33', 'Registros de evidência precisam de regra de inclusão', 'Uma entrega só entra quando tem fonte, período, número, limite e data de consulta.', 'A regra evita que narrativa seletiva pareça dado comparável.', 'Alguns casos úteis ficam de fora.', 'Uma regra pública que seja mais inclusiva sem diminuir a auditabilidade.'],
  ['D34', 'Países usam ISO 3166-1 alpha-3', 'IDs de país usam códigos ISO de três letras.', 'Um identificador estável evita nomes ambíguos e muda pouco entre idiomas.', 'O leitor precisa de uma legenda para alguns códigos.', 'Um padrão internacional mais claro e igualmente estável.'],
  ['D35', 'Agenda é calculada e idioma é camada de interpretação', 'Traduções mudam a leitura, não os ids, os números ou o registro central.', 'A base em inglês permanece estável enquanto novas leituras podem ser adicionadas.', 'Cada idioma exige revisão própria.', 'Evidência de que traduzir a camada de dados melhora a precisão sem perder rastreabilidade.'],
  ['D36', 'A entrega informa sua posição e pode ter dois números', 'Um registro pode carregar o estado da entrega e uma alegação com dois valores.', 'O leitor precisa distinguir fato, momento e interpretação.', 'A publicação fica mais detalhada.', 'Uma estrutura que preserve essas distinções com menos campos.'],
  ['D37', 'A saída se descreve sozinha', 'O dataset publica descriptor, schemas e versão junto dos dados.', 'Máquinas e leitores devem saber o que cada arquivo contém.', 'Cada mudança de forma exige atualizar os metadados.', 'Um padrão público que ofereça a mesma descoberta e validação.'],
  ['D38', 'A homepage é global e o país é uma camada', 'A entrada mostra o conjunto; a página de país mostra um perfil sobre ele.', 'O contexto global evita tratar um país como caso isolado.', 'A homepage precisa carregar uma lista maior.', 'Evidência de que outra entrada serve melhor a leitores novos sem perder o contexto.'],
  ['D40', 'Data é metadado e documento é link', 'Datas aparecem como dateline e arquivos citados viram links navegáveis.', 'Informação temporal não deve se esconder em prosa e um checkout não é uma página pública.', 'A interface precisa manter os links atualizados.', 'Uma forma mais clara de separar data, fonte e documento.'],
  ['D41', 'Avisos do pipeline chegam ao viewer', 'O pipeline preserva seus avisos e o viewer os mostra.', 'Descartar um aviso transforma uma limitação operacional em falsa certeza.', 'O output contém mais mensagens.', 'Evidência de que os avisos são ruído e não melhoram decisões.'],
  ['D42', 'Candidato é julgado pelo efeito na dimensão', 'Uma série candidata é avaliada dentro da dimensão, não apenas por sua correlação isolada.', 'Uma boa medida pode corrigir ou duplicar o sinal de outras medidas.', 'A aprovação exige análise comparativa.', 'Uma regra mais forte que detecte validade e redundância ao mesmo tempo.'],
  ['D43', 'A página de país abre na agenda', 'A agenda é a primeira leitura do perfil de um país.', 'Ela conecta diagnóstico a ação sem transformar a agenda em score.', 'O score exige um clique adicional.', 'Teste de navegação que mostre uma entrada mais útil para a maioria dos leitores.'],
  ['D44', 'Taxa de homicídio é aposentada', 'A taxa de homicídio deixa de ser indicador pontuado.', 'Ela acompanhava a riqueza no sentido que o benchmark queria evitar.', 'A dimensão perde uma medida direta de segurança.', 'Uma medida de segurança comparável que não replique o mesmo sinal de riqueza.'],
  ['D45', 'Dimensão com menos de dois indicadores não publica score', 'Uma dimensão com menos de dois indicadores observados publica null e informa a cobertura.', 'Um único valor não sustenta uma dimensão composta.', 'O radar deixa o eixo vazio.', 'Evidência de que uma única série é suficiente para a pergunta específica.'],
  ['D46', 'Caso de estudo é endereço e a lista é filtro', 'Cada caso documentado tem uma URL própria e a lista pode ser filtrada.', 'Endereços tornam a evidência citável e filtros tornam a busca reproduzível.', 'A interface tem mais rotas.', 'Uma estrutura de citação e consulta mais estável.'],
  ['D47', 'Cada país define o quadro em que é pontuado', 'Todos os países participam da construção e da aplicação da escala.', 'Não existe grupo privilegiado nem régua externa escondida.', 'Adicionar um país atualiza todos os scores e exige rebase majoritário.', 'Evidência de que uma régua externa é mais honesta e comparável.'],
  ['D48', 'Painel passa pelo mesmo teste de riqueza', 'A coluna Delphi é analisada quanto ao risco de proxy de riqueza.', 'Separar painel e score não torna a interpretação do painel automaticamente válida.', 'Algumas estimativas ficam menos convincentes.', 'Evidência independente de capacidade que sobreviva ao teste de riqueza.'],
  ['D49', 'A busca se descreve uma vez', 'A fonte, os bancos e a construção da requisição vivem em um só lugar.', 'A página de fontes e a ingestão não podem divergir.', 'Mudanças de API exigem atualizar uma definição central.', 'Uma abstração que mantenha a mesma descrição única e verificável.'],
  ['D50', 'Condições de falsificação formam um índice', 'A página de desafio extrai o que poderia derrubar cada decisão.', 'O leitor precisa encontrar o teste sem ler o arquivo inteiro.', 'A redação das decisões precisa manter um rótulo estável.', 'Uma forma mais completa de comparar desafios sem duplicar o registro.'],
  ['D51', 'A América Latina é coberta por inteiro', 'O conjunto inclui todos os países soberanos da região definida pelo projeto.', 'A região de uso principal não deve ser representada por uma amostra conveniente.', 'A cobertura e a rebase tornam-se mais exigentes.', 'Uma definição regional explícita que seja mais representativa para a finalidade do benchmark.'],
  ['D52', 'Série candidata é testada antes do registro', 'Uma série precisa ser testada para código, cobertura, direção e efeito antes de entrar no registro.', 'Um código válido em um país pode falhar nos outros.', 'Há uma etapa de investigação antes da ingestão.', 'Um processo automatizado que prove as mesmas propriedades.'],
  ['D53', 'Radar responde ao ponteiro', 'O radar abre no primeiro eixo e mostra sempre uma dimensão sob o ponteiro.', 'A forma é um índice de entrada, não uma média headline escondida.', 'O leitor precisa apontar para ler o detalhe.', 'Teste de compreensão que favoreça um resumo sem criar um ranking geral.'],
  ['D54', 'Mapa institucional explica, mas não pontua', 'Instituições e relações aparecem como contexto, nunca como score.', 'A rede ajuda a perguntar quem age sem fingir que sua contagem mede capacidade.', 'O viewer tem uma camada explicativa adicional.', 'Uma medida institucional comparável e validada que possa ser pontuada.'],
  ['D55', 'Execução orçamentária é a primeira substituta da Coordenação', 'A fidelidade da execução orçamentária entra como indicador baseado em API.', 'Ela mede uma condição de coordenação com fonte pública e comparável.', 'Ainda há pouca cobertura em algumas dimensões.', 'Evidência de que uma série institucional comparável cobre melhor a coordenação.'],
  ['D56', 'Mapa institucional é diretório e ledger de relações', 'O mapa deriva famílias e contagens e não desenha uma rede fixa.', 'O conjunto cresce e precisa continuar legível sem layout manual.', 'O leitor vê menos conexões visuais individuais.', 'Uma visualização de rede que permaneça acessível e legível quando o mapa crescer.'],
  ['D57', 'Confiança tem duas famílias', 'Confiança separa relações sociais e institucionais e não publica o score antes de responder às duas.', 'Uma família sozinha não representa a pergunta completa.', 'A dimensão pode permanecer sem score por mais tempo.', 'Evidência comparável para as duas famílias ou uma pergunta revisada publicamente.'],
  ['D58', 'A fiação do país é uma matriz com rampa fixa', 'A matriz usa contagens e três quebras fixas, sem ajustar a escala aos dados.', 'Uma contagem absoluta precisa permanecer comparável entre filtros e países.', 'Algumas células ficam concentradas nas faixas mais baixas.', 'Teste de compreensão que demonstre uma escala fixa melhor que a atual.'],
  ['D59', 'O dataset publica um contrato de citação', 'Documentos para leitores automáticos dizem quais campos devem acompanhar cada score.', 'Um score sozinho convida a uma afirmação sem contexto.', 'Respostas automáticas precisam carregar mais contexto.', 'Um padrão de citação que preserve score, confiança, fonte e versão.'],
  ['D60', 'Série não pontuável fica ao lado do score', 'Uma série que falha nos testes aparece como verificação com o motivo anexado.', 'Excluir o dado esconde informação; pontuá-lo exagera sua validade.', 'O leitor precisa distinguir score de verificação.', 'Evidência de que a série deve ser retirada por completo ou reclassificada com outro teste.'],
  ['D61', 'Cards sociais são imagens estáticas', 'Cards sociais usam imagens com caminhos públicos estáveis.', 'Compartilhamento precisa funcionar sem renderizar o viewer inteiro.', 'Cada superfície social precisa de metadados mantidos.', 'Uma alternativa pública que preserve estabilidade e baixo custo.'],
  ['D62', 'Disputas preservam o snapshot alvo', 'Uma contestação guarda a versão do score questionado e conta países alvo distintos.', 'O debate precisa permanecer ligado ao número que o originou.', 'Registros de disputa carregam mais contexto histórico.', 'Uma forma de preservar o alvo e a contagem sem perder auditabilidade.'],
  ['D63', 'Score de fonte e Delphi são trilhas separadas', 'Pontuações baseadas em fonte e estimativas Delphi permanecem separadas em todas as superfícies.', 'Misturar as duas origens faria um julgamento parecer dado observado.', 'A interface precisa nomear a origem com clareza.', 'Evidência de uma combinação que mantenha a proveniência e melhore a decisão.'],
] as DecisionTuple[]).map(([id, title, choice, why, cost, overturned]) => ({
  id,
  title,
  choice,
  why,
  cost,
  overturned,
}))

type PortugueseArtefact = { id: string; title: string; body: string }

const artefacts: PortugueseArtefact[] = [
  { id: 'A1', title: 'Experimentação é inferida a partir de patentes', body: 'A dimensão Experimentação tem pouca medida direta. Patentes capturam produção formal e podem refletir estratégia defensiva, capacidade jurídica ou tamanho econômico, não apenas tentativas e aprendizado.' },
  { id: 'A2', title: 'Normalização per capita achata a Índia', body: 'Dividir por população pode reduzir a leitura da escala absoluta de uma economia grande. A pontuação por pessoa é útil para comparar intensidade, mas não descreve sozinha a capacidade agregada.' },
  { id: 'A3', title: 'Coordenação e Confiança medem riqueza em parte', body: 'As duas dimensões têm cobertura baixa e indicadores que se relacionam com renda. Seus scores devem ser lidos com confiança, cobertura e fontes, nunca como medidas puras de coordenação ou confiança.' },
  { id: 'A4', title: 'Quatro séries de governança são uma só medida', body: 'Os compostos de governança têm correlação e origem próximas. Tratá-los como quatro sinais independentes daria peso excessivo à mesma percepção.' },
  { id: 'A5', title: 'Voz e responsabilização responde outra pergunta', body: 'A série fala sobre direitos e participação política, enquanto Propósito compartilhado pergunta se pessoas se veem em um projeto comum. A proximidade conceitual não prova que sejam o mesmo mecanismo.' },
  { id: 'A6', title: 'Indicadores Doing Business estão congelados em 2019', body: 'A fonte foi interrompida e seus valores não acompanham mudanças recentes. A atualidade reduz a confiança, embora a série permaneça útil como registro histórico.' },
  { id: 'A7', title: 'Learning favorece o Brasil e desfavorece Coreia, Estônia e Singapura', body: 'A cobertura e a escolha das medidas de aprendizagem produzem um padrão que pode não refletir aprendizagem real. Educação observada e capacidade de aprender não são equivalentes.' },
  { id: 'A8', title: 'Toda correlação é uma pista', body: 'O conjunto de países é pequeno e não representa uma amostra aleatória do mundo. Correlações ajudam a encontrar redundâncias e riscos, mas não estabelecem causas.' },
  { id: 'A9', title: 'Coordenação fica baixa demais para Estados competentes', body: 'Poucos indicadores observados e valores antigos podem fazer pequenos Estados competentes parecerem fracos. A confiança e a cesta da tendência precisam aparecer junto da pontuação.' },
  { id: 'A10', title: 'O quadro tem 53 países e não é o mundo', body: 'Os extremos de cada escala pertencem ao conjunto atual. Um score alto ou baixo é uma posição relativa neste quadro, não uma fração da capacidade mundial.' },
  { id: 'A11', title: 'Construção mede produção industrial e lê como entrega', body: 'Valor adicionado e exportações industriais são resultados posteriores. Eles oferecem um sinal de execução e construção, mas também refletem estrutura produtiva e história econômica.' },
  { id: 'A12', title: 'Coordenação e Confiança têm poucos indicadores', body: 'Mesmo com regras de cobertura, as duas dimensões publicam uma visão estreita quando famílias inteiras não têm dados. O leitor deve tratar o score como hipótese de trabalho e acompanhar a agenda de coleta.' },
]

export function ptDecisionsMarkdown(): string {
  return [
    '# Registro de decisões',
    '',
    'Esta é a camada editorial em português do registro de decisões. Os ids permanecem iguais ao documento fonte para que cada escolha continue citável e auditável.',
    '',
    ...decisions.flatMap((decision) => [
      `## ${decision.id}: ${decision.title}`,
      '',
      `**Escolha.** ${decision.choice}`,
      '',
      `**Por quê.** ${decision.why}`,
      '',
      `**Custo.** ${decision.cost}`,
      '',
      `**Superada por.** ${decision.overturned}`,
      '',
    ]),
  ].join('\n')
}

export function ptArtefactsMarkdown(): string {
  return [
    '# Artefatos conhecidos',
    '',
    'Estes são padrões da versão atual que podem produzir uma leitura enganosa. Eles acompanham os números para indicar onde a cautela é necessária.',
    '',
    ...artefacts.flatMap((artefact) => [
      `## ${artefact.id}: ${artefact.title}`,
      '',
      artefact.body,
      '',
    ]),
  ].join('\n')
}
