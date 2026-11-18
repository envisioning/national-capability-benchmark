/* A minimal MCP (Model Context Protocol) server over Streamable HTTP.

   Copied from envisioning/www lib/mcp-server.ts on 18 November 2026 (which
   copies event-bff src/lib/mcp.ts and adds prompts and a rate limit). Keep the
   copies in step when the MCP transport spec changes. A shared package is not
   worth it while the GitHub Packages install fails (AGENTS.md, Deployment).
   The tools live in src/app/mcp/route.ts.

   Everything served through here is read-only and already public. There is no
   auth, because there is nothing to gate.

   https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http */

import { z } from "@ncb/core";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/* Newest first. String comparison on these is date comparison, which is what tells the two eras
   apart. `2025-11-25` and earlier negotiate through `initialize`; `2026-07-28` and later carry
   their version per request. */
const VERSIONS = ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26"] as const;
const MODERN = "2026-07-28";
/** What we answer an `initialize` with when the client asks for something we don't know. */
const LEGACY_DEFAULT = "2025-06-18";

const META_VERSION = "io.modelcontextprotocol/protocolVersion";
const META_SERVER_INFO = "io.modelcontextprotocol/serverInfo";

/* JSON-RPC error codes. The last two are allocated by MCP itself. */
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;
const HEADER_MISMATCH = -32020;
const UNSUPPORTED_VERSION = -32022;

/* Any origin, because the data is public and a browser-side client is a legitimate caller.
   Origin validation exists in the spec to stop DNS rebinding against servers bound to
   localhost; there is nothing here that a hostile page could reach that it could not fetch
   itself. `*` on the header list rather than an enumeration: `Mcp-Param-{Name}` is open-ended
   by design, so no fixed list can be complete. */
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

/* ---------- tools ---------- */

export type Tool = {
  name: string;
  title: string;
  description: string;
  /** Doubles as the published `inputSchema` and as the validator for incoming arguments. */
  input: z.ZodType;
  run: (args: never) => unknown | Promise<unknown>;
};

/** Keeps `run`'s argument typed as the schema's output at the definition site. */
export function defineTool<S extends z.ZodType>(t: {
  name: string;
  title: string;
  description: string;
  input: S;
  run: (args: z.output<S>) => unknown | Promise<unknown>;
}): Tool {
  return t as Tool;
}

/* ---------- prompts ---------- */

/** A prompt template the user picks in their client. Every argument is a string, per the spec. */
export type Prompt = {
  name: string;
  title: string;
  description: string;
  arguments: { name: string; description: string; required?: boolean }[];
  /** The user message the client sends to the model. Gets every required argument, trimmed. */
  render: (args: Record<string, string>) => string;
};

export type McpServer = {
  name: string;
  version: string;
  /** Natural-language guidance for the model: what this data is and how to move through it. */
  instructions: string;
  tools: Tool[];
  prompts?: Prompt[];
  /** Requests per IP per minute. Best effort: lib/rate-limit counts per server instance. */
  ratePerMinute?: number;
  /** Most messages accepted in one JSON-RPC batch. */
  maxBatch?: number;
};

/* ---------- helpers ---------- */

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

/** `=?base64?…?=` is the spec's escape for header values that are not plain ASCII. */
function decodeHeaderValue(v: string): string {
  if (!v.startsWith("=?base64?") || !v.endsWith("?=")) return v;
  try {
    return Buffer.from(v.slice(9, -2), "base64").toString("utf8");
  } catch {
    return v;
  }
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS, ...headers },
  });
}

type Outcome = { payload: Json | null; status: number };

const rpcError = (id: unknown, code: number, message: string, data?: unknown, status = 200): Outcome => ({
  payload: { jsonrpc: "2.0", id: id ?? null, error: data === undefined ? { code, message } : { code, message, data } },
  status,
});

/* ---------- the endpoint ---------- */

