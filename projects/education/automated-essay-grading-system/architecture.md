### 1. System Overview

**Submission ingestor** stores essays with **integrity hashes**. **Parser** produces paragraph index. **Grading Agent** returns **structured scorecard** referencing **span ids**. **Post-processor** applies **calibration** and **policy checks**. **LMS adapter** writes grades or marks as **pending review** per configuration.

---

### 2. Architecture Diagram (text-based)

```
LMS / upload → ingest → parse/index
        ↓
Grading Agent → scorecard JSON → validation
        ↓
LMS gradebook / instructor review queue
```

---

### 3. Core Components

- **UI / API Layer:** Instructor calibration, appeal handler, audit export.
- **LLM layer:** Tool-using or single-pass structured grading with span refs.
- **Agents (if any):** Single agent per submission; dual-agent optional for high stakes.
- **Tools / Integrations:** LMS APIs, OCR pipeline, similarity vendor (optional).
- **Memory / RAG:** Rubric + exemplar retrieval (licensed, scoped).
- **Data sources:** Assignment prompts, prior anonymized anchor papers.

---

### 4. Data Flow

1. **Input:** Authenticate student/instructor context; fetch rubric version.
2. **Processing:** Parse doc; optionally run integrity checks per institution policy.
3. **Tool usage:** Score each rubric dimension with evidence spans; assemble feedback blocks.
4. **Output:** Persist results; if auto-post disabled, notify instructor for approval.

---

### 5. Agent Interaction (if applicable)

Single agent; human appeal updates gold labels for calibration loop (governed).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch workers for large exams; isolate per-tenant queues.
- **Caching:** Parsed paragraph index keyed by content hash.
- **Async processing:** OCR and long essays off interactive path.

---

### 7. Failure Handling

- **Retries:** Transient model errors with bounded replays; variance triggers human review flag.
- **Fallbacks:** If parsing fails, route to manual grading with student notice.
- **Validation:** Schema validation; clamp scores to rubric ranges; detect missing dimensions.

---

### 8. Observability

- **Logging:** Rubric version, latency, refusal reasons, redaction stats.
- **Tracing:** Upload→grade spans per submission.
- **Metrics:** Human override rate, reliability coefficients, cost per 1k words.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Automated Essay Grading System**:

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
