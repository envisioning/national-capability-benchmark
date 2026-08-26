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
}

export default config
