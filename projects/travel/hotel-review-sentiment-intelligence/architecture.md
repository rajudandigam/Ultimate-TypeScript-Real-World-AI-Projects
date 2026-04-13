### 1. System Overview

**Connectors** write raw reviews to a **landing bucket** with provenance. **Normalizer** maps fields to a canonical schema. **Chunker** splits long reviews. **Scoring workers** attach sentiment and multi-label topics. **Aggregator** rolls up by property/day/brand. **Optional summarizer** reads aggregates only for narrative digests.

---

### 2. Architecture Diagram (text-based)

```
Scheduled trigger
        ↓
   Ingest connectors → raw store
        ↓
   Normalize + dedupe → Postgres
        ↓
   Score workers (LLM/classical)
        ↓
   Rollups (Timescale/materialized views)
        ↓
   BI API + alerts
```

---

### 3. Core Components

- **UI / API Layer:** Dashboards, threshold config, drill-down to quotes.
- **LLM layer:** Optional labeling/summarization bounded by schema.
- **Agents (if any):** None required; optional analyst agent offline.
- **Tools / Integrations:** Review providers, Slack/email alerts, BI tools.
- **Memory / RAG:** Taxonomy docs for human operators.
- **Data sources:** Licensed review feeds, first-party post-stay surveys (separate pipeline).

---

### 4. Data Flow

1. **Input:** Pull new reviews since cursor per property.
2. **Processing:** Clean language, translate if needed, score, attach confidence.
3. **Tool usage:** N/A for core path; LLM calls are internal pipeline steps with fixed prompts.
4. **Output:** Update rollups; fire alerts if topic sentiment crosses thresholds week-over-week.

---

### 5. Agent Interaction (if applicable)

Not applicable for core system. Optional **Q&A agent** reads **SQL + small quote set** for executive summaries.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by property shard or region.
- **Caching:** Idempotent processing keys per `review_id`; skip unchanged hashes.
- **Async processing:** Backfill jobs separated from incremental hourly syncs.

---

### 7. Failure Handling

- **Retries:** Per-chunk retries; DLQ for repeated failures with payload diagnostics.
- **Fallbacks:** Degrade to star-only aggregates if scoring provider down (flagged).
- **Validation:** Schema validation on model JSON; reject unknown topic IDs.

---

### 8. Observability

- **Logging:** Records processed/sec, error taxonomy, per-connector lag.
- **Tracing:** Trace `pipeline_run_id` across stages.
- **Metrics:** Freshness SLAs, label distribution drift, alert precision (human feedback), cost per million tokens.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Hotel Review Sentiment Intelligence**:

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
