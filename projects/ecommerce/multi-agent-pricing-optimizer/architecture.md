### 1. System Overview

A **supervisor service** orchestrates three agents and a **numeric optimizer**. Agents produce **signals and constraints** (competitor summaries, demand forecasts, strategic weights). The optimizer computes candidate prices checked by **policy validators** before any publish tool executes.

---

### 2. Architecture Diagram (text-based)

```
Scheduler / pricing console
        ↓
   Supervisor (workflow + locks)
        ↓
┌──────────────┐   ┌─────────────────┐   ┌──────────────────┐
│ Competitor   │   │ Demand          │   │ Pricing          │
│ Analyzer     │   │ Predictor       │   │ Strategist       │
│ Agent        │   │ Agent           │   │ Agent            │
└──────┬───────┘   └────────┬────────┘   └────────┬─────────┘
       ↓                    ↓                     ↓
   Market signals      Forecast features    Strategy weights
        └──────────────────┴────────────────────┘
                          ↓
               Constrained optimizer (non-LLM core)
                          ↓
               Validators (MAP, margin, law)
                          ↓
               Publish tools (Shopify, etc.)
```

---

### 3. Core Components

- **UI / API Layer:** Pricing approvals, experiment configuration, audit viewer.
- **LLM layer:** Three specialist agents plus optional summarizer for exec views.
- **Agents (if any):** Competitor analyzer, demand predictor, pricing strategist.
- **Tools / Integrations:** Data warehouse SQL, competitor ingestion, commerce APIs, promo calendar.
- **Memory / RAG:** Retrieved notes on prior campaigns; not a substitute for live inventory reads.
- **Data sources:** Web feeds (compliant), internal transactions, inventory, cost of goods.

---

### 4. Data Flow

1. **Input:** SKU scope + objective (margin vs revenue) + guardrail profile.
2. **Processing:** Fetch competitor and internal features in parallel; agents return structured JSON payloads.
3. **Tool usage:** Optimizer queries validated numbers; dry-run publish returns channel-specific diffs.
4. **Output:** Approved matrix published with monotonic version; subscribers invalidate caches.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Analyzer focuses on external comparables; predictor focuses on historical demand and seasonality; strategist encodes commercial intent (clearance vs premium positioning). **Communication:** all via supervisor state keys (`signals`, `forecast`, `weights`). **Orchestration:** supervisor enforces ordering, retries partial failures, and blocks publish if any agent reports stale data beyond threshold.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard batch jobs by category/region; isolate scraper workers.
- **Caching:** Cache competitor snapshots with TTL; cache expensive warehouse queries.
- **Async processing:** Nightly full repricing plus incremental intraday deltas for hot SKUs.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; partial SKU failures should not block entire batch without policy.
- **Fallbacks:** If agents fail, fall back to last known good prices and alert operators.
- **Validation:** Zero tolerance for MAP violations in automated path; human override requires elevated role + reason code.

---

### 8. Observability

- **Logging:** Structured audit of inputs/outputs per SKU group; separate security log for publish actions.
- **Tracing:** Trace agent loops and optimizer spans with shared `job_id`.
- **Metrics:** Constraint violations prevented, experiment uplift, publish latency, data staleness histograms.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Agent Pricing Optimizer**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres for structured memory; add pgvector only when semantic retrieval is a first-class requirement.
- **Storage layer:** Postgres OLTP, object store (S3/GCS) for artifacts (PDFs, media, large diffs), Redis for ephemeral coordination.
- **Observability layer:** OpenTelemetry traces (LLM + tool spans), metrics on latency/error/cost, structured logs with run IDs.
- **Auth / policy layer:** RBAC + scoped API keys + audit logs on every tool invocation; MCP-style tool manifests if multiple clients consume the same backend.

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
