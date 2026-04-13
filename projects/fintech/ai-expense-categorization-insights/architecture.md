### 1. System Overview

Ingestion and classification run as a **batch workflow** with deterministic stages. A **classification agent** handles only rows that fail rules or fall below confidence thresholds. A separate **insights job** summarizes aggregates and flags anomalies using the same evidence tables—no ad hoc spreadsheet exports as the source of truth.

---

### 2. Architecture Diagram (text-based)

```
Card / bank feed / receipt OCR
        ↓
   Ingest workflow (validate, normalize)
        ↓
   Rules engine + merchant dictionary
        ↓ (low confidence)
   Classification Agent + policy RAG
        ↓
   Human review queue (optional)
        ↓
   Accounting export adapter (idempotent)
        ↓
   Insights agent (scheduled) → email / UI digest
```

---

### 3. Core Components

- **UI / API Layer:** Employee submission UI, accountant review console, webhook ingestion.
- **LLM layer:** Structured classification; insight narratives from SQL summaries + retrieved policy clauses.
- **Agents (if any):** One classification agent path; optional insights agent with read-only tools.
- **Tools / Integrations:** Merchant enrichment, FX, accounting APIs, internal budget APIs.
- **Memory / RAG:** Policy document index versioned per tenant; correction history as structured features.
- **Data sources:** Transactions, receipts, chart of accounts, department metadata.

---

### 4. Data Flow

1. **Input:** Normalize each transaction to a canonical schema; compute `ingest_id`.
2. **Processing:** Rules assign labels or mark `needs_model`; attach user/org context features.
3. **Tool usage:** Agent fetches policy snippets and similar past transactions; returns structured label + citations.
4. **Output:** Persist proposed posting; route to export or review; insights job reads aggregates only.

---

### 5. Agent Interaction (if multi-agent)

Not required initially. If added, keep **one writer** to the ledger proposal table; other roles are read-only advisors.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workflows by tenant and month; autoscale workers on queue depth.
- **Caching:** Cache merchant metadata; cache policy embeddings by `(doc_version, chunk_id)`.
- **Async processing:** Month-end as chunked parallel jobs with checkpoints.

---

### 7. Failure Handling

- **Retries:** Transient API errors with backoff; poison messages to DLQ with reason codes.
- **Fallbacks:** If agent unavailable, escalate to human queue with rule-based best guess flagged.
- **Validation:** Chart-of-accounts foreign keys, currency checks, duplicate transaction detection.

---

### 8. Observability

- **Logging:** Per-row decision lineage without logging full PAN; tokenize sensitive fields.
- **Tracing:** Trace ingest → classify → export as one chain per batch id.
- **Metrics:** Auto-accept rate, human override rate, export success latency, anomaly precision.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Expense Categorization + Insights**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
