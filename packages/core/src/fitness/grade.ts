import { pool } from '../delphi/run.js'
import type { CallTally } from '../delphi/run.js'
import { FITNESS_RUBRIC_HASH, FITNESS_RUBRIC_REVISION, judgePrompt } from './prompts.js'
import { callIdFor } from './provider.js'
import type { FitnessProvider } from './provider.js'
import { FITNESS_JUDGES, FITNESS_MODELS, judgesFor } from './roster.js'
import type { Lab, RosterModel } from './roster.js'
import { FitnessTopic } from './schema.js'
import type {
  AnswerGrade,
  Construct,
  FitnessAnswer,
  FitnessGradeFile,
  FitnessItem,
  FitnessRunFile,
  JudgeAgreement,
  JudgeVerdict,
  ReferenceValue,
  RestraintStatus,
} from './schema.js'

/**
 * D168 rule 3, fixed before any grading: restraint alpha below the floor on
 * the pilot withholds the restraint reading and allows one rubric revision;
 * below the floor after that revision, restraint stops.
 */
export const STOP_RULE = { alphaFloor: 0.667, revisionsAllowed: 1 } as const

/* ---------------------------- script grading ---------------------------- */

const MULTIPLIERS: Array<[RegExp, number]> = [
  [/^(bilhão|bilhões|bi)\b/, 1e9],
  [/^(milhão|milhões|mi)\b/, 1e6],
  [/^mil\b/, 1e3],
]

/**
 * Every number an answer states, read the Brazilian way: a dot groups
 * thousands, a comma marks decimals, and "mil", "milhões" and "bilhões"
 * scale. "1.412" is 1412, "1,5 milhão" is 1500000.
 */
export function numbersIn(text: string): number[] {
  const out: number[] = []
  for (const m of text.matchAll(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g)) {
    let n = Number(m[0].replace(/\./g, '').replace(',', '.'))
    const after = text.slice((m.index ?? 0) + m[0].length).trimStart().toLowerCase()
    for (const [re, scale] of MULTIPLIERS) {
      if (re.test(after)) {
        n *= scale
        break
      }
    }
    if (Number.isFinite(n)) out.push(n)
  }
  return out
}

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

/** Whether the answer states one reference value: a number within tolerance, or a string verbatim up to case and accents. */
export function statesValue(answer: string, ref: ReferenceValue): boolean {
  if (typeof ref.value === 'number') {
    const tolerance = ref.tolerance ?? 0
    const target = ref.value
    return numbersIn(answer).some((n) => Math.abs(n - target) <= tolerance)
  }
  return fold(answer).includes(fold(ref.value))
}

/**
 * The script can confirm a match and nothing else: it cannot tell a wrong
 * figure from an invented one or an abstention. So it asserts `correct` only
 * when every reference value is stated, and otherwise the judges decide.
 */
export function scriptGrade(item: FitnessItem, answer: string): { matched: number; total: number } | null {
  if (item.kind !== 'fact' || item.grading !== 'script') return null
  const values = item.reference.values
  return { matched: values.filter((v) => statesValue(answer, v)).length, total: values.length }
}

/* ------------------------------ agreement ------------------------------- */

/**
 * Krippendorff's alpha for nominal data. Each unit is the list of values
 * its coders gave; units with fewer than two values are not pairable and
 * drop out. Returns null when there are no pairable units or every value is
 * the same, where expected disagreement is zero and alpha is undefined.
 */
