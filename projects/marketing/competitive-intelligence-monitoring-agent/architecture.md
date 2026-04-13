### 1. System Overview

**Poller workflows** fetch allowlisted URLs on schedules, store **content-addressed** snapshots, compute **diffs**. **CI Agent** consumes `ChangeEvent` records and proposes **battle card updates** with citations. **Review UI** approves outward-facing diffs; **publisher** syncs to Notion/Slack/Seismic.

---

### 2. Architecture Diagram (text-based)

```
Watchlist → fetch → snapshot store → diff engine
        ↓
CI Agent → battle card patch proposal
        ↓
Human review → enablement systems
```

---

### 3. Core Components

- **UI / API Layer:** Watchlist admin, legal flags, digest subscriptions.
- **LLM layer:** Summarization and implication drafting from structured diffs.
- **Agents (if any):** Single agent for v1 synthesis.
- **Tools / Integrations:** HTTP fetchers (policy-bound), OCR for PDF changelogs, licensed news APIs.
- **Memory / RAG:** Internal positioning and win/loss corpus.
- **Data sources:** Competitor sites, release feeds, filings, community forums (careful ToS).

---

### 4. Data Flow

1. **Input:** Poll tick with jitter; respect robots/terms.
2. **Processing:** Normalize text; compute diff vs last snapshot hash.
3. **Tool usage:** If meaningful change, retrieve related internal positioning chunks.
4. **Output:** Create `change_event` + draft card section; notify PMM queue.

---

### 5. Agent Interaction (if applicable)

Single agent; external claims require human sign-off tier configurable.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard pollers by domain; isolate noisy sites.
- **Caching:** ETag-aware fetches; skip unchanged bodies quickly.
- **Async processing:** Heavy HTML cleaning off hot path.

---

### 7. Failure Handling

- **Retries:** Backoff on 429/5xx; circuit breakers per domain.
- **Fallbacks:** Mark source `degraded` and continue others.
- **Validation:** Reject empty diffs caused by layout-only noise; tunable noise filters.

---

### 8. Observability

- **Logging:** HTTP status classes, bytes fetched, diff sizes, model versions.
- **Tracing:** Poll→diff→notify latency per source.
- **Metrics:** True positive change rate (human labels), alert noise, time-to-update card.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Competitive Intelligence Monitoring Agent**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres + pgvector with ACL-aware retrieval + citation payloads.
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
