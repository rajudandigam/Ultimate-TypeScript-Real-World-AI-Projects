### 1. System Overview

The travel planner uses a **canonical trip graph** maintained by a **planner agent** that merges structured proposals from **flights**, **hotels**, and **activities** specialists. Each specialist has **domain-scoped tools** (supplier and maps APIs). The runtime favors **explicit orchestration** and validation over open-ended multi-chat, with clear provenance on prices and availability.

---

### 2. Architecture Diagram (text-based)

```
User / API (structured trip request)
        ↓
   Planner Agent (merge + validate)
     ↙    ↓    ↘
Flights   Hotels   Activities
 Agent     Agent     Agent
     ↘    ↓    ↙
   Supplier + Maps tools
        ↓
   Trip graph store (versioned)
        ↓
   Itinerary artifact + UI / booking links
```

---

### 3. Core Components

- **UI / API Layer:** Structured request forms, diff view of plan revisions, approval for spend-sensitive steps.
- **LLM layer:** Planner + three specialists; structured patch operations between stages.
- **Agents (if any):** Planner, flights, hotels, activities agents with separate tool registries.
- **Tools / Integrations:** Flight/hotel APIs (as licensed), maps routing, calendar constraints.
- **Memory / RAG:** Historical preferences and trip notes; policy corpora for cancellation rules.
- **Data sources:** Live supplier responses, static geography references, user profile tables.

---

### 4. Data Flow

1. **Input:** Validate request schema; resolve user profile and hard constraints (budget, mobility).
2. **Processing:** Planner requests parallel proposals with deadlines; validates airport continuity and time windows.
3. **Tool usage:** Specialists call APIs; results normalized to proposal objects with `expiresAt` and `evidence` payloads.
4. **Output:** Merge into graph; run deterministic validators; render user-facing packet with staleness markers.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Planner owns global constraints; specialists propose patches within their domains. **Communication:** proposals submitted to supervisor state, not peer-to-peer negotiation. **Orchestration:** merge queue serializes writes; max revision rounds; explicit reject reasons for specialist retries.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API tier; queue proposal jobs per trip; cache geocodes and route matrices.
- **Caching:** Short TTL on price snapshots; fingerprint searches to avoid duplicate supplier calls.
- **Async processing:** Long-running searches stream partial results to UI.

---

### 7. Failure Handling

- **Retries:** Supplier retries with backoff; partial itinerary mode when one domain fails.
- **Fallbacks:** Human handoff with evidence bundle if automation cannot satisfy constraints.
- **Validation:** Hard checks on time geography, budget ledger, and policy flags after every merge.

---

### 8. Observability

- **Logging:** Proposal IDs, merge decisions, supplier error taxonomy (no secrets in logs).
- **Tracing:** Trace each agent and external API call with `trip_id`.
- **Metrics:** Proposal acceptance rate, supplier latency, cost per trip planned, user override reasons.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Travel Planner**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres + pgvector with ACL-aware retrieval + citation payloads.
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
