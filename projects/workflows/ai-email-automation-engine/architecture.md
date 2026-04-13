### 1. System Overview

**Webhook ingress** normalizes provider events into **canonical message records**. **Router workflow** classifies and assigns **SLA timers**. If confidence is low, **agent activity** drafts a response proposal stored as **pending_send**. **Approval step** (human or policy) releases **send worker** which calls provider APIs via **vaulted tokens**.

---

### 2. Architecture Diagram (text-based)

```
Mail provider webhooks
        ↓
   Normalize + dedupe
        ↓
   Router workflow (rules + scores)
        ↓
   [uncertain] → Email Agent (tools: KB, ticket)
        ↓
   DLP scan → approval gate
        ↓
   Outbound send + audit
```

---

### 3. Core Components

- **UI / API Layer:** Review inbox, macro editor, policy admin.
- **LLM layer:** Drafting agent invoked only on routed branches.
- **Agents (if any):** Single primary agent per ambiguous thread.
- **Tools / Integrations:** Graph/Gmail, ticketing, CRM, Slack notifications.
- **Memory / RAG:** Thread summaries; KB index with ACLs.
- **Data sources:** Mailbox content, internal docs, customer entitlements.

---

### 4. Data Flow

1. **Input:** Receive message; thread; attachments metadata.
2. **Processing:** Rules engine assigns labels; if uncertain, call agent with bounded context window.
3. **Tool usage:** Agent may retrieve KB chunks, create internal ticket, never send without approval token.
4. **Output:** Persist draft; notify reviewer; on approve, send and update thread state.

---

### 5. Agent Interaction (if applicable)

Single agent per escalation. Optional **translation** micro-step as deterministic service, not a second chat agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition consumers by mailbox shard; scale agent workers separately.
- **Caching:** KB retrieval caches per tenant; short-lived thread summaries.
- **Async processing:** Attachment text extraction in parallel activities.

---

### 7. Failure Handling

- **Retries:** Provider API retries with jitter; never duplicate send without idempotency key.
- **Fallbacks:** Route to human queue if DLP or model unavailable.
- **Validation:** Block sends missing mandatory disclaimers for regulated content.

---

### 8. Observability

- **Logging:** Classification distribution, approval latency, send failures (codes only).
- **Tracing:** Trace `thread_id` through router, agent, DLP, send.
- **Metrics:** Auto-resolution rate, human edit rate, false positive DLP blocks, webhook lag.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Email Automation Engine**:

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
