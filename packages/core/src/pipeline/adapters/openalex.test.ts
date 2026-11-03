import assert from 'node:assert/strict'
import { COUNTRIES } from '../../model/index.js'
import {
  buildOpenAlexObservations,
  fetchOpenAlexCitationImpact,
  fetchOpenAlexHistory,
  groupsComplete,
  openAlexRequests,
  parseCountryGroups,
} from './openalex.js'

/* Grouped keys arrive as country URLs; anything that is not an alpha-2 code is ignored. */
const parsed = parseCountryGroups({
  group_by: [
    { key: 'https://openalex.org/countries/BR', count: 10 },
    { key: 'us', count: 4 },
    { key: 'unknown', count: 99 },
  ],
})
assert.deepEqual([...parsed.entries()], [['BR', 10], ['US', 4]])
assert.throws(() => parseCountryGroups({ meta: {} }), /no group_by/)

/*
 * A fake API: every benchmark country is in the denominator group, Haiti is
 * missing from the numerator group, which forces the per-country fallback.
 * Rwanda has no works at all and must be held.
 */
const requests = openAlexRequests()
const seen: string[] = []
const groups = (pick: (iso2: string) => number | null) => ({
  meta: { count: 1_000 },
  group_by: COUNTRIES.flatMap((country) => {
    const count = pick(country.iso2)
    return count === null ? [] : [{ key: `https://openalex.org/countries/${country.iso2}`, count }]
  }),
})
const fakeFetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = String(input)
  seen.push(url)
  assert.match(url, /&mailto=owner%40example\.org$/)
  assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer k')
  const base = url.replace(/&mailto=.*$/, '')
  let body: unknown
  if (base === requests.denominator) body = groups((iso2) => (iso2 === 'RW' ? 0 : 200))
  else if (base === requests.numerator) body = groups((iso2) => (iso2 === 'HT' ? null : iso2 === 'RW' ? 0 : iso2 === 'BR' ? 30 : 40))
  else if (base === requests.baselineWorks) body = { meta: { count: 1_000 } }
  else if (base === requests.baselineTop10) body = { meta: { count: 200 } }
  else if (base === requests.country('HT', false)) body = { meta: { count: 50 } }
  else if (base === requests.country('HT', true)) body = { meta: { count: 5 } }
  else throw new Error(`unexpected request ${base}`)
  return new Response(JSON.stringify(body), { status: 200 })
}) as typeof fetch

const result = await fetchOpenAlexCitationImpact({
  retrievedAt: '2026-10-01T00:00:00.000Z',
  mailto: 'owner@example.org',
  apiKey: 'k',
  fetchImpl: fakeFetch,
})

assert.equal(result.adapterId, 'openalex-top10-share-v1')
assert.equal(result.release, 'openalex-api-2026-10-01')
assert.equal(seen.length, 6, 'four window calls plus two for the one missing country')
assert.equal(result.pin.baselineShare, 0.2)
assert.equal(result.availableCountries.length, COUNTRIES.length)
assert.deepEqual(result.heldCountries, ['RWA'])
assert.equal(result.observations.length, COUNTRIES.length - 1)

const bra = result.observations.find((o) => o.iso3 === 'BRA')!
/* 30 / 200 = 15%, over a 20% baseline. */
assert.equal(bra.value, 0.75)
assert.equal(bra.year, 2021)
assert.equal(bra.indicatorId, 'research_citation_impact')
assert.match(bra.note ?? '', /30 of 200 works/)
assert.match(bra.note ?? '', /CC0/)

const hti = result.observations.find((o) => o.iso3 === 'HTI')!
assert.equal(hti.value, 0.5)
assert.equal(result.pin.counts.HTI?.via, 'per_country')
assert.deepEqual(result.pin.requests.perCountry, [requests.country('HT', false), requests.country('HT', true)])

/* A grouped list shorter than a page holds every group; a full page does not. */
assert.equal(groupsComplete({ meta: { groups_count: 198 } }), true)
assert.equal(groupsComplete({ meta: { groups_count: 200 } }), false)
assert.equal(groupsComplete({ meta: {} }), false)

