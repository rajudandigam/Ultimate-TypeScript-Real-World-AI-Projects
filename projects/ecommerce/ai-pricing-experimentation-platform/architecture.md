### 1. System Overview

Merchants define **constraints** and **SKUs** in the console. **Experiment service** stores `ExperimentSpec` versions. **Assignment worker** integrates with storefront or BFF to bucket users/sessions. **Metrics pipeline** aggregates KPIs. **Pricing agent** proposes new specs and interprets results using **read tools** only until approval gates open writes.

---

### 2. Architecture Diagram (text-based)

```
Merchant console
        ↓
   Experiment API (Postgres)
        ↓
   Storefront/BFF (assignment)
        ↓
   Events + orders → analytics warehouse
        ↓
   Pricing Agent (read metrics tools)
        ↓
   Recommendations + optional rollout actions
```

---

### 3. Core Components

- **UI / API Layer:** Experiment wizard, monitoring, rollback controls.
- **LLM layer:** Proposal + narrative agent with schema-bound outputs.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** Splitter SDK, catalog, inventory, warehouse SQL APIs.
- **Memory / RAG:** Prior experiment summaries; policy snippets.
- **Data sources:** Orders, sessions, returns, margin tables.

---

### 4. Data Flow

1. **Input:** Merchant requests candidates for SKU set under constraints.
2. **Processing:** Agent queries historical elasticity proxies (careful methodology); proposes discrete price arms.
3. **Tool usage:** Validate against inventory and MAP rules; create experiment in shadow or live mode per flag.
4. **Output:** Dashboard updates; auto-stop if guardrails trip; post-stop report generated.

---

### 5. Agent Interaction (if applicable)

Single agent. **Stats** computed in warehouse/SQL engine, not by LLM arithmetic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless assignment at edge; async aggregation jobs; shard experiments by shop.
- **Caching:** Precomputed SKU metrics snapshots per day for agent reads.
- **Async processing:** Nightly result rollups; anomaly detection jobs.

---

### 7. Failure Handling

- **Retries:** Warehouse query retries; experiment creation retries with idempotency keys.
- **Fallbacks:** Auto-disable variant traffic on inventory shortfall webhook.
- **Validation:** Reject overlapping experiments; enforce minimum traffic for power.

---

### 8. Observability

- **Logging:** Assignment counts, guardrail triggers, config diffs (no raw customer rows).
- **Tracing:** Trace `experiment_id` through assignment and reporting paths.
- **Metrics:** Uplift CIs, SRM alerts, margin impact, stockout correlation, agent suggestion acceptance rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Pricing Experimentation Platform**:

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
