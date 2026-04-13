### 1. System Overview

Authorization events publish to a **stream**. **Consumer workers** enrich with account and device context, compute **features**, evaluate **rules + model score**, and emit a **decision event** back to the auth platform. **Workflow** (or internal state machine) handles **step-up** timers and **case creation** on escalations.

---

### 2. Architecture Diagram (text-based)

```
Auth / core payments events → Kafka
        ↓
   Fraud consumer workers (scale-out)
        ↓
   Feature enricher (Redis + internal APIs)
        ↓
   Rules + model scorer
        ↓
   Decision emit (approve/challenge/decline)
        ↓
   Case store (Postgres) + optional analyst UI
```

---

### 3. Core Components

- **UI / API Layer:** Rule editor, simulation, investigator views.
- **LLM layer:** Optional offline only at L2 baseline.
- **Agents (if any):** None in core hot path.
- **Tools / Integrations:** Step-up providers, lists, device reputation feeds.
- **Memory / RAG:** Velocity windows; short TTL caches.
- **Data sources:** Transaction stream, account attributes, merchant category codes.

---

### 4. Data Flow

1. **Input:** Normalize event schema; reject malformed payloads.
2. **Processing:** Join features; compute score; evaluate ordered rules with explicit precedence.
3. **Tool usage:** Invoke step-up or list updates only on branch paths (async where possible).
4. **Output:** Return decision within SLA; async write case artifacts for review.

---

### 5. Agent Interaction (if applicable)

Not applicable for L2 core. Future analyst agent reads **structured case JSON** only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition consumers by `account_id` hash for ordered processing per account.
- **Caching:** Hot merchant and account risk caches with TTL and stampede protection.
- **Async processing:** Heavy graph features off hot path into parallel topic with delayed decisions if product allows.

---

### 7. Failure Handling

- **Retries:** At-least-once processing with dedupe store; poison messages to DLQ.
- **Fallbacks:** Safe default decision policy when enrichment unavailable (documented risk).
- **Validation:** Schema gates; maximum feature fan-out per event.

---

### 8. Observability

- **Logging:** Decision codes, rule hit paths, model version, latency breakdowns (no PAN).
- **Tracing:** Trace `transaction_id` through enrichment and scoring (sampling).
- **Metrics:** Approval rates, challenge rates, FP proxies, consumer lag, DLQ depth, shadow/live divergence.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Real-Time Fraud Detection Workflow**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
