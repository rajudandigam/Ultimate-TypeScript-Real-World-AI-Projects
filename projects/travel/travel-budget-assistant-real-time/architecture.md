### 1. System Overview

Clients send **expense events** to an API persisted in **Postgres**. **OCR workers** enrich photos asynchronously. A **budget engine** recomputes pacing and thresholds on each insert. The **budget agent** answers chat queries via **read tools** and proposes **category fixes** via validated write tools. **Push service** sends nudges based on rules.

---

### 2. Architecture Diagram (text-based)

```
Mobile / web
        ↓
   Trip API → ledger (Postgres)
        ↓
   OCR worker (async) → suggested rows
        ↓
   Budget Agent (tools: list, update, summarize)
        ↓
   Notifications (rules + optional LLM copy)
```

---

### 3. Core Components

- **UI / API Layer:** Trip dashboard, receipt inbox, confirmation for OCR suggestions.
- **LLM layer:** Categorization + coaching phrasing agent.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** FX rate provider, push notifications, optional bank feed.
- **Memory / RAG:** User defaults; optional small destination cost KB.
- **Data sources:** User-entered data, card feeds, OCR pipeline.

---

### 4. Data Flow

1. **Input:** User adds expense or uploads receipt; server stores pending row.
2. **Processing:** OCR completes; agent proposes category; user confirms or edits.
3. **Tool usage:** Agent reads aggregates by day/category; may call `reclassify_expense` with enum only.
4. **Output:** Update rollups; enqueue notification if pacing rule fires.

---

### 5. Agent Interaction (if applicable)

Single agent. Rules engine owns **when** to notify; LLM only drafts message body within templates.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; workers scale with OCR queue depth.
- **Caching:** FX rates with TTL; trip summary snapshots for fast reads.
- **Async processing:** OCR and bank reconciliation off hot path.

---

### 7. Failure Handling

- **Retries:** Webhook and OCR retries with DLQ for poison files.
- **Fallbacks:** If LLM down, show numeric dashboard only with templated tips.
- **Validation:** Reject expenses with impossible timestamps or currencies unsupported by product.

---

### 8. Observability

- **Logging:** OCR latency, categorization overrides, notification sends.
- **Tracing:** Trace `trip_id` operations across API and workers.
- **Metrics:** Active trips, spend velocity vs plan, user correction rate, sync health.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Travel Budget Assistant (Real-Time)**:

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
