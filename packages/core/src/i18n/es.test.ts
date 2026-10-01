/*
 * The Spanish lexicon: complete over the registry, its map addresses pinned,
 * its terms held, and rendered only for the countries whose layer it is
 * written for. See D134.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { COUNTRY_ISO3, DIMENSIONS, INDICATORS } from '../model/index.js'
import { mapSlug } from '../pipeline/capability-map.js'
import { ES, lexiconRenders } from './index.js'

/** Every string a lexicon holds, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

test('Spanish map slugs come from the lexicon names and are pinned', () => {
  assert.deepEqual(
    DIMENSIONS.map((d) => mapSlug(ES.dimensions[d] ?? d)),
    /* Published addresses under /<layer>/mapa for the four Spanish layers. A
     * rename that moves one needs a redirect from the old address. */
    [
      'anticipacion',
      'iniciativa',
      'coordinacion',
      'confianza',
      'aprendizaje',
      'experimentacion',
      'adaptacion',
      'ejecucion',
      'proposito-compartido',
    ],
  )
})

test('the Spanish lexicon names every country and indicator in the registry', () => {
  assert.deepEqual(Object.keys(ES.countries).sort(), [...COUNTRY_ISO3].sort())
  const missing = INDICATORS.map((i) => i.id).filter((id) => !(id in ES.indicators))
  assert.deepEqual(missing, [])
  for (const id of Object.keys(ES.indicators)) {
    assert.ok(INDICATORS.some((i) => i.id === id), `unknown indicator ${id}`)
  }
  /* Every definition is Spanish, so no row falls back to the registry
   * English, and every registry unit has a Spanish rendering. */
  assert.deepEqual(
    INDICATORS.map((i) => i.id).filter((id) => !(id in ES.indicatorDefinitions)),
    [],
  )
  assert.deepEqual(
    [...new Set(INDICATORS.map((i) => i.unit))].filter((u) => !(u in ES.units)),
    [],
  )
})

test('Spanish copy keeps the house rules', () => {
  const all = strings(ES)
  for (const s of all) {
    assert.ok(!/[–—]/.test(s), `dash in: ${s}`)
    assert.ok(!/deber[ií]a/i.test(s), `recommendation in: ${s}`)
  }
  /* Confianza is the Trust dimension. The confidence number is solidez. */
  assert.equal(ES.dimensions.trust, 'Confianza')
  assert.match(ES.capabilityMap.confidenceLabel, /^Solidez/)
  assert.equal(ES.agenda.colConfidence, 'Solidez')
  const confianza = all.filter((s) => /confianza/i.test(s))
  for (const s of confianza) {
    assert.ok(
      /Confianza$|confianza interpersonal|Confianza (interpersonal|en|declarada)|confiar|poco confiable/i.test(s) ||
        s === ES.dimensions.trust,
      `confianza outside Trust: ${s}`,
    )
  }
  /* One word for the score. */
  assert.ok(!all.some((s) => /\bnota\b/i.test(s)), 'nota used for the score')
})

test('a layer lexicon renders only its layer countries', () => {
  for (const iso3 of ['MEX', 'COL', 'CHL', 'ARG']) assert.ok(lexiconRenders('es', iso3))
  assert.ok(!lexiconRenders('es', 'BRA'))
  assert.ok(!lexiconRenders('es', 'PER'))
  assert.ok(lexiconRenders('en', 'PER'))
  assert.ok(lexiconRenders('pt-BR', 'BRA'))
})
