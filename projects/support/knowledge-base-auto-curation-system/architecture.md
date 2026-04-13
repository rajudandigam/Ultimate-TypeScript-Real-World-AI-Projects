### 1. System Overview

**Resolver webhook** marks KB candidates. **Extraction workflow** pulls ticket thread, strips PII, builds **structured facts**. **Draft workflow** calls LLM with schema. **Review workflow** assigns writers; on approval **publish workflow** pushes to CMS and indexes search.

---

### 2. Architecture Diagram (text-based)

```
Resolved ticket → extract → draft (LLM)
        ↓
Review queue → human approve → publish → search index
```

---

### 3. Core Components

- **UI / API Layer:** Writer console, diff vs ticket, rollback UI.
- **LLM layer:** Draft + headline variants; optional simplification pass.
- **Agents (if any):** Optional later; start workflow-centric.
- **Tools / Integrations:** Helpdesk API, CMS, link checker, scanner for secrets.
- **Memory / RAG:** Existing article embeddings for dedupe suggestions.
- **Data sources:** Tickets, attachments (filtered), product release notes.

---

### 4. Data Flow

1. **Input:** Ticket id + resolution tags; verify permissions.
2. **Processing:** Summarize thread; extract repro steps and error signatures.
3. **Tool usage:** Check for duplicate topics; propose merge target if found.
4. **Output:** Create draft entity; notify reviewers; track SLA timers.

---

### 5. Agent Interaction (if applicable)

Optional conversational editor agent; publishing remains explicit API step.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers per tenant; isolate heavy OCR/image pipelines.
- **Caching:** Embeddings for article corpus per locale/version.
- **Async processing:** Batch nightly digest of candidates to reduce noise.

---

### 7. Failure Handling

- **Retries:** CMS publish retries with idempotency keys.
- **Fallbacks:** If LLM fails, still create skeleton from template fields.
- **Validation:** Block publish if secret scanner flags or link rot over threshold.

---

### 8. Observability

- **Logging:** Stage transitions, rejection codes, token usage per draft.
- **Tracing:** Ticket→draft→publish latency.
- **Metrics:** Deflection delta, time-in-review, duplicate-merge rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Knowledge Base Auto-Curation System**:

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
