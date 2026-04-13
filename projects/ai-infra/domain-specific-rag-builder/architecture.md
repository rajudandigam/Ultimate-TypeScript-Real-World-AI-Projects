### 1. System Overview

**Control plane** stores pipeline definitions and tenant ACL rules. **Orchestrator** schedules connector syncs and embedding jobs. **Index services** host vector + keyword indices per deployment profile. **Query gateway** authenticates requests, applies filters, merges hybrid results, returns citations with **index_version**.

---

### 2. Architecture Diagram (text-based)

```
Admin UI / API
        ↓
   Pipeline registry (Postgres)
        ↓
   Connector + chunk + embed workflows
        ↓
   Index shards (vector + keyword)
        ↓
   Query gateway → clients (apps/agents)
```

---

### 3. Core Components

- **UI / API Layer:** Connector config, ACL matrix, eval dashboards.
- **LLM layer:** Optional offline mapping/chunk advisors—not query hot path required.
- **Agents (if any):** None in core platform.
- **Tools / Integrations:** S3, Confluence, Git, CRM exports, webhooks.
- **Memory / RAG:** The platform itself is the RAG infra; tenant corpora are data planes.
- **Data sources:** Customer documents with provenance metadata.

---

### 4. Data Flow

1. **Input:** Admin publishes pipeline version vN; triggers backfill job.
2. **Processing:** Fetch docs; normalize; chunk; embed; upsert with doc ACL tags.
3. **Tool usage:** Internal admin tools for reindex, canary split, rollback to vN-1.
4. **Output:** Query API returns chunks + scores + version; clients render answers with grounding.

---

### 5. Agent Interaction (if applicable)

Downstream **answer agents** use this system via API; builder remains workflow-centric.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard indices by tenant; separate ingest from query clusters; autoscale embed workers.
- **Caching:** Query result caches keyed by `(tenant, query_hash, index_version)` with short TTL.
- **Async processing:** Large backfills as batch jobs with progress reporting.

---

### 7. Failure Handling

- **Retries:** Per-stage retries; poison docs quarantined with reason codes.
- **Fallbacks:** Serve stale index with banner if new version unhealthy; rollback switch.
- **Validation:** Schema validation on pipeline specs; deny deploy if eval regression thresholds fail.

---

### 8. Observability

- **Logging:** Job outcomes, connector errors, index build durations (no sensitive doc bodies).
- **Tracing:** Trace `job_id` / `query_id` across ingest and query paths.
- **Metrics:** Ingest lag, QPS, p95 retrieval latency, embed cost, ACL denial counts, eval regression alerts.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Domain-Specific RAG Builder (Plug & Play)**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
