### 1. System Overview

**Campaign service** stores briefs and asset references. **Social Agent** generates **per-platform drafts**. **Lint pipeline** runs brand, legal, and link checks. **Scheduler workflow** publishes or queues based on policy and quiet hours.

---

### 2. Architecture Diagram (text-based)

```
Brief → Social Agent → DAM/UTM tools
        ↓
Lint → approval (optional) → scheduler → social APIs
```

---

### 3. Core Components

- **UI / API Layer:** Calendar, preview, approvals, emergency pause.
- **LLM layer:** Structured multi-post generation.
- **Agents (if any):** Single agent per generation batch.
- **Tools / Integrations:** LinkedIn/X/Meta/TikTok APIs as enabled, link shortener, analytics import.
- **Memory / RDB:** Post versions, schedules, blackout dates, performance aggregates.
- **Data sources:** Brand guidelines, campaign docs, DAM metadata.

---

### 4. Data Flow

1. **Input:** Select week + channels + CTA parameters.
2. **Processing:** Generate posts; attach media asset ids validated against DAM.
3. **Tool usage:** Lint; if fail, return actionable errors to agent within retry budget.
4. **Output:** Persist drafts or call scheduler create with idempotency keys.

---

### 5. Agent Interaction (if applicable)

Single agent; live publish requires role + feature flag.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; async generation jobs for many brands.
- **Caching:** Stable brand voice snippets; reuse across weeks with version pins.
- **Async processing:** Media transcoding in separate workers when needed.

---

### 7. Failure Handling

- **Retries:** API publish retries with dedupe keys; never double-post same slot.
- **Fallbacks:** Notify humans on repeated lint failure with partial drafts saved.
- **Validation:** Enforce max lengths and forbidden unicode tricks; sanitize HTML entities.

---

### 8. Observability

- **Logging:** Publish outcomes, API error codes, lint failure taxonomy.
- **Tracing:** Generate→lint→schedule spans.
- **Metrics:** Engagement per variant, approval turnaround, incident count for misposts (target ~0).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Social Media Content Automation Agent**:

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
