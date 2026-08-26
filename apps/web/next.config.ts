import type { NextConfig } from 'next'

const config: NextConfig = {
  // @ncb/core is consumed as compiled output from packages/core/dist.
  // `pnpm -r build` compiles it before this app builds.
  outputFileTracingRoot: new URL('../..', import.meta.url).pathname,
}

export default config
