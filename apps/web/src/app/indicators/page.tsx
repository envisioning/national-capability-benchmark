import { DIMENSIONS, DIMENSION_LABELS, INDICATORS, indicatorsFor } from '@ncb/core'
import { ClassBadge, Scroller, Section, Table, Td, Th } from '@/components/ui'

export default function IndicatorsPage() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length

  return (
    <>
      <Section
        title="Every indicator is on the record, including the missing ones"
        hint={`${INDICATORS.length} indicators. ${gaps} of them are declared gaps, where the model asks for something no adequate international dataset covers. Gaps stay here because they lower the confidence scores and because they are the collection agenda.`}
      >
        {DIMENSIONS.map((d) => (
          <div key={d} className="mb-8">
            <h3 className="mb-3 text-xl font-medium tracking-tight">{DIMENSION_LABELS[d]}</h3>
            <Scroller>
              <Table>
                <thead>
                  <tr>
                    <Th>Indicator</Th>
                    <Th>Class</Th>
                    <Th>Unit</Th>
                    <Th>Direction</Th>
                    <Th>Source</Th>
                    <Th align="right">Wealth prior</Th>
                    <Th>Note</Th>
                  </tr>
                </thead>
                <tbody>
                  {indicatorsFor(d).map((i) => (
                    <tr key={i.id} className={i.ingest === 'gap' ? 'opacity-70' : undefined}>
                      <Td>
                        {i.name}
                        {i.ingest === 'gap' ? (
                          <span className="ml-2 rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-xs text-[var(--muted)]">
                            no dataset
                          </span>
                        ) : null}
                      </Td>
                      <Td>
                        <ClassBadge value={i.measurementClass} />
                      </Td>
                      <Td dim>{i.unit}</Td>
                      <Td dim>{i.direction === 'higher_better' ? 'higher is better' : 'lower is better'}</Td>
                      <Td dim>
                        {i.source.url ? (
                          <a className="hover:underline" href={i.source.url}>
                            {i.source.publisher}
                          </a>
                        ) : (
                          i.source.publisher
                        )}
                      </Td>
                      <Td align="right" dim>
                        {i.wealthProxyPrior.toFixed(2)}
                      </Td>
                      <Td dim>{i.notes}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Scroller>
          </div>
        ))}
      </Section>
    </>
  )
}
