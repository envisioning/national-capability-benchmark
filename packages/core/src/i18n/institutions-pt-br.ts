import type {
  InstitutionNetwork,
  LocalizedInstitutionNetwork,
} from '../model/institutions.js'
import type { Lang } from './types.js'

/**
 * The Brazilian institution map's own prose. The enum vocabulary lives in the
 * lexicons beside every other translation; only the per-institution summaries
 * and the scope sentence are here, because they describe one country's file
 * rather than the shared model. See D56.
 */

const SUMMARIES: Record<string, string> = {
  'bra.federal.presidency': 'Dirige o Poder Executivo federal, coordena o governo e transforma prioridades políticas em decisões administrativas.',
  'bra.federal.chamber': 'Representa a população na Câmara dos Deputados, aprova leis, o orçamento e fiscaliza o Executivo.',
  'bra.federal.senate': 'Representa os estados no Congresso, aprova leis e confirma nomeações para cargos definidos pela Constituição.',
  'bra.federal.stf': 'Guarda a Constituição e decide se leis e atos dos governos respeitam seus limites.',
  'bra.federal.stj': 'Uniformiza a interpretação da lei federal nos casos que não tratam diretamente da Constituição.',
  'bra.federal.tcu': 'Exerce o controle externo das contas e do uso de recursos federais em apoio ao Congresso Nacional.',
  'bra.federal.pgr': 'Chefia o Ministério Público da União e atua em processos de interesse público perante os tribunais superiores.',
  'bra.federal.agu': 'Representa a União judicialmente e orienta juridicamente a administração federal.',
  'bra.federal.cgu': 'Audita o Executivo federal e coordena políticas de integridade, ouvidoria e acesso à informação.',
  'bra.federal.mgi': 'Organiza a gestão federal, o serviço público, o governo digital e parte das empresas e sistemas administrativos da União.',
  'bra.federal.mpo': 'Coordena o planejamento e o orçamento federal e acompanha prioridades de médio prazo.',
  'bra.federal.enap': 'Forma servidores e dirigentes públicos e produz conhecimento aplicado à gestão e às políticas públicas.',
  'bra.federal.ibge': 'Produz as estatísticas, os censos e as informações geográficas oficiais usadas pelo país.',
  'bra.federal.ipea': 'Pesquisa políticas públicas e assessora o Estado em decisões estratégicas.',
  'bra.federal.bcb': 'Conduz a política monetária, regula o sistema financeiro e opera partes centrais da infraestrutura de pagamentos.',
  'bra.federal.mdic': 'Formula políticas de desenvolvimento produtivo, comércio exterior, indústria e serviços.',
  'bra.federal.bndes': 'Oferece financiamento de longo prazo e estrutura investimentos para empresas e governos.',
  'bra.federal.mcti': 'Coordena a política federal de ciência, tecnologia e inovação.',
  'bra.federal.finep': 'Financia pesquisa, desenvolvimento e inovação em empresas, universidades e institutos tecnológicos.',
  'bra.federal.cnpq': 'Concede bolsas e apoia a pesquisa científica e tecnológica.',
  'bra.federal.mec': 'Coordena a política federal de educação e regula o ensino superior dentro de suas competências.',
  'bra.federal.capes': 'Avalia a pós-graduação e financia a formação de pesquisadores e professores.',
  'bra.federal.mapa': 'Coordena políticas federais para agricultura, pecuária e abastecimento.',
  'bra.federal.embrapa': 'Faz pesquisa aplicada à agricultura e transforma conhecimento científico em sistemas de produção.',
  'bra.federal.ms': 'Coordena o Sistema Único de Saúde no plano federal e define políticas nacionais de saúde.',
  'bra.federal.fiocruz': 'Produz pesquisa, tecnologia, formação e serviços para o sistema público de saúde.',
  'bra.federal.anvisa': 'Regula produtos e serviços sujeitos à vigilância sanitária.',
  'bra.federal.serpro': 'Constrói e opera sistemas digitais usados pela administração federal.',
  'bra.federal.dataprev': 'Processa dados e opera sistemas de previdência e políticas sociais.',
  'bra.federal.cade': 'Defende a concorrência e julga atos de concentração e condutas anticompetitivas.',
  'bra.federal.inpi': 'Concede e administra direitos de propriedade industrial, como marcas e patentes.',
  'bra.federal.mjsp': 'Coordena a política federal de justiça e segurança pública e articula o sistema nacional de segurança.',
  'bra.federal.pf': 'Exerce a polícia judiciária da União e investiga crimes federais, interestaduais e internacionais.',
  'bra.federal.prf': 'Faz o policiamento das rodovias federais, protege usuários e apoia o combate a crimes transfronteiriços.',
  'bra.federal.defesa': 'Coordena a política de defesa nacional e a administração das Forças Armadas.',
  'bra.federal.gsi': 'Assessora a Presidência em segurança institucional, infraestrutura crítica e coordenação de inteligência.',
  'bra.federal.abin': 'Produz inteligência para decisões de Estado e coordena o sistema brasileiro de inteligência.',
  'bra.federal.tse': 'Organiza as eleições, administra a Justiça Eleitoral e julga conflitos eleitorais.',
  'bra.federal.cnj': 'Supervisiona a gestão administrativa e financeira do Judiciário e publica dados da Justiça.',
  'bra.federal.cnmp': 'Fiscaliza a atuação administrativa e funcional do Ministério Público.',
  'bra.federal.dpu': 'Presta assistência jurídica e defende os direitos de pessoas sem recursos em questões federais.',
  'bra.federal.tst': 'Uniformiza a orientação da Justiça do Trabalho e julga processos de sua competência constitucional.',
  'bra.federal.mpt': 'Defende direitos trabalhistas e move ações coletivas contra violações no trabalho.',
  'bra.federal.receita': 'Administra tributos federais e a aduana, apoia a política tributária e combate ilícitos fiscais.',
  'bra.federal.tesouro': 'Administra a dívida pública federal, as contas fiscais e os padrões de informação financeira do setor público.',
  'bra.federal.pgfn': 'Representa a União em matéria tributária e cobra a dívida ativa federal.',
  'bra.federal.inss': 'Opera o sistema federal de benefícios previdenciários por meio de uma rede nacional de atendimento.',
  'bra.federal.caixa': 'Oferece serviços bancários públicos, financiamento habitacional e infraestrutura de pagamentos de programas federais.',
  'bra.federal.bb': 'Oferece serviços bancários, crédito agrícola e pagamentos com mandato público e rede nacional.',
  'bra.federal.mte': 'Coordena as políticas federais de trabalho, emprego e renda.',
  'bra.federal.mds': 'Coordena a assistência social, a segurança alimentar e as políticas de transferência de renda.',
  'bra.federal.mma': 'Coordena a política ambiental federal e a agenda climática.',
  'bra.federal.mda': 'Coordena políticas de desenvolvimento agrário e agricultura familiar.',
  'bra.federal.mpi': 'Coordena políticas federais para os povos indígenas e a proteção de seus direitos e territórios.',
  'bra.federal.ibama': 'Licencia, monitora e fiscaliza regras ambientais federais e combate infrações ambientais.',
  'bra.federal.icmbio': 'Administra unidades de conservação federais e protege a biodiversidade com operações de campo e pesquisa.',
  'bra.federal.funai': 'Protege direitos indígenas e coordena a ação federal em terras indígenas.',
  'bra.federal.incra': 'Executa reforma agrária, regularização fundiária e programas de desenvolvimento rural.',
  'bra.federal.ana': 'Regula recursos hídricos federais e produz informação para segurança hídrica e saneamento.',
  'bra.federal.anpd': 'Orienta e fiscaliza a proteção de dados pessoais no Brasil.',
  'bra.federal.mcom': 'Coordena políticas federais de comunicação, conectividade e serviços postais.',
  'bra.federal.mme': 'Coordena políticas federais de energia, mineração e combustíveis.',
  'bra.federal.transport': 'Coordena a política federal de transportes terrestres e o planejamento de infraestrutura.',
  'bra.federal.midr': 'Coordena desenvolvimento regional, resposta à seca, proteção civil e infraestrutura hídrica.',
  'bra.federal.anatel': 'Regula telecomunicações e fiscaliza a qualidade e a concorrência nos serviços de comunicação.',
  'bra.federal.aneel': 'Regula geração, transmissão e distribuição de energia elétrica e o atendimento ao consumidor.',
  'bra.federal.anp': 'Regula os mercados de petróleo, gás e biocombustíveis e acompanha seu abastecimento e qualidade.',
  'bra.federal.antt': 'Regula concessões federais de rodovias e ferrovias e suas obrigações de serviço.',
  'bra.federal.anac': 'Regula a segurança da aviação civil, o acesso ao mercado e as concessões aeroportuárias.',
  'bra.federal.antaq': 'Regula o transporte aquaviário e as instalações portuárias sob competência federal.',
  'bra.federal.ans': 'Regula planos de saúde privados e protege consumidores na saúde suplementar.',
  'bra.federal.anm': 'Regula direitos minerários, segurança e obrigações ambientais do setor mineral.',
  'bra.federal.cvm': 'Regula o mercado de valores mobiliários e protege investidores com transparência e supervisão.',
  'bra.federal.susep': 'Supervisiona seguros, resseguros, capitalização e previdência aberta.',
  'bra.federal.fnde': 'Financia e opera programas federais de apoio à educação básica nos estados e municípios.',
  'bra.sp.government': 'Dirige o Executivo paulista e coordena políticas e serviços de alcance estadual.',
  'bra.sp.fazenda': 'Arrecada receitas estaduais e coordena o planejamento financeiro, orçamentário e econômico de São Paulo.',
  'bra.sp.alesp': 'Aprova leis e o orçamento do estado e fiscaliza o Executivo paulista.',
  'bra.sp.tjsp': 'Julga conflitos na Justiça estadual de São Paulo.',
  'bra.sp.tcesp': 'Fiscaliza contas, contratos e gastos do estado e dos municípios paulistas dentro de sua jurisdição.',
  'bra.sp.mpsp': 'Defende a ordem jurídica e interesses sociais no estado de São Paulo.',
  'bra.sp.cgesp': 'Coordena o controle interno, a integridade e a auditoria do Executivo paulista.',
  'bra.sp.fapesp': 'Financia pesquisa científica e tecnológica realizada em instituições paulistas.',
  'bra.sp.usp': 'Universidade pública estadual que forma pessoas e mantém pesquisa em diversas áreas.',
  'bra.sp.unicamp': 'Universidade pública estadual com forte atuação em pesquisa e formação científica e tecnológica.',
  'bra.sp.unesp': 'Universidade pública estadual distribuída por várias cidades paulistas.',
  'bra.sp.ipt': 'Instituto estadual que presta pesquisa aplicada, ensaios e serviços tecnológicos.',
  'bra.sp.prodesp': 'Empresa estadual que desenvolve e opera serviços digitais para o governo paulista.',
  'bra.sp.desenvolve_sp': 'Agência financeira do estado que oferece crédito para empresas e projetos municipais.',
  'bra.sp.cps': 'Mantém as Etecs e Fatecs e oferece educação profissional e tecnológica em todo o estado.',
  'bra.sp.city_sao_paulo': 'Governa o município de São Paulo e entrega serviços locais diretamente à população.',
  'bra.sp.fiap': 'Centro universitário privado de São Paulo voltado à formação em tecnologia, gestão e áreas relacionadas.',
  'bra.ma.fazenda': 'Coordena a administração tributária e a gestão financeira do Maranhão.',
  'bra.mg.planejamento': 'Coordena o planejamento, a gestão e a modernização do setor público em Minas Gerais.',
  'bra.pa.fazenda': 'Coordena a administração tributária e a gestão financeira do Pará.',
}

