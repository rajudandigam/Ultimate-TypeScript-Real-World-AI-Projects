### 1. System Overview

**Image ingress** normalizes uploads and extracts **safe derivatives**. **Embedding worker** computes **query vectors**; **search service** runs **hybrid vector + metadata** retrieval with **business rules** (stock, geo, channel). **Visual Search Agent** consumes ranked JSON to produce shopper-facing explanations and follow-up actions.

---

### 2. Architecture Diagram (text-based)

```
Client image → preprocess → embed
        ↓
Hybrid search (vector + filters)
        ↓
Visual Search Agent → policy tools
        ↓
Ranked results + explanations
```

---

### 3. Core Components

- **UI / API Layer:** Upload API, results grid, feedback chips.
- **LLM layer:** Tool-using agent; optional small model for on-device captions later.
- **Agents (if any):** Single agent in v1.
- **Tools / Integrations:** Vector index, catalog API, rules engine, moderation service.
- **Memory / RAG:** Catalog chunks (title/desc/attrs); session prefs store.
- **Data sources:** PIM, DAM renditions, pricing service.

---

### 4. Data Flow

1. **Input:** User supplies image or product seed id.
2. **Processing:** Embed → retrieve top K candidates → apply reranker (learned or heuristic).
3. **Tool usage:** Agent fetches attribute JSON for top N; checks policy flags.
4. **Output:** Render cards + grounded rationale + next-step queries.

---

### 5. Agent Interaction (if applicable)

Single agent. **Purchasing** remains checkout service—not an LLM tool in v1.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; shard index by tenant; async embedding backfill jobs.
- **Caching:** Popular query embeddings; CDN for thumbnails.
- **Async processing:** Bulk re-embed on catalog updates with prioritized queues.

---

### 7. Failure Handling

- **Retries:** Transient vector errors; switch to keyword-only degraded mode.
- **Fallbacks:** If LLM unavailable, return silent results with attribute bullets from templates.
- **Validation:** Reject oversized images; strip EXIF; block non-allowlisted URL fetches.

---

### 8. Observability

- **Logging:** Query ids, candidate sku ids, rule blocks (no PII in prompts where possible).
- **Tracing:** End-to-end path segmented by embed/search/LLM.
- **Metrics:** CTR, conversion lift, zero-hit rate, moderation blocks, index lag per tenant.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Visual Search & Style Matching Engine**:

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
