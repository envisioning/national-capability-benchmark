import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import type { FitnessItem } from './schema.js'
import { decodeEntities, extractHtml, extractText, fetchSourceBundles, readPin } from './sources.js'
import type { Fetcher } from './sources.js'
import { loadSourceBundles } from './store.js'
import { bundleProblems } from './validate.js'

const filler = 'O benefício é pago mensalmente a quem cumpre os requisitos previstos na lei. '.repeat(5)

const page = `<html><head><title>x</title><script>var a = 1</script><style>p{}</style></head><body>
<header><nav><a href="/">Início</a></nav></header>
<div id="content"><div id="content-core"><h1>Benefício de Prestação Continuada</h1>
<p>O BPC garante um salário-m&iacute;nimo &agrave; pessoa idosa com 65 anos ou mais.</p>
<div class="x"><p>${filler}</p></div>
<table><tr><td>Valor</td><td>R$ 1.518,00</td></tr></table></div>
<div id="viewlet-below">Compartilhe</div></div>
<footer>Rodapé</footer></body></html>`

test('the HTML extractor keeps the content core and drops the chrome', () => {
  const text = extractHtml(page)
  assert.match(text, /Benefício de Prestação Continuada/)
  assert.match(text, /salário-mínimo à pessoa idosa/)
  assert.match(text, /Valor \| R\$ 1\.518,00/)
  for (const chrome of ['var a', 'Início', 'Rodapé', 'Compartilhe']) assert.ok(!text.includes(chrome), chrome)
})

test('entities decode, including accented Portuguese letters', () => {
  assert.equal(decodeEntities('a&ccedil;&atilde;o &eacute; &#233; &#xE9; &amp; &ordm;'), 'ação é é é & º')
})

test('a Câmara API response loses its paging links, link fields and objetosPossiveis; a PDF is refused', () => {
  const out = extractText(JSON.stringify({ dados: { descricao: 'Sim: 336; não: 142', uriOrgao: 'https://x', objetosPossiveis: [{ ementa: 'y' }] }, links: [{ rel: 'self' }] }), 'application/json')
  assert.ok('text' in out && out.text.includes('Sim: 336') && !out.text.includes('rel') && !out.text.includes('uriOrgao') && !out.text.includes('ementa'))
  assert.ok('error' in extractText('%PDF-1.7 ...', 'application/pdf'))
})

test('a long vote list becomes one row per deputy', () => {
  const votes = Array.from({ length: 25 }, (_, i) => ({
    tipoVoto: i === 3 ? 'Não' : 'Sim',
    deputado_: { id: i, uri: 'https://x', nome: `Deputada ${i}`, siglaPartido: 'PT', siglaUf: 'SP', email: 'a@b' },
  }))
  const out = extractText(JSON.stringify({ dados: votes, links: [] }), 'application/json')
  assert.ok('text' in out)
  const lines = out.text.split('\n')
  assert.equal(lines[0], 'tipoVoto | deputado_.id | deputado_.nome | deputado_.siglaPartido | deputado_.siglaUf')
  assert.equal(lines.length, 26)
  assert.equal(lines[4], 'Não | 3 | Deputada 3 | PT | SP')
})

const item = (id: string, urls: string[]): FitnessItem => ({
  id, version: 1, topic: 'public_services', kind: 'fact', question: 'Quem tem direito ao BPC?', snapshot: '2026-10-31',
  reference: { answer: 'x', values: [] }, grading: 'judge',
  sources: urls.map((url) => ({ url, publisher: 'gov.br', retrieved: '2026-10-31' })),
})

test('fetch writes and pins good sources, reports bad ones, and never writes an empty file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'fit-src-'))
  try {
    const fetcher: Fetcher = async (url) => {
      const body = url.endsWith('/ok') ? page : url.endsWith('/thin') ? '<html><body><p>Página</p></body></html>' : 'gone'
      return { finalUrl: url, status: url.endsWith('/404') ? 404 : 200, contentType: 'text/html; charset=utf-8', raw: new TextEncoder().encode(body) }
    }
    const items = [item('fit.public_services.0001', ['https://a.gov.br/ok', 'https://a.gov.br/thin', 'https://a.gov.br/404']), item('fit.public_services.0002', ['https://a.gov.br/404'])]
    const outcomes = await fetchSourceBundles({ items, retrieved: '2026-10-31', fetcher, dir })
    assert.deepEqual(outcomes.map((o) => o.status), ['written', 'failed', 'failed', 'failed'])

    const pin = await readPin('fit.public_services.0001', dir)
    assert.equal(pin?.sources.length, 1)
    assert.equal(pin?.sources[0]?.method, 'fetched')
    assert.equal(pin?.sources[0]?.rawSha256?.length, 64)

    const bundles = await loadSourceBundles(items, dir)
    assert.equal(bundles.get('fit.public_services.0001')?.length, 1)
    assert.equal(bundles.has('fit.public_services.0002'), false)

    const problems = await bundleProblems(items, dir)
    assert.ok(problems.some((p) => p.problem.includes('0002: no source bundle')))
    assert.ok(problems.some((p) => p.problem.includes('0001: source 2 has no text')))
    assert.ok(problems.every((p) => p.severity === 'warning'))

    /* A rerun keeps the pinned text; an edit to it is caught; a hand-written text is pinned as such and never refetched. */
    const again = await fetchSourceBundles({ items: [items[0]!], retrieved: '2026-11-01', fetcher, dir })
    assert.equal(again[0]?.status, 'kept')
    await writeFile(join(dir, 'fit.public_services.0001', '1.txt'), 'edited')
    assert.ok((await bundleProblems(items, dir)).some((p) => p.problem.includes('differs from the text pinned')))
    await writeFile(join(dir, 'fit.public_services.0001', '2.txt'), 'Texto transcrito à mão.')
    const hand = await fetchSourceBundles({ items: [items[0]!], retrieved: '2026-11-01', fetcher, dir })
    assert.equal(hand[1]?.status, 'hand')
    const pinned = await readPin('fit.public_services.0001', dir)
    assert.equal(pinned?.sources.find((s) => s.n === 2)?.method, 'hand')
    assert.equal(await readFile(join(dir, 'fit.public_services.0001', '2.txt'), 'utf8'), 'Texto transcrito à mão.')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
