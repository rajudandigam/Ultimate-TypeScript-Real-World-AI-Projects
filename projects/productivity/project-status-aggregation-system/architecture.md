### 1. System Overview

**Connector workers** pull incremental updates into a **staging lake**. **Normalizer** maps external issues to a **canonical schema**. **Warehouse upsert** maintains current state + history tables. **Report workflow** builds rollups and delivers channels; optional **LLM summarizer** consumes rollups only.

---

### 2. Architecture Diagram (text-based)

```
Trackers/CI → ingest → staging → warehouse
        ↓
Rollup job → metrics tables → dashboards / Slack
```

---

### 3. Core Components

- **UI / API Layer:** Mapping UI, report builder, access control.
- **LLM layer:** Optional summary generator.
- **Agents (if any):** Optional Q&A over warehouse via controlled SQL tool later.
- **Tools / Integrations:** Jira/Linear/GitHub APIs, CI providers, Slack.
- **Memory / RAG:** Warehouse + snapshot tables; optional style guide RAG.
- **Data sources:** Issues, PRs, deployments, incidents (optional).

---

### 4. Data Flow

1. **Input:** Webhook or poll tick with cursor tokens.
2. **Processing:** Validate payload; upsert canonical rows idempotently.
3. **Tool usage:** Compute aggregates per team/initiative/milestone.
4. **Output:** Publish artifacts; notify subscribers if thresholds crossed.

---

### 5. Agent Interaction (if applicable)

Core is workflow-first; optional chat agent is separate product surface.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard connectors by org; async heavy rollups.
- **Caching:** Materialized views for hot dashboards.
- **Async processing:** Nightly deep reconcile to fix drift.

---

### 7. Failure Handling

- **Retries:** Per-connector policies; DLQ with replay tooling.
- **Fallbacks:** Read-only last-good snapshot if ingest paused.
- **Validation:** Reject unknown issue types until mapping exists.

---

### 8. Observability

- **Logging:** Cursor advancement, schema mapping version, row counts.
- **Tracing:** Webhook→warehouse span latency.
- **Metrics:** Data freshness SLO, error rate by connector, report generation duration.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Project Status Aggregation System**:

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
