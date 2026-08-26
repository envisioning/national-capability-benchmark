'use client'

import { DIMENSIONS, DIMENSION_LABELS, INDICATORS, indicatorsFor } from '@ncb/core'
import type { IndicatorDef } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { ClassBadge, Section } from '@/components/ui'

const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

export function IndicatorRegistry() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length

  return (
    <Section
      title="Every indicator is on the record, including the missing ones"
      hint={`${INDICATORS.length} indicators. ${gaps} of them are declared gaps, where the model asks for something no adequate international dataset covers. Gaps stay here because they lower the confidence scores and because they are the collection agenda. Click any heading to sort.`}
    >
      {DIMENSIONS.map((d) => (
        <div key={d} className="mb-10">
          <h3 className="mb-3 text-xl font-medium tracking-tight">{DIMENSION_LABELS[d]}</h3>
          <DataTable
            rows={indicatorsFor(d)}
            initialSort={{ key: 'name' }}
            caption={`${DIMENSION_LABELS[d]} indicators`}
            columns={[
              {
                key: 'name',
                label: 'Indicator',
                sort: (i: IndicatorDef) => i.name,
                render: (i: IndicatorDef) => (
                  <span className={i.ingest === 'gap' ? 'text-[var(--muted)]' : undefined}>
                    {i.name}
                    {i.ingest === 'gap' ? (
                      <span className="ml-2 rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-xs">
                        no dataset
                      </span>
                    ) : null}
                  </span>
                ),
              },
              {
                key: 'class',
                label: 'Class',
                sort: (i: IndicatorDef) => i.measurementClass,
                render: (i: IndicatorDef) => <ClassBadge value={i.measurementClass} />,
              },
              {
                key: 'unit',
                label: 'Unit',
                sort: (i: IndicatorDef) => i.unit,
                render: (i: IndicatorDef) => muted(i.unit),
              },
              {
                key: 'direction',
                label: 'Direction',
                sort: (i: IndicatorDef) => i.direction,
                render: (i: IndicatorDef) =>
                  muted(i.direction === 'higher_better' ? 'higher is better' : 'lower is better'),
              },
              {
                key: 'source',
                label: 'Source',
                sort: (i: IndicatorDef) => i.source.publisher,
                render: (i: IndicatorDef) =>
                  i.source.url ? (
                    <a className="text-[var(--muted)] hover:underline" href={i.source.url}>
                      {i.source.publisher}
                    </a>
                  ) : (
                    muted(i.source.publisher)
                  ),
              },
              {
                key: 'prior',
                label: 'Wealth prior',
                align: 'right',
                sort: (i: IndicatorDef) => i.wealthProxyPrior,
                render: (i: IndicatorDef) => muted(i.wealthProxyPrior.toFixed(2)),
              },
              { key: 'notes', label: 'Note', render: (i: IndicatorDef) => muted(i.notes) },
            ]}
          />
        </div>
      ))}
    </Section>
  )
}
