### 1. System Overview

**Feed pollers** fetch sources on schedules, store **raw artifacts** (hash-addressed). **Parser workflow** extracts sections and metadata. **Matcher** scores internal **controls** via embeddings + rules. **Triage workflow** opens tasks with **severity** and **citations**. **Approval workflow** records human decisions to the **control register**.

---

### 2. Architecture Diagram (text-based)

```
Sources → ingest store → parse/chunk
        ↓
Match to controls → impact tickets
        ↓
Human approval → control register version bump
```

---

### 3. Core Components

- **UI / API Layer:** Analyst console, mapping editor, audit export.
- **LLM layer:** Optional structured mapping proposals with citations.
- **Agents (if any):** Optional triage copilot; core remains workflow.
- **Tools / Integrations:** ITSM, e-signature for approvals (optional), licensed reg feeds.
- **Memory / RAG:** Vector index over policies/controls with ACLs.
- **Data sources:** Regulators, industry bodies, internal policy PDFs.

---

### 4. Data Flow

1. **Input:** New artifact ingested; compute content hash; skip duplicates.
2. **Processing:** Segment text; embed sections; retrieve top-k candidate controls.
3. **Tool usage:** Attach canonical URLs + checksums to ticket payload.
4. **Output:** Route to owner queues by domain tags; escalate on deadlines.

---

### 5. Agent Interaction (if applicable)

Optional; mapping changes always versioned with approver identity.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers per jurisdiction; isolate heavy PDF pipelines.
- **Caching:** Negative cache for irrelevant sections; reuse embeddings for unchanged chunks.
- **Async processing:** Nightly reconciliation digest across sources.

---

### 7. Failure Handling

- **Retries:** Fetch retries with respect to publisher limits.
- **Fallbacks:** If parser fails, still store raw file with manual triage flag.
- **Validation:** Reject mappings lacking citation spans; schema-validate ticket payloads.

---

### 8. Observability

- **Logging:** Source ids, parse versions, match scores distribution.
- **Tracing:** Ingest→ticket spans per change record.
- **Metrics:** Time-to-triage, false positive mapping rate, overdue assessments.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Regulatory Change Impact Analyzer**:

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
