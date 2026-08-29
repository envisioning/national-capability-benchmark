import { COUNTRIES, DIMENSIONS } from '@ncb/core'
import { loadIndex } from '@/lib/data'
import {
  absoluteHref,
  aboutHref,
  agendaHref,
  capabilitiesHref,
  challengeHref,
  countryProfileHref,
  digestHref,
  METHOD_SUBNAV,
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

export async function GET(): Promise<Response> {
  const index = await loadIndex()
  const lastmod = index?.generatedAt
  const date = index?.generatedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  const paths = new Map<string, string | undefined>()
  const add = (path: string, modified = lastmod) => paths.set(path, modified)

  add('/')
  add(capabilitiesHref)
  for (const dimension of DIMENSIONS) add(`${capabilitiesHref}/${dimension}`)
  add('/agenda')
  add('/pt')
  add('/pt/agenda')
  add('/pt/instituicoes')
  add(aboutHref)
  add(challengeHref)
  for (const entry of METHOD_SUBNAV) add(entry.href)
  for (const country of COUNTRIES) {
    add(countryProfileHref(country.iso3))
    add(agendaHref(country.iso3, 'en'))
    add(agendaHref(country.iso3, 'pt-BR'))
  }
  add(digestHref(date), date)

  const urls = [...paths.entries()]
    .map(
      ([path, modified]) => `
  <url>
    <loc>${xml(absoluteHref(path))}</loc>${modified ? `
    <lastmod>${xml(modified)}</lastmod>` : ''}
  </url>`,
    )
    .join('')
  const body = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
