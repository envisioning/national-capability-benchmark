/** Stable identifiers for non-World-Bank source releases used by adapters. */
export const JOINT_EVS_WVS_PUBLISHER = 'Joint EVS/WVS'

/** Official weighted results by country for Joint EVS/WVS v5.0.0. */
export const JOINT_EVS_WVS_RESULTS_URL = 'https://access.gesis.org/dbk/69549'

/** The release period represented by the v5.0.0 results table. */
export const JOINT_EVS_WVS_RELEASE_YEAR = 2022

/**
 * V-Dem's reproducible country-year release. The Full+Others archive is pinned
 * because the Core archive of the same release omits `v2cacamps`, which the
 * Shared Purpose polarization check reads; both archives carry identical
 * `v2x_cspart` values for the benchmark countries. See D121.
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
