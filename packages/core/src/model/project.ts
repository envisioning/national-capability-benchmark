/**
 * Where this project lives and how a rendered document names a file inside it.
 *
 * A document and a page both tell the reader to open the same limits file. The
 * path alone only works for somebody with a checkout, so every reference is a
 * link built here, and the repository URL is written once. See D40.
 */

export const REPO_URL = 'https://github.com/envisioning/national-capability-benchmark'

/** The default branch a documentation link points at. */
const REPO_BRANCH = 'main'

/** A repository file as a link a reader outside the checkout can follow. */
export const docHref = (path: string): string => `${REPO_URL}/blob/${REPO_BRANCH}/${path}`

/** The limits every agenda tells the reader to open before quoting a number. */
export const LIMITS_DOC = 'docs/KNOWN-ARTEFACTS.md'

/** The decision log. Named wherever a rendered document defends a choice. */
export const DECISIONS_DOC = 'docs/DECISIONS.md'
