### 1. System Overview

**Scheduler** kicks nightly **forecast runs**. **ETL** ensures marts are fresh. **Forecasting Agent** queries **CRM + warehouse** tools and writes **scenario JSON** + narrative. **Artifact service** stores board pack versions with **hashes** for audit.

---

### 2. Architecture Diagram (text-based)

```
dbt marts → warehouse
        ↓
Forecasting Agent → CRM/SQL tools
        ↓
Scenario snapshot → Slack/email + BI embed
```

---

### 3. Core Components

- **UI / API Layer:** Assumption editor, approval for exec distribution, drill-down explorer.
- **LLM layer:** Tool-using agent; structured outputs for scenarios + drivers.
- **Agents (if any):** Single agent per run; optional finance copilot later.
- **Tools / Integrations:** Snowflake/BigQuery, Salesforce/HubSpot, attribution tables.
- **Memory / RDB:** `forecast_run` tables with immutable inputs snapshot.
- **Data sources:** Opportunities, activities, campaigns, historical closes.

---

### 4. Data Flow

1. **Input:** Trigger with `as_of` timestamp and segment definitions.
2. **Processing:** Pull pipeline snapshot; compute coverage ratios and velocity metrics.
3. **Tool usage:** Assemble best/base/worst scenarios with explicit assumption knobs.
4. **Output:** Persist artifacts; notify subscribers; optional write-back to CRM notes (policy).

---

### 5. Agent Interaction (if applicable)

Single agent; numbers always traceable to query ids stored alongside narrative.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async run workers; isolate heavy tenants.
- **Caching:** Precomputed cubes for common segment cuts.
- **Async processing:** Monte Carlo or simulations in worker tier if added.

---

### 7. Failure Handling

- **Retries:** Query retries with backoff; partial failure marks scenario incomplete.
- **Fallbacks:** Prior run remains “current” with banner if new run fails validation.
- **Validation:** Cross-check totals vs CRM UI exports on sample deals in CI for regressions.

---

### 8. Observability

- **Logging:** Run duration, rows scanned, model version, validation pass/fail.
- **Tracing:** ETL freshness → agent → artifact spans.
- **Metrics:** Forecast error vs actuals by segment, adoption of scenarios in meetings.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Sales Forecasting Intelligence System**:

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
