### 1. System Overview

**Campaign BFF** authenticates marketers and loads **brand packs**. **Sequence Agent** retrieves facts via tools and emits **ESP payload JSON**. **Lint service** enforces compliance and token safety. **Publisher** pushes drafts or live sends per policy.

---

### 2. Architecture Diagram (text-based)

```
Brief + segment → Sequence Agent → CRM/tools
        ↓
Lint + brand rules → ESP draft / review queue
```

---

### 3. Core Components

- **UI / API Layer:** Editor, approval flow, experiment assignment.
- **LLM layer:** Tool-using agent with structured sequence schema.
- **Agents (if any):** Single agent default.
- **Tools / Integrations:** CRM, warehouse, ESP, link shortener (allowlisted).
- **Memory / RAG:** Case study and messaging library index.
- **Data sources:** Product docs, persona sheets, prior campaign performance.

---

### 4. Data Flow

1. **Input:** Validate segment and consent flags; freeze merge field schema.
2. **Processing:** Sample representative contacts for preview; generate master template + variants.
3. **Tool usage:** Validate URLs and claims against allowlist; fetch dynamic snippets per variant rules.
4. **Output:** Upload to ESP as draft; store version hash for rollback.

---

### 5. Agent Interaction (if applicable)

Single agent per campaign generation job.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers per large segment; dedupe identical prompts via content hashing.
- **Caching:** Embeddings for static docs; reuse across variants.
- **Async processing:** Bulk personalization fields resolved in ETL before LLM pass where possible.

---

### 7. Failure Handling

- **Retries:** ESP API backoff; partial upload recovery with reconcile job.
- **Fallbacks:** Static fallback template if lint repeatedly fails.
- **Validation:** HTML sanitizer; block external pixel injections not on allowlist.

---

### 8. Observability

- **Logging:** Lint failure taxonomy, model version, send suppressed reasons.
- **Tracing:** Generate→lint→publish spans.
- **Metrics:** Reply rate, complaint rate, time-to-approve, cost per 1k recipients.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Personalized Email Campaign Generator**:

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
