### 1. System Overview

**Planning BFF** accepts goals and constraints. **Strategy Agent** queries **keyword**, **crawl**, and **roadmap** tools. **Validator** checks cannibalization and policy flags. **Export adapters** write to PM/CMS systems and store versioned plans in **Postgres**.

---

### 2. Architecture Diagram (text-based)

```
Goals → Strategy Agent → SEO/roadmap tools
        ↓
Calendar JSON → lint → Notion/Jira/CSV
```

---

### 3. Core Components

- **UI / API Layer:** Calendar editor, diff vs prior quarter, approvals.
- **LLM layer:** Tool-using agent with structured calendar schema.
- **Agents (if any):** Single agent baseline.
- **Tools / Integrations:** GSC, keyword vendors, sitemap fetcher, roadmap API.
- **Memory / RAG:** Brand + SEO playbook index; performance-weighted topic memory.
- **Data sources:** Analytics aggregates, backlog epics, competitor SERP captures (ToS).

---

### 4. Data Flow

1. **Input:** Quarter, regions, capacity, KPI weights.
2. **Processing:** Cluster keywords; map to pillars; attach owners and CTAs.
3. **Tool usage:** Validate URLs not conflicting; attach KD/volume snapshots to items.
4. **Output:** Persist `plan_vN`; notify stakeholders.

---

### 5. Agent Interaction (if applicable)

Single agent per planning session; human publishes schedule of record.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async plan generation for large portfolios; cache vendor responses.
- **Caching:** Keyword metrics by `(locale, seed)` key TTL daily.
- **Async processing:** SERP capture jobs decoupled from interactive planning.

---

### 7. Failure Handling

- **Retries:** Vendor API backoff; degrade to last cached metrics with staleness tag.
- **Fallbacks:** If LLM down, export keyword table + empty outlines for humans.
- **Validation:** Reject items missing owners or dates when required fields enforced.

---

### 8. Observability

- **Logging:** Tool error taxonomy, rows planned, export outcomes.
- **Tracing:** Plan generation latency breakdown.
- **Metrics:** Organic traffic delta by cluster, rework rate, API cost per plan.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Content Marketing Strategy Agent**:

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
