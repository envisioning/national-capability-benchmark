/**
 * Reading structure back out of the internal documents.
 *
 * Every decision states the evidence that would overturn it and every artefact
 * states how bad it is. Those two claims are the reviewer's agenda, and they
 * are buried one per entry inside two long files. This pulls them out so one
 * page can list them, without either document gaining a second copy of
 * anything: the source stays authoritative and the index is derived. See D50.
 */

/**
 * The labels a decision uses for its falsification clause.
 *
 * "Overturned by" is the convention and 49 of 50 entries use it. One entry
 * writes the sentence out, so both are read. A label that matches nothing drops
 * the decision off the challenge page silently, which is the known cost in D50.
 */
const OVERTURN_LABELS = ['**Overturned by.**', '**What would overturn it.**']

export type DecisionChallenge = {
  /** D1, D49. The anchor on the decisions page. */
  id: string
  /** The choice, as its heading states it. */
  title: string
  /** What evidence would overturn it, in the decision's own words. */
  overturnedBy: string
}

export type ArtefactSeverity = 'high' | 'structural' | 'medium' | 'low' | 'closed'

export type OpenArtefact = {
  /** A1, A12. The anchor on the limits page. */
  id: string
  title: string
  severity: ArtefactSeverity
}

const SEVERITY_ORDER: ArtefactSeverity[] = ['high', 'structural', 'medium', 'low', 'closed']

/** The heading of an entry: `## D49 — Title` or `## A3 — Title`. */
const ENTRY = /^##\s+([A-Z]\d{1,3})\s*[—–-]\s*(.+?)\s*$/

/** Paragraphs of one entry, split on blank lines, in document order. */
function entries(markdown: string): Array<{ id: string; title: string; body: string[] }> {
  const out: Array<{ id: string; title: string; body: string[] }> = []
  let current: { id: string; title: string; body: string[] } | null = null
  let paragraph: string[] = []

  const closeParagraph = () => {
    if (paragraph.length > 0 && current) current.body.push(paragraph.join(' '))
    paragraph = []
  }

  for (const line of markdown.split('\n')) {
    const heading = line.match(ENTRY)
    if (heading) {
      closeParagraph()
      if (current) out.push(current)
      current = { id: heading[1] as string, title: heading[2] as string, body: [] }
      continue
    }
    if (line.trim() === '') {
      closeParagraph()
      continue
    }
    paragraph.push(line.trim())
  }
  closeParagraph()
  if (current) out.push(current)
  return out
}

/**
 * Every decision with the evidence that would overturn it, newest first.
 *
 * Newest first because the live argument is at the end of an append-only file,
 * and a reader looking for something to attack should meet the recent choices
 * before the settled ones.
 */
export function decisionChallenges(markdown: string): DecisionChallenge[] {
  const out: DecisionChallenge[] = []
  for (const entry of entries(markdown)) {
    if (!entry.id.startsWith('D')) continue
    const label = OVERTURN_LABELS.find((l) => entry.body.some((p) => p.startsWith(l)))
    const clause = label ? entry.body.find((p) => p.startsWith(label)) : undefined
    if (!label || !clause) continue
    out.push({
      id: entry.id,
      title: entry.title,
      overturnedBy: clause.slice(label.length).trim(),
    })
  }
  return out.reverse()
}

/** Every artefact that is still open, worst first. A closed one is dropped. */
export function openArtefacts(markdown: string): OpenArtefact[] {
  const out: OpenArtefact[] = []
  for (const entry of entries(markdown)) {
    if (!entry.id.startsWith('A')) continue
    const line = entry.body.find((p) => p.startsWith('**Severity:'))
    const word = line?.match(/\*\*Severity:\s*([a-z]+)/)?.[1]
    const severity = SEVERITY_ORDER.find((s) => s === word)
    if (!severity || severity === 'closed') continue
    out.push({ id: entry.id, title: entry.title, severity })
  }
  return out.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
}
