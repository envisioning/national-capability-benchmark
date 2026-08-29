import type { Metadata } from 'next'
import { GLOSSARY, GLOSSARY_GROUPS } from '@ncb/core'
import type { MeasurementClass } from '@ncb/core'
import { ClassBadge, Eyebrow, Headline, PageTitle, Section } from '@/components/ui'
import { GROUP_ICON, Icon } from '@/components/Icon'
import { PT_GLOSSARY, PT_GLOSSARY_GROUPS, PT_METHOD } from '@/lib/words'

export const metadata: Metadata = {
  title: 'Glossário, NCB',
  description: 'Termos usados pelo benchmark, explicados em linguagem simples.',
}

const CLASSES: MeasurementClass[] = ['C', 'I', 'O', 'P']

export default function PortugueseGlossaryPage() {
  return (
    <div lang="pt-BR">
      <Eyebrow>Glossário</Eyebrow>
      <PageTitle>O glossário explica os termos</PageTitle>
      <Headline>
        Esta página explica os termos usados pelo benchmark. Se uma letra, faixa ou linha tracejada não estiver clara, comece aqui.
      </Headline>

      <Section title="As quatro letras ao lado de cada indicador" hint="Cada indicador tem uma classe: C, I, O ou P. O registro mantém o rótulo para que ele possa ser verificado.">
        <dl className="max-w-3xl space-y-6">
          {CLASSES.map((c) => {
            const m = PT_METHOD.measurementClasses[c]
            return (
              <div key={c}>
                <dt className="mb-1 flex items-baseline gap-3"><ClassBadge value={c} /><span className="text-xl font-medium tracking-tight">{m.label}</span></dt>
                <dd className="text-lg leading-relaxed">{m.plain}{' '}<span className="text-[var(--muted)]">{m.example}</span></dd>
              </div>
            )
          })}
        </dl>
      </Section>

      {GLOSSARY_GROUPS.map((group) => {
        const entries = GLOSSARY.filter((e) => e.group === group)
        if (entries.length === 0) return null
        return (
          <Section key={group} title={PT_GLOSSARY_GROUPS[group] ?? group} icon={<Icon name={GROUP_ICON[group]} size={22} />}>
            <dl className="max-w-3xl space-y-8">
              {entries.map((entry) => {
                const e = PT_GLOSSARY[entry.term]
                if (!e) return null
                return (
                  <div key={entry.term} id={entry.term.toLowerCase().replace(/[^a-z]+/g, '-')}>
                    <dt className="mb-1 text-xl font-medium tracking-tight">{e.term}</dt>
                    <dd className="text-lg leading-relaxed">
                      <p className="text-[var(--muted)]">{e.short}</p>
                      <p className="mt-2">{e.full}</p>
                      {e.example ? <p className="mt-2 border-l-2 border-[var(--rule)] pl-4 text-[var(--muted)]">{e.example}</p> : null}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </Section>
        )
      })}
    </div>
  )
}
