import { NextResponse } from 'next/server'
import { INDICATORS_BY_ID } from '@ncb/core'
import { loadIndicatorAcrossCountries } from '@/lib/data'

/**
 * One indicator across every country.
 *
 * The peek in the viewer fetches this when a reader clicks a number, so the
 * 40-country context is loaded on demand rather than shipped with every page.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!INDICATORS_BY_ID[id]) {
    return NextResponse.json({ error: 'unknown indicator' }, { status: 404 })
  }
  const view = await loadIndicatorAcrossCountries(id)
  if (!view) {
    return NextResponse.json({ error: 'no scored values for this indicator' }, { status: 404 })
  }
  return NextResponse.json(view)
}
