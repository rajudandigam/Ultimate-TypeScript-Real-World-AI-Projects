### 1. System Overview

**OAuth gateway** stores refresh tokens per user with encryption. **Scheduling Agent** orchestrates **free/busy** fetches and **slot scoring**. **Policy engine** enforces org rules. **Invite service** creates drafts or sends events per automation level.

---

### 2. Architecture Diagram (text-based)

```
Client → BFF → Scheduling Agent
        ↓
Calendar APIs (Graph / Google) + policy DB
        ↓
Slot list / draft invite → user confirm
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, confirmation modal, admin policy console.
- **LLM layer:** Tool-using agent for slot search and explanation.
- **Agents (if any):** Single agent per scheduling session.
- **Tools / Integrations:** Microsoft Graph, Google Calendar, directory, HR calendars.
- **Memory / RAG:** Preference store; optional policy doc RAG.
- **Data sources:** Calendars, holidays, room resources (optional).

---

### 4. Data Flow

1. **Input:** Parse participants, duration, constraints from NL + structured form.
2. **Processing:** Parallel free/busy queries; normalize to UTC with attendee zones.
3. **Tool usage:** Score candidates; discard slots violating hard rules.
4. **Output:** Return ranked options; on confirm call write APIs with idempotency.

---

### 5. Agent Interaction (if applicable)

Single agent; human confirmation boundary for sensitive calendars.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; per-tenant token buckets for APIs.
- **Caching:** Free/busy snapshots with short TTL during active negotiation.
- **Async processing:** Large attendee lists resolved in background with progress UI.

---

### 7. Failure Handling

- **Retries:** 429 handling per provider guidelines.
- **Fallbacks:** Offer manual ICS attachment path if API write blocked.
- **Validation:** Attendee email normalization; block external domains per policy.

---

### 8. Observability

- **Logging:** Booking outcomes, policy violations attempted, model version.
- **Tracing:** Request→slots→confirm spans.
- **Metrics:** Time-to-schedule, reschedule rate, API quota headroom.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Smart Calendar Scheduling Agent**:

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
