### 1. System Overview
**EHR** emits CDS Hooks requests. **Context service** assembles FHIR bundles with **minimum necessary** data. **Agent** queries KB tools and returns **cards** (links, suggestions, warnings). **Telemetry** records dismissals and downstream orders.

### 2. Architecture Diagram (text-based)
```
EHR → CDS Hooks → context builder → CDS agent → cards
                         ↓
                 audit store ← clinician actions
```

### 3. Core Components
FHIR facade, terminology service (SNOMED/LOINC as licensed), guideline repository, card renderer, auth (OAuth2), rate limiter, offline fallback rules

### 4. Data Flow
Hook payload → normalize units/time zones → retrieve active problems/meds → run deterministic checks first → agent augments with evidence-linked text → return <200ms target or async card

### 5. Agent Interaction
Tools are read-only except `post_audit_event`; no autonomous orders without explicit human confirmation outside policy

### 6. Scaling Challenges
Large bundles; concurrent hooks per encounter; multi-site KB replication; multilingual guideline gaps

### 7. Failure Handling
KB timeout → return safe generic card with “insufficient evidence”; parse errors → degrade to rules-only path

### 8. Observability Considerations
Hook latency percentiles, card impression/accept rates, KB version per suggestion, error codes from FHIR server, drift in override reasons


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Clinical Decision Support System**:

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
