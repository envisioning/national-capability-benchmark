/**
 * IBGE's 27 federative units, keyed by the numeric codes returned by SIDRA
 * table 7435. The ISO 3166-2 suffix is stable and is what the reader uses in
 * the subnational output. Population estimates are the 1 July 2024 IBGE
 * federative-unit estimates and are metadata for future aggregate checks, not
 * a score weight used by the current independent Gini fixture.
 */
import { BR_STATE_POPULATION_SOURCE } from './sources.js'

export const BR_STATES = [
  { code: '11', iso: 'RO', name: 'Rondônia', population: 1746227 },
  { code: '12', iso: 'AC', name: 'Acre', population: 880631 },
  { code: '13', iso: 'AM', name: 'Amazonas', population: 4281209 },
  { code: '14', iso: 'RR', name: 'Roraima', population: 716793 },
  { code: '15', iso: 'PA', name: 'Pará', population: 8664306 },
  { code: '16', iso: 'AP', name: 'Amapá', population: 802837 },
  { code: '17', iso: 'TO', name: 'Tocantins', population: 1577342 },
  { code: '21', iso: 'MA', name: 'Maranhão', population: 7010960 },
  { code: '22', iso: 'PI', name: 'Piauí', population: 3375646 },
  { code: '23', iso: 'CE', name: 'Ceará', population: 9233656 },
  { code: '24', iso: 'RN', name: 'Rio Grande do Norte', population: 3446071 },
  { code: '25', iso: 'PB', name: 'Paraíba', population: 4145040 },
  { code: '26', iso: 'PE', name: 'Pernambuco', population: 9539029 },
  { code: '27', iso: 'AL', name: 'Alagoas', population: 3220104 },
  { code: '28', iso: 'SE', name: 'Sergipe', population: 2291077 },
  { code: '29', iso: 'BA', name: 'Bahia', population: 14850513 },
  { code: '31', iso: 'MG', name: 'Minas Gerais', population: 21322691 },
  { code: '32', iso: 'ES', name: 'Espírito Santo', population: 4102129 },
  { code: '33', iso: 'RJ', name: 'Rio de Janeiro', population: 17219679 },
  { code: '35', iso: 'SP', name: 'São Paulo', population: 45973194 },
  { code: '41', iso: 'PR', name: 'Paraná', population: 11824665 },
  { code: '42', iso: 'SC', name: 'Santa Catarina', population: 8058441 },
  { code: '43', iso: 'RS', name: 'Rio Grande do Sul', population: 11229915 },
  { code: '50', iso: 'MS', name: 'Mato Grosso do Sul', population: 2901895 },
  { code: '51', iso: 'MT', name: 'Mato Grosso', population: 3836399 },
  { code: '52', iso: 'GO', name: 'Goiás', population: 7350483 },
  { code: '53', iso: 'DF', name: 'Distrito Federal', population: 2982818 },
].map((state) => ({
  ...state,
  populationYear: BR_STATE_POPULATION_SOURCE.year,
  populationSourceUrl: BR_STATE_POPULATION_SOURCE.url,
}))
