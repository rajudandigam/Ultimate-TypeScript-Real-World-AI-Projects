### 1. System Overview

**Survey collector** stores **structured preferences** per student. **Matcher service** builds a **constraint graph** and runs a **solver** to propose groups. **Peer Matcher Agent** (optional) helps instructors **iterate** with explanations and small tweaks. **LMS sync workflow** creates groups after approval.

---

### 2. Architecture Diagram (text-based)

```
Survey → prefs table → solver → group proposal
        ↓
Instructor approval → LMS groups API
```

---

### 3. Core Components

- **UI / API Layer:** Student survey, instructor review, swap request inbox.
- **LLM layer:** Optional NL→prefs parser and rationale writer.
- **Agents (if any):** Optional iteration copilot; solver remains source of truth for hard constraints.
- **Tools / Integrations:** LMS roster/groups, optional calendar reads (scoped).
- **Memory / RDB:** Surveys, proposals, approval audit, LMS mapping ids.
- **Data sources:** Course roster, instructor rules, student opt-in fields.

---

### 4. Data Flow

1. **Input:** Close survey window; snapshot prefs immutable version `vK`.
2. **Processing:** Run solver; compute soft-score metrics (skill spread, timezone spread).
3. **Tool usage:** If needed, fetch roster updates for late adds; re-solve delta-minimizing patch.
4. **Output:** Publish proposal; on approve call LMS create with idempotent keys.

---

### 5. Agent Interaction (if applicable)

Agent proposes edits to soft weights or explains unsatisfiable constraints; solver validates feasibility.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch solves per course; large N uses decomposition heuristics.
- **Caching:** Reuse partial solutions for small roster deltas where safe.
- **Async processing:** Heavy solves off request thread with progress webhooks.

---

### 7. Failure Handling

- **Retries:** LMS partial create failures; reconcile with remote state before retry.
- **Fallbacks:** If infeasible, return minimal violating constraints list to instructor.
- **Validation:** Enforce group size bounds before any API write.

---

### 8. Observability

- **Logging:** Solver version, objective values, infeasibility diagnostics (non-PII).
- **Tracing:** Survey close→proposal→LMS spans.
- **Metrics:** Instructor edit distance, student satisfaction, reshuffle counts.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Peer Learning Group Matcher**:

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
