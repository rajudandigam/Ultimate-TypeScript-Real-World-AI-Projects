### 1. System Overview

Scoring workers consume **normalized events** from a queue, optionally fetch **trace and retrieval evidence**, run **rules + model judges**, and write **score documents** to an analytics store. Critical path APIs can use **async** scoring or **lightweight** checks synchronously based on policy.

---

### 2. Architecture Diagram (text-based)

```
LLM app (instrumented)
        ↓ (OTel + score event)
   Ingest / sampling layer
        ↓
   Scoring queue
        ↓
   Quality Scoring Agent
     ↙     ↓     ↘
fetchTrace fetchRubric verifyCitations
        ↓
   Score store (Postgres / columnar export)
        ↓
   Alerts / dashboards / human queue
```

---

### 3. Core Components

- **UI / API Layer:** Reviewer console, threshold admin, appeals workflow.
- **LLM layer:** Scoring agent with bounded tools and structured output schema.
- **Agents (if any):** Primary scorer; optional specialist judges as separate deployments.
- **Tools / Integrations:** Trace backend, policy service, ticketing webhooks.
- **Memory / RAG:** Rubric retrieval; rolling baseline stats in TSDB.
- **Data sources:** Redacted prompts/outputs, retrieval chunks, tool I/O summaries.

---

### 4. Data Flow

1. **Input:** Receive event with trace correlation; apply sampling and tenant policy.
2. **Processing:** Run deterministic checks; if needed, assemble evidence bundle under token cap.
3. **Tool usage:** Fetch traces/docs; compute citation coverage; produce score vector + rationales.
4. **Output:** Persist record; emit metric series; route to human queue if severity exceeds threshold.

---

### 5. Agent Interaction (if applicable)

Single scoring agent per event by default. Multi-judge runs as **parallel independent scorers** merged by fixed formula—not conversational multi-agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale scorer workers; isolate expensive tenants.
- **Caching:** Cache rubric chunks; cache frequent policy lexicon lookups.
- **Async processing:** Default path async to protect user-facing latency.

---

### 7. Failure Handling

- **Retries:** Model retries with backoff; cap total time per event.
- **Fallbacks:** Rules-only score with explicit uncertainty flags.
- **Validation:** Reject malformed events; dead-letter unknown schema versions.

---

### 8. Observability

- **Logging:** Score version, model id, latency, evidence fetch success flags.
- **Tracing:** Link scorer spans to original `trace_id` from producer service.
- **Metrics:** Score drift by surface, queue lag, cost per scored event, appeal overturn rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Output Quality Scoring Engine**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
