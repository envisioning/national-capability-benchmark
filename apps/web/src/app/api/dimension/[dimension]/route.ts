import { NextResponse } from 'next/server'
import { DIMENSIONS, primaryMomentum } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { loadIndex } from '@/lib/data'

/**
 * One dimension across every country, built from the slim index.
 *
 * The same idea as the indicator route: a score means little alone and a lot
 * beside the field it sits in. See D30.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dimension: string }> },
) {
  const { dimension } = await params
  if (!DIMENSIONS.includes(dimension as Dimension)) {
    return NextResponse.json({ error: 'unknown dimension' }, { status: 404 })
  }
  const data = await loadIndex()
  if (!data) return NextResponse.json({ error: 'no scored output' }, { status: 404 })

  const values = data.countries
    .map((c) => {
      const dim = c.dimensions[dimension as Dimension]
      if (!dim || dim.score === null) return null
      const m = primaryMomentum(dim.momentum)
      return {
        iso3: c.iso3,
        country: c.country,
        score: dim.score,
        confidence: dim.confidence,
        delta: m?.delta ?? null,
        /* A trend never travels without its basket size and span. */
        basket: m?.matchedIndicators ?? null,
        spanYears: m ? m.currentYear - m.baseYear : null,
      }
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v))
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ dimension, values })
}
