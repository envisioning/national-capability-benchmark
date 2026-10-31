import { SOVEREIGNTY_STAGES, SovereigntyFile } from './schema.js'
import type { SovereigntyCase } from './schema.js'

/** Same shape as `Problem` in pipeline/validate.ts, kept local so this file stays browser-safe. */
export type SovereigntyProblem = { file: string; severity: 'error' | 'warning'; problem: string }

/** The catalogue floor SOV-2 set: below it the validator warns, never fails. */
export const SOVEREIGNTY_MIN_CASES = 12
export const SOVEREIGNTY_MIN_DOMAINS = 8
/** One record in three must challenge the sovereignty narrative (FRAMEWORK.md section 5). */
export const SOVEREIGNTY_CHALLENGE_EVERY = 3

/** A status that claims the capability works. It needs a fetched source. */
const MATURE = new Set(['deployed', 'demonstrated'])
/** Stages that only a working system can be in control of. */
const RUNNING_STAGES = new Set(['production', 'deployment', 'operation', 'maintenance'])

/**
 * Checks a parsed or raw country file against the schema and what the schema
 * cannot see: unique ids, all eight stages once and in order, every cited
 * source present, every classification other than `unknown` carried by a
 * fetched source, no claim of operational maturity without one, and every
 * institution id resolving in data/institutions. `institutionIds` is the set
 * of node ids in the country map and the global ledger.
 */
export function checkSovereigntyFile(
  raw: unknown,
  file: string,
  institutionIds: ReadonlySet<string>,
  options: { expectedIso3?: string; today?: string } = {},
): { data: SovereigntyFile | null; problems: SovereigntyProblem[] } {
  const problems: SovereigntyProblem[] = []
  const err = (problem: string) => problems.push({ file, severity: 'error', problem })
  const warn = (problem: string) => problems.push({ file, severity: 'warning', problem })

  const parsed = SovereigntyFile.safeParse(raw)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) err(`${issue.path.join('.')}: ${issue.message}`)
    return { data: null, problems }
  }
  const data = parsed.data
  const today = options.today ?? new Date().toISOString().slice(0, 10)
  if (options.expectedIso3 && data.iso3 !== options.expectedIso3) {
    err(`iso3 ${data.iso3} belongs in ${data.iso3}.json`)
  }

  const seen = new Set<string>()
  for (const c of data.cases) {
    if (seen.has(c.id)) err(`${c.id}: duplicate id`)
    seen.add(c.id)
    checkCase(c, data.iso3, institutionIds, today, err, warn)
  }

  const domains = new Set(data.cases.map((c) => c.domain))
  if (data.cases.length < SOVEREIGNTY_MIN_CASES) {
    warn(`${data.cases.length} cases, below the floor of ${SOVEREIGNTY_MIN_CASES}`)
  }
  if (domains.size < SOVEREIGNTY_MIN_DOMAINS) {
    warn(`${domains.size} domains, below the floor of ${SOVEREIGNTY_MIN_DOMAINS}`)
  }
  const challenging = data.cases.filter((c) => c.challengesNarrative).length
  if (challenging * SOVEREIGNTY_CHALLENGE_EVERY < data.cases.length) {
    warn(`${challenging} of ${data.cases.length} cases challenge the narrative; one in ${SOVEREIGNTY_CHALLENGE_EVERY} is the floor`)
  }
  return { data, problems }
}

function checkCase(
  c: SovereigntyCase,
  iso3: string,
  institutionIds: ReadonlySet<string>,
  today: string,
  err: (p: string) => void,
  warn: (p: string) => void,
): void {
  if (!c.id.startsWith(`${iso3.toLowerCase()}.sov.`)) err(`${c.id}: id must start with ${iso3.toLowerCase()}.sov.`)

  const sources = new Map<string, (typeof c.sources)[number]>()
  for (const s of c.sources) {
    if (sources.has(s.id)) err(`${c.id}: source ${s.id} listed twice`)
    sources.set(s.id, s)
    if (s.accessed > today) err(`${c.id}: source ${s.id} accessed ${s.accessed}, after today`)
    if (s.access === 'fetched' && !s.quote) warn(`${c.id}: source ${s.id} is fetched but carries no quote to audit against`)
  }
  if (c.reviewedAt > today) err(`${c.id}: reviewedAt ${c.reviewedAt} is after today`)

  const cited = new Set<string>()
  /** Resolves cited ids and returns how many are fetched. */
  const resolve = (where: string, ids: readonly string[]): number => {
    let fetched = 0
    for (const id of ids) {
      cited.add(id)
      const s = sources.get(id)
      if (!s) err(`${c.id}: ${where} cites ${id}, which is not in sources`)
      else if (s.access === 'blocked') err(`${c.id}: ${where} cites ${id}, which was blocked and supports nothing`)
      else fetched++
    }
    return fetched
  }

  if (resolve('status', c.statusSourceIds) === 0) {
    if (MATURE.has(c.status)) err(`${c.id}: status ${c.status} claims a working capability with no fetched source`)
    else warn(`${c.id}: status ${c.status} has no fetched source`)
  }

  const order = c.stages.map((s) => s.stage)
  for (const stage of SOVEREIGNTY_STAGES) {
    const n = order.filter((s) => s === stage).length
    if (n === 0) err(`${c.id}: stage ${stage} missing; an unassessed stage is unknown, never absent`)
    if (n > 1) err(`${c.id}: stage ${stage} listed ${n} times`)
  }
  if (order.length === SOVEREIGNTY_STAGES.length && order.some((s, i) => s !== SOVEREIGNTY_STAGES[i])) {
    warn(`${c.id}: stages out of lifecycle order`)
  }
  for (const s of c.stages) {
    const fetched = resolve(`stage ${s.stage}`, s.sourceIds)
    if (s.control !== 'unknown' && fetched === 0) {
      err(`${c.id}: stage ${s.stage} is ${s.control} with no fetched source; unsourced is unknown`)
    }
    if (s.control === 'verified' && c.status === 'proposed' && s.stage !== 'research') {
      err(`${c.id}: stage ${s.stage} is verified on a proposal; a plan earns verified at research only`)
    } else if (s.control === 'verified' && c.status === 'pilot' && RUNNING_STAGES.has(s.stage)) {
      err(`${c.id}: stage ${s.stage} is verified on a pilot; only a working system can be in control there`)
    }
  }
  if (c.stages.some((s) => s.control === 'verified') && c.counterevidence.length === 0) {
    warn(`${c.id}: verified stages and no counterevidence; record that none was found in uncertainty, or find some`)
  }

  c.dependencies.forEach((d, i) => {
    if (resolve(`dependency ${i + 1}`, d.sourceIds) === 0) err(`${c.id}: dependency ${i + 1} (${d.item}) has no fetched source`)
  })
  c.counterevidence.forEach((x, i) => resolve(`counterevidence ${i + 1}`, x.sourceIds))

  for (const o of c.organizations) {
    if (o.institutionId && !institutionIds.has(o.institutionId)) {
      err(`${c.id}: organisation ${o.name} names institution ${o.institutionId}, which is not in data/institutions`)
    }
  }
  for (const s of c.sources) {
    if (s.access === 'fetched' && !cited.has(s.id)) warn(`${c.id}: source ${s.id} is never cited`)
  }
}
