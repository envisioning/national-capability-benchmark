/**
 * Browser-safe entry. Everything here runs in a client bundle.
 *
 * Anything touching the filesystem, the network or the model providers lives in
 * `@ncb/core/node`. Keep it that way: a single `node:` import in this graph
 * breaks the web build, and it breaks it at bundle time rather than at
 * typecheck, so the compiler will not warn you.
 */
/* The validator the model's schemas use, so the web app's MCP server shares one zod. */
export { z } from 'zod'
export * from './model/index.js'
export * from './pipeline/stats.js'
export * from './pipeline/confidence.js'
export * from './pipeline/bands.js'
export * from './pipeline/normalize.js'
export * from './pipeline/score.js'
export * from './pipeline/trend.js'
export * from './pipeline/diagnostics.js'
export * from './pipeline/residual-structure.js'
export * from './pipeline/report.js'
export * from './pipeline/agenda.js'
export * from './pipeline/capability-map.js'
export * from './pipeline/stories.js'
export * from './pipeline/story-text.js'
export * from './pipeline/income-gaps.js'
export * from './pipeline/post-check.js'
export * from './pipeline/institutions.js'
export * from './pipeline/institution-explorer.js'
export * from './pipeline/lanes.js'
export * from './i18n/index.js'
export * from './delphi/consensus.js'
export * from './delphi/apply.js'
export * from './delphi/sha256.js'
export * from './delphi/panel.js'
export * from './delphi/pricing.js'
export * from './i18n/count-words.js'
export * from './pipeline/factor-reading.js'
export * from './pipeline/residual-reading.js'
export * from './pipeline/wealth-reading.js'
export * from './pipeline/verdict-pt.js'
export * from './pipeline/brief.js'
export * from './fitness/schema.js'
export * from './fitness/roster.js'
export * from './fitness/cost.js'
export * from './fitness/prompts.js'
export * from './fitness/provider.js'
export * from './fitness/run.js'
export * from './fitness/grade.js'
export * from './fitness/report.js'
