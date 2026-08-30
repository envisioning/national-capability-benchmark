import type { Metadata } from 'next'
import { GLOSSARY, GLOSSARY_GROUPS, MEASUREMENT_CLASS_MEANING } from '@ncb/core'
import type { MeasurementClass } from '@ncb/core'

export const metadata: Metadata = {
  title: 'Glossary, NCB',
  description: 'Terms used by the benchmark, explained in plain language.',
}
import { ClassBadge, Headline, PageTitle, Section } from '@/components/ui'
import { GROUP_ICON, Icon } from '@/components/Icon'

const CLASSES: MeasurementClass[] = ['C', 'I', 'O', 'P']

export default function GlossaryPage() {
  return (
    <>
      <PageTitle>What the terms mean</PageTitle>
      <Headline>
        This page explains the terms used by the benchmark. If a letter, band or dashed line is
        unclear, start here.
      </Headline>

      <Section
        title="The four letters beside every indicator"
        hint="Each indicator has a class: C, I, O or P. The registry keeps the label so it can be checked."
      >
        <dl className="max-w-3xl space-y-6">
          {CLASSES.map((c) => {
            const m = MEASUREMENT_CLASS_MEANING[c]
            return (
              <div key={c}>
                <dt className="mb-1 flex items-baseline gap-3">
                  <ClassBadge value={c} />
                  <span className="text-xl font-medium tracking-tight">{m.label}</span>
                </dt>
                <dd className="text-lg leading-relaxed">
                  {m.plain}{' '}
                  <span className="text-[var(--muted)]">{m.example}</span>
                </dd>
              </div>
            )
          })}
        </dl>
      </Section>

      {GLOSSARY_GROUPS.map((group) => {
        const entries = GLOSSARY.filter((e) => e.group === group)
        if (entries.length === 0) return null
        return (
          <Section
            key={group}
            title={group}
            icon={<Icon name={GROUP_ICON[group]} size={22} />}
          >
            <dl className="max-w-3xl space-y-8">
              {entries.map((e) => (
                <div key={e.term} id={e.term.toLowerCase().replace(/[^a-z]+/g, '-')}>
                  <dt className="mb-1 text-xl font-medium tracking-tight">{e.term}</dt>
                  <dd className="text-lg leading-relaxed">
                    <p className="text-[var(--muted)]">{e.short}</p>
                    <p className="mt-2">{e.full}</p>
                    {e.example ? (
                      <p className="mt-2 border-l-2 border-[var(--rule)] pl-4 text-[var(--muted)]">
                        {e.example}
                      </p>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        )
      })}
    </>
  )
}
