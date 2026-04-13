### 1. System Overview

Documents enter **object storage** with tenant metadata. **Workflow engine** orchestrates **scan → classify → extract → validate → export**. Low-confidence rows go to **review queue**. **Outbox** delivers to downstream systems with retries. **Lineage store** tracks template version and model version per job.

---

### 2. Architecture Diagram (text-based)

```
Upload / poll / email ingest
        ↓
   Doc processing workflow
   ↓     ↓      ↓      ↓
virus  OCR  extract validate
        ↓
   Review queue (optional)
        ↓
   Export worker (outbox)
```

---

### 3. Core Components

- **UI / API Layer:** Upload UI, job status, reviewer console, template admin.
- **LLM layer:** Optional extraction/classification nodes with JSON schema outputs.
- **Agents (if any):** None required; optional offline Q&A over extracted tables.
- **Tools / Integrations:** OCR vendors, ERP APIs, data warehouse loaders.
- **Memory / RAG:** Approved few-shot libraries per doc type.
- **Data sources:** Customer PDFs, scans, bundled templates.

---

### 4. Data Flow

1. **Input:** Accept file; compute hash; short-circuit if already processed version exists.
2. **Processing:** Run OCR/layout; classify doc type; select template pipeline branch.
3. **Tool usage:** LLM/ML nodes produce structured JSON; validators enforce business rules.
4. **Output:** Write to staging tables; upon approval, publish to destination with receipt.

---

### 5. Agent Interaction (if applicable)

Not core. If added, a **review copilot** only suggests fixes using structured diff tools.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by tenant; autoscale OCR/LLM workers independently.
- **Caching:** Hash-based memoization of extraction outputs per `(file_hash, template_version)`.
- **Async processing:** All heavy steps async; API returns job id immediately.

---

### 7. Failure Handling

- **Retries:** Stage-level retries with caps; DLQ with replay tooling for ops.
- **Fallbacks:** Human-only path if automation unhealthy (feature flag).
- **Validation:** Hard fail export if totals mismatch or required fields null.

---

### 8. Observability

- **Logging:** Stage durations, confidence stats, export outcomes (metadata).
- **Tracing:** Trace `job_id` across workflow activities.
- **Metrics:** Throughput pages/hour, error rate by vendor, human touch time, cost per document.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Document Processing Pipeline**:

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