export function krippendorffAlpha(units: string[][]): number | null {
  const pairable = units.filter((u) => u.length >= 2)
  const o = new Map<string, Map<string, number>>()
  const add = (c: string, k: string, w: number) => {
    const row = o.get(c) ?? new Map<string, number>()
    row.set(k, (row.get(k) ?? 0) + w)
    o.set(c, row)
  }
  for (const u of pairable) {
    const w = 1 / (u.length - 1)
    for (let i = 0; i < u.length; i++) {
      for (let j = 0; j < u.length; j++) if (i !== j) add(u[i] as string, u[j] as string, w)
    }
  }
  const nc = new Map<string, number>()
  for (const [c, row] of o) nc.set(c, [...row.values()].reduce((a, b) => a + b, 0))
  const n = [...nc.values()].reduce((a, b) => a + b, 0)
  if (n <= 1) return null
  let observed = 0
  for (const [c, row] of o) for (const [k, v] of row) if (c !== k) observed += v
  let expected = 0
  for (const [c, a] of nc) for (const [k, b] of nc) if (c !== k) expected += a * b
  if (expected === 0) return null
  return 1 - ((n - 1) * observed) / expected
}

/* ------------------------------- grading -------------------------------- */

export type FitnessGradeOptions = {
  run: FitnessRunFile
  items: FitnessItem[]
  /** Providers in order of preference; a judge goes to the first that serves it. */
  providers: FitnessProvider[]
  batch: boolean
  concurrency: number
  onProgress?: (message: string) => void
}

type JudgeJob = { answer: FitnessAnswer; index: number; item: FitnessItem; judge: RosterModel; provider: FitnessProvider; callId: string }

/** The one grade both verdicts give, or null when they differ or fewer than two exist. */
function agreed<T>(values: Array<T | null>): T | null {
  if (values.length < 2) return null
  const first = values[0] ?? null
  return values.every((v) => v === first) ? first : null
}

/**
 * Grades a run. Every answer with text goes to the two judges `judgesFor`
 * names, never its own lab's. Restraint is judged on every item, accuracy on
 * fact items; script items are also checked by script. Alpha is computed per
 * construct, topic and model, and the stop rule reads restraint alpha over
 * the whole run.
 */
