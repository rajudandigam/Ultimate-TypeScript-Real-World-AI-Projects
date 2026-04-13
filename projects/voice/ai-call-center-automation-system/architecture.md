### 1. System Overview

Telephony events enter a **workflow engine** that drives **authentication**, **intent routing**, and **post-call work**. A **voice runtime** bridges **media streams** to **ASR/LLM/TTS**. **Tool gateway** enforces scopes per workflow step. **QA pipeline** samples calls for review and continuous improvement.

---

### 2. Architecture Diagram (text-based)

```
PSTN/SIP → telephony platform
        ↓
   Call workflow (Temporal/Inngest)
        ↓
   Voice runtime (ASR ↔ Agent ↔ TTS)
        ↓
   Tool gateway → CRM / KB / billing (vaulted)
        ↓
   Disposition + QA + analytics
```

---

### 3. Core Components

- **UI / API Layer:** Supervisor console, bot tuning, QA review.
- **LLM layer:** Segment agents constrained by workflow state machine.
- **Agents (if any):** Primary voice agent; optional specialist subgraphs.
- **Tools / Integrations:** Ticketing, order management, scheduling, payment vault adapters.
- **Memory / RAG:** KB retrieval; call summary memory with retention controls.
- **Data sources:** Tenant KB, CRM records (PII gated), telephony metadata.

---

### 4. Data Flow

1. **Input:** Call starts; workflow selects language and authentication path.
2. **Processing:** ASR streams text; agent selects branch; may retrieve KB snippets with ACL checks.
3. **Tool usage:** Reads first; writes require workflow gates + step-up verification events.
4. **Output:** Spoken response; CRM updates; if needed, warm transfer packet to human agent.

---

### 5. Agent Interaction (if applicable)

Workflow is the “supervisor.” Within a step, a single agent reduces incoherence. Optional async **research** worker posts notes to the same conversation state (not a second customer voice).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless voice gateways; workflow workers separate from media-heavy nodes.
- **Caching:** KB chunk caches per tenant; avoid caching user-specific PII responses.
- **Async processing:** Post-call summarization, tagging, and survey outreach.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; user-visible stall handling (“still checking”).
- **Fallbacks:** Transfer to human on low confidence, repeated ASR failures, or compliance triggers.
- **Validation:** Schema validation on CRM writes; idempotency keys on financial actions.

---

### 8. Observability

- **Logging:** Dispositions, tool outcomes, redacted transcripts metadata, verification events.
- **Tracing:** Trace `call_id` across telephony, workflow, and model calls.
- **Metrics:** Containment rate, AHT delta, handoff latency, policy violations (target zero), ASR WER by noise bucket.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Call Center Automation System**:

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
