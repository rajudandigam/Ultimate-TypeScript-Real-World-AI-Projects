### 1. System Overview

**Collector jobs** pull **workflow definitions** and **recent run metadata** into a **warehouse**. **CI Optimization Agent** queries tools to build a **structured plan** (parallelism, caching, splitting). **Publisher** posts PR comments or opens draft PRs per policy.

---

### 2. Architecture Diagram (text-based)

```
CI vendor APIs → timing warehouse
        ↓
Optimization Agent → YAML/log tools
        ↓
Recommendations → PR comment / draft PR
```

---

### 3. Core Components

- **UI / API Layer:** GitHub App settings, allowlisted repos, policy packs.
- **LLM layer:** Tool-using agent with schema-validated outputs.
- **Agents (if any):** Single agent v1.
- **Tools / Integrations:** CI REST APIs, log artifact fetchers (scoped), git.
- **Memory / RAG:** Cookbook embeddings; historical accepted diffs.
- **Data sources:** `*.yml` workflows, build analytics exports.

---

### 4. Data Flow

1. **Input:** Webhook or cron selects repos over SLO breach threshold.
2. **Processing:** Agent loads slowest steps aggregate + current workflow YAML.
3. **Tool usage:** Simulates proposed DAG changes heuristically; checks policy rules.
4. **Output:** Evidence-backed markdown + optional unified diff.

---

### 5. Agent Interaction (if applicable)

Single agent; merge authority remains humans (or separate protected-branch bot).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue analyses; shard by org.
- **Caching:** Step timing aggregates per `(workflow, job, step)` fingerprint.
- **Async processing:** Deep log pulls deferred to background workers.

---

### 7. Failure Handling

- **Retries:** Vendor API 429/5xx with jitter.
- **Fallbacks:** Post timing-only report if YAML fetch blocked.
- **Validation:** YAML lint + org policy engine before any auto-commit.

---

### 8. Observability

- **Logging:** Tool error taxonomy, repos skipped for permissions.
- **Tracing:** Webhook→analysis→post spans.
- **Metrics:** p50/p95 CI duration trend, recommendation merge rate, introduced flake rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **CI/CD Pipeline Optimization Agent**:

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
