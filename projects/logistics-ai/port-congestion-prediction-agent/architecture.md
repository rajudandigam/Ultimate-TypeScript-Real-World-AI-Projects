### 1. System Overview
**Stream ingest** normalizes AIS messages. **Spatial index** assigns vessels to anchorages/berths. **Batch trainer** updates models weekly. **Online scorer** writes risk scores to cache.

### 2. Architecture Diagram (text-based)
```
AIS → spatial index → features → model scores
                         ↓
              port agent → alerts / TMS webhooks
```

### 3. Core Components
AIS deduper, geofence library, terminal connector adapters, model registry, alert deduplication, feedback UI for planners

### 4. Data Flow
Aggregate per port per hour → compute dwell distribution shifts → if anomaly vs baseline → open incident → agent summarizes drivers → notify subscribers

### 5. Agent Interaction
Agent cannot invent vessel counts; must cite SQL aggregates; news RAG optional overlay with lower weight than AIS features

### 6. Scaling Strategy
Global AIS volume requires Kafka partitioning by H3 cell; downsample low-risk areas; preaggregate per port hourly to cut query costs

### 7. Failure Modes
Receiver gaps create false drops in traffic; DST at ports; model stale after canal expansion—data quality flags, auto retrain triggers

### 8. Observability Considerations
Ingest lag, scoring freshness, alert precision in pilot, API spend, user acknowledgement latency


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Port Congestion Prediction Agent**:

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
