### 1. System Overview

**Ingest webhook** accepts applications into **object storage** + metadata row. **Parse workflow** extracts structured fields. **Score workflow** applies **rubric vN** and writes **rank artifacts**. **ATS sync workflow** moves candidates to review stages per policy.

---

### 2. Architecture Diagram (text-based)

```
Apply → store file → parse → feature row
        ↓
Score + explain → ranked queue → recruiter UI
        ↘ optional LLM normalize (validated)
```

---

### 3. Core Components

- **UI / API Layer:** Ranked inbox, override reasons, audit export.
- **LLM layer:** Optional normalization microservice with strict schemas.
- **Agents (if any):** Not required for v1 ranking spine.
- **Tools / Integrations:** ATS APIs, parser workers, HRIS for req metadata.
- **Memory / RDB:** Applicant features, rubric versions, bias metric snapshots.
- **Data sources:** Resumes, job reqs, knockout questions.

---

### 4. Data Flow

1. **Input:** Application id lands; virus scan; PII classification.
2. **Processing:** Parse → canonical skills → compute rubric subscores.
3. **Tool usage:** Optional LLM maps synonyms; post-validate against taxonomy.
4. **Output:** Persist rank + explanation JSON; notify recruiter pool.

---

### 5. Agent Interaction (if applicable)

Optional small LLM steps; hiring decisions remain human/system policy outside model.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by `req_id`; burst handling during job posts.
- **Caching:** JD embeddings per req version for similarity features.
- **Async processing:** Heavy OCR off interactive path.

---

### 7. Failure Handling

- **Retries:** Parser retries with alternate engine flag; quarantine unparseable files.
- **Fallbacks:** If LLM down, use deterministic synonym tables only.
- **Validation:** Reject scores if required fields missing; block export without rubric version.

---

### 8. Observability

- **Logging:** Parse durations, score distributions, demographic parity monitors (aggregated).
- **Tracing:** Apply→rank spans per candidate.
- **Metrics:** Time-to-first-screen, override rate, offer rate by score decile (governed access).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Resume Screening & Ranking System**:

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
