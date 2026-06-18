# BetterX MCP Server — Implementation Plan

## Overview


Add a standalone **MCP server** service to the BetterX monorepo. The MCP server acts as a thin proxy: it exposes follow-related tools to MCP clients (e.g. Cursor), and each tool forwards the request to the existing BetterX REST backend using the caller's JWT.

The MCP server does **not** talk to MySQL or pgvector directly. It only speaks MCP over HTTP on one side and HTTP to the backend on the other.

```
┌─────────────┐   Streamable HTTP    ┌─────────────┐   REST + JWT    ┌─────────────┐
│ MCP Client  │ ───────────────────► │ MCP Server  │ ──────────────► │   Backend   │
│  (Cursor)   │  Authorization:      │  (Express)  │  Authorization: │  :3000      │
│             │  Bearer <jwt>        │  :3005      │  Bearer <jwt> │             │
└─────────────┘                      └─────────────┘                 └─────────────┘
```

---

## Goals

- New `mcp/` package at repo root (same pattern as `io/`, `backend/`)
- Express app with **Streamable HTTP** MCP transport (current MCP spec; replaces deprecated HTTP+SSE)
- Three tools: `getFollowers`, `getFollowing`, `follow`
- JWT passthrough: MCP client sends `Authorization: Bearer <token>` → MCP server forwards the same header to the backend
- Configuration via **`node-config`** (`config` package), not `dotenv`

## Non-goals (for this phase)

- stdio transport (local child-process mode)
- MCP OAuth / separate MCP-level auth system
- New backend endpoints or auth changes
- Docker Compose wiring (noted as a follow-up step)
- Additional tools (`unfollow`, `suggest`, posts, etc.)

---

## Backend API Mapping

> **Route note:** the follow endpoint in our backend is `POST /follows/follow/:followeeId`, not `POST /follows/:userId`. The MCP tool should call the real route.

| MCP Tool        | Backend Call                         | Auth Required |
|-----------------|--------------------------------------|---------------|
| `getFollowers`  | `GET /follows/followers`              | Yes (JWT)     |
| `getFollowing`  | `GET /follows/following`              | Yes (JWT)     |
| `follow`        | `POST /follows/follow/:followeeId`    | Yes (JWT)     |

All three routes sit behind `authEnforce` in `backend/src/app.ts`, so the backend expects:

```
Authorization: Bearer <jwt>
```

No `x-client-id` header is required for these endpoints (only used for socket echo suppression on post/follow emits).

---

## Project Structure

```
mcp/
├── config/
│   ├── default.json                      # dev defaults
│   ├── custom-environment-variables.json # env overrides
│   └── compose.json                      # optional, for docker-compose (like backend)
├── src/
│   ├── app.ts                            # Express bootstrap, MCP endpoint mount
│   ├── server.ts                         # McpServer setup + tool registration
│   ├── backend/
│   │   └── backend-client.ts             # axios wrapper, forwards JWT per request
│   ├── tools/
│   │   ├── get-followers.ts
│   │   ├── get-following.ts
│   │   └── follow.ts
│   └── middleware/
│       └── extract-auth.ts               # read Authorization from incoming HTTP request
├── package.json
├── tsconfig.json
└── Dockerfile                            # optional follow-up for compose
```

`mcp.md` lives at repo root (this file).

---

## Dependencies

Mirror the `io/` / `backend/` stack where practical:

| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `config` | `node-config` configuration |
| `axios` | HTTP client to BetterX backend |
| `typescript`, `ts-node-dev` | Dev/build (same as `io/`) |
| `@modelcontextprotocol/server` | `McpServer`, tool registration |
| `@modelcontextprotocol/node` | `NodeStreamableHTTPServerTransport` |
| `@modelcontextprotocol/express` | `createMcpExpressApp()` (DNS rebinding protection) |
| `zod` | Tool `inputSchema` validation (required by MCP SDK) |

Use the official MCP TypeScript SDK **Streamable HTTP** pattern from the [server guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md).

