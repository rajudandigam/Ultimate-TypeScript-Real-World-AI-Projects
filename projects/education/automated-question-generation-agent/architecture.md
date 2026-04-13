### 1. System Overview

**Ingest service** stores **source documents** with rights metadata. **Indexer** chunks text with stable **paragraph ids**. **Question Agent** generates **items** referencing paragraph ids. **Validator** checks schema, answer keys, and similarity to bank. **Exporter workflow** builds **QTI** and optionally pushes to LMS.

---

### 2. Architecture Diagram (text-based)

```
Source doc → chunk index → Question Agent
        ↓
Validation + dedupe → review queue → export (QTI/LMS)
```

---

### 3. Core Components

- **UI / API Layer:** Blueprint editor, reviewer UI, version history.
- **LLM layer:** Tool-using or structured-output generation.
- **Agents (if any):** Single agent default; optional checker agent.
- **Tools / Integrations:** Vector dedupe, LMS APIs, OCR pipeline.
- **Memory / RAG:** Course item bank embeddings; exemplar retrieval.
- **Data sources:** Instructor uploads, OER texts (licensed), learning objectives.

---

### 4. Data Flow

1. **Input:** Upload + blueprint JSON (counts, types, tags).
2. **Processing:** Index document; agent generates batch per blueprint slice.
3. **Tool usage:** Dedupe vs bank; validate; attach rationales and citations.
4. **Output:** Persist draft items; notify reviewers; on approval enqueue export job.

---

### 5. Agent Interaction (if applicable)

Single agent per generation job; human publish gate.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch jobs per course; GPU OCR optional pool.
- **Caching:** Paragraph embeddings reused across generation runs until doc changes.
- **Async processing:** Large exports and LMS pushes asynchronous with status polling.

---

### 7. Failure Handling

- **Retries:** Export retries with idempotency keys to LMS.
- **Fallbacks:** If generation fails mid-batch, return partial with explicit missing slots.
- **Validation:** Hard reject items missing citations when policy requires.

---

### 8. Observability

- **Logging:** Generation batches, rejection codes, export outcomes.
- **Tracing:** Upload→items→export spans.
- **Metrics:** Items/hour, review pass rate, psychometric stats post-administration (pipeline).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Automated Question Generation Agent**:

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
