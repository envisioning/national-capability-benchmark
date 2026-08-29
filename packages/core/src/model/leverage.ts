/** The eleven provisional resources through which capability may be amplified. */
export const LEVERAGE_DIMENSIONS = [
  'ai_access',
  'compute',
  'data_availability',
  'connectivity',
  'energy',
  'capital_availability',
  'robotics',
  'scientific_capacity',
  'advanced_manufacturing',
  'technical_talent',
  'institutional_deployability',
] as const

export type LeverageDimension = (typeof LEVERAGE_DIMENSIONS)[number]

export const LEVERAGE_DIMENSION_LABELS: Record<LeverageDimension, string> = {
  ai_access: 'AI access',
  compute: 'Compute',
  data_availability: 'Data availability',
  connectivity: 'Connectivity',
  energy: 'Energy',
  capital_availability: 'Capital availability',
  robotics: 'Robotics',
  scientific_capacity: 'Scientific capacity',
  advanced_manufacturing: 'Advanced manufacturing',
  technical_talent: 'Technical talent',
  institutional_deployability: 'Institutional deployability',
}
