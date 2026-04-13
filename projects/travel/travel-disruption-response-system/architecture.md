### 1. System Overview

Disruption signals enter an **ingestion service** normalized to **incident records**. A **workflow engine** owns lifecycle: triage → propose → approve → execute → notify. **Detector**, **Rebooking**, and **Compensation** agents propose structured artifacts; a **policy service** and **human approval queue** gate side effects. **Executor** applies GDS/OTA commands with receipts.

---

### 2. Architecture Diagram (text-based)

```
Feeds / webhooks / polling
        ↓
   Incident normalizer → Postgres
        ↓
   Disruption workflow (Temporal/Inngest)
        ↓
   Supervisor dispatch
   ↙        ↓        ↘
Detector  Rebooker  Compensation
        ↓
   Approvals + policy checks
        ↓
   Executor → carrier/OTA APIs
        ↓
   CRM + notifications
```

---

### 3. Core Components

- **UI / API Layer:** Ops console, traveler status page, approval inbox.
- **LLM layer:** Multi-agent proposals over structured trip state.
- **Agents (if any):** Detector, rebooking optimizer, compensation/case agent.
- **Tools / Integrations:** Schedules, availability, ticketing, payments, messaging.
- **Memory / RAG:** Policy snippets and anonymized case patterns.
- **Data sources:** PNR snapshots, carrier messages, hotel channel manager events.

---

### 4. Data Flow

1. **Input:** Ingest raw change events; correlate to active bookings and travelers.
2. **Processing:** Detector classifies impact; rebooker searches constrained alternatives; compensation drafts eligible actions from rules.
3. **Tool usage:** Read-heavy first; writes only after approval tokens and idempotency keys.
4. **Output:** Update booking records, send comms, open/close support cases with audit trail.

---

### 5. Agent Interaction (if applicable)

A **supervisor** (workflow + optional LLM summarizer) merges agent outputs, resolves conflicts (e.g., cheapest vs policy-compliant), and enforces **stop** conditions (budget, blackout routes, VIP overrides).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard incident workers by tenant or region; isolate hot carriers during mass cancellations.
- **Caching:** Short-lived availability snapshots with explicit staleness timestamps.
- **Async processing:** Heavy multi-leg searches and batch notifications off the hot path.

---

### 7. Failure Handling

- **Retries:** API retries with jitter; never double-ticket—use idempotency keys and confirm-before-finalize.
- **Fallbacks:** Degrade to “human required” with prefilled context when automation confidence is low.
- **Validation:** Schema validation on all itinerary patches; fare basis and ticket number cross-checks.

---

### 8. Observability

- **Logging:** Incident state transitions, tool outcomes, approval decisions (metadata-first).
- **Tracing:** Trace `incident_id` across agents and executor.
- **Metrics:** Time-to-first-touch, auto-resolution rate, rebooking success rate, compensation error rate, API quota usage.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Travel Disruption Response System**:

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
