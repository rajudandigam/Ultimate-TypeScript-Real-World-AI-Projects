### 1. System Overview

Receipts arrive via **upload API** or **email poller** into **object storage**. A **workflow** stages: **virus scan → OCR → line extraction → categorization → policy checks → approval routing → export**. **Outbox** ensures ERP delivery is reliable. **Audit service** records field-level edits.

---

### 2. Architecture Diagram (text-based)

```
Ingest (email/mobile/card)
        ↓
   Expense workflow
        ↓
   OCR + parsers → line items (Postgres)
        ↓
   Rules + optional LLM tie-break
        ↓
   Approvals (manager chain)
        ↓
   ERP export worker (outbox)
```

---

### 3. Core Components

- **UI / API Layer:** Employee submit UI, approver inbox, finance admin.
- **LLM layer:** Optional classification assist with confidence scores.
- **Agents (if any):** None required in core L2.
- **Tools / Integrations:** ERP, HR org, payments/cards, email.
- **Memory / RAG:** Org merchant dictionary; optional policy FAQ retrieval.
- **Data sources:** Receipts, card feeds, mileage entries.

---

### 4. Data Flow

1. **Input:** Create report shell; attach receipts; ingest card txns for matching window.
2. **Processing:** OCR produces line items; rules assign GL; flags exceptions.
3. **Tool usage:** Notify approvers; on approval, enqueue export job with idempotency key.
4. **Output:** Post journal entries; archive report PDF; notify employee of payment schedule.

---

### 5. Agent Interaction (if applicable)

Not applicable for core pipeline. Optional separate **employee Q&A** bot reads policy KB only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; worker autoscaling by queue depth; shard by `org_id`.
- **Caching:** Merchant classification cache per org with admin invalidation.
- **Async processing:** OCR and export always async; user sees progress states.

---

### 7. Failure Handling

- **Retries:** OCR and ERP retries with exponential backoff; DLQ with replay tools.
- **Fallbacks:** Manual line entry path if OCR repeatedly fails.
- **Validation:** Totals must match within tolerance; block submit until resolved or waived with reason.

---

### 8. Observability

- **Logging:** Stage timings, OCR vendor errors, export outcomes, approval latencies.
- **Tracing:** Trace `report_id` through workflow (PII redacted spans).
- **Metrics:** Auto-categorization rate, human correction rate, close time, export failure rate, duplicate receipt hits.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Expense Report Automation System**:

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
