### 1. System Overview

Clients call **Rewriter API** with `(tenant, corpus_id, query, context)`. **Policy engine** selects allowed strategies. **Rewriter agent** emits `RetrievalPlan`. **Validator** checks schema + facet vocab. **Search coordinator** executes plan against **vector + keyword** indices and returns merged hits + debug trace for eval.

---

### 2. Architecture Diagram (text-based)

```
Client query
        ↓
   Rewriter API
        ↓
   Rewriter Agent → RetrievalPlan JSON
        ↓
   Validator (schema + facets)
        ↓
   Hybrid search coordinator
        ↓
   Ranked hits + trace metadata
```

---

### 3. Core Components

- **UI / API Layer:** Playground, A/B flags, admin policy editor.
- **LLM layer:** Small fast model for rewrite; optional larger model behind feature flag.
- **Agents (if any):** Single rewriter agent.
- **Tools / Integrations:** Facet index, synonym tables, optional click log queries.
- **Memory / RAG:** Corpus-specific rewrite packs; negative patterns store.
- **Data sources:** Metadata catalogs, prior eval datasets.

---

### 4. Data Flow

1. **Input:** Accept query; attach session summary hash if allowed.
2. **Processing:** Agent selects strategies; emits subqueries + filters + optional HyDE text.
3. **Tool usage:** Tools return allowed facet values and expansions from curated tables.
4. **Output:** Coordinator runs searches in parallel; merges; attaches `rewrite_trace_id` for observability.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional **ensemble** is multiple deterministic strategies, not multiple chat personas.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless rewriter replicas; separate search pool; cache hot plans.
- **Caching:** Memoize rewrite outputs keyed by `(query_hash, corpus_version, policy_version)`.
- **Async processing:** Offline batch rewrite for eval datasets during development.

---

### 7. Failure Handling

- **Retries:** Retry model once; fallback to baseline rewrite on failure.
- **Fallbacks:** If filters too aggressive and zero hits, auto-widen per policy ladder.
- **Validation:** Reject plans referencing unknown facet values; clamp number of subqueries.

---

### 8. Observability

- **Logging:** Strategy distribution, validation failures, zero-hit correlates (aggregated).
- **Tracing:** Trace `request_id` through rewriter and each subquery execution.
- **Metrics:** Lift metrics from A/B, latency added by rewriter, token usage, injection attempt counters.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **RAG Query Rewriting Engine**:

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
