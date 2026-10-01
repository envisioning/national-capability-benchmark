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

/**
 * ILOSTAT unemployment by sex, age and duration (thousands), read through the
 * ILO SDMX API. The long-term share is derived from it, see D120. ILOSTAT is a
 * live database rather than a versioned release, so the dataflow version and
 * the retrieval date together identify what was read. CC BY 4.0.
 */
export const ILOSTAT_PUBLISHER = 'ILOSTAT'
export const ILOSTAT_LTU_DATAFLOW = 'DF_UNE_TUNE_SEX_AGE_DUR_NB'
export const ILOSTAT_LTU_DATAFLOW_VERSION = '1.0'
export const ILOSTAT_SDMX_DATA_URL = 'https://sdmx.ilo.org/rest/data'
/** The dataflow's own SDMX description, which names it and lists its dimensions. */
export const ILOSTAT_LTU_PAGE_URL =
  'https://sdmx.ilo.org/rest/dataflow/ILO/DF_UNE_TUNE_SEX_AGE_DUR_NB/1.0'
export const ILOSTAT_LTU_FROM_YEAR = 2010
/** Stable id of the adapter that derives and gates the long-term share. */
export const ILOSTAT_LTU_ADAPTER_ID = 'ilostat-une-tune-sex-age-dur-long-term-share'
