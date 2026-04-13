### 1. System Overview

A **supervisor workflow** owns the **offer graph** (flights, hotels, fees, timestamps). **Flight**, **hotel**, and **pricing** agents publish **proposals** as versioned patches. A **validator** enforces hard rules before any **purchase** activity executes through a tightly scoped **executor** service.

---

### 2. Architecture Diagram (text-based)

```
User / API
        ↓
   Booking Supervisor (Temporal)
     ↙      ↓      ↘
Flight     Hotel    Pricing
optimizer  recommender analyzer
     ↘      ↓      ↙
   Supplier tool adapters
        ↓
   Merge + validate + human gate (optional)
        ↓
   Book / hold tools → confirmation artifacts
```

---

### 3. Core Components

- **UI / API Layer:** Bundle explorer, approval for non-refundable paths, admin partner configs.
- **LLM layer:** Specialist agents + supervisor narration/merge assistance.
- **Agents (if any):** Flight optimizer, hotel recommender, pricing analyzer.
- **Tools / Integrations:** Air/hotel APIs, tax/fee services, fraud checks, payment orchestration (policy-gated).
- **Memory / RAG:** Partner rule retrieval; historical fare snapshots.
- **Data sources:** Live supplier payloads, loyalty constraints, corporate policy packs.

---

### 4. Data Flow

1. **Input:** Validate trip request and risk tier; initialize empty offer graph.
2. **Processing:** Run specialists in parallel within deadlines; collect proposals with `expires_at`.
3. **Tool usage:** Supervisor validates merges; pricing analyzer attaches fare snapshot references.
4. **Output:** Persist chosen bundle; route to hold/book; emit receipt artifacts and audit trail.

---

### 5. Agent Interaction (if applicable)

**Roles:** Flight focuses on itinerary feasibility; hotel on nightly geography fit; pricing on total landed cost and volatility. **Communication:** via supervisor state keys, not peer-to-peer. **Orchestration:** merge queue serializes graph writes; max revision rounds.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition supervisor runs by tenant; isolate supplier tool pools; cache geocodes.
- **Caching:** Short-lived price snapshots with TTL; invalidate on search parameter change.
- **Async processing:** Long searches async with client polling or streaming status.

---

### 7. Failure Handling

- **Retries:** Supplier retries with jitter; never double-book without idempotency keys.
- **Fallbacks:** Partial bundles with explicit missing legs; human handoff for edge cases.
- **Validation:** Hard checks on dates, passenger counts, refundability flags after merge.

---

### 8. Observability

- **Logging:** Proposal ids, supplier error codes, merge decisions; redact PII.
- **Tracing:** Trace each specialist and tool call with `booking_run_id`.
- **Metrics:** Conversion funnel, hold expiration rate, fraud block rate, supplier latency heatmaps.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Agent Travel Booking Optimizer**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
