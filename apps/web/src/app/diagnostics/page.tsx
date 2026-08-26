import { DIMENSION_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { Empty, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { MISSING_DATA_HINT, loadDiagnostics } from '@/lib/data'

export const dynamic = 'force-dynamic'

const name = (id: string) => INDICATORS_BY_ID[id]?.name ?? id

export default async function DiagnosticsPage() {
  const diag = await loadDiagnostics()
  if (!diag) return <Empty hint={MISSING_DATA_HINT} />

  return (
    <>
      <Section
        title="Most dimensions still track income per head"
        hint="A dimension that only reproduces GDP per capita is not measuring capability. Ten countries give eight degrees of freedom, so read every coefficient here as a hint."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension</Th>
                <Th align="right">Pearson r</Th>
                <Th align="right">Spearman</Th>
                <Th align="right">n</Th>
              </tr>
            </thead>
            <tbody>
              {[...diag.dimensionVsGdp]
                .sort((a, b) => Math.abs(b.pearson ?? 0) - Math.abs(a.pearson ?? 0))
                .map((d) => (
                  <tr key={d.dimension}>
                    <Td>{DIMENSION_LABELS[d.dimension]}</Td>
                    <Td align="right">{d.pearson?.toFixed(3) ?? ''}</Td>
                    <Td align="right" dim>
                      {d.spearman?.toFixed(3) ?? ''}
                    </Td>
                    <Td align="right" dim>
                      {d.n}
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Two dimensions do not survive without wealth-correlated data"
        hint={`${diag.gdpStrippedTest.excluded.length} indicators correlate with log GDP per capita at 0.7 or above. This is the profile shift when they are removed.${
          diag.gdpStrippedTest.dimensionsEmptied.length
            ? ` ${diag.gdpStrippedTest.dimensionsEmptied
                .map((d: Dimension) => DIMENSION_LABELS[d])
                .join(' and ')} lose every measured indicator and cannot be scored at all without them.`
            : ''
        }`}
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension</Th>
                <Th align="right">Mean absolute shift</Th>
                <Th align="right">Countries changing rank</Th>
              </tr>
            </thead>
            <tbody>
              {diag.gdpStrippedTest.perDimensionMeanAbsShift.map((row) => (
                <tr key={row.dimension}>
                  <Td>{DIMENSION_LABELS[row.dimension]}</Td>
                  <Td align="right">{row.meanAbsShift?.toFixed(2) ?? ''}</Td>
                  <Td align="right" dim>
                    {diag.gdpStrippedTest.rankChanges.find((r) => r.dimension === row.dimension)
                      ?.changedPositions ?? ''}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Some indicators are measuring money"
        hint="Correlation with log GDP per capita, next to the suspicion we wrote into the registry before looking. Where the two disagree, the registry was wrong."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Indicator</Th>
                <Th>Dimension</Th>
                <Th>Class</Th>
                <Th align="right">r vs log GDP pc</Th>
                <Th align="right">Registry prior</Th>
              </tr>
            </thead>
            <tbody>
              {diag.indicatorVsGdp.slice(0, 30).map((i) => (
                <tr key={i.indicatorId} className={i.flaggedAsWealthProxy ? undefined : 'opacity-60'}>
                  <Td>{name(i.indicatorId)}</Td>
                  <Td dim>{DIMENSION_LABELS[i.dimension]}</Td>
                  <Td dim>{i.measurementClass}</Td>
                  <Td align="right">{i.r?.toFixed(3) ?? ''}</Td>
                  <Td align="right" dim>
                    {i.wealthProxyPrior.toFixed(2)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Some indicators are carrying the same information"
        hint="Pairs correlating at 0.85 or above across the ten countries. A pair here is a candidate for removal. It is not proof that either one has to go."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Indicator A</Th>
                <Th>Indicator B</Th>
                <Th align="right">r</Th>
              </tr>
            </thead>
            <tbody>
              {diag.redundantIndicatorPairs.slice(0, 30).map((p) => (
                <tr key={`${p.a}|${p.b}`}>
                  <Td>{name(p.a)}</Td>
                  <Td>{name(p.b)}</Td>
                  <Td align="right">{p.r?.toFixed(3) ?? ''}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="No two dimensions have collapsed into one"
        hint="Dimension pairs sorted by correlation. Anything at 0.9 or above is a candidate for merging."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension A</Th>
                <Th>Dimension B</Th>
                <Th align="right">r</Th>
              </tr>
            </thead>
            <tbody>
              {diag.dimensionPairs.slice(0, 20).map((p) => (
                <tr key={`${p.a}|${p.b}`}>
                  <Td>{DIMENSION_LABELS[p.a as Dimension]}</Td>
                  <Td>{DIMENSION_LABELS[p.b as Dimension]}</Td>
                  <Td align="right">{p.r?.toFixed(3) ?? ''}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Four dimensions are much better measured than the rest"
        hint="Subjectivity share counts perception proxies plus indicators with no dataset at all. Experimentation is the weakest: six of its eight indicators cannot be measured."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension</Th>
                <Th align="right">Indicators</Th>
                <Th align="right">Observed</Th>
                <Th align="right">Gaps</Th>
                <Th align="right">Mean coverage</Th>
                <Th align="right">Mean confidence</Th>
                <Th align="right">Subjectivity</Th>
              </tr>
            </thead>
            <tbody>
              {[...diag.measurability]
                .sort((a, b) => b.meanConfidence - a.meanConfidence)
                .map((m) => (
                  <tr key={m.dimension}>
                    <Td>{DIMENSION_LABELS[m.dimension]}</Td>
                    <Td align="right" dim>
                      {m.indicatorsDefined}
                    </Td>
                    <Td align="right">{m.indicatorsObserved}</Td>
                    <Td align="right" dim>
                      {m.gaps}
                    </Td>
                    <Td align="right">{m.meanCoverage.toFixed(2)}</Td>
                    <Td align="right">{m.meanConfidence.toFixed(2)}</Td>
                    <Td align="right" dim>
                      {m.subjectivityShare.toFixed(2)}
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="This is the list Envisioning would have to collect itself"
        hint="Each of these is specified in the model, unmeasured, and already lowering the confidence scores. They stay in the registry so the gap is visible."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension</Th>
                <Th>Indicator</Th>
                <Th>Nearest publisher</Th>
                <Th>Why it is not in yet</Th>
              </tr>
            </thead>
            <tbody>
              {diag.dataGaps.map((g) => (
                <tr key={g.indicatorId}>
                  <Td dim>{DIMENSION_LABELS[g.dimension]}</Td>
                  <Td>{g.name}</Td>
                  <Td dim>{g.publisher}</Td>
                  <Td dim>{g.reason}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>
    </>
  )
}
