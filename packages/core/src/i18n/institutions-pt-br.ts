import type {
  InstitutionNetworkFile,
  LocalizedInstitutionNetwork,
} from '../model/institutions.js'

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
  'bra.sp.government': 'Dirige o Executivo paulista e coordena políticas e serviços de alcance estadual.',
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

function stateSummary(node: InstitutionNetworkFile['nodes'][number]): string | undefined {
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
  return undefined
}

export function localizeInstitutionNetworkPtBr(
  network: InstitutionNetworkFile,
): LocalizedInstitutionNetwork {
  return {
    ...network,
    scope:
      'Primeiro recorte da infraestrutura institucional brasileira: âncoras constitucionais, órgãos de controle e organizações que concentram financiamento, dados, formação, ciência, tecnologia e capacidade de entrega. São Paulo é o piloto subnacional.',
    nodes: network.nodes.map((node) => ({
      ...node,
      summary: SUMMARIES[node.id] ?? stateSummary(node) ?? node.summary,
    })),
  }
}
