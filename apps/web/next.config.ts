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
  // The viewer reads its data from data/out at request time, through paths the
  // bundler cannot see. Without this the deployed functions ship without the
  // JSON and every page 500s. Observations are deliberately absent: 9 MB the
  // viewer never opens.
  outputFileTracingIncludes: {
    '/**': [
      '../../data/out/index.json',
      '../../data/out/countries/**',
      '../../data/out/indicators/**',
      '../../data/out/diagnostics.json',
      '../../data/evidence/**',
      '../../data/delphi/latest.json',
    ],
  },
}

export default config
