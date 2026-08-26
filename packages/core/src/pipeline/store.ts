import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { DelphiRunFile, ObservationFile } from '../model/schema.js'
import type { Observation } from '../model/schema.js'
import { DELPHI_DIR, FILES } from './paths.js'

async function readJson(path: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return null
  }
}

/** All observations, World Bank plus anything hand-entered. Manual wins on conflict. */
export async function loadObservations(): Promise<Observation[]> {
  const out: Observation[] = []
  for (const path of [FILES.worldBank, FILES.manual]) {
    const raw = await readJson(path)
    if (!raw) continue
    const parsed = ObservationFile.safeParse(raw)
    if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
    out.push(...parsed.data.observations)
  }
  return out
}

export async function loadDelphi(path = FILES.delphiLatest): Promise<DelphiRunFile | null> {
  const raw = await readJson(path)
  if (!raw) return null
  const parsed = DelphiRunFile.safeParse(raw)
  if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`)
  return parsed.data
}

export async function saveDelphi(run: DelphiRunFile): Promise<string> {
  const path = resolve(DELPHI_DIR, `${run.runId}.json`)
  await mkdir(DELPHI_DIR, { recursive: true })
  const body = `${JSON.stringify(run, null, 2)}\n`
  await writeFile(path, body)
  await writeFile(FILES.delphiLatest, body)
  return path
}

export async function writeOut(path: string, body: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, body)
}

export function toCsv(rows: Array<Record<string, string | number | null>>): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0] as Record<string, unknown>)
  const escape = (v: string | number | null) => {
    if (v === null) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h] ?? null)).join(',')),
  ].join('\n')
}
