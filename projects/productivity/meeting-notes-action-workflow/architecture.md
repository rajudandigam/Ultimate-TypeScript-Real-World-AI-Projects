### 1. System Overview

Transcripts enter a **workflow engine** that executes typed steps with retries. LLM calls are **side-effect free** until a validation gate passes. External mutations happen only through **server-owned** integration clients with OAuth tokens.

---

### 2. Architecture Diagram (text-based)

```
Transcript source (webhook / upload)
        ↓
   Normalize + segment
        ↓
   Workflow engine
   ├─ Rules (fast path)
   ├─ LLM extract (schema)
   ├─ Dedupe search → Notion/Jira
   └─ Create/update tasks
        ↓
   Audit DB (Postgres)
        ↓
   Notifications (Slack/email)
```

---

### 3. Core Components

- **UI / API Layer:** Ingest API, operator approval UI, replay tools for support.
- **LLM layer:** Versioned prompts producing structured action lists.
- **Agents (if any):** None required; optional micro-agent for Q&A only.
- **Tools / Integrations:** Notion/Jira, directory lookup, duplicate search.
- **Memory / RAG:** Optional embeddings for dedupe; short TTL cache of recent tasks.
- **Data sources:** Transcripts, calendar metadata, team routing config.

---

### 4. Data Flow

1. **Input:** Authenticate source; persist transcript reference; compute `meeting_id` + chunk hashes.
2. **Processing:** Rules extract obvious actions; LLM fills gaps; validate people and dates against tools.
3. **Tool usage:** Search duplicates; create tasks with idempotency keys; attach transcript excerpt citations.
4. **Output:** Emit summary record with links; notify stakeholders.

---

### 5. Agent Interaction (if applicable)

Not multi-agent. Optional interactive agent must still route writes through the same **workflow commit** API.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition queues by tenant; scale workers independently.
- **Caching:** Cache Notion DB metadata; cache directory lookups briefly.
- **Async processing:** Large meetings processed in chunks with checkpointing.

---

### 7. Failure Handling

- **Retries:** Transient API errors; not for schema validation failures without human fix.
- **Fallbacks:** Route to manual triage queue with pre-filled draft tasks.
- **Validation:** JSON schema; business rules (due dates, assignee existence); redaction pass.

---

### 8. Observability

- **Logging:** `workflow_run_id`, step timings, connector status codes.
- **Tracing:** Trace LLM and outbound API spans with tenant id.
- **Metrics:** End-to-end lag, auto-create vs human-queue ratio, duplicate prevented count.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Meeting Notes → Action Workflow**:

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
