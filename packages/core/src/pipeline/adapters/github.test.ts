import assert from 'node:assert/strict'
import { COUNTRIES, GITHUB_IG_COMMIT } from '../../model/index.js'
import {
  GITHUB_IG_INDICATOR_ID,
  buildGithubObservations,
  fetchGithubNewRepositories,
  githubLatestCommitUrl,
  githubRawUrl,
  parseRepositories,
  resolveGithubCommit,
} from './github.js'

/*
 * A synthetic file: every benchmark country's Q1 stock grows 20% a year from
 * 1,000, except three. Brazil grows 30% in the last window. Rwanda's stock
 * falls in the last window (a stall below the gate), Haiti grows 4%, under a
 * quarter of the 20% median, and Kenya has no 2026 Q1 row (unavailable, not
 * held). A non-benchmark economy and a later quarter ride along.
 */
const lines = ['repositories,iso2_code,year,quarter']
for (const country of COUNTRIES) {
  let stock = 1_000
  for (let year = 2024; year <= 2026; year += 1) {
    if (year > 2024) {
      const rate = year === 2026 && country.iso2 === 'BR' ? 0.3 : year === 2026 && country.iso2 === 'HT' ? 0.04 : 0.2
      stock = country.iso2 === 'RW' && year === 2026 ? stock - 10 : Math.round(stock * (1 + rate))
    }
    if (country.iso2 === 'KE' && year === 2026) continue
    lines.push(`${stock},${country.iso2},${year},1`)
  }
  lines.push(`9,${country.iso2},2025,3`)
}
lines.push('500,EU,2026,1', '400,EU,2025,1', `77,BR,2026,2`)
const csv = `${lines.join('\n')}\n`

const stocks = parseRepositories(csv)
assert.equal(stocks.get('BR')?.get(2026)?.get(1), 1560)
assert.equal(stocks.get('BR')?.get(2026)?.get(2), 77)
assert.throws(() => parseRepositories('repositories,iso2_code,year\n1,BR,2020\n'), /missing quarter/)

const result = buildGithubObservations(csv, { retrievedAt: '2026-10-02T00:00:00.000Z' })

/* The window closes at the latest Q1, even when a later quarter exists. */
assert.deepEqual(result.pin.window, { from: 2025, to: 2026, quarter: 1 })
assert.equal(result.pin.latestQuarter, '2026 Q2')
assert.equal(result.pin.commit, GITHUB_IG_COMMIT)
assert.equal(result.pin.rawUrl, githubRawUrl(GITHUB_IG_COMMIT))
assert.equal(result.pin.gate.medianGrowthPct, 20)
assert.equal(result.pin.gate.thresholdPct, 5)

/* Kenya is unavailable, Rwanda and Haiti held, the rest emitted. */
assert.ok(!result.availableCountries.includes('KEN'))
assert.deepEqual(result.heldCountries, ['HTI', 'RWA'])
assert.equal(result.observations.length, COUNTRIES.length - 3)
assert.ok(!result.emittedCountries.includes('RWA'))
assert.ok(!result.emittedCountries.includes('HTI'))
assert.deepEqual(result.unmappedLabels, ['EU'])

const rwanda = result.held.find((h) => h.iso3 === 'RWA')!
assert.equal(rwanda.reason, 'stalled_stock')
assert.ok(rwanda.growthPct < 0)
assert.deepEqual(rwanda.changes.map((c) => c.to), [2025, 2026])
assert.match(rwanda.detail, /fell in 1 of 2 year-on-year windows/)
assert.equal(result.held.find((h) => h.iso3 === 'HTI')!.growthPct, 4)

/* A held country is never emitted at zero, and the value is the count, not a rate. */
const brazil = result.observations.find((o) => o.iso3 === 'BRA')!
assert.equal(brazil.indicatorId, GITHUB_IG_INDICATOR_ID)
assert.equal(brazil.value, 1560 - 1200)
assert.equal(brazil.year, 2026)
assert.equal(brazil.sourceTier, 'academic_survey')
assert.match(brazil.note!, /1560 at 2026 Q1 less 1200 at 2025 Q1/)
assert.ok(result.observations.every((o) => o.value > 0))

/* The pin keeps every Q1 stock, held countries included, so a rescore never needs the network. */
assert.deepEqual(result.pin.q1Stocks.BRA, { '2024': 1000, '2025': 1200, '2026': 1560 })
assert.ok(result.pin.q1Stocks.RWA)

/* `latest` resolves through the commits API; anything else must be a full SHA. */
const sha = 'a'.repeat(40)
const seen: string[] = []
const fakeFetch = (async (input: string | URL | Request) => {
  const url = String(input)
  seen.push(url)
  if (url === githubLatestCommitUrl()) return new Response(JSON.stringify([{ sha }]), { status: 200 })
  if (url === githubRawUrl(sha)) return new Response(csv, { status: 200 })
  return new Response('not found', { status: 404 })
}) as typeof fetch
assert.equal(await resolveGithubCommit('latest', fakeFetch), sha)
await assert.rejects(resolveGithubCommit('main', fakeFetch), /not a full commit SHA/)
seen.length = 0
const fetched = await fetchGithubNewRepositories({ commit: 'latest', fetchImpl: fakeFetch, retrievedAt: '2026-10-02T00:00:00.000Z' })
assert.equal(fetched.pin.commit, sha)
assert.deepEqual(seen, [githubLatestCommitUrl(), githubRawUrl(sha)])
await assert.rejects(fetchGithubNewRepositories({ commit: 'b'.repeat(40), fetchImpl: fakeFetch }), /HTTP 404/)

console.log('github adapter: ok')
