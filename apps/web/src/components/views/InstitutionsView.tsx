'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  INSTITUTION_RELATION_FAMILIES,
  INSTITUTION_RELATION_FAMILY,
  INSTITUTION_SYSTEMS,
  MATRIX_BANDS,
  buildInstitutionMatrix,
  fill,
  matrixBand,
} from '@ncb/core'
import type {
  InstitutionCoverage,
  InstitutionEdge,
  InstitutionLevel,
  InstitutionRelationFamily,
  InstitutionSystem,
  Lexicon,
  LocalizedInstitutionNode,
  LocalizedInstitutionNetwork,
  MatrixBandId,
  MatrixCell,
  MatrixFamily,
} from '@ncb/core'
import { Icon } from '@/components/Icon'

/**
 * One country's institution map.
 *
 * The reader arrives with a name in mind, so the directory comes first. The
 * profile below it answers the page's own three questions in the order the
 * headline asks them: what this institution does, who limits it, what its
 * action depends on. Relations are grouped by family and read left to right in
 * their own direction, incoming on one side of the spine and outgoing on the
 * other.
 *
 * Nothing here is laid out by hand. Every surface is derived from counts, so a
 * country with 12 institutions and a country with 400 render through the same
 * code, and a long official name wraps instead of being cut. Language reaches
 * the component as one `lex` prop. See D56.
 */

const CONTROL =
  'rounded-md border border-[var(--rule)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)]'

const INITIAL_ID = 'bra.federal.bndes'

/**
 * The matrix ramp: the score ramp with its lime top removed. A relation count
 * is not a 0 to 100 position, so it never renders through `Score`, and a table
 * of 100 lime cells would spend the one accent this page has. The breaks
 * themselves live in `MATRIX_BANDS` in the core package. See D58.
 */
const MATRIX_FILL: Record<MatrixBandId, string> = {
  low: 'weak',
  middle: 'below_middle',
  high: 'above_middle',
}

type Connection = {
  edge: InstitutionEdge
  neighbor: LocalizedInstitutionNode
  direction: 'outgoing' | 'incoming'
}

type FamilyBand = {
  family: InstitutionRelationFamily
  incoming: Connection[]
  outgoing: Connection[]
}

function connectionFor(
  edge: InstitutionEdge,
  selectedId: string,
  byId: Map<string, LocalizedInstitutionNode>,
): Connection | null {
  if (edge.sourceId === selectedId) {
    const neighbor = byId.get(edge.targetId)
    return neighbor ? { edge, neighbor, direction: 'outgoing' } : null
  }
  if (edge.targetId === selectedId) {
    const neighbor = byId.get(edge.sourceId)
    return neighbor ? { edge, neighbor, direction: 'incoming' } : null
  }
  return null
}

/**
 * Sort one institution's relations into the model's families. Every family is
 * returned, including the empty ones: a family with no relation is a fact about
 * the map and stays on screen.
 */
function bandsFor(connections: Connection[]): FamilyBand[] {
  return INSTITUTION_RELATION_FAMILIES.map((family) => {
    const members = connections.filter(
      (connection) => INSTITUTION_RELATION_FAMILY[connection.edge.relation] === family,
    )
    return {
      family,
      incoming: members.filter((connection) => connection.direction === 'incoming'),
      outgoing: members.filter((connection) => connection.direction === 'outgoing'),
    }
  })
}

function institutionMatches(
  node: LocalizedInstitutionNode,
  query: string,
  level: InstitutionLevel | '',
  system: InstitutionSystem | '',
  locale: string,
): boolean {
  if (level && node.level !== level) return false
  if (system && node.system !== system) return false
  const needle = query.trim().toLocaleLowerCase(locale)
  if (!needle) return true
  return [node.officialName, node.shortName, node.summary]
    .join(' ')
    .toLocaleLowerCase(locale)
    .includes(needle)
}

