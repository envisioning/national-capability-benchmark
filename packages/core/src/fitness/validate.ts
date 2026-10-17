import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { FITNESS_ITEMS_DIR, ROOT } from '../pipeline/paths.js'
import type { Problem } from '../pipeline/validate.js'
import { FitnessItemFile } from './schema.js'
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
