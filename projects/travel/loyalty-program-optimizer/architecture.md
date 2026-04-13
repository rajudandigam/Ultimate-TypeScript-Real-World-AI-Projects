### 1. System Overview

**Connectors** ingest balances and transactions into a **normalized ledger**. A **scoring service** computes candidate redemption paths using **versioned valuation tables**. The **optimizer agent** reads scored JSON and answers follow-ups via tools (`recompute`, `fetch_program_rules`). **Notification worker** handles expiries.

---

### 2. Architecture Diagram (text-based)

```
User / imports
        ↓
   Connector layer → normalized balances (Postgres)
        ↓
   Scoring + path finder (TypeScript)
        ↓
   Optimizer Agent (explain + what-if tools)
        ↓
   UI + alerts
```

---

### 3. Core Components

- **UI / API Layer:** Dashboard, assumptions editor, disclaimers.
- **LLM layer:** Thin explanation agent over structured optimizer output.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Partner APIs, CSV parsers, calendar for expiries.
- **Memory / RAG:** Optional FAQ retrieval for program quirks.
- **Data sources:** User-linked accounts, static award charts, bonus calendars.

---

### 4. Data Flow

1. **Input:** User triggers refresh or changes trip goal fields.
2. **Processing:** Fetch balances; build graph of transfer + burn options; score paths.
3. **Tool usage:** Agent may request recomputation with different CPP assumptions only via validated parameters.
4. **Output:** Render ranked list with citations to table versions and fetched balances timestamps.

---

### 5. Agent Interaction (if applicable)

Single agent. Batch jobs recompute nightly without conversational turns.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; queue connector jobs per user.
- **Caching:** Balance snapshots with TTL; immutable valuation table versions.
- **Async processing:** Heavy award-space searches (if added) as background jobs.

---

### 7. Failure Handling

- **Retries:** Per-connector retries; partial results with clear “stale program X” banners.
- **Fallbacks:** Read-only mode if LLM down; numeric results still usable.
- **Validation:** Reject optimizer inputs outside sane bounds (negative CPP, etc.).

---

### 8. Observability

- **Logging:** Connector success/fail, table version used, recomputation reasons.
- **Tracing:** Trace `user_id` refresh jobs end-to-end (PII-minimized).
- **Metrics:** Refresh success rate, time-to-first plan, user override rate, support tickets about wrong balances.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Loyalty Program Optimizer**:

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
