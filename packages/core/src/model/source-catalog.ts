/** Stable identifiers for non-World-Bank source releases used by adapters. */
export const JOINT_EVS_WVS_PUBLISHER = 'Joint EVS/WVS'

/** Official weighted results by country for Joint EVS/WVS v5.0.0. */
export const JOINT_EVS_WVS_RESULTS_URL = 'https://access.gesis.org/dbk/69549'

/** The release period represented by the v5.0.0 results table. */
export const JOINT_EVS_WVS_RELEASE_YEAR = 2022

/**
 * V-Dem's reproducible country-year release. The Full+Others archive is pinned
 * because the Core archive of the same release omits `v2cacamps`; both carry
 * identical `v2x_cspart` values for the benchmark countries. See D115.
 */
export const VDEM_PUBLISHER = 'V-Dem'
export const VDEM_CY_V15_PAGE_URL =
  'https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-fullothers-v15/'
export const VDEM_CY_V15_URL =
  'https://www.v-dem.net/media/datasets/V-Dem-CY-FullOthers-v15_csv.zip'
/** The CSV member inside the pinned archive. */
export const VDEM_CY_V15_CSV = 'V-Dem-CY-Full+Others-v15.csv'
export const VDEM_CY_V15_DATASET = 'Country-Year Full+Others'
export const VDEM_CY_V15_RELEASE = '15 (2025-03-04)'
export const VDEM_CY_V15_YEAR = 2024

/**
 * The V-Dem variables the adapter reads, each with the indicator it fills and
 * the scale the publisher states. A value outside the scale is dropped, never
 * clamped.
 */
export const VDEM_CY_V15_VARIABLES = [
  {
    variable: 'v2x_cspart',
    indicatorId: 'civil_society_strength',
    min: 0,
    max: 1,
    scaleNote: 'expert-coded index on a 0-1 scale',
  },
  {
    variable: 'v2cacamps_osp',
    indicatorId: 'political_polarization',
    min: 0,
    max: 4,
    scaleNote: 'expert-coded polarization on the original 0-4 response scale, 0 friendly and 4 hostile',
  },
] as const
