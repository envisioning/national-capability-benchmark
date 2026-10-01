/*
 * Hand-written row facts: one table for every reading of a country, held to
 * the pinned ILOSTAT release it restates, and rendered by each lexicon from a
 * template per kind. The layer sentences that were hand-written per language
 * before D136 are pinned here, so moving them into the table changed no word
 * a layer reader sees. See D136.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { EN, ES, LEXICONS, PT_BR, fill } from '../i18n/index.js'
import type { Lexicon } from '../i18n/index.js'
import { COUNTRY_ROW_FACTS, INDICATORS, ROW_FACT_KINDS, isScored, rowFactsFor } from '../model/index.js'
import type { CountryRowFact } from '../model/index.js'
import { countryTopic } from './agenda.js'
import { LTU_GATE } from './adapters/ilostat.js'

const render = (lex: Lexicon, fact: CountryRowFact): string =>
  fill(lex.capabilityMap.rowFacts[fact.kind], {
    countryTopic: countryTopic(lex, fact.iso3),
    floor: LTU_GATE.floorPct,
    ...(fact.survey ? { survey: fact.survey } : {}),
  })

const only = (iso3: string): CountryRowFact => {
  const facts = rowFactsFor(iso3)
  assert.equal(facts.length, 1, `${iso3} facts`)
  return facts[0]!
}

test('every fact sits on a scored row, once per country and row', () => {
  const seen = new Set<string>()
  for (const fact of COUNTRY_ROW_FACTS) {
    const def = INDICATORS.find((i) => i.id === fact.indicatorId)
    assert.ok(def && isScored(def), `${fact.indicatorId} is not a scored row`)
    const key = `${fact.iso3}:${fact.indicatorId}`
    assert.ok(!seen.has(key), `duplicate fact ${key}`)
    seen.add(key)
    assert.ok(fact.decisions.length > 0, `${key} names no decision`)
  }
})

test('every lexicon has a template for every kind, and every placeholder fills', () => {
  for (const [lang, lex] of Object.entries(LEXICONS)) {
    for (const kind of ROW_FACT_KINDS) {
      assert.ok(lex.capabilityMap.rowFacts[kind], `${lang} lacks ${kind}`)
    }
    for (const fact of COUNTRY_ROW_FACTS) {
      const text = render(lex, fact)
      assert.ok(!/\{\w+\}/.test(text), `${lang} ${fact.iso3}: unfilled placeholder in ${text}`)
      assert.ok(!/[–—]/.test(text), `${lang} ${fact.iso3}: dash in ${text}`)
    }
  }
})

test('the table restates the pinned ILOSTAT release', () => {
  const file = JSON.parse(
    readFileSync(new URL('../../../../data/observations/ilostat-ltu.json', import.meta.url), 'utf8'),
  ) as { observations: { iso3: string; note?: string }[] }
  const notes = new Map(file.observations.map((o) => [o.iso3, o.note ?? '']))
  const ltu = COUNTRY_ROW_FACTS.filter((f) => f.indicatorId === 'long_term_unemployment_share')
  const kindOf = new Map(ltu.map((f) => [f.iso3, f]))

  const household = new Set(['household_survey', 'household_survey_unreliable'])
  const unreliable = new Set(['household_survey_unreliable', 'urban_survey_unreliable', 'flagged_unreliable'])
  for (const [iso3, note] of notes) {
    const fact = kindOf.get(iso3)
    const survey = /survey: ([^;]*)/.exec(note)?.[1] ?? ''
    assert.equal(survey.startsWith('HS'), household.has(fact?.kind ?? ''), `${iso3} household survey`)
    assert.equal(/unreliable/.test(note), unreliable.has(fact?.kind ?? ''), `${iso3} ILO flag`)
    assert.equal(/Urban/i.test(survey), fact?.kind === 'urban_survey_unreliable', `${iso3} urban only`)
    /* A survey the table names is the one ILOSTAT labels: every word of the
     * name is in the label, or the name is the label's acronym (PNAD). */
    if (fact?.survey) {
      const acronym = (survey.match(/\b\p{Lu}/gu) ?? []).slice(1).join('')
      for (const w of fact.survey.split(' ')) {
        assert.ok(survey.includes(w) || acronym.startsWith(w), `${iso3} survey ${fact.survey} against ${survey}`)
      }
    }
  }
  /* A row the gate emptied has no observation at all. */
  for (const fact of ltu.filter((f) => f.kind === 'gate_never_passed')) {
    assert.ok(!notes.has(fact.iso3), `${fact.iso3} has an observation`)
  }
})

test('the layer sentences read as they did before the table', () => {
  assert.equal(
    render(PT_BR, only('BRA')),
    'Para o Brasil, a série do ILOSTAT vem da PNAD Contínua, uma pesquisa domiciliar.',
  )
  assert.equal(
    render(ES, only('ARG')),
    'Para Argentina, la serie de ILOSTAT viene de la Encuesta Permanente de Hogares, que cubre solo aglomerados urbanos, y la OIT marca el valor como poco confiable.',
  )
  assert.equal(
    render(ES, only('MEX')),
    'Para México, ningún año de la serie de ILOSTAT pasa el filtro de plausibilidad: la encuesta registra menos de 3% casi todos los años, así que la fila queda sin valor.',
  )
  assert.deepEqual(rowFactsFor('COL'), [])
  assert.deepEqual(rowFactsFor('CHL'), [])
  assert.equal(
    render(EN, only('BRA')),
    'For Brazil, the ILOSTAT series comes from PNAD Contínua, a household survey.',
  )
})

console.log('Row facts validated: one table, held to the pinned release, layer text unchanged.')
