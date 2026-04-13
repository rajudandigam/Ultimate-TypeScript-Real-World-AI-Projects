### 1. System Overview

Requests hit a **policy API** that first runs a **deterministic rules evaluation** service. The **policy agent** consumes engine JSON and optional **retrieved clauses** to produce user-facing explanations and **routing hints**. **Workflows** manage approval chains, escalations, and notifications. All decisions append to an **immutable audit log**.

---

### 2. Architecture Diagram (text-based)

```
Client / TMC webhook
        ↓
   Policy API
        ↓
   Rules engine (OPA/custom) → verdict JSON
        ↓
   Policy Agent (explain + route tools)
        ↓
   Approval workflow
        ↓
   Booking / expense systems
```

---

### 3. Core Components

- **UI / API Layer:** Request forms, approver inbox, admin policy editor with versioning.
- **LLM layer:** Explanation and exception drafting agent (read-mostly tools).
- **Agents (if any):** Single policy agent.
- **Tools / Integrations:** HRIS, TMC, SSO, ticketing for policy questions.
- **Memory / RAG:** Versioned policy index; exception precedents (governed).
- **Data sources:** Canonical policy documents, rate tables, org hierarchy.

---

### 4. Data Flow

1. **Input:** Structured trip parameters + traveler identity claims.
2. **Processing:** Engine evaluates; if violations, agent explains each with `rule_id`.
3. **Tool usage:** Fetch policy text spans; create approval tasks with prefilled context.
4. **Output:** Persist verdict; if approved override, store approver identity and rationale code.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional **batch summarizer** job for weekly policy violation digests (no booking authority).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; scale workflow workers independently; shard by tenant.
- **Caching:** Per-tenant policy embedding/index snapshots invalidated on publish.
- **Async processing:** Bulk re-evaluation when corporate deals change.

---

### 7. Failure Handling

- **Retries:** Transient HR/TMC failures with backoff; fail closed or escalate per tenant config.
- **Fallbacks:** If LLM unavailable, return engine codes with templated human text.
- **Validation:** Reject agent-proposed actions that contradict engine verdict without override record.

---

### 8. Observability

- **Logging:** Verdict codes, policy version, approval outcomes, model latency.
- **Tracing:** Trace `request_id` through engine, agent, and workflows.
- **Metrics:** False allow/escalation rates, mean approval time, policy cache hit rate, override counts by manager level.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Corporate Travel Policy Enforcer**:

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
