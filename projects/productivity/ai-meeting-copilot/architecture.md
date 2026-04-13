### 1. System Overview

The copilot runs as a **React-embedded** experience backed by a **TypeScript API** that holds OAuth tokens and executes tools. The browser sends **minimal context** (entity IDs, not full payloads) while the server hydrates authorized data. Transcript chunks stream in; the agent emits **structured patches** to a meeting state document consumed by the UI.

---

### 2. Architecture Diagram (text-based)

```
React host app (routes, selection)
        ↓ (context + transcript chunk)
   Copilot API (authZ + tools)
        ↓
   Meeting Agent (LLM)
     ↙   ↓   ↘
 Jira tool  Notion tool  CRM note tool
        ↓
   Meeting state store (Postgres)
        ↓
   Streaming UI updates (SSE / websocket)
```

---

### 3. Core Components

- **UI / API Layer:** Side panel UI, consent modal, server routes for tool execution.
- **LLM layer:** Streaming agent with JSON fragments for decisions/actions.
- **Agents (if any):** Primary meeting agent; optional fast “chunk summarizer” later.
- **Tools / Integrations:** Work trackers, CRM, calendar APIs—server-side only.
- **Memory / RAG:** Prior meetings and project glossary retrieval with ACL.
- **Data sources:** Transcript provider, UI context resolver, user directory for assignee resolution.

---

### 4. Data Flow

1. **Input:** Client sends `meeting_id`, transcript delta, and allowed `context_handles`.
2. **Processing:** Server resolves handles to entities; builds prompt with citations requirement.
3. **Tool usage:** Agent requests creates/updates; server validates permissions and idempotency keys.
4. **Output:** Persist state; stream UI diff; emit “pending human confirm” flags when needed.

---

### 5. Agent Interaction (if multi-agent)

Single user-facing agent. If you split, use a **non-user-facing** redaction pass as a separate service, not a competing conversational agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API instances; sticky sessions only if needed for streaming; Postgres as source of truth.
- **Caching:** Cache entity metadata; avoid caching sensitive transcript text across tenants.
- **Async processing:** Post-meeting full reconcile job for drift correction vs live suggestions.

---

### 7. Failure Handling

- **Retries:** Tool retries with idempotency; transcript gaps logged as explicit unknowns.
- **Fallbacks:** If model down, show raw transcript search UI and queue extraction.
- **Validation:** Block outbound emails or customer-visible writes without confirmation tier.

---

### 8. Observability

- **Logging:** Tool audit trail with actor, meeting, and redacted payloads.
- **Tracing:** End-to-end from transcript arrival to task URL creation.
- **Metrics:** Suggestion acceptance rate, time-to-first-action, consent opt-in rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Meeting Copilot**:

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
