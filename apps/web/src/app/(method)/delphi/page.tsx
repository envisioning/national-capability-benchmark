import type { Metadata } from 'next'
import {
  DIMENSION_LABELS,
  DISSENT_IQR,
  INDICATORS_BY_ID,
  PROVENANCE_LABELS,
  isDelphiRunForDataset,
  isEvidential,
  isPanel,
  cellConsensus,
  indicatorConsensus,
  missingEvidenceRanking,
} from '@ncb/core'
import { DissentTable } from '@/components/views/DissentTable'
import { CapabilityLink } from '@/components/CapabilityLink'
import {
  CountryLabel,
  DefineLink,
  Empty,
  Eyebrow,
  Headline,
  Meta,
  Note,
  PageTitle,
  Score,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'
import Link from 'next/link'
import { loadDelphiRun, loadIndex } from '@/lib/data'
import { countryProfileHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Delphi panel, NCB',
  description:
    'Panel judgments beside the indicators, including disagreement and requested evidence.',
}

export default async function DelphiPage() {
  const [loadedRun, index] = await Promise.all([loadDelphiRun(), loadIndex()])
  const run =
    loadedRun &&
    index?.version &&
    isDelphiRunForDataset(loadedRun, index.version)
      ? loadedRun
      : null
  if (!run) {
    return (
      <Empty hint="No Delphi run matches the current dataset version. Run pnpm bench delphi after scoring the current dataset." />
    )
  }

  const cells = cellConsensus(run)
  const finalRound = Math.max(...cells.map((c) => c.round), 0)
  const finals = cells.filter((c) => c.round === finalRound)
  const dissent = [...finals].filter((c) => c.dissent).sort((a, b) => b.iqr - a.iqr)
  const shifts = finals.filter((c) => c.medianShift !== null)
  const judged = indicatorConsensus(run)
  const missing = missingEvidenceRanking(run)
  const evidential = isEvidential(run.provenance)
  const panel = isPanel(run)

  return (
    <>
      <Eyebrow>The judgment layer</Eyebrow>
      <PageTitle>Panel estimates stay beside the scores</PageTitle>
      <Headline>
        A <DefineLink term="Delphi panel">panel</DefineLink> reviews selected dimensions from the
        source-backed evidence and audits the registry. Its estimates do not change the indicator
        score or confidence.
      </Headline>
      <p className="mb-10 flex flex-wrap gap-2">
        <Meta icon="file-clock">run {run.runId}</Meta>
        <Meta>
          {run.rounds} round{run.rounds === 1 ? '' : 's'}
        </Meta>
        <Meta icon="users">
          {run.panel.length} panelist{run.panel.length === 1 ? '' : 's'}
        </Meta>
        <Meta icon="bot">
          <DefineLink term="Provenance">{PROVENANCE_LABELS[run.provenance]}</DefineLink>
        </Meta>
        {run.datasetVersion ? <Meta>dataset {run.datasetVersion}</Meta> : null}
        {run.scope ? <Meta>{run.scope} run</Meta> : null}
        {run.maxCoverage !== undefined ? <Meta>coverage ≤ {run.maxCoverage}</Meta> : null}
      </p>

      <Section
        title="Panelists use fixed stances"
        hint="Each stance gives disagreement a reason."
      >
        {!evidential ? (
          <Note tone="stop">
            This deterministic offline run tests the pipeline. It is not country evidence.
          </Note>
        ) : !panel ? (
          <Note tone="stop">
            This {PROVENANCE_LABELS[run.provenance]} run has {run.panel.length} panelist
            {run.panel.length === 1 ? '' : 's'}. It has no distribution, so each number is a single
            judgment.
          </Note>
        ) : null}
        {run.note ? <Note>{run.note}</Note> : null}
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Stance</Th>
                <Th>Model</Th>
                <Th>Panelist id</Th>
              </tr>
            </thead>
            <tbody>
              {run.panel.map((p) => (
                <tr key={p.panelist}>
                  <Td>{p.stance}</Td>
                  <Td dim>{p.model}</Td>
                  <Td dim>{p.panelist}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="The panel's disagreement stays visible"
        hint={`A cell is marked when the middle half of the panel spans more than ${DISSENT_IQR} points.`}
      >
        {dissent.length === 0 ? (
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            {panel
              ? `No cell has an interquartile range above ${DISSENT_IQR} points.`
              : `With ${run.panel.length} panelist${run.panel.length === 1 ? '' : 's'}, the interquartile range is zero. The empty table says nothing about agreement.`}
          </p>
        ) : (
          <DissentTable rows={dissent} />
        )}
      </Section>

      {shifts.length === 0 ? (
        <Section
          title="A second round can change the estimates"
          hint="This run has one round, so there is no median or IQR shift yet."
        >
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            There is nothing to compare until a run with at least two rounds replaces this one.
          </p>
        </Section>
      ) : (
        <Section
          title="Later rounds show what changed"
          hint="A negative IQR shift means the panel narrowed."
        >
          <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Country</Th>
                <Th>Dimension</Th>
                <Th align="right">Median</Th>
                <Th align="right">Median shift</Th>
                <Th align="right">IQR</Th>
                <Th align="right">IQR shift</Th>
              </tr>
            </thead>
            <tbody>
              {[...shifts]
                .sort((a, b) => Math.abs(b.medianShift ?? 0) - Math.abs(a.medianShift ?? 0))
                .slice(0, 25)
                .map((c) => (
                  <tr key={`${c.iso3}|${c.dimension}`}>
                    <Td>
                      <Link href={countryProfileHref(c.iso3)} className="hover:underline">
                        <CountryLabel iso3={c.iso3} name={c.country} />
                      </Link>
                    </Td>
                    <Td><CapabilityLink dimension={c.dimension} /></Td>
                    <Td align="right"><Score value={c.median} size="sm" /></Td>
                    <Td align="right" dim>
                      {c.medianShift?.toFixed(1)}
                    </Td>
                    <Td align="right">{c.iqr.toFixed(1)}</Td>
                    <Td align="right" dim>
                      {c.iqrShift?.toFixed(1)}
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>
          </Scroller>
        </Section>
      )}

      {judged.length === 0 ? (
        <Section
          title="The indicator audit did not run"
          hint="The audit classifies each indicator as C, I, O or P and rates its fit. This run skipped it."
        >
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            There is nothing to show until a run with indicator judgments replaces this one.
          </p>
        </Section>
      ) : (
        <Section
          title="The panel also rates each indicator"
          hint="Each indicator gets a class, a validity rating and a wealth-proxy risk rating. The weakest validity comes first."
        >
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>Indicator</Th>
                  <Th>Registry class</Th>
                  <Th>Panel class</Th>
                  <Th align="right">Construct validity</Th>
                  <Th align="right">Wealth proxy risk</Th>
                  <Th align="right">Registry prior</Th>
                  <Th>Redundancy votes</Th>
                </tr>
              </thead>
              <tbody>
                {judged.slice(0, 40).map((j) => (
                  <tr key={j.indicatorId}>
                    <Td>{INDICATORS_BY_ID[j.indicatorId]?.name ?? j.indicatorId}</Td>
                    <Td dim>{j.registryClass}</Td>
                    <Td>
                      {j.panelClass}
                      {j.classDisputed ? (
                        <span className="ml-1 text-xs text-[#ef4444]">disputed</span>
                      ) : null}
                    </Td>
                    <Td align="right">{j.constructValidity.toFixed(2)}</Td>
                    <Td align="right">{j.wealthProxyRisk.toFixed(2)}</Td>
                    <Td align="right" dim>
                      {j.wealthProxyPrior.toFixed(2)}
                    </Td>
                    <Td dim>
                      {j.redundancyVotes
                        .slice(0, 3)
                        .map((v) => `${INDICATORS_BY_ID[v.other]?.name ?? v.other} (${v.votes})`)
                        .join(', ') || 'none'}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        </Section>
      )}

      {missing.length > 0 ? (
        <Section
          title="Evidence the panel requested"
          hint="Panelists name evidence they want to see. The list feeds the collection agenda."
        >
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>Evidence</Th>
                  <Th align="right">Mentions</Th>
                  <Th align="right">Dimensions</Th>
                </tr>
              </thead>
              <tbody>
                {missing.slice(0, 30).map((m) => (
                  <tr key={m.evidence}>
                    <Td>{m.evidence}</Td>
                    <Td align="right">{m.mentions}</Td>
                    <Td align="right" dim>
                      {m.dimensions.length}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        </Section>
      ) : null}
    </>
  )
}
