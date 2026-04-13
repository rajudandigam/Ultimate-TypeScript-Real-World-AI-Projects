### 1. System Overview

The packer runs as a **library + worker** model: synchronous **fast path** (truncate, reorder, dedupe) and asynchronous **slow path** (summaries). Policies are **versioned configs** loaded at runtime with OTel instrumentation for each stage.

---

### 2. Architecture Diagram (text-based)

```
Raw context parts
        ↓
   Token accounting
        ↓
   Dedupe + importance scoring (rules / embeddings)
        ↓
   (if over budget) Summarization worker queue
        ↓
   Final packed prompt + dropped manifest
        ↓
   LLM call
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor, simulation against recorded sessions (redacted).
- **LLM layer:** Summarization micro-model calls in workers.
- **Agents (if any):** None required.
- **Tools / Integrations:** Optional embedding service for semantic dedupe.
- **Memory / RAG:** Summary cache by content hash; rolling thread summaries table.
- **Data sources:** Chat history, tool traces, retrieval chunks, pinned system instructions.

---

### 4. Data Flow

1. **Input:** Receive typed context list + route policy + model tokenizer profile.
2. **Processing:** Compute token totals; apply inclusion order; dedupe identical tool outputs.
3. **Tool usage:** If over budget, enqueue summarization jobs or use precomputed rolling summary pointers.
4. **Output:** Produce packed messages array compatible with provider APIs + debug manifest for internal users.

---

### 5. Agent Interaction (if applicable)

Not applicable as conversational multi-agent; summarization is a **batch model call**, not an autonomous agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pool for summarization; stateless packer in app servers.
- **Caching:** Aggressive reuse of summaries for stable historical segments.
- **Async processing:** Precompute summaries on message append for chat products.

---

### 7. Failure Handling

- **Retries:** Summarization retries with smaller windows on timeouts.
- **Fallbacks:** Hard truncation with explicit marker when summarization unavailable.
- **Validation:** Never drop messages tagged `must_keep`; validate final token count before send.

---

### 8. Observability

- **Logging:** Per-stage token deltas; policy version; summarizer model id.
- **Tracing:** Span `context_pack` around LLM parent span.
- **Metrics:** Average reduction ratio, summarization queue lag, downstream task success delta.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Context Window Optimization System**:

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
