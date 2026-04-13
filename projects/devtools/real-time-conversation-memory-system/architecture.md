### 1. System Overview

**Ingest gateway** accepts authenticated **audio/text frames** and writes append-only **segment records**. **Transcription workflow** emits text segments. **Chunker workflow** splits on speaker/time boundaries, runs **redaction**, and enqueues **embedding jobs**. **Query API** serves hybrid retrieval to downstream agents.

---

### 2. Architecture Diagram (text-based)

```
Realtime client → ingest → segment log
        ↓
ASR / text normalize → chunk + redact → embed
        ↓
Vector index → memory.search API → agents / UI
```

---

### 3. Core Components

- **UI / API Layer:** Session viewer, privacy controls, export/delete tools.
- **LLM layer:** Optional rolling summarizer worker.
- **Agents (if any):** Downstream product agents consume memory API; not required here.
- **Tools / Integrations:** ASR provider, KMS, object storage for optional raw audio.
- **Memory / RAG:** pgvector / managed vector + metadata store in Postgres.
- **Data sources:** Chat WS, telephony streams, IDE pair-programming logs (policy scoped).

---

### 4. Data Flow

1. **Input:** Frame arrives with `session_id`, sequence, content type.
2. **Processing:** Buffer until utterance boundary; transcribe if audio.
3. **Tool usage:** Classify PII; quarantine high-risk segments for human review if configured.
4. **Output:** Upsert vectors; expose consistent read after `chunk_committed` event.

---

### 5. Agent Interaction (if applicable)

Memory layer is **not** an autonomous agent by default; optional curator is offline/batch.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by `tenant_id`; dedicated ASR pools.
- **Caching:** Hot session vectors in Redis for ultra-low latency reads (short TTL).
- **Async processing:** Embedding backlog with priority lanes for premium tenants.

---

### 7. Failure Handling

- **Retries:** ASR retries with jitter; dead-letter toxic segments with diagnostics.
- **Fallbacks:** Degrade to keyword-only search if vector index unhealthy.
- **Validation:** Reject cross-session writes without matching auth token.

---

### 8. Observability

- **Logging:** Throughput, chunk sizes, redaction decisions (codes only).
- **Tracing:** End-to-end frame→searchable latency.
- **Metrics:** Index lag, DSAR SLA, search p95, per-tenant storage growth.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Real-Time Conversation Memory System**:

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
