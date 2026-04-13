### 1. System Overview
**Home graph** models assets, edges (e.g., HVAC serves zones), and documents. **Scheduler** emits due events. **Agent** consumes graph snapshot + recent telemetry to produce monthly brief.

### 2. Architecture Diagram (text-based)
```
Assets/docs → graph DB → maintenance agent → ranked actions
                    ↓
              reminders + completion capture
```

### 3. Core Components
Upload pipeline, OCR for receipts, rules catalog (versioned), notification channels, mobile offline cache, audit log of advice given

### 4. Data Flow
Nightly job recomputes due scores → agent generates digest if delta > threshold → user snoozes or completes → feedback updates model params

### 5. Agent Interaction
Read-only on financial accounts; write tools limited to creating reminders/tickets; no auto-booking contractors without explicit user tool approval

### 6. Scaling Considerations
Many homes per user (landlord); large photo sets; batch digest generation off-peak; compress old telemetry

### 7. Failure Scenarios
Missing last service date → widen confidence + ask one clarifying question; duplicate assets from import → dedupe wizard; sensor offline → degrade gracefully

### 8. Observability Considerations
Snooze rate, completion latency, alert volume per home, OCR fix-ups, agent suggestion acceptance rate


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Home Maintenance Intelligence System**:

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
