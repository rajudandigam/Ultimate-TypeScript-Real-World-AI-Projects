### 1. System Overview

Loan applications land in **LOS** or a dedicated **application API**. A **feature pipeline** computes and stores **model inputs** with versioning. **Scorecard service** returns probabilities and reason codes. **Risk agent** composes memos and suggested LOS updates. **Compliance logger** captures prompts/outputs samples for review policies.

---

### 2. Architecture Diagram (text-based)

```
LOS / application intake
        ↓
   Feature pipeline → feature store (Postgres)
        ↓
   Scorecard / model service
        ↓
   Credit Risk Agent (tools: facts, policies, LOS)
        ↓
   Human underwriter review → final decision
```

---

### 3. Core Components

- **UI / API Layer:** Underwriter console, applicant status (non-sensitive), admin model registry.
- **LLM layer:** Memo and letter drafting agent with strict grounding rules.
- **Agents (if any):** Single agent per application session.
- **Tools / Integrations:** Bureau, income verification, fraud, LOS read/write (scoped).
- **Memory / RAG:** Policy manuals and product guides with citations.
- **Data sources:** Application forms, documents, third-party verifications.

---

### 4. Data Flow

1. **Input:** Ingest application package; normalize and validate schema.
2. **Processing:** Compute features; run scorecard; evaluate policy rules engine.
3. **Tool usage:** Agent reads structured results; may fetch additional clarifying facts via approved tools only.
4. **Output:** Draft memo + suggested next steps; human approves; system posts decision to LOS and triggers disclosures.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional future **fraud** sub-agent is isolated with different data access and audit policy.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async document processing workers; model service autoscaling.
- **Caching:** Feature snapshots keyed by `application_id` + `pipeline_version`.
- **Async processing:** Large PDF extraction pipelines decoupled from interactive memo generation.

---

### 7. Failure Handling

- **Retries:** Vendor calls with backoff; partial packages flagged incomplete.
- **Fallbacks:** If LLM unavailable, ship scorecard-only output with static templates.
- **Validation:** Schema validation on LOS writes; dual control for counteroffers above thresholds.

---

### 8. Observability

- **Logging:** Model version, rule hits, tool latency, human override reasons (structured).
- **Tracing:** Trace `application_id` through pipeline with PII controls.
- **Metrics:** Decision turnaround time, auto-STP rate, override rate, memo correction frequency, fairness metrics (where legally/ethically implemented).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Credit Risk Assessment Agent**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