export function mcpEndpoint(server: McpServer) {
  const tools = server.tools;

  const listing = () =>
    tools.map((t) => ({
      name: t.name,
      title: t.title,
      description: t.description,
      inputSchema: z.toJSONSchema(t.input, { io: "input" }),
      /* Every tool here reads. Saying so lets a client skip the confirmation prompt it would
         otherwise be right to show. */
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    }));

  const prompts = server.prompts ?? [];
  const capabilities = prompts.length
    ? { tools: { listChanged: false }, prompts: { listChanged: false } }
    : { tools: { listChanged: false } };

  /** A prompt's messages, or an error string the client can show. */
  function getPrompt(params: Json): Json | string {
    const prompt = prompts.find((p) => p.name === params.name);
    if (!prompt) return `Unknown prompt: ${String(params.name)}`;
    const given = isObject(params.arguments) ? params.arguments : {};
    const args: Record<string, string> = {};
    for (const a of prompt.arguments) {
      const v = given[a.name];
      if (typeof v === "string" && v.trim()) args[a.name] = v.trim().slice(0, 2000);
      else if (a.required) return `Missing required argument: ${a.name}`;
    }
    return {
      description: prompt.description,
      messages: [{ role: "user", content: { type: "text", text: prompt.render(args) } }],
    };
  }

  /** A tool result, or `null` when no tool by that name exists (a protocol error, not a result). */
  async function callTool(params: Json): Promise<Json | null> {
    const tool = tools.find((t) => t.name === params.name);
    if (!tool) return null;

    /* Bad arguments come back as a tool result, not a protocol error: the model can read the
       message and correct itself, which it cannot do with a JSON-RPC error. */
    const parsed = tool.input.safeParse(params.arguments ?? {});
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
      return { content: [{ type: "text", text: `Invalid arguments. ${issues}` }], isError: true };
    }

    try {
      const data = await tool.run(parsed.data as never);
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
        structuredContent: data,
        isError: false,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Tool failed";
      return { content: [{ type: "text", text: message }], isError: true };
    }
  }

  async function handle(msg: unknown, req: Request): Promise<Outcome> {
    if (!isObject(msg) || typeof msg.method !== "string") {
      return rpcError(isObject(msg) ? msg.id : null, INVALID_REQUEST, "Invalid Request", undefined, 400);
    }

    const { id, method } = msg as { id?: unknown; method: string };
    const params = isObject(msg.params) ? msg.params : {};
    const meta = isObject(params._meta) ? params._meta : {};

    /* Which version is this request speaking? The body wins; the header mirrors it so that
       proxies can route without parsing. A mismatch between the two is what the spec's
       HeaderMismatch error exists for: it is exactly the case where a gateway and the server
       would act on different values. */
    const headerVersion = req.headers.get("mcp-protocol-version");
    const bodyVersion = typeof meta[META_VERSION] === "string" ? (meta[META_VERSION] as string) : null;
    if (bodyVersion && headerVersion && bodyVersion !== headerVersion) {
      return rpcError(id, HEADER_MISMATCH, `MCP-Protocol-Version header '${headerVersion}' does not match the body's '${bodyVersion}'`, undefined, 400);
    }

    const headerMethod = req.headers.get("mcp-method");
    if (headerMethod && headerMethod !== method) {
      return rpcError(id, HEADER_MISMATCH, `Mcp-Method header '${headerMethod}' does not match the body's '${method}'`, undefined, 400);
    }

    const requested =
      bodyVersion ??
      headerVersion ??
      (method === "initialize" && typeof params.protocolVersion === "string" ? params.protocolVersion : null);

    /* A request with no version at all is an older client that predates the header. Serve it
       rather than refuse it. */
    if (requested && !VERSIONS.includes(requested as (typeof VERSIONS)[number]) && method !== "initialize") {
      return rpcError(id, UNSUPPORTED_VERSION, "Unsupported protocol version", { supported: VERSIONS, requested }, 400);
    }
    const modern = !!requested && requested >= MODERN;

    /* Notifications (`notifications/initialized` and friends) get no reply at all, only a 202. */
    if (id === undefined || id === null) return { payload: null, status: 202 };

    const ok = (data: Json): Outcome => ({
      payload: { jsonrpc: "2.0", id, result: modern ? { resultType: "complete", ...data } : data },
      status: 200,
    });

    switch (method) {
      case "initialize":
        /* Echo the client's own version when we know it. A legacy client checks what comes
           back against its own list and gives up if it does not recognise it, so guessing high
           here would break the very clients this branch exists for. */
        return ok({
          protocolVersion:
            requested && VERSIONS.includes(requested as (typeof VERSIONS)[number]) && requested < MODERN
              ? requested
              : LEGACY_DEFAULT,
          capabilities,
          serverInfo: { name: server.name, version: server.version },
          instructions: server.instructions,
        });

      case "server/discover":
        return ok({
          supportedVersions: VERSIONS,
          capabilities,
          instructions: server.instructions,
          _meta: { [META_SERVER_INFO]: { name: server.name, version: server.version } },
        });

      case "ping":
        return ok({});

      case "tools/list":
        return ok({ tools: listing() });

      case "prompts/list":
        return ok({
          prompts: prompts.map(({ name, title, description, arguments: args }) => ({ name, title, description, arguments: args })),
        });

      case "prompts/get": {
        const result = getPrompt(params);
        return typeof result === "string" ? rpcError(id, INVALID_PARAMS, result) : ok(result);
      }

      case "tools/call": {
        const headerName = req.headers.get("mcp-name");
        if (headerName && decodeHeaderValue(headerName) !== params.name) {
          return rpcError(id, HEADER_MISMATCH, `Mcp-Name header does not match the body's '${String(params.name)}'`, undefined, 400);
        }
        const result = await callTool(params);
        if (!result) return rpcError(id, METHOD_NOT_FOUND, `Unknown tool: ${String(params.name)}`);
        return ok(result);
      }

      default:
        /* 404 rather than 200 for modern clients: the status is how they tell an unknown
           method from a legacy server that does not host this endpoint at all. */
        return rpcError(id, METHOD_NOT_FOUND, `Method not found: ${method}`, undefined, modern ? 404 : 200);
    }
  }

  async function POST(req: Request): Promise<Response> {
    /* Every call reads CMS data, so one busy client must not run up the bill for everyone. */
    if (server.ratePerMinute) {
      const limit = checkRateLimit({ bucket: `mcp:${server.name}`, identifier: getClientIp(req), windowMs: 60_000, max: server.ratePerMinute });
      if (!limit.allowed) {
        return json(
          { jsonrpc: "2.0", id: null, error: { code: INTERNAL_ERROR, message: `Rate limit: ${server.ratePerMinute} requests a minute. Retry in ${limit.retryAfterSeconds} s.` } },
          429,
          { "Retry-After": String(limit.retryAfterSeconds) },
        );
      }
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ jsonrpc: "2.0", id: null, error: { code: PARSE_ERROR, message: "Parse error" } }, 400);
    }

    try {
      /* Batching only ever existed in 2025-03-26, but accepting an array costs three lines and
         means a client that still sends one is not left guessing. */
      if (Array.isArray(body)) {
        if (body.length > (server.maxBatch ?? 20)) {
          return json({ jsonrpc: "2.0", id: null, error: { code: INVALID_REQUEST, message: `Batch too large: at most ${server.maxBatch ?? 20} messages` } }, 400);
        }
        const outcomes = await Promise.all(body.map((m) => handle(m, req)));
        const replies = outcomes.map((o) => o.payload).filter((p): p is Json => p !== null);
        return replies.length ? json(replies) : new Response(null, { status: 202, headers: CORS });
      }

      const { payload, status } = await handle(body, req);
      if (!payload) return new Response(null, { status, headers: CORS });
      return json(payload, status);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Internal error";
      return json({ jsonrpc: "2.0", id: null, error: { code: INTERNAL_ERROR, message } }, 500);
    }
  }

  /* GET was the standalone SSE stream before 2026-07-28 and DELETE ended a session. Neither
     exists on a stateless server, and 405 is both what the spec asks for and how a client
     works out that it should not look for one. The body is for the person who pasted the URL
     into a browser. */
  function GET(): Response {
    return json(
      {
        error: "method_not_allowed",
        hint: `This is an MCP endpoint. Point an MCP client at this URL, or POST a JSON-RPC request to it.`,
        server: { name: server.name, version: server.version },
        protocolVersions: VERSIONS,
        tools: server.tools.map((t) => t.name),
        prompts: prompts.map((p) => p.name),
      },
      405,
      { Allow: "POST, OPTIONS" },
    );
  }

  function OPTIONS(): Response {
    return new Response(null, { status: 204, headers: CORS });
  }

  return { POST, GET, DELETE: GET, OPTIONS };
}

