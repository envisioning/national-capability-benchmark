import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { FITNESS_ITEMS_DIR, FITNESS_SOURCES_DIR, ROOT } from '../pipeline/paths.js'
import type { Problem } from '../pipeline/validate.js'
import { FitnessItemFile } from './schema.js'
import { readPin } from './sources.js'
import type { FitnessItem } from './schema.js'

export type LoadedItems = { items: FitnessItem[]; files: number; problems: Problem[] }

/**
 * Reads every item file in data/fitness/items and checks what the schema
 * cannot: one topic per file, ids unique across files and prefixed with
 * their topic, and a script-graded fact carrying values a script can check.
 * An empty or missing directory is not an error: the set is authored later.
 */
export async function loadFitnessItems(dir = FITNESS_ITEMS_DIR): Promise<LoadedItems> {
  const problems: Problem[] = []
  const items: FitnessItem[] = []
  let names: string[] = []
  try {
    names = (await readdir(dir)).filter((name) => name.endsWith('.json')).sort()
  } catch {
    return { items, files: 0, problems }
  }

  const seen = new Map<string, string>()
  for (const name of names) {
    const path = resolve(dir, name)
    const file = relative(ROOT, path)
    let parsed: FitnessItemFile
    try {
      const result = FitnessItemFile.safeParse(JSON.parse(await readFile(path, 'utf8')))
      if (!result.success) {
        for (const issue of result.error.issues) {
          problems.push({ file, severity: 'error', problem: `${issue.path.join('.')}: ${issue.message}` })
        }
        continue
      }
      parsed = result.data
    } catch (err) {
      problems.push({ file, severity: 'error', problem: `not JSON: ${err instanceof Error ? err.message : err}` })
      continue
    }

    if (name !== `${parsed.topic}.json`) {
      problems.push({ file, severity: 'error', problem: `topic ${parsed.topic} belongs in ${parsed.topic}.json` })
    }
    for (const item of parsed.items) {
      if (item.topic !== parsed.topic) {
        problems.push({ file, severity: 'error', problem: `${item.id}: topic ${item.topic} in the ${parsed.topic} file` })
      }
      if (!item.id.startsWith(`fit.${item.topic}.`)) {
        problems.push({ file, severity: 'error', problem: `${item.id}: id must start with fit.${item.topic}.` })
      }
      const earlier = seen.get(item.id)
      if (earlier) problems.push({ file, severity: 'error', problem: `${item.id}: also in ${earlier}` })
      seen.set(item.id, file)
      if (item.kind === 'fact' && item.grading === 'script' && item.reference.values.length === 0) {
        problems.push({ file, severity: 'error', problem: `${item.id}: script grading needs reference.values` })
      }
      if (item.topic === 'contested_policy' && item.kind !== 'value') {
        problems.push({ file, severity: 'warning', problem: `${item.id}: contested_policy items are value items in the design` })
      }
      if (item.topic !== 'contested_policy' && item.kind !== 'fact') {
        problems.push({ file, severity: 'warning', problem: `${item.id}: only contested_policy carries value items in the design` })
      }
      items.push(item)
    }
  }
  return { items, files: names.length, problems }
}

/**
 * What a grounded run will lack: a fact item with no pinned text runs
 * `closed` only, and a source with no text is left out of its bundle. Also
 * catches a fetched text edited after its pin, which would put words in the
 * bundle the publisher never wrote. Warnings, never errors: the set is valid
 * before its sources are fetched.
 */
export async function bundleProblems(items: FitnessItem[], dir = FITNESS_SOURCES_DIR): Promise<Problem[]> {
  const problems: Problem[] = []
  for (const item of items) {
    if (item.kind !== 'fact') continue
    const file = relative(ROOT, resolve(dir, item.id))
    const names = new Set(await readdir(resolve(dir, item.id)).catch(() => [] as string[]))
    const present = item.sources.map((_, i) => (names.has(`${i + 1}.txt`) ? `${i + 1}.txt` : names.has(`${i + 1}.md`) ? `${i + 1}.md` : null))
    if (present.every((p) => p === null)) {
      problems.push({ file, severity: 'warning', problem: `${item.id}: no source bundle, runs closed only. Run \`pnpm bench fitness sources fetch\`` })
      continue
    }
    present.forEach((p, i) => {
      if (p === null) problems.push({ file, severity: 'warning', problem: `${item.id}: source ${i + 1} has no text and is left out of the bundle` })
    })
    const pin = await readPin(item.id, dir)
    for (const entry of pin?.sources ?? []) {
      const name = present[entry.n - 1]
      if (!name) continue
      if (entry.url !== item.sources[entry.n - 1]?.url) {
        problems.push({ file, severity: 'warning', problem: `${item.id}: source ${entry.n} was pinned from ${entry.url}, the item now names another URL` })
      }
      const text = await readFile(resolve(dir, item.id, name), 'utf8')
      if (entry.method === 'fetched' && createHash('sha256').update(text).digest('hex') !== entry.textSha256) {
        problems.push({ file, severity: 'warning', problem: `${item.id}: ${name} differs from the text pinned on ${entry.retrieved}. Refetch with --force, or mark it hand-written in pin.json` })
      }
    }
  }
  return problems
}
