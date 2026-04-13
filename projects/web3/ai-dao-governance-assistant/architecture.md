### 1. System Overview

Clients request a briefing for `(chain_id, proposal_id)`. A **workflow** fetches chain state and optional simulations, stores **normalized facts** in Postgres, and optionally pulls forum threads into an **object store** + **search index**. The **governance agent** queries tools and emits a **structured briefing document** versioned per proposal update.

---

### 2. Architecture Diagram (text-based)

```
User / delegate UI
        ↓
   Governance API
        ↓
   Fact fetch workflow (RPC + explorer)
        ↓
   Forum ingest (optional) → index
        ↓
   Governance Agent (tools: decode, balances, search)
        ↓
   Briefing store + notifications
```

---

### 3. Core Components

- **UI / API Layer:** Proposal browser, preferences, feedback on factual errors.
- **LLM layer:** Briefing agent with citation requirements.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** RPC providers, simulation APIs, forum APIs.
- **Memory / RAG:** User preferences and saved briefings.
- **Data sources:** Chain, forums, official docs mirrors (licensed).

---

### 4. Data Flow

1. **Input:** User selects proposal; system resolves latest on-chain version.
2. **Processing:** Decode calldata; fetch relevant events; retrieve top forum chunks by embedding similarity.
3. **Tool usage:** Agent fills a structured schema: actors, assets moved, risks, unknowns.
4. **Output:** Render briefing; log provenance links; allow user corrections to improve future prompts (governed).

---

### 5. Agent Interaction (if applicable)

Single agent. Optional second non-interactive pass for **consistency checks** against a rubric JSON.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; separate indexer workers for forum volume.
- **Caching:** Proposal fact snapshots keyed by block height; TTL-based refresh near deadlines.
- **Async processing:** Heavy simulation runs async with notifications.

---

### 7. Failure Handling

- **Retries:** RPC provider rotation; partial briefings labeled incomplete.
- **Fallbacks:** Skip forum if unavailable; show chain-only mode banner.
- **Validation:** Schema validation; reject briefings missing “unknowns” when simulations fail.

---

### 8. Observability

- **Logging:** Tool latency, provider errors, user factual flags.
- **Tracing:** Trace `proposal_id` through fetch and agent phases.
- **Metrics:** Briefing adoption, correction rate, source coverage, RPC error taxonomy.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI DAO Governance Assistant**:

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
