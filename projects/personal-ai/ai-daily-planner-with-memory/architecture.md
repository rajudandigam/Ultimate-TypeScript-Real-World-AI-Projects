### 1. System Overview

A **daily compile workflow** pulls calendar and tasks, builds a **candidate interval graph**, and optionally calls a **planner agent** for patch proposals. Accepted patches update **memory features**. Notifications are scheduled as separate activities with cancellation tokens.

---

### 2. Architecture Diagram (text-based)

```
Calendar / task sync (workflow)
        ↓
   Interval graph builder
        ↓
   Planner Agent (optional NL edits)
        ↓
   Validator (no overlaps, respects pins)
        ↓
   Persist plan + memory updates
        ↓
   Reminder scheduler
```

---

### 3. Core Components

- **UI / API Layer:** Day view, command palette, conflict resolver.
- **LLM layer:** Planner agent emitting structured patches.
- **Agents (if any):** Single planner agent.
- **Tools / Integrations:** Calendar APIs, maps for commute, task systems.
- **Memory / RAG:** Preference store + optional note retrieval.
- **Data sources:** User-authorized calendars/tasks only.

---

### 4. Data Flow

1. **Input:** Sync triggers or user command; load timezone and pinned blocks.
2. **Processing:** Build graph; if NL command, run agent to propose patch set.
3. **Tool usage:** Fetch updated events if needed; validate travel buffers via API.
4. **Output:** Save plan version; enqueue push notifications; update memory if user accepts suggestions.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional future split is **read planner** vs **write executor** services, not chatty multi-agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; compile workers scaled independently; shard by user.
- **Caching:** Cached free-busy summaries with short TTL.
- **Async processing:** Nightly weekly planning as larger compile jobs.

---

### 7. Failure Handling

- **Retries:** Calendar API retries; compile job retries from last checkpoint.
- **Fallbacks:** Read-only calendar mode with banner when write scopes missing.
- **Validation:** Reject patches overlapping pinned events; enforce sleep blocks if configured.

---

### 8. Observability

- **Logging:** Compile durations, patch types, OAuth refresh failures.
- **Tracing:** Trace compile + agent spans per `user_id` (internal).
- **Metrics:** Edit rate after auto-plan, notification dismissal rate, sync error taxonomy.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Daily Planner with Memory**:

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
