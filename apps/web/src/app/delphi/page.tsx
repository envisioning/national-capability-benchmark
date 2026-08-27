import {
  DIMENSION_LABELS,
  INDICATORS_BY_ID,
  isEvidential,
  cellConsensus,
  indicatorConsensus,
  missingEvidenceRanking,
} from '@ncb/core'
import { DissentTable } from '@/components/views/DissentTable'
import { Empty, Note, Score, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { loadDelphiRun } from '@/lib/data'

export const dynamic = 'force-dynamic'

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
  const judged = indicatorConsensus(run)
  const missing = missingEvidenceRanking(run)
  const evidential = isEvidential(run.provenance)
  const singlePanelist = run.panel.length < 3

  return (
    <>
      <Section
        title="Each panelist argues from a fixed position"
        hint={`Run ${run.runId}, ${run.rounds} round(s). Stances are assigned so that a disagreement between panelists traces back to a stated position.`}
      >
        {!evidential ? (
          <Note tone="stop">
            Provenance <code>{run.provenance}</code>. This run came from the deterministic offline
            stand-in. It exercises the pipeline and it is not evidence about any country.
          </Note>
        ) : singlePanelist ? (
          <Note tone="stop">
            Provenance <code>{run.provenance}</code> with {run.panel.length} panelist
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
        hint="Cells where the middle half of the panel spans more than 25 points. A disagreement a panelist can defend is a finding about the dimension."
      >
        {dissent.length === 0 ? (
          <p className="text-lg leading-relaxed text-[var(--muted)]">No cell exceeds the dissent threshold.</p>
        ) : (
          <DissentTable rows={dissent} />
        )}
      </Section>

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
              {finals
                .filter((c) => c.medianShift !== null)
                .sort((a, b) => Math.abs(b.medianShift ?? 0) - Math.abs(a.medianShift ?? 0))
                .slice(0, 25)
                .map((c) => (
                  <tr key={`${c.iso3}|${c.dimension}`}>
                    <Td>{c.country}</Td>
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

      {judged.length > 0 ? (
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
      ) : null}

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
