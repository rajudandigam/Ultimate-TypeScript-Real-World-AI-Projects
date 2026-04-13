### 1. System Overview

**Ingestion pipelines** normalize ERP/WMS/TMS signals into a **planning graph** (sites, SKUs, lanes, capacities). **Daily planning workflow** triggers **forecast refresh**, **inventory projection**, and **routing optimization** jobs. **Multi-agent layer** proposes exceptions and narratives. **Human approvals** gate purchase orders and carrier awards above thresholds.

---

### 2. Architecture Diagram (text-based)

```
ERP/WMS/TMS feeds
        ↓
   Planning data store (Postgres/Timescale)
        ↓
   Planning workflow (Temporal)
        ↓
   Supervisor
 ↙    ↓     ↘
Demand Inventory Routing
 agents   agents   agents
        ↓
   Solver + validators
        ↓
   Approved plan → execution APIs
```

---

### 3. Core Components

- **UI / API Layer:** Planner console, approvals, scenario comparison.
- **LLM layer:** Multi-agent proposals and explanations grounded in KPI JSON.
- **Agents (if any):** Demand, inventory, routing, supervisor.
- **Tools / Integrations:** Solver service, carrier APIs, PO creation, simulation backtest.
- **Memory / RAG:** SOP retrieval; disruption retrospectives.
- **Data sources:** Orders, shipments, inventory snapshots, weather, port congestion feeds (as needed).

---

### 4. Data Flow

1. **Input:** Scheduled tick or event (large order, delay) triggers planning run.
2. **Processing:** Agents read current state tools; propose constrained changes; supervisor merges.
3. **Tool usage:** Solver validates feasibility; routing tools compute costs with live tariffs where available.
4. **Output:** Publish plan version; enqueue actions; monitor execution feedback loop.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves conflicts (e.g., inventory agent vs routing cost), enforces KPI priorities configured by ops leadership.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by region or business unit; autoscale solver workers; separate hot read caches for telemetry.
- **Caching:** Lane cost matrices with TTL; warm-start files for solvers.
- **Async processing:** Long optimizations and simulations as background activities.

---

### 7. Failure Handling

- **Retries:** API retries with jitter; partial plans labeled infeasible with explicit missing inputs.
- **Fallbacks:** Revert to last approved plan on critical failures; notify on-call.
- **Validation:** Hard reject plans violating cold-chain or hazardous materials rules.

---

### 8. Observability

- **Logging:** Plan versions, solver status, approval outcomes, agent tool usage counts.
- **Tracing:** Trace `plan_run_id` across agents, solver, and execution.
- **Metrics:** Service level, inventory turns, expedite spend, forecast error, solver runtime distribution, data freshness SLOs.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Supply Chain Optimization System**:

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
