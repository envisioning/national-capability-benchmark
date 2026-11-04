'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  COUNTRY_GROUPS,
  COUNTRY_INCOME_GROUPS,
  COUNTRY_REGIONS,
  DIMENSIONS,
  DIMENSION_LABELS,
  isThinEvidence,
} from '@ncb/core'
import type { CountryIncomeGroup, CountryRegion } from '@ncb/core'
import { DataTable, type Column } from '@/components/DataTable'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Radar } from '@/components/Radar'
import {
  Button,
  Confidence,
  ConfidenceLegend,
  CountryLabel,
  DimensionLegend,
  DimensionScore,
  RadarEvidenceLegend,
  controlClass,
  fieldClass,
} from '@/components/ui'
import { dimensionLabel, sentenceLabel } from '@/lib/labels'
import { countryProfileHref } from '@/lib/links'
import type { RadarProfile } from '@/lib/profile'

export type FinderCountry = RadarProfile & {
  /** Dimensions below the coverage floor, in dimension order: no score to print. */
  floors: boolean[]
  observed: number[]
}

export type FinderView = 'table' | 'shapes'
export type FinderMeasure = 'score' | 'confidence'
export type FinderState = {
  q: string
  region: CountryRegion | ''
  income: CountryIncomeGroup | ''
  view: FinderView
  measure: FinderMeasure
}

const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/**
 * Every country as one row of nine scores, narrowed by name, region and income.
 *
 * The table opens alphabetically and any column sorts on request: a reader who
 * asks for an order has made a choice, and the page has not published a ranking.
 * A thin score is outlined, as on a profile. The filters live in the address, so
 * a narrowed list can be sent. Region and income narrow the list and touch no
 * number. See D190.
 */
export function CountryFinder({
  countries,
  initial,
}: {
  countries: FinderCountry[]
  initial: FinderState
}) {
  const [state, setState] = useState(initial)
  const set = (patch: Partial<FinderState>) => setState((s) => ({ ...s, ...patch }))

  useEffect(() => {
    const params = new URLSearchParams()
    if (state.q) params.set('q', state.q)
    if (state.region) params.set('region', state.region)
    if (state.income) params.set('income', state.income)
    if (state.view !== 'table') params.set('view', state.view)
    if (state.measure !== 'score') params.set('show', state.measure)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  }, [state])

  const shown = useMemo(() => {
    const q = fold(state.q.trim())
    return countries.filter((c) => {
      const groups = COUNTRY_GROUPS[c.iso3]
      if (state.region && groups?.[0] !== state.region) return false
      if (state.income && groups?.[1] !== state.income) return false
      return !q || fold(c.country).includes(q) || c.iso3.toLowerCase() === q
    })
  }, [countries, state.q, state.region, state.income])

  const columns: Array<Column<FinderCountry>> = [
    {
      key: 'country',
      label: 'Country',
      sort: (c) => c.country,
      render: (c) => (
        <Link href={countryProfileHref(c.iso3)} className="whitespace-nowrap font-medium hover:underline">
          <CountryLabel iso3={c.iso3} name={c.country} />
        </Link>
      ),
    },
    ...DIMENSIONS.map((d, i) => {
      const label = dimensionLabel(d)
      return {
        key: d,
        label,
        head: (
          <span className="inline-flex flex-col items-end gap-1 text-[10px] leading-none">
            <Icon name={DIMENSION_ICON[d]} size={14} />
            {label}
          </span>
        ),
        align: 'right' as const,
        sort: (c: FinderCountry) =>
          state.measure === 'score' ? (c.values[i] ?? null) : (c.confidences[i] ?? null),
        render: (c: FinderCountry) => {
          const confidence = c.confidences[i] ?? null
          return state.measure === 'score' ? (
            <DimensionScore
              dim={{
                score: c.values[i] ?? null,
                belowCoverageFloor: c.floors[i] ?? false,
                observedIndicators: c.observed[i] ?? 0,
              }}
              size="sm"
              thin={confidence !== null && isThinEvidence(confidence)}
            />
          ) : (
            <Confidence value={confidence} />
          )
        },
      }
    }),
  ]

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <label className="min-w-56 grow sm:max-w-xs">
          <span className="sr-only">Country name</span>
          <input
            type="search"
            value={state.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Find a country"
            className={fieldClass()}
          />
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
          Region
          <select
            value={state.region}
            onChange={(e) => set({ region: e.target.value as FinderState['region'] })}
            className={`${controlClass()} max-w-48`}
          >
            <option value="">All</option>
            {Object.entries(COUNTRY_REGIONS).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
          Income
          <select
            value={state.income}
            onChange={(e) => set({ income: e.target.value as FinderState['income'] })}
            className={controlClass()}
          >
            <option value="">All</option>
            {Object.entries(COUNTRY_INCOME_GROUPS).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {state.view === 'table' ? (
            <label className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
              Show
              <select
                value={state.measure}
                onChange={(e) => set({ measure: e.target.value as FinderMeasure })}
                className={controlClass()}
              >
                <option value="score">Scores</option>
                <option value="confidence">Confidence</option>
              </select>
            </label>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => set({ view: state.view === 'table' ? 'shapes' : 'table' })}
          >
            {state.view === 'table' ? 'Draw as shapes' : 'Show as a table'}
          </Button>
        </div>
      </div>

      <p aria-live="polite" className="mb-3 text-xs text-[var(--muted)]">
        {shown.length} of {countries.length} countries. World Bank regions and income groups.
        {state.view === 'table' && state.measure === 'score'
          ? ' An outlined score has thin evidence.'
          : ''}
      </p>

      {shown.length === 0 ? (
        <p className="py-8 text-lg">No country matches. Clear a filter to see more.</p>
      ) : state.view === 'table' ? (
        <DataTable
          rows={shown}
          columns={columns}
          initialSort={{ key: 'country' }}
          caption="Capability scores by country"
          stickyFirst
        />
      ) : (
        <>
          <DimensionLegend />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((c) => (
              <Link
                key={c.iso3}
                href={countryProfileHref(c.iso3)}
                className="rounded-xl border border-[var(--rule)] p-3 transition-all duration-200 hover:border-[var(--foreground)]"
              >
                <span className="mb-2 block truncate text-xs font-medium">
                  <CountryLabel iso3={c.iso3} name={c.country} />
                </span>
                <Radar
                  labels="icons"
                  interactive={false}
                  hoverLabels
                  series={[
                    {
                      label: c.country,
                      values: c.values,
                      confidences: c.confidences,
                      color: 'var(--primary)',
                    },
                  ]}
                />
              </Link>
            ))}
          </div>
          <RadarEvidenceLegend interactive={false} />
        </>
      )}

      {state.view === 'table' ? <ConfidenceLegend className="mt-6" /> : null}
    </div>
  )
}
