/*
 * Confidence bands and the thin-evidence rule read CONFIDENCE_BANDS and nothing
 * else. The assertions derive every threshold from the table, so moving a band
 * moves the test with it. See D32.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { CONFIDENCE_BANDS, confidenceBand, isThinEvidence } from './confidence.js'

const bandMin = (id: string): number => {
  const band = CONFIDENCE_BANDS.find((b) => b.id === id)
  assert.ok(band, `missing band ${id}`)
  return band.min
}

test('bands are ordered strongest first and the lowest starts at zero', () => {
  assert.deepEqual(
    CONFIDENCE_BANDS.map((b) => b.id),
    ['good', 'usable', 'thin', 'very_thin'],
  )
  for (let i = 1; i < CONFIDENCE_BANDS.length; i++) {
    const prev = CONFIDENCE_BANDS[i - 1]
    const cur = CONFIDENCE_BANDS[i]
    assert.ok(prev && cur && prev.min > cur.min, 'mins must strictly descend')
  }
  assert.equal(CONFIDENCE_BANDS.at(-1)?.min, 0)
})

test('each band minimum is inclusive', () => {
  for (const band of CONFIDENCE_BANDS) {
    assert.equal(confidenceBand(band.min).id, band.id)
    if (band.min > 0) {
      assert.notEqual(confidenceBand(band.min - 1e-9).id, band.id)
    }
  }
})

test('the ends of the scale land in the extreme bands', () => {
  assert.equal(confidenceBand(1).id, 'good')
  assert.equal(confidenceBand(0).id, 'very_thin')
  // Below zero cannot occur, but the lookup still answers with the lowest band.
  assert.equal(confidenceBand(-0.1).id, 'very_thin')
})

test('isThinEvidence is true exactly below the usable band', () => {
  const usable = bandMin('usable')
  assert.equal(isThinEvidence(usable), false)
  assert.equal(isThinEvidence(usable - 1e-9), true)
  assert.equal(isThinEvidence(bandMin('thin')), true)
  assert.equal(isThinEvidence(0), true)
  assert.equal(isThinEvidence(bandMin('good')), false)
  assert.equal(isThinEvidence(1), false)
})

test('isThinEvidence agrees with the band lookup at every step', () => {
  for (let i = 0; i <= 100; i++) {
    const v = i / 100
    const id = confidenceBand(v).id
    assert.equal(isThinEvidence(v), id === 'thin' || id === 'very_thin', `at ${v}`)
  }
})