/*
 * History (D184): one year at a time, pooled into the pinned window's length.
 * Brazil has 10 of 100 works a year against a 20% baseline, so every window
 * reads 0.5. Haiti is absent from a complete numerator list in 2019 and so
 * has 0 top works that year. Rwanda is held in the pin and gets no history.
 */
const yearFetch = (async (input: string | URL | Request) => {
  const url = String(input)
  const year = Number(/publication_year:(\d{4})-/.exec(url)?.[1])
  const grouped = (pick: (iso2: string) => number | null) => ({
    meta: { count: 1_000, groups_count: 150 },
    group_by: COUNTRIES.flatMap((country) => {
      const count = pick(country.iso2)
      return count === null ? [] : [{ key: `https://openalex.org/countries/${country.iso2}`, count }]
    }),
  })
  let body: unknown
  if (url.includes('group_by') && url.includes('true|false')) body = grouped((iso2) => (iso2 === 'RW' ? null : iso2 === 'TL' && year < 2019 ? 10 : 100))
  else if (url.includes('group_by')) body = grouped((iso2) => (iso2 === 'RW' || (iso2 === 'HT' && year === 2019) ? null : 10))
  else if (url.includes('true|false')) body = { meta: { count: 1_000 } }
  else body = { meta: { count: 200 } }
  return new Response(JSON.stringify(body), { status: 200 })
}) as typeof fetch

const history = await fetchOpenAlexHistory(result.pin, { from: 2017, retrievedAt: '2026-11-03T00:00:00.000Z', fetchImpl: yearFetch })
assert.equal(history.pin.history?.years.length, 5, 'publication years 2017 to 2021')
assert.equal(history.pin.history?.years[2]?.counts.HTI?.via, 'group_absent')
assert.equal(history.pin.history?.years[2]?.counts.HTI?.top10, 0)
/* The pinned value is untouched; the history adds 2019 and 2020 only, never a second 2021. */
const braYears = history.observations.filter((o) => o.iso3 === 'BRA')
assert.deepEqual(braYears.map((o) => [o.year, o.value]), [[2019, 0.5], [2020, 0.5], [2021, 0.75]])
assert.equal(braYears[0]!.retrievedAt, '2026-11-03T00:00:00.000Z')
assert.match(braYears[0]!.note ?? '', /works 2017-2019/)
/* Haiti 2019: 10 + 10 + 0 top works of 300, a 6.67% share against 20%. */
assert.equal(history.observations.find((o) => o.iso3 === 'HTI' && o.year === 2019)?.value, 0.333)
assert.equal(history.observations.filter((o) => o.iso3 === 'RWA').length, 0)
/* Timor-Leste pools 10 + 10 + 100 works into 2019, under the floor; 2020 pools 210 and counts. */
assert.deepEqual(history.observations.filter((o) => o.iso3 === 'TLS').map((o) => o.year), [2020, 2021])
assert.deepEqual(history.emittedCountries, result.emittedCountries)
/* A rebuild from the stored pin gives the same observations: a rescore needs no network. */
assert.deepEqual(buildOpenAlexObservations(history.pin).observations, history.observations)

/* No stored URL carries the courtesy address or the key. */
const stored = JSON.stringify(result)
assert.doesNotMatch(stored, /mailto|example\.org|api_key|Bearer/)

/* A country the fallback cannot count either fails the fetch rather than shrinking the frame. */
await assert.rejects(
  fetchOpenAlexCitationImpact({
    fetchImpl: (async (input: string | URL | Request) => {
      const url = String(input)
      if (url === requests.denominator) return new Response(JSON.stringify(groups(() => 1)))
      if (url === requests.numerator) return new Response(JSON.stringify(groups((iso2) => (iso2 === 'BR' ? null : 1))))
      if (url.includes('country_code:BR')) return new Response('{}', { status: 200 })
      return new Response(JSON.stringify({ meta: { count: 10 } }))
    }) as typeof fetch,
  }),
  /no meta.count/,
)

console.log('OpenAlex adapter validated: grouped counts, per-country fallback, held country, history windows, unstored courtesy params.')
