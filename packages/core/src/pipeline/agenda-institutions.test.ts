import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { InstitutionNetworkFile } from '../model/institutions.js'
import type { CountryAgenda } from './agenda.js'
import { institutionIdsForDimension } from './institutions.js'
import { agendaFile, FILES } from './paths.js'

const network = InstitutionNetworkFile.parse(
  JSON.parse(await readFile(FILES.institutionsBrazil, 'utf8')),
)
const agenda = JSON.parse(await readFile(agendaFile('BRA'), 'utf8')) as CountryAgenda
const nodeIds = new Set(network.nodes.map((node) => node.id))

assert.equal(agenda.iso3, 'BRA')
for (const item of agenda.dimensions) {
  const expected = institutionIdsForDimension(network.nodes, item.dimension)
  assert.deepEqual(
    item.institutionIds,
    expected,
    `${item.dimension} agenda links must be derived from the Brazil institution tags`,
  )
  for (const institutionId of item.institutionIds) {
    assert.ok(nodeIds.has(institutionId), `${item.dimension} links to an unknown institution`)
  }
}

assert.ok(
  agenda.dimensions.every((item) => item.institutionIds.length > 0),
  'Brazil should have at least one related institution for every agenda dimension',
)

console.log(
  `Brazil agenda institution links validated: ${agenda.dimensions.reduce((total, item) => total + item.institutionIds.length, 0)} dimension links.`,
)
