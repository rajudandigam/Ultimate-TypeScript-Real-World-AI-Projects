### 1. System Overview
**Field gateway** ingests probe rows. **Weather service** provides hourly grids. **Policy service** encodes legal and farm rules. **Agent** emits **controller commands** through an adapter abstraction.

### 2. Architecture Diagram (text-based)
```
Sensors + weather → feature join → irrigation agent
                          ↓
              rules → valve commands → audit log
```

### 3. Core Components
Device registry, calibration UI, simulation sandbox (digital field twin lite), alerting, controller plugins (Vendor A/B)

### 4. Data Flow
Ingest → gap-fill short outages → forecast ET → optimize per zone → validate hard caps → publish schedule version → monitor actual flow meters for drift

### 5. Agent Interaction
Agent cannot exceed district daily cap tool response; conflicts return structured “infeasible” with relax options

### 6. Scaling Strategy
Hundreds of zones: partition by farm; precompute ET grids CDN-cached; edge buffer 24h commands if uplink drops

### 7. Failure Modes
Stuck-open valve detection via flow anomaly; bad GPS geofence assignment; DST boundary bugs—timezone-aware tests, hardware interlocks independent of AI

### 8. Observability Considerations
Water volume delivered vs planned, override reasons, sensor offline %, model disagreement rate, pump runtime stress


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Precision Irrigation Agent**:

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
