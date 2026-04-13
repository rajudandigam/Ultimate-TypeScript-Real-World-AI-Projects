### 1. System Overview

**Webhook ingress** normalizes channel payloads to a **canonical ticket model**. **Routing Agent** executes tools to gather **customer context** and **KB matches**, then outputs a **structured route**. **Policy service** approves auto-apply; else queues for human triage.

---

### 2. Architecture Diagram (text-based)

```
Channels → normalizer → ticket store
        ↓
Routing Agent → CRM/KB tools
        ↓
Route decision → helpdesk API update
```

---

### 3. Core Components

- **UI / API Layer:** Triage console, calibration dashboards, policy editor.
- **LLM layer:** Tool-using agent with confidence scores.
- **Agents (if any):** Single agent per ticket (stateless) recommended.
- **Tools / Integrations:** Helpdesk REST, CRM, payments (read-only), search.
- **Memory / RAG:** Curated KB index; not raw internet.
- **Data sources:** Tickets, macros, product catalog snippets.

---

### 4. Data Flow

1. **Input:** `ticket.created` event with redacted payload for model.
2. **Processing:** Link customer; fetch open/pending siblings; classify intent.
3. **Tool usage:** Score candidate queues; check VIP and SLA timers.
4. **Output:** Apply fields or attach internal recommendation note.

---

### 5. Agent Interaction (if applicable)

Single agent; human agent remains accountable for customer-facing replies.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by brand_id; async for bulk imports.
- **Caching:** KB retrieval cache per doc version.
- **Async processing:** Heavy CRM joins deferred without blocking webhook ack.

---

### 7. Failure Handling

- **Retries:** Vendor backoff; DLQ with replay after fix.
- **Fallbacks:** Default queue + `needs_review` tag on uncertainty.
- **Validation:** JSON schema for decisions; deny unknown queue ids.

---

### 8. Observability

- **Logging:** Decision codes, confidence buckets, override reasons.
- **Tracing:** Webhook→route span against first-response SLO.
- **Metrics:** Route accuracy from QA sampling, FRT, escalation rate, cost per ticket.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Channel Support Routing Agent**:

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
