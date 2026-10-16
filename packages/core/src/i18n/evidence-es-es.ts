/**
 * Spain's evidence records in Peninsular Spanish, read through the es-ES
 * override: decimal comma, and the words a reader in Spain uses. Same rules
 * as evidence-es.ts: the record stays English and sourced, the digits are
 * the record's, and a Spain record with no entry fails the test.
 */
export const EVIDENCE_ES_ES: Record<string, { title: string; claim: string }> = {
  "esp-clave": {
    title: "Cl@ve, identidad digital compartida",
    claim:
      "España creó Cl@ve como plataforma común del sector público para la identificación, la autenticación y la firma electrónica; la Agencia Tributaria informó de 20,867 millones de identificadores de contribuyentes registrados en Cl@ve Móvil a 31 de diciembre de 2024, de los cuales 12,323 millones correspondían a ciudadanos activos en la aplicación.",
  },
  "esp-kit-digital": {
    title: "Kit Digital, programa de digitalización de pymes",
    claim:
      "El programa Kit Digital de Red.es recurrió a ayudas públicas, representantes voluntarios y agentes digitalizadores privados para ayudar a las pequeñas empresas a adoptar software y servicios en línea; a 3 de agosto de 2026, el programa informó de 1.566.846 proyectos de transformación ejecutados por 10.727 agentes, el 96 por ciento de ellos pymes del sector TIC.",
  },
  "esp-ave-network": {
    title: "Red ferroviaria de alta velocidad AVE",
    claim:
      "España amplió la alta velocidad ferroviaria desde la primera línea Madrid-Sevilla, en 1992, hasta más de 4000 kilómetros de vía de alta velocidad en 2024; el Ministerio de Transportes informó de que el servicio llegaba al 70 por ciento de la población.",
  },
  "esp-la-palma": {
    title: "Recuperación y vigilancia tras la erupción volcánica de La Palma",
    claim:
      "Tras el inicio de la erupción de Cumbre Vieja el 19 de septiembre de 2021, España coordinó una comisión de reconstrucción entre el Estado, Canarias y el Cabildo insular; en febrero de 2024, el Estado informó de 929 millones de euros movilizados y 650 dispositivos de medición de CO2 instalados, lo que permitió a más de 220 familias regresar con seguridad a sus viviendas en las zonas afectadas.",
  },
  "esp-castor": {
    title: "Almacenamiento subterráneo de gas Castor y su cierre",
    claim:
      "España extinguió la concesión del almacenamiento subterráneo de gas Castor en octubre de 2014, después de que varios episodios sísmicos paralizaran su funcionamiento; el Estado traspasó la administración a Enagás y el decreto reconoció una indemnización de 1350,729 millones de euros a la antigua concesionaria, cuya recuperación se estructuró a 30 años.",
  },
  "esp-sandbox-financiero": {
    title: "Sandbox financiero (Ley 7/2020) y la caída de solicitudes",
    claim:
      "El Tesoro Público gestiona desde 2021 un espacio controlado de pruebas para el sistema financiero al amparo de la Ley 7/2020. Su primera cohorte recibió 66 solicitudes, 12 de las cuales pasaron a la fase de pruebas. En 2025 la demanda había caído a dos solicitudes entre la novena y la décima cohorte, una de las cuales obtuvo una evaluación favorable, y el Gobierno aprobó un anteproyecto de ley (Anteproyecto, 17 de diciembre de 2024) que sustituye las cohortes cerradas por la admisión continua durante todo el año y reduce la evaluación previa a 45 días hábiles.",
  },
  "esp-formacion-programada": {
    title: "Formación programada por las empresas (crédito de formación de FUNDAE)",
    claim:
      "España financia la formación organizada por las empresas mediante bonificaciones en las cotizaciones a la Seguridad Social por formación profesional, gestionadas por la fundación estatal FUNDAE. En 2024, 347.442 empresas formaron a 3.378.343 trabajadores, el 22,7 por ciento de los asalariados del sector privado, en 5.824.016 participaciones.",
  },
  "esp-doctorados-industriales": {
    title: "Doctorados Industriales (doctorados industriales de la Agencia Estatal de Investigación)",
    claim:
      "La Agencia Estatal de Investigación financia contratos de cuatro años para doctorandos empleados en empresas y otras entidades que elaboren una tesis sobre un proyecto de investigación industrial o de desarrollo experimental; en la convocatoria 2024-2, resuelta en octubre de 2025, concedió 65 ayudas por un importe de 7,6 millones de euros.",
  },
}
