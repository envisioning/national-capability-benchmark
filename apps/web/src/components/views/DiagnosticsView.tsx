'use client'

import {
  DIMENSION_LABELS,
  DIMENSION_OVERLAP_THRESHOLD,
  RESIDUAL_INCOME_SHARE_BANDS,
  RESIDUAL_LOO_FRAGILE_SD,
  RESIDUAL_MOVED_POINTS,
  RESIDUAL_STABILITY_BANDS,
  INDICATORS_BY_ID,
  REDUNDANCY_THRESHOLD,
  WEALTH_CORRELATION_THRESHOLD,
} from '@ncb/core'
import type { Dimension, FactorHistoryRelease, FactorSolution } from '@ncb/core'
import Link from 'next/link'
import { DataTable } from '@/components/DataTable'
import { CapabilityLink } from '@/components/CapabilityLink'
import { ClassBadge, Headline, Meta, PageTitle, PanelProvenanceNote, Section } from '@/components/ui'
import type { Diagnostics } from '@ncb/core'
import { capitalize, countWord } from '@/lib/words'
import { decisionHref, exploreHref } from '@/lib/links'
import { readFactorTest } from '@/lib/factor'
import { readResidualStructure } from '@/lib/residual'
import type { ResidualReading } from '@/lib/residual'

const name = (id: string) => INDICATORS_BY_ID[id]?.name ?? id
const muted = (v: React.ReactNode) => <span className="text-[var(--muted)]">{v}</span>

/**
 * Every section heading below is computed from the diagnostics it sits above.
 * A hard-coded finding goes stale the first time the data moves, and a page
 * whose headings can contradict its own tables costs more credibility than the
 * findings earn.
 */
