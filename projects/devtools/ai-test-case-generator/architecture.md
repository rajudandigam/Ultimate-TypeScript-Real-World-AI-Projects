### 1. System Overview

Generation jobs are **workflow-orchestrated**: checkout snapshot → build context → model proposes patches → **sandbox compile/test** → iterate or stop. The **agent** is the iterative controller once tools exist; the workflow owns timeouts, quotas, and artifact retention.

---

### 2. Architecture Diagram (text-based)

```
Trigger (ticket / API / IDE)
        ↓
   Generator workflow (queue)
        ↓
   Context assembler (AST + specs + exemplars)
        ↓
   Test Authoring Agent
     ↙     ↓     ↘
readTree  applyPatch  runTests
        ↓
   Patch validator + policy checks
        ↓
   Draft PR / patch artifact store
```

---

### 3. Core Components

- **UI / API Layer:** Job submission, diff viewer, reviewer sign-off.
- **LLM layer:** Agent with structured patch operations and test intent schema.
- **Agents (if any):** Primary authoring agent post–Step 3.
- **Tools / Integrations:** Git, package manager, test runner, coverage exporter.
- **Memory / RAG:** Vector or lexical retrieval of nearby tests and fixtures.
- **Data sources:** Source files, OpenAPI, tickets, historical merged test PRs.

---

### 4. Data Flow

1. **Input:** Validate scope (paths, max files); snapshot commit SHA.
2. **Processing:** Build symbol graph and spec alignment; retrieve exemplar tests.
3. **Tool usage:** Apply patch in ephemeral workspace; run `tsc` + targeted tests; stream errors back.
4. **Output:** Open PR when thresholds met; otherwise fail job with actionable log bundle.

---

### 5. Agent Interaction (if applicable)

Workflow-first with a **single agent** in the loop. Multi-agent only if you isolate **security review** of generated code paths.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Pool of isolated runner workers; job queue per org.
- **Caching:** Dependency layer cache in sandboxes; reuse exemplar retrieval across jobs in same package.
- **Async processing:** Long jobs with heartbeats; partial results saved for resume.

---

### 7. Failure Handling

- **Retries:** Transient git or registry errors; not for deterministic compile failures without a new patch.
- **Fallbacks:** Offer skeleton-only PR if runner unavailable (clearly labeled).
- **Validation:** Reject patches touching generated lockfiles or secrets paths.

---

### 8. Observability

- **Logging:** Per-iteration patch hash, runner exit code, stderr size caps.
- **Tracing:** Trace model calls and runner spans with `job_id`.
- **Metrics:** Iterations-to-green distribution, sandbox OOM rate, merge rate of generated PRs.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Test Case Generator**:

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
