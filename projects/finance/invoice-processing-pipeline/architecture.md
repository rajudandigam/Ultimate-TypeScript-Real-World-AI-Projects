### 1. System Overview

Invoices flow through a **pipeline** of discrete workers: ingest artifact to object storage, run OCR/layout analysis, **extract** structured fields via model+rules hybrid, **classify** to GL, run **validators** (math, duplicates, PO match), then enqueue ERP posts via an **outbox** for reliability.

---

### 2. Architecture Diagram (text-based)

```
Invoice intake (email / SFTP / API)
        ↓
   Object storage (immutable originals)
        ↓
   Workflow: OCR / layout
        ↓
   Extraction (LLM + schema) + rules
        ↓
   Classification + PO match tools
        ↓
   Validator (deterministic)
        ↓
   Exception queue OR ERP outbox post
```

---

### 3. Core Components

- **UI / API Layer:** AP review console, supplier status portal (optional), admin rules editor.
- **LLM layer:** Structured extraction prompts; optional vision path for complex PDFs.
- **Agents (if any):** Optional analyst assistant for exceptions—not autopost authority.
- **Tools / Integrations:** ERP APIs, vendor DB, FX, sanctions screening, email receipt parsers.
- **Memory / RAG:** Retrieval of similar invoices and correction notes (tenant-scoped).
- **Data sources:** PDFs, XML/UBL, email MIME, EDI files.

---

### 4. Data Flow

1. **Input:** Store raw file; compute `document_hash`; reject duplicates early.
2. **Processing:** Extract header/lines/taxes; normalize currency; classify to GL with confidence.
3. **Tool usage:** Query PO lines; validate vendor bank details against golden record; post draft to ERP when checks pass.
4. **Output:** Persist `posting_id` or route to exceptions with structured reasons for humans.

---

### 5. Agent Interaction (if applicable)

Workflow-only for money movement. Any “agent” is confined to **exception explanation** and suggested corrections as drafts.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by tenant; isolate OCR-heavy nodes.
- **Caching:** Cache vendor layout fingerprints; reuse extraction hints for recurring suppliers.
- **Async processing:** Large batches with checkpoints; prioritize by due date and amount.

---

### 7. Failure Handling

- **Retries:** Transient OCR/LLM/ERP errors with capped attempts; DLQ for manual classification.
- **Fallbacks:** Human-only path always available; never lose original artifact reference.
- **Validation:** Hard-stop on arithmetic mismatch; block autopost on any sanctions hit.

---

### 8. Observability

- **Logging:** Stage timings, validator codes, model versions; minimize PAN/account numbers in logs.
- **Tracing:** Trace each invoice `id` through all stages with baggage for tenant.
- **Metrics:** Straight-through processing rate, exception rate by reason, ERP error codes, cost per invoice.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Invoice Processing Pipeline**:

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
