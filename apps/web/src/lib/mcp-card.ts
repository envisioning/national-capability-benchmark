/**
 * The one description of the public MCP server (src/app/mcp).
 *
 * The route takes its name and version from here. The same object is served
 * as the server card at /.well-known/mcp.json and
 * /.well-known/mcp/server-card.json, and it is the server.json published to the
 * official MCP registry as com.envisioning/ncb. Raise the version when the
 * tools change, deploy, then publish again (AGENTS.md, "MCP server").
 */

export const MCP_SERVER_NAME = 'ncb'
export const MCP_SERVER_VERSION = '1.1.0'
export const MCP_URL = 'https://ncb.envisioning.com/mcp'

export const MCP_SERVER_CARD = {
  $schema: 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
  name: 'com.envisioning/ncb',
  title: 'National Capability Benchmark',
  /* The registry caps this at 100 characters. */
  description: 'Country capability scores with their confidence, for 135 countries and nine dimensions. Read-only.',
  version: MCP_SERVER_VERSION,
  websiteUrl: 'https://ncb.envisioning.com',
  remotes: [{ type: 'streamable-http', url: MCP_URL }],
} as const
