/** Stable identifiers for non-World-Bank source releases used by adapters. */
export const JOINT_EVS_WVS_PUBLISHER = 'Joint EVS/WVS'

/** Official weighted results by country for Joint EVS/WVS v5.0.0. */
export const JOINT_EVS_WVS_RESULTS_URL = 'https://access.gesis.org/dbk/69549'

/** The release period represented by the v5.0.0 results table. */
export const JOINT_EVS_WVS_RELEASE_YEAR = 2022

/** V-Dem's reproducible country-year release used for civil-society strength. */
export const VDEM_PUBLISHER = 'V-Dem'
export const VDEM_CY_CORE_V15_PAGE_URL =
  'https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-core-v15/'
export const VDEM_CY_CORE_V15_URL =
  'https://www.v-dem.net/media/datasets/V-Dem-CY-Core-v15_csv.zip'
export const VDEM_CY_CORE_V15_RELEASE = '15 (2025-03-04)'
export const VDEM_CY_CORE_V15_VARIABLE = 'v2x_cspart'
export const VDEM_CY_CORE_V15_YEAR = 2024

/**
 * UNCTADstat's merchandise concentration and diversification indices, used for
 * export diversification. The bulk URL is not versioned, so the pin is the
 * SHA-256 of the CSV inside the archive: a publisher refresh fails the fetch
 * until the new file is reviewed and re-pinned here. See D119.
 */
export const UNCTAD_PUBLISHER = 'UNCTAD'
export const UNCTAD_CONCENTRATION_DATASET = 'US.ConcentDiversIndices'
export const UNCTAD_CONCENTRATION_PAGE_URL =
  'https://unctadstat.unctad.org/datacentre/dataviewer/US.ConcentDiversIndices'
export const UNCTAD_CONCENTRATION_URL =
  'https://unctadstat-api.unctad.org/bulkdownload/US.ConcentDiversIndices/US_ConcentDiversIndices'
export const UNCTAD_CONCENTRATION_CSV = 'US_ConcentDiversIndices.csv'
/** The date stamped on the CSV inside the archive. */
export const UNCTAD_CONCENTRATION_RELEASE = '2026-06-24'
export const UNCTAD_CONCENTRATION_CSV_SHA256 =
  'f3d5bd01e4c7b2a090f4ccd97002c8e6359a675f19ad0794a009db7756f0f86e'
export const UNCTAD_CONCENTRATION_YEAR = 2025
/** UNCTADstat flow code for exports. Imports are `01`. */
export const UNCTAD_EXPORTS_FLOW = '02'
export const UNCTAD_LICENCE = 'CC BY 3.0 IGO'
