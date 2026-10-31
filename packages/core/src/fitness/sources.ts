import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { z } from 'zod'
import { FITNESS_SOURCES_DIR } from '../pipeline/paths.js'
import type { FitnessItem } from './schema.js'

/**
 * FIT-2b: the source bundles a `grounded` run supplies. For every fact item,
 * each source URL is fetched, its text extracted the way a retrieval system
 * would hand it to a model, and written to
 * `data/fitness/sources/{itemId}/{n}.txt`, n being the 1-based index into the
 * item's `sources`. `pin.json` beside the text records what was fetched: the
 * final URL, the status, the date and a hash of the raw response, because a
 * government page has no version and changes under the same address.
 *
 * A source that fails or yields no usable text is reported and never written
 * as an empty file: an empty bundle would grade the model on a fact we never
 * gave it. A source can instead be written by hand, where a page cannot be
 * extracted cleanly; its pin says so, and a refetch leaves it alone.
 */

/** Below this many characters an extraction is treated as a failure, not a source. */
export const MIN_SOURCE_CHARS = 200
/** Above this, the source is kept but flagged: it will dominate the grounded prompt. */
export const LARGE_SOURCE_CHARS = 40_000

export const SourcePinEntry = z.object({
  /** 1-based index into the item's `sources`. */
  n: z.number().int().positive(),
  url: z.string(),
  /** `fetched` by this command, or written `hand` by a person. */
  method: z.enum(['fetched', 'hand']),
  retrieved: z.string(),
  finalUrl: z.string().nullable(),
  status: z.number().int().nullable(),
  contentType: z.string().nullable(),
  /** sha256 of the raw response body. Null for a hand-written source. */
  rawSha256: z.string().nullable(),
  /** sha256 of the text written to `{n}.txt`. */
  textSha256: z.string(),
  chars: z.number().int().nonnegative(),
  extractor: z.string(),
  note: z.string().optional(),
})
export type SourcePinEntry = z.infer<typeof SourcePinEntry>

export const SourcePinFile = z.object({
  itemId: z.string(),
  itemVersion: z.number().int().positive(),
  sources: z.array(SourcePinEntry),
})
export type SourcePinFile = z.infer<typeof SourcePinFile>

export const EXTRACTOR_VERSION = 'fitness-extract-1'

const sha256 = (data: string | Uint8Array) => createHash('sha256').update(data).digest('hex')

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ordm: 'º', ordf: 'ª', sect: '§', deg: '°', ndash: '–', mdash: '—', hellip: '…',
  laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', middot: '·', bull: '•',
}

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole
    }
    const named = ENTITIES[code.toLowerCase()]
    if (named !== undefined) return named
    /* Latin letters with accents, the bulk of Portuguese entities: &aacute; &ccedil; &atilde; ... */
    const accent = /^([a-z])(acute|grave|circ|tilde|uml|cedil)$/i.exec(code)
    if (accent) {
      const marks: Record<string, string> = { acute: '́', grave: '̀', circ: '̂', tilde: '̃', uml: '̈', cedil: '̧' }
      return `${accent[1]}${marks[accent[2]!.toLowerCase()]}`.normalize('NFC')
    }
    return whole
  })
}

/**
 * The readable body of an HTML page. Drops scripts, styles, navigation,
 * headers, footers and forms; prefers the page's `main` or `article`, and on
 * gov.br the Plone content core, over the whole body. Block elements become
 * line breaks, table cells are separated, and whitespace is collapsed.
 */
export function extractHtml(html: string): string {
  let doc = html.replace(/<!--[\s\S]*?-->/g, '')
  for (const tag of ['script', 'style', 'noscript', 'svg', 'template', 'iframe']) {
    doc = doc.replace(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`, 'gi'), ' ')
  }
  const region =
    pickRegion(doc, /<div\b[^>]*\bid=["']content-core["'][^>]*>/i) ??
    pickRegion(doc, /<main\b[^>]*>/i, 'main') ??
    pickRegion(doc, /<article\b[^>]*>/i, 'article') ??
    pickRegion(doc, /<div\b[^>]*\bid=["']content["'][^>]*>/i) ??
    pickRegion(doc, /<body\b[^>]*>/i, 'body') ??
    doc
  let body = region
  for (const tag of ['nav', 'header', 'footer', 'form', 'aside', 'button', 'select']) {
    body = body.replace(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`, 'gi'), ' ')
  }
  body = body
    .replace(/<(td|th)\b[^>]*>/gi, ' | ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/?(p|div|section|tr|table|thead|tbody|ul|ol|h[1-6]|blockquote|pre|dl|dt|dd)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  return tidy(decodeEntities(body))
}

