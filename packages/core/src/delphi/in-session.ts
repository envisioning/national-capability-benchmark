import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { DIMENSIONS, DIMENSION_LABELS } from '../model/index.js'
import type { Dimension, Provenance } from '../model/index.js'
import type { Panelist } from './panel.js'
import { SYSTEM_RULES } from './prompts.js'
import { CellScoreOutput, JudgementOutput } from './provider.js'
import type { PanelProvider } from './provider.js'

/**
 * A panel answered by separate working sessions instead of the gateway.
 *
 * `runDelphi` drives it exactly as it drives the gateway, so every prompt it
 * writes is byte for byte the prompt a gateway run would send, and round 2 is
 * built from round 1 by the same code. Where an answer is missing it writes the
 * prompt to `<dir>/prompts/...` and fails the call; the CLI then saves nothing.
 * Each panelist answers its prompts in its own context and writes JSON to
 * `<dir>/answers/...`. Rerunning the command picks the answers up, dumps the
 * next round's prompts, and once every answer is present writes the run file.
 *
 * Answer files are JSON maps, any file name:
 *   answers/r<round>/<stance id>/*.json   { "BRA": { "dimensions": [...] }, ... }
 *   answers/audit/<stance id>/*.json      { "trust": { "indicators": [...] }, ... }
 * The value shapes are `CellScoreOutput` and `JudgementOutput`, the schemas the
 * gateway enforces through `generateObject`. See D154.
 */
export class InSessionProvider implements PanelProvider {
  readonly name = 'in-session'
  readonly provenance: Provenance = 'in_session'

  /** Prompts written because no answer existed yet, by round (0 = audit). */
  readonly dumped = new Map<number, number>()
  private cells = new Map<string, Map<string, CellScoreOutput>>()
  private audits = new Map<string, Map<string, JudgementOutput>>()

  constructor(private readonly dir: string) {}

  static async writeContract(dir: string): Promise<void> {
    const out = resolve(dir, 'prompts')
    await mkdir(out, { recursive: true })
    await writeFile(resolve(out, 'system.txt'), `${SYSTEM_RULES}\n`)
    await writeFile(
      resolve(out, 'cell.schema.json'),
      `${JSON.stringify(zodToJsonSchema(CellScoreOutput, 'CellScoreOutput'), null, 2)}\n`,
    )
    await writeFile(
      resolve(out, 'audit.schema.json'),
      `${JSON.stringify(zodToJsonSchema(JudgementOutput, 'JudgementOutput'), null, 2)}\n`,
    )
  }

  private async load<T>(sub: string, schema: { parse: (x: unknown) => T }): Promise<Map<string, T>> {
    const folder = resolve(this.dir, 'answers', sub)
    const map = new Map<string, T>()
    if (!existsSync(folder)) return map
    for (const f of (await readdir(folder)).filter((x) => x.endsWith('.json')).sort()) {
      const raw = JSON.parse(await readFile(resolve(folder, f), 'utf8')) as Record<string, unknown>
      for (const [key, value] of Object.entries(raw)) {
        try {
          map.set(key, schema.parse(value))
        } catch (err) {
          throw new Error(`${sub}/${f} ${key}: ${err instanceof Error ? err.message : String(err)}`)
        }
      }
    }
    return map
  }

  private async dump(round: number, path: string, prompt: string): Promise<never> {
    const file = resolve(this.dir, 'prompts', path)
    await mkdir(resolve(file, '..'), { recursive: true })
    await writeFile(file, prompt)
    this.dumped.set(round, (this.dumped.get(round) ?? 0) + 1)
    throw new Error(`awaiting answer: prompts/${path}`)
  }

  async cellScores(panelist: Panelist, prompt: string): Promise<CellScoreOutput> {
    const iso3 = /^# Evidence brief: .* \(([A-Z]{3})\)$/m.exec(prompt)?.[1]
    if (!iso3) throw new Error('prompt carries no evidence brief header')
    const round = prompt.includes('This is round 2') ? 2 : 1
    const key = `r${round}/${panelist.stance.id}`
    if (!this.cells.has(key)) this.cells.set(key, await this.load(key, CellScoreOutput))
    const answer = this.cells.get(key)?.get(iso3)
    if (answer) return answer
    /* Round 2 is built from round 1. A prompt built on a partial round 1 would
     * show a narrower spread than the panel produced, so it is never written. */
    if (round > 1 && (this.dumped.get(round - 1) ?? 0) > 0) throw new Error('round 1 incomplete')
    return this.dump(round, `${key}/${iso3}.txt`, prompt)
  }

  async indicatorJudgements(panelist: Panelist, prompt: string): Promise<JudgementOutput> {
    const label = /^Dimension: (.+)$/m.exec(prompt)?.[1]?.trim()
    const dimension = DIMENSIONS.find((d) => DIMENSION_LABELS[d] === label) as Dimension | undefined
    if (!dimension) throw new Error(`audit prompt names no known dimension (${label ?? 'none'})`)
    const key = `audit/${panelist.stance.id}`
    if (!this.audits.has(key)) this.audits.set(key, await this.load(key, JudgementOutput))
    const answer = this.audits.get(key)?.get(dimension)
    if (answer) return answer
    return this.dump(0, `${key}/${dimension}.txt`, prompt)
  }
}
