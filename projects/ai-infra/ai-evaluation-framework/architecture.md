### 1. System Overview

The framework is a **runner service** plus **artifact store**. Test definitions live in git. Each CI job requests a **suite execution**; workers pull cases, invoke the **system under test** in a sandbox, score outputs, and upload **reports**. A **gate service** compares against baselines and blocks merges on regressions.

---

### 2. Architecture Diagram (text-based)

```
CI / API trigger
        ↓
   Suite scheduler
        ↓
   Case workers (parallel)
     ↓
   SUT sandbox (LLM app + mocks)
        ↓
   Scorers (rules / JSONMatch / LLM-judge)
        ↓
   Report aggregator → artifact store
        ↓
   Gate / PR comment
```

---

### 3. Core Components

- **UI / API Layer:** Suite explorer, flake triage, dataset management with ACL.
- **LLM layer:** SUT and optional judges; isolated credentials per role.
- **Agents (if any):** SUT may be agentic; harness itself is not an open agent by default.
- **Tools / Integrations:** Mock tool servers, vector fixture servers, HTTP wiremock.
- **Memory / RAG:** Frozen corpora snapshots referenced by `corpus_version`.
- **Data sources:** YAML/TS case definitions, golden files, synthetic user profiles.

---

### 4. Data Flow

1. **Input:** Validate suite manifest; lock versions for model, dataset, corpus, and SUT build.
2. **Processing:** Shard cases to workers; execute with per-case timeout and retry policy for infra only.
3. **Tool usage:** Record tool traces; score expected call patterns; attach stdout/stderr artifacts.
4. **Output:** Upload report; compute diff vs baseline branch; post summary to PR.

---

### 5. Agent Interaction (if applicable)

Harness orchestration is **workflow-only**. Multi-agent appears only **inside** SUT or inside scripted adversarial scenarios.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale workers with queue depth; isolate noisy suites to dedicated pools.
- **Caching:** Reuse SUT container layers; cache fixture corpora on workers.
- **Async processing:** Nightly full suites vs PR subset runs.

---

### 7. Failure Handling

- **Retries:** Infra-only retries with jitter; mark case flaky after repeated infra failures.
- **Fallbacks:** Publish partial report with explicit “incomplete suite” banner if quota exceeded.
- **Validation:** Reject manifests referencing unreleased dataset versions.

---

### 8. Observability

- **Logging:** Case-level pass/fail reasons; correlation ids across workers.
- **Tracing:** Trace each SUT invocation; propagate `suite_run_id`.
- **Metrics:** p95 case duration, flake rate, judge disagreement rate, cost per suite.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Evaluation Framework (LLM Testing System)**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