/** The content from the opening tag matched by `open` to its closing tag, or null. */
function pickRegion(doc: string, open: RegExp, tag?: string): string | null {
  const m = open.exec(doc)
  if (!m) return null
  const start = m.index + m[0].length
  if (tag) {
    const end = doc.toLowerCase().lastIndexOf(`</${tag}>`)
    return end > start ? doc.slice(start, end) : doc.slice(start)
  }
  /* A div: walk nested divs to find its own close. */
  const re = /<(\/?)div\b[^>]*>/gi
  re.lastIndex = start
  let depth = 1
  for (let t = re.exec(doc); t; t = re.exec(doc)) {
    depth += t[1] ? -1 : 1
    if (depth === 0) return doc.slice(start, t.index)
  }
  return doc.slice(start)
}

function tidy(text: string): string {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/[\u200b-\u200d\u2060\ufeff\u3164\u115f\u1160\uffa0]/g, '').replace(/[ \t\u00a0]+/g, ' ').replace(/^\s*\|\s*/, '').trim())
    .filter((line, i, lines) => line !== '' || (i > 0 && lines[i - 1] !== ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * An API response as a retrieval system would supply it: the JSON itself,
 * indented, with the paging links the Câmara API appends dropped because a
 * model has no use for them.
 */
export function extractJson(raw: string): string {
  const data = JSON.parse(raw) as unknown
  if (data && typeof data === 'object' && !Array.isArray(data) && 'links' in data && 'dados' in data) {
    return JSON.stringify((data as { dados: unknown }).dados, null, 2)
  }
  return JSON.stringify(data, null, 2)
}

export type Extracted = { text: string; extractor: string } | { error: string }

/** Chooses the extractor by content type, falling back on the body's first character. */
export function extractText(body: string, contentType: string | null): Extracted {
  const type = (contentType ?? '').toLowerCase()
  if (type.includes('pdf') || body.startsWith('%PDF')) return { error: 'PDF: no extractor; write the text by hand' }
  const trimmed = body.trimStart()
  if (type.includes('json') || ((trimmed.startsWith('{') || trimmed.startsWith('[')) && !type.includes('html'))) {
    try {
      return { text: extractJson(body), extractor: `${EXTRACTOR_VERSION}/json` }
    } catch (err) {
      return { error: `not JSON: ${err instanceof Error ? err.message : err}` }
    }
  }
  if (type.includes('html') || /<html|<body|<div/i.test(body.slice(0, 2000))) {
    return { text: extractHtml(body), extractor: `${EXTRACTOR_VERSION}/html` }
  }
  if (type.startsWith('text/') || type.includes('csv') || type === '') {
    return { text: tidy(body), extractor: `${EXTRACTOR_VERSION}/text` }
  }
  return { error: `unsupported content type ${contentType}` }
}

/** Câmara and Senado APIs answer XML unless asked for JSON. */
function acceptFor(url: string): string {
  return /dadosabertos\.camara\.leg\.br\/api|legis\.senado\.leg\.br\/dadosabertos/.test(url)
    ? 'application/json'
    : 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8'
}

export type FetchedSource = {
  finalUrl: string
  status: number
  contentType: string | null
  raw: Uint8Array
}

export type Fetcher = (url: string) => Promise<FetchedSource>

export const httpFetcher: Fetcher = async (url) => {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(60_000),
        headers: { Accept: acceptFor(url), 'Accept-Language': 'pt-BR,pt;q=0.9', 'User-Agent': 'ncb-fitness-sources/1 (+https://github.com/envisioning/national-capability-benchmark)' },
      })
      const out = { finalUrl: res.url || url, status: res.status, contentType: res.headers.get('content-type'), raw: new Uint8Array(await res.arrayBuffer()) }
      /* The Câmara API answers 504 under load; a server error is retried, a client error is final. */
      if (res.status >= 500 && attempt < 2) {
        lastError = new Error(`HTTP ${res.status}`)
        await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt))
        continue
      }
      return out
    } catch (err) {
      lastError = err
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt))
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

