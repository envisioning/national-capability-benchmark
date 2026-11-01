import { SOVEREIGNTY_STAGES } from './schema.js'
import type { SovereigntyCase, SovereigntyFile, StageControl } from './schema.js'

const CONTROL_LABEL: Record<StageControl, string> = {
  verified: 'verified',
  partial: 'partial',
  foreign_dependent_operation: 'foreign-dependent',
  foreign_provision: 'foreign provision',
  unknown: 'unknown',
}

const STAGE_LABEL: Record<(typeof SOVEREIGNTY_STAGES)[number], string> = {
  research: 'Research',
  design_ip: 'Design and IP',
  components: 'Components',
  production: 'Production',
  deployment: 'Deployment',
  operation: 'Operation',
  maintenance: 'Maintenance',
  governance: 'Governance',
}

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ')

function renderCase(c: SovereigntyCase): string {
  const refs = (ids: readonly string[]) => (ids.length ? ids.map((id) => `[${id}](#${c.id.replace(/\./g, '-')}-${id})`).join(' ') : 'none')
  const lines: string[] = []
  lines.push(`### ${c.title}`, '')
  lines.push(`\`${c.id}\` · ${c.domain.replace(/_/g, ' ')} · status **${c.status}** (${refs(c.statusSourceIds)})${c.challengesNarrative ? ' · challenges the narrative' : ''}`, '')
  lines.push(c.function, '')
  lines.push('| Stage | Control | Basis | Sources |', '| --- | --- | --- | --- |')
  for (const s of c.stages) {
    lines.push(`| ${STAGE_LABEL[s.stage]} | ${CONTROL_LABEL[s.control]} | ${cell(s.basis)} | ${refs(s.sourceIds)} |`)
  }
  lines.push('')
  if (c.dependencies.length) {
    lines.push('**Dependencies**', '')
    for (const d of c.dependencies) {
      lines.push(`- *${d.kind.replace(/_/g, ' ')}, ${STAGE_LABEL[d.stage].toLowerCase()}*: ${d.item}. Supplier ${d.supplier} (${d.jurisdiction}). Substitutes: ${d.substitutes} Switching: ${d.switching} ${refs(d.sourceIds)}`)
    }
    lines.push('')
  }
  lines.push(`**Organisations.** ${c.organizations.map((o) => `${o.name} (${o.country}${o.institutionId ? `, \`${o.institutionId}\`` : ''}): ${o.role}`).join('; ')}.`, '')
  lines.push(`**Constraints.** ${c.constraints}`, '')
  if (c.counterevidence.length) {
    lines.push('**Counterevidence**', '')
    for (const x of c.counterevidence) lines.push(`- ${x.claim} ${refs(x.sourceIds)}`)
    lines.push('')
  }
  lines.push(`**Uncertainty.** ${c.uncertainty}`, '')
  lines.push('**Sources**', '')
  for (const s of c.sources) {
    const anchor = `<a id="${c.id.replace(/\./g, '-')}-${s.id}"></a>`
    const year = s.published ?? 'n.d.'
    const status = s.access === 'blocked' ? ` **Blocked**: ${s.note ?? ''}` : s.note ? ` ${s.note}` : ''
    const quote = s.quote ? ` "${s.quote}"` : ''
    lines.push(`- ${anchor}${s.id}. ${s.publisher}, [${s.title}](${s.url}), ${year}. Accessed ${s.accessed}.${quote}${status}`)
  }
  lines.push('')
  return lines.join('\n')
}

/**
 * Renders a country file as the human-readable catalogue. Generated, never
 * hand-edited: `pnpm bench sovereignty catalog` rewrites it from the JSON.
 */
export function renderSovereigntyCatalog(file: SovereigntyFile): string {
  const out: string[] = []
  const domains = new Set(file.cases.map((c) => c.domain))
  out.push(`# Sovereign technological capability: ${file.iso3} catalogue`, '')
  out.push(
    `*Generated from \`data/sovereignty/${file.iso3}.json\` by \`pnpm bench sovereignty catalog\`. Do not edit by hand. Framework: [FRAMEWORK.md](FRAMEWORK.md), decision ${file.framework}. Research only: nothing here is scored, ranked or published in the viewer.*`,
    '',
  )
  out.push(`${file.cases.length} records in ${domains.size} domains, updated ${file.updatedAt}. A record classifies one capability stage by stage; no row, column or count below is a sovereignty score.`, '')
  out.push('## Overview', '')
  out.push(`| Record | Status | ${SOVEREIGNTY_STAGES.map((s) => STAGE_LABEL[s]).join(' | ')} |`)
  out.push(`| --- | --- | ${SOVEREIGNTY_STAGES.map(() => '---').join(' | ')} |`)
  for (const c of file.cases) {
    const controls = SOVEREIGNTY_STAGES.map((stage) => CONTROL_LABEL[c.stages.find((s) => s.stage === stage)?.control ?? 'unknown'])
    out.push(`| ${c.title} | ${c.status} | ${controls.join(' | ')} |`)
  }
  out.push('')
  out.push('## Coverage and gaps', '', file.coverage, '')
  out.push('## Records', '')
  for (const c of file.cases) out.push(renderCase(c))
  return out.join('\n').trimEnd() + '\n'
}
