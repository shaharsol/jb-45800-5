# Backend microservice split plan

Split the current `backend/` Express app into two independent services:

| Service | Responsibility | Port (dev) |
|---------|----------------|------------|
| **auth** | OAuth, JWT, user API, repo registration (MongoDB owner) | 3000 |
| **webhooks** | GitHub webhook intake, SQS job enqueue | 3001 |

MongoDB belongs exclusively to **auth**. Webhooks must not connect to MongoDB; it will call auth over HTTP (same pattern as workers → auth today).

---

## 1. MongoDB access from the GitHub webhook path (today)

Only **one** MongoDB dependency exists in the webhook flow. Everything else in `webhook.controller.ts` is pure logic, GitHub payload parsing, or SQS.

### Direct call sites

| File | Line(s) | Function | Purpose |
|------|---------|----------|---------|
| `backend/src/controllers/webhook.controller.ts` | 69 | `findUserIdByRepo(owner, repo)` | Resolve `userId` when a CodeReviewer PR is opened |
| `backend/src/controllers/webhook.controller.ts` | 131 | `findUserIdByRepo(owner, repo)` | Resolve `userId` when a TypingAgent issue is opened |

### Call chain (both paths)

```
webhook.controller.ts
  └─ findUserIdByRepo(repoOwner, repoName)
       └─ services/repoRegistration.service.ts
            └─ RepoRegistration.findOne({ repoOwner, repoName })   ← MongoDB read
```

### Model / collection

| Model | Collection | Operation | Used by webhook? |
|-------|------------|-----------|------------------|
| `RepoRegistration` | `reporegistrations` | `findOne` | **Yes** (read) |
| `User` | `users` | — | **No** (webhook never queries users directly) |

### Who writes `RepoRegistration` (auth side, not webhook)

| File | Function | Operation |
|------|----------|-----------|
| `services/github.service.ts` | `registerIssueWebhooksForUser` | `upsertRepoRegistration` → `findOneAndUpdate` (write) |
| `controllers/auth.controller.ts` | `callback` | Triggers `registerIssueWebhooksForUser` after OAuth login |

### Future auth API replacement

Webhook service will need an HTTP equivalent of:

```ts
findUserIdByRepo(repoOwner: string, repoName: string): Promise<string | null>
```

Suggested auth endpoint (to be implemented during split):

```
GET /api/repos/:repoOwner/:repoName/user-id
Authorization: service HMAC (X-Service-Nonce + Bearer signature)
→ 200 { "userId": "..." }
→ 404 if repo not registered
```

---

## 2. What stays out of MongoDB in webhooks (no replacement needed)

These are already self-contained in the webhook path:

| Module | Role |
|--------|------|
| `middleware/verifyGithubWebhook.ts` | HMAC verify GitHub payload (`GITHUB_WEBHOOK_SECRET`) |
| `utils/typingAgentMarkers.ts` | `isCodeReviewerPullRequestTitle()` |
| `utils/issueBody.ts` | `parseTargetBranchFromIssueBody()` |
| `queues/typingAgent.routing.ts` | Route issue title → agent queue |
| `queues/enqueueAgentJob.ts` | SQS producer (agent jobs) |
| `queues/enqueueCodeReviewJob.ts` | SQS producer (code review jobs) |
| `queues/agentJob.types.ts` | Job message contract |
| `queues/codeReviewJob.types.ts` | Job message contract |
| `connectors/sqs.connector.ts` | SQS client (send + ensure queues) |

---

## 3. Target package layout

```
04-typing-agent/
├── auth/                    # new package (from backend auth + user + mongo)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── config/
│   ├── scripts/
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── db/
│       ├── models/          # User, RepoRegistration
│       ├── passport/
│       ├── routes/          # auth.routes, user.routes, index (health)
│       ├── controllers/     # auth, user
│       ├── services/        # user, auth, github (webhook registration), repoRegistration, githubApi
│       ├── middleware/      # authenticate, authenticateService, errorHandler, requestLogger
│       └── utils/           # serviceAuth
│
├── webhooks/                # new package (from backend webhook + SQS)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── config/
│   ├── scripts/
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── routes/          # webhook.routes
│       ├── controllers/     # webhook.controller
│       ├── middleware/      # verifyGithubWebhook, errorHandler, requestLogger
│       ├── queues/          # enqueue*, typingAgent.routing, job types
│       ├── connectors/      # sqs.connector
│       ├── services/        # authClient (HTTP → auth service)
│       └── utils/           # issueBody, typingAgentMarkers, serviceAuth (duplicate)
│
├── workers/                 # unchanged; BACKEND_URL → auth service
└── frontend/                # VITE_API_URL → auth service
```

