### 1. System Overview

Each payment request hits a **router service** that loads **constraints** (contracts, PCI routing rules, prohibited flows) and **scores** from a **metrics aggregator** (Redis/ClickHouse). A **deterministic selector** picks PSP A/B/C. Optional **routing agent** runs offline or in **shadow** to explain decisions or propose weight tweaks reviewed by humans.

---

### 2. Architecture Diagram (text-based)

```
Payment API
        ↓
   Router (constraints + scores)
        ↓
   Selected PSP adapter
        ↓
   Auth / capture / refund flows
        ↓
   Routing log (immutable) → analytics
```

*(Optional)* `Explain agent` reads log JSON for dashboards—not in the synchronous payment thread by default.

---

### 3. Core Components

- **UI / API Layer:** Merchant settings, canary controls, incident banners.
- **LLM layer:** Optional explanation / tuning copilot off hot path.
- **Agents (if any):** Single optional agent for ops tooling.
- **Tools / Integrations:** PSP APIs, billing for fees, feature flags.
- **Memory / RAG:** Runbooks; contract snippets for support tooling.
- **Data sources:** Decline codes, latency probes, settlement reports.

---

### 4. Data Flow

1. **Input:** Normalize payment attempt metadata; enrich with BIN country and risk tags.
2. **Processing:** Compute scores; apply constraints; break ties deterministically with explicit ordering.
3. **Tool usage:** (Async) fetch updated fee tables or incident notes for ops dashboards.
4. **Output:** Route decision attached to downstream PSP call; log outcome for feedback loop.

---

### 5. Agent Interaction (if applicable)

Not on critical path by default. If multi-agent is added later, use a **supervisor** that only proposes **weight deltas** for human approval and simulation.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless router replicas; local in-memory caches with TTL; regional deployment for latency.
- **Caching:** Hot scorecards per `(merchant, segment)`; invalidate on incident flags.
- **Async processing:** Aggregation jobs compute rolling auth rates continuously.

---

### 7. Failure Handling

- **Retries:** PSP call retries with idempotency keys; circuit open routes to backup PSP automatically within constraints.
- **Fallbacks:** Safe default PSP list when metrics unavailable (preconfigured).
- **Validation:** Reject routes that violate MCC bans or cross-border rules before submit.

---

### 8. Observability

- **Logging:** Route code, PSP response times, decline codes (tokenized PAN never logged).
- **Tracing:** Trace `payment_intent_id` across router and PSP spans.
- **Metrics:** Auth rate uplift canaries, failover counts, constraint violation attempts (should be zero), cost per successful txn by route.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Intelligent Payment Routing Agent**:

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
