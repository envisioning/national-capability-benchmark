import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { LEXICONS, localizeInstitutionNetwork } from '../index.js'
import { buildInstitutionExplorer } from './institution-explorer.js'

const network = JSON.parse(
  await readFile(new URL('../../../../data/institutions/BRA.json', import.meta.url), 'utf8'),
)
const feed = buildInstitutionExplorer(
  localizeInstitutionNetwork(network, 'en'),
  LEXICONS.en,
  'Brazil',
)

assert.equal(feed.project.id, 'ncb-institutions-bra')
assert.equal(feed.allInstitutions.length, network.nodes.length)
assert.equal(feed.allInstitutions.length > 0, true)
assert.equal(feed.allJurisdictions.some((entry) => entry.id === 'BR' && entry.drawable), true)
assert.equal(feed.allJurisdictions.some((entry) => entry.id === 'BR-AC' && !entry.drawable), true)
assert.equal(feed.allInstitutions.every((institution) => institution.sources.length > 0), true)
assert.equal(
  feed.allInstitutions.every((institution) =>
    institution.connections.every((connection) => feed.allInstitutions.some((candidate) => candidate.id === connection.id)),
  ),
  true,
)
assert.equal(feed.allInstitutions.every((institution) => institution.description.length > 0), true)

console.log(`Institution explorer feed validated: ${feed.allInstitutions.length} institutions.`)
