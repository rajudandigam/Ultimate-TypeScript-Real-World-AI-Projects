### 1. System Overview

The generator is a **Plan Service** backed by a **syllabus graph** in Postgres. Learner events update **mastery features**. The agent emits **validated patches** to the active plan version. Instructors approve major deviations via workflow tasks where required.

---

### 2. Architecture Diagram (text-based)

```
Learner profile + goals
        ↓
   Plan API
        ↓
   Syllabus graph loader
        ↓
   Path Agent (tools: mastery, module meta)
        ↓
   DAG validator (server)
        ↓
   Plan version N+1 → LMS sync job
```

---

### 3. Core Components

- **UI / API Layer:** Learner roadmap UI, instructor approval console.
- **LLM layer:** Planning agent with structured patch output.
- **Agents (if any):** Single path agent by default.
- **Tools / Integrations:** LMS, assessment stores, calendar constraints.
- **Memory / RAG:** Retrieved exemplar paths and rubric snippets.
- **Data sources:** Canonical curriculum, cohort benchmarks (aggregated).

---

### 4. Data Flow

1. **Input:** Authenticate learner; load active plan and policy profile.
2. **Processing:** Compute mastery deltas; agent proposes patch with cited evidence ids.
3. **Tool usage:** Fetch module metadata; validate prerequisites; optionally create LMS tasks.
4. **Output:** Persist new plan version; enqueue notifications; log diff summary.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional evaluator is a **separate offline job**, not a second live conversational agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async LMS sync workers; cache syllabus graphs.
- **Caching:** Read-heavy module metadata caching; invalidate on curriculum publish events.
- **Async processing:** Batch recomputation for large cohorts nightly.

---

### 7. Failure Handling

- **Retries:** LMS API retries with idempotency keys.
- **Fallbacks:** Keep last good plan if patch invalid; show instructor queue.
- **Validation:** Reject cyclic graphs; enforce max weekly load constraints.

---

### 8. Observability

- **Logging:** Plan version transitions, patch types, tool failures.
- **Tracing:** Trace plan generation spans per `learner_id` (hashed in logs if needed).
- **Metrics:** Completion rates by plan version, override rate, replan frequency.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Personalized Learning Path Generator**:

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