export function DiagnosticsView({
  diag,
  factorHistory,
}: {
  diag: Diagnostics
  factorHistory: FactorHistoryRelease[]
}) {
  const factor = readFactorTest(diag)
  const residual = readResidualStructure(diag)
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
  const familyRows = diag.familyBalance.flatMap((fb) =>
    fb.families.map((f) => ({ ...f, dimension: fb.dimension })),
  )
  const emptyFamilies = familyRows.filter((f) => f.indicatorsObserved === 0)
  const singleFamily = diag.familyBalance.filter(
    (fb) => fb.countriesScored > 0 && fb.countriesOnOneFamily === fb.countriesScored,
  )
  const gaps = diag.dataGaps.filter((g) => g.status === 'gap')
  const retired = diag.dataGaps.filter((g) => g.status === 'retired')

  return (
    <>
      <PageTitle>Tests the model has to pass</PageTitle>
      <Headline>
        They check for income bias, duplicate indicators, weak evidence and scores that change
        sharply when inputs change.
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

      {factor ? (
        <Section
          title={`One factor carries ${factor.sharePct} of the variation`}
          hint={`Principal components of the dimension scores over ${factor.solution.countries} countries with ${factor.scope} scored. Chance at that size gives ${factor.chanceMeanPct}, ${factor.chanceP95Pct} at the 95th percentile. Treat it as a hint at ${factor.solution.countries} countries.`}
        >
          <div className="mb-6 max-w-3xl space-y-4 text-lg leading-relaxed">
            <p>{factor.shareSentence}</p>
            {factor.incomeSentence ? <p>{factor.incomeSentence}</p> : null}
          </div>
          <FactorTables solution={factor.solution} label="All nine dimensions" />
          {diag.factorStructure.nearFull && factor.basis === 'nearFull' && diag.factorStructure.complete ? (
            <div className="mt-8">
              <p className="mb-4 max-w-3xl text-lg leading-relaxed">
                With all nine dimensions only {diag.factorStructure.complete.countries} countries
                remain, under the floor of {diag.factorStructure.minCountries}. On those the first
                factor carries {(diag.factorStructure.complete.firstFactorShare * 100).toFixed(1)}%.
              </p>
              <FactorTables solution={diag.factorStructure.complete} label="All nine, complete cases" />
            </div>
          ) : null}
          {factorHistory.length > 0 ? (
            <div className="mt-8">
              <DataTable
                rows={factorHistory}
                caption="The same test at every dataset release"
                columns={[
                  {
                    key: 'version',
                    label: 'Dataset',
                    render: (r) => r.version,
                  },
                  {
                    key: 'dims',
                    label: 'Dimensions',
                    align: 'right',
                    render: (r) => muted(r.dimensions.length),
                  },
                  { key: 'n', label: 'Countries', align: 'right', render: (r) => muted(r.countries) },
                  {
                    key: 'share',
                    label: 'First-factor share',
                    align: 'right',
                    render: (r) => `${(r.firstFactorShare * 100).toFixed(1)}%`,
                  },
                  {
                    key: 'chance',
                    label: 'Chance mean',
                    align: 'right',
                    render: (r) => muted(`${(r.chance.mean * 100).toFixed(1)}%`),
                  },
                  {
                    key: 'p95',
                    label: 'Chance 95th',
                    align: 'right',
                    render: (r) => muted(`${(r.chance.p95 * 100).toFixed(1)}%`),
                  },
                  {
                    key: 'income',
                    label: 'r with income',
                    align: 'right',
                    render: (r) =>
                      r.income ? `${Math.abs(r.income.r).toFixed(2)} (${r.income.n})` : 'no data',
                  },
                ]}
              />
              <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
                Read from each release&apos;s committed output. A release with fewer than nine
                dimensions had too few countries with all nine scored, so it reads the dimensions
                scored for at least {Math.round(diag.factorStructure.nearFullCoverage * 100)}% of
                countries.
              </p>
            </div>
          ) : null}
        </Section>
      ) : null}

      {residual ? <ResidualSection reading={residual} /> : null}

      <Section
        title={
          emptied.length === 0
            ? 'Every dimension survives without income-linked data'
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
        title="Indicators that track income"
        hint="This compares each indicator with log GDP per capita and with the registry's prior."
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
              render: (i) => <ClassBadge value={i.measurementClass} />,
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
        title="When one indicator drives the income signal"
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
            ? 'No indicator pairs are redundant'
            : 'Some indicator pairs overlap'
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
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          The same pairs are{' '}
          <Link href={exploreHref('measure')} className="underline underline-offset-4">
            drawn as lanes
          </Link>
          , each indicator placed by its correlation with income and every pair above joined by a
          line.
        </p>
      </Section>

      <Section
        title={
          diag.duplicateDimensionCandidates.length === 0
            ? 'The dimensions remain distinct'
            : `${countWord(diag.duplicateDimensionCandidates.length)[0]?.toUpperCase()}${countWord(diag.duplicateDimensionCandidates.length).slice(1)} dimension pair${diag.duplicateDimensionCandidates.length === 1 ? ' overlaps' : 's overlap'}`
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

      {familyRows.length > 0 && (
        <Section
          title={
            emptyFamilies.length > 0
              ? `${capitalize(countWord(emptyFamilies.length))} indicator ${emptyFamilies.length === 1 ? 'family has' : 'families have'} no data at all`
              : 'Every indicator family has data behind it'
          }
          hint="A dimension can ask two questions under one name, and several readings of one question are not several independent signals. Scoring counts every observed indicator equally either way. This table says which family the evidence came from."
        >
          <DataTable
            rows={familyRows}
            initialSort={{ key: 'observed', dir: 'asc' }}
            caption="Indicator families inside a dimension"
            columns={[
              {
                key: 'dimension',
                label: 'Dimension',
                sort: (f) => DIMENSION_LABELS[f.dimension],
                render: (f) => <CapabilityLink dimension={f.dimension} />,
              },
              {
                key: 'family',
                label: 'Family',
                sort: (f) => f.family,
                render: (f) => capitalize(f.family),
              },
              {
                key: 'defined',
                label: 'Indicators',
                align: 'right',
                sort: (f) => f.indicatorsDefined,
                render: (f) => muted(f.indicatorsDefined),
              },
              {
                key: 'observed',
                label: 'Observed',
                align: 'right',
                sort: (f) => f.indicatorsObserved,
                render: (f) =>
                  f.indicatorsObserved === 0 ? muted('none') : f.indicatorsObserved,
              },
            ]}
          />
          {singleFamily.length > 0 && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
              {singleFamily
                .map(
                  (fb) =>
                    `Every scored country rests on one family in ${DIMENSION_LABELS[fb.dimension]}.`,
                )
                .join(' ')}
            </p>
          )}
        </Section>
      )}

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
        title="Indicators with no data"
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
          title="Datasets we rejected"
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

/** Eigenvalues and loadings of one factor solution, and the countries it left out. */
function FactorTables({ solution, label }: { solution: FactorSolution; label: string }) {
  return (
    <div>
      <DataTable
        rows={solution.loadings}
        initialSort={{ key: 'loading', dir: 'desc' }}
        caption={`${label}: loadings on the first factor, ${solution.countries} countries`}
        columns={[
          {
            key: 'dimension',
            label: 'Dimension',
            sort: (r) => DIMENSION_LABELS[r.dimension],
            render: (r) => <CapabilityLink dimension={r.dimension} />,
          },
          {
            key: 'loading',
            label: 'Loading',
            align: 'right',
            sort: (r) => r.loading,
            render: (r) => r.loading.toFixed(3),
          },
        ]}
      />
      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        A loading is the dimension&apos;s correlation with the first factor. Eigenvalues, largest
        first: {solution.eigenvalues.map((v) => v.toFixed(2)).join(', ')}. They sum to{' '}
        {solution.dimensions.length}, and the first over {solution.dimensions.length} is the share.{' '}
        {solution.dropped.length
          ? `Left out because a dimension has no score: ${solution.dropped
              .map((d) => `${d.iso3} (${d.missing.map((m) => DIMENSION_LABELS[m]).join(', ')})`)
              .join('; ')}.`
          : 'No country was left out.'}
      </p>
    </div>
  )
}

const READINGS: Record<string, string> = {
  structure: 'structure',
  none: 'no structure',
  differ: 'shapes differ',
  alike: 'peers alike',
  noise: 'noise',
  stable: 'stable',
  mixed: 'mixed',
  churning: 'churning',
  untested: 'untested',
  robust: 'robust',
  fragile: 'fragile',
  most: 'most',
  part: 'part',
  little: 'little',
}

/**
 * The four aggregate tests of what is left after income (D138). Every figure
 * is a statistic over countries: the structure holds no country's residual,
 * and this section prints none.
 */
function ResidualSection({ reading }: { reading: ResidualReading }) {
  const { rs, n } = reading
  const a = rs.structure
  const b = rs.peers
  const c = rs.stability.releases
  const loo = rs.stability.leaveOneOut
  const d = rs.incomeShare
  const f2 = (x: number) => x.toFixed(2)
  const p1 = (x: number) => `${(x * 100).toFixed(1)}%`
  const title =
    a?.reading === 'structure'
      ? 'What is left after income still moves together'
      : 'What is left after income looks like noise'

  const peerRows = b
    ? [
        {
          test: 'Peer distance against peers picked without regard to income',
          observed: f2(b.observedMean),
          baseline: `${f2(b.incomeNull.mean)} (5th ${f2(b.incomeNull.p5)}, 95th ${f2(b.incomeNull.p95)})`,
          rule: 'below the 5th reads peers alike',
        },
        {
          test: 'Shape pattern share against leftovers dealt out at random',
          observed: p1(b.shapeShare),
          baseline: `${p1(b.shapeNull.mean)} (95th ${p1(b.shapeNull.p95)})`,
          rule: 'above the 95th reads shapes differ',
        },
        {
          test: 'Peer distance against leftovers dealt out at random',
          observed: f2(b.observedMean),
          baseline: `${f2(b.noiseFloor.mean)} (5th ${f2(b.noiseFloor.p5)}, 95th ${f2(b.noiseFloor.p95)})`,
          rule: 'descriptive, not read',
        },
        {
          test: 'Countries beyond their own random 95th',
          observed: p1(b.shareBeyond),
          baseline: `${p1(b.shareNull.mean)} (95th ${p1(b.shareNull.p95)})`,
          rule: 'descriptive, not read',
        },
      ]
    : []

  return (
    <Section
      title={title}
      hint={`Four tests on the wealth residual over the ${n} countries with all nine capabilities and an income figure, with every rule fixed before the first run. Treat each as a hint at ${n} countries. No country's residual is published.`}
    >
      <div className="mb-6 max-w-3xl space-y-4 text-lg leading-relaxed">
        {reading.strongClaimSentence ? <p>{reading.strongClaimSentence}</p> : null}
        {reading.weakClaimSentence ? <p>{reading.weakClaimSentence}</p> : null}
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          The weaker claim holds when shapes differ and the release test does not churn; it fails
          when peers are alike, or when there is no structure and the shapes read as noise; it is
          mixed otherwise. Rules and their order are in{' '}
          <Link href={decisionHref('D138')} className="underline underline-offset-4">
            D138
          </Link>
          .
        </p>
      </div>

      {a ? (
        <div className="mt-8">
          <h3 className="mb-3 text-xl font-medium tracking-tight">
            Does what is left move together? Reads {READINGS[a.reading]}
          </h3>
          {reading.structureSentence ? (
            <p className="mb-4 max-w-3xl text-lg leading-relaxed">{reading.structureSentence}</p>
          ) : null}
          <DataTable
            rows={a.loadings}
            initialSort={{ key: 'loading', dir: 'desc' }}
            caption={`Loadings of the residuals on their first factor, ${a.countries} countries`}
            columns={[
              {
                key: 'dimension',
                label: 'Dimension',
                sort: (r) => DIMENSION_LABELS[r.dimension],
                render: (r) => <CapabilityLink dimension={r.dimension} />,
              },
              {
                key: 'loading',
                label: 'Loading',
                align: 'right',
                sort: (r) => r.loading,
                render: (r) => r.loading.toFixed(3),
              },
            ]}
          />
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
            First-factor share {p1(a.firstFactorShare)}. Eigenvalues, largest first:{' '}
            {a.eigenvalues.map((v) => v.toFixed(2)).join(', ')}. Chance at {a.countries - 1}{' '}
            countries, one fewer because the income line uses one up: {p1(a.chance.mean)}, 95th{' '}
            {p1(a.chance.p95)} ({a.chance.draws} draws, seed {a.chance.seed}). Each residual
            column shuffled on its own: {p1(a.permutation.mean)}, 95th {p1(a.permutation.p95)} (
            {a.permutation.draws} draws, seed {a.permutation.seed}). A share above the chance 95th
            reads structure.
          </p>
        </div>
      ) : null}

      {b ? (
        <div className="mt-10">
          <h3 className="mb-3 text-xl font-medium tracking-tight">
            Do countries at the same income share a shape? Reads {READINGS[b.reading]}
          </h3>
          {reading.peerSentence ? (
            <p className="mb-4 max-w-3xl text-lg leading-relaxed">{reading.peerSentence}</p>
          ) : null}
          <DataTable
            rows={peerRows}
            caption={`Shapes against their ${b.peerCount} nearest income peers, ${b.countries} countries`}
            columns={[
              { key: 'test', label: 'Figure', render: (r) => r.test },
              { key: 'observed', label: 'Observed', align: 'right', render: (r) => r.observed },
              { key: 'baseline', label: 'Null', align: 'right', render: (r) => muted(r.baseline) },
              { key: 'rule', label: 'Rule', render: (r) => muted(r.rule) },
            ]}
          />
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
            Each residual is divided by its spread so every capability counts the same, and a
            shape is a country&apos;s nine values minus their own mean. Peer distance is the mean
            squared gap between a country&apos;s shape and each of its peers&apos;, averaged over
            countries. One null keeps every profile whole and deals the incomes out at random, so
            peers become countries picked without regard to income. The other deals each
            capability&apos;s residuals out across countries, which keeps their spread and breaks
            any link between one country&apos;s nine. {b.incomeNull.draws} draws each, seeds{' '}
            {b.shapeNull.seed} and {b.incomeNull.seed}.
          </p>
        </div>
      ) : null}

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-medium tracking-tight">
          Does the order hold still? Reads {READINGS[c?.reading ?? 'untested']} between releases,{' '}
          {READINGS[loo.reading]} without one country
        </h3>
        <p className="mb-4 max-w-3xl text-lg leading-relaxed">
          {reading.stabilitySentence ? `${reading.stabilitySentence} ` : null}
          {reading.looSentence}
        </p>
        <DataTable
          rows={loo.perDimension.map((row) => ({
            ...row,
            release: c?.perDimension.find((x) => x.dimension === row.dimension) ?? null,
          }))}
          caption="Each capability's residual order between releases and without one country"
          columns={[
            {
              key: 'dimension',
              label: 'Dimension',
              sort: (r) => DIMENSION_LABELS[r.dimension],
              render: (r) => <CapabilityLink dimension={r.dimension} />,
            },
            {
              key: 'pairs',
              label: 'Release pairs',
              align: 'right',
              sort: (r) => r.release?.pairs ?? null,
              render: (r) => muted(r.release?.pairs ?? 'no data'),
            },
            {
              key: 'mean',
              label: 'Mean rank r',
              align: 'right',
              sort: (r) => r.release?.mean ?? null,
              render: (r) => (r.release?.mean !== null && r.release?.mean !== undefined ? f2(r.release.mean) : 'not tested'),
            },
            {
              key: 'min',
              label: 'Lowest rank r',
              align: 'right',
              sort: (r) => r.release?.min ?? null,
              render: (r) =>
                r.release?.min !== null && r.release?.min !== undefined
                  ? `${f2(r.release.min)} (${r.release.minCountries})`
                  : 'not tested',
            },
            {
              key: 'slope',
              label: 'Slope shift, SE',
              align: 'right',
              sort: (r) => r.maxSlopeShiftSe,
              render: (r) => muted(f2(r.maxSlopeShiftSe)),
            },
            {
              key: 'own',
              label: 'Own shift, SD',
              align: 'right',
              sort: (r) => r.maxResidualShiftSd,
              render: (r) => f2(r.maxResidualShiftSd),
            },
            { key: 'n', label: 'n', align: 'right', sort: (r) => r.n, render: (r) => muted(r.n) },
          ]}
        />
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
          Rank r is the Spearman correlation of a capability&apos;s residual order with the release
          before, over the countries in both, counted only where a release kept the same countries
          and moved some residual on that capability by {RESIDUAL_MOVED_POINTS} points or more.
          {c ? ` Read across ${c.versions.length} dataset releases, ${c.pairs} pairs with the same countries.` : ''}{' '}
          Every lowest value at {RESIDUAL_STABILITY_BANDS.stable} or more reads stable, any below{' '}
          {RESIDUAL_STABILITY_BANDS.churning} reads churning. The shifts are the largest when any
          one country is dropped and the line refitted: of the slope in its standard errors, and of
          that country&apos;s own residual in the spread around the line, where more than{' '}
          {RESIDUAL_LOO_FRAGILE_SD} reads fragile.
        </p>
      </div>

      {d ? (
        <div className="mt-10">
          <h3 className="mb-3 text-xl font-medium tracking-tight">
            How much of a profile is income? Reads {READINGS[d.reading]}
          </h3>
          {reading.incomeShareSentence ? (
            <p className="max-w-3xl text-lg leading-relaxed">{reading.incomeShareSentence}</p>
          ) : null}
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
            For each of {d.countries} countries, one minus its nine squared residuals over its nine
            squared distances from each capability&apos;s average. Mean {p1(d.mean)}, median{' '}
            {p1(d.median)}, pooled over all countries {p1(d.pooled)}. A mean of{' '}
            {p1(RESIDUAL_INCOME_SHARE_BANDS.most)} or more reads most, {p1(RESIDUAL_INCOME_SHARE_BANDS.part)}{' '}
            or more reads part.
          </p>
        </div>
      ) : null}
    </Section>
  )
}
