### 1. System Overview

**Model registry** stores quantitative planning models with **versioned assumptions**. **Forecast service** recomputes outputs deterministically. **Scenario agent** reads outputs and proposes **validated driver changes** through tools. **Audit log** captures NL requests mapped to structured patches.

---

### 2. Architecture Diagram (text-based)

```
Driver UI + NL input
        ↓
   Scenario BFF (auth + RBAC)
        ↓
   Scenario Agent (tools: query, patch, compare)
        ↓
   Forecast engine → artifacts
        ↓
   Narrative + charts → users
```

---

### 3. Core Components

- **UI / API Layer:** Scenario tree browser, approvals for sensitive drivers, exports.
- **LLM layer:** Translation + explanation agent grounded in model JSON.
- **Agents (if any):** Single agent per workspace session.
- **Tools / Integrations:** Warehouse read APIs, spreadsheet exports, notification webhooks.
- **Memory / RAG:** Methodology docs; prior quarter commentary (ACL).
- **Data sources:** ERP/warehouse aggregates, user assumptions.

---

### 4. Data Flow

1. **Input:** User edits drivers or asks NL question; system resolves active `model_version`.
2. **Processing:** If NL, agent proposes patch; validator checks bounds and dependencies.
3. **Tool usage:** Run forecast; fetch series; compare scenarios; generate diff tables.
4. **Output:** Persist scenario snapshot; render charts; attach narrative with citations to tables.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional **critic** can be a deterministic ruleset (not LLM) for policy violations.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; autoscale forecast workers; cache hot warehouse queries.
- **Caching:** Memoize forecast results by assumption hash; invalidate on driver updates.
- **Async processing:** Long sweeps and Monte Carlo as batch jobs.

---

### 7. Failure Handling

- **Retries:** Warehouse retries; forecast retries with smaller batch if OOM.
- **Fallbacks:** Serve last good scenario with banner if data stale.
- **Validation:** Reject patches that break accounting constraints checked in code.

---

### 8. Observability

- **Logging:** Model versions, patch types, forecast durations, export events.
- **Tracing:** Trace `scenario_id` through patch → forecast → narrative.
- **Metrics:** Close-week traffic, queue latency, human override rate, cost per forecast cycle.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Scenario Planning Engine**:

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
