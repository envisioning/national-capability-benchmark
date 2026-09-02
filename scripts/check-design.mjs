/**
 * The design rules in AGENTS.md that a machine can read, checked against the
 * viewer. It warns and never fails: every rule here is a judgment the author is
 * allowed to overrule, and a build that stops on a stroke width would be worse
 * than the drift it prevents. What it buys is that the drift is said out loud
 * on every build instead of being found a year later in a screenshot.
 *
 * Run it directly with `pnpm design:check`. It also runs before a build and
 * before a typecheck, beside the changelog check.
 */

import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const viewer = join(root, 'apps/web/src')

/**
 * Files that draw something other than a chart, and so keep their own
 * geometry: Lucide's own stroke, the brand mark, and the 1200 pixel social
 * card. See D103.
 */
const STROKE_EXEMPT = new Set([
  'components/chartTokens.ts',
  'components/Icon.tsx',
  'components/EnvisioningMark.tsx',
  'components/Og.tsx',
])

/** Where a repository document may be named as a bare path. */
const DOC_HREF = /rawHref\(|docHref\(|DOC_[A-Z]/

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else if (/\.tsx?$/.test(entry.name)) files.push(path)
  }
  return files
}

/**
 * The file with everything a reader never sees blanked out: block comments,
 * line comments and regular expressions. The copy rules only apply to what
 * reaches the page, and this repository's own comments are written to a
 * different standard on purpose.
 *
 * Blanked rather than deleted, so every character keeps the offset it had and
 * a warning still names the line the author has to open.
 */
function blank(text) {
  return text.replace(/[^\n]/g, ' ')
}

function readerText(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/^\s*\/\/.*$/gm, blank)
    .replace(/\/(?![/*])(?:\\.|\[[^\]]*\]|[^/\n\\])+\/[gimsuy]*/g, blank)
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length
}

const warnings = []
function warn(file, line, rule, message) {
  warnings.push({ file, line, rule, message })
}

for (const path of await walk(viewer)) {
  const file = relative(viewer, path)
  const source = await readFile(path, 'utf8')
  const visible = readerText(source)

  if (!STROKE_EXEMPT.has(file)) {
    for (const match of source.matchAll(/strokeWidth=(?:\{([\d.]+)\}|"([\d.]+)")/g)) {
      const value = match[1] ?? match[2]
      warn(
        file,
        lineOf(source, match.index ?? 0),
        'chart-stroke',
        `stroke width ${value} written by hand. Use CHART_STROKE from components/chartTokens.ts, or name it locally with the reason. See D103.`,
      )
    }
  }

  for (const match of source.matchAll(/\btext-sm\b/g)) {
    warn(
      file,
      lineOf(source, match.index ?? 0),
      'type-scale',
      'text-sm is not in the type scale. Labels and table text are text-xs, body is text-lg.',
    )
  }

  for (const match of visible.matchAll(/[—–]/g)) {
    warn(
      file,
      lineOf(visible, match.index ?? 0),
      'dash',
      'em or en dash in reader copy. The viewer publishes neither.',
    )
  }

  for (const match of visible.matchAll(/docs\/[A-Za-z-]+\.md/g)) {
    const line = lineOf(visible, match.index ?? 0)
    const text = visible.split('\n')[line - 1] ?? ''
    if (DOC_HREF.test(text)) continue
    warn(
      file,
      line,
      'doc-link',
      `${match[0]} written as a bare path. A document named in a page is a link, built by docHref. See D40.`,
    )
  }
}

if (warnings.length === 0) {
  console.log(`Design OK: ${(await walk(viewer)).length} viewer files, no drift found`)
} else {
  console.warn(`Design check: ${warnings.length} warning(s). Nothing here fails the build.`)
  for (const { file, line, rule, message } of warnings) {
    console.warn(`  ${file}:${line}  [${rule}] ${message}`)
  }
}
