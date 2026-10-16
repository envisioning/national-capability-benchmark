import { EVIDENCE_ES_ES } from './evidence-es-es.js'
import { ES } from './es.js'
import { withOverride } from './override.js'

/**
 * Peninsular Spanish, read through the Latin American base.
 *
 * Spain's layer reads `es.ts` with this file laid over it. It holds the
 * number formatting (a decimal comma), the layer country and only the
 * strings a reader in Spain would write differently: "renta" where the base
 * says "ingreso" for a country's income, "paro" and "población activa" for
 * unemployment and the labour force, "formación" for training, "media" for
 * an average, "coste", "valor añadido", "financiación" and "fiable". Every
 * other string, the dimension names and the map addresses included, is the
 * base's, so the two readings cannot drift on a term the project fixed.
 *
 * The base is Latin American because the larger speaker community sets it.
 * This file is an orthography and a set of word choices, not the standard
 * the base is measured against. The copy was reviewed by Claude, not by a
 * native speaker. See D134, D156 and the Spanish layers decision.
 */
export const ES_ES = withOverride(ES, {
  lang: 'es-ES',
  base: 'es',
  htmlLang: 'es-ES',
  numberLocale: 'es-ES',
  layerCountries: ['ESP'],
  countries: {
    ROU: 'Rumanía',
  },
  indicators: {
    firm_training_incidence: 'Empresas que dan formación reglada',
    labor_force_participation: 'Tasa de actividad',
    unemployment_rate: 'Tasa de paro',
    long_term_unemployment_share: 'Paro de larga duración',
    manufacturing_value_added: 'Valor añadido manufacturero',
    income_inequality: 'Desigualdad de la renta',
  },
  indicatorDefinitions: {
    firm_training_incidence: 'Proporción de empresas que dan formación reglada a su plantilla fija.',
    labor_force_participation: 'Proporción de la población en edad de trabajar que es activa.',
    unemployment_rate: 'Parados como proporción de la población activa, estimación modelizada de la OIT.',
    long_term_unemployment_share: 'Personas en paro durante 12 meses o más, como proporción del total de parados.',
    manufacturing_value_added: 'Valor añadido manufacturero como proporción del PIB.',
    income_inequality: 'Índice de Gini de la renta disponible.',
    basic_research_share:
      'Proyectos de investigación nuevos con financiación pública competitiva y una duración de cinco años o más, como proporción de todos los proyectos con financiación pública competitiva concedidos en el año.',
    adult_learning_participation:
      'Proporción de adultos en educación o formación, reglada o no, en los últimos 12 meses.',
    large_project_delivery:
      'Desempeño en coste y plazo de los grandes proyectos públicos de infraestructura.',
  },
  units: {
    '% of labour force': '% de la población activa',
    '% of unemployed': '% de los parados',
    '% overrun': '% de sobrecoste',
    'mean 1-10': 'media de 1 a 10',
  },
  agenda: {
    conditionsIntro:
      'Las condiciones describen lo que un país tiene para trabajar: infraestructura, acceso, dinero, personas, matrícula y la propia renta. Cada una aparece junto a una capacidad y no entra en la puntuación, en la solidez ni en la tendencia. Leídas frente a la puntuación, muestran si lo que el país tiene se convierte en lo que hace. La posición cuenta los países con valor, del mejor al peor.',
  },
  institutions: {
    relations: { funds: { outgoing: 'financia', incoming: 'recibe financiación de' } },
    families: {
      funds: { label: 'Financiación', empty: 'No hay relaciones de financiación registradas.' },
    },
    systems: { finance_investment: 'Financiación e inversión' },
  },
  capabilityMap: {
    metaDescription:
      'Una lectura de {dimension} para {countryTopic}: la puntuación y la solidez de la evidencia, los indicadores en que se apoya, las condiciones a su lado y la posición entre los países de renta más parecida. Calculada a partir de los datos publicados.',
    intro:
      'Esta página lee una capacidad a partir de los datos publicados y se recalcula en cada versión. Separa lo que {countryTopic} hace, que forma la puntuación, de lo que el país tiene, que queda al lado de la puntuación, y sitúa al país entre los {count} países de renta más parecida. El texto describe los datos y no recomienda políticas.',
    scoreIntro:
      'La puntuación de {dimension} es la media, con pesos iguales, de las posiciones de {n} indicadores en una escala de 0 a 100 que todos los países definen juntos. En cada indicador la escala va en el sentido de la capacidad: donde un valor más alto indica menos capacidad, como los días para abrir una empresa o la tasa de homicidios, una posición alta en la escala corresponde a un valor bajo. La solidez de la evidencia mide lo que hay detrás de la puntuación y aparece a su lado, como un segundo número.',
    conditionsIntro:
      'Junto a cada condición, dos valores de r leen todos los países a la vez, uno frente a la renta y otro frente a la puntuación de la capacidad. Cuando el r con la renta es mucho mayor que el r con la puntuación, contar con la condición se asocia más con una renta alta que con la capacidad medida.',
    conditionIncome: 'r con la renta: {r} ({n} países)',
    peerRule:
      'Los pares son los {count} países de renta más parecida. La renta es el PIB per cápita en paridad de poder adquisitivo, en dólares internacionales constantes, del último año publicado por el Banco Mundial, y la distancia se mide en escala logarítmica, donde la mitad y el doble quedan a la misma distancia. Ningún país se elige a mano, y el conjunto cambia cuando cambian los datos.',
    peerRange:
      'En esta versión, la renta de los pares va de {min} a {max}, y {countryTopic} tiene {own} ({year}).',
    fieldAria: '{count} países de renta similar en una escala de 0 a 100 en {dimension}.',
    noPeers:
      'Esta versión de los datos no publica la renta de los países, por eso la página no forma el conjunto de pares.',
    limitPeers:
      'Los pares comparten la renta y nada más. Tamaño, estructura productiva, región y régimen político quedan fuera de la regla, y un conjunto de {count} países puede cambiar con cualquier revisión del PIB.',
    rowCaveats: {
      long_term_unemployment_share: {
        text: 'El paro de larga duración procede de ILOSTAT, tras un filtro de plausibilidad aplicado por igual a todos los países. Algunos países con puntuación usan una encuesta de hogares en lugar de una encuesta de población activa. Una proporción alta tiene dos lecturas: una reasignación lenta donde el paro también es alto, o un grupo residual pequeño donde es bajo.',
        decisions: ['D120'],
      },
    },
    rowFacts: {
      household_survey_unreliable:
        'Para {countryTopic}, la serie de ILOSTAT procede de una encuesta de hogares, y la OIT marca el valor como poco fiable.',
      urban_survey_unreliable:
        'Para {countryTopic}, la serie de ILOSTAT procede de la {survey}, que cubre solo aglomeraciones urbanas, y la OIT marca el valor como poco fiable.',
      flagged_unreliable: 'Para {countryTopic}, la OIT marca el valor de ILOSTAT como poco fiable.',
    },
    index: {
      metaDescription:
        'Una lectura de cada capacidad para {countryTopic}: la puntuación, la solidez de la evidencia y la posición frente a la mediana de los países de renta más parecida. Calculada a partir de los datos publicados.',
      intro:
        'Esta página lee {n} capacidades para {countryTopic} a partir de los datos publicados y se recalcula en cada versión. Cada fila trae la puntuación y la solidez de la evidencia como dos números y compara la puntuación con la mediana de los {count} países de renta más parecida. Las filas siguen el orden del modelo, y cada una abre el mapa de esa capacidad.',
    },
    checks: {
      intro:
        'Cada número se publica junto a la puntuación y queda fuera de ella: no entra en la escala, la media, el recuento de indicadores ni la solidez de la evidencia.',
      byId: {
        voter_turnout: {
          name: 'Participación electoral',
          definition:
            'Proporción de los electores inscritos que votaron en las últimas elecciones nacionales hasta 2025, según los resultados oficiales que V-Dem codifica a partir de IDEA, la UIP e IFES.',
          unit: '% de los electores inscritos',
          reason:
            'No entra en la puntuación por tres razones que el número no separa: lee el canal democrático, el voto obligatorio la convierte en una lectura de la ley, y las autocracias también logran una participación alta, que es movilización y no participación.',
          decision: 'D129',
        },
        institutional_trust: {
          name: 'Confianza en los tribunales',
          definition:
            'Proporción de las personas encuestadas que dicen tener mucha confianza en el sistema de justicia y los tribunales, entre cuatro respuestas (mucha, bastante, poca y ninguna), en la ronda 2017 a 2022 de la encuesta conjunta EVS/WVS.',
          unit: '% que responde mucha',
          reason:
            'No entra en la puntuación porque la respuesta lee dos cosas que el número no separa. Donde los tribunales son independientes, la confianza en ellos juzga cómo funcionan; donde responden al Estado, también es deferencia, y decir otra cosa a un encuestador tiene un coste. En esta comparación, las autocracias registran valores más altos que las democracias.',
          decision: 'D132',
        },
      },
    },
  },
  evidence: EVIDENCE_ES_ES,
})
