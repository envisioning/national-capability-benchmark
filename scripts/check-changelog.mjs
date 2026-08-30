import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const changelogPath = resolve(root, 'CHANGELOG.md')
const versionPath = resolve(root, 'packages/core/src/model/version.ts')
const releaseHeading = /^(?:v)?(\d+\.\d+\.\d+)\s+[—–-]\s+(\d{4}-\d{2}-\d{2})\s*$/

function compareVersions(left, right) {
  const a = left.split('.').map(Number)
  const b = right.split('.').map(Number)
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return (a[i] ?? 0) - (b[i] ?? 0)
  }
  return 0
}

const [changelog, versionSource] = await Promise.all([
  readFile(changelogPath, 'utf8'),
  readFile(versionPath, 'utf8'),
])

const current = versionSource.match(/DATASET_VERSION\s*=\s*['"](\d+\.\d+\.\d+)['"]/)?.[1]
const headings = [...changelog.matchAll(/^##\s+(.+)$/gm)]
const problems = []

if (!current) problems.push(`could not read DATASET_VERSION from ${versionPath}`)
if (headings.length === 0) problems.push('no release headings found')

const releases = []
for (const [index, heading] of headings.entries()) {
  const title = heading[1] ?? ''
  const match = releaseHeading.exec(title)
  if (!match) {
    problems.push(`invalid release heading: "## ${title}" (use "## X.Y.Z — YYYY-MM-DD")`)
    continue
  }

  const version = match[1]
  const date = match[2]
  const start = (heading.index ?? 0) + heading[0].length
  const end = headings[index + 1]?.index ?? changelog.length
  if (!changelog.slice(start, end).trim()) problems.push(`${version}: release entry is empty`)
  if (releases.some((release) => release.version === version)) {
    problems.push(`${version}: release version is duplicated`)
  }
  releases.push({ version, date })
}

if (current && releases[0]?.version !== current) {
  problems.push(
    `newest changelog release is ${releases[0]?.version ?? 'missing'}, but DATASET_VERSION is ${current}`,
  )
}
for (let i = 1; i < releases.length; i += 1) {
  const previous = releases[i - 1]
  const release = releases[i]
  if (previous && release && compareVersions(previous.version, release.version) <= 0) {
    problems.push(`${release.version}: releases must be newest first`)
  }
}

if (problems.length > 0) {
  console.error('Changelog check failed:')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exitCode = 1
} else {
  console.log(
    `Changelog OK: ${releases.length} release(s), newest ${releases[0].version} (${releases[0].date})`,
  )
}
