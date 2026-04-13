### 1. System Overview

**Client or bot command** requests a **focus session**. **Focus Agent** validates policy, computes **end time**, and issues **tool calls** to integrations. **Watchdog workflow** ensures **restore** on completion, crash, or user panic button.

---

### 2. Architecture Diagram (text-based)

```
User intent → Focus Agent → integration tools
        ↓
Session record → watchdog timer → restore tools
```

---

### 3. Core Components

- **UI / API Layer:** Desktop helper, Slack slash command, mobile shortcut.
- **LLM layer:** Optional NL parser to structured `FocusSession` schema.
- **Agents (if any):** Single agent per session setup.
- **Tools / Integrations:** Slack/Teams, calendar, optional OS hooks via companion app.
- **Memory / RDB:** Session table with desired vs actual state machine.
- **Data sources:** Calendar busy data, on-call schedules (optional).

---

### 4. Data Flow

1. **Input:** Parse command; load user policy (allowlists, working hours).
2. **Processing:** Detect conflicts; ask user to confirm if partial apply needed.
3. **Tool usage:** Apply DND + optional calendar focus block; store previous state snapshot.
4. **Output:** Confirm to user; post optional team-visible status.

---

### 5. Agent Interaction (if applicable)

Single agent; restore is workflow-enforced, not best-effort LLM promise.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; per-user serialization to avoid conflicting toggles.
- **Caching:** Short TTL cache of integration tokens; refresh proactively.
- **Async processing:** Deferred notifications batching during focus (queue in outbox).

---

### 7. Failure Handling

- **Retries:** Transient API errors on apply; never lose restore snapshot.
- **Fallbacks:** If restore fails, escalate user notification and retry with backoff.
- **Validation:** Schema-validate NL output; deny impossible durations or illegal blocks.

---

### 8. Observability

- **Logging:** Session ids, integration error codes, restore success boolean.
- **Tracing:** Apply→active→restore spans.
- **Metrics:** Sessions per user/week, override rate, stuck-state incidents (should be ~0).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Focus Time Protection Agent**:

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
