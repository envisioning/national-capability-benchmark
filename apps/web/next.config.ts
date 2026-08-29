import type { NextConfig } from 'next'

const config: NextConfig = {
  // @ncb/core is consumed as compiled output from packages/core/dist.
  // `pnpm -r build` compiles it before this app builds.
  outputFileTracingRoot: new URL('../..', import.meta.url).pathname,
  // `next dev` and `next build` both write .next, so a production build run
  // while a dev server is up leaves that server serving pages with no CSS.
  // Set NEXT_DIST_DIR to build into a different directory and leave the dev
  // server alone.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  async rewrites() {
    return [
      { source: '/og/country/:iso3', destination: '/og/country/:iso3/opengraph-image' },
      { source: '/og/dimension/:dimension', destination: '/og/dimension/:dimension/opengraph-image' },
      { source: '/og/agenda/:iso3', destination: '/og/agenda/:iso3/opengraph-image' },
    ]
  },
  // The viewer reads its data from data/out at request time, through paths the
  // bundler cannot see. Without this the deployed functions ship without the
  // JSON and every page 500s. Observations are deliberately absent: 9 MB the
  // viewer never opens.
  outputFileTracingIncludes: {
    /* Both spellings on purpose. Whether these globs resolve against the app or
     * against the tracing root has changed between versions, and a miss is
     * silent: the pages render their empty state and nothing errors. */
    '/**': [
      '../../data/out/index.json',
      '../../data/out/diagnostics.json',
      '../../data/out/countries/*.json',
      '../../data/out/agenda/*.json',
      '../../data/out/indicators/*.json',
      '../../data/evidence/*.json',
      '../../data/institutions/*.json',
      '../../data/delphi/latest.json',
      '../../docs/KNOWN-ARTEFACTS.md',
      '../../docs/DECISIONS.md',
      'data/out/index.json',
      'data/out/diagnostics.json',
      'data/out/countries/*.json',
      'data/out/agenda/*.json',
      'data/out/indicators/*.json',
      'data/evidence/*.json',
      'data/institutions/*.json',
      'data/delphi/latest.json',
      'docs/KNOWN-ARTEFACTS.md',
      'docs/DECISIONS.md',
    ],
  },
}

export default config