---

## Configuration (`node-config`)

Follow the same layout as `backend/config/` and `io/config/`.

### `mcp/config/default.json`

```json
{
  "app": {
    "port": 3005,
    "name": "Betterx MCP"
  },
  "backend": {
    "url": "http://localhost:3000"
  }
}
```

### `mcp/config/custom-environment-variables.json`

```json
{
  "app": {
    "port": "BETTERX_MCP_PORT"
  },
  "backend": {
    "url": "BETTERX_BACKEND_URL"
  }
}
```

### `mcp/config/compose.json` (later, for Docker)

```json
{
  "backend": {
    "url": "http://backend:3000"
  }
}
```

Run scripts (matching backend/io convention):

- `npm run dev` → `ts-node-dev --respawn --transpile-only src/app.ts`
- `npm run build` → `tsc`
- `npm start` → `node dist/app.js`
- `npm run compose` → `NODE_ENV=compose node dist/app.js`

No `.env` / `dotenv`. Env vars are mapped through `custom-environment-variables.json` only.

---

## MCP Server Setup

### 1. Express + Streamable HTTP transport

- Use `createMcpExpressApp()` from `@modelcontextprotocol/express` instead of raw `express()` (Host header validation against DNS rebinding).
- Mount a single MCP endpoint (e.g. `/mcp`) supporting **POST** and **GET** per the Streamable HTTP spec.
- Use `NodeStreamableHTTPServerTransport` from `@modelcontextprotocol/node`.
- Start with **stateless** mode (`sessionIdGenerator: undefined`) for simplicity; JWT is per-request anyway. Upgrade to stateful sessions later if needed.

Rough flow in `app.ts`:

1. Create Express app via `createMcpExpressApp({ host: '0.0.0.0' })` when binding all interfaces in Docker; `127.0.0.1` for local-only dev.
2. Add `express.json()` middleware on the MCP route.
3. Add auth-extraction middleware (see below).
4. On `POST /mcp` and `GET /mcp`, delegate to `transport.handleRequest(req, res, req.body)`.
5. `app.listen(config.get('app.port'))`.

### 2. `McpServer` instance

In `server.ts`:

```ts
const server = new McpServer({
  name: 'betterx-mcp',
  version: '1.0.0',
}, {
  instructions: 'Tools for managing BetterX follows. Requires a valid JWT in the Authorization header.',
})
```

Register the three tools here (or import from `src/tools/`).

---

## Authentication Flow (JWT Passthrough)

The MCP client (Cursor) must send the user's BetterX JWT on every MCP HTTP request:

```
Authorization: Bearer <jwt>
```

### Extraction

`extract-auth.ts` middleware on the `/mcp` route:

1. Read `Authorization` header.
2. Validate presence and `Bearer` prefix (same rules as `backend/src/middlewares/auth-enforce.ts`).
3. Store the raw JWT token in **request-scoped context** for the duration of the MCP request.

Recommended mechanism: `AsyncLocalStorage` keyed to the incoming HTTP request, so tool handlers can read the token without threading it through MCP SDK internals.

If the header is missing or malformed, reject the HTTP request with `401` **before** handing off to the MCP transport (or return an MCP error if the transport already started — prefer rejecting early).

### Forwarding to backend

`backend-client.ts`:

```ts
// pseudo-code
function createBackendClient(jwt: string) {
  return axios.create({
    baseURL: config.get('backend.url'),
    headers: { Authorization: `Bearer ${jwt}` },
  })
}
```

Each tool handler:

1. Reads JWT from `AsyncLocalStorage`.
2. Creates (or reuses) an axios instance with that token.
3. Calls the appropriate backend route.
4. Returns the JSON response as MCP tool result (`content: [{ type: 'text', text: JSON.stringify(data) }]}`).

The MCP server never validates or decodes the JWT itself — the backend remains the source of truth for auth.

---

## Tool Definitions

### `getFollowers`

