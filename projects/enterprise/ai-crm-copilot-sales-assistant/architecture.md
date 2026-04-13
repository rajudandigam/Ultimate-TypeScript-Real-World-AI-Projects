### 1. System Overview

Users authenticate via **SSO** into a **CRM Copilot BFF** that holds OAuth tokens to CRM vendors. **Indexer** (optional) syncs notes/transcripts into a **vector store** with **record-level ACLs**. **Copilot Agent** calls **CRM REST tools** and retrieval; **write executor** applies mutations with idempotency keys and audit.

---

### 2. Architecture Diagram (text-based)

```
CRM UI extension / web panel
        ↓
   Copilot BFF (SSO + CRM OAuth)
        ↓
   CRM Copilot Agent
     ↙   ↓   ↘
  fetch  search  draft_actions
        ↓
   Policy + DLP gate
        ↓
   CRM APIs + audit store
```

---

### 3. Core Components

- **UI / API Layer:** Side panel, approval modals for emails/tasks, admin policy console.
- **LLM layer:** Tool-using agent with structured action proposals.
- **Agents (if any):** Single session agent.
- **Tools / Integrations:** Salesforce/HubSpot/etc., email draft provider, calendar.
- **Memory / RAG:** Deal-scoped retrieval index; session summaries.
- **Data sources:** CRM objects, call recordings metadata, uploaded files (governed).

---

### 4. Data Flow

1. **Input:** User selects account; client sends `account_id` + intent.
2. **Processing:** BFF verifies ownership/visibility; loads compact timeline facts.
3. **Tool usage:** Agent retrieves chunks and proposes actions; writes go through policy gate.
4. **Output:** Render suggestions with deep links; persist audit entries for compliance.

---

### 5. Agent Interaction (if applicable)

Single agent. Async **research jobs** can append notes to the same thread state without a second chat persona.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; separate indexing workers; read replicas for search.
- **Caching:** Hot account summaries with short TTL; invalidate on CRM webhooks.
- **Async processing:** Large doc summarization off interactive path.

---

### 7. Failure Handling

- **Retries:** CRM API retries with jitter; circuit breakers per tenant.
- **Fallbacks:** Read-only mode if write scopes revoked mid-session.
- **Validation:** Schema validation on all tool args; reject cross-tenant ids.

---

### 8. Observability

- **Logging:** Action types, policy outcomes, CRM error codes (no email bodies in logs by default).
- **Tracing:** Trace `session_id` / `account_id` with redaction.
- **Metrics:** Suggestion acceptance rate, time-to-first action, API quota usage, DLP block rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI CRM Copilot (Sales Assistant)**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres + pgvector with ACL-aware retrieval + citation payloads.
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
