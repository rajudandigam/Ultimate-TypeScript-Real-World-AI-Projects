### 1. System Overview

Clients connect to a **BFF** that resolves **user**, **active trip**, and **locale**. **Session store** holds short-term turns; **trip store** holds canonical facts (UTC, IDs). The **concierge agent** calls tools and updates **summary checkpoints** for long threads. Optional **voice path** streams audio through ASR/TTS adapters.

---

### 2. Architecture Diagram (text-based)

```
Client (chat / voice)
        ↓
   Concierge BFF (auth)
        ↓
   Session + trip stores (Redis/Postgres)
        ↓
   Concierge Agent (tools: bookings, status, KB)
        ↓
   Localized response + UI actions
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, voice client, handoff to human agent desk.
- **LLM layer:** Multilingual agent with structured internal state.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** OTA/airline/hotel APIs, maps, translation glossaries (deterministic where possible).
- **Memory / RAG:** Trip summaries; KB retrieval scoped by product and locale.
- **Data sources:** Booking systems, operational feeds, curated destination content.

---

### 4. Data Flow

1. **Input:** User message + `locale` + `trip_id` binding from auth context.
2. **Processing:** Load trip summary; retrieve KB chunks filtered by destination and topic.
3. **Tool usage:** Fetch live status or policy facts; merge into updated canonical trip JSON.
4. **Output:** Generate localized answer referencing tool timestamps; persist new summary checkpoint.

---

### 5. Agent Interaction (if applicable)

Single agent. Human support receives **structured handoff** JSON, not raw opaque chat only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; sticky sessions or encrypted session cookies; shard Redis by tenant.
- **Caching:** KB chunk caches per `(locale, version)`; booking reads with short TTL.
- **Async processing:** Offline translation QA jobs for content teams.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; user-visible staleness if data old.
- **Fallbacks:** Template responses if model unavailable; offer human handoff.
- **Validation:** Reject tool outputs that fail schema; never merge conflicting flight IDs silently.

---

### 8. Observability

- **Logging:** Turn metadata, tool latency, locale, handoff triggers (redacted content).
- **Tracing:** Trace `session_id` / `trip_id` through BFF and agent.
- **Metrics:** Containment rate by locale, average tools per turn, summary truncation rate, ASR WER (voice mode).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Language Travel Concierge**:

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
