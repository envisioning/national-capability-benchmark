import { APP_VERSION, DATASET_VERSION } from '@ncb/core'
import type { Lang } from '@ncb/core'
import { loadIndex, loadPosts } from '@/lib/data'
import { loadAgendaFeedEntries, loadChangelogFeedEntries } from '@/lib/distribution'
import {
  absoluteHref,
  agendaHrefInLanguage,
  changelogReleaseHref,
  feedHref,
  digestHref,
  postHref,
} from '@/lib/links'

export const dynamic = 'force-static'

function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
/**
 * The feed carries one entry per agenda document the viewer can show. A
 * rendered lexicon with no page behind it is not a published thing, so it does
 * not reach the feed. See D69.
 */
function entryUrl(iso3: string, lang: Lang): string | null {
  const href = agendaHrefInLanguage(iso3, lang)
  return href ? absoluteHref(href) : null
}

export async function GET(): Promise<Response> {
  const index = await loadIndex()
  const date = index?.generatedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  const [agendas, releases, posts] = await Promise.all([
    loadAgendaFeedEntries(),
    loadChangelogFeedEntries(date),
    loadPosts(),
  ])
  /* Posts are the explainers, so the feed carries each one in full summary. See D195. */
  const postEntries = posts.map((post) => {
    const url = absoluteHref(postHref(post.slug))
    return { id: url, link: url, title: post.title, summary: post.dek, updated: `${post.date}T00:00:00.000Z` }
  })

  const agendaEntries = agendas.flatMap((entry) => {
    const url = entryUrl(entry.iso3, entry.lang)
    return url
      ? [{ id: url, link: url, title: entry.title, summary: entry.summary, updated: entry.updated }]
      : []
  })
  const releaseEntries = releases.map((entry) => ({
    id: `${absoluteHref(feedHref)}#${entry.kind}-${entry.version}`,
    link: absoluteHref(changelogReleaseHref(entry.version, entry.kind)),
    title: `${entry.kind === 'app' ? 'App' : 'Dataset'} ${entry.version}`,
    summary: entry.summary,
    updated: entry.updated,
  }))
  const digestUrl = absoluteHref(digestHref(date))
  const entries = [
    ...postEntries,
    ...agendaEntries,
    ...releaseEntries,
    {
      id: digestUrl,
      link: digestUrl,
      title: `Country of the week, ${date}`,
      summary: 'A dated country comparison from the current benchmark frame.',
      updated: `${date}T00:00:00.000Z`,
    },
  ].sort((a, b) => b.updated.localeCompare(a.updated) || a.id.localeCompare(b.id))

  const body = entries
    .map(
      (entry) => `
  <entry>
    <id>${xml(entry.id)}</id>
    <link href="${xml(entry.link)}" />
    <title>${xml(entry.title)}</title>
    <updated>${xml(entry.updated)}</updated>
    <summary>${xml(entry.summary)}</summary>
  </entry>`,
    )
    .join('')

  const version = index?.version ?? DATASET_VERSION
  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>NCB, the National Capability Benchmark</title>
  <id>${xml(absoluteHref(feedHref))}</id>
  <link href="${xml(absoluteHref(feedHref))}" rel="self" type="application/atom+xml" />
  <link href="${xml(absoluteHref('/'))}" />
  <updated>${xml(index?.generatedAt ?? new Date().toISOString())}</updated>
  <subtitle>Country capability agendas, app releases, dataset updates and the weekly digest. App ${xml(APP_VERSION)}; dataset ${xml(version)}.</subtitle>${body}
</feed>
`

  return new Response(feed, {
    headers: {
      'content-type': 'application/atom+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