Deprecate or remove monolithic `backend/` once both services are running.

---

## 4. Step-by-step migration

### Phase A — Scaffold packages (no behavior change)

1. Create `auth/` and `webhooks/` directories with `package.json`, `tsconfig.json`, `.gitignore`, `Dockerfile`, `scripts/dev.js`, `scripts/load-env.js`.
2. Copy shared `config/` pattern (`default.json`, `custom-environment-variables.json`, `development.json`, `production.json`) into each package with only the keys that service needs.
3. Duplicate shared infra per package (no cross-imports): `logger.ts`, `middleware/errorHandler.ts`, `middleware/requestLogger.ts`, `types/datadog-winston.d.ts`.

### Phase B — Auth service

4. Move from `backend/src/` into `auth/src/`:
   - `db/connection.ts`
   - `models/User.ts`, `models/RepoRegistration.ts`
   - `passport/github.strategy.ts`
   - `routes/auth.routes.ts`, `routes/user.routes.ts`, `routes/index.ts`
   - `controllers/auth.controller.ts`, `controllers/user.controller.ts`
   - `services/user.service.ts`, `services/auth.service.ts`, `services/repoRegistration.service.ts`, `services/github.service.ts`, `services/githubApi.ts`
   - `middleware/authenticate.ts`, `middleware/authenticateService.ts`
   - `utils/serviceAuth.ts`
   - `types/express.d.ts`
5. Build `auth/src/app.ts`:
   - CORS, cookie-parser, passport, JSON body parser
   - Mount `/api/auth`, `/api/user`, `/api/health`
   - **No** webhook routes, **no** SQS
6. Build `auth/src/server.ts`:
   - `connectDB()` only (no `ensureAllQueuesExist`)
7. Trim `auth/package.json` dependencies: remove `@aws-sdk/client-sqs` if unused.
8. Add **new** endpoint for webhooks (and document in OpenAPI/README):
   - `GET /api/repos/:repoOwner/:repoName/user-id` protected by `authenticateService`
   - Returns `{ userId }` from `findUserIdByRepo`
9. Verify existing endpoints still work:
   - `GET /api/auth/github`, `GET /api/auth/github/callback`, `POST /api/auth/logout`
   - `GET /api/user/me` (JWT)
   - `GET /api/user/:userId` (service HMAC — used by workers today)

### Phase C — Webhooks service

10. Move from `backend/src/` into `webhooks/src/`:
    - `routes/webhook.routes.ts`
    - `controllers/webhook.controller.ts`
    - `middleware/verifyGithubWebhook.ts`
    - `queues/*` (all enqueue + routing + types)
    - `connectors/sqs.connector.ts`
    - `utils/issueBody.ts`, `utils/typingAgentMarkers.ts`
11. Build `webhooks/src/app.ts`:
    - Mount `POST /api/webhooks/github` with `express.raw({ type: 'application/json' })` **before** JSON parser
    - **No** passport, CORS (optional), cookie-parser
12. Build `webhooks/src/server.ts`:
    - `ensureAllQueuesExist()` only (no `connectDB`)
13. Create `webhooks/src/services/authClient.service.ts`:
    - `fetchUserIdByRepo(repoOwner, repoName)` → HTTP GET auth service with service HMAC headers
    - Reuse same `createServiceAuthHeaders` / `SERVICE_AUTH_SECRET` pattern as workers
14. Replace `findUserIdByRepo` imports in `webhook.controller.ts` with `authClient.fetchUserIdByRepo`.
15. Remove `repoRegistration.service.ts`, `models/RepoRegistration.ts`, `db/` from webhooks package entirely.
16. Trim `webhooks/package.json` dependencies: remove `mongoose`, `passport`, `passport-github2`, `jsonwebtoken`, `cookie-parser`, `cors` (if unused).

