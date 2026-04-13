### 1. System Overview

Tickets arrive via **webhooks** into an **ingress service** that writes canonical rows. **Feature extractor** computes text + metadata + account signals. **Router workflow** runs **rules layer** then **model layer** producing `RoutingDecision`. **Effect applier** updates CRM via **outbox** for reliability. **Feedback loop** stores human overrides.

---

### 2. Architecture Diagram (text-based)

```
Ticketing webhook
        ↓
   Ticket store (Postgres)
        ↓
   Feature extractor
        ↓
   Router workflow (rules → model)
        ↓
   Outbox → CRM field updates
        ↓
   Analytics + training export
```

---

### 3. Core Components

- **UI / API Layer:** Override console, policy editor, shadow vs live toggles.
- **LLM layer:** Optional classifier/explainer producing structured JSON only.
- **Agents (if any):** Not required on hot path.
- **Tools / Integrations:** Zendesk/JSM/Intercom APIs, Slack, PagerDuty.
- **Memory / RAG:** Optional similar-ticket retrieval for assistive suggestions.
- **Data sources:** Tickets, customer tier data, incident status feeds.

---

### 4. Data Flow

1. **Input:** Receive create/update event; normalize to internal ticket model.
2. **Processing:** Extract features; evaluate ordered rules; if needed call model with bounded text.
3. **Tool usage:** Apply queue/priority/tags through CRM adapter with idempotency keys.
4. **Output:** Emit metrics event; if human overrides, store label for training pipeline.

---

### 5. Agent Interaction (if applicable)

Optional offline **copilot** for analysts—not part of automated routing loop by default.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition webhook consumers; scale feature workers; read-heavy caches for org configs.
- **Caching:** Embeddings for static KB slices; per-tenant routing config snapshots.
- **Async processing:** Bulk reprocessing when taxonomy changes (versioned jobs).

---

### 7. Failure Handling

- **Retries:** Outbox retries for CRM 429/5xx; circuit breaker per integration.
- **Fallbacks:** Default queue + page oncall if automation unhealthy.
- **Validation:** Reject unknown queue ids; clamp priorities to allowed enums.

---

### 8. Observability

- **Logging:** Decision codes, rule hit path, model version, apply success/fail.
- **Tracing:** Trace `ticket_id` through pipeline with redaction.
- **Metrics:** Misroute proxy (override rate), time-to-route, queue depth, provider error taxonomy, drift monitors.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Customer Support Ticket Router**:

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
