/*
 * The normalization frame on synthetic values: Tukey fences, the 0 and 100
 * endpoints, winsorizing and the out-of-frame clamp. No committed data is read.
 * See D47 for the frame and D22 for why history is scored against it.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { buildFrame, scoreAgainstFrame, tukeyFences } from './normalize.js'

test('Tukey fences sit k interquartile ranges beyond the quartiles', () => {
  // q1 = 10, q3 = 30, IQR = 20
  const { lo, hi } = tukeyFences([40, 0, 20, 10, 30], 3)
  assert.equal(lo, 10 - 3 * 20)
  assert.equal(hi, 30 + 3 * 20)
  const narrow = tukeyFences([0, 10, 20, 30, 40], 1.5)
  assert.equal(narrow.lo, -20)
  assert.equal(narrow.hi, 60)
})

test('a frame needs at least two values', () => {
  assert.equal(buildFrame([]), null)
  assert.equal(buildFrame([5]), null)
  assert.ok(buildFrame([5, 6]))
})

test('with no outlier the endpoints are the observed min and max', () => {
  const frame = buildFrame([0, 10, 20, 30, 40])
  assert.ok(frame)
  assert.equal(frame.min, 0)
  assert.equal(frame.max, 40)

  const bottom = scoreAgainstFrame(0, frame, 'higher_better')
  const top = scoreAgainstFrame(40, frame, 'higher_better')
  const mid = scoreAgainstFrame(10, frame, 'higher_better')
  assert.equal(bottom.normalized, 0)
  assert.equal(top.normalized, 100)
  assert.equal(mid.normalized, 25)
  for (const s of [bottom, top, mid]) {
    assert.equal(s.winsorized, false)
    assert.equal(s.outOfFrame, false)
  }
})

test('lower_better reverses the scale', () => {
  const frame = buildFrame([0, 10, 20, 30, 40])
  assert.ok(frame)
  assert.equal(scoreAgainstFrame(0, frame, 'lower_better').normalized, 100)
  assert.equal(scoreAgainstFrame(40, frame, 'lower_better').normalized, 0)
  assert.equal(scoreAgainstFrame(10, frame, 'lower_better').normalized, 75)
})

test('an extreme outlier is winsorized to the fence, which becomes the endpoint', () => {
  // sorted n = 10: q1 = 2.25, q3 = 6.75, IQR = 4.5, hi = 6.75 + 13.5 = 20.25
  const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 1000]
  const frame = buildFrame(values)
  assert.ok(frame)
  assert.equal(frame.hi, 20.25)
  assert.equal(frame.max, 20.25, 'the upper endpoint is the fence, not the outlier')
  assert.equal(frame.min, 0)

  const outlier = scoreAgainstFrame(1000, frame, 'higher_better')
  assert.equal(outlier.winsorized, true)
  assert.equal(outlier.transformed, 20.25)
  assert.equal(outlier.normalized, 100)
  // A current value helped build the frame, so it can never be out of frame (D47).
  assert.equal(outlier.outOfFrame, false)

  // Winsorizing keeps the variation among the other countries.
  const four = scoreAgainstFrame(4, frame, 'higher_better')
  assert.equal(four.winsorized, false)
  assert.ok(Math.abs(four.normalized - (4 / 20.25) * 100) < 1e-9)
})

test('no current value falls outside a frame it helped build', () => {
  const sets = [
    [0, 10, 20, 30, 40],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 1000],
    [-500, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [3.2, 3.2, 7.9, 1.1, 88, 0.4],
  ]
  for (const values of sets) {
    const frame = buildFrame(values)
    assert.ok(frame)
    for (const v of values) {
      for (const dir of ['higher_better', 'lower_better'] as const) {
        const s = scoreAgainstFrame(v, frame, dir)
        assert.equal(s.outOfFrame, false, `${v} in [${values.join(', ')}]`)
        assert.ok(s.normalized >= 0 && s.normalized <= 100)
      }
    }
  }
})

test('a historical value outside the frame clamps to 0 or 100 and sets outOfFrame', () => {
  const frame = buildFrame([0, 10, 20, 30, 40])
  assert.ok(frame)

  const above = scoreAgainstFrame(50, frame, 'higher_better')
  assert.equal(above.normalized, 100)
  assert.equal(above.outOfFrame, true)

  const below = scoreAgainstFrame(-10, frame, 'higher_better')
  assert.equal(below.normalized, 0)
  assert.equal(below.outOfFrame, true)

  const aboveReversed = scoreAgainstFrame(50, frame, 'lower_better')
  assert.equal(aboveReversed.normalized, 0)
  assert.equal(aboveReversed.outOfFrame, true)

  // Beyond the fence as well: clamped to the fence first, still flagged.
  const far = scoreAgainstFrame(1e6, frame, 'higher_better')
  assert.equal(far.normalized, 100)
  assert.equal(far.winsorized, true)
  assert.equal(far.outOfFrame, true)
})

test('a historical value beyond every value that built the frame is out of frame, even at a fence', () => {
  // The current outlier (1000) is winsorized onto the upper fence, so the fence
  // is also the top endpoint and clipping alone cannot show a value past it.
  const frame = buildFrame([0, 1, 2, 3, 4, 5, 6, 7, 8, 1000])
  assert.ok(frame)
  assert.equal(frame.max, frame.hi)
  const current = scoreAgainstFrame(1000, frame, 'higher_better')
  assert.equal(current.outOfFrame, false, 'a current value never falls outside its own frame')
  assert.equal(current.winsorized, true)
  const inside = scoreAgainstFrame(500, frame, 'higher_better')
  assert.equal(inside.outOfFrame, false, 'winsorized like the current outlier, but inside the frame')
  const beyond = scoreAgainstFrame(2000, frame, 'higher_better')
  assert.equal(beyond.normalized, 100)
  assert.equal(beyond.outOfFrame, true)
  const below = scoreAgainstFrame(-1000, buildFrame([-1000, 0, 1, 2, 3, 4, 5, 6, 7, 8])!, 'higher_better')
  assert.equal(below.outOfFrame, false)
  const pastBelow = scoreAgainstFrame(-2000, buildFrame([-1000, 0, 1, 2, 3, 4, 5, 6, 7, 8])!, 'higher_better')
  assert.equal(pastBelow.outOfFrame, true)
})

test('a frame with no spread scores every value at the midpoint', () => {
  const frame = buildFrame([7, 7, 7])
  assert.ok(frame)
  const s = scoreAgainstFrame(7, frame, 'higher_better')
  assert.equal(s.normalized, 50)
  assert.equal(s.outOfFrame, false)
})
