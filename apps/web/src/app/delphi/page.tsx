import type { Metadata } from 'next'
import {
  DIMENSION_LABELS,
  DISSENT_IQR,
  INDICATORS_BY_ID,
  PROVENANCE_LABELS,
  isEvidential,
  isPanel,
  cellConsensus,
  indicatorConsensus,
  missingEvidenceRanking,
} from '@ncb/core'
import { DissentTable } from '@/components/views/DissentTable'
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
import { loadDelphiRun } from '@/lib/data'
import { countryProfileHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Delphi panel, NCB',
  description:
    'The judgment layer beside the indicators: how the panel is built, where it disagrees, and what it said it needed.',
}

export default async function DelphiPage() {
  const run = await loadDelphiRun()
  if (!run) {
    return (
      <Empty hint="No Delphi run yet. Run pnpm bench delphi --mock for an offline dry run, or set AI_GATEWAY_API_KEY and run pnpm bench delphi." />
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
      <PageTitle>Judgment is kept beside the evidence, never inside it</PageTitle>
      <Headline>
        A <DefineLink term="Delphi panel">panel</DefineLink> estimates the same dimensions the
        indicators score and audits the indicator set itself. Its estimates never enter a score;
        the distance between the two is a finding about the measurement.
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
      </p>

      <Section
        title="Each panelist argues from a fixed position"
        hint="Stances are assigned so that a disagreement between panelists traces back to a stated position."
      >
        {!evidential ? (
          <Note tone="stop">
            This run came from the deterministic offline stand-in. It exercises the pipeline and it
            is not evidence about any country.
          </Note>
        ) : !panel ? (
          <Note tone="stop">
            This run is a {PROVENANCE_LABELS[run.provenance]} with {run.panel.length} panelist
            {run.panel.length === 1 ? '' : 's'}. There is no distribution to read here: the median
            is one opinion and the interquartile range is zero. Treat every number on this page as
            a single judgment rather than a panel result.
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
        title="The panel is allowed to stay split"
        hint={`Cells where the middle half of the panel spans more than ${DISSENT_IQR} points. A disagreement a panelist can defend is a finding about the dimension.`}
      >
        {dissent.length === 0 ? (
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            {panel
              ? `No cell has an interquartile range above ${DISSENT_IQR} points.`
              : `Nothing to read here: with ${run.panel.length} panelist${run.panel.length === 1 ? '' : 's'} the interquartile range is zero by construction. An empty table is a property of the panel size, never evidence of agreement.`}
          </p>
        ) : (
          <DissentTable rows={dissent} />
        )}
      </Section>

      {shifts.length === 0 ? (
        <Section
          title="Convergence needs a second round"
          hint="Movement of the panel median between rounds is how a Delphi shows convergence. This run has a single round, so there is no movement to show yet."
        >
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            Nothing to read here until a run with two or more rounds replaces this one.
          </p>
        </Section>
      ) : (
        <Section
          title="Rounds two onward show whether the panel moved"
          hint="Movement of the panel median and the interquartile range between rounds. Negative IQR shift means the panel narrowed."
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
                    <Td>{DIMENSION_LABELS[c.dimension]}</Td>
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
          title="The indicator audit has not run yet"
          hint="A full panel run re-classifies every indicator as C, I, O or P and rates how well it measures its dimension. This run skipped that step, so the method page's promise of an indicator audit is waiting on the next run."
        >
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            Nothing to show until a run with indicator judgments replaces this one.
          </p>
        </Section>
      ) : (
        <Section
          title="The panel also grades the indicators"
          hint="Each indicator is re-classified as C, I, O or P and rated on how well it measures its dimension. Weakest construct validity first."
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
          title="This is what the panel said it needed"
          hint="Evidence panelists named when asked what would raise their confidence, ranked by how often it came up. It feeds the collection agenda directly."
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
