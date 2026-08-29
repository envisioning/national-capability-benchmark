import { appendFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { NextResponse } from 'next/server'
import {
  COUNTRIES,
  ChallengeRecord,
  ChallengeSubmission,
  DIMENSIONS,
  type Dimension,
} from '@ncb/core'
import { DATA_ROOT, loadCountry } from '@/lib/data'
import { challengeDetailHref } from '@/lib/links'

export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ iso3: string; dimension: string }> },
) {
  const { iso3: rawIso3, dimension: rawDimension } = await params
  const iso3 = rawIso3.toUpperCase()
  const dimension = rawDimension as Dimension

  if (!COUNTRIES.some((country) => country.iso3 === iso3)) {
    return NextResponse.json({ error: 'unknown country' }, { status: 404 })
  }
  if (!DIMENSIONS.includes(dimension)) {
    return NextResponse.json({ error: 'unknown dimension' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'request body must be JSON' }, { status: 400 })
  }
  const submission = ChallengeSubmission.safeParse(body)
  if (!submission.success) {
    return NextResponse.json(
      { error: 'argument must be between 20 and 4000 characters, with an optional valid source URL' },
      { status: 400 },
    )
  }

  const country = await loadCountry(iso3)
  const result = country?.dimensions[dimension]
  if (!result || result.score === null) {
    return NextResponse.json({ error: 'this dimension has no score to challenge' }, { status: 409 })
  }

  const submittedAt = new Date().toISOString()
  const record = ChallengeRecord.parse({
    kind: 'dispute',
    id: `dispute-${submittedAt.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`,
    target: {
      iso3,
      dimension,
      value: result.score,
      confidence: result.confidence,
    },
    argument: submission.data.argument,
    ...(submission.data.sourceUrl ? { sourceUrl: submission.data.sourceUrl } : {}),
    submittedAt,
    status: 'submitted',
  })

  const directory = resolve(DATA_ROOT, 'disputes')
  await mkdir(directory, { recursive: true })
  await appendFile(
    resolve(directory, `${submittedAt.slice(0, 10)}.jsonl`),
    `${JSON.stringify(record)}\n`,
    'utf8',
  )

  return NextResponse.json(
    { id: record.id, href: challengeDetailHref(record.id) },
    { status: 201 },
  )
}
