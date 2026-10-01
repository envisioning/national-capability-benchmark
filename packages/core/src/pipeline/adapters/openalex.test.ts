import assert from 'node:assert/strict'
import { COUNTRIES } from '../../model/index.js'
import { fetchOpenAlexCitationImpact, openAlexRequests, parseCountryGroups } from './openalex.js'

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

console.log('OpenAlex adapter validated: grouped counts, per-country fallback, held country, unstored courtesy params.')
