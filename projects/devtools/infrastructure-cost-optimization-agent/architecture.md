### 1. System Overview

**Data collectors** pull billing and utilization snapshots into a **metrics warehouse**. **Cost Opt Agent** queries through **read-only tool adapters** and emits **recommendations** stored in **Postgres** with evidence links. **Approval workflow** gates any Terraform/Cloud API mutations executed by separate automation.

---

### 2. Architecture Diagram (text-based)

```
Billing + inventory → warehouse
        ↓
Cost Opt Agent (tools: SQL, cloud APIs)
        ↓
Recommendations → human approval → optional executor
```

---

### 3. Core Components

- **UI / API Layer:** Savings inbox, policy editor, execution audit log.
- **LLM layer:** Tool-using agent; strict JSON schema for recommendations.
- **Agents (if any):** Single agent baseline; optional multi-agent later.
- **Tools / Integrations:** Athena/BigQuery, AWS Resource Groups, GCP Recommender APIs (read), K8s metrics.
- **Memory / RAG:** Org policy retrieval; historical recommendation outcomes.
- **Data sources:** CUR/DBU exports, Prometheus/Mimir, CMDB.

---

### 4. Data Flow

1. **Input:** Scheduled job triggers analysis window (e.g., trailing 30d).
2. **Processing:** Agent runs templated SQL + targeted inventory calls.
3. **Tool usage:** Assemble ranked actions with $ confidence intervals from historical variance.
4. **Output:** Persist recommendations; notify owners via Slack/email with deep links.

---

### 5. Agent Interaction (if applicable)

Single agent; **mutation tools** disabled or behind explicit human token + change window.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard analyses by OU; cache heavy query results per day.
- **Caching:** Common dimension tables; reuse prior day’s aggregates for deltas.
- **Async processing:** Long-running analyses as background jobs with progress webhooks.

---

### 7. Failure Handling

- **Retries:** Cloud API throttling with token buckets per region.
- **Fallbacks:** Partial org results with explicit coverage %; never silent full coverage.
- **Validation:** Schema validation; cap maximum % change suggestions without SLO evidence.

---

### 8. Observability

- **Logging:** Tool error taxonomy, rows scanned, redaction stats.
- **Tracing:** Query spans tagged by `ou_id` (non-PII).
- **Metrics:** Realized savings vs predicted, recommendation acceptance rate, incident correlation post-change.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Infrastructure Cost Optimization Agent**:

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
