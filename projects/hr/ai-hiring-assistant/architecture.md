### 1. System Overview

The assistant is a **TypeScript API** behind a **React** hiring UI. Candidate documents never pass through the browser model directly; the server builds a **redacted context pack** per policy, runs the agent, and stores an **audit record** with citations. ATS integrations are **draft-first** writes.

---

### 2. Architecture Diagram (text-based)

```
Recruiter UI (SSO)
        ↓
   Hiring API (authZ + policy)
        ↓
   Hiring Agent (LLM + tools)
     ↙     ↓     ↘
 fetchJob  fetchRubric  draftATSNnote
        ↓
   Review packet store (Postgres)
        ↓
   ATS (draft fields) / export PDF
```

---

### 3. Core Components

- **UI / API Layer:** Role-based UI, consent flows, export controls.
- **LLM layer:** Structured generation with mandatory citations for claims about candidate facts.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** ATS APIs, internal rubric store, scheduling links (optional).
- **Memory / RAG:** Retrieval of competency docs; minimal retention of candidate embeddings (prefer none).
- **Data sources:** Applications, resumes, job postings, internal ladders.

---

### 4. Data Flow

1. **Input:** Recruiter selects candidate + role; system verifies permissions and jurisdiction flags.
2. **Processing:** Fetch docs; normalize text; chunk resumes with offsets for citations.
3. **Tool usage:** Agent may pull rubric updates; writes ATS notes only as drafts pending submit.
4. **Output:** Render structured packet; log model + rubric versions for audits.

---

### 5. Agent Interaction (if multi-agent)

Single agent by default. Optional compliance pass as separate **stateless service** that returns flags without storing candidate text.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; queue heavy OCR/extraction jobs.
- **Caching:** Cache job descriptions and rubrics; never cache cross-candidate merged data.
- **Async processing:** Large PDFs processed asynchronously with webhook completion.

---

### 7. Failure Handling

- **Retries:** ATS retries with idempotency keys on draft creates.
- **Fallbacks:** If model unavailable, fall back to checklist UI without AI narrative.
- **Validation:** Refuse outputs that claim facts without citations; strip inferred protected attributes.

---

### 8. Observability

- **Logging:** Access logs with candidate ids hashed where possible; separate security monitoring.
- **Tracing:** Trace tool calls and model spans per review session.
- **Metrics:** Time-to-first-draft, human edit rate, policy block counts.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Hiring Assistant**:

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
