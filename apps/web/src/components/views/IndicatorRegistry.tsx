'use client'

import { DIMENSIONS, DIMENSION_LABELS, INDICATORS, indicatorsFor, isScored } from '@ncb/core'
import type { Dimension, IndicatorDef } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { ClassBadge, ClassLegend, Section } from '@/components/ui'
import Link from 'next/link'
import { capabilityHref } from '@/lib/links'

const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

export function IndicatorRegistry({ dimension }: { dimension?: Dimension } = {}) {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length
  const retired = INDICATORS.filter((i) => i.ingest === 'retired').length
  const dimensions: readonly Dimension[] = dimension ? [dimension] : DIMENSIONS

  return (
    <Section
      title={
        dimension ? (
          <Link href={capabilityHref(dimension)} className="hover:underline">
            {DIMENSION_LABELS[dimension]} indicators
          </Link>
        ) : (
          'Every indicator, including the missing ones'
        )
      }
      hint={
        dimension
          ? `${indicatorsFor(dimension).length} indicators define this capability. Gaps and retired rows remain because they lower confidence. Click a heading to sort.`
          : `${INDICATORS.length} indicators: ${gaps} gaps and ${retired} retired. Both lower confidence and shape the collection agenda. Click a heading to sort.`
      }
    >
      <ClassLegend />
      {dimensions.map((d) => (
        <div key={d} className="mb-10">
          <h3 className="mb-3 text-xl font-medium tracking-tight">
            <Link href={capabilityHref(d)} className="hover:underline">
              {DIMENSION_LABELS[d]}
            </Link>
          </h3>
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
                  /* scroll-mt clears the header when an agenda gap link lands
                   * here; target: lights the row the reader came for. */
                  <span
                    id={i.id}
                    className={`scroll-mt-24 target:bg-accent target:text-black target:px-1 ${isScored(i) ? '' : 'text-[var(--muted)]'}`}
                  >
                    {i.name}
                    {isScored(i) ? null : (
                      <span className="ml-2 rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-xs">
                        {i.ingest === 'gap' ? 'no dataset' : 'retired'}
                      </span>
                    )}
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
