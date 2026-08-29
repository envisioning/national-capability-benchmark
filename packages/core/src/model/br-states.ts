/**
 * IBGE's 27 federative units, keyed by the numeric codes returned by SIDRA
 * table 7435. The ISO 3166-2 suffix is stable and is what the reader uses in
 * the corroboration fixture.
 */
export const BR_STATES = [
  { code: '11', iso: 'RO', name: 'Rondônia' },
  { code: '12', iso: 'AC', name: 'Acre' },
  { code: '13', iso: 'AM', name: 'Amazonas' },
  { code: '14', iso: 'RR', name: 'Roraima' },
  { code: '15', iso: 'PA', name: 'Pará' },
  { code: '16', iso: 'AP', name: 'Amapá' },
  { code: '17', iso: 'TO', name: 'Tocantins' },
  { code: '21', iso: 'MA', name: 'Maranhão' },
  { code: '22', iso: 'PI', name: 'Piauí' },
  { code: '23', iso: 'CE', name: 'Ceará' },
  { code: '24', iso: 'RN', name: 'Rio Grande do Norte' },
  { code: '25', iso: 'PB', name: 'Paraíba' },
  { code: '26', iso: 'PE', name: 'Pernambuco' },
  { code: '27', iso: 'AL', name: 'Alagoas' },
  { code: '28', iso: 'SE', name: 'Sergipe' },
  { code: '29', iso: 'BA', name: 'Bahia' },
  { code: '31', iso: 'MG', name: 'Minas Gerais' },
  { code: '32', iso: 'ES', name: 'Espírito Santo' },
  { code: '33', iso: 'RJ', name: 'Rio de Janeiro' },
  { code: '35', iso: 'SP', name: 'São Paulo' },
  { code: '41', iso: 'PR', name: 'Paraná' },
  { code: '42', iso: 'SC', name: 'Santa Catarina' },
  { code: '43', iso: 'RS', name: 'Rio Grande do Sul' },
  { code: '50', iso: 'MS', name: 'Mato Grosso do Sul' },
  { code: '51', iso: 'MT', name: 'Mato Grosso' },
  { code: '52', iso: 'GO', name: 'Goiás' },
  { code: '53', iso: 'DF', name: 'Distrito Federal' },
] as const
