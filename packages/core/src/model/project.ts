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

/**
 * A repository file as a raw-content link. A chat model asked to act as a
 * panelist fetches the file itself, and the blob URL returns a rendered HTML
 * page rather than the text. See docs/PANELIST-BRIEF.md.
 */
export const rawHref = (path: string): string =>
  `https://raw.githubusercontent.com/envisioning/national-capability-benchmark/${REPO_BRANCH}/${path}`

/** Where a challenge to the model is filed. The one channel the site names. */
export const ISSUES_URL = `${REPO_URL}/issues`

/** The limits every agenda tells the reader to open before quoting a number. */
export const LIMITS_DOC = 'docs/KNOWN-ARTEFACTS.md'

/** The release history for the benchmark and its viewer. */
export const CHANGELOG_DOC = 'CHANGELOG.md'

/** The decision log. Named wherever a rendered document defends a choice. */
export const DECISIONS_DOC = 'docs/DECISIONS.md'

/** How to contribute a gap, an evidence record, a lexicon or an objection. */
export const CONTRIBUTING_DOC = 'CONTRIBUTING.md'

/** The inclusion rule for evidence records, and how to author one. */
export const EVIDENCE_DOC = 'docs/EVIDENCE.md'

/** The claim under test, and what would sink it. */
export const WHY_DOC = 'docs/WHY.md'

/**
 * The quoting contract for a program, a model or an agent that reads the
 * published data. `/llms.txt` in the viewer points at it. See D59.
 */
export const FOR_AGENTS_DOC = 'docs/FOR-AGENTS.md'

/** Third-party terms: what in here is not MIT. */
export const NOTICE_DOC = 'NOTICE.md'

/** The code license. The data carries its own terms, named in the notice. */
export const LICENSE_DOC = 'LICENSE'
