### 1. System Overview

Applications create **candidate records** and store raw files in **object storage**. **Ingest workflow** runs OCR/extraction to **structured_profile JSON**. **Scoring service** computes rubric match vector deterministically or via ML head. **Explainer agent** (optional) narrates matches using **field references**. **Review UI** gates stage transitions.

---

### 2. Architecture Diagram (text-based)

```
Application submit
        ↓
   Ingest workflow
   ↓      ↓       ↓
 store  OCR   extract→validate
        ↓
   Ranker (rules + model)
        ↓
   Explainer agent (optional)
        ↓
   Recruiter review → ATS sync
```

---

### 3. Core Components

- **UI / API Layer:** Candidate profile, rubric coverage heatmap, audit trail.
- **LLM layer:** Extraction + explanation with strict schemas.
- **Agents (if any):** Single agent session per candidate review assist.
- **Tools / Integrations:** ATS APIs, calendar, email templates (non-automated reject where restricted).
- **Memory / RAG:** Job description + rubric retrieval; approved taxonomy docs.
- **Data sources:** Resumes, application answers, referrer notes.

---

### 4. Data Flow

1. **Input:** Upload resume; parse MIME; virus scan; enqueue extraction.
2. **Processing:** Produce structured profile; validate required fields; dedupe against existing profiles.
3. **Tool usage:** Map skills via ontology tool; compute scores; generate explain JSON tied to `field_id`.
4. **Output:** Persist ranking; notify recruiter; await human decision for stage advance.

---

### 5. Agent Interaction (if applicable)

Single assistive agent. **Ranker** remains auditable code/model; agent does not silently change numeric weights.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; worker pool for OCR/LLM; per-tenant queues for noisy spikes.
- **Caching:** Ontology snapshots; embedding caches for job reqs (versioned).
- **Async processing:** Extraction always async; UI polls job status.

---

### 7. Failure Handling

- **Retries:** OCR/LLM retries with caps; human queue on repeated failure.
- **Fallbacks:** Manual data entry path; disable auto-ranking flag per req.
- **Validation:** Reject profiles missing visa/work authorization fields if legally required in your product region.

---

### 8. Observability

- **Logging:** Stage timings, extraction confidence, score version, human override codes.
- **Tracing:** Trace `application_id` through pipeline with PII controls.
- **Metrics:** Time-to-first review, offer rate by source (watch for bias), extraction error rate, cost per candidate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Resume Parsing + Ranking System**:

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
