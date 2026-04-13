### 1. System Overview

**Event pipeline** materializes **lead feature snapshots** in a warehouse. **Scoring Agent** reads via **parameterized tools** and emits **structured scores**. **Policy gateway** applies auto-write rules or routes to **human review**. **Audit store** keeps immutable history per `lead_id`.

---

### 2. Architecture Diagram (text-based)

```
CRM/events → feature ETL → snapshot tables
        ↓
Lead Scoring Agent → CRM / review queue
        ↓
Audit log + downstream sequences
```

---

### 3. Core Components

- **UI / API Layer:** Score debugger, weight editor, batch job console.
- **LLM layer:** Tool-using agent with schema-validated outputs.
- **Agents (if any):** Single agent per scoring invocation.
- **Tools / Integrations:** CRM APIs, warehouse queries, enrichment vendors.
- **Memory / RAG:** ICP and playbook retrieval; override training tables.
- **Data sources:** Forms, web analytics, product telemetry, email metrics.

---

### 4. Data Flow

1. **Input:** Trigger on lead update or scheduled batch partition.
2. **Processing:** Fetch snapshot row; attach consent flags and segment id.
3. **Tool usage:** Optionally pull extra firmographics; compute score + drivers.
4. **Output:** Persist score version; enqueue sales task or CRM field patch.

---

### 5. Agent Interaction (if applicable)

Single agent; destructive CRM actions behind explicit policy flags.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition batch scoring by shard; async workers.
- **Caching:** Hot lead snapshots in Redis with TTL tied to ETL freshness.
- **Async processing:** Nightly full re-score for model version bumps.

---

### 7. Failure Handling

- **Retries:** CRM API backoff; never double-post—use idempotency keys.
- **Fallbacks:** Degrade to rules-only score if LLM unavailable.
- **Validation:** Clamp scores; reject outputs missing required driver citations when policy demands.

---

### 8. Observability

- **Logging:** Score version, tool latencies, block reasons (consent, missing data).
- **Tracing:** Lead update → score → CRM spans.
- **Metrics:** Conversion lift experiments, override rate, cost per scored lead.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Lead Scoring & Qualification Agent**:

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
