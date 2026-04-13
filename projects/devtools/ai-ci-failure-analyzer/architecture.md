### 1. System Overview

The analyzer is a **webhook-driven service** that builds a **failure context bundle** (metadata, log excerpts, test artifacts, diff summary), runs a **bounded tool loop** with an LLM, and posts a **versioned diagnosis** linked to the CI run. Historical failures are retrieved from a **search index** keyed by workflow, error signatures, and image identifiers.

---

### 2. Architecture Diagram (text-based)

```
CI provider webhook
        ↓
   Ingest API (verify + dedupe)
        ↓
   Context builder → CI APIs / artifact store / Git
        ↓
   Failure Analyzer Agent (LLM + tools)
     ↙     ↓     ↘
fetchLogs fetchTests searchHistory
        ↓
   Output validator (schema + citation checks)
        ↓
   PR comment / Check run / Ticket body
```

---

### 3. Core Components

- **UI / API Layer:** Webhook receiver, optional dashboard for triage quality.
- **LLM layer:** Single agent with structured diagnosis schema.
- **Agents (if any):** One primary analyzer agent.
- **Tools / Integrations:** CI REST APIs, git host, artifact storage, search index.
- **Memory / RAG:** Embeddings or lexical index over normalized failure records.
- **Data sources:** Logs, JUnit, build traces, workflow definitions, commit metadata.

---

### 4. Data Flow

1. **Input:** Receive failure event; compute idempotency key from `(repo, run_id, job_id, attempt)`.
2. **Processing:** Fetch and normalize logs; extract failing tests; summarize diff hunk metadata.
3. **Tool usage:** Agent requests additional files or historical matches; each response stored as evidence.
4. **Output:** Validate JSON; render comment with deep links to logs and prior incidents.

---

### 5. Agent Interaction (if applicable)

Single-agent design. Optional future split only for **write** proposals (patches) vs **read** diagnosis.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless workers behind a queue; shard by `installation_id`.
- **Caching:** Cache log fetch by artifact ETag; cache embeddings for unchanged error blobs.
- **Async processing:** Large logs processed in background with progressive UI updates.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on CI APIs; cap total fetch time per job.
- **Fallbacks:** If agent fails, post minimal deterministic summary with raw links.
- **Validation:** Reject outputs referencing SHAs or paths not present in bundle.

---

### 8. Observability

- **Logging:** Structured logs per `run_id`; separate security audit for repo access.
- **Tracing:** OpenTelemetry spans per tool call and model completion.
- **Metrics:** Diagnosis latency, tool error ratio, human correction rate, token cost per failure class.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI CI Failure Analyzer**:

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
