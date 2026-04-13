### 1. System Overview

**Ingest API** accepts analyzer JSON artifacts tagged by **repo** and **commit**. **Normalizer** maps paths to stable module keys. **Aggregator** writes time-series points and computes **week-over-week deltas**. **Notification workflow** emits digests when thresholds breach.

---

### 2. Architecture Diagram (text-based)

```
CI → artifact store → normalize → metrics DB
        ↓
Scheduled workflow → aggregates → alerts / UI
```

---

### 3. Core Components

- **UI / API Layer:** Explorer UI, team filters, export to CSV.
- **LLM layer:** Optional digest generator (aggregates only).
- **Agents (if any):** None in v1.
- **Tools / Integrations:** GitHub/GitLab APIs for churn; CODEOWNERS parser.
- **Memory / RAG:** Metric warehouse; optional ADR index for context links.
- **Data sources:** ESLint, ts-morph summaries, madge graphs, git log.

---

### 4. Data Flow

1. **Input:** Post-merge CI uploads bundle with tool versions pinned.
2. **Processing:** Parse, validate schema, upsert rows idempotently.
3. **Tool usage:** Join ownership; compute top regressions vs baseline window.
4. **Output:** Persist snapshot; enqueue notifications if policy matches.

---

### 5. Agent Interaction (if applicable)

Not required for core metrics path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by `org_id`; async workers per repo.
- **Caching:** Per-commit derived aggregates; invalidate on re-ingest.
- **Async processing:** Large repos analyzed in chunked path batches.

---

### 7. Failure Handling

- **Retries:** Transient DB writes with idempotency keys.
- **Fallbacks:** Skip LLM digest if unavailable; numeric tables still ship.
- **Validation:** Reject bundles with mismatched commit SHA vs webhook context.

---

### 8. Observability

- **Logging:** Rows ingested, parse errors, tool versions.
- **Tracing:** Ingest→normalize→aggregate spans.
- **Metrics:** Freshness lag per repo, digest open-rate (if tracked), false alert rate from human feedback.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Codebase Complexity Analyzer**:

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