/**
 * The global ledger's own prose in Portuguese. A global body is attached to a
 * country's map by id, so its Portuguese summary is one entry here and never a
 * copy in a country's list.
 */
const GLOBAL_SUMMARIES: Record<string, string> = {
  'global.un': 'Organização intergovernamental fundada em 1945 e reunindo 193 Estados-membros; define normas, coordena ação coletiva e mantém o sistema estatístico e os programas de que os países participam.',
  'global.undp': 'Programa das Nações Unidas presente em cerca de 170 países; financia e assessora reformas da administração pública e publica o Índice de Desenvolvimento Humano.',
  'global.world_bank': 'Banco multilateral de desenvolvimento com 189 países-membros; empresta a governos nacionais e subnacionais e publica diagnósticos e dados por país.',
  'global.imf': 'Instituição monetária multilateral de participação quase universal; avalia as políticas econômicas de cada membro nas consultas do Artigo IV e empresta em crises de balanço de pagamentos.',
  'global.oecd': 'Organização intergovernamental de 38 Estados-membros; produz padrões, revisões por pares e estatísticas comparáveis sobre políticas públicas.',
  'global.wto': 'Organização intergovernamental que administra as regras do comércio internacional e resolve disputas entre eles.',
  'global.who': 'Agência das Nações Unidas para a saúde, com 194 Estados-membros; define normas sanitárias e coordena a resposta a emergências de saúde.',
  'global.ilo': 'Agência tripartite das Nações Unidas com 187 Estados-membros; fixa normas internacionais do trabalho e produz estatísticas do trabalho.',
}

