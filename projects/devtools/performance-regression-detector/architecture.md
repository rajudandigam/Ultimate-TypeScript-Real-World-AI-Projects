### 1. System Overview

**Artifact ingester** stores benchmark JSON and metadata. **Normalizer** maps names to canonical scenarios. **Baseline service** maintains rolling windows per branch class (main vs PR). **Regression workflow** runs statistical tests, optionally triggers **bisect** child workflows, and posts results to GitHub Checks.

---

### 2. Architecture Diagram (text-based)

```
CI metrics → warehouse → compare workflow
        ↓
Decision + PR annotation
        ↘ bisect workflow (optional)
```

---

### 3. Core Components

- **UI / API Layer:** Dashboard for historical trends, flake management UI.
- **LLM layer:** Optional weekly digest generator.
- **Agents (if any):** Optional bisect planner later.
- **Tools / Integrations:** GitHub Checks API, tracing backends, bundle analyzers.
- **Memory / RAG:** Metric warehouse; PR metadata index.
- **Data sources:** k6 outputs, LHCI, microbench harnesses, OTel exports.

---

### 4. Data Flow

1. **Input:** CI posts metrics bundle after scenario run completes.
2. **Processing:** Join with baseline window; compute deltas and p-values / robust estimators.
3. **Tool usage:** Fetch related PR files for attribution suggestions; not for numeric truth.
4. **Output:** Pass/fail signal + structured JSON attachment for humans.

---

### 5. Agent Interaction (if applicable)

Not required in v1; keep decisioning deterministic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers for bisect; shard warehouse by service.
- **Caching:** Precomputed aggregates per hour for dashboards.
- **Async processing:** Deep comparisons deferred to avoid blocking small PR checks.

---

### 7. Failure Handling

- **Retries:** Upload retries; do not duplicate check runs—use idempotency keys.
- **Fallbacks:** If warehouse unavailable, store raw artifact to object storage and mark “delayed decision.”
- **Validation:** Reject malformed metric names; enforce unit dimensions.

---

### 8. Observability

- **Logging:** Decision reasons with versioned policy pack id.
- **Tracing:** Ingest→compare spans; bisect depth metrics.
- **Metrics:** False positive/negative sampling results, CI minutes spent on bisect.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Performance Regression Detector**:

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
