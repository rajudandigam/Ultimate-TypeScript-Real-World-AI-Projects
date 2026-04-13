### 1. System Overview

**Intake service** captures structured answers. **Metadata tools** fetch **service catalog**, **data stores**, and **vendor records**. **PIA Agent** assembles **section JSON** with citations to sources. **Review workflow** routes to privacy counsel; on approval, **document service** renders versioned PDF/DOCX and stores immutable hash.

---

### 2. Architecture Diagram (text-based)

```
Intake → PIA Agent → internal tools (catalog, IAM, vendors)
        ↓
Draft sections → counsel review → signed artifact
```

---

### 3. Core Components

- **UI / API Layer:** Wizard, diff across versions, approval inbox.
- **LLM layer:** Tool-using agent with strict schema per section.
- **Agents (if any):** Single drafting agent; optional security addendum agent.
- **Tools / Integrations:** Backstage/ServiceNow, cloud asset inventory (read-only), HRIS for DPIA roles (scoped).
- **Memory / RAG:** Policy library embeddings; prior assessments (ACL).
- **Data sources:** RoPA tables, DPIA templates, architecture docs.

---

### 4. Data Flow

1. **Input:** Create `assessment_id` with product/feature scope.
2. **Processing:** Agent asks minimal clarifiers; fetches tool facts in parallel where safe.
3. **Tool usage:** Validate vendor names against approved registry; flag unknowns.
4. **Output:** Persist draft version; notify counsel; block “submitted” until signatures.

---

### 5. Agent Interaction (if applicable)

Single primary agent; counsel edits are authoritative and versioned.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; async tool calls with per-tool concurrency caps.
- **Caching:** Catalog snapshots per day for stable drafts.
- **Async processing:** Large IAM/policy attachments parsed in background jobs.

---

### 7. Failure Handling

- **Retries:** Tool backoff; partial draft mode with explicit TODOs.
- **Fallbacks:** If model unavailable, export questionnaire answers only.
- **Validation:** Enforce required sections and max length per section to avoid runaway prose.

---

### 8. Observability

- **Logging:** Tool success/fail, section completion times, redaction counts.
- **Tracing:** Intake→draft spans per assessment.
- **Metrics:** Time-to-approval, reopen count post-launch, counsel override taxonomy.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Privacy Impact Assessment Agent**:

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
