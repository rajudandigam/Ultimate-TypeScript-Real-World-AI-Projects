### 1. System Overview

The system exposes a **Forecast API**. A worker layer maintains **feature tables** (seasonality, capacity proxies). The **agent** issues **read-only** queries and supplier pulls, then emits a **structured forecast** validated by schema and numeric sanity checks.

---

### 2. Architecture Diagram (text-based)

```
Forecast request
        ↓
   Feature service (SQL / precomputed)
        ↓
   Live fare snapshot tool (rate-limited)
        ↓
   Forecast Agent (LLM)
        ↓
   Validator (schema + bounds + disclaimer injection)
        ↓
   Client response + audit record
```

---

### 3. Core Components

- **UI / API Layer:** Date pickers, confidence visualization, admin model version controls.
- **LLM layer:** Agent summarizing quantitative results only.
- **Agents (if any):** Single forecasting agent.
- **Tools / Integrations:** Warehouse SQL, fare APIs, holiday feeds.
- **Memory / RAG:** Optional retrieval of airline policy change notes; versioned.
- **Data sources:** Historical prices, searches, events (privacy compliant).

---

### 4. Data Flow

1. **Input:** Parse route/date parameters; choose model profile and horizon policy.
2. **Processing:** Load features; optionally fetch live snapshot; assemble evidence bundle.
3. **Tool usage:** Agent may request additional slices (nearby dates) within budgets.
4. **Output:** Return JSON forecast + store for offline calibration evaluation.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional separate **hotel** sub-agent only if metrics justify split.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; precompute popular routes; queue expensive refreshes.
- **Caching:** Cache forecasts keyed by `(route, dates, cabin, supplier_snapshot_hash)` with short TTL.
- **Async processing:** Batch calibration jobs nightly.

---

### 7. Failure Handling

- **Retries:** Supplier read retries with jitter; degrade to historical-only mode.
- **Fallbacks:** Explicit “insufficient data” with minimum history requirements.
- **Validation:** Reject if live snapshot missing and policy forbids historical-only claims.

---

### 8. Observability

- **Logging:** Model version, feature version, supplier latency; no sensitive traveler identifiers in aggregates.
- **Tracing:** Span per tool call; link to evaluation jobs.
- **Metrics:** Calibration error over rolling windows, API quota usage, cache effectiveness.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Travel Cost Prediction System**:

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