const STATE_LABELS_PT_BR: Record<string, string> = {
  'BR-AC': 'Acre',
  'BR-AL': 'Alagoas',
  'BR-AP': 'Amapá',
  'BR-AM': 'Amazonas',
  'BR-BA': 'Bahia',
  'BR-CE': 'Ceará',
  'BR-DF': 'Distrito Federal',
  'BR-ES': 'Espírito Santo',
  'BR-GO': 'Goiás',
  'BR-MA': 'Maranhão',
  'BR-MT': 'Mato Grosso',
  'BR-MS': 'Mato Grosso do Sul',
  'BR-MG': 'Minas Gerais',
  'BR-PA': 'Pará',
  'BR-PB': 'Paraíba',
  'BR-PR': 'Paraná',
  'BR-PE': 'Pernambuco',
  'BR-PI': 'Piauí',
  'BR-RJ': 'Rio de Janeiro',
  'BR-RN': 'Rio Grande do Norte',
  'BR-RS': 'Rio Grande do Sul',
  'BR-RO': 'Rondônia',
  'BR-RR': 'Roraima',
  'BR-SC': 'Santa Catarina',
  'BR-SE': 'Sergipe',
  'BR-TO': 'Tocantins',
}

function stateSummary(node: InstitutionNetwork['nodes'][number]): string | undefined {
  const state = STATE_LABELS_PT_BR[node.jurisdictionCode]
  if (!state) return undefined
  if (node.id.endsWith('.government')) {
    return `Dirige o Poder Executivo e coordena políticas públicas e serviços em ${state}.`
  }
  if (node.id.endsWith('.legislature')) {
    return `Representa a população de ${state}, legisla e fiscaliza o Executivo estadual.`
  }
  if (node.id.endsWith('.court')) {
    return `Julga conflitos e protege direitos na jurisdição de ${state}.`
  }
  if (node.id.endsWith('.tce')) {
    return `Audita contas públicas e gastos dentro da jurisdição de ${state}.`
  }
  if (node.id.endsWith('.prosecution')) {
    return `Defende a ordem jurídica e os interesses sociais em ${state}.`
  }
  if (node.id.endsWith('.cge')) {
    return `Coordena controle interno, integridade e auditoria no Executivo de ${state}.`
  }
  if (node.id.endsWith('.civil_police')) {
    return `Investiga crimes e exerce a polícia judiciária no estado de ${state}.`
  }
  if (node.id.endsWith('.military_police')) {
    return `Faz o policiamento ostensivo e preserva a segurança pública em ${state}.`
  }
  if (node.id.endsWith('.fire')) {
    return `Atua em prevenção, resposta a incêndios e defesa civil em ${state}.`
  }
  if (node.id.endsWith('.defensoria')) {
    return `Presta assistência jurídica integral e defende direitos em ${state}.`
  }
  return undefined
}

