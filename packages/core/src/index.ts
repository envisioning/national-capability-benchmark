/**
 * Browser-safe entry. Everything here runs in a client bundle.
 *
 * Anything touching the filesystem, the network or the model providers lives in
 * `@ncb/core/node`. Keep it that way: a single `node:` import in this graph
 * breaks the web build, and it breaks it at bundle time rather than at
 * typecheck, so the compiler will not warn you.
 */
export * from './model/index.js'
export * from './pipeline/stats.js'
export * from './pipeline/confidence.js'
export * from './pipeline/bands.js'
export * from './pipeline/normalize.js'
export * from './pipeline/score.js'
export * from './pipeline/trend.js'
export * from './pipeline/diagnostics.js'
export * from './pipeline/report.js'
export * from './pipeline/agenda.js'
export * from './pipeline/institutions.js'
export * from './pipeline/institution-explorer.js'
export * from './pipeline/lanes.js'
export * from './i18n/index.js'
export * from './delphi/consensus.js'
export * from './delphi/panel.js'
export * from './delphi/pricing.js'
