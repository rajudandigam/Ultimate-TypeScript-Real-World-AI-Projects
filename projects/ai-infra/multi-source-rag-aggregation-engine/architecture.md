### 1. System Overview

The engine exposes a **Fusion API**. It fans out parallel queries to **connectors**, normalizes results into `Hit` records, runs **dedupe** and **cross-source alignment**, applies **reranking**, and returns an **EvidencePack**. An optional **agent** coordinates additional retrieval rounds within budgets.

---

### 2. Architecture Diagram (text-based)

```
User query + principal
        ↓
   Fusion orchestrator
   ├─ Connector A (wiki)
   ├─ Connector B (tickets)
   └─ Connector C (SQL facts)
        ↓
   Normalize + dedupe + align
        ↓
   Reranker (cross-encoder / LLM-lite)
        ↓
   Optional: Agent refine loop (tools: fetch, compare)
        ↓
   EvidencePack JSON → LLM app
```

---

### 3. Core Components

- **UI / API Layer:** Admin for source weights, budgets, and connector credentials rotation.
- **LLM layer:** Optional orchestrator agent for iterative retrieval.
- **Agents (if any):** Single fusion agent when enabled.
- **Tools / Integrations:** Multiple search backends, object storage for blobs, SQL with RLS.
- **Memory / RAG:** Indexes per source; fusion scratch state ephemeral.
- **Data sources:** Wikis, tickets, git, structured tables—each with freshness metadata.

---

### 4. Data Flow

1. **Input:** Authenticate; resolve enabled sources and max tokens/bytes.
2. **Processing:** Parallel queries with deadlines; merge hits; detect duplicates and conflicts.
3. **Tool usage:** Agent may request additional doc fetches; each response appended with ids.
4. **Output:** Produce pack with ranking scores, conflict list, per-source staleness notes.

---

### 5. Agent Interaction (if applicable)

Single orchestrator agent optional. If multi-source specialists exist, they return **Hit lists only**; fusion remains deterministic code + reranker.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless orchestrator; connector pools scaled independently; cache popular queries with strict TTL.
- **Caching:** Per-source ETag-aware caching; avoid cross-tenant cache pollution.
- **Async processing:** Large packs built asynchronously for batch jobs.

---

### 7. Failure Handling

- **Retries:** Per connector; partial pack with explicit `missing_sources[]` on failures.
- **Fallbacks:** Reduce to highest-trust source set if others unhealthy.
- **Validation:** Reject packs exceeding byte limits; validate every chunk has `source_id`.

---

### 8. Observability

- **Logging:** Query id, per-source latency, hit counts, reranker outcomes.
- **Tracing:** Span per connector and per rerank; propagate `fusion_id`.
- **Metrics:** Conflict rate, truncation rate, ACL deny counts, user thumbs downstream.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Source RAG Aggregation Engine**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
