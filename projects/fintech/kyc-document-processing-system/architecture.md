### 1. System Overview

Uploads land in **object storage** with encryption. A **workflow** orchestrates **virus scan → OCR → field extraction → validations → vendor checks → decision**. Results persist in **Postgres** with encrypted fields. **Reviewer UI** pulls cases from queues by risk score.

---

### 2. Architecture Diagram (text-based)

```
Client upload (presigned URL)
        ↓
   KYC workflow (Temporal/Inngest)
        ↓
   OCR / doc AI → structured fields
        ↓
   Validators (regex, checksum, cross-field)
        ↓
   Vendor checks (watchlist, doc auth, face match)
        ↓
   Decision + audit → core platform
```

---

### 3. Core Components

- **UI / API Layer:** Capture SDK, status polling, reviewer console.
- **LLM layer:** Optional field normalization with hard validation afterward.
- **Agents (if any):** None required in core.
- **Tools / Integrations:** Bureau APIs, sanctions lists, email/SMS for step-up.
- **Memory / RAG:** Case notes; policy snippets for reviewers.
- **Data sources:** User uploads, external verification responses.

---

### 4. Data Flow

1. **Input:** Client uploads front/back/selfie per jurisdiction requirements.
2. **Processing:** OCR extracts fields; validators compute pass/partial/fail codes.
3. **Tool usage:** Call vendor services with minimal necessary images; redact outputs for logs.
4. **Output:** Emit webhook to account service; route to manual queue with structured failure reasons.

---

### 5. Agent Interaction (if applicable)

Optional **reviewer copilot** reads structured JSON only; never sends raw images to general models unless vendor contract allows.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; worker pool scales with queue depth; shard reviewers by locale expertise.
- **Caching:** Template libraries per document type version.
- **Async processing:** All heavy steps async; user sees progress states.

---

### 7. Failure Handling

- **Retries:** Vendor retries with jitter; DLQ for stuck cases with paging alerts.
- **Fallbacks:** Manual-only path if automation unhealthy (feature flag).
- **Validation:** Reject uploads over size limits or wrong MIME; malware quarantine.

---

### 8. Observability

- **Logging:** Stage timings, vendor error codes, decision codes (no raw PII).
- **Tracing:** Trace `case_id` through pipeline with strict redaction policies.
- **Metrics:** Straight-through processing rate, manual queue depth, OCR confidence, fraud catch rate (labeled sets), vendor latency.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **KYC Document Processing System**:

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
