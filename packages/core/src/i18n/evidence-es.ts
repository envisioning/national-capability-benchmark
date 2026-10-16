/**
 * The evidence records of the Spanish-layer countries in Latin American
 * Spanish: the title and the claim of every record filed against one of the 17
 * countries the es lexicon writes for, by record id. Spain's records read in
 * Peninsular Spanish in evidence-es-es.ts.
 *
 * The record stays English and sourced; this is its reading in the layer's
 * language, and nothing here adds a fact the record does not state. Every
 * figure is the record's, written the es-419 way, and the test beside the
 * lexicon holds the two to the same digits, so a record that changes its
 * figures fails the build until this entry follows it. A record filed
 * against a layer country with no entry here also fails it. Records about
 * other countries listed under a dimension stay English. The copy was
 * translated by Claude and not reviewed by a native speaker. See D158 and the
 * Spanish layers decision.
 */
export const EVIDENCE_ES: Record<string, { title: string; claim: string }> = {
  "ury-electricity": {
    title: "Suministro eléctrico reconstruido sobre fuentes renovables",
    claim:
      "Uruguay reconstruyó su suministro eléctrico entre 2010 y 2017 mediante licitaciones públicas y contratos de largo plazo, y en 2025 los combustibles fósiles produjeron 293 GWh de los 15,855 GWh generados, de modo que el 98.2 por ciento provino de fuentes hidráulica, eólica, de biomasa y solar.",
  },
  "ury-ceibal": {
    title: "Plan Ceibal, una computadora conectada por niño",
    claim:
      "Uruguay entregó una computadora portátil conectada a cada niño de la escuela primaria pública a partir de 2007, el primer país en hacerlo a escala nacional, y la encuesta de hogares encontró una computadora del Ceibal en los hogares del 35.8 por ciento de la población en 2018.",
  },
  "arg-convertibility": {
    title: "El Plan de Convertibilidad y su colapso",
    claim:
      "Argentina puso fin a la hiperinflación al fijar por ley el peso al dólar en abril de 1991, lo que redujo la inflación anual de 4,923 por ciento en 1989 a 3.9 por ciento en 1994, y el régimen se mantuvo hasta su colapso en la crisis de 2001-2002.",
  },
  "mex-seguro-popular": {
    title: "Seguro Popular y su eliminación",
    claim:
      "México creó en 2003 un seguro público de salud para las personas sin seguridad social y lo eliminó en 2020, y el CONEVAL midió un aumento de la proporción de la población sin acceso a servicios de salud de 16.2 por ciento en 2018 a 39.1 por ciento en 2022.",
  },
  "ury-snig": {
    title: "SNIG, trazabilidad individual universal del ganado bovino",
    claim:
      "Uruguay obligó a los productores a registrar cada ternero en un sistema nacional de trazabilidad a partir de 2006, y para octubre de 2011 el registro abarcaba el 100 por ciento del rodeo, 11.75 millones de cabezas de ganado vivo, mientras que las caravanas de identificación llegaban a más de 45,000 productores cada año.",
  },
  "ury-rail-network": {
    title: "Trenes de pasajeros de AFE y contracción de la red",
    claim:
      "La empresa ferroviaria estatal de Uruguay suspendió el servicio de pasajeros en enero de 1988 para concentrarse en la carga; para 1990, cerca de la mitad de la red nacional había sido declarada fuera de servicio, con 1,484 kilómetros activos de una red de 2,998 kilómetros, antes de que los servicios de pasajeros regresaran solo de forma parcial en 1993.",
  },
  "chl-chilecompra": {
    title: "ChileCompra, un mercado nacional de compras públicas",
    claim:
      "Chile opera Mercado Público como plataforma compartida de compras públicas electrónicas; en 2024 transó US$17.643 mil millones mediante 2,031,670 órdenes de compra en las que participaron 110,255 proveedores.",
  },
  "chl-startup-chile": {
    title: "Start-Up Chile, una aceleradora pública para startups globales",
    claim:
      "Desde 2010, Start-Up Chile ha apoyado a más de 2,500 startups chilenas y extranjeras mediante una aceleradora pública que no toma participación accionaria y que conecta a los fundadores con inversionistas, mentores y empresas.",
  },
  "chl-27f-reconstruction": {
    title: "Reconstrucción 27F, un programa nacional de recuperación tras el terremoto de 2010",
    claim:
      "Tras el terremoto y tsunami de 2010, el programa de reconstrucción de Chile reparó o repuso más de 223,000 viviendas en siete regiones; el MINVU informó un avance de 99.93% a febrero de 2020 y modificó protocolos, normas sísmicas y exigencias de mitigación de riesgos.",
  },
  "chl-transantiago": {
    title: "Transantiago, una reforma de transporte integrado con creciente dependencia del subsidio",
    claim:
      "Chile puso en marcha en 2007 el sistema integrado de buses y metro Transantiago; una evaluación independiente del periodo 2016-19 encontró que el subsidio estatal por tarifa de pasajero aumentó de CLP 640 por cada CLP 1,000 pagados en 2016 a CLP 790 en 2019, aun cuando la producción de pasajeros creció 7%.",
  },
  "col-4g-programme": {
    title: "Concesiones viales 4G, un portafolio nacional de infraestructura",
    claim:
      "A septiembre de 2024, el programa vial 4G de Colombia comprendía 30 concesiones con un avance agregado de 86.99%, de las cuales 14 estaban en operación, 13 en construcción, dos en preconstrucción y una en terminación anticipada.",
  },
  "col-secop-ii": {
    title: "SECOP II, una plataforma transaccional para la contratación pública",
    claim:
      "Desde marzo de 2015, Colombia Compra Eficiente usa el SECOP II para llevar la contratación pública de la simple publicación a las transacciones en línea; en 2024 la plataforma gestionó COP117.642 billones, el 84.4% del valor gestionado en las tres plataformas del SECOP.",
  },
  "col-digital-id": {
    title: "Cédula digital, un servicio de identidad adaptado al uso móvil",
    claim:
      "En 2024 la Registraduría de Colombia implementó la versión 2.0 de su aplicación de cédula digital y envió 2,642,775 cédulas digitales de policarbonato a oficinas de todo el país, mientras continuaba un piloto para perfeccionar los servicios digitales.",
  },
  "col-victims-reparation": {
    title: "Reparación a las víctimas, una respuesta administrativa de largo plazo al conflicto",
    claim:
      "En 2024 la Unidad para las Víctimas de Colombia ordenó 307,619 indemnizaciones administrativas en beneficio de 285,537 víctimas, aprobó 79 planes de reparación colectiva y cerró tres planes de comunidades afectadas por el conflicto armado.",
  },
  "col-fondo-adaptacion": {
    title: "Fondo Adaptación, recuperación y reasentamiento seguro tras La Niña",
    claim:
      "Tras las inundaciones de La Niña de 2010-11, el Fondo Adaptación de Colombia había avanzado en el reasentamiento, la reconstrucción y el mejoramiento de más de 39,000 hogares al momento de su evaluación de 2021-23, y presentó ese trabajo como una reducción de la exposición climática y del riesgo fiscal.",
  },
  "col-reficar": {
    title: "Reficar, una modernización de refinería con fallo de responsabilidad fiscal",
    claim:
      "Un fallo de responsabilidad fiscal de la Contraloría de 2021 sobre la modernización de Reficar en Colombia estableció un daño de COP2.945 billones, tras constatar USD997 millones en inversiones adicionales que no agregaron valor al proyecto.",
  },
  "peru-juntos": {
    title: "Juntos, un sistema de transferencias condicionadas a escala nacional",
    claim:
      "El programa de transferencias monetarias condicionadas Juntos de Perú, creado en 2005 y adscrito al MIDIS en 2012, operaba en 1,885 distritos y beneficiaba a 793,623 hogares a agosto de 2024 mediante apoyo focalizado a través del SISFOH.",
  },
  "peru-obras-por-impuestos": {
    title: "Obras por Impuestos, empresas que financian infraestructura pública",
    claim:
      "El mecanismo Obras por Impuestos de Perú permite a empresas privadas financiar proyectos públicos a cuenta de sus obligaciones tributarias futuras; el Ministerio de Economía y Finanzas registró S/5.504 mil millones en certificados emitidos entre 2009 y enero de 2024, y seis proyectos identificados como concluidos física y financieramente en 2024.",
  },
  "peru-invierte": {
    title: "Invierte.pe, un sistema nacional de programación multianual y gestión de inversiones",
    claim:
      "El sistema Invierte.pe de Perú da seguimiento a la inversión pública de los gobiernos nacional, regionales y locales; al 25 de julio de 2024 los tres niveles habían ejecutado S/25.939 mil millones de un presupuesto de inversión de S/67.797 mil millones, un avance reportado de 38.3%.",
  },
  "peru-reconstruccion-con-cambios": {
    title: "Reconstrucción con Cambios, un portafolio de recuperación con retrasos",
    claim:
      "Un informe de control de la Contraloría de 2023 encontró que el portafolio de educación del programa Reconstrucción con Cambios de Perú registraba 36.6% de ejecución a julio de 2023, frente a una meta de 78% prevista en la línea de base anterior, con la fecha objetivo correspondiente ya vencida.",
  },
  "cri-fonafifo-psa": {
    title: "Pago por Servicios Ambientales del FONAFIFO",
    claim:
      "El programa de Pago por Servicios Ambientales del FONAFIFO de Costa Rica pagó contratos que abarcaban 208,089 hectáreas en 2024, con desembolsos de ₡9.234 mil millones, y utilizó financiamiento público, de donantes y vinculado al mercado para mantener tierras privadas en usos forestales.",
  },
  "cri-electricidad-renovable": {
    title: "El ICE y un sistema eléctrico nacional mayoritariamente renovable",
    claim:
      "El sistema eléctrico integrado de Costa Rica generó el 89.4% de su electricidad a partir de fuentes renovables en 2024, mientras que el ICE informó una cobertura eléctrica del 98.7% de los hogares pese a uno de los años más secos registrados en el país.",
  },
  "cri-firma-digital": {
    title: "Firma digital certificada en los servicios públicos",
    claim:
      "El MICITT de Costa Rica informó en octubre de 2023 que más de 60 instituciones públicas utilizaban la firma digital certificada en más de 100 servicios a la ciudadanía, con casi 75,000 certificados emitidos durante ese año.",
  },
  "cri-redcudi": {
    title: "Red de cuido REDCUDI y referencias mediante SINIRUBE",
    claim:
      "El IMAS de Costa Rica informó que su beneficio nacional de Cuido y Desarrollo Infantil llegó a 25,704 niños y niñas en 2024 con una inversión de ₡13.2 mil millones, mientras que las referencias interinstitucionales utilizaron el SINIRUBE para asignar a las familias elegibles los cupos disponibles.",
  },
  "cri-seguro-salud": {
    title: "Alcance universal del seguro de salud de la CCSS",
    claim:
      "La Caja Costarricense de Seguro Social informó una cobertura del seguro de salud del 92.92% de la población nacional en 2024, con base en encuestas de hogares y registros administrativos para incluir a cotizantes, dependientes, pensionados y hogares asegurados por el Estado.",
  },
  "ecu-dollarization": {
    title: "Dolarización, un rediseño monetario de emergencia",
    claim:
      "Ecuador adoptó el dólar estadounidense como moneda de curso legal en enero de 2000, en medio de una crisis bancaria y cambiaria; una revisión del Banco Central del Ecuador reporta que la inflación bajó de 96.1% en 2000 a menos de 8% en 2003, mientras el nuevo régimen eliminó el instrumento cambiario.",
  },
  "ecu-16a-response": {
    title: "Coordinación nacional de emergencia tras el terremoto de 2016",
    claim:
      "Tras el terremoto de magnitud 7.8 que sacudió Ecuador en abril de 2016, el Comité de Operaciones de Emergencia Nacional informó que había 17 albergues y 59 refugios temporales activos, que atendían a 25,931 personas, mientras se desplegaban unidades móviles de salud y fuerzas de seguridad en las provincias afectadas.",
  },
  "ecu-metro-quito": {
    title: "Metro de Quito, una obra de transporte ferroviario urbano a lo largo de varias administraciones",
    claim:
      "Quito inauguró la primera línea de su metro en diciembre de 2023, tras una construcción que abarcó varias administraciones, y el operador reportó más de 54 millones de viajes de pasajeros durante 2024 con servicio ininterrumpido.",
  },
  "ecu-facturacion-electronica": {
    title: "Facturación electrónica del SRI a escala de toda la economía",
    claim:
      "El Servicio de Rentas Internas de Ecuador recibió aproximadamente 3.299 mil millones de comprobantes electrónicos entre enero y diciembre de 2024, mediante una plataforma obligatoria por ley y con firma digital que conecta a los contribuyentes privados con el sistema tributario público.",
  },
  "ecu-credito-desarrollo-humano": {
    title: "Crédito de Desarrollo Humano para emprendimientos de los beneficiarios",
    claim:
      "El Ministerio de Inclusión Económica y Social de Ecuador informó la entrega de 44,622 créditos de Desarrollo Humano en 2024, de ellos 6,622 a personas indígenas, con lo que convirtió un registro de transferencias sociales en financiamiento para pequeños emprendimientos y apoyo para el acceso a mercados.",
  },
  "pan-canal-operations": {
    title: "Ampliación del Canal de Panamá y operación autofinanciada",
    claim:
      "Tras la apertura del tercer juego de esclusas en 2016, la Autoridad del Canal de Panamá atendió 9,944 tránsitos de buques de alto calado y 423 millones de toneladas de carga en el año fiscal 2024, y reportó B/.4.986 mil millones en ingresos totales pese a las restricciones climáticas.",
  },
  "pan-metro": {
    title: "Operación de la red del Metro de Panamá",
    claim:
      "La red pública de metro de Panamá, inaugurada en 2014 y ampliada con la Línea 2, transportó 118,351,007 pasajeros en el periodo operativo de doce meses reportado en su memoria institucional 2024.",
  },
  "pan-120-a-los-65": {
    title: "120 a los 65, pensión social",
    claim:
      "El programa 120 a los 65 de Panamá pagó una pensión no contributiva a un promedio de unas 123,000 personas adultas mayores por pago entre julio de 2019 y junio de 2024, con B/.890.835 millones programados en el periodo y un registro nacional de beneficiarios utilizado para focalizar la elegibilidad.",
  },
  "pan-canal-drought": {
    title: "Respuesta del Canal en agua y tránsitos ante la sequía de 2023-24",
    claim:
      "Durante la sequía extrema de 2023-24, la Autoridad del Canal de Panamá ajustó las reglas de calado y de reservas para preservar el agua del canal y de los lagos que abastecen a más de la mitad de la población de Panamá, y redujo los tránsitos diarios de los 36 habituales a 22 en diciembre de 2023 sin dejar de operar la vía interoceánica.",
  },
  "bol-bono-juana-azurduy": {
    title: "Bono Juana Azurduy, transferencia para la salud materno-infantil",
    claim:
      "El Bono Juana Azurduy de Bolivia abrió su ronda de pagos de 2024 a través de 47 entidades financieras autorizadas en los 340 municipios y seis territorios indígenas, y condicionó la transferencia a controles de salud prenatales, del parto y de la primera infancia; el programa reportó 1,525,566 mujeres embarazadas y 1,783,936 niños y niñas alcanzados entre 2009 y 2023.",
  },
  "bol-renta-dignidad": {
    title: "Renta Dignidad, pensión no contributiva de vejez",
    claim:
      "La Renta Dignidad de Bolivia, creada por la Ley 3791 en 2007 y pagada desde 2008, llegó a 1,241,440 beneficiarios en 2024 con Bs5.289 mil millones desembolsados a través de la administración nacional de la seguridad social.",
  },
  "bol-mi-teleferico": {
    title: "Mi Teleférico, red urbana de transporte por cable",
    claim:
      "La red Mi Teleférico de Bolivia transportó 78,715,401 viajes de pasajeros en 2024; su informe de gestión comparó ese resultado con un volumen anual de 97.7 millones necesario para el equilibrio presupuestario, es decir, cerca del 80% de la meta, mientras el sistema seguía en servicio.",
  },
  "bol-lithium-plant": {
    title: "Planta industrial de carbonato de litio por debajo de su capacidad de diseño",
    claim:
      "La empresa estatal del litio de Bolivia duplicó su producción de carbonato de litio a 2,064 toneladas en 2024 después de que su planta industrial entrara en operación, pero el Ministerio de Economía y Finanzas Públicas informó que problemas técnicos en las piscinas de evaporación y en la planta de tratamiento de agua mantuvieron la producción por debajo de la capacidad proyectada del proyecto de 15,000 toneladas anuales.",
  },
  "pry-tekopora": {
    title: "Tekoporã Mbarete, programa de apoyo a las familias",
    claim:
      "El programa de protección social Tekoporã Mbarete de Paraguay protegió a más de 175,000 familias en todo el país en 2024, con pagos mensuales tras un rediseño en 2023, y reportó un 95% de bancarización además de la georreferenciación de 11,316 hogares participantes.",
  },
  "pry-itaipu": {
    title: "Operación de la central hidroeléctrica binacional Itaipú",
    claim:
      "Itaipú abasteció a la red de Paraguay con 20,383 GWh en 2024, un 4.5% más que en 2023, mientras que la central binacional generó 67,089 GWh en total y siguió operando tras cuatro décadas de servicio.",
  },
  "pry-sifen": {
    title: "SIFEN, implementación nacional de la facturación electrónica",
    claim:
      "La administración tributaria de Paraguay aprobó 651,894,711 documentos tributarios electrónicos durante 2024 y reportó 6,659 facturadores electrónicos que utilizaban el sistema SIFEN, combinando la incorporación obligatoria de las empresas más grandes con la vía gratuita e-Kuatia'i para los pequeños contribuyentes.",
  },
  "pry-ruta-py02": {
    title: "Ruta PY02, concesión vial público-privada",
    claim:
      "El balance de obras públicas de Paraguay registra la duplicación y ampliación de la Ruta PY02 como una alianza público-privada de 149.5 kilómetros, adjudicada en el marco de la ley de APP de 2013 con un contrato de construcción de USD 507 millones y una concesión vigente hasta 2046.",
  },
  "pry-metrobus": {
    title: "Metrobús, un proyecto de autobús de tránsito rápido inconcluso",
    claim:
      "El corredor del Metrobús de Asunción planificado en Paraguay terminó con un paquete de obras incompleto e inviable: en abril de 2024, el Ministerio Público afirmó que el Estado había pagado certificados por obras que no cumplían el propósito del programa y denunció un daño patrimonial de G.180.03 mil millones.",
  },
  "arg-auh": {
    title: "Asignación Universal por Hijo, la prestación por hijo",
    claim:
      "La Asignación Universal por Hijo (AUH) de Argentina llegó a 4,083,987 niñas, niños y adolescentes en junio de 2024, con 2,324,716 titulares adultos que recibían la prestación a través de la Administración Nacional de la Seguridad Social y sus condicionalidades de salud, vacunación y educación.",
  },
  "arg-sube": {
    title: "SUBE, la plataforma nacional de boleto electrónico y subsidios",
    claim:
      "El sistema SUBE de Argentina distribuyó más de cinco millones de tarjetas y registró alrededor de 6.7 millones de tarjetas nuevas en 2024, al tiempo que amplió la red a más de 30,000 puntos de carga y puso SUBE Digital a disposición en todas las localidades.",
  },
  "arg-vaca-muerta": {
    title: "Vaca Muerta, el desarrollo de energía no convencional",
    claim:
      "La Secretaría de Energía de Argentina informó que Vaca Muerta aportó el 54.9% de la producción nacional de petróleo y el 50.1% de la de gas en diciembre de 2024, en un año en que la producción nacional de petróleo alcanzó su nivel más alto desde 2003 y la de gas, el más alto desde 2006.",
  },
  "arg-arsat-3": {
    title: "ARSAT-3, un programa satelital suspendido antes del lanzamiento",
    claim:
      "Una revisión del gobierno argentino determinó que el programa de construcción del ARSAT-3, aprobado en 2015 con un lanzamiento previsto para 2019, se suspendió en 2016-17; el satélite no construido obligó a realizar posteriormente dos operaciones de protección orbital y dejó sin cumplir el objetivo original de banda ancha en todo el país.",
  },
  "gtm-guatecompras": {
    title: "Guatecompras, el mercado nacional de compras públicas",
    claim:
      "El Ministerio de Finanzas Públicas de Guatemala informó de 152,676 usuarios habilitados en Guatecompras en abril de 2023, entre ellos 137,950 proveedores inscritos, junto con compradores públicos, auditores y entes fiscalizadores que utilizan el sistema nacional de contrataciones públicas.",
  },
  "dom-911": {
    title: "Sistema Nacional de Atención a Emergencias 9-1-1",
    claim:
      "La República Dominicana amplió su Sistema Nacional de Atención a Emergencias y Seguridad 9-1-1 a 27 provincias en julio de 2026, con una cobertura del 94.64% de la población, es decir, más de 9.6 millones de personas.",
  },
  "hnd-911": {
    title: "Sistema Nacional de Emergencias 911",
    claim:
      "El Sistema Nacional de Emergencias 911 de Honduras coordinó y atendió 762,601 de los 788,573 incidentes de emergencia registrados en 2024, con una eficacia reportada del 96.71% a través de cinco centros regionales de coordinación.",
  },
  "nic-electrification": {
    title: "Electrificación rural y cobertura eléctrica casi universal",
    claim:
      "El Ministerio de Energía y Minas de Nicaragua informó una cobertura eléctrica nacional del 99.575% en diciembre de 2024, después de que los proyectos públicos de electrificación llevaran el servicio a 732,427 viviendas y 3,853,005 personas.",
  },
  "ven-gmvv": {
    title: "Gran Misión Vivienda Venezuela y el hito de los cinco millones de viviendas",
    claim:
      "La Gran Misión Vivienda Venezuela informó la entrega de su vivienda número cinco millones el 7 de junio de 2024, y el programa afirmó que la autoconstrucción comunitaria aportó el 75% de su construcción en los cuatro años anteriores.",
  },
  "slv-bitcoin-law-rollback": {
    title: "Ley Bitcoin y su reversión de 2025",
    claim:
      "La reforma de 2025 en El Salvador volvió voluntaria la aceptación del bitcoin por parte del sector privado, limitó la ley a la participación privada y derogó los artículos 4, 8 y 9 de la Ley Bitcoin de 2021.",
  },
  "mex-puntos-mexico-conectado": {
    title: "Puntos México Conectado, centros nacionales de aprendizaje digital",
    claim:
      "La Secretaría de Comunicaciones y Transportes de México operó centros Puntos México Conectado en los 32 estados y reportó más de 410,000 socios inscritos y más de 260,000 inscripciones a cursos a junio de 2017.",
  },
  "mex-jovenes-construyendo": {
    title: "Jóvenes Construyendo el Futuro, capacitación en centros de trabajo con apoyo del gobierno",
    claim:
      "La Secretaría del Trabajo y Previsión Social de México vinculó a jóvenes con más de medio millón de centros de trabajo registrados para capacitarse en el trabajo, y reportó 2.95 millones de beneficiarios en todo el país tras cinco años de Jóvenes Construyendo el Futuro, en febrero de 2024.",
  },
  "mex-cofepris-digital": {
    title: "Trámites regulatorios digitales de la COFEPRIS",
    claim:
      "La COFEPRIS, el regulador de medicamentos y productos para la salud de México, completó 509,921 trámites totalmente en línea y con trazabilidad al 5 de septiembre de 2024, con lo que sustituyó la entrega de documentos en papel para una gran parte de sus usuarios regulados.",
  },
  "mex-internet-para-todos": {
    title: "CFE Telecomunicaciones e Internet para Todos",
    claim:
      "La empresa estatal de telecomunicaciones de México, CFE Telecomunicaciones e Internet para Todos, instaló 113,683 sitios públicos de internet gratuito a septiembre de 2024, lo que equivale al 81.2 por ciento de su meta declarada de 140,000 sitios para 2025.",
  },
  "mex-simulacro-nacional": {
    title: "Simulacro Nacional 2024, un ejercicio de emergencia en todo el país",
    claim:
      "El Sistema Nacional de Protección Civil de México coordinó en septiembre de 2024 un simulacro de sismo en todo el país en el que participaron 9,727,000 personas, con alertas difundidas por 14,490 altavoces públicos y un grupo de trabajo interinstitucional de 1.9 millones de elementos.",
  },
  "mex-prospera": {
    title: "PROSPERA y su sustitución por una nueva instancia de becas",
    claim:
      "México abrogó el 31 de mayo de 2019 el decreto de 2014 que creó PROSPERA y ordenó transferir su personal, sus bienes y su presupuesto a la nueva Coordinación Nacional de Becas para el Bienestar Benito Juárez en un plazo de 90 días.",
  },
  "mex-naicm": {
    title: "Nuevo Aeropuerto Internacional de México y su cancelación",
    claim:
      "México canceló el aeropuerto de Texcoco, parcialmente construido, cuando ya habían comenzado las obras y los contratos; el documento de cancelación del gobierno de 2019 estimó un costo de cancelación de 100 mil millones de pesos, que incluía 60 mil millones de pesos ya gastados y 40 mil millones en compromisos no recuperables.",
  },
  "hnd-eeh-loss-reduction": {
    title: "Alianza con la Empresa Energía Honduras para reducir pérdidas y su reversión",
    claim:
      "La empresa estatal ENEE adjudicó a la Empresa Energía Honduras un contrato de alianza público-privada en diciembre de 2015, con inicio del servicio en 2016, para gestionar la distribución nacional y reducir en 17% las pérdidas técnicas y no técnicas. Las pérdidas de distribución bajaron de 33.38% a 27.11% hacia febrero de 2018, subieron a 35.37% en diciembre de 2020 y se ubicaron en 30.77% en diciembre de 2021. El Estado intervino el contrato y retomó la distribución cuando este terminó en agosto de 2023.",
  },
  "hnd-palmerola": {
    title: "Aeropuerto Internacional de Palmerola",
    claim:
      "La Secretaría de Infraestructura de Honduras concesionó el aeropuerto internacional de Palmerola a Palmerola International Airport S.A., con una inversión referencial de USD 87.1 millones. Las obras comenzaron el 5 de diciembre de 2016 y las operaciones el 11 de diciembre de 2021, unos 60 meses después del inicio de las obras, frente a un plazo contractual de obras de 61 meses (el inicio de operaciones no implica necesariamente la conclusión de las obras).",
  },
  "gtm-intecap": {
    title: "Instituto Técnico de Capacitación y Productividad (INTECAP)",
    claim:
      "El INTECAP, instituto de capacitación de Guatemala financiado con un aporte patronal, informó de 490,280 participantes en 26,387 eventos de formación profesional en 2025, el 99.72% de la meta de su plan operativo, a través de centros en los 22 departamentos.",
  },
  "slv-insaforp": {
    title: "INSAFORP, instituto tripartito de formación profesional, y su disolución",
    claim:
      "El Salvador gestionó su sistema nacional de formación profesional desde 1993 a través del INSAFORP, un instituto financiado con un aporte patronal del 1% sobre la planilla y dirigido por un consejo tripartito de cuatro representantes del gobierno, cuatro de los empleadores y cuatro de los trabajadores; una reforma de 2021 otorgó al Presidente la elección de los puestos patronales, y el Decreto 893 del 14 de noviembre de 2023 disolvió el INSAFORP y trasladó sus funciones al INCAF, cuyo consejo está integrado solo por el presidente del instituto y cuatro ministerios.",
  },
  "slv-chaparral": {
    title: "Central hidroeléctrica El Chaparral (3 de Febrero)",
    claim:
      "La Comisión Ejecutiva Hidroeléctrica del Río Lempa (CEL), entidad estatal de El Salvador, financió la central hidroeléctrica El Chaparral, sobre el río Torola, mediante un préstamo del BCIE gestionado en septiembre de 2008, con cuatro años de construcción previstos, y la inauguró como central 3 de Febrero el 19 de octubre de 2023 con un costo aproximado de US$800 millones; la CEL sitúa la inversión inicial en US$207.8 millones, por lo que el costo final equivale a unas 3.8 veces la cifra inicial, unos 15 años después del préstamo de 2008.",
  },
  "dom-infotep": {
    title: "INFOTEP, formación técnico profesional nacional",
    claim:
      "El Instituto Nacional de Formación Técnico Profesional (INFOTEP) de la República Dominicana, de carácter tripartito y creado por la Ley 116-80 en 1980, registró 1,027,791 participantes en acciones formativas en todo el país en 2025 y 3,613,098 participantes entre agosto de 2020 y agosto de 2025.",
  },
  "ven-pai": {
    title: "Programa Ampliado de Inmunizaciones y su deterioro",
    claim:
      "La OMS y UNICEF estimaron la cobertura nacional de DPT3 en niños y niñas de un año en Venezuela en 50 por ciento en 2025, frente a 87 por ciento en 2015, y la cobertura no ha vuelto a superar el 66 por ciento en ningún año desde 2017.",
  },
  "nic-sinapred": {
    title: "Evacuación del SINAPRED ante los huracanes Eta e Iota",
    claim:
      "El sistema nacional de desastres de Nicaragua, SINAPRED, evacuó a 160,597 personas y albergó a 59,964 ante los huracanes Eta e Iota en noviembre de 2020, cuando unos 3 millones de personas estaban expuestas, y se reportó la pérdida de 21 vidas.",
  },
  "ven-covid-vaccination": {
    title: "Campaña de vacunación contra la COVID-19",
    claim:
      "Las autoridades sanitarias de Venezuela informaron a la OMS que 22,157,232 personas, 78 por cada 100 habitantes, habían recibido al menos una dosis de vacuna contra la COVID-19 al 29 de diciembre de 2023, a partir de una primera dosis aplicada el 22 de febrero de 2021, y que 14,287,370 (50 por cada 100) habían completado el esquema primario.",
  },
  "dom-quedate-en-casa": {
    title: "Quédate en Casa, transferencia monetaria de emergencia",
    claim:
      "Anunciada el 25 de marzo de 2020 y con pagos desde abril, la transferencia Quédate en Casa del gobierno dominicano se apoyó en el registro existente del SIUBEN y en el sistema de pagos de PROSOLI y, según el informe del presidente al Senado del 10 de julio de 2020, llegó a más de 1.6 millones de hogares, 780,000 de ellos sin asistencia social previa.",
  },
  "dom-punta-catalina": {
    title: "Central termoeléctrica Punta Catalina y su sobrecosto",
    claim:
      "La Corporación Dominicana de Empresas Eléctricas Estatales (CDEEE) adjudicó la central a carbón Punta Catalina en noviembre de 2013 y, después de la adjudicación, pactó un precio final de contrato de US$1,945.0 millones, incluido el puerto de descarga; tras retrasos en la construcción y un acuerdo con el contratista en marzo de 2020 para resolver una controversia, el valor trasladado al fideicomiso público de la central en 2022 fue de US$2,340.54 millones, alrededor de 20 por ciento por encima del precio del contrato.",
  },
  "gtm-bono-familia": {
    title: "Bono Familia, la transferencia monetaria de emergencia por COVID-19",
    claim:
      "El Ministerio de Desarrollo Social (MIDES) de Guatemala realizó los primeros pagos del Bono Familia en mayo de 2020, dos meses después de que se declarara la emergencia por la pandemia. Hacia diciembre de 2020 el programa había llegado a 2.7 millones de beneficiarios, 21 veces los 128,036 beneficiarios de la transferencia regular Bono Social en 2019.",
  },
  "ury-linea-rivera": {
    title: "Rehabilitación ferroviaria de la Línea Rivera y su deterioro",
    claim:
      "El Ministerio de Transporte y Obras Públicas de Uruguay firmó en noviembre de 2013 un contrato financiado por el FOCEM para rehabilitar 422 km de la línea de Pintado a Rivera en un plazo de 36 meses, redujo el alcance en enero de 2017 a los 310 km entre Paso de los Toros y Rivera, recibió la última entrega provisoria en mayo de 2019 y, para junio de 2025, informó que la línea se encontraba en estado degradado, con la carga limitada a entre 10 y 25 km/h frente a su máximo establecido de 40 km/h y sin carga transportada en los últimos años.",
  },
  "ury-inefop": {
    title: "INEFOP, el instituto nacional tripartito de formación",
    claim:
      "El Instituto Nacional de Empleo y Formación Profesional de Uruguay, creado por la Ley 18.406 en 2008 y gobernado por el gobierno, los empleadores y los trabajadores, pasó de 9,696 cupos de capacitación, orientación y asistencia técnica en 2009 a 114,364 en 2019, y su director informó que más de 50,000 personas tomaron sus cursos de capacitación en 2023.",
  },
  "ury-anii-alianzas": {
    title: "ANII, Alianzas para la Innovación",
    claim:
      "La agencia nacional de investigación e innovación de Uruguay, la ANII, comenzó a cofinanciar proyectos conjuntos entre la academia y las empresas mediante Alianzas para la Innovación en 2009 y, al 30 de junio de 2016, había firmado 29 de esos contratos, con compromisos por US$3.85 millones y aportes de US$1.71 millones de las empresas; en 2023 aprobó 23 proyectos que unían al sector productivo y la academia, igualando el récord de 2022.",
  },
  "chl-franquicia-sence": {
    title: "Franquicia Tributaria SENCE y su erosión",
    claim:
      "La franquicia tributaria de capacitación del SENCE de Chile, vigente desde 1976, financió 999,732 participaciones en capacitación y 653,939 participantes únicos en 2024, frente a 1,355,430 participaciones y 740,152 participantes únicos en 2016, mientras el gasto público en ella casi se duplicó en pesos nominales; en julio de 2026 una comisión del Senado acordó reducir su tope de 1% a 0.7% de la planilla de remuneraciones.",
  },
  "chl-concesiones": {
    title: "Sistema de Concesiones de Obras Públicas",
    claim:
      "El Ministerio de Obras Públicas de Chile ha provisto infraestructura pública mediante contratos de concesión privada desde 1993; en abril de 2026 su Dirección General de Concesiones informó 81 contratos vigentes con US$29.615 mil millones de inversión comprometida en autopistas, aeropuertos, hospitales, cárceles, un embalse, una planta desalinizadora y un teleférico.",
  },
  "per-gasoducto-sur": {
    title: "Gasoducto Sur Peruano, una concesión de gasoducto terminada",
    claim:
      "La concesión del Gasoducto Sur Peruano, firmada en julio de 2014 para un gasoducto de US$7.328 mil millones que debía entrar en operación comercial en marzo de 2019, registraba un avance general de 37.32% frente al 76.49% programado en diciembre de 2016, según el regulador de energía Osinergmin, y el Ministerio de Energía y Minas dio por terminada la concesión en enero de 2017 luego de que el consorcio no lograra el cierre financiero.",
  },
  "per-refineria-talara": {
    title: "Modernización de la refinería de Talara, entregada con retraso y sobrecostos",
    claim:
      "El Proyecto de Modernización de la Refinería Talara de Petroperú, iniciado con el contrato EPC de mayo de 2014, alcanzó su plena operación en 2023, luego de que la Contraloría de Perú constatara que su inversión estimada había aumentado de US$1.3 mil millones a más de US$5 mil millones a octubre de 2020, alrededor de 400%, y un retraso acumulado de más de tres años en el cronograma de ejecución del proyecto, atribuido a la contratación de las unidades auxiliares.",
  },
  "pan-vale-digital": {
    title: "Plan Panamá Solidario, Vale Digital",
    claim:
      "El gobierno de Panamá creó el vale digital del Plan Panamá Solidario durante los cierres por la COVID-19 en 2020, y llegó a 90,492 personas en su primer mes (abril de 2020), a 458,662 en mayo y a un máximo de 949,343 en noviembre de 2020; luego lo redujo gradualmente a medida que se recuperaba el empleo y lo terminó en 2023.",
  },
  "pan-inadeh": {
    title: "INADEH, formación profesional nacional",
    claim:
      "El instituto nacional de formación profesional de Panamá, el INADEH, reestructurado por el Decreto Ley 8 de 2006, registró 156,032 egresados de cursos en 2021, frente a 90,107 en 2019 y 38,628 en 2020, el año de la pandemia.",
  },
  "bol-mutun-steel": {
    title: "Complejo siderúrgico El Mutún, inaugurado en 2025 y que según se constató nunca operó",
    claim:
      "La Empresa Siderúrgica del Mutún de Bolivia, cuyo contrato llave en mano con Sinosteel se adjudicó en 2016 y cuyo complejo inauguró el Presidente en febrero de 2025, informó en su rendición pública de cuentas inicial de 2026 que el proyecto tenía un avance físico del 92% frente a una ejecución financiera acumulada del 100%, que su propia supervisión constató que el complejo nunca había entrado en operación y que en enero de 2026 había notificado su intención de rescindir el contrato.",
  },
  "bol-yo-si-puedo": {
    title: "Yo, sí puedo, campaña nacional de alfabetización y programa de posalfabetización",
    claim:
      "El Ministerio de Educación de Bolivia informa que sus programas nacionales de alfabetización, ejecutados como 'Yo, sí puedo' de 2006 a 2008 y continuados como programa de posalfabetización desde 2009, enseñaron a leer y escribir a más de un millón de personas mayores de 15 años entre 2006 y 2017, el 74% de ellas mujeres.",
  },
  "ecu-coca-codo-sinclair": {
    title: "Central hidroeléctrica Coca Codo Sinclair",
    claim:
      "Ecuador contrató la central Coca Codo Sinclair de 1,500 MW en octubre de 2009 por USD 1,979.7 millones con un plazo de 60 meses que vencía el 5 de octubre de 2014; la central entró en operación comercial en noviembre de 2016, y un informe de fiscalización de la Asamblea Nacional determinó que a agosto de 2021 había costado USD 2,712.5 millones, alrededor de 37 por ciento por encima del precio contractual, sin incluir una línea de transmisión de USD 599 millones.",
  },
  "pry-puente-heroes-del-chaco": {
    title: "Puente Héroes del Chaco, de Asunción a Chaco'i",
    claim:
      "El Ministerio de Obras Públicas y Comunicaciones de Paraguay comenzó a construir el puente atirantado Héroes del Chaco, la primera conexión vial entre Asunción y el Chaco, en 2020 con un plazo estimado de 36 meses; a fines de 2023 informó un avance físico del 90% frente al 100% planificado, y el puente se inauguró el 3 de marzo de 2024 y quedó registrado como concluido con recepción provisoria en el balance de 2024.",
  },
  "arg-atucha-ii": {
    title: "Central nuclear Atucha II y sus 33 años de construcción",
    claim:
      "La operadora nuclear estatal de Argentina conectó Atucha II a la red en junio de 2014, casi 33 años después del inicio de su construcción en julio de 1981, y comenzó la operación comercial en mayo de 2016, tras una obra paralizada en 1994 y reanudada en 2006.",
  },
  "arg-sinarame": {
    title: "SINARAME, el sistema nacional de radares meteorológicos",
    claim:
      "La Subsecretaría de Recursos Hídricos de la Nación contrató en 2011 a la empresa tecnológica estatal INVAP para construir radares meteorológicos argentinos, y a diciembre de 2024 la red operaba 14 radares que alimentaban un centro de operaciones del Servicio Meteorológico Nacional, luego de que en 2023 11 de ellos, junto con tres radares del INTA, cubrieran el 40 por ciento del territorio.",
  },
  "nic-ccrif": {
    title: "Seguro contra riesgos catastróficos a través del CCRIF",
    claim:
      "El Ministerio de Hacienda y Crédito Público de Nicaragua se incorporó al fondo regional de seguros contra catástrofes CCRIF en 2015, renovó su póliza cada año al menos hasta 2021, aumentó su cobertura contra ciclones antes de la temporada de 2020 y recibió cinco pagos por un total de US$32.25 millones, incluidos US$30.6 millones tras los huracanes Eta e Iota.",
  },
  "col-sena-complementaria": {
    title: "Formación complementaria del SENA",
    claim:
      "El Servicio Nacional de Aprendizaje de Colombia, creado por decreto en 1957, registró 5,469,951 aprendices en cursos cortos de formación complementaria en 2023 (7,035,749 cupos), y certificó 3,661,218 culminaciones en esa línea ese mismo año.",
  },
  "cri-ina": {
    title: "Formación profesional nacional del INA y su contracción",
    claim:
      "El Instituto Nacional de Aprendizaje (INA) de Costa Rica registró 204,773 matrículas en capacitación en 2024, frente a 313,276 en 2015, el punto más alto de su meseta de 2010 a 2019, una caída de alrededor de 35 por ciento que la recuperación de 2020 a 2024 no revirtió.",
  },
  "mex-fonden": {
    title: "FONDEN, el Fondo de Desastres Naturales, y su eliminación",
    claim:
      "El gobierno federal de México operó el FONDEN desde 1999 como un fondo nacional previamente constituido para la reconstrucción tras desastres, le asignó un monto récord de US$833 millones en 2011 y lo aseguró con bonos catastróficos, y extinguió el fideicomiso del FONDEN mediante el decreto del 6 de noviembre de 2020, con lo que el gasto en desastres pasó a partidas presupuestarias ordinarias.",
  },
  "mex-olmeca-refinery": {
    title: "Refinería Olmeca en Dos Bocas",
    claim:
      "Pemex construyó la refinería Olmeca en Dos Bocas, autorizada en diciembre de 2018 y en plena operación desde febrero de 2025, con un presupuesto autorizado de US$15,963.0 millones, 79 por ciento por encima de la estimación Clase IV de US$8,918.5 millones consignada cuando su consejo de administración autorizó la fase FEL II en julio de 2020.",
  },
  "chl-comision-futuro": {
    title: "Comisión de Desafíos del Futuro, Ciencia, Tecnología e Innovación del Senado",
    claim:
      "El Senado de Chile creó la Comisión de Desafíos del Futuro, Ciencia, Tecnología e Innovación en abril de 2012, inspirada en el Comité para el Futuro de Finlandia, con la Academia Chilena de Ciencias, galardonados con Premios Nacionales y rectores de universidades como miembros permanentes; a julio de 2024 más de 700 científicos habían trabajado en más de 20 de sus mesas de expertos.",
  },
  "mex-inea": {
    title: "Educación básica para adultos del INEA",
    claim:
      "El Instituto Nacional para la Educación de los Adultos de México certificó a 651,473 jóvenes y adultos por haber concluido un nivel de alfabetización, primaria o secundaria en 2024, con 352,600 educandos en sus servicios al cierre del año.",
  },
  "chl-corfo-consorcios": {
    title: "Programas y Consorcios Tecnológicos de CORFO",
    claim:
      "La agencia de fomento chilena CORFO tenía 49 programas y consorcios tecnológicos en ejecución durante 2024, 38 programas tecnológicos y 11 consorcios tecnológicos, en los que los consorcios reúnen a empresas con universidades y centros tecnológicos en carteras plurianuales de I+D, luego de adjudicar seis nuevos consorcios en 2023 con 1,500 millones de pesos de cofinanciamiento cada uno.",
  },
  "gtm-chixoy": {
    title: "Proyecto hidroeléctrico Chixoy, con sobrecostos y retrasos",
    claim:
      "El Instituto Nacional de Electrificación (INDE) de Guatemala construyó el proyecto hidroeléctrico Chixoy, de 300 MW, en virtud de contratos firmados en 1977 y 1978; tras el colapso del revestimiento del túnel de conducción a finales de 1983, entró en operación comercial en noviembre de 1985, 41 meses más tarde de lo previsto originalmente, con un costo final de US$823.1 millones sin incluir cargos financieros, frente a una estimación de evaluación de US$372.7 millones, un aumento de 120 por ciento.",
  },
  "per-eba": {
    title: "Educación Básica Alternativa (EBA) y su erosión",
    claim:
      "La Educación Básica Alternativa de Perú, la modalidad de educación básica de segunda oportunidad para jóvenes y adultos, matriculó a 226,500 estudiantes en 2016, el año más alto del cuadro de 2014 a 2023, y a 190,700 en 2023, según el Compendio Estadístico 2024 del INEI, que cita el censo escolar del Ministerio de Educación.",
  },
  "hnd-infop": {
    title: "Instituto Nacional de Formación Profesional (INFOP)",
    claim:
      "El Instituto Nacional de Formación Profesional (INFOP) de Honduras capacitó o certificó a 326,161 personas en 2024 en seis programas y cerca de 12,552 cursos, cifras que el Tribunal Superior de Cuentas verificó con los informes de inicio y cierre de los instructores.",
  },
  "pry-educacion-permanente": {
    title: "Educación Permanente para personas jóvenes y adultas (MEC)",
    claim:
      "El Ministerio de Educación y Ciencias de Paraguay matriculó a 94,436 personas jóvenes y adultas en sus cuatro programas formales y no formales de Educación Permanente en 2025, según la evaluación presupuestaria de ese año del Ministerio de Economía y Finanzas.",
  },
  "cri-otto-reconstruction": {
    title: "Obras prioritarias de reconstrucción tras el huracán Otto",
    claim:
      "En los 17 meses hasta septiembre de 2018, el Instituto Costarricense de Electricidad, en virtud de un convenio con la Comisión Nacional de Prevención de Riesgos y Atención de Emergencias (CNE), concluyó 64 de las 65 obras prioritarias de reconstrucción tras el huracán Otto de noviembre de 2016, con la reconstrucción de 20 puentes y 211 km de caminos rurales por ₡18,500 millones.",
  },
  "gtm-cat-ddo": {
    title: "Crédito contingente ante desastres con opción de desembolso diferido (Cat DDO)",
    claim:
      "El 21 de abril de 2020, cinco días después de que entrara en vigor su segundo préstamo del Banco Mundial para la gestión del riesgo de desastres con opción de desembolso diferido ante catástrofes, el gobierno de Guatemala decidió retirar la totalidad de los US$200 millones para enfrentar el choque fiscal de la COVID-19, y el préstamo se desembolsó por completo. Un primer crédito de este tipo, por US$85 millones y aprobado en 2009, se había utilizado en 2010 tras la erupción del Pacaya y la tormenta tropical Agatha.",
  },
  "per-covid-vaccination": {
    title: "Campaña nacional de vacunación contra la COVID-19",
    claim:
      "Desde su primera dosis, el 9 de febrero de 2021, hasta fines de 2023, la campaña nacional de vacunación contra la COVID-19 de Perú administró 91.3 millones de dosis y completó el esquema primario de 28.7 millones de personas, 87 por cada 100 habitantes, con 22.2 millones que recibieron refuerzo.",
  },
  "pry-sen-2019-floods": {
    title: "Respuesta de la Secretaría de Emergencia Nacional a las inundaciones de 2019",
    claim:
      "Al 29 de mayo de 2019, la Secretaría de Emergencia Nacional de Paraguay había asistido a 62,521 de las 65,000 familias afectadas por las inundaciones repentinas de marzo a mayo de 2019 en 14 departamentos, con la entrega de 1.5 millones de kg de alimentos, 150,000 chapas para techo y 110,000 placas de madera terciada.",
  },
  "slv-covid-vaccination": {
    title: "Campaña nacional de vacunación contra la COVID-19",
    claim:
      "Desde la primera dosis, aplicada el 17 de febrero de 2021, hasta finales de 2023, la campaña nacional de vacunación contra la COVID-19 de El Salvador administró 11.5 millones de dosis y completó el esquema primario de 4.4 millones de personas, 68 de cada 100 habitantes.",
  },
  "ury-subsidio-parcial": {
    title: "Subsidio por desempleo parcial y flexible, 2020-2021",
    claim:
      "El Ministerio de Trabajo y Seguridad Social de Uruguay creó por resolución las modalidades de subsidio por desempleo parcial y flexible tras la emergencia sanitaria del 13 de marzo de 2020, y el Banco de Previsión Social (BPS) pagó a 12,773 beneficiarios en esas modalidades en abril de 2020, mientras que el total de beneficiarios del subsidio por desempleo pasó de 45,937 en febrero a un récord de 185,769 en mayo.",
  },
  "chl-ife": {
    title: "Ingreso Familiar de Emergencia, la transferencia a hogares por la COVID-19",
    claim:
      "El Congreso de Chile creó el Ingreso Familiar de Emergencia mediante la Ley 21.230, publicada el 16 de mayo de 2020, y el Ministerio de Desarrollo Social y Familia realizó pagos a 3,419,351 hogares en 2020 y a 8,374,718 hogares en 2021, antes de que el programa terminara en 2021.",
  },
  "hnd-cct-shock-response": {
    title: "Respuesta a choques con transferencias monetarias condicionadas y su suspensión después de 2022",
    claim:
      "Honduras amplió su programa nacional de transferencias monetarias condicionadas durante la COVID-19 y los huracanes Eta e Iota, de 1,153,069 beneficiarios en 2019 a 1,528,030 en 2020, y pagó complementos de emergencia a 24,891 hogares fuera del padrón a finales de 2020, pero tras la reorganización del sector de protección social en 2022 los pagos se interrumpieron, los pagos rurales se reanudaron recién en diciembre de 2022 y los urbanos recién en agosto de 2025, después de una suspensión de tres años.",
  },
  "bol-qr-bcb": {
    title: "Pagos inmediatos con QR interoperable, construidos por los bancos y el Banco Central de Bolivia",
    claim:
      "Los bancos de Bolivia ofrecieron primero pagos con QR bajo su propio estándar SIMPLE, y luego el Banco Central de Bolivia hizo interoperables las transferencias con QR entre bancos, cooperativas, entidades financieras de vivienda e instituciones financieras de desarrollo con un estándar universal compatible con los códigos de los bancos, canales electrónicos obligatorios y transferencias gratuitas; los pagos inmediatos con QR pasaron de 6 millones de operaciones en 2021 a 892 millones en 2025, el 86 por ciento de las órdenes electrónicas de transferencia de fondos de ese año.",
  },
  "dom-familia-feliz": {
    title: "Plan Nacional de Viviendas Familia Feliz y la congelación de nuevos ingresos",
    claim:
      "Hacia mayo de 2024, el plan Familia Feliz del gobierno dominicano, en el que desarrolladores privados construyen viviendas de bajo costo y el Estado otorga subsidios para el pago inicial, los impuestos y la tasa hipotecaria, había construido 3,979 viviendas y asignado RD$1,108 millones en subsidios.",
  },
  "ury-plan-relocalizaciones": {
    title: "Plan Nacional de Relocalizaciones, traslado de hogares fuera de terrenos inundables",
    claim:
      "La Dirección Nacional de Vivienda de Uruguay relocalizó 2,618 hogares de terrenos inundables o contaminados entre 2015 y 2020 en el marco del Plan Nacional de Relocalizaciones y de convenios relacionados con los gobiernos departamentales, frente a una meta de 3,500 a 6,000 hogares para 2025.",
  },
  "bol-covid-vaccination": {
    title: "Campaña de vacunación contra la COVID-19",
    claim:
      "Las autoridades sanitarias de Bolivia informaron a la OMS que 7,505,389 personas, 64 por cada 100 habitantes, habían recibido al menos una dosis de vacuna contra la COVID-19 al 29 de diciembre de 2023, a partir de una primera dosis aplicada el 30 de enero de 2021, y que 6,307,628 (54 por cada 100) habían completado el esquema primario.",
  },
}
