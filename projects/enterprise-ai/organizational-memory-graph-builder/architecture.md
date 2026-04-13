### 1. System Overview
**Connector plane** lands raw messages/docs in a lakehouse. **Resolver** assigns stable entity IDs. **Graph writer** applies idempotent upserts with provenance payloads.

### 2. Architecture Diagram (text-based)
```
Slack/Docs/Mail → ETL → resolver → graph store
                         ↓
              memory agent → API / copilot clients
```

### 3. Core Components
ACL sync from IdP groups, PII classifier on ingress, graph versioning, incremental index for free-text on nodes, admin “delete my data” jobs

### 4. Data Flow
Ingest batch → extract entities/relations (rules + ML) → score confidence → auto-commit high, queue medium/low → nightly reconcile duplicates → expose read API with authz filters

### 5. Agent Interaction
Every traversal injects `principal` context; subgraph queries capped by hop count and time window

### 6. Scaling Strategy
Partition graph by tenant; async heavy extractions; cache hot neighborhoods; rate limit expensive traversals per user

### 7. Failure Modes
Connector throttling; partial backfills creating dangling edges—compensating transactions, repair sweeps

### 8. Observability Considerations
Ingest lag, resolver disagreement rate, query p95, cache hit ratio for neighborhoods, connector error taxonomy


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Organizational Memory Graph Builder**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres + pgvector with ACL-aware retrieval + citation payloads.
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
