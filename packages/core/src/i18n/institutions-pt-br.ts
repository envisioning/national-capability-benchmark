import type {
  InstitutionLegalNature,
  InstitutionLevel,
  InstitutionNetworkFile,
  InstitutionRelation,
  InstitutionRole,
  InstitutionSystem,
  LocalizedInstitutionNetwork,
} from '../model/institutions.js'

export const INSTITUTION_LEVEL_LABELS_PT_BR: Record<InstitutionLevel, string> = {
  federal: 'Federal',
  state: 'Estadual',
  municipal: 'Municipal',
  external: 'Fora do Estado',
}

export const INSTITUTION_SYSTEM_LABELS_PT_BR: Record<InstitutionSystem, string> = {
  democratic_authority: 'Autoridade democrática',
  justice_rights: 'Justiça e direitos',
  oversight_integrity: 'Controle e integridade',
  strategy_management: 'Estratégia e gestão',
  finance_investment: 'Financiamento e investimento',
  science_technology: 'Ciência e tecnologia',
  learning_workforce: 'Formação e trabalho',
  data_digital: 'Dados e infraestrutura digital',
  regulation: 'Regulação',
  territorial_delivery: 'Entrega territorial',
}

export const INSTITUTION_NATURE_LABELS_PT_BR: Record<InstitutionLegalNature, string> = {
  constitutional_body: 'Órgão constitucional',
  direct_administration: 'Administração direta',
  autarchy: 'Autarquia',
  public_foundation: 'Fundação pública',
  public_company: 'Empresa pública',
  mixed_capital_company: 'Sociedade de economia mista',
  public_university: 'Universidade pública',
  private_education: 'Instituição privada de ensino',
}

export const INSTITUTION_ROLE_LABELS_PT_BR: Record<InstitutionRole, string> = {
  governs: 'governa',
  legislates: 'legisla',
  adjudicates: 'julga conflitos',
  checks_constitutionality: 'controla a constitucionalidade',
  prosecutes: 'promove a ação pública',
  represents_state: 'representa juridicamente o Estado',
  checks: 'controla atos públicos',
  audits: 'audita',
  coordinates: 'coordena',
  plans: 'planeja',
  finances: 'financia',
  regulates: 'regula',
  produces_evidence: 'produz evidência',
  researches: 'faz pesquisa',
  trains: 'forma pessoas',
  operates_infrastructure: 'opera infraestrutura',
  delivers_services: 'entrega serviços',
}

export const INSTITUTION_RELATION_LABELS_PT_BR: Record<
  InstitutionRelation,
  { outgoing: string; incoming: string }
> = {
  appoints: { outgoing: 'nomeia integrantes de', incoming: 'tem integrantes nomeados por' },
  approves_appointment: {
    outgoing: 'aprova nomeações para',
    incoming: 'tem nomeações aprovadas por',
  },
  legislates_with: { outgoing: 'legisla junto com', incoming: 'legisla junto com' },
  linked_to: { outgoing: 'é vinculada a', incoming: 'tem vínculo administrativo com' },
  audits: { outgoing: 'audita', incoming: 'é auditada por' },
  checks: { outgoing: 'controla atos de', incoming: 'tem atos controlados por' },
  regulates: { outgoing: 'regula', incoming: 'é regulada por' },
  funds: { outgoing: 'financia', incoming: 'recebe financiamento de' },
  coordinates: { outgoing: 'coordena', incoming: 'é coordenada por' },
  trains: { outgoing: 'forma pessoas de', incoming: 'tem pessoas formadas por' },
  provides_evidence_to: { outgoing: 'produz evidência para', incoming: 'usa evidência produzida por' },
  operates_for: { outgoing: 'opera infraestrutura para', incoming: 'usa infraestrutura operada por' },
  delivers_with: { outgoing: 'entrega junto com', incoming: 'entrega junto com' },
}

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

export function localizeInstitutionNetworkPtBr(
  network: InstitutionNetworkFile,
): LocalizedInstitutionNetwork {
  return {
    ...network,
    scope:
      'Primeiro recorte da infraestrutura institucional brasileira: âncoras constitucionais, órgãos de controle e organizações que concentram financiamento, dados, formação, ciência, tecnologia e capacidade de entrega. São Paulo é o piloto subnacional.',
    nodes: network.nodes.map((node) => ({
      ...node,
      summary: SUMMARIES[node.id] ?? node.summary,
    })),
  }
}
