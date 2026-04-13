### 1. System Overview

The platform uses **OTLP collectors** feeding **stream processors** that normalize attributes, apply **PII scrubbers**, and write to **columnar/trace stores**. **Rollup jobs** compute cost and latency aggregates per `(tenant, route, model, prompt_version)`. Query APIs serve UIs and alerts.

---

### 2. Architecture Diagram (text-based)

```
Services (OTel SDK)
        ↓ OTLP
   Collectors / gateway
        ↓
   Stream processor (enrich + scrub + sample)
        ↓
   Hot store (e.g., ClickHouse) + trace backend
        ↓
   Rollup / budget jobs (scheduled)
        ↓
   Grafana / internal UI + alerting
```

---

### 3. Core Components

- **UI / API Layer:** Explorer UI, admin for schema registry and sampling policies.
- **LLM layer:** Offline summarization workers only.
- **Agents (if any):** None in core pipeline.
- **Tools / Integrations:** Alerting, ticketing, billing correlation jobs.
- **Memory / RAG:** Optional retrieval of incident notes keyed by `service`—not on ingest path.
- **Data sources:** OTLP logs/traces/metrics, cloud cost exports.

---

### 4. Data Flow

1. **Input:** Receive OTLP batch; authenticate tenant; validate size/cardinality limits.
2. **Processing:** Map attributes to canonical keys; scrub secrets; apply sampling; write rows.
3. **Tool usage:** N/A on hot path; scheduled jobs call billing APIs for reconciliation.
4. **Output:** Serve queries; fire alerts when SLO burn or budget thresholds crossed.

---

### 5. Agent Interaction (if applicable)

Not applicable for core ingest. Downstream copilots may read this store via **read-only APIs**.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingest by tenant hash; autoscale processors; separate OLAP query clusters.
- **Caching:** Metadata caches for team ownership maps; precomputed rollups for dashboards.
- **Async processing:** Heavy rollups and exports as batch jobs.

---

### 7. Failure Handling

- **Retries:** Collector retries to services; disk spill to handle bursts.
- **Fallbacks:** Drop low-priority spans under pressure with explicit counters (never silent without metric).
- **Validation:** Reject unknown tenant; quarantine payloads failing schema validation.

---

### 8. Observability

- **Logging:** Collector health, drop reasons, scrubber hit rates.
- **Tracing:** Meta-tracing for collector pipeline itself (dogfooding).
- **Metrics:** Ingest lag, cardinality top-N, cost reconciliation error rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Observability Platform (Tracing + Logs)**:

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
