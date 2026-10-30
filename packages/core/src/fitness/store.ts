import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FITNESS_GRADES_DIR, FITNESS_RUNS_DIR, FITNESS_SOURCES_DIR } from '../pipeline/paths.js'
import { writeOut } from '../pipeline/store.js'
import type { BundleSource } from './prompts.js'
import { FitnessGradeFile, FitnessRunFile } from './schema.js'
import type { FitnessItem } from './schema.js'

/**
 * The pinned source text per fact item: `data/fitness/sources/{itemId}/{n}.txt`
 * or `.md`, where n is the 1-based index into the item's `sources`. A source
 * with no text file is left out of the bundle; an item with none at all has no
 * bundle and runs `closed` only.
 */
export async function loadSourceBundles(items: FitnessItem[], dir = FITNESS_SOURCES_DIR): Promise<Map<string, BundleSource[]>> {
  const bundles = new Map<string, BundleSource[]>()
  for (const item of items) {
    if (item.kind !== 'fact') continue
    let names: string[]
    try {
      names = await readdir(resolve(dir, item.id))
    } catch {
      continue
    }
    const bundle: BundleSource[] = []
    for (const [i, source] of item.sources.entries()) {
      const name = names.find((n) => n === `${i + 1}.txt` || n === `${i + 1}.md`)
      if (name) bundle.push({ ...source, text: await readFile(resolve(dir, item.id, name), 'utf8') })
    }
    if (bundle.length > 0) bundles.set(item.id, bundle)
  }
  return bundles
}

export const runFile = (runId: string) => resolve(FITNESS_RUNS_DIR, `${runId}.json`)
export const gradeFile = (runId: string) => resolve(FITNESS_GRADES_DIR, `${runId}.json`)

export async function saveFitnessRun(run: FitnessRunFile): Promise<string> {
  const path = runFile(run.runId)
  await writeOut(path, `${JSON.stringify(run, null, 2)}\n`)
  return path
}

export async function saveFitnessGrades(grades: FitnessGradeFile): Promise<string> {
  const path = gradeFile(grades.runId)
  await writeOut(path, `${JSON.stringify(grades, null, 2)}\n`)
  return path
}

/** The named run, or the newest one: run ids start with their ISO timestamp. */
export async function loadFitnessRun(runId?: string): Promise<FitnessRunFile> {
  let id = runId
  if (!id) {
    const names = await readdir(FITNESS_RUNS_DIR).catch(() => [] as string[])
    const newest = names.filter((n) => n.endsWith('.json')).sort().at(-1)
    if (!newest) throw new Error('No fitness run. Run `pnpm bench fitness run` first.')
    id = newest.replace(/\.json$/, '')
  }
  return FitnessRunFile.parse(JSON.parse(await readFile(runFile(id), 'utf8')))
}

export async function loadFitnessGrades(runId: string): Promise<FitnessGradeFile> {
  try {
    return FitnessGradeFile.parse(JSON.parse(await readFile(gradeFile(runId), 'utf8')))
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Run ${runId} has no grades. Run \`pnpm bench fitness grade --run ${runId}\` first.`)
    }
    throw err
  }
}
