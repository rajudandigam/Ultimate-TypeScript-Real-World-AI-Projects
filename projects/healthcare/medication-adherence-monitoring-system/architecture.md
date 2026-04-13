### 1. System Overview

Pharmacy and device producers publish **normalized dose events** into an **ingest API**. A **workflow engine** materializes **per-patient schedules**, computes **window states** (on-time / late / missed), drives **notification workers**, and writes **read-model aggregates** for dashboards. **Consent service** gates every outbound channel.

---

### 2. Architecture Diagram (text-based)

```
Sources (pharmacy / IoT / app) → ingest API → event bus
        ↓
Workflow: schedule + window engine
        ↓
Notification workers (SMS/push/voice)
        ↓
Receipts + adherence aggregates + audit
```

---

### 3. Core Components

- **UI / API Layer:** Patient app (optional), clinician console, admin ingestion monitors.
- **LLM layer:** Optional template copy assistant (strict allowlist); not on scheduling hot path.
- **Agents (if any):** None in v1 core; optional staff summarization agent later.
- **Tools / Integrations:** Twilio (or equivalent), push gateways, EHR read adapters.
- **Memory / RAG:** Postgres schedules + event log; Redis optional for rate counters.
- **Data sources:** HL7/FHIR dispense, device webhooks, patient self-report.

---

### 4. Data Flow

1. **Input:** Ingest `event_id`-keyed rows (idempotent).
2. **Processing:** Upsert medication schedule version; recompute next windows.
3. **Tool usage:** Send reminder when window opens/closes; record delivery receipt.
4. **Output:** Update streak metrics; enqueue clinician task if policy thresholds trip.

---

### 5. Agent Interaction (if applicable)

Not applicable for core adherence automation. If added, agents are **read-only** on metrics and **cannot** alter pharmacy orders.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workflows by `patient_id` hash; isolate noisy tenants.
- **Caching:** Hot read models for dashboards; invalidate on new events.
- **Async processing:** All notifications async; backpressure on provider rate limits.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on provider 5xx; cap attempts then DLQ with alert.
- **Fallbacks:** Secondary channel if primary fails (policy permitting).
- **Validation:** Reject events with impossible timestamps; quarantine malformed HL7.

---

### 8. Observability

- **Logging:** Structured logs with `tenant_id`, `schedule_version`, redacted phone tokens.
- **Tracing:** Trace ingest → schedule update → send for SLO debugging.
- **Metrics:** Missed-window precision in pilots, p95 reminder latency, opt-out rate, integration lag.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Medication Adherence Monitoring System**:

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
