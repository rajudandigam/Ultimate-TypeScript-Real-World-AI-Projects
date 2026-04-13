### 1. System Overview

Clients send **check-in events** to an ingestion API stored in **Postgres time-series tables**. A **coaching worker** periodically generates messages using an **agent** that reads aggregates via tools. Notifications are delivered through a **queue** with delivery receipts.

---

### 2. Architecture Diagram (text-based)

```
Mobile / Web client
        ↓
   Events API → Postgres
        ↓
   Coaching scheduler
        ↓
   Coaching Agent (tools: stats, reminders)
        ↓
   Policy + moderation gate
        ↓
   Push / email notifications
```

---

### 3. Core Components

- **UI / API Layer:** Check-in UX, goal editor, notification preferences.
- **LLM layer:** Coaching agent with structured message schema.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Push provider, email provider, optional wearables ingestion.
- **Memory / RAG:** Rolling summaries; optional encrypted journal retrieval.
- **Data sources:** First-party events, user goals, consent flags.

---

### 4. Data Flow

1. **Input:** Record event with `user_id`, `habit_id`, timestamp, optional context tags.
2. **Processing:** Aggregate windows; decide if coaching message should be generated (rate limits).
3. **Tool usage:** Pull stats; propose reminder time; validate against quiet hours policy.
4. **Output:** Deliver notification; store message id for feedback thumbs.

---

### 5. Agent Interaction (if applicable)

Single agent. Moderation can be a **deterministic ruleset + classifier** before send.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingestion by user shard; scale workers with queue depth.
- **Caching:** Precomputed weekly aggregates for fast reads.
- **Async processing:** All coaching generation async; never block check-in API.

---

### 7. Failure Handling

- **Retries:** Notification retries with exponential backoff; dead-letter after N tries.
- **Fallbacks:** Skip coaching generation if policy engine marks user in “quiet period.”
- **Validation:** Reject events with impossible timestamps; cap payload sizes.

---

### 8. Observability

- **Logging:** Generation reasons, policy decisions, delivery receipts (metadata).
- **Tracing:** Trace agent + provider sends with `user_id` baggage internally.
- **Metrics:** DAU/WAU, notification CTR, opt-out spikes, moderation blocks.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Habit Tracking + Coaching System**:

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
