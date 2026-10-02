/** Stable identifiers for non-World-Bank source releases used by adapters. */
export const JOINT_EVS_WVS_PUBLISHER = 'Joint EVS/WVS'

/** Official weighted results by country for Joint EVS/WVS v5.0.0. */
export const JOINT_EVS_WVS_RESULTS_URL = 'https://access.gesis.org/dbk/69549'

/** The file the results URL serves, as its Content-Disposition names it. */
export const JOINT_EVS_WVS_RESULTS_FILE = 'ZA7505_cdb_Tables.pdf'

/** The release period represented by the v5.0.0 results table. */
export const JOINT_EVS_WVS_RELEASE_YEAR = 2022

/**
 * V-Dem's reproducible country-year release. The Full+Others archive is pinned
 * because the Core archive of the same release omits `v2cacamps`, which the
 * Shared Purpose polarization check reads; both archives carry identical
 * `v2x_cspart` values for the benchmark countries. See D121.
 */
export const VDEM_PUBLISHER = 'V-Dem'
export const VDEM_CY_PAGE_URL =
  'https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-fullothers-v16/'
export const VDEM_CY_URL =
  'https://www.v-dem.net/media/datasets/V-Dem-CY-FullOthers-v16_csv.zip'
/** The CSV member inside the pinned archive. */
export const VDEM_CY_CSV = 'V-Dem-CY-Full+Others-v16.csv'
export const VDEM_CY_DATASET = 'Country-Year Full+Others'
/** Version and the date stamped on the CSV member inside the archive. */
export const VDEM_CY_RELEASE = '16 (2026-03-10)'
export const VDEM_CY_YEAR = 2025

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

/**
 * OpenAlex works, read through the REST API for research citation impact. See
 * D124. OpenAlex is a live database with no version parameter: citations,
 * percentiles and affiliation parsing are recomputed continuously, so a value
 * fetched today is not reproducible from the API later. The pin is the exact
 * request, the retrieval date and the counts it returned, all written into the
 * observation file. The data is CC0.
 */
export const OPENALEX_PUBLISHER = 'OpenAlex'
export const OPENALEX_WORKS_URL = 'https://api.openalex.org/works'
/** The documentation of the citation metrics the percentile flag comes from. */
export const OPENALEX_PAGE_URL = 'https://help.openalex.org/data/works/citations/'
/** The work-level flag the numerator counts. */
export const OPENALEX_TOP10_FIELD = 'citation_normalized_percentile.is_in_top_10_percent'
/** The pooled publication window, stamped with its last year. */
export const OPENALEX_WINDOW_FROM = 2019
export const OPENALEX_WINDOW_TO = 2021
/** Work types counted. Conference papers are excluded. */
export const OPENALEX_WORK_TYPES = ['article', 'review'] as const
/** Pinned explicitly so a change of the API default cannot move the counts. */
export const OPENALEX_CORPUS = 'core'
export const OPENALEX_LICENCE = 'CC0 1.0'
/** Stable id of the adapter that counts the top 10% share. */
export const OPENALEX_TOP10_ADAPTER_ID = 'openalex-top10-share-v1'

/**
 * GitHub Innovation Graph, read for new public repositories. See D145. The
 * publisher restates its CSVs in place every quarter and keeps old versions
 * only in git, so the pin is the commit: the adapter reads the file at that
 * SHA and `pnpm bench github fetch --commit latest` names the newest one.
 * Bump the SHA here, with a revision run, to move the release. CC0.
 */
export const GITHUB_IG_PUBLISHER = 'GitHub Innovation Graph'
export const GITHUB_IG_REPOSITORY = 'github/innovationgraph'
export const GITHUB_IG_PATH = 'data/repositories.csv'
/** "release q1 2026 data", committed 2026-07-07. */
export const GITHUB_IG_COMMIT = '054c7dbc527518fa2ecfd316efe2aa01f3986c39'
export const GITHUB_IG_LICENCE = 'CC0 1.0'
export const GITHUB_IG_HOME_URL = 'https://innovationgraph.github.com'
/** The pinned file as a reader opens it, which is what `/sources` prints. */
export const GITHUB_IG_PINNED_URL = `https://github.com/${GITHUB_IG_REPOSITORY}/blob/${GITHUB_IG_COMMIT}/${GITHUB_IG_PATH}`
/** Stable id of the adapter that differences the repository stock and gates it. */
export const GITHUB_IG_ADAPTER_ID = 'github-innovation-graph-new-repos-v1'

