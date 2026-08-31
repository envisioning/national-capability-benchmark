import { NextResponse } from 'next/server'
import { COUNTRY_NAMES } from '@ncb/core'
import { loadIndex } from '@/lib/data'
import { toProfile } from '@/lib/profile'

/**
 * One country's nine scores and their confidences, and nothing else.
 *
 * The header draws this country's shape when the reader is standing in it, and
 * the header renders above every page. Reading the 597KB slim index in the root
 * layout would make every page on the site pay for a chart most readers never
 * open, so the shape is fetched when the menu opens instead. That is what this
 * route is for: the smallest payload a radar can be drawn from. See D30 and
 * D87.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const code = iso3.toUpperCase()
  if (!COUNTRY_NAMES[code]) {
    return NextResponse.json({ error: 'unknown country' }, { status: 404 })
  }
  const data = await loadIndex()
  if (!data) return NextResponse.json({ error: 'no scored output' }, { status: 404 })

  const country = data.countries.find((c) => c.iso3 === code)
  if (!country) return NextResponse.json({ error: 'country not scored' }, { status: 404 })

  return NextResponse.json(toProfile(country))
}
