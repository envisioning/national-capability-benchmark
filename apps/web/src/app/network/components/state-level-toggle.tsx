'use client'

import { useAppStore } from '@envisioning/app'
import { useCallback, useEffect, useMemo, useRef } from 'react'

const LEVEL_CRITERIA_KEY = 'level.id'
const STATE_LEVEL_ID = 'state'
const LEVEL_QUERY_KEYS = [
  'criteria[level.id][$in][]',
  'criteria[level.id][$in]',
  'criteria[level.id][]',
  'criteria[level.id]',
]

type Criteria = Record<string, unknown>

function includedLevels(criteria: Criteria): string[] | null {
  const value = criteria[LEVEL_CRITERIA_KEY]

  if (value === undefined || value === null) return null
  if (Array.isArray(value)) return value.map(String)

  if (typeof value === 'object' && '$in' in value) {
    const values = (value as { $in?: unknown }).$in
    if (Array.isArray(values)) return values.map(String)
  }

  return [String(value)]
}

function sameSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
}

function writeLevelFilter(nextLevels: string[] | null, replace = false) {
  const url = new URL(window.location.href)
  for (const key of LEVEL_QUERY_KEYS) url.searchParams.delete(key)

  if (nextLevels) {
    for (const level of nextLevels) {
      url.searchParams.append('criteria[level.id][$in][]', level)
    }
  }

  // A label from the generic filter modal would be stale after this control
  // changes only the level part of the criteria. The app will recalculate its
  // count from the URL on the same history event.
  url.searchParams.delete('activeFilterLabel')
  const href = `${url.pathname}${url.search}${url.hash}`
  if (replace) window.history.replaceState(null, '', href)
  else window.history.pushState(null, '', href)
  const event = document.createEvent('Event')
  event.initEvent('ncb-network-locationchange', false, false)
  window.dispatchEvent(event)
}

type StateLevelToggleProps = {
  availableLevelIds: string[]
  stateCount: number
  institutionCount: number
}

/**
 * A fast scope control for the network's one unusually large level.
 *
 * The generic Envisioning filter still exposes every level and remains the
 * right place for multi-select combinations. This control covers the common
 * reading: keep the national network legible, then add the state layer when
 * the question needs it. Both paths write the same criteria grammar.
 */
export function StateLevelToggle({
  availableLevelIds,
  stateCount,
  institutionCount,
}: StateLevelToggleProps) {
  const criteria = useAppStore((state) => state.ui.criteria)
  const currentId = useAppStore((state) => state.ui.id)
  const mode = useAppStore((state) => state.ui.mode)
  const isFilterOpen = useAppStore((state) => state.isFilterOpen)
  const isNavigationOpen = useAppStore((state) => state.session.isNavigationOpen)
  const lang = useAppStore((state) => state.ui.lang)
  const defaultScopeApplied = useRef(false)

  const nonStateLevelIds = useMemo(
    () => availableLevelIds.filter((levelId) => levelId !== STATE_LEVEL_ID),
    [availableLevelIds],
  )
  const currentLevels = includedLevels(criteria)
  const hasExplicitLevelFilter = criteria[LEVEL_CRITERIA_KEY] !== undefined
  const isStateVisible = currentLevels === null || currentLevels.includes(STATE_LEVEL_ID)

  // The overview has 282 state institutions against 75 federal ones. Keep a
  // broad opening view readable, but never override a level filter or an
  // institution-specific neighbourhood, where state relations are context.
  useEffect(() => {
    if (
      defaultScopeApplied.current ||
      currentId ||
      hasExplicitLevelFilter ||
      nonStateLevelIds.length === 0
    ) {
      return
    }

    defaultScopeApplied.current = true
    writeLevelFilter(nonStateLevelIds, true)
  }, [currentId, hasExplicitLevelFilter, nonStateLevelIds])

  const toggleStateLayer = useCallback(() => {
    const allNonStateLevels = nonStateLevelIds
    if (allNonStateLevels.length === 0) return

    if (isStateVisible) {
      const nextLevels = currentLevels
        ? currentLevels.filter((levelId) => levelId !== STATE_LEVEL_ID)
        : allNonStateLevels
      writeLevelFilter(nextLevels.length > 0 ? [...new Set(nextLevels)] : allNonStateLevels)
      return
    }

    if (!currentLevels || sameSet(currentLevels, allNonStateLevels)) {
      writeLevelFilter(null)
      return
    }

    writeLevelFilter([...new Set([...currentLevels, STATE_LEVEL_ID])])
  }, [currentLevels, isStateVisible, nonStateLevelIds])

  if (stateCount === 0 || isFilterOpen || isNavigationOpen) return null

  const isPortuguese = lang === 'pt'
  const label = isPortuguese ? 'Esfera estadual' : 'State-level'
  const countLabel = isPortuguese
    ? `${stateCount} de ${institutionCount} instituições`
    : `${stateCount} of ${institutionCount} institutions`
  const statusLabel = isStateVisible
    ? isPortuguese
      ? 'incluída'
      : 'included'
    : isPortuguese
      ? 'oculta'
      : 'hidden'

  return (
    <div
      className={`network-state-scope-control${currentId && mode !== 'explorer' ? ' is-contextual' : ''}`}
    >
      <button
        type="button"
        className={`network-state-toggle${isStateVisible ? ' is-on' : ''}`}
        aria-pressed={isStateVisible}
        aria-label={`${label}: ${statusLabel}. ${countLabel}.`}
        title={
          isStateVisible
            ? isPortuguese
              ? 'Ocultar instituições estaduais'
              : 'Hide state-level institutions'
            : isPortuguese
              ? 'Mostrar instituições estaduais'
              : 'Show state-level institutions'
        }
        onClick={toggleStateLayer}
      >
        <span className="network-state-toggle__dot" aria-hidden="true" />
        <span className="network-state-toggle__copy">
          <span className="network-state-toggle__label">{label}</span>
          <span className="network-state-toggle__count">{countLabel}</span>
        </span>
        <span className="network-state-toggle__status">{statusLabel}</span>
      </button>
    </div>
  )
}
