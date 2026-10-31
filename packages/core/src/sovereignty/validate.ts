import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { INSTITUTIONS_DIR, ROOT, SOVEREIGNTY_DIR } from '../pipeline/paths.js'
import { checkSovereigntyFile } from './check.js'
import type { SovereigntyProblem } from './check.js'
import type { SovereigntyFile } from './schema.js'

export type LoadedSovereignty = { files: SovereigntyFile[]; problems: SovereigntyProblem[] }

async function nodeIds(path: string): Promise<string[]> {
  try {
    const raw = JSON.parse(await readFile(path, 'utf8')) as { nodes?: Array<{ id?: unknown }> }
    return (raw.nodes ?? []).map((n) => n.id).filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

/**
 * Reads every country file in data/sovereignty and checks it against the
 * institution map of the same country plus the global ledger. An empty or
 * missing directory is not an error. Research only: see D171.
 */
export async function loadSovereignty(dir = SOVEREIGNTY_DIR): Promise<LoadedSovereignty> {
  const problems: SovereigntyProblem[] = []
  const files: SovereigntyFile[] = []
  let names: string[] = []
  try {
    names = (await readdir(dir)).filter((name) => /^[A-Z]{3}\.json$/.test(name)).sort()
  } catch {
    return { files, problems }
  }
  const global = await nodeIds(resolve(INSTITUTIONS_DIR, 'global.json'))
  for (const name of names) {
    const path = resolve(dir, name)
    const file = relative(ROOT, path)
    const iso3 = name.slice(0, 3)
    let raw: unknown
    try {
      raw = JSON.parse(await readFile(path, 'utf8'))
    } catch (e) {
      problems.push({ file, severity: 'error', problem: `not JSON: ${e instanceof Error ? e.message : e}` })
      continue
    }
    const ids = new Set([...global, ...(await nodeIds(resolve(INSTITUTIONS_DIR, name)))])
    const { data, problems: found } = checkSovereigntyFile(raw, file, ids, { expectedIso3: iso3 })
    problems.push(...found)
    if (data) files.push(data)
  }
  return { files, problems }
}
