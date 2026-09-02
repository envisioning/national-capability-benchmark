import { COUNTRIES, DIMENSIONS } from '@ncb/core'
import { loadIndex } from '@/lib/data'
import { COUNTRY_LAYERS } from '@/lib/layers'
import { METHOD_PAGES } from '@/lib/nav'
import {
  absoluteHref,
  aboutHref,
  agendasIndexHref,
  agendaHref,
  capabilitiesHref,
  objectionsHref,
  changelogHref,
  compareBaseHref,
  contactHref,
  countriesHref,
  exploreHref,
  gapsHref,
  countryLayerHref,
  countryProfileHref,
  digestHref,
  layerSectionHref,
  supportHref,
  thesisHref,
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
  add(countriesHref)
  /* The bare comparison page only. A combination is a reader's selection, not
     a published page, and 53 countries make more pairs than a crawl map should
     carry. See D70. */
  add(compareBaseHref)
  add(capabilitiesHref)
  for (const dimension of DIMENSIONS) add(`${capabilitiesHref}/${dimension}`)
  add(agendasIndexHref)
  add(thesisHref)
  add(exploreHref())
  add('/country/BRA/institutions')
  /* Every country layer and the sections it holds of its own. A section that
     still lives in the ground layer is already listed there. See D69. */
  for (const layer of COUNTRY_LAYERS) {
    add(countryLayerHref(layer))
    for (const section of layer.sections) {
      if (section.slug) add(layerSectionHref(layer, section))
    }
  }
  add(aboutHref)
  add(changelogHref)
  add(supportHref)
  add(gapsHref)
  add(objectionsHref)
  add(contactHref)
  for (const entry of METHOD_PAGES) add(entry.href)
  for (const country of COUNTRIES) {
    add(countryProfileHref(country.iso3))
    add(agendaHref(country.iso3))
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
