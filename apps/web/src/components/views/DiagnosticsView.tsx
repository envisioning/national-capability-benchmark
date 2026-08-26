'use client'

import { DIMENSION_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { Section } from '@/components/ui'
import type { Diagnostics } from '@ncb/core'

const name = (id: string) => INDICATORS_BY_ID[id]?.name ?? id
const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

export function DiagnosticsView({ diag }: { diag: Diagnostics }) {
  const n = diag.dimensionVsGdp[0]?.n ?? 0

  return (
    <>
      <Section
        title="Most dimensions still track income per head"
        hint={`A dimension that only reproduces GDP per capita is not measuring capability. These correlations run over ${n} countries, so read every coefficient as a hint.`}
      >
        <DataTable
          rows={diag.dimensionVsGdp}
          initialSort={{ key: 'pearson', dir: 'desc' }}
          caption="Dimension correlation with GDP per capita"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (d) => DIMENSION_LABELS[d.dimension],
              render: (d) => DIMENSION_LABELS[d.dimension],
            },
            {
              key: 'pearson',
              label: 'Pearson r',
              align: 'right',
              sort: (d) => d.pearson,
              render: (d) => d.pearson?.toFixed(3) ?? 'no data',
            },
            {
              key: 'spearman',
              label: 'Spearman',
              align: 'right',
              sort: (d) => d.spearman,
              render: (d) => muted(d.spearman?.toFixed(3) ?? 'no data'),
            },
            { key: 'n', label: 'n', align: 'right', sort: (d) => d.n, render: (d) => muted(d.n) },
          ]}
        />
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
        <DataTable
          rows={diag.gdpStrippedTest.perDimensionMeanAbsShift}
          initialSort={{ key: 'shift', dir: 'desc' }}
          caption="Score shift when wealth-correlated indicators are removed"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (r) => DIMENSION_LABELS[r.dimension],
              render: (r) => DIMENSION_LABELS[r.dimension],
            },
            {
              key: 'shift',
              label: 'Mean absolute shift',
              align: 'right',
              sort: (r) => r.meanAbsShift,
              render: (r) => r.meanAbsShift?.toFixed(2) ?? 'cannot be scored',
            },
            {
              key: 'rank',
              label: 'Countries changing rank',
              align: 'right',
              sort: (r) =>
                diag.gdpStrippedTest.rankChanges.find((x) => x.dimension === r.dimension)
                  ?.changedPositions ?? null,
              render: (r) =>
                muted(
                  diag.gdpStrippedTest.rankChanges.find((x) => x.dimension === r.dimension)
                    ?.changedPositions ?? 'no data',
                ),
            },
          ]}
        />
      </Section>

      <Section
        title="Some indicators are measuring money"
        hint="Correlation with log GDP per capita, next to the suspicion we wrote into the registry before looking. Where the two disagree, the registry was wrong."
      >
        <DataTable
          rows={diag.indicatorVsGdp}
          initialSort={{ key: 'r', dir: 'desc' }}
          caption="Indicator correlation with GDP per capita"
          columns={[
            {
              key: 'indicator',
              label: 'Indicator',
              sort: (i) => name(i.indicatorId),
              render: (i) => (
                <span className={i.flaggedAsWealthProxy ? undefined : 'text-[var(--muted)]'}>
                  {name(i.indicatorId)}
                </span>
              ),
            },
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (i) => DIMENSION_LABELS[i.dimension],
              render: (i) => muted(DIMENSION_LABELS[i.dimension]),
            },
            {
              key: 'class',
              label: 'Class',
              sort: (i) => i.measurementClass,
              render: (i) => muted(i.measurementClass),
            },
            {
              key: 'r',
              label: 'r vs log GDP pc',
              align: 'right',
              sort: (i) => (i.r === null ? null : Math.abs(i.r)),
              render: (i) => i.r?.toFixed(3) ?? 'no data',
            },
            {
              key: 'prior',
              label: 'Registry prior',
              align: 'right',
              sort: (i) => i.wealthProxyPrior,
              render: (i) => muted(i.wealthProxyPrior.toFixed(2)),
            },
          ]}
        />
      </Section>

      <Section
        title="Some indicators are carrying the same information"
        hint="Pairs correlating at 0.85 or above. A pair here is a candidate for removal. It is not proof that either one has to go."
      >
        <DataTable
          rows={diag.redundantIndicatorPairs}
          initialSort={{ key: 'r', dir: 'desc' }}
          caption="Redundant indicator pairs"
          columns={[
            { key: 'a', label: 'Indicator A', sort: (p) => name(p.a), render: (p) => name(p.a) },
            { key: 'b', label: 'Indicator B', sort: (p) => name(p.b), render: (p) => name(p.b) },
            {
              key: 'r',
              label: 'r',
              align: 'right',
              sort: (p) => (p.r === null ? null : Math.abs(p.r)),
              render: (p) => p.r?.toFixed(3) ?? 'no data',
            },
          ]}
        />
      </Section>

      <Section
        title="No two dimensions have collapsed into one"
        hint="Dimension pairs sorted by correlation. Anything at 0.9 or above is a candidate for merging."
      >
        <DataTable
          rows={diag.dimensionPairs}
          initialSort={{ key: 'r', dir: 'desc' }}
          caption="Dimension pair correlations"
          columns={[
            {
              key: 'a',
              label: 'Dimension A',
              sort: (p) => DIMENSION_LABELS[p.a as Dimension],
              render: (p) => DIMENSION_LABELS[p.a as Dimension],
            },
            {
              key: 'b',
              label: 'Dimension B',
              sort: (p) => DIMENSION_LABELS[p.b as Dimension],
              render: (p) => DIMENSION_LABELS[p.b as Dimension],
            },
            {
              key: 'r',
              label: 'r',
              align: 'right',
              sort: (p) => (p.r === null ? null : Math.abs(p.r)),
              render: (p) => p.r?.toFixed(3) ?? 'no data',
            },
          ]}
        />
      </Section>

      <Section
        title="Four dimensions are much better measured than the rest"
        hint="Subjectivity share counts perception proxies plus indicators with no dataset at all. Experimentation is the weakest: six of its eight indicators cannot be measured."
      >
        <DataTable
          rows={diag.measurability}
          initialSort={{ key: 'confidence', dir: 'desc' }}
          caption="Measurement quality by dimension"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (m) => DIMENSION_LABELS[m.dimension],
              render: (m) => DIMENSION_LABELS[m.dimension],
            },
            {
              key: 'defined',
              label: 'Indicators',
              align: 'right',
              sort: (m) => m.indicatorsDefined,
              render: (m) => muted(m.indicatorsDefined),
            },
            {
              key: 'observed',
              label: 'Observed',
              align: 'right',
              sort: (m) => m.indicatorsObserved,
              render: (m) => m.indicatorsObserved,
            },
            {
              key: 'gaps',
              label: 'Gaps',
              align: 'right',
              sort: (m) => m.gaps,
              render: (m) => muted(m.gaps),
            },
            {
              key: 'coverage',
              label: 'Mean coverage',
              align: 'right',
              sort: (m) => m.meanCoverage,
              render: (m) => m.meanCoverage.toFixed(2),
            },
            {
              key: 'confidence',
              label: 'Mean confidence',
              align: 'right',
              sort: (m) => m.meanConfidence,
              render: (m) => m.meanConfidence.toFixed(2),
            },
            {
              key: 'subjectivity',
              label: 'Subjectivity',
              align: 'right',
              sort: (m) => m.subjectivityShare,
              render: (m) => muted(m.subjectivityShare.toFixed(2)),
            },
          ]}
        />
      </Section>

      <Section
        title="This is the list Envisioning would have to collect itself"
        hint="Each of these is specified in the model, unmeasured, and already lowering the confidence scores. They stay in the registry so the gap is visible."
      >
        <DataTable
          rows={diag.dataGaps}
          initialSort={{ key: 'dimension' }}
          caption="Indicators with no adequate dataset"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (g) => DIMENSION_LABELS[g.dimension],
              render: (g) => muted(DIMENSION_LABELS[g.dimension]),
            },
            { key: 'name', label: 'Indicator', sort: (g) => g.name, render: (g) => g.name },
            {
              key: 'publisher',
              label: 'Nearest publisher',
              sort: (g) => g.publisher,
              render: (g) => muted(g.publisher),
            },
            { key: 'reason', label: 'Why it is not in yet', render: (g) => muted(g.reason) },
          ]}
        />
      </Section>
    </>
  )
}