- **Description:** Returns the list of users who follow the authenticated user.
- **Input schema:** `{}` (no arguments; identity comes from JWT)
- **Backend:** `GET /follows/followers`
- **Returns:** JSON array of `User` objects (same shape as REST API)

### `getFollowing`

- **Description:** Returns the list of users the authenticated user follows.
- **Input schema:** `{}`
- **Backend:** `GET /follows/following`
- **Returns:** JSON array of `User` objects

### `follow`

- **Description:** Follow another user by ID.
- **Input schema:**
  ```ts
  z.object({
    followeeId: z.string().uuid().describe('The user ID to follow'),
  })
  ```
- **Backend:** `POST /follows/follow/:followeeId`
- **Returns:** JSON follow record (same shape as REST API)

### Error handling

Map backend HTTP errors to MCP tool errors:

| Backend Status | MCP behavior |
|----------------|--------------|
| 401 | Tool error: "authentication failed" |
| 404 | Tool error: pass through backend message |
| 422 | Tool error: validation message |
| 5xx | Tool error: generic server error |

Use `isError: true` on the tool result for failures. Log errors with `console.error` (same style as backend).

---

## Implementation Steps

### Phase 1 — Scaffold

1. Create `mcp/` folder with `package.json`, `tsconfig.json` (mirror `io/tsconfig.json`: CommonJS, `strict: false`).
2. Add `config/default.json` and `config/custom-environment-variables.json`.
3. `npm install` dependencies.
4. Bare `app.ts` that listens on port 3005 and returns `{ status: 'ok' }` on `/health` (optional sanity check).

### Phase 2 — MCP transport

1. Wire `McpServer` + `NodeStreamableHTTPServerTransport` + Express `/mcp` endpoint.
2. Register a dummy `ping` tool to verify Cursor can connect.
3. Test with Cursor MCP settings pointing at `http://localhost:3005/mcp`.

### Phase 3 — Auth + backend client

1. Implement `extract-auth.ts` + `AsyncLocalStorage`.
2. Implement `backend-client.ts`.
3. Verify a test call to `GET /follows/following` through the client with a real JWT.

### Phase 4 — Tools

1. Implement `getFollowers`, `getFollowing`, `follow` in `src/tools/`.
2. Register all three on `McpServer`.
3. Manual test each tool from Cursor with a logged-in user's JWT.

### Phase 5 — Docker Compose (follow-up)

1. Add `mcp/Dockerfile`.
2. Add `mcp` service to `docker-compose.yaml` on port `3005`.
3. Add `mcp/config/compose.json` with `backend.url: http://backend:3000`.
4. `depends_on: backend`.

---

## Cursor Client Configuration (for testing)

Once running locally, add to Cursor MCP settings:

```json
{
  "mcpServers": {
    "betterx": {
      "url": "http://localhost:3005/mcp",
      "headers": {
        "Authorization": "Bearer <your-jwt-from-login>"
      }
    }
  }
}
```

The JWT is obtained from the frontend login flow (`localStorage` key `jwt`) or `POST /auth/login`.

---

## Testing Checklist

- [ ] MCP server starts on configured port via `npm run dev`
- [ ] Cursor discovers all three tools
- [ ] `getFollowers` without JWT → 401
- [ ] `getFollowers` with valid JWT → returns follower list
- [ ] `getFollowing` with valid JWT → returns following list
- [ ] `follow` with valid `followeeId` → creates follow, appears in `getFollowing`
- [ ] `follow` with invalid/expired JWT → 401 from backend, surfaced as tool error
- [ ] Config override via `BETTERX_MCP_PORT` / `BETTERX_BACKEND_URL` env vars works

---

## Future Extensions

- `unfollow` tool → `POST /follows/unfollow/:followeeId`
- `suggest` tool → `GET /follows/suggest`
- Pass `x-client-id` header if socket side-effects matter to MCP callers
- Add MCP server to `docker-compose.yaml`
- Rate limiting / request logging middleware
- Structured `outputSchema` on tools for typed client responses
