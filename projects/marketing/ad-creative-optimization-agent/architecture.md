### 1. System Overview

**Insights ETL** lands normalized **ad performance** tables. **Creative Agent** queries slices (placement, geo, audience) and retrieves **approved asset library** entries. **Lint + brand** services validate outputs. **Publisher** posts drafts to ad libraries or returns files for manual upload.

---

### 2. Architecture Diagram (text-based)

```
Ad APIs → warehouse → Creative Agent
        ↓
Brand lint → draft assets / library upload
        ↓
Experiment tracker
```

---

### 3. Core Components

- **UI / API Layer:** Briefing console, experiment planner, rights metadata UI.
- **LLM layer:** Multimodal model for copy + image briefs; structured JSON sidecar.
- **Agents (if any):** Single agent per campaign review session.
- **Tools / Integrations:** Meta/Google/TikTok APIs (as needed), DAM, landing fetcher.
- **Memory / RAG:** Winning creative corpus with embeddings + license tags.
- **Data sources:** Spend/click/impression exports, creative hashes, policy docs.

---

### 4. Data Flow

1. **Input:** Select account, date range, KPI (CPA, ROAS), creative cluster id.
2. **Processing:** Compute fatigue signals; fetch top historical analogs.
3. **Tool usage:** Generate variants; validate claims and trademarks against registry.
4. **Output:** Attach to experiment spec; notify creative lead for final sign-off.

---

### 5. Agent Interaction (if applicable)

Single agent; live spend changes remain human or separate automation with caps.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch jobs per ad account; cache heavy insight queries.
- **Caching:** Creative thumbnails and metric rollups per day.
- **Async processing:** Video storyboard generation in GPU workers when used.

---

### 7. Failure Handling

- **Retries:** API throttling with exponential backoff per vendor guidelines.
- **Fallbacks:** Text-only variants if image gen disabled by policy.
- **Validation:** Reject outputs referencing products not in catalog for that account.

---

### 8. Observability

- **Logging:** Variant ids, policy violations, API error classes.
- **Tracing:** Insight pull → generation → lint spans.
- **Metrics:** Experiment win rate, time-to-next iteration, CPA delta post-change.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Ad Creative Optimization Agent**:

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
