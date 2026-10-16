/*
 * The European Portuguese override: its map addresses pinned, its terms held,
 * rendered only for the four layer countries, and every evidence record
 * filed against them read in Portuguese with the record's own figures. See
 * D165.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { DIMENSIONS } from '../model/index.js'
import { mapSlug } from '../pipeline/capability-map.js'
import { EVIDENCE_PT_PT } from './evidence-pt-pt.js'
import { PT_BR, PT_PT, lexiconRenders } from './index.js'

const LAYER_COUNTRIES = ['PRT', 'AGO', 'MOZ', 'GNB']

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

test('pt-PT map slugs come from the lexicon names and are pinned', () => {
  assert.deepEqual(
    DIMENSIONS.map((d) => mapSlug(PT_PT.dimensions[d] ?? d)),
    /* Published addresses under /<layer>/mapa for the four pt-PT layers. A
     * rename that moves one needs a redirect from the old address. */
    [
      'antecipacao',
      'agencia',
      'coordenacao',
      'confianca',
      'aprendizagem',
      'experimentacao',
      'adaptacao',
      'construcao',
      'proposito-partilhado',
    ],
  )
})

test('pt-PT reads through the Brazilian base and renders only its four countries', () => {
  assert.equal(PT_PT.base, 'pt-BR')
  assert.deepEqual([...(PT_PT.layerCountries ?? [])].sort(), [...LAYER_COUNTRIES].sort())
  for (const iso3 of LAYER_COUNTRIES) assert.ok(lexiconRenders('pt-PT', iso3))
  assert.ok(!lexiconRenders('pt-PT', 'BRA'))
  assert.ok(!lexiconRenders('pt-PT', 'CPV'))
  /* A key the override leaves out reads the base. */
  assert.equal(PT_PT.dimensions.trust, PT_BR.dimensions.trust)
  assert.equal(PT_PT.agenda.colScore, 'Pontuação')
})

test('European Portuguese copy keeps the house rules and its own terms', () => {
  const all = strings({ ...PT_PT, evidence: undefined })
  for (const s of all) {
    assert.ok(!/[–—]/.test(s), `dash in: ${s}`)
    assert.ok(!/\b(elevar|deveria|deve|precisa melhorar|recomenda-se)\b/i.test(s), `prescription in: ${s}`)
  }
  assert.ok(!all.some((s) => /\bnotas?\b/i.test(s)), 'nota used for the score')
  assert.equal(PT_PT.capabilityMap.confidenceLabel, 'Solidez')
  /* In Portugal "renda" is the rent: income is "rendimento" everywhere the
   * override writes, and nothing the base wrote with it survives into a
   * string a pt-PT page prints from the map or the agenda. */
  const prose = strings([PT_PT.capabilityMap, PT_PT.agenda, PT_PT.indicators, PT_PT.indicatorDefinitions])
  assert.deepEqual(prose.filter((s) => /\brenda\b/i.test(s)), [])
  /* Research is investigação and its spending I&D. */
  assert.deepEqual(prose.filter((s) => /\bP&D\b|\bpesquisa/i.test(s)), [])
})

test("every evidence record filed against a pt-PT layer country reads in Portuguese, with the record's own figures", () => {
  const records = JSON.parse(
    readFileSync(new URL('../../../../data/evidence/records.json', import.meta.url), 'utf8'),
  ) as { records: Array<{ id: string; iso3: string; title: string; claim: string }> }
  const filed = records.records.filter((r) => LAYER_COUNTRIES.includes(r.iso3))
  assert.ok(filed.length > 0, 'the four countries have evidence records')
  assert.deepEqual(
    filed.map((r) => r.id).filter((id) => !(id in EVIDENCE_PT_PT)),
    [],
    'a record has no European Portuguese entry',
  )
  const byId = new Map(records.records.map((r) => [r.id, r]))
  for (const [id, pt] of Object.entries(EVIDENCE_PT_PT)) {
    const record = byId.get(id)
    assert.ok(record, `unknown evidence record ${id}`)
    assert.ok(LAYER_COUNTRIES.includes(record.iso3), `${id} is not a pt-PT layer record`)
    assert.deepEqual(figures(pt.claim), figures(record.claim), `${id}: claim figures differ`)
    assert.deepEqual(figures(pt.title), figures(record.title), `${id}: title figures differ`)
    assert.ok(!/[–—]/.test(pt.title + pt.claim), `dash in ${id}`)
  }
})
