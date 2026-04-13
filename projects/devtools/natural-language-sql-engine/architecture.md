### 1. System Overview

**API gateway** authenticates and resolves **tenant semantic layer** (allowed tables, metrics). **NL→SQL workflow** calls LLM to produce **AST/SQL**, runs **validator**, optionally **EXPLAIN**, then executes via **read-only role** with **limits**. **SQL→NL** path summarizes approved queries and small aggregated samples.

---

### 2. Architecture Diagram (text-based)

```
NL question → authZ → schema tools → LLM
        ↓
Validator → EXPLAIN/cost gate → warehouse (read-only)
        ↓
Results → NL summary + audit row
```

---

### 3. Core Components

- **UI / API Layer:** Query console, saved questions, admin policy editor.
- **LLM layer:** Generation + optional self-correction on validator errors.
- **Agents (if any):** Optional inner agent loop; outer spine is workflow.
- **Tools / Integrations:** Warehouse SQL APIs, semantic layer service, idP.
- **Memory / RAG:** Glossary index; prior approved query patterns.
- **Data sources:** dbt artifacts, information_schema exports.

---

### 4. Data Flow

1. **Input:** Parse intent; attach user entitlements and default warehouse.
2. **Processing:** Retrieve schema subset; generate candidate SQL/AST.
3. **Tool usage:** Validate; estimate cost; execute with `LIMIT` and timeouts.
4. **Output:** Tabular JSON + chart spec + citations to definitions used.

---

### 5. Agent Interaction (if applicable)

Constrained agent inside validator loop; no tool to disable checks.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; warehouse does heavy lifting.
- **Caching:** Schema snapshots per version; negative cache for bad columns.
- **Async processing:** Large queries as async jobs with polling URLs.

---

### 7. Failure Handling

- **Retries:** Retry generation on validator error up to N; never retry unsafe execution paths.
- **Fallbacks:** Ask clarifying question UI event when ambiguous grain detected.
- **Validation:** Deny multi-statement strings, comments tricks, and out-of-allowlist UDFs.

---

### 8. Observability

- **Logging:** Validator decision codes, execution ms, rows scanned (aggregated).
- **Tracing:** Request span through LLM and warehouse.
- **Metrics:** Block rate, success rate, cost per question, user override rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Natural Language ↔ SQL Engine**:

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
