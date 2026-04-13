### 1. System Overview

The **planner service** requests candidate legs from **routing providers** and assembles a **route graph**. An **emissions service** attaches **factors per leg** from versioned datasets (RGI, load factors, class of service). The **sustainability agent** reads graph JSON and user weights to produce ranked options and narratives. Results are stored with **methodology_version** for audit.

---

### 2. Architecture Diagram (text-based)

```
User constraints
        ↓
   Route builder (APIs + graph in Postgres)
        ↓
   Emissions calculator (deterministic)
        ↓
   Sustainability Agent (explain + re-rank tools)
        ↓
   Trip artifact + export
```

---

### 3. Core Components

- **UI / API Layer:** Map, sliders, comparison table, methodology disclosure panel.
- **LLM layer:** Explanation agent bound to structured route/emissions JSON.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Rail/bus APIs, flights API, grid intensity datasets.
- **Memory / RAG:** User preference profiles; methodology doc retrieval.
- **Data sources:** Public transport feeds, carrier reported factors (where licensed).

---

### 4. Data Flow

1. **Input:** Parse user trip request and sustainability weights.
2. **Processing:** Build candidate paths; compute emissions per path; prune dominated options in code.
3. **Tool usage:** Agent may request alternate weighting via validated API only (no free-text math).
4. **Output:** Persist chosen trip versions; render uncertainty bands from documented assumptions.

---

### 5. Agent Interaction (if applicable)

Single agent. **Numerical truth** lives in services; agent never overrides calculator output.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless planner API; cache route graphs by `(origin, dest, day)` with TTL.
- **Caching:** Emissions factors by region/month; precomputed popular corridors.
- **Async processing:** Long multi-day overland searches as background jobs with notifications.

---

### 7. Failure Handling

- **Retries:** Routing partial failures return legs with `status=unknown` and exclude from ranking or flag.
- **Fallbacks:** Flight-only baseline path when rail data missing, clearly labeled.
- **Validation:** Reject paths violating max transfers or max walking distance constraints.

---

### 8. Observability

- **Logging:** Provider errors, pruning stats, methodology version per response.
- **Tracing:** Trace `trip_request_id` through routing, emissions, and agent.
- **Metrics:** API success by region, user correction rate, distribution of chosen modes, p95 latency.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Sustainable Travel Route Planner**:

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
