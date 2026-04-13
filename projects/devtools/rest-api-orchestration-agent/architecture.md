### 1. System Overview

**Connector registry** stores **base URLs**, **auth flows**, and **OpenAPI fragments**. **Orchestration Agent** executes a **run record** persisted by a **workflow service** (recommended). **HTTP executor** enforces **allowlists**, **timeouts**, and **response validation**. **Vault** injects secrets at execution time.

---

### 2. Architecture Diagram (text-based)

```
User goal → policy check → Orchestration Agent
        ↓
HTTP executor (allowlist + validate) → upstream APIs
        ↓
Run report + redacted audit
```

---

### 3. Core Components

- **UI / API Layer:** Run console, connector admin, secret rotation UI.
- **LLM layer:** Tool-using agent with capped steps.
- **Agents (if any):** Single agent; optional planner split later.
- **Tools / Integrations:** OAuth providers, webhooks, object storage for large payloads.
- **Memory / RAG:** Playbook retrieval; prior run transcripts (redacted).
- **Data sources:** OpenAPI specs, Postman collections (imported), env configs.

---

### 4. Data Flow

1. **Input:** Validate user authZ for connector + environment.
2. **Processing:** Agent plans steps; each HTTP call passes policy engine.
3. **Tool usage:** Validate response JSON against Zod; store checkpoint row.
4. **Output:** Final aggregate JSON to caller; async webhooks on completion.

---

### 5. Agent Interaction (if applicable)

Single agent per run; concurrent runs isolated by `run_id` and tenant.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless executor workers; per-tenant concurrency caps.
- **Caching:** Token caches with TTL near expiry minus skew.
- **Async processing:** Long runs as workflows with human pause/resume.

---

### 7. Failure Handling

- **Retries:** Classify errors; never blindly retry POST without idempotency key present.
- **Fallbacks:** Partial results with explicit `halt_reason`.
- **Validation:** Reject responses that fail schema—surface to agent for replanning within limits.

---

### 8. Observability

- **Logging:** Step outcomes, HTTP status classes, redaction stats.
- **Tracing:** Propagate W3C trace context to upstreams where supported.
- **Metrics:** Success rate by connector, p95 step latency, policy block counts.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **REST API Orchestration Agent**:

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
