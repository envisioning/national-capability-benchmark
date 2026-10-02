import assert from 'node:assert/strict'
import { worldBankRowIso3 } from './sources.js'

// WDI fills countryiso3code; Global Findex (source 28) leaves it empty and
// carries the code in country.id.
assert.equal(worldBankRowIso3({ countryiso3code: 'BRA', country: { id: 'BR' } }), 'BRA')
assert.equal(worldBankRowIso3({ countryiso3code: '', country: { id: 'BRA' } }), 'BRA')
assert.equal(worldBankRowIso3({ countryiso3code: '', country: { id: 'BR' } }), null)
assert.equal(worldBankRowIso3({ countryiso3code: '' }), null)
