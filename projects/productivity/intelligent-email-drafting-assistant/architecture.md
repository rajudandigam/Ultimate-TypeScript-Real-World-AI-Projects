### 1. System Overview

**Add-in client** calls **BFF** with user intent. **Drafting Agent** fetches **thread excerpts** via provider APIs after **redaction**. **Composer service** returns streaming tokens to UI. **Send path** remains native client—no server auto-send.

---

### 2. Architecture Diagram (text-based)

```
Mail client → BFF → Drafting Agent
        ↓
Gmail/Graph read tools → redactor
        ↓
Draft stream → composer UI
```

---

### 3. Core Components

- **UI / API Layer:** Outlook/Gmail add-in, settings for tone and disclaimers.
- **LLM layer:** Streaming model with optional lightweight tool calls.
- **Agents (if any):** Single agent per draft session.
- **Tools / Integrations:** Mail APIs, optional CRM with scoped tokens.
- **Memory / RAG:** Org style snippets; user macro library.
- **Data sources:** Email threads, calendar context (optional).

---

### 4. Data Flow

1. **Input:** `thread_id`, goal, tone, locale.
2. **Processing:** Fetch messages up to budget; summarize long tails server-side.
3. **Tool usage:** Optional CRM pull for account facts if user opted in.
4. **Output:** Stream draft; store only metadata unless user saves template.

---

### 5. Agent Interaction (if applicable)

Single agent; user edits are authoritative.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Regional BFF; isolate noisy tenants.
- **Caching:** Thread summaries keyed by `(thread_id, last_message_id)`.
- **Async processing:** Heavy summarization before streaming draft.

---

### 7. Failure Handling

- **Retries:** Provider backoff; partial thread mode with banner.
- **Fallbacks:** Offer bullet outline if streaming provider down.
- **Validation:** Output filter for disallowed domains/links per org policy.

---

### 8. Observability

- **Logging:** Draft session ids, token usage, redaction triggers.
- **Tracing:** Fetch→summarize→stream latency breakdown.
- **Metrics:** Acceptance rate, policy block rate, mean edit distance.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Intelligent Email Drafting Assistant**:

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
