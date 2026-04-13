### 1. System Overview

**Event pipeline** ingests reads, dwell time, follows, hides. **Feature store** computes user and item features. **Candidate generator** pulls recent articles from **search index** respecting publisher contracts. **Mixer** applies diversity and business rules. **Personalization agent** optionally generates **explanations** and proposes **mixer knob** adjustments within server-enforced bounds.

---

### 2. Architecture Diagram (text-based)

```
Client events → stream
        ↓
   Feature store (Postgres/OLAP)
        ↓
   Candidate retrieval (OpenSearch)
        ↓
   Mixer + ranker
        ↓
   Optional explanation agent
        ↓
   Feed response + “why” metadata
```

---

### 3. Core Components

- **UI / API Layer:** Reader app, feedback controls, publisher tools.
- **LLM layer:** Explanation/query understanding agent (optional per request).
- **Agents (if any):** Single agent for interactive “why” and discovery chat.
- **Tools / Integrations:** Search, subscription entitlements, notification push.
- **Memory / RAG:** User interest graph; article metadata index; editorial collections.
- **Data sources:** Licensed content feeds, first-party reporting, user behavior (consented).

---

### 4. Data Flow

1. **Input:** Request feed page; attach user context and locale.
2. **Processing:** Retrieve candidates; apply mixer; compute final ordering.
3. **Tool usage:** If user asks “why”, agent fetches allowed explanation fields from metadata tools only.
4. **Output:** Return cards with canonical URLs; log impression events for training/eval.

---

### 5. Agent Interaction (if applicable)

Single agent for explanations; **ranking numbers** come from ranker service, not LLM arithmetic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless feed API; cache personalized segments; precompute “cold start” defaults.
- **Caching:** Popular article embeddings; per-user small profile caches with TTL.
- **Async processing:** Offline training jobs for rankers; nightly editorial bundle updates.

---

### 7. Failure Handling

- **Retries:** Search retries; degrade to editor-curated list if personalization unhealthy.
- **Fallbacks:** Disable explanations if model provider down.
- **Validation:** Enforce publisher allowlist on every item in response payload.

---

### 8. Observability

- **Logging:** Impression/click pipelines, mixer knob distributions, explanation request rate.
- **Tracing:** Trace `feed_request_id` through retrieval and rank stages.
- **Metrics:** CTR, dwell time, unsubscribes, diversity metrics, latency percentiles, cost per active reader.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI News Personalization Engine**:

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
