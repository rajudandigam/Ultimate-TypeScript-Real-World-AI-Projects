### 1. System Overview
**Scheduler** enqueues digest jobs per channel config. **Fetcher** pages APIs with cursors. **Processor** redacts, chunks, and calls LLM with **frozen prompt version**. **Publisher** posts adaptive cards / messages.

### 2. Architecture Diagram (text-based)
```
Slack/Teams APIs → workflow → redact → summarize
                           ↓
                    post digest + store cursor
```

### 3. Core Components
OAuth token vault, per-tenant job queue, message normalizer, redaction library, schema validator, dead-letter queue for failed posts

### 4. Data Flow
Read since `last_ts` → merge threads → split on token budget → parallel summarize shards → merge into one digest object → single post transaction

### 5. Agent Interaction
No persistent agent; LLM is a stateless step inside workflow with temperature 0 and schema output

### 6. Scaling Challenges
Very large channels need hierarchical summarization; API 429 storms; duplicate installs in enterprise grid

### 7. Failure Handling
Partial fetch → safe resume; LLM invalid JSON → retry with repair prompt once; post failure → exponential backoff

### 8. Observability Considerations
Messages processed per minute, redaction hit rate, digest post success, cost per 1k messages, customer override/disable events


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Slack/Teams Intelligent Summarization System**:

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