/** Decodes a body as UTF-8 unless the header or a meta tag names Latin-1. */
function decodeBody(raw: Uint8Array, contentType: string | null): string {
  const head = new TextDecoder('latin1').decode(raw.slice(0, 2048))
  const declared = /charset=["']?([\w-]+)/i.exec(contentType ?? '')?.[1] ?? /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1]
  const label = (declared ?? 'utf-8').toLowerCase()
  try {
    return new TextDecoder(label === 'iso-8859-1' || label === 'latin1' || label === 'windows-1252' ? 'windows-1252' : label).decode(raw)
  } catch {
    return new TextDecoder('utf-8').decode(raw)
  }
}

export type SourceOutcome = {
  itemId: string
  n: number
  url: string
  status: 'written' | 'kept' | 'hand' | 'failed'
  chars?: number
  detail?: string
}

export async function readPin(itemId: string, dir = FITNESS_SOURCES_DIR): Promise<SourcePinFile | null> {
  try {
    return SourcePinFile.parse(JSON.parse(await readFile(resolve(dir, itemId, 'pin.json'), 'utf8')))
  } catch {
    return null
  }
}

/**
 * Fetches and pins every source of every fact item. An existing fetched text
 * is kept unless `force`, so a rerun does not silently restate a bundle; a
 * hand-written one is never overwritten. A text file with no pin entry is
 * treated as hand-written and pinned as such.
 */
export async function fetchSourceBundles(opts: {
  items: FitnessItem[]
  retrieved: string
  force?: boolean
  fetcher?: Fetcher
  dir?: string
  onProgress?: (o: SourceOutcome) => void
}): Promise<SourceOutcome[]> {
  const dir = opts.dir ?? FITNESS_SOURCES_DIR
  const fetcher = opts.fetcher ?? httpFetcher
  const outcomes: SourceOutcome[] = []
  const report = (o: SourceOutcome) => {
    outcomes.push(o)
    opts.onProgress?.(o)
  }

  for (const item of opts.items) {
    if (item.kind !== 'fact') continue
    const itemDir = resolve(dir, item.id)
    const pin = await readPin(item.id, dir)
    const existing = new Set(await readdir(itemDir).catch(() => [] as string[]))
    const entries = new Map<number, SourcePinEntry>()
    /* Entries for a source index the item no longer has are dropped with it. */
    for (const e of pin?.sources ?? []) if (e.n <= item.sources.length) entries.set(e.n, e)

    for (const [i, source] of item.sources.entries()) {
      const n = i + 1
      const textName = existing.has(`${n}.md`) ? `${n}.md` : `${n}.txt`
      const prior = entries.get(n)
      if (existing.has(textName) && (!prior || prior.method === 'hand')) {
        const text = await readFile(resolve(itemDir, textName), 'utf8')
        entries.set(n, prior ?? {
          n, url: source.url, method: 'hand', retrieved: opts.retrieved, finalUrl: null, status: null, contentType: null,
          rawSha256: null, textSha256: sha256(text), chars: text.length, extractor: 'hand', note: 'written by hand',
        })
        report({ itemId: item.id, n, url: source.url, status: 'hand', chars: text.length })
        continue
      }
      if (existing.has(textName) && prior?.url === source.url && !opts.force) {
        report({ itemId: item.id, n, url: source.url, status: 'kept', chars: prior.chars })
        continue
      }

      let fetched: FetchedSource
      try {
        fetched = await fetcher(source.url)
      } catch (err) {
        report({ itemId: item.id, n, url: source.url, status: 'failed', detail: `fetch: ${err instanceof Error ? err.message : err}` })
        continue
      }
      if (fetched.status < 200 || fetched.status >= 300) {
        report({ itemId: item.id, n, url: source.url, status: 'failed', detail: `HTTP ${fetched.status}` })
        continue
      }
      const extracted = extractText(decodeBody(fetched.raw, fetched.contentType), fetched.contentType)
      if ('error' in extracted) {
        report({ itemId: item.id, n, url: source.url, status: 'failed', detail: extracted.error })
        continue
      }
      if (extracted.text.length < MIN_SOURCE_CHARS) {
        report({ itemId: item.id, n, url: source.url, status: 'failed', detail: `${extracted.text.length} characters extracted, below ${MIN_SOURCE_CHARS}` })
        continue
      }
      await mkdir(itemDir, { recursive: true })
      await writeFile(resolve(itemDir, `${n}.txt`), `${extracted.text}\n`)
      entries.set(n, {
        n,
        url: source.url,
        method: 'fetched',
        retrieved: opts.retrieved,
        finalUrl: fetched.finalUrl,
        status: fetched.status,
        contentType: fetched.contentType,
        rawSha256: sha256(fetched.raw),
        textSha256: sha256(`${extracted.text}\n`),
        chars: extracted.text.length + 1,
        extractor: extracted.extractor,
      })
      report({
        itemId: item.id, n, url: source.url, status: 'written', chars: extracted.text.length,
        ...(extracted.text.length > LARGE_SOURCE_CHARS ? { detail: `large: ${extracted.text.length} characters` } : {}),
      })
    }

    if (entries.size > 0) {
      const file: SourcePinFile = { itemId: item.id, itemVersion: item.version, sources: [...entries.values()].sort((a, b) => a.n - b.n) }
      await mkdir(itemDir, { recursive: true })
      await writeFile(resolve(itemDir, 'pin.json'), `${JSON.stringify(SourcePinFile.parse(file), null, 2)}\n`)
    }
  }
  return outcomes
}
