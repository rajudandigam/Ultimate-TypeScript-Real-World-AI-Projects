### 1. System Overview

The tutor is a **session service** backed by a **curriculum store** and **learner profile store**. Each turn retrieves **allowed** lesson chunks, updates a **mastery estimator** from tool-logged attempts, and streams model output to the client. Progression gates are enforced by **server rules**, not the model.

---

### 2. Architecture Diagram (text-based)

```
Learner UI
        ↓
   Tutor API (auth + course scope)
        ↓
   Curriculum retrieval (ACL + license tags)
        ↓
   Tutoring Agent (LLM + tools)
     ↙     ↓     ↘
fetchLesson logAttempt  getSkillGraph
        ↓
   Pedagogy policy (rules)
        ↓
   Response stream + mastery update event
```

---

### 3. Core Components

- **UI / API Layer:** Lesson player, chat pane, exercise widgets, teacher dashboard (optional).
- **LLM layer:** Streaming agent with tool calls for pedagogy actions.
- **Agents (if any):** Primary tutor agent.
- **Tools / Integrations:** LMS APIs if needed, internal content CMS, code sandbox service.
- **Memory / RAG:** Chunk index over course materials; learner state in relational tables.
- **Data sources:** Licensed texts, instructor-authored items, assessment item bank.

---

### 4. Data Flow

1. **Input:** Authenticate learner; resolve `course_id`, `module_id`, and policy profile.
2. **Processing:** Retrieve grounded chunks; assemble prompt with mastery summary features.
3. **Tool usage:** Log answers to exercises; fetch prerequisites when mastery checks fail server-side.
4. **Output:** Stream explanation; emit structured `next_resource` for UI; persist events for analytics.

---

### 5. Agent Interaction (if applicable)

Single agent for learner-facing flow. Moderation or content generation should be **offline pipelines**, not competing live agents unless product requirements demand it.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless tutor API; separate read-heavy retrieval service; cache hot modules.
- **Caching:** CDN for static assets; edge cache for public course metadata only (no PII).
- **Async processing:** Heavy analytics (learning curves) in warehouse jobs.

---

### 7. Failure Handling

- **Retries:** Transient model errors with fallback model; retrieval retries with alternate index.
- **Fallbacks:** If retrieval empty, switch to “ask instructor” flow with templated message.
- **Validation:** Block progression APIs if server rules not satisfied, regardless of model text.

---

### 8. Observability

- **Logging:** Pedagogy events with hashed learner ids; avoid storing raw chat in untrusted sinks.
- **Tracing:** Trace retrieval + model spans per session turn.
- **Metrics:** Stuck-learner detection signals, hint usage rate, mastery convergence, moderation triggers.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Learning Tutor**:

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
