'use client'

import { useMemo, useState } from 'react'
import {
  INSTITUTION_LEVEL_LABELS_PT_BR,
  INSTITUTION_NATURE_LABELS_PT_BR,
  INSTITUTION_RELATION_LABELS_PT_BR,
  INSTITUTION_ROLE_LABELS_PT_BR,
  INSTITUTION_SYSTEM_LABELS_PT_BR,
  PT_BR,
} from '@ncb/core'
import type {
  InstitutionCoverage,
  InstitutionEdge,
  InstitutionLevel,
  InstitutionSystem,
  LocalizedInstitutionNode,
  LocalizedInstitutionNetwork,
} from '@ncb/core'
import { Icon } from '@/components/Icon'

const CONTROL =
  'rounded-md border border-[var(--rule)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)]'

const INITIAL_ID = 'bra.federal.bndes'
const MAX_GRAPH_NEIGHBORS = 12

type Connection = {
  edge: InstitutionEdge
  neighbor: LocalizedInstitutionNode
  direction: 'outgoing' | 'incoming'
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

function graphPositions(count: number): { x: number; y: number }[] {
  const centerX = 380
  const centerY = 250
  const radiusX = count > 8 ? 285 : 250
  const radiusY = 188
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / count
    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
    }
  })
}

function NetworkDiagram({
  selected,
  connections,
  onSelect,
}: {
  selected: LocalizedInstitutionNode
  connections: Connection[]
  onSelect: (id: string) => void
}) {
  const shown = connections.slice(0, MAX_GRAPH_NEIGHBORS)
  const positions = graphPositions(shown.length)
  const center = { x: 380, y: 250 }

  return (
    <div>
      <svg
        viewBox="0 0 760 500"
        className="hidden w-full sm:block"
        role="img"
        aria-label={`${selected.shortName} e ${connections.length} instituições conectadas`}
      >
        <defs>
          <marker
            id="institution-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
          </marker>
        </defs>

        {shown.map((connection, index) => {
          const position = positions[index] as { x: number; y: number }
          const outgoing = connection.direction === 'outgoing'
          return (
            <line
              key={connection.edge.id}
              x1={outgoing ? center.x : position.x}
              y1={outgoing ? center.y : position.y}
              x2={outgoing ? position.x : center.x}
              y2={outgoing ? position.y : center.y}
              stroke="var(--rule)"
              strokeWidth="1.5"
              markerEnd="url(#institution-arrow)"
            />
          )
        })}

        {shown.map((connection, index) => {
          const position = positions[index] as { x: number; y: number }
          return (
            <g
              key={connection.neighbor.id}
              role="button"
              tabIndex={0}
              aria-label={`Abrir ${connection.neighbor.officialName}`}
              onClick={() => onSelect(connection.neighbor.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(connection.neighbor.id)
                }
              }}
              className="cursor-pointer"
            >
              <rect
                x={position.x - 72}
                y={position.y - 25}
                width="144"
                height="50"
                rx="6"
                fill="var(--surface)"
                stroke="var(--rule)"
              />
              <text
                x={position.x}
                y={position.y - 2}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize="12"
                fontWeight="500"
              >
                {connection.neighbor.shortName}
              </text>
              <text
                x={position.x}
                y={position.y + 14}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="10"
              >
                {INSTITUTION_LEVEL_LABELS_PT_BR[connection.neighbor.level]}
              </text>
            </g>
          )
        })}

        <g>
          <rect
            x={center.x - 86}
            y={center.y - 31}
            width="172"
            height="62"
            rx="8"
            fill="var(--primary)"
          />
          <text
            x={center.x}
            y={center.y - 3}
            textAnchor="middle"
            fill="var(--score-strong-ink)"
            fontSize="13"
            fontWeight="500"
          >
            {selected.shortName}
          </text>
          <text
            x={center.x}
            y={center.y + 15}
            textAnchor="middle"
            fill="var(--score-strong-ink)"
            fontSize="10"
          >
            {INSTITUTION_SYSTEM_LABELS_PT_BR[selected.system]}
          </text>
        </g>
      </svg>

      <p className="sm:hidden text-xs text-[var(--muted)]">
        Em telas menores, as relações aparecem na lista abaixo do perfil da instituição.
      </p>
      {connections.length > MAX_GRAPH_NEIGHBORS ? (
        <p className="mt-2 text-xs text-[var(--muted)]">
          O diagrama mostra {MAX_GRAPH_NEIGHBORS} de {connections.length} relações. A lista ao lado
          mostra todas.
        </p>
      ) : null}
    </div>
  )
}

function institutionMatches(
  node: LocalizedInstitutionNode,
  query: string,
  level: InstitutionLevel | '',
  system: InstitutionSystem | '',
): boolean {
  if (level && node.level !== level) return false
  if (system && node.system !== system) return false
  const needle = query.trim().toLocaleLowerCase('pt-BR')
  if (!needle) return true
  return [node.officialName, node.shortName, node.summary]
    .join(' ')
    .toLocaleLowerCase('pt-BR')
    .includes(needle)
}

function coverageSummary(coverage: InstitutionCoverage[]) {
  const states = coverage.filter((area) => area.level === 'state')
  return {
    covered: states.filter((area) => area.status !== 'planned'),
    planned: states.filter((area) => area.status === 'planned'),
  }
}

