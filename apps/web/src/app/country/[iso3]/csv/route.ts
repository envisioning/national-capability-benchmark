import { loadCountry } from '@/lib/data'
import { countryCsv } from '@/lib/distribution'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ iso3: string }> },
): Promise<Response> {
  const { iso3 } = await params
  const country = await loadCountry(iso3)
  if (!country) {
    return new Response('Country not found\n', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  return new Response(countryCsv(country), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${country.iso3}.csv"`,
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
