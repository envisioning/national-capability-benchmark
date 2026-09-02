import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { COUNTRY_ISO3 } from '../model/countries.js'
import { GlobalInstitutionLedger, InstitutionNetworkFile } from '../model/institutions.js'
import { attachGlobalInstitutions } from './institutions.js'
import { FILES } from './paths.js'

const ledger = GlobalInstitutionLedger.parse(
  JSON.parse(await readFile(FILES.institutionsGlobal, 'utf8')),
)
const brazil = InstitutionNetworkFile.parse(
  JSON.parse(await readFile(FILES.institutionsBrazil, 'utf8')),
)

const known = new Set(COUNTRY_ISO3)
for (const node of ledger.nodes) {
  assert.ok(node.id.startsWith('global.'), `${node.id} carries the global prefix`)
  assert.equal(node.level, 'global')
  for (const member of node.members ?? []) {
    assert.ok(known.has(member), `${node.id}: member ${member} is a registry country`)
  }
}

const attached = attachGlobalInstitutions(brazil, ledger)
const ids = new Set(attached.nodes.map((node) => node.id))
assert.ok(ids.has('global.un'), 'Brazil is a UN member, so the UN attaches')
assert.ok(ids.has('global.undp'), 'a Brazilian relation reaches UNDP, so it attaches')
assert.ok(!ids.has('global.oecd'), 'Brazil is not an OECD member and no relation reaches it')
assert.equal(attached.nodes.length, brazil.nodes.length + ids.size - new Set(brazil.nodes.map((n) => n.id)).size)
assert.ok(
  attached.edges.some((edge) => edge.id === 'undp-linked_to-un'),
  'a ledger edge between two attached bodies comes along',
)
assert.ok(
  brazil.nodes.every((node) => !node.id.startsWith('global.')),
  'the country file holds no global node',
)

const bare = attachGlobalInstitutions(brazil, null)
assert.equal(bare.nodes.length, brazil.nodes.length)

console.log(`Global institution ledger validated: ${ledger.nodes.length} bodies, ${ids.size - brazil.nodes.length} attached to Brazil.`)