export function InstitutionsView({ network }: { network: LocalizedInstitutionNetwork }) {
  const [selectedId, setSelectedId] = useState(
    network.nodes.some((node) => node.id === INITIAL_ID) ? INITIAL_ID : network.nodes[0]?.id ?? '',
  )
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<InstitutionLevel | ''>('')
  const [system, setSystem] = useState<InstitutionSystem | ''>('')

  const byId = useMemo(() => new Map(network.nodes.map((node) => [node.id, node])), [network.nodes])
  const selected = byId.get(selectedId) ?? network.nodes[0]
  const connections = useMemo(
    () =>
      network.edges
        .map((edge) => connectionFor(edge, selected?.id ?? '', byId))
        .filter((connection): connection is Connection => connection !== null)
        .sort((a, b) => a.neighbor.shortName.localeCompare(b.neighbor.shortName, 'pt-BR')),
    [network.edges, selected?.id, byId],
  )
  const filtered = useMemo(
    () =>
      network.nodes
        .filter((node) => institutionMatches(node, query, level, system))
        .sort((a, b) => a.shortName.localeCompare(b.shortName, 'pt-BR')),
    [network.nodes, query, level, system],
  )
  const coverage = coverageSummary(network.coverage)

  if (!selected) return null

  return (
    <>
      <div className="mb-10 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
        <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
          <Icon name="list-filter" size={14} />
          Encontrar uma instituição
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="flex min-w-56 flex-1 flex-col gap-1 text-xs text-[var(--muted)]">
            Nome ou função
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="BNDES, justiça, pesquisa..."
              className={CONTROL}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            Esfera
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as InstitutionLevel | '')}
              className={CONTROL}
            >
              <option value="">Todas</option>
              {Object.entries(INSTITUTION_LEVEL_LABELS_PT_BR).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-56 flex-col gap-1 text-xs text-[var(--muted)]">
            Sistema
            <select
              value={system}
              onChange={(event) => setSystem(event.target.value as InstitutionSystem | '')}
              className={CONTROL}
            >
              <option value="">Todos</option>
              {Object.entries(INSTITUTION_SYSTEM_LABELS_PT_BR).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
        <div className="min-w-0">
          <NetworkDiagram selected={selected} connections={connections} onSelect={setSelectedId} />
        </div>

        <aside
          aria-live="polite"
          className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-5"
        >
          <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
            {INSTITUTION_LEVEL_LABELS_PT_BR[selected.level]} ·{' '}
            {INSTITUTION_NATURE_LABELS_PT_BR[selected.legalNature]}
          </p>
          <h2 className="mt-2 text-xl font-medium tracking-tight">{selected.officialName}</h2>
          <p className="mt-3 leading-relaxed">{selected.summary}</p>

          <div className="mt-5">
            <p className="text-xs font-medium text-[var(--muted)]">O que faz</p>
            <p className="mt-1 text-xs">
              {selected.roles.map((role) => INSTITUTION_ROLE_LABELS_PT_BR[role]).join(', ')}.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-[var(--muted)]">Capacidades relacionadas</p>
            <p className="mt-1 text-xs">
              {selected.dimensions.map((dimension) => PT_BR.dimensions[dimension]).join(', ') ||
                'Nenhuma relação registrada'}
            </p>
          </div>

          <div className="mt-5 border-t border-[var(--rule-soft)] pt-5">
            <p className="text-xs font-medium text-[var(--muted)]">
              {connections.length} {connections.length === 1 ? 'relação registrada' : 'relações registradas'}
            </p>
            <ul className="mt-2 space-y-3 text-xs">
              {connections.map(({ edge, neighbor, direction }) => (
                <li key={edge.id} className="leading-relaxed">
                  <span className="text-[var(--muted)]">
                    {INSTITUTION_RELATION_LABELS_PT_BR[edge.relation][direction]}{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedId(neighbor.id)}
                    className="font-medium underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--primary)]"
                  >
                    {neighbor.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={selected.source.url}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4"
          >
            Fonte institucional
          </a>
        </aside>
      </div>

      <section className="mt-16 border-t border-[var(--rule)] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-light sm:text-3xl">O primeiro recorte já pode ser auditado</h2>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
              {network.nodes.length} instituições e {network.edges.length} relações. Cada instituição
              tem uma fonte, e cada linha da rede também.
            </p>
          </div>
          <p className="text-xs tabular-nums text-[var(--muted)]">{filtered.length} exibidas</p>
        </div>

        {filtered.length ? (
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((node) => (
              <button
                key={node.id}
                type="button"
                aria-pressed={node.id === selected.id}
                onClick={() => setSelectedId(node.id)}
                className={`rounded-md border p-3 text-left transition-colors ${
                  node.id === selected.id
                    ? 'border-[var(--primary)] bg-[var(--surface-sunken)]'
                    : 'border-[var(--rule)] hover:border-[var(--muted)]'
                }`}
              >
                <span className="block text-xs font-medium">{node.shortName}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {INSTITUTION_SYSTEM_LABELS_PT_BR[node.system]}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-lg">Nenhuma instituição corresponde a esses filtros.</p>
        )}
      </section>

      <section className="mt-16 border-t border-[var(--rule)] pt-10">
        <h2 className="text-2xl font-light sm:text-3xl">Os 26 estados e o Distrito Federal estão no plano</h2>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          São Paulo testa o método. Os próximos estados entram com a mesma régua: poderes estaduais,
          controle, financiamento, dados, formação, ciência, regulação e entrega municipal.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.covered.map((area) => (
            <div key={area.jurisdictionCode} className="border-l-2 border-[var(--primary)] pl-3">
              <p className="text-xs font-medium">{area.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Piloto em curadoria</p>
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
