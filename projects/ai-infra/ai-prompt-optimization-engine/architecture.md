### 1. System Overview

The engine stores **prompt artifacts** in git or a registry DB. An **optimizer worker** pulls a baseline, runs an **agent loop** that calls a **harness executor**, collects metrics, and emits a **patch proposal PR**. Promotion to production uses **policy gates** (sample size, regression checks, human approval for Tier-0 prompts).

---

### 2. Architecture Diagram (text-based)

```
Prompt registry (git/DB)
        ↓
   Experiment API
        ↓
   Optimizer Agent
     ↙     ↓     ↘
runEval  fetchFailures  proposePatch
        ↓
   Metrics aggregator
        ↓
   PR / promotion ticket → CI gates → deploy flag
```

---

### 3. Core Components

- **UI / API Layer:** Experiment console, reviewer approvals, rollback UI.
- **LLM layer:** Optimizer agent with tool calls capped per experiment.
- **Agents (if any):** Single optimizer; optional critic as separate job.
- **Tools / Integrations:** Harness runner, trace store, git provider, feature flag API.
- **Memory / RAG:** Historical experiment summaries and failure archetypes.
- **Data sources:** Golden datasets, production-sampled traces (redacted, policy-controlled).

---

### 4. Data Flow

1. **Input:** Create experiment with dataset version and constraints.
2. **Processing:** Agent generates candidate patch; validate syntactically; run harness subset.
3. **Tool usage:** Pull failure traces; compute deltas vs baseline; iterate until budget or convergence.
4. **Output:** Open PR with metrics tables; on merge, optional flag service updates prompt version pointer.

---

### 5. Agent Interaction (if applicable)

Single-agent default. Critic, if added, outputs rubric scores only—**merge** uses numeric thresholds, not LLM debate.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Parallel harness shards across workers; queue per tenant.
- **Caching:** Reuse baseline run results when candidate only changes instruction text subset.
- **Async processing:** Long experiments as async jobs with webhooks on completion.

---

### 7. Failure Handling

- **Retries:** Harness flake retries with capped attempts; mark tests flaky after threshold.
- **Fallbacks:** Abort experiment on infrastructure outage; preserve partial metrics.
- **Validation:** Reject patches that widen tool permissions without security label + approval.

---

### 8. Observability

- **Logging:** Experiment id, patch hash, dataset hash, model versions.
- **Tracing:** Trace harness runs as child spans under experiment span.
- **Metrics:** Win rate uplift distributions, cost per experiment, time-to-promotion.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Prompt Optimization Engine**:

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
