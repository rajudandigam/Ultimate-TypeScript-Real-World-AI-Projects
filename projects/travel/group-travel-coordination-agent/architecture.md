### 1. System Overview

Each **trip workspace** stores travelers, roles, budgets, and constraints. **Workflow** drives phases: collect prefs → propose options → vote → hold → pay → confirm. **Participant agents** read structured prefs; **scheduler** proposes feasible option sets; **booking sync** executes holds/commits via APIs. **Supervisor** merges outputs and enforces deadlines.

---

### 2. Architecture Diagram (text-based)

```
Trip workspace UI
        ↓
   Group coordination API
        ↓
   Phase workflow (Temporal/Inngest)
        ↓
   Supervisor
   ↙     ↓      ↘
Prefs   Scheduler  BookingSync
agents   agent       agent
        ↓
   Holds / bookings / payments
        ↓
   Notifications + audit log
```

---

### 3. Core Components

- **UI / API Layer:** Invites, polls, itinerary editor, payment status.
- **LLM layer:** Multi-agent reasoning with structured votes and constraints.
- **Agents (if any):** Per-traveler preference agents (often templated), scheduler, booking sync.
- **Tools / Integrations:** OTA/GDS or direct hotel APIs, payments, email/SMS.
- **Memory / RAG:** Trip state; optional KB for destination logistics.
- **Data sources:** User profiles, inventory feeds, payment processor events.

---

### 4. Data Flow

1. **Input:** Travelers submit structured constraints; optional free-text notes parsed into fields.
2. **Processing:** Scheduler generates candidate packages scoring group fit; vote round collects approvals.
3. **Tool usage:** Booking sync places holds then confirms after payment success webhook.
4. **Output:** Final artifacts + per-user cost allocation + calendar invites.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves ties (predeclared tie-breakers: leader veto, majority, or min-max fairness), caps negotiation rounds, and blocks proposals that violate hard constraints.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by `trip_id`; async heavy booking calls; rate-limit external APIs per partner.
- **Caching:** Short-lived availability snapshots keyed by search fingerprint.
- **Async processing:** Payment webhooks and post-booking tasks decoupled from chat path.

---

### 7. Failure Handling

- **Retries:** Booking API retries with idempotency keys; never double-charge—use payment intents state machine.
- **Fallbacks:** If automation fails, package context for human travel agent handoff.
- **Validation:** Validate vote quorums before any non-refundable purchase.

---

### 8. Observability

- **Logging:** Phase transitions, hold IDs, payment intents, agent proposals (structured).
- **Tracing:** Trace `trip_id` across workflow and external APIs.
- **Metrics:** Time-to-decision, hold expiry rate, payment failure rate, user drop-off by phase.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Group Travel Coordination Agent**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres for structured memory; add pgvector only when semantic retrieval is a first-class requirement.
- **Storage layer:** Postgres OLTP, object store (S3/GCS) for artifacts (PDFs, media, large diffs), Redis for ephemeral coordination.
- **Observability layer:** OpenTelemetry traces (LLM + tool spans), metrics on latency/error/cost, structured logs with run IDs.
- **Auth / policy layer:** RBAC + scoped API keys + audit logs on every tool invocation; MCP-style tool manifests if multiple clients consume the same backend.

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
