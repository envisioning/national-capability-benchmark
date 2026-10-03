/*
 * The Portuguese lexicon: complete over the registry, its terms held, no
 * prescription in it, and Brazil's evidence records read with the records'
 * own numbers. See D130, D133 and D158.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { COUNTRY_ISO3, INDICATORS } from '../model/index.js'
import { EVIDENCE_PT_BR } from './evidence-pt-br.js'
import { PT_BR } from './index.js'

/** Every string a lexicon holds, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

/** The figures in a sentence, written either way: 2,075.9 and 2.075,9 both read 20759. */
function figures(text: string): string[] {
  return (text.match(/\d(?:[\d.,]*\d)?/g) ?? []).map((n) => n.replace(/[.,]/g, '')).sort()
}

test('the Portuguese lexicon names every country and indicator, with a definition and a unit', () => {
  assert.deepEqual(
    COUNTRY_ISO3.filter((iso3) => !(iso3 in PT_BR.countries)),
    [],
  )
  assert.deepEqual(
    INDICATORS.map((i) => i.id).filter((id) => !(id in PT_BR.indicators)),
    [],
  )
  /* A definition left out falls back to the registry English, which is how a
   * condition's description reached the map pages in English. */
  assert.deepEqual(
    INDICATORS.map((i) => i.id).filter((id) => !(id in PT_BR.indicatorDefinitions)),
    [],
  )
  assert.deepEqual(
    [...new Set(INDICATORS.map((i) => i.unit))].filter((u) => !(u in PT_BR.units)),
    [],
  )
})

test('Portuguese copy keeps the house rules and the layer terms', () => {
  const all = strings({ ...PT_BR, evidence: undefined })
  for (const s of all) {
    assert.ok(!/[–—]/.test(s), `dash in: ${s}`)
    /* Descriptive, never prescriptive (D130). */
    assert.ok(!/\b(elevar|deveria|deve|precisa melhorar|recomenda-se)\b/i.test(s), `prescription in: ${s}`)
  }
  /* A score is a pontuação. Nota reads as a school grade. */
  assert.ok(!all.some((s) => /\bnotas?\b/i.test(s)), 'nota used for the score')
  assert.equal(PT_BR.agenda.colScore, 'Pontuação')
  /* Confiança is the Trust dimension; the confidence number is solidez. */
  assert.equal(PT_BR.dimensions.trust, 'Confiança')
  assert.equal(PT_BR.agenda.colConfidence, 'Solidez')
  assert.equal(PT_BR.capabilityMap.confidenceLabel, 'Solidez')
  for (const s of all.filter((x) => /confiança/i.test(x))) {
    assert.ok(
      s === PT_BR.dimensions.trust ||
        /Confiança (interpessoal|nas instituições|no governo)|confiança nas regras/i.test(s),
      `confiança outside Trust: ${s}`,
    )
  }
  /* No university is named in the layer's copy. */
  assert.ok(!all.some((s) => /Harvard|Universidade de/i.test(s)), 'a university named')
})

test("every evidence record filed against Brazil reads in Portuguese, with the record's own figures", () => {
  const records = JSON.parse(
    readFileSync(new URL('../../../../data/evidence/records.json', import.meta.url), 'utf8'),
  ) as { records?: unknown[] } | unknown[]
  const list = (Array.isArray(records) ? records : (records.records ?? [])) as Array<{
    id: string
    iso3: string
    title: string
    claim: string
  }>
  const brazil = list.filter((r) => r.iso3 === 'BRA')
  assert.ok(brazil.length > 0, 'Brazil has evidence records')
  assert.deepEqual(
    brazil.map((r) => r.id).filter((id) => !(id in EVIDENCE_PT_BR)),
    [],
    'a Brazil record has no Portuguese entry',
  )
  const byId = new Map(list.map((r) => [r.id, r]))
  for (const [id, pt] of Object.entries(EVIDENCE_PT_BR)) {
    const record = byId.get(id)
    assert.ok(record, `unknown evidence record ${id}`)
    assert.deepEqual(figures(pt.claim), figures(record.claim), `${id}: claim figures differ`)
    assert.deepEqual(figures(pt.title), figures(record.title), `${id}: title figures differ`)
    assert.ok(!/[–—]/.test(pt.title + pt.claim), `dash in ${id}`)
  }
})
