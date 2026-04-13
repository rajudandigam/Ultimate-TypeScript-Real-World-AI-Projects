### 1. System Overview

The assistant is a **BFF service** holding OAuth tokens in a **vault**. The client talks to BFF; BFF calls providers and models. **Memory service** stores encrypted chunks with per-user keys. **Tool gateway** enforces scopes and produces **audit events** for every mutation path.

---

### 2. Architecture Diagram (text-based)

```
Client (web/mobile)
        ↓
   Personal AI BFF
        ↓
   Life Assistant Agent
     ↙    ↓    ↘
calendar tasks  email_draft
        ↓
   Memory service (encrypted retrieval)
        ↓
   User-visible response + pending confirmations
```

---

### 3. Core Components

- **UI / API Layer:** Consent screens, connector management, confirmation modals.
- **LLM layer:** Agent with structured action proposals.
- **Agents (if any):** Primary assistant; optional isolated executor for writes.
- **Tools / Integrations:** Calendar, mail, task systems via OAuth.
- **Memory / RAG:** Encrypted note index; preference tables.
- **Data sources:** User-authorized accounts only.

---

### 4. Data Flow

1. **Input:** Authenticate user; load scopes; attach session policy (read vs write).
2. **Processing:** Agent plans; for writes, create `pending_action` records awaiting confirm.
3. **Tool usage:** Execute only after user confirmation token; store audit with hashes.
4. **Output:** Return updated plan and links to created artifacts.

---

### 5. Agent Interaction (if applicable)

Single user-facing agent. Optional **executor** service is not conversational—it applies approved actions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; per-user sharding for hot memory partitions.
- **Caching:** Short TTL for read-only calendar snapshots; never cross-user cache.
- **Async processing:** Heavy imports (email backfill) as background jobs.

---

### 7. Failure Handling

- **Retries:** Provider retries with backoff; surface partial failures clearly.
- **Fallbacks:** Read-only mode if vault or token unhealthy.
- **Validation:** Schema validation on actions; recipient allowlists for email sends.

---

### 8. Observability

- **Logging:** Action types, success/fail, no raw message bodies by default.
- **Tracing:** Trace connector calls; correlate with `user_id` internally only.
- **Metrics:** Confirmation latency, revoke events, connector error taxonomy.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Personal AI Life Assistant**:

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
