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
  // The Portuguese edition was a mirror of the whole benchmark. It is now one
  // country layer, so every address it held lands either in that layer or back
  // in the English ground layer. See D67.
  async redirects() {
    return [
      { source: '/agenda/:iso3', destination: '/country/:iso3/agenda', statusCode: 301 },
      { source: '/pt/agenda/BRA', destination: '/brasil/agenda', statusCode: 301 },
      { source: '/pt/agenda/:iso3', destination: '/country/:iso3/agenda', statusCode: 301 },
      { source: '/pt/agenda', destination: '/agenda', statusCode: 301 },
      { source: '/pt/instituicoes', destination: '/brasil/instituicoes', statusCode: 301 },
      { source: '/pt/method', destination: '/method', statusCode: 301 },
      { source: '/pt/glossary', destination: '/glossary', statusCode: 301 },
      { source: '/pt/limits', destination: '/limits', statusCode: 301 },
      { source: '/pt/decisions', destination: '/decisions', statusCode: 301 },
      { source: '/pt', destination: '/brasil', statusCode: 301 },
    ]
  },
  async rewrites() {
    return [
      { source: '/country/:iso3.csv', destination: '/country/:iso3/csv' },
      { source: '/og/country/:iso3', destination: '/og/country/:iso3/opengraph-image' },
      { source: '/og/dimension/:dimension', destination: '/og/dimension/:dimension/opengraph-image' },
      { source: '/og/agenda/:iso3', destination: '/og/agenda/:iso3/opengraph-image' },
    ]
  },
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1800, stale-while-revalidate=60',
          },
        ],
      },
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
      '../../data/out/velocity.json',
      '../../data/out/leverage.json',
      '../../data/out/residual.json',
      '../../data/out/countries/*.json',
      '../../data/out/agenda/*.json',
      '../../data/out/indicators/*.json',
      '../../data/out/br-subnational/*.json',
      '../../data/evidence/*.json',
      '../../data/institutions/*.json',
      '../../data/delphi/latest.json',
      '../../CHANGELOG.md',
      '../../docs/KNOWN-ARTEFACTS.md',
      '../../docs/DECISIONS.md',
      'data/out/index.json',
      'data/out/diagnostics.json',
      'data/out/velocity.json',
      'data/out/leverage.json',
      'data/out/residual.json',
      'data/out/countries/*.json',
      'data/out/agenda/*.json',
      'data/out/indicators/*.json',
      'data/out/br-subnational/*.json',
      'data/evidence/*.json',
      'data/institutions/*.json',
      'data/delphi/latest.json',
      'CHANGELOG.md',
      'docs/KNOWN-ARTEFACTS.md',
      'docs/DECISIONS.md',
    ],
  },
}

export default config
