### 1. System Overview

A **supervisor service** owns the canonical **campaign document** (JSON + rendered views). The **strategist** proposes structure and hypotheses; the **copy generator** emits channel-specific text blocks referencing approved sources; the **performance analyzer** queries metrics and proposes edits as structured patches. The supervisor validates merges and enforces **publish gates**.

---

### 2. Architecture Diagram (text-based)

```
Marketer UI / API
        ↓
   Campaign Supervisor
     ↙        ↓        ↘
Strategist   Copy      Performance
 Agent       Agent      Analyzer Agent
     ↘        ↓        ↙
   Tools: CMS / lexicon / analytics / ESP drafts
        ↓
   Merge + compliance validation
        ↓
   Versioned campaign artifact → approvals → publish tools
```

---

### 3. Core Components

- **UI / API Layer:** Campaign workspace, approval queues, experiment assignment UI.
- **LLM layer:** Three role-specific agents plus optional summarizer for stakeholders.
- **Agents (if any):** Strategist, copy generator, performance analyzer.
- **Tools / Integrations:** Brand CMS, analytics warehouse, ESP/marketing automation APIs, ad platforms (optional).
- **Memory / RAG:** Past campaigns, legal snippets, product fact sheets with version pins.
- **Data sources:** CRM segments (hashed), performance reports, editorial calendars.

---

### 4. Data Flow

1. **Input:** Create campaign shell with objectives, markets, channels, and risk tier.
2. **Processing:** Strategist outputs outline + measurement plan; supervisor requests copy per channel in parallel where safe.
3. **Tool usage:** Analyzer fetches KPI snapshots; copy agent calls lexicon + fact retrieval; all outputs reference `source_id`s.
4. **Output:** Supervisor merges; validators run; human approval triggers draft publish jobs with audit bundle.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Strategist sets constraints; copy stays inside them; analyzer proposes changes grounded in numbers. **Communication:** via supervisor state keys (`outline`, `assets`, `metrics_snapshot`). **Orchestration:** merge queue serializes writes; max revision rounds; explicit reject reasons returned to agents.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async workers for long analytics pulls and generation batches.
- **Caching:** Cache analytics snapshots with TTL; cache static brand chunks aggressively.
- **Async processing:** Nightly refresh jobs for always-on campaigns.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; partial campaign save if one channel fails.
- **Fallbacks:** Revert to last approved version on publish failure; notify owners.
- **Validation:** Block publish if any claim lacks `source_id` or fails lexicon scan.

---

### 8. Observability

- **Logging:** Campaign version lineage, tool payloads (redacted), approval actor ids.
- **Tracing:** Trace each agent span under `campaign_id`.
- **Metrics:** Generation latency per channel, policy violation counts, post-publish KPI deltas tied to versions.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Agent Marketing Campaign System**:

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
