### 1. System Overview

**Webhook gateway** authenticates sources and writes **canonical events** to a **ledger**. **Reconciliation workflow** computes desired channel states, emits **update intents**, and waits for **acknowledgements** or compensates on failure. **Shadow state** per channel tracks last known remote quantity.

---

### 2. Architecture Diagram (text-based)

```
Sources → ingest → canonical ledger
        ↓
Reconcile workflow → channel update intents
        ↓
Channel adapters → ack/nack → compensate if needed
```

---

### 3. Core Components

- **UI / API Layer:** Mapping admin, replay tools, dry-run previews.
- **LLM layer:** Optional ops summaries only.
- **Agents (if any):** None in v1.
- **Tools / Integrations:** Marketplace APIs, WMS, OMS, alerting.
- **Memory / RAG:** Ledger DB; optional vector index for internal runbooks.
- **Data sources:** Webhooks, polling jobs, CSV backfills.

---

### 4. Data Flow

1. **Input:** `sku_id` quantity change event with provenance.
2. **Processing:** Merge into ledger; detect conflicts via ruleset version.
3. **Tool usage:** Push updates per channel with idempotency keys; record responses.
4. **Output:** Consistent remote states or explicit human tasks on deadlock.

---

### 5. Agent Interaction (if applicable)

Not applicable for core sync path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by merchant; shard ledger hot keys.
- **Caching:** Read models for dashboards; invalidate on ledger append.
- **Async processing:** Bulk catch-up jobs after outages with checkpoints.

---

### 7. Failure Handling

- **Retries:** Per-channel policies; poison messages to DLQ with actionable diagnostics.
- **Fallbacks:** Read-only mode during incidents; pause destructive pushes.
- **Validation:** Block negative stock unless business rule explicitly allows backorder semantics.

---

### 8. Observability

- **Logging:** Structured channel API responses (redact secrets).
- **Tracing:** Trace reconcile waves across adapters.
- **Metrics:** Drift amount, success latency, 429 counts, oversell guard trips.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Channel Inventory Sync System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