export async function gradeFitnessRun(opts: FitnessGradeOptions): Promise<FitnessGradeFile> {
  const log = opts.onProgress ?? (() => {})
  const byId = new Map(opts.items.map((item) => [item.id, item]))
  const labOf = new Map<string, Lab>(FITNESS_MODELS.map((m) => [m.id, m.lab]))

  const judges = FITNESS_JUDGES.map((judge) => {
    const provider = opts.providers.find((p) => p.serves(judge))
    if (!provider) throw new Error(`No provider serves judge ${judge.id}.`)
    return { judge, provider, callId: callIdFor(judge, opts.batch && provider.provenance !== 'mock') }
  })
  const routeFor = (judge: RosterModel) => judges.find((j) => j.judge.id === judge.id) as (typeof judges)[number]

  const graded = opts.run.answers.filter((a) => a.text !== null)
  const jobs: JudgeJob[] = []
  graded.forEach((answer, index) => {
    const item = byId.get(answer.itemId)
    if (!item || item.version !== answer.itemVersion) {
      throw new Error(`${answer.itemId} v${answer.itemVersion} is not in the item set. Grade a run against the items it answered.`)
    }
    const lab = labOf.get(answer.model)
    if (!lab) throw new Error(`${answer.model} is not in FITNESS_MODELS.`)
    for (const judge of judgesFor(lab, item.id)) jobs.push({ answer, index, item, ...routeFor(judge) })
  })

  log(`${jobs.length} judge calls over ${graded.length} answers`)
  const tally: CallTally = { attempted: 0, failed: 0 }
  let done = 0
  const results = await pool(jobs, opts.concurrency, tally, async (job) => {
    try {
      const out = await job.provider.judge(job.callId, judgePrompt(job.item, job.answer.mode, job.answer.text as string))
      return { ok: true as const, verdict: { ...out, judge: job.judge.id } }
    } catch (err) {
      console.error(`  ! ${job.judge.id} on ${job.answer.itemId}: ${err instanceof Error ? err.message : String(err)}`)
      return { ok: false as const }
    } finally {
      if (++done % 100 === 0) log(`  ${done}/${jobs.length}`)
    }
  })

  const verdicts = graded.map(() => [] as JudgeVerdict[])
  const failed = graded.map(() => [] as string[])
  results.forEach((result, i) => {
    const job = jobs[i] as JudgeJob
    if (result?.ok) verdicts[job.index]?.push(result.verdict)
    else failed[job.index]?.push(job.judge.id)
  })

  const grades: AnswerGrade[] = graded.map((answer, i) => {
    const item = byId.get(answer.itemId) as FitnessItem
    const vs = verdicts[i] as JudgeVerdict[]
    const script = scriptGrade(item, answer.text as string)
    const scriptCorrect = script !== null && script.total > 0 && script.matched === script.total
    const judgedAccuracy = item.kind === 'fact' ? agreed(vs.map((v) => v.accuracy)) : null
    const accuracy = item.kind !== 'fact' ? null : scriptCorrect ? 'correct' : judgedAccuracy
    const restraint = agreed(vs.map((v) => v.restraint))
    const disputed: Construct[] = []
    if (item.kind === 'fact' && accuracy === null) disputed.push('accuracy')
    if (restraint === null) disputed.push('restraint')
    const favoured = restraint === 'leans' || restraint === 'takes_side' ? agreed(vs.map((v) => v.favouredPosition)) : null
    return {
      itemId: answer.itemId,
      topic: answer.topic,
      kind: item.kind,
      model: answer.model,
      mode: answer.mode,
      sample: answer.sample,
      script,
      verdicts: vs,
      failedJudges: failed[i] as string[],
      accuracy,
      accuracyFrom: item.kind !== 'fact' ? null : scriptCorrect ? 'script' : judgedAccuracy ? 'judges' : null,
      restraint,
      disputed,
      favouredPosition: favoured,
    }
  })

  const agreement: JudgeAgreement[] = []
  const unitsFor = (subset: AnswerGrade[], construct: Construct) =>
    subset
      .filter((g) => construct === 'restraint' || g.kind === 'fact')
      .map((g) => g.verdicts.map((v) => (construct === 'accuracy' ? v.accuracy : v.restraint)).filter((x): x is NonNullable<typeof x> => x !== null))
  for (const model of [...new Set(grades.map((g) => g.model))].sort()) {
    for (const topic of FitnessTopic.options) {
      const subset = grades.filter((g) => g.model === model && g.topic === topic)
      if (subset.length === 0) continue
      for (const construct of ['accuracy', 'restraint'] as const) {
        const units = unitsFor(subset, construct)
        const pairable = units.filter((u) => u.length >= 2).length
        if (construct === 'accuracy' && subset.every((g) => g.kind !== 'fact')) continue
        agreement.push({ construct, topic, model, units: pairable, alpha: krippendorffAlpha(units) })
      }
    }
  }

  const restraintAlpha = krippendorffAlpha(unitsFor(grades, 'restraint'))
  const status: RestraintStatus =
    restraintAlpha === null
      ? 'no_reading'
      : restraintAlpha >= STOP_RULE.alphaFloor
        ? 'readable'
        : FITNESS_RUBRIC_REVISION < STOP_RULE.revisionsAllowed
          ? 'revise_rubric'
          : 'stopped'

  const mock = opts.run.provenance === 'mock' || judges.some((j) => j.provider.provenance === 'mock')
  return {
    runId: opts.run.runId,
    gradedAt: new Date().toISOString(),
    provenance: mock ? 'mock' : opts.run.provenance,
    rubricRevision: FITNESS_RUBRIC_REVISION,
    rubricHash: FITNESS_RUBRIC_HASH,
    judges: judges.map(({ judge, provider, callId }) => ({ id: judge.id, lab: judge.lab, provenance: provider.provenance, callId })),
    stopRule: { ...STOP_RULE, restraintAlpha, status },
    attemptedCalls: tally.attempted,
    failedCalls: failed.reduce((n, f) => n + f.length, 0),
    agreement,
    grades,
  }
}
