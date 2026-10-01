import type { Dimension } from './dimensions.js'

/**
 * Which known artefact bears on which capability.
 *
 * `docs/KNOWN-ARTEFACTS.md` describes each place where the model produces a
 * number that is wrong about the world. This table is the only place an
 * artefact id is joined to a dimension, so a page that names the artefacts
 * behind one capability reads it and never lists ids in its own copy. The
 * prose stays in the document; the table holds ids, scope and nothing else.
 *
 * `dimensions` is the capabilities whose score or rows the artefact touches,
 * or `'all'` for a structural artefact that applies to every score. An empty
 * list is an artefact that touches no scored row today (a closed one).
 * `countries`, where present, limits the artefact to the countries it is
 * about: A2 is a statement about India, and naming it on another country's
 * page would claim a failure the data does not show there.
 *
 * Keep in step with the document: the test beside the capability map reads
 * its headings and fails on an id missing from either side. See D133.
 */
export type ArtefactScope = {
  id: string
  dimensions: readonly Dimension[] | 'all'
  countries?: readonly string[]
}

export const ARTEFACT_SCOPES: readonly ArtefactScope[] = [
  { id: 'A1', dimensions: ['experimentation'] },
  { id: 'A2', dimensions: ['experimentation', 'anticipation'], countries: ['IND'] },
  { id: 'A3', dimensions: ['coordination', 'trust'] },
  /* Closed: none of the four WGI rows is scored (D23). */
  { id: 'A4', dimensions: [] },
  { id: 'A5', dimensions: ['shared_purpose'] },
  /* The frozen Doing Business rows: starting a business (Agency), border
   * time (Coordination), contract enforcement (Trust), electricity
   * connection (Building). */
  { id: 'A6', dimensions: ['agency', 'coordination', 'trust', 'building'] },
  { id: 'A7', dimensions: ['learning'] },
  { id: 'A8', dimensions: 'all' },
  { id: 'A9', dimensions: ['coordination'] },
  { id: 'A10', dimensions: 'all' },
  { id: 'A11', dimensions: ['building'] },
  { id: 'A12', dimensions: ['coordination', 'trust', 'shared_purpose'] },
  { id: 'A13', dimensions: ['shared_purpose'] },
  { id: 'A14', dimensions: ['agency'] },
  { id: 'A15', dimensions: ['agency', 'shared_purpose'] },
]

/**
 * The artefacts that bear on one capability for one country, in document
 * order: those about the capability itself, and the structural ones that
 * apply to every score.
 */
export function artefactsFor(
  dimension: Dimension,
  iso3: string,
): { specific: string[]; structural: string[] } {
  const code = iso3.toUpperCase()
  const applies = (a: ArtefactScope) => !a.countries || a.countries.includes(code)
  return {
    specific: ARTEFACT_SCOPES.filter(
      (a) => a.dimensions !== 'all' && a.dimensions.includes(dimension) && applies(a),
    ).map((a) => a.id),
    structural: ARTEFACT_SCOPES.filter((a) => a.dimensions === 'all' && applies(a)).map(
      (a) => a.id,
    ),
  }
}
