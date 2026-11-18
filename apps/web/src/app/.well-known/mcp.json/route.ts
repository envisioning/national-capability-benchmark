import { MCP_SERVER_CARD } from '@/lib/mcp-card'

/** The MCP server card, so a client given only ncb.envisioning.com finds /mcp. Served at both paths the proposals use. */
export const dynamic = 'force-static'

export function GET() {
  return Response.json(MCP_SERVER_CARD, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
  })
}
