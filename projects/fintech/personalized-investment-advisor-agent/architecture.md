### 1. System Overview

Users complete **suitability capture** stored in **Postgres**. **Portfolio sync** pulls holdings (read-only). **Quant service** runs simulations and exposures. **Advisor agent** consumes structured outputs and **retrieved docs** to answer questions. **Compliance gate** logs disclosures and blocks restricted intents.

---

### 2. Architecture Diagram (text-based)

```
Client (questionnaire + chat)
        ↓
   Advisory BFF (auth + jurisdiction)
        ↓
   Quant engine (deterministic)
        ↓
   Advisor Agent (tools: holdings, sim, docs)
        ↓
   Compliance log + optional human queue
```

---

### 3. Core Components

- **UI / API Layer:** Disclosures, risk charts, adviser handoff.
- **LLM layer:** Advisory agent with strict citation and numeric grounding rules.
- **Agents (if any):** Single primary agent per session.
- **Tools / Integrations:** Broker APIs, market data, document store, PDF export.
- **Memory / RAG:** Prospectus and research index with ACLs and effective dates.
- **Data sources:** User profile, holdings snapshots, third-party fundamentals (licensed).

---

### 4. Data Flow

1. **Input:** User question plus latest `portfolio_snapshot_id` and `jurisdiction`.
2. **Processing:** Agent decides which tools to call; simulations run with versioned parameters.
3. **Tool usage:** Fetch holdings and doc chunks; never fabricate positions not in snapshot.
4. **Output:** Structured answer + citations + disclaimers; optional ticket to human adviser.

---

### 5. Agent Interaction (if applicable)

Single conversational agent. Optional **headless** batch job generates monthly client letters from templates (not multi-chat).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; async simulation workers; cache snapshots by hash.
- **Caching:** Simulation results keyed by inputs; doc retrieval caches per fund CIK/version.
- **Async processing:** Heavy Monte Carlo off the chat hot path with polling UI.

---

### 7. Failure Handling

- **Retries:** Market data retries; user-visible degradation if snapshot stale.
- **Fallbacks:** Refuse trade-like actions when compliance engine flags session.
- **Validation:** Schema validation on all tool outputs before model consumption.

---

### 8. Observability

- **Logging:** Tool call success, compliance blocks, disclosure acknowledgments (metadata).
- **Tracing:** Trace `session_id` through quant + agent with PII redaction.
- **Metrics:** Question categories, escalation rate, simulation runtime, model cost per user, policy violation attempts (should be ~0).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Personalized Investment Advisor Agent**:

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
