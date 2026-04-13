### 1. System Overview

**Event pipeline** emits `cart.abandoned` facts. **Workflow** debounces and schedules **touch windows** respecting quiet hours. **Recovery Agent** builds a **validated message plan**. **ESP executor** sends with idempotency; **purchase listener** cancels pending touches.

---

### 2. Architecture Diagram (text-based)

```
Commerce events → workflow (debounce, quiet hours)
        ↓
Recovery Agent → tools: cart, promos, consent
        ↓
Validator → ESP executor → webhooks/telemetry
```

---

### 3. Core Components

- **UI / API Layer:** Marketer console, preview, experiment flags.
- **LLM layer:** Agent generating structured message plans.
- **Agents (if any):** Single agent in v1.
- **Tools / Integrations:** Cart APIs, promo service, consent registry, ESP.
- **Memory / RAG:** Brand voice snippet retrieval; touch history store.
- **Data sources:** CDP events, storefront webhooks.

---

### 4. Data Flow

1. **Input:** Abandonment signal with `cart_id`, locale, channel eligibility.
2. **Processing:** Agent loads cart lines + inventory + allowed promos.
3. **Tool usage:** Check consent and frequency caps before finalizing plan.
4. **Output:** ESP API call with template ids + dynamic fields + audit row.

---

### 5. Agent Interaction (if applicable)

Single agent. **Actual send** executed by trusted worker after schema validation.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by tenant; queue per ESP rate limits.
- **Caching:** Product metadata snapshots to reduce cart service chatter.
- **Async processing:** Bulk replays after ESP outages with dedupe keys.

---

### 7. Failure Handling

- **Retries:** ESP retry policies; never exceed frequency caps after success uncertainty—query ESP status first.
- **Fallbacks:** Static template if LLM validation fails twice.
- **Validation:** Block messages mentioning unavailable promos or OOS hero SKU.

---

### 8. Observability

- **Logging:** Plan ids, validation errors, suppression reasons (OOS, consent).
- **Tracing:** Event→plan→send latency.
- **Metrics:** Recovery rate, unsubscribes per thousand sends, LLM refusal rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Abandoned Cart Recovery Agent**:

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
