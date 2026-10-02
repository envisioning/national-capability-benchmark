import type { Lexicon } from './types.js'

/**
 * Latin American Spanish lexicon, neutral rather than national: one Spanish
 * reading for the Mexico, Colombia, Chile and Argentina layers. Translate the
 * vocabulary, keep the ids, change nothing about the numbers.
 *
 * Terms fixed once here, because a page that says the same thing two ways
 * reads as two things:
 *
 * - The 0 to 100 number is a "puntuación", never a "nota".
 * - The second number, confidence, is "solidez de la evidencia" and "solidez"
 *   for short. "Confianza" is the Trust dimension and nothing else.
 * - Dimension names are chosen for a Spanish reader, not copied from the
 *   English: Agency is "Iniciativa", because "agencia" reads as an
 *   organisation, and Building is "Ejecución", because "construcción" reads as
 *   the construction sector. These names are the map addresses through
 *   `mapSlug`, pinned by a test, so a rename here moves a published URL.
 *
 * Every string is descriptive. None says what a country should do. See D35,
 * D130 and D134.
 */
export const ES: Lexicon = {
  lang: 'es',
  /* Latin American Spanish number formatting: a point for decimals. */
  numberLocale: 'es-419',
  /* The countries whose Spanish pages are published, which is the countries
   * with a Spanish layer in apps/web/src/lib/layers.ts. A test keeps the two
   * in step. See D69 and D134. */
  layerCountries: ['MEX', 'COL', 'CHL', 'ARG'],
  dimensions: {
    anticipation: 'Anticipación',
    agency: 'Iniciativa',
    coordination: 'Coordinación',
    trust: 'Confianza',
    learning: 'Aprendizaje',
    experimentation: 'Experimentación',
    adaptability: 'Adaptación',
    building: 'Ejecución',
    shared_purpose: 'Propósito compartido',
  },
  questions: {
    anticipation:
      '¿Qué tan capaz es el país de identificar cambios emergentes y prepararse para ellos?',
    agency:
      '¿Qué tan capaces son las personas y las organizaciones de convertir una intención en acción?',
    coordination:
      '¿Con qué eficacia logran organizarse actores independientes en torno a objetivos comunes?',
    trust: '¿Cuánta cooperación es posible más allá de las redes personales inmediatas?',
    learning: '¿Con qué eficacia adquiere, distribuye y actualiza conocimiento el país?',
    experimentation:
      '¿Con qué facilidad se pueden intentar, probar, abandonar y mejorar enfoques nuevos?',
    adaptability: '¿Con qué eficacia responde el sistema cuando cambian las circunstancias?',
    building:
      '¿Qué tan capaz es el país de convertir planes y conocimiento en sistemas que funcionan?',
    shared_purpose:
      '¿Hasta qué punto las personas logran verse como parte de un proyecto común?',
  },
  countries: {
    BRA: 'Brasil',
    USA: 'Estados Unidos',
    NLD: 'Países Bajos',
    CHE: 'Suiza',
    SGP: 'Singapur',
    KOR: 'Corea del Sur',
    EST: 'Estonia',
    IND: 'India',
    CHN: 'China',
    DEU: 'Alemania',
    GBR: 'Reino Unido',
    FRA: 'Francia',
    ESP: 'España',
    PRT: 'Portugal',
    POL: 'Polonia',
    TUR: 'Turquía',
    ARG: 'Argentina',
    MEX: 'México',
    CHL: 'Chile',
    COL: 'Colombia',
    URY: 'Uruguay',
    CRI: 'Costa Rica',
    PER: 'Perú',
    ZAF: 'Sudáfrica',
    NGA: 'Nigeria',
    KEN: 'Kenia',
    ETH: 'Etiopía',
    RWA: 'Ruanda',
    IDN: 'Indonesia',
    VNM: 'Vietnam',
    THA: 'Tailandia',
    MYS: 'Malasia',
    PHL: 'Filipinas',
    JPN: 'Japón',
    AUS: 'Australia',
    CAN: 'Canadá',
    IRL: 'Irlanda',
    ISR: 'Israel',
    SWE: 'Suecia',
    FIN: 'Finlandia',
    ARE: 'Emiratos Árabes Unidos',
    BOL: 'Bolivia',
    PRY: 'Paraguay',
    ECU: 'Ecuador',
    VEN: 'Venezuela',
    PAN: 'Panamá',
    GTM: 'Guatemala',
    HND: 'Honduras',
    SLV: 'El Salvador',
    NIC: 'Nicaragua',
    DOM: 'República Dominicana',
    CUB: 'Cuba',
    HTI: 'Haití',
  },
  /* Spanish names the four layer countries without an article, and they are
   * the only countries the pages put in subject position. */
  countryArticles: {},
  indicators: {
    rd_expenditure_gdp: 'Gasto en I+D',
    researchers_per_million: 'Investigadores en I+D',
    sci_articles_per_million: 'Artículos científicos',
    statistical_performance: 'Desempeño estadístico',
    secure_internet_servers: 'Servidores de internet seguros',
    government_foresight_capacity: 'Capacidad gubernamental de prospectiva',
    basic_research_share: 'Proporción de investigación de largo plazo',
    new_business_density: 'Densidad de empresas nuevas',
    business_start_days: 'Tiempo para abrir una empresa',
    business_start_procedures: 'Trámites para abrir una empresa',
    internet_users: 'Personas que usan internet',
    account_ownership: 'Titularidad de cuentas financieras',
    domestic_credit_private: 'Crédito al sector privado',
    adult_digital_skills: 'Habilidades digitales de adultos',
    perceived_control: 'Control percibido sobre la propia vida',
    government_effectiveness: 'Efectividad del gobierno',
    regulatory_quality: 'Calidad regulatoria',
    logistics_performance: 'Desempeño logístico',
    time_to_export: 'Tiempo de exportación en frontera',
    budget_execution_fidelity: 'Fidelidad en la ejecución presupuestaria',
    university_industry_collaboration: 'Colaboración universidad-empresa',
    civil_society_strength: 'Fortaleza de la sociedad civil',
    public_private_collaboration: 'Colaboración público-privada',
    rule_of_law: 'Estado de derecho',
    control_of_corruption: 'Control de la corrupción',
    contract_enforcement_days: 'Tiempo para hacer cumplir un contrato',
    court_compliance: 'Cumplimiento de las decisiones judiciales por el gobierno',
    bribery_incidence: 'Incidencia de sobornos',
    court_case_clearance: 'Tasa de resolución de casos judiciales',
    homicide_rate: 'Tasa de homicidios intencionales',
    interpersonal_trust: 'Confianza interpersonal generalizada',
    institutional_trust: 'Confianza en las instituciones públicas',
    willingness_to_cooperate_strangers: 'Cooperación más allá del propio grupo',
    human_capital_index: 'Índice de Capital Humano',
    tertiary_enrollment: 'Matrícula en educación superior',
    education_expenditure_gdp: 'Gasto público en educación',
    vocational_secondary_share: 'Proporción técnica de la educación secundaria',
    firm_training_incidence: 'Empresas con capacitación formal',
    adult_learning_participation: 'Participación de adultos en aprendizaje',
    research_citation_impact: 'Impacto de citación de la investigación',
    resident_patents_per_million: 'Solicitudes de patente de residentes',
    resident_trademarks_per_million: 'Solicitudes de marca de residentes',
    resident_industrial_designs_per_million: 'Solicitudes de diseño industrial de residentes',
    new_repositories_per_million: 'Nuevos repositorios públicos de software',
    venture_capital_gdp: 'Inversión de capital de riesgo',
    early_stage_entrepreneurial_activity: 'Actividad emprendedora en etapa inicial',
    failure_tolerance: 'Tolerancia al fracaso emprendedor',
    regulatory_sandbox_activity: 'Actividad de sandbox regulatorio',
    university_spinouts: 'Empresas surgidas de universidades',
    business_rd_share: 'Proporción empresarial de la I+D',
    labor_force_participation: 'Participación en la fuerza laboral',
    unemployment_rate: 'Tasa de desempleo',
    long_term_unemployment_share: 'Proporción de desempleo de larga duración',
    broadband_subscriptions: 'Suscripciones de banda ancha fija',
    electricity_transmission_losses: 'Pérdidas en la transmisión de electricidad',
    export_diversification: 'Diversificación de las exportaciones',
    new_export_products_rate: 'Nuevos productos de exportación',
    informal_employment_share: 'Empleo informal',
    disaster_preparedness: 'Preparación y recuperación ante desastres',
    institutional_responsiveness: 'Capacidad de respuesta institucional',
    manufacturing_value_added: 'Valor agregado manufacturero',
    high_tech_exports_share: 'Exportaciones de alta tecnología',
    labour_productivity: 'Producto por trabajador',
    logistics_infrastructure: 'Calidad de la infraestructura logística',
    electricity_connection_speed: 'Tiempo de conexión a la red eléctrica',
    economic_complexity: 'Aptitud económica',
    large_project_delivery: 'Ejecución de grandes proyectos',
    firm_scale_up_rate: 'Empresas jóvenes que ganan escala',
    voice_and_accountability: 'Voz y rendición de cuentas',
    tax_revenue_gdp: 'Recaudación tributaria',
    income_inequality: 'Desigualdad de ingresos',
    national_belonging: 'Sentido de pertenencia nacional',
    volunteering_rate: 'Voluntariado',
    political_polarization: 'Polarización política',
    civic_participation: 'Participación cívica',
  },
  units: {
    '% of GDP': '% del PIB',
    'per million people': 'por millón de personas',
    '% of population': '% de la población',
    '% aged 15+': '% de las personas de 15 años o más',
    '% gross': '% (tasa bruta)',
    'per 100 people': 'por cada 100 personas',
    'constant 2021 PPP $': 'US$ PPA constantes de 2021',
    '% of labour force': '% de la fuerza laboral',
    '% of unemployed': '% de los desempleados',
    '% of products not exported competitively at the start': '% de los productos que no se exportaban de forma competitiva al inicio',
    '% of employment': '% del empleo',
    '% of output': '% de la producción',
    'index 0-1, lower = more diversified': 'índice de 0 a 1, menor = más diversificado',
    'articles per million people': 'artículos por millón de personas',
    'index 0-100': 'índice de 0 a 100',
    'per 1,000 aged 15-64': 'por cada 1000 personas de 15 a 64 años',
    days: 'días',
    count: 'número',
    'mean 1-10': 'promedio de 1 a 10',
    hours: 'horas',
    'percentage points from approved budget': 'puntos porcentuales de distancia del presupuesto aprobado',
    'index 0-1': 'índice de 0 a 1',
    '% of firms': '% de las empresas',
    'scale 0-4 (never to always)': 'escala de 0 a 4 (nunca a siempre)',
    '% agreeing': '% que está de acuerdo',
    '% of secondary': '% de la matrícula secundaria',
    'ratio to world average': 'razón respecto del promedio mundial',
    '% aged 18-64': '% de las personas de 18 a 64 años',
    '% not deterred': '% sin miedo a fracasar',
    '% of manufactured exports': '% de las exportaciones manufactureras',
    'score 0-100': 'puntuación de 0 a 100',
    index: 'índice',
    'Gini 0-100': 'Gini de 0 a 100',
    '% mentioning': '% que lo menciona',
    '% of R&D': '% de la I+D',
    '% of adults': '% de los adultos',
    'z-score -2.5 to 2.5': 'puntuación z de -2.5 a 2.5',
    'index 1-5': 'índice de 1 a 5',
    'per 100,000 people': 'por cada 100 000 personas',
    '% expressing confidence': '% que expresa confianza',
    '% expressing trust': '% que expresa confianza',
    '% of incoming cases': '% de los casos ingresados',
    '% overrun': '% de sobrecosto',
    '% expressing belonging': '% que expresa pertenencia',
    'index 0-4': 'índice de 0 a 4',
  },
  indicatorDefinitions: {
    rd_expenditure_gdp: 'Gasto bruto interno en investigación y desarrollo como proporción del PIB.',
    researchers_per_million: 'Investigadores en equivalente de tiempo completo por millón de personas.',
    sci_articles_per_million:
      'Artículos publicados en revistas científicas y técnicas, por millón de personas.',
    statistical_performance:
      'Puntuación general del sistema estadístico nacional en los Indicadores de Desempeño Estadístico del Banco Mundial.',
    secure_internet_servers:
      'Servidores que usan cifrado en transacciones por internet, por millón de personas.',
    new_business_density:
      'Sociedades de responsabilidad limitada nuevas registradas por cada 1000 personas en edad de trabajar.',
    business_start_days: 'Días calendario para completar los trámites de registro de una empresa.',
    business_start_procedures: 'Número de trámites oficiales distintos para registrar una empresa.',
    internet_users: 'Proporción de la población que usó internet en los últimos tres meses.',
    account_ownership: 'Adultos con una cuenta en un banco o en un proveedor de dinero móvil.',
    domestic_credit_private:
      'Crédito interno otorgado al sector privado por las sociedades financieras.',
    government_effectiveness:
      'Estimación de los Indicadores Mundiales de Gobernanza sobre la calidad del servicio público y de la ejecución de políticas.',
    regulatory_quality:
      'Estimación de los Indicadores Mundiales de Gobernanza sobre la capacidad de formular y aplicar una regulación sólida.',
    logistics_performance:
      'Puntuación general del Índice de Desempeño Logístico, a partir de una encuesta a operadores internacionales de carga.',
    time_to_export:
      'Horas para completar el cumplimiento aduanero y fronterizo de un envío de exportación estándar.',
    rule_of_law:
      'Estimación de los Indicadores Mundiales de Gobernanza sobre la confianza en las reglas de la sociedad y su cumplimiento.',
    control_of_corruption:
      'Estimación de los Indicadores Mundiales de Gobernanza sobre el grado en que el poder público se usa para beneficio privado.',
    contract_enforcement_days:
      'Días calendario desde la presentación de una demanda comercial hasta el pago.',
    bribery_incidence:
      'Empresas a las que se pidió al menos un soborno en seis trámites públicos que cubren servicios, permisos, licencias e impuestos.',
    homicide_rate: 'Homicidios intencionales por cada 100 000 personas.',
    court_case_clearance:
      'Casos civiles y comerciales resueltos en un año como proporción de los casos presentados en ese mismo año.',
    human_capital_index:
      'Productividad esperada de un niño nacido hoy en relación con plena salud y educación completa.',
    tertiary_enrollment: 'Tasa bruta de matrícula en educación superior.',
    education_expenditure_gdp: 'Gasto del gobierno en educación como proporción del PIB.',
    vocational_secondary_share:
      'Estudiantes de formación técnica como proporción de la matrícula secundaria total.',
    firm_training_incidence:
      'Proporción de empresas que dan capacitación formal a sus empleados permanentes.',
    resident_patents_per_million: 'Solicitudes de patente presentadas por residentes, por millón de personas.',
    resident_trademarks_per_million: 'Solicitudes directas de marca de residentes, por millón de personas.',
    resident_industrial_designs_per_million:
      'Solicitudes de diseño industrial presentadas por residentes en su oficina nacional, por millón de personas.',
    new_repositories_per_million:
      'Crecimiento en un año de los repositorios públicos de GitHub ubicados en el país, por millón de personas.',
    early_stage_entrepreneurial_activity:
      'Adultos que inician o dirigen una empresa de menos de 42 meses.',
    failure_tolerance:
      'Proporción de adultos que ven buenas oportunidades y dicen que el miedo a fracasar no les impediría emprender.',
    labor_force_participation: 'Proporción de la población en edad de trabajar que está en la fuerza laboral.',
    unemployment_rate: 'Desempleados como proporción de la fuerza laboral, estimación modelada de la OIT.',
    electricity_transmission_losses:
      'Energía perdida en la transmisión y la distribución, incluido el uso no facturado.',
    manufacturing_value_added: 'Valor agregado manufacturero como proporción del PIB.',
    high_tech_exports_share:
      'Exportaciones de alta tecnología como proporción de las exportaciones manufactureras.',
    labour_productivity: 'PIB por persona ocupada, en paridad de poder adquisitivo constante.',
    logistics_infrastructure:
      'Subpuntuación del Índice de Desempeño Logístico sobre la calidad de la infraestructura de comercio y transporte.',
    electricity_connection_speed:
      'Puntuación de Doing Business sobre los días que una empresa espera una conexión eléctrica permanente.',
    economic_complexity:
      'Sofisticación de la canasta exportadora, ajustada por diversidad y ubicuidad.',
    voice_and_accountability:
      'Estimación de los Indicadores Mundiales de Gobernanza sobre la capacidad de la ciudadanía de participar en la elección de su gobierno.',
    tax_revenue_gdp: 'Recaudación tributaria del gobierno central como proporción del PIB.',
    income_inequality: 'Índice de Gini del ingreso disponible.',
    budget_execution_fidelity:
      'Distancia entre el gasto primario del gobierno y el presupuesto original aprobado.',
    government_foresight_capacity:
      'Existencia, mandato y continuidad de una función nacional de prospectiva estratégica.',
    basic_research_share: 'Proporción del gasto bruto en I+D clasificada como investigación básica.',
    adult_digital_skills: 'Proporción de adultos capaces de realizar tareas digitales estándar.',
    perceived_control:
      'Libertad de elección y control sobre el rumbo de la propia vida, según declaran las personas.',
    university_industry_collaboration:
      'Intensidad de la colaboración en investigación entre universidades y empresas.',
    civil_society_strength:
      'Autonomía, densidad y alcance participativo de las organizaciones de la sociedad civil.',
    public_private_collaboration:
      'Frecuencia y escala de la ejecución conjunta, por gobierno y empresas, de objetivos nacionales.',
    court_compliance:
      'Con qué frecuencia el gobierno cumple las decisiones importantes de los tribunales ordinarios y especializados con las que no está de acuerdo.',
    interpersonal_trust: 'Proporción que está de acuerdo en que se puede confiar en la mayoría de las personas.',
    institutional_trust: 'Confianza en el gobierno nacional, los tribunales y el servicio público.',
    willingness_to_cooperate_strangers:
      'Proporción de adultos que confía completamente o algo en las personas que conoce por primera vez.',
    adult_learning_participation:
      'Proporción de adultos en educación o capacitación, formal o no, en los últimos 12 meses.',
    research_citation_impact:
      'Proporción de los artículos y revisiones de un país entre el 10% más citado de su subárea y año, como razón de la misma proporción entre todas las obras con país de afiliación.',
    venture_capital_gdp: 'Capital de riesgo invertido como proporción del PIB.',
    regulatory_sandbox_activity:
      'Número y alcance de los sandboxes regulatorios y regímenes de prueba controlada en operación.',
    university_spinouts:
      'Empresas creadas para comercializar investigación universitaria, por millón de habitantes.',
    business_rd_share: 'Proporción del gasto bruto en I+D ejecutada por empresas.',
    broadband_subscriptions: 'Suscripciones de banda ancha fija por cada 100 personas.',
    long_term_unemployment_share:
      'Personas desempleadas durante 12 meses o más, como proporción del desempleo total.',
    export_diversification: 'Concentración inversa de la canasta exportadora por producto.',
    new_export_products_rate:
      'Proporción de los productos que un país no exportaba de forma competitiva en 2009-2011 y sí exportaba en 2022-2024.',
    informal_employment_share: 'Empleo informal como proporción del empleo total, indicador ODS 8.3.1.',
    disaster_preparedness:
      'Capacidad demostrada de preparación y recuperación ante choques graves.',
    institutional_responsiveness:
      'Velocidad con que las reglas y los programas públicos cambian en respuesta a condiciones nuevas.',
    large_project_delivery:
      'Desempeño en costo y plazo de los grandes proyectos públicos de infraestructura.',
    firm_scale_up_rate:
      'Proporción de empresas jóvenes que alcanzan niveles relevantes de empleo o facturación.',
    national_belonging:
      'Orgullo e identificación con la comunidad nacional, según declaran las personas.',
    volunteering_rate:
      'Proporción de adultos que dedicaron tiempo voluntario a una organización en el último mes.',
    political_polarization:
      'Grado en que las diferencias políticas se alinean en una sola división hostil.',
    civic_participation:
      'Proporción de adultos que declaran pertenecer a una organización humanitaria o de caridad.',
  },
  bands: {
    good: 'buena',
    usable: 'utilizable',
    thin: 'débil',
    very_thin: 'muy débil',
  },
  bandMeanings: {
    good: 'La mayoría de los indicadores observados, recientes y de fuentes oficiales o intergubernamentales.',
    usable: 'Evidencia suficiente para comparar países, con vacíos conocidos.',
    thin: 'Una minoría de los indicadores, o evidencia lo bastante antigua como para haber cambiado.',
    very_thin:
      'La puntuación se apoya en uno o dos indicadores, y citada sola dice más de lo que la evidencia sostiene.',
  },
  scoreBands: {
    strong: { label: 'alta', meaning: 'Cerca de la parte alta de la escala en esta dimensión.' },
    above_middle: { label: 'sobre el medio', meaning: 'En la mitad superior de la escala.' },
    below_middle: { label: 'bajo el medio', meaning: 'En la mitad inferior de la escala.' },
    weak: {
      label: 'baja',
      meaning: 'Cerca del piso de la escala. La solidez dice cuánto pesa esa lectura.',
    },
  },
  legendRange: '{a} a {b}',
  legendRangeTop: '{a} o más',
  radar: {
    compare: 'Ver todos los países en esta dimensión',
  },
  agenda: {
    title: 'Agenda de capacidades: {country}',
    generated: 'Generado el {date}',
    intro:
      'La comparación incluye {countries} países. Cada dimensión recibe una puntuación de 0 a 100, sin clasificación general, y cada puntuación muestra a su lado la solidez de la evidencia. Antes de citar una puntuación, lea {limits}.',
    limitsLabel: 'los límites conocidos de los datos',
    standingHeading: '¿Dónde se ubica {countryTopic}?',
    colDimension: 'Dimensión',
    colScore: 'Puntuación',
    colConfidence: 'Solidez',
    colTrend: 'Tendencia',
    historyHeading: '¿Cómo cambió cada capacidad con el tiempo?',
    historyIntro:
      'Elija una dimensión para ver cómo cambió con el tiempo la evidencia comparable de {country}. La escala vertical es la escala comparativa actual de 0 a 100.',
    historyDimension: 'Dimensión',
    historyPeriod: 'Período',
    historyAxis: 'Posición de la capacidad en la escala actual',
    historyAxisRange: '0 a 100',
    historyYears: 'años',
    historyNoHistory: 'Ninguna dimensión tiene todavía suficiente evidencia histórica comparable.',
    historyNoSpan: 'No hay historia comparable disponible para este período.',
    historyReadout: '{from} a {to} ({delta}) en {years} años, sobre {n} indicadores',
    historyReadoutClamped:
      '{from} a {to} ({delta}) en {years} años, sobre {n} indicadores; {c} tocaron el borde de la escala',
    historyCaveat:
      'Los valores históricos usan la escala actual de 0 a 100 y un conjunto pareado de indicadores. Muestran movimiento en la evidencia disponible y no una puntuación general de desarrollo. Los elementos fechados de la agenda aparecen en una línea de tiempo aparte y no cambian la puntuación. Una línea ausente significa que la evidencia no sostiene una tendencia comparable para esa dimensión.',
    historyChartAria: 'Historia de {dimension} de {baseYear} a {currentYear}',
    historyAgendaItems: 'Elementos de la agenda en esta línea de tiempo',
    historyEventTimelineAria: 'Elementos de la agenda de {dimension} de {baseYear} a {currentYear}',
    historyEventAria: '{title}, elemento de la agenda iniciado en {year}',
    trendCell: '{delta} en {years} años, sobre {n} indicadores',
    trendCellClamped:
      '{delta} en {years} años, sobre {n} indicadores, {c} truncados en el borde de la escala',
    noTrend: 'sin base de tendencia',
    noScore: 'sin puntuación',
    raiseItemHeading: '{dimension}: {score}, solidez {band}',
    measureItemHeading: '{dimension}: solidez {confidence}, {band}',
    raiseHeading: 'Puntuaciones bajas con evidencia utilizable',
    raiseIntro:
      'Estas son las puntuaciones más bajas con evidencia utilizable. Las dimensiones con evidencia débil aparecen más abajo.',
    measureHeading: 'Dimensiones con evidencia débil',
    measureIntro:
      'La solidez de la evidencia está por debajo de la franja utilizable, así que la puntuación se apoya en poca evidencia.',
    holdHeading: 'Puntuaciones altas con evidencia utilizable',
    holdIntro:
      'Estas dimensiones tienen una puntuación de al menos {threshold}, con evidencia utilizable.',
    holdItemLine: '{dimension}: {score}, solidez {band}',
    scoredOn: 'Basada en {n} indicadores observados.',
    scoredOnOne: 'Basada en un indicador observado.',
    gapsLine: 'Vacíos declarados: {list}.',
    retiredLine: 'Bases descartadas: {list}.',
    exemplarsLine: 'Puntuaciones utilizables más altas: {list}.',
    evidenceElsewhereLine: 'Entregas documentadas en otros países: {list}.',
    agendaHeading: '¿Qué falta medir?',
    agendaIntro:
      '{n} indicadores solicitados no tienen una base comparable, y cada uno baja la solidez. Un vacío se convierte en indicador con puntuación cuando una serie comparable cubre al menos dos países.',
    colIndicator: 'Indicador ausente',
    colAsks: 'Qué pregunta',
    ownEvidenceHeading: 'Lo que los indicadores no ven de {countryTopic}',
    ownEvidenceIntro:
      'Entregas documentadas ligadas a indicadores ausentes. No cambian las puntuaciones ni la solidez.',
    brazilEvidenceHeading: 'Lo que Brasil construyó y ningún indicador cuenta',
    brazilEvidenceIntro:
      'Son cambios institucionales documentados en Brasil que el marco registra como evidencia. No reciben puntuación y aparecen junto a las puntuaciones de capacidad como registro histórico.',
    institutionalHistoryHeading: 'Lo que {countryTopic} construyó y ningún indicador cuenta',
    institutionalHistoryIntro:
      'Son cambios institucionales documentados en {country} que el marco registra como evidencia. Aparecen junto a la puntuación y no cambian la puntuación ni la solidez.',
    contributeHeading: 'Cómo contribuir',
    contributeBody:
      'En {repo} se puede llenar un vacío, registrar evidencia o cuestionar un indicador. Los documentos explican el método y sus decisiones.',
    profileLink: 'Abrir el perfil completo: indicadores, valores, años y fuentes',
    conditionsHeading: '¿Con qué cuenta {countryTopic}?',
    conditionsIntro:
      'Las condiciones describen lo que un país tiene para trabajar: infraestructura, acceso, dinero, personas, matrícula y el propio ingreso. Cada una aparece junto a una capacidad y no entra en la puntuación, en la solidez ni en la tendencia. Leídas contra la puntuación, muestran si lo que el país tiene se convierte en lo que hace. La posición cuenta los países con valor, del mejor al peor.',
    colCondition: 'Condición',
    colValue: 'Valor',
    colYear: 'Año',
    colRank: 'Posición',
    conditionRank: '{rank}.º de {n}',
  },
  /* No Spanish layer publishes an institution map (INSTITUTION_MAPS holds
   * Brazil alone), so these strings render nowhere yet. The type asks for
   * them, and a map added later reads them instead of falling back. */
  institutions: {
    levels: {
      federal: 'Nacional',
      state: 'Estatal o provincial',
      municipal: 'Municipal',
      external: 'Fuera del Estado',
      global: 'Global',
    },
    systems: {
      democratic_authority: 'Autoridad democrática',
      justice_rights: 'Justicia y derechos',
      oversight_integrity: 'Control e integridad',
      strategy_management: 'Estrategia y gestión',
      finance_investment: 'Financiamiento e inversión',
      science_technology: 'Ciencia y tecnología',
      learning_workforce: 'Formación y trabajo',
      data_digital: 'Datos e infraestructura digital',
      regulation: 'Regulación',
      public_security_defense: 'Seguridad pública y defensa',
      territorial_delivery: 'Ejecución territorial',
    },
    natures: {
      constitutional_body: 'Órgano constitucional',
      direct_administration: 'Administración directa',
      autarchy: 'Organismo descentralizado',
      public_foundation: 'Fundación pública',
      public_company: 'Empresa pública',
      mixed_capital_company: 'Sociedad de economía mixta',
      public_university: 'Universidad pública',
      private_education: 'Institución privada de educación',
      international_organization: 'Organización internacional',
    },
    roles: {
      governs: 'gobierna',
      legislates: 'legisla',
      adjudicates: 'resuelve conflictos',
      checks_constitutionality: 'controla la constitucionalidad',
      prosecutes: 'ejerce la acción pública',
      represents_state: 'representa jurídicamente al Estado',
      defends_rights: 'defiende derechos',
      checks: 'controla actos públicos',
      audits: 'audita',
      coordinates: 'coordina',
      plans: 'planifica',
      administers: 'administra',
      finances: 'financia',
      regulates: 'regula',
      produces_evidence: 'produce evidencia',
      researches: 'investiga',
      trains: 'forma personas',
      operates_infrastructure: 'opera infraestructura',
      delivers_services: 'presta servicios',
      investigates: 'investiga delitos',
      protects: 'protege',
      intelligence: 'produce inteligencia',
      defends: 'defiende el país',
    },
    relations: {
      appoints: { outgoing: 'nombra integrantes de', incoming: 'tiene integrantes nombrados por' },
      approves_appointment: {
        outgoing: 'aprueba nombramientos para',
        incoming: 'tiene nombramientos aprobados por',
      },
      legislates_with: { outgoing: 'legisla junto con', incoming: 'legisla junto con' },
      linked_to: { outgoing: 'está vinculada a', incoming: 'tiene vínculo administrativo con' },
      audits: { outgoing: 'audita', incoming: 'es auditada por' },
      checks: { outgoing: 'controla actos de', incoming: 'tiene actos controlados por' },
      regulates: { outgoing: 'regula', incoming: 'es regulada por' },
      funds: { outgoing: 'financia', incoming: 'recibe financiamiento de' },
      coordinates: { outgoing: 'coordina', incoming: 'es coordinada por' },
      trains: { outgoing: 'forma personas de', incoming: 'tiene personas formadas por' },
      provides_evidence_to: {
        outgoing: 'produce evidencia para',
        incoming: 'usa evidencia producida por',
      },
      operates_for: {
        outgoing: 'opera infraestructura para',
        incoming: 'usa infraestructura operada por',
      },
      delivers_with: { outgoing: 'ejecuta junto con', incoming: 'ejecuta junto con' },
    },
    families: {
      constitutes: {
        label: 'Autoridad',
        empty: 'No hay relaciones de autoridad o vínculo registradas.',
      },
      limits: { label: 'Control', empty: 'No hay relaciones de control registradas.' },
      funds: { label: 'Financiamiento', empty: 'No hay relaciones de financiamiento registradas.' },
      works_with: {
        label: 'Trabajo conjunto',
        empty: 'No hay relaciones de trabajo conjunto registradas.',
      },
    },
    findHeading: 'Buscar una institución',
    findName: 'Nombre o función',
    findNamePlaceholder: 'justicia, investigación, estadística...',
    findLevel: 'Nivel',
    findSystem: 'Sistema',
    findJurisdiction: 'Jurisdicción',
    nationalJurisdiction: 'Nacional',
    globalJurisdiction: 'Global',
    globalJurisdictionNote:
      'Organismos internacionales que ningún país controla solo, registrados en el libro global.',
    membersHeading: 'Membresía',
    memberCount: '{n} de los {total} países del benchmark son miembros',
    memberHere: '{country} es miembro.',
    notMemberHere: '{country} no es miembro.',
    anyLevel: 'Todos',
    anySystem: 'Todos',
    shown: '{n} visibles',
    noMatch: 'Ninguna institución coincide con estos filtros.',
    rolesHeading: 'Qué hace',
    dimensionsHeading: 'Capacidades relacionadas',
    noDimensions: 'No hay dimensiones registradas',
    incomingHeading: 'Actúan sobre esta institución',
    outgoingHeading: 'Esta institución actúa sobre',
    ledgerHint:
      'Cada fila se lee de izquierda a derecha, en el sentido de la relación. Seleccione cualquier institución para abrir su perfil.',
    relationCount: '{n} relaciones registradas',
    relationCountOne: 'Una relación registrada',
    noRelations: 'No hay relaciones registradas para esta institución.',
    sourceLink: 'Fuente institucional',
    matrixHeading: '¿Cómo circulan la autoridad, el control y el dinero?',
    matrixIntro:
      'Cada celda cuenta las relaciones que van del sistema de la fila al sistema de la columna. Seleccione una celda para leerlas.',
    matrixFrom: 'De',
    matrixTo: 'A',
    matrixAllFamilies: 'Todas las relaciones',
    matrixLegendLabel: 'Relaciones por celda',
    matrixCell: '{n} relaciones de {from} a {to}',
    matrixCellOne: 'Una relación de {from} a {to}',
    matrixCellNone: 'Ninguna relación de {from} a {to}',
    matrixSummary: '{total} relaciones en {filled} de {cells} celdas',
    mapSummary: '{institutions} instituciones, {relations} relaciones registradas',
  },
  capabilityMap: {
    title: '¿Dónde está {countryTopic} en {dimension}?',
    metaTitle: 'Mapa de {dimension}, {country}, NCB',
    metaDescription:
      'Una lectura de {dimension} para {countryTopic}: la puntuación y la solidez de la evidencia, los indicadores en que se apoya, las condiciones a su lado y la posición entre los países de ingreso más cercano. Calculada a partir de los datos publicados.',
    dataset: 'Datos de la versión {version}',
    intro:
      'Esta página lee una capacidad a partir de los datos publicados y se recalcula en cada versión. Separa lo que {countryTopic} hace, que forma la puntuación, de lo que el país tiene, que queda al lado de la puntuación, y ubica al país entre los {count} países de ingreso más cercano. El texto describe los datos y no recomienda políticas.',
    scoreHeading: '¿En qué se apoya la puntuación?',
    scoreIntro:
      'La puntuación de {dimension} es el promedio, con pesos iguales, de las posiciones de {n} indicadores en una escala de 0 a 100 que todos los países definen juntos. La solidez de la evidencia mide lo que hay detrás de la puntuación y aparece a su lado, como un segundo número.',
    scoreLabel: 'Puntuación',
    confidenceLabel: 'Solidez',
    bandLine: 'evidencia {band}',
    rowsHeading: 'Indicadores observados',
    colPosition: 'Posición en la escala',
    colPeerMedian: 'Mediana de los pares',
    rowSource: '{source}, {year}',
    noValue: 'sin valor',
    gapsLine: 'Todavía sin base comparable, y por eso bajan la solidez: {list}.',
    dimensionIncome:
      'La puntuación de {dimension} acompaña al PIB per cápita con r = {r} entre {n} países.',
    conditionsIntro:
      'Junto a cada condición, dos r leen todos los países a la vez, uno contra el ingreso y otro contra la puntuación de la capacidad. Cuando el r con el ingreso es mucho mayor que el r con la puntuación, tener la condición va más con ser rico que con la capacidad medida.',
    conditionIncome: 'r con el ingreso: {r} ({n} países)',
    conditionScore: 'r con la puntuación de {dimension}: {r} ({n} países)',
    conditionPeerMedian: 'Mediana de los pares: {value} {unit} ({n} pares con valor)',
    peersHeading: '¿Dónde queda {countryTopic} entre sus pares?',
    peerRule:
      'Los pares son los {count} países de ingreso más cercano. El ingreso es el PIB per cápita en paridad de poder adquisitivo, en dólares internacionales constantes, del último año publicado por el Banco Mundial, y la distancia se mide en escala logarítmica, donde la mitad y el doble quedan a la misma distancia. Ningún país se elige a mano, y el conjunto cambia cuando cambian los datos.',
    peerRange:
      'En esta versión, el ingreso de los pares va de {min} a {max}, y {countryTopic} tiene {own} ({year}).',
    peersUnscored:
      '{n} de los {count} pares no tienen puntuación en esta capacidad y quedan fuera de la mediana.',
    colCountry: 'País',
    colIncome: 'PIB per cápita, PPA',
    colScore: 'Puntuación',
    fieldAria: '{count} países de ingreso similar en una escala de 0 a 100 en {dimension}.',
    fieldNote: 'La franja sombreada es la mitad central del conjunto y la línea dentro de ella es la mediana.',
    readingHeading: '¿Qué separa a {countryTopic} de sus pares?',
    scoreAbove:
      '{countryTopic} tiene {score} en {dimension}, por encima de la mediana de los {n} pares con puntuación, que es {median}.',
    scoreBelow:
      '{countryTopic} tiene {score} en {dimension}, por debajo de la mediana de los {n} pares con puntuación, que es {median}.',
    scoreLevel:
      '{countryTopic} tiene {score} en {dimension}, igual a la mediana de los {n} pares con puntuación.',
    rowsAbove: 'Por encima de la mediana de los pares: {list}.',
    rowsBelow: 'Por debajo de la mediana de los pares: {list}.',
    rowsLevel: 'En la mediana de los pares: {list}.',
    conditionsMore: '{countryTopic} tiene más que la mediana de los pares en {list}.',
    conditionsLess: '{countryTopic} tiene menos que la mediana de los pares en {list}.',
    conditionsLevel: '{countryTopic} está en la mediana de los pares en {list}.',
    readingNote:
      'Cada frase compara una posición con una mediana. La causa de una diferencia, y qué hacer con ella, quedan fuera de estos datos.',
    noPeers:
      'Esta versión de los datos no publica el ingreso de los países, por eso la página no forma el conjunto de pares.',
    noIncome:
      'El Banco Mundial no publica el PIB per cápita de {countryTopic}, así que la página no forma un grupo de pares ni hace comparaciones.',
    limitsHeading: 'Lo que esta lectura no muestra',
    limitProxy:
      'La puntuación nacional es una aproximación gruesa. Una capacidad se forma en empresas, ciudades, redes y grupos, por debajo del nivel del país, y un promedio nacional describe solo las condiciones en que trabajan.',
    limitPeers:
      'Los pares comparten el ingreso y nada más. Tamaño, estructura productiva, región y régimen político quedan fuera de la regla, y un conjunto de {count} países puede cambiar con cualquier revisión del PIB.',
    limitCorrelation:
      'Un r lee todo el conjunto a la vez y no dice nada sobre un país aislado. La correlación tampoco muestra causa.',
    rowCaveats: {
      long_term_unemployment_share: {
        text: 'El desempleo de larga duración viene de ILOSTAT, después de un filtro de plausibilidad aplicado por igual a todos los países. Algunos países con puntuación usan una encuesta de hogares en lugar de una encuesta de fuerza laboral. Una proporción alta tiene dos lecturas: una reasignación lenta donde el desempleo también es alto, o un grupo residual pequeño donde es bajo.',
        decisions: ['D120'],
      },
      export_diversification: {
        text: 'La diversificación de las exportaciones lee la concentración de la canasta de mercancías que publica la UNCTAD. Quedan fuera la velocidad con que un país cambia de producto y los servicios, y los países que venden pocos productos de alto valor aparecen como concentrados.',
        decisions: ['D119'],
      },
      new_export_products_rate: {
        text: 'Los nuevos productos de exportación cuentan las líneas de mercancías en las que un país entró en quince años, según el Growth Lab de Harvard. Son exportaciones brutas, así que los centros de reexportación cuentan lo que pasa por ellos; un país que no informa su comercio se lee en los registros de sus socios. Una ventana tan larga se mueve poco de una versión a otra.',
        decisions: ['D149'],
      },
    },
    /* Una plantilla por tipo de hecho. Qué país tiene qué hecho es
     * COUNTRY_ROW_FACTS en el modelo (D136). */
    rowFacts: {
      household_survey: 'Para {countryTopic}, la serie de ILOSTAT viene de la {survey}, una encuesta de hogares.',
      household_survey_unreliable:
        'Para {countryTopic}, la serie de ILOSTAT viene de una encuesta de hogares, y la OIT marca el valor como poco confiable.',
      urban_survey_unreliable:
        'Para {countryTopic}, la serie de ILOSTAT viene de la {survey}, que cubre solo aglomerados urbanos, y la OIT marca el valor como poco confiable.',
      flagged_unreliable: 'Para {countryTopic}, la OIT marca el valor de ILOSTAT como poco confiable.',
      gate_never_passed:
        'Para {countryTopic}, ningún año de la serie de ILOSTAT pasa el filtro de plausibilidad: la encuesta registra menos de {floor}% casi todos los años, así que la fila queda sin valor.',
    },
    noConditions:
      'Ninguna condición se publica junto a {dimension} en esta versión, por eso la página muestra solo los indicadores que forman la puntuación.',
    floorNote:
      'Sin puntuación en esta versión. Indicadores observados: {n}, por debajo del mínimo que el modelo exige para formar un promedio.',
    thinNote:
      'La solidez de la evidencia está en la franja {band}, así que la puntuación se apoya en poca evidencia.',
    artefactsLine:
      'Los artefactos conocidos que tocan {dimension}, descritos en inglés en la página de límites:',
    artefactsStructural: 'Y los que valen para toda puntuación del benchmark:',
    artefactLink: 'artefacto {id}',
    rowPeers: '{n} pares con valor',
    indexLink: 'Ver todas las capacidades en el mapa',
    index: {
      navLabel: 'Mapa',
      title: '¿Dónde está {countryTopic} en cada capacidad?',
      metaTitle: 'Mapa de capacidades, {country}, NCB',
      metaDescription:
        'Una lectura de cada capacidad para {countryTopic}: la puntuación, la solidez de la evidencia y la posición frente a la mediana de los países de ingreso más cercano. Calculada a partir de los datos publicados.',
      intro:
        'Esta página lee {n} capacidades para {countryTopic} a partir de los datos publicados y se recalcula en cada versión. Cada fila trae la puntuación y la solidez de la evidencia como dos números y compara la puntuación con la mediana de los {count} países de ingreso más cercano. Las filas siguen el orden del modelo, y cada una abre el mapa de esa capacidad.',
      heading: '¿Cómo se compara cada capacidad con los pares?',
      colDimension: 'Capacidad',
      colPeerMedian: 'Mediana de los pares',
      above: 'por encima de la mediana de los pares',
      below: 'por debajo de la mediana de los pares',
      level: 'en la mediana de los pares',
      none: 'sin comparación',
      peersScored: '{n} de {count} pares con puntuación',
      note: 'Cada fila compara una puntuación con una mediana. Las capacidades no se suman, y la página no forma una puntuación general.',
    },
    decisionLink: 'decisión {id}',
    agendaLink: 'Abrir la agenda de capacidades',
    capabilityLink: 'Ver {dimension} en todos los países, en inglés',
  },
}