/**
 * ILOSTAT informal employment rate, SDG indicator 8.3.1, read through the same
 * SDMX endpoint as the long-term share. Published beside Adaptability as a
 * condition, never scored. See D150.
 */
export const ILOSTAT_INFORMAL_DATAFLOW = 'DF_SDG_0831_SEX_ECO_RT'
export const ILOSTAT_INFORMAL_DATAFLOW_VERSION = '1.0'
export const ILOSTAT_INFORMAL_PAGE_URL =
  'https://sdmx.ilo.org/rest/dataflow/ILO/DF_SDG_0831_SEX_ECO_RT/1.0'
export const ILOSTAT_INFORMAL_FROM_YEAR = 2010
/** Stable id of the adapter that reads the informal employment rate. */
export const ILOSTAT_INFORMAL_ADAPTER_ID = 'ilostat-sdg-0831-informal-employment-v1'

/**
 * Harvard Growth Lab, Atlas of Economic Complexity, international trade data
 * in HS 1992 at four digits, read for the new export products rate. See D149.
 * Dataverse versions are immutable and a file id belongs to one version, so
 * the pin is the version, the file id and the checksum Dataverse publishes; a
 * mismatch fails the fetch until the new release is reviewed and re-pinned
 * here. CC0.
 */
export const ATLAS_PUBLISHER = 'Harvard Growth Lab'
export const ATLAS_DATASET = 'Atlas of Economic Complexity, International Trade Data (HS, 92)'
export const ATLAS_DOI = 'doi:10.7910/DVN/T4CHWJ'
export const ATLAS_VERSION = '18.0'
/** The date Dataverse released the pinned version. */
export const ATLAS_RELEASED = '2026-04-22'
export const ATLAS_FILE = 'hs92_country_product_year_4.csv'
export const ATLAS_FILE_ID = 13685110
export const ATLAS_FILE_BYTES = 451_749_132
/** The checksum Dataverse publishes for the file. */
export const ATLAS_FILE_MD5 = '5d87b2ac45517bf4e0e50600140672e5'
export const ATLAS_FILE_SHA256 = '06c77ef4c9e3a3afe9aaac6d053e11209275d09eb91f82de7b2a54d37f9c25e2'
export const ATLAS_FILE_URL = `https://dataverse.harvard.edu/api/access/datafile/${ATLAS_FILE_ID}`
/** The pinned version's landing page, which `/sources` prints as the row's link. */
export const ATLAS_PAGE_URL = `https://dataverse.harvard.edu/dataset.xhtml?persistentId=${ATLAS_DOI}&version=${ATLAS_VERSION}`
export const ATLAS_HOME_URL = 'https://atlas.hks.harvard.edu'
export const ATLAS_LICENCE = 'CC0 1.0'
/** Stable id of the adapter that counts new export products. */
export const ATLAS_NEW_PRODUCTS_ADAPTER_ID = 'atlas-hs92-new-export-products-v1'
/**
 * The definition, fixed in the A16 preflight before the row was wired: a
 * product is new when its mean RCA over the start window is under `absentRca`
 * and its mean RCA over the end window is at least `presentRca`, with mean
 * exports over the end window of at least `minExportsUsd`. The rate is new
 * products over the products under `absentRca` at the start, in percent.
 */
export const ATLAS_NEW_PRODUCTS_RULE = {
  start: { from: 2009, to: 2011 },
  end: { from: 2022, to: 2024 },
  absentRca: 0.5,
  presentRca: 1,
  minExportsUsd: 1_000_000,
} as const