function coverageSummary(coverage: InstitutionCoverage[]) {
  const states = coverage.filter((area) => area.level === 'state')
  return {
    pilot: states.filter((area) => area.status === 'pilot'),
    scaffold: states.filter((area) => area.status === 'scaffold'),
    planned: states.filter((area) => area.status === 'planned'),
  }
}

/**
 * One relation, as a sentence. The subject sits to the left of the verb in
 * both directions, so the verb always takes its active form and the geometry
 * supplies the subject: an incoming row reads "CGU audits" toward the spine,
 * an outgoing row reads "is attached to MDIC" away from it.
 */
function RelationRow({
  connection,
  lex,
  onSelect,
}: {
  connection: Connection
  lex: Lexicon
  onSelect: (id: string) => void
}) {
  const { edge, neighbor, direction } = connection
  const incoming = direction === 'incoming'
  const verb = (
    <span className="text-[var(--muted)]">{lex.institutions.relations[edge.relation].outgoing}</span>
  )
  const arrow = <Icon name="arrow-right" size={12} className="shrink-0 text-[var(--muted)]" />
  const name = (
    <button
      type="button"
      onClick={() => onSelect(neighbor.id)}
      className="font-medium underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--primary)]"
    >
      {neighbor.shortName}
    </button>
  )

  return (
    <p
      className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-xs leading-relaxed ${
        incoming ? 'sm:justify-end sm:text-right' : ''
      }`}
    >
      {incoming ? (
        <>
          {name}
          {verb}
          {arrow}
        </>
      ) : (
        <>
          {arrow}
          {verb}
          {name}
        </>
      )}
    </p>
  )
}

/**
 * The relation ledger. Four bands in the model's order, each split by
 * direction around a vertical spine that stands for the selected institution.
 * A row on the left feeds the spine, a row on the right is fed by it, so every
 * line reads left to right in the direction of its own relation. The spine
 * disappears below the `sm` breakpoint and the bands stack.
 */
function RelationLedger({
  bands,
  lex,
  onSelect,
}: {
  bands: FamilyBand[]
  lex: Lexicon
  onSelect: (id: string) => void
}) {
  const s = lex.institutions

  return (
    <div>
      <div className="mb-4 hidden grid-cols-2 gap-6 sm:grid">
        <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)] sm:text-right">
          {s.incomingHeading}
        </p>
        <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
          {s.outgoingHeading}
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 hidden w-px bg-[var(--rule)] sm:block"
        />
        <div className="space-y-6">
          {bands.map((band) => {
            const empty = band.incoming.length === 0 && band.outgoing.length === 0
            return (
              <section key={band.family}>
                <h3 className="mb-2 text-xs font-medium">{s.families[band.family].label}</h3>
                {empty ? (
                  <p className="text-xs text-[var(--muted)]">{s.families[band.family].empty}</p>
                ) : (
                  <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    <div className="space-y-2">
                      {band.incoming.map((connection) => (
                        <RelationRow
                          key={connection.edge.id}
                          connection={connection}
                          lex={lex}
                          onSelect={onSelect}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {band.outgoing.map((connection) => (
                        <RelationRow
                          key={connection.edge.id}
                          connection={connection}
                          lex={lex}
                          onSelect={onSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}


/**
 * The system by system relation matrix: the one picture of a whole country's
 * wiring that this page publishes.
 *
 * A count, not a position, so it never uses the score ramp and never reaches
 * lime. The three neutral steps are the score ramp with its lime top removed,
 * which is the standing rule against a table full of brand colour.
 *
 * The matrix owns its readout, the way the radar does. It always reads one
 * cell, it opens on the busiest one rather than on nothing, and the readout
 * names both institutions in every relation so the matrix is a way into a
 * profile and not only a summary. See D58.
 */
function RelationMatrix({
  network,
  lex,
  onSelect,
}: {
  network: LocalizedInstitutionNetwork
  lex: Lexicon
  onSelect: (id: string) => void
}) {
  const s = lex.institutions
  const [family, setFamily] = useState<MatrixFamily>('all')
  const [picked, setPicked] = useState<{ from: InstitutionSystem; to: InstitutionSystem } | null>(
    null,
  )

  const matrix = useMemo(
    () => buildInstitutionMatrix(network.nodes, network.edges, family),
    [network.nodes, network.edges, family],
  )
  const byId = useMemo(() => new Map(network.nodes.map((node) => [node.id, node])), [network.nodes])

  /* Opens on the busiest cell, so the readout never starts empty. */
  const busiest = useMemo(
    () =>
      matrix.cells.reduce<MatrixCell | null>(
        (best, cell) => (cell.count > (best?.count ?? 0) ? cell : best),
        null,
      ),
    [matrix.cells],
  )
  const active = picked ?? (busiest ? { from: busiest.from, to: busiest.to } : null)

  const listed = useMemo(() => {
    if (!active) return []
    return network.edges
      .filter((edge) => {
        if (family !== 'all' && INSTITUTION_RELATION_FAMILY[edge.relation] !== family) return false
        const from = byId.get(edge.sourceId)
        const to = byId.get(edge.targetId)
        return from?.system === active.from && to?.system === active.to
      })
      .map((edge) => ({
        edge,
        from: byId.get(edge.sourceId) as LocalizedInstitutionNode,
        to: byId.get(edge.targetId) as LocalizedInstitutionNode,
      }))
      .sort((a, b) => a.from.shortName.localeCompare(b.from.shortName, lex.numberLocale))
  }, [network.edges, byId, active, family, lex.numberLocale])

  const countAt = (from: InstitutionSystem, to: InstitutionSystem) =>
    matrix.cells.find((cell) => cell.from === from && cell.to === to)?.count ?? 0

  const cellName = (count: number, from: InstitutionSystem, to: InstitutionSystem) => {
    const values = { n: count, from: s.systems[from], to: s.systems[to] }
    if (count === 0) return fill(s.matrixCellNone, values)
    return fill(count === 1 ? s.matrixCellOne : s.matrixCell, values)
  }

  const families: MatrixFamily[] = ['all', ...INSTITUTION_RELATION_FAMILIES]

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label={s.matrixLegendLabel}>
          {families.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={family === id}
              onClick={() => {
                setFamily(id)
                setPicked(null)
              }}
              className={`${CONTROL} ${family === id ? 'border-[var(--primary)]' : ''}`}
            >
              {id === 'all' ? s.matrixAllFamilies : s.families[id].label}
            </button>
          ))}
        </div>
        <p className="text-xs tabular-nums text-[var(--muted)]">
          {fill(s.matrixSummary, {
            total: matrix.total,
            filled: matrix.filled,
            cells: matrix.cells.length,
          })}
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="border-separate border-spacing-0.5 text-xs">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="pr-3 text-left align-bottom text-xs font-medium text-[var(--muted)]"
              >
                {s.matrixFrom}
              </th>
              <th
                colSpan={INSTITUTION_SYSTEMS.length}
                className="pb-1 text-left text-xs font-medium text-[var(--muted)]"
              >
                {s.matrixTo}
              </th>
            </tr>
            <tr>
              {INSTITUTION_SYSTEMS.map((system) => (
                <th
                  key={system}
                  scope="col"
                  className="h-40 w-8 align-bottom text-xs font-normal"
                >
                  <span className="block whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                    {s.systems[system]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INSTITUTION_SYSTEMS.map((from) => (
              <tr key={from}>
                <th
                  scope="row"
                  className="whitespace-nowrap py-0.5 pr-3 text-right text-xs font-normal"
                >
                  {s.systems[from]}
                </th>
                {INSTITUTION_SYSTEMS.map((to) => {
                  const count = countAt(from, to)
                  const band = matrixBand(count)
                  const on = active?.from === from && active?.to === to
                  return (
                    <td key={to} className="p-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={cellName(count, from, to)}
                        onClick={() => setPicked({ from, to })}
                        style={
                          band
                            ? {
                                background: `var(--score-${MATRIX_FILL[band]})`,
                                color: `var(--score-${MATRIX_FILL[band]}-ink)`,
                              }
                            : undefined
                        }
                        className={`flex h-8 w-8 items-center justify-center rounded-xs tabular-nums ${
                          band ? '' : 'border border-[var(--rule-soft)] text-[var(--muted)]'
                        } ${on ? 'outline outline-2 outline-[var(--primary)] -outline-offset-2' : ''}`}
                      >
                        {count > 0 ? count : ''}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <span className="font-medium text-[var(--muted)]">{s.matrixLegendLabel}</span>
        {[...MATRIX_BANDS].reverse().map((band, index, all) => {
          const next = all[index + 1]
          return (
            <span key={band.id} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-4 w-7 rounded-md"
                style={{ background: `var(--score-${MATRIX_FILL[band.id]})` }}
              />
              <span className="tabular-nums text-[var(--muted)]">
                {next
                  ? next.min - 1 === band.min
                    ? band.min
                    : fill(lex.legendRange, { a: band.min, b: next.min - 1 })
                  : fill(lex.legendRangeTop, { a: band.min })}
              </span>
            </span>
          )
        })}
      </div>

      {active ? (
        <div className="mt-8 min-h-32 border-t border-[var(--rule-soft)] pt-5">
          <p className="text-xs font-medium">
            {cellName(countAt(active.from, active.to), active.from, active.to)}
          </p>
          <ul className="mt-3 space-y-2">
            {listed.map(({ edge, from, to }) => (
              <li
                key={edge.id}
                className="flex flex-wrap items-baseline gap-x-1.5 text-xs leading-relaxed"
              >
                <button
                  type="button"
                  onClick={() => onSelect(from.id)}
                  className="font-medium underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--primary)]"
                >
                  {from.shortName}
                </button>
                <span className="text-[var(--muted)]">{s.relations[edge.relation].outgoing}</span>
                <button
                  type="button"
                  onClick={() => onSelect(to.id)}
                  className="font-medium underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--primary)]"
                >
                  {to.shortName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

export function InstitutionsView({
  network,
  lex,
}: {
  network: LocalizedInstitutionNetwork
  lex: Lexicon
}) {
  const s = lex.institutions
  const locale = lex.numberLocale
  const [selectedId, setSelectedId] = useState(
    network.nodes.some((node) => node.id === INITIAL_ID) ? INITIAL_ID : network.nodes[0]?.id ?? '',
  )
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<InstitutionLevel | ''>('')
  const [system, setSystem] = useState<InstitutionSystem | ''>('')
  const [jurisdiction, setJurisdiction] = useState('BR')

  const byId = useMemo(() => new Map(network.nodes.map((node) => [node.id, node])), [network.nodes])
  const stateOptions = useMemo(
    () => network.coverage.filter((area) => area.level === 'state'),
    [network.coverage],
  )
  const scopedNodes = useMemo(
    () =>
      network.nodes.filter((node) => {
        if (jurisdiction === 'BR') return node.level === 'federal'
        return (
          node.level === 'federal' ||
          node.jurisdictionCode === jurisdiction ||
          node.jurisdictionCode.startsWith(`${jurisdiction}-`)
        )
      }),
    [network.nodes, jurisdiction],
  )
  const scopedIds = useMemo(() => new Set(scopedNodes.map((node) => node.id)), [scopedNodes])
  const scopedEdges = useMemo(
    () => network.edges.filter((edge) => scopedIds.has(edge.sourceId) && scopedIds.has(edge.targetId)),
    [network.edges, scopedIds],
  )
  const scopedNetwork = useMemo<LocalizedInstitutionNetwork>(
    () => ({ ...network, nodes: scopedNodes, edges: scopedEdges }),
    [network, scopedNodes, scopedEdges],
  )
  const selectedCandidate = byId.get(selectedId)
  const selected = selectedCandidate && scopedIds.has(selectedCandidate.id) ? selectedCandidate : scopedNodes[0]
  const connections = useMemo(
    () =>
      scopedEdges
        .map((edge) => connectionFor(edge, selected?.id ?? '', byId))
        .filter((connection): connection is Connection => connection !== null)
        .sort((a, b) => a.neighbor.shortName.localeCompare(b.neighbor.shortName, locale)),
    [scopedEdges, selected?.id, byId, locale],
  )
  const bands = useMemo(() => bandsFor(connections), [connections])
  const filtered = useMemo(
    () =>
      scopedNodes
        .filter((node) => institutionMatches(node, query, level, system, locale))
        .sort((a, b) => a.shortName.localeCompare(b.shortName, locale)),
    [scopedNodes, query, level, system, locale],
  )
  const groups = useMemo(
    () =>
      INSTITUTION_SYSTEMS.map((id) => ({
        system: id,
        members: filtered.filter((node) => node.system === id),
      })).filter((group) => group.members.length > 0),
    [filtered],
  )
  const degree = useMemo(() => {
    const counts = new Map<string, number>()
    for (const edge of scopedEdges) {
      counts.set(edge.sourceId, (counts.get(edge.sourceId) ?? 0) + 1)
      counts.set(edge.targetId, (counts.get(edge.targetId) ?? 0) + 1)
    }
    return counts
  }, [scopedEdges])
  const coverage = coverageSummary(network.coverage)

  /* Selecting brings the profile into view. The directory now runs to a few
   * hundred cards, so a click far down it would otherwise change a heading the
   * reader cannot see. */
  const profile = useRef<HTMLElement>(null)
  const select = useCallback((id: string) => {
    setSelectedId(id)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    profile.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [])

  if (!selected) return null

  return (
    <>
      <section>
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
          <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
            <Icon name="list-filter" size={14} />
            {s.findHeading}
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="flex min-w-56 flex-1 flex-col gap-1 text-xs text-[var(--muted)]">
              {s.findName}
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={s.findNamePlaceholder}
                className={CONTROL}
              />
            </label>
            <label className="flex min-w-48 flex-col gap-1 text-xs text-[var(--muted)]">
              {s.findJurisdiction}
              <select
                value={jurisdiction}
                onChange={(event) => {
                  const nextJurisdiction = event.target.value
                  setJurisdiction(nextJurisdiction)
                  const nextId =
                    nextJurisdiction === 'BR'
                      ? INITIAL_ID
                      : network.nodes.find(
                          (node) =>
                            node.jurisdictionCode === nextJurisdiction &&
                            node.id.endsWith('.government'),
                        )?.id
                  if (nextId) setSelectedId(nextId)
                }}
                className={CONTROL}
              >
                <option value="BR">{s.nationalJurisdiction}</option>
                {stateOptions.map((area) => (
                  <option key={area.jurisdictionCode} value={area.jurisdictionCode}>
                    {area.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
              {s.findLevel}
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value as InstitutionLevel | '')}
                className={CONTROL}
              >
                <option value="">{s.anyLevel}</option>
                {Object.entries(s.levels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-56 flex-col gap-1 text-xs text-[var(--muted)]">
              {s.findSystem}
              <select
                value={system}
                onChange={(event) => setSystem(event.target.value as InstitutionSystem | '')}
                className={CONTROL}
              >
                <option value="">{s.anySystem}</option>
                {Object.entries(s.systems).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="mt-3 text-right text-xs tabular-nums text-[var(--muted)]">
          {fill(s.shown, { n: filtered.length })}
        </p>

        {groups.length ? (
          <div className="mt-4 space-y-6">
            {groups.map((group) => (
              <div key={group.system}>
                <p className="mb-2 flex items-baseline justify-between gap-3 border-b border-[var(--rule-soft)] pb-1 text-xs font-medium">
                  {s.systems[group.system]}
                  <span className="tabular-nums text-[var(--muted)]">{group.members.length}</span>
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      aria-pressed={node.id === selected.id}
                      onClick={() => select(node.id)}
                      className={`rounded-md border p-3 text-left transition-colors ${
                        node.id === selected.id
                          ? 'border-[var(--primary)] bg-[var(--surface-sunken)]'
                          : 'border-[var(--rule)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <span className="block text-xs font-medium">{node.shortName}</span>
                      <span className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xs text-[var(--muted)]">
                        <span>{s.levels[node.level]}</span>
                        <span className="tabular-nums">
                          {fill(
                            (degree.get(node.id) ?? 0) === 1 ? s.relationCountOne : s.relationCount,
                            { n: degree.get(node.id) ?? 0 },
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-lg">{s.noMatch}</p>
        )}
      </section>

      <section
        ref={profile}
        aria-live="polite"
        className="mt-16 scroll-mt-8 border-t border-[var(--rule)] pt-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
            {s.levels[selected.level]} · {s.natures[selected.legalNature]}
          </p>
          <h2 className="mt-2 text-2xl font-light sm:text-3xl">{selected.officialName}</h2>
          <p className="mt-3 text-lg leading-relaxed">{selected.summary}</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-6 border-y border-[var(--rule-soft)] py-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">{s.rolesHeading}</p>
            <p className="mt-1 text-xs">
              {selected.roles.map((role) => s.roles[role]).join(', ')}.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">{s.dimensionsHeading}</p>
            <p className="mt-1 text-xs">
              {selected.dimensions.map((dimension) => lex.dimensions[dimension]).join(', ') ||
                s.noDimensions}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">
              {fill(connections.length === 1 ? s.relationCountOne : s.relationCount, {
                n: connections.length,
              })}
            </p>
            <a
              href={selected.source.url}
              className="mt-1 inline-block text-xs font-medium underline underline-offset-4"
            >
              {s.sourceLink}
            </a>
          </div>
        </div>

        <div className="mt-10">
          {connections.length ? (
            <RelationLedger bands={bands} lex={lex} onSelect={select} />
          ) : (
            <p className="text-lg">{s.noRelations}</p>
          )}
        </div>

        <p className="mt-8 text-xs text-[var(--muted)]">{s.ledgerHint}</p>
      </section>

      <section className="mt-16 border-t border-[var(--rule)] pt-10">
        <h2 className="text-2xl font-light sm:text-3xl">{s.matrixHeading}</h2>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          {s.matrixIntro}
        </p>
        <div className="mt-6">
          <RelationMatrix network={scopedNetwork} lex={lex} onSelect={select} />
        </div>
      </section>

      <section className="mt-16 border-t border-[var(--rule)] pt-10">
        <h2 className="text-2xl font-light sm:text-3xl">
          A cobertura estadual cresce em camadas
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          São Paulo testa o método. As outras 26 UFs já têm um núcleo institucional inicial e entram
          com a mesma régua para poderes estaduais, controle, financiamento, dados, formação, ciência,
          regulação e entrega municipal.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.pilot.map((area) => (
            <div key={area.jurisdictionCode} className="border-l-2 border-[var(--primary)] pl-3">
              <p className="text-xs font-medium">{area.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Piloto em curadoria</p>
            </div>
          ))}
          {coverage.scaffold.map((area) => (
            <div key={area.jurisdictionCode} className="border-l border-[var(--muted)] pl-3">
              <p className="text-xs font-medium">{area.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Núcleo inicial curado</p>
            </div>
          ))}
          {coverage.planned.map((area) => (
            <div key={area.jurisdictionCode} className="border-l border-[var(--rule)] pl-3">
              <p className="text-xs font-medium">{area.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Planejado</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
