### 1. System Overview

**Upload gateway** virus-scans and stores **originals** in object storage. **OCR/layout workflow** produces **reading order text** with coordinates. **Extractor** runs rules + models to emit **clause candidates**. **QC workflow** routes low-confidence items to reviewers. **Publisher** writes canonical records and updates search indices.

---

### 2. Architecture Diagram (text-based)

```
Documents → OCR/layout → clause candidates
        ↓
QC UI / auto-accept (high confidence)
        ↓
Canonical clause DB → search / APIs
```

---

### 3. Core Components

- **UI / API Layer:** QC station, ontology editor, redaction tools.
- **LLM layer:** Optional span labeler with bounding box citations.
- **Agents (if any):** Optional later; not required for v1 correctness path.
- **Tools / Integrations:** CLM/DMS webhooks, e-sign completion events.
- **Memory / RAG:** Taxonomy docs; few-shot libraries per customer template family.
- **Data sources:** PDF/DOCX contracts, order forms, DPAs.

---

### 4. Data Flow

1. **Input:** `document_id` lands with tenant + privilege tags.
2. **Processing:** Parse pages; run classifiers; assemble structured JSON per schema.
3. **Tool usage:** Cross-check party names against CRM record if allowed.
4. **Output:** Upsert clauses; emit `document.parsed` event for downstream systems.

---

### 5. Agent Interaction (if applicable)

Optional copilot for reviewers; publishing remains explicit save action.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pools per stage; GPU OCR pools optional.
- **Caching:** Reuse OCR for unchanged pages via content hashes.
- **Async processing:** Large deals split into page-range jobs with checkpoints.

---

### 7. Failure Handling

- **Retries:** Transient OCR failures per page range.
- **Fallbacks:** Mark document `needs_manual` with reason codes.
- **Validation:** JSON schema validation; reject impossible date ranges.

---

### 8. Observability

- **Logging:** Stage timings, confidence buckets, QC throughput.
- **Tracing:** Upload→publish latency per document.
- **Metrics:** Auto-accept rate, attorney override rate, defect escapes post-publish.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Contract Clause Extraction System**:

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
