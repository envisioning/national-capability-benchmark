/*
 * The brief prints no number the release files do not carry. It is built
 * from the committed data/out, the same files the viewer reads, and every
 * numeric token in the rendered markdown has to match a value in
 * diagnostics.json, factor-history.json or the index's country count, to the
 * precision the token is printed at. A sentence that started typing a figure
 * by hand would fail here. See D163.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { FactorHistoryFile, IndexFile } from '../model/index.js'
import { BRIEF_LANGS, buildBrief, renderBriefMarkdown } from './brief.js'
import type { BriefInput } from './brief.js'
import { WEALTH_CORRELATION_THRESHOLD } from './diagnostics.js'
import type { Diagnostics } from './diagnostics.js'
import { readFactorTest } from './factor-reading.js'
import { FILES } from './paths.js'
import { readResidualStructure } from './residual-reading.js'

const diagnostics = JSON.parse(readFileSync(FILES.diagnostics, 'utf8')) as Diagnostics
const index = IndexFile.parse(JSON.parse(readFileSync(FILES.index, 'utf8')))
const history = FactorHistoryFile.parse(JSON.parse(readFileSync(FILES.factorHistory, 'utf8')))
const input: BriefInput = { index, diagnostics, history }

/** Every number under a value, depth first. */
function leaves(value: unknown, out: number[] = []): number[] {
  if (typeof value === 'number' && Number.isFinite(value)) out.push(value)
  else if (Array.isArray(value)) for (const v of value) leaves(v, out)
  else if (value && typeof value === 'object') for (const v of Object.values(value)) leaves(v, out)
  return out
}

/** The values the brief may print: the parts of the release it reads, and the sums it states. */
function releaseValues(): number[] {
  const raw = [
    ...leaves(diagnostics.factorStructure),
    ...leaves(diagnostics.residualStructure),
    ...leaves(diagnostics.dimensionVsGdp),
    ...leaves(diagnostics.measurability),
    ...leaves(history.releases),
    index.countries.length,
    diagnostics.measurability.reduce((s, m) => s + m.indicatorsObserved, 0),
    diagnostics.measurability.reduce((s, m) => s + m.gaps, 0),
  ]
  /* A share prints as a percentage, a correlation without its sign, and the
   * factor sentence prints what the first factor leaves (one minus its share). */
  return raw.flatMap((x) => [x, Math.abs(x), x * 100, 1 - x, (1 - x) * 100])
}

/** Numbers the brief prints that are scale ends, the chance-draw wording or a published threshold, never a reading. */
const FIXED = [0, 1, 100, 19, 20, WEALTH_CORRELATION_THRESHOLD]

/** The numeric tokens of a rendered brief, with addresses, versions, dates, licences and decision ids taken out. */
function numericTokens(markdown: string): string[] {
  const body = markdown
    .split('\n')
    .filter((line) => !line.startsWith('*') || !line.endsWith('*'))
    .join('\n')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/\b\d+\.\d+\.\d+\b/g, '')
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '')
    .replace(/CC BY \d\.\d/g, '')
    .replace(/\b[DA]\d+\b/g, '')
  return body.match(/\d+(?:[.,]\d+)?/g) ?? []
}

function matches(token: string, values: number[]): boolean {
  const normal = token.replace(',', '.')
  const t = Number(normal)
  const decimals = normal.includes('.') ? normal.split('.')[1]!.length : 0
  const half = 0.5 * 10 ** -decimals + 1e-9
  return values.some((v) => Math.abs(v - t) <= half)
}

for (const lang of BRIEF_LANGS) {
  test(`every number in the ${lang} brief is read from the release files`, () => {
    const brief = buildBrief(input, lang)
    assert.ok(brief, 'the release carries the factor and residual tests')
    const markdown = renderBriefMarkdown(brief)
    const values = [...releaseValues(), ...FIXED]
    const stray = numericTokens(markdown).filter((token) => !matches(token, values))
    assert.deepEqual(stray, [], `numbers with no source in the release: ${stray.join(', ')}`)
  })

  test(`the ${lang} brief has the six sections of #88 in order and names no institution`, () => {
    const brief = buildBrief(input, lang)!
    assert.deepEqual(
      brief.sections.map((s) => s.id),
      ['claim', 'verdict', 'instrument', 'use', 'needs', 'links'],
    )
    const text = renderBriefMarkdown(brief)
    for (const name of ['Harvard', 'BNDES', 'Finep', 'CNPq', 'IDB', 'BID', 'CAF', 'Ipea', 'FGV', 'IBRE']) {
      assert.ok(!new RegExp(`\\b${name}\\b`).test(text), `${lang} brief names ${name}`)
    }
  })
}

test('the English brief carries the headline figures the thesis prints', () => {
  const text = renderBriefMarkdown(buildBrief(input, 'en')!)
  const factor = readFactorTest(diagnostics)!
  const residual = readResidualStructure(diagnostics)!
  assert.ok(text.includes(factor.shareSentence))
  if (factor.incomeSentence) assert.ok(text.includes(factor.incomeSentence))
  if (residual.weakClaimSentence) assert.ok(text.includes(residual.weakClaimSentence))
  if (residual.incomeShareSentence) assert.ok(text.includes(residual.incomeShareSentence))
  assert.ok(text.includes('own resources'), 'section 5 says the project is self-funded')
})

test("the Portuguese brief uses D158's words", () => {
  const text = renderBriefMarkdown(buildBrief(input, 'pt-BR')!)
  assert.ok(text.includes('pontuação'))
  assert.ok(text.includes('solidez da evidência'))
  assert.ok(text.includes('Confiança'), 'Trust keeps its name')
  assert.ok(!/\bnotas?\b/i.test(text), 'a score is never a nota')
  assert.ok(!/\bdeve(m)?\b/.test(text.replace('deve substituir', '').replace('deve reter', '')), 'no prescription')
  assert.ok(text.includes('recursos próprios'), 'section 5 says the project is self-funded')
})
