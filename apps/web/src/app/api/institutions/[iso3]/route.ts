import { LANGS } from '@ncb/core'
import type { Lang } from '@ncb/core'
import { loadInstitutionExplorer } from '@/lib/data'

/**
 * One country's institution map, projected for a drawn network.
 *
 * The viewer publishes this and never renders it. `@envisioning/app` draws the
 * network, it is closed source, and this repository is public, so the explorer
 * is a separate deployment that reads this route. The ledger at
 * `/country/{ISO3}/institutions` stays the authoritative reading of a relation,
 * because a line cannot carry a direction or name one of 13 verbs. See D82.
 *
 * Open to any origin, like the rest of the published dataset.
 */

export const dynamic = 'force-dynamic'

const DEFAULT_LANG: Lang = 'en'

function json(body: unknown, status: number): Response {
  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=60',
    },
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ iso3: string }> },
): Promise<Response> {
  const { iso3 } = await params
  const requested = new URL(request.url).searchParams.get('lang')
  const lang = LANGS.find((candidate) => candidate === requested) ?? DEFAULT_LANG

  const feed = await loadInstitutionExplorer(iso3, lang)
  if (!feed) {
    return json(
      {
        error: 'No institution map for this country and language.',
        iso3: iso3.toUpperCase(),
        lang,
        available: LANGS,
      },
      404,
    )
  }

  return json(feed, 200)
}
