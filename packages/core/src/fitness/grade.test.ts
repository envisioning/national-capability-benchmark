import assert from 'node:assert/strict'
import test from 'node:test'
import { numbersIn, statesValue } from './grade.js'

test('numbers read the Brazilian way, with mil, milhões and bilhões', () => {
  assert.deepEqual(numbersIn('R$ 1.412,00 e 1,5 milhão'), [1412, 1500000])
  assert.ok(statesValue('São 382 votos a favor', { field: 'sim', value: 382 }))
  assert.ok(!statesValue('São 381 votos', { field: 'sim', value: 382 }))
})

test('a string matches as whole words, up to case and accents', () => {
  const pl = { field: 'partido', value: 'PL' }
  assert.ok(statesValue('Ele é filiado ao PL, pelo Paraná.', pl))
  assert.ok(!statesValue('O PLP 68/2024 foi aprovado.', pl))
  assert.ok(!statesValue('Vou aplicar a regra.', pl))
  assert.ok(statesValue('Filiou-se ao MISSAO em 2026.', { field: 'partido', value: 'MISSÃO' }))
  assert.ok(statesValue('O partido orientou: liberado.', { field: 'orientacao', value: 'Liberado' }))
})
