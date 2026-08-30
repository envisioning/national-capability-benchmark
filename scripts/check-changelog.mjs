import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const changelogPath = resolve(root, 'CHANGELOG.md')
const versionPath = resolve(root, 'packages/core/src/model/version.ts')
const releaseHeading = /^(App|Dataset)\s+(?:v)?(\d+\.\d+\.\d+)\s+[—–-]\s+(\d{4}-\d{2}-\d{2})\s*$/

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

const current = {
  app: versionSource.match(/APP_VERSION\s*=\s*['"](\d+\.\d+\.\d+)['"]/)?.[1],
  dataset: versionSource.match(/DATASET_VERSION\s*=\s*['"](\d+\.\d+\.\d+)['"]/)?.[1],
}
const headings = [...changelog.matchAll(/^##\s+(.+)$/gm)]
const problems = []

if (!current.app) problems.push(`could not read APP_VERSION from ${versionPath}`)
if (!current.dataset) problems.push(`could not read DATASET_VERSION from ${versionPath}`)
if (headings.length === 0) problems.push('no release headings found')

const releases = []
for (const [index, heading] of headings.entries()) {
  const title = heading[1] ?? ''
  const match = releaseHeading.exec(title)
  if (!match) {
    problems.push(
      `invalid release heading: "## ${title}" (use "## App X.Y.Z — YYYY-MM-DD" or "## Dataset X.Y.Z — YYYY-MM-DD")`,
    )
    continue
  }

  const kind = match[1].toLowerCase()
  const version = match[2]
  const date = match[3]
  const start = (heading.index ?? 0) + heading[0].length
  const end = headings[index + 1]?.index ?? changelog.length
  if (!changelog.slice(start, end).trim()) problems.push(`${kind} ${version}: release entry is empty`)
  if (releases.some((release) => release.kind === kind && release.version === version)) {
    problems.push(`${kind} ${version}: release version is duplicated`)
  }
  releases.push({ kind, version, date })
}

for (const kind of ['app', 'dataset']) {
  const expected = current[kind]
  const typed = releases.filter((release) => release.kind === kind)
  if (typed.length === 0) {
    problems.push(`no ${kind} release headings found`)
    continue
  }
  if (expected && typed[0]?.version !== expected) {
    problems.push(
      `newest ${kind} changelog release is ${typed[0]?.version ?? 'missing'}, but ${kind === 'app' ? 'APP_VERSION' : 'DATASET_VERSION'} is ${expected}`,
    )
  }
  for (let i = 1; i < typed.length; i += 1) {
    const previous = typed[i - 1]
    const release = typed[i]
    if (previous && release && compareVersions(previous.version, release.version) <= 0) {
      problems.push(`${kind} ${release.version}: releases must be newest first`)
    }
  }
}

if (problems.length > 0) {
  console.error('Changelog check failed:')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exitCode = 1
} else {
  console.log(
    `Changelog OK: ${releases.length} release(s), newest app ${current.app} and dataset ${current.dataset}`,
  )
}