export function localizeInstitutionNetworkPtBr(
  network: InstitutionNetwork,
): LocalizedInstitutionNetwork {
  return {
    ...network,
    scope:
      'Primeiro recorte da infraestrutura institucional brasileira: âncoras constitucionais, órgãos de controle e organizações que concentram financiamento, dados, formação, ciência, tecnologia e capacidade de entrega. São Paulo é o piloto subnacional.',
    nodes: network.nodes.map((node) => ({
      ...node,
      summary:
        GLOBAL_SUMMARIES[node.id] ?? SUMMARIES[node.id] ?? stateSummary(node) ?? node.summary,
    })),
  }
}

/**
 * One country's institution map, rendered in one language.
 *
 * Every surface that shows an institution's own prose calls this, so the
 * viewer's ledger and the explorer feed cannot describe the same institution
 * in different words. A language with no localiser falls back to the file's
 * English ground layer, which is what a partial lexicon is meant to do.
 */
export function localizeInstitutionNetwork(
  network: InstitutionNetwork,
  lang: Lang,
): LocalizedInstitutionNetwork {
  if (lang === 'pt-BR' && network.iso3 === 'BRA') return localizeInstitutionNetworkPtBr(network)
  if (lang === 'pt-BR') {
    return {
      ...network,
      nodes: network.nodes.map((node) => ({
        ...node,
        summary: GLOBAL_SUMMARIES[node.id] ?? node.summary,
      })),
    }
  }
  return { ...network, nodes: network.nodes.map((node) => ({ ...node })) }
}
