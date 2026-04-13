### 1. System Overview

**Scheduler** enqueues **fetch tasks** partitioned by domain. **Fetcher workers** retrieve pages or call APIs, storing raw payloads to **object storage** when needed. **Parser registry** selects versioned extractors to emit **normalized events**. **Alert workflow** compares against rules and notifies subscribers.

---

### 2. Architecture Diagram (text-based)

```
Scheduler → fetch workers → raw store (optional)
        ↓
Parser registry → normalized events → time-series DB
        ↓
Alert workflow → Slack/email → optional LLM digest
```

---

### 3. Core Components

- **UI / API Layer:** Watchlist CRUD, extractor editor with preview, incident inbox.
- **LLM layer:** Optional summarization service fed only structured diffs.
- **Agents (if any):** None required in v1.
- **Tools / Integrations:** PIM, MAP policy service, ticketing webhooks.
- **Memory / RAG:** Historical series DB; robots.txt cache.
- **Data sources:** Competitor sites, marketplace APIs, partner feeds.

---

### 4. Data Flow

1. **Input:** Tick per `(sku, source)` with jitter.
2. **Processing:** Fetch → parse → normalize currency/units.
3. **Tool usage:** Compare to previous point; evaluate alert rules.
4. **Output:** Notifications + dashboard updates + audit record.

---

### 5. Agent Interaction (if applicable)

Not applicable for core monitoring. Optional **extractor-assist** agent stays offline in CI with human merge.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard fetchers by domain; isolate noisy tenants.
- **Caching:** ETag-aware fetches; CDN for static assets if applicable.
- **Async processing:** Heavy HTML parsing off hot path; backpressure via queue depth metrics.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on 429/5xx; rotate proxies only where contractually allowed.
- **Fallbacks:** Switch to API source if HTML extractor fails canary tests.
- **Validation:** Reject absurd jumps without corroboration (data quality gates).

---

### 8. Observability

- **Logging:** Structured events with `extractor_version`, `http_status`.
- **Tracing:** Trace fetch→parse→alert for stuck SKUs.
- **Metrics:** Freshness SLO, parse success ratio, alert precision estimates from sampling.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Competitive Price Monitoring System**:

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