### Phase D — Configuration and environment

17. **Auth** env vars:
    - `PORT`, `MONGO_URI`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`, `FRONTEND_URL`, `CORS_ORIGIN`, `SERVICE_AUTH_SECRET`, Datadog vars
    - `GITHUB_WEBHOOK_URL` → points to **webhooks** service public URL (used when registering hooks on GitHub during OAuth)
18. **Webhooks** env vars:
    - `PORT`, `GITHUB_WEBHOOK_SECRET`, `SERVICE_AUTH_SECRET`, `AUTH_SERVICE_URL` (e.g. `http://auth:3000`), SQS vars, Datadog vars
    - No `MONGO_URI`, no JWT, no OAuth client secret (unless needed elsewhere)
19. Update `workers` config: `BACKEND_URL` → `AUTH_SERVICE_URL` (rename for clarity) pointing at auth service only.

### Phase E — Docker Compose

20. Replace single `backend` service with:
    - `auth` — build `./auth`, port 3000, depends on `mongodb`
    - `webhooks` — build `./webhooks`, port 3001, depends on `localstack` + `auth` (for user-id lookup)
21. Update `GITHUB_WEBHOOK_URL` in auth to `http://webhooks:3001/api/webhooks/github` (or external ngrok URL in dev).
22. Update `frontend` `VITE_API_URL` to auth service (`http://localhost:3000/api`).
23. Workers `depends_on`: `auth` (not webhooks).

### Phase F — GitHub app / OAuth settings

24. OAuth callback URL stays on auth: `http://localhost:3000/api/auth/github/callback`.
25. GitHub repository webhook URL changes to webhooks service: `https://<host>/api/webhooks/github`.
26. On next user login, `registerIssueWebhooksForUser` (auth) re-registers hooks at the new URL via `GITHUB_WEBHOOK_URL` config.

### Phase G — Cleanup

27. Delete or archive monolithic `backend/` folder.
28. Update root README / `plans/plan.md` references.
29. Run end-to-end test:
    - Login via frontend → auth
    - Open TypingAgent issue → GitHub → webhooks → SQS → worker
    - Worker fetches user from auth (`/api/user/:id`)
    - Open CodeReviewer PR → webhooks → code review queue

---

## 5. Dependency matrix after split

| Capability | auth | webhooks |
|------------|:----:|:--------:|
| MongoDB | ✓ | |
| JWT / OAuth | ✓ | |
| Service HMAC (inbound) | ✓ | |
| Service HMAC (outbound to auth) | | ✓ |
| GitHub webhook verify | | ✓ |
| SQS enqueue | | ✓ |
| GitHub API (register hooks on login) | ✓ | |

---

## 6. Risks and notes

- **Webhook URL migration**: Existing repos may still point webhooks at the old monolith URL until users re-login (triggering `registerIssueWebhooksForUser`) or hooks are updated manually.
- **Service auth secret**: auth, webhooks, and workers must share the same `SERVICE_AUTH_SECRET`.
- **No shared code package (v1)**: Duplicate `serviceAuth`, `logger`, and config helpers in each package (same approach as `workers/` split). Extract a shared npm package later if duplication becomes painful.
- **Health checks**: Add `GET /api/health` on both services for orchestration.
- **Repo lookup 404**: Webhook already logs and returns `200 OK` when no user is registered; preserve this behavior when switching to HTTP client (do not fail the webhook on auth 404).

---

## 7. Checklist summary

- [ ] Scaffold `auth/` and `webhooks/` packages
- [ ] Move auth/user/mongo code → `auth/`
- [ ] Add `GET /api/repos/:owner/:repo/user-id` on auth
- [ ] Move webhook/SQS code → `webhooks/`
- [ ] Replace `findUserIdByRepo` with auth HTTP client in webhooks
- [ ] Split config and env vars
- [ ] Update docker-compose (two services, one mongo)
- [ ] Point `GITHUB_WEBHOOK_URL` at webhooks service
- [ ] Point workers + frontend at auth service
- [ ] Remove monolithic `backend/`
- [ ] E2E test full flow
