### 1. System Overview

Clients open a **real-time session** to a **voice gateway** that manages **audio frames**, **VAD**, and **provider routing**. **ASR** streams partial transcripts to an **agent runtime** that may emit **tool calls** and **TTS audio chunks**. A **session state machine** handles **barge-in**, cancelling in-flight synthesis and stale tool results.

---

### 2. Architecture Diagram (text-based)

```
Client audio (WebRTC/ws)
        ↓
   Voice gateway (VAD + routing)
        ↓
   Streaming ASR → partial text
        ↓
   Voice Agent (tools + streaming tokens)
        ↓
   Streaming TTS → audio chunks
        ↓
   Client playback + barge-in events
```

---

### 3. Core Components

- **UI / API Layer:** Client SDK, optional telephony bridge.
- **LLM layer:** Streaming agent with tool execution and cancellation tokens.
- **Agents (if any):** Single conversational agent per session.
- **Tools / Integrations:** CRM, ticketing, calendars, search APIs.
- **Memory / RAG:** Session summary checkpoints; optional KB retrieval.
- **Data sources:** User-authorized backends; ephemeral audio buffers.

---

### 4. Data Flow

1. **Input:** Audio frames arrive; VAD detects speech start/stop; noise suppression optional.
2. **Processing:** ASR emits partials; agent decides clarify vs act; schedules tools with deadlines.
3. **Tool usage:** Tools return structured results; agent speaks concise confirmations.
4. **Output:** TTS streams; on barge-in, cancel playback and reset turn state safely.

---

### 5. Agent Interaction (if applicable)

Single agent for UX coherence. Optional **non-user-facing** router service chooses model tier—still one conversational thread.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless gateways with sticky sessions; autoscale TTS workers.
- **Caching:** Frequent FAQ retrieval caching per tenant (non-sensitive).
- **Async processing:** Post-call summarization async to avoid blocking real-time path.

---

### 7. Failure Handling

- **Retries:** ASR reconnect; LLM fallback model; TTS provider failover.
- **Fallbacks:** Switch to text chat mode if audio path unhealthy.
- **Validation:** Tool schema validation; block transfers without verified customer context policy.

---

### 8. Observability

- **Logging:** Session metadata, tool outcomes, barge-in counts (no raw audio by default).
- **Tracing:** Trace `session_id` across ASR/agent/TTS with redaction.
- **Metrics:** End-to-end latency percentiles, interruption success rate, abandonment funnel, provider SLA breaches.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Real-Time Voice AI Assistant**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
