### 1. System Overview

The assistant is a **server-side agent** behind a rep-facing UI. The browser sends **intent + entity IDs**; the server hydrates CRM objects, runs retrieval over **allowlisted** corpora, executes the model with tools, and returns **draft artifacts** stored for audit. Sending email happens through existing channels with optional **approval service** hooks.

---

### 2. Architecture Diagram (text-based)

```
Rep UI (Next.js)
        ↓
   Sales API (SSO + scopes)
        ↓
   Sales Agent (LLM + tools)
     ↙     ↓     ↘
CRM read   Playbook RAG   Calendar
        ↓
   Draft + next-action JSON
        ↓
   Approval service (optional) → Gmail/Outlook API / CRM email log
```

---

### 3. Core Components

- **UI / API Layer:** Workspace UI, approval inbox, admin policy console.
- **LLM layer:** Tool loop with budgets; structured output for tasks and email sections.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** CRM REST/GraphQL, internal CMS, calendar, sequencing tools (as permitted).
- **Memory / RAG:** Playbooks, product sheets, win/loss notes (redacted, ACL’d).
- **Data sources:** Opportunities, contacts, emails, call summaries (if integrated).

---

### 4. Data Flow

1. **Input:** Authenticate rep; resolve opportunity and allowed data scope.
2. **Processing:** Fetch CRM snapshot; retrieve top playbook chunks; build prompt with citation requirements.
3. **Tool usage:** Optional calendar checks; write draft activity to CRM as non-customer-visible until approved.
4. **Output:** Return draft + ranked next actions + missing-field checklist for rep.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional compliance pass as separate **synchronous function** (rules + small model) before returning draft to UI.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API tier; queue heavy retrieval jobs per large account.
- **Caching:** Cache static playbook embeddings by `(doc_version, chunk_id)`; short TTL on CRM snapshots per session.
- **Async processing:** Long account research precomputes background briefs for large deals.

---

### 7. Failure Handling

- **Retries:** CRM backoff; user-visible partial results when data incomplete.
- **Fallbacks:** Template-only mode if model or retrieval unavailable.
- **Validation:** Strip disallowed claims; enforce max discount language; block send API calls from model path.

---

### 8. Observability

- **Logging:** Draft ids, tool call success, policy hits; avoid raw customer PII in aggregate logs.
- **Tracing:** Trace retrieval, model, and CRM calls with `opportunity_id` baggage where allowed.
- **Metrics:** Draft acceptance rate, time-to-send, tool error ratio, compliance block counts.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Sales Assistant**:

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
