'use client'

import {
  DIMENSION_LABELS,
  DIMENSION_OVERLAP_THRESHOLD,
  INDICATORS_BY_ID,
  REDUNDANCY_THRESHOLD,
  WEALTH_CORRELATION_THRESHOLD,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DataTable } from '@/components/DataTable'
import { CapabilityLink } from '@/components/CapabilityLink'
import { Eyebrow, Headline, Meta, PageTitle, PanelProvenanceNote, Section } from '@/components/ui'
import type { Diagnostics } from '@ncb/core'
import { capitalize, countWord } from '@/lib/words'

const name = (id: string) => INDICATORS_BY_ID[id]?.name ?? id
const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

/**
 * Every section heading below is computed from the diagnostics it sits above.
 * A hard-coded finding goes stale the first time the data moves, and a page
 * whose headings can contradict its own tables costs more credibility than the
 * findings earn.
 */
export function DiagnosticsView({ diag }: { diag: Diagnostics }) {
  const n = diag.dimensionVsGdp[0]?.n ?? 0
  const wealthTracking = diag.dimensionVsGdp.filter(
    (d) => d.pearson !== null && Math.abs(d.pearson) >= WEALTH_CORRELATION_THRESHOLD,
  ).length
  const emptied = diag.gdpStrippedTest.dimensionsEmptied
  const byConfidence = [...diag.measurability].sort((a, b) => b.meanConfidence - a.meanConfidence)
  const best = byConfidence[0]
  const worst = byConfidence[byConfidence.length - 1]
  const panel = diag.panelVsGdp
  const panelTracking = panel?.perDimension.filter((d) => d.flaggedAsWealthProxy) ?? []
  const panelBackfill = panel?.perDimension.filter((d) => d.backfillCandidate) ?? []
  const gaps = diag.dataGaps.filter((g) => g.status === 'gap')
  const retired = diag.dataGaps.filter((g) => g.status === 'retired')

  return (
    <>
      <Eyebrow>Diagnostics</Eyebrow>
      <PageTitle>The model is tested against its own failure modes</PageTitle>
      <Headline>
        These checks ask whether the benchmark measures capability, income per head, duplicate data
        or nothing at all. Failed tests stay visible.
      </Headline>
      <p className="mb-12 flex flex-wrap gap-2">
        <Meta icon="calendar">computed {diag.generatedAt.slice(0, 10)}</Meta>
        <Meta icon="globe">{n} countries</Meta>
      </p>

      <Section
        title={`${countWord(wealthTracking)[0]?.toUpperCase()}${countWord(wealthTracking).slice(1)} of nine dimensions track income per head`}
        hint={`At ${WEALTH_CORRELATION_THRESHOLD} or more, a correlation with log GDP per capita counts as tracking income. These results use ${n} countries; treat coefficients as hints.`}
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
              render: (d) => <CapabilityLink dimension={d.dimension} />,
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
        title={
          emptied.length === 0
            ? 'Every dimension survives without wealth-correlated data'
            : `${emptied.map((d: Dimension) => DIMENSION_LABELS[d]).join(' and ')} ${emptied.length === 1 ? 'fails' : 'fail'} without wealth-correlated data`
        }
        hint={`${diag.gdpStrippedTest.excluded.length} indicators meet the ${WEALTH_CORRELATION_THRESHOLD} correlation threshold. This table shows the shift after removing them.${
          emptied.length
            ? ` ${emptied.map((d: Dimension) => DIMENSION_LABELS[d]).join(' and ')} lose every measured indicator.`
            : ' Every dimension keeps at least one measured indicator.'
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
              render: (r) => <CapabilityLink dimension={r.dimension} />,
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
        hint="Correlation with log GDP per capita beside the registry's prior. Differences show where that prior was wrong."
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
              render: (i) => muted(<CapabilityLink dimension={i.dimension} />),
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
        title="A row can carry the dimension's wealth signal"
        hint="Each row removes one indicator. A positive delta means the dimension tracks income more without it."
      >
        <DataTable
          rows={diag.wealthAttribution}
          initialSort={{ key: 'delta', dir: 'desc' }}
          caption="What each indicator does to its dimension's correlation with GDP per capita"
          columns={[
            {
              key: 'indicator',
              label: 'Indicator',
              sort: (i) => name(i.indicatorId),
              render: (i) => name(i.indicatorId),
            },
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (i) => DIMENSION_LABELS[i.dimension],
              render: (i) => muted(<CapabilityLink dimension={i.dimension} />),
            },
            {
              key: 'with',
              label: 'Dimension r',
              align: 'right',
              sort: (i) => i.dimensionR,
              render: (i) => i.dimensionR?.toFixed(3) ?? 'no data',
            },
            {
              key: 'without',
              label: 'Without this row',
              align: 'right',
              sort: (i) => i.dimensionRWithout,
              render: (i) => muted(i.dimensionRWithout?.toFixed(3) ?? 'no data'),
            },
            {
              key: 'delta',
              label: 'Delta',
              align: 'right',
              sort: (i) => i.delta,
              render: (i) =>
                i.delta === null ? (
                  muted('no data')
                ) : (
                  <span className={i.delta > 0 ? undefined : 'text-[var(--muted)]'}>
                    {i.delta > 0 ? '+' : ''}
                    {i.delta.toFixed(3)}
                  </span>
                ),
            },
          ]}
        />
      </Section>

      {panel && panel.perDimension.length > 0 && (
        <Section
          title={
            panelTracking.length === 0
              ? 'The panel estimates do not track income per head'
              : `${capitalize(countWord(panelTracking.length))} of nine panel estimates track income per head`
          }
          hint={`The panel reads the same published record as the indicators, so it is not independent evidence. It gets the same GDP test, with same-country indicator results beside it.${
            panelBackfill.length > 0
              ? ` ${panelBackfill.map((d) => DIMENSION_LABELS[d.dimension]).join(' and ')} have no indicator score, so the panel is the only candidate.`
              : ''
          }`}
        >
          <PanelProvenanceNote provenance={panel.provenance} panelists={panel.panelists} />
          <DataTable
            rows={panel.perDimension}
            initialSort={{ key: 'panelR', dir: 'desc' }}
            caption="Panel estimates correlated with GDP per capita, against the indicators for the same countries"
            columns={[
              {
                key: 'dimension',
                label: 'Dimension',
                sort: (d) => DIMENSION_LABELS[d.dimension],
                render: (d) => <CapabilityLink dimension={d.dimension} />,
              },
              {
                key: 'panelR',
                label: 'Panel r',
                align: 'right',
                sort: (d) => d.panelR,
                render: (d) => d.panelR?.toFixed(3) ?? 'no estimate',
              },
              {
                key: 'indicatorR',
                label: 'Indicator r',
                align: 'right',
                sort: (d) => d.indicatorR,
                render: (d) =>
                  d.indicatorR === null
                    ? muted('no score published')
                    : muted(d.indicatorR.toFixed(3)),
              },
              {
                key: 'delta',
                label: 'Delta',
                align: 'right',
                sort: (d) => d.delta,
                render: (d) =>
                  d.delta === null ? (
                    muted('no data')
                  ) : (
                    <span className={d.delta > 0 ? undefined : 'text-[var(--muted)]'}>
                      {d.delta > 0 ? '+' : ''}
                      {d.delta.toFixed(3)}
                    </span>
                  ),
              },
              {
                key: 'panelN',
                label: 'n',
                align: 'right',
                sort: (d) => d.panelN,
                render: (d) => muted(d.panelN),
              },
            ]}
          />
        </Section>
      )}

      <Section
        title={
          diag.redundantIndicatorPairs.length === 0
            ? 'No indicator pair is carrying the same information'
            : 'Some indicators are carrying the same information'
        }
        hint={`Pairs at ${REDUNDANCY_THRESHOLD} correlation or above. They are candidates for review, not automatic removals.`}
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
        title={
          diag.duplicateDimensionCandidates.length === 0
            ? 'No two dimensions have collapsed into one'
            : `${countWord(diag.duplicateDimensionCandidates.length)[0]?.toUpperCase()}${countWord(diag.duplicateDimensionCandidates.length).slice(1)} dimension pair${diag.duplicateDimensionCandidates.length === 1 ? ' has' : 's have'} collapsed into one`
        }
        hint={`Dimension pairs sorted by correlation. Pairs at ${DIMENSION_OVERLAP_THRESHOLD} or above are candidates for review.`}
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
              render: (p) => <CapabilityLink dimension={p.a as Dimension} />,
            },
            {
              key: 'b',
              label: 'Dimension B',
              sort: (p) => DIMENSION_LABELS[p.b as Dimension],
              render: (p) => <CapabilityLink dimension={p.b as Dimension} />,
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
        title={
          best && worst
            ? `Evidence is strongest for ${DIMENSION_LABELS[best.dimension]} and weakest for ${DIMENSION_LABELS[worst.dimension]}`
            : 'Evidence quality varies across the nine dimensions'
        }
        hint={`Subjectivity share counts perception proxies and indicators with no dataset.${
          worst
            ? ` ${DIMENSION_LABELS[worst.dimension]} is the weakest: ${countWord(worst.indicatorsObserved)} of its ${countWord(worst.indicatorsDefined)} indicators ${worst.indicatorsObserved === 1 ? 'is' : 'are'} observed and its mean confidence is ${worst.meanConfidence.toFixed(2)}.`
            : ''
        }`}
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
              render: (m) => <CapabilityLink dimension={m.dimension} />,
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
        title={`${Math.round(diag.outOfFrame.share * 100)}% of observed values clamp at the frame edge`}
        hint={`${diag.outOfFrame.clampedCells} of ${diag.outOfFrame.observedCells} observed cells fall outside the frame and clamp to 0 or 100. These are historical or late-arriving values.`}
      >
        <DataTable
          rows={diag.outOfFrame.perCountry.slice(0, 15)}
          initialSort={{ key: 'cells', dir: 'desc' }}
          caption="Clamped cells by country"
          columns={[
            {
              key: 'country',
              label: 'Country',
              sort: (c) => c.country,
              render: (c) => c.country,
            },
            {
              key: 'cells',
              label: 'Clamped cells',
              align: 'right',
              sort: (c) => c.clampedCells,
              render: (c) => c.clampedCells,
            },
          ]}
        />
      </Section>

      <Section
        title="These indicators still need data"
        hint="The model specifies them, but no adequate dataset covers them. They stay in the registry and lower confidence."
      >
        <DataTable
          rows={gaps}
          initialSort={{ key: 'dimension' }}
          caption="Indicators with no adequate dataset"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (g) => DIMENSION_LABELS[g.dimension],
              render: (g) => muted(<CapabilityLink dimension={g.dimension} />),
            },
            { key: 'name', label: 'Indicator', sort: (g) => g.name, render: (g) => g.name },
            {
              key: 'publisher',
              label: 'Nearest publisher',
              sort: (g) => g.publisher,
              render: (g) => muted(g.publisher),
            },
              { key: 'reason', label: 'Why it is missing', render: (g) => muted(g.reason) },
          ]}
        />
      </Section>

      {retired.length > 0 ? (
        <Section
          title="These datasets were rejected"
          hint="Retired rows stay in the registry and lower confidence like gaps. The reason for each rejection is recorded."
        >
          <DataTable
            rows={retired}
            initialSort={{ key: 'dimension' }}
            caption="Datasets examined and rejected"
            columns={[
              {
                key: 'dimension',
                label: 'Dimension',
                sort: (g) => DIMENSION_LABELS[g.dimension],
                render: (g) => muted(<CapabilityLink dimension={g.dimension} />),
              },
              { key: 'name', label: 'Indicator', sort: (g) => g.name, render: (g) => g.name },
              {
                key: 'publisher',
                label: 'Publisher',
                sort: (g) => g.publisher,
                render: (g) => muted(g.publisher),
              },
              { key: 'reason', label: 'Why it was rejected', render: (g) => muted(g.reason) },
            ]}
          />
        </Section>
      ) : null}
    </>
  )
}
