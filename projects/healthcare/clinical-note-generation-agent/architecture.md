### 1. System Overview

**Capture client** streams audio to an **ASR service** with **consent metadata**. **Transcript worker** segments text and stores **encounter session state**. **Note Agent** calls **FHIR read tools** and **template registry** to emit a **versioned draft**. **Provider UI** shows uncertainties; **sign adapter** posts to EHR only through controlled APIs outside the model.

---

### 2. Architecture Diagram (text-based)

```
Mic client → ASR → transcript store
        ↓
Note Agent → SMART FHIR reads
        ↓
Draft store → provider UI → EHR sign API (human)
```

---

### 3. Core Components

- **UI / API Layer:** Web/Electron capture, draft review, org admin for templates.
- **LLM layer:** Tool-using agent with structured note schema + uncertainty flags.
- **Agents (if any):** Single drafting agent in v1.
- **Tools / Integrations:** FHIR read clients, template service, optional internal med spelling lexicon.
- **Memory / RAG:** Session buffer; optional vector index over style guides (non-PHI).
- **Data sources:** ASR streams, EHR FHIR API, clinic macros.

---

### 4. Data Flow

1. **Input:** Start encounter session; attach patient id + scopes after authZ.
2. **Processing:** ASR emits partials → agent updates draft sections incrementally.
3. **Tool usage:** Pull meds/problems when transcript references change; attach as structured facts.
4. **Output:** Draft `vK` saved; provider edits; sign event writes final note via EHR adapter.

---

### 5. Agent Interaction (if applicable)

Single agent. **Signing** is a hard boundary handled by authenticated human action in UI/EHR—not a model tool.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; GPU ASR pools sized separately from LLM tier.
- **Caching:** Template bodies; repeated lexicon tokens for ASR biasing where supported.
- **Async processing:** Long audio offload to batch ASR if interactive latency spikes.

---

### 7. Failure Handling

- **Retries:** ASR reconnect; LLM retries with smaller windows on context overflow.
- **Fallbacks:** If tools fail, produce **questions for provider** instead of guessing.
- **Validation:** Reject drafts that omit mandatory sections for selected template.

---

### 8. Observability

- **Logging:** Draft version transitions, tool error codes, consent ids (not raw audio).
- **Tracing:** End-to-end latency segments: capture → ASR → first token → draft complete.
- **Metrics:** Edit distance samples, uncertain span rate, sign-through rate, PHI redaction pipeline health.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Clinical Note Generation Agent**:

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
