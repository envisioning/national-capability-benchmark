import { absoluteHref, sitemapHref } from '@/lib/links'

export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${absoluteHref(sitemapHref)}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
