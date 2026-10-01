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
