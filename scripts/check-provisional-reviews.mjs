import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const reviewsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'reviews')
const layers = ['velocity', 'leverage', 'residual']
const reviewPattern = /^(velocity|leverage|residual)-(\d{4})-q([1-4])\.md$/
const requiredHeadings = [
  'What did we learn about the methodology?',
  'What did we learn about the data sources?',
  'What did we learn about the reader?',
  'Is the layer still on track for promotion?',
  'What do we need to do next quarter?',
]

function quarterIndex(year, quarter) {
  return year * 4 + quarter - 1
}

function currentQuarter(date = new Date()) {
  return { year: date.getUTCFullYear(), quarter: Math.floor(date.getUTCMonth() / 3) + 1 }
}

const now = currentQuarter()
const currentIndex = quarterIndex(now.year, now.quarter)
const entries = await readdir(reviewsDir)
const latest = new Map()
const problems = []

for (const name of entries) {
  const match = reviewPattern.exec(name)
  if (!match) continue
  const [, layer, yearText, quarterText] = match
  const review = { name, layer, year: Number(yearText), quarter: Number(quarterText) }
  const previous = latest.get(layer)
  if (!previous || quarterIndex(review.year, review.quarter) > quarterIndex(previous.year, previous.quarter)) {
    latest.set(layer, review)
  }
}

for (const layer of layers) {
  const review = latest.get(layer)
  if (!review) {
    problems.push(`${layer}: no review entry found`)
    continue
  }
  const age = currentIndex - quarterIndex(review.year, review.quarter)
  if (age > 0) problems.push(`${layer}: latest review is ${review.name}, one or more quarters behind`)

  const body = await readFile(join(reviewsDir, review.name), 'utf8')
  for (const heading of requiredHeadings) {
    if (!body.includes(`## ${heading}`)) problems.push(`${review.name}: missing heading "${heading}"`)
  }
}

if (problems.length > 0) {
  console.error('Provisional review check failed:')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exitCode = 1
} else {
  for (const layer of layers) console.log(`${layer}: ${latest.get(layer).name}`)
  console.log(`Reviews current for ${now.year} Q${now.quarter}.`)
}
