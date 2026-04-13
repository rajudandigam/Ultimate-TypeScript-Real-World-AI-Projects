### 1. System Overview

Events land on an **ingress bus** with dedupe keys. A **router** starts **workflow executions** in Temporal/Inngest. Each workflow composes **activities**: validate payload, call LLM with schema, call external APIs, wait for human signals, compensate on failure.

---

### 2. Architecture Diagram (text-based)

```
Event source → Ingress (verify + dedupe)
        ↓
   Router (event_type → workflow version)
        ↓
   Workflow engine
   ├─ Activities: LLM classify / summarize
   ├─ Activities: SaaS writes (idempotent)
   └─ Signals: human approvals
        ↓
   Completion event / DLQ
```

---

### 3. Core Components

- **UI / API Layer:** Subscription admin, run explorer, DLQ triage.
- **LLM layer:** LLM activities isolated with timeouts and schema validation.
- **Agents (if any):** Optional bounded agent inside a sandbox activity—not the workflow scheduler itself.
- **Tools / Integrations:** CRM, ticketing, email, internal microservices.
- **Memory / RAG:** Retrieval activities with ACL; workflow memo for small state.
- **Data sources:** Webhooks, queues, object notifications, metric alerts.

---

### 4. Data Flow

1. **Input:** Receive event; verify signature; compute dedupe key; enqueue start.
2. **Processing:** Workflow executes activities in order with checkpoints; LLM outputs validated before writes.
3. **Tool usage:** Side-effect activities use per-tenant credentials from vault with scoped tokens.
4. **Output:** Emit completion or compensation chain; archive run history per retention policy.

---

### 5. Agent Interaction (if applicable)

Not multi-agent by default. If an agent runs, it is **encapsulated** as an activity with its own audit boundary.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workflows by tenant; autoscale workers; separate hot routers from cold archival.
- **Caching:** Cache routing tables; avoid caching nondeterministic LLM outputs as routing inputs.
- **Async processing:** Everything async by design; prioritize queues for SLA tiers.

---

### 7. Failure Handling

- **Retries:** Activity retries with policies; workflow-level continue-as-new for long-running cases.
- **Fallbacks:** DLQ with replay tooling; manual override signals.
- **Validation:** Schema validation on all external writes; quarantine poison payloads.

---

### 8. Observability

- **Logging:** `workflow_id`, `run_id`, activity outcomes; redact sensitive fields.
- **Tracing:** Link spans across activities and LLM calls with shared `correlation_id`.
- **Metrics:** Start rate, success rate, activity latency heatmaps, DLQ rate, LLM invalid JSON rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Event-Driven Workflow Engine**:

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
