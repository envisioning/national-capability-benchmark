import type { Metadata } from 'next'
import { GLOSSARY, GLOSSARY_GROUPS, MEASUREMENT_CLASS_MEANING } from '@ncb/core'
import type { MeasurementClass } from '@ncb/core'

export const metadata: Metadata = {
  title: 'Glossary, NCB',
  description: 'Every term the benchmark uses, defined in plain words for a first-time reader.',
}
import { ClassBadge, Eyebrow, Headline, Highlight, PageTitle, Section } from '@/components/ui'
import { GROUP_ICON, Icon } from '@/components/Icon'

const CLASSES: MeasurementClass[] = ['C', 'I', 'O', 'P']

export default function GlossaryPage() {
  return (
    <>
      <Eyebrow>Every term, in plain words</Eyebrow>
      <PageTitle>Nothing here needs prior knowledge</PageTitle>
      <Headline>
        This page defines every term the benchmark uses, including the ones it invented. If a page
        shows you a letter, a band or a dashed line and you have to guess what it means, that is a{' '}
        <Highlight>failure</Highlight> of this page.
      </Headline>

      <Section
        title="The four letters beside every indicator"
        hint="Each indicator is labeled with what it actually measures. This label is stored in the data, so it can be argued with. The benchmark prefers C, then I, and uses O and P only where nothing better exists."
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
