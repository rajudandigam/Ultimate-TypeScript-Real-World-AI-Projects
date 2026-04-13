### 1. System Overview

**PR hook** fetches OpenAPI artifacts at **head** and **base** references. **Parser toolchain** emits normalized IR + Spectral results. **API Design Agent** queries **style guide** retrieval and emits **structured findings** with severities. **Publisher** posts inline comments and sets GitHub Check conclusion.

---

### 2. Architecture Diagram (text-based)

```
PR → fetch specs → parsers + diff engine
        ↓
API Design Agent → style guide RAG
        ↓
Findings JSON → GitHub Checks + review comments
```

---

### 3. Core Components

- **UI / API Layer:** GitHub App, optional web console for exception requests.
- **LLM layer:** Tool-using agent or single-pass structured output after tool stage.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Git provider APIs, Spectral, OpenAPI diff, semver policy config.
- **Memory / RAG:** Guideline chunks + exception registry.
- **Data sources:** `openapi.yaml`, prior release bundles, ADRs.

---

### 4. Data Flow

1. **Input:** Detect changed paths under `specs/`; load relevant files only.
2. **Processing:** Parse → lint → diff vs previous release artifact from tag.
3. **Tool usage:** Retrieve guideline snippets for failing rules; map to suggested fixes.
4. **Output:** Annotated findings with stable `rule_id` codes for analytics.

---

### 5. Agent Interaction (if applicable)

Single agent; machine diagnostics are source of truth for existence claims.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless workers; shard giant monorepos by service folder.
- **Caching:** Parse results keyed by file SHA; reuse across duplicate CI events.
- **Async processing:** Large specs analyzed in background with pending check state.

---

### 7. Failure Handling

- **Retries:** Git fetch retries; do not duplicate comments—upsert by rule+path key.
- **Fallbacks:** If LLM unavailable, post deterministic lint output only.
- **Validation:** YAML parse gates before any LLM call to save cost and confusion.

---

### 8. Observability

- **Logging:** Rule hit counts, severities, model version, spec size metrics.
- **Tracing:** PR webhook → parse → diff → LLM spans.
- **Metrics:** False positive rate from human dismiss events, time saved estimates from labels.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **API Design Validator**:

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
