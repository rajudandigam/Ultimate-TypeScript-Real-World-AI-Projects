### 1. System Overview

The engine exposes a **Personalization API** used by search and itinerary services. It combines **feature extraction** from allowed events, **retrieval** over historical interactions, and an **LLM scoring** step that returns structured ranking adjustments. All writes to profiles go through **consent-aware** persistence with audit.

---

### 2. Architecture Diagram (text-based)

```
Client / Search BFF
        ↓
   Personalization API
        ↓
   Feature store + consent filter
        ↓
   Retrieval (past trips / lists / rules)
        ↓
   Personalization Agent (LLM + tools)
        ↓
   Ranker merge (deterministic + model deltas)
        ↓
   Ranked results + explain metadata → UI
```

---

### 3. Core Components

- **UI / API Layer:** Preference center, consent management, debug views for internal roles.
- **LLM layer:** Agent producing bounded ranking deltas and explanations.
- **Agents (if any):** Single personalization agent.
- **Tools / Integrations:** Booking DB read APIs, search service, analytics event bus.
- **Memory / RAG:** Vector + structured preference store with ACL.
- **Data sources:** First-party events only unless contractually allowed.

---

### 4. Data Flow

1. **Input:** Receive candidate list ids + user context + consent scope.
2. **Processing:** Fetch features and retrieval bundle; run agent with token budget; validate output schema.
3. **Tool usage:** Pull last trips, saved filters; never pull other users’ data without admin tooling and audit.
4. **Output:** Merge model deltas with baseline scores; return ranked ids + `why` metadata.

---

### 5. Agent Interaction (if applicable)

Single-agent default. Optional specialists only if policy requires separation of duties.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; cache hot profiles; shard feature store by user id.
- **Caching:** Short TTL for ranking explanations; invalidate on consent change events.
- **Async processing:** Heavy embedding updates offline from event streams.

---

### 7. Failure Handling

- **Retries:** Transient retrieval failures → degrade to rule baseline with banner.
- **Fallbacks:** Cold-start path for new users; explicit “insufficient data” UX.
- **Validation:** Reject outputs referencing unknown candidate ids; clamp score deltas.

---

### 8. Observability

- **Logging:** Preference version, retrieval query ids, model version; PII minimization.
- **Tracing:** Span per personalization call linked to search `trace_id`.
- **Metrics:** CTR on explanations shown, opt-out spikes, latency, cost per 1k sessions.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Trip Personalization Engine**:

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
