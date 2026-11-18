'use client'

import { COUNTRY_NAMES } from '@ncb/core'
import type { GapExplanation } from '@ncb/core'
import { FlagField, layoutField } from '@/components/FlagField'
import type { FlagFieldPoint } from '@/components/FlagField'
import { countryMapDimensionHref } from '@/lib/links'
import { POST_FIELD_WORDS_EN } from '@/lib/words'

/**
 * The gap as a picture: the country and its income peers on the shared field
 * chart, with the band and the line drawn from the peers alone, so the line is
 * the median the gap is measured from. Every score comes from the post file,
 * never from the current data: a post is a closed edition. See D197.
 */
export function PeerField({ gap, legend = false }: { gap: GapExplanation; legend?: boolean }) {
  const peers = gap.peerScores ?? []
  const point = (iso3: string, value: number, confidence: number, focal: boolean): FlagFieldPoint => ({
    key: iso3,
    iso3,
    label: COUNTRY_NAMES[iso3] ?? iso3,
    value,
    confidence,
    focal,
    href: countryMapDimensionHref(iso3, gap.dimension),
  })
  const peerPoints = peers.map((p) => point(p.iso3, p.score, p.confidence, false))
  const points = [point(gap.iso3, gap.score, gap.confidence, true), ...peerPoints]
  const band = layoutField(peerPoints)
  const layout = { ...layoutField(points), median: gap.peerMedian, q1: band.q1, q3: band.q3 }
  return <FlagField points={points} layout={layout} legend={legend} words={POST_FIELD_WORDS_EN} />
}
