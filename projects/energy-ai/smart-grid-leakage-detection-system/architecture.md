### 1. System Overview
**SCADA historian** replication lands in a **lakehouse**. **Workflow orchestrator** schedules district jobs with idempotent keys. **GIS service** maps nodes/edges to street segments for dispatch.

### 2. Architecture Diagram (text-based)
```
SCADA/AMI → lakehouse → balance + anomaly workflows
                    ↓
           ranked leak candidates → CMMS / crew app
```

### 3. Core Components
PI/historian adapters (examples), network graph builder, model registry, mobile proof-capture app, audit log for regulatory inquiries

### 4. Data Flow
Pull interval readings → compute night minimum curves → detect sustained deviation → correlate neighbors → emit candidate edge list with confidence → human ack → valve ops if policy allows

### 5. Agent Interaction
None required; optional analyst LLM summarizes weekly top districts from aggregated metrics JSON

### 6. Scaling Considerations
Millions of meters: partition by DMA; incremental recomputation; preaggregate nightly; burst handling after storms

### 7. Failure Modes
Missing reads after firmware upgrade; DST bugs; GIS mismatch—topology diff alerts, replay jobs from checkpoint

### 8. Observability Considerations
Per-DMA anomaly rate, job backlog, crew confirmation latency, NRW KPI trend, data quality SLO per sensor class


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Smart Grid Leakage Detection System**:

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
