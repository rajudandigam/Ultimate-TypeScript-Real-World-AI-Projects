### 1. System Overview

The **host application** bundles a thin **Copilot SDK** that serializes **AppContext** (route, entity ids, visible schema hash) to a **BFF**. The BFF authenticates the user, attaches **tenant + RBAC claims**, and calls the **Copilot Agent**. The agent returns **validated intents**; the **host dispatcher** applies them through normal product code paths (same as clicking UI).

---

### 2. Architecture Diagram (text-based)

```
Browser (React) + Copilot SDK
        ↓
   Copilot BFF (auth + RBAC)
        ↓
   Copilot Agent (tools = product APIs)
        ↓
   JSON intents → host dispatcher
        ↓
   UI updates + audit log
```

---

### 3. Core Components

- **UI / API Layer:** Copilot panel, intent toast confirmations, audit viewer for admins.
- **LLM layer:** Tool-using agent with strict output schema.
- **Agents (if any):** Single session agent.
- **Tools / Integrations:** Internal GraphQL/REST facades mirroring user permissions.
- **Memory / RAG:** Optional help center index scoped per tenant.
- **Data sources:** Live app context snapshots, product telemetry aggregates (privacy gated).

---

### 4. Data Flow

1. **Input:** User asks a question; SDK attaches minimal context snapshot + `schema_version`.
2. **Processing:** BFF verifies session; agent plans tool calls within budgets.
3. **Tool usage:** Read tools first; write tools require elevated token or explicit user confirm in payload.
4. **Output:** Host validates intents; executes; sends outcome back for follow-up turns.

---

### 5. Agent Interaction (if applicable)

Single agent per session. Optional **offline** “macro recorder” is not a second conversational agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; sticky optional only for WS; shard agent inference by region.
- **Caching:** Short TTL for stable read tools (feature flags, field metadata).
- **Async processing:** Heavy “generate report” intents as async jobs with progress UI.

---

### 7. Failure Handling

- **Retries:** Transient model errors with bounded retries; degrade to suggested links.
- **Fallbacks:** Disable write intents automatically if dependency health checks fail.
- **Validation:** Host rejects unknown intent types and out-of-scope entity ids.

---

### 8. Observability

- **Logging:** Intent acceptance/rejection reasons, tool latency, permission denials.
- **Tracing:** Trace `session_id` / `tenant_id` with PII redaction policies.
- **Metrics:** Task completion funnel, copilot engagement, error rate by route, cost per session.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI In-App Product Copilot**:

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
