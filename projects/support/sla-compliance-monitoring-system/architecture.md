### 1. System Overview

**Event ingestor** writes normalized **ticket events** to an append log. **SLA engine** materializes **per-ticket timers** with pause/resume transitions driven by field changes. **Escalation workflow** notifies channels when thresholds approach or breach. **Reporting** aggregates by account and tier.

---

### 2. Architecture Diagram (text-based)

```
Helpdesk webhooks → event log → SLA workflows
        ↓
State store (Postgres) → alerts / dashboards
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor, holiday calendar admin, breach inbox.
- **LLM layer:** Optional narrative summaries only.
- **Agents (if any):** None in core engine.
- **Tools / Integrations:** Helpdesk REST, Slack, email, PagerDuty.
- **Memory / RAG:** Policy version store; optional contract doc retrieval for staff.
- **Data sources:** Tickets, entitlements, business hours tables.

---

### 4. Data Flow

1. **Input:** `ticket.updated` with field diff; map to SLA-relevant transitions.
2. **Processing:** Recompute deadlines; detect near-breach windows.
3. **Tool usage:** Post internal notes or tags via API when configured.
4. **Output:** Emit notifications and update analytics warehouse.

---

### 5. Agent Interaction (if applicable)

Not applicable for clock correctness path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition event processing by shard key (brand_id).
- **Caching:** Business hours materialized per timezone for fast deadline math.
- **Async processing:** Nightly reconciliation job to fix drift vs vendor-native SLA.

---

### 7. Failure Handling

- **Retries:** At-least-once ingestion with idempotency keys `(ticket_id, event_seq)`.
- **Fallbacks:** If notification channel fails, route to alternate channel per policy.
- **Validation:** Reject policy deploy if simulation suite fails on historical fixtures.

---

### 8. Observability

- **Logging:** Timer transitions with policy version id.
- **Tracing:** Webhook→state update→notification spans.
- **Metrics:** Breach rate, MTTA/MTTR proxies, false escalation counts, replay depth.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **SLA Compliance Monitoring System**:

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
