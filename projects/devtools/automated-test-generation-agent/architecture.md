### 1. System Overview

**CI orchestrator** receives PR events and spins a **sandbox job** with repo checkout. **Test Gen Agent** iterates: read symbols → propose patch → run targeted tests → parse failures → revise. **Policy gate** enforces path allowlists and bans dangerous patterns before posting PR comments or opening draft commits.

---

### 2. Architecture Diagram (text-based)

```
PR webhook → CI job (sandbox)
        ↓
Test Gen Agent ↔ tools: fs, ast, runner, git
        ↓
Patch artifact → review interface / draft PR
```

---

### 3. Core Components

- **UI / API Layer:** PR bot, optional web review for big patches.
- **LLM layer:** Tool-using agent with iteration caps.
- **Agents (if any):** Single agent v1.
- **Tools / Integrations:** Git provider API, test runner, coverage parser, linter.
- **Memory / RAG:** Repo chunk index built per commit SHA.
- **Data sources:** PR diff, coverage lcov, historical merged tests corpus.

---

### 4. Data Flow

1. **Input:** `pr_number`, base/head SHAs, changed file list.
2. **Processing:** Build lightweight index for touched packages; seed prompts with diff hunks.
3. **Tool usage:** Apply patch in workspace; run `pnpm test --filter ...`; feed stderr/stdout back.
4. **Output:** Unified diff + summary comment with commands to reproduce locally.

---

### 5. Agent Interaction (if applicable)

Single agent loop; human merges—no auto-merge without policy exception.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue per tenant; prioritize small PRs for fast feedback.
- **Caching:** Per-commit index artifacts in object storage.
- **Async processing:** Long jobs checkpoint progress to resume after preemption.

---

### 7. Failure Handling

- **Retries:** Transient runner failures; do not mask real test failures with retries beyond N.
- **Fallbacks:** Post partial plan + manual TODO list if budget exhausted.
- **Validation:** AST parse must succeed; tests must be deterministic seeds documented.

---

### 8. Observability

- **Logging:** Tool latency, runner exit codes, patch size metrics.
- **Tracing:** Span per iteration; attribute model version.
- **Metrics:** Merge rate of suggestions, introduced flake rate, coverage delta distribution.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Automated Test Generation Agent**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres for structured memory; add pgvector only when semantic retrieval is a first-class requirement.
- **Storage layer:** Postgres OLTP, object store (S3/GCS) for artifacts (PDFs, media, large diffs), Redis for ephemeral coordination.
- **Observability layer:** OpenTelemetry traces (LLM + tool spans), metrics on latency/error/cost, structured logs with run IDs.
- **Auth / policy layer:** Session-based auth for UI; service-to-service JWT or mTLS between workers; least-privilege OAuth scopes for SaaS tools.

### Suggested Data and Infra Layer
- **Postgres** for canonical entities, workflow checkpoints, and audit trails.
- **Redis** for dedupe keys, locks, rate limits, and short TTL caches of vendor responses where safe.
- **Object storage** for attachments, exports, and large model outputs referenced by URL.
- **Queue / worker** (BullMQ, SQS, or Temporal activities) for anything exceeding interactive latency budgets.
- **Cron / scheduled jobs** for polling mailboxes, refreshing embeddings, or reconciliation tasks when the blueprint needs them.

### Suggested Runtime and Deployment
- **Next.js on Vercel** when users interact through a browser and you want edge-friendly auth and streaming.
- **Node.js services on Fly.io / Railway / Render / Docker** for webhooks, background agents, and long CPU/GPU steps that exceed serverless limits.
- **Separate worker processes** for ingestion, indexing, and batch eval — keeps user-facing APIs responsive.

### Testing and Evaluation Strategy
- **Vitest** for pure functions, schema validation, and policy engines without network.
- **Contract tests** for outbound HTTP using recorded fixtures; **tool mocks** for LLM unit tests.
- **Structured output snapshots** (JSON Schema validation) instead of brittle full-text asserts.
- **Eval sets** (golden inputs) with regression checks in CI once prompts stabilize.
- **Latency & cost telemetry** compared per release; alert on p95 regressions for critical flows.


### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
