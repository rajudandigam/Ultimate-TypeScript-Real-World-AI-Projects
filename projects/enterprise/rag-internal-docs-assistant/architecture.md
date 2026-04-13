### 1. System Overview

The assistant is a **TypeScript backend** plus **Next.js** UI. Ingestion pipelines normalize documents into **chunks with ACL tags** stored in Postgres/OpenSearch. At query time, a **hybrid retriever** returns candidates filtered by the user’s groups, a **reranker** refines ordering, and the **agent** composes an answer that must reference chunk IDs. Eval jobs run in CI against frozen corpora subsets.

---

### 2. Architecture Diagram (text-based)

```
Employee UI (SSO)
        ↓
   Q&A API (authZ context)
        ↓
   Retrieval service (BM25 + vector + filters)
        ↓
   Reranker (cross-encoder or LLM-lite)
        ↓
   Answer Agent (tools: search, fetch, escalate)
        ↓
   Response + citations + telemetry
```

Parallel path:

```
Connectors (Confluence/Git/Drive)
        ↓
   Chunker + ACL tagger
        ↓
   Index stores (Postgres / OpenSearch)
```

---

### 3. Core Components

- **UI / API Layer:** Authenticated chat, admin reindex controls, feedback capture.
- **LLM layer:** Streaming generation with structured citation payload.
- **Agents (if any):** Single answer agent; optional tiny planner as a tool module.
- **Tools / Integrations:** Connector fetchers, search endpoints, ticketing escalation.
- **Memory / RAG:** Chunk index with version metadata; session store for short-term context.
- **Data sources:** Internal wikis, git markdown, PDFs, tickets (policy permitting).

---

### 4. Data Flow

1. **Input:** User question + resolved `principal` + scope preferences.
2. **Processing:** Retrieve top-k with ACL SQL; rerank; assemble context pack under token cap.
3. **Tool usage:** Agent may fetch full page for cited section only; cannot fetch arbitrary URLs outside allowlist.
4. **Output:** Render answer with citations; persist query log and feedback labels for eval loops.

---

### 5. Agent Interaction (if multi-agent)

Default single agent. If split, use **retrieval planner → answerer** with a shared **trace id** and no bypass of ACL filters in either hop.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Separate read APIs from ingestion workers; read replicas for search.
- **Caching:** Query result cache keyed by `(principal_hash, normalized_question, index_version)` with short TTL.
- **Async processing:** Ingestion and reindex as background jobs; near-line updates for high-churn spaces.

---

### 7. Failure Handling

- **Retries:** Connector pagination retries; search shard retries.
- **Fallbacks:** If reranker down, answer with vector-only results and lower confidence banner.
- **Validation:** Post-generation citation check: every claim paragraph maps to ≥1 chunk id.

---

### 8. Observability

- **Logging:** Query/answer metadata, chunk ids, model versions; redact sensitive content.
- **Tracing:** Spans for retrieve, rerank, generate; correlate with eval run ids in CI.
- **Metrics:** nDCG@k offline, online thumbs, abstain rate, ACL deny counts (should be rare and explainable).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **RAG-based Internal Docs Assistant**:

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
