#!/usr/bin/env node
/**
 * Favicon and app-icon generator, shared with the other Envisioning sites.
 *
 * Reads a single-colour source SVG (which uses `currentColor`), composes it
 * onto a rounded-square tile painted in the brand colours, and rasterises the
 * full set of PNG and ICO assets the viewer serves.
 *
 * Run: `pnpm icons`
 *
 * The outputs are committed. Nothing at build or deploy time rasterises
 * anything, so `sharp` stays a devDependency of the repository root and never
 * reaches the deployed app.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(fileURLToPath(import.meta.url), '../..')

// ── Brand config ─────────────────────────────────────────────────────────────
const SOURCE_SVG = resolve(ROOT, 'apps/web/public/brand/envisioning-mark.svg')
const ACCENT = '#d6f249' // lime, the --color-accent token in globals.css
const BG = '#0a0a0a' // near-black tile
const GLYPH = ACCENT
// Inner padding around the glyph, as a fraction of the tile size.
const PADDING = 0.18
// Corner radius, as a fraction of the tile size. About 22% matches iOS and Android.
const RADIUS = 0.22

// ── Output set ───────────────────────────────────────────────────────────────
// Files land in either `apps/web/src/app/`, which Next reads through its
// metadata file convention, or `apps/web/public/`, which the manifest and
// external surfaces reference by URL.
const PNG_OUTPUTS = [
  { size: 192, out: 'apps/web/src/app/icon.png' },
  { size: 180, out: 'apps/web/src/app/apple-icon.png' },
  { size: 192, out: 'apps/web/public/icon-192.png' },
  { size: 512, out: 'apps/web/public/icon-512.png' },
  { size: 32, out: 'apps/web/public/favicon-32.png' },
  { size: 16, out: 'apps/web/public/favicon-16.png' },
]
const ICO_SIZES = [16, 32, 48]
const ICO_OUTPUT = 'apps/web/src/app/favicon.ico'
const MANIFEST_OUTPUT = 'apps/web/public/manifest.webmanifest'

// ── SVG composition ──────────────────────────────────────────────────────────
// Read the source viewBox so the glyph scales correctly whatever size it was
// authored at. Falls back to the SVG's width and height, then to 64.
function parseViewBox(svg) {
  const vb = svg.match(/viewBox\s*=\s*"\s*[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)\s*"/i)
  if (vb) return { w: Number(vb[1]), h: Number(vb[2]) }
  const w = svg.match(/<svg\b[^>]*\swidth\s*=\s*"([\d.]+)/i)
  const h = svg.match(/<svg\b[^>]*\sheight\s*=\s*"([\d.]+)/i)
  if (w && h) return { w: Number(w[1]), h: Number(h[1]) }
  return { w: 64, h: 64 }
}

function tileSvg(size, glyphSvg) {
  const r = Math.round(size * RADIUS)
  const pad = Math.round(size * PADDING)
  const inner = size - pad * 2
  const { w, h } = parseViewBox(glyphSvg)
  const scale = inner / Math.max(w, h)
  // Centre the glyph inside the inner box, which also handles a non-square viewBox.
  const dx = pad + (inner - w * scale) / 2
  const dy = pad + (inner - h * scale) / 2
  const innerBody = glyphSvg
    .replace(/^<\?xml[^>]*>\s*/i, '')
    .replace(/<svg\b[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
  // The wrapper sets `color` only. The source SVG uses `currentColor` for
  // whatever it wants tinted, fill or stroke or both.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${BG}"/>
    <g transform="translate(${dx} ${dy}) scale(${scale})" color="${GLYPH}">
      ${innerBody}
    </g>
  </svg>`
}

async function renderPng(size, glyphSvg) {
  const svg = tileSvg(size, glyphSvg)
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer()
}

// ── ICO encoder ──────────────────────────────────────────────────────────────
// Wraps the PNG buffers in an ICO container. ICO has carried embedded PNGs
// since Vista, and every current browser reads it.
function encodeIco(images) {
  const HEADER = 6
  const DIR_ENTRY = 16
  const offsetStart = HEADER + DIR_ENTRY * images.length

  const header = Buffer.alloc(HEADER)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: ICO
  header.writeUInt16LE(images.length, 4)

  const entries = []
  const blobs = []
  let offset = offsetStart
  for (const { size, png } of images) {
    const entry = Buffer.alloc(DIR_ENTRY)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width, where 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    blobs.push(png)
    offset += png.length
  }
  return Buffer.concat([header, ...entries, ...blobs])
}

// ── Driver ───────────────────────────────────────────────────────────────────
async function writeBuf(rel, buf) {
  const abs = resolve(ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await writeFile(abs, buf)
  console.log(`  ${rel}  (${buf.length.toLocaleString()} B)`)
}

async function main() {
  console.log(`Generating icons from ${SOURCE_SVG}`)
  const glyph = await readFile(SOURCE_SVG, 'utf8')

  for (const { size, out } of PNG_OUTPUTS) {
    await writeBuf(out, await renderPng(size, glyph))
  }

  const icoFrames = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, png: await renderPng(size, glyph) })),
  )
  await writeBuf(ICO_OUTPUT, encodeIco(icoFrames))

  const manifest = {
    name: 'NCB, the National Capability Benchmark',
    short_name: 'NCB',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: BG,
    background_color: BG,
  }
  await writeBuf(MANIFEST_OUTPUT, Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`))

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
