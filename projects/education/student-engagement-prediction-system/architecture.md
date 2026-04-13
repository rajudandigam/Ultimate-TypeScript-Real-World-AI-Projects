### 1. System Overview

**ETL workflows** land LMS/SIS events into a **warehouse**. **Feature builder** materializes per-student daily/weekly metrics. **Scoring workflow** applies **model vN** or rules to assign **tiers**. **Notification workflow** enqueues advisor tasks with **audit** entries.

---

### 2. Architecture Diagram (text-based)

```
LMS/SIS exports → warehouse → features
        ↓
Scoring job → risk tiers → advisor queue
```

---

### 3. Core Components

- **UI / API Layer:** Advisor UI, threshold admin, appeals log.
- **LLM layer:** Optional outreach templating from structured drivers only.
- **Agents (if any):** Optional later; core is workflow/ML.
- **Tools / Integrations:** LMS APIs, email/SMS with consent registry, CRM.
- **Memory / RDB:** Feature tables, model registry, notification ledger.
- **Data sources:** Assignments, grades, attendance, clicks (policy scoped).

---

### 4. Data Flow

1. **Input:** Incremental event files or API pulls with cursor checkpoints.
2. **Processing:** Normalize student ids; join to active enrollments only.
3. **Tool usage:** Score; attach top 3 drivers from explainability module.
4. **Output:** Upsert `student_risk_snapshot`; emit advisor notifications per cadence rules.

---

### 5. Agent Interaction (if applicable)

Optional templating agent; tier assignment remains deterministic/ML outside LLM unless explicitly designed otherwise.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ETL by term and campus; async scoring workers.
- **Caching:** Enrollment snapshots reused across scoring and UI.
- **Async processing:** Nightly batch with intraday optional micro-batch for pilot programs.

---

### 7. Failure Handling

- **Retries:** File ingest retries; quarantine malformed rows with alerts.
- **Fallbacks:** If model unavailable, fall back to rules-only tier with banner in UI.
- **Validation:** Reject scores for students without valid FERPA basis for processing.

---

### 8. Observability

- **Logging:** Model version, feature build version, join completeness %.
- **Tracing:** ETL→score→notify spans per batch id.
- **Metrics:** Tier distribution drift, intervention uptake, false positive advisor reports.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Student Engagement Prediction System**:

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
