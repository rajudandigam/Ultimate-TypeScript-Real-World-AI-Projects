### 1. System Overview

**Fit quiz UI** collects structured inputs. **Sizing service** computes **candidate size scores** from charts, historical returns, and garment attributes. **Fit Agent** fetches tool JSON and produces **user-facing explanations** plus **alternate sizes** with explicit confidence bands.

---

### 2. Architecture Diagram (text-based)

```
Quiz answers → sizing API (ML + rules)
        ↓
Fit Agent → tools: charts, sku attrs, stock
        ↓
Recommendation payload → PDP widget
```

---

### 3. Core Components

- **UI / API Layer:** PDP widget, admin chart mapping console.
- **LLM layer:** Tool-using agent; strict schema for outputs.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** PIM size charts, OMS stock, analytics warehouse summaries.
- **Memory / RAG:** Parsed chart chunks in vector store for rare brands.
- **Data sources:** Return warehouse, clickstream (aggregated), merchant CSVs.

---

### 4. Data Flow

1. **Input:** `sku_id` + quiz answers + locale.
2. **Processing:** Sizing API returns scored candidates with feature attributions.
3. **Tool usage:** Agent pulls chart rows and stock counts for top candidates.
4. **Output:** JSON consumed by UI renderer + analytics beacon.

---

### 5. Agent Interaction (if applicable)

Single agent. **Checkout size selection** remains explicit user action.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; precompute popular sku score caches.
- **Caching:** Parsed charts by `(brand, season)` version keys.
- **Async processing:** Batch retrain calibration nightly; warm caches on deploy.

---

### 7. Failure Handling

- **Retries:** ML inference retries; fall back to chart-only mode.
- **Fallbacks:** If LLM unavailable, show numeric scores with static copy templates.
- **Validation:** Reject recommendations where stock tool disagrees; reconcile before display.

---

### 8. Observability

- **Logging:** Decision codes, chart versions, model versions.
- **Tracing:** Quiz → scoring → LLM → render timings.
- **Metrics:** Return rate by cohort, OOS suggestion rate, user override rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Size & Fit Recommendation Agent**:

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
