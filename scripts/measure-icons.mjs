#!/usr/bin/env node
/**
 * Measure the glyph inside a rendered icon.
 *
 * Every Envisioning site draws the EV mark at the same fraction of its tile.
 * envisioning.com is canonical: its 180px `apple-touch-icon.png` draws the mark
 * 84px wide, which is 46.7%. Colours and corner radius are each site's own; the
 * glyph size is not.
 *
 * This reports what a file actually contains, so a change to
 * `generate-favicons.mjs` is checked against a measurement instead of an
 * opinion. It works on any site's icons, not only this one:
 *
 *   node scripts/measure-icons.mjs path/to/apple-touch-icon.png [more...]
 *
 * Read the 180px and 512px rows. A 16px or 32px tile is too small to measure
 * this way: the mark is four or five pixels of antialiasing at that size, and
 * the number comes back a few points low whatever was drawn.
 */

import sharp from 'sharp'

/** The canonical fraction, from envisioning.com. */
const GLYPH_SCALE = 0.4667

/** How far a pixel may sit from the tile colour and still count as tile. */
const TOLERANCE = 24

async function measure(file) {
  const image = sharp(file)
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const at = (x, y) => {
    const i = (y * info.width + x) * info.channels
    return [data[i], data[i + 1], data[i + 2], data[i + 3]]
  }

  /* The tile colour, read from a pixel the mark never covers. */
  const tile = at(1, Math.floor(info.height / 2))
  const isTile = (p) =>
    Math.abs(p[0] - tile[0]) <= TOLERANCE &&
    Math.abs(p[1] - tile[1]) <= TOLERANCE &&
    Math.abs(p[2] - tile[2]) <= TOLERANCE

  let minX = info.width
  let minY = info.height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const p = at(x, y)
      if (p[3] < 40 || isTile(p)) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  if (maxX < 0) return { file, error: 'found no glyph against the tile colour' }

  const glyph = Math.max(maxX - minX + 1, maxY - minY + 1)
  return {
    file,
    tile: `${info.width}x${info.height}`,
    fill: glyph / info.width,
    rounded: at(0, 0)[3] < 40,
  }
}

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('usage: node scripts/measure-icons.mjs <icon.png> [...]')
  process.exit(1)
}

for (const file of files) {
  try {
    const r = await measure(file)
    if (r.error) {
      console.log(`${file}\n  ${r.error}`)
      continue
    }
    const off = Math.abs(r.fill - GLYPH_SCALE) > 0.01
    console.log(
      `${file}\n  ${r.tile}  ${r.rounded ? 'rounded' : 'square'}  ` +
        `glyph ${(r.fill * 100).toFixed(1)}%  ${off ? `off canonical ${(GLYPH_SCALE * 100).toFixed(1)}%` : 'canonical'}`,
    )
  } catch (error) {
    console.log(`${file}\n  ${error.message}`)
  }
}
