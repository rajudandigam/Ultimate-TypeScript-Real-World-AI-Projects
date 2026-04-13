### 1. System Overview

Email to Task is a **queue-backed ingestion pipeline**. Each message becomes a **workflow instance** with typed stages: normalize MIME, classify intent, extract structured fields, dedupe against existing tasks, then call **Notion/Jira APIs**. LLMs sit inside **specific stages** with schemas—not as a free chat endpoint.

---

### 2. Architecture Diagram (text-based)

```
Inbound email (webhook / poll)
        ↓
   Ingress API (verify signature)
        ↓
   Workflow engine (Temporal / BullMQ)
   ├─ Parse + normalize
   ├─ Rules engine (fast path)
   ├─ LLM extract (structured JSON)
   ├─ Dedupe search → Notion/Jira query tools
   └─ Create/update task tools
        ↓
   Audit store (Postgres)
        ↓
   Optional: Notify Slack / email ack
```

---

### 3. Core Components

- **UI / API Layer:** Webhook receiver, operator UI for low-confidence queue, admin config for routing rules.
- **LLM Layer:** Schema-constrained extraction prompts versioned per tenant.
- **Agents (if any):** None required; optional bounded “clarification” micro-loop later.
- **Tools / Integrations:** Notion and Jira clients, duplicate search, optional CRM lookup.
- **Memory / RAG:** Thread-level cache; optional embeddings for semantic dedupe against task titles.
- **Data sources:** Raw MIME, headers (`Message-Id`, `In-Reply-To`), attachment metadata.

---

### 4. Data Flow

1. **Input:** Authenticate inbound source; persist raw payload reference; compute `idempotency_key` from `Message-Id` + destination.
2. **Processing:** Run rules; if ambiguous, call LLM extraction with truncated thread; compute confidence score.
3. **Tool usage:** Search for open tasks with similar fingerprint; create or update; link `source_message_id` in description fields.
4. **Output:** Task URL written back to audit log; optional webhook to customer systems.

---

### 5. Agent Interaction (if multi-agent)

Not multi-agent by default. If you add an “agent,” keep it **inside** the extraction step with a fixed tool budget and the workflow owning final commits to external systems.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition queues by tenant; scale workers independently of webhook receivers.
- **Caching:** Cache Notion database schemas and Jira project metadata; cache LLM results keyed by content hash for duplicate forwards.
- **Async processing:** All heavy steps async; webhook returns fast acknowledgment.

---

### 7. Failure Handling

- **Retries:** Transient 5xx from SaaS APIs; not for 4xx validation errors without fix.
- **Fallbacks:** Route to human triage queue with pre-filled draft; never infinite LLM loops.
- **Validation:** JSON schema; business rules (due date in future, assignee must exist); PII redaction pass before tool calls.

---

### 8. Observability

- **Logging:** Structured logs per `workflow_run_id`, step timings, tool status codes.
- **Tracing:** Trace LLM and outbound API spans; propagate tenant id.
- **Metrics:** End-to-end lag, extraction confidence, duplicate prevented count, DLQ depth.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Email to Task Workflow**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
