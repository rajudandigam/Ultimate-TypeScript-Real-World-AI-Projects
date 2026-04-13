### 1. System Overview

**Feature service** maintains daily **account feature vectors** in the warehouse. **Journey Agent** runs **controlled SQL/tools** to fetch vectors + recent qualitative signals (tickets). **Explainer** produces narrative tied to numeric drivers. **CRM writer** optional stage applies updates with policy.

---

### 2. Architecture Diagram (text-based)

```
Analyst / CS system → BFF → Journey Agent
        ↓
Warehouse + CRM read tools
        ↓
Risk brief JSON → UI / optional CRM write (gated)
```

---

### 3. Core Components

- **UI / API Layer:** Account brief pages, cohort explorer, model registry UI.
- **LLM layer:** Tool-using agent; structured output schema for scores + drivers.
- **Agents (if any):** Single agent; optional writer split later.
- **Tools / Integrations:** dbt-exposed tables, CRM APIs, ticket search, NPS warehouse.
- **Memory / RAG:** Playbook snippets; prior human edits to briefs as few-shot.
- **Data sources:** Product events, billing, support, surveys.

---

### 4. Data Flow

1. **Input:** Authenticate analyst; resolve account id and entitlements.
2. **Processing:** Pull latest feature snapshot; if missing, compute on demand with caps.
3. **Tool usage:** Fetch top tickets themes via search tool; attach as qualitative layer.
4. **Output:** Render brief; log evidence tables hash for audit.

---

### 5. Agent Interaction (if applicable)

Single agent per request; batch scoring runs offline without LLM if configured.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Precompute features; agent reads narrow tables.
- **Caching:** Per-account brief cache with TTL tied to ETL freshness.
- **Async processing:** Weekly cohort scoring jobs for proactive lists.

---

### 7. Failure Handling

- **Retries:** Query retries with backoff; circuit break warehouse overload.
- **Fallbacks:** Degrade to last-known-good snapshot with staleness banner.
- **Validation:** Schema validate score outputs; clamp to policy min/max tiers.

---

### 8. Observability

- **Logging:** Feature version ids, tool timings, refusal reasons.
- **Tracing:** Brief generation spans tagged by `account_id` (authorized).
- **Metrics:** Override rate, downstream retention impact A/B, query cost per brief.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Customer Journey Intelligence Agent**:

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
