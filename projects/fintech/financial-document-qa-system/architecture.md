### 1. System Overview

Filings land in **object storage**; **ETL** chunks text and extracts tables into **structured stores**. **Q&A BFF** authenticates users and scopes corpora. **Document QA Agent** calls retrieval and numeric tools; **answer validator** checks citation presence for numeric claims.

---

### 2. Architecture Diagram (text-based)

```
Filing ingest → chunk + table ETL
        ↓
   Vector + metadata index
        ↓
   Q&A BFF (ACL)
        ↓
   Document QA Agent (tools: search, table, compute)
        ↓
   Response + citations + audit
```

---

### 3. Core Components

- **UI / API Layer:** Question console, export, admin ingestion status.
- **LLM layer:** Tool-using agent with strict citation schema.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Search, table store, ratio engine, diff across periods.
- **Memory / RAG:** Filing index; optional saved prompts (governed).
- **Data sources:** SEC filings, internal decks (permissioned).

---

### 4. Data Flow

1. **Input:** User selects document set and asks question.
2. **Processing:** Retrieve top chunks; fetch relevant tables; compute derived metrics server-side if needed.
3. **Tool usage:** Agent assembles answer JSON with `citation_ref[]`; validator rejects missing citations for numbers.
4. **Output:** Render markdown/HTML with deep links to stored page images or HTML anchors.

---

### 5. Agent Interaction (if applicable)

Single agent. **Extraction** is an offline pipeline, not a second chat agent in v1.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; shard index by ticker/time; async re-embed on new filings.
- **Caching:** Query result cache keyed by `(corpus_version, question_hash)`.
- **Async processing:** Heavy ingestion and table parsing off interactive path.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; degrade to “partial evidence” responses.
- **Fallbacks:** Keyword-only retrieval if vector index unhealthy.
- **Validation:** Schema validation on responses; clamp extreme computed ratios with flags.

---

### 8. Observability

- **Logging:** Tool hit rates, citation coverage, ingestion lag per ticker.
- **Tracing:** Trace `request_id` through retrieval and tools (PII redaction).
- **Metrics:** p95 latency, cost per question, human correction rate on pilot labels.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Financial Document Q&A System**:

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
