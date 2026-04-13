### 1. System Overview

The assistant is a **session service** with a **policy engine** selecting max hint depth. Each turn calls the model with **structured output**, then optionally runs **sandbox tools** to validate claims. Instructors configure **allowed corpora** and **exam lockdown** windows.

---

### 2. Architecture Diagram (text-based)

```
Student UI
        ↓
   Tutor API (auth + course policy)
        ↓
   Homework Agent
     ↙     ↓     ↘
sandbox  rubric  similarity
        ↓
   Response stream + integrity tags
        ↓
   Audit store (policy-compliant)
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, equation editor, instructor dashboards.
- **LLM layer:** Streaming agent with step schema.
- **Agents (if any):** Primary tutor agent.
- **Tools / Integrations:** Sandboxed code/math engines, LMS read-only links.
- **Memory / RAG:** Instructor-approved snippets only.
- **Data sources:** Problem banks, rubrics, attempt logs (aggregated).

---

### 4. Data Flow

1. **Input:** Student submits attempt + context; system loads `policy_profile`.
2. **Processing:** Model proposes next step; validate schema; run sandbox if STEM path.
3. **Tool usage:** Similarity check vs solution bank; block if too close to forbidden reveal threshold.
4. **Output:** Stream to client; log metadata for instructor review queues.

---

### 5. Agent Interaction (if applicable)

Single agent. Moderation can be a **separate synchronous function** before model call.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; isolate sandbox workers on separate nodes.
- **Caching:** Cache expensive static computations per problem hash.
- **Async processing:** Heavy similarity scans async for non-interactive modes.

---

### 7. Failure Handling

- **Retries:** Model retries on schema failure with repair prompt (capped).
- **Fallbacks:** If sandbox down, switch to conceptual-only mode with banner.
- **Validation:** Hard reject outputs that include direct final answers when disallowed.

---

### 8. Observability

- **Logging:** Hint level distribution, policy hits, sandbox failures.
- **Tracing:** Trace each tool invocation under `session_id`.
- **Metrics:** Integrity violation attempts, session completion rate, human review backlog.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Homework Assistant with Reasoning**:

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
