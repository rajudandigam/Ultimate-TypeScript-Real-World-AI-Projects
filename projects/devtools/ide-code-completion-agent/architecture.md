### 1. System Overview

**IDE extension** captures **editor state** (URI, caret, visible imports) and calls a **local BFF** or **cloud API**. **Completion Agent** fetches **minimal context** via tools, streams tokens, and returns **structured edit ops** when needed. **Validator** optionally runs **TypeScript diagnostics** before apply.

---

### 2. Architecture Diagram (text-based)

```
Editor → BFF → Completion Agent
        ↓
tools: LSP bridge, file chunks, tsserver
        ↓
Streamed suggestion → client apply / preview
```

---

### 3. Core Components

- **UI / API Layer:** Extension host, settings UI, redaction rules.
- **LLM layer:** Streaming tool-using model.
- **Agents (if any):** Single agent per request; cancel on navigation.
- **Tools / Integrations:** Workspace reader (chrooted), symbol index, optional remote RAG.
- **Memory / RAG:** Repo chunk index; session cache only.
- **Data sources:** Open files, git diff, `tsconfig` graph.

---

### 4. Data Flow

1. **Input:** Debounced trigger with privacy tier (local-only vs cloud).
2. **Processing:** Resolve symbols; retrieve top-k chunks; assemble prompt budget.
3. **Tool usage:** Pull extra spans only if uncertainty high (policy-gated).
4. **Output:** Stream ghost text or return `WorkspaceEdit` JSON.

---

### 5. Agent Interaction (if applicable)

Single short-lived agent per suggestion lifecycle.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Regional inference endpoints; client-side caching of embeddings.
- **Caching:** Chunk embeddings keyed by git blob hash.
- **Async processing:** Background indexing jobs separate from interactive path.

---

### 7. Failure Handling

- **Retries:** Retry stream once on transient 5xx; disable cloud on repeated failure.
- **Fallbacks:** Local regex/snippet templates when offline.
- **Validation:** Reject edits touching `.env` or keychain paths per policy.

---

### 8. Observability

- **Logging:** Aggregate suggestion acceptance, not raw code (unless opted-in).
- **Tracing:** Debounce→first-token spans per session id.
- **Metrics:** p95 latency, cancellation rate, diagnostic regression rate post-apply.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **IDE Code Completion Agent (Copilot Alternative)**:

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
