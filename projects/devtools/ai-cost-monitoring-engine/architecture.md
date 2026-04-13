### 1. System Overview

The engine combines a **streaming/batch ingestion workflow** (OTLP, proxies, invoices) with a **metrics warehouse** for rollups. An **investigation agent** is invoked only from alerts or UI sessions, with tools to query pre-aggregated tables and deployment metadata—never raw unbounded log grep as the default.

---

### 2. Architecture Diagram (text-based)

```
App / Gateway (instrumented)
        ↓ OTLP
   Collector → Queue → Ingest workers
        ↓
   Warehouse (ClickHouse / BQ)
        ↓
   Scheduled rollup jobs (Temporal)
        ↓
   Anomaly detector (rules + stats + optional ML)
        ↓
   Alert router → Slack / PagerDuty
        ↓ (on demand)
   Investigation Agent → SQL / metadata tools → Draft mitigation
        ↓
   Human approval → Policy actions (throttle, kill switch)
```

---

### 3. Core Components

- **UI / API Layer:** Budget admin UI, drill-down explorer, alert acknowledgement APIs.
- **LLM layer:** Investigation agent with capped iterations; separate summarization for exec digests.
- **Agents (if any):** One primary investigation agent; optional policy agent for separation of duties.
- **Tools / Integrations:** Warehouse query, feature flags, deploy systems, ticketing, chat notifications.
- **Memory / RAG:** Optional retrieval of past incident writeups; versioned runbooks.
- **Data sources:** OpenTelemetry spans, provider usage APIs, tagged release events, billing CSVs.

---

### 4. Data Flow

1. **Input:** Spans arrive with `tenant_id`, `route`, `model`, token counts; validate and enrich with deployment version.
2. **Processing:** Stream into raw tables; periodic merge to hourly/daily aggregates keyed by dimensions you care about.
3. **Tool usage:** On anomaly, agent queries top dimensions, compares to baseline window, fetches correlated deploy.
4. **Output:** Structured incident doc with queries embedded; optional automated ticket; optional policy action after approval.

---

### 5. Agent Interaction (if multi-agent)

Default is **workflow + single investigation agent**. Multi-agent is justified when **automated remediation** requires a separate policy reviewer with no shared tool permissions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingest by tenant; separate query nodes from ingest paths.
- **Caching:** Materialized views for hot dashboards; precomputed top-N spenders per hour.
- **Async processing:** All rollups and anomaly scans async; interactive queries isolated to read replicas.

---

### 7. Failure Handling

- **Retries:** Ingest retries with dead-letter for poison messages; checkpointed backfills.
- **Fallbacks:** If agent unavailable, still fire numeric alert with top SQL pre-attached from detector.
- **Validation:** Reject spans missing required attribution fields; quarantine unknown models.

---

### 8. Observability

- **Logging:** Pipeline lag monitors, dedupe stats, schema violation counts.
- **Tracing:** Trace the telemetry pipeline itself; dogfood your own product on the agent’s LLM calls.
- **Metrics:** Cardinality caps, cost of the monitoring stack, alert precision tracking over time.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Cost Monitoring Engine**:

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
