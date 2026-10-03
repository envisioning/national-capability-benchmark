import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { sha256Hex } from './sha256.js'

test('sha256Hex agrees with node:crypto on inputs around the block boundaries', () => {
  const inputs = ['', 'abc', 'é — 日本語', ...[55, 56, 63, 64, 65, 119, 120, 1000, 5000].map((n) => 'x'.repeat(n))]
  for (const text of inputs) {
    assert.equal(sha256Hex(text), createHash('sha256').update(text, 'utf8').digest('hex'), `len ${text.length}`)
  }
})
