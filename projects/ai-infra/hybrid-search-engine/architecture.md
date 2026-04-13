### 1. System Overview

**Ingest workflows** normalize documents into chunks with **ACL tags** and **metadata facets**. **Dual writers** update **keyword** and **vector** indices with the same `chunk_id`. **Query service** fans out searches, **fuses** results, optionally calls **reranker**, returns hits with **score breakdown** and **index_version**.

---

### 2. Architecture Diagram (text-based)

```
Ingest pipeline
   ↙        ↘
keyword   vector
 index      index
        ↓
   Query API (parallel search)
        ↓
   Fusion (RRF / weighted)
        ↓
   Optional reranker
        ↓
   Client hits + debug trace
```

---

### 3. Core Components

- **UI / API Layer:** Admin console, relevance playground, canary controls.
- **LLM layer:** Optional rerank cross-encoder (could be non-LLM model).
- **Agents (if any):** None in core retrieval path.
- **Tools / Integrations:** Embeddings provider, object storage, CI eval harness.
- **Memory / RAG:** Fusion configs; feedback store for offline tuning.
- **Data sources:** Tenant documents and metadata catalogs.

---

### 4. Data Flow

1. **Input:** Client sends query + optional filters + `corpus_id`.
2. **Processing:** Dispatch BM25 and ANN queries with same filter semantics.
3. **Tool usage:** Internal admin operations for reindex, segment swap, rollback via workflow APIs.
4. **Output:** Return ranked list with stable `chunk_id` ordering for pagination.

---

### 5. Agent Interaction (if applicable)

Optional upstream query rewriter is separate service; not part of hybrid engine core.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless query nodes; shard indices; separate hot read replicas; GPU pool for rerank.
- **Caching:** Popular query caches; precomputed popular facets.
- **Async processing:** Full rebuilds vs incremental updates with consumer lag metrics.

---

### 7. Failure Handling

- **Retries:** Per-shard retries; partial results flagged if one backend unhealthy.
- **Fallbacks:** Keyword-only if vector degraded; tighten k automatically.
- **Validation:** Reject queries exceeding complexity budgets; enforce ACL on every hit re-fetch.

---

### 8. Observability

- **Logging:** Stage timings, fusion mode, rerank batch sizes (no sensitive hit text by default).
- **Tracing:** Trace `query_id` across backends with sampling.
- **Metrics:** QPS, p95 latency per stage, error rates, zero-hit rate, nDCG from periodic eval jobs, index lag.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Hybrid Search Engine (Vector + Keyword)**:

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
